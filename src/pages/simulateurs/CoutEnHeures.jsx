import { useState, useEffect, useRef } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";

import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, useAnimatedNumber, fmt, SimulateurHeader,
} from "../../components/ui.jsx";
import { useMoney } from "../../i18n/CurrencyContext.jsx";
import { fmtCur, activeSymbol } from "../../i18n/currency.js";
import { useTranslation } from "../../i18n/index.js";

// ─── Translations ─────────────────────────────────────────────────────────────
const TXT = {
  fr: {
    docTitle: "Simulateur Coût en Heures de Vie — Le vrai prix de vos achats",
    metaDesc: "Convertissez n'importe quel prix en heures de travail réel : combien de jours, semaines ou % de votre salaire représente cet achat ?",
    jsonLdName: "Simulateur Prix en heures de vie",
    jsonLdDesc: "Convertissez n'importe quel prix en heures de travail réel : combien de jours, semaines ou % de votre salaire représente cet achat ?",
    pageTitle: "Le vrai prix en heures de vie",
    pageDesc: "Combien d'heures de travail vous coûte vraiment cet achat ? Convertissez n'importe quel prix en temps de vie réel.",
    badge: "Vie & Temps · 2026",
    reassurance: ["✓ Calcul instantané", "✓ Taux horaire réel net", "✓ 100 % local — aucune donnée transmise"],
    heroLabel: "Coût en heures de vie",
    heroEmpty: "Saisissez le prix et votre salaire pour voir le résultat.",
    heroDays: (d) => `Cet achat représente <strong>${d} jours ouvrés</strong> de votre vie au travail.`,
    chipDays: "Jours ouvrés",
    chipWeeks: "Semaines",
    chipMonth: "% du mois",
    rateLabel: "Votre taux horaire net",
    paramsTitle: "Paramètres",
    inputPrixLabel: "Prix de l'article",
    inputPrixHintResult: (p, h) => `soit ${p} pour ${h} de travail`,
    inputPrixHintEmpty: "Entrez le prix TTC de l'article ou service",
    inputSalaireLabel: "Salaire net mensuel",
    inputSalaireHintResult: (r) => `Taux horaire : ${r}`,
    inputSalaireHintEmpty: "Votre salaire net (après impôts et charges)",
    inputSalaireUnit: (sym) => `${sym}/mois`,
    inputHeuresLabel: "Heures travaillées par semaine",
    inputHeuresHint: (h) => `${h * 52} heures par an`,
    inputHeuresUnit: "h/sem",
    inputMoisLabel: "Mois de salaire par an",
    inputMoisHint: "13e mois, primes inclus si applicable",
    inputMoisUnit: "mois",
    aboutTitle: "À propos de ce simulateur",
    aboutH3_1: "Votre salaire horaire net : l'étalon caché",
    aboutP1: "Le concept de « coût en heures de travail » consiste à exprimer le prix de tout achat non pas en euros, mais en temps de travail nécessaire pour le gagner. Pour l'utiliser, calculez votre salaire horaire net réel : divisez votre revenu mensuel net par le nombre d'heures effectivement consacrées au travail (trajet, préparation, heures supplémentaires inclus). Si vous gagnez 2 500 € nets pour 160 heures travaillées, votre heure vaut 15,63 €. Un achat à 300 € représente alors 19 heures de votre vie.",
    aboutH3_2: "L'origine du concept : Your Money or Your Life",
    aboutP2: "Cette approche a été popularisée par Vicki Robin et Joe Dominguez dans leur livre « Your Money or Your Life » publié en 1992. Leur thèse centrale : l'argent est du temps de vie transformé. Chaque dépense n'est pas seulement une sortie financière — c'est une portion de votre vie que vous échangez contre un bien ou un service. Cette prise de conscience modifie profondément le rapport à la consommation et à l'épargne.",
    aboutH3_3: "Un outil de décision, pas de privation",
    aboutP3: "L'objectif n'est pas de culpabiliser sur chaque dépense, mais de prendre des décisions plus conscientes. Certains achats valent clairement « le coup » en termes de satisfaction par heure de travail correspondante ; d'autres, passés au filtre de ce calcul, semblent soudainement moins indispensables. Ce simulateur vous aide à intégrer spontanément cette dimension dans vos réflexions financières quotidiennes.",
    faqTitle: "Questions fréquentes",
    reportTitle: "Simulateur Coût en Heures de Vie",
    reportHighlightLabel: "Coût en heures de vie",
    reportPrixLabel: "Prix de l'article",
    reportSalaireLabel: "Salaire net mensuel",
    reportHeuresLabel: "Heures travaillées/semaine",
    reportMoisLabel: "Mois de salaire par an",
    reportCoutLabel: "Coût en heures de travail",
    reportJoursLabel: "Jours ouvrés",
    reportSemainesLabel: "Semaines",
    reportPctLabel: "% du salaire mensuel",
    reportTauxLabel: "Taux horaire net",
    reportNote: "L'argent est du temps de vie transformé : évaluez chaque achat en heures de travail.",
    faq: [
      { q: "Pourquoi parler de « vie » plutôt que d'argent ?", a: "L'argent est une ressource renouvelable, le temps ne l'est pas. Convertir un prix en heures de travail permet de mieux évaluer si un achat en vaut vraiment la peine. Cette idée vient du livre « Your Money or Your Life » de Vicki Robin." },
      { q: "Pourquoi diviser par 52 semaines ?", a: "Nous utilisons 52 semaines par an pour calculer votre taux horaire : (salaire mensuel × mois travaillés) ÷ 52 semaines ÷ heures par semaine. Si vous travaillez 11 mois, ajustez le paramètre correspondant." },
      { q: "Les charges sociales sont-elles incluses ?", a: "Ce simulateur utilise votre salaire net (après charges et impôts). C'est le seul montant qui compte pour vous : c'est l'argent que vous pouvez réellement dépenser ou épargner." },
      { q: "Comment utiliser ce simulateur au quotidien ?", a: "Avant tout achat non essentiel, calculez son coût en heures. Si un restaurant à 80 € représente 4 heures de votre vie, vous décidez en conscience. Avec le temps, cette habitude transforme votre relation à la dépense." },
    ],
  },
  en: {
    docTitle: "Cost in Hours of Work Calculator — True Price | Simfinly",
    metaDesc: "Turn any purchase into real hours of your life. Based on your salary, discover what a product or subscription truly costs in life-time.",
    jsonLdName: "Cost in Hours of Work Calculator",
    jsonLdDesc: "Turn any purchase into real hours of your life. Based on your salary, discover what a product or subscription truly costs in life-time.",
    pageTitle: "The true cost of things",
    pageDesc: "How many working hours does this purchase really cost you? Convert any price into real life-time.",
    badge: "Life & Time · 2026",
    reassurance: ["✓ Instant calculation", "✓ Real net hourly rate", "✓ 100% local — no data transmitted"],
    heroLabel: "Cost in hours",
    heroEmpty: "Enter the price and your salary to see the result.",
    heroDays: (d) => `This purchase represents <strong>${d} working days</strong> of your life at work.`,
    chipDays: "Working days",
    chipWeeks: "Working weeks",
    chipMonth: "% of month",
    rateLabel: "Your net hourly rate",
    paramsTitle: "Parameters",
    inputPrixLabel: "Purchase price",
    inputPrixHintResult: (p, h) => `i.e. ${p} for ${h} of work`,
    inputPrixHintEmpty: "Enter the all-inclusive price of the item or service",
    inputSalaireLabel: "Monthly net salary",
    inputSalaireHintResult: (r) => `Hourly rate: ${r}`,
    inputSalaireHintEmpty: "Your net salary (after taxes and social contributions)",
    inputSalaireUnit: (sym) => `${sym}/month`,
    inputHeuresLabel: "Working hours per week",
    inputHeuresHint: (h) => `${h * 52} hours per year`,
    inputHeuresUnit: "h/week",
    inputMoisLabel: "Salary months per year",
    inputMoisHint: "Include 13th month, bonuses if applicable",
    inputMoisUnit: "months",
    aboutTitle: "About this calculator",
    aboutH3_1: "Your real net hourly rate: the hidden yardstick",
    aboutP1: "The concept of 'cost in working hours' means expressing the price of any purchase not in currency, but in the working time needed to earn it. To use it, calculate your real net hourly rate: divide your monthly net income by the number of hours actually devoted to work (commute, preparation, overtime included). If you earn €2,500 net for 160 hours worked, your hour is worth €15.63. A €300 purchase then represents 19 hours of your life.",
    aboutH3_2: "The origin: Your Money or Your Life",
    aboutP2: "This approach was popularised by Vicki Robin and Joe Dominguez in their book 'Your Money or Your Life' published in 1992. Their central thesis: money is transformed life-time. Every expense is not just a financial outflow — it is a portion of your life that you exchange for a good or service. This awareness profoundly changes one's relationship with spending and saving.",
    aboutH3_3: "A decision tool, not a deprivation tool",
    aboutP3: "The goal is not to feel guilty about every expense, but to make more conscious decisions. Some purchases are clearly 'worth it' in terms of satisfaction per corresponding working hour; others, when put through this filter, suddenly seem less indispensable. This calculator helps you spontaneously integrate this dimension into your daily financial thinking.",
    faqTitle: "Frequently asked questions",
    reportTitle: "Cost in Hours of Work Calculator",
    reportHighlightLabel: "Cost in hours",
    reportPrixLabel: "Item price",
    reportSalaireLabel: "Monthly net salary",
    reportHeuresLabel: "Working hours/week",
    reportMoisLabel: "Salary months per year",
    reportCoutLabel: "Cost in working hours",
    reportJoursLabel: "Working days",
    reportSemainesLabel: "Working weeks",
    reportPctLabel: "% of monthly salary",
    reportTauxLabel: "Net hourly rate",
    reportNote: "Money is transformed life-time: evaluate every purchase in working hours.",
    faq: [
      { q: "Why talk about 'life' rather than money?", a: "Money is a renewable resource; time is not. Converting a price into working hours helps you better assess whether a purchase is truly worth it. This idea comes from the book 'Your Money or Your Life' by Vicki Robin." },
      { q: "Why divide by 52 weeks?", a: "We use 52 weeks per year to calculate your hourly rate: (monthly salary × months worked) ÷ 52 weeks ÷ hours per week. If you work 11 months, adjust the corresponding parameter." },
      { q: "Are social contributions included?", a: "This calculator uses your net salary (after contributions and taxes). That is the only amount that matters to you: it is the money you can actually spend or save." },
      { q: "How to use this calculator daily?", a: "Before any non-essential purchase, calculate its cost in hours. If a €80 restaurant represents 4 hours of your life, you decide consciously. Over time, this habit transforms your relationship with spending." },
    ],
  },
};

