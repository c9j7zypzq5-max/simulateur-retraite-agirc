// Route à ajouter dans src/App.jsx :
//   <Route path="/wizard-retraite" element={<WizardRetraite />} />

import { useState } from "react";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { NumInput, StepperInput, fmtEur } from "../components/ui.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { Link } from "../lib/router.jsx";

// ─── Règles retraite (Loi Borne 2023) ────────────────────────────────────────

function getAgeLegal(annee) {
  if (!annee || annee <= 1961) return 62;
  if (annee === 1962) return 62.25;   // 62 ans 3 mois
  if (annee === 1963) return 62.5;    // 62 ans 6 mois
  if (annee === 1964) return 63;
  if (annee === 1965) return 63.25;   // 63 ans 3 mois
  if (annee === 1966) return 63.5;    // 63 ans 6 mois
  return 64;
}

function getAgeLegalLabel(annee) {
  if (!annee || annee <= 1961) return "62 ans";
  if (annee === 1962) return "62 ans 3 mois";
  if (annee === 1963) return "62 ans 6 mois";
  if (annee === 1964) return "63 ans";
  if (annee === 1965) return "63 ans 3 mois";
  if (annee === 1966) return "63 ans 6 mois";
  return "64 ans";
}

function getDureeRequise(annee) {
  if (!annee || annee <= 1964) return 168;
  const extra = Math.min(annee - 1964, 9);
  return 168 + extra; // 169 (1965) → 172 (1968+) — progression 1 trim/an jusqu'à 172 max
}

// ─── Statuts professionnels ───────────────────────────────────────────────────

const STATUTS = [
  {
    key: "salarie",
    emoji: "🏢",
    label: "Salarié du privé",
    desc: "CDI, CDD, intérim — secteur privé",
    simulateurs: [
      { label: "CNAV — Régime général", path: "/simulateurs/cnav", params: (d) => `anneesFaites=${d.anneesFaites}&salaire=${d.salaireMensuel}` },
      { label: "Agirc-Arrco — Retraite complémentaire", path: "/simulateurs/agirc-arrco", params: (d) => `salaire=${d.salaireMensuel}&anneeNaissance=${d.anneeNaissance}` },
      { label: "Synthèse tous régimes", path: "/simulateurs/synthese-retraite", params: () => "" },
    ],
  },
  {
    key: "fonctionnaire",
    emoji: "🏛️",
    label: "Fonctionnaire",
    desc: "Agent titulaire de la fonction publique",
    simulateurs: [
      { label: "Fonction publique — Pension civile / CNRACL", path: "/simulateurs/fonction-publique", params: (d) => `salaire=${d.salaireMensuel}` },
      { label: "IRCANTEC — Contractuels du public", path: "/simulateurs/ircantec", params: (d) => `salaire=${d.salaireMensuel}` },
    ],
  },
  {
    key: "independant",
    emoji: "💼",
    label: "Indépendant / TNS",
    desc: "Artisan, commerçant, micro-entrepreneur",
    simulateurs: [
      { label: "Indépendants — SSI (ex-RSI)", path: "/simulateurs/independants", params: (d) => `revenu=${d.salaireAnnuel}` },
      { label: "Synthèse tous régimes", path: "/simulateurs/synthese-retraite", params: () => "" },
    ],
  },
  {
    key: "agriculteur",
    emoji: "🌾",
    label: "Agriculteur",
    desc: "Exploitant ou salarié agricole",
    simulateurs: [
      { label: "MSA — Mutualité Sociale Agricole", path: "/simulateurs/msa", params: (d) => `salaire=${d.salaireMensuel}` },
    ],
  },
  {
    key: "liberal",
    emoji: "⚕️",
    label: "Profession libérale",
    desc: "Médecin, avocat, architecte, expert-comptable…",
    simulateurs: [
      { label: "CNAVPL / CIPAV — Professions libérales", path: "/simulateurs/cnavpl", params: (d) => `revenu=${d.salaireAnnuel}` },
    ],
  },
];

// ─── Estimation très approximative de la pension ──────────────────────────────

