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
const T = s => String(s ?? "").replace(new RegExp("[" + String.fromCharCode(0x00A0,0x202F,0x2009,0x2007,0x2060,0x200A) + "]", "g"), " ");

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
  text("simfinly.com", M, y + 4);
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
    text("Simulation indicative et non contractuelle · simfinly.com", M, pageH - 20);
    text(`${p} / ${total}`, pageW - M, pageH - 20, { align: "right" });
  }

  doc.save(`compte-rendu-${name}.pdf`);
}

// ── Rapport PDF Pro ──────────────────────────────────────────────────────────
// Version enrichie avec page de couverture, mise en page aérée, footer "Pro".
export async function buildReportPdfPro({ report, url, name, chartImage = null }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 52;
  const contentW = pageW - M * 2;
  let y = 0;

  const ensure = (need) => {
    if (y + need > pageH - M - 30) { doc.addPage(); y = M; }
  };
  const text = (s, x, yy, opt) => doc.text(T(s), x, yy, opt);

  // ── Page de couverture ──
  // Fond or teinté
  doc.setFillColor(...GOLD_TINT);
  doc.rect(0, 0, pageW, pageH, "F");

  // Bande dorée verticale gauche
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, 6, pageH, "F");

  // Logo / marque
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(...GOLD_DARK);
  text("simfinly.com", M, 90);

  // Badge "Rapport Pro"
  doc.setFillColor(...GOLD).setDrawColor(...GOLD_DARK).setLineWidth(0);
  doc.roundedRect(M, 106, 90, 22, 4, 4, "F");
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(255, 255, 255);
  text("RAPPORT PRO", M + 45, 121, { align: "center" });

  // Ligne de séparation
  doc.setDrawColor(...GOLD).setLineWidth(1.6).line(M, 148, pageW - M, 148);

  // Titre de la simulation
  doc.setFont("helvetica", "bold").setFontSize(28).setTextColor(...INK);
  const titleLines = doc.splitTextToSize(T(report.title || "Simulation"), contentW);
  let ty = 195;
  titleLines.forEach(line => { text(line, M, ty); ty += 36; });

  if (report.subtitle) {
    doc.setFont("helvetica", "normal").setFontSize(14).setTextColor(...SOFT);
    doc.splitTextToSize(T(report.subtitle), contentW).forEach(line => { text(line, M, ty); ty += 20; });
  }
  ty += 18;

  // Résultat principal (highlight) sur la couverture
  if (report.highlight) {
    doc.setFillColor(255, 255, 255).setDrawColor(...GOLD).setLineWidth(1);
    doc.roundedRect(M, ty, contentW, 80, 10, 10, "FD");
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...SOFT);
    text(String(report.highlight.label || "").toUpperCase(), M + 22, ty + 26);
    doc.setFont("helvetica", "bold").setFontSize(32).setTextColor(...GOLD_DARK);
    text(String(report.highlight.value ?? "—"), M + 22, ty + 60);
    ty += 80 + 30;
  }

  // Date de génération
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
  text(`Généré le ${date}`, M, pageH - 60);
  text("Simulation indicative — Simfinly.com", M, pageH - 44);
  text("Document personnel et confidentiel", M, pageH - 28);

  // ── Page 2+ : contenu détaillé ──
  doc.addPage();
  y = M;

  // En-tête récurrent (page 2)
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
  text("simfinly.com", M, y);
  doc.setFillColor(...GOLD);
  doc.roundedRect(pageW - M - 76, y - 12, 76, 18, 4, 4, "F");
  doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(255, 255, 255);
  text("RAPPORT PRO", pageW - M - 38, y, { align: "center" });
  y += 12;
  doc.setDrawColor(...GOLD).setLineWidth(1.2).line(M, y, pageW - M, y);
  y += 26;

  // Titre
  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...INK);
  doc.splitTextToSize(T(report.title || "Simulation"), contentW).forEach(line => {
    ensure(26); text(line, M, y); y += 26;
  });
  if (report.subtitle) {
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...SOFT);
    doc.splitTextToSize(T(report.subtitle), contentW).forEach(line => { ensure(16); text(line, M, y); y += 16; });
  }
  y += 12;

  // Résultat principal
  if (report.highlight) {
    ensure(80);
    doc.setFillColor(...GOLD_TINT).setDrawColor(...GOLD).setLineWidth(1);
    doc.roundedRect(M, y, contentW, 70, 8, 8, "FD");
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
    text(String(report.highlight.label || "").toUpperCase(), M + 20, y + 24);
    doc.setFont("helvetica", "bold").setFontSize(28).setTextColor(...GOLD_DARK);
    text(String(report.highlight.value ?? "—"), M + 20, y + 54);
    y += 70 + 28;
  }

  // Section tableau enrichie
  const section = (heading, rows) => {
    if (!rows || rows.length === 0) return;
    ensure(50);
    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...GOLD_DARK);
    const h = T(heading).toUpperCase();
    text(h, M, y);
    doc.setDrawColor(...GOLD).setLineWidth(0.9).line(M + doc.getTextWidth(h) + 10, y - 3, pageW - M, y - 3);
    y += 20;
    rows.forEach((r, i) => {
      ensure(26);
      const rowBg = i % 2 === 0;
      if (rowBg) {
        doc.setFillColor(...GOLD_TINT);
        doc.rect(M - 4, y - 14, contentW + 8, 24, "F");
      }
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
      text(r.label, M + 4, y);
      doc.setFont("helvetica", r.strong ? "bold" : "normal").setFontSize(11);
      doc.setTextColor(...(r.strong ? GOLD_DARK : INK));
      text(r.value, pageW - M - 4, y, { align: "right" });
      y += 10;
      doc.setDrawColor(...LINE).setLineWidth(0.4).line(M, y, pageW - M, y);
      y += 14;
    });
    y += 18;
  };

  section("Paramètres saisis", report.params);
  section("Résultats détaillés", report.results);

  // Graphique
  if (chartImage && chartImage.dataUrl) {
    const imgW = contentW;
    let imgH = (imgW * chartImage.h) / chartImage.w;
    const maxH = pageH - M * 2 - 40;
    let drawW = imgW;
    if (imgH > maxH) { imgH = maxH; drawW = (imgH * chartImage.w) / chartImage.h; }
    ensure(imgH + 36);
    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...GOLD_DARK);
    text("GRAPHIQUE", M, y);
    doc.setDrawColor(...GOLD).setLineWidth(0.9).line(M + doc.getTextWidth("GRAPHIQUE") + 10, y - 3, pageW - M, y - 3);
    y += 16;
    doc.addImage(chartImage.dataUrl, "PNG", M, y, drawW, imgH, undefined, "FAST");
    y += imgH + 24;
  }

  // Notes / À retenir
  if (report.notes && report.notes.length) {
    ensure(36);
    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...GOLD_DARK);
    text("À RETENIR", M, y);
    doc.setDrawColor(...GOLD).setLineWidth(0.9).line(M + doc.getTextWidth("À RETENIR") + 10, y - 3, pageW - M, y - 3);
    y += 20;
    report.notes.forEach(n => {
      ensure(18);
      doc.setFillColor(...GOLD_TINT);
      doc.roundedRect(M - 4, y - 13, contentW + 8, 18, 4, 4, "F");
      doc.setDrawColor(...GOLD).setLineWidth(0.5).line(M - 4, y - 13, M - 4, y + 5);
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...INK);
      doc.splitTextToSize(T(`${n}`), contentW - 12).forEach((line, li) => {
        if (li > 0) ensure(15);
        text(line, M + 8, y); y += 15;
      });
      y += 8;
    });
    y += 8;
  }

  // Encart lien retour
  ensure(60);
  doc.setFillColor(255, 255, 255).setDrawColor(...GOLD).setLineWidth(0.8);
  doc.roundedRect(M, y, contentW, 52, 8, 8, "FD");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
  text("Refaites votre simulation ou partagez-la :", M + 18, y + 22);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...GOLD_DARK);
  text(url, M + 18, y + 40);
  y += 52;

  // ── Pieds de page paginés ──
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...SOFT);
    if (p === 1) {
      // La couverture a déjà son pied de page
    } else {
      text("Simulation indicative et non contractuelle · simfinly.com", M, pageH - 20);
      doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...GOLD_DARK);
      text("RAPPORT PRO", pageW / 2, pageH - 20, { align: "center" });
      doc.setFont("helvetica", "normal").setTextColor(...SOFT);
      text(`${p - 1} / ${total - 1}`, pageW - M, pageH - 20, { align: "right" });
    }
  }

  doc.save(`rapport-pro-${name}.pdf`);
}
