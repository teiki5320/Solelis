import { fetchWithTimeout } from './fetchTimeout';
import type { CompanyData } from './types';
import { libelleTrancheEffectif } from './secteur';

/* ---------- Interfaces API ---------- */

interface SireneEtablissement {
  siret?: string;
  code_postal?: string;
  /** Code commune INSEE (ex. « 2A004 », « 97411 »). */
  commune?: string;
  /** Code département (présent sur le siège, ex. « 2A », « 974 »). */
  departement?: string;
  libelle_commune?: string;
  adresse?: string;
}

interface SireneResult {
  nom_complet?: string;
  nom_raison_sociale?: string;
  prenom_usuel?: string;
  nom?: string;
  nature_juridique?: string;
  activite_principale?: string;
  libelle_activite_principale?: string;
  section_activite_principale?: string;
  date_creation?: string;
  tranche_effectif_salarie?: string;
  siege?: SireneEtablissement;
  matching_etablissements?: SireneEtablissement[];
}

interface SireneApiResponse {
  results?: SireneResult[];
  total_results?: number;
  page?: number;
  per_page?: number;
}

interface InseeAdresse {
  codePostalEtablissement?: string;
  codeCommuneEtablissement?: string;
  libelleCommuneEtablissement?: string;
  numeroVoieEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
}

interface InseeUniteLegale {
  denominationUniteLegale?: string;
  prenomUsuelUniteLegale?: string;
  nomUniteLegale?: string;
  categorieJuridiqueUniteLegale?: string;
  activitePrincipaleUniteLegale?: string;
  trancheEffectifsUniteLegale?: string;
  dateCreationUniteLegale?: string;
}

interface InseeEtablissement {
  /** true si l'établissement est le siège de l'unité légale. */
  etablissementSiege?: boolean;
  uniteLegale?: InseeUniteLegale;
  adresseEtablissement?: InseeAdresse;
  activitePrincipaleEtablissement?: string;
  dateCreationEtablissement?: string;
}

interface InseeSireneApiResponse {
  etablissement?: InseeEtablissement;
}

// Free, no-key government API. Backed by Sirene data.
const RECHERCHE_BASE = 'https://recherche-entreprises.api.gouv.fr/search';
// Repli : API Sirene de l'INSEE (portail-api.insee.fr), clé « X-INSEE-Api-Key-Integration ».
// L'ancienne adresse /entreprises/sirene/V3 (jeton Bearer) ne répond plus.
const SIRENE_BASE = 'https://api.insee.fr/api-sirene/3.11';

/**
 * L'API recherche-entreprises limite le nombre d'appels par adresse IP. Depuis
 * Cloudflare, l'adresse de sortie est partagée avec d'autres sites : elle
 * répond souvent 429 (trop de requêtes). On réessaie après une courte pause.
 * Délais en millisecondes avant chaque nouvel essai.
 */
export const DELAIS_REESSAI = [250, 600, 1200];

