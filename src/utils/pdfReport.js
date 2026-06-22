// Génère le compte-rendu PDF NATIF (texte vectoriel) à partir des données structurées
// d'une simulation. Couverture claire + page de contenu + page tableau dédiée +
// page graphique dédiée en paysage (DA du site).
//
// report = {
//   title, subtitle?,
//   highlight: { label, value },
//   params:  [{ label, value }],
//   results: [{ label, value, strong? }],
//   notes?:  string[],
//   table?:  { heading, cols: string[], rows: string[][] },  // page tableau dédiée
//   chart?:  { heading?, xFmt?, yFmt?, series: [{ label, color:[r,g,b], points:[{x,y}] }] }
// }
// chartImage  (optionnel) = { dataUrl, w, h } — repli raster (page paysage) si pas de `chart`

import { jsPDF } from "jspdf";

// Palette alignée sur la DA claire du site (src/styles.css, light theme).
// Les noms historiques (GOLD…) sont conservés : le site lui-même appelle son
// accent « gold » alors qu'il est bleu (`--gold: #2B5CE6`).
const GOLD      = [43, 92, 230];    // --primary  #2B5CE6 (accent bleu)
const GOLD_DARK = [30, 64, 175];    // bleu foncé pour titres / valeurs (#1E40AF)
const INK       = [15, 24, 40];     // --text     #0F1828
const SOFT      = [91, 102, 119];   // --text-secondary #5B6677
const LINE      = [231, 234, 240];  // --border   #e7eaf0
const GOLD_TINT = [234, 240, 255];  // --primary-soft #EAF0FF
const WHITE     = [255, 255, 255];
const PAGE_BG   = [245, 246, 248];  // --bg       #F5F6F8

// jsPDF (WinAnsi) ne sait pas rendre les espaces insécables → normalisation.
const T = s => String(s ?? "").replace(/[    ⁠ ]/g, " ");

// ─── Helpers partagés ────────────────────────────────────────────────────────

function makeEnsure(doc, pageH, M, getY, setY) {
  return (need) => {
    if (getY() + need > pageH - M - 24) { doc.addPage(); setY(M); }
  };
}

function drawHeader(doc, pageW, M, title, date, pro = false) {
  const y = M;
  if (pro) {
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
    doc.text("simfinly.com", M, y);
    doc.setFillColor(...GOLD);
    doc.roundedRect(pageW - M - 76, y - 12, 76, 18, 4, 4, "F");
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...WHITE);
    doc.text("RAPPORT PRO", pageW - M - 38, y, { align: "center" });
  } else {
    doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(...GOLD_DARK);
    doc.text("simfinly.com", M, y + 4);
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...SOFT);
    doc.text(`Compte-rendu · ${date}`, pageW - M, y + 4, { align: "right" });
  }
  return y + 14;
}

function drawDivider(doc, pageW, M, y) {
  doc.setDrawColor(...GOLD).setLineWidth(1.4).line(M, y, pageW - M, y);
  return y + 1;
}

function drawTitle(doc, report, contentW, M, y, fontSize = 19, ensure) {
  doc.setFont("helvetica", "bold").setFontSize(fontSize).setTextColor(...INK);
  doc.splitTextToSize(T(report.title || "Simulation"), contentW).forEach(line => {
    ensure(fontSize + 5); doc.text(line, M, y); y += fontSize + 5;
  });
  if (report.subtitle) {
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...SOFT);
    doc.splitTextToSize(T(report.subtitle), contentW).forEach(line => { ensure(16); doc.text(line, M, y); y += 16; });
  }
  return y + 8;
}

function drawHighlight(doc, highlight, pageW, contentW, M, y, ensure, large = false) {
  if (!highlight) return y;
  const boxH = large ? 80 : 64;
  const valueFontSize = large ? 28 : 26;
  ensure(boxH + 22);
  doc.setFillColor(...GOLD_TINT).setDrawColor(...GOLD).setLineWidth(large ? 1 : 0.8);
  doc.roundedRect(M, y, contentW, boxH, 8, 8, "FD");
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
  doc.text(String(highlight.label || "").toUpperCase(), M + 18, y + (large ? 26 : 22));
  doc.setFont("helvetica", "bold").setFontSize(valueFontSize).setTextColor(...GOLD_DARK);
  doc.text(String(highlight.value ?? "—"), M + 18, y + (large ? 58 : 50));
  return y + boxH + 22;
}

