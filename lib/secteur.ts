import type { CompanyData } from './types';

export type Secteur =
  | 'agriculture'
  | 'peche'
  | 'industrie'
  | 'btp'
  | 'commerce'
  | 'transport'
  | 'hotellerie'
  | 'information'
  | 'finance'
  | 'immobilier'
  | 'liberal'
  | 'education'
  | 'sante'
  | 'artisanat'
  | 'ess'
  | 'services'
  | 'culture-sport'
  | 'autre';

export interface OrganismeSecteur {
  nom: string;
  role: string;
  telephone?: string;
  site?: string;
}

export interface SectorInfo {
  secteur: Secteur;
  label: string;
  cotisationOrg: string;
  cotisationTel: string;
  cotisationSite: string;
  syndicats: OrganismeSecteur[];
  aidesSpecifiques: { nom: string; description: string; site?: string; badge?: string }[];
  soutien?: { nom: string; description: string; telephone?: string; site?: string };
  conseilsSpecifiques: string[];
  chambre: 'CCI' | 'CMA' | 'CA';
  /** Caisses de retraite professionnelles spécifiques (libéral / santé). */
  caissesRetraite?: CaisseRetraite[];
  /** Ordres professionnels et cellules d'aide aux confrères en difficulté. */
  ordresProfessionnels?: OrdreProfessionnel[];
  /** Niveau de tension du secteur (utilisé pour modérer les attentes du dirigeant). */
  santeSecteur?: SanteSecteur;
  /** Obligations spécifiques en cas de licenciement économique (CSP, PSE, congé de reclassement…). */
  obligationsLicenciement?: ObligationLicenciement[];
}

export interface ObligationLicenciement {
  /** Sigle court (ex: "CSP", "PSE"). */
  sigle: string;
  /** Nom complet de l'obligation. */
  nom: string;
  /** Description courte. */
  description: string;
  /** Seuil maximal d'effectif (en nombre de salariés). null = applicable à tous. */
  seuilMax?: number;
  /** Téléphone de contact (ex: France Travail). */
  telephone?: string;
  /** Site officiel. */
  site?: string;
  /** Badge informatif court (ex: "Obligatoire"). */
  badge?: string;
}

export interface CaisseRetraite {
  /** Profession concernée (libellé court, ex: "Médecin", "Avocat"). */
  profession: string;
  /** Sigle de la caisse (ex: "CARMF"). */
  caisse: string;
  /** Téléphone de contact action sociale. */
  telephone: string;
  /** URL du site officiel. */
  site: string;
}

export interface OrdreProfessionnel {
  /** Profession (libellé court). */
  profession: string;
  /** Nom complet de l'ordre. */
  nom: string;
  telephone: string;
  site: string;
  /** Précision utile (ex: « cellule d'aide aux confrères »). */
  note?: string;
}

export interface SanteSecteur {
  niveau: 'crise' | 'tendu' | 'normal';
  titre: string;
  message: string;
  ressource?: { label: string; url: string };
}

function sectionFromNaf(naf: string): string {
  if (!naf) return '';
  const code = naf.replace(/\./g, '');
  const num = parseInt(code.slice(0, 2), 10);
  if (num <= 3) return 'A';
  if (num <= 9) return 'B';
  if (num <= 33) return 'C';
  if (num === 35) return 'D';
  if (num <= 39) return 'E';
  if (num <= 43) return 'F';
  if (num <= 47) return 'G';
  if (num <= 53) return 'H';
  if (num <= 56) return 'I';
  if (num <= 63) return 'J';
  if (num <= 66) return 'K';
  if (num === 68) return 'L';
  if (num <= 75) return 'M';
  if (num <= 82) return 'N';
  if (num === 84) return 'O';
  if (num === 85) return 'P';
  if (num <= 88) return 'Q';
  if (num <= 93) return 'R';
  if (num <= 96) return 'S';
  return '';
}

function secteurFromSection(section: string): Secteur {
  const map: Record<string, Secteur> = {
    A: 'agriculture',
    B: 'industrie',
    C: 'industrie',
    D: 'industrie',
    E: 'industrie',
    F: 'btp',
    G: 'commerce',
    H: 'transport',
    I: 'hotellerie',
    J: 'information',
    K: 'finance',
    L: 'immobilier',
    M: 'liberal',
    // Section N = services administratifs et de soutien : location (77),
    // intérim (78), voyage (79), sécurité privée (80), nettoyage/paysage (81),
    // soutien administratif (82).
    N: 'services',
    O: 'autre',
    P: 'education',
    Q: 'sante',
    // Section R = arts et spectacles (90), musées (91), jeux (92), sport (93).
    R: 'culture-sport',
    S: 'artisanat',
  };
  return map[section] ?? 'autre';
}

function isArtisan(naf: string, forme: string): boolean {
  const artisanNaf = ['43', '10', '14', '15', '16', '23', '25', '31', '32', '33', '95', '96'];
  const prefix = naf.replace(/\./g, '').slice(0, 2);
  if (artisanNaf.includes(prefix)) return true;
  if (/artisan|métier/i.test(forme)) return true;
  return false;
}

/**
 * Obligation CSP (Contrat de Sécurisation Professionnelle).
 * À proposer obligatoirement à tout salarié licencié pour motif économique
 * dans une entreprise de moins de 1 000 salariés (et hors procédure collective où c'est le CRP).
 * Source : Code du travail L1233-65 et suivants.
 */
export const CSP_OBLIGATION: ObligationLicenciement = {
  sigle: 'CSP',
  nom: 'Contrat de Sécurisation Professionnelle',
  description:
    "Obligatoire pour tout licenciement économique en entreprise de moins de 1 000 salariés. À proposer au salarié avant la notification du licenciement (délai de réflexion : 21 jours). En cas d'acceptation : allocation de 75 % du salaire journalier de référence pendant 12 mois au plus (avec au moins 1 an d'ancienneté), accompagnement personnalisé France Travail. S'il n'est pas proposé, France Travail le propose à la place de l'employeur, qui doit alors une contribution de 2 mois de salaire (3 mois si le salarié adhère).",
  seuilMax: 1000,
  // 39 95 : France Travail, ligne des employeurs (francetravail.fr, « Le 3995 »).
  telephone: '39 95',
  site: 'https://www.francetravail.fr/employeur/vos-declarations-et-cotisations/la-fin-de-vos-contrats-de-travai/le-contrat-de-securisation-profe.html',
  badge: 'Obligatoire si licenciement éco',
};

