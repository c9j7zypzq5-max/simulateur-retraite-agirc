import { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, AccordionSection, Toggle,
  Chip, useAnimatedNumber, fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

// ─── Calcul abattements ────────────────────────────────────────────────────────
function calcAbattementIR(duree) {
  if (duree < 6) return 0;
  if (duree < 22) return Math.min((duree - 5) * 6, 96);
  return 100;
}

function calcAbattementPS(duree) {
  if (duree < 6) return 0;
  if (duree < 22) return Math.min((duree - 5) * 1.65, 26.4 + 1.6);
  if (duree < 30) return Math.min(26.4 + 1.6 + (duree - 22) * 9, 100);
  return 100;
}

function calcPlusValue({ prixAchat, anneeAchat, anneeVente, travaux, inclureFrais, prixVente }) {
  if (!prixAchat || !anneeAchat || !anneeVente || !prixVente) {
    return {
      duree: 0, pvBrute: 0, baseIR: 0, basePS: 0, impotIR: 0, impotPS: 0,
      totalImpot: 0, gainNet: 0, prixAchatNet: 0, abattIR: 0, abattPS: 0,
    };
  }

  // Durée de détention
  const duree = Math.floor(anneeVente - anneeAchat);

  // Frais d'acquisition
  const fraisAcq = inclureFrais ? prixAchat * 0.075 : 0;
  const prixAchatNet = prixAchat + fraisAcq + travaux;

  // Plus-value
  const pvBrute = Math.max(0, prixVente - prixAchatNet);

  // Abattements
  const abattIR = calcAbattementIR(duree);
  const abattPS = calcAbattementPS(duree);

  // Bases imposables
  const baseIR = pvBrute * (1 - abattIR / 100);
  const basePS = pvBrute * (1 - abattPS / 100);

  // Impôts
  const impotIR = baseIR * 0.19;
  const impotPS = basePS * 0.172;
  const totalImpot = impotIR + impotPS;

  // Gain net vendeur
  const gainNet = prixVente - prixAchat - totalImpot;

  return {
    duree, pvBrute, baseIR, basePS, impotIR, impotPS,
    totalImpot, gainNet, prixAchatNet, abattIR, abattPS,
  };
}

const FAQ = [
  {
    q: "La résidence principale bénéficie-t-elle d'une exonération ?",
    a: "Oui, absolument. Les plus-values immobilières réalisées sur la résidence principale sont totalement exonérées d'impôt sur le revenu et de prélèvements sociaux. Ce simulateur s'applique aux résidences secondaires et biens d'investissement. Consultez votre notaire pour les régimes particuliers (propriété démembrée, indivision, etc.)."
  },
  {
    q: "À partir de quand la plus-value est-elle exonérée ?",
    a: "Pour l'impôt sur le revenu (IR), après 22 ans de détention, l'abattement atteint 100 % : vous ne payez que les prélèvements sociaux. Pour les prélèvements sociaux (17,2 %), l'exonération totale intervient après 30 ans de détention. Il existe également une exonération de 100 % si la vente concerne un petit immeuble de faible valeur (< 15 000 €) et certains cas particuliers."
  },
  {
    q: "Qu'est-ce que la surtaxe à 33,33 % ?",
    a: "Si votre plus-value brute dépasse 50 000 €, une surtaxe de 33,33 % s'ajoute aux prélèvements sociaux sur la partie excédentaire (17,2 % + 33,33 % = 50,53 % de taux marginal). Ce simulateur n'inclut pas cette surtaxe. Pour une plus-value supérieure à 50 000 €, consultez votre notaire."
  },
  {
    q: "Quels travaux déductibles compte-t-on ?",
    a: "Seuls les travaux de rénovation/amélioration réalisés par une entreprise (facture à l'appui) peuvent être déduits du prix d'acquisition. Sont exclus : l'entretien courant, la peinture, vos travaux personnels. Le notaire établira la liste exacte lors de la vente. Le seuil peut impacter les droits d'enregistrement selon les cas."
  },
];

export default function PlusValue() {
  const [theme, setTheme] = useTheme();

  const [prixAchat, setPrixAchat]         = useState(null);
  const [anneeAchat, setAnneeAchat]       = useState(null);
  const [anneeVente, setAnneeVente]       = useState(null);
  const [travaux, setTravaux]             = useState(0);
  const [inclureFrais, setInclureFrais]   = useState(true);
  const [prixVente, setPrixVente]         = useState(null);

  useEffect(() => {
    document.title = "Simulateur Plus-Value Immobilière 2025 — Calcul IR et prélèvements sociaux";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez la plus-value immobilière nette après abattements pour durée de détention : IR (22 ans) et prélèvements sociaux (30 ans).");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
  }, []);

  const isValid = prixVente && prixVente > 0 && anneeAchat && anneeVente && anneeVente > anneeAchat;
  const res = isValid ? calcPlusValue({ prixAchat, anneeAchat, anneeVente, travaux, inclureFrais, prixVente }) : null;
  const totalImpotAnim = useAnimatedNumber(res?.totalImpot || 0);

  const hasResult = res && res.totalImpot > 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="📈"
          badge="Impôts · Simulation 2025"
          title="Plus-value immobilière"
          desc="Calculez l'imposition de la plus-value lors de la vente d'un bien immobilier selon la durée de détention."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ IR + Prélèvements sociaux", "✓ Abattements 2025 à jour", "✓ Résidence principale exonérée"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)", marginBottom: 0 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre bien et durée de détention</h2>

          <NumInput
            id="prix-achat"
            label="Prix d'acquisition"
            value={prixAchat}
            onChange={setPrixAchat}
            unit="€"
            min={0}
            max={10_000_000}
            hint="Prix effectivement payé (hors frais notaire si option activée ci-dessous)"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput
              id="annee-achat"
              label="Année d'achat"
              value={anneeAchat}
              onChange={setAnneeAchat}
              min={1950}
              max={2024}
            />
            <NumInput
              id="annee-vente"
              label="Année de vente"
              value={anneeVente}
              onChange={setAnneeVente}
              min={2025}
              max={2060}
            />
          </div>

          <NumInput
            id="travaux"
            label="Travaux réalisés"
            value={travaux}
            onChange={setTravaux}
            unit="€"
            min={0}
            max={1_000_000}
            hint="Travaux réalisés par entreprise uniquement (avec facture)"
          />

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              Frais d'acquisition
            </label>
            <Toggle
              options={["Exclure (prix net)", "Inclure 7,5 %"]}
              checked={inclureFrais}
              onChange={setInclureFrais}
            />
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)" }}>
              {inclureFrais && prixAchat ? `Frais notaire estimés : ${fmtEur(prixAchat * 0.075)}` : "Les frais notaire font partie du prix de revient"}
            </div>
          </div>

          <NumInput
            id="prix-vente"
            label="Prix de vente"
            value={prixVente}
            onChange={setPrixVente}
            unit="€"
            min={0}
            max={10_000_000}
            hint="Prix de vente hors frais d'agence"
          />

          {/* Barre récapitulative */}
          {res && res.pvBrute > 0 && (
            <div style={{ background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.15)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap", marginTop: 4 }}>
              {[
                { l: "Plus-value brute", v: fmtEur(res.pvBrute), gold: true },
                { l: "Durée de détention", v: `${res.duree} ans` },
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
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Impôt et gain net</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Impôt total (IR + PS)</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  aria-label={`${Math.round(res.totalImpot)} euros d'impôt`}>
                  {totalImpotAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  taux global : <strong>{(res.totalImpot / res.pvBrute * 100).toFixed(1)} %</strong> de la plus-value
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="IR (19 %)" value={fmtEur(res.impotIR)} accent />
                <Chip label="PS (17,2 %)" value={fmtEur(res.impotPS)} accent />
                <Chip label="Plus-value brute" value={fmtEur(res.pvBrute)} />
                <Chip label="Gain net vendeur" value={fmtEur(res.gainNet)} />
              </div>

              {/* Abattements par durée */}
              <AccordionSection title="Abattements pour durée de détention" subtitle={`Votre bien : ${res.duree} ans`}>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          <th style={{ textAlign: "left", padding: 8, color: "var(--text-secondary)", fontWeight: 600 }}>Durée</th>
                          <th style={{ textAlign: "right", padding: 8, color: "var(--text-secondary)", fontWeight: 600 }}>Abatt. IR</th>
                          <th style={{ textAlign: "right", padding: 8, color: "var(--text-secondary)", fontWeight: 600 }}>Abatt. PS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { dur: "< 6 ans", ir: "0 %", ps: "0 %" },
                          { dur: "6 ans", ir: "6 %", ps: "1,65 %" },
                          { dur: "10 ans", ir: "30 %", ps: "8,25 %" },
                          { dur: "15 ans", ir: "60 %", ps: "16,5 %" },
                          { dur: "22 ans", ir: "96 %", ps: "27 %" },
                          { dur: "26 ans", ir: "100 %", ps: "63 %" },
                          { dur: "30 ans", ir: "100 %", ps: "100 %" },
                        ].map((row, i) => {
                          const highlight = (res.duree >= parseInt(row.dur)) && (i === 0 || res.duree < parseInt([
                            { dur: "< 6 ans" }, { dur: "6 ans" }, { dur: "10 ans" }, { dur: "15 ans" }, { dur: "22 ans" }, { dur: "26 ans" }, { dur: "30 ans" }
                          ][i + 1]?.dur || 999));
                          return (
                            <tr key={i} style={{
                              background: highlight ? "rgba(184,147,74,0.1)" : "transparent",
                              borderBottom: "1px solid rgba(184,147,74,0.08)"
                            }}>
                              <td style={{ padding: 8, color: highlight ? "var(--gold)" : "var(--text)" }}>{row.dur}</td>
                              <td style={{ textAlign: "right", padding: 8, color: highlight ? "var(--gold)" : "var(--text)" }}>{row.ir}</td>
                              <td style={{ textAlign: "right", padding: 8, color: highlight ? "var(--gold)" : "var(--text)" }}>{row.ps}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Votre abattement IR</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--gold)" }}>{res.abattIR.toFixed(0)} %</div>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>Gain : {fmtEur(res.pvBrute * res.abattIR / 100)}</div>
                    </div>
                    <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Votre abattement PS</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--gold)" }}>{res.abattPS.toFixed(1)} %</div>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>Gain : {fmtEur(res.pvBrute * res.abattPS / 100)}</div>
                    </div>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: "var(--text)" }}>Base IR :</strong> {fmtEur(res.pvBrute)} × (1 − {res.abattIR.toFixed(0)}%) = {fmtEur(res.baseIR)}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: "var(--text)" }}>Base PS :</strong> {fmtEur(res.pvBrute)} × (1 − {res.abattPS.toFixed(1)}%) = {fmtEur(res.basePS)}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: "var(--text)" }}>IR :</strong> {fmtEur(res.baseIR)} × 19% = {fmtEur(res.impotIR)}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: "var(--text)" }}>PS :</strong> {fmtEur(res.basePS)} × 17,2% = {fmtEur(res.impotPS)}
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid var(--border)", color: "var(--text)" }}>
                      <strong>Gain net vendeur :</strong> {fmtEur(prixVente)} − {fmtEur(prixAchat)} − {fmtEur(res.totalImpot)} = {fmtEur(res.gainNet)}
                    </div>
                  </div>
                </div>
              </AccordionSection>

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Résidence principale exonérée.</strong> Hors surtaxe (plus-value {">"}50 k€) et cas particuliers (propriété démembrée, droits d'enregistrement, frais de vente agence). Votre notaire établira le calcul exact à partir du compromis de vente.
              </div>
            </>
          )}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — Plus-value</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Conseil : consultez votre notaire ou un expert fiscal pour un calcul détaillé.
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
