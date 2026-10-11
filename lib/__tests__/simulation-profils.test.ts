// @vitest-environment node
/**
 * Simulation massive de profils (dirigeant·e + entreprise) et contrôle
 * d'invariants sur le moteur de Solelis et sur la fiche rendue.
 *
 * - Couche « moteur » : produit cartésien situation × problème × effectif ×
 *   moral × forme juridique × NAF, avec rotation des champs facultatifs,
 *   des territoires, des tranches d'effectif et des âges d'entreprise.
 * - Couche « fiche rendue » : LayoutDashboard rendu côté serveur
 *   (renderToStaticMarkup) sur un échantillon couvrant chaque valeur.
 * - Courriers, BODACC, ICS, OPCO, aides régionales.
 *
 * Aucune API externe n'est appelée : les CompanyData sont construites ici.
 *
 * Par défaut le test ne fait échouer que les invariants « durs » (exception,
 * stratégie absente, département introuvable…). Les constats (texte cassé,
 * contradictions, points juridiques) sont agrégés et écrits dans un rapport
 * JSON. `SIMULATION_STRICT=1` fait échouer le test au moindre constat.
 * `SIMULATION_RAPPORT=/chemin/rapport.json` choisit le fichier de sortie.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import organismesData from '@/data/organismes.json';
import type { Reponses, CompanyData, BodaccItem } from '@/lib/types';
import {
  resolveStrategie,
  getJuridiction,
  getFormeDetail,
  estEnCessation,
  type Strategie,
} from '@/lib/strategie';
import { scorePriorityCards } from '@/lib/priorites';
import {
  buildOrganismes,
  buildOrdresProfessionnels,
  buildAidesPersonnelles,
  buildSoutien,
  buildReseauxSpecifiques,
  getDepartement,
  type GroupeOrganismes,
} from '@/lib/organismes';
import {
  getSectorInfo,
  getCompanyAge,
  getEffectifSeuils,
  libelleTrancheEffectif,
} from '@/lib/secteur';
import { getOpcoFromNaf } from '@/lib/opco';
import { getAidesRegionales } from '@/lib/aidesRegionales';
import { COURRIERS, personalizeCourrier } from '@/lib/courriers';
import { computeAlertes } from '@/lib/bodacc';
import { buildIcs } from '@/lib/ics';
import { getTonePreset } from '@/lib/tone';
import { formatForme } from '@/lib/sirene';
import LayoutDashboard from '@/components/fiche/layouts/LayoutDashboard';

// ─────────────────────────────────────────────────────────────
// Collecte des constats
// ─────────────────────────────────────────────────────────────

type Gravite = 'bloquant' | 'juridique' | 'contradiction' | 'texte' | 'mineur';

interface Constat {
  code: string;
  gravite: Gravite;
  message: string;
  occurrences: number;
  exemples: { profil: string; extrait: string }[];
  /** Extraits distincts (jusqu'à 12) pour repérer les variantes d'un même constat. */
  variantes: string[];
}

const CONSTATS = new Map<string, Constat>();
let nbVerifications = 0;
const compteurs = { profilsMoteur: 0, profilsRendus: 0, courriers: 0, bodacc: 0, ics: 0 };

function verif(ok: boolean, code: string, gravite: Gravite, message: string, profil: string, extrait = ''): boolean {
  nbVerifications++;
  if (ok) return true;
  const c = CONSTATS.get(code) ?? { code, gravite, message, occurrences: 0, exemples: [], variantes: [] };
  c.occurrences++;
  if (c.exemples.length < 3) c.exemples.push({ profil, extrait: extrait.slice(0, 400) });
  const cle = extrait.slice(0, 200);
  if (cle && c.variantes.length < 12 && !c.variantes.includes(cle)) c.variantes.push(cle);
  CONSTATS.set(code, c);
  return false;
}

// ─────────────────────────────────────────────────────────────
// Dimensions de la matrice
// ─────────────────────────────────────────────────────────────

const SITUATIONS: Reponses['situation'][] = ['prevention', 'tresorie', 'redressement', 'assignation'];
const PROBLEMES: Reponses['probleme'][] = ['urssaf', 'fournisseurs', 'banque', 'impots'];
const EFFECTIFS: Reponses['effectif'][] = ['independant', 'salaries'];
const MORAUX: Reponses['moral'][] = ['combatif', 'epuise', 'perdu'];

const OPTIONNELS: { [K in keyof Reponses]?: (Reponses[K] | undefined)[] } = {
  effectifDetail: [undefined, 'Oui, moins de 5', 'Oui, 5 ou plus'],
  caution: [undefined, 'oui', 'non', 'ne-sais-pas'],
  regime: [undefined, 'communaute', 'separation', 'non-marie', 'ne-sais-pas'],
  patrimoine: [undefined, 'proprietaire', 'locataire'],
  vente: [undefined, 'oui', 'peut-etre', 'non'],
  montantDettes: [undefined, 'moins-10k', '10k-50k', '50k-200k', '200k-1m', 'plus-1m'],
  ageDirigeant: [undefined, 'moins-25', '25-50', '50-60', 'plus-60'],
  franchise: [undefined, 'oui', 'non'],
  antecedents: [undefined, 'oui', 'non', 'ne-sais-pas'],
  pgeEnCours: [undefined, 'oui', 'non', 'ne-sais-pas'],
  rqth: [undefined, 'oui', 'non'],
  conjointStatut: [undefined, 'salarie', 'collaborateur', 'associe', 'aucun', 'sans-conjoint'],
  coGerants: [undefined, 'oui', 'non', 'sans-objet'],
  saisonnalite: [undefined, 'oui', 'non'],
  nationalite: [undefined, 'fr-ue-eee-suisse', 'hors-ue', 'sans-reponse'],
};
// Pas premiers distincts : chaque champ tourne indépendamment des autres.
const PAS = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61];

function optionnels(i: number): Partial<Reponses> {
  const out: Partial<Reponses> = {};
  Object.entries(OPTIONNELS).forEach(([cle, valeurs], k) => {
    const v = valeurs![(i * PAS[k] + k * 3) % valeurs!.length];
    if (v !== undefined) (out as Record<string, unknown>)[cle] = v;
  });
  return out;
}

/** Codes de catégorie juridique INSEE → libellé via formatForme (comme en prod). */
const FORMES: { code: string; label: string }[] = [
  { code: '1000', label: formatForme('1000') }, // EI (micro compris)
  { code: '5499', label: formatForme('5499') }, // SARL / EURL
  { code: '5710', label: formatForme('5710') }, // SAS / SASU
  { code: '5599', label: formatForme('5599') }, // SA
  { code: '5202', label: formatForme('5202') }, // SNC
  { code: '6540', label: formatForme('6540') }, // SCI
  { code: '5485', label: formatForme('5485') }, // SELARL
  { code: '5785', label: formatForme('5785') }, // SELAS
  { code: '9220', label: formatForme('9220') }, // association
  { code: '6317', label: formatForme('6317') }, // coopérative agricole
  { code: '6598', label: formatForme('6598') }, // EARL
  { code: '6533', label: formatForme('6533') }, // GAEC
  { code: '6597', label: formatForme('6597') }, // SCEA
  { code: '5458', label: formatForme('5458') }, // SCOP SARL
  { code: '6585', label: formatForme('6585') }, // SCP
  { code: '6220', label: formatForme('6220') }, // GIE
  { code: '', label: formatForme('') }, // Non renseignée
  // Libellés hors INSEE (autre source éventuelle) pour atteindre micro / EIRL
  { code: 'micro', label: 'Micro-entrepreneur' },
  { code: 'eirl', label: 'EIRL' },
];