const SECTOR_DATA: Record<Secteur, Omit<SectorInfo, 'secteur'>> = {
  agriculture: {
    label: 'Agriculture',
    cotisationOrg: 'MSA (Mutualité Sociale Agricole)',
    // La MSA n'a pas de numéro national : chaque caisse a le sien (msa.fr >
    // choix du département > Contact). Le 36 98 est la ligne Urssaf des
    // travailleurs indépendants (communiqué Urssaf Centre-Val de Loire, 24/03/2020).
    cotisationTel: 'numéro de votre caisse sur msa.fr',
    cotisationSite: 'https://www.msa.fr',
    syndicats: [
      { nom: 'FNSEA', role: 'Syndicat agricole majoritaire', site: 'https://www.fnsea.fr' },
      { nom: 'Jeunes Agriculteurs', role: 'Accompagnement jeunes exploitants', site: 'https://www.jeunes-agriculteurs.fr' },
      { nom: 'Confédération paysanne', role: 'Syndicat de l\'agriculture paysanne', site: 'https://www.confederationpaysanne.fr' },
      { nom: 'Coordination Rurale', role: 'Syndicat agricole', site: 'https://www.coordinationrurale.fr' },
      { nom: 'Chambre d\'agriculture', role: 'Conseil technique et économique', site: 'https://chambres-agriculture.fr' },
    ],
    aidesSpecifiques: [
      // Pas de numéro national MSA : lien vers la page officielle « Nous
      // contacter » (choix de sa caisse et coordonnées), jamais un faux numéro.
      { nom: 'Aide d\'urgence MSA', description: 'Action sociale de votre caisse de MSA pour les exploitant·e·s en difficulté : aides financières, prise en charge partielle de cotisations ou échéancier, au cas par cas. Pas de numéro national : coordonnées de votre caisse sur msa.fr.', site: 'https://www.msa.fr/lfp/web/msa/contact', badge: 'Gratuit' },
      { nom: 'Aide à la relance agricole', description: 'Prêts bonifiés et subventions régionales pour exploitations en difficulté.', site: 'https://www.agriculture.gouv.fr' },
      { nom: 'Fonds d\'allègement des charges', description: 'Prise en charge partielle des cotisations MSA et des prêts bancaires.', site: 'https://www.agriculture.gouv.fr', badge: 'Sous conditions' },
      { nom: 'AREA (Aide à la Relance des Exploitations Agricoles)', description: 'Dispositif national pour exploitations viables mais en difficulté. Audit + plan de redressement financés.', site: 'https://www.agriculture.gouv.fr', badge: 'Sur dossier' },
    ],
    soutien: { nom: 'Agri\'Écoute', description: 'Écoute psychologique pour agriculteurs en détresse · 24h/24', telephone: '09 69 39 29 19', site: 'https://www.msa.fr' },
    conseilsSpecifiques: [
      'Contactez la MSA (pas l\'URSSAF) pour vos cotisations sociales',
      'La Chambre d\'agriculture propose un diagnostic gratuit de votre exploitation',
      'Agri\'Écoute est disponible 24h/24 si vous avez besoin de parler',
      'Solidarité Paysans est l\'équivalent du CIP pour le monde rural — accompagnement gratuit et confidentiel par bénévoles, souvent d\'anciens agriculteurs (INDISPENSABLE)',
      'Cerfrance (centre de gestion agréé spécialisé agricole) est souvent le mieux placé pour reconstruire vos prévisionnels',
      'L\'ADEAR accompagne installations, transmissions et reconversions paysannes',
    ],
    chambre: 'CA',
    caissesRetraite: [
      { profession: 'Exploitant agricole', caisse: 'MSA', telephone: 'Numéro de votre caisse sur msa.fr', site: 'https://www.msa.fr' },
    ],
    ordresProfessionnels: [
      { profession: 'Exploitant en difficulté', nom: 'Solidarité Paysans', telephone: 'Variable selon département (voir site)', site: 'https://solidaritepaysans.org', note: 'Équivalent CIP pour le monde rural · accompagnement gratuit et confidentiel par bénévoles' },
      { profession: 'Gestion / comptabilité agricole', nom: 'Cerfrance (CER France)', telephone: 'Variable selon territoire', site: 'https://www.cerfrance.fr', note: 'Expert-comptable spécialisé agriculture · présent sur tout le territoire' },
      { profession: 'Installation / transmission paysanne', nom: 'ADEAR', telephone: 'Variable selon département', site: 'https://www.agriculturepaysanne.org', note: 'Association pour le Développement de l\'Emploi Agricole et Rural' },
    ],
    santeSecteur: {
      niveau: 'crise',
      titre: 'Secteur agricole sous tension durable',
      message:
        'Vous n\'êtes pas seul·e : le secteur agricole cumule hausse des charges, aléas climatiques et pression sur les prix. Des dispositifs nationaux et MSA existent spécifiquement pour cette crise.',
      ressource: { label: 'Aides de la MSA en cas de difficultés', url: 'https://www.msa.fr/lfp/web/msa/exploitant/aides-au-paiement-des-cotisations' },
    },
  },
  peche: {
    label: 'Pêche / Aquaculture',
    cotisationOrg: 'ENIM (Établissement National des Invalides de la Marine)',
    // ENIM : 08 09 54 00 64 (lannuaire.service-public.gouv.fr, « Établissement national des invalides de la marine »).
    cotisationTel: '08 09 54 00 64',
    cotisationSite: 'https://www.enim.eu',
    syndicats: [
      { nom: 'CNPMEM', role: 'Comité National des Pêches Maritimes et des Élevages Marins', telephone: '01 72 71 18 00', site: 'https://www.comite-peches.fr' },
      { nom: 'CRPMEM', role: 'Comité Régional des Pêches Maritimes — par façade littorale', site: 'https://www.comite-peches.fr' },
      { nom: 'France Filière Pêche', role: 'Interprofession pêche fraîche française', site: 'https://www.francefilierepeche.fr' },
      { nom: 'CNC', role: 'Comité National de la Conchyliculture — ostréiculture, mytiliculture', },
      { nom: 'SNSM', role: 'Société Nationale de Sauvetage en Mer — sauvetage des personnes en mer', telephone: '01 56 02 64 64', site: 'https://www.snsm.org' },
      // AGISM : association active (Sirene) mais sans site ni numéro publiés.
      { nom: 'AGISM', role: 'Association pour la gestion des institutions sociales maritimes — action sociale des marins' },
    ],
    aidesSpecifiques: [
      { nom: 'ENIM · Action sociale', description: 'Aide d\'urgence et accompagnement pour marins-pêcheurs en difficulté. Fonds de secours.', site: 'https://www.enim.eu', badge: 'Marins uniquement' },
      { nom: 'FEAMPA', description: 'Fonds européen pour les affaires maritimes, la pêche et l\'aquaculture (2021-2027) : modernisation, arrêts temporaires indemnisés, transition écologique.', site: 'https://www.europe-en-france.gouv.fr', badge: 'Européen' },
      { nom: 'Aide carburant pêche', description: 'Dispositif d\'aide au gazole de pêche déclenché en cas de hausse durable des cours.', site: 'https://agriculture.gouv.fr', badge: 'Selon conjoncture' },
      { nom: 'Plan de sortie de flotte', description: 'Indemnisation publique en cas de retrait définitif d\'un navire de pêche du registre.', site: 'https://agriculture.gouv.fr', badge: 'Sur dossier' },
    ],
    // « Solidarité Marins » (solidaritedesgensdemer.fr) : association et site
    // introuvables — remplacée par APESA, réflexe national de soutien psy.
    // L'ancien numéro vert APESA (cellule Covid de 2020) n'est plus publié
    // sur apesa-france.com, qui renvoie au 3114 en cas d'urgence.
    soutien: { nom: 'APESA', description: 'Soutien psychologique gratuit et confidentiel des dirigeant·e·s en difficulté, marins-pêcheurs compris · en cas d\'urgence : 3114 (24 h/24)', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Pour vos cotisations sociales, contactez l\'ENIM — caisse spécifique des marins-pêcheurs (pas l\'URSSAF ni la MSA)',
      'La DDTM (Direction Départementale des Territoires et de la Mer) est votre autorité de tutelle pour licences, quotas et contrôles',
      'Le CRPMEM de votre façade peut vous orienter vers les aides régionales et les arrêts temporaires indemnisés',
      'Les aides européennes FEAMPA peuvent financer modernisation et transition écologique de votre navire',
      'France Filière Pêche défend la pêche fraîche française — utile pour la valorisation commerciale',
      'L\'action sociale de l\'ENIM peut accorder des aides d\'urgence aux marins en difficulté (enim.eu)',
    ],
    chambre: 'CCI',
    caissesRetraite: [
      { profession: 'Marin-pêcheur', caisse: 'ENIM', telephone: '08 09 54 00 64', site: 'https://www.enim.eu' },
    ],
    ordresProfessionnels: [
      { profession: 'Pêche maritime', nom: 'CNPMEM (Comité National des Pêches)', telephone: '01 72 71 18 00', site: 'https://www.comite-peches.fr', note: 'Organisation professionnelle obligatoire pour les pêcheurs' },
      { profession: 'Autorité maritime', nom: 'DDTM (Direction Départementale des Territoires et de la Mer)', telephone: 'Variable selon département littoral', site: 'https://www.mer.gouv.fr', note: 'Autorité de tutelle · licences, quotas, contrôles, autorisations de pêche' },
    ],
    santeSecteur: {
      niveau: 'crise',
      titre: 'Pêche : flotte vieillissante et pression européenne',
      message:
        "Hausse du gazole, quotas européens en baisse sur plusieurs espèces, sortie progressive du chalutage de fond dans certaines aires marines protégées : la pêche française vit une transition difficile. Sollicitez tôt l'ENIM, le CRPMEM et la DDTM — des dispositifs FEAMPA et plans de sortie de flotte indemnisés existent.",
      ressource: { label: 'ENIM · Action sociale', url: 'https://www.enim.eu' },
    },
  },
  btp: {
    label: 'BTP / Construction',
    cotisationOrg: 'URSSAF + Caisses BTP (CIBTP, PRO BTP)',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FFB', role: 'Fédération Française du Bâtiment', telephone: '01 40 69 51 00', site: 'https://www.ffbatiment.fr' },
      { nom: 'CAPEB', role: 'Confédération de l\'artisanat et des PME du bâtiment', site: 'https://www.capeb.fr' },
      { nom: 'FNTP', role: 'Fédération Nationale des Travaux Publics', site: 'https://www.fntp.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'PRO BTP · Action sociale', description: 'Aide financière d\'urgence pour entreprises du BTP. Prêts et secours.', site: 'https://www.probtp.com', badge: 'BTP uniquement' },
      { nom: 'CIBTP · Congés et intempéries', description: 'Indemnisation en cas d\'intempéries. Vérifiez vos droits.', site: 'https://www.cibtp.fr' },
    ],
    soutien: { nom: 'APESA + FFB', description: 'Dispositif APESA activable via le tribunal de commerce', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Vérifiez vos droits aux indemnités intempéries (CIBTP)',
      'PRO BTP propose une action sociale spécifique au secteur',
      'La CAPEB ou la FFB peuvent vous accompagner dans vos démarches',
    ],
    chambre: 'CMA',
    santeSecteur: {
      niveau: 'crise',
      titre: 'BTP : secteur en chute marquée',
      message:
        'Le BTP connaît une contraction historique depuis 2023 (construction neuve en repli). Les défaillances ont fortement augmenté. Agissez tôt : les dispositifs amiables (mandat ad hoc, conciliation) sont votre meilleure arme.',
      ressource: { label: 'CAPEB — accompagnement', url: 'https://www.capeb.fr' },
    },
  },
  hotellerie: {
    label: 'Hôtellerie-restauration',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'UMIH', role: 'Union des Métiers et des Industries de l\'Hôtellerie', telephone: '01 44 94 19 94', site: 'https://www.umih.fr' },
      // GHR : né le 1er janvier 2023 de la fusion du GNI, du SNRTC et du SNRPO (ghr.fr).
      { nom: 'GHR', role: 'Groupement des Hôtelleries et Restaurations de France — ex-GNI, SNRTC et SNRPO', telephone: '01 42 96 60 75', site: 'https://www.ghr.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'Aides saisonnières', description: 'Activité partielle pendant les périodes creuses. Exonérations spécifiques HCR.', site: 'https://www.travail-emploi.gouv.fr' },
      { nom: 'Fonds de modernisation CHR', description: 'Aides à la mise aux normes et à la modernisation des établissements.', badge: 'Régional' },
      { nom: 'HCR Prévoyance / Klesia', description: 'Prévoyance santé/retraite branche HCR — action sociale dédiée en cas de difficulté de l\'employeur.', site: 'https://www.klesia.fr', badge: 'Convention HCR' },
      { nom: 'Atout France', description: 'Agence de développement touristique : appels à projets, accompagnement transition durable.', site: 'https://www.atout-france.fr' },
    ],
    soutien: { nom: 'UMIH Entraide + APESA HCR', description: 'Réseau d\'entraide entre restaurateurs et hôteliers. APESA est accessible aux dirigeants HCR via le tribunal de commerce.', telephone: '01 44 94 19 94', site: 'https://www.umih.fr' },
    conseilsSpecifiques: [
      'L\'UMIH peut négocier des accords collectifs de branche en votre faveur',
      'Vérifiez vos droits à l\'activité partielle en période creuse, voire APLD-R si baisse durable',
      'Les baux commerciaux HCR ont des protections spécifiques',
      'HCR Prévoyance (Klesia) propose une action sociale pour salariés et employeur en difficulté',
      'APESA est particulièrement actif en HCR — saisine via le tribunal de commerce ou directement',
    ],
    chambre: 'CCI',
    santeSecteur: {
      niveau: 'crise',
      titre: 'HCR : secteur durablement tendu',
      message:
        'Hausse de l\'énergie, pénurie de main-d\'œuvre, remboursement des PGE : le secteur concentre un grand nombre de défaillances. Sollicitez l\'UMIH et la CCI avant toute procédure — des négociations de branche existent.',
      ressource: { label: 'UMIH', url: 'https://www.umih.fr' },
    },
  },
  commerce: {
    label: 'Commerce',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'CCI', role: 'Chambre de commerce et d\'industrie', site: 'https://www.cci.fr' },
      { nom: 'CdCF', role: 'Conseil du Commerce de France — fédération nationale', telephone: '01 40 15 03 03', site: 'https://www.cdcf.com' },
      { nom: 'FCD', role: 'Fédération du Commerce et de la Distribution — grande distribution, supermarchés', telephone: '01 44 43 99 00', site: 'https://www.fcd.fr' },
      { nom: 'CGF', role: 'Confédération des Grossistes de France — commerce de gros, BtoB', telephone: '01 44 55 35 00', site: 'https://www.cgf-grossistes.fr' },
      { nom: 'CGAD', role: 'Confédération Générale de l\'Alimentation en Détail — boulangers, bouchers…', telephone: '01 44 90 88 44', site: 'https://www.cgad.fr' },
      { nom: 'Procos', role: 'Fédération du commerce spécialisé — textile, sport, équipement', telephone: '01 44 88 95 60', site: 'https://www.procos.org' },
      { nom: 'Fevad', role: 'Fédération du e-commerce et de la vente à distance', telephone: '01 42 56 38 86', site: 'https://www.fevad.com' },
      { nom: 'USPO', role: 'Union des Syndicats de Pharmaciens d\'Officine', telephone: '01 46 47 20 80', site: 'https://www.uspo.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'Aide au commerce de proximité', description: 'Aides communales et départementales pour maintenir le commerce local (centres-villes).', badge: 'Local' },
      { nom: 'Action Cœur de Ville', description: 'Plan national de revitalisation des centres-villes — aides foncières et travaux.', site: 'https://agence-cohesion-territoires.gouv.fr/action-coeur-de-ville-42' },
      { nom: 'Petites Villes de Demain', description: 'Pour communes < 20 000 hab. — accompagnement commerces.', site: 'https://agence-cohesion-territoires.gouv.fr/petites-villes-de-demain-45' },
    ],
    soutien: { nom: 'APESA + réseau CCI', description: 'Pas de dispositif d\'écoute propre au commerce : APESA est le réflexe n°1 (sentinelles dans les tribunaux de commerce et les CCI). Gratuit et confidentiel.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Négociez avec votre bailleur commercial — le Code de commerce vous protège',
      'Les impayés de loyer commercial ont des procédures spécifiques',
      'CdCF, FCD, CGF ou CGAD selon votre sous-secteur — chacune a des juristes pour ses adhérents',
      'Si vous êtes pharmacien d\'officine : USPO (syndicat) et caisse de retraite CAVP',
      'Vérifiez l\'éligibilité Action Cœur de Ville / Petites Villes de Demain de votre commune',
    ],
    chambre: 'CCI',
    santeSecteur: {
      niveau: 'tendu',
      titre: 'Commerce de détail sous pression',
      message:
        'Inflation, e-commerce et baisse de pouvoir d\'achat pèsent sur le commerce physique. Vérifiez les aides territoriales (commune, Région, Action Cœur de Ville) avant tout.',
    },
  },
  transport: {
    label: 'Transport',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FNTR', role: 'Fédération Nationale des Transports Routiers — marchandises', telephone: '01 44 29 04 29', site: 'https://www.fntr.fr' },
      { nom: 'OTRE', role: 'Organisation des Transporteurs Routiers Européens', telephone: '01 53 62 83 40', site: 'https://www.otre.org' },
      { nom: 'Unostra', role: 'Union Nationale des Organisations Syndicales de Transporteurs Routiers Automobiles', telephone: '01 44 29 04 29', site: 'https://unostra.fr' },
      { nom: 'FNTV', role: 'Fédération Nationale des Transports de Voyageurs — autocaristes', telephone: '01 40 82 62 72', site: 'https://www.fntv.fr' },
      { nom: 'Mobilians', role: 'Organisation professionnelle des services de l\'automobile, ex-CNPA — garages, dépanneurs, contrôle technique…', telephone: '01 40 99 55 00', site: 'https://www.mobilians.fr' },
      { nom: 'CSD', role: 'Chambre Syndicale du Déménagement — entreprises de déménagement et de garde-meubles', telephone: '01 49 88 61 40', site: 'https://www.csdemenagement.fr' },
      { nom: 'TLF', role: 'Union des Transports et Logistique de France', telephone: '01 53 68 40 40', site: 'https://www.e-tlf.com' },
    ],
    aidesSpecifiques: [
      { nom: 'Aide au gazole professionnel (TICPE)', description: 'Remboursement partiel de la TICPE pour les transporteurs routiers (gazole pro). Demande trimestrielle.', site: 'https://www.douane.gouv.fr' },
      { nom: 'Aide à la décarbonation transport', description: 'Subvention à l\'achat de véhicules électriques/hydrogène, retrofit, formation.', site: 'https://www.ademe.fr' },
      { nom: 'Aides à l\'achat de véhicules peu polluants', description: 'Dispositifs nationaux ou régionaux selon la période et le type de véhicule : vérifiez ceux en vigueur.', site: 'https://www.service-public.gouv.fr' },
    ],
    soutien: { nom: 'APESA', description: 'Pas de dispositif d\'écoute propre au transport : APESA est le réflexe n°1, activable via le tribunal de commerce ou directement sur apesa-france.com. Gratuit et confidentiel.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'La DREAL est votre interlocuteur pour les licences de transport (capacité, attestation transport)',
      'Vérifiez le remboursement de la TICPE si vous êtes transporteur routier — trimestriel, à demander',
      'VTC/taxis : voir le bloc dédié sur votre fiche (registre VTC, ARPE, charte sociale)',
      'Autocaristes : FNTV a un fonds d\'aide ; vérifiez aussi l\'AOM (autorité organisatrice mobilité) locale',
      'Déménageurs : la CSD (Chambre Syndicale du Déménagement) accompagne en difficulté',
    ],
    chambre: 'CCI',
    santeSecteur: {
      niveau: 'tendu',
      titre: 'Transport routier : marges serrées',
      message:
        'Hausse du carburant, remontée des taux, concurrence internationale : le transport routier est fragilisé. Le remboursement TICPE et les dispositifs OTRE/FNTR peuvent donner un peu d\'air.',
    },
  },
  liberal: {
    label: 'Professions libérales',
    cotisationOrg: 'URSSAF (+ CIPAV / CNBF / CPRN / CAVEC selon profession)',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'UNAPL', role: 'Union Nationale des Professions Libérales', telephone: '01 44 11 31 50', site: 'https://www.unapl.fr' },
      { nom: 'CNB', role: 'Conseil National des Barreaux — avocats', telephone: '01 53 30 85 60', site: 'https://www.cnb.avocat.fr' },
      { nom: 'CSN', role: 'Conseil Supérieur du Notariat', telephone: '01 44 90 30 00', site: 'https://www.notaires.fr' },
      { nom: 'OEC', role: 'Ordre des Experts-Comptables', telephone: '01 44 15 60 00', site: 'https://www.experts-comptables.fr' },
      { nom: 'CNOA', role: 'Conseil National de l\'Ordre des Architectes', telephone: '01 56 58 67 00', site: 'https://www.architectes.org' },
      { nom: 'OGE', role: 'Ordre des Géomètres-Experts', telephone: '01 53 83 88 00', site: 'https://www.geometre-expert.fr' },
      { nom: 'CNCJ', role: 'Chambre Nationale des Commissaires de Justice — ex-huissiers + commissaires-priseurs', site: 'https://www.commissaire-justice.fr' },
      { nom: 'AGEA', role: 'Fédération nationale des syndicats d\'agents généraux d\'assurances', telephone: '01 70 98 48 00', site: 'https://www.agea.fr' },
      { nom: 'CSCA', role: 'Chambre Syndicale des Courtiers d\'Assurances', site: 'https://www.planetecsca.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'CIPAV · Action sociale', description: 'Aide financière d\'urgence pour professions libérales affiliées à la CIPAV.', site: 'https://www.lacipav.fr', badge: 'Si affilié CIPAV' },
      { nom: 'Fonds de solidarité libéral', description: 'Aides spécifiques via les ordres professionnels (avocats, médecins, architectes…).', badge: 'Selon profession' },
    ],
    soutien: { nom: 'Entraide ordinale + APESA', description: 'Chaque Ordre professionnel (avocats, experts-comptables, architectes…) dispose d\'une cellule d\'entraide confidentielle pour ses membres. APESA vient en complément pour l\'écoute psychologique.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Contactez votre Ordre professionnel — beaucoup proposent une aide confidentielle',
      'Votre caisse de retraite (CIPAV, CNBF, CPRN, CAVEC, CAVOM…) dispose d\'un fonds d\'action sociale',
      'Les professions libérales ont accès au mandat ad hoc comme toute entreprise',
    ],
    chambre: 'CCI',
    caissesRetraite: [
      { profession: 'Avocat', caisse: 'CNBF', telephone: '01 42 21 32 30', site: 'https://www.cnbf.fr' },
      // Notaires : CPRN (cprn.fr). La CRPCEN est la caisse des clercs et
      // employés de notaires, pas des notaires (crpcen.fr).
      { profession: 'Notaire', caisse: 'CPRN', telephone: '01 53 81 75 00', site: 'https://www.cprn.fr' },
      { profession: 'Expert-comptable', caisse: 'CAVEC', telephone: '01 80 49 25 25', site: 'https://www.cavec.fr' },
      // Cipav : architectes, économistes de la construction, maîtres d'œuvre,
      // géomètres-experts… (lacipav.fr, « Qui est assuré à la Cipav ? »).
      { profession: 'Architecte', caisse: 'CIPAV', telephone: '01 44 95 68 20', site: 'https://www.lacipav.fr' },
      { profession: 'Géomètre-expert', caisse: 'CIPAV', telephone: '01 44 95 68 20', site: 'https://www.lacipav.fr' },
      // CAVOM : commissaires de justice (ex-huissiers, commissaires-priseurs),
      // greffiers des tribunaux de commerce, administrateurs et mandataires
      // judiciaires (cavom.net, « Quand devez-vous être affilié »).
      { profession: 'Huissier / Commissaire de justice', caisse: 'CAVOM', telephone: '01 85 55 36 37', site: 'https://www.cavom.net' },
      { profession: 'Commissaire-priseur judiciaire', caisse: 'CAVOM', telephone: '01 85 55 36 37', site: 'https://www.cavom.net' },
      { profession: 'Agent général d\'assurance', caisse: 'CAVAMAC', telephone: '01 81 69 36 01', site: 'https://www.cavamac.fr' },
      // Depuis la LFSS 2018 (loi n° 2017-1836, art. 15), la Cipav n'affilie plus
      // qu'une liste fermée de professions (architectes, ostéopathes,
      // psychologues, ergothérapeutes…). Les autres libéraux non réglementés
      // relèvent de la sécurité sociale des indépendants : retraite gérée par
      // l'Assurance retraite, cotisations recouvrées par l'Urssaf (qui recouvre
      // aussi celles des affiliés Cipav depuis le 1er janvier 2023). Les
      // libéraux affiliés à la Cipav avant le 1er janvier 2019 y restent, sauf
      // option exercée pour l'Assurance retraite (loi n° 2017-1836, art. 15).
      { profession: 'Profession libérale non réglementée (hors Cipav)', caisse: 'Assurance retraite', telephone: '3960', site: 'https://www.lassuranceretraite.fr' },
    ],
    ordresProfessionnels: [
      { profession: 'Avocat', nom: 'Conseil National des Barreaux', telephone: '01 53 30 85 60', site: 'https://www.cnb.avocat.fr', note: 'Cellules d\'aide confidentielles au barreau' },
      { profession: 'Notaire', nom: 'Conseil Supérieur du Notariat', telephone: '01 44 90 30 00', site: 'https://www.notaires.fr' },
      { profession: 'Expert-comptable', nom: 'Ordre des Experts-Comptables', telephone: '01 44 15 60 00', site: 'https://www.experts-comptables.fr', note: 'Cellule d\'accompagnement confraternel gratuite' },
    ],
  },
  sante: {
    label: 'Santé',
    cotisationOrg: 'URSSAF (+ CARMF / CARPIMKO / CAVP / CARCDSF / CARPV selon profession)',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'Ordre professionnel', role: 'Conseil de l\'Ordre — médecins, pharmaciens, infirmiers…', site: 'https://www.conseil-national.medecin.fr' },
      { nom: 'FHP', role: 'Fédération de l\'Hospitalisation Privée — cliniques', telephone: '01 53 83 56 56', site: 'https://www.fhp.fr' },
      { nom: 'FEHAP', role: 'Fédération des Établissements Hospitaliers et d\'Aide à la Personne — privé non lucratif', telephone: '01 53 98 95 00', site: 'https://www.fehap.fr' },
      { nom: 'SYNERPA', role: 'Syndicat National des Établissements et Résidences Privés pour Personnes Âgées', telephone: '01 40 47 75 20', site: 'https://www.synerpa.fr' },
      // Pas de numéro publié : contact par le formulaire « Envoyer SOS » du site.
      { nom: 'Vetos-Entraide', role: 'Réseau d\'entraide pour vétérinaires en difficulté — équivalent APESA', site: 'https://www.vetos-entraide.com' },
    ],
    aidesSpecifiques: [
      { nom: 'Entraide ordinale', description: 'Chaque Ordre professionnel dispose d\'un fonds d\'entraide confidentiel pour les confrères en difficulté.', badge: 'Confidentiel' },
      { nom: 'CARMF / CARPIMKO · Action sociale', description: 'Aide d\'urgence via votre caisse de retraite professionnelle.', badge: 'Selon caisse' },
    ],
    soutien: { nom: 'MOTS — Médecin Organisation Travail Santé', description: 'Accompagnement confidentiel des soignant·e·s en difficulté (médecins et autres professionnel·le·s de santé)', telephone: '06 08 28 25 89', site: 'https://www.association-mots.org' },
    conseilsSpecifiques: [
      'Contactez votre Ordre en priorité — ils ont un devoir d\'entraide confidentielle',
      'La continuité des soins aux patients doit être organisée même en difficulté',
      'Votre caisse de retraite (CARMF, CARPIMKO, CAVP, CARCDSF, CARPV…) propose une action sociale',
      'Vétérinaires : Vetos-Entraide (équivalent APESA) — écoute et entraide entre confrères, gratuite et confidentielle (formulaire « Envoyer SOS » sur vetos-entraide.com)',
      'Cliniques privées : FHP (Fédération de l\'Hospitalisation Privée) accompagne les établissements en difficulté',
      'Établissements médico-sociaux : FEHAP (Fédération des Établissements Hospitaliers et d\'Aide à la Personne)',
    ],
    chambre: 'CCI',
    caissesRetraite: [
      { profession: 'Médecin', caisse: 'CARMF', telephone: '01 40 68 32 00', site: 'https://www.carmf.fr' },
      { profession: 'Pharmacien', caisse: 'CAVP', telephone: '01 42 66 90 37', site: 'https://www.cavp.fr' },
      { profession: 'Dentiste', caisse: 'CARCDSF', telephone: '01 40 55 42 68', site: 'https://www.carcdsf.fr' },
      { profession: 'Sage-femme', caisse: 'CARCDSF', telephone: '01 40 55 42 68', site: 'https://www.carcdsf.fr' },
      { profession: 'Vétérinaire', caisse: 'CARPV', telephone: '01 47 70 72 53', site: 'https://www.carpv.fr' },
      { profession: 'Auxiliaire médical (infirmier, kiné, pédicure-podologue, orthophoniste, orthoptiste)', caisse: 'CARPIMKO', telephone: '01 30 48 10 00', site: 'https://www.carpimko.com' },
    ],
    ordresProfessionnels: [
      { profession: 'Médecin', nom: 'Conseil National de l\'Ordre des Médecins', telephone: '01 53 89 32 00', site: 'https://www.conseil-national.medecin.fr', note: 'Cellule d\'aide aux confrères en difficulté' },
      { profession: 'Pharmacien', nom: 'Ordre National des Pharmaciens', telephone: '01 56 21 34 34', site: 'https://www.ordre.pharmacien.fr' },
      { profession: 'Vétérinaire', nom: 'Ordre National des Vétérinaires', telephone: '01 85 09 37 00', site: 'https://www.veterinaire.fr', note: 'Cellule d\'entraide confraternelle' },
      { profession: 'Chirurgien-dentiste', nom: 'Ordre National des Chirurgiens-Dentistes', telephone: '01 44 34 78 80', site: 'https://www.ordre-chirurgiens-dentistes.fr' },
      { profession: 'Infirmier', nom: 'Ordre National des Infirmiers', telephone: '01 71 93 84 50', site: 'https://www.ordre-infirmiers.fr' },
      { profession: 'Masseur-kinésithérapeute', nom: 'Conseil National de l\'Ordre des Masseurs-Kinésithérapeutes', telephone: '01 46 22 32 97', site: 'https://www.ordremk.fr' },
      { profession: 'Sage-femme', nom: 'Conseil National de l\'Ordre des Sages-Femmes', telephone: '01 45 51 82 50', site: 'https://www.ordre-sages-femmes.fr' },
    ],
  },
  industrie: {
    label: 'Industrie',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'MEDEF territorial', role: 'Mouvement des entreprises de France', site: 'https://www.medef.com' },
      { nom: 'France Industrie', role: 'Organisation des industriels', site: 'https://www.franceindustrie.org' },
    ],
    aidesSpecifiques: [
      { nom: 'Bpifrance Industrie', description: 'Prêts et garanties spécifiques pour PMI. Diagnostic flash gratuit.', site: 'https://bpifrance.fr', badge: 'Gratuit' },
      { nom: 'Plan de relance industriel', description: 'Subventions à la modernisation et à la transition écologique.', site: 'https://www.economie.gouv.fr', badge: 'Sous conditions' },
    ],
    conseilsSpecifiques: [
      'Bpifrance propose un diagnostic industriel gratuit',
      'Le MEDEF territorial peut vous mettre en relation avec des repreneurs potentiels',
    ],
    soutien: { nom: 'APESA', description: 'Pas de dispositif d\'écoute propre à l\'industrie : APESA est le réflexe n°1, activable via le tribunal de commerce ou directement sur apesa-france.com. Gratuit et confidentiel.', site: 'https://www.apesa-france.com' },
    chambre: 'CCI',
  },
  information: {
    label: 'Numérique / IT',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'Numeum', role: 'Syndicat patronal du numérique — ex-Syntec Numérique', telephone: '01 44 30 49 70', site: 'https://numeum.fr' },
      { nom: 'Cinov Digital', role: 'Fédération des TPE/PME du numérique — ex-CINOV-IT', telephone: '01 44 30 49 30', site: 'https://www.cinov.fr/numerique-et-digital' },
      { nom: 'France Digitale', role: 'Association des startups et investisseurs numériques', site: 'https://francedigitale.org' },
      { nom: 'Fevad', role: 'Fédération du e-commerce et de la vente à distance', site: 'https://www.fevad.com' },
    ],
    aidesSpecifiques: [
      { nom: 'French Tech', description: 'Accompagnement et financement pour startups tech en difficulté (Tremplin, Tickets).', site: 'https://lafrenchtech.gouv.fr' },
      { nom: 'BPI Aide Innovation', description: 'Prêt innovation, prêt amorçage, garantie innovation pour TPE/PME numériques.', site: 'https://www.bpifrance.fr' },
      { nom: 'CIR / JEI', description: 'Crédit d\'impôt recherche + statut Jeune Entreprise Innovante : avantages fiscaux et sociaux à préserver.', site: 'https://entreprendre.service-public.gouv.fr/vosdroits/F31188' },
    ],
    soutien: { nom: 'APESA', description: 'Pas de dispositif d\'écoute propre au numérique : APESA est le réflexe n°1 pour les fondateurs et dirigeants tech en souffrance. Gratuit et confidentiel.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Numeum et Cinov Digital accompagnent les TPE/PME numériques en difficulté (médiation, conseils)',
      'French Tech Tremplin pour les fondateurs en post-liquidation (rebond)',
      'Préservez votre statut JEI et le CIR — leur perte aggrave significativement la trésorerie',
    ],
    chambre: 'CCI',
  },
  finance: {
    label: 'Finance / Assurance',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FBF', role: 'Fédération bancaire française', telephone: '01 48 00 52 52', site: 'https://www.fbf.fr' },
      { nom: 'ASF', role: 'Association française des Sociétés Financières — crédit-bail, leasing', telephone: '01 53 81 51 51', site: 'https://www.asf-france.com' },
      { nom: 'AFG', role: 'Association française de la Gestion financière', telephone: '01 44 94 94 00', site: 'https://www.afg.asso.fr' },
      { nom: 'FFA', role: 'France Assureurs — fédération des sociétés d\'assurance', site: 'https://www.franceassureurs.fr' },
      { nom: 'AGEA', role: 'Fédération nationale des syndicats d\'agents généraux d\'assurances', telephone: '01 70 98 48 00', site: 'https://www.agea.fr' },
      { nom: 'CSCA', role: 'Chambre syndicale des courtiers d\'assurances', site: 'https://www.planetecsca.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'ACPR', description: 'Autorité de contrôle prudentiel et de résolution — saisine si difficulté grave + dispositif de résolution bancaire.', site: 'https://acpr.banque-france.fr' },
      { nom: 'ORIAS', description: 'Registre unique des intermédiaires (assurance/banque/finance) — radiation possible si non-conformité.', site: 'https://www.orias.fr' },
    ],
    soutien: { nom: 'APESA', description: 'Pas de dispositif d\'écoute propre à la finance/assurance : APESA est le réflexe n°1. Gratuit, confidentiel, activable via le tribunal de commerce ou apesa-france.com.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Toute difficulté grave doit être notifiée à l\'ACPR (votre régulateur) — éventuellement résolution organisée',
      'Vérifiez votre inscription ORIAS à jour : la radiation = arrêt d\'activité immédiat',
      'Agents généraux d\'assurance : votre compagnie mandante a souvent un dispositif d\'aide AGEA',
    ],
    chambre: 'CCI',
  },
  immobilier: {
    label: 'Immobilier',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FNAIM', role: 'Fédération Nationale de l\'Immobilier — agences', telephone: '01 44 20 77 00', site: 'https://www.fnaim.fr' },
      { nom: 'UNIS', role: 'Union des syndicats de l\'immobilier — administrateurs de biens, syndics', telephone: '01 55 32 01 00', site: 'https://www.unis-immo.fr' },
      { nom: 'FPI France', role: 'Fédération des Promoteurs Immobiliers', telephone: '01 47 05 44 36', site: 'https://www.fpifrance.fr' },
      { nom: 'Pôle Habitat FFB', role: 'Constructeurs de maisons, aménageurs, promoteurs et rénovateurs — FFB', telephone: '01 40 69 58 40', site: 'https://www.polehabitat-ffb.com' },
      { nom: 'SNPI', role: 'Syndicat National des Professionnels Immobiliers', telephone: '01 53 64 91 91', site: 'https://www.snpi.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'Garantie financière FNAIM/UNIS', description: 'Si vous gérez des fonds de tiers (location, copropriété), votre garantie financière est obligatoire — vérifier renouvellement.', badge: 'Obligatoire' },
      { nom: 'Carte T / Carte G', description: 'La perte de carte professionnelle (transaction T, gestion G) = arrêt d\'activité. Préserver à tout prix.', badge: 'Critique' },
    ],
    soutien: { nom: 'APESA', description: 'Pas de dispositif d\'écoute propre à l\'immobilier : APESA est le réflexe n°1. Gratuit, confidentiel, activable via le tribunal de commerce ou apesa-france.com.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Si vous gérez des fonds clients (location, copropriété), votre garantie financière est CRITIQUE — sa perte = liquidation immédiate',
      'FPI, UNIS et FNAIM accompagnent leurs adhérents en difficulté (conseil juridique, médiation)',
      'Promoteur : prévoyez la GFA (garantie financière d\'achèvement) avant tout problème',
    ],
    chambre: 'CCI',
  },
  education: {
    label: 'Éducation / Formation',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'Les Acteurs de la Compétence', role: 'Fédération des organismes de formation — ex-Fédération de la Formation Professionnelle, FFP', telephone: '01 44 30 49 00', site: 'https://www.lesacteursdelacompetence.fr' },
      { nom: 'SYNOFDES', role: 'Syndicat national des organismes de formation', telephone: '01 41 79 59 59', site: 'https://synofdes.org' },
      { nom: 'CINOV Formation', role: 'Fédération des indépendants et TPE de la formation', site: 'https://www.cinov.fr' },
      { nom: 'Fnogec', role: 'Fédération Nationale des Organismes de Gestion — enseignement catholique', site: 'https://www.fnogec.org' },
    ],
    aidesSpecifiques: [
      { nom: 'Qualiopi — recours', description: 'Si la certification Qualiopi vous est retirée, recours possible auprès de l\'organisme certificateur dans les 30 jours, puis appel.', badge: 'Recours 30 j' },
      { nom: 'DGEFP — médiation OF', description: 'Délégation générale à l\'emploi et à la formation professionnelle : médiation possible en cas de litige avec un OPCO.', site: 'https://travail-emploi.gouv.fr/le-ministere-en-action/dgefp' },
      { nom: 'France compétences', description: 'Régulateur de la formation et de l\'apprentissage. Peut intervenir sur les certifications RNCP et RS.', site: 'https://www.francecompetences.fr' },
    ],
    soutien: { nom: 'APESA', description: 'Pas de dispositif d\'écoute propre à la formation : APESA est le réflexe n°1 pour les dirigeants d\'organismes en souffrance. Gratuit et confidentiel.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Qualiopi retirée = perte d\'accès aux financements CPF/OPCO. Recours sous 30 jours à activer immédiatement',
      'Les Acteurs de la Compétence (ex-FFP) accompagnent leurs adhérents en difficulté (juriste dédié, médiation)',
      'Vérifiez vos certifications RNCP : leur retrait fragilise la valeur de votre catalogue',
    ],
    chambre: 'CCI',
  },
  artisanat: {
    label: 'Artisanat',
    cotisationOrg: 'URSSAF',
    // Urssaf : 36 98 pour les indépendants (artisans, commerçants), 39 57 pour les employeurs
    cotisationTel: '3698 (indépendant·e·s) ou 3957 (employeurs)',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'CMA France', role: 'Chambre de Métiers et de l\'Artisanat — réseau national', telephone: '01 44 43 10 00', site: 'https://www.artisanat.fr' },
      { nom: 'U2P', role: 'Union des entreprises de proximité — artisans, libéraux, TPE', telephone: '01 47 63 31 31', site: 'https://u2p-france.fr' },
      { nom: 'CAPEB', role: 'Confédération de l\'artisanat et des PME du bâtiment', telephone: '01 53 60 50 00', site: 'https://www.capeb.fr' },
      { nom: 'CGAD', role: 'Confédération Générale de l\'Alimentation en Détail — boulangers, bouchers, primeurs…', telephone: '01 44 90 88 44', site: 'https://www.cgad.fr' },
      { nom: 'UNEC', role: 'Union Nationale des Entreprises de Coiffure', telephone: '01 42 61 53 24', site: 'https://www.unec.fr' },
      { nom: 'CNEP', role: 'Confédération Nationale de l\'Esthétique Parfumerie', telephone: '02 34 40 02 82', site: 'https://www.cnep-france.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'CMA · Accompagnement', description: 'Diagnostic et accompagnement gratuit pour artisans en difficulté.', site: 'https://www.artisanat.fr', badge: 'Gratuit' },
      { nom: 'CMA · Cellule de prévention des difficultés', description: 'Permanence dédiée aux artisans en difficulté dans chaque CMA départementale.', site: 'https://www.artisanat.fr', badge: 'Confidentiel' },
      { nom: 'AGEFICE', description: 'Fonds d\'assurance formation dirigeant non-salarié — financements formations métier et gestion.', site: 'https://communication-agefice.fr', badge: 'Cotisant TPE' },
    ],
    soutien: { nom: 'APESA + CMA Entraide', description: 'APESA activable via le tribunal de commerce. Les CMA disposent aussi de cellules d\'écoute internes.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'La CMA (pas la CCI) est votre interlocuteur principal en tant qu\'artisan — chaque CMA a une cellule de prévention',
      'L\'U2P défend les intérêts des artisans et TPE au niveau national',
      'CAPEB (artisans BTP), CGAD (alimentaire), UNEC (coiffure), CNEP (esthétique) ont des juristes dédiés aux adhérents',
      'AGEFICE finance les formations gestion/rebond du dirigeant non-salarié',
      'Retraite : les artisans et commerçants relèvent de l\'Assurance retraite (3960) ; les cotisations sont recouvrées par l\'Urssaf (3698 pour les indépendant·e·s, 3957 pour les employeurs)',
    ],
    chambre: 'CMA',
    caissesRetraite: [
      // Retraite des artisans et commerçants : Assurance retraite (3960) depuis
      // l'intégration de la sécurité sociale des indépendants au régime général.
      { profession: 'Artisan / commerçant', caisse: 'Assurance retraite', telephone: '3960', site: 'https://www.lassuranceretraite.fr' },
    ],
  },
  ess: {
    label: 'Association / ESS',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'UDES', role: 'Union des employeurs de l\'économie sociale et solidaire', telephone: '01 43 41 71 72', site: 'https://www.udes.fr' },
      { nom: 'Le Mouvement associatif', role: 'Porte-voix des associations — 700 000 structures', telephone: '01 40 36 80 10', site: 'https://lemouvementassociatif.org' },
      { nom: 'ESS France', role: 'Chambre française de l\'économie sociale et solidaire', site: 'https://www.ess-france.org' },
      { nom: 'France Générosités', role: 'Syndicat des organisations faisant appel aux dons', site: 'https://www.francegenerosites.org' },
    ],
    aidesSpecifiques: [
      { nom: 'DLA — Dispositif Local d\'Accompagnement', description: 'LE dispositif public d\'accompagnement des structures ESS en difficulté : diagnostic gratuit + accompagnement par un consultant financé par l\'État. Porté localement (souvent par France Active ou BGE).', site: 'https://www.info-dla.fr', badge: 'Gratuit · prioritaire' },
      { nom: 'France Active — financement solidaire', description: 'Garanties de prêts, prêts solidaires et fonds d\'amorçage dédiés aux structures de l\'ESS.', site: 'https://www.franceactive.org', badge: 'ESS' },
      { nom: 'FONJEP', description: 'Postes FONJEP : subvention pérenne pour les postes d\'animation et de coordination associatifs (jeunesse, éducation populaire).', site: 'https://www.fonjep.org' },
    ],
    soutien: { nom: 'APESA + DLA', description: 'APESA pour l\'écoute psychologique du dirigeant ou responsable associatif ; le DLA pour poser un diagnostic et sortir la structure de l\'impasse.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Le DLA (info-dla.fr) est votre premier réflexe : diagnostic gratuit financé par l\'État, spécifique aux associations et structures ESS en difficulté',
      'Une association peut faire l\'objet d\'une procédure collective (sauvegarde, RJ, LJ) comme une entreprise dès lors qu\'elle a une activité économique',
      'Vérifiez vos subventions : une collectivité ne peut pas combler le passif, mais un fonds de soutien exceptionnel peut être sollicité',
      'L\'UDES et Le Mouvement associatif ont des cellules d\'appui juridique pour leurs adhérents',
    ],
    chambre: 'CCI',
  },
  services: {
    label: 'Services aux entreprises',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'FEP', role: 'Fédération des Entreprises de Propreté et services associés', site: 'https://www.monde-proprete.com' },
      { nom: 'GES', role: 'Groupement des Entreprises de Sécurité — sécurité privée', site: 'https://ges-securite-privee.org' },
      { nom: 'Prism\'emploi', role: 'Syndicat professionnel du travail temporaire et du recrutement', site: 'https://www.prismemploi.eu' },
      { nom: 'EdV — Entreprises du Voyage', role: 'Syndicat des agences de voyage et tour-opérateurs', site: 'https://edv.travel' },
      { nom: 'UNEP', role: 'Union Nationale des Entreprises du Paysage', site: 'https://www.lesentreprisesdupaysage.fr' },
    ],
    aidesSpecifiques: [
      { nom: 'APST — garantie financière voyage', description: 'Garantie financière obligatoire des agences de voyage : protège les fonds clients et peut accompagner un adhérent fragilisé. À contacter dès les premières difficultés.', site: 'https://www.apst.travel', badge: 'Agences de voyage' },
      { nom: 'AKTO — FNE-Formation', description: 'OPCO des services à forte main-d\'œuvre (propreté, sécurité, intérim) : financement de formations pendant les baisses d\'activité.', site: 'https://www.akto.fr', badge: 'Employeurs' },
    ],
    soutien: { nom: 'APESA', description: 'Pas de dispositif d\'écoute propre aux services : APESA est le réflexe n°1, activable via le tribunal de commerce ou directement sur apesa-france.com. Gratuit et confidentiel.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Sécurité privée : informez le CNAPS en cas de procédure collective — l\'autorisation d\'exercer n\'est pas retirée automatiquement',
      'Agences de voyage : sans garantie financière (APST ou équivalent), l\'immatriculation Atout France tombe — c\'est votre licence d\'exploitation, anticipez son renouvellement',
      'Intérim : la garantie financière est une condition légale d\'exercice (art. L1251-49 du Code du travail) — son renouvellement se négocie plusieurs mois à l\'avance',
      'Propreté et sécurité : en cas de perte d\'un marché, les salariés qui y sont affectés sont en principe repris par le nouveau titulaire (transfert conventionnel de la CCN Propreté et de la CCN Prévention-sécurité), ce qui réduit le coût social d\'un repli',
    ],
    chambre: 'CCI',
  },
  'culture-sport': {
    label: 'Culture / Sport / Loisirs',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [
      { nom: 'CoSMoS', role: 'Conseil Social du Mouvement Sportif — employeurs du sport', site: 'https://cosmos.asso.fr' },
      { nom: 'PRODISS', role: 'Syndicat national du spectacle musical et de variété', site: 'https://www.prodiss.org' },
      { nom: 'La Maison des Artistes', role: 'Association de gestion et d\'entraide des artistes plasticiens', site: 'https://www.lamaisondesartistes.fr' },
      { nom: 'Union Sport & Cycle', role: 'Entreprises du sport, des loisirs et du cycle — salles de sport incluses', site: 'https://www.unionsportcycle.com' },
    ],
    aidesSpecifiques: [
      { nom: 'CNM — Centre National de la Musique', description: 'Aides aux entreprises de la filière musicale : labels, salles de concert, producteurs de spectacles.', site: 'https://cnm.fr', badge: 'Musique · spectacle' },
      { nom: 'ASTP — théâtre privé', description: 'Fonds de soutien du théâtre privé : appui à l\'exploitation et à la trésorerie des théâtres adhérents.', site: 'https://www.astp.asso.fr', badge: 'Théâtres' },
      { nom: 'Urssaf artistes-auteurs', description: 'Guichet unique des cotisations artistes-auteurs (ex-Maison des Artistes / AGESSA) : échéanciers et action sociale possibles en cas de difficulté.', site: 'https://www.artistes-auteurs.urssaf.fr' },
      { nom: 'Agence nationale du Sport', description: 'Subventions d\'équipement et d\'emploi sportif, versées via les fédérations et les projets sportifs territoriaux.', site: 'https://www.agencedusport.fr', badge: 'Sport' },
    ],
    soutien: { nom: 'APESA', description: 'Pas de dispositif d\'écoute propre à la culture ou au sport : APESA est le réflexe n°1, activable via le tribunal de commerce ou directement sur apesa-france.com. Gratuit et confidentiel.', site: 'https://www.apesa-france.com' },
    conseilsSpecifiques: [
      'Employeur occasionnel de spectacle vivant : le GUSO (www.guso.fr) simplifie les déclarations et cotisations des artistes et techniciens (annexes 8 et 10 de l\'assurance chômage)',
      'Une procédure collective n\'entraîne pas le retrait automatique du récépissé d\'entrepreneur de spectacles vivants',
      'Salles de sport : le loyer est souvent la première charge — renégociation du bail commercial et gel des loyers antérieurs en procédure collective sont vos leviers principaux',
      'Le CoSMoS offre un appui juridique et social à ses adhérents employeurs du sport',
    ],
    chambre: 'CCI',
  },
  autre: {
    label: 'Autre',
    cotisationOrg: 'URSSAF',
    cotisationTel: '3957',
    cotisationSite: 'https://www.urssaf.fr',
    syndicats: [],
    aidesSpecifiques: [],
    conseilsSpecifiques: [],
    chambre: 'CCI',
  },
};

