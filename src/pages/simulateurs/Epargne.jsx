import { useState, useEffect } from "react";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

// ─── Logique de calcul intérêts composés ──────────────────────────────────────
function calcEpargne({ capitalInitial, versement, tauxAnnuel, duree }) {
  if (!duree || duree <= 0 || (capitalInitial === null && versement === null)) {
    return {
      capitalFinal: 0,
      totalVerse: 0,
      totalInterets: 0,
      multiplicateur: 0,
      yearlyData: [],
    };
  }

  const cap = capitalInitial ?? 0;
  const vers = versement ?? 0;
  const r = tauxAnnuel / 100 / 12;
  const n = duree * 12;

  let capitalFinal;
  if (Math.abs(r) < 1e-10) {
    capitalFinal = cap + vers * n;
  } else {
    const factor = Math.pow(1 + r, n);
    capitalFinal = cap * factor + vers * ((factor - 1) / r);
  }

  const totalVerse = cap + vers * n;
  const totalInterets = Math.max(0, capitalFinal - totalVerse);
  const multiplicateur = totalVerse > 0 ? capitalFinal / totalVerse : 1;

  // Données annuelles
  const yearlyData = [];
  for (let year = 1; year <= duree; year++) {
    const monthsElapsed = year * 12;
    let yearCap;
    if (Math.abs(r) < 1e-10) {
      yearCap = cap + vers * monthsElapsed;
    } else {
      const f = Math.pow(1 + r, monthsElapsed);
      yearCap = cap * f + vers * ((f - 1) / r);
    }
    const versementsCum = cap + vers * monthsElapsed;
    const interstsCum = Math.max(0, yearCap - versementsCum);
    yearlyData.push({
      annee: year,
      capital: yearCap,
      versementsCum,
      interstsCum,
    });
  }

  return {
    capitalFinal,
    totalVerse,
    totalInterets,
    multiplicateur,
    yearlyData,
  };
}

const FAQ = [
  { q: "Comment fonctionnent les intérêts composés ?", a: "Les intérêts composés signifient que vous gagnez des intérêts sur vos intérêts. Chaque mois, le taux est appliqué à votre capital cumulé (capital initial + versements + intérêts antérieurs). Plus la durée est longue, plus cette composition joue en votre faveur (effet boule de neige)." },
  { q: "Quel taux de rendement supposer ?", a: "Cela dépend de votre placement : comptes épargne (0,5-1,5 %), fonds euros en assurance-vie (2-3 %), obligataires (3-5 %), actions/bourse (5-10 % en moyenne historique). Consultez votre conseiller pour un taux adapté à votre profil." },
  { q: "Quelle est la différence entre capital final et total versé ?", a: "Le total versé est la somme de votre capital initial et de tous vos versements mensuels. Le capital final ajoute les intérêts générés par votre épargne. La différence entre les deux est votre gain en intérêts." },
  { q: "Comment maximiser ses intérêts composés ?", a: "Commencez tôt (plus de temps = plus de composition), versez régulièrement (les versements mensuels bénéficient aussi de la composition), augmentez vos versements progressivement, et choisissez des placements avec un bon rendement adapté à votre risque toléré." },
];