function estimePension(statut, anneeNaissance, trimestres, salaireAnnuel) {
  if (!salaireAnnuel || !anneeNaissance || salaireAnnuel <= 0) return null;
  const duree = getDureeRequise(anneeNaissance);
  const prorat = Math.min((trimestres || 0) / duree, 1);

  if (statut === "salarie") {
    const PASS = 48060;
    const sam = Math.min(salaireAnnuel, PASS);
    const cnavMensuel = (sam * 0.50 * prorat) / 12;
    const agircMensuel = salaireAnnuel * 0.0060 * Math.max(trimestres, 0) / 12; // ~6 pts/an × valeur pt 1.4319 €
    return { base: Math.round(cnavMensuel), complementaire: Math.round(agircMensuel), total: Math.round(cnavMensuel + agircMensuel) };
  }
  if (statut === "fonctionnaire") {
    const pension = (salaireAnnuel * 0.75 * prorat) / 12;
    return { base: Math.round(pension), total: Math.round(pension) };
  }
  if (statut === "independant" || statut === "agriculteur" || statut === "liberal") {
    const PASS = 48060;
    const sam = Math.min(salaireAnnuel, PASS);
    const pension = (sam * 0.50 * prorat) / 12;
    return { base: Math.round(pension), total: Math.round(pension) };
  }
  return null;
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function WizardRetraite() {
  const [theme, setTheme] = useTheme();
  const [etape, setEtape] = useState(1);

  // Étape 1
  const [statut, setStatut] = useState(null);

  // Étape 2
  const [anneeNaissance, setAnneeNaissance] = useState(null);
  const [trimestres, setTrimestres] = useState(null);

  // Étape 3
  const [salaireMoyen, setSalaireMoyen] = useState(null);
  const [dernierSalaire, setDernierSalaire] = useState(null);

  usePageMeta(
    "Wizard Retraite — Votre retraite personnalisée | simfinly.com",
    "Répondez à 4 questions pour obtenir une estimation de votre retraite et être orienté vers le bon simulateur.",
  );

  // ─── Calculs dérivés ───────────────────────────────────────────────────────
  const ageLegal = anneeNaissance ? getAgeLegal(anneeNaissance) : null;
  const ageLegalLabel = anneeNaissance ? getAgeLegalLabel(anneeNaissance) : null;
  const dureeRequise = anneeNaissance ? getDureeRequise(anneeNaissance) : 172;
  const trimestresManquants = trimestres !== null ? Math.max(0, dureeRequise - trimestres) : null;
  const anneesRestantes = trimestresManquants !== null ? Math.ceil(trimestresManquants / 4) : null;
  const salaireAnnuel = salaireMoyen ? salaireMoyen * 12 : null;
  const salaireMensuel = salaireMoyen;

  const statutObj = STATUTS.find(s => s.key === statut);
  const pension = statut && anneeNaissance && salaireAnnuel
    ? estimePension(statut, anneeNaissance, trimestres || 0, salaireAnnuel)
    : null;

  // Données pour les liens pré-remplis
  const donnees = { anneeNaissance, anneesFaites: Math.floor((trimestres || 0) / 4), salaireMensuel, salaireAnnuel, trimestres };

  // ─── Navigation ───────────────────────────────────────────────────────────
  function suivant() { if (etape < 4) setEtape(e => e + 1); }
  function precedent() { if (etape > 1) setEtape(e => e - 1); }

  const peutContinuer = () => {
    if (etape === 1) return !!statut;
    if (etape === 2) return !!anneeNaissance && anneeNaissance >= 1950 && anneeNaissance <= 2000;
    if (etape === 3) return !!salaireMoyen && salaireMoyen > 0;
    return true;
  };

  // ─── Styles partagés ──────────────────────────────────────────────────────
  const cardBase = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "var(--card-shadow)",
    marginBottom: 16,
  };

  const btnPrimary = {
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px 28px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "opacity 0.15s",
  };

  const btnSecondary = {
    background: "none",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "14px 24px",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Hanken Grotesk', sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* En-tête */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🧙</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,5vw,34px)", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
            Wizard Retraite
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            4 questions pour estimer votre retraite et trouver le bon simulateur
          </p>
        </div>

        {/* Barre de progression */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>
            <span>Étape {etape} / 4</span>
            <span>{["Statut", "Carrière", "Revenus", "Résultats"][etape - 1]}</span>
          </div>
          <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(etape / 4) * 100}%`,
              background: "linear-gradient(90deg, var(--gold-mid), var(--gold))",
              borderRadius: 3,
              transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
            }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: n <= etape ? "var(--gold)" : "var(--border)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        </div>

        {/* ── Étape 1 : Statut professionnel ── */}
        {etape === 1 && (
          <div>
            <div style={cardBase}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                Quel est votre statut professionnel ?
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
                Votre régime de retraite dépend de votre statut. Sélectionnez celui qui vous correspond.
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                {STATUTS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setStatut(s.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 18px",
                      borderRadius: 12,
                      border: `2px solid ${statut === s.key ? "var(--gold)" : "var(--border)"}`,
                      background: statut === s.key ? "rgba(184,147,74,0.1)" : "var(--card-bg)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{s.emoji}</span>
                    <div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: statut === s.key ? "var(--gold)" : "var(--text)", marginBottom: 2 }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.desc}</div>
                    </div>
                    {statut === s.key && (
                      <span style={{ marginLeft: "auto", fontSize: 18, color: "var(--gold)", flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Étape 2 : Année de naissance + trimestres ── */}
        {etape === 2 && (
          <div style={cardBase}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
              Votre carrière
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
              Ces données permettent de calculer votre âge légal de départ et les trimestres manquants.
            </p>

            <NumInput
              id="annee-naissance"
              label="Année de naissance"
              value={anneeNaissance}
              onChange={setAnneeNaissance}
              min={1950}
              max={2000}
              hint={anneeNaissance ? `Âge légal de départ (réforme Loi Borne 2023) : ${ageLegalLabel} · Durée requise : ${dureeRequise} trimestres` : "Entre 1950 et 2000"}
            />

            <NumInput
              id="trimestres"
              label="Trimestres validés à ce jour"
              value={trimestres}
              onChange={setTrimestres}
              min={0}
              max={172}
              unit="trim."
              hint={
                trimestres !== null && anneeNaissance
                  ? trimestresManquants > 0
                    ? `Il vous manque ${trimestresManquants} trimestres (soit ~${anneesRestantes} an${anneesRestantes > 1 ? "s" : ""} de cotisation)`
                    : "Vous avez atteint ou dépassé la durée requise"
                  : "1 trimestre = environ 1 660 € de salaire brut validé"
              }
            />

            {anneeNaissance && trimestres !== null && (
              <div style={{ background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.15)", borderRadius: 12, padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { l: "Âge légal", v: ageLegalLabel },
                  { l: "Trimestres requis", v: `${dureeRequise}` },
                  { l: "Manquants", v: `${trimestresManquants}`, accent: trimestresManquants > 0 },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 4 }}>{item.l}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: item.accent ? "#f87171" : "var(--gold)" }}>{item.v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Étape 3 : Revenus ── */}
        {etape === 3 && (
          <div style={cardBase}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
              Vos revenus
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
              {statut === "salarie" ? "Salaire brut mensuel moyen sur votre carrière (approx. du Salaire Annuel Moyen)." : "Revenu professionnel annuel moyen."}
            </p>

            <NumInput
              id="salaire-moyen"
              label={statut === "salarie" ? "Salaire brut mensuel moyen" : "Revenu professionnel mensuel moyen"}
              value={salaireMoyen}
              onChange={setSalaireMoyen}
              unit="€/mois"
              min={500}
              max={50000}
              hint={salaireMoyen ? `Soit ${(salaireMoyen * 12).toLocaleString("fr-FR")} €/an brut` : "Estimation de votre revenu moyen sur la carrière"}
            />

            <NumInput
              id="dernier-salaire"
              label={statut === "salarie" ? "Dernier salaire brut mensuel (optionnel)" : "Dernier revenu mensuel (optionnel)"}
              value={dernierSalaire}
              onChange={setDernierSalaire}
              unit="€/mois"
              min={0}
              max={50000}
              hint={
                dernierSalaire && salaireMoyen
                  ? `Taux de remplacement estimé : ~${Math.round((pension?.total || 0) / dernierSalaire * 100)} %`
                  : "Permet de calculer votre taux de remplacement"
              }
            />
          </div>
        )}

        {/* ── Étape 4 : Résultats ── */}
        {etape === 4 && (
          <div>
            {/* Récapitulatif */}
            <div style={cardBase}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
                Votre situation retraite
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { l: "Statut", v: statutObj?.label },
                  { l: "Âge légal de départ", v: ageLegalLabel || "—" },
                  { l: "Trimestres validés", v: trimestres !== null ? `${trimestres} / ${dureeRequise}` : "—" },
                  { l: "Trimestres manquants", v: trimestresManquants !== null ? `${trimestresManquants}` : "—" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 4 }}>{item.l}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{item.v || "—"}</div>
                  </div>
                ))}
              </div>

              {anneesRestantes !== null && anneesRestantes > 0 && (
                <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Il vous reste environ <strong style={{ color: "var(--gold)" }}>{anneesRestantes} an{anneesRestantes > 1 ? "s" : ""}</strong> de cotisation pour atteindre le taux plein.
                </div>
              )}
              {trimestresManquants === 0 && (
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Vous avez atteint la durée requise pour le <strong style={{ color: "#22c55e" }}>taux plein</strong>.
                </div>
              )}
            </div>

            {/* Estimation pension */}
            {pension && (
              <div style={{ ...cardBase, borderColor: "var(--border-gold)" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 4 }}>
                  Estimation pension mensuelle
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 38, color: "var(--primary)", lineHeight: 1, marginBottom: 6 }}>
                  {fmtEur(pension.total)}
                </div>
                {pension.complementaire && (
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    Base CNAV : {fmtEur(pension.base)} · Agirc-Arrco estimé : {fmtEur(pension.complementaire)}
                  </div>
                )}
                <div role="note" style={{ marginTop: 12, fontSize: 11, color: "var(--text-secondary)", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", lineHeight: 1.6 }}>
                  ⚠️ <strong>Estimation très approximative</strong> — à titre indicatif uniquement. Affinez le calcul avec les simulateurs ci-dessous.
                </div>
              </div>
            )}

            {/* Simulateurs recommandés */}
            {statutObj && (
              <div style={cardBase}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                  Simulateurs recommandés pour vous
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
                  Ces simulateurs sont pré-remplis avec vos paramètres pour un calcul plus précis.
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {statutObj.simulateurs.map((sim, i) => {
                    const params = sim.params(donnees);
                    const href = params ? `${sim.path}?${params}` : sim.path;
                    return (
                      <Link
                        key={i}
                        to={href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 18px",
                          borderRadius: 12,
                          border: "1px solid var(--border-gold)",
                          background: "rgba(184,147,74,0.07)",
                          color: "var(--text)",
                          textDecoration: "none",
                          fontSize: 14,
                          fontWeight: 500,
                          transition: "background 0.15s",
                        }}
                      >
                        <span>{sim.label}</span>
                        <span style={{ color: "var(--gold)", fontSize: 16 }}>→</span>
                      </Link>
                    );
                  })}
                </div>
                <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Chaque simulateur affine les calculs avec les règles propres à votre régime. Commencez par le régime de base, puis complétez avec la complémentaire.
                </p>
              </div>
            )}

            {/* Lien synthèse */}
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <Link
                to="/simulateurs/synthese-retraite"
                style={{ fontSize: 13, color: "var(--gold-mid)", textDecoration: "none" }}
              >
                Voir la synthèse tous régimes →
              </Link>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, gap: 12 }}>
          {etape > 1 ? (
            <button onClick={precedent} style={btnSecondary}>
              ← Précédent
            </button>
          ) : (
            <div />
          )}

          {etape < 4 && (
            <button
              onClick={suivant}
              disabled={!peutContinuer()}
              style={{
                ...btnPrimary,
                opacity: peutContinuer() ? 1 : 0.45,
                cursor: peutContinuer() ? "pointer" : "not-allowed",
              }}
            >
              Suivant →
            </button>
          )}

          {etape === 4 && (
            <button
              onClick={() => setEtape(1)}
              style={{ ...btnSecondary, marginLeft: "auto" }}
            >
              Recommencer
            </button>
          )}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-secondary)", marginTop: 28, lineHeight: 1.5 }}>
          Ce wizard est un outil d'orientation — il ne remplace pas un bilan retraite officiel.
          Pour un relevé de carrière, consultez{" "}
          <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)" }}>
            info-retraite.fr
          </a>.
        </p>
      </div>

      <Footer />
    </div>
  );
}