/**
 * Texte de l'action « Prendre soin de moi » du plan d'action, sans doublon :
 * APESA n'est ajouté que si le soutien sectoriel ne le cite pas déjà
 * (évite « Prendre soin de moi (APESA, APESA) »).
 */
export function libelleActionSoutien(
  sector: Pick<SectorInfo, 'soutien'>,
  /** « moi » pour le plan d'action, « vous » pour la checklist. */
  personne: 'moi' | 'vous' = 'moi',
): string {
  const debut = `Prendre soin de ${personne}`;
  const nom = sector.soutien?.nom;
  if (!nom) return `${debut} (APESA, médecin, sommeil)`;
  return /apesa/i.test(nom) ? `${debut} (${nom})` : `${debut} (${nom}, APESA)`;
}

/** « Contacter FNTR (Fédération nationale des transports routiers — marchandises) » */
export function libelleContactSyndicat(syndicat: OrganismeSecteur): string {
  return `Contacter ${syndicat.nom} (${syndicat.role})`;
}

/**
 * Le secteur « transport » (section H) regroupe le routier, le ferroviaire,
 * le maritime/fluvial (50), l'aérien (51) et l'entreposage (52). Les
 * données de base visent le transport routier : on les ajuste pour que
 * FNTR (fret routier) ne soit proposée qu'au transport routier (49.4).
 */
