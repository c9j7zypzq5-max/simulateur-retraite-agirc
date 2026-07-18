// Pages légales du builder (app.simfinly.com) : mentions légales et politique
// de confidentialité. Le builder N'EST PAS le site principal : il stocke des
// données (comptes, calculateurs, soumissions/leads, vues) dans Supabase — ces
// pages décrivent donc ce traitement réel, pas le « tout côté navigateur » du
// site simfinly.com. Contenu bilingue inline (même pattern que les pages
// légales du site principal), sélectionné par la locale courante.

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getLocale } from '../i18n';
import { usePageMeta } from './seo';
import { Header, Footer } from './Chrome';

const CONTACT = 'contact@simfinly.com';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, margin: '0 0 10px' }}>{title}</h2>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 64px' }}>
        <Link to="/" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>← Simfinly Builder</Link>
        <h1 style={{ fontSize: 28, margin: '12px 0 24px' }}>{title}</h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}

// --- Mentions légales -------------------------------------------------------

export function MentionsLegales() {
  const en = getLocale() === 'en';
  usePageMeta(
    en ? 'Legal notice' : 'Mentions légales',
    en ? 'Legal notice for Simfinly Builder (app.simfinly.com): publisher, host, data.' : 'Mentions légales de Simfinly Builder (app.simfinly.com) : éditeur, hébergeur, données.',
    '/mentions-legales',
  );

  if (en) {
    return (
      <Page title="Legal notice">
        <Section title="Publisher">
          <p><strong>Adrian Farago</strong> — private individual.<br />Contact: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
          <p style={{ marginTop: 12 }}>Simfinly Builder (app.simfinly.com) lets users create, publish and embed calculators and financial simulators.</p>
        </Section>
        <Section title="Host">
          <p><strong>Vercel Inc.</strong> — 340 Pine Street, Suite 701, San Francisco, CA 94104, United States — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
        </Section>
        <Section title="Database & authentication">
          <p><strong>Supabase</strong> (Supabase Inc.), hosting region European Union (Paris, eu-west-3). Provides account authentication and stores the calculators, submissions and usage statistics. — <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a></p>
        </Section>
        <Section title="Intellectual property">
          <p>The interface, source code and design of Simfinly Builder are the property of the publisher. Calculators created by users remain their own. Reproduction of the platform itself is prohibited without prior written consent.</p>
        </Section>
        <Section title="Liability">
          <p>Calculators and simulations are indicative estimates and do not constitute financial, tax or legal advice. The publisher cannot be held liable for results produced by calculators created by users, nor for direct or indirect damage arising from use of the service.</p>
        </Section>
        <Section title="Privacy">
          <p>See the <Link to="/confidentialite">privacy policy</Link>.</p>
        </Section>
      </Page>
    );
  }

  return (
    <Page title="Mentions légales">
      <Section title="Éditeur">
        <p><strong>Adrian Farago</strong> — particulier.<br />Contact : <a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
        <p style={{ marginTop: 12 }}>Simfinly Builder (app.simfinly.com) permet de créer, publier et intégrer des calculateurs et simulateurs financiers.</p>
      </Section>
      <Section title="Hébergeur">
        <p><strong>Vercel Inc.</strong> — 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis — <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
      </Section>
      <Section title="Base de données & authentification">
        <p><strong>Supabase</strong> (Supabase Inc.), région d'hébergement Union européenne (Paris, eu-west-3). Assure l'authentification des comptes et stocke les calculateurs, les soumissions et les statistiques d'usage. — <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a></p>
      </Section>
      <Section title="Propriété intellectuelle">
        <p>L'interface, le code source et le design de Simfinly Builder sont la propriété de l'éditeur. Les calculateurs créés par les utilisateurs restent les leurs. Toute reproduction de la plateforme elle-même est interdite sans autorisation écrite préalable.</p>
      </Section>
      <Section title="Responsabilité">
        <p>Les calculateurs et simulations sont des estimations indicatives et ne constituent pas des conseils financiers, fiscaux ou juridiques. L'éditeur ne peut être tenu responsable des résultats produits par les calculateurs créés par les utilisateurs, ni des dommages directs ou indirects résultant de l'utilisation du service.</p>
      </Section>
      <Section title="Confidentialité">
        <p>Voir la <Link to="/confidentialite">politique de confidentialité</Link>.</p>
      </Section>
    </Page>
  );
}

// --- Politique de confidentialité -------------------------------------------

