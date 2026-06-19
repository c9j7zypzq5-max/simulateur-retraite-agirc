import { useState, useEffect, useRef } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, signFmt, SimulateurHeader,
} from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

// ─── Calcul Retraite Progressive ─────────────────────────────────────────────
function calcRP({ pensionPleineTaux, salaire, quotite, duree }) {
  if (!pensionPleineTaux || !salaire || !quotite) return {
    pensionPartielle: 0, revenuTravail: 0, revenuTotal: 0,
    gainVsDepart: 0, pensionFinale: 0,
  };

  const quotiteNum = quotite / 100;
  // La fraction de pension servie = 1 - quotité de travail
  const fractionPension = Math.max(0, 1 - quotiteNum);
  const pensionPartielle = pensionPleineTaux * fractionPension;
  const revenuTravail   = salaire * quotiteNum;
  const revenuTotal     = pensionPartielle + revenuTravail;

  // Impact sur pension finale : les cotisations à temps partiel continuent
  // Chaque trimestre à temps partiel est validé normalement si revenu ≥ 600 SMIC horaires
  // Pension finale (estimation) : légèrement supérieure grâce aux trimestres supplémentaires
  const dureeNum = duree ?? 3;
  const trimestresGagnés = dureeNum * 4;
  // Surcote CNAV estimée sur ces trimestres si déjà à taux plein: +1.25%/trimestre sur base
  const gainSurcote = pensionPleineTaux * trimestresGagnés * 0.0125;
  const pensionFinale = pensionPleineTaux + gainSurcote;

  // Comparer à un départ immédiat à temps complet
  const gainVsDepart = revenuTotal - salaire; // revenu mensuel net en retraite progressive vs travail à plein temps

  return {
    pensionPartielle, revenuTravail, revenuTotal,
    fractionPension, gainSurcote, pensionFinale, gainVsDepart,
    quotiteNum,
  };
}

const QUOTITES = [50, 60, 70, 80];

const FAQ = [
  { q: "Qui peut bénéficier de la retraite progressive ?", a: "La retraite progressive est ouverte aux salariés du secteur privé (et depuis 2023 aux fonctionnaires) ayant atteint l'âge légal diminué de 2 ans (soit 62 ans pour les nés en 1965+) ET justifiant d'au moins 150 trimestres validés. Vous devez travailler à temps partiel (entre 40 % et 80 % d'un temps plein)." },
  { q: "Comment est calculée la fraction de pension versée ?", a: "La fraction de pension = 1 − quotité de travail. Par exemple, si vous travaillez à 60 %, vous percevez 40 % de vos droits à pension acquis au moment de la liquidation. Cette fraction est recalculée en cas de changement de quotité." },
  { q: "La retraite progressive améliore-t-elle la pension finale ?", a: "Oui, de deux façons : (1) vous continuez à valider des trimestres, ce qui augmente votre durée d'assurance ; (2) vous pouvez cumuler une surcote si vous aviez déjà le taux plein. Au moment de votre départ définitif, vos droits sont recalculés en tenant compte de toute votre carrière, y compris la période progressive." },
  { q: "La retraite progressive est-elle cumulable avec tous les régimes ?", a: "La retraite progressive existe dans le régime général CNAV (salariés du privé) et depuis la réforme 2023 dans la fonction publique. Les indépendants (SSI) peuvent également en bénéficier. Elle n'est pas applicable aux régimes spéciaux. Dans tous les cas, la pension partielle et le revenu d'activité se cumulent sans plafond pendant la période progressive." },
];

