import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer.jsx";

const PASS = 47_100;
const VALEUR_ACHAT = 7.46;
const VALEUR_SERVICE = 1.4098;
const TAUX_T1 = 0.0787;
const TAUX_T2 = 0.2159;

function calcPoints(salaireBrutMensuel, anneesDejaFaites, anneesRestantes) {
  const sal = Math.max(0, salaireBrutMensuel);
  const af  = Math.max(0, anneesDejaFaites);
  const ar  = Math.max(0, anneesRestantes);
  const salAnnuel = sal * 12;
  const t1 = Math.min(salAnnuel, PASS);
  const t2 = Math.max(0, Math.min(salAnnuel, 8 * PASS) - PASS);
  const pointsParAn = ((t1 * TAUX_T1) + (t2 * TAUX_T2)) / VALEUR_ACHAT;
  const pointsAcquis = pointsParAn * af;
  const pointsFuturs = pointsParAn * ar;
  const totalPoints = pointsAcquis + pointsFuturs;
  const pensionBruteMensuelle = (totalPoints * VALEUR_SERVICE) / 12;
  const pensionNetteMensuelle = pensionBruteMensuelle * 0.83;
  return { pointsParAn, pointsAcquis, pointsFuturs, totalPoints, pensionBruteMensuelle, pensionNetteMensuelle };
}

function useAnimatedNumber(target, duration = 700) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const prevRef  = useRef(0);
  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const from  = prevRef.current;
    const start = performance.now();
    function step(now) {
      const p    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = from + (target - from) * ease;
      setDisplay(val);
      if (p < 1) frameRef.current = requestAnimationFrame(step);
      else prevRef.current = target;
    }
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target]);
  return display;
}

function NumInput({ label, value, onChange, unit, hint, min = 0, max = 999999 }) {
  const [raw, setRaw] = useState(String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => { if (!focused) setRaw(String(value)); }, [value, focused]);
  function handleChange(e) {
    const v = e.target.value.replace(/[^0-9]/g, "");
    setRaw(v);
    const n = Number(v);
    if (!isNaN(n) && v !== "") onChange(Math.min(Math.max(n, min), max));
  }
  function handleBlur() {
    setFocused(false);
    const n = Number(raw);
    if (isNaN(n) || raw === "") { setRaw(String(value)); }
    else { const clamped = Math.min(Math.max(n, min), max); onChange(clamped); setRaw(String(clamped)); }
  }
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b", marginBottom: 10 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: focused ? "rgba(184,147,74,0.08)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${focused ? "rgba(184,147,74,0.6)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s, background 0.2s", boxShadow: focused ? "0 0 0 3px rgba(184,147,74,0.12)" : "none" }}>
        <input type="text" inputMode="numeric" value={focused ? raw : Number(value).toLocaleString("fr-FR")} onChange={handleChange} onFocus={() => { setFocused(true); setRaw(String(value)); }} onBlur={handleBlur} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 600, color: "#f1e4c3", padding: "14px 0 14px 20px", width: 0 }} />
        {unit && <span style={{ padding: "0 20px", fontSize: 18, color: "#b8934a", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{unit}</span>}
      </div>
      {hint && <div style={{ marginTop: 8, fontSize: 11, color: "#475569", letterSpacing: "0.04em" }}>{hint}</div>}
    </div>
  );
}

