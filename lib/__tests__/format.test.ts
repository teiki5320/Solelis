import { describe, it, expect } from 'vitest';
import { nombreFr, dureeEnAnnees } from '../format';

describe('format (nombres à la française)', () => {
  it('virgule décimale, pas de « .0 »', () => {
    expect(nombreFr(1.25, 2)).toBe('1,25');
    expect(nombreFr(5, 1)).toBe('5');
    expect(nombreFr(1.5)).toBe('1,5');
  });
  it('durées : « 1 an », « 1,5 an », « 5 ans »', () => {
    expect(dureeEnAnnees(12)).toBe('1 an');
    expect(dureeEnAnnees(18)).toBe('1,5 an');
    expect(dureeEnAnnees(60)).toBe('5 ans');
    expect(dureeEnAnnees(7)).toBe('0,6 an');
  });
});
