import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchAvocats, searchPlaces, prefixePostal, codesPostauxAdresse, adresseDansDepartement } from '../googlePlaces';

/* ─── mock fetch ─── */

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const PLACES_RESPONSE = {
  places: [
    {
      id: 'ChIJ_test_place_id_1',
      displayName: { text: 'Cabinet Dupont Avocats', languageCode: 'fr' },
      formattedAddress: '12 rue de la Paix, 75002 Paris',
      rating: 4.5,
      userRatingCount: 28,
      nationalPhoneNumber: '01 23 45 67 89',
      googleMapsUri: 'https://maps.google.com/?cid=1',
    },
    {
      id: 'ChIJ_test_place_id_2',
      displayName: { text: 'Maître Martin', languageCode: 'fr' },
      formattedAddress: '5 avenue Foch, 75016 Paris',
      rating: 4.2,
      userRatingCount: 15,
      googleMapsUri: 'https://maps.google.com/?cid=2',
    },
  ],
};

describe('googlePlaces', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_PLACES_API_KEY = 'test-google-key';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  /* ─── exports ─── */

  it('searchAvocats est une fonction exportée', () => {
    expect(typeof searchAvocats).toBe('function');
  });

  it('searchPlaces est une fonction exportée', () => {
    expect(typeof searchPlaces).toBe('function');
  });

  /* ─── searchAvocats ─── */

  it('retourne un tableau vide si ni commune, ni code postal, ni département', async () => {
    const result = await searchAvocats({ ville: '', codePostal: '', departement: '' });
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('retourne un tableau vide si GOOGLE_PLACES_API_KEY est absente', async () => {
    delete process.env.GOOGLE_PLACES_API_KEY;
    const result = await searchAvocats({ ville: 'Lyon', codePostal: '69001', departement: '69' });
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('appelle fetch avec les bons paramètres pour searchAvocats', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => PLACES_RESPONSE,
    });

    const results = await searchAvocats({ ville: 'Paris', codePostal: '75002', departement: '75', nomDepartement: 'Paris' });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://places.googleapis.com/v1/places:searchText');
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers['X-Goog-Api-Key']).toBe('test-google-key');
    expect(headers['X-Goog-FieldMask']).toContain('places.displayName');
    const body = JSON.parse(init.body as string);
    expect(body.textQuery).toContain('avocat');
    expect(body.textQuery).toContain('Paris');
    expect(body.languageCode).toBe('fr');
    expect(body.regionCode).toBe('FR');
    expect(results).toHaveLength(2);
  });

  it('transforme correctement les résultats Google Places', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => PLACES_RESPONSE,
    });

    const results = await searchAvocats({ ville: 'Paris', codePostal: '75002', departement: '75' });

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      name: 'Cabinet Dupont Avocats',
      address: '12 rue de la Paix, 75002 Paris',
      rating: 4.5,
      reviews: 28,
      phone: '01 23 45 67 89',
      mapsUrl: 'https://maps.google.com/?cid=1',
    });
  });

  it('retourne un tableau vide si fetch échoue (res.ok = false)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: { code: 403, status: 'PERMISSION_DENIED', message: 'Places API (New) has not been used in project' } }),
    });
    const results = await searchAvocats({ ville: 'Marseille', codePostal: '13001', departement: '13' });
    expect(results).toEqual([]);
    expect(warn).toHaveBeenCalledWith('[googlePlaces]', 403, 'PERMISSION_DENIED', expect.stringContaining('Places API (New)'));
    expect(JSON.stringify(warn.mock.calls)).not.toContain('test-google-key');
    warn.mockRestore();
  });

  it('retourne un tableau vide si fetch lance une exception', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('network error'));
    const results = await searchAvocats({ ville: 'Bordeaux', codePostal: '33000', departement: '33' });
    warn.mockRestore();
    expect(results).toEqual([]);
  });

  /* ─── searchPlaces avec limit ─── */

  it('respecte le paramètre limit', async () => {
    const manyResults = {
      places: Array.from({ length: 10 }, (_, i) => ({
        id: `id_${i}`,
        displayName: { text: `Place ${i}` },
        formattedAddress: `Adresse ${i}`,
        rating: 4.0,
        userRatingCount: 10,
      })),
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => manyResults,
    });

    const results = await searchPlaces({ query: 'test', limit: 2 });
    expect(results).toHaveLength(2);
  });
});

/* ─── Non-régression : commune au nom ambigu (EARL à Vert, 40420 Landes) ─── */

function lieu(nom: string, adresse: string) {
  return { displayName: { text: nom }, formattedAddress: adresse, googleMapsUri: `https://maps.google.com/?q=${encodeURIComponent(nom)}` };
}

