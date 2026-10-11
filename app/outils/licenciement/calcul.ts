// Plafonds AGS — valeurs 2026 (art. D3253-5 C. trav.) :
// garantie = 4, 5 ou 6 × le plafond mensuel des contributions d'assurance
// chômage (lui-même = 4 × PMSS ; PMSS 2026 = 4 005 €/mois, arrêté du
// 22 décembre 2025). 4 × 4 × 4 005 = 64 080 € · 5 × → 80 100 € · 6 × → 96 120 €.
export const PLAFOND_AGS_HAUT = 96120;
export const PLAFOND_AGS_INTER = 80100;
export const PLAFOND_AGS_BAS = 64080;

/** Ancienneté minimale ouvrant droit à l'indemnité légale (art. L1234-9 C. trav.). */
export const ANCIENNETE_MIN_MOIS = 8;

export interface Salarie {
  id: string;
  ancienneteMois: number;
  salaireBrut: number;
}

export function calculIndemnite(ancienneteMois: number, salaireBrutMensuel: number): {
  montant: number;
  jusqua10ans: number;
  apres10ans: number;
} {
  // Pas d'indemnité légale sous 8 mois d'ancienneté (L1234-9).
  if (!(ancienneteMois >= ANCIENNETE_MIN_MOIS)) {
    return { montant: 0, jusqua10ans: 0, apres10ans: 0 };
  }
  const ans = ancienneteMois / 12;
  const jusqua10 = Math.min(ans, 10);
  const apres10 = Math.max(0, ans - 10);
  // R1234-2 : ¼ de mois par année jusqu'à 10 ans, ⅓ au-delà.
  const partA = (1 / 4) * salaireBrutMensuel * jusqua10;
  const partB = (1 / 3) * salaireBrutMensuel * apres10;
  return { montant: partA + partB, jusqua10ans: partA, apres10ans: partB };
}

export function plafondAgs(ancienneteMois: number): number {
  // Source : art. D3253-5 C. trav. — ancienneté du CONTRAT au jour du jugement
  // Plafond 4 : contrat conclu moins de 6 mois avant le jugement d'ouverture
  // Plafond 5 : contrat conclu entre 6 mois et 2 ans avant
  // Plafond 6 : contrat conclu au moins 2 ans avant
  if (ancienneteMois < 6) return PLAFOND_AGS_BAS;
  if (ancienneteMois < 24) return PLAFOND_AGS_INTER;
  return PLAFOND_AGS_HAUT;
}

export function calculEquipe(salaries: Salarie[]) {
  let totalIndem = 0;
  let totalAgs = 0;
  let totalDepasse = 0;
  const lignes = salaries.map((s) => {
    const calc = calculIndemnite(s.ancienneteMois, s.salaireBrut);
    const plaf = plafondAgs(s.ancienneteMois);
    const couvert = Math.min(calc.montant, plaf);
    const depasse = Math.max(0, calc.montant - plaf);
    totalIndem += calc.montant;
    totalAgs += couvert;
    totalDepasse += depasse;
    return { s, calc, plafond: plaf, couvert, depasse };
  });
  return { lignes, totalIndem, totalAgs, totalDepasse };
}
