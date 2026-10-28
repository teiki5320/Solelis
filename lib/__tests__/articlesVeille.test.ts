import { describe, it, expect } from 'vitest';
import { cheminSecours, dateLongue, idActuValide, lienActu, lireArticle, type Actu } from '../veille';
import { choisirArticles, entreesArticles, moduleSlugs } from '../articlesVeille';
import { fichesDesTags } from '../fichesVeille';

const ID = (n: number) => String(n).padStart(40, 'a');
const image = {
  url: 'https://teiki5320.github.io/veille/images/solelis/1.webp',
  source: 'wikimedia' as const,
  credit: 'Auteur',
  licence: 'CC BY-SA 4.0',
  page: 'https://commons.wikimedia.org/wiki/File:X.jpg',
  alt: 'Une façade',
  largeur: 1600,
  hauteur: 900,
};
const actu = (n: number, extra: Partial<Actu> = {}): Actu => ({
  id: ID(n),
  titre: `Titre ${n}`,
  resume: 'Résumé réécrit.',
  source_nom: 'Le Monde',
  source_url: `https://www.lemonde.fr/${n}`,
  publie_le: '2026-10-27T08:00:00.000Z',
  image,
  ...extra,
});
const article = (n: number, slug: string) => ({
  version: 1,
  site: 'solelis',
  id: ID(n),
  slug,
  titre: `Titre ${n}`,
  chapo: 'Un chapô assez long pour présenter l’article en une ou deux phrases claires.',
  blocs: [
    { intertitre: null, paragraphes: ['Premier paragraphe réécrit par la veille, assez long.'] },
    { intertitre: 'Ce qui change', paragraphes: ['Deuxième paragraphe réécrit par la veille, assez long.'] },
  ],
  mots: 320,
  lecture_min: 2,
  tags: ['situation:dettes-urssaf'],
  source_nom: 'Le Monde',
  source_url: `https://www.lemonde.fr/${n}`,
  autres_sources: ['https://www.franceinfo.fr/x'],
  publie_le: '2026-10-27T08:00:00.000Z',
  redige_le: '2026-10-27T09:00:00.000Z',
  image,
});

describe('lienActu : où mène une carte d’actu', () => {
  it('page construite si son slug est dans la liste du build', () => {
    expect(lienActu(actu(1, { slug: 'bhv', article_url: 'x' }), ['bhv'])).toEqual({ href: '/actus/bhv', externe: false });
  });
  it('page de secours si l’article existe mais n’a pas encore de page', () => {
    expect(lienActu(actu(2, { slug: 'nouveau', article_url: 'https://teiki5320.github.io/veille/articles/solelis/x.json' }), new Set(['bhv']))).toEqual({
      href: `/actus/article?id=${ID(2)}`,
      externe: false,
    });
  });
  it('article d’origine tant que la veille n’a pas rédigé l’article', () => {
    expect(lienActu(actu(3), [])).toEqual({ href: 'https://www.lemonde.fr/3', externe: true });
    expect(lienActu(actu(3, { slug: 'sans-article' }), [])).toEqual({ href: 'https://www.lemonde.fr/3', externe: true });
  });
  it('n’accepte que les identifiants de la veille', () => {
    expect(idActuValide(ID(1))).toBe(true);
    expect(idActuValide('../../x')).toBe(false);
    expect(idActuValide(null)).toBe(false);
    expect(cheminSecours(ID(1))).toBe(`/actus/article?id=${ID(1)}`);
  });
});

describe('choisirArticles (build, depuis l’index de la veille)', () => {
  const flux = (actus: Actu[]) => ({ version: 3, genere_le: '2026-10-28T11:00:00Z', actus });
  const index = (entrees: { id: string; slug: string }[]) => ({
    version: 1,
    site: 'solelis',
    genere_le: '2026-10-28T11:00:00Z',
    articles: entrees.map((e) => ({ ...e, titre: 't', publie_le: '2026-10-27T08:00:00Z', redige_le: '2026-10-27T09:00:00Z', url: 'x' })),
  });

  it('construit tous les articles de l’index, même ceux sortis des actus récentes', () => {
    const entrees = entreesArticles(index([{ id: ID(1), slug: 'un' }, { id: ID(9), slug: 'ancien' }]), flux([actu(1, { slug: 'un' })]));
    const d = choisirArticles(entrees, flux([actu(1, { slug: 'un' })]), {
      [ID(1)]: article(1, 'un'),
      [ID(9)]: { ...article(9, 'ancien'), publie_le: '2026-09-01T08:00:00.000Z' },
    });
    expect(d.articles.map((a) => a.slug)).toEqual(['un', 'ancien']);
    expect(d.actus).toHaveLength(1);
    expect(moduleSlugs(d)).toContain('["un","ancien"]');
  });

  it('index illisible : les articles des actus récentes, comme avant', () => {
    expect(entreesArticles(null, flux([actu(1, { slug: 'un' }), actu(2)]))).toEqual([{ id: ID(1), slug: 'un' }]);
    expect(entreesArticles({ version: 1, articles: [{ id: 'abc', slug: 'x' }, { id: ID(3), slug: 'trois' }] }, null)).toEqual([{ id: ID(3), slug: 'trois' }]);
  });

  it('écarte article absent, abîmé, slug différent, réservé ou en double', () => {
    const entrees = [
      { id: ID(1), slug: 'un' },
      { id: ID(2), slug: 'deux' },
      { id: ID(3), slug: 'article' },
      { id: ID(4), slug: 'un' },
      { id: ID(5), slug: 'cinq' },
      { id: ID(6), slug: 'six' },
    ];
    const d = choisirArticles(entrees, null, {
      [ID(1)]: article(1, 'un'),
      [ID(2)]: article(2, 'autre'),
      [ID(3)]: article(3, 'article'),
      [ID(4)]: article(4, 'un'),
      [ID(5)]: { titre: 'abîmé' },
    });
    expect(d.articles.map((a) => a.slug)).toEqual(['un']);
  });

  it('veille injoignable : 0 article, sans erreur', () => {
    expect(entreesArticles(null, null)).toEqual([]);
    expect(choisirArticles([], null, {})).toEqual({ articles: [], actus: [] });
  });

  it('valide un article conforme au schéma v1', () => {
    expect(lireArticle(article(1, 'un'))?.blocs[1].intertitre).toBe('Ce qui change');
    expect(lireArticle({ ...article(1, 'un'), image: { ...image, url: 'https://ailleurs.fr/x.webp' } })).toBeNull();
  });
});

describe('fichesDesTags', () => {
  it('ne garde que les fiches qui existent', () => {
    expect(fichesDesTags(['situation:dettes-urssaf', 'situation:inconnue', 'auteur:x', 'situation:dettes-urssaf'])).toEqual([
      { href: '/situation/dettes-urssaf', libelle: 'Lire la fiche « Dettes URSSAF »' },
    ]);
    expect(fichesDesTags(undefined)).toEqual([]);
  });
});

describe('dateLongue', () => {
  it('écrit la date en heure de Paris', () => {
    expect(dateLongue('2026-10-27T23:30:00Z')).toBe('28 octobre 2026');
    expect(dateLongue('2026-11-01T10:00:00Z')).toBe('1er novembre 2026');
    expect(dateLongue('')).toBe('');
  });
});
