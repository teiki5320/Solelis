/**
 * Résultat de l'API publique recherche-entreprises (annuaire des entreprises,
 * https://recherche-entreprises.api.gouv.fr), réduit aux seuls champs lus par
 * lib/sirene.ts pour construire la fiche (CompanyData).
 *
 * Ce module ne dépend de rien (ni zod, ni données lourdes) : il sert aussi
 * dans le navigateur. La recherche y est faite depuis l'adresse IP du
 * visiteur, ce qui évite la limite d'appels partagée par l'adresse de sortie
 * de Cloudflare côté serveur. Le serveur valide ensuite ce résultat avec
 * `entrepriseRechercheSchema` (lib/schemas.ts) et ne l'utilise que si sa
 * propre recherche a échoué et que le SIRET correspond exactement.
 */

export const URL_RECHERCHE_ENTREPRISES = 'https://recherche-entreprises.api.gouv.fr/search';

export interface EtablissementRecherche {
  siret?: string | null;
  code_postal?: string | null;
  /** Code commune INSEE (ex. « 2A004 », « 97411 »). */
  commune?: string | null;
  /** Code département (présent sur le siège, ex. « 2A », « 974 »). */
  departement?: string | null;
  libelle_commune?: string | null;
  adresse?: string | null;
}

export interface ResultatRechercheEntreprise {
  nom_complet?: string | null;
  nom_raison_sociale?: string | null;
  prenom_usuel?: string | null;
  nom?: string | null;
  nature_juridique?: string | null;
  activite_principale?: string | null;
  libelle_activite_principale?: string | null;
  section_activite_principale?: string | null;
  date_creation?: string | null;
  tranche_effectif_salarie?: string | null;
  siege?: EtablissementRecherche | null;
  matching_etablissements?: EtablissementRecherche[] | null;
}

/* ---------- Bornes et formats (partagés avec le schéma Zod) ---------- */

/** Longueurs maximales des textes libres. */
export const LONGUEURS_RECHERCHE = {
  nom: 250,
  prenomOuNom: 100,
  libelleActivite: 200,
  libelleCommune: 100,
  adresse: 250,
} as const;

/** Nombre maximal d'établissements transmis (seul celui du SIRET saisi est utile). */
export const MAX_ETABLISSEMENTS_RECHERCHE = 2;

export const FORMATS_RECHERCHE = {
  siret: /^\d{14}$/,
  codePostal: /^\d{5}$/,
  commune: /^(\d{5}|2[AB]\d{3})$/,
  departement: /^(\d{2,3}|2[AB])$/,
  natureJuridique: /^\d{4}$/,
  // NAF rév. 2 (« 47.11Z ») et anciens codes encore présents (« 52.1D »).
  activite: /^\d{2}\.\d{1,2}[A-Z]$/,
  section: /^[A-U]$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  tranche: /^(NN|\d{2})$/,
  /** Texte libre : ni balise (< >) ni caractère de contrôle. */
  texte: /^[^<>\u0000-\u001f\u007f]*$/,
} as const;

/* ---------- Réduction (navigateur) ---------- */

