import { describe, it, expect } from 'vitest';
import { calculEquipe, calculIndemnite, plafondAgs, PLAFOND_AGS_HAUT } from '../licenciement/calcul';

describe('calculateur licenciement', () => {
  it('moins de 8 mois d’ancienneté : aucune indemnité légale (L1234-9), total à 0', () => {
    expect(calculIndemnite(6, 2500).montant).toBe(0);
    const t = calculEquipe([{ id: 'a', ancienneteMois: 6, salaireBrut: 2500 }]);
    expect(t.totalIndem).toBe(0);
    expect(t.totalAgs).toBe(0);
    expect(t.totalDepasse).toBe(0);
  });

  it('le total n’additionne que les salariés ayant au moins 8 mois', () => {
    const t = calculEquipe([
      { id: 'a', ancienneteMois: 7, salaireBrut: 3000 },
      { id: 'b', ancienneteMois: 60, salaireBrut: 2400 },
    ]);
    // 5 ans × ¼ × 2 400 € = 3 000 €
    expect(t.totalIndem).toBeCloseTo(3000);
  });

  it('à partir de 8 mois : ¼ de mois par année, ⅓ au-delà de 10 ans (R1234-2)', () => {
    expect(calculIndemnite(8, 3000).montant).toBeCloseTo(500);
    // 12 ans : 10 × ¼ × 3 000 + 2 × ⅓ × 3 000 = 7 500 + 2 000
    expect(calculIndemnite(144, 3000).montant).toBeCloseTo(9500);
  });

  it('plafonds AGS 2026 selon l’ancienneté du contrat (D3253-5)', () => {
    expect(plafondAgs(3)).toBe(64080);
    expect(plafondAgs(12)).toBe(80100);
    expect(plafondAgs(24)).toBe(PLAFOND_AGS_HAUT);
  });
});
