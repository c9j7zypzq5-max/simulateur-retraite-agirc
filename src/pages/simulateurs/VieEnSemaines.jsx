import { useState, useEffect, useRef, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  StepperInput, AccordionSection,
  Chip, fmt, SimulateurHeader, FaqItem,
} from "../../components/ui.jsx";

// ─── Constantes ───────────────────────────────────────────────────────────────
const ESPERANCE_FEMME = 85;
const ESPERANCE_HOMME = 80;
const MS_PAR_SEMAINE = 7 * 24 * 3600 * 1000;

// ─── Calculs ─────────────────────────────────────────────────────────────────
function calcVie({ dateNaissance, esperance }) {
  if (!dateNaissance) return null;
  const naissance = new Date(dateNaissance);
  if (isNaN(naissance.getTime())) return null;

  const today = new Date();
  if (naissance >= today) return null;

  const semainesVecues = Math.max(0, Math.floor((today - naissance) / MS_PAR_SEMAINE));
  const semainesTotales = Math.round(esperance * 52);
  const semainesRestantes = Math.max(0, semainesTotales - semainesVecues);
  const pctEcoule = Math.min(100, (semainesVecues / semainesTotales) * 100);
  const etesRestants = Math.floor(semainesRestantes / 52);
  const ageActuel = Math.floor((today - naissance) / (365.25 * 24 * 3600 * 1000));

  return { semainesVecues, semainesTotales, semainesRestantes, pctEcoule, etesRestants, ageActuel };
}

