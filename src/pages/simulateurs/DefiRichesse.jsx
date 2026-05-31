import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

const DECISIONS = [
  { id: 1, emoji: "☕", titre: "Café quotidien", choix: [
    { label: "Café en terrasse", detail: "4€/jour", impact: -120, color: "red" },
    { label: "Café maison", detail: "0,30€/jour", impact: +114, color: "green" }
  ]},
  { id: 2, emoji: "🚗", titre: "Transport quotidien", choix: [
    { label: "Voiture + parking", detail: "450€/mois", impact: -450, color: "red" },
    { label: "Transports en commun", detail: "90€/mois", impact: +360, color: "green" }
  ]},
  { id: 3, emoji: "🍕", titre: "Déjeuner au travail", choix: [
    { label: "Restaurant midi", detail: "15€/jour", impact: -330, color: "red" },
    { label: "Repas préparé", detail: "4€/jour", impact: +242, color: "green" }
  ]},
  { id: 4, emoji: "📱", titre: "Abonnement téléphone", choix: [
    { label: "Forfait premium", detail: "60€/mois", impact: -60, color: "red" },
    { label: "Forfait low-cost", detail: "10€/mois", impact: +50, color: "green" }
  ]},
  { id: 5, emoji: "🎬", titre: "Streaming & abonnements", choix: [
    { label: "Tout avoir (Netflix, Spotify, Disney...)", detail: "70€/mois", impact: -70, color: "red" },
    { label: "1 seul abonnement + partage", detail: "15€/mois", impact: +55, color: "green" }
  ]},
  { id: 6, emoji: "🏋️", titre: "Sport", choix: [
    { label: "Salle de sport haut de gamme", detail: "80€/mois", impact: -80, color: "red" },
    { label: "Running + appli gratuite", detail: "0€/mois", impact: +80, color: "green" }
  ]},
  { id: 7, emoji: "🛍️", titre: "Shopping vêtements", choix: [
    { label: "Fast fashion chaque mois", detail: "150€/mois", impact: -150, color: "red" },
    { label: "Capsule wardrobe qualité", detail: "40€/mois", impact: +110, color: "green" }
  ]},
  { id: 8, emoji: "💊", titre: "Compléments alimentaires", choix: [
    { label: "Beaucoup de suppléments", detail: "80€/mois", impact: -80, color: "red" },
    { label: "Alimentation équilibrée", detail: "20€/mois", impact: +60, color: "green" }
  ]},
  { id: 9, emoji: "🍷", titre: "Sorties soirées", choix: [
    { label: "Bars & restaurants 2x/semaine", detail: "300€/mois", impact: -300, color: "red" },
    { label: "Soirées chez des amis", detail: "60€/mois", impact: +240, color: "green" }
  ]},
  { id: 10, emoji: "✈️", titre: "Vacances", choix: [
    { label: "Vols + hôtels tout inclus", detail: "4000€/an", impact: -333, color: "red" },
    { label: "Road trip & Airbnb", detail: "1500€/an", impact: +208, color: "green" }
  ]},
  { id: 11, emoji: "📚", titre: "Formation continue", choix: [
    { label: "Aucune formation", detail: "0€/mois (stagnation)", impact: -50, color: "red" },
    { label: "Livres + cours en ligne", detail: "30€/mois (+revenus)", impact: +120, color: "green" }
  ]},
  { id: 12, emoji: "🏠", titre: "Logement", choix: [
    { label: "Grand appart en centre-ville", detail: "1200€/mois", impact: -1200, color: "red" },
    { label: "Coloc ou banlieue proche", detail: "650€/mois", impact: +550, color: "green" }
  ]},
  { id: 13, emoji: "💳", titre: "Crédits conso", choix: [
    { label: "Achats à crédit revolving", detail: "+200€/mois d'intérêts", impact: -200, color: "red" },
    { label: "Payer comptant uniquement", detail: "0€ d'intérêts", impact: +200, color: "green" }
  ]},
  { id: 14, emoji: "🎮", titre: "Gaming & loisirs numériques", choix: [
    { label: "Jeux AAA + DLC chaque mois", detail: "80€/mois", impact: -80, color: "red" },
    { label: "Game pass partagé", detail: "5€/mois", impact: +75, color: "green" }
  ]},
  { id: 15, emoji: "🚿", titre: "Factures énergie", choix: [
    { label: "Pas d'effort particulier", detail: "200€/mois", impact: -200, color: "red" },
    { label: "Gestes éco + isolation", detail: "110€/mois", impact: +90, color: "green" }
  ]},
  { id: 16, emoji: "🐶", titre: "Animal de compagnie", choix: [
    { label: "Chien race + soins premium", detail: "250€/mois", impact: -250, color: "red" },
    { label: "Chat ou adoption", detail: "60€/mois", impact: +190, color: "green" }
  ]},
  { id: 17, emoji: "🎁", titre: "Cadeaux & occasions", choix: [
    { label: "Cadeaux coûteux pour tout le monde", detail: "150€/mois", impact: -150, color: "red" },
    { label: "Cadeaux personnalisés & faits maison", detail: "40€/mois", impact: +110, color: "green" }
  ]},
  { id: 18, emoji: "🚕", titre: "VTC & taxis", choix: [
    { label: "Uber régulier", detail: "120€/mois", impact: -120, color: "red" },
    { label: "Vélo + transport en commun", detail: "20€/mois", impact: +100, color: "green" }
  ]},
  { id: 19, emoji: "💼", titre: "Side hustle", choix: [
    { label: "Temps libre = repos total", detail: "0€/mois", impact: 0, color: "gray" },
    { label: "Freelance ou revente", detail: "+400€/mois", impact: +400, color: "green" }
  ]},
  { id: 20, emoji: "📊", titre: "Investissement", choix: [
    { label: "Livret A uniquement (1,5% réel)", detail: "100€/mois", impact: +100, color: "yellow" },
    { label: "ETF World (7% réel)", detail: "100€/mois", impact: +350, color: "green" }
  ]},
  { id: 21, emoji: "🍔", titre: "Alimentation", choix: [
    { label: "Plats préparés & livraison", detail: "400€/mois", impact: -400, color: "red" },
    { label: "Cuisine maison & marchés", detail: "200€/mois", impact: +200, color: "green" }
  ]},
  { id: 22, emoji: "💄", titre: "Beauté & bien-être", choix: [
    { label: "Spa, soins, instituts réguliers", detail: "200€/mois", impact: -200, color: "red" },
    { label: "Routine essentielle", detail: "40€/mois", impact: +160, color: "green" }
  ]},
  { id: 23, emoji: "🎓", titre: "Études des enfants", choix: [
    { label: "Pas d'épargne dédiée", detail: "0€/mois (dette future)", impact: -100, color: "red" },
    { label: "PEE dès la naissance", detail: "100€/mois", impact: +300, color: "green" }
  ]},
  { id: 24, emoji: "🛡️", titre: "Assurances", choix: [
    { label: "Minimum légal", detail: "pas de protection", impact: -200, color: "red" },
    { label: "Couverture optimisée", detail: "80€/mois bien choisi", impact: +120, color: "green" }
  ]},
  { id: 25, emoji: "🎰", titre: "Jeux d'argent", choix: [
    { label: "Loto & paris sportifs", detail: "50€/mois (perte nette)", impact: -50, color: "red" },
    { label: "Jamais de jeux d'argent", detail: "0€ de perte", impact: +50, color: "green" }
  ]},
  { id: 26, emoji: "🔧", titre: "Bricolage & réparation", choix: [
    { label: "Toujours faire appel à un pro", detail: "200€/mois", impact: -200, color: "red" },
    { label: "Apprendre & DIY", detail: "30€/mois", impact: +170, color: "green" }
  ]},
  { id: 27, emoji: "🌱", titre: "Retraite anticipée", choix: [
    { label: "Compter sur la retraite d'État", detail: "pas d'effort", impact: -150, color: "red" },
    { label: "PER + investissements", detail: "200€/mois", impact: +500, color: "green" }
  ]},
  { id: 28, emoji: "📰", titre: "Médias & presse", choix: [
    { label: "Nombreux abonnements presse", detail: "60€/mois", impact: -60, color: "red" },
    { label: "Sources gratuites sélectionnées", detail: "0€/mois", impact: +60, color: "green" }
  ]},
  { id: 29, emoji: "🏡", titre: "Résidence principale", choix: [
    { label: "Location à vie", detail: "loyer sans capital", impact: -200, color: "red" },
    { label: "Achat avec apport", detail: "capital croissant", impact: +300, color: "green" }
  ]},
  { id: 30, emoji: "🧠", titre: "Santé mentale & temps", choix: [
    { label: "Ignorer stress & burn-out", detail: "coût santé + arrêts", impact: -300, color: "red" },
    { label: "Investir dans son bien-être", detail: "productivité × 2", impact: +250, color: "green" }
  ]},
];