function ajusterTransport(
  nafCompact: string,
  data: Omit<SectorInfo, 'secteur'>,
): Partial<SectorInfo> {
  const sauf = (...noms: string[]) => data.syndicats.filter((o) => !noms.includes(o.nom));
  const enPremier = (nom: string, liste: OrganismeSecteur[]) => [
    ...liste.filter((o) => o.nom === nom),
    ...liste.filter((o) => o.nom !== nom),
  ];
  // Fret routier et déménagement (49.41, 49.42) : liste complète.
  if (nafCompact.startsWith('494')) {
    return nafCompact.startsWith('4942') ? { syndicats: enPremier('CSD', data.syndicats) } : {};
  }
  // Maritime et aérien : organisations propres, pas de dispositifs routiers
  // (TICPE gazole, licences DREAL, véhicules utilitaires).
  const horsRoute = { aidesSpecifiques: [], conseilsSpecifiques: [], santeSecteur: undefined };
  if (nafCompact.startsWith('501') || nafCompact.startsWith('502')) {
    return {
      ...horsRoute,
      syndicats: [
        {
          nom: 'Armateurs de France',
          role: 'Organisation professionnelle des entreprises de transport et de services maritimes',
          site: 'https://www.armateursdefrance.org',
        },
      ],
    };
  }
  if (nafCompact.startsWith('50')) {
    // Transport fluvial (50.3, 50.4) : pas d'organisation sourcée ici.
    return { ...horsRoute, syndicats: [] };
  }
  if (nafCompact.startsWith('51')) {
    return {
      ...horsRoute,
      syndicats: [
        {
          nom: 'FNAM',
          role: 'Fédération Nationale de l\'Aviation et de ses Métiers',
          site: 'https://www.fnam.fr',
        },
      ],
    };
  }
  // Taxis et VTC (49.32) : pas de FNTR (Mobilians ne représente ni les taxis
  // ni les VTC : mobilians.fr).
  if (nafCompact.startsWith('4932')) return { syndicats: sauf('FNTR') };
  // Autres voyageurs (49.31, 49.39 : transports urbains, autocars) : FNTV d'abord.
  if (nafCompact.startsWith('493')) return { syndicats: enPremier('FNTV', sauf('FNTR')) };
  // Entreposage et services auxiliaires (52) : TLF d'abord.
  if (nafCompact.startsWith('52')) return { syndicats: enPremier('TLF', sauf('FNTR')) };
  // Ferroviaire, conduites… : sans FNTR.
  return { syndicats: sauf('FNTR') };
}

