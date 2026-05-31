import { useState, useEffect, useRef } from "react";
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
import ShareBar from "../../components/ShareBar.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";

// ─── Paramètres CNAVPL 2026 ──────────────────────────────────────────────────

const PASS = 47_100; // Plafond annuel 2026
const TAUX_PLEIN = 0.50;
const DURÉE_REQUISE = 172; // trimestres pour générations 1965+

// ─── CIPAV : Classes de cotisation et points ────────────────────────────────

function getClasseCIPAV(revenu) {
  const p = PASS;
  if (revenu < 0.85 * p) return { classe: 1, points: 222, cotisation: 1528, label: "< 40 035 €" };
  if (revenu < 1 * p) return { classe: 2, points: 333, cotisation: 2292, label: "40 035 – 47 100 €" };
  if (revenu < 1.5 * p) return { classe: 3, points: 444, cotisation: 3056, label: "47 100 – 70 650 €" };
  if (revenu < 2.5 * p) return { classe: 4, points: 666, cotisation: 4584, label: "70 650 – 117 750 €" };
  if (revenu < 4 * p) return { classe: 5, points: 888, cotisation: 6112, label: "117 750 – 188 400 €" };
  return { classe: 6, points: 1110, cotisation: 7640, label: "> 188 400 €" };
}

// ─── Calcul CNAVPL ─────────────────────────────────────────────────────────

function calcCnavpl({
  revenuAnnuel, anneesFaites, anneesRestantes,
  anneeNaissance, ageDépart,
}) {
  if (!revenuAnnuel || revenuAnnuel <= 0) {
    return {
      pensionBaseNette: 0,
      pensionCipav: 0,
      pensionTotale: 0,
      classCipav: getClasseCIPAV(0),
      trimestresTotal: 0,
      dureeRequise: DURÉE_REQUISE,
      tauxEffectif: 0,
      decote: 0,
      sam: 0,
      samPlafonné: 0,
      trimestresManquants: 0,
      totalPointsCipav: 0,
    };
  }

  // ─── Régime de base (SSI / ancien CNAV) ────────────────────────────────
  const trimestresTotal = ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4;
  const sam = revenuAnnuel; // SAM simplifié = revenu actuel (en réalité : moyenne 25 meilleures années)
  const samPlafonné = Math.min(sam, PASS);

  const trimestresManquants = Math.max(0, DURÉE_REQUISE - trimestresTotal);
  const ageDép = ageDépart ?? 65;

  let decote = 0;
  if (ageDép < 67 && trimestresManquants > 0) {
    decote = Math.min(trimestresManquants, 20) * 0.00625;
  }

  const tauxEffectif = Math.max(0, TAUX_PLEIN - decote);
  const pensionBaseBrute = (samPlafonné * tauxEffectif) / 12;
  const pensionBaseNette = pensionBaseBrute * 0.93;

  // ─── CIPAV : Régime complémentaire ────────────────────────────────────
  const classCipav = getClasseCIPAV(revenuAnnuel);
  const totalPointsCipav = classCipav.points * ((anneesFaites ?? 0) + (anneesRestantes ?? 0));
  const valeurPointCipav = 0.4753; // 2025 estimate (en service)
  const pensionCipav = (totalPointsCipav * valeurPointCipav) / 12;

  const pensionTotale = pensionBaseNette + pensionCipav;

  return {
    pensionBaseNette,
    pensionCipav,
    pensionTotale,
    classCipav,
    trimestresTotal,
    dureeRequise: DURÉE_REQUISE,
    tauxEffectif,
    decote,
    sam,
    samPlafonné,
    trimestresManquants,
    totalPointsCipav,
  };
}

// ─── Tableau CIPAV classes ────────────────────────────────────────────────

