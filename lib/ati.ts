// Allocation des travailleurs indépendants (ATI) — fiche Unédic « ATI » et
// francetravail.fr : forfait de 26,30 €/jour (environ 800 €/mois), réduit à
// la moyenne mensuelle des revenus d'activité des 2 années précédentes si
// elle est plus basse, sans descendre sous 19,73 €/jour (environ 600 €/mois).

export const ATI_JOURNALIER_MAX = 26.3;
export const ATI_JOURNALIER_MIN = 19.73;

/** Montant journalier estimé de l'ATI (hors Mayotte), arrondi au centime. */
export function montantJournalierAti(revenuN1: number, revenuN2: number): number {
  const total = (Number.isFinite(revenuN1) ? Math.max(0, revenuN1) : 0) + (Number.isFinite(revenuN2) ? Math.max(0, revenuN2) : 0);
  const moyenneMensuelle = total / 24;
  const journalier = (moyenneMensuelle * 12) / 365;
  return Math.round(Math.min(ATI_JOURNALIER_MAX, Math.max(ATI_JOURNALIER_MIN, journalier)) * 100) / 100;
}