function drawSection(doc, heading, rows, pageW, contentW, M, y, ensure, alternateRows = false) {
  if (!rows || rows.length === 0) return y;
  ensure(40);
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
  const h = T(heading).toUpperCase();
  doc.text(h, M, y);
  doc.setDrawColor(...GOLD).setLineWidth(0.8).line(M + doc.getTextWidth(h) + 10, y - 3, pageW - M, y - 3);
  y += 16;
  rows.forEach((r, i) => {
    ensure(22);
    if (alternateRows && i % 2 === 0) {
      doc.setFillColor(...GOLD_TINT);
      doc.rect(M - 4, y - 14, contentW + 8, 24, "F");
    }
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
    doc.text(T(r.label), M + (alternateRows ? 4 : 2), y);
    doc.setFont("helvetica", r.strong ? "bold" : "normal").setFontSize(11);
    doc.setTextColor(...(r.strong ? GOLD_DARK : INK));
    doc.text(T(r.value), pageW - M - (alternateRows ? 4 : 2), y, { align: "right" });
    y += 10;
    doc.setDrawColor(...LINE).setLineWidth(0.5).line(M, y, pageW - M, y);
    y += 12;
  });
  return y + 14;
}

function drawNotes(doc, notes, contentW, M, y, ensure, enriched = false) {
  if (!notes || !notes.length) return y;
  ensure(36);
  doc.setFont("helvetica", "bold").setFontSize(enriched ? 12 : 11).setTextColor(...GOLD_DARK);
  const heading = "À RETENIR";
  doc.text(heading, M, y);
  doc.setDrawColor(...GOLD).setLineWidth(0.9).line(M + doc.getTextWidth(heading) + 10, y - 3, doc.internal.pageSize.getWidth() - M, y - 3);
  y += enriched ? 20 : 16;
  notes.forEach(n => {
    if (enriched) {
      ensure(18);
      doc.setFillColor(...GOLD_TINT);
      doc.roundedRect(M - 4, y - 13, contentW + 8, 18, 4, 4, "F");
      doc.setDrawColor(...GOLD).setLineWidth(0.5).line(M - 4, y - 13, M - 4, y + 5);
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...INK);
      doc.splitTextToSize(T(n), contentW - 12).forEach((line, li) => {
        if (li > 0) ensure(15);
        doc.text(line, M + 8, y); y += 15;
      });
      y += 8;
    } else {
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
      doc.splitTextToSize(T(`•  ${n}`), contentW).forEach(line => { ensure(15); doc.text(line, M, y); y += 15; });
      y += 4;
    }
  });
  return y + 8;
}

function drawTable(doc, table, pageW, contentW, M, y, ensure) {
  if (!table || !table.rows?.length) return y;
  ensure(44);
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
  const h = T(table.heading || "TABLEAU").toUpperCase();
  doc.text(h, M, y);
  doc.setDrawColor(...GOLD).setLineWidth(0.8).line(M + doc.getTextWidth(h) + 10, y - 3, pageW - M, y - 3);
  y += 16;
  const cols = table.cols || [];
  const colW = contentW / Math.max(cols.length, 1);
  // En-tête
  ensure(24);
  doc.setFillColor(...GOLD_TINT);
  doc.rect(M - 2, y - 13, contentW + 4, 20, "F");
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...SOFT);
  cols.forEach((col, ci) => {
    const align = ci === 0 ? "left" : "right";
    const tx = ci === 0 ? M + 2 : M + (ci + 1) * colW - 2;
    doc.text(T(col).toUpperCase(), tx, y, { align });
  });
  y += 12;
  doc.setDrawColor(...LINE).setLineWidth(0.5).line(M, y, pageW - M, y); y += 2;
  // Lignes
  table.rows.forEach((row, ri) => {
    ensure(20);
    if (ri % 2 === 0) { doc.setFillColor(248, 246, 242); doc.rect(M - 2, y - 11, contentW + 4, 18, "F"); }
    doc.setFont("helvetica", ri === table.rows.length - 1 ? "bold" : "normal").setFontSize(9);
    row.forEach((cell, ci) => {
      doc.setTextColor(...(ci === 0 ? SOFT : INK));
      const align = ci === 0 ? "left" : "right";
      const tx = ci === 0 ? M + 2 : M + (ci + 1) * colW - 2;
      doc.text(T(String(cell)), tx, y, { align });
    });
    y += 8;
    doc.setDrawColor(...LINE).setLineWidth(0.4).line(M, y, pageW - M, y); y += 8;
  });
  return y + 14;
}

