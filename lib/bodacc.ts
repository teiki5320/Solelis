import { fetchWithTimeout } from './fetchTimeout';
import type { AlerteSignal, BodaccItem } from './types';

/* ---------- Interfaces API ---------- */

/**
 * Enregistrement renvoyé par l'API Explore v2.1 d'OpenDataSoft (jeu
 * « annonces-commerciales » du BODACC, DILA). Les champs `listepersonnes`
 * et `jugement` sont des chaînes JSON ; `registre` est une liste contenant
 * le SIREN avec et sans espaces (ex. ["883847758", "883 847 758"]).
 * Il n'existe PAS de champ `siren` (l'API répond « Unknown field: siren »).
 */
interface BodaccRecordFields {
  id?: string;
  dateparution?: string;
  familleavis?: string;
  familleavis_lib?: string;
  typeavis?: string;
  typeavis_lib?: string;
  tribunal?: string;
  commercant?: string;
  registre?: string[] | string;
  listepersonnes?: string | BodaccListePersonnes | null;
  jugement?: string | BodaccJugement | null;
}

interface BodaccPersonne {
  denomination?: string;
  nom?: string;
  prenom?: string;
}

interface BodaccListePersonnes {
  personne?: BodaccPersonne | BodaccPersonne[];
}

interface BodaccJugement {
  famille?: string;
  nature?: string;
  date?: string;
}

interface BodaccApiResponse {
  total_count?: number;
  results?: BodaccRecordFields[];
}

/** Résultat d'une consultation : « indisponible » = le BODACC n'a pas pu être interrogé. */
export interface ResultatBodacc {
  statut: 'ok' | 'indisponible';
  annonces: BodaccItem[];
}

const BODACC_RECORDS =
  'https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records';

/**
 * Familles d'avis correspondant à une procédure (valeurs du champ
 * `familleavis`, vérifiées sur l'API : « collective » = « Procédures
 * collectives », « retablissement_professionnel » = « Procédures de
 * rétablissement professionnel »).
 */
const FAMILLES_PROCEDURE = ['collective', 'retablissement_professionnel'];

/**
 * Listes vides renvoyées quand le BODACC n'a pas pu être consulté. Le
 * marquage permet à `computeAlertes` de distinguer « aucune annonce » de
 * « vérification impossible » sans changer la signature de `fetchBodacc`.
 */
const LISTES_INDISPONIBLES = new WeakSet<BodaccItem[]>();

/** Vrai si la liste provient d'un appel BODACC qui a échoué. */
export function bodaccIndisponible(liste: BodaccItem[]): boolean {
  return LISTES_INDISPONIBLES.has(liste);
}

function listeIndisponible(): BodaccItem[] {
  const liste: BodaccItem[] = [];
  LISTES_INDISPONIBLES.add(liste);
  return liste;
}

/** SIREN (9 premiers chiffres du SIRET), ou null s'il est invalide. */
export function sirenDepuisSiret(siret: string): string | null {
  const sn = (siret || '').replace(/\D/g, '').slice(0, 9);
  if (!/^\d{9}$/.test(sn) || sn === '000000000') return null;
  return sn;
}

export function construireUrlBodacc(
  siren: string,
  options: { proceduresSeulement?: boolean; limite?: number } = {},
): string {
  const familles = FAMILLES_PROCEDURE.map((f) => `"${f}"`).join(', ');
  const where = options.proceduresSeulement
    ? `registre = "${siren}" AND familleavis IN (${familles})`
    : `registre = "${siren}"`;
  const params = new URLSearchParams({
    where,
    limit: String(options.limite ?? 10),
    order_by: 'dateparution desc',
  });
  return `${BODACC_RECORDS}?${params.toString()}`;
}

function lireJson<T>(valeur: unknown): T | undefined {
  if (!valeur) return undefined;
  if (typeof valeur === 'object') return valeur as T;
  if (typeof valeur !== 'string') return undefined;
  try {
    return JSON.parse(valeur) as T;
  } catch {
    return undefined;
  }
}

function nomPersonne(liste: BodaccListePersonnes | undefined): string | undefined {
  const brut = liste?.personne;
  const personne = Array.isArray(brut) ? brut[0] : brut;
  if (!personne) return undefined;
  return (
    personne.denomination ||
    [personne.prenom, personne.nom].filter(Boolean).join(' ') ||
    undefined
  );
}

export function mapRecord(rec: BodaccRecordFields): BodaccItem {
  const jugement = lireJson<BodaccJugement>(rec.jugement);
  const personnes = lireJson<BodaccListePersonnes>(rec.listepersonnes);
  return {
    type: rec.familleavis_lib || rec.typeavis_lib || 'Annonce',
    date: rec.dateparution ?? '',
    tribunal: rec.tribunal || undefined,
    description: jugement?.nature || nomPersonne(personnes) || rec.commercant || undefined,
  };
}

