import { useTheme } from "../hooks/useTheme.js";
import { useTranslation } from "../i18n/index.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { LocaleLink } from "../lib/router.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const EMAIL = "contact@simfinly.com";

function Section({ title, children }) {
  return (
    <div style={{ paddingLeft: 20, borderLeft: "2px solid var(--border-gold)", marginBottom: 40 }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--gold)", marginBottom: 16 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{children}</div>
    </div>
  );
}

const CONTENT = {
  fr: {
    metaTitle: "Contact — simfinly.com",
    metaDesc: "Contactez l'équipe simfinly.com : question sur un simulateur, signalement d'erreur, partenariat ou presse. Réponse sous 48 h ouvrées à contact@simfinly.com.",
    h1: "Contactez",
    intro: "Une question sur un simulateur, une erreur à signaler, une idée d'amélioration ou une demande de partenariat ? Écrivez-nous, nous répondons généralement sous 48 h ouvrées.",
    emailTitle: "Par email",
    emailBody: "Pour toute demande, écrivez-nous à :",
    errorTitle: "Signaler une erreur ou suggérer une amélioration",
    errorBody: "Nos simulateurs s'appuient sur les barèmes officiels en vigueur, mais une erreur reste possible. Si un résultat vous semble incorrect, indiquez le simulateur concerné, les valeurs saisies et le résultat attendu : cela nous aide à corriger rapidement.",
    partnerTitle: "Partenariats, presse et widgets",
    partnerBody: "Vous souhaitez intégrer un de nos simulateurs sur votre site, citer nos données ou proposer une collaboration ? Décrivez votre projet dans votre message. Nos widgets embarquables sont présentés sur la page",
    partnerLinkLabel: "Widgets",
    dataTitle: "Données personnelles",
    dataBody: "Les simulations s'effectuent dans votre navigateur : nous ne conservons pas vos données de calcul. Pour toute question relative à la confidentialité, consultez notre",
    dataLinkLabel: "politique de confidentialité",
  },
  en: {
    metaTitle: "Contact — Simfinly",
    metaDesc: "Contact the simfinly.com team: questions about a calculator, error reports, partnership or press enquiries. We reply within 48 business hours at contact@simfinly.com.",
    h1: "Contact",
    intro: "A question about a calculator, an error to report, an improvement idea or a partnership enquiry? Write to us — we usually reply within 48 business hours.",
    emailTitle: "By email",
    emailBody: "For any enquiry, write to us at:",
    errorTitle: "Report an error or suggest an improvement",
    errorBody: "Our calculators rely on the official rates in force, but mistakes can happen. If a result looks wrong, tell us which calculator, the values you entered and the result you expected: it helps us fix things quickly.",
    partnerTitle: "Partnerships, press and widgets",
    partnerBody: "Want to embed one of our calculators on your site, quote our data or propose a collaboration? Describe your project in your message. Our embeddable widgets are presented on the",
    partnerLinkLabel: "Widgets page",
    dataTitle: "Personal data",
    dataBody: "Simulations run in your browser: we do not store your calculation data. For any privacy question, see our",
    dataLinkLabel: "privacy policy",
  },
};

export default function Contact() {
  const [theme, setTheme] = useTheme();
  const { locale } = useTranslation();
  const c = CONTENT[locale] || CONTENT.fr;

  usePageMeta(c.metaTitle, c.metaDesc);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 80px" }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", marginBottom: 20 }}>
          {c.h1} <em style={{ fontStyle: "italic", color: "var(--gold)" }}>simfinly.com</em>
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 48 }}>{c.intro}</p>

        <Section title={c.emailTitle}>
          <p>{c.emailBody}</p>
          <a href={`mailto:${EMAIL}`} style={{ color: "var(--gold)", fontWeight: 600, fontSize: 18, textDecoration: "none", display: "inline-block", marginTop: 10 }}>
            {EMAIL}
          </a>
        </Section>

        <Section title={c.errorTitle}>
          <p>{c.errorBody}</p>
        </Section>

        <Section title={c.partnerTitle}>
          <p>
            {c.partnerBody}{" "}
            <LocaleLink to="/widgets" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>{c.partnerLinkLabel}</LocaleLink>.
          </p>
        </Section>

        <Section title={c.dataTitle}>
          <p>
            {c.dataBody}{" "}
            <LocaleLink to="/politique-de-confidentialite" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>{c.dataLinkLabel}</LocaleLink>.
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
