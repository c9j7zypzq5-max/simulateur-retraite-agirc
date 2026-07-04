// Sommaire (jump links) pour les pages longues (guides pilier). Améliore la
// navigation utilisateur (accès direct à une section) et augmente les chances
// de featured snippet Google sur une section précise plutôt que la page entière.
export default function TableOfContents({ items }) {
  function scrollTo(e, id) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav
      aria-label="Sommaire"
      style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
        padding: "16px 20px", margin: "0 0 32px",
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 700, marginBottom: 10 }}>
        Sommaire
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={e => scrollTo(e, id)}
              style={{ fontSize: 14, color: "var(--primary)", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; }}
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
