// Parsing du tableau de configuration (TSV / CSV) vers des objets exploitables
// par le générateur de vidéos.

const MONTHS = {
  jan: 1, janv: 1, janvier: 1,
  fev: 2, fevr: 2, fevrier: 2,
  mar: 3, mars: 3,
  avr: 4, avril: 4,
  mai: 5,
  jun: 6, juin: 6,
  jul: 7, juil: 7, juillet: 7,
  aou: 8, aout: 8,
  sep: 9, sept: 9, septembre: 9,
  oct: 10, octobre: 10,
  nov: 11, novembre: 11,
  dec: 12, decembre: 12,
};

const FREQ = [
  [/trimest|trimes|quarter/i, 'quarterly'],
  [/semest|semes|semi/i,      'semi'],
  [/annuel|annee|\ban\b|year/i, 'annual'],
  [/mensuel|mois|month/i,     'monthly'],
];

// Supprime les accents pour comparer des libellés de façon robuste.
function deburr(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function norm(s) {
  return deburr(String(s ?? '')).toLowerCase().trim();
}

// "—", "-", "", "n/a" → vide
function isEmptyCell(s) {
  const v = norm(s);
  return v === '' || v === '—' || v === '-' || v === '–' || v === 'na' || v === 'n/a';
}

// "10 000", "10 000 €", "10.000", "1 234,5" → nombre
export function parseAmount(s) {
  if (isEmptyCell(s)) return 0;
  let v = String(s)
    .replace(/[€\s  ]/g, '')   // espaces (y compris insécables) + symbole €
    .replace(/\.(?=\d{3}\b)/g, '')        // séparateur de milliers "."
    .replace(',', '.');                   // décimale FR
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

// "Jan 2017", "Déc 2024", "2017-01", "01/2017" → { year, month }
export function parseMonthYear(s) {
  const raw = String(s ?? '').trim();
  if (!raw) return null;

  // Format ISO YYYY-MM
  let m = /^(\d{4})-(\d{1,2})$/.exec(raw);
  if (m) return { year: +m[1], month: clampMonth(+m[2]) };

  // Format MM/YYYY
  m = /^(\d{1,2})\/(\d{4})$/.exec(raw);
  if (m) return { year: +m[2], month: clampMonth(+m[1]) };

  // Format "Mois AAAA"
  m = /^([a-zà-ÿ.]+)\.?\s+(\d{4})$/i.exec(raw);
  if (m) {
    const key = norm(m[1]).replace(/\./g, '').slice(0, 4);
    const month = MONTHS[key] ?? MONTHS[key.slice(0, 3)];
    if (month) return { year: +m[2], month };
  }

  // Année seule → janvier
  m = /^(\d{4})$/.exec(raw);
  if (m) return { year: +m[1], month: 1 };

  return null;
}

function clampMonth(n) {
  return Math.min(12, Math.max(1, n || 1));
}

export function parseFreq(s, dca) {
  if (isEmptyCell(s)) return 'monthly';
  for (const [re, code] of FREQ) if (re.test(s)) return code;
  return 'monthly';
}

// Détecte le séparateur le plus probable d'après la ligne d'en-tête.
function detectDelimiter(headerLine) {
  if (headerLine.includes('\t')) return '\t';
  if (headerLine.includes(';'))  return ';';
  return ',';
}

function splitLine(line, delim) {
  // Pas de gestion des guillemets : on privilégie le TSV (recommandé) où les
  // descriptions peuvent contenir virgules et hashtags sans souci.
  return line.split(delim).map(c => c.trim());
}

// Associe chaque en-tête à une clé canonique.
function mapHeaders(headers) {
  return headers.map(h => {
    const n = norm(h);
    if (n === '#' || n.startsWith('num') || n === 'id') return 'idx';
    if (/^actif\s*1/.test(n)) return 'asset1';
    if (/^actif\s*2/.test(n)) return 'asset2';
    if (/^actif\s*3/.test(n)) return 'asset3';
    if (/^actif\s*4/.test(n)) return 'asset4';
    if (/^actif\s*5/.test(n)) return 'asset5';
    if (n.startsWith('montant')) return 'montant';
    if (n === 'dca' || n.startsWith('versement')) return 'dca';
    if (n.startsWith('frequence')) return 'freq';
    if (n === 'de' || n.startsWith('debut') || n === 'from') return 'from';
    if (n === 'a' || n === 'à' || n.startsWith('fin') || n === 'to') return 'to';
    if (n.startsWith('titre')) return 'title';
    if (n.startsWith('description') || n.startsWith('desc')) return 'description';
    return null; // colonne ignorée
  });
}

export function parseTable(text) {
  const lines = text
    .split(/\r?\n/)
    .filter(l => l.trim().length > 0);
  if (lines.length < 2) throw new Error('Tableau vide ou sans ligne de données.');

  const delim = detectDelimiter(lines[0]);
  const keys = mapHeaders(splitLine(lines[0], delim));

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i], delim);
    const rec = {};
    keys.forEach((k, j) => { if (k) rec[k] = cells[j] ?? ''; });

    const tickers = ['asset1', 'asset2', 'asset3', 'asset4', 'asset5']
      .map(k => rec[k])
      .filter(v => v != null && !isEmptyCell(v))
      .map(v => v.trim());

    if (tickers.length === 0) continue; // ligne sans actif → ignorée

    const dca = parseAmount(rec.dca);

    rows.push({
      idx:         (rec.idx && rec.idx.trim()) || String(rows.length + 1),
      tickers,
      montant:     parseAmount(rec.montant) || 10000,
      dca,
      freq:        parseFreq(rec.freq, dca),
      from:        parseMonthYear(rec.from),
      to:          parseMonthYear(rec.to),
      title:       (rec.title || '').trim(),
      description: (rec.description || '').trim(),
    });
  }

  if (rows.length === 0) throw new Error('Aucune ligne exploitable trouvée dans le tableau.');
  return rows;
}

// Construit l'URL pilotant le comparateur pour une ligne donnée.
export function buildComparateurUrl(baseUrl, row, durationSec, format = 'mp4') {
  const u = new URL('/simulateurs/comparateur', baseUrl);
  u.searchParams.set('a', row.tickers.join(','));
  u.searchParams.set('montant', String(row.montant));
  u.searchParams.set('dca', String(row.dca));
  u.searchParams.set('freq', row.freq);
  if (row.from) u.searchParams.set('from', `${row.from.year}-${String(row.from.month).padStart(2, '0')}`);
  if (row.to)   u.searchParams.set('to',   `${row.to.year}-${String(row.to.month).padStart(2, '0')}`);
  if (durationSec) {
    u.searchParams.set('video', String(durationSec));
    u.searchParams.set('format', format === 'webm' ? 'webm' : 'mp4');
  }
  return u.toString();
}

// Slug de fichier propre à partir d'un titre.
export function slugify(s, fallback = 'video') {
  const base = deburr(String(s || ''))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || fallback;
}
