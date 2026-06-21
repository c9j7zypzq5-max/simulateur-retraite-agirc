// Pilote « icônes vs emojis » : jeu d'icônes Lucide (SVG cohérent, rendu
// identique sur tous les OS) associé à chaque simulateur. Couleur = currentColor
// → l'icône hérite de la couleur du conteneur.
import {
  Trophy, Landmark, Scale, Briefcase, Building, Building2, CalendarClock,
  Stethoscope, Wheat, Coins, KeyRound, Receipt, TrendingUp, PieChart, Wallet,
  PiggyBank, Flame, Gem, BarChart3, Clock, CalendarDays, Shield, CreditCard,
  Calculator, QrCode, ScrollText, Users, Gavel, Euro, Award, Gift, Hourglass,
  HandCoins, Home,
} from "lucide-react";

const MAP = {
  "/simulateurs/agirc-arrco": Trophy,
  "/simulateurs/cnav": Landmark,
  "/simulateurs/fonction-publique": Scale,
  "/simulateurs/independants": Briefcase,
  "/simulateurs/ircantec": Building,
  "/simulateurs/retraite-progressive": CalendarClock,
  "/simulateurs/cnavpl": Stethoscope,
  "/simulateurs/msa": Wheat,
  "/simulateurs/per": Coins,
  "/simulateurs/emprunt-immobilier": Building2,
  "/simulateurs/rendement-locatif": KeyRound,
  "/simulateurs/ptz": Landmark,
  "/simulateurs/impot-revenu": Receipt,
  "/simulateurs/plus-value-immobiliere": TrendingUp,
  "/simulateurs/budget": PieChart,
  "/simulateurs/salaire": Wallet,
  "/simulateurs/epargne": PiggyBank,
  "/simulateurs/fire": Flame,
  "/simulateurs/patrimoine": Gem,
  "/simulateurs/comparateur": BarChart3,
  "/simulateurs/cout-en-heures": Clock,
  "/simulateurs/vie-en-semaines": CalendarDays,
  "/simulateurs/assurance-vie": Shield,
  "/simulateurs/credit-conso": CreditCard,
  "/simulateurs/succession": ScrollText,
  "/simulateurs/divorce": Gavel,
  "/simulateurs/freelance-vs-salarie": Users,
  "/outils/qr-code": QrCode,
  "/simulateurs/retraite-anticipee": Hourglass,
  "/simulateurs/donation": Gift,
  "/simulateurs/epargne-salariale": HandCoins,
  "/simulateurs/deficit-foncier": Home,
  // Simulateurs belges
  "/simulateurs/pension-legale": Award,
  "/simulateurs/impot-revenu-be": Euro,
};

export default function SimIcon({ path, size = 22, strokeWidth = 1.6 }) {
  const Icon = MAP[path] || Calculator;
  return <Icon size={size} strokeWidth={strokeWidth} color="currentColor" aria-hidden="true" />;
}
