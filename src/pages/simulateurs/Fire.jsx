import { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

// ─── Calculation: FIRE (Financial Independence, Retire Early) ──────────────────

function calcFire({
  patrimoineActuel, depensesMensuelles, revenuMensuel,
  tauxEpargne, rendementAnnuel, tauxRetrait,
}) {
  if (!depensesMensuelles || depensesMensuelles <= 0) {
    return {
      patrimoineCible: 0,
      epargneParMois: 0,
      anneesRestantes: 0,
      dateFire: new Date().getFullYear(),
      progressPct: 0,
      revenuPassifMensuel: 0,
    };
  }

  // Patrimoine cible = dépenses annuelles / taux de retrait
  const depensesAnnuelles = depensesMensuelles * 12;
  const patrimoineCible = depensesAnnuelles / (tauxRetrait / 100);

  // Épargne mensuelle
  const epargneParMois = (revenuMensuel || 0) * (tauxEpargne / 100);

  // Années restantes: résoudre patrimoineCible = patrimoineActuel * (1+r)^n + epargne/r * ((1+r)^n - 1)
  // Où r = rendementAnnuel / 100 / 12 (taux mensuel)
  let anneesRestantes = 0;
  let dateFire = new Date().getFullYear();

  if (epargneParMois > 0 && rendementAnnuel > 0) {
    const r = rendementAnnuel / 100 / 12;
    const A = patrimoineActuel || 0;
    const S = epargneParMois;
    const C = patrimoineCible;

    // n = log((C - S/r) / (A - S/r)) / log(1+r)
    const Sr = S / r;
    if (A < C) {
      const ratio = (C - Sr) / (A - Sr);
      if (ratio > 0) {
        const n = Math.log(ratio) / Math.log(1 + r);
        anneesRestantes = Math.max(0, n / 12);
        dateFire = new Date().getFullYear() + Math.ceil(anneesRestantes);
      }
    } else {
      anneesRestantes = 0;
      dateFire = new Date().getFullYear();
    }
  } else if (epargneParMois <= 0 && (patrimoineActuel || 0) >= patrimoineCible) {
    anneesRestantes = 0;
    dateFire = new Date().getFullYear();
  }

  const progressPct = patrimoineCible > 0 ? Math.min(((patrimoineActuel || 0) / patrimoineCible) * 100, 100) : 0;
  const revenuPassifMensuel = patrimoineCible > 0 ? (patrimoineCible * tauxRetrait) / 100 / 12 : 0;

  return {
    patrimoineCible,
    epargneParMois,
    anneesRestantes,
    dateFire,
    progressPct,
    revenuPassifMensuel,
  };
}

// ─── Sensibilité table ─────────────────────────────────────────────────────────

function SensibiliteTable({ depensesMensuelles, tauxRetrait }) {
  const taux = [3, 3.5, 4, 4.5, 5];
  return (
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Taux retrait</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Patrimoine cible</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>vs 4 %</th>
          </tr>
        </thead>
        <tbody>
          {taux.map((t) => {
            const target = (depensesMensuelles * 12) / (t / 100);
            const target4 = (depensesMensuelles * 12) / 0.04;
            const diff = target4 - target;
            return (
              <tr key={t} style={{ borderBottom: "1px solid var(--border)", background: t === tauxRetrait ? "rgba(184,147,74,0.08)" : "transparent" }}>
                <td style={{ padding: "10px 0", color: t === tauxRetrait ? "var(--gold)" : "var(--text)" }}>{t} %</td>
                <td style={{ textAlign: "right", padding: "10px 0", color: t === tauxRetrait ? "var(--gold)" : "var(--text)" }}>{fmtEur(target)}</td>
                <td style={{ textAlign: "right", padding: "10px 0", color: diff >= 0 ? "#22c55e" : "#ef4444", fontSize: 11 }}>
                  {diff >= 0 ? "−" : "+"}{fmtEur(Math.abs(diff))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Qu'est-ce que la règle des 25x ?",
    a: "La règle des 25x stipule que pour être indépendant financièrement, votre patrimoine doit être égal à 25 fois vos dépenses annuelles. Cela correspond à un taux de retrait de 4 % par an, basé sur l'étude Trinity. Si vous dépensez 2 000 €/mois (24 000 €/an), vous avez besoin de 600 000 € de patrimoine.",
  },
  {
    q: "Quel est le taux de retrait sécurisé ?",
    a: "Le taux de retrait sécurisé (SWR — Safe Withdrawal Rate) est le pourcentage de votre patrimoine que vous pouvez dépenser chaque année sans risque de le épuiser. L'étude Trinity (1998) conclut que 4 % est un taux historiquement sûr. Certains préfèrent 3,5 % pour plus de sécurité, d'autres acceptent 5 % pour plus de flexibilité.",
  },
  {
    q: "Comment calculez-vous le nombre d'années jusqu'à FIRE ?",
    a: "Nous utilisons la formule des intérêts composés : patrimoineCible = patrimoineActuel × (1+r)^n + épargneParMois/r × ((1+r)^n − 1), où r = rendement annuel / 12. Nous résolvons pour n et convertissons en années. Cela suppose un taux de retrait constant et un rendement régulier.",
  },
  {
    q: "Dois-je compter mon salaire net ou brut ?",
    a: "Utilisez votre revenu net (après impôts et charges sociales), car c'est l'argent réellement disponible à épargner. Le taux d'épargne doit être réaliste : 30 % pour un salarié moyen, 50 % pour un haut revenu, moins si vous avez des dettes.",
  },
  {
    q: "Et l'inflation ? Et les impôts sur les revenus de placement ?",
    a: "Ce simulateur suppose un rendement réel (après inflation). Par exemple, 5 % de rendement réel = ~7 % nominal - 2 % d'inflation. Les impôts sur les plus-values et dividendes ne sont pas simulés ici. Consultez un conseiller fiscal pour un plan complet.",
  },
];

export default function Fire() {
  const [theme, setTheme] = useTheme();

  const [patrimoineActuel, setPatrimoineActuel] = useState(null);
  const [depensesMensuelles, setDepensesMensuelles] = useState(null);
  const [revenuMensuel, setRevenuMensuel] = useState(null);
  const [tauxEpargne, setTauxEpargne] = useState(30);
  const [rendementAnnuel, setRendementAnnuel] = useState(5);
  const [tauxRetrait, setTauxRetrait] = useState(4);

  useEffect(() => {
    document.title = "Simulateur FIRE — Indépendance financière · mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      "Calculez le patrimoine nécessaire pour vivre de vos investissements (FIRE) et estimez combien d'années vous séparent de la liberté financière."
    );
  }, []);

  const res = calcFire({
    patrimoineActuel,
    depensesMensuelles,
    revenuMensuel,
    tauxEpargne,
    rendementAnnuel,
    tauxRetrait,
  });

  const patrimoineAnim = useAnimatedNumber(res.patrimoineCible);
  const progressAnim = useAnimatedNumber(res.progressPct);

  const hasResult = (depensesMensuelles || 0) > 0;
  const isAlreadyFire = (patrimoineActuel || 0) >= res.patrimoineCible && res.patrimoineCible > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "'DM Sans', sans-serif",
        color: "var(--text)",
      }}
    >
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="🔥"
          badge="Finances · Simulation 2026"
          title="Indépendance financière (FIRE)"
          desc="Calculez le patrimoine nécessaire pour vivre de vos investissements et estimez combien d'années vous séparent de la liberté financière."
        />

        {/* Reassurance */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            background: "rgba(184,147,74,0.07)",
            border: "1px solid var(--border-gold)",
            borderRadius: 12,
            padding: "12px 20px",
            marginBottom: 20,
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          {["✓ Règle des 25x (SWR 4 %)", "✓ Intérêts composés", "✓ Calcul 100 % local"].map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>
              {t}
            </span>
          ))}
        </div>

        {/* Formulaire */}
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "32px 28px",
            boxShadow: "var(--card-shadow)",
            marginBottom: 0,
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 19,
              color: "var(--text-secondary)",
              marginBottom: 28,
              fontWeight: 400,
            }}
          >
            Situation actuelle
          </h2>

          <NumInput
            id="patrimoine-actuel"
            label="Patrimoine actuel"
            value={patrimoineActuel}
            onChange={setPatrimoineActuel}
            unit="€"
            min={0}
            max={10000000}
            hint={patrimoineActuel ? `Total épargne + investissements actuels` : "Comptes d'épargne, actions, immobilier (net de dettes)"}
          />

          <NumInput
            id="revenu-mensuel"
            label="Revenu mensuel net"
            value={revenuMensuel}
            onChange={setRevenuMensuel}
            unit="€/mois"
            min={0}
            max={50000}
            hint={revenuMensuel ? `Épargne potentielle : ${fmtEur(revenuMensuel * (tauxEpargne / 100))}/mois` : "Salaire ou revenu net après impôts"}
          />

          <StepperInput
            label="Taux d'épargne"
            value={tauxEpargne}
            onChange={setTauxEpargne}
            min={0}
            max={90}
            step={1}
            unit="%"
            hint={`${fmtEur((revenuMensuel || 0) * (tauxEpargne / 100))}/mois épargné`}
          />

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 19,
              color: "var(--text-secondary)",
              marginBottom: 28,
              marginTop: 32,
              fontWeight: 400,
            }}
          >
            Objectif FIRE
          </h2>

          <NumInput
            id="depenses-mensuelles"
            label="Dépenses mensuelles cibles"
            value={depensesMensuelles}
            onChange={setDepensesMensuelles}
            unit="€/mois"
            min={500}
            max={50000}
            hint="Vos dépenses une fois à la retraite (courses, loyer, loisirs...)"
          />

          <StepperInput
            label="Rendement annuel espéré"
            value={rendementAnnuel}
            onChange={setRendementAnnuel}
            min={0}
            max={15}
            step={0.5}
            unit="%"
            hint="Rendement réel après inflation (portefeuille d'actions ~5 %)"
            tooltip="5 % de rendement réel = ~7 % nominal - 2 % inflation"
          />

          <StepperInput
            label="Taux de retrait sécurisé"
            value={tauxRetrait}
            onChange={setTauxRetrait}
            min={1}
            max={6}
            step={0.5}
            unit="%"
            hint="Pourcentage annuel que vous pouvez dépenser (4 % recommandé)"
            tooltip="Étude Trinity : 4 % historiquement sûr. 3,5 % plus conservateur, 5 % plus agressif."
          />
        </div>

        {/* Résultats */}
        <div
          style={{
            background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))",
            border: "1px solid var(--border-gold)",
            borderRadius: 20,
            padding: "32px 28px",
            marginTop: 20,
            boxShadow: "var(--card-shadow)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 19,
              color: "var(--text-secondary)",
              marginBottom: 24,
              fontWeight: 400,
            }}
          >
            Votre indépendance financière
          </h2>

          <div
            style={{
              textAlign: "center",
              padding: "20px 0 24px",
              borderBottom: "1px solid var(--border)",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: 10,
              }}
            >
              Patrimoine cible
            </div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>
                Saisissez vos paramètres pour voir votre estimation.
              </p>
            ) : isAlreadyFire ? (
              <>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(48px,10vw,72px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    background: "linear-gradient(135deg,var(--gold),var(--gold-mid))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 10,
                  }}
                >
                  {patrimoineAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--gold)", marginBottom: 6 }}>
                  🎉 Vous avez atteint l'indépendance financière !
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Votre patrimoine actuel peut couvrir vos dépenses indéfiniment.
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(48px,10vw,72px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    background: "linear-gradient(135deg,var(--gold),var(--gold-mid))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {patrimoineAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  à atteindre d'ici <strong>{res.dateFire}</strong> ({Math.ceil(res.anneesRestantes)} ans)
                </div>
              </>
            )}
          </div>

          {hasResult && !isAlreadyFire && (
            <>
              {/* Progress bar */}
              <ProgressBar
                label="Progression vers FIRE"
                value={patrimoineActuel || 0}
                total={res.patrimoineCible}
                color="linear-gradient(90deg,var(--gold-mid),var(--gold))"
              />

              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="Années restantes" value={`${Math.ceil(res.anneesRestantes)}`} />
                <Chip label="Épargne mensuelle" value={`${fmtEur(res.epargneParMois)}`} accent />
                <Chip label="Revenu passif mensuel" value={`${fmtEur(res.revenuPassifMensuel)}`} />
                <Chip label="Année estimée FIRE" value={`${res.dateFire}`} accent />
              </div>
            </>
          )}

          {hasResult && (
            <div
              role="note"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "13px 16px",
                fontSize: 11,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginTop: 16,
              }}
            >
              ⚠️ <strong>Simulation indicative.</strong> Cette simulation suppose un rendement régulier et un taux de retrait constant. Les marchés financiers
              sont volatiles. Consultez un conseiller financier pour un plan personnalisé.
            </div>
          )}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* Règle des 25x */}
        {hasResult && (
          <AccordionSection title="Comprendre la règle des 25x" subtitle="Math du taux de retrait sécurisé">
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <p style={{ marginBottom: 14 }}>
                La <strong>règle des 25x</strong> stipule que votre patrimoine de retraite doit être égal à 25 fois vos dépenses annuelles. Cela correspond à un{" "}
                <strong>taux de retrait de 4 %</strong> par an.
              </p>
              <p style={{ marginBottom: 14 }}>
                <strong>Exemple :</strong> Si vous dépensez 2 000 €/mois (24 000 €/an), vous avez besoin de 600 000 € de patrimoine. Chaque année, vous retirez
                4 % = 24 000 €, soit exactement vos dépenses.
              </p>
              <p style={{ marginBottom: 14 }}>
                Cette règle repose sur l'<strong>étude Trinity (1998)</strong>, qui a simulé les rendements du marché depuis 1926 et conclu que 4 % est un taux
                historiquement « sûr » (probabilité de succès ~95 % sur 30 ans).
              </p>
              <p style={{ marginBottom: 14 }}>
                <strong>Variantes :</strong>
              </p>
              <ul style={{ marginLeft: 20, marginBottom: 14, listStyleType: "disc" }}>
                <li>3 % → très conservateur, quasi aucun risque</li>
                <li>3,5 % → conservateur, plus de sécurité</li>
                <li>4 % → équilibré, recommandé (cette étude)</li>
                <li>4,5 % → agressif, demande flexibilité</li>
                <li>5 % → très agressif, peut ne pas durer 60+ ans</li>
              </ul>
            </div>
          </AccordionSection>
        )}

        {/* Sensibilité */}
        {hasResult && (
          <AccordionSection title="Sensibilité : impact du taux de retrait" subtitle="Patrimoine cible selon le taux retrait">
            <SensibiliteTable depensesMensuelles={depensesMensuelles} tauxRetrait={tauxRetrait} />
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <p>
                Plus le taux de retrait baisse, plus vous avez besoin de patrimoine. Par exemple, en choisissant 3,5 % au lieu de 4 %, vous devez épargner 14 % de plus
                pour la même retraite.
              </p>
            </div>
          </AccordionSection>
        )}

        {/* FAQ */}
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "36px 28px",
            marginTop: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(20px,4vw,26px)",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 24,
            }}
          >
            Questions fréquentes — FIRE
          </h2>
          {FAQ.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Ressources : <a href="https://www.earlyretirementnow.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
              Early Retirement Now
            </a>{" "}
            · <a href="https://www.bogleheads.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
              Bogleheads
            </a>
          </p>
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "18px 0",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text)",
            lineHeight: 1.4,
          }}
        >
          {q}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            fontSize: 18,
            color: open ? "var(--gold)" : "var(--text-secondary)",
          }}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p style={{ paddingBottom: 18, paddingRight: 32, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          {a}
        </p>
      )}
    </div>
  );
}