const NAFS: { naf: string; quoi: string }[] = [
  { naf: '43.21A', quoi: 'BTP électricien' },
  { naf: '56.10A', quoi: 'restaurant' },
  { naf: '47.11B', quoi: 'commerce alimentaire' },
  { naf: '47.73Z', quoi: 'pharmacie' },
  { naf: '01.11Z', quoi: 'céréales' },
  { naf: '03.11Z', quoi: 'pêche' },
  { naf: '86.21Z', quoi: 'médecin généraliste' },
  { naf: '86.90E', quoi: 'kiné / auxiliaire' },
  { naf: '69.10Z', quoi: 'avocat' },
  { naf: '69.20Z', quoi: 'expert-comptable' },
  { naf: '71.11Z', quoi: 'architecte' },
  { naf: '70.22Z', quoi: 'conseil' },
  { naf: '49.41A', quoi: 'fret routier' },
  { naf: '49.32Z', quoi: 'taxi / VTC' },
  { naf: '50.20Z', quoi: 'maritime' },
  { naf: '51.10Z', quoi: 'aérien' },
  { naf: '90.01Z', quoi: 'spectacle vivant' },
  { naf: '62.01Z', quoi: 'informatique' },
  { naf: '68.20A', quoi: 'location immobilière' },
  { naf: '94.99Z', quoi: 'association' },
  { naf: '96.02A', quoi: 'coiffure' },
  { naf: '10.71C', quoi: 'boulangerie' },
  { naf: '88.10A', quoi: 'aide à domicile' },
  { naf: '75.00Z', quoi: 'vétérinaire' },
  { naf: '', quoi: 'NAF absent' },
];

const DATA = organismesData as Record<string, unknown>;
const TERRITOIRES = Object.keys(DATA).sort();
const DOM_CGSS = ['971', '972', '973', '974', '976'];
const COM = ['975', '977', '978', '986', '987', '988'];
const ALSACE_MOSELLE = ['57', '67', '68'];

const VILLES: Record<string, string> = {
  '75': 'Paris', '13': 'Marseille', '69': 'Villeurbanne', '33': 'Bordeaux', '59': 'Roubaix',
  '67': 'Strasbourg', '57': 'Metz', '68': 'Colmar', '2A': 'Ajaccio', '2B': 'Bastia',
  '971': 'Pointe-à-Pitre', '972': 'Fort-de-France', '973': 'Cayenne', '974': 'Saint-Pierre',
  '976': 'Mamoudzou', '975': 'Saint-Pierre', '977': 'Gustavia', '978': 'Marigot',
  '986': 'Mata-Utu', '987': 'Papeete', '988': 'Nouméa', '64': 'Saint-Jean-de-Luz',
};

function codePostal(dep: string): string {
  if (dep === '2A') return '20000';
  if (dep === '2B') return '20200';
  if (dep.length === 3) return `${dep}00`;
  return `${dep}000`;
}

const TRANCHES = ['NN', '00', '01', '02', '03', '11', '12', '21', '22', '31', '32', '41', '42', '51', '52', '53'];

function dateIlYa(annees: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.round(annees * 365.25));
  return d.toISOString().slice(0, 10);
}
const DATES_CREATION = ['', dateIlYa(0.5), dateIlYa(1.5), dateIlYa(3), dateIlYa(6), dateIlYa(12), dateIlYa(40), 'pas-une-date'];

function company(i: number, forme: string, naf: string, dep: string): CompanyData {
  const tranche = TRANCHES[(i * 5) % TRANCHES.length];
  const villeVide = i % 9 === 4; // de temps en temps, pas de ville (repli « votre ville »)
  return {
    siret: String(10_000_000_000_000 + i).slice(0, 14),
    nom: i % 7 === 0 ? 'Votre entreprise' : `Entreprise Test ${i}`,
    formeJuridique: forme,
    naf,
    dateCreation: DATES_CREATION[(i * 3) % DATES_CREATION.length],
    effectif: libelleTrancheEffectif(tranche),
    adresse: '1 rue de la Paix',
    codePostal: codePostal(dep),
    ville: villeVide ? '' : (VILLES[dep] ?? `Ville-${dep}`),
    departement: dep,
    fetched: true,
  };
}

const descProfil = (r: Reponses, c: CompanyData) =>
  `${r.situation}/${r.probleme}/${r.effectif}/${r.moral} · forme="${c.formeJuridique}" · NAF=${c.naf || '∅'} · dép=${c.departement} · effectif INSEE="${c.effectif}" · création=${c.dateCreation || '∅'} · options=${JSON.stringify(
    Object.fromEntries(Object.entries(r).filter(([k]) => !['situation', 'probleme', 'effectif', 'moral'].includes(k))),
  )}`;

// ─────────────────────────────────────────────────────────────
// Contrôles de texte génériques
// ─────────────────────────────────────────────────────────────

