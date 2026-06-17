import { useMoney } from "../i18n/CurrencyContext.jsx";
import { CURRENCIES } from "../i18n/currency.js";

// Sélecteur de devise compact pour la Navbar. N'affecte que les simulateurs
// universels (épargne, FIRE, budget, patrimoine, coût en heures, crédit conso) ;
// les simulateurs français restent en euros.
export default function CurrencySelect({ compact = false }) {
  const { currency, setCurrency } = useMoney();

  return (
    <label
      style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
      title="Devise des simulateurs universels"
    >
      {!compact && (
        <span style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>Devise</span>
      )}
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        aria-label="Choisir la devise"
        style={{
          appearance: "none",
          background: "var(--card-bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "5px 24px 5px 9px",
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23999' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
        }}
      >
        {Object.values(CURRENCIES).map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    </label>
  );
}
