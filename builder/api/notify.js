// Notification email de lead — appelé par le trigger pg_net
// builder_submissions_email (migration 0010) avec { submission_id } à chaque
// nouvelle soumission d'un calculateur dont notify_email est actif.
//
// Modèle de confiance : l'appel entrant n'est PAS authentifié (pg_net ne
// signe pas), mais il ne porte qu'un UUID impossible à deviner (les ids de
// soumissions ne sont lisibles que par leur propriétaire via RLS). Tout le
// reste est relu en base via la service role, et la revendication atomique de
// notified_at (PATCH conditionné à « is null ») garantit qu'un même id ne
// produit jamais deux emails, même appelé en rafale.
//
// Fail-soft : sans RESEND_API_KEY / SUPABASE_SERVICE_ROLE_KEY, répond 200
// « not configured » sans rien marquer (mêmes conventions que api/stripe.js).

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.NOTIFY_FROM_EMAIL || 'Simfinly Builder <notifications@simfinly.com>';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(s) {
  return typeof s === 'string' && UUID_RE.test(s);
}

// Échappement HTML (le titre du calculateur est saisi par l'utilisateur —
// même exigence que api/meta.js).
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Corps de l'email (fr — le builder est francophone). On ne recopie PAS le
// payload de la simulation : l'email reste minimal, le détail se consulte
// dans l'app (pas de PII au-delà de l'email du visiteur dans les boîtes mail).
export function buildEmail(calculatorTitle, visitorEmail, createdAt) {
  const title = esc(calculatorTitle || 'votre simulateur');
  const who = visitorEmail ? `<strong>${esc(visitorEmail)}</strong>` : 'Un visiteur (sans email)';
  const date = new Date(createdAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  return {
    subject: visitorEmail
      ? `Nouveau contact sur « ${calculatorTitle || 'votre simulateur'} »`
      : `Nouvelle simulation sur « ${calculatorTitle || 'votre simulateur'} »`,
    html: [
      '<div style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#0F1828">',
      `<p>${who} vient d'utiliser votre simulateur <strong>« ${title} »</strong> (${esc(date)}).</p>`,
      '<p><a href="https://app.simfinly.com/submissions" style="color:#2B5CE6">Voir le détail de la soumission →</a></p>',
      '<p style="color:#6b7280;font-size:12px">Vous recevez cet email car les notifications sont activées pour ce calculateur (onglet Options de l\'éditeur).</p>',
      '</div>',
    ].join('\n'),
  };
}

async function rest(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${path} → ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!SUPABASE_URL || !SERVICE_KEY || !RESEND_API_KEY) {
    // Pas de claim de notified_at ici : une fois configuré, seules les
    // soumissions futures notifient (pas de rattrapage, pg_net ne rejoue pas).
    res.status(200).json({ skipped: 'not configured' });
    return;
  }

  const id = req.body?.submission_id;
  if (!isUuid(id)) {
    res.status(400).json({ error: 'submission_id invalide' });
    return;
  }

  try {
    // Revendication atomique : ne renvoie une ligne que si notified_at était
    // encore null — un second appel avec le même id tombe sur un tableau vide.
    const claimed = await rest(
      `builder_submissions?id=eq.${id}&notified_at=is.null&select=id,email,created_at,calculator_id`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ notified_at: new Date().toISOString() }),
      },
    );
    const submission = claimed[0];
    if (!submission) {
      res.status(200).json({ skipped: 'déjà notifiée ou inexistante' });
      return;
    }

    const [calc] = await rest(
      `builder_calculators?id=eq.${submission.calculator_id}&select=title,notify_email,workspace_id`,
    );
    if (!calc?.notify_email) {
      res.status(200).json({ skipped: 'notifications désactivées' });
      return;
    }

    const [workspace] = await rest(`builder_workspaces?id=eq.${calc.workspace_id}&select=owner`);
    if (!workspace) throw new Error('workspace introuvable');

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${workspace.owner}`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    if (!userRes.ok) throw new Error(`auth admin → ${userRes.status}`);
    const owner = await userRes.json();
    if (!owner?.email) throw new Error('email propriétaire introuvable');

    const { subject, html } = buildEmail(calc.title, submission.email, submission.created_at);
    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [owner.email], subject, html }),
    });
    if (!sendRes.ok) throw new Error(`Resend → ${sendRes.status}`);

    res.status(200).json({ sent: true });
  } catch (e) {
    // pg_net est fire-and-forget : personne ne lit cette réponse, le 500 sert
    // uniquement aux logs Vercel.
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
}
