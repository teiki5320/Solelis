import { describe, it, expect } from 'vitest';
import { REGLES, calculerPrescription } from '../prescription/calcul';

const regle = (cle: string) => REGLES.find((r) => r.cle === cle)!;
const AUJOURDHUI = new Date(2026, 9, 11); // 11 octobre 2026

describe('vérificateur de prescription', () => {
  it('TVA : délai de reprise de 3 ans (LPF L176), jusqu’au 31 décembre', () => {
    expect(regle('fiscal-tva').duree).toBe(3);
    const r = calculerPrescription(regle('fiscal-tva'), '2023-05-15', null, AUJOURDHUI)!;
    expect(r.echeance.getFullYear()).toBe(2026);
    expect(r.echeance.getMonth()).toBe(11);
    expect(r.echeance.getDate()).toBe(31);
  });

  it('impôt sur le revenu : 31 décembre de la 3e année suivante (LPF L169), pas « date + 3 ans »', () => {
    const r = calculerPrescription(regle('fiscal-revenu'), '2022-02-10', null, AUJOURDHUI)!;
    expect([r.echeance.getFullYear(), r.echeance.getMonth(), r.echeance.getDate()]).toEqual([2025, 11, 31]);
    expect(r.restants).toBeLessThan(0);
  });

  it('autres dettes : date + N ans (inchangé)', () => {
    const r = calculerPrescription(regle('commercial'), '2022-03-01', null, AUJOURDHUI)!;
    expect([r.echeance.getFullYear(), r.echeance.getMonth(), r.echeance.getDate()]).toEqual([2027, 2, 1]);
  });

  it('signale une date de départ dans le futur', () => {
    expect(calculerPrescription(regle('urssaf'), '2027-01-15', null, AUJOURDHUI)!.departFutur).toBe(true);
    expect(calculerPrescription(regle('urssaf'), '2026-01-15', null, AUJOURDHUI)!.departFutur).toBe(false);
  });

  it('amendes contraventionnelles : 3 ans, article 133-4 du Code pénal', () => {
    expect(regle('penal-amende').duree).toBe(3);
    expect(regle('penal-amende').reference).toBe('C. pén. art. 133-4');
    expect(regle('penal-amende').base).toBe('Code pénal');
  });

  it('URSSAF employeur : 31 décembre de la 3e année suivant l’année des cotisations (CSS L244-3)', () => {
    const r = calculerPrescription(regle('urssaf'), '2023-03-15', null, AUJOURDHUI)!;
    expect([r.echeance.getFullYear(), r.echeance.getMonth(), r.echeance.getDate()]).toEqual([2026, 11, 31]);
    expect(r.restants).toBeGreaterThan(0);
  });

  it('URSSAF indépendant : 30 juin de la 4e année suivante (CSS L244-3)', () => {
    const r = calculerPrescription(regle('urssaf-independant'), '2022-11-01', null, AUJOURDHUI)!;
    expect([r.echeance.getFullYear(), r.echeance.getMonth(), r.echeance.getDate()]).toEqual([2026, 5, 30]);
  });

  it('sans date : pas de résultat', () => {
    expect(calculerPrescription(regle('urssaf'), '', null, AUJOURDHUI)).toBeNull();
  });
});
