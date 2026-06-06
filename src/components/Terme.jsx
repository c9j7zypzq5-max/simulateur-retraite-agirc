import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { GLOSSARY_BY_SLUG } from "../data/glossaire.js";

// Lien vers une fiche du lexique (/lexique/:slug) avec une infobulle au survol /
// focus affichant la définition courte. Utilisable dans les simulateurs :
//   <Terme slug="taeg" />            → affiche « TAEG »
//   <Terme slug="taeg">le TAEG</Terme> → texte personnalisé
export default function Terme({ slug, children }) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const entry = GLOSSARY_BY_SLUG[slug];

  // Slug inconnu : rendu inerte pour ne jamais casser une page simulateur.
  if (!entry) return <>{children || slug}</>;

  const label = children || entry.term;

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={`/lexique/${entry.slug}`}
        aria-describedby={open ? tipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        style={{
          color: "var(--gold)",
          textDecoration: "none",
          borderBottom: "1px dotted var(--border-gold)",
          cursor: "help",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Link>

      {open && (
        <span
          role="tooltip"
          id={tipId}
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 400,
            width: "min(280px, 78vw)",
            padding: "10px 12px",
            background: "var(--card-bg)",
            border: "1px solid var(--border-gold)",
            borderRadius: 10,
            boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
            fontFamily: "'DM Sans', sans-serif",
            textAlign: "left",
            whiteSpace: "normal",
            pointerEvents: "none",
          }}
        >
          <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
            {entry.full}
          </span>
          <span style={{ display: "block", fontSize: 12, lineHeight: 1.5, color: "var(--text-secondary)" }}>
            {entry.short}
          </span>
          <span style={{ display: "block", fontSize: 11, color: "var(--gold)", marginTop: 6 }}>
            Voir la fiche →
          </span>
        </span>
      )}
    </span>
  );
}
