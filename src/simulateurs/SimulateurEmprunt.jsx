import { useState, useEffect, useRef } from "react";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

function fraisNotaire(prix, neuf) { return neuf ? prix * 0.025 : prix * 0.075; }

function mensualite(capital, tauxAnnuel, dureeAns) {
  if (capital <= 0 || dureeAns <= 0) return 0;
  const r = tauxAnnuel / 100 / 12;
  const n = dureeAns * 12;
  if (r === 0) return capital / n;
  return (capital * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function useAnimatedValue(target, duration = 450) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (Math.abs(from - target) < 0.01) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * e);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return display;
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 800);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function NumericInput({ label, value, onChange, unit, sublabel, min, max, step, prefix }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState(String(value));
  const inputRef = useRef(null);
  const handleFocus = () => { setRaw(String(value)); setEditing(true); setTimeout(() => inputRef.current?.select(), 10); };
  const handleBlur = () => {
    setEditing(false);
    const cleaned = raw.replace(/\s/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) { const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, parsed)); onChange(clamped); } else { setRaw(String(value)); }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") inputRef.current?.blur();
    if (e.key === "ArrowUp") { e.preventDefault(); onChange(Math.min(max ?? Infinity, value + (step ?? 1))); }
    if (e.key === "ArrowDown") { e.preventDefault(); onChange(Math.max(min ?? -Infinity, value - (step ?? 1))); }
  };
  const displayValue = unit === "%" || unit === "ans" ? `${value}` : value.toLocaleString("fr-FR");
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
        <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a8a6e", userSelect: "none" }}>
          {label}
          {sublabel && <span style={{ color: "#6b5e47", marginLeft: 6, fontSize: 10, textTransform: "none", letterSpacing: 0 }}>{sublabel}</span>}
        </label>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {prefix && <div style={{ position: "absolute", left: 13, fontSize: 14, color: "#6b5e47", pointerEvents: "none", fontFamily: "'Playfair Display', serif", zIndex: 1 }}>{prefix}</div>}
        <input ref={inputRef} type="text" inputMode="decimal" value={editing ? raw : displayValue} onFocus={handleFocus} onBlur={handleBlur} onChange={e => setRaw(e.target.value)} onKeyDown={handleKeyDown}
          style={{ width: "100%", background: editing ? "#1e1810" : "#141009", border: `1px solid ${editing ? "rgba(212,168,67,0.55)" : "rgba(212,168,67,0.18)"}`, borderRadius: 7, padding: `10px 44px 10px ${prefix ? "26px" : "14px"}`, fontSize: 18, fontFamily: "'Playfair Display', serif", color: "#f0e6d0", outline: "none", transition: "border 0.2s, background 0.2s", boxShadow: editing ? "0 0 0 3px rgba(212,168,67,0.1)" : "none", letterSpacing: "-0.01em", textAlign: "right" }} />
        {unit && <div style={{ position: "absolute", right: 13, fontSize: 12, color: editing ? "#9a8a6e" : "#6b5e47", pointerEvents: "none", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}>{unit}</div>}
      </div>
      {(min !== undefined || max !== undefined) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "#3a3020" }}>
          {min !== undefined && <span>min {unit === "%" ? `${min}%` : unit === "ans" ? `${min} ans` : min.toLocaleString("fr-FR") + " €"}</span>}
          {max !== undefined && <span>max {unit === "%" ? `${max}%` : unit === "ans" ? `${max} ans` : max.toLocaleString("fr-FR") + " €"}</span>}
        </div>
      )}
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => onChange(!value)}>
      <div style={{ width: 38, height: 21, background: value ? "linear-gradient(90deg,#8b6914,#d4a843)" : "#2a2318", borderRadius: 11, position: "relative", transition: "background 0.25s", border: `1px solid ${value ? "#d4a843" : "rgba(212,168,67,0.18)"}`, flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 2, left: value ? 17 : 2, width: 15, height: 15, borderRadius: "50%", background: "#f0e6d0", transition: "left 0.25s" }} />
      </div>
      {label && <span style={{ fontSize: 11, color: value ? "#d4a843" : "#6b5e47", letterSpacing: "0.04em", transition: "color 0.2s", userSelect: "none" }}>{label}</span>}
    </div>
  );
}