async function interrogerBodacc(url: string): Promise<ResultatBodacc> {
  try {
    const res = await fetchWithTimeout(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`[bodacc] HTTP ${res.status} — vérification impossible`);
      return { statut: 'indisponible', annonces: [] };
    }
    const json: BodaccApiResponse = await res.json();
    if (!Array.isArray(json?.results)) {
      console.error('[bodacc] réponse inattendue (champ results absent)');
      return { statut: 'indisponible', annonces: [] };
    }
    return { statut: 'ok', annonces: json.results.map(mapRecord) };
  } catch (e) {
    console.error('[bodacc] appel en échec :', e instanceof Error ? e.message : e);
    return { statut: 'indisponible', annonces: [] };
  }
}

/** Les 10 annonces BODACC les plus récentes du SIREN, avec statut explicite. */
export async function fetchBodaccResultat(siret: string): Promise<ResultatBodacc> {
  const sn = sirenDepuisSiret(siret);
  if (!sn) return { statut: 'indisponible', annonces: [] };
  return interrogerBodacc(construireUrlBodacc(sn, { limite: 10 }));
}

/** Annonces de procédures collectives / rétablissement professionnel, avec statut explicite. */
export async function fetchProceduresResultat(siret: string): Promise<ResultatBodacc> {
  const sn = sirenDepuisSiret(siret);
  if (!sn) return { statut: 'indisponible', annonces: [] };
  return interrogerBodacc(construireUrlBodacc(sn, { proceduresSeulement: true, limite: 5 }));
}

function versListe(r: ResultatBodacc): BodaccItem[] {
  return r.statut === 'ok' ? r.annonces : listeIndisponible();
}

/**
 * Annonces BODACC du SIREN. En cas d'échec, renvoie une liste vide marquée
 * (voir `bodaccIndisponible`) : ne pas l'interpréter comme « aucune annonce ».
 */
export async function fetchBodacc(siret: string): Promise<BodaccItem[]> {
  return versListe(await fetchBodaccResultat(siret));
}

/**
 * Procédures publiées au BODACC (Infogreffe n'a pas d'API publique gratuite :
 * le BODACC sert de source). Même convention d'échec que `fetchBodacc`.
 */
export async function fetchInfogreffeSignals(siret: string): Promise<BodaccItem[]> {
  return versListe(await fetchProceduresResultat(siret));
}

/**
 * Date d'annonce au format français (« 7 mai 2026 »). Chaîne vide si la date
 * manque ou n'est pas lisible — jamais « () » ni « 2026-05-07 ».
 */
export function dateFr(date: string | undefined): string {
  if (!date) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  const d = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : new Date(date);
  if (isNaN(d.getTime())) return '';
  const texte = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  // Usage typographique : « 1er mai 2026 », pas « 1 mai 2026 ».
  return d.getUTCDate() === 1 ? texte.replace(/^1(?=\s)/, '1er') : texte;
}

/** « (publiée le 7 mai 2026) » ou rien si la date manque. */
function entreParentheses(date: string | undefined): string {
  const f = dateFr(date);
  return f ? ` (publiée le ${f})` : '';
}

function daysSince(date: string): number | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
}

export interface OptionsAlertes {
  /**
   * false si le BODACC n'a pas pu être consulté. Par défaut, déduit du
   * marquage des listes renvoyées par `fetchBodacc` / `fetchInfogreffeSignals`.
   */
  bodaccDisponible?: boolean;
}

function estIndisponible(
  bodacc: BodaccItem[],
  infogreffe: BodaccItem[],
  options?: OptionsAlertes,
): boolean {
  return (
    options?.bodaccDisponible === false ||
    bodaccIndisponible(bodacc) ||
    bodaccIndisponible(infogreffe)
  );
}

/**
 * Compare la situation déclarée par le dirigeant et les annonces BODACC/Infogreffe.
 * Une incohérence signale au dirigeant un décalage à clarifier.
 * Si le BODACC n'a pas pu être consulté, aucune conclusion n'est tirée
 * de l'absence d'annonce.
 */
