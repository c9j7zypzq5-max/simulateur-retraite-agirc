import { useState, useEffect } from "react";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection, Toggle,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

// ─── Logique de calcul rendement locatif ──────────────────────────────────────
function calcRendement({ prix, neuf, travaux, apport, loyer, chargesCopro, taxeFonciere, gestionLocative }) {
  if (!prix || !loyer) return {
    fraisNotaire: 0, prixRevient: 0, rendementBrut: 0,
    chargesAnnuelles: 0, gestionLocativeAnnuelle: 0,
    rendementNet: 0, cashflowMensuel: 0,
    rendementFondsPropres: 0, dureeAmortissement: 0,
  };

  const tauxNotaire = neuf ? 0.025 : 0.075;
  const fraisNotaire = prix * tauxNotaire;
  const prixRevient = prix + fraisNotaire + (travaux || 0);

  const gestionLocativeAnnuelle = gestionLocative ? loyer * 12 * 0.08 : 0;
  const chargesAnnuelles = chargesCopro * 12 + taxeFonciere + gestionLocativeAnnuelle;

  const rendementBrut = (loyer * 12) / prixRevient * 100;
  const rendementNet = chargesAnnuelles > 0
    ? ((loyer * 12 - chargesAnnuelles) / prixRevient) * 100
    : (loyer * 12) / prixRevient * 100;

  const cashflowMensuel = loyer - chargesCopro - (taxeFonciere / 12) - (gestionLocativeAnnuelle / 12);
  const cashflowAnnuel = loyer * 12 - chargesAnnuelles;
  const dureeAmortissement = cashflowAnnuel > 0 ? prixRevient / cashflowAnnuel : 0;

  const rendementFondsPropres = apport > 0
    ? (cashflowAnnuel / apport) * 100
    : 0;

  return {
    fraisNotaire,
    prixRevient,
    rendementBrut,
    chargesAnnuelles,
    gestionLocativeAnnuelle,
    rendementNet,
    cashflowMensuel,
    cashflowAnnuel,
    rendementFondsPropres,
    dureeAmortissement,
  };
}

const FAQ = [
  { q: "Quelle est la différence entre rendement brut et rendement net ?", a: "Le rendement brut compare le loyer annuel au prix d'achat (sans tenir compte des charges). Le rendement net déduit toutes les charges (copropriété, taxe foncière, gestion) du loyer pour donner une vision réaliste de votre rentabilité réelle." },
  { q: "Comment sont calculés les frais de notaire ?", a: "Pour un bien neuf, les frais de notaire sont estimés à 2,5 % du prix (TVA incluse dans le prix). Pour l'ancien, comptez 7 à 8 % (frais légaux + droits de mutation). Ce simulateur applique 2,5 % neuf et 7,5 % ancien." },
  { q: "Qu'est-ce que la durée d'amortissement ?", a: "C'est le nombre d'années nécessaires pour récupérer votre investissement initial grâce aux cash-flows nets annuels (loyer - charges). Par exemple, une durée de 15 ans signifie que votre bien sera rentable au bout de 15 ans." },
  { q: "Comment calculer le rendement selon la fiscalité réelle ?", a: "Ce simulateur affiche le rendement net théorique. Votre imposition dépend de votre régime fiscal (micro-foncier 30 %, réel, LMNP). Consultez un expert pour intégrer la fiscalité personnalisée à votre situation." },
];

