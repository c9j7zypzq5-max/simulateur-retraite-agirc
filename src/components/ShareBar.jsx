import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import { buildShareUrl } from "../hooks/useShareableUrl.js";
import { setExporting } from "../utils/exportMode.js";
import { ROUTE_META } from "../../api/_routes.js";
import { useAuth } from "../hooks/useAuth.js";
import { useTranslation } from "../i18n/index.js";
import { localePath } from "../i18n/paths.js";

// Quota de rapports pour un compte gratuit (non Pro). Au-delà → page Pro.
const FREE_REPORT_LIMIT = 3;

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

const raf = () => new Promise(r => requestAnimationFrame(r));

// Nettoyage du DOM cloné avant capture : masque ce qui ne doit pas figurer dans
// l'export et corrige le texte en dégradé (background-clip:text rendu en bloc
// plein par html2canvas).
function cleanClone(clonedDoc) {
  clonedDoc
    .querySelectorAll('nav, footer, section[aria-label="Simulateurs liés"], ins.adsbygoogle, .adsbygoogle, [data-noexport], #seo-prerender')
    .forEach(el => { el.style.display = "none"; });
  clonedDoc.querySelectorAll('[style*="text-fill-color"]').forEach(el => {
    el.style.webkitTextFillColor = "#b8860b";
    el.style.color = "#b8860b";
    el.style.background = "none";
    el.style.webkitBackgroundClip = "initial";
    el.style.backgroundClip = "initial";
  });
}

export default function ShareBar({ params, resultsRef, name, showDownload = true, report = null, chartRef = null }) {
  const { isPro, user, isConfigured, reportCount, incrementReportCount } = useAuth();
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const barRef = useRef(null);

  const remaining = Math.max(0, FREE_REPORT_LIMIT - reportCount);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

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

  // Conteneur complet de la page (le <div> racine du simulateur, enfant de #root).
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
      // Ouvre les accordéons (tableaux/détails) le temps de la capture.
      setExporting(true);
      await raf(); await raf();
    }
    try {
      // Chargé à la demande : html2canvas (~200 Ko) n'est ainsi pas dans le
      // bundle initial des simulateurs, seulement au moment d'un export.
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

  // Génère le rapport (document unique). Capture le graphique en image pour le
  // repli raster ; les simulateurs fournissant `report.chart` ont un tracé vectoriel.
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
    // Simulateur sans données structurées : repli capture pleine page.
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

  // Bouton « Rapport » : connexion obligatoire, 3 gratuits puis Pro.
  async function handleReport() {
    // Auth non configurée (dev) → pas de gating.
    if (isConfigured) {
      if (!user) { navigate(`${localePath("/connexion", locale)}?next=${encodeURIComponent(window.location.pathname)}`); return; }
      if (!isPro && reportCount >= FREE_REPORT_LIMIT) { navigate(localePath("/pro", locale)); return; }
    }
    setBusy(true);
    track("export", { format: "report", simulateur: name });
    try {
      await generateReport();
      if (isConfigured && !isPro) await incrementReportCount();
    } catch { /* ignore */ } finally { setBusy(false); }
  }

  async function handleShare() {
    setBusy(true);
    const stateUrl = buildShareUrl(params);
    // Lien à aperçu social riche (image de résultat via /api/og) si un résultat
    // est disponible ; sinon lien direct vers la simulation. On NE partage QUE
    // ce lien : son aperçu social affiche la bonne donnée. Pas de capture d'écran
    // jointe (évitait deux images différentes dans la feuille de partage).
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
    <div ref={barRef} data-noexport="true" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 16, flexWrap: "wrap" }}>
      {report?.highlight && (
        <div style={{ flexBasis: "100%", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 2 }}>
          {t("common.shareIncentive")}
        </div>
      )}
      {showDownload && (
        <button style={btnStyle} onClick={handleReport} disabled={busy}
          onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <DownloadIcon />
          <span className="btn-text">{busy ? "…" : t("common.report")}</span>
        </button>
      )}
      {showDownload && isConfigured && user && !isPro && (
        <div style={{ flexBasis: "100%", fontSize: 11, color: "var(--text-secondary)", marginTop: -2 }}>
          {t("common.reportRemaining")(remaining)}
        </div>
      )}

      <div style={{ position: "relative" }}>
        <button style={btnStyle} onClick={handleShare} disabled={busy}
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
    </div>
  );
}
