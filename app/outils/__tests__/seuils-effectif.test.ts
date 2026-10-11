import { describe, it, expect } from 'vitest';
import { SEUILS } from '../seuils-effectif/seuils';

describe('seuils d’effectif', () => {
  it('règlement intérieur rangé à 50 salariés (C. trav. L1311-2)', () => {
    const ri = SEUILS.find((s) => s.nom.startsWith('Règlement intérieur'));
    expect(ri?.seuil).toBe(50);
    expect(ri?.reference).toContain('L1311-2');
  });

  it('CSE à 11 salariés pendant 12 mois consécutifs (L2311-2)', () => {
    const cse = SEUILS.find((s) => s.reference.includes('L2311-2'));
    expect(cse?.seuil).toBe(11);
    expect(cse?.description).toContain('12 mois consécutifs');
  });

  it('liste triée par seuil croissant (le « prochain seuil » en dépend)', () => {
    const valeurs = SEUILS.map((s) => s.seuil);
    expect([...valeurs].sort((a, b) => a - b)).toEqual(valeurs);
  });

  it('contre-audit tour 4 : références et seuils vérifiés sur legifrance', () => {
    // Participation : L3322-2 (« au moins cinquante salariés »).
    expect(SEUILS.find((s) => s.nom === 'Participation obligatoire')?.reference).toContain('L3322-2');
    // BEGES : personnes morales employant plus de 500 salariés (C. env. L229-25).
    const beges = SEUILS.find((s) => s.reference.includes('L229-25'));
    expect(beges?.seuil).toBe(501);
    expect(beges?.nom).not.toMatch(/CSRD/);
    // Commissions du CSE : 300 salariés (L2315-36), pas 50.
    const cse50 = SEUILS.find((s) => s.nom === 'CSE renforcé');
    expect(cse50?.description).toMatch(/300 salariés/);
    expect(cse50?.description).not.toMatch(/commissions obligatoires/);
    // Le décret n° 82-307 concerne une aide aux commerçants, pas le CODEFI.
    expect(SEUILS.some((s) => s.reference.includes('82-307'))).toBe(false);
    // CSE : 1er tour au plus tard 90 jours après l'information du personnel (L2314-4).
    expect(SEUILS.find((s) => s.reference.includes('L2311-2'))?.delai).toMatch(/information du personnel/);
  });
});
