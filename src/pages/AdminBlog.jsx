import { useCallback, useEffect, useState } from "react";

// Page interne (non listée, non indexée) pour relire, approuver ou rejeter les
// brouillons d'articles générés automatiquement par le cron (api/generate-article.js)
// avant leur publication réelle sur le blog. Protégée par le même secret que les
// endpoints (CRON_SECRET / PUBLISH_SECRET), saisi ici et envoyé en Bearer token —
// aucune donnée sensible n'est stockée côté serveur, seulement dans sessionStorage
// du navigateur le temps de la session.

const TOKEN_KEY = "admin_blog_token";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function AdminBlog() {
  const [token, setToken] = useState(() => {
    try { return sessionStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
  });
  const [tokenInput, setTokenInput] = useState("");
  const [drafts, setDrafts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busySlug, setBusySlug] = useState(null);

  useEffect(() => {
    const prevRobots = document.querySelector('meta[name="robots"]')?.getAttribute("content");
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "robots"; document.head.appendChild(meta); }
    meta.setAttribute("content", "noindex, nofollow");
    document.title = "Admin — brouillons du blog";
    return () => { if (prevRobots) meta.setAttribute("content", prevRobots); };
  }, []);

  const loadDrafts = useCallback(async (authToken) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/publish-article", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        setError("Jeton invalide.");
        setToken("");
        try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
        setDrafts(null);
        return;
      }
      if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch (err) {
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadDrafts(token);
  }, [token, loadDrafts]);

  function handleTokenSubmit(e) {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    try { sessionStorage.setItem(TOKEN_KEY, tokenInput.trim()); } catch { /* ignore */ }
    setToken(tokenInput.trim());
  }

  async function handleAction(slug, action) {
    setBusySlug(slug);
    setError("");
    try {
      const res = await fetch("/api/publish-article", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, slug }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erreur serveur (${res.status})`);
      }
      setDrafts(prev => (prev || []).filter(d => d.slug !== slug));
    } catch (err) {
      setError(err.message || "Erreur");
    } finally {
      setBusySlug(null);
    }
  }

  const wrap = { minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif", padding: "40px 20px" };
  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 };
  const btn = (variant) => ({
    padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer",
    background: variant === "approve" ? "var(--positive)" : variant === "reject" ? "var(--negative)" : "var(--primary)",
    color: "#fff", marginRight: 8, opacity: 1,
  });

  if (!token) {
    return (
      <div style={wrap}>
        <div style={{ maxWidth: 400, margin: "80px auto" }}>
          <h1 style={{ fontSize: 20, marginBottom: 16 }}>Admin — accès brouillons</h1>
          <form onSubmit={handleTokenSubmit} style={card}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 8, color: "var(--text-secondary)" }}>
              Jeton (CRON_SECRET / PUBLISH_SECRET)
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", marginBottom: 12 }}
              autoFocus
            />
            <button type="submit" style={btn("primary")}>Valider</button>
          </form>
          {error && <p style={{ color: "var(--negative)", fontSize: 13 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 22 }}>Brouillons en attente de relecture</h1>
          <button
            onClick={() => { setToken(""); try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } }}
            style={{ ...btn("primary"), background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            Se déconnecter
          </button>
        </div>

        {loading && <p style={{ color: "var(--text-secondary)" }}>Chargement…</p>}
        {error && <p style={{ color: "var(--negative)", marginBottom: 16 }}>{error}</p>}
        {!loading && drafts && drafts.length === 0 && (
          <p style={{ color: "var(--text-secondary)" }}>Aucun brouillon en attente.</p>
        )}

        {(drafts || []).map(d => (
          <div key={d.slug} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600 }}>{d.title}</h2>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{formatDate(d.generatedAt)}</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--gold)", marginBottom: 10 }}>{d.category} · {d.readTime} min · /{d.slug}</p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12, fontStyle: "italic" }}>{d.intro}</p>
            <div
              style={{ fontSize: 14, lineHeight: 1.7, maxHeight: 320, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 8, padding: 14, marginBottom: 14, background: "var(--bg)" }}
              dangerouslySetInnerHTML={{ __html: d.content }}
            />
            <div>
              <button disabled={busySlug === d.slug} onClick={() => handleAction(d.slug, "approve")} style={btn("approve")}>
                {busySlug === d.slug ? "…" : "Publier"}
              </button>
              <button disabled={busySlug === d.slug} onClick={() => handleAction(d.slug, "reject")} style={btn("reject")}>
                {busySlug === d.slug ? "…" : "Rejeter"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