/**
 * Forme juridique propre à l'exploitation agricole : EARL, GAEC, SCEA
 * (libellés INSEE 6598, 6533, 6597, ou sigles saisis tels quels).
 */
export function estFormeAgricole(formeJuridique: string | undefined): boolean {
  const f = (formeJuridique ?? '').toLowerCase();
  return /\bearl\b|\bgaec\b|\bscea\b|exploitation agricole|groupement agricole d.exploitation/.test(f);
}

export function getSectorInfo(company: CompanyData): SectorInfo {
  const naf = company.naf || '';
  const section = sectionFromNaf(naf);
  let secteur = secteurFromSection(section);

  // Pêche et aquaculture (NAF 03.xx) : secteur dédié avec organismes spécifiques (ENIM, CNPMEM…)
  const nafCompact = naf.replace(/\./g, '');
  const nafPrefix = nafCompact.slice(0, 2);
  if (nafPrefix === '03') {
    secteur = 'peche';
  }

  // Formes propres à l'exploitation agricole (EARL et GAEC : Code rural,
  // livre III ; SCEA : société civile à objet agricole) : régime agricole
  // (MSA) même si le code NAF est absent ou classé ailleurs. La pêche
  // (NAF 03) garde son secteur (ENIM).
  if (secteur !== 'peche' && estFormeAgricole(company.formeJuridique)) {
    secteur = 'agriculture';
  }

  // Associations et organisations (NAF 94.xx) : ESS, pas artisanat —
  // UDES / Mouvement associatif / DLA au lieu de CMA / U2P.
  if (nafPrefix === '94') {
    secteur = 'ess';
  }

  // Activités de poste et de courrier (NAF 53.xx : La Poste, coursiers,
  // livreurs) : section H mais pas du transport routier (FNTR, licences
  // DREAL, TICPE ne s'appliquent pas) → services.
  if (nafPrefix === '53') {
    secteur = 'services';
  }

  if (secteur === 'commerce' && isArtisan(naf, company.formeJuridique)) {
    secteur = 'artisanat';
  }
  if (secteur === 'industrie' && isArtisan(naf, company.formeJuridique)) {
    secteur = 'artisanat';
  }

  // Professions de santé réglementées hors section Q :
  // - Pharmacie d'officine (47.73Z) : classée commerce par la NAF mais relève
  //   de l'Ordre des pharmaciens, de la CAVP et des syndicats d'officine.
  // - Vétérinaires (75.00Z) : section M mais caisse CARPV, Ordre des
  //   vétérinaires et Vetos-Entraide sont dans le secteur santé.
  if (nafCompact.startsWith('4773') || nafPrefix === '75') {
    secteur = 'sante';
  }

  const data = SECTOR_DATA[secteur];
  // Le CSP s'applique à tous les secteurs dès lors qu'il y a un licenciement économique.
  // Pré-injection systématique : les composants l'affichent uniquement
  // si reponses.effectif === 'salaries' (filtrage métier en aval).
  const obligationsLicenciement: ObligationLicenciement[] = [
    CSP_OBLIGATION,
    ...(data.obligationsLicenciement ?? []),
  ];

  return {
    secteur,
    ...data,
    ...(secteur === 'transport' ? ajusterTransport(nafCompact, data) : {}),
    obligationsLicenciement,
  };
}