export default function RendementLocatif() {
  const [theme, setTheme] = useTheme();

  const [prix, setPrix]               = useState(null);
  const [neuf, setNeuf]               = useState(false);
  const [travaux, setTravaux]         = useState(0);
  const [apport, setApport]           = useState(0);
  const [loyer, setLoyer]             = useState(null);
  const [chargesCopro, setChargesCopro] = useState(0);
  const [taxeFonciere, setTaxeFonciere] = useState(0);
  const [gestionLocative, setGestionLocative] = useState(false);

  useEffect(() => {
    document.title = "Simulateur Rendement Locatif 2025 — Rentabilité investissement immobilier";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez le rendement brut et net de votre investissement locatif : loyers, charges, cash-flow mensuel et retour sur fonds propres.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'rendement-locatif' });
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'rendement-locatif' })
    }).catch(() => {});
  }, []);

  const res = calcRendement({ prix, neuf, travaux, apport, loyer, chargesCopro, taxeFonciere, gestionLocative });
  const rendementBrutAnim = useAnimatedNumber(res.rendementBrut);
  const rendementNetAnim = useAnimatedNumber(res.rendementNet);
  const cashflowAnim = useAnimatedNumber(res.cashflowMensuel);

  const hasResult = prix > 0 && loyer > 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="📊"
          badge="Immobilier · Simulation 2026"
          title="Rendement locatif"
          desc="Évaluez la rentabilité brute et nette d'un investissement locatif selon les charges, la fiscalité et les frais de gestion."
        />

        {/* Formulaire — Bien */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 32px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Le bien immobilier</h2>
          <NumInput id="prix" label="Prix d'achat" value={prix} onChange={setPrix} unit="€" min={20000} max={5000000}
            hint={prix ? `Frais notaire estimés : ${fmtEur(prix * (neuf ? 0.025 : 0.075))}` : "Montant avant frais"}
          />
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Type de bien</label>
            <Toggle options={["Ancien", "Neuf"]} checked={neuf} onChange={setNeuf} />
          </div>
          <StepperInput
            label="Travaux et rénovation (optionnel)"
            value={travaux} onChange={setTravaux} min={0} max={500000} step={5000} unit=" €"
            hint={travaux > 0 ? `Ajouté au coût d'acquisition` : "Laissez à 0 si pas de travaux prévus"}
          />
          <StepperInput
            label="Apport personnel (optionnel)"
            value={apport} onChange={setApport} min={0} max={999999} step={10000} unit=" €"
            hint={apport > 0 ? `Permet de calculer le rendement sur fonds propres` : "Votre contribution personnelle (hors emprunt)"}
          />
        </div>

        {/* Formulaire — Revenus */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 32px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Revenus et charges</h2>
          <NumInput id="loyer" label="Loyer mensuel" value={loyer} onChange={setLoyer} unit="€/mois" min={100} max={10000}
            hint={loyer ? `Annualisé : ${fmtEur(loyer * 12)}/an` : "Loyer hors charges"}
          />
          <NumInput id="charges-copro" label="Charges de copropriété" value={chargesCopro} onChange={setChargesCopro} unit="€/mois" min={0} max={2000}
            hint={chargesCopro > 0 ? `Annualisées : ${fmtEur(chargesCopro * 12)}/an` : "Charges communes (immeuble)"}
          />
          <NumInput id="taxe-fonciere" label="Taxe foncière" value={taxeFonciere} onChange={setTaxeFonciere} unit="€/an" min={0} max={50000}
            hint="Charge annuelle fixe"
          />
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Gestion locative (8 % du loyer)</label>
            <Toggle options={["Non facturée", "Facturée par agence"]} checked={gestionLocative} onChange={setGestionLocative} />
          </div>
        </div>

        {/* Résultats */}
        {hasResult && (
          <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Rentabilité estimée</h2>

            {/* Rendement brut */}
            <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Rendement brut</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {rendementBrutAnim.toFixed(2)} %
              </div>
            </div>

            {/* Rendement net */}
            <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Rendement net (après charges)</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,8vw,56px)", fontWeight: 700, lineHeight: 1, color: res.rendementNet > 0 ? "var(--text)" : "rgba(239,68,68,0.8)" }}>
                {rendementNetAnim.toFixed(2)} %
              </div>
              {res.cashflowAnnuel <= 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: "rgba(239,68,68,0.8)" }}>
                  ⚠️ Flux négatif : charges supérieures aux revenus
                </div>
              )}
            </div>

            {/* Chips récapitulatif */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
              <Chip label="Prix de revient" value={fmtEur(res.prixRevient)} />
              <Chip label="Cash-flow mensuel" value={fmtEur(Math.round(res.cashflowMensuel * 100) / 100)} accent={res.cashflowMensuel > 0} />
              {apport > 0 && <Chip label="Rendement fonds propres" value={`${res.rendementFondsPropres.toFixed(2)} %`} accent />}
              {res.dureeAmortissement > 0 && <Chip label="Durée amortissement" value={`${Math.round(res.dureeAmortissement)} ans`} />}
            </div>
          </div>
        )}

        {!hasResult && prix === null && loyer === null && (
          <div style={{ textAlign: "center", padding: "40px 28px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, color: "var(--text-secondary)" }}>
            Saisissez le prix du bien et le loyer pour voir votre estimation.
          </div>
        )}

        {/* Détail charges */}
        {hasResult && (
          <AccordionSection title="Détail des charges annuelles" subtitle="Ventilation par type">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Copropriété</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{fmtEur(chargesCopro * 12)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Taxe foncière</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{fmtEur(taxeFonciere)}</div>
              </div>
              {gestionLocative && (
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Gestion locative (8 %)</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{fmtEur(res.gestionLocativeAnnuelle)}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Total annuel</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>{fmtEur(res.chargesAnnuelles)}</div>
              </div>
            </div>
            <ProgressBar label="Charges / Revenus locatifs" value={res.chargesAnnuelles} total={loyer * 12} color="linear-gradient(90deg,rgba(239,68,68,0.6),rgba(239,68,68,0.3))" />
          </AccordionSection>
        )}

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Rendement brut et rendement net</h3>
            <p style={{ marginBottom: 16 }}>Le rendement brut d'un investissement locatif se calcule simplement : (loyer annuel / prix d'acquisition) × 100. Il donne une première indication rapide mais ne tient pas compte des charges. Le rendement net déduit les charges non récupérables (taxe foncière, charges de copropriété, frais de gestion, entretien) et les impôts. Un rendement brut de 6 % peut tomber à 3,5 % net selon la fiscalité et les charges du bien.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Charges déductibles et fiscalité</h3>
            <p style={{ marginBottom: 16 }}>En régime réel (location nue), les charges déductibles comprennent les intérêts d'emprunt, la taxe foncière, les primes d'assurance, les travaux d'entretien et de réparation, et les frais de gestion. Le déficit foncier est imputable sur le revenu global dans la limite de 10 750 € par an. En location meublée (LMNP), l'amortissement comptable du bien peut annuler fiscalement le revenu locatif pendant de nombreuses années.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Le cash-flow : indicateur clé</h3>
            <p>Le cash-flow mesure ce qu'il reste réellement dans votre poche chaque mois après avoir payé toutes les charges et le remboursement du crédit. Un cash-flow positif signifie que le loyer finance le bien et génère un surplus. Un cash-flow nul ou légèrement négatif est souvent acceptable si le bien prend de la valeur dans le temps — c'est la notion de rentabilité globale qui intègre la plus-value potentielle à la revente.</p>
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
