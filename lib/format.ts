/**
 * Mise en forme des nombres à la française (virgule décimale) pour les
 * calculateurs et la fiche : « 1,5 k€ », « 1 an », « 2,5 ans ».
 */

/** Nombre avec au plus `decimales` chiffres après la virgule (« 1,25 », « 5 »). */
export function nombreFr(n: number, decimales = 1): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: decimales });
}

/** Durée en années à partir d'un nombre de mois : « 1 an », « 1,5 an », « 2 ans ». */
export function dureeEnAnnees(mois: number): string {
  const annees = Math.round((mois / 12) * 10) / 10;
  return `${nombreFr(annees, 1)} ${annees < 2 ? 'an' : 'ans'}`;
}