/**
 * Retourne les obligations spécifiques à un licenciement économique selon l'effectif.
 * Utile pour les composants de la fiche qui affichent les démarches employeur.
 * - < 1 000 salariés : CSP obligatoire
 * - ≥ 1 000 salariés : congé de reclassement obligatoire
 * - ≥ 50 salariés ET ≥ 10 licenciements / 30 j : PSE
 */
export function getObligationsLicenciement(effectifApprox: number): ObligationLicenciement[] {
  const obligations: ObligationLicenciement[] = [];
  if (effectifApprox < 1000) {
    obligations.push(CSP_OBLIGATION);
  } else {
    obligations.push({
      sigle: 'Congé de reclassement',
      nom: 'Congé de reclassement',
      description:
        "Obligatoire pour tout licenciement économique en entreprise de 1 000 salariés et plus. Durée de 4 à 12 mois. Pendant ce congé, le salarié perçoit sa rémunération habituelle (puis 65 % du salaire brut au-delà du préavis). Accompagnement par une cellule de reclassement.",
      // 39 95 : France Travail, ligne des employeurs (francetravail.fr, « Le 3995 »).
      telephone: '39 95',
      site: 'https://www.service-public.fr/particuliers/vosdroits/F2906',
      badge: 'Obligatoire ≥ 1 000 salariés',
    });
  }
  if (effectifApprox >= 50) {
    obligations.push({
      sigle: 'PSE',
      nom: "Plan de Sauvegarde de l'Emploi",
      description:
        "Obligatoire pour tout licenciement collectif d'au moins 10 salariés sur 30 jours en entreprise d'au moins 50 salariés. Doit inclure mesures de reclassement, formation, accompagnement. Soumis à validation (accord majoritaire) ou homologation (document unilatéral) par la DREETS.",
      site: 'https://www.travail-emploi.gouv.fr',
      badge: '≥ 50 sal. · ≥ 10 licenciements / 30 j',
    });
  }
  return obligations;
}