const attendre = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Catégories juridiques INSEE (niveau III) les plus fréquentes.
 * Source : nomenclature INSEE des catégories juridiques (version 2022),
 * libellés vérifiés via l'API Métadonnées de l'INSEE
 * (https://api.insee.fr/metadonnees/codes/cj/n3/{code}).
 *
 * Les libellés sont aussi lus par getJuridiction() et getFormeDetail()
 * (lib/strategie.ts) : ils doivent contenir les mots-clés de la forme
 * (« SARL », « anonyme », « nom collectif », « société civile »…).
 * NB : l'INSEE ne distingue ni l'EURL (5499) ni la SASU (5710).
 */
const FORMES: Record<string, string> = {
  '1000': 'Entrepreneur individuel',
  '5202': 'Société en nom collectif (SNC)',
  '5203': 'Société en nom collectif coopérative',
  '5306': 'Société en commandite simple',
  '5307': 'Société en commandite simple coopérative',
  '5308': 'Société en commandite par actions',
  '5309': 'Société en commandite par actions coopérative',
  '5385': "Société d'exercice libéral en commandite par actions (SELCA)",
  '5458': 'SARL coopérative de production (SCOP)',
  '5470': 'SPFPL à responsabilité limitée (SPFPL SARL)',
  '5485': "Société d'exercice libéral à responsabilité limitée (SELARL)",
  '5499': 'SARL',
  '5558': 'Société anonyme coopérative de production (SCOP SA)',
  '5585': "Société d'exercice libéral à forme anonyme (SELAFA)",
  '5658': 'Société anonyme coopérative de production (SCOP SA)',
  '5685': "Société d'exercice libéral à forme anonyme (SELAFA)",
  '5710': 'SAS / SASU',
  '5770': 'SPFPL par actions simplifiée (SPFPL SAS)',
  '5785': "Société d'exercice libéral par actions simplifiée (SELAS)",
  '5800': 'Société européenne (SE)',
  '6210': "Groupement européen d'intérêt économique (GEIE)",
  '6220': "Groupement d'intérêt économique (GIE)",
  '6316': 'Coopérative d\'utilisation de matériel agricole (CUMA)',
  '6317': 'Société coopérative agricole',
  '6521': 'Société civile de placement immobilier (SCPI)',
  '6533': "Groupement agricole d'exploitation en commun (GAEC)",
  '6534': 'Groupement foncier agricole (société civile)',
  '6536': 'Groupement forestier (société civile)',
  '6540': 'Société civile immobilière (SCI)',
  '6541': 'Société civile immobilière de construction-vente',
  '6585': 'Société civile professionnelle (SCP)',
  '6589': 'Société civile de moyens (SCM)',
  '6597': "Société civile d'exploitation agricole (SCEA)",
  '6598': 'Exploitation agricole à responsabilité limitée (EARL)',
  '6599': 'Société civile',
  '9220': 'Association déclarée',
  '9230': "Association reconnue d'utilité publique",
  '9300': 'Fondation',
};

/**
 * Repli par catégorie de niveau II (2 premiers chiffres), libellés INSEE
 * (https://api.insee.fr/metadonnees/codes/cj/n2/{code}).
 */
const FORMES_NIVEAU_II: Record<string, string> = {
  '10': 'Entrepreneur individuel',
  '21': 'Indivision',
  '22': 'Société créée de fait',
  '23': 'Société en participation',
  '24': 'Fiducie',
  '27': 'Groupement de droit privé sans personnalité morale',
  '29': 'Groupement de droit privé sans personnalité morale',
  '31': 'Personne morale de droit étranger',
  '32': 'Personne morale de droit étranger',
  '41': 'Établissement public à caractère industriel ou commercial',
  '51': 'Société coopérative commerciale particulière',
  '52': 'Société en nom collectif (SNC)',
  '53': 'Société en commandite',
  '54': 'SARL',
  '55': 'Société anonyme (SA)',
  '56': 'Société anonyme (SA)',
  '57': 'SAS / SASU',
  '58': 'Société européenne (SE)',
  '61': "Caisse d'épargne et de prévoyance",
  '62': "Groupement d'intérêt économique (GIE)",
  '63': 'Société coopérative agricole',
  '64': "Société d'assurance mutuelle",
  '65': 'Société civile',
  '69': 'Autre personne morale inscrite au RCS',
  '71': 'Personne morale de droit public',
  '72': 'Personne morale de droit public',
  '73': 'Personne morale de droit public',
  '74': 'Personne morale de droit public',
  '81': 'Organisme de protection sociale',
  '82': 'Organisme mutualiste',
  '83': "Comité d'entreprise",
  '84': 'Organisme professionnel',
  '85': 'Organisme de retraite à adhésion non obligatoire',
  '91': 'Syndicat de copropriétaires',
  '92': 'Association',
  '93': 'Fondation',
  '99': 'Autre personne morale de droit privé',
};

export function formatForme(code: string | undefined): string {
  const c = (code ?? '').trim();
  if (!c) return 'Non renseignée';
  if (FORMES[c]) return FORMES[c];
  // Sociétés civiles professionnelles : 6561 à 6578 (SCP d'avocats, de médecins…)
  if (/^65[67]\d$/.test(c)) return 'Société civile professionnelle (SCP)';
  return FORMES_NIVEAU_II[c.slice(0, 2)] ?? `Catégorie juridique ${c}`;
}

/** Tranche INSEE → libellé ; table partagée avec getEffectifSeuils (lib/secteur.ts). */
export function formatEffectif(code: string | undefined): string {
  return libelleTrancheEffectif(code);
}

/**
 * Département à partir du code commune INSEE (source la plus fiable) :
 * 2 caractères en métropole (dont « 2A » / « 2B » pour la Corse),
 * 3 chiffres outre-mer (971 à 978, 986 à 988).
 */
export function departementDepuisCommune(code: string | undefined): string {
  const c = (code ?? '').trim().toUpperCase();
  if (!/^(\d{5}|2[AB]\d{3})$/.test(c)) return '';
  return /^9[78]/.test(c) ? c.slice(0, 3) : c.slice(0, 2);
}

/**
 * Département à partir du code postal, à défaut de code commune :
 * - 97xxx / 98xxx → 3 chiffres (971 Guadeloupe … 988 Nouvelle-Calédonie) ;
 * - Corse : 200xx et 201xx → 2A (Corse-du-Sud), 202xx à 206xx → 2B (Haute-Corse).
 * - Saint-Barthélemy (97133) et Saint-Martin (97150) : codes postaux en 971,
 *   mais collectivités 977 et 978.
 */
export function departementDepuisCodePostal(codePostal: string | undefined): string {
  const c = (codePostal ?? '').trim();
  if (!/^\d{5}$/.test(c)) return '';
  if (c === '97133') return '977';
  if (c === '97150') return '978';
  if (/^9[78]/.test(c)) return c.slice(0, 3);
  if (c.startsWith('20')) return c[2] === '0' || c[2] === '1' ? '2A' : '2B';
  return c.slice(0, 2);
}

/** Commune INSEE d'abord, code postal ensuite ; jamais le SIREN. */
export function determinerDepartement(
  codeCommune: string | undefined,
  codePostal: string | undefined,
  departementApi?: string,
): string {
  return (
    departementDepuisCommune(codeCommune) ||
    (departementApi ?? '').trim().toUpperCase() ||
    departementDepuisCodePostal(codePostal)
  );
}

/**
 * Premier nom non vide. `[].join(' ')` renvoie « » (chaîne vide, pas
 * null) : avec `??` le repli « Votre entreprise » n'était jamais atteint.
 */
export function choisirNom(...candidats: (string | null | undefined)[]): string {
  for (const c of candidats) {
    const nom = (c ?? '').trim();
    if (nom) return nom;
  }
  return 'Votre entreprise';
}

/**
 * L'API recherche-entreprises renvoie dans `nom_complet` le nom commercial
 * entre parenthèses, même quand il est identique à la dénomination :
 * « AMP ETANCHEITE (AMP ETANCHEITE) ». On retire la parenthèse quand elle
 * répète le nom (casse et espaces ignorés) ; sinon on la garde.
 */
export function nettoyerNomComplet(nom: string | null | undefined): string {
  const brut = (nom ?? '').trim();
  // « NOM (NOM) » ou « NOM (NOM) (SIGLE) » : la 1re parenthèse répète le nom.
  const m = brut.match(/^(.*?\S)\s*\(([^()]*)\)(\s*\([^()]*\))?$/);
  if (!m) return brut;
  const normaliser = (s: string) => s.replace(/\s+/g, ' ').trim().toLocaleUpperCase('fr-FR');
  if (normaliser(m[1]) !== normaliser(m[2])) return brut;
  return m[1].trim() + (m[3] ? ' ' + m[3].trim() : '');
}

function fallbackFor(siret: string): CompanyData {
  return {
    siret,
    nom: 'Votre entreprise',
    formeJuridique: 'Non renseignée',
    naf: '',
    dateCreation: '',
    effectif: 'Non renseigné',
    adresse: '',
    codePostal: '',
    ville: '',
    // Inconnu : les 2 premiers chiffres du SIRET sont ceux du SIREN, sans
    // rapport avec la localisation.
    departement: '',
    fetched: false,
  };
}

async function fetchFromRechercheEntreprises(
  siret: string
): Promise<CompanyData | null> {
  try {
    const url = `${RECHERCHE_BASE}?q=${siret}&page=1&per_page=1`;
    let res = await fetchWithTimeout(url, { cache: 'no-store' });
    // 429 (limite d'appels) ou erreur passagère du serveur : on réessaie.
    for (const delai of DELAIS_REESSAI) {
      if (res.status !== 429 && res.status < 500) break;
      await attendre(delai);
      res = await fetchWithTimeout(url, { cache: 'no-store' });
    }
    if (!res.ok) {
      console.warn('[sirene] recherche-entreprises :', res.status);
      return null;
    }
    const json: SireneApiResponse = await res.json();
    const result = json?.results?.[0];
    if (!result) return null;

    const matching =
      result.matching_etablissements?.find((e) => e.siret === siret) ??
      result.matching_etablissements?.[0] ??
      result.siege;

    const codePostal: string = matching?.code_postal ?? result.siege?.code_postal ?? '';
    const ville: string = matching?.libelle_commune ?? result.siege?.libelle_commune ?? '';
    // Département de l'établissement consulté (et non du siège s'il diffère)
    const departement = matching?.commune || matching?.code_postal
      ? determinerDepartement(matching.commune, matching.code_postal, matching.departement)
      : determinerDepartement(result.siege?.commune, codePostal, result.siege?.departement);
    const nom = choisirNom(
      nettoyerNomComplet(result.nom_complet),
      result.nom_raison_sociale,
      [result.prenom_usuel, result.nom].filter(Boolean).join(' '),
    );

    return {
      siret,
      nom,
      formeJuridique: formatForme(result.nature_juridique),
      naf: result.activite_principale ?? '',
      nafLabel: result.libelle_activite_principale ?? undefined,
      nafSection: result.section_activite_principale ?? undefined,
      dateCreation: result.date_creation ?? '',
      effectif: formatEffectif(result.tranche_effectif_salarie),
      adresse: matching?.adresse ?? result.siege?.adresse ?? '',
      codePostal,
      ville,
      departement,
      // Établissement secondaire : le tribunal est celui du siège (R600-1).
      ...(matching?.siret && result.siege?.siret && matching.siret !== result.siege.siret
        ? {
            siege: {
              codePostal: result.siege.code_postal ?? '',
              ville: result.siege.libelle_commune ?? '',
              departement: determinerDepartement(result.siege.commune, result.siege.code_postal, result.siege.departement),
            },
          }
        : {}),
      fetched: true,
    };
  } catch (e) {
    console.warn('[sirene] recherche-entreprises : échec', e instanceof Error ? e.name : '');
    return null;
  }
}

async function fetchFromInseeSirene(
  siret: string
): Promise<CompanyData | null> {
  const apiKey = process.env.INSEE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetchWithTimeout(`${SIRENE_BASE}/siret/${siret}`, {
      headers: {
        'X-INSEE-Api-Key-Integration': apiKey,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      // Raison seulement (clé refusée, SIRET inconnu…) — jamais la clé.
      console.warn('[sirene] INSEE :', res.status);
      return null;
    }
    const json: InseeSireneApiResponse = await res.json();
    const etab = json?.etablissement;
    if (!etab) return null;

    const unit = etab.uniteLegale ?? {};
    const addr = etab.adresseEtablissement ?? {};
    const codePostal: string = addr.codePostalEtablissement ?? '';
    const departement = determinerDepartement(addr.codeCommuneEtablissement, codePostal);

    const nom = choisirNom(
      unit.denominationUniteLegale,
      [unit.prenomUsuelUniteLegale, unit.nomUniteLegale].filter(Boolean).join(' '),
    );

    const addressParts = [
      addr.numeroVoieEtablissement,
      addr.typeVoieEtablissement,
      addr.libelleVoieEtablissement,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      siret,
      nom,
      formeJuridique: formatForme(unit.categorieJuridiqueUniteLegale),
      naf: unit.activitePrincipaleUniteLegale ?? '',
      nafLabel: etab.activitePrincipaleEtablissement ?? unit.activitePrincipaleUniteLegale,
      dateCreation:
        unit.dateCreationUniteLegale ?? etab.dateCreationEtablissement ?? '',
      effectif: formatEffectif(unit.trancheEffectifsUniteLegale),
      adresse: addressParts,
      codePostal,
      ville: addr.libelleCommuneEtablissement ?? '',
      departement,
      // Établissement secondaire : adresse du siège inconnue ici, le tribunal
      // (celui du siège, R600-1) reste générique.
      ...(etab.etablissementSiege === false ? { siege: { codePostal: '', ville: '', departement: '' } } : {}),
      fetched: true,
    };
  } catch (e) {
    console.warn('[sirene] INSEE : échec', e instanceof Error ? e.name : '');
    return null;
  }
}

export async function fetchSirene(siret: string): Promise<CompanyData> {
  const cleanSiret = siret.replace(/\s/g, '');
  // Primary: free public API — works without any key.
  const primary = await fetchFromRechercheEntreprises(cleanSiret);
  if (primary) return primary;
  // Secondary: INSEE Sirene with user-provided key.
  const secondary = await fetchFromInseeSirene(cleanSiret);
  if (secondary) return secondary;
  return fallbackFor(cleanSiret);
}

export function yearFromDate(d: string): string {
  if (!d) return '—';
  const y = d.slice(0, 4);
  return /^\d{4}$/.test(y) ? y : '—';
}
