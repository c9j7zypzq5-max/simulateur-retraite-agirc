// Génère un compte-rendu PDF NATIF (texte vectoriel, pas de capture d'écran) à
// partir des données structurées d'une simulation. Rendu propre type document :
// en-tête de marque, résultat principal, tableaux Paramètres / Résultats, notes,
// pied de page paginé.
//
// report = {
//   title:     "Simulateur PTZ — Prêt à Taux Zéro",
//   subtitle?: "…",
//   highlight: { label, value },
//   params:    [{ label, value }],
//   results:   [{ label, value, strong? }],
//   notes?:    ["phrase explicative", ...],
// }
import { jsPDF } from "jspdf";

const GOLD = [184, 147, 74];
const GOLD_DARK = [154, 111, 42];
const INK = [28, 18, 8];
const SOFT = [107, 92, 62];
const LINE = [220, 214, 200];
const GOLD_TINT = [248, 244, 234];

export async function buildReportPdf({ report, url, name }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 48;                 // marge
  const contentW = pageW - M * 2;
  let y = M;

  const ensure = (need) => {
    if (y + need > pageH - M - 24) { doc.addPage(); y = M; }
  };

  // ── En-tête de marque ──
  doc.setFont("helvetica", "bold").setFontSize(15).setTextColor(...GOLD_DARK);
  doc.text("mesimulateurs.fr", M, y + 4);
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...SOFT);
  doc.text(`Compte-rendu · ${date}`, pageW - M, y + 4, { align: "right" });
  y += 14;
  doc.setDrawColor(...GOLD).setLineWidth(1.4).line(M, y, pageW - M, y);
  y += 26;

  // ── Titre ──
  doc.setFont("helvetica", "bold").setFontSize(19).setTextColor(...INK);
  doc.splitTextToSize(report.title || "Simulation", contentW).forEach(line => {
    ensure(24); doc.text(line, M, y); y += 24;
  });
  if (report.subtitle) {
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...SOFT);
    doc.splitTextToSize(report.subtitle, contentW).forEach(line => { ensure(16); doc.text(line, M, y); y += 16; });
  }
  y += 8;

  // ── Résultat principal ──
  if (report.highlight) {
    ensure(72);
    doc.setFillColor(...GOLD_TINT).setDrawColor(...GOLD).setLineWidth(0.8);
    doc.roundedRect(M, y, contentW, 64, 8, 8, "FD");
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
    doc.text(String(report.highlight.label || "").toUpperCase(), M + 18, y + 22);
    doc.setFont("helvetica", "bold").setFontSize(26).setTextColor(...GOLD_DARK);
    doc.text(String(report.highlight.value ?? "—"), M + 18, y + 50);
    y += 64 + 22;
  }

  // ── Section tableau (label / valeur) ──
  const section = (heading, rows) => {
    if (!rows || rows.length === 0) return;
    ensure(40);
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
    doc.text(heading.toUpperCase(), M, y);
    doc.setDrawColor(...GOLD).setLineWidth(0.8).line(M + doc.getTextWidth(heading.toUpperCase()) + 10, y - 3, pageW - M, y - 3);
    y += 16;
    rows.forEach(r => {
      ensure(22);
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
      doc.text(String(r.label), M + 2, y);
      doc.setFont("helvetica", r.strong ? "bold" : "normal").setFontSize(11);
      doc.setTextColor(...(r.strong ? GOLD_DARK : INK));
      doc.text(String(r.value), pageW - M - 2, y, { align: "right" });
      y += 8;
      doc.setDrawColor(...LINE).setLineWidth(0.5).line(M, y, pageW - M, y);
      y += 12;
    });
    y += 14;
  };

  section("Paramètres saisis", report.params);
  section("Résultats", report.results);

  // ── Notes / explications ──
  if (report.notes && report.notes.length) {
    ensure(30);
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
    doc.text("À RETENIR", M, y); y += 16;
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
    report.notes.forEach(n => {
      doc.splitTextToSize(`•  ${n}`, contentW).forEach(line => { ensure(15); doc.text(line, M, y); y += 15; });
      y += 4;
    });
    y += 8;
  }

  // ── Encart invitation ──
  ensure(58);
  doc.setFillColor(...GOLD_TINT).roundedRect(M, y, contentW, 50, 8, 8, "F");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
  doc.text("Faites votre propre simulation, gratuitement :", M + 16, y + 21);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...GOLD_DARK);
  doc.text(url, M + 16, y + 38);
  y += 50;

  // ── Pied de page paginé (toutes pages) ──
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...SOFT);
    doc.text("Simulation indicative et non contractuelle · mesimulateurs.fr", M, pageH - 20);
    doc.text(`${p} / ${total}`, pageW - M, pageH - 20, { align: "right" });
  }

  doc.save(`compte-rendu-${name}.pdf`);
}
