import { describe, it, expect } from 'vitest';
import { adresseComplete } from '../fiche/StoreCompanyData';

describe('adresseComplete (adresse des courriers)', () => {
  it('ne répète pas le code postal et la ville déjà présents (API recherche-entreprises)', () => {
    expect(
      adresseComplete({
        adresse: "18 B RUE DES LIBELLULES 85100 LES SABLES D'OLONNE",
        codePostal: '85100',
        ville: "LES SABLES D'OLONNE",
      }),
    ).toBe("18 B RUE DES LIBELLULES 85100 LES SABLES D'OLONNE");
  });

  it('complète la voie seule (repli INSEE) avec « code postal ville »', () => {
    expect(adresseComplete({ adresse: '12 RUE DE LA PAIX', codePostal: '75002', ville: 'PARIS' })).toBe(
      '12 RUE DE LA PAIX, 75002 PARIS',
    );
  });

  it('sans voie : code postal et ville seulement ; tout vide : chaîne vide', () => {
    expect(adresseComplete({ adresse: '', codePostal: '75002', ville: 'PARIS' })).toBe('75002 PARIS');
    expect(adresseComplete({ adresse: '', codePostal: '', ville: '' })).toBe('');
  });
});
