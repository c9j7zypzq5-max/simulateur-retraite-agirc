import { useState, useEffect } from "react";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection, Toggle,
  Chip, useAnimatedNumber, fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

// ─── Barème IR 2025 (applicable 2026) ─────────────────────────────────────────
const BAREME = [
  { min: 0,       max: 11_497,  taux: 0    },
  { min: 11_497,  max: 29_315,  taux: 0.11 },
  { min: 29_315,  max: 83_823,  taux: 0.30 },
  { min: 83_823,  max: 180_294, taux: 0.41 },
  { min: 180_294, max: Infinity, taux: 0.45 },
];

function calcParts(situation, nbEnfants) {
  const base = situation === "marie" ? 2 : 1;
  let partsEnfants = 0;
  for (let i = 1; i <= nbEnfants; i++) {
    partsEnfants += i <= 2 ? 0.5 : 1;
  }
  return base + partsEnfants;
}

function calcIR(revenuBrut, situation, nbEnfants) {
  // Abattement 10% sur salaires (min 495€, max 14 171€)
  const abattement = Math.min(Math.max(revenuBrut * 0.10, 495), 14_171);
  const revenuImposable = Math.max(0, revenuBrut - abattement);

  const nbParts = calcParts(situation, nbEnfants);
  const quotient = revenuImposable / nbParts;

  // IR sur quotient familial
  let irQuotient = 0;
  for (const tranche of BAREME) {
    if (quotient <= tranche.min) break;
    irQuotient += (Math.min(quotient, tranche.max) - tranche.min) * tranche.taux;
  }

  const irBrut = irQuotient * nbParts;

  // Décote (2025): IR < 1 929€ (célibataire) ou < 3 191€ (couple)
  const seuilDecote = situation === "marie" ? 3_191 : 1_929;
  const decoteMax = situation === "marie" ? 1_444 : 873;
  let decote = 0;
  if (irBrut < seuilDecote) {
    decote = Math.max(0, decoteMax - 0.4525 * irBrut);
  }

  const irNet = Math.max(0, irBrut - decote);

  // TMI (taux marginal d'imposition)
  let tmi = 0;
  for (const tranche of BAREME) {
    if (quotient > tranche.min) tmi = tranche.taux;
  }

  // Taux moyen
  const tauxMoyen = revenuImposable > 0 ? irNet / revenuImposable * 100 : 0;

  return {
    revenuImposable, nbParts, quotient, irBrut, decote, irNet, tmi, tauxMoyen, abattement
  };
}

const FAQ = [
  {
    q: "Quelle est la différence entre TMI et taux moyen ?",
    a: "La TMI (Taux Marginal d'Imposition) est le taux appliqué à votre dernier euro de revenu imposable. Le taux moyen est votre impôt total divisé par votre revenu imposable. Par exemple, avec un revenu imposable de 50 000 €, votre TMI pourrait être 30 % (tranche) mais votre taux moyen 15 % (car vous payez 0 % jusqu'à 11 497 €, puis 11 %, puis 30 %)."
  },
  {
    q: "Comment fonctionnent les parts fiscales ?",
    a: "Les parts fiscales permettent un traitement fiscal favorable selon votre situation. Un célibataire a 1 part, un couple marié 2 parts. Chaque enfant donne droit à +0,5 part pour les 2 premiers (soit 1 part pour 2 enfants), puis +1 part à partir du 3e. L'impôt s'applique sur un quotient (revenu/parts), puis on multiplie par le nombre de parts. Cela réduit l'impôt du couple et des familles nombreuses."
  },
  {
    q: "Qu'est-ce que la décote ?",
    a: "La décote est une réduction d'impôt pour les contribuables dont l'imposition reste faible. En 2025, elle s'applique si votre impôt brut est inférieur à 1 929 € (célibataire) ou 3 191 € (couple). Vous bénéficiez d'une décote égale à 873 € (ou 1 444 €) moins 45,25 % de votre IR brut. À partir d'un certain revenu, la décote disparaît progressivement."
  },
  {
    q: "Pourquoi y a-t-il un abattement sur les salaires ?",
    a: "L'abattement de 10 % représente une estimation des frais professionnels (frais de déplacement, vêtements, outils, etc.). Il s'applique automatiquement à tous les salaires. Le minimum garanti est 495 € et le maximum 14 171 € pour 2025. Si vous avez des frais réels supérieurs, vous pouvez opter pour la déclaration au réel."
  },
];

