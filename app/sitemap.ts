import type { MetadataRoute } from 'next';
import { COURRIERS } from '@/lib/courriers';
import { entreesSitemapConseils } from '@/lib/conseils';
import { ARTICLES_VEILLE, GENERE_LE_VEILLE } from '@/lib/veille-articles.generated';
import { DATES_PAGES } from '@/lib/dates-pages.generated';

// Rendu à la requête : les articles « Conseils » programmés y entrent le jour de
// leur publication (heure de Paris) sans redéploiement. Coût : un filtre de dates
// et une centaine de lignes XML.
export const dynamic = 'force-dynamic';

// lastmod = dernière modification réelle de la page (historique git, scripts/dates-pages.ts) :
// un lastmod qui change à chaque build sans changement réel ferait perdre sa valeur au signal.
// Date fixe de repli si l'historique n'est pas disponible (clone superficiel).
const DERNIERE_MAJ = new Date('2026-10-10');

/** Date de la page, ou de son motif (`/courriers/[slug]`), sinon la date de repli. */
function datePage(route: string): Date {
  const motif = route.replace(/^(\/(?:courriers|situation|faq))\/[^/]+$/, (_, d: string) => `${d}/${d === '/faq' ? '[situation]' : '[slug]'}`);
  const iso = DATES_PAGES[route] ?? DATES_PAGES[motif];
  return iso ? new Date(iso) : DERNIERE_MAJ;
}

/** /actus change 2 fois par jour : date du fichier des actus lu au build. */
function dateActus(): Date {
  const d = GENERE_LE_VEILLE ? new Date(GENERE_LE_VEILLE) : null;
  return d && !Number.isNaN(d.getTime()) ? d : datePage('/actus');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://solelis.com';

  const routes = [
    '/',
    '/actus',
    '/aides',
    '/aides-personnelles',
    '/glossaire',
    '/parler',
    '/procedures',
    '/proches',
    '/proteger-famille',
    '/rebond',
    '/temoignages',
    '/vendre',
    '/confidentialite',
    '/situation',
    '/situation/dettes-urssaf',
    '/situation/dettes-fournisseurs',
    '/situation/credit-bancaire',
    '/situation/impots-impayes',
    '/outils',
    '/outils/acre-arce',
    '/outils/aide-juridictionnelle',
    '/outils/ati',
    '/outils/calendrier-fiscal',
    '/outils/cout-procedures',
    '/outils/data-room',
    '/outils/licenciement',
    '/outils/prescription',
    '/outils/valorisation',
    '/outils/stocks',
    '/annuaires',
    '/annuaires/ags',
    '/annuaires/tae',
    '/annuaires/mandataires',
    '/annuaires/cip',
    '/courriers',
    '/accompagnant',
    '/faq',
    '/faq/urssaf-impayee',
    '/faq/pge-en-difficulte',
    '/faq/assignation-tribunal',
    '/faq/caution-personnelle',
    '/faq/cessation-paiements',
    '/faq/rebondir-apres-liquidation',
    '/outils/seuils-effectif',
    '/mentions-legales',
    '/politique-donnees',
    '/procedures-comparaison',
    '/obligations-dirigeant',
    '/mediation-vs-conciliation',
    '/accessibilite',
    '/penalites-fiscales',
    '/dettes-fiscales-sociales',
    '/ciri-codefi',
    '/residence-principale-insaisissable',
    ...COURRIERS.map((c) => `/courriers/${c.slug}`),
  ];

  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      lastModified: route === '/actus' ? dateActus() : datePage(route),
      changeFrequency: route === '/actus' ? ('daily' as const) : route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.8,
    })),
    // /conseils et les articles publiés ce jour, lastmod = date de mise à jour de l'article.
    ...entreesSitemapConseils(),
    // Articles complets des actus construits avec ce déploiement (la page de secours n'y est jamais).
    ...ARTICLES_VEILLE.map((a) => ({
      url: `${base}/actus/${a.slug}`,
      lastModified: new Date(a.redige_le),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
