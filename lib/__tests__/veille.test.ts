import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ageActu, dateMiseAJour, filtrerActus, imageCarree, lireFlux, URL_VEILLE, type Actu } from '../veille';
import { entitesVeille, SLUGS_SITUATIONS } from '../situations';
import { GET } from '../../app/veille/entites.json/route';

const actu = (n: number, extra: Partial<Actu> = {}): Actu => ({
  id: String(n).padStart(40, '0'),
  titre: `Titre reformulé ${n}`,
  resume: 'Un résumé réécrit de deux phrases. Il ne copie rien.',
  source_nom: 'Le Monde',
  source_url: 'https://www.lemonde.fr/article',
  publie_le: '2026-10-27T08:00:00.000Z',
  image: {
    url: `https://teiki5320.github.io/veille/images/solelis/${n}.webp`,
    source: 'wikimedia',
    credit: 'Auteur',
    licence: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:X.jpg',
    alt: 'Une vue de la ville',
    largeur: 1600,
    hauteur: 900,
  },
  ...extra,
});

describe('veille : lecture du fichier', () => {
  it('pointe vers le fichier Solelis de la veille', () => {
    expect(URL_VEILLE).toBe('https://teiki5320.github.io/veille/actus/solelis.json');
  });

  it('refuse un fichier qui n’a pas la bonne forme', () => {
    expect(lireFlux(null)).toBeNull();
    expect(lireFlux('texte')).toBeNull();
    expect(lireFlux({ version: 2, actus: [] })).toBeNull();
    expect(lireFlux({ version: 3 })).toBeNull();
  });

  it('écarte seulement les actus douteuses', () => {
    const horsVeille = actu(2);
    horsVeille.image = { ...horsVeille.image, url: 'https://upload.wikimedia.org/x.jpg' };
    const flux = lireFlux({
      version: 3,
      genere_le: '2026-10-27T08:01:05.037Z',
      actus: [actu(1), horsVeille, { ...actu(3), source_url: 'javascript:alert(1)' }, { ...actu(4), titre: '' }, actu(5)],
    });
    expect(flux?.actus.map((a) => a.titre)).toEqual(['Titre reformulé 1', 'Titre reformulé 5']);
    expect(flux?.genere_le).toBe('2026-10-27T08:01:05.037Z');
  });

  it('filtre par tag de situation et respecte la limite', () => {
    const actus = [actu(1, { tags: ['situation:dettes-urssaf'] }), actu(2), actu(3, { tags: ['situation:dettes-urssaf'] }), actu(4, { tags: ['situation:dettes-urssaf'] })];
    expect(filtrerActus(actus, { tag: 'situation:dettes-urssaf', limite: 2 }).map((a) => a.titre)).toEqual(['Titre reformulé 1', 'Titre reformulé 3']);
    expect(filtrerActus(actus, { tag: 'situation:credit-bancaire', limite: 3 })).toEqual([]);
    expect(filtrerActus(actus, { limite: 20 })).toHaveLength(4);
  });

  it('prend la version carrée des photos, pas des cartes', () => {
    expect(imageCarree(actu(1).image)).toMatch(/1-carre\.webp$/);
    const carte = { ...actu(1).image, source: 'carte' as const, url: 'https://teiki5320.github.io/veille/cartes/solelis/1.svg' };
    expect(imageCarree(carte)).toBe(carte.url);
  });

  it('écrit l’âge et la date de mise à jour en français', () => {
    const maintenant = new Date('2026-10-27T12:00:00Z');
    expect(ageActu('2026-10-27T11:30:00Z', maintenant)).toBe('il y a 30 min');
    expect(ageActu('2026-10-27T07:00:00Z', maintenant)).toBe('il y a 5 h');
    expect(ageActu('2026-10-25T07:00:00Z', maintenant)).toBe('il y a 2 j');
    expect(ageActu('2026-10-01T07:00:00Z', maintenant)).toBe('le 1er octobre');
    expect(ageActu('pas une date', maintenant)).toBe('');
    expect(dateMiseAJour('2026-10-27T10:05:00Z')).toBe('27 octobre 2026 à 11 h 05');
    expect(dateMiseAJour('')).toBe('');
  });
});

describe('veille : chargement dans le navigateur', () => {
  const fenetre = globalThis as unknown as { window?: unknown; sessionStorage?: unknown };
  beforeEach(() => {
    const stock = new Map<string, string>();
    fenetre.window = {};
    fenetre.sessionStorage = { getItem: (k: string) => stock.get(k) ?? null, setItem: (k: string, v: string) => void stock.set(k, v) };
  });
  afterEach(() => {
    delete fenetre.window;
    delete fenetre.sessionStorage;
    vi.unstubAllGlobals();
  });

  it('renvoie [] sans lever d’erreur si la veille ne répond pas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('réseau coupé')));
    const { chargerActus } = await import('../veille');
    await expect(chargerActus('https://teiki5320.github.io/veille/actus/absent.json')).resolves.toEqual([]);
  });

  it('renvoie [] si le fichier est introuvable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
    const { chargerActus } = await import('../veille');
    await expect(chargerActus()).resolves.toEqual([]);
  });

  it('envoie une requête anonyme, puis garde le fichier 15 min en cache', async () => {
    const appel = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ version: 3, genere_le: '', actus: [actu(1)] }) });
    vi.stubGlobal('fetch', appel);
    const { chargerActus } = await import('../veille');
    expect(await chargerActus()).toHaveLength(1);
    expect(await chargerActus()).toHaveLength(1);
    expect(appel).toHaveBeenCalledTimes(1);
    expect(appel.mock.calls[0][1]).toMatchObject({ credentials: 'omit', referrerPolicy: 'no-referrer' });
  });
});

describe('veille : fichier public des situations', () => {
  it('liste les 4 situations avec un tag valide pour le schéma v3', () => {
    const entites = entitesVeille();
    expect(entites.map((e) => e.tag)).toEqual([
      'situation:dettes-urssaf',
      'situation:dettes-fournisseurs',
      'situation:credit-bancaire',
      'situation:impots-impayes',
    ]);
    for (const e of entites) {
      expect(e.tag).toMatch(/^[a-z]+:[a-z0-9-]+$/);
      expect(e.nom.length).toBeGreaterThan(3);
      expect(e.autres_noms.length).toBeGreaterThan(2);
    }
    expect(SLUGS_SITUATIONS).toHaveLength(4);
  });

  it('est servi en JSON sur /veille/entites.json', async () => {
    const rep = GET();
    expect(rep.headers.get('content-type')).toMatch(/application\/json/);
    expect(await rep.json()).toEqual(entitesVeille());
  });
});
