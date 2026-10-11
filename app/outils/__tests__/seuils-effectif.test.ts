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
});