export function detectIncoherenceBodacc(
  bodacc: BodaccItem[],
  infogreffe: BodaccItem[],
  situation: string,
  options?: OptionsAlertes,
): AlerteSignal | null {
  const hasProcedure = infogreffe.length > 0;
  const indisponible = estIndisponible(bodacc, infogreffe, options);

  // Cas 1 : le dirigeant dit "prévention" mais une procédure collective est publiée.
  if (situation === 'prevention' && hasProcedure) {
    return {
      niveau: 'rouge',
      titre: 'Une procédure est déjà publiée',
      message: `Une procédure apparaît au BODACC${entreParentheses(infogreffe[0].date)}, alors que vous indiquez être en prévention. Vérifiez urgemment votre situation avec votre avocat ou le greffe — il peut s'agir d'une procédure ancienne non clôturée ou d'un décalage à lever.`,
      source: 'Bodacc · vos réponses',
    };
  }

  // Les cas suivants reposent sur l'ABSENCE d'annonce : impossible à
  // affirmer si le BODACC n'a pas répondu.
  if (indisponible) return null;

  // Cas 2 : assignation déclarée mais rien au BODACC depuis 6 mois.
  if (situation === 'assignation') {
    const recentJuridique = bodacc.find((b) => {
      const age = daysSince(b.date);
      return age !== null && age < 180 && /procédure|jugement|assignation|redressement|liquid/i.test(b.type);
    });
    if (!recentJuridique) {
      return {
        niveau: 'jaune',
        titre: "Assignation pas encore publiée au BODACC",
        message:
          "Vous indiquez avoir reçu une assignation, mais aucune annonce récente n'apparaît au BODACC. C'est normal : la publication intervient après jugement. Préparez dès maintenant vos pièces (bilan, trésorerie, liste des créanciers).",
        source: 'Bodacc · vos réponses',
      };
    }
  }

  // Cas 3 : redressement déclaré mais rien publié.
  if (situation === 'redressement' && infogreffe.length === 0) {
    return {
      niveau: 'jaune',
      titre: "Aucune procédure publique détectée",
      message:
        "Vous indiquez être en cessation des paiements. Si vous avez déjà déposé la déclaration, le jugement d'ouverture n'est peut-être pas encore publié. Rappel : l'article L631-4 du Code de commerce impose de la déclarer dans les 45 jours qui suivent la cessation des paiements.",
      source: 'Bodacc · vos réponses',
    };
  }

  // Cas 4 : BODACC ancien (> 6 mois) avec situation déclarée non critique → rappel.
  if (bodacc.length > 0 && !hasProcedure && situation !== 'assignation') {
    const mostRecent = bodacc[0];
    const age = daysSince(mostRecent.date);
    if (age !== null && age > 365) {
      return {
        niveau: 'vert',
        titre: 'Dernière annonce BODACC ancienne',
        message: `Votre dernière annonce au BODACC date du ${dateFr(mostRecent.date)} — plus d'un an. Rien d'alarmant côté publications publiques.`,
        source: 'Bodacc',
      };
    }
  }

  return null;
}

export const ALERTE_BODACC_INDISPONIBLE: AlerteSignal = {
  niveau: 'jaune',
  titre: 'Vérification BODACC impossible',
  message:
    "Le BODACC n'a pas pu être consulté pour le moment : nous ne pouvons pas dire si une annonce vous concerne. Vérifiez directement sur bodacc.fr (recherche par numéro SIREN) ou rechargez la fiche plus tard.",
  source: 'Bodacc',
};

export function computeAlertes(
  bodacc: BodaccItem[],
  infogreffe: BodaccItem[],
  situation: string,
  options?: OptionsAlertes,
): AlerteSignal[] {
  const alertes: AlerteSignal[] = [];
  const indisponible = estIndisponible(bodacc, infogreffe, options);

  // Priorité 1 : incohérence BODACC ↔ situation déclarée.
  const incoherence = detectIncoherenceBodacc(bodacc, infogreffe, situation, options);
  if (incoherence) alertes.push(incoherence);

  if (infogreffe.length > 0 || situation === 'redressement' || situation === 'assignation') {
    // Évite de doublonner si l'incohérence a déjà couvert le sujet.
    const dejaSignale = alertes.some((a) => a.titre.startsWith('Une procédure') || a.titre.startsWith('Aucune procédure'));
    if (!dejaSignale) {
      alertes.push({
        niveau: 'rouge',
        titre: 'Procédure détectée',
        message:
          infogreffe.length > 0
            ? `Une procédure collective apparaît dans les annonces publiques${entreParentheses(infogreffe[0].date)}.`
            : 'Vos réponses indiquent une procédure en cours. Un accompagnement urgent est recommandé.',
        source: infogreffe.length ? 'Bodacc / Infogreffe' : 'Vos réponses',
      });
    }
  }

  const recent = bodacc.find((b) => {
    const age = daysSince(b.date);
    return age !== null && age < 180;
  });

  if (recent) {
    alertes.push({
      niveau: 'jaune',
      titre: 'Annonce récente au BODACC',
      message: `${recent.type} publiée le ${dateFr(recent.date)}. Vérifiez qu'elle reflète votre situation actuelle.`,
      source: 'Bodacc',
    });
  } else if (indisponible) {
    // Jamais « plutôt bon signe » quand on n'a pas pu vérifier.
    alertes.push(ALERTE_BODACC_INDISPONIBLE);
  } else if (!alertes.some((a) => a.source.startsWith('Bodacc'))) {
    alertes.push({
      niveau: 'jaune',
      titre: "Pas d'annonce récente",
      message: "Aucune annonce récente au BODACC — c'est plutôt bon signe.",
      source: 'Bodacc',
    });
  }

  alertes.push({
    niveau: 'vert',
    titre: 'Vous avez fait le premier pas',
    message:
      "Le simple fait de vous informer aujourd'hui change la trajectoire. Les dispositifs amiables (mandat ad hoc, conciliation) ont d'autant plus de chances d'aboutir qu'ils sont engagés tôt — avant la cessation des paiements.",
    source: 'Solelis',
  });

  return alertes.slice(0, 3);
}