function drawCta(doc, url, contentW, M, y, ensure, label = "Faites votre propre simulation, gratuitement :") {
  ensure(58);
  doc.setFillColor(...GOLD_TINT).roundedRect(M, y, contentW, 50, 8, 8, "F");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
  doc.text(T(label), M + 16, y + 21);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...GOLD_DARK);
  doc.text(T(url), M + 16, y + 38);
  return y + 50;
}

function addFooters(doc, M, pageH, pageW, pro = false) {
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    // Dimensions de la page courante (gère les pages en paysage).
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...SOFT);
    if (pro && p === 1) {
      // Couverture : pied déjà présent
    } else {
      const pNum = pro ? `${p - 1} / ${total - 1}` : `${p} / ${total}`;
      doc.text("Simulation indicative et non contractuelle · simfinly.com", M, ph - 20);
      if (pro) {
        doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...GOLD_DARK);
        doc.text("RAPPORT PRO", pw / 2, ph - 20, { align: "center" });
        doc.setFont("helvetica", "normal").setTextColor(...SOFT);
      }
      doc.text(pNum, pw - M, ph - 20, { align: "right" });
    }
  }
}

// Dessine un graphique multi-séries pleine page (paysage) aux couleurs de la DA.
// series = [{ label, color:[r,g,b], points:[{x,y}] }] ; xFmt/yFmt formatteurs.
function drawChartFullPage(doc, chart, pageW, pageH, M, heading) {
  const series = (chart?.series || []).filter(s => s.points?.length > 1);
  if (!series.length) return;
  const xFmt = chart.xFmt || ((v) => String(v));
  const yFmt = chart.yFmt || ((v) => v >= 1_000_000 ? `${(v / 1e6).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : String(Math.round(v)));

  // Titre de page
  doc.setFont("helvetica", "bold").setFontSize(15).setTextColor(...GOLD_DARK);
  doc.text(T(heading).toUpperCase(), M, M + 4);
  doc.setDrawColor(...GOLD).setLineWidth(1).line(M, M + 12, pageW - M, M + 12);

  // Légende
  let lx = M;
  const ly = M + 30;
  doc.setFontSize(10);
  series.forEach(s => {
    doc.setFillColor(...s.color);
    doc.circle(lx + 4, ly - 3, 4, "F");
    doc.setFont("helvetica", "normal").setTextColor(...INK);
    doc.text(T(s.label), lx + 12, ly);
    lx += 24 + doc.getTextWidth(T(s.label)) + 18;
  });

  // Cadre du graphique
  const PAD_L = 64, PAD_R = 30, PAD_T = ly + 18, PAD_B = 48;
  const ox = M + PAD_L;
  const top = PAD_T;
  const cW = pageW - M * 2 - PAD_L - PAD_R;
  const cH = pageH - top - PAD_B - 30;
  const oy = top + cH;

  const allPts = series.flatMap(s => s.points);
  const maxX = Math.max(...allPts.map(p => p.x), 1);
  const maxY = Math.max(...allPts.map(p => p.y), 1) * 1.08;
  const px = (v) => ox + (v / maxX) * cW;
  const py = (v) => oy - (v / maxY) * cH;

  // Fond + grille
  doc.setFillColor(...GOLD_TINT).rect(ox, top, cW, cH, "F");
  doc.setDrawColor(...LINE).setLineWidth(0.4);
  [0, 0.25, 0.5, 0.75, 1].forEach(f => { const gy = py(maxY * f); doc.line(ox, gy, ox + cW, gy); });

  // Axes
  doc.setDrawColor(...SOFT).setLineWidth(0.6);
  doc.line(ox, oy, ox + cW, oy);
  doc.line(ox, top, ox, oy);

  // Labels Y
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...SOFT);
  [0, 0.25, 0.5, 0.75, 1].forEach(f => doc.text(yFmt(maxY * f), ox - 6, py(maxY * f) + 3, { align: "right" }));

  // Labels X (≈8)
  const xs = series[0].points;
  const step = Math.max(1, Math.floor(xs.length / 8));
  xs.filter((_, i) => i % step === 0 || i === xs.length - 1).forEach(p => {
    doc.text(String(xFmt(p.x)), px(p.x), oy + 16, { align: "center" });
  });

  // Courbes
  series.forEach(s => {
    doc.setDrawColor(...s.color).setLineWidth(2);
    for (let i = 1; i < s.points.length; i++) {
      doc.line(px(s.points[i - 1].x), py(s.points[i - 1].y), px(s.points[i].x), py(s.points[i].y));
    }
  });
}

// ─── Catégorisation des simulateurs (même logique que TableauDeBord) ─────────
function categoryFromSimPath(path) {
  if (!path) return "Autre";
  if (path.includes("retraite") || path.includes("cnav") || path.includes("agirc") || path.includes("per") || path.includes("synthese") || path.includes("independant") || path.includes("ircantec") || path.includes("cnavpl") || path.includes("msa") || path.includes("fonction-publique") || path.includes("pension")) return "Retraite";
  if (path.includes("emprunt") || path.includes("locatif") || path.includes("ptz") || path.includes("plus-value")) return "Immobilier";
  if (path.includes("impot") || path.includes("succession") || path.includes("divorce") || path.includes("freelance")) return "Patrimoine & Impôts";
  if (path.includes("fire") || path.includes("epargne") || path.includes("patrimoine") || path.includes("budget") || path.includes("comparateur") || path.includes("assurance") || path.includes("credit") || path.includes("salaire")) return "Finances";
  if (path.includes("heures") || path.includes("semaines")) return "Vie & Temps";
  return "Autre";
}

const CAT_ORDER = ["Retraite", "Immobilier", "Patrimoine & Impôts", "Finances", "Vie & Temps", "Autre"];

export async function buildMultiReportPdf(entries) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 48;
  const contentW = pageW - M * 2;
  let y = M;

  const ensure = (need) => { if (y + need > pageH - M - 24) { doc.addPage(); y = M; } };
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  // Header
  y = drawHeader(doc, pageW, M, "Mes simulations", date, true);
  y = drawDivider(doc, pageW, M, y) + 22;

  // Title block
  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...INK);
  doc.text("Mes simulations financières", M, y);
  y += 26;
  doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...SOFT);
  doc.text(`${entries.length} simulation${entries.length > 1 ? "s" : ""} sauvegardée${entries.length > 1 ? "s" : ""} · ${date}`, M, y);
  y += 32;

  // Grouped by category
  const grouped = {};
  entries.forEach(e => {
    const path = (e.shareUrl || "").split("?")[0];
    const cat = categoryFromSimPath(path);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(e);
  });

  CAT_ORDER.forEach(cat => {
    if (!grouped[cat]?.length) return;
    ensure(52);

    // Category heading
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...GOLD_DARK);
    const h = cat.toUpperCase();
    doc.text(h, M, y);
    doc.setDrawColor(...GOLD).setLineWidth(0.8).line(M + doc.getTextWidth(h) + 10, y - 3, pageW - M, y - 3);
    y += 18;

    grouped[cat].forEach((entry, i) => {
      ensure(54);
      const ROW_H = 50;
      if (i % 2 === 0) {
        doc.setFillColor(...GOLD_TINT);
        doc.rect(M - 4, y - 14, contentW + 8, ROW_H, "F");
      }

      // Simulation label
      doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
      const labelStr = T(entry.label || "Simulation");
      const labelLines = doc.splitTextToSize(labelStr, contentW - 100);
      doc.text(labelLines[0], M + 4, y);

      // Date (right-aligned)
      const savedDate = entry.savedAt ? new Date(entry.savedAt).toLocaleDateString("fr-FR") : "";
      doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...SOFT);
      doc.text(savedDate, pageW - M - 4, y, { align: "right" });

      // Simulator name
      doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...SOFT);
      const simLabel = T(entry.simulator || "");
      if (simLabel) doc.text(simLabel, M + 4, y + 14);

      // URL (truncated, clickable-looking)
      doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...GOLD_DARK);
      const rawUrl = T(entry.shareUrl || "");
      const maxUrlW = contentW - 8;
      const urlTrunc = doc.getTextWidth(rawUrl) > maxUrlW
        ? rawUrl.substring(0, Math.floor(maxUrlW / doc.getCharWidthsArray("a")[0]) - 3) + "…"
        : rawUrl;
      doc.text(urlTrunc, M + 4, y + 26);

      doc.setDrawColor(...LINE).setLineWidth(0.4).line(M, y + 36, pageW - M, y + 36);
      y += ROW_H;
    });

    y += 18;
  });

  // CTA footer block
  y = drawCta(doc, "simfinly.com", contentW, M, y, ensure, "Retrouvez et relancez vos simulations sur :");

  addFooters(doc, M, pageH, pageW, true);
  const isoDate = new Date().toISOString().split("T")[0];
  doc.save(`simfinly-simulations-${isoDate}.pdf`);
}

export async function buildReportPdfPro({ report, url, name, chartImage = null }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 52;
  const contentW = pageW - M * 2;
  let y = 0;

  const ensure = (need) => { if (y + need > pageH - M - 30) { doc.addPage(); y = M; } };

  // ── Page de couverture (DA claire du site : fond clair + accent bleu) ──
  doc.setFillColor(...PAGE_BG).rect(0, 0, pageW, pageH, "F");
  // Bandeau d'accent bleu en tête + liseré en pied pour cadrer la couverture.
  doc.setFillColor(...GOLD).rect(0, 0, pageW, 8, "F");
  doc.setFillColor(...GOLD).rect(0, pageH - 5, pageW, 5, "F");

  // Marque + badge
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(...GOLD_DARK);
  doc.text("simfinly.com", M, 100);

  doc.setFillColor(...GOLD).roundedRect(M, 116, 96, 22, 4, 4, "F");
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...WHITE);
  doc.text("RAPPORT PRO", M + 48, 131, { align: "center" });

  // Titre principal (encre, grande échelle)
  doc.setFont("helvetica", "bold").setFontSize(30).setTextColor(...INK);
  const titleLines = doc.splitTextToSize(T(report.title || "Simulation"), contentW);
  let ty = 250;
  titleLines.forEach(line => { doc.text(line, M, ty); ty += 38; });
  // Filet d'accent bleu sous le titre
  doc.setDrawColor(...GOLD).setLineWidth(2).line(M, ty - 6, M + 70, ty - 6);
  ty += 14;
  if (report.subtitle) {
    doc.setFont("helvetica", "normal").setFontSize(14).setTextColor(...SOFT);
    doc.splitTextToSize(T(report.subtitle), contentW).forEach(line => { doc.text(line, M, ty); ty += 20; });
  }
  ty += 24;

  if (report.highlight) {
    // Carte highlight : fond blanc + bordure bleue + liseré d'accent + valeur bleue.
    const cardH = 96;
    doc.setFillColor(...WHITE).setDrawColor(...GOLD).setLineWidth(1);
    doc.roundedRect(M, ty, contentW, cardH, 10, 10, "FD");
    doc.setFillColor(...GOLD).roundedRect(M, ty, 6, cardH, 3, 3, "F");
    doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...SOFT);
    doc.text(String(report.highlight.label || "").toUpperCase(), M + 26, ty + 32);
    doc.setFont("helvetica", "bold").setFontSize(36).setTextColor(...GOLD_DARK);
    doc.text(String(report.highlight.value ?? "—"), M + 26, ty + 72);
    ty += cardH + 18;
  }

  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...SOFT);
  doc.text(`Généré le ${date}`, M, pageH - 66);
  doc.text("Simulation indicative — simfinly.com", M, pageH - 50);
  doc.setTextColor(...GOLD_DARK);
  doc.text("Document personnel et confidentiel", M, pageH - 34);

  // ── Pages de contenu ──
  doc.addPage();
  y = M;

  const hY = drawHeader(doc, pageW, M, report.title, date, true);
  y = hY + 12;
  doc.setDrawColor(...GOLD).setLineWidth(1.2).line(M, y, pageW - M, y);
  y += 26;

  y = drawTitle(doc, report, contentW, M, y, 18, ensure);
  y = drawHighlight(doc, report.highlight, pageW, contentW, M, y, ensure, true);
  y = drawSection(doc, "Paramètres saisis", report.params, pageW, contentW, M, y, ensure, true);
  y = drawSection(doc, "Résultats détaillés", report.results, pageW, contentW, M, y, ensure, true);
  y = drawNotes(doc, report.notes, contentW, M, y, ensure, true);

  // CTA en bas de la page de contenu.
  ensure(60);
  doc.setFillColor(...WHITE).setDrawColor(...GOLD).setLineWidth(0.8);
  doc.roundedRect(M, y, contentW, 52, 8, 8, "FD");
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
  doc.text("Refaites votre simulation ou partagez-la :", M + 18, y + 22);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...GOLD_DARK);
  doc.text(T(url), M + 18, y + 40);

  // ── Page dédiée : tableau d'amortissement (tout visible) ──
  if (report.table?.rows?.length) {
    doc.addPage();
    y = M;
    const tHY = drawHeader(doc, pageW, M, report.title, date, true);
    y = tHY + 12;
    doc.setDrawColor(...GOLD).setLineWidth(1.2).line(M, y, pageW - M, y);
    y += 26;
    drawTable(doc, report.table, pageW, contentW, M, y, ensure);
  }

  // ── Page dédiée en paysage : graphique aux couleurs de la DA ──
  const hasSeries = report.chart?.series?.some(s => s.points?.length > 1);
  if (hasSeries) {
    doc.addPage("a4", "landscape");
    const lw = doc.internal.pageSize.getWidth();
    const lh = doc.internal.pageSize.getHeight();
    drawChartFullPage(doc, report.chart, lw, lh, M, report.chart.heading || "Graphique");
  } else if (chartImage?.dataUrl) {
    // Repli : image plein cadre sur une page paysage.
    doc.addPage("a4", "landscape");
    const lw = doc.internal.pageSize.getWidth();
    const lh = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "bold").setFontSize(15).setTextColor(...GOLD_DARK);
    doc.text((report.chart?.heading || "Graphique").toUpperCase(), M, M + 4);
    doc.setDrawColor(...GOLD).setLineWidth(1).line(M, M + 12, lw - M, M + 12);
    const availW = lw - M * 2;
    const availH = lh - (M + 24) - M;
    let imgW = availW;
    let imgH = (imgW * chartImage.h) / chartImage.w;
    if (imgH > availH) { imgH = availH; imgW = (imgH * chartImage.w) / chartImage.h; }
    doc.addImage(chartImage.dataUrl, "PNG", M + (availW - imgW) / 2, M + 24, imgW, imgH, undefined, "FAST");
  }

  addFooters(doc, M, pageH, pageW, true);
  doc.save(`rapport-${name}.pdf`);
}
