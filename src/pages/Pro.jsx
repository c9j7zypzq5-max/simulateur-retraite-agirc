import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import { useTranslation } from "../i18n/index.js";
import { localePath } from "../i18n/paths.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const COMPARISON_ROWS = {
  fr: [
    { feature: "Simulateurs disponibles", free: "30+", pro: "30+" },
    { feature: "Simulations sauvegardées", free: "5 max", pro: "Illimitées" },
    { feature: "Rapport PDF standard", free: true, pro: true },
    { feature: "Rapport PDF Pro (couverture, tableaux, graphique)", free: false, pro: true },
    { feature: "Export Excel complet", free: true, pro: true },
    { feature: "Tableau de bord analytique", free: false, pro: true },
    { feature: "Synthèse patrimoniale", free: false, pro: true },
    { feature: "Annotations sur vos simulations", free: false, pro: true },
    { feature: "Wizard retraite complet", free: false, pro: true },
    { feature: "Partage de rapports", free: true, pro: true },
  ],
  en: [
    { feature: "Available calculators", free: "30+", pro: "30+" },
    { feature: "Saved simulations", free: "5 max", pro: "Unlimited" },
    { feature: "Standard PDF report", free: true, pro: true },
    { feature: "Pro PDF report (cover, tables, chart)", free: false, pro: true },
    { feature: "Full Excel export", free: true, pro: true },
    { feature: "Analytics dashboard", free: false, pro: true },
    { feature: "Wealth overview", free: false, pro: true },
    { feature: "Simulation annotations", free: false, pro: true },
    { feature: "Full retirement wizard", free: false, pro: true },
    { feature: "Report sharing", free: true, pro: true },
  ],
};

const FEATURES_GRID = {
  fr: [
    { icon: "📊", title: "Rapport PDF Pro", desc: "Page de couverture, tableaux enrichis, graphique intégré et section « À retenir » professionnelle." },
    { icon: "🗄️", title: "Simulations illimitées", desc: "Sauvegardez autant de scénarios que vous voulez, sans limite." },
    { icon: "📋", title: "Tableau de bord analytique", desc: "Répartition par catégorie, KPIs, accès rapide à toutes vos simulations." },
    { icon: "💼", title: "Synthèse patrimoniale", desc: "Vision consolidée retraite + épargne + immobilier en un coup d'œil." },
    { icon: "✏️", title: "Annotations", desc: "Renommez et annotez vos simulations pour mieux les retrouver." },
    { icon: "🧭", title: "Wizard retraite", desc: "Profil complet → liens pré-remplis vers chaque simulateur retraite." },
  ],
  en: [
    { icon: "📊", title: "Pro PDF Report", desc: "Cover page, rich tables, embedded chart and a professional key takeaways section." },
    { icon: "🗄️", title: "Unlimited simulations", desc: "Save as many scenarios as you want, without any limit." },
    { icon: "📋", title: "Analytics dashboard", desc: "Category breakdown, KPIs, and quick access to all your simulations." },
    { icon: "💼", title: "Wealth overview", desc: "Consolidated view of pension + savings + real estate at a glance." },
    { icon: "✏️", title: "Annotations", desc: "Rename and annotate your simulations to find them easily." },
    { icon: "🧭", title: "Retirement wizard", desc: "Full profile → pre-filled links to each retirement calculator." },
  ],
};

const FAQ = {
  fr: [
    ["Comment l'abonnement fonctionne-t-il ?", "Paiement mensuel par carte bancaire via Stripe. Sans engagement, résiliable à tout moment depuis le portail Stripe. Aucune donnée de carte n'est stockée sur nos serveurs."],
    ["L'accès Pro fonctionne-t-il sur plusieurs appareils ?", "Oui. Votre abonnement est lié à votre compte : connectez-vous sur n'importe quel appareil pour retrouver vos fonctionnalités Pro."],
    ["Le rapport PDF Pro est-il différent du gratuit ?", "Oui : il inclut une page de couverture, des tableaux alternés, le graphique intégré, une section \"À retenir\" enrichie, et un pied de page professionnel sur chaque page."],
    ["Puis-je annuler à tout moment ?", "Oui, sans frais. L'accès Pro reste actif jusqu'à la fin de la période payée."],
    ["Combien puis-je sauvegarder de simulations ?", "En gratuit, vous pouvez sauvegarder 5 simulations. En Pro, c'est illimité : sauvegardez autant de scénarios que vous souhaitez."],
    ["Quelles fonctionnalités sont vraiment Pro ?", "Le rapport PDF Pro (couverture, tableaux enrichis, graphique), le tableau de bord analytique, la synthèse patrimoniale, les annotations sur vos simulations, le wizard retraite complet, et les simulations illimitées."],
  ],
  en: [
    ["How does the subscription work?", "Monthly payment by card via Stripe. No commitment, cancel anytime from the Stripe portal. No card data is stored on our servers."],
    ["Does Pro access work on multiple devices?", "Yes. Your subscription is linked to your account: sign in on any device to access your Pro features."],
    ["Is the Pro PDF report different from the free one?", "Yes: it includes a cover page, alternating tables, the embedded chart, an enriched \"Key takeaways\" section, and a professional footer on every page."],
    ["Can I cancel at any time?", "Yes, free of charge. Pro access remains active until the end of the paid period."],
    ["How many simulations can I save?", "On the free plan, you can save 5 simulations. With Pro, it's unlimited: save as many scenarios as you want."],
    ["Which features are truly Pro?", "The Pro PDF report (cover page, rich tables, chart), the analytics dashboard, the wealth overview, simulation annotations, the full retirement wizard, and unlimited saved simulations."],
  ],
};

