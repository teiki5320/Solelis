/**
 * Illustrations des conseils et des guides (pages situation) : une image par page, copiée dans le dépôt
 * (public/illustrations/…, WebP) par scripts/illustrations.mjs, avec son crédit dans data/illustrations.json.
 * Clés : `conseil:<slug>` et `situation:<slug>`. Une page sans entrée s'affiche simplement sans image.
 */
import donnees from '@/data/illustrations.json';

export interface Illustration {
  /** Chemin public de l'image (WebP 1200 × 675). */
  fichier: string;
  source: 'wikimedia' | 'openverse' | 'carte';
  /** Auteur de la photo (« Solelis » pour une carte générée). */
  credit: string;
  licence: string | null;
  /** Page d'origine de la photo, pour l'attribution. */
  page: string | null;
  alt: string;
  /** Adresse d'origine : sert à ne jamais utiliser deux fois la même image. */
  origine: string;
  largeur: number;
  hauteur: number;
}

export const ILLUSTRATIONS = donnees as Record<string, Illustration>;

export function illustrationDe(cle: string): Illustration | null {
  return ILLUSTRATIONS[cle] ?? null;
}