describe('searchAvocats : proximité réelle', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_PLACES_API_KEY = 'test-google-key';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  const VERT = { ville: 'Vert', codePostal: '40420', departement: '40', nomDepartement: 'Landes' };

  it('requête « avocat droit des entreprises Vert 40420 Landes », type lawyer, région FR', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ places: [] }) });
    await searchAvocats(VERT);
    const body = JSON.parse((mockFetch.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(body.textQuery).toBe('avocat droit des entreprises Vert 40420 Landes');
    expect(body.includedType).toBe('lawyer');
    expect(body.regionCode).toBe('FR');
    // Pas de coordonnées inventées.
    expect(body.locationBias).toBeUndefined();
    expect(body.locationRestriction).toBeUndefined();
    expect(body.pageSize).toBeGreaterThanOrEqual(3);
    expect(body.pageSize).toBeLessThanOrEqual(20);
  });

  it('écarte les cabinets de Bordeaux, Paris et Lyon ; garde ceux des Landes', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        places: [
          lieu('Cabinet Bordeaux', '10 cours de l’Intendance, 33000 Bordeaux'),
          lieu('Cabinet Paris', '5 avenue Foch, 75016 Paris'),
          lieu('Cabinet Lyon', '1 place Bellecour, 69002 Lyon'),
          lieu('Cabinet Mont-de-Marsan', '3 rue Victor-Hugo, 40000 Mont-de-Marsan'),
          lieu('Cabinet Dax', '8 cours Foch, 40100 Dax'),
        ],
      }),
    });
    const res = await searchAvocats(VERT);
    expect(res.map((r) => r.name)).toEqual(['Cabinet Mont-de-Marsan', 'Cabinet Dax']);
  });

  it('aucun résultat dans le département → aucun avocat affiché', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        places: [
          lieu('Cabinet Bordeaux', '10 cours de l’Intendance, 33000 Bordeaux'),
          lieu('Cabinet Paris', '5 avenue Foch, 75016 Paris'),
          lieu('Sans adresse', ''),
        ],
      }),
    });
    expect(await searchAvocats(VERT)).toEqual([]);
  });

  it('au plus 3 avocats, même si Google en renvoie davantage dans le département', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        places: Array.from({ length: 6 }, (_, i) => lieu(`Cabinet ${i}`, `${i} rue X, 40100 Dax`)),
      }),
    });
    expect(await searchAvocats(VERT)).toHaveLength(3);
  });

  it('département inconnu : aucune requête (proximité invérifiable)', async () => {
    expect(await searchAvocats({ ville: 'Vert' })).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe('prefixePostal / adresseDansDepartement', () => {
  it('métropole : 2 chiffres du code postal, sinon du département', () => {
    expect(prefixePostal({ codePostal: '40420', departement: '40' })).toBe('40');
    expect(prefixePostal({ departement: '40' })).toBe('40');
    expect(prefixePostal({ codePostal: '', departement: '' })).toBe('');
  });

  it('Corse : 2A / 2B → « 20 »', () => {
    expect(prefixePostal({ departement: '2A' })).toBe('20');
    expect(prefixePostal({ codePostal: '20200', departement: '2B' })).toBe('20');
  });

  it('outre-mer : 3 chiffres ; Saint-Barthélemy / Saint-Martin : code postal entier', () => {
    expect(prefixePostal({ codePostal: '97400', departement: '974' })).toBe('974');
    expect(prefixePostal({ departement: '972' })).toBe('972');
    expect(prefixePostal({ departement: '977' })).toBe('97133');
    expect(prefixePostal({ codePostal: '97150', departement: '978' })).toBe('97150');
    // Un cabinet de Pointe-à-Pitre n'est pas « à proximité » de Saint-Martin.
    expect(adresseDansDepartement('Rue X, 97110 Pointe-à-Pitre', '97150')).toBe(false);
    expect(adresseDansDepartement('Rue X, 97150 Marigot', '97150')).toBe(true);
  });

  it('ignore les boîtes postales (CS) et repère le code postal de la commune', () => {
    expect(codesPostauxAdresse('Espace Régley, 1 bd Charles-Baltet, CS 60706, 10001 Troyes Cedex')).toEqual(['10001']);
    expect(adresseDansDepartement('2 rue X, CS 40001, 33000 Bordeaux', '40')).toBe(false);
    expect(adresseDansDepartement('12 rue de la Paix, 75002 Paris', '75')).toBe(true);
    expect(adresseDansDepartement('Rue Y, 97200 Fort-de-France', '972')).toBe(true);
    expect(adresseDansDepartement('Rue Y, 97200 Fort-de-France', '971')).toBe(false);
    expect(adresseDansDepartement('Cours Napoléon, 20000 Ajaccio', '20')).toBe(true);
    expect(adresseDansDepartement(undefined, '40')).toBe(false);
  });
});