export function getCompanyAge(dateCreation: string): number | null {
  if (!dateCreation) return null;
  const d = new Date(dateCreation);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export interface EffectifSeuils {
  approx: number;
  cse: boolean;
  obligations50: boolean;
}

/**
 * Tranches d'effectif salarié de Sirene (codes INSEE) : libellé affiché,
 * bornes et valeur approchée utilisée pour les seuils.
 * Source unique pour lib/sirene.ts (affichage) et getEffectifSeuils.
 */
export const TRANCHES_EFFECTIF: Record<string, { libelle: string; min: number; max: number | null; approx: number }> = {
  '00': { libelle: '0 salarié', min: 0, max: 0, approx: 0 },
  '01': { libelle: '1 ou 2 salariés', min: 1, max: 2, approx: 2 },
  '02': { libelle: '3 à 5 salariés', min: 3, max: 5, approx: 5 },
  '03': { libelle: '6 à 9 salariés', min: 6, max: 9, approx: 9 },
  '11': { libelle: '10 à 19 salariés', min: 10, max: 19, approx: 15 },
  '12': { libelle: '20 à 49 salariés', min: 20, max: 49, approx: 35 },
  '21': { libelle: '50 à 99 salariés', min: 50, max: 99, approx: 75 },
  '22': { libelle: '100 à 199 salariés', min: 100, max: 199, approx: 150 },
  '31': { libelle: '200 à 249 salariés', min: 200, max: 249, approx: 220 },
  '32': { libelle: '250 à 499 salariés', min: 250, max: 499, approx: 350 },
  '41': { libelle: '500 à 999 salariés', min: 500, max: 999, approx: 750 },
  '42': { libelle: '1 000 à 1 999 salariés', min: 1000, max: 1999, approx: 1500 },
  '51': { libelle: '2 000 à 4 999 salariés', min: 2000, max: 4999, approx: 3000 },
  '52': { libelle: '5 000 à 9 999 salariés', min: 5000, max: 9999, approx: 7000 },
  '53': { libelle: '10 000 salariés et plus', min: 10000, max: null, approx: 12000 },
};

/** Libellé affiché pour un code de tranche INSEE (« NN » ou inconnu → « Non renseigné »). */
export function libelleTrancheEffectif(code: string | undefined): string {
  return TRANCHES_EFFECTIF[(code ?? '').trim()]?.libelle ?? 'Non renseigné';
}

/** « 1000 à 1999 salariés » (anciennes fiches) ≡ « 1 000 à 1 999 salariés ». */
function normaliserLibelleEffectif(libelle: string): string {
  return (libelle || '').replace(/(\d)[\s  ]+(?=\d{3}\b)/g, '$1').trim();
}

const TRANCHE_PAR_LIBELLE: Record<string, (typeof TRANCHES_EFFECTIF)[string]> = Object.fromEntries(
  Object.values(TRANCHES_EFFECTIF).map((t) => [normaliserLibelleEffectif(t.libelle), t]),
);

/** Tranche correspondant à un libellé d'effectif (tolère les espaces de milliers). */
export function trancheDepuisLibelle(effectif: string): (typeof TRANCHES_EFFECTIF)[string] | null {
  return TRANCHE_PAR_LIBELLE[normaliserLibelleEffectif(effectif)] ?? null;
}

export function getEffectifSeuils(effectif: string): EffectifSeuils {
  const approx = trancheDepuisLibelle(effectif)?.approx ?? 0;
  return {
    approx,
    cse: approx >= 11,
    obligations50: approx >= 50,
  };
}

export interface ObligationSeuil {
  seuilMin: number;
  atteint: boolean;
  titre: string;
  description: string;
}

export function getObligationsEffectif(seuils: EffectifSeuils): ObligationSeuil[] {
  const n = seuils.approx;
  return [
    {
      seuilMin: 11,
      atteint: n >= 11,
      titre: 'CSE (Comité Social et Économique)',
      description:
        "Obligatoire dès 11 salariés pendant 12 mois consécutifs. En cas de difficulté économique, l'employeur doit informer et consulter le CSE — sous peine de délit d'entrave.",
    },
    {
      seuilMin: 20,
      atteint: n >= 20,
      titre: 'Règlement intérieur',
      description:
        "Obligatoire à partir de 20 salariés. Doit notamment prévoir les règles disciplinaires et l'hygiène/sécurité.",
    },
    {
      seuilMin: 50,
      atteint: n >= 50,
      titre: 'CSE élargi, participation, PSE',
      description:
        "À 50 salariés : accord de participation aux résultats, représentant de proximité, budget d'activités sociales du CSE. Un Plan de Sauvegarde de l'Emploi (PSE) est obligatoire pour tout licenciement économique de 10+ salariés sur 30 jours.",
    },
    {
      seuilMin: 50,
      atteint: n >= 50,
      titre: 'Information-consultation renforcée du CSE',
      description:
        "À partir de 50 salariés, le CSE doit être consulté chaque année sur les orientations stratégiques. En difficulté, il peut exercer un droit d'alerte économique et se faire assister d'un expert-comptable aux frais de l'entreprise.",
    },
    {
      seuilMin: 50,
      atteint: n >= 50,
      titre: 'Index égalité professionnelle',
      description:
        "Publication annuelle obligatoire de l'index égalité femmes-hommes dès 50 salariés (article L1142-8 du Code du travail), avant le 1er mars sur le site de l'entreprise.",
    },
    {
      seuilMin: 100,
      atteint: n >= 100,
      titre: 'Bilan social annuel',
      description:
        "Obligatoire à partir de 300 salariés mais recommandé dès 100. Agrège indicateurs emploi, rémunération, formation sur 3 ans.",
    },
    {
      seuilMin: 300,
      atteint: n >= 300,
      titre: 'GEPP et bilan social obligatoire',
      description:
        "À 300 salariés : négociation obligatoire sur la Gestion des Emplois et des Parcours Professionnels (GEPP), bilan social annuel ; à défaut d'accord d'entreprise, commission de la formation et commission de l'égalité professionnelle au CSE (C. trav. L2242-2, L2312-28, L2315-49 et L2315-56).",
    },
    {
      seuilMin: 1000,
      atteint: n >= 1000,
      titre: 'Obligations de grand groupe',
      description:
        "Comité de groupe, accord d'entreprise sur la prévention de la pénibilité, congé de mobilité en cas de restructuration, obligations de sous-traitance responsable.",
    },
  ];
}

export function getChambreLabel(chambre: 'CCI' | 'CMA' | 'CA'): string {
  const labels = {
    CCI: 'Chambre de commerce et d\'industrie (CCI)',
    CMA: 'Chambre de Métiers et de l\'Artisanat (CMA)',
    CA: 'Chambre d\'agriculture',
  };
  return labels[chambre];
}

/**
 * Interlocuteur d'accompagnement à proposer dans le plan d'action, avec son
 * article (« la CCI (33) », « la Chambre d'agriculture (33) »…) :
 * - association, fondation, ESS → le DLA (Dispositif local d'accompagnement) ;
 * - profession libérale ou de santé → le CIP (pas de chambre consulaire) ;
 * - sinon la chambre consulaire du secteur, sans abréviation ambiguë.
 */
export function libelleChambre(
  s: Pick<SectorInfo, 'secteur' | 'chambre'>,
  c: Pick<CompanyData, 'formeJuridique' | 'departement'>,
): string {
  const dep = c.departement ? ` (${c.departement})` : '';
  if (/association|fondation/i.test(c.formeJuridique || '') || s.secteur === 'ess') {
    return `le DLA (Dispositif local d'accompagnement)${dep}`;
  }
  if (s.secteur === 'liberal' || s.secteur === 'sante') {
    return "le CIP (Centre d'information sur la prévention)";
  }
  if (s.chambre === 'CA') return `la Chambre d'agriculture${dep}`;
  if (s.chambre === 'CMA') return `la Chambre de métiers et de l'artisanat${dep}`;
  return `la CCI${dep}`;
}