const ACCENTS_MANQUANTS = /\b(procedure|procedures|creancier|creanciers|societe|societes|tresorerie|echeance|echeances|delai|delais|deja|etre|annee|numero|telephone|reponse|securite|debiteur|benefici\w*|redressement judiciare|liquidaton|reglement|negociation|hypotheque|mediation|medecin|regime|eligible|ecrit|etat|pret|prets|frais d'avocats)\b/i;

function controlesTexte(texte: string, profil: string, origine: string, opts: { placeholders?: boolean } = {}) {
  const t = texte;
  verif(!/\bundefined\b/.test(t), 'TXT-undefined', 'texte', `« undefined » affiché (${origine})`, profil, contexte(t, /\bundefined\b/));
  verif(!/\bNaN\b/.test(t), 'TXT-NaN', 'texte', `« NaN » affiché (${origine})`, profil, contexte(t, /\bNaN\b/));
  verif(!/\bnull\b/.test(t), 'TXT-null', 'texte', `« null » affiché (${origine})`, profil, contexte(t, /\bnull\b/));
  verif(!/\[object /.test(t), 'TXT-object', 'texte', `« [object …] » affiché (${origine})`, profil, contexte(t, /\[object /));
  if (!opts.placeholders) {
    verif(!/\{\{|\}\}/.test(t), 'TXT-moustaches', 'texte', `Gabarit « {{…}} » non remplacé (${origine})`, profil, contexte(t, /\{\{|\}\}/));
  }
  verif(!/\(\s*\)/.test(t), 'TXT-parentheses-vides', 'texte', `Parenthèses vides (${origine})`, profil, contexte(t, /\(\s*\)/));
  const doublon = /\b([A-ZÀ-Ü][\wÀ-ÿ'’-]{2,}), \1\b/.exec(t);
  verif(!doublon, 'TXT-doublon-liste', 'texte', `Élément répété dans une liste (ex. « APESA, APESA ») (${origine})`, profil, doublon ? contexte(t, new RegExp(doublon[0])) : '');
  const motRepete = /\b(de|la|le|les|des|du|et|à|au|en|pour|votre|vos)\s+\1\b/i.exec(t);
  verif(!motRepete, 'TXT-mot-repete', 'texte', `Mot répété (« de de », « la la »…) (${origine})`, profil, motRepete ? contexte(t, new RegExp(motRepete[0])) : '');
  verif(!/ [,.](?![\da-z])/.test(t), 'TXT-espace-avant-ponctuation', 'mineur', `Espace avant virgule ou point (${origine})`, profil, contexte(t, / [,.](?![\da-z])/));
  verif(!/(?<!\.)\.\.(?!\.)/.test(t.replace(/https?:\/\/\S+/g, '')), 'TXT-double-point', 'mineur', `Double point « .. » (${origine})`, profil, contexte(t, /(?<!\.)\.\.(?!\.)/));
  const sansUrl = t.replace(/https?:\/\/\S+|[\w.-]+\.(fr|com|org|gouv\.fr|eu|nc|pf)\S*/g, '');
  const acc = ACCENTS_MANQUANTS.exec(sansUrl);
  verif(!acc, 'TXT-accent', 'mineur', `Accent manquant probable (${origine})`, profil, acc ? contexte(sansUrl, new RegExp(`\\b${acc[0]}\\b`)) : '');
  verif(!/\bCdte\b/.test(t), 'TXT-coquille-Cdte', 'texte', `Coquille « Cdte du travail » (${origine})`, profil, contexte(t, /Cdte/));
  verif(!/ {2,}-  | - (?=[a-zé])/.test(t), 'TXT-tiret', 'mineur', `Tiret simple entouré d'espaces au lieu d'un tiret cadratin (${origine})`, profil, contexte(t, / - /));
}

function contexte(t: string, re: RegExp): string {
  const m = re.exec(t);
  if (!m) return '';
  return t.slice(Math.max(0, m.index - 120), m.index + 160).replace(/\s+/g, ' ');
}

function controleUrl(url: string, profil: string, origine: string) {
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('tel:') || url.startsWith('mailto:')) return;
  let ok = false;
  try {
    const u = new URL(url);
    ok = u.protocol === 'https:' && /\./.test(u.hostname) && !/\s/.test(url);
  } catch {
    ok = false;
  }
  verif(ok, 'URL-invalide', 'texte', `URL non https ou mal formée (${origine})`, profil, url);
}

/** Numéros français plausibles : 10 chiffres (0X…), numéros courts 3xxx / 15 / 39xx, +33/+262…/+687/+689/+681/+508. */
function telephonePlausible(tel: string): boolean {
  const n = tel.replace(/[\s.]/g, '');
  if (/^0[1-9]\d{8}$/.test(n)) return true;
  if (/^(15|17|18|112|114|115|119|3[0-9]{3})$/.test(n)) return true;
  if (/^\+(33|262|590|594|596|269|508|681|687|689)\d{6,9}$/.test(n)) return true;
  return false;
}

function controleTelephone(tel: string, profil: string, origine: string) {
  verif(telephonePlausible(tel), 'TEL-invalide', 'texte', `Numéro de téléphone non plausible (${origine})`, profil, tel);
}

function textesStrategie(s: Strategie): string[] {
  return [s.titre, s.verdict, ...s.pourquoi, ...s.etapes, ...s.alternatives];
}

function cartesTextes(groupes: GroupeOrganismes[]): string[] {
  return groupes.flatMap((g) => [g.titre, ...g.cartes.flatMap((c) => [c.nom, c.type, c.badge ?? '', c.adresse ?? '', c.telephoneNote ?? ''])]);
}

// ─────────────────────────────────────────────────────────────
// Construction d'une fiche (mêmes appels que app/fiche/[token]/page.tsx)
// ─────────────────────────────────────────────────────────────

function construireFiche(r: Reponses, c: CompanyData) {
  const sector = getSectorInfo(c);
  const companyAge = getCompanyAge(c.dateCreation);
  const seuils = getEffectifSeuils(c.effectif);
  const dep = getDepartement(c.departement);
  const juridiction = getJuridiction(c);
  const groupesBase = buildOrganismes(dep, r, [], sector.secteur, c.effectif, juridiction);
  const ordres = buildOrdresProfessionnels(sector);
  const groupes = [
    ...groupesBase,
    ...(ordres ? [ordres] : []),
    buildSoutien(r),
    buildAidesPersonnelles(r),
    ...buildReseauxSpecifiques(r, sector),
  ];
  const alertes = computeAlertes([], [], r.situation, { bodaccDisponible: true });
  return { sector, companyAge, seuils, dep, juridiction, groupes, groupesBase, alertes };
}

// ─────────────────────────────────────────────────────────────
// 1. Couche moteur
// ─────────────────────────────────────────────────────────────

function controlerMoteur(r: Reponses, c: CompanyData) {
  const profil = descProfil(r, c);
  compteurs.profilsMoteur++;
  let fiche: ReturnType<typeof construireFiche>;
  try {
    fiche = construireFiche(r, c);
  } catch (e) {
    verif(false, 'EXC-moteur', 'bloquant', 'Exception dans le moteur', profil, String(e));
    return;
  }
  const { sector, seuils, dep, juridiction, groupes, groupesBase } = fiche;
  const forme = getFormeDetail(c.formeJuridique);

  verif(!!dep, 'DEP-introuvable', 'bloquant', 'Département absent de data/organismes.json', profil, c.departement);

  // Stratégie
  let strat: ReturnType<typeof resolveStrategie> = null;
  try {
    strat = resolveStrategie(r, c);
  } catch (e) {
    verif(false, 'EXC-strategie', 'bloquant', 'Exception dans resolveStrategie', profil, String(e));
  }
  if (!verif(!!strat, 'STRAT-absente', 'bloquant', 'Aucune stratégie recommandée', profil)) return;
  const { main, secondary } = strat!;

  // L620-1 : pas de sauvegarde en cessation des paiements
  if (estEnCessation(r)) {
    verif(main.axe !== 'sauvegarder' && secondary?.axe !== 'sauvegarder', 'JUR-sauvegarde-cessation', 'juridique',
      'Sauvegarde proposée à un débiteur en cessation des paiements (L620-1)', profil, `${main.axe} / ${secondary?.axe}`);
  }

  // PRP (L645-1) : personne physique, aucun salarié depuis 6 mois
  const prpPropose = main.axe === 'rebondir' || secondary?.axe === 'rebondir';
  if (prpPropose) {
    verif(r.effectif !== 'salaries', 'JUR-PRP-salaries', 'juridique',
      'Rétablissement professionnel (PRP) proposé alors que l\'entreprise a des salariés (L645-1 : aucun salarié dans les 6 derniers mois)', profil,
      `${main.axe === 'rebondir' ? 'axe principal' : 'axe secondaire'} : ${(main.axe === 'rebondir' ? main : secondary!).verdict}`);
    verif(forme !== 'societe', 'JUR-PRP-societe', 'juridique', 'PRP proposé à une société (réservé aux personnes physiques)', profil, c.formeJuridique);
  }
  // Liquidation / PRP sans cessation des paiements (L640-1, L645-1)
  if (!estEnCessation(r)) {
    verif(main.axe !== 'liquider', 'JUR-liquidation-sans-cessation', 'juridique',
      'Liquidation judiciaire recommandée comme cap principal alors que le dirigeant ne se déclare pas en cessation des paiements (L640-1 exige la cessation des paiements)', profil,
      `situation=${r.situation} · ${main.verdict.slice(0, 160)}`);
    verif(main.axe !== 'rebondir', 'JUR-PRP-sans-cessation', 'juridique',
      'Rétablissement professionnel (PRP) recommandé comme cap principal alors que le dirigeant ne se déclare pas en cessation des paiements (L645-1 renvoie aux conditions de la liquidation : cessation + redressement manifestement impossible)', profil,
      `situation=${r.situation} · ${main.verdict.slice(0, 160)}`);
  }
  // Cohérence des « pourquoi » avec les réponses
  for (const st of [main, secondary].filter(Boolean) as Strategie[]) {
    if (st.pourquoi.some((p) => p.startsWith('Votre moral et votre volonté de continuer'))) {
      verif(r.moral === 'combatif', 'CTR-pourquoi-moral', 'contradiction',
        'Stratégie « Restructurer » en cessation : « Votre moral et votre volonté de continuer sont des atouts forts » affiché à un·e dirigeant·e qui s\'est déclaré·e épuisé·e ou perdu·e', profil, `moral=${r.moral}`);
    }
    if (st.axe === 'ceder') {
      verif(r.vente !== 'non', 'CTR-ceder-vente-non', 'contradiction',
        'Cession proposée (cap ou alternative) avec « Vous y êtes ouvert·e » alors que le dirigeant a répondu « non » à la vente', profil, `${st === main ? 'cap principal' : 'alternative'} · vente=${r.vente}`);
    }
    if (st.axe === 'liquider' && st.pourquoi.some((p) => p.startsWith('Même avec cautions'))) {
      verif(r.caution === 'oui', 'TXT-liquider-cautions', 'mineur', 'Liquidation : « Même avec cautions… » affiché alors que le dirigeant n\'a pas déclaré de caution (ne sait pas / pas répondu)', profil, `caution=${r.caution}`);
    }
  }

  // Tribunal : la stratégie cite « tribunal de commerce de <ville> »
  const textesS = [...textesStrategie(main), ...(secondary ? textesStrategie(secondary) : [])];
  const tribunalStrat = textesS.join(' ').match(/tribunal (de commerce|judiciaire) de [^—,.;]+/)?.[0];
  if (tribunalStrat) {
    if (ALSACE_MOSELLE.includes(c.departement) && /de commerce/.test(tribunalStrat)) {
      verif(false, 'CTR-tribunal-alsace-moselle', 'contradiction',
        'Alsace-Moselle : la stratégie cite un « tribunal de commerce » alors qu\'il n\'en existe pas (chambre commerciale du tribunal judiciaire, comme l\'indique la carte Organismes)', profil, tribunalStrat);
    }
    if ([...DOM_CGSS, ...COM].includes(c.departement) && /de commerce/.test(tribunalStrat)) {
      verif(false, 'CTR-tribunal-outremer', 'contradiction',
        'Outre-mer : la stratégie cite « tribunal de commerce de <ville> » alors que la carte Organismes indique un tribunal mixte de commerce (ou TPI)', profil, tribunalStrat);
    }
    const typeLocal = (dep as { tribunal?: { type?: string } } | null)?.tribunal?.type ?? '';
    // Professions du droit (NAF 69.10) : exclues des TAE, restent au tribunal judiciaire.
    const professionDuDroit = /^69\.?10/.test(c.naf) && /tribunal judiciaire de votre ressort/.test(tribunalStrat);
    if (/activit[ée]s [ée]conomiques/i.test(typeLocal) && !professionDuDroit) {
      verif(false, 'CTR-tribunal-TAE', 'contradiction',
        'Ressort d\'un tribunal des activités économiques : la stratégie cite « tribunal de commerce/judiciaire de <ville> » alors que la carte Organismes indique le TAE', profil, `${tribunalStrat} ≠ ${typeLocal}`);
    }
    verif(!/de votre ville/.test(tribunalStrat), 'TXT-tribunal-votre-ville', 'mineur', 'Tribunal « de votre ville » (ville inconnue)', profil, tribunalStrat);
  }

  // Cartes prioritaires
  let cartes: ReturnType<typeof scorePriorityCards> = [];
  try {
    cartes = scorePriorityCards({ reponses: r, company: c, sector, seuils });
  } catch (e) {
    verif(false, 'EXC-cartes', 'bloquant', 'Exception dans scorePriorityCards', profil, String(e));
  }
  verif(cartes.length === 4, 'CARTES-pas-4', 'mineur', 'Moins de 4 cartes prioritaires (grille prévue pour 4)', profil, cartes.map((x) => x.id).join(', '));
  verif(new Set(cartes.map((x) => x.id)).size === cartes.length, 'CARTES-doublon', 'bloquant', 'Carte prioritaire en double', profil, cartes.map((x) => x.id).join(', '));
  const carteCess = cartes.find((x) => x.id === 'cessation');
  if (carteCess) verif(estEnCessation(r), 'CARTES-cessation-hors', 'contradiction', 'Carte « 45 jours » hors cessation', profil);
  if (cartes.some((x) => x.id === 'cautions')) verif(r.caution === 'oui', 'CARTES-caution', 'contradiction', 'Carte cautions sans caution déclarée', profil);

  // Organismes
  verif(groupesBase.every((g) => g.cartes.length > 0) || groupesBase.length > 0, 'ORG-vide', 'bloquant', 'Groupe d\'organismes vide', profil);
  const inst = groupesBase.find((g) => g.cle === 'institutionnel');
  verif(!!inst?.cartes.some((x) => /tribunal/i.test(x.nom)), 'ORG-sans-tribunal', 'contradiction', 'Pas de carte tribunal dans les organismes', profil, c.departement);
  const carteTrib = inst?.cartes.find((x) => /tribunal/i.test(x.nom));
  if (juridiction === 'TJ' && carteTrib) {
    verif(!/^Tribunal de commerce|Tribunal mixte de commerce/.test(carteTrib.nom), 'CTR-carte-tribunal-TJ', 'contradiction',
      'Débiteur relevant du tribunal judiciaire mais carte « tribunal de commerce »', profil, carteTrib.nom);
  }
  const social = groupesBase.find((g) => g.cle === 'social');
  const ags = !!social?.cartes.some((x) => x.nom === 'AGS');
  verif(ags === (r.effectif === 'salaries'), 'ORG-AGS', 'contradiction', 'AGS proposé sans salariés (ou absent avec salariés)', profil);
  // Organismes ultramarins
  // Marins-pêcheurs : ENIM, y compris outre-mer (régime spécial des marins).
  if (DOM_CGSS.includes(c.departement) && r.probleme === 'urssaf' && sector.secteur !== 'peche') {
    const fin = groupesBase.find((g) => g.cle === 'financier');
    verif(!!fin?.cartes.some((x) => /CGSS|CSSM/.test(x.nom)), 'DOM-pas-CGSS', 'juridique', 'DOM : la caisse de recouvrement n\'est pas la CGSS/CSSM', profil, fin?.cartes.map((x) => x.nom).join(' | '));
  }
  // Réseaux selon l'âge
  const cles = groupes.map((g) => g.cle);
  if (r.ageDirigeant === 'plus-60') verif(!cles.includes('reseaux-jeunes'), 'AGE-jeunes-senior', 'contradiction', 'Réseaux jeunes proposés à un·e dirigeant·e de plus de 60 ans', profil);
  if (r.ageDirigeant === 'moins-25') verif(!cles.includes('reseaux-seniors'), 'AGE-seniors-jeune', 'contradiction', 'Réseaux seniors proposés à un·e dirigeant·e de moins de 25 ans', profil);
  if (r.effectif === 'independant') {
    // ATI / CSP / AGS
    verif(!groupes.some((g) => g.cartes.some((x) => /^AGS$/.test(x.nom))), 'ORG-AGS-indep', 'contradiction', 'AGS dans les organismes d\'un·e indépendant·e sans salarié', profil);
  }

  for (const g of groupes) {
    const noms = g.cartes.map((x) => x.nom);
    verif(new Set(noms).size === noms.length, 'ORG-doublon', 'mineur', `Organisme en double dans le groupe « ${g.titre} »`, profil, noms.join(' | '));
    for (const x of g.cartes) {
      if (x.site) controleUrl(x.site, profil, `organisme ${x.nom}`);
      if (x.telephone) controleTelephone(x.telephone, profil, `organisme ${x.nom}`);
    }
  }

  // Secteur / OPCO / aides régionales
  const opco = getOpcoFromNaf(c.naf);
  verif(!!opco?.nom, 'OPCO-absent', 'mineur', 'OPCO introuvable', profil, c.naf);
  if (opco.site) controleUrl(opco.site, profil, `OPCO ${opco.nom}`);
  const region = getAidesRegionales(c.departement);
  verif(!!region || COM.includes(c.departement), 'REGION-absente', 'contradiction', 'Département sans région (aides régionales)', profil, c.departement);
  for (const a of region?.aides ?? []) if (a.site) controleUrl(a.site, profil, `aide régionale ${a.nom}`);
  for (const s of sector.syndicats) if (s.site) controleUrl(s.site, profil, `syndicat ${s.nom}`);

  // Ton
  const ton = getTonePreset(r.moral);
  verif(!!ton.intro, 'TON-absent', 'bloquant', 'Préréglage de ton absent', profil);

  // Textes moteur
  const textes = [
    ...textesS,
    ...cartes.flatMap((x) => [x.label, x.valeur, x.detail]),
    ...cartesTextes(groupes),
    ...sector.conseilsSpecifiques,
    ...sector.aidesSpecifiques.flatMap((a) => [a.nom, a.description]),
    ...(region?.aides ?? []).flatMap((a) => [a.nom, a.description]),
    opco.nom,
    opco.description,
  ].join('\n');
  controlesTexte(textes, profil, 'moteur');
}

// ─────────────────────────────────────────────────────────────
// 2. Fiche rendue
// ─────────────────────────────────────────────────────────────

function texteVisible(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<(br|\/p|\/li|\/div|\/h\d|\/dt|\/dd|\/section)[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function blocPresent(html: string, titre: string): boolean {
  return html.includes(titre);
}

function controlerRendu(r: Reponses, c: CompanyData) {
  const profil = descProfil(r, c);
  compteurs.profilsRendus++;
  const f = construireFiche(r, c);
  let html = '';
  try {
    html = renderToStaticMarkup(
      createElement(LayoutDashboard, {
        token: 'simulation',
        company: c,
        reponses: r,
        sector: f.sector,
        alertes: f.alertes,
        bodacc: [],
        infogreffe: [],
        bodaccIndisponible: false,
        groupes: f.groupes,
        companyAge: f.companyAge,
        seuils: f.seuils,
      }),
    );
  } catch (e) {
    verif(false, 'EXC-rendu', 'bloquant', 'Exception au rendu de la fiche', profil, String(e));
    return;
  }
  const texte = texteVisible(html);
  const plat = texte.replace(/\s+/g, ' ');
  controlesTexte(plat, profil, 'fiche rendue');

  // Mots collés par JSX (« </strong>équivalente »)
  for (const [re, code, msg] of [
    [/[A-Za-zÀ-ÿ]<\/(strong|em|b)>[A-Za-zÀ-ÿ]/g, 'TXT-mots-colles', 'Mots collés (espace perdu entre une balise de mise en gras et le texte suivant)'],
    [/[A-Za-zÀ-ÿ]<(strong|em|b)>[A-Za-zÀ-ÿ]/g, 'TXT-mots-colles-avant', 'Mots collés (espace perdu avant une balise de mise en gras)'],
  ] as [RegExp, string, string][]) {
    const vus = [...html.matchAll(re)];
    if (vus.length === 0) verif(true, code, 'texte', msg, profil);
    for (const m of vus) {
      verif(false, code, 'texte', msg, profil, texteVisible(html.slice(Math.max(0, m.index! - 160), m.index! + 80)).replace(/\s+/g, ' ').slice(-140));
    }
  }

  // Liens
  for (const m of html.matchAll(/href="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith('tel:')) {
      verif(/^tel:\+?\d{2,15}$/.test(href), 'LIEN-tel-invalide', 'texte', 'Lien téléphone invalide (tel: sans numéro)', profil, href);
    } else controleUrl(href, profil, 'lien de la fiche');
  }
  for (const m of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) {
    verif(/rel="noreferrer"/.test(m[0]), 'LIEN-rel', 'mineur', 'Lien externe sans rel="noreferrer"', profil, m[0]);
  }

  // Mode perdu
  const modePerdu = plat.includes('On commence par 3 choses');
  verif(modePerdu === (r.moral === 'perdu'), 'PERDU-mode', 'contradiction', 'Mode « perdu » affiché alors que moral ≠ perdu (ou absent)', profil);

  // CSP / AGS / reclassement seulement avec salariés
  const csp = blocPresent(html, 'CSP — Contrat de Sécurisation Professionnelle');
  verif(!csp || r.effectif === 'salaries', 'CSP-sans-salaries', 'contradiction', 'Bloc CSP affiché sans salariés', profil);
  verif(!plat.includes('Vérifier vos obligations AGS') || r.effectif === 'salaries', 'AGS-sans-salaries', 'contradiction', 'Checklist AGS sans salariés', profil);
  if (r.effectif === 'independant' && r.conjointStatut === 'salarie') {
    verif(plat.includes('il·elle compte dans l\'effectif'), 'CTR-conjoint-salarie-sans-salaries', 'mineur',
      'Réponses incohérentes acceptées : « sans salarié » mais conjoint·e « salarié·e » — la fiche affiche AGS/CSP pour le conjoint sans signaler l\'incohérence', profil);
  }

  // Nationalité
  verif(blocPresent(html, 'Titre de séjour') === (r.nationalite === 'hors-ue'), 'NAT-bloc', 'contradiction', 'Bloc titre de séjour incohérent avec la nationalité déclarée', profil);

  // Tribunal : un débiteur TJ ne doit pas être envoyé au « tribunal de commerce »
  if (f.juridiction === 'TJ') {
    const phrases = [
      'Identifier votre tribunal de commerce',
      'Une assignation devant le tribunal de commerce',
    ];
    for (const p of phrases) {
      verif(!plat.includes(p), 'CTR-TJ-tribunal-de-commerce', 'contradiction',
        'Débiteur relevant du tribunal judiciaire (agriculteur, libéral en nom propre, société civile, association…) mais la fiche l\'oriente vers le « tribunal de commerce » (checklist / prescription), alors que la carte Organismes et la stratégie disent « tribunal judiciaire » — art. L621-2 C. com.',
        profil, contexte(plat, new RegExp(p)));
    }
  }

  // Calendrier : échéance des 45 jours affichée hors cessation
  if (r.situation === 'prevention') {
    verif(!plat.includes('Délai légal maximum pour déclarer la cessation des paiements'), 'JUR-calendrier-45j-prevention', 'juridique',
      'Calendrier : « délai légal maximum pour déclarer la cessation des paiements » daté à J+45 pour un dirigeant qui n\'est pas en cessation (le délai de L631-4 court à partir de la cessation, pas d\'aujourd\'hui)', profil, contexte(plat, /Délai légal maximum/));
  }

  // Mandat ad hoc présenté comme possible en cessation < 45 j (BlocPrescription)
  verif(!plat.includes('pas en cessation des paiements depuis plus de 45 jours, vous pouvez demander un mandat ad hoc'), 'JUR-mandat-ad-hoc-45j', 'juridique',
    'Mandat ad hoc présenté comme ouvert « tant que la cessation des paiements date de moins de 45 jours » : le mandat ad hoc suppose de ne pas être en cessation des paiements (seule la conciliation est ouverte jusqu\'à 45 j, L611-4) — contredit le bloc « Procédures » de la même fiche', profil, contexte(plat, /vous pouvez demander un mandat ad hoc/));

  // PRP proposé dans « Procédures » avec salariés
  if (r.effectif === 'salaries') {
    verif(!plat.includes('Rétablissement professionnel (PRP)Option possible') && !/Rétablissement professionnel \(PRP\)\s*Option possible/.test(plat), 'JUR-PRP-procedures-salaries', 'juridique',
      'Bloc « Procédures » : PRP proposé comme option alors que l\'entreprise a des salariés (L645-1)', profil, contexte(plat, /Rétablissement professionnel \(PRP\)/));
  }

  // Patrimoine : déclaration d'insaisissabilité conseillée à un dirigeant de société
  if (getFormeDetail(c.formeJuridique) === 'societe' && r.patrimoine === 'proprietaire') {
    verif(!/déclaration d.insaisissabilité (préventive|sur vos autres biens|peut être possible)|Elle peut être déclarée chez un notaire/.test(plat), 'JUR-insaisissabilite-societe', 'juridique',
      'Dirigeant·e de société : la fiche conseille une déclaration notariée d\'insaisissabilité (L526-1), réservée aux entrepreneurs individuels — et la carte « Patrimoine » de la même fiche dit l\'inverse', profil, contexte(plat, /déclaration d.insaisissabilité/));
  }
  // Patrimoine : EI — biens personnels autres que la résidence « premières cibles »
  if (getFormeDetail(c.formeJuridique) !== 'societe' && r.patrimoine === 'proprietaire') {
    verif(!plat.includes('Ils sont les premières cibles des créanciers'), 'JUR-EI-patrimoine-2022', 'juridique',
      'Entrepreneur individuel : la cartographie dit que les biens immobiliers hors résidence sont « les premières cibles des créanciers », sans tenir compte de la séparation de plein droit des patrimoines (loi du 14 février 2022, art. L526-22 C. com.) qui protège tout le patrimoine personnel des créanciers professionnels', profil, contexte(plat, /premières cibles/));
  }
  // Sociétés à risque illimité (SNC, sociétés civiles) : « risque limité à l'entreprise »
  if (/nom collectif|soci[ée]t[ée] civile|\bSCI\b|\bSCP\b|GAEC|SCEA/i.test(c.formeJuridique) && r.caution !== 'oui') {
    verif(!plat.includes("le risque est limité à l'entreprise"), 'JUR-responsabilite-illimitee', 'juridique',
      'SNC / société civile : la fiche affirme « sans caution, le risque est limité à l\'entreprise », alors que les associés de SNC répondent indéfiniment et solidairement des dettes (art. L221-1 C. com.) et ceux de société civile indéfiniment à proportion de leurs parts (art. 1857 C. civ.)', profil, c.formeJuridique);
  }
  // Conjoint sans statut : présomption
  if (r.conjointStatut === 'aucun') {
    verif(!plat.includes('le conjoint est présumé collaborateur'), 'JUR-conjoint-presume', 'juridique',
      'Conjoint sans statut : la fiche dit « présumé collaborateur » alors que l\'art. L121-4 C. com. (loi PACTE) répute le conjoint avoir choisi le statut de conjoint salarié', profil, contexte(plat, /présumé collaborateur/));
  }
  // Caution « 2297 » (formalisme) au lieu de 2300 (disproportion)
  verif(!plat.includes('(art. 2297 Code civil)'), 'JUR-caution-2297', 'juridique',
    'Bloc « Protection de votre famille » : la disproportion de la caution est rattachée à l\'art. 2297 C. civ. (mention manuscrite) au lieu de l\'art. 2300 — les autres blocs citent bien 2300', profil, contexte(plat, /2297/));

  // URSSAF 3957 en DOM / pour un·e indépendant·e
  const urssaf3957 = /URSSAF \(3957\)|URSSAF[^.]{0,60}au 3957|Moratoire URSSAF \(3957\)/.exec(plat);
  if (urssaf3957 && DOM_CGSS.includes(c.departement)) {
    verif(false, 'CTR-DOM-3957', 'contradiction', 'Outre-mer : la fiche renvoie vers « l\'URSSAF (3957) » alors que la carte Organismes indique la CGSS / CSSM', profil, contexte(plat, /3957/));
  }
  if (r.effectif === 'independant' && /\b3957\b/.test(plat) && !DOM_CGSS.includes(c.departement)) {
    verif(false, 'CTR-indep-3957', 'contradiction', 'Indépendant·e : certains blocs donnent le 3957 (ligne employeurs) alors que la carte Organismes donne le 36 98 (ligne des indépendants)', profil, contexte(plat, /3957/));
  }
  // Agriculture : MSA dans le plan, URSSAF dans les organismes
  if (f.sector.secteur === 'agriculture' && r.probleme === 'urssaf') {
    const fin = f.groupesBase.find((g) => g.cle === 'financier');
    verif(!fin?.cartes.some((x) => x.type === 'URSSAF'), 'CTR-agri-MSA-URSSAF', 'contradiction',
      'Exploitant agricole : le plan d\'action renvoie à la MSA mais la carte Organismes « Financier » propose l\'URSSAF', profil, fin?.cartes.map((x) => x.nom).join(' | '));
  }
  // Collectivités d'outre-mer à régime social propre
  if (['986', '987', '988', '975'].includes(c.departement)) {
    verif(!(r.effectif === 'salaries' && plat.includes('AGS')), 'COM-AGS', 'juridique',
      'Collectivité d\'outre-mer à droit social propre (Nouvelle-Calédonie, Polynésie, Wallis-et-Futuna, Saint-Pierre-et-Miquelon) : la fiche présente l\'AGS, France Travail, l\'URSSAF/CCSF comme en métropole — à vérifier', profil);
  }

  // Carte PGE sans bloc PGE
  if (r.pgeEnCours === 'oui') {
    const cartes = scorePriorityCards({ reponses: r, company: c, sector: f.sector, seuils: f.seuils });
    if (cartes.some((x) => x.id === 'pge')) {
      verif(blocPresent(html, 'PGE en difficulté ? Restructuration possible'), 'CTR-carte-pge-sans-bloc', 'contradiction',
        'Carte prioritaire « PGE en cours » affichée mais le bloc PGE n\'apparaît pas (il n\'est affiché que si problème = banque ou situation = trésorerie)', profil);
    }
  }
  // Plateformes hors plateformes
  if (blocPresent(html, 'Travailleur de plateforme')) {
    verif(/^(49\.32|53\.20)/.test(c.naf), 'PERT-plateformes', 'mineur',
      'Bloc « Travailleur de plateforme — VTC, livraison » affiché pour une activité qui n\'en relève pas (tout le NAF 56.10, 88 et 96 : restaurant, aide à domicile, coiffeur…)', profil, c.naf);
  }

  // Stratégie ↔ procédures recommandées
  const strat = resolveStrategie(r, c)!;
  if (['liquider', 'rebondir'].includes(strat.main.axe) && !estEnCessation(r)) {
    const proc = r.situation === 'prevention' ? 'Mandat ad hoc' : 'Conciliation';
    verif(false, 'CTR-strategie-vs-procedures', 'contradiction',
      `Le cap « ${strat.main.titre} » (stratégie) contredit le bloc « Procédures » qui recommande « ${proc} » pour la même fiche`, profil);
  }
}

// ─────────────────────────────────────────────────────────────
// 3. Courriers, BODACC, ICS
// ─────────────────────────────────────────────────────────────

function controlerCourriers() {
  const details = [undefined, 'Oui, moins de 5', 'Oui, 5 ou plus', 'Non, seul·e'];
  for (const t of COURRIERS) {
    for (const situation of SITUATIONS) for (const moral of MORAUX) for (const effectif of EFFECTIFS) for (const probleme of PROBLEMES) for (const effectifDetail of details) {
      compteurs.courriers++;
      const profil = `courrier ${t.slug} · ${situation}/${moral}/${effectif}/${probleme}/${effectifDetail ?? '∅'}`;
      let p;
      try {
        p = personalizeCourrier(t, { situation, moral, effectif, probleme, effectifDetail });
      } catch (e) {
        verif(false, 'EXC-courrier', 'bloquant', 'Exception dans personalizeCourrier', profil, String(e));
        continue;
      }
      const tout = [p.objet, p.corps, p.conseil ?? ''].join('\n');
      controlesTexte(tout, profil, `courrier ${t.slug}`, { placeholders: true });
      const ouvertes = (tout.match(/\{\{/g) ?? []).length;
      const fermees = (tout.match(/\}\}/g) ?? []).length;
      verif(ouvertes === fermees && !/\{\{(?![A-Z0-9_]+\}\})/.test(tout), 'COUR-gabarit', 'texte', 'Champ à compléter mal formé', profil, contexte(tout, /\{\{/));
      verif(!/\n{3,}/.test(p.corps), 'COUR-lignes-vides', 'mineur', 'Lignes vides multiples dans le courrier', profil);
      verif(!/ {2,}/.test(p.corps), 'COUR-double-espace', 'mineur', 'Double espace dans le corps du courrier', profil, contexte(p.corps, / {2,}/));
      if (p.closing) {
        const iClosing = p.corps.indexOf(p.closing);
        const iFormule = p.corps.search(/je vous prie d.agr|veuillez agr|cordialement/i);
        verif(iFormule === -1 || iClosing < iFormule, 'COUR-closing-apres-formule', 'texte', 'Phrase de clôture insérée après la formule de politesse', profil, contexte(p.corps, /agréer|Cordialement/));
      }
      verif(!/\bmobilisé\b|\baccompagné pour\b/.test(p.corps), 'COUR-genre', 'mineur', 'Formulation non inclusive (« mobilisé », « accompagné ») alors que l\'UI est inclusive', profil, contexte(p.corps, /mobilisé|accompagné pour/));
      if (effectif === 'independant') {
        verif(!/\(3957\)/.test(p.conseil ?? ''), 'COUR-conseil-3957-indep', 'contradiction', 'Conseil du courrier URSSAF : « appelez votre URSSAF (3957) » pour un·e indépendant·e (36 98)', profil, p.conseil ?? '');
      }
      verif(!(effectifDetail === 'Non, seul·e' && effectif === 'salaries' && /compte Non/.test(p.corps)), 'COUR-effectif', 'texte', 'Effectif mal reformulé', profil, contexte(p.corps, /compte/));
    }
  }
}

function controlerBodacc() {
  const recent = new Date(Date.now() - 20 * 86400000).toISOString().slice(0, 10);
  const ancien = new Date(Date.now() - 800 * 86400000).toISOString().slice(0, 10);
  const jeux: { nom: string; bodacc: BodaccItem[]; infogreffe: BodaccItem[] }[] = [
    { nom: 'vide', bodacc: [], infogreffe: [] },
    { nom: 'procédure récente', bodacc: [{ type: 'Procédures collectives', date: recent }], infogreffe: [{ type: 'Procédures collectives', date: recent }] },
    { nom: 'annonce ancienne', bodacc: [{ type: 'Modifications diverses', date: ancien }], infogreffe: [] },
    { nom: 'date manquante', bodacc: [{ type: 'Annonce', date: '' }], infogreffe: [{ type: 'Procédures collectives', date: '' }] },
  ];
  for (const s of SITUATIONS) for (const j of jeux) for (const dispo of [true, false]) {
    compteurs.bodacc++;
    const profil = `BODACC ${s} · ${j.nom} · ${dispo ? 'disponible' : 'indisponible'}`;
    const a = computeAlertes(j.bodacc, j.infogreffe, s, { bodaccDisponible: dispo });
    verif(a.length > 0 && a.length <= 3, 'BODACC-nombre', 'mineur', 'Nombre d\'alertes hors 1..3', profil, String(a.length));
    const tout = a.map((x) => `${x.titre} ${x.message}`).join('\n');
    controlesTexte(tout, profil, 'alertes BODACC');
    if (!dispo) verif(!/plutôt bon signe/.test(tout), 'BODACC-bon-signe', 'contradiction', '« Plutôt bon signe » alors que le BODACC n\'a pas répondu', profil);
  }
}

function controlerIcs() {
  const longue = 'Article L631-4 du Code de commerce : obligation de déclarer dans les 45 jours à peine de sanctions (L651-2, L653-1, L654-1 et s.).';
  const ics = buildIcs([
    { uid: 'a', title: 'Déclaration de cessation des paiements — dernier jour', description: longue, date: new Date(), alarmHoursBefore: 24 },
    { uid: 'b', title: 'Audience; tribunal, Paris', description: 'Ligne 1\nLigne 2', date: new Date() },
  ]);
  compteurs.ics++;
  const lignes = ics.split('\r\n');
  verif(ics.includes('\r\n') && !/[^\r]\n/.test(ics), 'ICS-crlf', 'texte', 'Fins de ligne ICS non CRLF', 'ICS');
  const tropLongues = lignes.filter((l) => Buffer.byteLength(l, 'utf8') > 75);
  verif(tropLongues.length === 0, 'ICS-75-octets', 'mineur', 'Lignes ICS de plus de 75 octets non repliées (RFC 5545 §3.1) — la plupart des agendas tolèrent, certains tronquent', 'ICS rappels', tropLongues[0] ?? '');
  verif(/SUMMARY:Audience\\; tribunal\\, Paris/.test(ics), 'ICS-echappement', 'texte', 'Échappement ICS incorrect', 'ICS');
}

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────

const RAPPORT = process.env.SIMULATION_RAPPORT ?? path.join(os.tmpdir(), 'solelis-simulation-rapport.json');

describe('Simulation de profils — moteur', () => {
  it('produit cartésien situation × problème × effectif × moral × forme × NAF', () => {
    let i = 0;
    for (const situation of SITUATIONS) for (const probleme of PROBLEMES) for (const effectif of EFFECTIFS) for (const moral of MORAUX) {
      for (const forme of FORMES) for (const n of NAFS) {
        const dep = TERRITOIRES[(i * 31) % TERRITOIRES.length];
        const r: Reponses = { situation, probleme, effectif, moral, ...optionnels(i) };
        controlerMoteur(r, company(i, forme.label, n.naf, dep));
        i++;
      }
    }
    // Chaque territoire × base (96) avec une forme et un NAF tournants
    for (const dep of TERRITOIRES) {
      for (const situation of SITUATIONS) for (const probleme of PROBLEMES) for (const effectif of EFFECTIFS) for (const moral of MORAUX) {
        const r: Reponses = { situation, probleme, effectif, moral, ...optionnels(i) };
        controlerMoteur(r, company(i, FORMES[i % FORMES.length].label, NAFS[i % NAFS.length].naf, dep));
        i++;
      }
    }
    expect(compteurs.profilsMoteur).toBeGreaterThan(40_000);
    const bloquants = [...CONSTATS.values()].filter((c) => c.gravite === 'bloquant');
    expect(bloquants, JSON.stringify(bloquants, null, 2)).toEqual([]);
  }, 600_000);
});

describe('Simulation de profils — fiche rendue', () => {
  it('rend la fiche complète sur un échantillon couvrant chaque valeur', () => {
    let i = 100_000;
    // 1. Chaque territoire × les 96 combinaisons de base (forme/NAF tournants)
    for (const dep of TERRITOIRES) {
      for (const situation of SITUATIONS) for (const probleme of PROBLEMES) for (const effectif of EFFECTIFS) for (const moral of MORAUX) {
        if ((i + situation.length + probleme.length) % 4 !== 0) { i++; continue; } // ¼ des combinaisons par territoire
        const r: Reponses = { situation, probleme, effectif, moral, ...optionnels(i) };
        controlerRendu(r, company(i, FORMES[(i * 7) % FORMES.length].label, NAFS[(i * 3) % NAFS.length].naf, dep));
        i++;
      }
    }
    // 2. Chaque forme × chaque NAF × 4 situations
    for (const forme of FORMES) for (const n of NAFS) for (const situation of SITUATIONS) {
      const r: Reponses = { situation, probleme: PROBLEMES[i % 4], effectif: EFFECTIFS[i % 2], moral: MORAUX[i % 3], ...optionnels(i) };
      controlerRendu(r, company(i, forme.label, n.naf, TERRITOIRES[(i * 13) % TERRITOIRES.length]));
      i++;
    }
    expect(compteurs.profilsRendus).toBeGreaterThan(2_000);
    const bloquants = [...CONSTATS.values()].filter((c) => c.gravite === 'bloquant');
    expect(bloquants, JSON.stringify(bloquants, null, 2)).toEqual([]);
  }, 600_000);
});

describe('Simulation — courriers, BODACC, ICS', () => {
  it('personnalise les 17 courriers pour tous les contextes', () => {
    controlerCourriers();
    expect(compteurs.courriers).toBe(COURRIERS.length * 4 * 3 * 2 * 4 * 4);
  });
  it('calcule les alertes BODACC', () => {
    controlerBodacc();
    expect(compteurs.bodacc).toBe(32);
  });
  it('génère un fichier ICS', () => {
    controlerIcs();
    expect(compteurs.ics).toBe(1);
  });
});

afterAll(() => {
  const constats = [...CONSTATS.values()]
    .filter((c) => c.message)
    .sort((a, b) => ['bloquant', 'juridique', 'contradiction', 'texte', 'mineur'].indexOf(a.gravite) - ['bloquant', 'juridique', 'contradiction', 'texte', 'mineur'].indexOf(b.gravite) || b.occurrences - a.occurrences);
  const rapport = { date: new Date().toISOString(), compteurs, nbVerifications, nbConstats: constats.length, constats };
  try {
    fs.writeFileSync(RAPPORT, JSON.stringify(rapport, null, 2));
  } catch {}
  console.log(
    `\n[simulation] ${compteurs.profilsMoteur} profils moteur, ${compteurs.profilsRendus} fiches rendues, ${compteurs.courriers} courriers, ${nbVerifications} vérifications, ${constats.length} constats → ${RAPPORT}\n` +
      constats.map((c) => `  [${c.gravite}] ${c.code} ×${c.occurrences} — ${c.message}`).join('\n'),
  );
  if (process.env.SIMULATION_STRICT === '1') {
    expect(constats).toEqual([]);
  }
});
