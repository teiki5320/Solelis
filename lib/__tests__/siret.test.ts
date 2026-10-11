import { describe, it, expect } from 'vitest';
import { formaterSiret, siretValide, chiffresSiret } from '../siret';

describe('siretValide (clé de Luhn)', () => {
  it('accepte des SIRET réels', () => {
    expect(siretValide('80186721900025')).toBe(true);
    expect(siretValide('801 867 219 00025')).toBe(true);
  });

  it('refuse un SIRET inventé ou dont un chiffre est faux', () => {
    expect(siretValide('12345678901234')).toBe(false);
    expect(siretValide('80186721900026')).toBe(false);
  });

  it('refuse une longueur autre que 14 chiffres', () => {
    expect(siretValide('8018672190002')).toBe(false);
    expect(siretValide('')).toBe(false);
    expect(siretValide(undefined)).toBe(false);
  });

  it('exception La Poste (SIREN 356 000 000) : somme des chiffres multiple de 5, ou Luhn', () => {
    expect(siretValide('35600000043275')).toBe(true); // somme = 35, Luhn faux
    expect(siretValide('35600000000048')).toBe(true); // siège : Luhn juste
    expect(siretValide('35600000043276')).toBe(false); // ni l'un ni l'autre
  });
});

describe('formaterSiret', () => {
  it('format 3-3-3-5', () => {
    expect(formaterSiret('80186721900025')).toBe('801 867 219 00025');
  });

  it('saisie partielle et caractères parasites', () => {
    expect(formaterSiret('80186')).toBe('801 86');
    expect(formaterSiret('801-867-219-0002')).toBe('801 867 219 0002');
    expect(chiffresSiret('801 867 219 00025 99')).toBe('80186721900025');
  });
});
