import { z } from 'zod';
import { FORMATS_RECHERCHE, LONGUEURS_RECHERCHE, MAX_ETABLISSEMENTS_RECHERCHE } from './rechercheEntreprises';

/**
 * Réponses au questionnaire. Chaque champ correspond à `Reponses` (lib/types.ts)
 * et aux choix proposés dans components/Questionnaire.tsx.
 * `.strict()` : tout champ inconnu est refusé (pas de stockage de données arbitraires).
 */
export const reponsesSchema = z.object({
  situation: z.enum(['prevention', 'tresorie', 'redressement', 'assignation']),
  probleme: z.enum(['urssaf', 'fournisseurs', 'banque', 'impots']),
  effectif: z.enum(['independant', 'salaries']),
  // Libellé du choix « effectif » (ex. « Oui, moins de 5 ») : texte court.
  effectifDetail: z.string().max(100).optional(),
  moral: z.enum(['combatif', 'epuise', 'perdu']),
  caution: z.enum(['oui', 'non', 'ne-sais-pas']).optional(),
  regime: z.enum(['communaute', 'separation', 'non-marie', 'ne-sais-pas']).optional(),
  patrimoine: z.enum(['proprietaire', 'locataire']).optional(),
  vente: z.enum(['oui', 'peut-etre', 'non']).optional(),
  montantDettes: z.enum(['moins-10k', '10k-50k', '50k-200k', '200k-1m', 'plus-1m']).optional(),
  ageDirigeant: z.enum(['moins-25', '25-50', '50-60', 'plus-60']).optional(),
  franchise: z.enum(['oui', 'non']).optional(),
  antecedents: z.enum(['oui', 'non', 'ne-sais-pas']).optional(),
  pgeEnCours: z.enum(['oui', 'non', 'ne-sais-pas']).optional(),
  rqth: z.enum(['oui', 'non']).optional(),
  conjointStatut: z.enum(['salarie', 'collaborateur', 'associe', 'aucun', 'sans-conjoint']).optional(),
  coGerants: z.enum(['oui', 'non', 'sans-objet']).optional(),
  saisonnalite: z.enum(['oui', 'non']).optional(),
  nationalite: z.enum(['fr-ue-eee-suisse', 'hors-ue', 'sans-reponse']).optional(),
}).strict();

const siretSchema = z.string().regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres');

/* ---------- Entreprise trouvée par le navigateur (recherche-entreprises) ---------- */

const F = FORMATS_RECHERCHE;
const L = LONGUEURS_RECHERCHE;
/** Texte libre borné, sans balise ni caractère de contrôle. */
const texteRecherche = (max: number) => z.string().max(max).regex(F.texte).nullish();
const codeRecherche = (format: RegExp) => z.string().regex(format).nullish();

const etablissementRechercheSchema = z.object({
  siret: z.string().regex(F.siret),
  code_postal: codeRecherche(F.codePostal),
  commune: codeRecherche(F.commune),
  departement: codeRecherche(F.departement),
  libelle_commune: texteRecherche(L.libelleCommune),
  adresse: texteRecherche(L.adresse),
}).strict();

/**
 * Résultat (réduit) de l'API recherche-entreprises, obtenu dans le navigateur
 * du visiteur (voir lib/rechercheEntreprises.ts). `.strict()` et bornes de
 * longueur : aucun champ en plus (dirigeants, finances…), pas de HTML.
 */
export const entrepriseRechercheSchema = z.object({
  nom_complet: texteRecherche(L.nom),
  nom_raison_sociale: texteRecherche(L.nom),
  prenom_usuel: texteRecherche(L.prenomOuNom),
  nom: texteRecherche(L.prenomOuNom),
  nature_juridique: codeRecherche(F.natureJuridique),
  activite_principale: codeRecherche(F.activite),
  libelle_activite_principale: texteRecherche(L.libelleActivite),
  section_activite_principale: codeRecherche(F.section),
  date_creation: codeRecherche(F.date),
  tranche_effectif_salarie: codeRecherche(F.tranche),
  siege: etablissementRechercheSchema.nullish(),
  matching_etablissements: z.array(etablissementRechercheSchema).max(MAX_ETABLISSEMENTS_RECHERCHE).nullish(),
}).strict();

/** Taille maximale acceptée du corps de POST /api/fiche (caractères). */
export const TAILLE_MAX_CORPS_FICHE = 16_000;

export const fichePayloadSchema = z.object({
  siret: siretSchema,
  reponses: reponsesSchema,
  /**
   * Facultatif. Un résultat mal formé est simplement ignoré (`.catch`) : il
   * ne doit jamais empêcher la création de la fiche, qui se replie alors sur
   * la recherche serveur puis l'INSEE.
   */
  entreprise: entrepriseRechercheSchema.optional().catch(undefined),
}).strict();

/** Fiche « locale » (non enregistrée en base) : mêmes règles que la création. */
export const ficheLocaleSchema = fichePayloadSchema;

/** Token de fiche : hex généré par uuid() (24 car.) — on tolère 10-64 alphanum pour d'anciens formats */
export const tokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{10,64}$/, 'Token invalide');

const emailSchema = z.string().trim().max(254).email('Adresse e-mail invalide');

export const sendLinkPayloadSchema = z.object({
  token: tokenSchema,
  email: emailSchema,
}).strict();

import { estDateIsoValide, estDateRappelAcceptable } from './dateRappel';

// Règles de date des rappels : dans lib/dateRappel.ts (sans Zod, réutilisées
// par le formulaire de rappel côté navigateur).
export { RAPPEL_HORIZON_JOURS, aujourdhuiIso, estDateIsoValide, estDateRappelAcceptable } from './dateRappel';

const dateRappelSchema = z
  .string()
  .refine(estDateIsoValide, 'Date invalide (format attendu AAAA-MM-JJ)')
  .refine((s) => estDateRappelAcceptable(s), 'La date doit être comprise entre aujourd’hui et dans 2 ans');

export const rappelPayloadSchema = z.object({
  token: tokenSchema,
  // Facultatif : le rappel part toujours vers l'adresse déjà enregistrée sur la fiche.
  // Si une adresse est fournie, elle doit être celle-là.
  email: emailSchema.optional(),
  echeance: dateRappelSchema,
  dateRappel: dateRappelSchema,
  libelle: z.string().trim().min(1).max(80),
}).strict();
