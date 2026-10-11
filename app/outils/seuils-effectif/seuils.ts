/** Seuils d'effectif et obligations associées (vérificateur /outils/seuils-effectif). */
export interface Seuil {
  seuil: number;
  nom: string;
  description: string;
  reference: string;
  delai?: string;
  badge?: 'social' | 'fiscal' | 'sante' | 'finance';
}

export const SEUILS: Seuil[] = [
  { seuil: 1, nom: 'Premier salarié', description: 'Affiliation URSSAF, médecine du travail, DSN mensuelle, registre du personnel, affichages obligatoires.', reference: 'C. trav. L1221-13', badge: 'social' },
  { seuil: 11, nom: 'Élection du CSE (Comité Social et Économique)', description: 'CSE obligatoire dans toute entreprise atteignant 11 salariés pendant 12 mois consécutifs. Informations-consultations obligatoires.', reference: 'C. trav. L2311-2', delai: 'Élection dans les 90 j suivant le dépassement', badge: 'social' },
  { seuil: 20, nom: 'Contribution AGEFIPH', description: 'Obligation d\'emploi de 6 % de travailleurs handicapés (RQTH). À défaut : contribution AGEFIPH proportionnelle.', reference: 'C. trav. L5212-1', badge: 'social' },
  { seuil: 50, nom: 'Règlement intérieur obligatoire', description: 'Obligatoire dans les entreprises ou établissements d\'au moins 50 salariés (seuil de 20 avant 2020). Définit discipline, santé, sécurité.', reference: 'C. trav. L1311-2', delai: '12 mois après l\'atteinte du seuil', badge: 'social' },
  { seuil: 50, nom: 'CSE renforcé', description: 'Le CSE acquiert des prérogatives élargies : commissions obligatoires (santé/sécurité, formation, économique), expert-comptable, accès aux comptes.', reference: 'C. trav. L2312-8', badge: 'social' },
  { seuil: 50, nom: 'Participation obligatoire', description: 'Réserve spéciale de participation aux résultats de l\'entreprise, versée au plus tard le dernier jour du 5e mois suivant la clôture de l\'exercice.', reference: 'C. trav. L3322-1', badge: 'finance' },
  { seuil: 50, nom: 'Plan de Sauvegarde de l\'Emploi (PSE)', description: 'Obligatoire si licenciement éco ≥ 10 salariés sur 30 jours. Validation/homologation DREETS.', reference: 'C. trav. L1233-61', delai: 'Consultation du CSE : 2 à 4 mois selon le nombre de licenciements (L1233-30)', badge: 'social' },
  { seuil: 50, nom: 'Programme annuel de prévention des risques', description: 'Le document unique d\'évaluation des risques (obligatoire dès le 1er salarié) débouche sur un programme annuel de prévention des risques professionnels.', reference: 'C. trav. L4121-3-1', badge: 'sante' },
  { seuil: 50, nom: 'Index égalité professionnelle', description: 'Calcul et publication de l\'index égalité femmes-hommes, déclaré sur Egapro au plus tard le 1er mars (règles appelées à évoluer avec la transposition de la directive européenne sur la transparence salariale).', reference: 'C. trav. L1142-8', badge: 'social' },
  { seuil: 250, nom: 'Référent harcèlement (employeur)', description: 'Désignation par l\'employeur d\'un référent chargé de la lutte contre le harcèlement sexuel (le CSE en désigne un dès qu\'il existe).', reference: 'C. trav. L1153-5-1', badge: 'sante' },
  { seuil: 250, nom: 'PME ≤ 250 : seuil européen', description: 'En dessous : éligibilité maintenue aux aides PME (Bpifrance, dispositif JEI/CIR renforcés, FEDER).', reference: 'Recommandation CE 2003/361', badge: 'finance' },
  { seuil: 300, nom: 'BDESE complète', description: 'Base de données économiques, sociales et environnementales (obligatoire dès 50 salariés) : contenu enrichi à partir de 300 salariés.', reference: 'C. trav. L2312-18, R2312-9', badge: 'social' },
  { seuil: 400, nom: 'CODEFI → CIRI', description: 'CODEFI (Comité Départemental) compétent pour < 400 salariés. Au-delà : CIRI (Comité Interministériel).', reference: 'Décret 82-307', badge: 'finance' },
  { seuil: 500, nom: 'CSRD / Bilan carbone', description: 'Obligation de publier un bilan carbone (BEGES) + reporting durabilité (CSRD pour les grandes entreprises).', reference: 'C. env. L229-25', badge: 'sante' },
  { seuil: 1000, nom: 'Congé de reclassement obligatoire', description: 'Remplace le CSP en cas de licenciement économique. Durée 4 à 12 mois, rémunéré par l\'employeur.', reference: 'C. trav. L1233-71', delai: 'Pendant la durée du congé', badge: 'social' },
];
