import { useState } from "react";
import html2canvas from "html2canvas";
import { buildShareUrl } from "../hooks/useShareableUrl.js";

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

export default function ShareBar({ params, resultsRef, name }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const btnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text-secondary)",
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "border-color 0.2s, color 0.2s",
  };

  async function handleDownload() {
    if (!resultsRef?.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `simulation-${name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: simple canvas with params text
      const fallback = document.createElement("canvas");
      fallback.width = 600;
      fallback.height = 400;
      const ctx = fallback.getContext("2d");
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = "#b8934a";
      ctx.font = "bold 18px DM Sans, sans-serif";
      ctx.fillText(`Simulation — ${name}`, 30, 50);
      ctx.fillStyle = "#aaa";
      ctx.font = "14px DM Sans, sans-serif";
      Object.entries(params).forEach(([k, v], i) => {
        if (v !== null && v !== undefined) {
          ctx.fillText(`${k}: ${v}`, 30, 90 + i * 26);
        }
      });
      const link = document.createElement("a");
      link.download = `simulation-${name}.png`;
      link.href = fallback.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    const url = buildShareUrl(params);
    if (navigator.share) {
      try {
        await navigator.share({ title: `Simulation — ${name}`, url });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback: select text
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 16, flexWrap: "wrap" }}>
      <button
        style={btnStyle}
        onClick={handleDownload}
        disabled={downloading}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-mid)"; e.currentTarget.style.color = "var(--gold)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
      >
        <DownloadIcon />
        {downloading ? "…" : "Télécharger"}
      </button>
      <div style={{ position: "relative" }}>
        <button
          style={btnStyle}
          onClick={handleShare}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-mid)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <ShareIcon />
          Partager
        </button>
        {copied && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--gold)",
            color: "#1a1a1a",
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            animation: "fadeIn 0.15s ease",
          }}>
            Lien copié !
          </div>
        )}
      </div>
    </div>
  );
}