function Chip({ label, value, accent }) {
  return (
    <div style={{ background: accent ? "rgba(184,147,74,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${accent ? "rgba(184,147,74,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: accent ? "#e8c06a" : "#cbd5e1" }}>{value}</div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "#94a3b8" }}>
        <span>{label}</span>
        <span style={{ color: "#e2e8f0" }}>{Math.round(value).toLocaleString("fr-FR")} pts ({pct.toFixed(0)}%)</span>
      </div>
      <div style={{ height: 5, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

const EDITORIAL = [
  {
    title: "Un régime par points pour tous les salariés du privé",
    text: "L'Agirc-Arrco est le régime de retraite complémentaire obligatoire de l'ensemble des salariés du secteur privé en France. Il fonctionne par accumulation de points : chaque année, une fraction de vos cotisations salariales et patronales est convertie en points de retraite. Au moment de votre départ, le total de vos points est multiplié par la valeur de service du point pour calculer votre pension complémentaire annuelle.",
  },
  {
    title: "Tranche 1 et Tranche 2 : une cotisation progressive",
    text: "Vos cotisations sont calculées sur deux tranches définies par rapport au Plafond Annuel de la Sécurité Sociale (PASS, 47 100 € en 2026, soit 3 925 €/mois). La Tranche 1 couvre la part de salaire jusqu'au PASS, avec un taux global de 7,87 %. La Tranche 2 s'applique sur la part entre 1 et 8 PASS, avec un taux de 21,59 %. Cette progressivité explique que les hauts salaires accumulent proportionnellement plus de points chaque année.",
  },
  {
    title: "Valeur d'achat et valeur de service : deux piliers du système",
    text: "Le mécanisme repose sur deux valeurs distinctes. La valeur d'achat (7,46 € en 2026) est le coût d'un point : elle détermine combien de points vous accumulez par euro de cotisation. La valeur de service (1,4098 €/point en 2026) est ce que vaut un point lors du versement de votre pension. Ces deux paramètres sont révisés chaque novembre par les partenaires sociaux pour tenir compte de l'inflation et de l'évolution des salaires.",
  },
  {
    title: "Complémentaire et retraite de base : un duo indissociable",
    text: "La retraite Agirc-Arrco vient en complément de la retraite de base versée par la CNAV. Pour un salarié type, elle représente entre 30 % et 60 % du total de sa pension. Plus la carrière est longue et le salaire élevé, plus la part complémentaire est significative. La gestion est assurée paritairement par les organisations syndicales de salariés et les organisations patronales — sans intervention de l'État.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Quand est versée la retraite complémentaire Agirc-Arrco ?",
    a: "La pension complémentaire est versée mensuellement, à compter du premier jour du mois suivant la date d'effet de votre retraite. Elle est versée simultanément à votre retraite de base (CNAV). Comptez 3 à 6 mois entre la demande et les premiers paiements, le temps de la liquidation du dossier.",
  },
  {
    q: "Puis-je partir à la retraite avant 67 ans avec l'Agirc-Arrco ?",
    a: "Oui, dès 62 ans (ou 60 ans en carrière longue). Mais sans avoir atteint le taux plein, un coefficient de solidarité de −10 % s'applique pendant 3 ans sur votre pension complémentaire. Pour l'éviter : attendre 67 ans, ou différer votre départ d'un an pour bénéficier d'un bonus de +10 % pendant 1 an. Exceptions : inaptes, invalides, bénéficiaires de l'AAH ou ayant au moins 4 trimestres de chômage non indemnisé.",
  },
  {
    q: "Comment sont revalorisés les points Agirc-Arrco chaque année ?",
    a: "Chaque novembre, les partenaires sociaux (syndicats et patronat) révisent la valeur de service du point. Elle évolue en principe comme l'inflation (indice des prix à la consommation hors tabac) pour préserver le pouvoir d'achat des retraités. En 2026, la valeur de service est fixée à 1,4098 €/point.",
  },
  {
    q: "Qu'est-ce que le coefficient de solidarité de −10 % ?",
    a: "Introduit en 2019, c'est une minoration temporaire de votre pension complémentaire pendant 3 ans si vous partez sans avoir atteint le taux plein (avant 67 ans sans tous vos trimestres). Son objectif est d'inciter les salariés à travailler au moins un trimestre de plus. Il ne s'applique pas aux personnes inaptes, invalides, bénéficiaires de l'AAH ou ayant au moins 4 trimestres de chômage non indemnisé.",
  },
  {
    q: "Les fonctionnaires cotisent-ils à l'Agirc-Arrco ?",
    a: "Non. L'Agirc-Arrco est exclusivement réservé aux salariés du secteur privé et aux contractuels de droit privé. Les fonctionnaires titulaires relèvent du RAFP (Régime de retraite additionnelle de la Fonction Publique), qui fonctionne aussi par points mais est géré séparément par un organisme dédié.",
  },
  {
    q: "Puis-je cumuler emploi et retraite Agirc-Arrco ?",
    a: "Oui. En cumul emploi-retraite total (toutes retraites liquidées auprès de tous les régimes), aucun plafond de revenus ne s'applique et les nouvelles cotisations génèrent des droits supplémentaires depuis 2023. En cumul partiel (retraite anticipée sans taux plein), vos revenus cumulés ne doivent pas dépasser 160 % du SMIC ou votre dernier salaire.",
  },
  {
    q: "Comment consulter mes points Agirc-Arrco accumulés ?",
    a: "Sur info-retraite.fr (Relevé de Situation Individuelle gratuit) ou directement sur agirc-arrco.fr après création d'un espace personnel. Un relevé vous est automatiquement envoyé tous les 5 ans à partir de 35 ans. Vous pouvez aussi contacter directement votre caisse de retraite complémentaire par téléphone ou courrier.",
  },
  {
    q: "La retraite complémentaire Agirc-Arrco est-elle imposable ?",
    a: "Oui, elle est soumise à l'impôt sur le revenu comme la retraite de base. Les prélèvements sociaux s'élèvent à environ 10,1 % pour la plupart des retraités : CSG (8,3 %), CRDS (0,5 %), Casa (0,3 %) et cotisation maladie (1 %). C'est pourquoi notre simulateur affiche une pension nette à 83 % de la pension brute. Des taux réduits s'appliquent pour les foyers fiscaux sous certains seuils de revenus.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "20px 0", textAlign: "left" }}
      >
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4 }}>{q}</span>
        <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: open ? "rgba(184,147,74,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${open ? "rgba(184,147,74,0.5)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: open ? "#e8c06a" : "#64748b", marginTop: 2 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p style={{ paddingBottom: 20, paddingRight: 42, fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>{a}</p>
      )}
    </div>
  );
}

export default function SimulateurRetraite() {
  const [salaire, setSalaire] = useState(2800);
  const [anneesFaites, setAnneesFaites] = useState(10);
  const [anneesRestantes, setAnneesRestantes] = useState(25);
  const res = calcPoints(salaire, anneesFaites, anneesRestantes);
  const pensionAnimee = useAnimatedNumber(res.pensionNetteMensuelle);
  const totalAnnees = anneesFaites + anneesRestantes;

  return (
    <div style={{ minHeight: "100vh", background: "#060e1c", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0", padding: "0 16px 60px" }}>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 0 36px", animation: "fadeUp .5s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 36, height: 2, background: "linear-gradient(90deg,#b8934a,#e8c06a)" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b8934a" }}>Simulation gratuite · Données 2026</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 6vw, 50px)", fontWeight: 600, lineHeight: 1.1, color: "#f1e4c3", marginBottom: 14 }}>
          Votre retraite<br />complémentaire Agirc‑Arrco
        </h1>
        <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7, maxWidth: 500 }}>Saisissez votre salaire et votre parcours — obtenez une estimation de votre future pension complémentaire en quelques secondes.</p>
      </div>

      {/* Simulator cards */}
      <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 20, animation: "fadeUp .5s .12s ease both", opacity: 0, animationFillMode: "forwards" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px 28px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "#94a3b8", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>
          <NumInput label="Salaire brut mensuel" value={salaire} onChange={setSalaire} unit="€" min={500} max={40000} hint="PASS 2026 : 3 925 €/mois · Au-delà = Tranche 2 activée" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput label="Années déjà cotisées" value={anneesFaites} onChange={setAnneesFaites} unit="ans" min={0} max={50} hint={`Début estimé : ${2026 - anneesFaites}`} />
            <NumInput label="Années restantes" value={anneesRestantes} onChange={setAnneesRestantes} unit="ans" min={0} max={50} hint={`Départ estimé : ${2026 + anneesRestantes}`} />
          </div>
          <div style={{ marginTop: 8, background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.15)", borderRadius: 12, padding: "14px 20px", display: "flex", gap: 0, flexWrap: "wrap" }}>
            {[{ l: "Carrière totale", v: `${totalAnnees} ans`, gold: true }, { l: "Points / an", v: Math.round(res.pointsParAn).toLocaleString("fr-FR") }, { l: "Tranche", v: salaire * 12 > PASS ? "T1 + T2" : "T1 seule" }].map((item, i) => (
              <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: item.gold ? "#e8c06a" : "#f1e4c3" }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(184,147,74,0.08), rgba(232,192,106,0.03))", border: "1px solid rgba(184,147,74,0.25)", borderRadius: 20, padding: "32px 28px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "#94a3b8", marginBottom: 24, fontWeight: 400 }}>Vos résultats estimés</h2>
          <div style={{ textAlign: "center", padding: "24px 0 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#64748b", marginBottom: 10 }}>Pension nette mensuelle estimée</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(52px, 10vw, 80px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg, #e8c06a, #b8934a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {pensionAnimee.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>
              soit <span style={{ color: "#94a3b8" }}>{res.pensionBruteMensuelle.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} € brut</span> après prélèvements sociaux (~17 %)
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            <Chip label="Points acquis" value={Math.round(res.pointsAcquis).toLocaleString("fr-FR")} />
            <Chip label="Points futurs" value={Math.round(res.pointsFuturs).toLocaleString("fr-FR")} />
            <Chip label="Total points" value={Math.round(res.totalPoints).toLocaleString("fr-FR")} accent />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#475569", marginBottom: 14 }}>Répartition de vos points</div>
            <ProgressBar label="Points déjà acquis" value={res.pointsAcquis} total={res.totalPoints} color="linear-gradient(90deg,#334155,#64748b)" />
            <ProgressBar label="Points à venir" value={res.pointsFuturs} total={res.totalPoints} color="linear-gradient(90deg,#b8934a,#e8c06a)" />
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
            ⚠️ <strong style={{ color: "#64748b" }}>Simulation indicative.</strong> Basée sur les paramètres Agirc-Arrco 2026 (valeur d'achat : {VALEUR_ACHAT} €, valeur de service : {VALEUR_SERVICE} €/point). Les résultats réels dépendent de votre historique exact, des revalorisations futures et des éventuels coefficients de minoration/majoration. Pour un calcul officiel : <a href="https://www.info-retraite.fr" target="_blank" rel="noopener" style={{ color: "#b8934a" }}>info-retraite.fr</a>.
          </div>
        </div>

        <div style={{ textAlign: "center", paddingTop: 4, fontSize: 11, color: "#334155", letterSpacing: "0.06em" }}>Données officielles Agirc-Arrco · Mise à jour janvier 2026 · Simulation non contractuelle</div>
      </div>

      {/* Editorial */}
      <div style={{ maxWidth: 760, margin: "20px auto 0" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "40px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#b8934a,#e8c06a)" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8934a" }}>Guide</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 600, color: "#f1e4c3", marginBottom: 36, lineHeight: 1.2 }}>
            Comment fonctionne l'Agirc-Arrco ?
          </h2>
          <div style={{ display: "grid", gap: 28 }}>
            {EDITORIAL.map((s, i) => (
              <div key={i} style={{ paddingLeft: 20, borderLeft: "2px solid rgba(184,147,74,0.25)" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "#e8c06a", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.85 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 760, margin: "20px auto 0" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "40px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#b8934a,#e8c06a)" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8934a" }}>FAQ</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 600, color: "#f1e4c3", marginBottom: 8, lineHeight: 1.2 }}>
            Questions fréquentes
          </h2>
          <p style={{ fontSize: 13, color: "#475569", marginBottom: 32 }}>
            Tout ce qu'il faut savoir sur votre retraite complémentaire Agirc-Arrco.
          </p>
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
          <p style={{ paddingTop: 24, fontSize: 12, color: "#475569" }}>
            Pour des informations officielles et personnalisées, consultez{" "}
            <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#b8934a", textDecoration: "none" }}>info-retraite.fr</a>
            {" "}ou{" "}
            <a href="https://www.agirc-arrco.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#b8934a", textDecoration: "none" }}>agirc-arrco.fr</a>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
