import { useState, useEffect, useRef } from "react";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";

import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, useAnimatedNumber, fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

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

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Pourquoi parler de « vie » plutôt que d'argent ?", a: "L'argent est une ressource renouvelable, le temps ne l'est pas. Convertir un prix en heures de travail permet de mieux évaluer si un achat en vaut vraiment la peine. Cette idée vient du livre « Your Money or Your Life » de Vicki Robin." },
  { q: "Pourquoi diviser par 52 semaines ?", a: "Nous utilisons 52 semaines par an pour calculer votre taux horaire : (salaire mensuel × mois travaillés) ÷ 52 semaines ÷ heures par semaine. Si vous travaillez 11 mois, ajustez le paramètre correspondant." },
  { q: "Les charges sociales sont-elles incluses ?", a: "Ce simulateur utilise votre salaire net (après charges et impôts). C'est le seul montant qui compte pour vous : c'est l'argent que vous pouvez réellement dépenser ou épargner." },
  { q: "Comment utiliser ce simulateur au quotidien ?", a: "Avant tout achat non essentiel, calculez son coût en heures. Si un restaurant à 80 € représente 4 heures de votre vie, vous décidez en conscience. Avec le temps, cette habitude transforme votre relation à la dépense." },
];

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

  const [prix, setPrix]             = useState(null);
  const [salaire, setSalaire]       = useState(null);
  const [heuresSemaine, setHeures]  = useState(HEURES_SEMAINE_DEFAUT);
  const [moisParAn, setMois]        = useState(MOIS_AN_DEFAUT);

  useEffect(() => {
    document.title = "Simulateur Coût en Heures de Vie — Le vrai prix de vos achats";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Convertissez n'importe quel prix en heures de travail réel : combien de jours, semaines ou % de votre salaire représente cet achat ?");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'cout-en-heures' });
    if (!sessionStorage.getItem('tracked_cout-en-heures')) {
      sessionStorage.setItem('tracked_cout-en-heures', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'cout-en-heures' })
      }).catch(() => {});
    }
  }, []);

  const res = calcCout({ prix, salaire, heuresSemaine, moisParAn });
  const heuresAnim = useAnimatedNumber(res?.heures ?? 0);
  const hasResult = !!res;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="⏰"
          badge="Vie & Temps · 2026"
          title="Le vrai prix en heures de vie"
          desc="Combien d'heures de travail vous coûte vraiment cet achat ? Convertissez n'importe quel prix en temps de vie réel."
        />

        {/* Reassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Calcul instantané", "✓ Taux horaire réel net", "✓ 100 % local — aucune donnée transmise"].map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>

        {/* Résultat héro — toujours en premier pour mobile */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, boxShadow: "var(--card-shadow)", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
            Coût en heures de vie
          </div>
          {!hasResult ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>
              Saisissez le prix et votre salaire pour voir le résultat.
            </p>
          ) : (
            <>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,76px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {formatHeures(heuresAnim)}
              </div>
              <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                Cet achat représente{" "}
                <strong style={{ color: "var(--text)" }}>{res.joursOuvres.toFixed(1).replace(".", ",")} jours ouvrés</strong>
                {" "}de votre vie au travail.
              </p>

              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 20 }}>
                <Chip label="Jours ouvrés" value={res.joursOuvres.toFixed(1).replace(".", ",")} accent />
                <Chip label="Semaines" value={res.semaines.toFixed(1).replace(".", ",")} />
                <Chip label="% du mois" value={`${res.pctMois.toFixed(1).replace(".", ",")} %`} accent={res.pctMois > 50} />
              </div>

              {/* Taux horaire */}
              <div style={{ marginTop: 16, padding: "10px 16px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                Votre taux horaire net : <strong style={{ color: "var(--gold)" }}>{res.tauxHoraire.toFixed(2).replace(".", ",")} €/h</strong>
              </div>
            </>
          )}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>
            Paramètres
          </h2>

          <NumInput
            id="prix-article"
            label="Prix de l'article"
            value={prix}
            onChange={setPrix}
            unit="€"
            min={0}
            max={1000000}
            hint={hasResult ? `soit ${fmtEur(prix)} pour ${formatHeures(res.heures)} de travail` : "Entrez le prix TTC de l'article ou service"}
          />

          <NumInput
            id="salaire-mensuel"
            label="Salaire net mensuel"
            value={salaire}
            onChange={setSalaire}
            unit="€/mois"
            min={0}
            max={100000}
            hint={hasResult ? `Taux horaire : ${res.tauxHoraire.toFixed(2).replace(".", ",")} €/h` : "Votre salaire net (après impôts et charges)"}
          />

          <StepperInput
            label="Heures travaillées par semaine"
            value={heuresSemaine}
            onChange={setHeures}
            min={1}
            max={80}
            step={1}
            unit="h/sem"
            hint={`${heuresSemaine * 52} heures par an`}
          />

          <StepperInput
            label="Mois de salaire par an"
            value={moisParAn}
            onChange={setMois}
            min={1}
            max={16}
            step={0.5}
            unit="mois"
            hint="13e mois, primes inclus si applicable"
          />
        </div>

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Votre salaire horaire net : l'étalon caché</h3>
            <p style={{ marginBottom: 16 }}>Le concept de « coût en heures de travail » consiste à exprimer le prix de tout achat non pas en euros, mais en temps de travail nécessaire pour le gagner. Pour l'utiliser, calculez votre salaire horaire net réel : divisez votre revenu mensuel net par le nombre d'heures effectivement consacrées au travail (trajet, préparation, heures supplémentaires inclus). Si vous gagnez 2 500 € nets pour 160 heures travaillées, votre heure vaut 15,63 €. Un achat à 300 € représente alors 19 heures de votre vie.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>L'origine du concept : Your Money or Your Life</h3>
            <p style={{ marginBottom: 16 }}>Cette approche a été popularisée par Vicki Robin et Joe Dominguez dans leur livre « Your Money or Your Life » publié en 1992. Leur thèse centrale : l'argent est du temps de vie transformé. Chaque dépense n'est pas seulement une sortie financière — c'est une portion de votre vie que vous échangez contre un bien ou un service. Cette prise de conscience modifie profondément le rapport à la consommation et à l'épargne.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Un outil de décision, pas de privation</h3>
            <p>L'objectif n'est pas de culpabiliser sur chaque dépense, mais de prendre des décisions plus conscientes. Certains achats valent clairement « le coup » en termes de satisfaction par heure de travail correspondante ; d'autres, passés au filtre de ce calcul, semblent soudainement moins indispensables. Ce simulateur vous aide à intégrer spontanément cette dimension dans vos réflexions financières quotidiennes.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 8 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>
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
