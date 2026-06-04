// ─────────────────────────────────────────────────────────────────────────────
// Génération en lot des vidéos du comparateur (mesimulateurs.fr)
//
// Lit un tableau (TSV/CSV), ouvre la page comparateur en preview pour chaque
// ligne, lance l'enregistrement de la vidéo 9:16 et télécharge le WebM.
// Écrit aussi un fichier de métadonnées (titres + descriptions) pour l'étape
// de publication TikTok.
//
// Usage :
//   node generate-videos.mjs --base-url https://<preview>.vercel.app \
//                            --input videos.tsv --out ./out --duration 70
//
// Options :
//   --base-url   URL de la preview du site (obligatoire)
//   --input      Fichier tableau TSV/CSV (défaut: videos.tsv)
//   --out        Dossier de sortie (défaut: ./out)
//   --duration   Durée vidéo en secondes : 15 | 30 | 60 | 70 (défaut: 70)
//   --limit N    Ne traiter que les N premières lignes
//   --only 1,3   Ne traiter que ces numéros (#) de lignes
//   --headful    Affiche le navigateur (debug)
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from 'playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseTable, buildComparateurUrl, slugify } from './lib/parse.mjs';

function parseArgs(argv) {
  const args = { input: 'videos.tsv', out: './out', duration: 70, format: 'mp4' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--base-url') args.baseUrl = next();
    else if (a === '--input') args.input = next();
    else if (a === '--out') args.out = next();
    else if (a === '--duration') args.duration = parseInt(next(), 10) || 70;
    else if (a === '--format') args.format = (next() || 'mp4').toLowerCase() === 'webm' ? 'webm' : 'mp4';
    else if (a === '--limit') args.limit = parseInt(next(), 10);
    else if (a === '--only') args.only = next().split(',').map(s => s.trim());
    else if (a === '--headful') args.headful = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

const HELP = `
Génération de vidéos comparateur → TikTok

  node generate-videos.mjs --base-url <preview-url> [options]

Options :
  --base-url URL   URL de la preview (obligatoire), ex: https://xxx.vercel.app
  --input FILE     Tableau TSV/CSV (défaut: videos.tsv)
  --out DIR        Dossier de sortie (défaut: ./out)
  --duration SEC   15 | 30 | 60 | 70 (défaut: 70)
  --format FMT     mp4 | webm (défaut: mp4 — prêt pour TikTok)
  --limit N        Limiter aux N premières lignes
  --only 1,3,5     Ne traiter que ces numéros de lignes (#)
  --headful        Afficher le navigateur
`;

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) { console.log(HELP); return; }
  if (!args.baseUrl) {
    console.error('❌ --base-url manquant. Donne le lien de la preview du site.\n' + HELP);
    process.exit(1);
  }

  const inputPath = path.resolve(args.input);
  const outDir = path.resolve(args.out);
  await mkdir(outDir, { recursive: true });

  const text = await readFile(inputPath, 'utf8');
  let rows = parseTable(text);

  if (args.only) rows = rows.filter(r => args.only.includes(String(r.idx)));
  if (args.limit) rows = rows.slice(0, args.limit);

  if (rows.length === 0) { console.error('❌ Aucune ligne à traiter.'); process.exit(1); }

  console.log(`📋 ${rows.length} vidéo(s) à générer · durée ${args.duration}s · sortie ${outDir}\n`);

  const browser = await chromium.launch({
    headless: !args.headful,
    args: ['--autoplay-policy=no-user-gesture-required'],
  });
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 480, height: 900 },
    deviceScaleFactor: 2,
  });

  const results = [];
  const durationMs = args.duration * 1000;

  // Le rendu (durée réelle) + la conversion MP4 (ffmpeg.wasm : chargement du core
  // depuis unpkg + remux) peuvent prendre du temps : large marge de sécurité.
  const downloadTimeout = durationMs + 240000;

  for (const row of rows) {
    const slug = slugify(row.title || row.tickers.join('-vs-'), `video-${row.idx}`);
    const stem = `${String(row.idx).padStart(2, '0')}-${slug}`;
    const url = buildComparateurUrl(args.baseUrl, row, args.duration, args.format);

    console.log(`▶ #${row.idx} ${row.tickers.join(' vs ')}`);
    console.log(`  ${url}`);

    const page = await context.newPage();
    let ok = false;
    let error = null;
    let fileName = null;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

      // Attendre que les données chargent et que la zone de résultats apparaisse
      // (bouton d'export vidéo présent une fois le graphique calculé).
      await page.waitForSelector('text=/Reel vidéo|Arrêter|Génération|Conversion/', { timeout: 45000 });

      // Les polices doivent être prêtes pour un rendu propre du canvas.
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});

      // L'enregistrement démarre automatiquement (?video=NN&format=…). On attend
      // le téléchargement final (MP4 après conversion, ou WebM selon le format).
      const download = await page.waitForEvent('download', { timeout: downloadTimeout });
      // Extension réelle telle que produite par le site (.mp4 ou .webm).
      const suggested = download.suggestedFilename() || '';
      const ext = (suggested.match(/\.(mp4|webm)$/i)?.[1] || args.format).toLowerCase();
      fileName = `${stem}.${ext}`;
      await download.saveAs(path.join(outDir, fileName));
      ok = true;
      console.log(`  ✅ ${fileName}\n`);
    } catch (e) {
      error = e.message;
      console.log(`  ⚠️  échec : ${e.message}\n`);
    } finally {
      await page.close();
    }

    results.push({
      idx: row.idx,
      ok,
      error,
      file: ok ? fileName : null,
      tickers: row.tickers,
      montant: row.montant,
      dca: row.dca,
      freq: row.freq,
      from: row.from,
      to: row.to,
      title: row.title,
      description: row.description,
      url,
    });
  }

  await browser.close();

  // Métadonnées pour l'étape de publication TikTok
  await writeFile(path.join(outDir, 'metadata.json'), JSON.stringify(results, null, 2), 'utf8');

  // Une légende prête à coller par vidéo (titre + description)
  for (const r of results.filter(x => x.ok)) {
    const caption = [r.title, r.description].filter(Boolean).join('\n\n');
    await writeFile(path.join(outDir, r.file.replace(/\.(mp4|webm)$/i, '.txt')), caption, 'utf8');
  }

  const okCount = results.filter(r => r.ok).length;
  console.log(`\n🎉 Terminé : ${okCount}/${results.length} vidéo(s) générée(s) dans ${outDir}`);
  if (okCount < results.length) {
    console.log('   Lignes en échec :', results.filter(r => !r.ok).map(r => `#${r.idx}`).join(', '));
  }
  console.log('   Métadonnées : metadata.json');
  console.log('   Étape suivante : node upload-tiktok.mjs --out ' + args.out);
}

main().catch(e => { console.error(e); process.exit(1); });
