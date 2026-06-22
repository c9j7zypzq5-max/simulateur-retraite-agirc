import { useState, useMemo } from "react";
import { track } from "@vercel/analytics";
import { useTheme } from "../../hooks/useTheme.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import SimIcon from "../../data/simIcons.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  useAnimatedNumber, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

// ─── Barème IR 2026 (revenus 2025) ───────────────────────────────────────────
const BAREME = [
  { min: 0,        max: 11_600,  taux: 0    },
  { min: 11_600,   max: 29_579,  taux: 0.11 },
  { min: 29_579,   max: 84_577,  taux: 0.30 },
  { min: 84_577,   max: 181_917, taux: 0.41 },
  { min: 181_917,  max: Infinity, taux: 0.45 },
];

function nbParts(situation, enfants) {
  const base = situation === "marie" ? 2 : 1;
  let e = 0;
  for (let i = 1; i <= enfants; i++) e += i <= 2 ? 0.5 : 1;
  return base + e;
}

function calcIR(revenuImposable, situation, enfants) {
  const parts = nbParts(situation, enfants);
  const quotient = Math.max(0, revenuImposable) / parts;
  let irQ = 0;
  for (const { min, max, taux } of BAREME) {
    if (quotient <= min) break;
    irQ += (Math.min(quotient, max) - min) * taux;
  }
  const irBrut = irQ * parts;
  const seuilDecote = situation === "marie" ? 3_277 : 1_982;
  const decoteMax   = situation === "marie" ? 1_483 : 897;
  const decote = irBrut < seuilDecote ? Math.max(0, decoteMax - 0.4525 * irBrut) : 0;
  return Math.max(0, irBrut - decote);
}

// ─── Calculs par statut ───────────────────────────────────────────────────────
// SALARIÉ
// Charges salariales ≈ 22 % du brut (retraite, sécu, chômage) → net ≈ 78 %
// Charges patronales ≈ 42 % → coût employeur = brut × 1.42
// Abattement 10 % sur frais réels (min 504 €, max 14 426 €) pour IR
function calcSalarie({ brut, situation, enfants }) {
  const chargesSalariales = brut * 0.22;
  const netAvantIR = brut * 0.78;
  const abattFrais = Math.min(Math.max(netAvantIR * 0.10, 504), 14_426);
  const revImp = Math.max(0, netAvantIR - abattFrais);
  const ir = calcIR(revImp, situation, enfants);
  const netFinal = netAvantIR - ir;
  const coutEmployeur = brut * 1.42;
  const tauxChargesGlobal = 1 - (netFinal / coutEmployeur);
  const tmi = (() => { let t = 0; const q = revImp / nbParts(situation, enfants); for (const tr of BAREME) { if (q > tr.min) t = tr.taux; } return t; })();
  return { chargesSociales: chargesSalariales, coutEmployeur, netAvantIR, ir, netFinal, netMensuel: netFinal / 12, tauxChargesGlobal, tmi };
}

// MICRO-BIC SERVICES (abattement 50%, cotisations 21.2% du CA)
function calcMicroBicServices({ ca, situation, enfants }) {
  const cotisations = ca * 0.212;
  const netAvantIR = ca - cotisations;
  const revImp = ca * 0.50; // abattement forfaitaire 50%
  const ir = calcIR(revImp, situation, enfants);
  const netFinal = netAvantIR - ir;
  const tmi = (() => { let t = 0; const q = revImp / nbParts(situation, enfants); for (const tr of BAREME) { if (q > tr.min) t = tr.taux; } return t; })();
  return { chargesSociales: cotisations, netAvantIR, ir, netFinal, netMensuel: netFinal / 12, tmi, revImp };
}

// MICRO-BNC (abattement 34%, cotisations 21.1% du CA — libéraux, consultants)
function calcMicroBnc({ ca, situation, enfants }) {
  const cotisations = ca * 0.211;
  const netAvantIR = ca - cotisations;
  const revImp = ca * 0.66; // abattement forfaitaire 34%
  const ir = calcIR(revImp, situation, enfants);
  const netFinal = netAvantIR - ir;
  const tmi = (() => { let t = 0; const q = revImp / nbParts(situation, enfants); for (const tr of BAREME) { if (q > tr.min) t = tr.taux; } return t; })();
  return { chargesSociales: cotisations, netAvantIR, ir, netFinal, netMensuel: netFinal / 12, tmi, revImp };
}

