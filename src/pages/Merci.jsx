import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useTranslation } from "../i18n/index.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const SS_KEY = "pending_pro_pdf";

export default function Merci() {
  const [theme, setTheme] = useTheme();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const back = searchParams.get("back") || "/";
  const { t, locale } = useTranslation();

  const [status, setStatus] = useState("verifying"); // verifying | ok | error
  const [pdfReady, setPdfReady] = useState(false);
  const pendingRef = useRef(null);

  useEffect(() => {
    document.title = t("merci.docTitle");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    return () => robots?.setAttribute('content', 'index, follow');
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    try {
      const raw = sessionStorage.getItem(SS_KEY);
      if (raw) pendingRef.current = JSON.parse(raw);
    } catch { /* ignore */ }

    fetch(`/api/stripe?action=verify-payment&session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.paid) {
          setStatus("ok");
          generatePdf();
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function generatePdf() {
    const pending = pendingRef.current;
    if (!pending?.report) { setPdfReady(true); return; }
    try {
      const { buildReportPdfPro } = await import("../utils/pdfReport.js");
      const cleanUrl = `${window.location.origin}${back}`;
      await buildReportPdfPro({
        report: pending.report,
        url: cleanUrl,
        name: pending.name || "simulation",
        chartImage: pending.chartImage || null,
      });
      sessionStorage.removeItem(SS_KEY);
    } catch { /* PDF generation failed silently, user can retry below */ }
    setPdfReady(true);
  }

  async function handleRetryDownload() {
    const pending = pendingRef.current;
    if (!pending?.report) return;
    try {
      const { buildReportPdfPro } = await import("../utils/pdfReport.js");
      const cleanUrl = `${window.location.origin}${back}`;
      await buildReportPdfPro({
        report: pending.report,
        url: cleanUrl,
        name: pending.name || "simulation",
        chartImage: pending.chartImage || null,
      });
    } catch { /* ignore */ }
  }

  const hasReportData = !!pendingRef.current?.report;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 16px 80px", textAlign: "center" }}>
        {status === "verifying" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⏳</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 600, marginBottom: 12 }}>{t("merci.verifyingTitle")}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{t("merci.verifyingDesc")}</p>
          </>
        )}

        {status === "ok" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--gold)", marginBottom: 12 }}>
              {t("merci.okTitle")}
            </h1>
            {!pdfReady && (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
                {t("merci.generating")}
              </p>
            )}
            {pdfReady && (
              <>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
                  {hasReportData ? t("merci.downloadedAuto") : t("merci.noData")}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {hasReportData && (
                    <button
                      onClick={handleRetryDownload}
                      style={{
                        padding: "12px 22px", borderRadius: 10,
                        background: "var(--gold)", color: "#1a1000",
                        border: "none", fontSize: 14, fontWeight: 600,
                        cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif",
                      }}
                    >
                      {t("merci.retryDownload")}
                    </button>
                  )}
                  <Link to={back} style={{
                    display: "inline-block", padding: "12px 22px", borderRadius: 10,
                    background: "var(--card-bg)", border: "1px solid var(--border)",
                    color: "var(--text)", fontSize: 14, fontWeight: 500, textDecoration: "none",
                  }}>
                    {t("merci.backToSim")}
                  </Link>
                </div>
              </>
            )}
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 600, marginBottom: 12 }}>
              {t("merci.errorTitle")}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              {t("merci.errorDesc")}
            </p>
            {sessionId && (
              <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 20, fontFamily: "monospace" }}>
                ID : {sessionId}
              </p>
            )}
            <Link to={back} style={{
              display: "inline-block", padding: "12px 22px", borderRadius: 10,
              background: "var(--card-bg)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 14, textDecoration: "none",
            }}>
              {t("merci.backToSim")}
            </Link>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
