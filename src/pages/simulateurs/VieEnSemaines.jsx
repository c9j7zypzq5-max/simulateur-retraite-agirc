import { useState, useEffect, useRef, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

import { useTheme } from "../../hooks/useTheme.js";
import { useTranslation } from "../../i18n/index.js";
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

// ─── Textes (FR / EN) ──────────────────────────────────────────────────────────
const TXT = {
  fr: {
    docTitle: "Simulateur Ma Vie en Semaines — Visualisez votre temps de vie",
    docDesc: "Visualisez votre vie entière en semaines : semaines vécues, restantes, étés à venir. Inspiré du concept \"Your Life in Weeks\".",
    appName: "Simulateur Ma vie en semaines",
    badge: "Vie & Temps · 2026",
    title: "Ma vie en semaines",
    desc: "Visualisez l'intégralité de votre vie sous forme de grille. Chaque case représente une semaine. En or : les semaines vécues. En gris : les semaines à venir.",
    reassurance: ["✓ Aucune donnée envoyée", "✓ Basé sur les données INSEE 2024", "✓ Ton factuel et bienveillant"],
    gridHeading: (v, r) => `${fmt(v)} semaines vécues · ${fmt(r)} à venir`,
    gridHeadingEmpty: "Votre vie en semaines",
    legendLived: "Vécues",
    legendAhead: "À venir",
    emptyLine1: "Entrez votre date de naissance",
    emptyLine2: "pour afficher votre grille.",
    gridFooter: (age) => `Chaque case = 1 semaine · 52 colonnes = 1 an · ${age} ans accomplis`,
    chipLived: "Semaines vécues",
    chipRemaining: "Semaines restantes",
    chipElapsed: "Vie écoulée",
    chipSummers: "Étés restants",
    chipVisits: "Visites proches restantes",
    chipWeekends: "Week-ends restants",
    params: "Paramètres",
    birthLabel: "Date de naissance",
    genderLabel: "Genre (ajuste l'espérance par défaut)",
    female: "♀ Femme",
    male: "♂ Homme",
    espLabel: "Espérance de vie (années)",
    espUnit: "ans",
    espHint: (n) => `${n} semaines au total`,
    visitsLabel: "Fréquence de visites à vos proches (optionnel)",
    visitsUnit: "fois/an",
    visitsHint: (n) => `≈ ${fmt(n)} visites devant vous`,
    visitsHintEmpty: "Laissez à 0 pour ignorer",
    revealTitle: "Ce que cette grille révèle",
    revealSubtitle: "Lecture bienveillante de votre visualisation",
    aboutTitle: "À propos de ce simulateur",
    aboutH3a: "4 160 semaines : un chiffre qui change tout",
    aboutPa: "Une vie humaine de 80 ans représente exactement 4 160 semaines. C'est peu, et c'est beaucoup — mais c'est surtout un nombre concret qu'on peut visualiser d'un seul regard. Ce simulateur met en perspective le temps déjà écoulé et celui qu'il reste selon votre espérance de vie. Contrairement à une représentation en années ou en jours, la semaine est une unité à la fois suffisamment petite pour être tangible et suffisamment grande pour être significative.",
    aboutH3b: "L'origine : Tim Urban et Wait But Why",
    aboutPb: "Cette visualisation a été popularisée en 2014 par Tim Urban sur son blog Wait But Why, avec l'article « Your Life in Weeks ». Sa représentation sous forme de grille — chaque case représentant une semaine, les cases passées en gris et les cases à venir en blanc — a eu un impact profond sur de nombreux lecteurs, les poussant à repenser leurs priorités et l'usage de leur temps. L'article est devenu viral et a engendré une prise de conscience sur le caractère fini du temps disponible.",
    aboutH3c: "Comment utiliser cet outil positivement",
    aboutPc: "La visualisation de sa vie en semaines n'est pas un exercice morbide, mais un outil de clarification. Confronté à cette grille, chacun peut identifier ce qui mérite vraiment son temps et ce qui n'en vaut pas la peine. Les psychologues parlent de « salience of mortality » : rappeler que le temps est fini augmente la motivation à vivre conformément à ses valeurs et à ne pas remettre à demain ce qui compte aujourd'hui.",
    faqTitle: "Questions fréquentes",
    reportTitle: "Ma Vie en Semaines",
    rLabelRemaining: "Semaines restantes (estimation)",
    rBirth: "Date de naissance",
    rGender: "Genre",
    rEsp: "Espérance de vie",
    rWeeksLived: "Semaines vécues",
    rElapsed: "Vie écoulée",
    rAge: "Âge actuel",
    rSummers: "Étés restants",
    rNote: "Chaque semaine restante est un capital précieux à investir consciemment.",
    revealAge: (age, weeks, pct) => <>À <strong style={{ color: "var(--text)" }}>{age} ans</strong>, vous avez vécu <strong style={{ color: "var(--text)" }}>{fmt(weeks)} semaines</strong> — soit {pct} % de votre espérance de vie estimée.</>,
    revealRemaining: (weeks, summers) => <>Il vous reste <strong style={{ color: "var(--primary)" }}>{fmt(weeks)} semaines</strong>, soit environ <strong style={{ color: "var(--primary)" }}>{summers} étés</strong>.</>,
    revealVisits: (freq, visits) => <>Si vous voyez vos proches {freq} fois par an, il vous reste environ <strong style={{ color: "var(--primary)" }}>{fmt(visits)} occasions</strong> de les retrouver. Ce chiffre n'est pas là pour angoisser, mais pour vous rappeler que chaque rencontre compte.</>,
    revealEnd: <>L'objectif n'est pas de mesurer ce qu'il reste mais de <strong>décider comment l'utiliser</strong>.</>,
    faq: [
      { q: "Pourquoi visualiser sa vie en semaines ?", a: "L'auteur Tim Urban (Wait But Why) a popularisé cette visualisation pour montrer, de façon concrète, combien de temps il reste. La grille rend tangible ce que notre cerveau a du mal à appréhender : le temps est fini, et il passe vite." },
      { q: "D'où vient l'espérance de vie ?", a: "Les chiffres par défaut (80 ans pour les hommes, 85 ans pour les femmes) sont basés sur les données INSEE 2024 pour la France. Ils ne tiennent pas compte de votre état de santé, de vos habitudes ou de vos antécédents familiaux — ajustez-les selon votre situation." },
      { q: "Est-ce que ce simulateur peut être anxiogène ?", a: "Pour certaines personnes, oui. Si vous le ressentez ainsi, nous vous encourageons à regarder ce qui est déjà accompli (cases dorées) plutôt que ce qui reste. L'objectif est la clarté, pas l'anxiété. Vos semaines restantes sont un capital précieux à investir consciemment." },
      { q: "Comment utiliser cette visualisation ?", a: "Certaines personnes impriment leur grille et la collent au bureau. D'autres se posent chaque trimestre : 'Est-ce que j'utilise mes semaines de façon alignée avec mes priorités ?' L'outil n'est pas là pour juger, mais pour aider à décider." },
    ],
  },
  en: {
    docTitle: "Your Life in Weeks Calculator — Visualize Your Lifetime",
    docDesc: "Visualize your entire life in weeks: weeks lived, weeks left, summers ahead. Inspired by the \"Your Life in Weeks\" concept.",
    appName: "Your Life in Weeks calculator",
    badge: "Life & Time · 2026",
    title: "Your life in weeks",
    desc: "Visualize your whole life as a grid. Each square is one week. In gold: the weeks you've lived. In grey: the weeks ahead.",
    reassurance: ["✓ No data sent", "✓ Based on national life-expectancy data", "✓ A factual, caring tone"],
    gridHeading: (v, r) => `${fmt(v)} weeks lived · ${fmt(r)} ahead`,
    gridHeadingEmpty: "Your life in weeks",
    legendLived: "Lived",
    legendAhead: "Ahead",
    emptyLine1: "Enter your date of birth",
    emptyLine2: "to display your grid.",
    gridFooter: (age) => `Each square = 1 week · 52 columns = 1 year · ${age} years completed`,
    chipLived: "Weeks lived",
    chipRemaining: "Weeks left",
    chipElapsed: "Life elapsed",
    chipSummers: "Summers left",
    chipVisits: "Visits with loved ones left",
    chipWeekends: "Weekends left",
    params: "Settings",
    birthLabel: "Date of birth",
    genderLabel: "Gender (adjusts the default life expectancy)",
    female: "♀ Female",
    male: "♂ Male",
    espLabel: "Life expectancy (years)",
    espUnit: "yrs",
    espHint: (n) => `${n} weeks in total`,
    visitsLabel: "How often you see your loved ones (optional)",
    visitsUnit: "times/yr",
    visitsHint: (n) => `≈ ${fmt(n)} visits ahead of you`,
    visitsHintEmpty: "Leave at 0 to ignore",
    revealTitle: "What this grid reveals",
    revealSubtitle: "A caring reading of your visualization",
    aboutTitle: "About this calculator",
    aboutH3a: "4,160 weeks: a number that changes everything",
    aboutPa: "An 80-year human life is exactly 4,160 weeks. It's little, and it's a lot — but above all it's a concrete number you can take in at a glance. This calculator puts into perspective the time already gone and the time remaining based on your life expectancy. Unlike a representation in years or days, the week is a unit both small enough to feel tangible and large enough to be meaningful.",
    aboutH3b: "The origin: Tim Urban and Wait But Why",
    aboutPb: "This visualization was popularized in 2014 by Tim Urban on his blog Wait But Why, with the article \"Your Life in Weeks\". His grid representation — each square a week, past squares greyed out and future squares left blank — had a profound impact on many readers, pushing them to rethink their priorities and how they spend their time. The article went viral and raised awareness of the finite nature of the time we have.",
    aboutH3c: "How to use this tool positively",
    aboutPc: "Visualizing your life in weeks is not a morbid exercise but a tool for clarity. Faced with this grid, anyone can identify what truly deserves their time and what doesn't. Psychologists speak of the \"salience of mortality\": being reminded that time is finite increases the motivation to live in line with one's values and not to postpone what matters today.",
    faqTitle: "Frequently asked questions",
    reportTitle: "Your Life in Weeks",
    rLabelRemaining: "Weeks left (estimate)",
    rBirth: "Date of birth",
    rGender: "Gender",
    rEsp: "Life expectancy",
    rWeeksLived: "Weeks lived",
    rElapsed: "Life elapsed",
    rAge: "Current age",
    rSummers: "Summers left",
    rNote: "Each remaining week is precious capital to invest consciously.",
    revealAge: (age, weeks, pct) => <>At <strong style={{ color: "var(--text)" }}>{age}</strong>, you've lived <strong style={{ color: "var(--text)" }}>{fmt(weeks)} weeks</strong> — that is {pct}% of your estimated life expectancy.</>,
    revealRemaining: (weeks, summers) => <>You have <strong style={{ color: "var(--primary)" }}>{fmt(weeks)} weeks</strong> left, or about <strong style={{ color: "var(--primary)" }}>{summers} summers</strong>.</>,
    revealVisits: (freq, visits) => <>If you see your loved ones {freq} times a year, you have about <strong style={{ color: "var(--primary)" }}>{fmt(visits)} occasions</strong> left to be with them. This number isn't meant to worry you, but to remind you that every meeting counts.</>,
    revealEnd: <>The point is not to measure what's left but to <strong>decide how to use it</strong>.</>,
    faq: [
      { q: "Why visualize your life in weeks?", a: "Author Tim Urban (Wait But Why) popularized this visualization to show, concretely, how much time is left. The grid makes tangible what our brain struggles to grasp: time is finite, and it goes by fast." },
      { q: "Where does the life expectancy come from?", a: "The default figures (80 for men, 85 for women) are based on national statistics. They don't account for your health, habits or family history — adjust them to your situation." },
      { q: "Can this calculator feel distressing?", a: "For some people, yes. If you feel that way, we encourage you to look at what's already been done (the gold squares) rather than what's left. The goal is clarity, not anxiety. Your remaining weeks are precious capital to invest consciously." },
      { q: "How should I use this visualization?", a: "Some people print their grid and pin it to their desk. Others ask themselves each quarter: 'Am I using my weeks in line with my priorities?' The tool isn't here to judge, but to help you decide." },
    ],
  },
};

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
function GrilleVie({ semainesVecues, semainesTotales, ariaLabel }) {
  const cells = useMemo(() => {
    return Array.from({ length: semainesTotales }, (_, i) => i < semainesVecues);
  }, [semainesVecues, semainesTotales]);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
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

// ─── Composant ────────────────────────────────────────────────────────────────
export default function VieEnSemaines() {
  const [theme, setTheme] = useTheme();
  const { locale } = useTranslation();
  const txt = TXT[locale] || TXT.fr;
  const isEn = locale === "en";
  const pct1 = (n) => (isEn ? n.toFixed(1) : n.toFixed(1).replace(".", ","));

  const [dateNaissance, setDateNaissance] = useState("");
  const [genre, setGenre]                = useState("femme"); // "femme" | "homme"
  const [esperance, setEsperance]        = useState(ESPERANCE_FEMME);
  const [esperanceModifiee, setEsperanceModifiee] = useState(false);
  const [frequenceVisites, setFrequenceVisites]   = useState(0);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (!esperanceModifiee) {
      setEsperance(genre === "femme" ? ESPERANCE_FEMME : ESPERANCE_HOMME);
    }
  }, [genre, esperanceModifiee]);

  usePageMeta(txt.docTitle, txt.docDesc);

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
    title: txt.reportTitle,
    highlight: { label: txt.rLabelRemaining, value: hasResult ? fmt(res.semainesRestantes) : "—" },
    params: [
      { label: txt.rBirth, value: dateNaissance || "—" },
      { label: txt.rGender, value: genre === "femme" ? txt.female.replace(/^[^ ]+ /, "") : txt.male.replace(/^[^ ]+ /, "") },
      { label: txt.rEsp, value: `${esperance} ${txt.espUnit}` },
    ],
    results: hasResult ? [
      { label: txt.chipRemaining, value: fmt(res.semainesRestantes), strong: true },
      { label: txt.rWeeksLived, value: fmt(res.semainesVecues) },
      { label: txt.rElapsed, value: `${pct1(res.pctEcoule)} %` },
      { label: txt.rAge, value: `${res.ageActuel} ${txt.espUnit}` },
      { label: txt.rSummers, value: `${res.etesRestants}` },
    ] : [],
    notes: hasResult ? [txt.rNote] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.appName,
        "url": `https://www.simfinly.com${isEn ? "/en/simulators/life-in-weeks" : "/simulateurs/vie-en-semaines"}`,
        "description": txt.docDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": isEn ? "en-US" : "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": txt.faq.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/vie-en-semaines" size={34} />}
          badge={txt.badge}
          title={txt.title}
          desc={txt.desc}
        />

        {/* Reassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {txt.reassurance.map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>

        {/* Grille — toujours visible en premier */}
        <div ref={resultsRef} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", margin: 0 }}>
              {hasResult
                ? txt.gridHeading(res.semainesVecues, res.semainesRestantes)
                : txt.gridHeadingEmpty}
            </h2>
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 1, background: "var(--primary)" }} />
                {txt.legendLived}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 1, background: "var(--border)", opacity: 0.6 }} />
                {txt.legendAhead}
              </span>
            </div>
          </div>

          {hasResult ? (
            <GrilleVie semainesVecues={res.semainesVecues} semainesTotales={res.semainesTotales}
              ariaLabel={txt.gridHeading(res.semainesVecues, res.semainesRestantes)} />
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, textAlign: "center", lineHeight: 1.65 }}>
                {txt.emptyLine1}<br />{txt.emptyLine2}
              </p>
            </div>
          )}

          {hasResult && (
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-secondary)", textAlign: "right" }}>
              {txt.gridFooter(res.ageActuel)}
            </div>
          )}
        </div>

        <ShareBar params={{ dateNaissance, genre, esperance }} resultsRef={resultsRef} report={report} name="vie-en-semaines" />

        {/* Métriques clés */}
        {hasResult && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
            <Chip label={txt.chipLived} value={fmt(res.semainesVecues)} />
            <Chip label={txt.chipRemaining} value={fmt(res.semainesRestantes)} accent />
            <Chip label={txt.chipElapsed} value={`${pct1(res.pctEcoule)} %`} />
            <Chip label={txt.chipSummers} value={`${res.etesRestants}`} accent />
            {visitesRestantes !== null && (
              <Chip label={txt.chipVisits} value={fmt(visitesRestantes)} />
            )}
            <Chip label={txt.chipWeekends} value={fmt(res.semainesRestantes)} />
          </div>
        )}

        {/* Formulaire */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>
            {txt.params}
          </h2>

          {/* Date de naissance */}
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="date-naissance" style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              {txt.birthLabel}
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
              {txt.genderLabel}
            </div>
            <div style={{ display: "flex", background: "var(--input-bg)", borderRadius: 10, padding: 3, gap: 2 }}>
              {[["femme", txt.female, ESPERANCE_FEMME], ["homme", txt.male, ESPERANCE_HOMME]].map(([val, label, esp]) => (
                <button key={val} onClick={() => { setGenre(val); if (!esperanceModifiee) setEsperance(esp); }}
                  aria-pressed={genre === val ? "true" : "false"}
                  style={{ flex: 1, padding: "9px 16px", borderRadius: 8, border: "none", background: genre === val ? "rgba(43,92,230,0.12)" : "transparent", color: genre === val ? "var(--primary)" : "var(--text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <StepperInput
            label={txt.espLabel}
            value={esperance}
            onChange={v => { setEsperance(v); setEsperanceModifiee(true); }}
            min={40}
            max={120}
            step={1}
            unit={txt.espUnit}
            hint={txt.espHint(Math.round(esperance * 52))}
          />

          <StepperInput
            label={txt.visitsLabel}
            value={frequenceVisites}
            onChange={setFrequenceVisites}
            min={0}
            max={52}
            step={1}
            unit={txt.visitsUnit}
            hint={frequenceVisites > 0 && hasResult ? txt.visitsHint(Math.floor(res.semainesRestantes * frequenceVisites / 52)) : txt.visitsHintEmpty}
          />
        </div>

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* Note éditoriale */}
        {hasResult && (
          <AccordionSection title={txt.revealTitle} subtitle={txt.revealSubtitle}>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <p style={{ marginBottom: 14 }}>
                {txt.revealAge(res.ageActuel, res.semainesVecues, res.pctEcoule.toFixed(0))}
              </p>
              <p style={{ marginBottom: 14 }}>
                {txt.revealRemaining(res.semainesRestantes, res.etesRestants)}
              </p>
              {frequenceVisites > 0 && visitesRestantes !== null && (
                <p style={{ marginBottom: 14 }}>
                  {txt.revealVisits(frequenceVisites, visitesRestantes)}
                </p>
              )}
              <p>{txt.revealEnd}</p>
            </div>
          </AccordionSection>
        )}

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aboutTitle}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>{txt.aboutH3a}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutPa}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3b}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutPb}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3c}</h3>
            <p>{txt.aboutPc}</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>
            {txt.faqTitle}
          </h2>
          {txt.faq.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
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
