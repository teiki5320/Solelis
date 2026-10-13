/**
 * Rubrique « Conseils » : articles écrits en Markdown dans content/conseils/<slug>.md,
 * convertis au build par scripts/generer-conseils.ts (voir content/conseils/README.md).
 *
 * Ce fichier ne contient que des types et une constante : il est importé aussi bien
 * par le script de build (Node, sans Next) que par les pages.
 */

export const THEMES_CONSEILS = ['dettes', 'procedures', 'dirigeant', 'salaries', 'aides'] as const;
export type ThemeConseil = (typeof THEMES_CONSEILS)[number];

export interface SourceConseil {
  titre: string;
  /** Adresse https de la source officielle. */
  url: string;
}

/** Lien interne affiché dans « À voir aussi ». */
export interface LienConseil {
  href: string;
  libelle: string;
  /** Slug de l'article visé quand le lien pointe vers /conseils/<slug> (masqué tant qu'il n'est pas publié). */
  conseil?: string;
}

/** Article prêt à afficher : tout est calculé au build, la requête ne fait que filtrer. */
export interface Conseil {
  slug: string;
  title: string;
  description: string;
  /** Date de publication AAAA-MM-JJ (heure de Paris) : invisible avant ce jour. */
  date: string;
  miseAJour: string;
  /** Mêmes dates au format ISO avec fuseau (minuit à Paris), pour JSON-LD et RSS. */
  publieLe: string;
  modifieLe: string;
  /** Mêmes dates en toutes lettres (« 12 octobre 2026 »). */
  dateLisible: string;
  miseAJourLisible: string;
  theme: ThemeConseil;
  resume: string;
  sources: SourceConseil[];
  liens: LienConseil[];
  /** true : jamais publié, quelle que soit la date. */
  brouillon: boolean;
  /** Corps de l'article déjà converti en HTML sûr. */
  html: string;
  /** Slugs des articles cités par un lien dans le corps (liens retirés tant qu'ils ne sont pas publiés). */
  conseilsCites: string[];
}