export default function Pro() {
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const { isPro, user, email: proEmail, getAccessToken } = useAuth();
  const { t, locale } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portalBusy, setPortalBusy] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title = t("pro.docTitle");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    return () => robots?.setAttribute('content', 'index, follow');
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubscribe() {
    if (!user) {
      navigate(`${localePath("/connexion", locale)}?next=${localePath("/pro", locale)}`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/stripe?action=create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ origin: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || (locale === "en" ? "An error occurred. Please try again." : "Une erreur est survenue. Réessayez."));
      }
    } catch {
      setError(locale === "en" ? "Unable to contact the server. Check your connection." : "Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  async function handleManageSubscription() {
    setPortalBusy(true); setError("");
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/stripe?action=portal", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ origin: window.location.origin }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || (locale === "en" ? "Unable to open the management portal." : "Impossible d'ouvrir le portail de gestion."));
    } catch {
      setError(locale === "en" ? "Unable to contact the server." : "Impossible de contacter le serveur.");
    } finally {
      setPortalBusy(false);
    }
  }

  const faqItems = FAQ[locale] || FAQ.fr;
  const compRows = COMPARISON_ROWS[locale] || COMPARISON_ROWS.fr;
  const featuresGrid = FEATURES_GRID[locale] || FEATURES_GRID.fr;
  const homePath = localePath("/", locale);

  const card = {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "28px",
  };

  function CellVal({ val }) {
    if (val === true) return <span style={{ color: "#22a559", fontWeight: 700, fontSize: 16 }}>✓</span>;
    if (val === false) return <span style={{ color: "var(--text-secondary)", fontSize: 16 }}>—</span>;
    return <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{val}</span>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to={homePath} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>{t("nav.home")}</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Simfinly Pro</span>
        </div>

        {/* ── 1. HERO ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(184,147,74,0.07) 0%, var(--surface) 60%)",
          border: "1px solid var(--border-gold)",
          borderRadius: 20,
          padding: "40px 32px 36px",
          textAlign: "center",
          marginBottom: 28,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(184,147,74,0.14)", border: "1px solid var(--border-gold)",
            borderRadius: 20, padding: "5px 14px", marginBottom: 22,
            fontSize: 12, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.08em",
          }}>{t("pro.badge")}</div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(28px,5.5vw,46px)",
            fontWeight: 700,
            color: "var(--text)",
            margin: "0 0 14px",
            lineHeight: 1.18,
          }}>
            {t("pro.title")}
          </h1>
          <p style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto",
          }}>
            {t("pro.subtitle")}
          </p>
        </div>

        {/* ── 2. MÉTRIQUES SOCIALES ── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 36,
        }}>
          {[
            locale === "en" ? "30+ calculators" : "30+ simulateurs",
            locale === "en" ? "12,000+ users" : "12 000+ utilisateurs",
            locale === "en" ? "85,000+ simulations" : "85 000+ simulations",
          ].map((chip) => (
            <div key={chip} style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "8px 16px",
              fontSize: 13,
              color: "var(--text-secondary)",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}>{chip}</div>
          ))}
        </div>

        {/* ── 3. TABLEAU COMPARATIF ou BLOC MEMBRE PRO ── */}
        {isPro ? (
          <div style={{
            ...card,
            border: "1.5px solid var(--border-gold)",
            background: "rgba(184,147,74,0.06)",
            marginBottom: 36,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>★</span>
              <div>
                <div style={{ fontWeight: 700, color: "var(--gold)", fontSize: 17 }}>{t("pro.memberTitle")}</div>
                {proEmail && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{proEmail}</div>}
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 22, lineHeight: 1.6 }}>
              {t("pro.memberDesc")}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to={homePath} style={{
                display: "inline-block", padding: "10px 20px",
                background: "var(--gold)", color: "#1a1000", borderRadius: 10,
                fontSize: 13, fontWeight: 700, textDecoration: "none",
              }}>
                {t("pro.backToSims")}
              </Link>
              <button
                onClick={handleManageSubscription}
                disabled={portalBusy}
                style={{
                  padding: "10px 20px", background: "none",
                  border: "1px solid var(--border)", borderRadius: 10,
                  fontSize: 13, color: "var(--text-secondary)",
                  cursor: portalBusy ? "not-allowed" : "pointer",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                }}
              >
                {portalBusy ? t("pro.portalLoading") : t("pro.manageSubscription")}
              </button>
            </div>
            {error && <p style={{ fontSize: 12, color: "#c0392b", marginTop: 12 }}>{error}</p>}
          </div>
        ) : (
          <div style={{ marginBottom: 40 }}>
            {/* Tableau comparatif */}
            <div style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
            }}>
              {/* Header colonnes */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 140px",
                gap: 0,
              }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.04em" }}>
                  {locale === "en" ? "FEATURE" : "FONCTIONNALITÉ"}
                </div>
                <div style={{ padding: "14px 12px", borderBottom: "1px solid var(--border)", textAlign: "center", fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.06em", borderLeft: "1px solid var(--border)" }}>
                  {t("pro.freeTier")}
                </div>
                <div style={{
                  padding: "14px 12px",
                  borderBottom: "1px solid var(--border-gold)",
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1a1000",
                  letterSpacing: "0.06em",
                  background: "var(--gold)",
                  borderLeft: "1px solid var(--border-gold)",
                }}>
                  {t("pro.proTier")} ★
                </div>
              </div>

              {/* Lignes */}
              {compRows.map((row, i) => (
                <div key={row.feature} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 140px",
                  alignItems: "stretch",
                  background: i % 2 === 0 ? "transparent" : "rgba(184,147,74,0.025)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", padding: "11px 20px", fontSize: 13, color: "var(--text)", borderBottom: "1px solid var(--border)", lineHeight: 1.45 }}>
                    {row.feature}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 12px", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>
                    <CellVal val={row.free} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 12px", borderBottom: "1px solid rgba(184,147,74,0.25)", borderLeft: "1px solid var(--border-gold)", background: "rgba(184,147,74,0.04)" }}>
                    <CellVal val={row.pro} />
                  </div>
                </div>
              ))}

              {/* Footer avec CTA */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 140px",
              }}>
                <div style={{ padding: "20px 20px" }} />
                <div style={{ padding: "20px 12px", textAlign: "center", borderLeft: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>0 €</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{t("pro.forever")}</div>
                </div>
                <div style={{
                  padding: "20px 12px",
                  textAlign: "center",
                  background: "rgba(184,147,74,0.06)",
                  borderLeft: "1px solid var(--border-gold)",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>2,99 €</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                    {t("pro.perMonth")}
                  </div>
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    style={{
                      marginTop: 12,
                      width: "100%",
                      padding: "10px 8px",
                      borderRadius: 10,
                      background: loading ? "var(--border)" : "var(--gold)",
                      color: loading ? "var(--text-secondary)" : "#1a1000",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {loading ? t("pro.redirecting") : user ? t("pro.subscribeBtn") : t("pro.loginToSubscribe")}
                  </button>
                  {!user && (
                    <p style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.4 }}>
                      {t("pro.loginNote")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Note sans engagement */}
            <p style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "center", marginTop: 12 }}>
              {locale === "en"
                ? "No commitment · Cancel anytime · Secure payment by Stripe"
                : "Sans engagement · Résiliable à tout moment · Paiement sécurisé par Stripe"}
            </p>

            {error && <p style={{ fontSize: 12, color: "#c0392b", marginTop: 8, textAlign: "center" }}>{error}</p>}
          </div>
        )}

        {/* ── 4. GRILLE FEATURES PRO ── */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 20,
            textAlign: "center",
          }}>
            {locale === "en" ? "What's included in Pro" : "Ce qui est inclus dans Pro"}
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 16,
          }}>
            {featuresGrid.map((feat) => (
              <div key={feat.title} style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "20px 18px",
                transition: "border-color 0.15s",
                cursor: "default",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--border-gold)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ fontSize: 30, marginBottom: 10, lineHeight: 1 }}>{feat.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{feat.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. GARANTIE ── */}
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "18px 24px",
          textAlign: "center",
          marginBottom: 40,
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}>
          {locale === "en"
            ? "🔒 100% secure payment by Stripe · Cancel in one click · Your data is never sold"
            : "🔒 Paiement 100 % sécurisé par Stripe · Résiliable en un clic · Données jamais revendues"}
        </div>

        {/* ── 6. FAQ ── */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 16,
          }}>
            {t("pro.faqTitle")}
          </h2>
          {faqItems.map(([q, a], idx) => (
            <div key={q} style={{ borderBottom: "1px solid var(--border)" }}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  textAlign: "left",
                  gap: 12,
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{q}</span>
                <span style={{
                  flexShrink: 0,
                  fontSize: 18,
                  color: "var(--text-secondary)",
                  transition: "transform 0.2s",
                  transform: openFaq === idx ? "rotate(45deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}>+</span>
              </button>
              {openFaq === idx && (
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, paddingBottom: 16 }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pied de page légal */}
        <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, textAlign: "center" }}>
          {locale === "en"
            ? "Secure payment by Stripe · Indicative simulation, not contractual · GDPR compliant"
            : "Paiement sécurisé par Stripe · Simulation indicative, non contractuelle · Conformité RGPD"}
        </p>
      </div>

      <Footer />
    </div>
  );
}