export default function RetraiteProgressive() {
  const [theme, setTheme] = useTheme();

  const [pensionPleineTaux, setPension] = useState(null);
  const [salaire, setSalaire]           = useState(null);
  const [quotite, setQuotite]           = useState(null);
  const [duree, setDuree]               = useState(null);

  const resultsRef = useRef(null);

  usePageMeta("Simulateur Retraite Progressive 2025", "Simulez votre retraite progressive : cumul emploi-retraite, fraction de pension, conditions d'éligibilité.");

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'retraite-progressive' });
    if (!sessionStorage.getItem('tracked_retraite-progressive')) {
      sessionStorage.setItem('tracked_retraite-progressive', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'retraite-progressive' })
      }).catch(() => {});
    }
  }, []);
  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.salaire !== undefined) setSalaire(shared.salaire); if (shared.quotite !== undefined) setQuotite(shared.quotite); if (shared.duree !== undefined) setDuree(shared.duree)
    }
  }, []);
  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ pensionPleineTaux, salaire, quotite, duree }));
  }, [pensionPleineTaux, salaire, quotite, duree]);



  const res = calcRP({ pensionPleineTaux, salaire, quotite, duree });
  const pensionAnim = useAnimatedNumber(res.revenuTotal);
  const hasResult = res.revenuTotal > 0;

  const report = {
    title: "Simulateur Retraite progressive",
    highlight: { label: "Revenu mensuel total (pension + salaire)", value: hasResult ? fmtEur(res.revenuTotal) : "—" },
    params: [
      { label: "Pension estimée à taux plein", value: pensionPleineTaux ? fmtEur(pensionPleineTaux) : "—" },
      { label: "Salaire brut mensuel actuel", value: salaire ? fmtEur(salaire) : "—" },
      { label: "Quotité de travail", value: quotite ? `${quotite} %` : "—" },
      { label: "Durée de la période progressive", value: duree ? `${duree} an(s)` : "—" },
    ],
    results: hasResult ? [
      { label: "Revenu mensuel total", value: fmtEur(res.revenuTotal), strong: true },
      { label: "Pension partielle", value: fmtEur(res.pensionPartielle) },
      { label: "Revenu d'activité", value: fmtEur(res.revenuTravail) },
      { label: "Fraction de pension versée", value: `${(res.fractionPension * 100).toFixed(0)} %` },
      ...(duree ? [{ label: "Pension finale estimée", value: `${fmtEur(res.pensionFinale)}/mois` }] : []),
    ] : [],
    notes: hasResult ? [
      "Conditions d'accès : 150 trimestres validés et âge légal − 2 ans.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Retraite progressive",
        "url": "https://www.simfinly.com/simulateurs/retraite-progressive",
        "description": "Simulez votre retraite progressive : cumul emploi-retraite, fraction de pension, conditions d'éligibilité.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/retraite-progressive" size={34} />}
          badge="Tous régimes · Données 2026"
          title="Simulateur Retraite progressive"
          subtitle="Pension partielle + revenu activité · Données 2026"
          desc="Calculez votre revenu total pendant une période de retraite progressive : pension partielle + salaire à temps partiel."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ 40 à 80 % de temps partiel", "✓ Cumul pension + salaire", "✓ Trimestres continués"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>

          <NumInput id="pension" label="Pension estimée à taux plein" value={pensionPleineTaux} onChange={setPension} unit="€" min={100} max={10000}
            hint={pensionPleineTaux ? "Votre pension nette mensuelle si vous partiez maintenant à taux plein" : "Estimez-la avec nos simulateurs CNAV ou Agirc-Arrco"}
            tooltip="Utilisez nos autres simulateurs (CNAV, Agirc-Arrco) pour estimer votre pension à taux plein."
          />
          <NumInput id="salaire" label="Salaire brut mensuel actuel" value={salaire} onChange={setSalaire} unit="€" min={500} max={30000}
            hint={salaire && quotite ? `À ${quotite} % : ${fmtEur(salaire * quotite / 100)}/mois de revenu d'activité` : "Votre salaire à temps complet actuel"}
          />

          {/* Quotité */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              Quotité de travail choisie
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {QUOTITES.map(q => (
                <button key={q} onClick={() => setQuotite(q)}
                  style={{
                    padding: "12px 8px", borderRadius: 12,
                    border: `1.5px solid ${quotite === q ? "rgba(184,147,74,0.6)" : "var(--border)"}`,
                    background: quotite === q ? "rgba(184,147,74,0.1)" : "var(--card-bg)",
                    color: quotite === q ? "var(--gold)" : "var(--text-secondary)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                  {q} %
                </button>
              ))}
            </div>
            {quotite && (
              <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)" }}>
                Fraction de pension versée : <strong style={{ color: "var(--gold)" }}>{100 - quotite} %</strong> de votre pension à taux plein
              </div>
            )}
          </div>

          {/* Résumé */}
          {hasResult && (
            <div style={{ background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.15)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap" }}>
              {[
                { l: "Pension partielle", v: fmtEur(res.pensionPartielle), gold: true },
                { l: "Revenu travail", v: fmtEur(res.revenuTravail) },
                { l: "Total mensuel", v: fmtEur(res.revenuTotal), gold: true },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: item.gold ? "var(--gold)" : "var(--text)" }}>{item.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paramètres avancés */}
        <AccordionSection title="Impact sur la pension finale" subtitle="Trimestres supplémentaires et surcote">
          <StepperInput label="Durée de la période progressive" value={duree} onChange={setDuree}
            min={1} max={10} unit=" an(s)"
            hint={duree ? `${duree * 4} trimestres supplémentaires validés` : "Combien d'années souhaitez-vous rester en retraite progressive ?"}
          />
          {hasResult && duree && (
            <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, padding: "14px 18px", marginTop: 12 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>Pension finale estimée</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "#4ade80" }}>{fmtEur(res.pensionFinale)}/mois</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                +{fmtEur(res.gainSurcote)}/mois grâce à la surcote ({duree * 4} trim. × 1,25 %)
              </div>
            </div>
          )}
        </AccordionSection>

        {/* Résultats */}
        <div ref={resultsRef} style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre revenu en retraite progressive</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Revenu mensuel total (pension + salaire)</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez votre pension, salaire et quotité pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {pensionAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  <strong>{fmtEur(res.pensionPartielle)}</strong> pension + <strong>{fmtEur(res.revenuTravail)}</strong> salaire
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>Pension partielle</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>{fmtEur(res.pensionPartielle)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{((res.fractionPension) * 100).toFixed(0)} % de {fmtEur(pensionPleineTaux)}</div>
                </div>
                <div style={{ background: "rgba(184,147,74,0.08)", border: "1px solid rgba(184,147,74,0.3)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 8 }}>Revenu d'activité</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: "var(--gold)" }}>{fmtEur(res.revenuTravail)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{quotite} % de {fmtEur(salaire)}</div>
                </div>
              </div>

              <ProgressBar label="Pension partielle" value={res.pensionPartielle} total={res.revenuTotal} color="var(--progress-acquired)" />
              <ProgressBar label="Revenu d'activité" value={res.revenuTravail} total={res.revenuTotal} color="linear-gradient(90deg,var(--gold-mid),var(--gold))" />

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Simulation indicative.</strong> Conditions d'accès : 150 trimestres + âge légal − 2 ans.
                La retraite progressive doit être demandée à votre caisse de retraite.
                Pour plus d'infos : <a href="https://www.info-retraite.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>info-retraite.fr</a>.
              </div>
            </>
          )}
        </div>

        <ShareBar params={{ pensionPleineTaux, salaire, quotite, duree }} resultsRef={resultsRef} report={report} name="retraite-progressive" />

        {res.revenuTotal > 0 && (
          <ScenarioCompare
            name="retraite-progressive"
            base={{ quotite, duree }}
            fields={[
              { key: "quotite", label: "Quotité de travail", type: "step", min: 40, max: 80, step: 10, unit: "%" },
              { key: "duree", label: "Durée", type: "step", min: 1, max: 10, step: 1, unit: "ans" },
            ]}
            compute={(v) => calcRP({ pensionPleineTaux, salaire, quotite, duree, ...v })}
            metrics={[{ label: "Revenu total / mois", get: r => r.revenuTotal, fmt: fmtEur, higherBetter: true }]}
          />
        )}

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Un dispositif de cumul emploi-retraite partiel</h3>
            <p style={{ marginBottom: 16 }}>La retraite progressive permet de réduire son temps de travail tout en percevant une fraction de sa pension de retraite, avant même de liquider définitivement ses droits. C'est une solution intermédiaire entre l'activité à temps plein et la retraite complète, particulièrement adaptée aux fins de carrière difficiles ou aux personnes souhaitant une transition douce vers la retraite.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Les conditions d'accès</h3>
            <p style={{ marginBottom: 16 }}>Pour bénéficier de la retraite progressive, trois conditions doivent être réunies : avoir atteint l'âge légal diminué de deux ans (soit 62 ans pour les générations 1965+), avoir validé au minimum 150 trimestres tous régimes confondus, et exercer une activité à temps partiel représentant entre 40 % et 80 % de la durée légale du travail. Le dispositif est ouvert aux salariés du secteur privé et à certains agents publics.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Le calcul de la fraction de pension versée</h3>
            <p>La fraction de pension versée est égale à 100 % moins le pourcentage de temps de travail par rapport au temps complet. Ainsi, un salarié à mi-temps (50 %) percevra 50 % de sa pension calculée à la date de la demande. Cette pension provisoire est recalculée à la liquidation définitive pour intégrer les trimestres et salaires supplémentaires acquis, ce qui améliore généralement le montant final.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — Retraite progressive</h2>
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
