import type { Reponses } from './types';
import type { ResultatRechercheEntreprise } from './rechercheEntreprises';

/**
 * Fiche « locale » : quand l'enregistrement en base échoue, les réponses ne sont
 * plus mises dans l'URL (/fiche/local?d=… exposait RQTH, nationalité, dettes dans
 * l'historique, les journaux et les en-têtes Referer).
 *
 * À la place :
 * - sessionStorage (onglet courant uniquement) garde { siret, reponses } ;
 * - un cookie court (1 h, SameSite=Strict, limité au chemin /fiche/local) transmet
 *   ces données au rendu serveur de /fiche/local, sans paramètre d'URL.
 *
 * Ce module est utilisable côté navigateur (pas de zod) ; la validation est
 * faite côté serveur dans lib/ficheLocaleServeur.ts.
 */
export const CLE_FICHE_LOCALE = 'solelis_fiche_locale';

/** Durée de vie du cookie (secondes). */
export const DUREE_COOKIE_FICHE_LOCALE = 60 * 60;

/** Taille maximale de la valeur du cookie (les navigateurs refusent au-delà de ~4 Ko). */
export const TAILLE_MAX_COOKIE_FICHE_LOCALE = 3800;

export interface FicheLocaleData {
  siret: string;
  reponses: Reponses;
  /**
   * Entreprise trouvée par le navigateur (lib/rechercheEntreprises.ts) :
   * repli si la recherche serveur échoue. Facultatif.
   */
  entreprise?: ResultatRechercheEntreprise;
}

/** Valeur encodée du cookie ; sans `entreprise` si elle ferait dépasser la taille permise. */
export function valeurCookieFicheLocale(data: FicheLocaleData): string {
  const complete = encodeURIComponent(JSON.stringify(data));
  if (complete.length <= TAILLE_MAX_COOKIE_FICHE_LOCALE || !data.entreprise) return complete;
  return encodeURIComponent(JSON.stringify({ siret: data.siret, reponses: data.reponses }));
}

/** Côté navigateur : pose le cookie lu par le rendu serveur de /fiche/local. */
export function poserCookieFicheLocale(data: FicheLocaleData): void {
  const securise = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CLE_FICHE_LOCALE}=${valeurCookieFicheLocale(data)}; Path=/fiche/local; Max-Age=${DUREE_COOKIE_FICHE_LOCALE}; SameSite=Strict${securise}`;
}

/** Côté navigateur : mémorise la fiche locale (sessionStorage + cookie). */
export function enregistrerFicheLocale(data: FicheLocaleData): void {
  try {
    sessionStorage.setItem(CLE_FICHE_LOCALE, JSON.stringify(data));
  } catch {}
  try {
    poserCookieFicheLocale(data);
  } catch {}
}
