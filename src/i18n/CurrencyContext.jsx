import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  CURRENCIES, DEFAULT_CURRENCY, guessCurrencyFromBrowser, formatMoney, signMoney,
  setActiveCurrency,
} from './currency.js';

const STORAGE_KEY = 'currency';
const CurrencyCtx = createContext(null);

// Fournit la devise active aux simulateurs universels :
//  1. préférence enregistrée (localStorage) si présente ;
//  2. sinon détection côté navigateur (langue + fuseau horaire, sans réseau) ;
//  3. sinon EUR par défaut.
// Le choix manuel de l'utilisateur est toujours prioritaire et persistant.
export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && CURRENCIES[saved]) return saved;
    } catch { /* localStorage indisponible */ }
    return DEFAULT_CURRENCY;
  });

  // Vrai tant que l'utilisateur n'a pas choisi explicitement : autorise la
  // détection auto à renseigner la devise sans écraser un choix manuel.
  const [userPicked, setUserPicked] = useState(() => {
    try { return Boolean(localStorage.getItem(STORAGE_KEY)); } catch { return false; }
  });

  useEffect(() => {
    if (userPicked) return; // ne pas écraser un choix manuel / déjà enregistré
    const detected = guessCurrencyFromBrowser();
    if (CURRENCIES[detected]) setCurrencyState(detected);
  }, [userPicked]);

  // Met à jour l'état module AVANT le rendu des enfants : les helpers
  // `fmtCur` / `activeSymbol` lisent ainsi la devise courante de façon synchrone.
  setActiveCurrency(currency);

  const setCurrency = useCallback((code) => {
    if (!CURRENCIES[code]) return;
    setCurrencyState(code);
    setUserPicked(true);
    try { localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => {
    const def = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
    return {
      currency,
      setCurrency,
      symbol: def.symbol,
      info: def,
      fmt: (n, decimals) => formatMoney(n, currency, decimals),
      sign: (n, decimals) => signMoney(n, currency, decimals),
    };
  }, [currency, setCurrency]);

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

// Hook des simulateurs universels. Repli autonome si le provider est absent
// (ex. rendu isolé d'un composant) : formate en EUR sans planter.
export function useMoney() {
  const ctx = useContext(CurrencyCtx);
  if (ctx) return ctx;
  const def = CURRENCIES[DEFAULT_CURRENCY];
  return {
    currency: DEFAULT_CURRENCY,
    setCurrency: () => {},
    symbol: def.symbol,
    info: def,
    fmt: (n, decimals) => formatMoney(n, DEFAULT_CURRENCY, decimals),
    sign: (n, decimals) => signMoney(n, DEFAULT_CURRENCY, decimals),
  };
}