function TableCIPAV({ revenuAnnuel }) {
  const classes = [
    { classe: 1, label: "< 40 035 €", points: 222, cotisation: 1528 },
    { classe: 2, label: "40 035 – 47 100 €", points: 333, cotisation: 2292 },
    { classe: 3, label: "47 100 – 70 650 €", points: 444, cotisation: 3056 },
    { classe: 4, label: "70 650 – 117 750 €", points: 666, cotisation: 4584 },
    { classe: 5, label: "117 750 – 188 400 €", points: 888, cotisation: 6112 },
    { classe: 6, label: "> 188 400 €", points: 1110, cotisation: 7640 },
  ];

  const currentClass = getClasseCIPAV(revenuAnnuel).classe;

  return (
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>
              Revenu BNC annuel
            </th>
            <th style={{ textAlign: "center", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>
              Points/an
            </th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>
              Cotisation/an
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr
              key={c.classe}
              style={{
                borderBottom: "1px solid var(--border)",
                background: c.classe === currentClass ? "rgba(184,147,74,0.08)" : "transparent",
              }}
            >
              <td
                style={{
                  padding: "10px 0",
                  color: c.classe === currentClass ? "var(--gold)" : "var(--text)",
                }}
              >
                {c.label}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "10px 0",
                  color: c.classe === currentClass ? "var(--gold)" : "var(--text)",
                }}
              >
                {c.points}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "10px 0",
                  color: c.classe === currentClass ? "var(--gold)" : "var(--text)",
                  fontWeight: c.classe === currentClass ? 600 : 400,
                }}
              >
                {fmtEur(c.cotisation)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Quelles sont les professions libérales couvertes par CIPAV ?",
    a: "CIPAV couvre les professions libérales non réglementées : consultants, graphistes, traducteurs, photographes, coaches, formateurs indépendants, etc. Les médecins, avocats, notaires, experts-comptables ont leurs propres régimes : CARMF (médecins), CNBF (avocats), CRPCEN (notaires), CAVEC (experts-comptables).",
  },
  {
    q: "Comment sont calculés les points CIPAV ?",
    a: "CIPAV fonctionne par classes selon le revenu BNC (Bénéfices Non Commerciaux). Chaque classe correspond à un nombre de points/an : classe 1 = 222 pts, classe 2 = 333 pts, etc. À la retraite, vos points totaux sont convertis en rente mensuelle (valeur point ~0,4753 €).",
  },
  {
    q: "Qui doit cotiser à CIPAV si je suis en micro-entreprise ?",
    a: "En micro-entreprise (auto-entrepreneur), vous cotisez à la SSI pour la retraite de base et aux régimes SSI pour la complémentaire, NON à CIPAV. CIPAV s'applique si vous êtes en régime réel (BNC déclaré) ou en EIRL avec option réelle.",
  },
  {
    q: "Quelle est la différence entre pension de base et complémentaire ?",
    a: "La pension de base (régime SSI pour libéraux) couvre un minimum et est plafonnée au PASS. La pension complémentaire CIPAV s'y ajoute. Ensemble, elles forment votre retraite totale. Cette simulation calcule les deux.",
  },
  {
    q: "Puis-je prendre ma retraite à 62 ans en tant que libéral ?",
    a: "Oui, mais avec une décote de −0,625 % par trimestre manquant (max −12,5 %). Pour le taux plein (50 %), il faut atteindre 172 trimestres ET 67 ans. Ou avoir tous les trimestres et partir entre 62 et 67 avec décote réduite.",
  },
];