function texte(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const propre = v.replace(/[<>\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  return propre ? propre.slice(0, max).trim() : undefined;
}

function code(v: unknown, format: RegExp): string | undefined {
  if (typeof v !== 'string') return undefined;
  const c = v.trim();
  return format.test(c) ? c : undefined;
}

function sansVides<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}

function reduireEtablissement(brut: unknown): EtablissementRecherche | undefined {
  if (!brut || typeof brut !== 'object') return undefined;
  const e = brut as Record<string, unknown>;
  const siret = code(e.siret, FORMATS_RECHERCHE.siret);
  if (!siret) return undefined;
  return sansVides({
    siret,
    code_postal: code(e.code_postal, FORMATS_RECHERCHE.codePostal),
    commune: code(e.commune, FORMATS_RECHERCHE.commune),
    departement: code(e.departement, FORMATS_RECHERCHE.departement),
    libelle_commune: texte(e.libelle_commune, LONGUEURS_RECHERCHE.libelleCommune),
    adresse: texte(e.adresse, LONGUEURS_RECHERCHE.adresse),
  });
}

/**
 * Réduit `results[0]` de l'API aux champs utiles, bornés et sans balise.
 * Les dirigeant·e·s, finances, coordonnées GPS, etc. sont écartés.
 * Ne garde que l'établissement dont le SIRET est exactement celui saisi
 * (siège ou établissement secondaire) : renvoie null s'il n'y en a pas.
 */
export function reduireResultatRecherche(brut: unknown, siret: string): ResultatRechercheEntreprise | null {
  if (!brut || typeof brut !== 'object') return null;
  const r = brut as Record<string, unknown>;
  const siege = reduireEtablissement(r.siege);
  const matching = (Array.isArray(r.matching_etablissements) ? r.matching_etablissements : [])
    .map(reduireEtablissement)
    .filter((e): e is EtablissementRecherche => !!e && e.siret === siret)
    .slice(0, MAX_ETABLISSEMENTS_RECHERCHE);
  if (siege?.siret !== siret && matching.length === 0) return null;
  return sansVides({
    nom_complet: texte(r.nom_complet, LONGUEURS_RECHERCHE.nom),
    nom_raison_sociale: texte(r.nom_raison_sociale, LONGUEURS_RECHERCHE.nom),
    prenom_usuel: texte(r.prenom_usuel, LONGUEURS_RECHERCHE.prenomOuNom),
    nom: texte(r.nom, LONGUEURS_RECHERCHE.prenomOuNom),
    nature_juridique: code(r.nature_juridique, FORMATS_RECHERCHE.natureJuridique),
    activite_principale: code(r.activite_principale, FORMATS_RECHERCHE.activite),
    libelle_activite_principale: texte(r.libelle_activite_principale, LONGUEURS_RECHERCHE.libelleActivite),
    section_activite_principale: code(r.section_activite_principale, FORMATS_RECHERCHE.section),
    date_creation: code(r.date_creation, FORMATS_RECHERCHE.date),
    tranche_effectif_salarie: code(r.tranche_effectif_salarie, FORMATS_RECHERCHE.tranche),
    siege,
    matching_etablissements: matching.length ? matching : undefined,
  });
}

/**
 * Établissement dont le SIRET est exactement celui demandé (établissement
 * secondaire d'abord, siège sinon), ou undefined.
 */
export function etablissementExact(
  resultat: ResultatRechercheEntreprise,
  siret: string,
): EtablissementRecherche | undefined {
  return (
    resultat.matching_etablissements?.find((e) => e.siret === siret) ??
    (resultat.siege?.siret === siret ? resultat.siege : undefined)
  );
}

/* ---------- Recherche depuis le navigateur ---------- */

/** Pauses (ms) avant chaque nouvel essai sur 429 ou erreur serveur. */
export const DELAIS_REESSAI_NAVIGATEUR = [600, 1500];

const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Cherche l'entreprise depuis le navigateur du visiteur (l'API autorise
 * le CORS). Renvoie le résultat réduit, ou null (introuvable, refus, réseau).
 */
export async function rechercherEntrepriseNavigateur(
  siret: string,
  delais: readonly number[] = DELAIS_REESSAI_NAVIGATEUR,
): Promise<ResultatRechercheEntreprise | null> {
  if (!FORMATS_RECHERCHE.siret.test(siret)) return null;
  const url = `${URL_RECHERCHE_ENTREPRISES}?q=${siret}&page=1&per_page=1`;
  const appeler = () =>
    fetch(url, {
      headers: { Accept: 'application/json' },
      // Aucune donnée du visiteur : ni cookie ni Referer vers l'API.
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      ...(typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal
        ? { signal: AbortSignal.timeout(6000) }
        : {}),
    });
  try {
    let res = await appeler();
    for (const delai of delais) {
      if (res.status !== 429 && res.status < 500) break;
      await attendre(delai);
      res = await appeler();
    }
    if (!res.ok) return null;
    const json = (await res.json()) as { results?: unknown[] } | null;
    return reduireResultatRecherche(json?.results?.[0], siret);
  } catch {
    return null;
  }
}