export default function Epargne() {
  const [theme, setTheme] = useTheme();

  const [capitalInitial, setCapitalInitial]   = useState(null);
  const [versement, setVersement]             = useState(null);
  const [tauxAnnuel, setTauxAnnuel]           = useState(5);
  const [duree, setDuree]                     = useState(20);

  useEffect(() => {
    document.title = "Simulateur Épargne 2025 — Intérêts composés et capital final";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Simulez la croissance de votre épargne avec les intérêts composés : capital final, intérêts générés, tableau annuel.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'epargne' });
    if (!sessionStorage.getItem('tracked_epargne')) {
      sessionStorage.setItem('tracked_epargne', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'epargne' })
      }).catch(() => {});
    }
  }, []);

  const res = calcEpargne({ capitalInitial, versement, tauxAnnuel, duree });
  const capitalFinalAnim = useAnimatedNumber(res.capitalFinal);

  const hasResult = duree > 0 && ((capitalInitial ?? 0) > 0 || (versement ?? 0) > 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="💰"
          badge="Finances · Simulation 2026"
          title="Épargne & intérêts composés"
          desc="Projetez la croissance de votre épargne sur le long terme grâce à la puissance des intérêts composés et des versements réguliers."
        />

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 32px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Paramètres</h2>

          <NumInput id="capital-initial" label="Capital initial" value={capitalInitial} onChange={setCapitalInitial} unit="€" min={0} max={1000000}
            hint={capitalInitial ? "Montant de départ (peut être 0)" : "Votre épargne actuelle"}
          />

          <NumInput id="versement" label="Versement mensuel" value={versement} onChange={setVersement} unit="€/mois" min={0} max={100000}
            hint={versement ? `Annualisé : ${fmtEur(versement * 12)}/an` : "Apport régulier chaque mois"}
          />

          <StepperInput
            label="Taux de rendement annuel"
            value={tauxAnnuel} onChange={setTauxAnnuel} min={0} max={20} step={0.1} unit="%"
            hint="Taux nominal constant supposé (non réinvestis manquants)"
            tooltip="Exemples : 1 % (compte courant), 3 % (assurance-vie fonds euros), 6 % (obligations/actions moyennes)"
          />

          <StepperInput
            label="Durée de l'épargne"
            value={duree} onChange={setDuree} min={1} max={40} step={1} unit=" ans"
            hint={`${duree * 12} mois d'épargne`}
          />
        </div>

        {/* Résultats */}
        {hasResult && (
          <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Projection de votre épargne</h2>

            {/* Capital final */}
            <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Capital final estimé</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {capitalFinalAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                après {duree} {duree > 1 ? "années" : "année"} à {tauxAnnuel} % annuels
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
              <Chip label="Total versé" value={fmtEur(res.totalVerse)} />
              <Chip label="Intérêts générés" value={fmtEur(Math.round(res.totalInterets * 100) / 100)} accent />
              <Chip label="Multiplicateur" value={`×${res.multiplicateur.toFixed(2)}`} small />
              <Chip label="Gain %" value={`+${((res.multiplicateur - 1) * 100).toFixed(1)} %`} accent small />
            </div>

            {/* Barre de composition */}
            <ProgressBar
              label="Composition : capital + intérêts"
              value={res.totalInterets}
              total={res.capitalFinal}
              color="linear-gradient(90deg,rgba(184,147,74,0.5),rgba(184,147,74,0.2))"
            />

            <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
              ⚠️ <strong>Simulation indicative.</strong> Les performances passées ne préjugent pas des performances futures. Taux de rendement constant supposé. Résultats avant fiscalité et inflation.
            </div>
          </div>
        )}

        {!hasResult && (
          <div style={{ textAlign: "center", padding: "40px 28px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, color: "var(--text-secondary)" }}>
            Saisissez votre capital initial et/ou vos versements mensuels pour voir votre projection.
          </div>
        )}

        {/* Tableau évolution annuelle */}
        {hasResult && res.yearlyData.length > 0 && (
          <AccordionSection title="Évolution annuelle" subtitle={`Année par année sur ${duree} ans`}>
            <div style={{ overflowX: "auto", marginBottom: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, color: "var(--text)" }}>
                <thead>
                  <tr style={{ background: "var(--input-bg)", borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: "10px 8px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>Année</th>
                    <th style={{ padding: "10px 8px", textAlign: "right", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>Capital</th>
                    <th style={{ padding: "10px 8px", textAlign: "right", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>Versements</th>
                    <th style={{ padding: "10px 8px", textAlign: "right", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>Intérêts</th>
                  </tr>
                </thead>
                <tbody>
                  {res.yearlyData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--border)", background: row.annee % 2 === 0 ? "var(--input-bg)" : "transparent" }}>
                      <td style={{ padding: "10px 8px", textAlign: "left" }}>Année {row.annee}</td>
                      <td style={{ padding: "10px 8px", textAlign: "right", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: "var(--gold)" }}>
                        {fmt(row.capital)}€
                      </td>
                      <td style={{ padding: "10px 8px", textAlign: "right", color: "var(--text-secondary)" }}>
                        {fmt(row.versementsCum)}€
                      </td>
                      <td style={{ padding: "10px 8px", textAlign: "right", color: "var(--gold-mid)", fontWeight: 500 }}>
                        {fmt(row.interstsCum)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionSection>
        )}

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>La magie des intérêts composés</h3>
            <p style={{ marginBottom: 16 }}>L'épargne à long terme tire toute sa puissance des intérêts composés : les intérêts générés chaque année s'ajoutent au capital et produisent eux-mêmes des intérêts l'année suivante. Ce mécanisme crée une croissance exponentielle. Ainsi, 10 000 € investis à 5 % par an valent 16 289 € après 10 ans, 26 533 € après 20 ans et 43 219 € après 30 ans — le capital a plus que quadruplé sans aucun versement supplémentaire.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>La règle des 72</h3>
            <p style={{ marginBottom: 16 }}>La règle des 72 est un raccourci mental pour estimer le temps nécessaire à un capital pour doubler : divisez 72 par le taux d'intérêt annuel. À 4 %, un capital double en environ 18 ans. À 6 %, en 12 ans. À 9 %, en 8 ans. Cette règle donne une intuition immédiate de l'impact du taux choisi sur la croissance de son épargne et souligne l'importance de chercher le meilleur rendement possible.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Durée vs taux : l'arbitrage fondamental</h3>
            <p>Dans l'épargne de long terme, la durée a généralement plus d'impact que le taux. Un investisseur qui place 200 € par mois à 5 % pendant 30 ans accumule environ 166 000 €. S'il attend 10 ans pour commencer (20 ans seulement), il n'atteindra que 82 000 €. La régularité des versements et la durée d'investissement sont les deux leviers les plus accessibles pour construire un patrimoine significatif.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
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