export default function Cnavpl() {
  const [theme, setTheme] = useTheme();

  const [revenuAnnuel, setRevenuAnnuel] = useState(null);
  const [anneesFaites, setAnneesFaites] = useState(null);

  const resultsRef = useRef(null);
  const [anneesRestantes, setAnneesRestantes] = useState(null);
  const [anneeNaissance, setAnneeNaissance] = useState(null);
  const [ageDépart, setAgeDépart] = useState(65);

  useEffect(() => {
    document.title = "Simulateur Retraite CIPAV 2025 — Professions libérales";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Estimez votre retraite CIPAV pour les professions libérales : classe de cotisation, points retraite de base et complémentaire.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'cnavpl' });
    if (!sessionStorage.getItem('tracked_cnavpl')) {
      sessionStorage.setItem('tracked_cnavpl', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'cnavpl' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.revenuAnnuel !== undefined) setRevenuAnnuel(shared.revenuAnnuel);
      if (shared.anneesFaites !== undefined) setAnneesFaites(shared.anneesFaites);
      if (shared.anneesRestantes !== undefined) setAnneesRestantes(shared.anneesRestantes);
      if (shared.anneeNaissance !== undefined) setAnneeNaissance(shared.anneeNaissance);
      if (shared.ageDépart !== undefined) setAgeDépart(shared.ageDépart);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ revenuAnnuel, anneesFaites, anneesRestantes, anneeNaissance, ageDépart }));
  }, [revenuAnnuel, anneesFaites, anneesRestantes, anneeNaissance, ageDépart]);

  const res = calcCnavpl({
    revenuAnnuel,
    anneesFaites,
    anneesRestantes,
    anneeNaissance,
    ageDépart,
  });

  const pensionTotaleAnim = useAnimatedNumber(res.pensionTotale);
  const pensionBaseAnim = useAnimatedNumber(res.pensionBaseNette);
  const pensionCipavAnim = useAnimatedNumber(res.pensionCipav);

  const hasResult = (revenuAnnuel || 0) > 0;

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
          icon="👨‍⚕️"
          badge="Retraite · Simulation 2026"
          title="Professions libérales"
          subtitle="Régime de base + CIPAV"
          desc="Estimez votre retraite si vous exercez une profession libérale non réglementée (CIPAV). Hors CARMF (médecins), CNBF (avocats) et caisses spécifiques."
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
          {["✓ PASS 2026 : 47 100 €", "✓ Taux plein : 50 %", "✓ Régime base + CIPAV"].map((t, i) => (
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
            Votre situation
          </h2>

          <NumInput
            id="revenu-bnc"
            label="Revenu net BNC annuel"
            value={revenuAnnuel}
            onChange={setRevenuAnnuel}
            unit="€/an"
            min={0}
            max={500000}
            hint={revenuAnnuel ? `Classe CIPAV : ${getClasseCIPAV(revenuAnnuel).classe} (${getClasseCIPAV(revenuAnnuel).label})` : "Bénéfices non commerciaux (régime réel)"}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput
              id="annees-faites"
              label="Années déjà cotisées"
              value={anneesFaites}
              onChange={setAnneesFaites}
              unit="ans"
              min={0}
              max={50}
              hint={anneesFaites !== null ? `Soit ${anneesFaites * 4} trimestres` : undefined}
            />
            <NumInput
              id="annees-restantes"
              label="Années restantes estimées"
              value={anneesRestantes}
              onChange={setAnneesRestantes}
              unit="ans"
              min={0}
              max={50}
              hint={anneesRestantes !== null ? `+${anneesRestantes * 4} trimestres futurs` : undefined}
            />
          </div>

          <NumInput
            id="annee-naissance"
            label="Année de naissance"
            value={anneeNaissance}
            onChange={setAnneeNaissance}
            min={1950}
            max={2000}
            hint={anneeNaissance ? `Génération 1965+ : durée requise 172 trimestres` : "Détermine la durée requise et l'âge légal"}
          />

          <StepperInput
            label="Âge de départ prévu"
            value={ageDépart}
            onChange={setAgeDépart}
            min={62}
            max={70}
            unit=" ans"
            hint="Avant 67 ans sans taux plein : décote appliquée"
            tooltip="À 67 ans, décote annulée. Le taux plein 50 % est automatique."
          />

          {/* Récapitulatif */}
          <div
            style={{
              background: "rgba(184,147,74,0.06)",
              border: "1px solid rgba(184,147,74,0.15)",
              borderRadius: 12,
              padding: "14px 20px",
              display: "flex",
              flexWrap: "wrap",
              marginTop: 4,
            }}
          >
            {[
              { l: "Trimestres totaux", v: `${((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4}`, gold: true },
              { l: "Durée requise", v: `${DURÉE_REQUISE} trim.` },
              { l: "Manquants", v: `${Math.max(0, DURÉE_REQUISE - ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4)} trim.` },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  minWidth: 100,
                  padding: "4px 16px",
                  borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text-secondary)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {item.l}
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 21,
                    fontWeight: 700,
                    color: item.gold ? "var(--gold)" : "var(--text)",
                  }}
                >
                  {item.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résultats */}
        <div
          ref={resultsRef}
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
            Votre pension estimée
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
              Pension nette mensuelle estimée
            </div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>
                Saisissez vos paramètres pour voir votre estimation.
              </p>
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
                  {pensionTotaleAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  Base : <strong>{pensionBaseAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</strong> + CIPAV :{" "}
                  <strong>{pensionCipavAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €</strong>
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              {/* Taux banner */}
              <div
                style={{
                  background: res.decote > 0 ? "rgba(239,68,68,0.07)" : "var(--card-bg)",
                  border: `1px solid ${res.decote > 0 ? "rgba(239,68,68,0.25)" : "var(--border)"}`,
                  borderRadius: 12,
                  padding: "13px 18px",
                  marginBottom: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      marginBottom: 4,
                    }}
                  >
                    Taux de liquidation (régime base)
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {res.decote > 0 && (
                      <span style={{ color: "#f87171" }}>
                        Décote −{(res.decote * 100).toFixed(2)} % ({Math.min(res.trimestresManquants, 20)} trim. × 0,625 %)
                      </span>
                    )}
                    {res.decote === 0 && "Taux plein — aucune décote"}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: res.decote > 0 ? "#f87171" : "var(--text-secondary)",
                  }}
                >
                  {(res.tauxEffectif * 100).toFixed(2)} %
                </span>
              </div>

              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="Classe CIPAV" value={`${res.classCipav.classe}`} />
                <Chip label="Points CIPAV totaux" value={`${fmt(res.totalPointsCipav)}`} accent />
                <Chip label="Cotisation CIPAV/an" value={`${fmtEur(res.classCipav.cotisation)}`} />
                <Chip label="SAM plafonné" value={`${fmtEur(res.samPlafonné)}`} accent />
              </div>

              <ProgressBar
                label="Trimestres validés"
                value={res.trimestresTotal}
                total={DURÉE_REQUISE}
                color="linear-gradient(90deg,var(--gold-mid),var(--gold))"
              />

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
                ⚠️ <strong>Simulation indicative.</strong> Cette simulation suppose un régime CIPAV. Consultez votre caisse (CIPAV, SSI) et un expert-comptable
                pour un calcul officiel de votre situation.
              </div>
            </>
          )}
        </div>

        <ShareBar params={{ revenuAnnuel, anneesFaites, anneesRestantes, anneeNaissance, ageDépart }} resultsRef={resultsRef} name="cnavpl" />

        {/* Ad */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* Classe CIPAV */}
        {hasResult && (
          <AccordionSection title="Votre classe CIPAV" subtitle={`Classe ${res.classCipav.classe} — ${res.classCipav.label}`}>
            <div style={{ marginBottom: 16 }}>
              <TableCIPAV revenuAnnuel={revenuAnnuel} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <p style={{ marginBottom: 10 }}>
                Vous êtes en <strong>classe {res.classCipav.classe}</strong> (revenu {res.classCipav.label}). Vous cumulez <strong>{res.classCipav.points} points par an</strong> via
                CIPAV, soit une cotisation annuelle d'environ <strong>{fmtEur(res.classCipav.cotisation)}</strong>.
              </p>
              <p>
                Sur <strong>{(anneesFaites ?? 0) + (anneesRestantes ?? 0)} ans</strong> de carrière, cela représente{" "}
                <strong>{fmt(res.totalPointsCipav)} points CIPAV totaux</strong>, convertis en pension à la retraite.
              </p>
            </div>
          </AccordionSection>
        )}

        {/* Régimes spécifiques */}
        <AccordionSection title="Autres régimes" subtitle="CARMF, CNBF, CRPCEN, CAVEC">
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 14 }}>
              Cette simulation s'applique aux professions libérales <strong>non réglementées</strong> affiliées à CIPAV. Certains secteurs ont leurs propres caisses :
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 14, listStyleType: "disc" }}>
              <li>
                <strong>CARMF</strong> (Caisse Autonome de Retraite des Médecins) : Médecins, chirurgiens-dentistes
              </li>
              <li>
                <strong>CNBF</strong> (Caisse Nationale des Barreaux Français) : Avocats
              </li>
              <li>
                <strong>CRPCEN</strong> (Caisse de Retraite et de Prévoyance du Notariat) : Notaires
              </li>
              <li>
                <strong>CAVEC</strong> (Caisse d'Assurance Vieillesse des Experts-Comptables) : Experts-comptables
              </li>
              <li>
                <strong>SSI / Régimes sectoriels</strong> (CIPAV, sections pro) : Autres libéraux
              </li>
            </ul>
            <p>
              Consultez votre caisse de retraite ou un expert-comptable pour connaître votre affiliation exacte et les paramètres de votre régime.
            </p>
          </div>
        </AccordionSection>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Un régime par classes pour les professions libérales</h3>
            <p style={{ marginBottom: 16 }}>La CIPAV (Caisse Interprofessionnelle de Prévoyance et d'Assurance Vieillesse) gère la retraite complémentaire d'environ 700 000 professionnels libéraux : architectes, ingénieurs, guides-conférenciers, ostéopathes, psychologues, géomètres et de nombreuses autres professions réglementées. La cotisation est déterminée non par un taux appliqué au revenu, mais par l'appartenance à l'une des 6 classes définies par tranches de revenus par rapport au PASS.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Retraite de base CNAVPL et complémentaire CIPAV</h3>
            <p style={{ marginBottom: 16 }}>Les professions libérales affiliées à la CIPAV cotisent à deux régimes superposés. La retraite de base est gérée par la CNAVPL selon un mécanisme en points, similaire au régime général pour les règles de liquidation. La retraite complémentaire CIPAV fonctionne également par points, avec une valeur d'achat et une valeur de service révisées annuellement. Les points acquis s'accumulent tout au long de la carrière.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Les professions concernées et les autres caisses</h3>
            <p>Toutes les professions libérales ne dépendent pas de la CIPAV. Les médecins relèvent de la CARMF, les notaires de la CPRN, les experts-comptables de la CAVEC. La CIPAV regroupe principalement les « autres professions libérales » non rattachées à une caisse spécifique. Depuis 2018, les auto-entrepreneurs exerçant une activité libérale relevant de la CIPAV y cotisent également, selon les mêmes classes de cotisation.</p>
          </div>
        </div>

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
            Questions fréquentes — CNAVPL
          </h2>
          {FAQ.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Plus d'infos : <a href="https://www.cipav-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
              cipav-retraite.fr
            </a>{" "}
            · <a href="https://www.lassuranceretraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
              lassuranceretraite.fr
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