function ResultLine({ label, value, accent, big, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: big ? "13px 0" : "8px 0", borderBottom: "1px solid rgba(212,168,67,0.07)" }}>
      <span style={{ fontSize: sub ? 11 : 12, color: sub ? "#6b5e47" : "#9a8a6e", fontStyle: sub ? "italic" : "normal", paddingRight: 8 }}>{label}</span>
      <span style={{ fontSize: big ? 20 : 13, fontFamily: big ? "'Playfair Display', serif" : "inherit", color: accent ? "#d4a843" : big ? "#f0e6d0" : "#c8b89a", fontWeight: big ? 700 : 500, whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

function JaugeEndettement({ taux }) {
  const color = taux <= 0 ? "#4a3e29" : taux <= 25 ? "#6aaa6a" : taux <= 33 ? "#d4a843" : taux <= 35 ? "#e08030" : "#cc5555";
  const label = taux <= 0 ? "—" : taux <= 25 ? "Excellent" : taux <= 33 ? "Acceptable" : taux <= 35 ? "Limite" : "Trop élevé";
  const pct = Math.min(100, taux / 50 * 100);
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#9a8a6e", letterSpacing: "0.05em" }}>Taux d'endettement</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", color, fontWeight: 700 }}>{taux > 0 ? taux.toFixed(1) : "—"}%</span>
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "#1a1408", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          <div style={{ width: "50%", background: "rgba(100,180,100,0.1)" }} />
          <div style={{ width: "16%", background: "rgba(212,168,67,0.08)" }} />
          <div style={{ width: "4%", background: "rgba(220,120,40,0.08)" }} />
          <div style={{ flex: 1, background: "rgba(200,80,80,0.08)" }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,#4a9a4a,${color})`, borderRadius: 4, transition: "width 0.4s, background 0.3s" }} />
        {[25, 33, 35].map(s => (
          <div key={s} style={{ position: "absolute", top: 0, left: `${s / 50 * 100}%`, width: 1, height: "100%", background: "rgba(255,255,255,0.1)" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: "#4a3e29" }}>
        <span>0%</span><span>25%</span><span>33%</span><span>35%</span><span>50%+</span>
      </div>
    </div>
  );
}

function TableauAmortissement({ capital, tauxAnnuel, dureeAns, primoCapital, primoTaux }) {
  const [open, setOpen] = useState(false);
  const rows = [];
  let rP = capital - primoCapital, rPr = primoCapital;
  const mP = mensualite(rP, tauxAnnuel, dureeAns);
  const mPr = mensualite(rPr, primoTaux, dureeAns);
  for (let i = 1; i <= dureeAns * 12; i++) {
    const iP = rP * (tauxAnnuel / 100 / 12), aP = mP - iP;
    const iPr = rPr * (primoTaux / 100 / 12), aPr = mPr - iPr;
    rP = Math.max(0, rP - aP); rPr = Math.max(0, rPr - aPr);
    if (i % 12 === 0) rows.push({ annee: i / 12, mensualite: mP + mPr, interets: iP + iPr, capitalRestant: rP + rPr });
  }
  return (
    <div>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "1px solid rgba(212,168,67,0.22)", color: "#9a8a6e", padding: "9px 0", borderRadius: 4, cursor: "pointer", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", width: "100%" }}>
        {open ? "▲ Masquer" : "▼ Tableau d'amortissement"}
      </button>
      {open && (
        <div style={{ marginTop: 12, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 260 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
                {["An", "Mensualité", "Intérêts", "Restant dû"].map(h => (
                  <th key={h} style={{ textAlign: "right", padding: "5px 6px", color: "#6b5e47", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", background: i % 2 === 0 ? "rgba(212,168,67,0.015)" : "transparent" }}>
                  <td style={{ padding: "5px 6px", textAlign: "right", color: "#6b5e47" }}>{r.annee}</td>
                  <td style={{ padding: "5px 6px", textAlign: "right", color: "#c8b89a" }}>{fmtDec(r.mensualite)}</td>
                  <td style={{ padding: "5px 6px", textAlign: "right", color: "#7a6845" }}>{fmtDec(r.interets)}</td>
                  <td style={{ padding: "5px 6px", textAlign: "right", color: r.capitalRestant < 50000 ? "#d4a843" : "#c8b89a" }}>{fmt(r.capitalRestant)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Card({ children, highlight }) {
  return (
    <div style={{ background: "linear-gradient(145deg,#181209,#120f07)", border: `1px solid ${highlight ? "rgba(212,168,67,0.38)" : "rgba(212,168,67,0.1)"}`, borderRadius: 10, padding: "20px 16px", transition: "border 0.3s" }}>
      {children}
    </div>
  );
}
function CardTitle({ children }) {
  return <h2 style={{ margin: "0 0 16px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a8a6e", fontWeight: 500 }}>{children}</h2>;
}

function QuickBtn({ label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ flex: 1, padding: "7px 0", background: hover ? "rgba(212,168,67,0.12)" : "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.18)", color: hover ? "#d4a843" : "#9a8a6e", borderRadius: 5, cursor: "pointer", fontSize: 11, letterSpacing: "0.04em", transition: "all 0.15s" }}>
      {label}
    </button>
  );
}

export default function SimulateurEmprunt() {
  const [prix, setPrix] = useState(250000);
  const [neuf, setNeuf] = useState(false);
  const [inclureNotaire, setInclureNotaire] = useState(true);
  const [apport, setApport] = useState(30000);
  const [duree, setDuree] = useState(20);
  const [taux, setTaux] = useState(3.5);
  const [primo, setPrimo] = useState(false);
  const [salaire, setSalaire] = useState(3500);
  const [coEmprunteur, setCoEmprunteur] = useState(false);
  const [salaireCoEmprunteur, setSalaireCoEmprunteur] = useState(2500);
  const [taxeFonciere, setTaxeFonciere] = useState(0);
  const [chargesCopro, setChargesCopro] = useState(0);
  const [assurance, setAssurance] = useState(0);

  const w = useWindowWidth();
  const isMobile = w < 680;
  const isSmall = w < 400;

  const fn = fraisNotaire(prix, neuf);
  const montantEmprunte = Math.max(0, prix + (inclureNotaire ? fn : 0) - apport);
  const primoCapital = primo ? montantEmprunte * 0.1 : 0;
  const primoTaux = 1.95;
  const capitalPrincipal = montantEmprunte - primoCapital;

  const mPrincipal = mensualite(capitalPrincipal, taux, duree);
  const mPrimo = mensualite(primoCapital, primoTaux, duree);
  const mTotal = mPrincipal + mPrimo;

  const coutTotal = mTotal * duree * 12;
  const coutInterets = coutTotal - montantEmprunte;
  const revenuTotal = salaire + (coEmprunteur ? salaireCoEmprunteur : 0);
  const taxeFonciereParMois = taxeFonciere / 12;
  const chargesTotal = taxeFonciereParMois + chargesCopro;
  const assuranceParMois = assurance;
  const coutMensuelTotal = mTotal + assuranceParMois + chargesTotal;
  const tauxEndettement = revenuTotal > 0 ? (mTotal / revenuTotal) * 100 : 0;
  const resteAVivre = revenuTotal - coutMensuelTotal;
  const coutChargesSur25ans = chargesTotal * duree * 12;
  const coutAssuranceSurDuree = assuranceParMois * duree * 12;
  const apportPct = prix > 0 ? (apport / prix * 100).toFixed(1) : 0;

  const animMensualite = useAnimatedValue(mTotal);
  const animCoutTotal = useAnimatedValue(coutTotal);
  const animInterets = useAnimatedValue(coutInterets);
  const animEmprunt = useAnimatedValue(montantEmprunte);
  const animTauxEndet = useAnimatedValue(tauxEndettement);
  const animReste = useAnimatedValue(resteAVivre);
  const animCharges = useAnimatedValue(chargesTotal);
  const animCoutMensuel = useAnimatedValue(coutMensuelTotal);

  const leftCol = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <CardTitle children="Bien immobilier" />
          <Toggle value={neuf} onChange={setNeuf} label="Bien neuf" />
        </div>
        <NumericInput label="Prix du bien" value={prix} onChange={setPrix} unit="€" prefix="🏠" min={10000} max={5000000} step={1000} />
        <div style={{ background: "#0b0905", border: "1px solid rgba(212,168,67,0.09)", borderRadius: 7, padding: "11px 13px", marginTop: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: "#6b5e47", letterSpacing: "0.07em", textTransform: "uppercase" }}>Frais de notaire estimés</div>
              <div style={{ fontSize: 10, color: "#4a3e29", marginTop: 2 }}>{neuf ? "~2,5% (neuf)" : "~7,5% (ancien)"}</div>
            </div>
            <div style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", color: "#c8a855" }}>{fmt(fn)}</div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Toggle value={inclureNotaire} onChange={setInclureNotaire} label="Inclure dans l'emprunt" />
          </div>
        </div>
      </Card>
      <Card>
        <CardTitle>Apport personnel</CardTitle>
        <NumericInput label="Montant de l'apport" value={apport} onChange={setApport} unit="€" min={0} max={prix} step={1000} sublabel={`${apportPct}% du prix`} />
        <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
          {[10, 20, 30].map(p => (
            <QuickBtn key={p} label={`${p}% (${fmt(prix * p / 100)})`} onClick={() => setApport(Math.round(prix * p / 100))} />
          ))}
        </div>
      </Card>
      <Card highlight>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <CardTitle children="Revenus mensuels nets" />
          <Toggle value={coEmprunteur} onChange={setCoEmprunteur} label="Co-emprunteur" />
        </div>
        <NumericInput label="Mon salaire net" value={salaire} onChange={setSalaire} unit="€/mois" min={0} max={100000} step={100} />
        {coEmprunteur && <NumericInput label="Salaire co-emprunteur" value={salaireCoEmprunteur} onChange={setSalaireCoEmprunteur} unit="€/mois" min={0} max={100000} step={100} />}
        {coEmprunteur && (
          <div style={{ background: "#0b0905", border: "1px solid rgba(212,168,67,0.09)", borderRadius: 7, padding: "10px 13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#6b5e47", letterSpacing: "0.06em", textTransform: "uppercase" }}>Revenus cumulés</span>
              <span style={{ fontSize: 15, fontFamily: "'Playfair Display', serif", color: "#c8b89a" }}>{fmt(revenuTotal)}<span style={{ fontSize: 10, color: "#6b5e47", marginLeft: 3 }}>/mois</span></span>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <CardTitle>Paramètres du prêt</CardTitle>
        <NumericInput label="Durée du prêt" value={duree} onChange={(v) => setDuree(Math.round(v))} unit="ans" min={1} max={30} step={1} />
        <NumericInput label="Taux d'intérêt annuel" value={taux} onChange={setTaux} unit="%" min={0.1} max={15} step={0.05} />
      </Card>
      <Card highlight={primo}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: primo ? "#d4a843" : "#9a8a6e", fontWeight: 500, transition: "color 0.3s" }}>Primo-accédant</h2>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#5a4e39" }}>10% du capital emprunté à 1,95% / an</p>
          </div>
          <Toggle value={primo} onChange={setPrimo} />
        </div>
        {primo && montantEmprunte > 0 && (
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "#0b0905", border: "1px solid rgba(212,168,67,0.15)", borderRadius: 6, padding: "10px 11px" }}>
              <div style={{ fontSize: 9, color: "#6b5e47", letterSpacing: "0.07em", textTransform: "uppercase" }}>Tranche aidée</div>
              <div style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", color: "#d4a843", marginTop: 4 }}>{fmt(primoCapital)}</div>
              <div style={{ fontSize: 10, color: "#8b6914", marginTop: 2 }}>à 1,95% / an</div>
            </div>
            <div style={{ background: "#0b0905", border: "1px solid rgba(212,168,67,0.07)", borderRadius: 6, padding: "10px 11px" }}>
              <div style={{ fontSize: 9, color: "#6b5e47", letterSpacing: "0.07em", textTransform: "uppercase" }}>Tranche principale</div>
              <div style={{ fontSize: 14, fontFamily: "'Playfair Display', serif", color: "#c8b89a", marginTop: 4 }}>{fmt(capitalPrincipal)}</div>
              <div style={{ fontSize: 10, color: "#5a4e39", marginTop: 2 }}>à {taux.toFixed(2)}% / an</div>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <CardTitle>Charges annuelles du bien</CardTitle>
        <NumericInput label="Taxe foncière" value={taxeFonciere} onChange={setTaxeFonciere} unit="€/an" min={0} max={20000} step={50} sublabel={taxeFonciere > 0 ? `soit ${fmt(taxeFonciere / 12)}/mois` : "optionnel"} />
        <NumericInput label="Charges de copropriété" value={chargesCopro} onChange={setChargesCopro} unit="€/mois" min={0} max={5000} step={10} sublabel={chargesCopro > 0 ? `soit ${fmt(chargesCopro * 12)}/an` : "optionnel"} />
        <NumericInput label="Assurance emprunteur" value={assurance} onChange={setAssurance} unit="€/mois" min={0} max={2000} step={5} sublabel={assurance > 0 ? `soit ${fmt(assurance * 12)}/an` : "optionnel"} />
        {(taxeFonciere > 0 || chargesCopro > 0 || assurance > 0) && (
          <div style={{ background: "#0b0905", border: "1px solid rgba(212,168,67,0.09)", borderRadius: 7, padding: "10px 13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#6b5e47", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total charges/mois</span>
              <span style={{ fontSize: 15, fontFamily: "'Playfair Display', serif", color: "#c8a855" }}>{fmt(chargesTotal + assurance)}<span style={{ fontSize: 10, color: "#6b5e47", marginLeft: 2 }}>/mois</span></span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const rightCol = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#1e1508,#2a1d08)", border: "1px solid rgba(212,168,67,0.38)", borderRadius: 10, padding: "24px 18px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,168,67,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8b6914", marginBottom: 8 }}>Mensualité crédit</div>
        <div style={{ fontSize: isMobile ? (isSmall ? 36 : 42) : 52, fontFamily: "'Playfair Display', serif", color: "#d4a843", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {fmtDec(animMensualite).split(",")[0]}
          <span style={{ fontSize: isMobile ? (isSmall ? 20 : 24) : 30 }}>,{fmtDec(animMensualite).split(",")[1]}</span>
        </div>
        <div style={{ fontSize: 12, color: "#8b6914", marginTop: 8 }}>par mois · sur {duree} ans</div>
        {primo && (
          <div style={{ marginTop: 12, padding: "8px", background: "rgba(0,0,0,0.25)", borderRadius: 5 }}>
            <div style={{ fontSize: 11, color: "#6b5e47" }}>
              <span style={{ color: "#c8a855" }}>{fmtDec(mPrimo)}</span> à 1,95% · <span style={{ color: "#9a8a6e" }}>{fmtDec(mPrincipal)}</span> principal
            </div>
          </div>
        )}
        {(assuranceParMois > 0 || chargesTotal > 0) && (
          <div style={{ marginTop: 16, borderTop: "1px solid rgba(212,168,67,0.15)", paddingTop: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b5e47", marginBottom: 8 }}>Coût mensuel total</div>
            <div style={{ fontSize: isMobile ? (isSmall ? 28 : 32) : 38, fontFamily: "'Playfair Display', serif", color: "#f0e6d0", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {fmtDec(animCoutMensuel).split(",")[0]}
              <span style={{ fontSize: isMobile ? (isSmall ? 16 : 20) : 22 }}>,{fmtDec(animCoutMensuel).split(",")[1]}</span>
            </div>
            <div style={{ fontSize: 11, color: "#6b5e47", marginTop: 6 }}>crédit + assurance + charges</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 5, padding: "7px 5px" }}>
                <div style={{ fontSize: 9, color: "#5a4e39", textTransform: "uppercase", letterSpacing: "0.06em" }}>Crédit</div>
                <div style={{ fontSize: 12, fontFamily: "'Playfair Display', serif", color: "#d4a843", marginTop: 2 }}>{fmtDec(mTotal)}</div>
              </div>
              {assuranceParMois > 0 && (
                <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 5, padding: "7px 5px" }}>
                  <div style={{ fontSize: 9, color: "#5a4e39", textTransform: "uppercase", letterSpacing: "0.06em" }}>Assurance</div>
                  <div style={{ fontSize: 12, fontFamily: "'Playfair Display', serif", color: "#c8b89a", marginTop: 2 }}>{fmtDec(assuranceParMois)}</div>
                </div>
              )}
              {chargesTotal > 0 && (
                <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 5, padding: "7px 5px" }}>
                  <div style={{ fontSize: 9, color: "#5a4e39", textTransform: "uppercase", letterSpacing: "0.06em" }}>Charges</div>
                  <div style={{ fontSize: 12, fontFamily: "'Playfair Display', serif", color: "#c8b89a", marginTop: 2 }}>{fmtDec(chargesTotal)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Card>
        <CardTitle>Capacité de financement</CardTitle>
        <JaugeEndettement taux={animTauxEndet} />
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "#0b0905", border: "1px solid rgba(212,168,67,0.08)", borderRadius: 6, padding: "10px 11px" }}>
            <div style={{ fontSize: 9, color: "#6b5e47", letterSpacing: "0.07em", textTransform: "uppercase" }}>Reste à vivre</div>
            <div style={{ fontSize: 9, color: "#4a3e29", marginTop: 2 }}>après mensualité{chargesTotal > 0 ? " + charges" : ""}{assuranceParMois > 0 ? " + assurance" : ""}</div>
            <div style={{ fontSize: 15, fontFamily: "'Playfair Display', serif", color: animReste >= 0 ? "#c8b89a" : "#cc5555", marginTop: 4 }}>
              {fmt(animReste)}<span style={{ fontSize: 10, color: "#6b5e47", marginLeft: 2 }}>/mois</span>
            </div>
          </div>
          <div style={{ background: "#0b0905", border: "1px solid rgba(212,168,67,0.08)", borderRadius: 6, padding: "10px 11px" }}>
            <div style={{ fontSize: 9, color: "#6b5e47", letterSpacing: "0.07em", textTransform: "uppercase" }}>Capacité max (35%)</div>
            <div style={{ fontSize: 15, fontFamily: "'Playfair Display', serif", color: "#9a8a6e", marginTop: 4 }}>
              {fmt(revenuTotal * 0.35)}<span style={{ fontSize: 10, color: "#6b5e47", marginLeft: 2 }}>/mois</span>
            </div>
          </div>
        </div>
        {tauxEndettement > 35 && (
          <div style={{ marginTop: 11, padding: "10px 12px", background: "rgba(200,80,80,0.06)", border: "1px solid rgba(200,80,80,0.2)", borderRadius: 6, fontSize: 11, color: "#cc7070", lineHeight: 1.5 }}>
            ⚠ Taux supérieur à 35%. Les banques refuseront généralement ce dossier. Augmentez votre apport ou rallongez la durée.
          </div>
        )}
      </Card>
      <Card>
        <CardTitle>Votre projet</CardTitle>
        <ResultLine label="Prix du bien" value={fmt(prix)} />
        <ResultLine label={`Frais de notaire (${neuf ? "2,5" : "7,5"}%)`} value={fmt(fn)} />
        <ResultLine label="Apport personnel" value={`− ${fmt(apport)}`} />
        {!inclureNotaire && <ResultLine label="Frais notaire (non financés)" value={`− ${fmt(fn)}`} sub />}
        <ResultLine label="Capital emprunté" value={fmt(animEmprunt)} accent big />
      </Card>
      <Card>
        <CardTitle>Coût total du crédit</CardTitle>
        <ResultLine label="Montant emprunté" value={fmt(animEmprunt)} />
        <ResultLine label="Total des intérêts" value={fmt(animInterets)} accent />
        {assuranceParMois > 0 && <ResultLine label={`Assurance sur ${duree} ans`} value={fmt(coutAssuranceSurDuree)} sub />}
        {chargesTotal > 0 && <ResultLine label={`Charges sur ${duree} ans`} value={fmt(coutChargesSur25ans)} sub />}
        <ResultLine label="Coût total (crédit + assurance + charges)" value={fmt(animCoutTotal + coutAssuranceSurDuree + (chargesTotal > 0 ? coutChargesSur25ans : 0))} big />
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 10, color: "#5a4e39" }}>
            <span>Capital</span><span>Intérêts</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#1a1408", overflow: "hidden", display: "flex" }}>
            {coutTotal > 0 && <>
              <div style={{ width: `${montantEmprunte / coutTotal * 100}%`, background: "linear-gradient(90deg,#3a2a10,#7a5c14)", transition: "width 0.4s" }} />
              <div style={{ flex: 1, background: "linear-gradient(90deg,#8b6914,#d4a843)", transition: "width 0.4s" }} />
            </>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "#4a3e29" }}>
            <span>{coutTotal > 0 ? (montantEmprunte / coutTotal * 100).toFixed(0) : 0}%</span>
            <span>{coutTotal > 0 ? (coutInterets / coutTotal * 100).toFixed(0) : 0}%</span>
          </div>
        </div>
      </Card>
      <Card>
        <CardTitle>Indicateurs clés</CardTitle>
        {[
          { label: "Apport ≥ 10% du prix", ok: apport / prix >= 0.1 },
          { label: "Taux d'endettement ≤ 35%", ok: tauxEndettement > 0 && tauxEndettement <= 35 },
          { label: `Reste à vivre > 1 200 €/mois${chargesTotal > 0 ? " (charges incluses)" : ""}`, ok: resteAVivre >= 1200 },
          { label: "Durée ≤ 25 ans", ok: duree <= 25 },
          { label: "Taux de marché ≤ 5%", ok: taux <= 5 },
        ].map(({ label, ok }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderBottom: "1px solid rgba(212,168,67,0.04)", fontSize: 11 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: ok ? "rgba(100,200,100,0.07)" : "rgba(200,80,80,0.07)", border: `1px solid ${ok ? "rgba(100,200,100,0.28)" : "rgba(200,80,80,0.28)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>
              {ok ? "✓" : "✗"}
            </div>
            <span style={{ color: ok ? "#6a9a6a" : "#8a5050" }}>{label}</span>
          </div>
        ))}
      </Card>
      {montantEmprunte > 0 && (
        <Card>
          <TableauAmortissement capital={montantEmprunte} tauxAnnuel={taux} dureeAns={duree} primoCapital={primoCapital} primoTaux={primoTaux} />
        </Card>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0e0b06", fontFamily: "'DM Sans', sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; } body { margin: 0; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: #0e0b06; }
        ::-webkit-scrollbar-thumb { background: #3a2e1a; border-radius: 2px; }
      `}</style>
      <div style={{ background: "linear-gradient(180deg,#1a1205,#0e0b06)", borderBottom: "1px solid rgba(212,168,67,0.09)", padding: isMobile ? "20px 16px 18px" : "28px 24px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "#8b6914", marginBottom: 10 }}>Outil de simulation</div>
        <h1 style={{ margin: 0, fontSize: isMobile ? (isSmall ? 24 : 28) : 34, fontFamily: "'Playfair Display', serif", color: "#f0e6d0", fontWeight: 600, lineHeight: 1.2 }}>
          Simulateur d'Emprunt <em style={{ fontStyle: "italic", fontWeight: 400, color: "#c8a855" }}>Immobilier</em>
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: 11, color: "#5a4e39", letterSpacing: "0.04em" }}>
          Cliquez sur un champ pour saisir vos valeurs · ↑↓ pour ajuster
        </p>
      </div>
      <div style={{ maxWidth: 980, margin: "20px auto 0", padding: isMobile ? "0 12px" : "0 20px" }}>
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{rightCol}{leftCol}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{leftCol}{rightCol}</div>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 32, fontSize: 10, color: "#2e2518", letterSpacing: "0.05em", padding: "0 20px" }}>
        Simulation indicative · Ne constitue pas un engagement bancaire
      </div>
    </div>
  );
}
