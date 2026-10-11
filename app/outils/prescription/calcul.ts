/** Règles du vérificateur de prescription (/outils/prescription). */
export type Categorie =
  | 'urssaf'
  | 'fiscal-revenu'
  | 'fiscal-tva'
  | 'civil'
  | 'commercial'
  | 'baux'
  | 'salaire'
  | 'penal-amende';

export interface Regle {
  cle: Categorie;
  label: string;
  duree: number; // années
  base: string;
  reference: string;
  point: string; // point de départ du délai
  interruption: string;
  /**
   * Impôts : le délai de reprise court jusqu'au 31 décembre de la N-ième
   * année suivant l'année de départ (LPF L169, L176), et non « date + N ans ».
   */
  finAnneeCivile?: boolean;
}

export const REGLES: Regle[] = [
  {
    cle: 'urssaf',
    label: 'Cotisations sociales (URSSAF, MSA, SSI)',
    duree: 3,
    base: 'Code de la Sécurité sociale',
    reference: 'CSS art. L244-3',
    point: "Date d'exigibilité de la cotisation (échéance déclarative).",
    interruption:
      "Mise en demeure, contrainte signifiée, reconnaissance écrite de la dette par le débiteur.",
  },
  {
    cle: 'fiscal-revenu',
    label: 'Impôt sur le revenu / Impôt sur les sociétés',
    duree: 3,
    base: 'Livre des procédures fiscales',
    reference: 'LPF art. L169 (délai de reprise)',
    point:
      "Année au titre de laquelle l'impôt est dû ; le délai court jusqu'au 31 décembre de la 3e année qui suit.",
    interruption:
      "Proposition de rectification, jugement, demande d'assistance internationale.",

    finAnneeCivile: true,
  },
  {
    cle: 'fiscal-tva',
    label: 'TVA',
    duree: 3,
    base: 'Livre des procédures fiscales',
    reference: 'LPF art. L176 (délai de reprise)',
    point:
      "Année au cours de laquelle la TVA est devenue exigible ; le délai court jusqu'au 31 décembre de la 3e année qui suit.",
    interruption: "Proposition de rectification, action en recouvrement.",
    finAnneeCivile: true,
  },
  {
    cle: 'civil',
    label: 'Action civile (entre particuliers, dette personnelle)',
    duree: 5,
    base: 'Code civil',
    reference: 'C. civ. art. 2224',
    point:
      "Jour où le titulaire du droit a connu ou aurait dû connaître les faits lui permettant de l'exercer.",
    interruption:
      "Demande en justice, acte d'exécution forcée, reconnaissance du droit par le débiteur (art. 2240 et s.).",
  },
  {
    cle: 'commercial',
    label: 'Action commerciale (entre commerçants)',
    duree: 5,
    base: 'Code de commerce',
    reference: 'C. com. art. L110-4',
    point: "Date d'exigibilité de la créance commerciale.",
    interruption:
      "Reconnaissance, demande en justice, mesure conservatoire.",
  },
  {
    cle: 'baux',
    label: 'Loyer commercial (action en paiement)',
    duree: 5,
    base: 'Code civil',
    reference: 'C. civ. art. 2224 (jurisprudence Cass. 3e civ.)',
    point: "Date d'échéance de chaque terme de loyer.",
    interruption:
      "Commandement de payer visant la clause résolutoire, action en justice.",
  },
  {
    cle: 'salaire',
    label: 'Action en paiement du salaire',
    duree: 3,
    base: 'Code du travail',
    reference: 'C. trav. art. L3245-1',
    point: "Jour où celui qui exerce l'action a connu ou aurait dû connaître les faits.",
    interruption:
      "Saisine du conseil de prud'hommes, reconnaissance écrite par l'employeur.",
  },
  {
    cle: 'penal-amende',
    label: "Amendes pénales / contraventions",
    duree: 3,
    // Peines contraventionnelles : 3 ans révolus à compter de la décision
    // définitive (C. pén. art. 133-4, legifrance.gouv.fr).
    base: 'Code pénal',
    reference: 'C. pén. art. 133-4',
    point: "Date à laquelle la décision est devenue définitive.",
    interruption: "Tout acte d'exécution.",
  },
];

export function addYears(d: Date, n: number): Date {
  const out = new Date(d);
  out.setFullYear(out.getFullYear() + n);
  return out;
}

export function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}


/** Lit une date AAAA-MM-JJ du champ <input type="date"> en heure locale (minuit). */
function lireDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

export interface ResultatPrescription {
  echeance: Date;
  restants: number;
  /** Vrai si la date de départ saisie est postérieure à aujourd'hui. */
  departFutur: boolean;
}

export function calculerPrescription(
  regle: Regle,
  dateDepart: string,
  dateInterruption: string | null,
  maintenant: Date = new Date(),
): ResultatPrescription | null {
  if (!dateDepart) return null;
  const interruption = dateInterruption ? lireDate(dateInterruption) : null;
  const base = interruption ?? lireDate(dateDepart);
  if (!base) return null;
  // Impôts : fin de la N-ième année civile suivant l'année de départ.
  // Après une interruption, on garde le calcul « date + N ans »
  // (estimation, faute de règle unique selon l'acte interruptif).
  const echeance =
    regle.finAnneeCivile && !interruption
      ? new Date(base.getFullYear() + regle.duree, 11, 31)
      : addYears(base, regle.duree);
  const today = new Date(maintenant);
  today.setHours(0, 0, 0, 0);
  return {
    echeance,
    restants: daysBetween(today, echeance),
    departFutur: base.getTime() > today.getTime(),
  };
}
