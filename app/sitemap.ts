import type { MetadataRoute } from 'next';
import { COURRIERS } from '@/lib/courriers';
import { entreesSitemapConseils } from '@/lib/conseils';

// Rendu à la requête : les articles « Conseils » programmés y entrent le jour de
// leur publication (heure de Paris) sans redéploiement. Coût : un filtre de dates
// et une centaine de lignes XML.
export const dynamic = 'force-dynamic';

// Date de dernière mise à jour des contenus, fixe : un lastmod qui change à
// chaque build (ou requête) sans changement réel fait perdre sa valeur au
// signal pour les moteurs. À avancer lors d'une mise à jour de contenu.
const DERNIERE_MAJ = new Date('2026-10-10');

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
      lastModified: DERNIERE_MAJ,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.8,
    })),
    // /conseils et les articles publiés ce jour, lastmod = date de mise à jour de l'article.
    ...entreesSitemapConseils(),
  ];
}
