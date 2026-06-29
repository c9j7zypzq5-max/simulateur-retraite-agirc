import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useSimHistory } from "../hooks/useSimHistory.js";
import { useTranslation } from "../i18n/index.js";
import { localePath } from "../i18n/paths.js";
import { useNoIndex } from "../hooks/useNoIndex.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import OnboardingModal, { shouldShowOnboarding } from "../components/OnboardingModal.jsx";
import Skeleton, { skeletonStyles } from "../components/Skeleton.jsx";

const NAV_ITEMS = [
  { labelFr: "Mes simulations", labelEn: "My simulations", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>, toFr: "/mes-simulations", toEn: "/en/mes-simulations" },
  { labelFr: "Comparaisons", labelEn: "Comparisons", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, toFr: "/mes-simulations?tab=compare", toEn: "/en/mes-simulations?tab=compare" },
  { labelFr: "Profil", labelEn: "Profile", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>, toFr: "/compte", toEn: "/en/compte", active: true },
  { labelFr: "Abonnement", labelEn: "Subscription", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v6M12 17v6M4.2 4.2l4.3 4.3M15.5 15.5l4.3 4.3M1 12h6M17 12h6"/></svg>, toFr: "/pro", toEn: "/en/pro" },
];

export default function Compte() {
  const navigate = useNavigate();
  useNoIndex();
  const { user, loading, isPro, profile, signOut, getAccessToken } = useAuth();
  const { getHistory } = useSimHistory();
  const { t, locale } = useTranslation();
  const isEn = locale === "en";
  const [portalBusy, setPortalBusy] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.title = t("account.docTitle");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, follow");
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => { robots?.setAttribute("content", "index, follow"); window.removeEventListener("resize", handleResize); };
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
    const update = () => setSavedCount(getHistory().length);
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleManageSubscription() {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setPortalBusy(true); setError("");
    const timeout = setTimeout(() => abortRef.current?.abort(), 10000);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/stripe?action=portal", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ origin: window.location.origin }),
        signal: abortRef.current.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        const msg = res.status === 400
          ? (isEn ? "No subscription found for this account." : "Aucun abonnement trouvé pour ce compte.")
          : res.status === 401
            ? (isEn ? "Session expired. Please log in again." : "Session expirée. Reconnectez-vous.")
            : data.error || t("account.portalLoading");
        setError(msg);
      }
    } catch (e) {
      clearTimeout(timeout);
      if (e.name === "AbortError") {
        setError(isEn ? "Request timed out. Check your connection." : "La requête a expiré. Vérifiez votre connexion.");
      } else {
        setError(isEn ? "Unable to contact the server. Try again." : "Impossible de contacter le serveur. Réessayez.");
      }
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
      <div style={{ minHeight: "100vh", background: "#F5F6F8", fontFamily: "'Hanken Grotesk', sans-serif" }}>
        <style>{skeletonStyles}</style>
        <Navbar />
        <div style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
          <Skeleton height={32} width={200} style={{ marginBottom: 12 }} />
          <Skeleton height={18} width={160} style={{ marginBottom: 28 }} />
          <Skeleton height={90} radius={14} style={{ marginBottom: 12 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Skeleton height={80} radius={14} />
            <Skeleton height={80} radius={14} />
          </div>
          <Skeleton height={160} radius={14} style={{ marginBottom: 12 }} />
          <Skeleton height={140} radius={14} />
        </div>
      </div>
    );
  }

  const dateLocale = isEn ? "en-GB" : "fr-FR";
  const periodEnd = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })
    : null;
  const proPath = localePath("/pro", locale);
  const simsPath = isEn ? "/en/mes-simulations" : "/mes-simulations";
  const reportCount = profile?.report_count || 0;
  const reportsUsed = isPro ? (isEn ? "Unlimited" : "Illimité") : `${reportCount} / 3`;
  const email = user?.email || profile?.email || "";
  const initials = email.slice(0, 2).toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(dateLocale, { month: "long", year: "numeric" })
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F6F8", fontFamily: "'Hanken Grotesk', sans-serif", color: "#0F1828" }}>
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      <Navbar />

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ display: isMobile ? "block" : "grid", gridTemplateColumns: "230px 1fr", gap: 0, alignItems: "start", marginTop: 24 }}>

          {/* Sidebar */}
          {!isMobile && (
            <div style={{ background: "#fff", borderRight: "1px solid #e7eaf0", padding: "28px 20px", minHeight: 520, borderRadius: "14px 0 0 14px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a93a3", fontWeight: 700, marginBottom: 14 }}>
                {isEn ? "My account" : "Mon compte"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {NAV_ITEMS.map(item => {
                  const to = isEn ? item.toEn : item.toFr;
                  const label = isEn ? item.labelEn : item.labelFr;
                  const isActive = item.active;
                  return (
                    <Link
                      key={label}
                      to={to}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        fontSize: 14, fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#2B5CE6" : "#5B6677",
                        background: isActive ? "#EAF0FF" : "transparent",
                        padding: "10px 12px", borderRadius: 10,
                        textDecoration: "none", transition: "background 0.15s",
                      }}
                    >
                      {item.icon}{label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main */}
          <div style={{ background: "#fff", borderRadius: isMobile ? 14 : "0 14px 14px 0", border: "1px solid #e7eaf0", borderLeft: isMobile ? "1px solid #e7eaf0" : "none", padding: isMobile ? "20px 16px" : "28px 30px 36px" }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? 22 : 26, fontWeight: 600, letterSpacing: "-0.01em", color: "#0F1828", margin: 0 }}>
                {isEn ? "My account" : "Mon compte"}
              </h1>
              <div style={{ fontSize: 13.5, color: "#8a93a3", marginTop: 4 }}>
                {email}
              </div>
            </div>

            {/* Identity card */}
            <div style={{ background: "#F5F6F8", border: "1px solid #e7eaf0", borderRadius: 14, padding: "20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0, background: "#EAF0FF", color: "#2B5CE6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0F1828", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
                {memberSince && (
                  <div style={{ fontSize: 12, color: "#8a93a3", marginTop: 2 }}>
                    {isEn ? `Member since ${memberSince}` : `Membre depuis ${memberSince}`}
                  </div>
                )}
              </div>
              {isPro && (
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#b45309", background: "#fef3c7", border: "1px solid #fde68a", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  Pro
                </span>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <Link to={simsPath} style={{ background: "#F5F6F8", border: "1px solid #e7eaf0", borderRadius: 14, padding: 20, textDecoration: "none" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 600, color: "#2B5CE6" }}>{savedCount}</div>
                <div style={{ fontSize: 12, color: "#8a93a3", marginTop: 4 }}>
                  {isEn ? "Saved simulations" : "Simulations sauvegardées"}
                </div>
              </Link>
              <div style={{ background: "#F5F6F8", border: "1px solid #e7eaf0", borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 600, color: "#2B5CE6" }}>{reportsUsed}</div>
                <div style={{ fontSize: 12, color: "#8a93a3", marginTop: 4 }}>
                  {isEn ? "PDF reports generated" : "Rapports PDF générés"}
                </div>
              </div>
            </div>

            {/* Plan card */}
            <div style={{ background: isPro ? "rgba(43,92,230,0.04)" : "#F5F6F8", border: isPro ? "1.5px solid #2B5CE6" : "1px solid #e7eaf0", borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 18, color: isPro ? "#2B5CE6" : "#8a93a3" }}>
                  {isPro
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v6M12 17v6M4.2 4.2l4.3 4.3M15.5 15.5l4.3 4.3M1 12h6M17 12h6"/></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                  }
                </span>
                <div style={{ fontSize: 16, fontWeight: 600, color: isPro ? "#2B5CE6" : "#0F1828" }}>
                  {isPro ? t("account.proActive") : t("account.freePlan")}
                </div>
              </div>
              {isPro ? (
                <>
                  <p style={{ fontSize: 13, color: "#5B6677", marginBottom: 18, lineHeight: 1.6 }}>
                    {t("account.proDesc")}
                    {periodEnd && <> {t("account.nextRenewal")} <strong style={{ color: "#0F1828" }}>{periodEnd}</strong>.</>}
                  </p>
                  <button
                    onClick={handleManageSubscription}
                    disabled={portalBusy}
                    style={{ padding: "11px 20px", borderRadius: 10, background: "#2B5CE6", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: portalBusy ? "not-allowed" : "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
                  >
                    {portalBusy ? t("account.portalLoading") : t("account.manageSubscription")}
                  </button>
                  <p style={{ fontSize: 11, color: "#8a93a3", marginTop: 10 }}>{t("account.portalDesc")}</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: "#5B6677", marginBottom: 18, lineHeight: 1.6 }}>
                    {t("account.upgradeDesc")}
                  </p>
                  <Link to={proPath} style={{ display: "inline-block", padding: "11px 20px", borderRadius: 10, background: "#2B5CE6", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                    {t("account.discoverPro")}
                  </Link>
                </>
              )}
              {error && <p style={{ fontSize: 13, color: "#c2410c", marginTop: 12 }}>{error}</p>}
            </div>

            {/* Quick links */}
            <div style={{ background: "#F5F6F8", border: "1px solid #e7eaf0", borderRadius: 14, padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8a93a3", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {isEn ? "Quick access" : "Accès rapide"}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { to: simsPath, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>, label: isEn ? "My saved simulations" : "Mes simulations sauvegardées" },
                  { to: isEn ? "/en" : "/", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-9"/></svg>, label: isEn ? "All simulators" : "Tous les simulateurs" },
                  { to: isPro ? undefined : proPath, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v6M12 17v6M4.2 4.2l4.3 4.3M15.5 15.5l4.3 4.3M1 12h6M17 12h6"/></svg>, label: isPro ? (isEn ? "Manage subscription" : "Gérer mon abonnement") : (isEn ? "Upgrade to Pro" : "Passer à Pro"), onClick: isPro ? handleManageSubscription : undefined, highlight: true },
                ].map(({ to, icon, label, onClick, highlight }, i, arr) => {
                  const itemStyle = {
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                    textDecoration: "none", color: highlight ? "#2B5CE6" : "#0F1828", fontSize: 14,
                    borderBottom: i < arr.length - 1 ? "1px solid #e7eaf0" : "none",
                    cursor: "pointer", background: "none", border: "none",
                    fontFamily: "'Hanken Grotesk', sans-serif", width: "100%", textAlign: "left",
                    fontWeight: highlight ? 600 : 400,
                  };
                  const content = <><span style={{ color: highlight ? "#2B5CE6" : "#5B6677", display: "flex" }}>{icon}</span>{label}</>;
                  if (onClick) return <button key={i} onClick={onClick} style={itemStyle}>{content}</button>;
                  return <Link key={i} to={to} style={itemStyle}>{content}</Link>;
                })}
              </div>
            </div>

            <button
              onClick={handleSignOut}
              style={{ padding: "11px 20px", borderRadius: 10, background: "none", border: "1px solid #e7eaf0", color: "#8a93a3", fontSize: 14, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              {t("account.signOut")}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