export default function ImpotRevenu() {
  const [theme, setTheme] = useTheme();

  const [revenuBrut, setRevenuBrut]       = useState(null);
  const [situation, setSituation]         = useState("celibataire");
  const [nbEnfants, setNbEnfants]         = useState(0);

  useEffect(() => {
    document.title = "Simulateur Impôt sur le Revenu 2025 — Calcul IR barème officiel";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Estimez votre impôt sur le revenu 2025 : barème progressif, quotient familial, décote, TMI et taux moyen d'imposition.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'impot-revenu' });
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'impot-revenu' })
    }).catch(() => {});
  }, []);

  const res = revenuBrut ? calcIR(revenuBrut, situation, nbEnfants) : null;
  const irNetAnim = useAnimatedNumber(res?.irNet || 0);

  const hasResult = res && res.irNet > 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="📋"
          badge="Impôts · Simulation 2025"
          title="Impôt sur le revenu"
          desc="Estimez votre impôt net, votre tranche marginale d'imposition (TMI) et votre taux moyen selon votre situation familiale."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Barème 2025 à jour", "✓ Décote incluse", "✓ Calcul 100 % local"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)", marginBottom: 0 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>

          <NumInput
            id="revenu-brut"
            label="Revenus annuels bruts"
            value={revenuBrut}
            onChange={setRevenuBrut}
            unit="€/an"
            min={0}
            max={1_000_000}
            hint={revenuBrut ? `Abattement 10 % : ${fmtEur(Math.min(Math.max(revenuBrut * 0.10, 495), 14_171))}` : "Salaire, pension, revenus d'activité, etc."}
          />

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              Situation familiale
            </label>
            <Toggle
              options={["Célibataire", "Marié·e / Pacsé·e"]}
              checked={situation === "marie"}
              onChange={checked => setSituation(checked ? "marie" : "celibataire")}
            />
          </div>

          <StepperInput
            label="Nombre d'enfants"
            value={nbEnfants}
            onChange={setNbEnfants}
            min={0}
            max={8}
            step={1}
            hint={nbEnfants > 0 ? `Parts fiscales enfants : ${nbEnfants <= 2 ? nbEnfants * 0.5 : 1 + (nbEnfants - 2)}` : "Parts fiscales supplémentaires accordées"}
          />

          {/* Barre récapitulative */}
          {res && (
            <div style={{ background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.15)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap", marginTop: 4 }}>
              {[
                { l: "Revenu imposable", v: fmtEur(res.revenuImposable), gold: true },
                { l: "Parts fiscales", v: res.nbParts.toFixed(1) },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: item.gold ? "var(--gold)" : "var(--text)" }}>{item.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Résultats */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre impôt estimé</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Impôt net annuel</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  aria-label={`${Math.round(res.irNet)} euros d'impôt annuel`}>
                  {irNetAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  soit <strong>{fmtEur(res.irNet / 12)}/mois</strong> d'impôt
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="TMI" value={`${(res.tmi * 100).toFixed(0)} %`} accent />
                <Chip label="Taux moyen" value={`${res.tauxMoyen.toFixed(1)} %`} />
                <Chip label="Revenu imposable" value={fmtEur(res.revenuImposable)} />
                <Chip label="Parts fiscales" value={res.nbParts.toFixed(1)} />
              </div>

              {/* Détails des tranches */}
              <AccordionSection title="Détail des tranches" subtitle="Calcul par tranche progressive">
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Quotient familial (revenus imposables / parts)</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{fmtEur(res.quotient)}</div>
                  </div>

                  <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12, color: "var(--text-secondary)" }}>IR brut par tranche</div>
                    {BAREME.map((tranche, i) => {
                      const revInTranche = Math.max(0, Math.min(res.quotient, tranche.max) - tranche.min);
                      const impotTranche = revInTranche * tranche.taux;
                      return (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                          <span>{fmtEur(tranche.min)} à {tranche.max === Infinity ? "∞" : fmtEur(tranche.max)} ({(tranche.taux * 100).toFixed(0)} %)</span>
                          <span style={{ fontWeight: 600 }}>{fmtEur(impotTranche)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Abattement</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{fmtEur(res.abattement)}</div>
                    </div>
                    <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Décote</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: res.decote > 0 ? "#4ade80" : "var(--text)" }}>
                        {res.decote > 0 ? "−" + fmtEur(res.decote) : "—"}
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-secondary)" }}>
                    <div style={{ marginBottom: 6 }}>IR brut = (IR quotient × {res.nbParts.toFixed(1)} parts) = {fmtEur(res.irBrut)}</div>
                    <div>IR net = {fmtEur(res.irBrut)} − décote {fmtEur(res.decote)} = <strong style={{ color: "var(--text)" }}>{fmtEur(res.irNet)}</strong></div>
                  </div>
                </div>
              </AccordionSection>

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Calcul simplifié</strong>. Ce simulateur ne tient pas compte des crédits et réductions d'impôt, revenus fonciers, plus-values, cotisations Madelin, heures supplémentaires exonérées, etc. Pour un calcul exact : <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>impots.gouv.fr</a> ou consultant un expert.
              </div>
            </>
          )}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — IR</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Source officielle : <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>impots.gouv.fr</a>
          </p>
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <Footer />
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "18px 0", textAlign: "left" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{q}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 18, color: open ? "var(--gold)" : "var(--text-secondary)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && <p style={{ paddingBottom: 18, paddingRight: 32, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{a}</p>}
    </div>
  );
}