// ─── Constantes ───────────────────────────────────────────────────────────────
const HEURES_SEMAINE_DEFAUT = 35;
const MOIS_AN_DEFAUT = 12;

// ─── Calculs ─────────────────────────────────────────────────────────────────
function calcCout({ prix, salaire, heuresSemaine, moisParAn }) {
  if (!prix || !salaire || salaire <= 0 || !heuresSemaine || heuresSemaine <= 0 || !moisParAn) {
    return null;
  }
  const tauxHoraire = (salaire * moisParAn) / 52 / heuresSemaine;
  const heures = prix / tauxHoraire;
  const joursOuvres = heures / (heuresSemaine / 5);
  const semaines = heures / heuresSemaine;
  const pctMois = (prix / salaire) * 100;
  return { tauxHoraire, heures, joursOuvres, semaines, pctMois };
}

function formatHeures(h) {
  if (h <= 0) return "—";
  if (h < 1 / 60) return "< 1 minute";
  if (h < 1) {
    return `${Math.round(h * 60)} min`;
  }
  const ent = Math.floor(h);
  const min = Math.round((h - ent) * 60);
  if (min === 0) return `${fmt(ent)} h`;
  return `${fmt(ent)} h ${String(min).padStart(2, "0")}`;
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "18px 0", textAlign: "left" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{q}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 18, color: open ? "var(--gold)" : "var(--text-secondary)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && <p style={{ paddingBottom: 18, paddingRight: 32, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{a}</p>}
    </div>
  );
}

