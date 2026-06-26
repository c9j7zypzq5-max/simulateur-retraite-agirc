// Route à ajouter dans src/App.jsx :
//   <Route path="/simulateurs/comparaison-reforme" element={<ComparaisonReforme />} />

import { useState, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import { FAQS } from '../../data/faqs.js';
import { NumInput, StepperInput, Chip, fmtEur, SimulateurHeader, FaqSection } from "../../components/ui.jsx";

// ─── Règles AVANT réforme (système pré-2023) ────────────────────────────────
function getAvantReforme(anneeNaissance) {
  // Âge légal : 62 ans pour tous (avant la loi Borne)
  const ageLegal = 62;

  // Durée pour taux plein — barème pré-2023
  let duree;
  if (anneeNaissance <= 1951) duree = 164;
  else if (anneeNaissance <= 1952) duree = 164;
  else if (anneeNaissance <= 1953) duree = 165;
  else if (anneeNaissance <= 1954) duree = 165;
  else if (anneeNaissance <= 1955) duree = 166;
  else if (anneeNaissance <= 1957) duree = 166;
  else if (anneeNaissance <= 1960) duree = 167;
  else if (anneeNaissance <= 1963) duree = 168;
  else if (anneeNaissance <= 1966) duree = 169;
  else if (anneeNaissance <= 1971) duree = 170;
  else if (anneeNaissance <= 1975) duree = 171;
  else duree = 172;

  return { ageLegal, duree, label: "Avant réforme (système pré-2023)" };
}

// ─── Règles APRÈS réforme (Loi Borne 2023, en vigueur progressivement) ──────
function getApresReforme(anneeNaissance) {
  // Âge légal progressif
  let ageLegalAns, ageLegalLabel;
  if (anneeNaissance <= 1961) { ageLegalAns = 62; ageLegalLabel = "62 ans"; }
  else if (anneeNaissance === 1962) { ageLegalAns = 62 + 3/12; ageLegalLabel = "62 ans 3 mois"; }
  else if (anneeNaissance === 1963) { ageLegalAns = 62 + 6/12; ageLegalLabel = "62 ans 6 mois"; }
  else if (anneeNaissance === 1964) { ageLegalAns = 63; ageLegalLabel = "63 ans"; }
  else if (anneeNaissance === 1965) { ageLegalAns = 63 + 3/12; ageLegalLabel = "63 ans 3 mois"; }
  else if (anneeNaissance === 1966) { ageLegalAns = 63 + 6/12; ageLegalLabel = "63 ans 6 mois"; }
  else { ageLegalAns = 64; ageLegalLabel = "64 ans"; }

  // Durée pour taux plein — barème post-réforme
  let duree;
  if (anneeNaissance <= 1961) duree = 167;
  else if (anneeNaissance === 1962) duree = 168;
  else if (anneeNaissance === 1963) duree = 169;
  else if (anneeNaissance === 1964) duree = 169;
  else if (anneeNaissance === 1965) duree = 170;
  else if (anneeNaissance === 1966) duree = 171;
  else duree = 172;

  return { ageLegalAns, ageLegal: ageLegalAns, ageLegalLabel, duree };
}

// ─── Calcul de pension simplifié CNAV ────────────────────────────────────────
// pension = SAM × 50 % × min(1, trimestres / durée_requise)
function calcPension(sam, trimestres, duree) {
  const PASS = 48_060; // plafond annuel 2026
  const samPlafonné = Math.min(sam, PASS);
  const prorata = Math.min(trimestres / duree, 1);
  const pensionBrute = (samPlafonné * 0.5 * prorata) / 12;
  return { pensionBrute, pensionNette: pensionBrute * 0.93, prorata };
}

// ─── Calcul comparatif complet ────────────────────────────────────────────────
function calcComparaison({ anneeNaissance, trimestres, sam }) {
  if (!anneeNaissance || !trimestres || !sam) return null;

  const avant = getAvantReforme(anneeNaissance);
  const apres = getApresReforme(anneeNaissance);

  // --- AVANT ---
  // Départ au taux plein = dès 62 ans si trimestres suffisants, sinon décote
  const trimsManquantsAvant = Math.max(0, avant.duree - trimestres);

  // Pension si départ à 62 ans (avec éventuelle décote)
  let pensionAvant62;
  if (trimsManquantsAvant > 0) {
    // Décote : 0.625% par trim manquant, max 20 trim
    const decote = Math.min(trimsManquantsAvant, 20) * 0.00625;
    const prorata = Math.min(trimestres / avant.duree, 1);
    const PASS = 48_060;
    const samPlafonné = Math.min(sam, PASS);
    pensionAvant62 = ((samPlafonné * (0.5 - decote) * prorata) / 12) * 0.93;
  } else {
    pensionAvant62 = calcPension(sam, trimestres, avant.duree).pensionNette;
  }

  // Pension taux plein avant réforme
  const { pensionNette: pensionAvantTauxPlein, prorata: prorataAvant } = calcPension(sam, trimestres, avant.duree);

  // Trimestres manquants avant réforme

  // Age au taux plein avant réforme
  const trimsRestantsAvant = Math.max(0, avant.duree - trimestres);
  const moisRestantsAvant = trimsRestantsAvant * 3;
  const ageTauxPleinAvant = avant.ageLegal + moisRestantsAvant / 12;

  // --- APRÈS ---
  const trimsManquantsApres = Math.max(0, apres.duree - trimestres);
  const trimsRestantsApres = Math.max(0, apres.duree - trimestres);
  const moisRestantsApres = trimsRestantsApres * 3;

  // L'âge au taux plein = max(âge légal, âge avec les trimestres)
  // Si on a déjà les trimestres, on attend l'âge légal
  const agePossibleParTrimestres = anneeNaissance + 62 + moisRestantsApres / 12; // âge actuel + attente
  const ageTauxPleinApres = Math.max(apres.ageLegalAns, 62 + moisRestantsApres / 12);

  const { pensionNette: pensionApresTauxPlein, prorata: prorataApres } = calcPension(sam, trimestres, apres.duree);

  // Écarts
  const diffMoisLegal = Math.round((apres.ageLegalAns - avant.ageLegal) * 12);
  const diffPension = pensionApresTauxPlein - pensionAvantTauxPlein;

  // Dates de départ (estimées)
  const anneeDepart = anneeNaissance + Math.floor(ageTauxPleinApres);
  const moisDepart = Math.round((ageTauxPleinApres % 1) * 12);
  const anneeDepartAvant = anneeNaissance + Math.floor(Math.max(avant.ageLegal, ageTauxPleinAvant));

  return {
    avant: {
      ageLegal: avant.ageLegal,
      ageLegalLabel: `${avant.ageLegal} ans`,
      duree: avant.duree,
      trimsManquants: trimsManquantsAvant,
      ageTauxPlein: Math.max(avant.ageLegal, ageTauxPleinAvant),
      anneeDepart: anneeDepartAvant,
      pension62: Math.round(Math.max(0, pensionAvant62)),
      pensionTauxPlein: Math.round(Math.max(0, pensionAvantTauxPlein)),
      prorata: prorataAvant,
    },
    apres: {
      ageLegal: apres.ageLegalAns,
      ageLegalLabel: apres.ageLegalLabel,
      duree: apres.duree,
      trimsManquants: trimsManquantsApres,
      ageTauxPlein: ageTauxPleinApres,
      anneeDepart,
      moisDepart,
      pensionTauxPlein: Math.round(Math.max(0, pensionApresTauxPlein)),
      prorata: prorataApres,
    },
    diff: {
      moisTravailSupp: diffMoisLegal,
      diffPension: Math.round(diffPension),
      anneeDepart,
      anneeDepartAvant,
    },
  };
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = FAQS['/simulateurs/comparaison-reforme'];

// ─── Sous-composants ──────────────────────────────────────────────────────────
function ColCard({ title, color, bg, border, children }) {
  return (
    <div style={{
      background: bg,
      border: `1.5px solid ${border}`,
      borderRadius: 18,
      padding: "22px 20px",
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 13,
        fontWeight: 700,
        color,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: 18,
        paddingBottom: 12,
        borderBottom: `1px solid ${border}`,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DataRow({ label, value, large, color }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "9px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      gap: 10,
    }}>
      <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, flex: 1 }}>{label}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: large ? 20 : 14,
        fontWeight: large ? 700 : 600,
        color: color || "var(--text)",
        textAlign: "right",
        flexShrink: 0,
      }}>
        {value}
      </span>
    </div>
  );
}