function fmtEur(n) {
  if (n === 0) return '0 €';
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' M€';
  if (abs >= 1_000) return Math.round(n / 1_000) + ' k€';
  return n.toLocaleString('fr-FR') + ' €';
}

function calcPatrimoine(fluxMensuel) {
  const p10 = fluxMensuel * 12 * 10 * Math.pow(1.05, 5);
  const p20 = fluxMensuel * 12 * 20 * Math.pow(1.07, 10);
  const p30 = fluxMensuel * 12 * 30 * Math.pow(1.07, 15);
  return { p10, p20, p30 };
}

function useAnimatedNumber(target, duration = 600) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);
  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    let raf;
    const step = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(start + diff * ease));
      if (p < 1) raf = requestAnimationFrame(step);
      else prevTarget.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function RainCoins() {
  return (
    <>
      {Array.from({ length: 18 }).map((_, i) => (
        <svg
          key={i}
          style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            left: `${Math.random() * 100}%`,
            top: '-40px',
            animation: `coinFall ${4 + Math.random() * 6}s linear ${Math.random() * 2}s infinite`,
            opacity: 0.6,
            zIndex: 0,
          }}
          viewBox="0 0 40 40"
        >
          <circle cx="20" cy="20" r="18" fill="var(--gold)" stroke="rgba(184,147,74,0.5)" strokeWidth="2" />
          <text x="20" y="26" textAnchor="middle" fontSize="20" fill="var(--bg)" fontWeight="bold">€</text>
        </svg>
      ))}
      <style>{`
        @keyframes coinFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </>
  );
}

function Confetti() {
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const vx = Math.cos(angle) * (100 + Math.random() * 200);
        const vy = Math.sin(angle) * (100 + Math.random() * 200) - 150;
        const duration = 2 + Math.random() * 1;
        return (
          <svg
            key={i}
            style={{
              position: 'fixed',
              width: '20px',
              height: '20px',
              left: '50%',
              top: '50%',
              pointerEvents: 'none',
              animation: `confettiBurst ${duration}s ease-out forwards`,
              '--tx': `${vx}px`,
              '--ty': `${vy}px`,
              zIndex: 9999,
            }}
            viewBox="0 0 20 20"
          >
            <rect x="2" y="2" width="16" height="16" fill="var(--gold)" />
          </svg>
        );
      })}
      <style>{`
        @keyframes confettiBurst {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
        }
      `}</style>
    </>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div style={{
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      padding: '16px',
      display: 'flex',
      gap: '4px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: i <= current ? 'var(--gold)' : 'var(--border)',
            animation: i === current ? 'segmentPulse 0.6s ease-in-out' : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes segmentPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

function PatrimoineCounter({ value }) {
  const animatedValue = useAnimatedNumber(value, 400);
  return (
    <div style={{
      background: 'rgba(184,147,74,0.1)',
      borderBottom: '1px solid var(--border-gold)',
      padding: '12px 16px',
      textAlign: 'center',
      fontSize: '14px',
      color: 'var(--text-secondary)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      Patrimoine estimé (30 ans) : <span style={{ fontWeight: 'bold', color: 'var(--gold)', fontSize: '18px' }}>{fmtEur(animatedValue)}</span>
    </div>
  );
}

function DecisionCard({ decision, state, onChoice, shake }) {
  const getColor = (colorName) => {
    switch (colorName) {
      case 'red': return '#ef4444';
      case 'green': return '#22c55e';
      case 'yellow': return '#eab308';
      default: return '#999';
    }
  };

  return (
    <div style={{
      padding: '24px',
      maxWidth: '600px',
      margin: '40px auto',
      animation: state === 'enter' ? 'slideInCard 0.25s ease-out forwards' : state === 'exit' ? 'slideOutCard 0.2s ease-in forwards' : 'none',
      transform: shake ? 'translateX(-5px)' : 'translateX(0)',
      transition: shake ? 'none' : 'transform 0.1s ease-out',
    }}>
      <style>{`
        @keyframes slideInCard {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutCard {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `}</style>

      <div style={{
        background: 'var(--card)',
        border: '2px solid var(--border)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{decision.emoji}</div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '32px',
          color: 'var(--text)',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {decision.titre}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr',
          gap: '16px',
          marginBottom: '0',
        }}>
          {decision.choix.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoice(idx, choice)}
              style={{
                padding: '16px',
                border: `2px solid ${getColor(choice.color)}`,
                background: 'var(--card)',
                color: 'var(--text)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                ':hover': {
                  background: 'var(--card-hover)',
                },
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--card-hover)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--card)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{choice.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{choice.detail}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImpactBadge({ amount, positive, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 9998,
      animation: 'impactFloat 0.8s ease-out forwards',
    }}>
      <style>{`
        @keyframes impactFloat {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -150px) scale(1.2); opacity: 0; }
        }
      `}</style>
      <div style={{
        padding: '12px 20px',
        borderRadius: '12px',
        background: positive ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '18px',
        fontFamily: "'DM Sans', sans-serif",
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}>
        {positive ? '+' : ''}{fmtEur(amount)}
      </div>
    </div>
  );
}

function ResultsScreen({ choices, fluxMensuel, onReplay }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const score = Math.round((choices.filter(c => c.impact > 0).length / 30) * 1000);
  const { p10, p20, p30 } = calcPatrimoine(fluxMensuel);
  const animatedScore = useAnimatedNumber(score, 1000);

  const getProfile = () => {
    if (score < 300) return { emoji: '🦗', name: 'Cigale Assumée', desc: 'Plutôt dépenses et spontanéité' };
    if (score < 600) return { emoji: '🌱', name: 'En Transition', desc: 'Vous équilibrez plaisir et épargne' };
    if (score < 800) return { emoji: '💡', name: 'Épargnant Avisé', desc: 'Stratégie financière cohérente' };
    return { emoji: '👑', name: 'Maître de ses Finances', desc: 'Excellence financière' };
  };

  const profile = getProfile();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      {showConfetti && <Confetti />}

      <h1 style={{
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: 'var(--text)',
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        Résultats
      </h1>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto 40px',
        padding: '32px',
        background: 'var(--card)',
        borderRadius: '16px',
        border: '2px solid var(--border-gold)',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>{profile.emoji}</div>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: 'var(--text)',
          marginBottom: '8px',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {profile.name}
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
        }}>
          {profile.desc}
        </p>

        <div style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color: 'var(--gold)',
          marginBottom: '8px',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {animatedScore}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>/ 1000</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr 1fr',
        gap: '24px',
        maxWidth: '900px',
        margin: '0 auto 40px',
      }}>
        {[
          { years: 10, value: p10, label: 'Après 10 ans' },
          { years: 20, value: p20, label: 'Après 20 ans' },
          { years: 30, value: p30, label: 'Après 30 ans' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: '24px',
              background: 'var(--card)',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              animation: `slideUpResult 0.5s ease-out ${i * 0.15}s backwards`,
            }}
          >
            <style>{`
              @keyframes slideUpResult {
                from { transform: translateY(40px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
              {item.label}
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'var(--gold)',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {fmtEur(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Meilleure / Pire décision */}
      {choices.length > 0 && (() => {
        const sorted = [...choices].sort((a, b) => b.impact - a.impact);
        const best = sorted[0];
        const worst = sorted[sorted.length - 1];
        const bestDec = DECISIONS.find(d => d.id === best.decisionId);
        const worstDec = DECISIONS.find(d => d.id === worst.decisionId);
        const bestChoix = bestDec?.choix[best.choixIndex];
        const worstChoix = worstDec?.choix[worst.choixIndex];
        return (
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr', gap: 16, maxWidth: 700, margin: '0 auto 40px' }}>
            <div style={{ padding: 20, background: 'rgba(34,197,94,0.08)', border: '2px solid rgba(34,197,94,0.35)', borderRadius: 12, textAlign: 'left' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>🏆 Meilleure décision</p>
              <p style={{ fontSize: 20, marginBottom: 4 }}>{bestDec?.emoji} {bestDec?.titre}</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>{bestChoix?.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>+{best.impact.toLocaleString('fr-FR')} €/mois</p>
            </div>
            <div style={{ padding: 20, background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.35)', borderRadius: 12, textAlign: 'left' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>💸 Décision la plus coûteuse</p>
              <p style={{ fontSize: 20, marginBottom: 4 }}>{worstDec?.emoji} {worstDec?.titre}</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>{worstChoix?.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{worst.impact.toLocaleString('fr-FR')} €/mois</p>
            </div>
          </div>
        );
      })()}

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <button
          onClick={onReplay}
          style={{
            padding: '14px 28px',
            background: 'var(--gold)',
            color: 'var(--bg)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Rejouer
        </button>
        <a
          href="https://www.mesimulateurs.fr"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '14px 28px',
            border: '2px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--text)',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--card-hover)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--card)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Voir les simulateurs
        </a>
      </div>
    </div>
  );
}

function TypewriterTitle() {
  const text = "Défi Richesse";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 style={{
      fontSize: '64px',
      fontWeight: 'bold',
      color: 'var(--gold)',
      marginBottom: '16px',
      fontFamily: "'Cormorant Garamond', serif",
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {displayText}
    </h1>
  );
}

export default function DefiRichesse() {
  const [theme] = useTheme();
  const [phase, setPhase] = useState('intro');
  const [currentDecision, setCurrentDecision] = useState(0);
  const [choices, setChoices] = useState([]);
  const [fluxMensuel, setFluxMensuel] = useState(0);
  const [playerCount, setPlayerCount] = useState(null);
  const [cardState, setCardState] = useState('enter');
  const [impactAnim, setImpactAnim] = useState(null);
  const [shakeCard, setShakeCard] = useState(false);

  const shakeTimer = useRef(null);
  const { p10, p20, p30 } = calcPatrimoine(fluxMensuel);
  const patrimoine30 = p30;

  useEffect(() => {
    track('view', { simulator: 'game-defi' });
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'game-defi' }),
    });

    fetch('/api/scores')
      .then(r => r.json())
      .then(data => {
        if (data['game-defi']) setPlayerCount(data['game-defi']);
      })
      .catch(() => {});
  }, []);

  const resetShakeTimer = () => {
    if (shakeTimer.current) clearTimeout(shakeTimer.current);
    setShakeCard(false);
    shakeTimer.current = setTimeout(() => setShakeCard(true), 10000);
  };

  useEffect(() => {
    if (phase === 'game') {
      resetShakeTimer();
    }
    return () => {
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
    };
  }, [phase, currentDecision]);

  const handleChoice = (choiceIdx, choice) => {
    setShakeCard(false);
    setCardState('exit');
    setImpactAnim({ amount: choice.impact, positive: choice.impact > 0 });

    const newChoices = [...choices, { decisionId: DECISIONS[currentDecision].id, choixIndex: choiceIdx, impact: choice.impact }];
    const newFlux = newChoices.reduce((sum, c) => sum + c.impact, 0);
    setChoices(newChoices);
    setFluxMensuel(newFlux);

    setTimeout(() => {
      if (currentDecision < 29) {
        setCurrentDecision(currentDecision + 1);
        setCardState('enter');
        setImpactAnim(null);
      } else {
        setPhase('results');
      }
    }, 200);
  };

  const handleReplay = () => {
    setPhase('intro');
    setCurrentDecision(0);
    setChoices([]);
    setFluxMensuel(0);
    setCardState('enter');
    setImpactAnim(null);
    setShakeCard(false);
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        * {
          transition: background-color 0.2s, color 0.2s;
        }
      `}</style>

      <Navbar />

      <div style={{ flex: 1 }}>
        {phase === 'intro' && (
          <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '40px 20px',
          }}>
            <RainCoins />

            <TypewriterTitle />

            <p style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              marginBottom: '32px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              30 décisions · 30 ans · Votre futur financier
            </p>

            {playerCount && (
              <p style={{
                fontSize: '16px',
                color: 'var(--gold)',
                marginBottom: '48px',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                🎮 {playerCount.toLocaleString('fr-FR')} joueurs ont déjà relevé le défi
              </p>
            )}

            <button
              onClick={() => {
                track('click', { action: 'start-game-defi' });
                setPhase('game');
              }}
              style={{
                padding: '16px 48px',
                background: 'var(--gold)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                animation: 'buttonPulse 2s ease-in-out infinite',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Commencer
            </button>

            <style>{`
              @keyframes buttonPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(184, 147, 74, 0.5); }
                50% { transform: scale(1.08); box-shadow: 0 0 40px rgba(184, 147, 74, 0.8); }
              }
            `}</style>
          </div>
        )}

        {phase === 'game' && (
          <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '40px' }}>
            <ProgressBar current={currentDecision} total={30} />
            <PatrimoineCounter value={patrimoine30} />

            <DecisionCard
              decision={DECISIONS[currentDecision]}
              state={cardState}
              onChoice={handleChoice}
              shake={shakeCard}
            />

            {impactAnim && (
              <ImpactBadge
                amount={impactAnim.amount}
                positive={impactAnim.positive}
                onComplete={() => setImpactAnim(null)}
              />
            )}
          </div>
        )}

        {phase === 'results' && (
          <ResultsScreen
            choices={choices}
            fluxMensuel={fluxMensuel}
            onReplay={handleReplay}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
