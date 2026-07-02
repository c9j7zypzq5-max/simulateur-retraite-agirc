import { Link } from "../lib/router.jsx";

// Fil d'Ariane visible et réutilisable : Accueil · Section · Page courante.
// Le dernier élément (sans `to`) est rendu en texte simple. Style aligné sur
// le fil d'Ariane historique de LexiqueTerme. Le JSON-LD BreadcrumbList est
// déjà injecté au build (api/_routes.js) : ce composant apporte l'UI + le
// maillage interne crawlable.
export default function Breadcrumbs({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <nav aria-label="Fil d'Ariane" style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
      {items.map((it, i) => (
        <span key={`${it.label}-${i}`}>
          {i > 0 && " · "}
          {it.to
            ? <Link to={it.to} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>{it.label}</Link>
            : <span style={{ color: "var(--text)" }}>{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}
