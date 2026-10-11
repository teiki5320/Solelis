/**
 * Règles de date des rappels par e-mail, sans dépendance (utilisables dans le
 * navigateur sans embarquer Zod). lib/schemas.ts les réutilise côté API.
 */

/** Rappels : au plus 2 ans dans le futur (au-delà, le rappel n'a plus de sens). */
export const RAPPEL_HORIZON_JOURS = 2 * 366;

/** Date du jour en UTC au format AAAA-MM-JJ. */
export function aujourdhuiIso(maintenant: Date = new Date()): string {
  return maintenant.toISOString().slice(0, 10);
}

/** Vrai si `s` est une date AAAA-MM-JJ qui existe vraiment au calendrier (refuse 2026-02-30). */
export function estDateIsoValide(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Vrai si la date est aujourd'hui ou plus tard, et au plus dans RAPPEL_HORIZON_JOURS jours. */
export function estDateRappelAcceptable(s: string, maintenant: Date = new Date()): boolean {
  if (!estDateIsoValide(s)) return false;
  const aujourdhui = aujourdhuiIso(maintenant);
  if (s < aujourdhui) return false;
  const limite = new Date(`${aujourdhui}T00:00:00Z`);
  limite.setUTCDate(limite.getUTCDate() + RAPPEL_HORIZON_JOURS);
  return s <= limite.toISOString().slice(0, 10);
}
