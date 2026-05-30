import { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, Toggle, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

// ─── Paramètres Fonction Publique 2026 ───────────────────────────────────────
const DUREE_REQUISE = 172; // trimestres (post-réforme 2023, nés 1965+)
const TAUX_MAX      = 0.75;
// Valeur du point d'indice 2026 (approximation)
// Salaire = indice_majoré × 4.9246 / 12 € brut/mois → user saisit directement le traitement

function calcFP({ traitement, anneesFaites, anneesRestantes, ageDépart, categActive, bonus3Enfants }) {
  if (!traitement) return {
    pensionBrute: 0, pensionNette: 0,
    trimestresService: 0, tauxLiquidation: 0, decote: 0, surcote: 0,
  };

  const ageLegal = categActive ? 59 : 64; // catégorie active: âge légal réduit de 5 ans
  const ageDép   = ageDépart ?? ageLegal;
  const trim     = ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4;
  const prorat   = Math.min(trim / DUREE_REQUISE, 1);

  const trimManquants = Math.max(0, DUREE_REQUISE - trim);
  const trimSuppl     = Math.max(0, trim - DUREE_REQUISE);

  let decote = 0, surcote = 0;
  if (ageDép < 67 && trimManquants > 0 && ageDép < ageLegal + (DUREE_REQUISE - trim) / 4) {
    decote = Math.min(trimManquants, 20) * 0.00625;
  }
  if (trim >= DUREE_REQUISE && ageDép >= ageLegal) {
    surcote = trimSuppl * 0.0125;
  }

  const tauxLiquidation = Math.min(Math.max(TAUX_MAX * prorat - decote + surcote, 0), TAUX_MAX);
  const coefEnfants = bonus3Enfants ? 1.10 : 1.00;
  const pensionBrute = traitement * tauxLiquidation * coefEnfants;
  const pensionNette = pensionBrute * 0.917; // ~8.3% prélèvements

  return { pensionBrute, pensionNette, trimestresService: trim, tauxLiquidation, decote, surcote, prorat, trimManquants, trimSuppl, ageLegal };
}

const FAQ = [
  { q: "Quel est le taux maximum de pension dans la fonction publique ?", a: "Le taux maximum est de 75 % du traitement indiciaire brut (hors primes). Ce taux est atteint lorsque vous avez validé les trimestres requis (172 pour les nés après 1964) et que vous partez à l'âge légal ou après. La réforme 2023 a aligné progressivement les règles avec le régime général." },
  { q: "Qu'est-ce que la catégorie active ?", a: "Les agents de catégorie active exercent des métiers à risques particuliers (policiers, pompiers, personnel soignant, surveillants pénitentiaires…). Ils bénéficient d'un droit à départ anticipé de 5 ans par rapport aux agents sédentaires. L'âge légal est donc de 59 ans pour les nés en 1965+." },
  { q: "Les primes sont-elles prises en compte dans la pension ?", a: "Non. La pension de base fonction publique est calculée exclusivement sur le traitement indiciaire brut (hors primes, heures supplémentaires, NBI). C'est pour compenser cela que le régime RAFP (Retraite Additionnelle de la Fonction Publique) a été créé : il prend en compte une partie des primes." },
  { q: "Quelle différence avec le régime CNRACL ?", a: "Le régime CNRACL s'applique aux fonctionnaires territoriaux et hospitaliers. Le régime de la Fonction Publique d'État (SRE) s'applique aux fonctionnaires civils et militaires de l'État. Les règles de calcul sont très proches ; ce simulateur s'applique aux deux régimes (sédentaires ou actifs)." },
];

export default function FonctionPublique() {
  const [theme, setTheme] = useTheme();

  const [traitement, setTraitement]       = useState(null);
  const [anneesFaites, setAnneesFaites]   = useState(null);
  const [anneesRestantes, setAnneesRest]  = useState(null);
  const [ageDépart, setAgeDépart]         = useState(null);
  const [categActive, setCategActive]     = useState(false);
  const [bonus3Enfants, setBonus3Enfants] = useState(false);

  useEffect(() => {
    document.title = "Simulateur Retraite Fonction publique 2026 — mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Estimez votre pension de retraite de la fonction publique selon votre traitement indiciaire, vos années de service et votre catégorie.");
  }, []);

  const res = calcFP({ traitement, anneesFaites, anneesRestantes, ageDépart, categActive, bonus3Enfants });
  const pensionAnim = useAnimatedNumber(res.pensionNette);
  const hasResult = res.pensionNette > 0;
  const totalTrim = ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="⚖️"
          badge="Fonctionnaires · Données 2026"
          title="Simulateur Retraite Fonction publique"
          subtitle="Estimation en 30 secondes · Données officielles 2026"
          desc="Calculez votre pension selon votre traitement indiciaire, votre durée de service et votre catégorie (sédentaire ou active)."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Taux maximum : 75 %", "✓ 172 trimestres requis (nés 1965+)", "✓ Catégories sédentaire & active"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>

          <NumInput id="traitement" label="Traitement indiciaire brut mensuel" value={traitement} onChange={setTraitement} unit="€" min={500} max={15000}
            hint={traitement ? `Annuel : ${fmtEur(traitement * 12)} · Hors primes et NBI` : "Traitement brut (indice majoré × valeur du point), hors primes"}
            tooltip="Le traitement brut = indice majoré × valeur du point d'indice (≈ 4.9246 €/point/an). Les primes ne sont pas prises en compte dans la pension de base."
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput id="annees-service-passees" label="Années de service passées" value={anneesFaites} onChange={setAnneesFaites} unit="ans" min={0} max={45}
              hint={anneesFaites !== null ? `Soit ${anneesFaites * 4} trimestres` : undefined}
            />
            <NumInput id="annees-service-restantes" label="Années de service restantes" value={anneesRestantes} onChange={setAnneesRest} unit="ans" min={0} max={45}
              hint={anneesRestantes !== null ? `+${anneesRestantes * 4} trimestres futurs` : undefined}
            />
          </div>

          {/* Statut */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Catégorie</div>
              <div style={{ fontSize: 11, color: "var(--gold-mid)" }}>
                {categActive ? "Active : âge légal 59 ans (nés 1965+)" : "Sédentaire : âge légal 64 ans (nés 1965+)"}
              </div>
            </div>
            <Toggle options={["Sédentaire", "Active"]} checked={categActive} onChange={setCategActive} />
          </div>

          {/* Résumé */}
          <div style={{ background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.15)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap" }}>
            {[
              { l: "Trimestres service", v: `${totalTrim}`, gold: true },
              { l: "Durée requise", v: `${DUREE_REQUISE} trim.` },
              { l: "Proratisation", v: `${Math.min(Math.round((totalTrim / DUREE_REQUISE) * 100), 100)} %` },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: item.gold ? "var(--gold)" : "var(--text)" }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Paramètres avancés */}
        <AccordionSection title="Paramètres avancés" subtitle="Âge de départ, bonus enfants">
          <StepperInput label="Âge de départ prévu" value={ageDépart} onChange={setAgeDépart}
            min={categActive ? 57 : 62} max={70} unit=" ans"
            hint={`Âge légal pour votre catégorie : ${categActive ? 59 : 64} ans · Annulation décote : 67 ans`}
            tooltip="L'âge minimum de départ varie selon la catégorie. Partir avant l'âge légal sans taux plein entraîne une décote."
          />
          <div onClick={() => setBonus3Enfants(b => !b)} role="checkbox" aria-checked={bonus3Enfants} tabIndex={0}
            onKeyDown={e => (e.key === " " || e.key === "Enter") && setBonus3Enfants(b => !b)}
            style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", padding: "12px 16px", borderRadius: 12, background: bonus3Enfants ? "rgba(184,147,74,0.08)" : "var(--card-bg)", border: `1px solid ${bonus3Enfants ? "rgba(184,147,74,0.3)" : "var(--border)"}`, transition: "all 0.2s" }}>
            <div aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${bonus3Enfants ? "rgba(184,147,74,0.8)" : "var(--border)"}`, background: bonus3Enfants ? "rgba(184,147,74,0.3)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              {bonus3Enfants && <span style={{ color: "var(--gold)", fontSize: 13 }}>✓</span>}
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>3 enfants ou plus élevés</div>
              <div style={{ fontSize: 12, color: bonus3Enfants ? "var(--gold)" : "var(--text-secondary)", marginTop: 2 }}>Majoration de <strong>+10 %</strong> sur la pension</div>
            </div>
          </div>
        </AccordionSection>

        {/* Résultats */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre pension estimée</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Pension nette mensuelle estimée</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  aria-label={`${Math.round(res.pensionNette)} euros par mois`}>
                  {pensionAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  soit <strong>{fmtEur(res.pensionBrute)}/mois brut</strong> avant prélèvements (~8,3 %)
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              <div style={{ background: res.decote > 0 ? "rgba(239,68,68,0.07)" : res.surcote > 0 ? "rgba(34,197,94,0.07)" : "var(--card-bg)", border: `1px solid ${res.decote > 0 ? "rgba(239,68,68,0.25)" : res.surcote > 0 ? "rgba(34,197,94,0.25)" : "var(--border)"}`, borderRadius: 12, padding: "13px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 4 }}>Taux de liquidation</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {res.decote > 0 && <span style={{ color: "#f87171" }}>Décote −{(res.decote * 100).toFixed(2)} %</span>}
                    {res.surcote > 0 && <span style={{ color: "#4ade80" }}>Surcote +{(res.surcote * 100).toFixed(2)} %</span>}
                    {res.decote === 0 && res.surcote === 0 && "Taux plein"}
                    {bonus3Enfants && <span style={{ marginLeft: 8, color: "#4ade80" }}>+ 10 % (enfants)</span>}
                  </div>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: "var(--gold)" }}>
                  {(res.tauxLiquidation * 100).toFixed(2)} %
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="Taux brut" value={`${(res.tauxLiquidation * 100).toFixed(1)} %`} />
                <Chip label="Proratisation" value={`${(res.prorat * 100).toFixed(0)} %`} />
                <Chip label="Pension brute" value={`${fmtEur(res.pensionBrute)}`} accent />
              </div>

              <ProgressBar label="Trimestres de service" value={res.trimestresService} total={DUREE_REQUISE} color="linear-gradient(90deg,var(--gold-mid),var(--gold))" />

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Simulation indicative.</strong> Les primes et le RAFP ne sont pas inclus. Pour un calcul officiel :&nbsp;
                <a href="https://www.info-retraite.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>info-retraite.fr</a>.
              </div>
            </>
          )}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — Fonction publique</h2>
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
