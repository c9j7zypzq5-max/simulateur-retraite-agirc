// Génère un compte-rendu PDF NATIF (texte vectoriel, pas de capture d'écran) à
// partir des données structurées d'une simulation. Rendu propre type document :
// en-tête de marque, résultat principal, tableaux Paramètres / Résultats, notes,
// graphique optionnel, pied de page paginé.
//
// report = {
//   title, subtitle?, highlight:{label,value},
//   params:[{label,value}], results:[{label,value,strong?}], notes?:[...],
// }
// chartImage (optionnel) = { dataUrl, w, h } — image du graphique à insérer.
import { jsPDF } from "jspdf";

const GOLD = [184, 147, 74];
const GOLD_DARK = [154, 111, 42];
const INK = [28, 18, 8];
const SOFT = [107, 92, 62];
const LINE = [220, 214, 200];
const GOLD_TINT = [248, 244, 234];

// jsPDF (police helvetica / WinAnsi) ne sait pas rendre les espaces insécables
// (séparateurs de milliers de toLocaleString('fr-FR')) → on les normalise.
const T = s => String(s ?? "").replace(/[    ⁠ ]/g, " ");

export async function buildReportPdf({ report, url, name, chartImage = null }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 48;
  const contentW = pageW - M * 2;
  let y = M;

  const ensure = (need) => {
    if (y + need > pageH - M - 24) { doc.addPage(); y = M; }
  };
  const text = (s, x, yy, opt) => doc.text(T(s), x, yy, opt);

  // ── En-tête de marque ──
  doc.setFont("helvetica", "bold").setFontSize(15).setTextColor(...GOLD_DARK);
  text("mesimulateurs.fr", M, y + 4);
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...SOFT);
  text(`Compte-rendu · ${date}`, pageW - M, y + 4, { align: "right" });
  y += 14;
  doc.setDrawColor(...GOLD).setLineWidth(1.4).line(M, y, pageW - M, y);
  y += 26;

  // ── Titre ──
  doc.setFont("helvetica", "bold").setFontSize(19).setTextColor(...INK);
  doc.splitTextToSize(T(report.title || "Simulation"), contentW).forEach(line => {
    ensure(24); text(line, M, y); y += 24;
  });
  if (report.subtitle) {
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...SOFT);
    doc.splitTextToSize(T(report.subtitle), contentW).forEach(line => { ensure(16); text(line, M, y); y += 16; });
  }
  y += 8;

  // ── Résultat principal ──
  if (report.highlight) {
    ensure(72);
    doc.setFillColor(...GOLD_TINT).setDrawColor(...GOLD).setLineWidth(0.8);
    doc.roundedRect(M, y, contentW, 64, 8, 8, "FD");
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
    text(String(report.highlight.label || "").toUpperCase(), M + 18, y + 22);
    doc.setFont("helvetica", "bold").setFontSize(26).setTextColor(...GOLD_DARK);
    text(String(report.highlight.value ?? "—"), M + 18, y + 50);
    y += 64 + 22;
  }

  // ── Section tableau (label / valeur) ──
  const section = (heading, rows) => {
    if (!rows || rows.length === 0) return;
    ensure(40);
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
    const h = T(heading).toUpperCase();
    text(h, M, y);
    doc.setDrawColor(...GOLD).setLineWidth(0.8).line(M + doc.getTextWidth(h) + 10, y - 3, pageW - M, y - 3);
    y += 16;
    rows.forEach(r => {
      ensure(22);
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
      text(r.label, M + 2, y);
      doc.setFont("helvetica", r.strong ? "bold" : "normal").setFontSize(11);
      doc.setTextColor(...(r.strong ? GOLD_DARK : INK));
      text(r.value, pageW - M - 2, y, { align: "right" });
      y += 8;
      doc.setDrawColor(...LINE).setLineWidth(0.5).line(M, y, pageW - M, y);
      y += 12;
    });
    y += 14;
  };

  section("Paramètres saisis", report.params);
  section("Résultats", report.results);

  // ── Graphique (image capturée) ──
  if (chartImage && chartImage.dataUrl) {
    const imgW = contentW;
    let imgH = (imgW * chartImage.h) / chartImage.w;
    const maxH = pageH - M * 2 - 40;
    let drawW = imgW;
    if (imgH > maxH) { imgH = maxH; drawW = (imgH * chartImage.w) / chartImage.h; }
    ensure(imgH + 30);
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
    text("GRAPHIQUE", M, y);
    doc.setDrawColor(...GOLD).setLineWidth(0.8).line(M + doc.getTextWidth("GRAPHIQUE") + 10, y - 3, pageW - M, y - 3);
    y += 14;
    doc.addImage(chartImage.dataUrl, "PNG", M, y, drawW, imgH, undefined, "FAST");
    y += imgH + 18;
  }

  // ── Notes / explications ──
  if (report.notes && report.notes.length) {
    ensure(30);
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
    text("À RETENIR", M, y); y += 16;
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
    report.notes.forEach(n => {
      doc.splitTextToSize(T(`•  ${n}`), contentW).forEach(line => { ensure(15); text(line, M, y); y += 15; });
      y += 4;
    });
    y += 8;
  }

  // ── Encart invitation ──
  ensure(58);
  doc.setFillColor(...GOLD_TINT).roundedRect(M, y, contentW, 50, 8, 8, "F");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
  text("Faites votre propre simulation, gratuitement :", M + 16, y + 21);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...GOLD_DARK);
  text(url, M + 16, y + 38);
  y += 50;

  // ── Pied de page paginé ──
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...SOFT);
    text("Simulation indicative et non contractuelle · mesimulateurs.fr", M, pageH - 20);
    text(`${p} / ${total}`, pageW - M, pageH - 20, { align: "right" });
  }

  doc.save(`compte-rendu-${name}.pdf`);
}
