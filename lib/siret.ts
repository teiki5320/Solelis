/**
 * Outils SIRET partagés (saisie sur l'accueil, affichage sur la fiche).
 * Fichier léger, sans dépendance : utilisable côté navigateur.
 */

/** SIREN de La Poste : ses SIRET ne respectent pas la clé de Luhn (règle INSEE). */
const SIREN_LA_POSTE = '356000000';

/** Garde les chiffres seulement (14 au plus). */
export function chiffresSiret(v: string | null | undefined): string {
  return (v ?? '').replace(/\D/g, '').slice(0, 14);
}

/**
 * Format d'affichage officiel « 801 867 219 00025 » : SIREN en 3 groupes
 * de 3 chiffres, puis le NIC (5 chiffres). Accepte une saisie partielle.
 */
export function formaterSiret(v: string | null | undefined): string {
  const d = chiffresSiret(v);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9), d.slice(9, 14)].filter(Boolean).join(' ');
}

/** Clé de Luhn : en partant de la droite, un chiffre sur deux est doublé. */
function luhnValide(chiffres: string): boolean {
  let somme = 0;
  for (let i = 0; i < chiffres.length; i++) {
    let n = Number(chiffres[chiffres.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    somme += n;
  }
  return somme % 10 === 0;
}

/**
 * Vrai si le SIRET a 14 chiffres et une clé de contrôle correcte.
 * Exception La Poste (SIREN 356 000 000) : beaucoup de ses établissements
 * ont un SIRET dont la somme des chiffres est un multiple de 5 (et non une
 * clé de Luhn) ; d'autres, comme le siège 356 000 000 00048, suivent Luhn.
 * On accepte donc l'une ou l'autre règle pour ce seul SIREN.
 */
export function siretValide(v: string | null | undefined): boolean {
  const d = (v ?? '').replace(/\s/g, '');
  if (!/^\d{14}$/.test(d)) return false;
  if (d.startsWith(SIREN_LA_POSTE)) {
    const somme = d.split('').reduce((s, c) => s + Number(c), 0);
    return somme % 5 === 0 || luhnValide(d);
  }
  return luhnValide(d);
}