export function Confidentialite() {
  const en = getLocale() === 'en';
  usePageMeta(
    en ? 'Privacy policy' : 'Politique de confidentialité',
    en ? 'How Simfinly Builder handles your data: account, calculators, leads, analytics (GDPR).' : 'Comment Simfinly Builder traite vos données : compte, calculateurs, leads, analytics (RGPD).',
    '/confidentialite',
  );

  if (en) {
    return (
      <Page title="Privacy policy">
        <Section title="Data we process">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Account</strong>: your email address and password (managed by Supabase Auth) to sign you in.</li>
            <li><strong>Calculators</strong>: the content you create (fields, formulas, theme).</li>
            <li><strong>Submissions</strong>: data entered by visitors of your published calculators, including their email address when you enable email capture.</li>
            <li><strong>Usage statistics</strong>: page views and referrer of each published calculator (no advertising cookies, no cross-site tracking).</li>
          </ul>
        </Section>
        <Section title="Controller and processor">
          <p>For your account, the publisher is the data controller. For the leads collected through your published calculators, <strong>you</strong> (the calculator's author) are the data controller and Simfinly acts as a processor: you are responsible for informing your visitors and obtaining their consent. An explicit consent checkbox is shown before any email capture.</p>
        </Section>
        <Section title="Hosting & sub-processors">
          <p>Data is stored on <strong>Supabase</strong> in the European Union (Paris). The application is served by <strong>Vercel</strong>. Transactional emails, when enabled, are sent through an email provider.</p>
        </Section>
        <Section title="Retention">
          <p>Account and calculator data are kept as long as your account exists. You can delete everything at any time from your dashboard (“Delete my account”), which permanently erases your account, calculators and submissions.</p>
        </Section>
        <Section title="Your rights (GDPR)">
          <p>You have the right to access, rectify, erase and port your data, and to object to processing. Self-service deletion is available in the dashboard; for any other request, contact <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
        </Section>
        <Section title="Cookies">
          <p>Simfinly Builder uses only the technical storage required to keep you signed in and to remember your language preference. No advertising or third-party tracking cookies.</p>
        </Section>
      </Page>
    );
  }

  return (
    <Page title="Politique de confidentialité">
      <Section title="Données traitées">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li><strong>Compte</strong> : votre adresse email et votre mot de passe (gérés par Supabase Auth) pour vous connecter.</li>
          <li><strong>Calculateurs</strong> : le contenu que vous créez (champs, formules, thème).</li>
          <li><strong>Soumissions</strong> : les données saisies par les visiteurs de vos calculateurs publiés, y compris leur adresse email lorsque vous activez la capture d'email.</li>
          <li><strong>Statistiques d'usage</strong> : vues et référent de chaque calculateur publié (aucun cookie publicitaire, aucun pistage inter-sites).</li>
        </ul>
      </Section>
      <Section title="Responsable et sous-traitant">
        <p>Pour votre compte, l'éditeur est responsable de traitement. Pour les leads collectés via vos calculateurs publiés, <strong>vous</strong> (l'auteur du calculateur) êtes responsable de traitement et Simfinly agit comme sous-traitant : il vous revient d'informer vos visiteurs et de recueillir leur consentement. Une case de consentement explicite est affichée avant toute capture d'email.</p>
      </Section>
      <Section title="Hébergement & sous-traitants">
        <p>Les données sont stockées chez <strong>Supabase</strong>, dans l'Union européenne (Paris). L'application est servie par <strong>Vercel</strong>. Les emails transactionnels, lorsqu'ils sont activés, sont envoyés via un prestataire d'emailing.</p>
      </Section>
      <Section title="Conservation">
        <p>Les données de compte et de calculateurs sont conservées tant que votre compte existe. Vous pouvez tout supprimer à tout moment depuis votre tableau de bord (« Supprimer mon compte »), ce qui efface définitivement votre compte, vos calculateurs et vos soumissions.</p>
      </Section>
      <Section title="Vos droits (RGPD)">
        <p>Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données, et d'un droit d'opposition. La suppression en libre-service est disponible dans le tableau de bord ; pour toute autre demande, écrivez à <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
      </Section>
      <Section title="Cookies">
        <p>Simfinly Builder n'utilise que le stockage technique nécessaire pour vous garder connecté et mémoriser votre préférence de langue. Aucun cookie publicitaire ni de pistage tiers.</p>
      </Section>
    </Page>
  );
}