// ─── Composant ────────────────────────────────────────────────────────────────
export default function CoutEnHeures() {
  const [theme, setTheme] = useTheme();
  useMoney(); // abonnement aux changements de devise

  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;

  const [prix, setPrix]             = useState(null);
  const [salaire, setSalaire]       = useState(null);
  const [heuresSemaine, setHeures]  = useState(HEURES_SEMAINE_DEFAUT);
  const [moisParAn, setMois]        = useState(MOIS_AN_DEFAUT);

  const resultsRef = useRef(null);


  useEffect(() => {
    document.title = txt.docTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", txt.metaDesc);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'cout-en-heures' });
    if (!sessionStorage.getItem('tracked_cout-en-heures')) {
      sessionStorage.setItem('tracked_cout-en-heures', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'cout-en-heures' })
      }).catch(() => {});
    }
  }, [txt.docTitle, txt.metaDesc]);
  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.prix !== undefined) setPrix(shared.prix); if (shared.salaire !== undefined) setSalaire(shared.salaire); if (shared.heuresSemaine !== undefined) setHeures(shared.heuresSemaine); if (shared.moisParAn !== undefined) setMois(shared.moisParAn)
    }
  }, []);
  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ prix, salaire, heuresSemaine, moisParAn }));
  }, [prix, salaire, heuresSemaine, moisParAn]);



  const res = calcCout({ prix, salaire, heuresSemaine, moisParAn });
  const heuresAnim = useAnimatedNumber(res?.heures ?? 0);
  const hasResult = !!res;

  const report = {
    title: txt.reportTitle,
    highlight: { label: txt.reportHighlightLabel, value: hasResult ? formatHeures(res.heures) : "—" },
    params: [
      { label: txt.reportPrixLabel, value: prix ? fmtCur(prix) : "—" },
      { label: txt.reportSalaireLabel, value: salaire ? fmtCur(salaire) : "—" },
      { label: txt.reportHeuresLabel, value: `${heuresSemaine} h` },
      { label: txt.reportMoisLabel, value: `${moisParAn}` },
    ],
    results: hasResult ? [
      { label: txt.reportCoutLabel, value: formatHeures(res.heures), strong: true },
      { label: txt.reportJoursLabel, value: res.joursOuvres.toFixed(1).replace(".", ",") },
      { label: txt.reportSemainesLabel, value: res.semaines.toFixed(1).replace(".", ",") },
      { label: txt.reportPctLabel, value: `${res.pctMois.toFixed(1).replace(".", ",")} %` },
      { label: txt.reportTauxLabel, value: `${res.tauxHoraire.toFixed(2).replace(".", ",")} ${activeSymbol()}/h` },
    ] : [],
    notes: hasResult ? [txt.reportNote] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.jsonLdName,
        "url": "https://www.simfinly.com/simulateurs/cout-en-heures",
        "description": txt.jsonLdDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": locale === 'en' ? 'en-US' : 'fr-FR',
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": txt.faq.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/cout-en-heures" size={34} />}
          badge={txt.badge}
          title={txt.pageTitle}
          desc={txt.pageDesc}
        />

        {/* Reassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {txt.reassurance.map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>

        {/* Résultat héro — toujours en premier pour mobile */}
        <div ref={resultsRef} style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, boxShadow: "var(--card-shadow)", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
            {txt.heroLabel}
          </div>
          {!hasResult ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>
              {txt.heroEmpty}
            </p>
          ) : (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,76px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {formatHeures(heuresAnim)}
              </div>
              <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}
                dangerouslySetInnerHTML={{ __html: txt.heroDays(res.joursOuvres.toFixed(1).replace(".", ",")) }}
              />

              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 20 }}>
                <Chip label={txt.chipDays} value={res.joursOuvres.toFixed(1).replace(".", ",")} accent />
                <Chip label={txt.chipWeeks} value={res.semaines.toFixed(1).replace(".", ",")} />
                <Chip label={txt.chipMonth} value={`${res.pctMois.toFixed(1).replace(".", ",")} %`} accent={res.pctMois > 50} />
              </div>

              {/* Taux horaire */}
              <div style={{ marginTop: 16, padding: "10px 16px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                {txt.rateLabel} : <strong style={{ color: "var(--gold)" }}>{res.tauxHoraire.toFixed(2).replace(".", ",")} {activeSymbol()}/h</strong>
              </div>
            </>
          )}
        </div>

        <ShareBar params={{ prix, salaire, heuresSemaine, moisParAn }} resultsRef={resultsRef} report={report} name="cout-en-heures" />

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>
            {txt.paramsTitle}
          </h2>

          <NumInput
            id="prix-article"
            label={txt.inputPrixLabel}
            value={prix}
            onChange={setPrix}
            unit={activeSymbol()}
            min={0}
            max={1000000}
            hint={hasResult ? txt.inputPrixHintResult(fmtCur(prix), formatHeures(res.heures)) : txt.inputPrixHintEmpty}
          />

          <NumInput
            id="salaire-mensuel"
            label={txt.inputSalaireLabel}
            value={salaire}
            onChange={setSalaire}
            unit={txt.inputSalaireUnit(activeSymbol())}
            min={0}
            max={100000}
            hint={hasResult ? txt.inputSalaireHintResult(`${res.tauxHoraire.toFixed(2).replace(".", ",")} ${activeSymbol()}/h`) : txt.inputSalaireHintEmpty}
          />

          <StepperInput
            label={txt.inputHeuresLabel}
            value={heuresSemaine}
            onChange={setHeures}
            min={1}
            max={80}
            step={1}
            unit={txt.inputHeuresUnit}
            hint={txt.inputHeuresHint(heuresSemaine)}
          />

          <StepperInput
            label={txt.inputMoisLabel}
            value={moisParAn}
            onChange={setMois}
            min={1}
            max={16}
            step={0.5}
            unit={txt.inputMoisUnit}
            hint={txt.inputMoisHint}
          />
        </div>

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aboutTitle}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>{txt.aboutH3_1}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP1}</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3_2}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP2}</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3_3}</h3>
            <p>{txt.aboutP3}</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 8 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>
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
