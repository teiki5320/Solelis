import { fetchWithTimeout } from './fetchTimeout';
import type { PlaceResult } from './types';

/* ---------- Places API (New) — Text Search ---------- */
// https://developers.google.com/maps/documentation/places/web-service/text-search
// L'ancienne API (maps/api/place/textsearch) n'est plus ouverte aux nouveaux projets Google.

interface PlaceNew {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
  googleMapsUri?: string;
}

interface TextSearchResponse {
  places?: PlaceNew[];
  error?: { code?: number; status?: string; message?: string };
}

const URL_TEXT_SEARCH = 'https://places.googleapis.com/v1/places:searchText';

// Champs demandés (la facturation Google dépend de cette liste : la garder courte).
const CHAMPS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.nationalPhoneNumber',
  'places.googleMapsUri',
].join(',');

interface SearchOptions {
  query: string;
  limit?: number;
  /**
   * Type de lieu (« Table A » de Google, ex. « lawyer ») : biais vers ce type,
   * sans exclure les autres (strictTypeFiltering n'est pas activé).
   */
  includedType?: string;
  /** Nombre de résultats demandés à Google (1 à 20), avant tout filtrage local. */
  pageSize?: number;
}

export async function searchPlaces({ query, limit = 3, includedType, pageSize }: SearchOptions): Promise<PlaceResult[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return [];

  try {
    const res = await fetchWithTimeout(URL_TEXT_SEARCH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': CHAMPS,
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'fr',
        // Biais vers la France. Le lieu précis est donné dans textQuery : sans
        // coordonnées, pas de locationBias (aucun géocodage payant).
        regionCode: 'FR',
        pageSize: Math.min(20, Math.max(limit, pageSize ?? limit)),
        ...(includedType ? { includedType } : {}),
      }),
    });
    const json: TextSearchResponse = await res.json().catch(() => ({}));
    if (!res.ok) {
      // Raison donnée par Google (API non activée, clé restreinte…) — jamais la clé elle-même.
      console.warn('[googlePlaces]', res.status, json.error?.status ?? '', json.error?.message ?? '');
      return [];
    }
    return (json.places ?? []).slice(0, limit).map((p) => ({
      name: p.displayName?.text ?? '',
      address: p.formattedAddress,
      rating: p.rating,
      reviews: p.userRatingCount,
      phone: p.nationalPhoneNumber,
      mapsUrl: p.googleMapsUri,
    }));
  } catch (e) {
    console.warn('[googlePlaces] échec de la requête', e instanceof Error ? e.name : '');
    return [];
  }
}

/** Lieu de l'entreprise, pour la recherche d'avocats à proximité. */
export interface LieuAvocats {
  ville?: string;
  codePostal?: string;
  /** Code du département (« 40 », « 2A », « 971 »…). */
  departement?: string;
  /** Nom du département (« Landes »), pour lever l'ambiguïté des communes homonymes. */
  nomDepartement?: string;
}

/**
 * Préfixe des codes postaux du département de l'entreprise : 2 chiffres en
 * métropole (Corse 2A / 2B → « 20 »), 3 chiffres outre-mer (97x, 98x).
 * Saint-Barthélemy (977) et Saint-Martin (978) ont un code postal unique en
 * 971 (97133, 97150) : on exige ce code entier, pour ne pas proposer un
 * cabinet de Guadeloupe. Chaîne vide si on ne sait pas.
 */
export function prefixePostal(lieu: Pick<LieuAvocats, 'codePostal' | 'departement'>): string {
  const cp = (lieu.codePostal ?? '').trim();
  const dep = (lieu.departement ?? '').trim().toUpperCase();
  if (cp === '97133' || dep === '977') return '97133';
  if (cp === '97150' || dep === '978') return '97150';
  if (/^\d{5}$/.test(cp)) return /^9[78]/.test(cp) ? cp.slice(0, 3) : cp.slice(0, 2);
  if (dep === '2A' || dep === '2B') return '20';
  if (/^9[78]\d$/.test(dep)) return dep;
  if (/^\d{2}$/.test(dep)) return dep;
  return '';
}

/**
 * Codes postaux d'une adresse Google (« 12 rue X, 40420 Vert ») : 5 chiffres
 * suivis du nom de la commune. Les numéros de boîte postale (« CS 60706, »)
 * ne sont pas suivis d'un nom et sont ignorés.
 */
export function codesPostauxAdresse(adresse: string | undefined): string[] {
  return Array.from((adresse ?? '').matchAll(/(?:^|[\s,])(\d{5})\s+(?=\p{L})/gu), (m) => m[1]);
}

/** L'adresse est-elle dans le département (code postal au bon préfixe) ? */
export function adresseDansDepartement(adresse: string | undefined, prefixe: string): boolean {
  if (!prefixe) return false;
  return codesPostauxAdresse(adresse).some((cp) => cp.startsWith(prefixe));
}

/**
 * Avocats à proximité de l'entreprise (Google Places, Text Search New).
 * La requête précise commune + code postal + département (« avocat droit des
 * entreprises Vert 40420 Landes ») : une commune au nom ambigu (Vert, Bar…)
 * ne doit pas renvoyer des cabinets à Bordeaux, Paris ou Lyon. Les résultats
 * dont l'adresse n'a pas de code postal du même département sont écartés ;
 * s'il n'en reste aucun, aucun avocat n'est affiché (la fiche oriente déjà
 * vers le barreau et le point-justice).
 */
export async function searchAvocats(lieu: LieuAvocats): Promise<PlaceResult[]> {
  const prefixe = prefixePostal(lieu);
  // Sans département connu, impossible de vérifier la proximité : pas de recherche.
  if (!prefixe) return [];
  const morceaux = [lieu.ville, lieu.codePostal, lieu.nomDepartement]
    .map((x) => (x ?? '').trim())
    .filter(Boolean);
  if (morceaux.length === 0) return [];
  const resultats = await searchPlaces({
    query: `avocat droit des entreprises ${morceaux.join(' ')}`,
    includedType: 'lawyer',
    // On en demande davantage (toujours une seule requête) pour pouvoir
    // écarter ceux qui sont hors du département.
    pageSize: 10,
    limit: 10,
  });
  return resultats.filter((p) => adresseDansDepartement(p.address, prefixe)).slice(0, 3);
}