function ImpactBanner({ diff }) {
  if (!diff) return null;
  const { moisTravailSupp, diffPension } = diff;

  const moisStr = moisTravailSupp > 0
    ? `${moisTravailSupp} mois de travail supplémentaires`
    : "aucun mois de travail supplémentaire";
  const pensionStr = diffPension !== 0
    ? `${diffPension > 0 ? "+" : ""}${fmtEur(Math.abs(diffPension))}/mois`
    : "aucun impact sur la pension";

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.08))",
      border: "1.5px solid rgba(239,68,68,0.25)",
      borderRadius: 16,
      padding: "20px 24px",
      marginTop: 20,
      marginBottom: 4,
    }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
        Impact de la réforme sur votre profil
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
        La réforme vous impose{" "}
        <strong style={{ color: "#ef4444" }}>{moisStr}</strong>
        {diffPension !== 0 && (
          <>
            {" "}et un écart de pension de{" "}
            <strong style={{ color: diffPension < 0 ? "#ef4444" : "#22c55e" }}>{pensionStr}</strong>
          </>
        )}.
      </div>
      {moisTravailSupp > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-secondary)" }}>
          Sur une carrière, {moisTravailSupp} mois supplémentaires représentent environ{" "}
          <strong style={{ color: "var(--text)" }}>{Math.round(moisTravailSupp / 12 * 10) / 10} an{moisTravailSupp / 12 >= 2 ? "s" : ""}</strong> de travail en plus.
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function ComparaisonReforme() {
  const [theme, setTheme] = useTheme();

  const [anneeNaissance, setAnneeNaissance] = useState(1970);
  const [trimestres, setTrimestres]         = useState(120);
  const [sam, setSam]                       = useState(36000);

  usePageMeta(
    "Comparateur Réforme Retraite 2023 — Avant / Après loi Borne | simfinly.com",
    "Comparez l'impact de la réforme des retraites 2023 (loi Borne) sur votre profil : âge de départ, trimestres manquants, pension estimée. Avant vs Après en un coup d'oeil."
  );

  const res = useMemo(
    () => calcComparaison({ anneeNaissance, trimestres, sam }),
    [anneeNaissance, trimestres, sam]
  );

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 20px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          badge="Retraite · Réforme 2023"
          title="Comparateur Réforme Retraite"
          subtitle="Avant / Après — Loi Borne 2023"
          desc="Mesurez l'impact exact de la réforme des retraites 2023 sur votre profil : âge légal, trimestres requis, date de départ au taux plein et pension estimée."
        />

        {/* Réassurance */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 14,
          background: "rgba(239,68,68,0.05)",
          border: "1px solid rgba(239,68,68,0.18)",
          borderRadius: 12, padding: "12px 20px", marginBottom: 24,
          fontSize: 13, color: "var(--text-secondary)",
        }}>
          {[
            "✓ Barème officiel par génération",
            "✓ Loi Borne — entrée en vigueur progressive",
            "✓ Calcul 100 % local, aucune donnée transmise",
          ].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ ...card, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
            Votre profil
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0 }}>
            <StepperInput
              label="Année de naissance"
              value={anneeNaissance}
              onChange={setAnneeNaissance}
              min={1955}
              max={1975}
              step={1}
              tooltip="La réforme 2023 s'applique progressivement à partir de la génération 1961"
              hint={anneeNaissance ? `Génération ${anneeNaissance} — âge légal après réforme : ${getApresReforme(anneeNaissance).ageLegalLabel}` : undefined}
            />
            <NumInput
              id="trimestres"
              label="Trimestres déjà validés"
              value={trimestres}
              onChange={setTrimestres}
              min={0}
              max={200}
              hint="Disponible sur info-retraite.fr dans votre relevé de carrière"
              tooltip="Trimestres validés (travail, chômage indemnisé, maladie, maternité…)"
            />
            <NumInput
              id="sam"
              label="Salaire annuel moyen (SAM)"
              value={sam}
              onChange={setSam}
              unit="€"
              min={5000}
              max={100000}
              hint="Moyenne des 25 meilleures années · Plafonné au PASS (48 060 €)"
              tooltip="Le SAM est la moyenne de vos 25 meilleures années de salaire brut, plafonnée au PASS. Si vous ne le connaissez pas, utilisez votre salaire annuel brut actuel."
            />
          </div>
        </div>

        {/* Comparaison Avant / Après */}
        {res ? (
          <>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>
              {/* Colonne AVANT */}
              <ColCard
                title="Avant réforme — Système pré-2023"
                color="#f97316"
                bg="rgba(249,115,22,0.05)"
                border="rgba(249,115,22,0.25)"
              >
                <DataRow label="Âge légal minimal de départ" value={res.avant.ageLegalLabel} large color="#f97316" />
                <DataRow label="Trimestres requis pour le taux plein" value={`${res.avant.duree} trimestres`} />
                <DataRow
                  label="Trimestres manquants"
                  value={res.avant.trimsManquants > 0 ? `${res.avant.trimsManquants} trim.` : "Aucun ✓"}
                  color={res.avant.trimsManquants > 0 ? "#f97316" : "#22c55e"}
                />
                <DataRow
                  label="Âge au taux plein"
                  value={`${res.avant.ageTauxPlein <= res.avant.ageLegal ? res.avant.ageLegalLabel : `~${Math.floor(res.avant.ageTauxPlein)} ans ${Math.round((res.avant.ageTauxPlein % 1) * 12)} mois`}`}
                />
                <DataRow
                  label="Année estimée de départ"
                  value={`~${res.avant.anneeDepart}`}
                />
                <DataRow
                  label="Pension mensuelle nette (taux plein)"
                  value={fmtEur(res.avant.pensionTauxPlein)}
                  large
                  color="#f97316"
                />
                <DataRow
                  label="Proratisation"
                  value={`${(res.avant.prorata * 100).toFixed(0)} %`}
                />
              </ColCard>

              {/* Colonne APRÈS */}
              <ColCard
                title="Après réforme — Loi Borne 2023"
                color="#3b82f6"
                bg="rgba(59,130,246,0.05)"
                border="rgba(59,130,246,0.25)"
              >
                <DataRow label="Âge légal minimal de départ" value={res.apres.ageLegalLabel} large color="#3b82f6" />
                <DataRow label="Trimestres requis pour le taux plein" value={`${res.apres.duree} trimestres`} />
                <DataRow
                  label="Trimestres manquants"
                  value={res.apres.trimsManquants > 0 ? `${res.apres.trimsManquants} trim.` : "Aucun ✓"}
                  color={res.apres.trimsManquants > 0 ? "#ef4444" : "#22c55e"}
                />
                <DataRow
                  label="Âge au taux plein"
                  value={`~${Math.floor(res.apres.ageTauxPlein)} ans ${Math.round((res.apres.ageTauxPlein % 1) * 12)} mois`}
                />
                <DataRow
                  label="Année estimée de départ"
                  value={`~${res.apres.anneeDepart}`}
                />
                <DataRow
                  label="Pension mensuelle nette (taux plein)"
                  value={fmtEur(res.apres.pensionTauxPlein)}
                  large
                  color="#3b82f6"
                />
                <DataRow
                  label="Proratisation"
                  value={`${(res.apres.prorata * 100).toFixed(0)} %`}
                />
              </ColCard>
            </div>

            {/* Chips différences */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 20 }}>
              <Chip
                label="Mois de travail en plus (âge légal)"
                value={res.diff.moisTravailSupp > 0 ? `+${res.diff.moisTravailSupp} mois` : "Aucun impact"}
              />
              <Chip
                label="Trimestres requis en plus"
                value={res.apres.duree > res.avant.duree ? `+${res.apres.duree - res.avant.duree} trim.` : "Identiques"}
              />
              <Chip
                label="Écart de pension mensuelle"
                value={res.diff.diffPension !== 0
                  ? `${res.diff.diffPension > 0 ? "+" : ""}${fmtEur(res.diff.diffPension)}`
                  : "Aucun écart"}
                accent={res.diff.diffPension > 0}
              />
            </div>

            {/* Bannière d'impact */}
            <ImpactBanner diff={res.diff} />

            {/* Note légale */}
            <div role="note" style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 18px",
              fontSize: 11,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginTop: 16,
            }}>
              ⚠️ <strong>Simulation indicative.</strong> La pension est estimée selon la formule CNAV simplifiée :
              SAM × 50 % × proratisation (trimestres / durée requise), hors décote/surcote et hors retraite
              complémentaire Agirc-Arrco. Pour une estimation personnalisée officielle :{" "}
              <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
                info-retraite.fr
              </a>.
            </div>
          </>
        ) : (
          <div style={{ ...card, textAlign: "center", padding: "40px 24px" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Renseignez votre profil ci-dessus pour voir la comparaison Avant / Après réforme.
            </p>
          </div>
        )}

        {/* Ad */}
        <div style={{ margin: "28px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "28px 24px",
          marginBottom: 24,
        }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 18, color: "var(--text)" }}>
            Comment fonctionne ce comparateur ?
          </h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>
              Ce simulateur applique les deux systèmes côte à côte pour votre génération.
              Le <strong style={{ color: "var(--text)" }}>système pré-2023</strong> maintenait un âge légal de 62 ans
              pour toutes les générations, avec des durées de cotisation progressives selon la date de naissance.
            </p>
            <p style={{ marginBottom: 12 }}>
              La <strong style={{ color: "var(--text)" }}>loi Borne 2023</strong> relève l'âge légal progressivement
              de 62 à 64 ans (3 mois par génération à partir de 1962) et aligne la durée de cotisation sur le barème
              de la réforme Touraine de 2014, accéléré d'une génération.
            </p>
            <p>
              La <strong style={{ color: "var(--text)" }}>pension estimée</strong> utilise la formule CNAV :
              SAM × 50 % × (trimestres / durée requise), sans décote ni surcote pour simplifier la comparaison.
              La retraite complémentaire Agirc-Arrco (30 à 50 % du total) n'est pas incluse.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection
          title="Questions fréquentes — Réforme des retraites 2023"
          items={FAQ}
        />

        {/* Ad */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
