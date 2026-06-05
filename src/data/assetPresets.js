export const ASSET_PRESETS = [
  { ticker: '^GSPC',     label: 'S&P 500',           emoji: '🇺🇸', desc: 'Indice américain 500 plus grandes entreprises' },
  { ticker: 'IWDA.AS',   label: 'MSCI World (IWDA)',  emoji: '🌍', desc: 'Marchés développés mondiaux' },
  { ticker: 'CW8.PA',    label: 'MSCI World (CW8)',   emoji: '🌍', desc: 'MSCI World éligible PEA (Euronext Paris)' },
  { ticker: '^NDX',      label: 'Nasdaq 100',          emoji: '💻', desc: '100 plus grandes valeurs tech US' },
  { ticker: '^FCHI',     label: 'CAC 40',              emoji: '🇫🇷', desc: 'Les 40 plus grandes valeurs françaises' },
  { ticker: '^STOXX50E', label: 'Euro Stoxx 50',       emoji: '🇪🇺', desc: '50 grandes entreprises de la zone euro' },
  { ticker: 'GC=F',      label: 'Or (Gold)',            emoji: '🥇', desc: 'Matière première or (contrat futures)' },
  { ticker: 'BTC-USD',   label: 'Bitcoin',             emoji: '₿',  desc: 'Cryptomonnaie Bitcoin en USD' },
  { ticker: 'ETH-USD',   label: 'Ethereum',            emoji: '🔷', desc: 'Cryptomonnaie Ethereum en USD' },
  { ticker: 'VNQ',       label: 'REITs US (VNQ)',      emoji: '🏠', desc: 'Foncières cotées américaines (Vanguard)' },
  { ticker: 'IEF',       label: 'Obligations US 10y',  emoji: '🏦', desc: 'Bons du trésor américain 7-10 ans' },
  { ticker: 'AAPL',      label: 'Apple',               emoji: '🍎', desc: 'Action Apple Inc.' },
  { ticker: 'MSFT',      label: 'Microsoft',           emoji: '🖥️', desc: 'Action Microsoft Corp.' },
  { ticker: 'NVDA',      label: 'Nvidia',              emoji: '🎮', desc: 'Action Nvidia Corp.' },
  { ticker: 'AMZN',      label: 'Amazon',              emoji: '📦', desc: 'Action Amazon.com Inc.' },
  { ticker: 'TSLA',      label: 'Tesla',               emoji: '⚡', desc: 'Action Tesla Inc.' },
  { ticker: 'META',      label: 'Meta',                emoji: '👤', desc: 'Action Meta Platforms Inc.' },
  { ticker: 'GOOGL',     label: 'Alphabet (Google)',   emoji: '🔍', desc: 'Action Alphabet Inc.' },
];

// Palette couleurs par slot (jusqu'à 5 actifs)
export const ASSET_COLORS = [
  '#b8934a', // or / gold
  '#6366f1', // indigo
  '#22c55e', // vert
  '#f59e0b', // amber
  '#a855f7', // violet
];

// Noms d'affichage pour des tickers hors presets (utilisés en repli quand un
// actif est passé par l'URL et n'a pas d'entrée dans ASSET_PRESETS). Évite
// d'afficher le code brut (« TM ») au lieu du nom (« Toyota ») dans la vidéo.
export const TICKER_NAMES = {
  // Actions françaises (Euronext Paris)
  'MC.PA':  'LVMH',
  'RMS.PA': 'Hermès',
  'OR.PA':  "L'Oréal",
  'AIR.PA': 'Airbus',
  'SAF.PA': 'Safran',
  'TTE.PA': 'TotalEnergies',
  'BNP.PA': 'BNP Paribas',
  'SAN.PA': 'Sanofi',
  'DSY.PA': 'Dassault Systèmes',
  'CAP.PA': 'Capgemini',
  'SU.PA':  'Schneider Electric',
  'RI.PA':  'Pernod Ricard',
  // Actions US
  'INTC': 'Intel',
  'AMD':  'AMD',
  'TM':   'Toyota',
  'BA':   'Boeing',
  'SNAP': 'Snapchat',
  'ENPH': 'Enphase',
  'JPM':  'JPMorgan',
  'GS':   'Goldman Sachs',
  'BAC':  'Bank of America',
  'PFE':  'Pfizer',
  'NFLX': 'Netflix',
  'DIS':  'Disney',
  'ORCL': 'Oracle',
  'IBM':  'IBM',
  'GOOG': 'Alphabet (Google)',
  // Indices & ETF
  '^IXIC':  'Nasdaq Composite',
  '^DJI':   'Dow Jones',
  '^GDAXI': 'DAX',
  'CSPX.L': 'S&P 500 (CSPX)',
  'EUNL.DE':'MSCI World (EUNL)',
  'VEUR.AS':'Europe (VEUR)',
  'VWCE.DE':'FTSE All-World (VWCE)',
  'VTI':    'Total US (VTI)',
  'VEA':    'Développés ex-US (VEA)',
  'SPY':    'S&P 500 (SPY)',
  'QQQ':    'Nasdaq 100 (QQQ)',
};
