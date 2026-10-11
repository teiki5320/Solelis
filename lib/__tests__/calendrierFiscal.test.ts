import { describe, it, expect } from 'vitest';
import { buildEcheances, type RegimeTVA, type RegimeIS, type ExerciceFin } from '@/lib/calendrierFiscal';

const TVA: RegimeTVA[] = ['franchise', 'reel-mensuel', 'reel-trimestriel', 'mini-reel'];
const IS: RegimeIS[] = ['is', 'ir-bic', 'ir-bnc', 'micro'];
const FIN: ExerciceFin[] = ['dec', 'juin', 'sept'];

describe('calendrier fiscal', () => {
  it('ne propose jamais de date passée, ni au-delà de 12 mois', () => {
    for (const jour of ['2026-01-01', '2026-05-16', '2026-10-11', '2026-12-20', '2027-02-28']) {
      const maintenant = new Date(`${jour}T10:00:00`);
      const debut = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
      const limite = new Date(debut);
      limite.setFullYear(limite.getFullYear() + 1);
      for (const tva of TVA) for (const is of IS) for (const fin of FIN) for (const salaries of [true, false]) {
        const e = buildEcheances(tva, is, fin, salaries, true, maintenant);
        expect(e.length).toBeGreaterThan(0);
        for (const x of e) {
          expect(x.date.getTime()).toBeGreaterThanOrEqual(debut.getTime());
          expect(x.date.getTime()).toBeLessThan(limite.getTime());
        }
        const tri = [...e].sort((a, b) => a.date.getTime() - b.date.getTime());
        expect(e).toEqual(tri);
      }
    }
  });

  it('en fin d\'année, affiche les échéances de l\'année suivante', () => {
    const e = buildEcheances('reel-mensuel', 'is', 'dec', false, false, new Date('2026-12-20T10:00:00'));
    expect(e.some((x) => x.titre.startsWith('Acompte IS') && x.date.getFullYear() === 2027)).toBe(true);
  });

  it('TVA trimestrielle : avril, juillet, octobre, janvier (pas décembre)', () => {
    const e = buildEcheances('reel-trimestriel', 'micro', 'dec', false, false, new Date('2026-01-01T10:00:00'));
    const mois = e.filter((x) => x.titre.startsWith('Déclaration TVA trimestrielle')).map((x) => x.date.getMonth());
    expect(mois.sort((a, b) => a - b)).toEqual([0, 3, 6, 9]);
  });

  it('régime réel simplifié : acomptes de juillet (55 %) et décembre (40 %)', () => {
    const e = buildEcheances('mini-reel', 'micro', 'dec', false, false, new Date('2026-01-01T10:00:00'));
    const juillet = e.find((x) => x.titre.includes('juillet'));
    const decembre = e.find((x) => x.titre.includes('décembre'));
    expect(juillet?.date.getMonth()).toBe(6);
    expect(juillet?.description).toContain('55 %');
    expect(decembre?.date.getMonth()).toBe(11);
    expect(decembre?.description).toContain('40 %');
  });

  it('TVA mensuelle : pas de date fixe au 19, renvoi à l\'espace professionnel', () => {
    const e = buildEcheances('reel-mensuel', 'micro', 'dec', false, false, new Date('2026-01-01T10:00:00'));
    const tva = e.filter((x) => x.categorie === 'TVA');
    expect(tva.length).toBe(12);
    for (const x of tva) {
      expect(x.date.getDate()).toBe(15);
      expect(x.description).toContain('entre le 15 et le 24');
    }
  });

  it('CA12 : 2e jour ouvré après le 1er mai (clôture au 31/12), sinon 3 mois après la clôture', () => {
    const ca12 = (fin: ExerciceFin) =>
      buildEcheances('mini-reel', 'is', fin, false, false, new Date('2026-01-01T10:00:00')).find((x) => x.titre.includes('CA12'))!.date;
    expect(ca12('dec').getMonth()).toBe(4);
    expect([ca12('juin').getMonth(), ca12('juin').getDate()]).toEqual([8, 30]);
  });

  it('solde IS au 15 du 4e mois suivant la clôture', () => {
    const m = (fin: ExerciceFin) =>
      buildEcheances('franchise', 'is', fin, false, false, new Date('2026-01-01T10:00:00')).find((x) => x.titre === 'Solde IS')!.date;
    expect([m('dec').getMonth(), m('dec').getDate()]).toEqual([4, 15]);
    expect([m('juin').getMonth(), m('juin').getDate()]).toEqual([9, 15]);
    expect([m('sept').getMonth(), m('sept').getFullYear()]).toEqual([0, 2026]);
  });
});
