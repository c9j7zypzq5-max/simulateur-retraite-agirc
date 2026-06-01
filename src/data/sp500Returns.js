// S&P 500 annual total returns (price + dividends reinvested), approximate historical data
export const SP500_ANNUAL_RETURNS = {
  1928: 43.61, 1929: -8.42,  1930: -24.90, 1931: -43.34, 1932: -8.19,
  1933: 53.99, 1934: -1.44,  1935: 47.67,  1936: 33.92,  1937: -35.03,
  1938: 31.12, 1939: -0.41,  1940: -9.78,  1941: -11.59, 1942: 20.34,
  1943: 25.90, 1944: 19.75,  1945: 36.44,  1946: -8.07,  1947: 5.71,
  1948: 5.50,  1949: 18.79,  1950: 31.71,  1951: 24.02,  1952: 18.37,
  1953: -0.99, 1954: 52.62,  1955: 31.56,  1956: 6.56,   1957: -10.78,
  1958: 43.36, 1959: 11.96,  1960: 0.47,   1961: 26.89,  1962: -8.73,
  1963: 22.80, 1964: 16.48,  1965: 12.45,  1966: -10.06, 1967: 23.98,
  1968: 11.06, 1969: -8.50,  1970: 4.01,   1971: 14.31,  1972: 18.98,
  1973: -14.66,1974: -26.47, 1975: 37.20,  1976: 23.84,  1977: -7.18,
  1978: 6.56,  1979: 18.44,  1980: 32.42,  1981: -4.91,  1982: 21.41,
  1983: 22.51, 1984: 6.27,   1985: 32.16,  1986: 18.47,  1987: 5.23,
  1988: 16.81, 1989: 31.49,  1990: -3.11,  1991: 30.47,  1992: 7.62,
  1993: 10.08, 1994: 1.32,   1995: 37.58,  1996: 22.96,  1997: 33.36,
  1998: 28.58, 1999: 21.04,  2000: -9.11,  2001: -11.89, 2002: -22.10,
  2003: 28.68, 2004: 10.88,  2005: 4.91,   2006: 15.79,  2007: 5.49,
  2008: -37.00,2009: 26.46,  2010: 15.06,  2011: 2.11,   2012: 16.00,
  2013: 32.39, 2014: 13.69,  2015: 1.38,   2016: 11.96,  2017: 21.83,
  2018: -4.38, 2019: 31.49,  2020: 18.40,  2021: 28.71,  2022: -18.11,
  2023: 26.29, 2024: 23.31,
};

const CURRENT_YEAR = 2024;

// Annualized return (CAGR) between startYear and endYear (inclusive), rounded to 1 decimal
export function annualizedReturn(startYear, endYear) {
  const start = Math.max(startYear, 1928);
  const end   = Math.min(endYear, CURRENT_YEAR);
  if (end < start) return null;
  const returns = [];
  for (let y = start; y <= end; y++) {
    if (SP500_ANNUAL_RETURNS[y] !== undefined) returns.push(SP500_ANNUAL_RETURNS[y]);
  }
  if (!returns.length) return null;
  const cumulative = returns.reduce((acc, r) => acc * (1 + r / 100), 1);
  return +((Math.pow(cumulative, 1 / returns.length) - 1) * 100).toFixed(1);
}

// Build preset periods for the picker
export function buildHistoricalPresets(duration) {
  const presets = [];

  // Période calée sur la durée de simulation de l'utilisateur
  if (duration && duration >= 3 && duration <= 96) {
    const start = CURRENT_YEAR - duration + 1;
    const rate  = annualizedReturn(start, CURRENT_YEAR);
    if (rate !== null) {
      presets.push({
        group: '📌 Votre horizon',
        label: `${start}–${CURRENT_YEAR} (${duration} ans)`,
        rate,
        highlight: true,
      });
    }
  }

  // Périodes récentes depuis 2024
  for (const n of [5, 10, 15, 20, 30]) {
    const start = CURRENT_YEAR - n + 1;
    if (start < 1928) continue;
    const rate = annualizedReturn(start, CURRENT_YEAR);
    if (rate !== null) presets.push({
      group: '📅 Périodes récentes',
      label: `${n} ans (${start}–${CURRENT_YEAR})`,
      rate,
    });
  }

  // Décennies
  for (const { label, start, end } of [
    { label: '2020s (2020–2024)',        start: 2020, end: 2024 },
    { label: '2010s',                    start: 2010, end: 2019 },
    { label: '2000s (2 crises majeures)',start: 2000, end: 2009 },
    { label: '1990s',                    start: 1990, end: 1999 },
    { label: '1980s',                    start: 1980, end: 1989 },
    { label: '1970s (stagflation)',      start: 1970, end: 1979 },
  ]) {
    const rate = annualizedReturn(start, end);
    if (rate !== null) presets.push({ group: '🗓 Par décennie', label, rate });
  }

  // Long terme
  const ltRate = annualizedReturn(1928, CURRENT_YEAR);
  if (ltRate !== null) presets.push({
    group: '📖 Long terme',
    label: `Moyenne 1928–${CURRENT_YEAR} (${CURRENT_YEAR - 1928} ans)`,
    rate: ltRate,
  });

  return presets;
}
