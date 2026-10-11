export type Situation = 'prevention' | 'tresorie' | 'redressement' | 'assignation';
export type Probleme = 'urssaf' | 'fournisseurs' | 'banque' | 'impots';
export type Effectif = 'independant' | 'salaries';
export type Moral = 'combatif' | 'epuise' | 'perdu';
export type Caution = 'oui' | 'non' | 'ne-sais-pas';
export type RegimeMatrimonial = 'communaute' | 'separation' | 'non-marie' | 'ne-sais-pas';
export type Patrimoine = 'proprietaire' | 'locataire';
export type VenteEnvisagee = 'oui' | 'peut-etre' | 'non';
export type MontantDettes = 'moins-10k' | '10k-50k' | '50k-200k' | '200k-1m' | 'plus-1m';
export type AgeDirigeant = 'moins-25' | '25-50' | '50-60' | 'plus-60';
export type Franchise = 'oui' | 'non';
export type AntecedentsBodacc = 'oui' | 'non' | 'ne-sais-pas';
export type PgeEnCours = 'oui' | 'non' | 'ne-sais-pas';
export type Rqth = 'oui' | 'non';
export type ConjointStatut = 'salarie' | 'collaborateur' | 'associe' | 'aucun' | 'sans-conjoint';
export type CoGerants = 'oui' | 'non' | 'sans-objet';
export type Saisonnalite = 'oui' | 'non';
export type Nationalite = 'fr-ue-eee-suisse' | 'hors-ue' | 'sans-reponse';

export interface Reponses {
  situation: Situation;
  probleme: Probleme;
  effectif: Effectif;
  effectifDetail?: string;
  moral: Moral;
  caution?: Caution;
  regime?: RegimeMatrimonial;
  patrimoine?: Patrimoine;
  vente?: VenteEnvisagee;
  montantDettes?: MontantDettes;
  ageDirigeant?: AgeDirigeant;
  franchise?: Franchise;
  antecedents?: AntecedentsBodacc;
  pgeEnCours?: PgeEnCours;
  rqth?: Rqth;
  conjointStatut?: ConjointStatut;
  coGerants?: CoGerants;
  saisonnalite?: Saisonnalite;
  nationalite?: Nationalite;
}

export interface CompanyData {
  siret: string;
  nom: string;
  formeJuridique: string;
  naf: string;
  nafLabel?: string;
  nafSection?: string;
  dateCreation: string;
  effectif: string;
  adresse: string;
  codePostal: string;
  ville: string;
  departement: string;
  /**
   * Siège de l'entreprise, quand le SIRET saisi est celui d'un établissement
   * secondaire : le tribunal compétent est celui du siège (C. com. art. R600-1).
   * Champs vides si le siège n'est pas connu.
   */
  siege?: { codePostal: string; ville: string; departement: string };
  fetched: boolean;
}

export interface AlerteSignal {
  niveau: 'rouge' | 'jaune' | 'vert';
  titre: string;
  message: string;
  source: string;
}

export interface BodaccItem {
  type: string;
  date: string;
  tribunal?: string;
  description?: string;
}

export interface PlaceResult {
  name: string;
  address?: string;
  rating?: number;
  reviews?: number;
  phone?: string;
  mapsUrl?: string;
}

export interface Rappel {
  email: string;
  echeance: string;
  dateRappel: string;
  libelle: string;
  cree_le: string;
  envoye?: boolean;
  /** Nombre d'envois échoués (le cron abandonne après 3). */
  tentatives?: number;
  /** Abandonné après 3 échecs : ne sera plus retenté. */
  echec?: boolean;
}

export interface FicheRecord {
  id?: string;
  token: string;
  siret: string;
  reponses: Reponses;
  company_data: CompanyData;
  email?: string;
  created_at?: string;
}