// ─── Grille ──────────────────────────────────────────────────────────────────
function GrilleVie({ semainesVecues, semainesTotales }) {
  const cells = useMemo(() => {
    return Array.from({ length: semainesTotales }, (_, i) => i < semainesVecues);
  }, [semainesVecues, semainesTotales]);

  return (
    <div
      role="img"
      aria-label={`Grille de vie : ${semainesVecues} semaines vécues sur ${semainesTotales}`}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(52, 1fr)",
        gap: "2px",
        width: "100%",
      }}
    >
      {cells.map((vecue, i) => (
        <div
          key={i}
          style={{
            aspectRatio: "1",
            borderRadius: "1px",
            background: vecue ? "var(--primary)" : "var(--border)",
            opacity: vecue ? 1 : 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Pourquoi visualiser sa vie en semaines ?", a: "L'auteur Tim Urban (Wait But Why) a popularisé cette visualisation pour montrer, de façon concrète, combien de temps il reste. La grille rend tangible ce que notre cerveau a du mal à appréhender : le temps est fini, et il passe vite." },
  { q: "D'où vient l'espérance de vie ?", a: "Les chiffres par défaut (80 ans pour les hommes, 85 ans pour les femmes) sont basés sur les données INSEE 2024 pour la France. Ils ne tiennent pas compte de votre état de santé, de vos habitudes ou de vos antécédents familiaux — ajustez-les selon votre situation." },
  { q: "Est-ce que ce simulateur peut être anxiogène ?", a: "Pour certaines personnes, oui. Si vous le ressentez ainsi, nous vous encourageons à regarder ce qui est déjà accompli (cases dorées) plutôt que ce qui reste. L'objectif est la clarté, pas l'anxiété. Vos semaines restantes sont un capital précieux à investir consciemment." },
  { q: "Comment utiliser cette visualisation ?", a: "Certaines personnes impriment leur grille et la collent au bureau. D'autres se posent chaque trimestre : 'Est-ce que j'utilise mes semaines de façon alignée avec mes priorités ?' L'outil n'est pas là pour juger, mais pour aider à décider." },
];

// ─── Composant ────────────────────────────────────────────────────────────────
export default function VieEnSemaines() {
  const [theme, setTheme] = useTheme();

  const [dateNaissance, setDateNaissance] = useState("");
  const [genre, setGenre]                = useState("femme"); // "femme" | "homme"
  const [esperance, setEsperance]        = useState(ESPERANCE_FEMME);
  const [esperanceModifiee, setEsperanceModifiee] = useState(false);
  const [frequenceVisites, setFrequenceVisites]   = useState(0);

  // Quand le genre change, met à jour l'espérance par défaut sauf si modifiée manuellement

  const resultsRef = useRef(null);

  useEffect(() => {
    if (!esperanceModifiee) {
      setEsperance(genre === "femme" ? ESPERANCE_FEMME : ESPERANCE_HOMME);
    }
  }, [genre, esperanceModifiee]);

  usePageMeta("Simulateur Ma Vie en Semaines — Visualisez votre temps de vie", "Visualisez votre vie entière en semaines : semaines vécues, restantes, étés à venir. Inspiré du concept \"Your Life in Weeks\".");

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'vie-en-semaines' });
    if (!sessionStorage.getItem('tracked_vie-en-semaines')) {
      sessionStorage.setItem('tracked_vie-en-semaines', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'vie-en-semaines' })
      }).catch(() => {});
    }
  }, []);
  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ dateNaissance, genre, esperance }));
  }, [dateNaissance, genre, esperance]);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.dateNaissance !== undefined) setDateNaissance(shared.dateNaissance); if (shared.genre !== undefined) setGenre(shared.genre); if (shared.esperance !== undefined) setEsperance(shared.esperance)
    }
  }, []);


  const res = calcVie({ dateNaissance, esperance });
  const hasResult = !!res;

  const visitesRestantes = frequenceVisites > 0 && hasResult
    ? Math.floor(res.semainesRestantes * frequenceVisites / 52)
    : null;

  const report = {
    title: "Ma Vie en Semaines",
    highlight: { label: "Semaines restantes (estimation)", value: hasResult ? fmt(res.semainesRestantes) : "—" },
    params: [
      { label: "Date de naissance", value: dateNaissance || "—" },
      { label: "Genre", value: genre === "femme" ? "Femme" : "Homme" },
      { label: "Espérance de vie", value: `${esperance} ans` },
    ],
    results: hasResult ? [
      { label: "Semaines restantes", value: fmt(res.semainesRestantes), strong: true },
      { label: "Semaines vécues", value: fmt(res.semainesVecues) },
      { label: "Vie écoulée", value: `${res.pctEcoule.toFixed(1).replace(".", ",")} %` },
      { label: "Âge actuel", value: `${res.ageActuel} ans` },
      { label: "Étés restants", value: `${res.etesRestants}` },
    ] : [],
    notes: hasResult ? [
      "Chaque semaine restante est un capital précieux à investir consciemment.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Ma vie en semaines",
        "url": "https://www.simfinly.com/simulateurs/vie-en-semaines",
        "description": "Visualisez votre vie entière en semaines : semaines vécues, restantes, étés à venir. Inspiré du concept \"Your Life in Weeks\".",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/vie-en-semaines" size={34} />}
          badge="Vie & Temps · 2026"
          title="Ma vie en semaines"
          desc="Visualisez l'intégralité de votre vie sous forme de grille. Chaque case représente une semaine. En or : les semaines vécues. En gris : les semaines à venir."
        />

        {/* Reassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Aucune donnée envoyée", "✓ Basé sur les données INSEE 2024", "✓ Ton factuel et bienveillant"].map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>

        {/* Grille — toujours visible en premier */}
        <div ref={resultsRef} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", margin: 0 }}>
              {hasResult
                ? `${fmt(res.semainesVecues)} semaines vécues · ${fmt(res.semainesRestantes)} à venir`
                : "Votre vie en semaines"}
            </h2>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 1, background: "var(--primary)" }} />
                Vécues
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 1, background: "var(--border)", opacity: 0.6 }} />
                À venir
              </span>
            </div>
          </div>

          {hasResult ? (
            <GrilleVie semainesVecues={res.semainesVecues} semainesTotales={res.semainesTotales} />
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", lineHeight: 1.65 }}>
                Entrez votre date de naissance<br />pour afficher votre grille.
              </p>
            </div>
          )}

          {hasResult && (
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-secondary)", textAlign: "right" }}>
              Chaque case = 1 semaine · 52 colonnes = 1 an · {res.ageActuel} ans accomplis
            </div>
          )}
        </div>

        <ShareBar params={{ dateNaissance, genre, esperance }} resultsRef={resultsRef} report={report} name="vie-en-semaines" />

        {/* Métriques clés */}
        {hasResult && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
            <Chip label="Semaines vécues" value={fmt(res.semainesVecues)} />
            <Chip label="Semaines restantes" value={fmt(res.semainesRestantes)} accent />
            <Chip label="Vie écoulée" value={`${res.pctEcoule.toFixed(1).replace(".", ",")} %`} />
            <Chip label="Étés restants" value={`${res.etesRestants}`} accent />
            {visitesRestantes !== null && (
              <Chip label="Visites proches restantes" value={fmt(visitesRestantes)} />
            )}
            <Chip label="Week-ends restants" value={fmt(res.semainesRestantes)} />
          </div>
        )}

        {/* Formulaire */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>
            Paramètres
          </h2>

          {/* Date de naissance */}
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="date-naissance" style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              Date de naissance
            </label>
            <input
              id="date-naissance"
              type="date"
              value={dateNaissance}
              max={new Date().toISOString().split("T")[0]}
              onChange={e => setDateNaissance(e.target.value)}
              style={{ width: "100%", background: "var(--input-bg)", border: "1.5px solid var(--border)", borderRadius: 12, color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 16, padding: "14px 20px", outline: "none", boxSizing: "border-box", colorScheme: "dark light" }}
            />
          </div>

          {/* Genre */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              Genre (ajuste l'espérance par défaut)
            </div>
            <div style={{ display: "flex", background: "var(--input-bg)", borderRadius: 10, padding: 3, gap: 2 }}>
              {[["femme", "♀ Femme", ESPERANCE_FEMME], ["homme", "♂ Homme", ESPERANCE_HOMME]].map(([val, label, esp]) => (
                <button key={val} onClick={() => { setGenre(val); if (!esperanceModifiee) setEsperance(esp); }}
                  aria-pressed={genre === val ? "true" : "false"}
                  style={{ flex: 1, padding: "9px 16px", borderRadius: 8, border: "none", background: genre === val ? "rgba(43,92,230,0.12)" : "transparent", color: genre === val ? "var(--primary)" : "var(--text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <StepperInput
            label="Espérance de vie (années)"
            value={esperance}
            onChange={v => { setEsperance(v); setEsperanceModifiee(true); }}
            min={40}
            max={120}
            step={1}
            unit="ans"
            hint={`${Math.round(esperance * 52)} semaines au total`}
          />

          <StepperInput
            label="Fréquence de visites à vos proches (optionnel)"
            value={frequenceVisites}
            onChange={setFrequenceVisites}
            min={0}
            max={52}
            step={1}
            unit="fois/an"
            hint={frequenceVisites > 0 && hasResult ? `≈ ${Math.floor(res.semainesRestantes * frequenceVisites / 52)} visites devant vous` : "Laissez à 0 pour ignorer"}
          />
        </div>

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* Note éditoriale */}
        {hasResult && (
          <AccordionSection title="Ce que cette grille révèle" subtitle="Lecture bienveillante de votre visualisation">
            <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <p style={{ marginBottom: 14 }}>
                À <strong style={{ color: "var(--text)" }}>{res.ageActuel} ans</strong>, vous avez vécu{" "}
                <strong style={{ color: "var(--text)" }}>{fmt(res.semainesVecues)} semaines</strong> — soit{" "}
                {res.pctEcoule.toFixed(0)} % de votre espérance de vie estimée.
              </p>
              <p style={{ marginBottom: 14 }}>
                Il vous reste <strong style={{ color: "var(--primary)" }}>{fmt(res.semainesRestantes)} semaines</strong>,{" "}
                soit environ <strong style={{ color: "var(--primary)" }}>{res.etesRestants} étés</strong>.
              </p>
              {frequenceVisites > 0 && visitesRestantes !== null && (
                <p style={{ marginBottom: 14 }}>
                  Si vous voyez vos proches {frequenceVisites} fois par an, il vous reste environ{" "}
                  <strong style={{ color: "var(--primary)" }}>{fmt(visitesRestantes)} occasions</strong> de les retrouver.
                  Ce chiffre n'est pas là pour angoisser, mais pour vous rappeler que chaque rencontre compte.
                </p>
              )}
              <p>
                L'objectif n'est pas de mesurer ce qu'il reste mais de <strong>décider comment l'utiliser</strong>.
              </p>
            </div>
          </AccordionSection>
        )}

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>4 160 semaines : un chiffre qui change tout</h3>
            <p style={{ marginBottom: 16 }}>Une vie humaine de 80 ans représente exactement 4 160 semaines. C'est peu, et c'est beaucoup — mais c'est surtout un nombre concret qu'on peut visualiser d'un seul regard. Ce simulateur met en perspective le temps déjà écoulé et celui qu'il reste selon votre espérance de vie. Contrairement à une représentation en années ou en jours, la semaine est une unité à la fois suffisamment petite pour être tangible et suffisamment grande pour être significative.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>L'origine : Tim Urban et Wait But Why</h3>
            <p style={{ marginBottom: 16 }}>Cette visualisation a été popularisée en 2014 par Tim Urban sur son blog Wait But Why, avec l'article « Your Life in Weeks ». Sa représentation sous forme de grille — chaque case représentant une semaine, les cases passées en gris et les cases à venir en blanc — a eu un impact profond sur de nombreux lecteurs, les poussant à repenser leurs priorités et l'usage de leur temps. L'article est devenu viral et a engendré une prise de conscience sur le caractère fini du temps disponible.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Comment utiliser cet outil positivement</h3>
            <p>La visualisation de sa vie en semaines n'est pas un exercice morbide, mais un outil de clarification. Confronté à cette grille, chacun peut identifier ce qui mérite vraiment son temps et ce qui n'en vaut pas la peine. Les psychologues parlent de « salience of mortality » : rappeler que le temps est fini augmente la motivation à vivre conformément à ses valeurs et à ne pas remettre à demain ce qui compte aujourd'hui.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>
            Questions fréquentes
          </h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </div>

        {/* AdSense bas */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
