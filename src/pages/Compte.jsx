import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import { useSimHistory } from "../hooks/useSimHistory.js";
import { useTranslation } from "../i18n/index.js";
import { localePath } from "../i18n/paths.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import OnboardingModal, { shouldShowOnboarding } from "../components/OnboardingModal.jsx";

const FREE_REPORT_LIMIT = 3;

export default function Compte() {
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const { user, loading, isPro, profile, signOut, getAccessToken } = useAuth();
  const { getHistory } = useSimHistory();
  const { t, locale } = useTranslation();
  const [portalBusy, setPortalBusy] = useState(false);
  const [error, setError] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    document.title = t("account.docTitle");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, follow");
    return () => robots?.setAttribute("content", "index, follow");
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && !user) {
      const loginPath = localePath("/connexion", locale);
      const next = localePath("/compte", locale);
      navigate(`${loginPath}?next=${next}`, { replace: true });
    }
  }, [loading, user, navigate, locale]);

  useEffect(() => {
    if (user && shouldShowOnboarding()) setShowOnboarding(true);
  }, [user]);

  useEffect(() => {
    setSavedCount(getHistory().length);
  }, []);

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
      else setError(data.error || t("account.portalLoading"));
    } catch {
      setError(locale === "en" ? "Unable to contact the server." : "Impossible de contacter le serveur.");
    } finally {
      setPortalBusy(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
        {t("account.loading")}
      </div>
    );
  }

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px" };
  const dateLocale = locale === "en" ? "en-GB" : "fr-FR";
  const periodEnd = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })
    : null;
  const proPath = localePath("/pro", locale);
  const simsPath = "/mes-simulations";

  const reportCount = profile?.report_count || 0;
  const reportsUsed = isPro ? locale === "en" ? "Unlimited" : "Illimité" : `${reportCount} / ${FREE_REPORT_LIMIT}`;
  const email = user?.email || profile?.email || "";

  // Member since date from user metadata
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(dateLocale, { month: "long", year: "numeric" })
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      <Navbar theme={theme} setTheme={setTheme} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to={locale === "en" ? "/en" : "/"} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>{t("nav.home")}</Link>
          {" · "}<span style={{ color: "var(--text)" }}>{t("account.breadcrumb")}</span>
        </div>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 600, margin: "16px 0 28px" }}>
          {t("account.title")}
        </h1>

        {/* User identity card */}
        <div style={{ ...card, marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--gold) 0%, #c8860b 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "#1a1000",
          }}>
            {email.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
            {memberSince && (
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                {locale === "en" ? `Member since ${memberSince}` : `Membre depuis ${memberSince}`}
              </div>
            )}
          </div>
          {isPro && (
            <span style={{
              padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              background: "rgba(184,147,74,0.15)", color: "var(--gold)", border: "1px solid rgba(184,147,74,0.3)",
              whiteSpace: "nowrap",
            }}>★ PRO</span>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Link to={simsPath} style={{ ...card, textDecoration: "none", color: "var(--text)", padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)", fontFamily: "'Space Grotesk', sans-serif" }}>{savedCount}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
              {locale === "en" ? "Saved simulations" : "Simulations sauvegardées"}
            </div>
          </Link>
          <div style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)", fontFamily: "'Space Grotesk', sans-serif" }}>{reportsUsed}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
              {locale === "en" ? "PDF reports generated" : "Rapports PDF générés"}
            </div>
          </div>
        </div>

        {/* Plan card */}
        <div style={{ ...card, marginBottom: 16, ...(isPro ? { border: "1px solid var(--border-gold)", background: "rgba(184,147,74,0.04)" } : {}) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 20, color: isPro ? "var(--gold)" : "var(--text-secondary)" }}>★</span>
            <div style={{ fontSize: 16, fontWeight: 600, color: isPro ? "var(--gold)" : "var(--text)" }}>
              {isPro ? t("account.proActive") : t("account.freePlan")}
            </div>
          </div>
          {isPro ? (
            <>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18, lineHeight: 1.6 }}>
                {t("account.proDesc")}
                {periodEnd && <> {t("account.nextRenewal")} <strong style={{ color: "var(--text)" }}>{periodEnd}</strong>.</>}
              </p>
              <button
                onClick={handleManageSubscription}
                disabled={portalBusy}
                style={{ padding: "11px 20px", borderRadius: 10, background: "var(--gold)", color: "#1a1000", border: "none", fontSize: 14, fontWeight: 700, cursor: portalBusy ? "not-allowed" : "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                {portalBusy ? t("account.portalLoading") : t("account.manageSubscription")}
              </button>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 10 }}>
                {t("account.portalDesc")}
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18, lineHeight: 1.6 }}>
                {t("account.upgradeDesc")}
              </p>
              <Link to={proPath} style={{ display: "inline-block", padding: "11px 20px", borderRadius: 10, background: "var(--gold)", color: "#1a1000", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                {t("account.discoverPro")}
              </Link>
            </>
          )}
          {error && <p style={{ fontSize: 13, color: "#c0392b", marginTop: 12 }}>{error}</p>}
        </div>

        {/* Quick links */}
        <div style={{ ...card, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {locale === "en" ? "Quick access" : "Accès rapide"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { to: simsPath, icon: "💾", label: locale === "en" ? "My saved simulations" : "Mes simulations sauvegardées" },
              { to: locale === "en" ? "/en" : "/", icon: "📊", label: locale === "en" ? "All simulators" : "Tous les simulateurs" },
              { to: isPro ? undefined : proPath, icon: "★", label: isPro ? (locale === "en" ? "Manage subscription" : "Gérer mon abonnement") : (locale === "en" ? "Upgrade to Pro" : "Passer à Pro"), onClick: isPro ? handleManageSubscription : undefined, gold: true },
            ].map(({ to, icon, label, onClick, gold }, i, arr) => {
              const style = {
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                textDecoration: "none", color: gold ? "var(--gold)" : "var(--text)", fontSize: 14,
                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer", background: "none", border: "none", fontFamily: "'Hanken Grotesk', sans-serif", width: "100%", textAlign: "left",
              };
              const content = <><span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{icon}</span>{label}</>;
              if (onClick) return <button key={i} onClick={onClick} style={style}>{content}</button>;
              return <Link key={i} to={to} style={style}>{content}</Link>;
            })}
          </div>
        </div>

        <button
          onClick={handleSignOut}
          style={{ padding: "11px 20px", borderRadius: 10, background: "none", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 14, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          {t("account.signOut")}
        </button>
      </div>
      <Footer />
    </div>
  );
}
