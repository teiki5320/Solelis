import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import Nav from '@/components/Nav';
import Compteur from '@/components/Compteur';
import LazyMotionProvider from '@/components/LazyMotionProvider';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Solelis — Aide aux chefs d\'entreprise',
  description:
    'Solelis accompagne les chefs d\'entreprise français en difficulté — avec tact, avec clarté, avec les bons interlocuteurs.',
  metadataBase: new URL('https://solelis.com'),
  // N'envoie que l'origine (https://solelis.com) comme « referrer », même
  // entre pages du site : l'adresse d'une fiche (/fiche/<token>) est son
  // secret d'accès et ne doit fuiter ni vers la mesure d'audience ni ailleurs.
  referrer: 'strict-origin',
  // Google Discover : autorise l'aperçu en grande image (pages qui ne
  // définissent pas leur propre « robots »).
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  // Ni title, ni description, ni url ici : Next.js reprend alors le titre et
  // la description de CHAQUE page pour og:title / twitter:title (au lieu de
  // « Solelis » partout), et aucune page n'annonce l'URL de l'accueil.
  openGraph: {
    type: 'website',
    siteName: 'Solelis',
    locale: 'fr_FR',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Solelis — Aide aux chefs d\'entreprise en difficulté' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://solelis.com/#organisation',
      name: 'Solelis',
      url: 'https://solelis.com',
      logo: 'https://solelis.com/icons/icon-512.png',
      description:
        'Plateforme d\'aide aux chefs d\'entreprise en difficulté en France',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://solelis.com/#site',
      name: 'Solelis',
      url: 'https://solelis.com',
      inLanguage: 'fr-FR',
      publisher: { '@id': 'https://solelis.com/#organisation' },
    },
  ],
};

// Mesure d'audience Plausible en mode « manuel » : l'adresse envoyée est
// nettoyée — chemin seul, sans paramètres (?siret=, ?d=…), et /fiche/<token>
// devient /fiche/[token] (le token est le secret d'accès à la fiche).
// Les changements de page côté client (pushState) sont suivis ici.
const PLAUSIBLE_INIT = `window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};(function(){var d;function v(){var p=location.pathname.replace(/^\\/fiche\\/[^/]+/,'/fiche/[token]');var u=location.origin+p;if(u===d)return;d=u;window.plausible('pageview',{u:u})}var h=history,a=h.pushState,b=h.replaceState;h.pushState=function(){a.apply(h,arguments);v()};h.replaceState=function(){b.apply(h,arguments);v()};window.addEventListener('popstate',v);v()})();`;

const PIED_DE_PAGE = [
  { href: '/conseils', label: 'Conseils' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/parler', label: 'Parler à quelqu\'un' },
  { href: '/temoignages', label: 'Exemples de parcours' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-donnees', label: 'RGPD' },
  { href: '/accessibilite', label: 'Accessibilité' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning : le script anti-FOUC ci-dessous pose
    // data-theme sur <html> avant l'hydratation (attendu, pas une erreur).
    <html lang="fr" className={`${playfair.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        {/* Applique le thème enregistré avant le rendu (anti-FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('solelis_theme');if(t==='sombre')document.documentElement.setAttribute('data-theme','dark');else if(t==='contraste')document.documentElement.setAttribute('data-theme','contrast');}catch(e){}})();`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        {/* Nouvelle adresse d'icône : oblige Google à abandonner l'ancien favicon AVELOR gardé en cache. */}
        <link rel="icon" href="/icons/solelis-favicon-96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#1E3D82" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <>
            <script
              defer
              data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
              src="https://plausible.io/js/script.manual.js"
            />
            <script dangerouslySetInnerHTML={{ __html: PLAUSIBLE_INIT }} />
          </>
        )}
      </head>
      <body>
        <ServiceWorkerRegister />
        <LazyMotionProvider>
        <Background />
        <Nav />
        <main id="contenu-principal" className="relative min-h-screen pt-20 sm:pt-24">{children}</main>
        <footer className="relative mt-24 space-y-2 pb-10 text-center text-xs text-navy/50">
          <p className="font-display text-sm tracking-wide">Solelis</p>
          <p>Accompagnement gratuit · confidentiel · sans jugement</p>
          <Compteur />
          {/* Liens : zone cliquable d'au moins 44 px de haut (cible tactile). */}
          <div className="flex flex-wrap justify-center gap-x-3 text-navy/55">
            {PIED_DE_PAGE.map((l) => (
              <a key={l.href} href={l.href} className="inline-flex min-h-11 items-center px-1 hover:text-navy/70">
                {l.label}
              </a>
            ))}
          </div>
        </footer>
        </LazyMotionProvider>
      </body>
    </html>
  );
}
