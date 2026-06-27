import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useTheme } from "../hooks/useTheme.js";

const FEATURES = [
  {
    icon: "📊",
    title: "Simulateurs prêts à l'emploi",
    desc: "30+ outils couvrant la retraite, l'immobilier, la fiscalité et l'épargne. Utilisez-les en consultation ou partagez un lien direct à vos clients.",
  },
  {
    icon: "🔗",
    title: "Liens de partage personnalisés",
    desc: "Chaque simulation génère une URL unique avec les paramètres pré-remplis. Envoyez-la par mail ou WhatsApp, le client retrouve exactement votre scénario.",
  },
  {
    icon: "📄",
    title: "Export PDF professionnel",
    desc: "Téléchargez un rapport PDF propre, sans publicité, prêt à intégrer dans un dossier client ou à imprimer pour une réunion.",
  },
  {
    icon: "⚡",
    title: "Calculs instantanés",
    desc: "Tout se passe dans le navigateur, aucune inscription requise pour vos clients. Résultats en temps réel, même sur mobile.",
  },
  {
    icon: "🇫🇷",
    title: "Référentiels officiels",
    desc: "Valeur du point Agirc-Arrco, barèmes URSSAF, taux d'usure, plafonds Sécurité sociale : les paramètres sont mis à jour à chaque révision réglementaire.",
  },
  {
    icon: "🔒",
    title: "Confidentialité totale",
    desc: "Aucune donnée client ne transite par nos serveurs. Les calculs restent dans le navigateur — RGPD sans effort.",
  },
];

const USE_CASES = [
  {
    metier: "CGP / CIF",
    scenarios: [
      "Estimer la pension nette d'un client cadre privé avant de proposer un PER",
      "Montrer l'impact de la racheter des trimestres manquants",
      "Comparer « rembourser le crédit vs investir » avec des chiffres réels",
    ],
  },
  {
    metier: "Expert-comptable",
    scenarios: [
      "Calculer le revenu net d'un freelance vs salarié pour orienter le statut",
      "Estimer les droits à la retraite d'un dirigeant TNS sous différents régimes",
      "Projeter l'impact fiscal d'une donation ou succession",
    ],
  },
  {
    metier: "Courtier en crédit",
    scenarios: [
      "Simuler la capacité d'emprunt avec différents taux et durées",
      "Calculer les frais de notaire exacts selon le département",
      "Comparer PTZ + prêt classique vs prêt unique",
    ],
  },
];

const SIMS = [
  { label: "Retraite CNAV", path: "/simulateurs/cnav" },
  { label: "Agirc-Arrco", path: "/simulateurs/agirc-arrco" },
  { label: "PER", path: "/simulateurs/per" },
  { label: "Emprunt immobilier", path: "/simulateurs/emprunt-immobilier" },
  { label: "Impôt sur le revenu", path: "/simulateurs/impot-revenu" },
  { label: "Donation & succession", path: "/simulateurs/donation" },
  { label: "Freelance vs salarié", path: "/simulateurs/freelance-vs-salarie" },
  { label: "Rendement locatif", path: "/simulateurs/rendement-locatif" },
];

export default function ProConseiller() {
  const [theme, setTheme] = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", metier: "", message: "" });

  useEffect(() => {
    document.title = "Simfinly pour les conseillers financiers | simfinly.com";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Découvrez comment les CGP, experts-comptables et courtiers utilisent Simfinly pour préparer leurs consultations avec des simulations instantanées et des exports PDF professionnels.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = "https://www.simfinly.com/pro-conseiller";
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-block", fontSize: 13, fontWeight: 600, color: "var(--primary)", background: "var(--primary-soft)", padding: "5px 14px", borderRadius: 20, marginBottom: 18, letterSpacing: "0.03em" }}>
            Pour les professionnels
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 18 }}>
            Des simulations pro,<br />prêtes en 30 secondes
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 32px" }}>
            CGP, experts-comptables, courtiers : utilisez nos 30+ simulateurs financiers pour enrichir vos consultations, illustrer vos recommandations et générer des rapports PDF sans effort.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contact" style={{ display: "inline-block", padding: "13px 28px", borderRadius: 12, background: "var(--primary)", color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
              Nous contacter →
            </a>
            <Link to="/simulateurs" style={{ display: "inline-block", padding: "13px 28px", borderRadius: 12, background: "var(--primary-soft)", color: "var(--primary)", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
              Voir les simulateurs
            </Link>
          </div>
        </div>

        {/* Features grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18, marginBottom: 64 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Use cases */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>
            Cas d'usage concrets
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
            Ce que nos utilisateurs professionnels font en consultation.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {USE_CASES.map(uc => (
              <div key={uc.metier} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: "var(--primary)", marginBottom: 12 }}>{uc.metier}</div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {uc.scenarios.map((s, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--text)", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--positive)", flexShrink: 0, marginTop: 1 }}>✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Simulateurs shortlist */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>
            Les simulateurs les plus utilisés
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SIMS.map(s => (
              <Link
                key={s.path}
                to={s.path}
                style={{ display: "inline-block", padding: "9px 16px", borderRadius: 20, background: "var(--primary-soft)", color: "var(--primary)", textDecoration: "none", fontSize: 13.5, fontWeight: 500, border: "1px solid var(--border-gold)" }}
              >
                {s.label} →
              </Link>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div id="contact" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 18, padding: "36px 32px", scrollMarginTop: 80 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Discutons de vos besoins
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
            Vous souhaitez une démo, intégrer nos simulateurs en iframe sur votre site, ou accéder à une version sans publicité ? Contactez-nous.
          </p>
          {submitted ? (
            <div style={{ padding: "24px", background: "var(--positive-soft)", border: "1px solid var(--positive)", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--positive)" }}>Message envoyé !</p>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 4 }}>Nous vous répondrons dans les 24h ouvrées.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>Nom *</label>
                  <input
                    required
                    value={form.nom}
                    onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                    placeholder="Marie Dupont"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>E-mail professionnel *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="marie@cabinet.fr"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>Profession</label>
                <select
                  value={form.metier}
                  onChange={e => setForm(f => ({ ...f, metier: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                >
                  <option value="">Choisir…</option>
                  <option>CGP / CIF</option>
                  <option>Expert-comptable</option>
                  <option>Courtier en crédit</option>
                  <option>Notaire</option>
                  <option>Banquier / Conseiller bancaire</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Dites-nous comment vous aimeriez utiliser Simfinly…"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "'Hanken Grotesk', sans-serif", boxSizing: "border-box" }}
                />
              </div>
              <button
                type="submit"
                style={{ alignSelf: "flex-start", padding: "12px 28px", borderRadius: 11, background: "var(--primary)", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                Envoyer le message →
              </button>
            </form>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