// PORTAGE SALARIAL (≈ 50% du CA revient en brut après frais de gestion ~10% et charges patronales)
function calcPortage({ ca, situation, enfants }) {
  const fraisGestion = ca * 0.10;  // commission société de portage ~10%
  const caNet = ca - fraisGestion;
  const brut = caNet / 1.42;       // déduire les charges patronales
  const chargesPatronales = caNet - brut;
  const chargesSalariales = brut * 0.22;
  const netAvantIR = brut * 0.78;
  const abattFrais = Math.min(Math.max(netAvantIR * 0.10, 504), 14_426);
  const revImp = Math.max(0, netAvantIR - abattFrais);
  const ir = calcIR(revImp, situation, enfants);
  const netFinal = netAvantIR - ir;
  const tmi = (() => { let t = 0; const q = revImp / nbParts(situation, enfants); for (const tr of BAREME) { if (q > tr.min) t = tr.taux; } return t; })();
  return { chargesSociales: chargesSalariales + chargesPatronales, fraisGestion, netAvantIR, ir, netFinal, netMensuel: netFinal / 12, tmi };
}

const SITUATIONS = [
  { value: "celibataire", label: "Célibataire / Seul" },
  { value: "marie",       label: "Marié(e) / Pacsé(e)" },
];

const DEFAULT = { brut: 50_000, ca: 70_000, situation: "celibataire", enfants: 0 };

function fromParams(p) {
  if (!p) return { ...DEFAULT };
  return {
    brut:       Number(p.b)  || DEFAULT.brut,
    ca:         Number(p.c)  || DEFAULT.ca,
    situation:  p.s          || DEFAULT.situation,
    enfants:    Number(p.e)  || DEFAULT.enfants,
  };
}
function toParams(v) {
  return { b: v.brut, c: v.ca, s: v.situation, e: v.enfants };
}

// ─── UI helpers ──────────────────────────────────────────────────────────────
function ResultCol({ title, color, accent, rows, netMensuel, tmi, animNet }) {
  return (
    <div style={{ flex: 1, minWidth: 0, background: "var(--card-bg)", border: `1.5px solid ${accent}`, borderRadius: 18, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color, marginBottom: 4 }}>{title}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 800, color }}>{fmtEur(animNet)}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>/ mois net disponible</div>
      <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
      {rows.map(([label, val, highlight]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: highlight ? "var(--text)" : "var(--text-secondary)" }}>
          <span>{label}</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: highlight ? 600 : 400 }}>{val}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 8, background: color === "#22c55e" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", fontSize: 12, color }}>
        TMI : {(tmi * 100).toFixed(0)} %
      </div>
    </div>
  );
}

const FAQ = [
  { q: "Pourquoi le CA freelance doit-il être plus élevé que le brut salarié ?", a: "En tant que salarié, votre employeur paie ~42% de charges patronales en plus de votre brut. Un freelance doit donc facturer suffisamment pour couvrir ses propres charges sociales (21-22% du CA) et ses frais professionnels. Un brut salarié de 50 000 € coûte ~71 000 € à l'employeur, ce qui est le CA minimal à viser pour comparer à armes égales." },
  { q: "Quelle différence entre micro-BIC et micro-BNC ?", a: "Le régime micro-BIC (Bénéfices Industriels et Commerciaux) s'applique aux activités commerciales et artisanales avec un abattement de 50% sur le CA. Le micro-BNC (Bénéfices Non Commerciaux) concerne les professions libérales (consultant, coach, formateur…) avec un abattement plus faible de 34% — mais les taux de cotisation sont similaires (~21%)." },
  { q: "Quand le micro-entrepreneur devient-il moins intéressant ?", a: "Au-delà de 77 700 € de CA pour les services (BIC) ou 77 700 € en BNC (seuils 2025), le régime micro ne s'applique plus automatiquement. De plus, si vos charges réelles dépassent l'abattement forfaitaire (ex : 60% de charges réelles vs 50% forfaitaire BIC), le régime réel est plus avantageux." },
  { q: "Le portage salarial est-il intéressant ?", a: "Le portage permet de bénéficier du statut salarié (chômage, retraite complémentaire) tout en travaillant comme indépendant. La contrepartie est une commission de 8-12% prélevée par la société de portage sur le CA, ce qui réduit le net disponible. C'est souvent moins rentable que la micro-entreprise mais plus protecteur." },
  { q: "Ces calculs prennent-ils en compte la retraite ?", a: "Partiellement : les cotisations sociales calculées incluent la retraite de base. Cependant, un salarié cotise aussi à la retraite complémentaire Agirc-Arrco (via les charges sociales), tandis qu'un micro-entrepreneur génère peu de droits retraite complémentaire. Sur le long terme, le salarié accumule plus de droits retraite pour le même revenu net." },
];

