import { useState, useEffect, useRef } from "react";
import { ACCOUNT_ENABLED } from "../config/features.js";
import { useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import { buildShareUrl } from "../hooks/useShareableUrl.js";
import { setExporting } from "../utils/exportMode.js";
import { ROUTE_META } from "../../api/_routes.js";
import { useAuth } from "../hooks/useAuth.js";
import { useSimHistory } from "../hooks/useSimHistory.js";
import { useToast } from "../context/ToastContext.jsx";
import { useTranslation } from "../i18n/index.js";
import { localePath } from "../i18n/paths.js";
import { supabase } from "../lib/supabase.js";

// Quota de rapports pour un compte gratuit (non Pro). Au-delà → page Pro.
const FREE_REPORT_LIMIT = 1;

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const raf = () => new Promise(r => requestAnimationFrame(r));

function cleanClone(clonedDoc) {
  clonedDoc
    .querySelectorAll('nav, footer, ins.adsbygoogle, .adsbygoogle, [data-noexport], #seo-prerender')
    .forEach(el => { el.style.display = "none"; });
  clonedDoc.querySelectorAll('[style*="text-fill-color"]').forEach(el => {
    el.style.webkitTextFillColor = "#b8860b";
    el.style.color = "#b8860b";
    el.style.background = "none";
    el.style.webkitBackgroundClip = "initial";
    el.style.backgroundClip = "initial";
  });
}

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

export default function ShareBar({ params, resultsRef, name, showDownload = true, report = null, chartRef = null }) {
  const { isPro, user, isConfigured, reportCount, incrementReportCount } = useAuth();
  const { saveEntryWithSync } = useSimHistory();
  const showToast = useToast();
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportError, setReportError] = useState("");
  const [publicLinkBusy, setPublicLinkBusy] = useState(false);
  const [publicCopied, setPublicCopied] = useState(false);
  const barRef = useRef(null);

  const remaining = Math.max(0, FREE_REPORT_LIMIT - reportCount);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!publicCopied) return;
    const timer = setTimeout(() => setPublicCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [publicCopied]);

  const btnStyle = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 14px", background: "var(--card-bg)",
    border: "1px solid var(--border)", borderRadius: 10,
    color: "var(--text-secondary)", fontSize: 12,
    fontFamily: "'Hanken Grotesk', sans-serif", cursor: "pointer",
    transition: "border-color 0.2s, color 0.2s",
  };
  const hoverIn  = e => { e.currentTarget.style.borderColor = "var(--gold-mid)"; e.currentTarget.style.color = "var(--gold)"; };
  const hoverOut = e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; };

  function pageContainer() {
    let el = barRef.current;
    if (!el) return resultsRef?.current || null;
    while (el.parentElement && el.parentElement.id !== "root") el = el.parentElement;
    return el.parentElement && el.parentElement.id === "root" ? el : (resultsRef?.current || el);
  }

  async function snapshot(target, { full = false } = {}) {
    if (!target) return null;
    const isDark = !document.documentElement.getAttribute("data-theme") || document.documentElement.getAttribute("data-theme") === "dark";
    if (full) {
      setExporting(true);
      await raf(); await raf();
    }
    try {
      const html2canvas = (await import("html2canvas")).default;
      return await html2canvas(target, {
        backgroundColor: isDark ? "#060e1c" : "#faf6ef",
        scale: 2, useCORS: true, logging: false, onclone: cleanClone,
        windowWidth: target.scrollWidth, windowHeight: target.scrollHeight,
      });
    } finally {
      if (full) setExporting(false);
    }
  }

  async function generateReport() {
    let chartImage = null;
    if (chartRef?.current) {
      try {
        const c = await snapshot(chartRef.current);
        if (c) chartImage = { dataUrl: c.toDataURL("image/png"), w: c.width, h: c.height };
      } catch { /* pas de graphique */ }
    }
    const cleanUrl = window.location.origin + window.location.pathname;
    if (report) {
      const { buildReportPdfPro } = await import("../utils/pdfReport.js");
      await buildReportPdfPro({ report, url: cleanUrl, name, chartImage });
      return;
    }
    const canvas = await snapshot(pageContainer(), { full: true });
    if (!canvas) return;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const date = new Date().toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(13); pdf.setTextColor(43, 92, 230);
    pdf.text("simfinly.com", margin, margin + 6);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(120, 120, 120);
    pdf.text(`${locale === "en" ? "Report" : "Compte-rendu"} · ${date}`, pageW - margin, margin + 6, { align: "right" });
    pdf.setDrawColor(43, 92, 230); pdf.setLineWidth(1);
    pdf.line(margin, margin + 14, pageW - margin, margin + 14);
    const headerH = margin + 24;
    const imgW = pageW - margin * 2;
    const imgH = (imgW * canvas.height) / canvas.width;
    const imgData = canvas.toDataURL("image/png");
    let position = headerH;
    pdf.addImage(imgData, "PNG", margin, position, imgW, imgH, undefined, "FAST");
    let heightLeft = imgH - (pageH - headerH);
    while (heightLeft > 0) {
      position = heightLeft - imgH;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgW, imgH, undefined, "FAST");
      heightLeft -= pageH;
    }
    pdf.save(`simulation-${name}.pdf`);
  }

  async function handleReport() {
    if (ACCOUNT_ENABLED && isConfigured) {
      if (!user) { navigate(`${localePath("/connexion", locale)}?next=${encodeURIComponent(window.location.pathname)}`); return; }
      if (!isPro && reportCount >= FREE_REPORT_LIMIT) { navigate(localePath("/pro", locale)); return; }
    }
    setBusy(true);
    setReportError("");
    track("export", { format: "report", simulateur: name });
    try {
      await generateReport();
      if (isConfigured && !isPro) await incrementReportCount();
    } catch {
      const msg = locale === "en" ? "Export failed. Try again." : "Échec de l'export. Réessayez.";
      setReportError(msg);
      setTimeout(() => setReportError(""), 4000);
    } finally { setBusy(false); }
  }

  function handleSave() {
    const shareUrl = buildShareUrl(params);
    const simulator = name || window.location.pathname;
    const label = report?.title || name || simulator;
    const reportSnapshot = report
      ? { highlight: report.highlight, results: report.results?.slice(0, 6) }
      : undefined;
    saveEntryWithSync({ simulator, label, shareUrl, reportSnapshot }, { user, supabaseClient: supabase });
    setSaved(true);
    showToast(locale === "en" ? "Simulation saved!" : "Simulation sauvegardée !");
    track("save_simulation", { simulateur: name });
    setTimeout(() => setSaved(false), 2500);
  }

  async function handlePublicLink() {
    if (!isPro) { navigate(localePath("/pro", locale)); return; }
    setPublicLinkBusy(true);
    try {
      const shareUrl = buildShareUrl(params);
      const res = await fetch(`/api/share?action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          params: shareUrl,
          title: report?.title || name || "",
          highlight: report?.highlight || null,
        }),
      });
      const data = await res.json();
      if (data.id) {
        const publicUrl = `${window.location.origin}/s/${data.id}`;
        await navigator.clipboard.writeText(publicUrl);
        setPublicCopied(true);
        showToast(locale === "en" ? "Public link copied!" : "Lien public copié !");
        track("public_link", { simulateur: name });
      }
    } catch { /* ignore */ } finally { setPublicLinkBusy(false); }
  }

  async function handleShare() {
    setBusy(true);
    const stateUrl = buildShareUrl(params);
    let url = stateUrl;
    if (report?.highlight) {
      const cat = ROUTE_META[window.location.pathname]?.cat || "";
      const qs = new URLSearchParams({
        to: stateUrl,
        t: report.title || name || "",
        v: report.highlight.value || "",
        s: report.highlight.label || "",
        c: cat,
        l: locale,
      });
      url = `${window.location.origin}/api/share?${qs.toString()}`;
    }
    const title = `${report?.title || name} · simfinly.com`;
    const text = t("common.shareText");
    try {
      if (navigator.share) {
        try { await navigator.share({ title, text, url }); return; } catch { /* annulé */ }
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
    } catch {
      try { await navigator.clipboard.writeText(url); setCopied(true); } catch { /* ignore */ }
    } finally { setBusy(false); }
  }

  return (
    <div ref={barRef} data-noexport="true" data-noprint style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 16, flexWrap: "wrap" }}>
      {report?.highlight && (
        <div style={{ flexBasis: "100%", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 2 }}>
          {t("common.shareIncentive")}
        </div>
      )}
      {showDownload && (
        <button style={btnStyle} onClick={handleReport} disabled={busy}
          aria-label={locale === "en" ? "Download PDF report" : "Télécharger le rapport PDF"}
          onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <DownloadIcon />
          <span className="btn-text">{busy ? "…" : t("common.report")}</span>
        </button>
      )}
      {ACCOUNT_ENABLED && showDownload && isConfigured && user && !isPro && remaining === 0 && (
        <div style={{ flexBasis: "100%", fontSize: 11, color: "var(--text-secondary)", marginTop: -2 }}>
          {locale === "en"
            ? <>You've used your free report. <a href="/en/pro" style={{ color: "var(--gold)", textDecoration: "underline" }}>Go Pro for unlimited →</a></>
            : <>Vous avez utilisé votre rapport gratuit. <a href="/pro" style={{ color: "var(--gold)", textDecoration: "underline" }}>Passez à Pro pour illimité →</a></>
          }
        </div>
      )}
      {ACCOUNT_ENABLED && showDownload && isConfigured && user && !isPro && remaining > 0 && (
        <div style={{ flexBasis: "100%", fontSize: 11, color: "var(--text-secondary)", marginTop: -2 }}>
          {locale === "en" ? `${remaining} free report remaining` : `${remaining} rapport gratuit restant`}
        </div>
      )}
      {reportError && (
        <div style={{ flexBasis: "100%", fontSize: 11, color: "#c0392b", marginTop: -4 }}>{reportError}</div>
      )}

      <div style={{ position: "relative" }}>
        <button style={btnStyle} onClick={handleShare} disabled={busy}
          aria-label={locale === "en" ? "Share simulation" : "Partager la simulation"}
          onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <ShareIcon />
          <span className="btn-text">{t("common.share")}</span>
        </button>
        {copied && (
          <div style={{
            position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
            transform: "translateX(-50%)", background: "var(--gold)", color: "#1a1a1a",
            fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
            whiteSpace: "nowrap", pointerEvents: "none", animation: "fadeIn 0.15s ease",
          }}>
            {t("common.copied")}
          </div>
        )}
      </div>

      {ACCOUNT_ENABLED && isConfigured && user && (
        <div style={{ position: "relative" }}>
          <button style={btnStyle} onClick={handleSave}
            aria-label={locale === "en" ? "Save simulation" : "Sauvegarder la simulation"}
            onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
            <SaveIcon />
            <span className="btn-text">{saved ? (locale === "en" ? "Saved!" : "Sauvegardé !") : (locale === "en" ? "Save" : "Sauvegarder")}</span>
          </button>
        </div>
      )}

      {ACCOUNT_ENABLED && isConfigured && user && (
        <div style={{ position: "relative" }}>
          {isPro ? (
            <button style={btnStyle} onClick={handlePublicLink} disabled={publicLinkBusy}
              aria-label={locale === "en" ? "Copy public link" : "Copier le lien public"}
              onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              <LinkIcon />
              <span className="btn-text">
                {publicLinkBusy ? "…" : publicCopied ? (locale === "en" ? "Copied!" : "Copié !") : (locale === "en" ? "Public link" : "Lien public")}
              </span>
            </button>
          ) : (
            <button
              style={{ ...btnStyle, opacity: 0.55, cursor: "default" }}
              title={locale === "en" ? "Pro feature — upgrade to share a public link" : "Fonctionnalité Pro — passez à Pro pour partager un lien public"}
              onClick={() => navigate(localePath("/pro", locale))}
            >
              <LinkIcon />
              <span className="btn-text">{locale === "en" ? "Public link" : "Lien public"}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#b45309", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "1px 5px", marginLeft: 2 }}>PRO</span>
            </button>
          )}
        </div>
      )}

      {/* ── Boutons de partage réseaux sociaux ── */}
      {report?.highlight && (() => {
        // Build a /api/share redirect URL so scrapers see the personalized
        // result OG image (title + value via /api/og) instead of the generic
        // category PNG from the pre-rendered HTML.
        const canonPath = (() => {
          let p = window.location.pathname;
          if (p.startsWith('/en/')) p = p.slice(3);
          else if (p.startsWith('/be/')) p = p.slice(3);
          else if (p.startsWith('/ch/')) p = p.slice(3);
          return p;
        })();
        const cat = ROUTE_META[canonPath]?.cat || '';
        const shareParams = new URLSearchParams({
          to: window.location.pathname,
          t:  report.highlight.label,
          v:  report.highlight.value,
          c:  cat,
          l:  locale,
        });
        const sharePreviewUrl = `${window.location.origin}/api/share?${shareParams.toString()}`;
        const encodedShare = encodeURIComponent(sharePreviewUrl);
        const HASHTAGS = { Retraite: '#Retraite', Immobilier: '#Immobilier', 'Impôts': '#Impots', Finances: '#Finances', FIRE: '#FIRE #IndépendanceFinancière', Budget: '#Budget' };
        const tag = HASHTAGS[cat] || '#FinancesPersonnelles';
        const text = encodeURIComponent(
          locale === "en"
            ? `I just calculated on simfinly.com: ${report.highlight.label} → ${report.highlight.value} | Calculated with Simfinly`
            : `J'ai simulé sur simfinly.com : ${report.highlight.label} → ${report.highlight.value} ${tag} | Calculé avec Simfinly`
        );
        const twitterUrl   = `https://twitter.com/intent/tweet?text=${text}&url=${encodedShare}`;
        const linkedinUrl  = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShare}`;
        const whatsappUrl  = `https://wa.me/?text=${text}%20${encodedShare}`;
        const socialStyle  = { ...btnStyle, padding: "6px 10px", gap: 0 };
        return (
          <>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={socialStyle} title={locale === "en" ? "Share on X (Twitter)" : "Partager sur X (Twitter)"} aria-label="X">
                <svg width="13" height="13" viewBox="0 0 1200 1227" fill="currentColor"><path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026zM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026z"/></svg>
              </button>
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={socialStyle} title={locale === "en" ? "Share on LinkedIn" : "Partager sur LinkedIn"} aria-label="LinkedIn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </button>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={socialStyle} title={locale === "en" ? "Share on WhatsApp" : "Partager sur WhatsApp"} aria-label="WhatsApp">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </button>
            </a>
          </>
        );
      })()}
    </div>
  );
}
