import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

function Section({ title, children }) {
  return (
    <div style={{ paddingLeft: 20, borderLeft: "2px solid rgba(184,147,74,0.25)" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#e8c06a", marginBottom: 16 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.85 }}>{children}</div>
    </div>
  );
}

export default function MentionsLegales() {
  return (
    <div style={{ minHeight: "100vh", background: "#060e1c", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0", padding: "0 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 0 60px" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 40, letterSpacing: "0.04em" }}>
          ← Retour au simulateur
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#b8934a,#e8c06a)" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8934a" }}>Légal</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 600, color: "#f1e4c3", marginBottom: 48, lineHeight: 1.1 }}>
          Mentions légales
        </h1>

        <div style={{ display: "grid", gap: 36 }}>
          <Section title="Éditeur du site">
            <p>Ce site est édité à titre personnel et non commercial par :</p>
            <p style={{ marginTop: 14 }}>
              <strong style={{ color: "#e2e8f0" }}>Adrian Farago</strong><br />
              Particulier — site non commercial<br />
              Contact :{" "}
              <a href="mailto:contact@simulateur-retraite-agirc.fr" style={{ color: "#b8934a", textDecoration: "none" }}>
                contact@simulateur-retraite-agirc.fr
              </a>
            </p>
            <p style={{ marginTop: 14 }}>
              Ce simulateur est fourni gratuitement. Il n'est affilié à aucun organisme de retraite, conseiller financier ou assureur.
            </p>
          </Section>

          <Section title="Hébergeur">
            <p>
              <strong style={{ color: "#e2e8f0" }}>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723 — États-Unis<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "#b8934a", textDecoration: "none" }}>
                vercel.com
              </a>
            </p>
          </Section>

          <Section title="Avertissement — Simulation non contractuelle">
            <p>
              Les résultats fournis par ce simulateur sont des{" "}
              <strong style={{ color: "#e2e8f0" }}>estimations indicatives</strong>{" "}
              calculées à partir des paramètres officiels Agirc-Arrco 2026 (PASS, taux de cotisation, valeur d'achat et valeur de service du point).
            </p>
            <p style={{ marginTop: 14 }}>Ces résultats ne constituent en aucun cas :</p>
            <ul style={{ marginTop: 10, paddingLeft: 20, display: "grid", gap: 6 }}>
              <li>un engagement contractuel de la part d'un régime de retraite ;</li>
              <li>un conseil financier ou fiscal personnalisé ;</li>
              <li>une garantie de montant de pension future.</li>
            </ul>
            <p style={{ marginTop: 14 }}>
              Les montants réels dépendent de votre carrière exacte, des revalorisations futures, des coefficients de minoration ou majoration et de l'évolution de la législation. Pour un calcul officiel :{" "}
              <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#b8934a", textDecoration: "none" }}>
                info-retraite.fr
              </a>.
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L'ensemble du contenu de ce site (textes, design, code source) est la propriété d'Adrian Farago, sauf mention contraire, et est protégé par le droit d'auteur français et les conventions internationales.
            </p>
            <p style={{ marginTop: 14 }}>
              Toute reproduction, représentation, modification ou exploitation partielle ou totale du contenu, par quelque procédé que ce soit, est interdite sans autorisation préalable écrite.
            </p>
            <p style={{ marginTop: 14 }}>
              Les paramètres techniques utilisés (PASS, taux de cotisation, valeur du point) sont des données officielles publiées par le régime Agirc-Arrco et l'URSSAF.
            </p>
          </Section>

          <Section title="Responsabilité">
            <p>
              L'éditeur s'efforce de maintenir les informations à jour et exactes, mais ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des données présentées. En cas de doute, reportez-vous aux sources officielles.
            </p>
            <p style={{ marginTop: 14 }}>
              L'éditeur ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce simulateur ou de l'interprétation de ses résultats.
            </p>
          </Section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
