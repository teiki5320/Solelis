import type { Metadata } from 'next';

/**
 * Métadonnées d'une page introuvable (404) : même titre d'onglet partout,
 * y compris quand une route dynamique (/situation/[slug], /faq/[situation],
 * /courriers/[slug]…) reçoit un identifiant inconnu.
 */
export const META_PAGE_INTROUVABLE: Metadata = {
  title: 'Page introuvable — Solelis',
  robots: { index: false, follow: true },
};

export type OgCat = 'outil' | 'courrier' | 'procedure' | 'situation' | 'aide' | 'faq' | 'defaut';

/**
 * Construit les métadonnées OpenGraph + Twitter pour une page, en
 * pointant vers l'image OG dynamique (/api/og) avec un titre, un
 * sous-titre et une couleur d'accent par catégorie.
 *
 * Usage dans une page : `export const metadata = ogMeta({ titre: '…', sous: '…', cat: 'outil' })`
 * — fusionne titre/description de la page avec l'image dynamique.
 *
 * `chemin` (optionnel, ex. '/courriers/echelonnement-urssaf') : ajoute
 * og:url et l'URL canonique de la page (résolues sur metadataBase,
 * https://solelis.com, défini dans app/layout.tsx).
 */
export function ogMeta(opts: {
  titre: string;
  description: string;
  sous?: string;
  cat?: OgCat;
  pageTitle?: string;
  chemin?: string;
}): Metadata {
  const params = new URLSearchParams({ titre: opts.titre });
  if (opts.sous) params.set('sous', opts.sous);
  if (opts.cat) params.set('cat', opts.cat);
  const ogUrl = `/api/og?${params.toString()}`;

  return {
    title: opts.pageTitle ?? `${opts.titre} — Solelis`,
    description: opts.description,
    ...(opts.chemin ? { alternates: { canonical: opts.chemin } } : {}),
    openGraph: {
      title: opts.titre,
      description: opts.description,
      type: 'article',
      siteName: 'Solelis',
      locale: 'fr_FR',
      ...(opts.chemin ? { url: opts.chemin } : {}),
      images: [{ url: ogUrl, width: 1200, height: 630, alt: opts.titre }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.titre,
      description: opts.description,
      images: [ogUrl],
    },
  };
}
