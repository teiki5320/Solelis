import { ficheLocaleSchema } from './schemas';
import type { FicheLocaleData } from './ficheLocale';
import type { Reponses } from './types';

/** Valide des données de fiche locale venues du client (cookie, sessionStorage, ancien ?d=). */
export function validerFicheLocale(brut: unknown): FicheLocaleData | null {
  if (!brut || typeof brut !== 'object') return null;
  const objet = brut as { siret?: unknown; reponses?: unknown; entreprise?: unknown };
  const siret = String(objet.siret ?? '').replace(/\D/g, '');
  const res = ficheLocaleSchema.safeParse({ siret, reponses: objet.reponses, entreprise: objet.entreprise });
  if (!res.success) return null;
  // Entreprise trouvée par le navigateur : ignorée si mal formée (voir le schéma).
  return {
    siret: res.data.siret,
    reponses: res.data.reponses as Reponses,
    ...(res.data.entreprise ? { entreprise: res.data.entreprise } : {}),
  };
}

/** Lit la valeur (encodée) du cookie de fiche locale. */
export function lireCookieFicheLocale(valeur: string | undefined): FicheLocaleData | null {
  if (!valeur) return null;
  try {
    return validerFicheLocale(JSON.parse(decodeURIComponent(valeur)));
  } catch {
    return null;
  }
}

/** Ancien format /fiche/local?d=<base64 JSON> : toujours lisible pour les liens existants. */
export function lireParametreD(d: string | undefined): FicheLocaleData | null {
  if (!d || d.length > 20_000) return null;
  try {
    // Un « + » du base64 non encodé dans l'URL est relu comme une espace.
    const json = JSON.parse(Buffer.from(d.replace(/ /g, '+'), 'base64').toString('utf8'));
    return validerFicheLocale(json);
  } catch {
    return null;
  }
}

