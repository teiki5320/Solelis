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

/** Au-delà, Google coupe le titre dans ses résultats (« … »). */
export const TITRE_MAX = 65;
/** Au-delà, Google coupe la description dans ses résultats. */
export const DESCRIPTION_MAX = 160;

/**
 * Titre d'onglet et de résultat Google : « — Solelis » n'est ajouté que s'il tient dans
 * TITRE_MAX caractères ; sinon, le titre seul. S'il reste trop long, les précisions entre
 * parenthèses sont retirées (« Saisine de la CCSF (échelonnement…) » → « Saisine de la CCSF »).
 */
export function titrePage(titre: string): string {
  const base = titre.replace(/ — Solelis$/, '');
  const avecMarque = `${base} — Solelis`;
  if (avecMarque.length <= TITRE_MAX) return avecMarque;
  if (base.length <= TITRE_MAX) return base;
  const sansParentheses = base.replace(/\s*\([^)]*\)/g, '').replace(/\s{2,}/g, ' ').trim();
  return sansParentheses.length < base.length ? titrePage(sansParentheses) : base;
}

/** Description de résultat Google : coupée au dernier mot entier avant DESCRIPTION_MAX, avec « … ». */
export function descriptionPage(texte: string): string {
  const t = texte.replace(/\s+/g, ' ').trim();
  if (t.length <= DESCRIPTION_MAX) return t;
  const coupe = t.slice(0, DESCRIPTION_MAX - 1);
  const dernierEspace = coupe.lastIndexOf(' ');
  return `${(dernierEspace > 80 ? coupe.slice(0, dernierEspace) : coupe).replace(/[\s,;:.(«—–-]+$/, '')}…`;
}

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
    title: titrePage(opts.pageTitle ?? opts.titre),
    description: descriptionPage(opts.description),
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