export default function FreelanceVsSalarie() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [brut,       setBrut]       = useState(init.brut);
  const [ca,         setCa]         = useState(init.ca);
  const [situation,  setSituation]  = useState(init.situation);
  const [enfants,    setEnfants]    = useState(init.enfants);

  usePageMeta({
    title: "Simulateur Freelance vs Salarié 2026 | simfinly.com",
    description: "Comparez votre net disponible en tant que salarié, micro-entrepreneur (BIC/BNC) ou en portage salarial. Charges sociales, impôt sur le revenu, TMI : tout est calculé.",
  });

  const resSalarie  = useMemo(() => calcSalarie({ brut, situation, enfants }), [brut, situation, enfants]);
  const resMicroBic = useMemo(() => calcMicroBicServices({ ca, situation, enfants }), [ca, situation, enfants]);
  const resMicroBnc = useMemo(() => calcMicroBnc({ ca, situation, enfants }), [ca, situation, enfants]);
  const resPortage  = useMemo(() => calcPortage({ ca, situation, enfants }), [ca, situation, enfants]);

  const animSalarie  = useAnimatedNumber(resSalarie.netMensuel);
  const animMicroBic = useAnimatedNumber(resMicroBic.netMensuel);
  const animMicroBnc = useAnimatedNumber(resMicroBnc.netMensuel);
  const animPortage  = useAnimatedNumber(resPortage.netMensuel);

  // CA équivalent au coût employeur pour comparaison équitable
  const coutEmployeur = resSalarie.coutEmployeur;

  const shareUrl = buildShareUrl(toParams({ brut, ca, situation, enfants }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur Freelance vs Salarié 2026", url: "https://www.simfinly.com/simulateurs/freelance-vs-salarie", description: "Comparez le net disponible entre salarié, micro-entreprise et portage salarial.", applicationCategory: "FinanceApplication" }} />

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/freelance-vs-salarie" size={34} />}
          title="Freelance vs Salarié"
          subtitle="Net disponible · Charges · IR 2025"
          desc="Comparez votre revenu net mensuel selon votre statut : salarié, micro-entrepreneur BIC, micro-BNC ou portage salarial. Calculs avec charges sociales et impôt sur le revenu 2025."
          badge="Finances · Statut"
        />

        <AdUnit slot="freelance-top" style={{ marginBottom: 24 }} />

        {/* Inputs */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 18, padding: "24px", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0 }}>
            <NumInput
              id="brut-annuel"
              label="Salaire brut annuel (salarié)"
              value={brut}
              onChange={v => { setBrut(v); track("freelance_brut"); }}
              unit="€"
              min={0}
              max={500_000}
              hint={`Coût employeur estimé : ${fmtEur(Math.round(brut * 1.42))}/an`}
              tooltip="Votre brut annuel avant charges salariales"
            />
            <NumInput
              id="ca-annuel"
              label="CA annuel (freelance)"
              value={ca}
              onChange={v => { setCa(v); track("freelance_ca"); }}
              unit="€"
              min={0}
              max={500_000}
              hint={`Équivalent brut employeur : ${fmtEur(Math.round(ca / 1.42))}/an`}
              tooltip="Votre chiffre d'affaires annuel toutes taxes comprises"
            />
          </div>

          {/* Situation fiscale */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 8 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Situation fiscale</div>
              <div style={{ display: "flex", gap: 8 }}>
                {SITUATIONS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSituation(s.value)}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: situation === s.value ? 700 : 400,
                      background: situation === s.value ? "rgba(184,147,74,0.12)" : "transparent",
                      border: situation === s.value ? "1.5px solid var(--border-gold)" : "1.5px solid var(--border)",
                      color: situation === s.value ? "var(--gold)" : "var(--text)",
                      fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <StepperInput
              label="Enfants à charge"
              value={enfants}
              onChange={setEnfants}
              min={0}
              max={6}
            />
          </div>

          {/* Info comparaison équitable */}
          <div style={{ marginTop: 18, padding: "12px 14px", borderRadius: 10, background: "rgba(43,92,230,0.06)", border: "1px solid rgba(43,92,230,0.15)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            💡 <strong>Pour une comparaison équitable :</strong> votre brut de <strong>{fmtEur(brut)}</strong> coûte <strong>{fmtEur(Math.round(coutEmployeur))}</strong> à votre employeur. Le CA freelance équivalent est <strong>{fmtEur(Math.round(coutEmployeur))}</strong> — réglez le curseur CA à cette valeur pour comparer à même coût pour le client.
          </div>
        </div>

        {/* Résultats côte à côte */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <ResultCol
            title="Salarié"
            color="var(--primary)"
            accent="var(--border-gold)"
            animNet={animSalarie}
            tmi={resSalarie.tmi}
            rows={[
              ["Brut annuel",       fmtEur(brut)],
              ["Charges salariales (22%)", `− ${fmtEur(Math.round(resSalarie.chargesSociales))}`],
              ["Net avant IR",      fmtEur(Math.round(resSalarie.netAvantIR))],
              ["Impôt sur le revenu", `− ${fmtEur(Math.round(resSalarie.ir))}`],
              ["Net disponible /an", fmtEur(Math.round(resSalarie.netFinal)), true],
              ["Coût employeur /an", fmtEur(Math.round(resSalarie.coutEmployeur))],
            ]}
          />
          <ResultCol
            title="Micro-BIC services"
            color="#f59e0b"
            accent="rgba(245,158,11,0.3)"
            animNet={animMicroBic}
            tmi={resMicroBic.tmi}
            rows={[
              ["CA annuel",              fmtEur(ca)],
              ["Cotisations SSI (21,2%)", `− ${fmtEur(Math.round(resMicroBic.chargesSociales))}`],
              ["Net avant IR",           fmtEur(Math.round(resMicroBic.netAvantIR))],
              ["Revenu imposable (50%)", fmtEur(Math.round(resMicroBic.revImp))],
              ["Impôt sur le revenu",    `− ${fmtEur(Math.round(resMicroBic.ir))}`],
              ["Net disponible /an",     fmtEur(Math.round(resMicroBic.netFinal)), true],
            ]}
          />
          <ResultCol
            title="Micro-BNC (libéral)"
            color="#a855f7"
            accent="rgba(168,85,247,0.3)"
            animNet={animMicroBnc}
            tmi={resMicroBnc.tmi}
            rows={[
              ["CA annuel",              fmtEur(ca)],
              ["Cotisations SSI (21,1%)", `− ${fmtEur(Math.round(resMicroBnc.chargesSociales))}`],
              ["Net avant IR",           fmtEur(Math.round(resMicroBnc.netAvantIR))],
              ["Revenu imposable (66%)", fmtEur(Math.round(resMicroBnc.revImp))],
              ["Impôt sur le revenu",    `− ${fmtEur(Math.round(resMicroBnc.ir))}`],
              ["Net disponible /an",     fmtEur(Math.round(resMicroBnc.netFinal)), true],
            ]}
          />
          <ResultCol
            title="Portage salarial"
            color="#22c55e"
            accent="rgba(34,197,94,0.3)"
            animNet={animPortage}
            tmi={resPortage.tmi}
            rows={[
              ["CA annuel",             fmtEur(ca)],
              ["Frais de gestion (10%)", `− ${fmtEur(Math.round(resPortage.fraisGestion))}`],
              ["Charges sociales tot.", `− ${fmtEur(Math.round(resPortage.chargesSociales))}`],
              ["Net avant IR",          fmtEur(Math.round(resPortage.netAvantIR))],
              ["Impôt sur le revenu",   `− ${fmtEur(Math.round(resPortage.ir))}`],
              ["Net disponible /an",    fmtEur(Math.round(resPortage.netFinal)), true],
            ]}
          />
        </div>

        {/* Tableau comparatif synthèse */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px", marginBottom: 28, overflowX: "auto" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Synthèse comparative</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--text-secondary)", fontWeight: 600 }}>Statut</th>
                <th style={{ textAlign: "right", padding: "8px 10px", color: "var(--text-secondary)", fontWeight: 600 }}>Revenu de base</th>
                <th style={{ textAlign: "right", padding: "8px 10px", color: "var(--text-secondary)", fontWeight: 600 }}>Net disponible /an</th>
                <th style={{ textAlign: "right", padding: "8px 10px", color: "var(--text-secondary)", fontWeight: 600 }}>Net /mois</th>
                <th style={{ textAlign: "right", padding: "8px 10px", color: "var(--text-secondary)", fontWeight: 600 }}>TMI</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Salarié",           base: brut, res: resSalarie,  color: "var(--primary)" },
                { label: "Micro-BIC services", base: ca,  res: resMicroBic, color: "#f59e0b" },
                { label: "Micro-BNC libéral",  base: ca,  res: resMicroBnc, color: "#a855f7" },
                { label: "Portage salarial",   base: ca,  res: resPortage,  color: "#22c55e" },
              ].map(({ label, base, res, color }) => {
                const best = Math.max(resSalarie.netFinal, resMicroBic.netFinal, resMicroBnc.netFinal, resPortage.netFinal);
                const isBest = Math.round(res.netFinal) === Math.round(best);
                return (
                  <tr key={label} style={{ borderBottom: "1px solid var(--border)", background: isBest ? "rgba(184,147,74,0.05)" : "transparent" }}>
                    <td style={{ padding: "11px 10px", fontWeight: 600, color }}>
                      {label} {isBest && <span style={{ fontSize: 11, marginLeft: 6, color: "var(--gold)" }}>✓ meilleur</span>}
                    </td>
                    <td style={{ padding: "11px 10px", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif" }}>{fmtEur(base)}</td>
                    <td style={{ padding: "11px 10px", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: isBest ? "var(--gold)" : "var(--text)" }}>{fmtEur(Math.round(res.netFinal))}</td>
                    <td style={{ padding: "11px 10px", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif" }}>{fmtEur(Math.round(res.netMensuel))}</td>
                    <td style={{ padding: "11px 10px", textAlign: "right" }}>{(res.tmi * 100).toFixed(0)} %</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <AdUnit slot="freelance-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos des calculs">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Ce simulateur utilise les barèmes de cotisations sociales et d'impôt sur le revenu 2025/2026. Les charges salariales (22%) et patronales (42%) sont des approximations pour un salarié du secteur privé — les taux exacts varient selon la convention collective, le niveau de salaire (dégressivité de l'assurance chômage) et les éventuels dispositifs d'exonération (apprentissage, zones franches…).
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            Pour les micro-entrepreneurs, les cotisations incluent la retraite de base, la retraite complémentaire, la prévoyance et la formation professionnelle. Elles ne couvrent pas le chômage (contrairement au salarié). Le portage salarial ouvre des droits au chômage, mais les frais de gestion (8-12%) réduisent significativement le net disponible.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est indicatif.</strong> Consultez un expert-comptable ou un conseiller pour votre situation réelle.
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Comparaison Freelance vs Salarié" />
      </div>
      <Footer />
    </div>
  );
}
