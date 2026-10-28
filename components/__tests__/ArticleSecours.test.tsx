// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const ID = 'b'.repeat(40);
let parametres = new URLSearchParams();
vi.mock('next/navigation', () => ({ useSearchParams: () => parametres }));

const image = {
  url: 'https://teiki5320.github.io/veille/images/solelis/b.webp',
  source: 'wikimedia',
  credit: 'Chabe01',
  licence: 'CC BY-SA 4.0',
  page: 'https://commons.wikimedia.org/wiki/File:X.jpg',
  alt: 'La façade du magasin',
  largeur: 1600,
  hauteur: 900,
};
const article = {
  version: 1,
  site: 'solelis',
  id: ID,
  slug: 'le-magasin-en-redressement',
  titre: 'Le magasin demande un redressement judiciaire',
  chapo: 'Le grand magasin parisien demande à être placé en redressement judiciaire pour mener sa relance.',
  blocs: [
    { intertitre: null, paragraphes: ['Premier paragraphe réécrit par la veille.'] },
    { intertitre: 'Ce que cela change', paragraphes: ['Deuxième paragraphe réécrit par la veille.'] },
  ],
  mots: 330,
  lecture_min: 2,
  tags: ['situation:dettes-urssaf'],
  source_nom: 'Le Monde',
  source_url: 'https://www.lemonde.fr/article',
  autres_sources: ['https://www.franceinfo.fr/autre'],
  publie_le: '2026-10-27T17:24:34.000Z',
  redige_le: '2026-10-28T11:00:00.000Z',
  image,
};
const flux = {
  version: 3,
  genere_le: '2026-10-28T11:00:00Z',
  actus: [
    { id: ID, titre: article.titre, resume: 'Résumé.', source_nom: 'Le Monde', source_url: 'https://www.lemonde.fr/article', publie_le: article.publie_le, image },
    { id: 'c'.repeat(40), titre: 'Une autre actu', resume: 'Résumé.', source_nom: 'Les Échos', source_url: 'https://www.lesechos.fr/x', publie_le: article.publie_le, image, slug: 'autre', article_url: 'https://teiki5320.github.io/veille/articles/solelis/c.json' },
  ],
};

function repondre(articleTrouve: boolean) {
  return vi.fn(async (url: string) => {
    if (url.includes('/articles/solelis/')) return articleTrouve ? { ok: true, json: async () => article } : { ok: false, json: async () => ({}) };
    return { ok: true, json: async () => flux };
  });
}

describe('Page de secours /actus/article', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.resetModules();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('affiche l’article complet lu sur la veille', async () => {
    parametres = new URLSearchParams({ id: ID });
    const appel = repondre(true);
    vi.stubGlobal('fetch', appel);
    const { ArticleSecours } = await import('../../app/actus/article/ArticleSecours');
    render(<ArticleSecours />);
    expect(await screen.findByRole('heading', { level: 1, name: article.titre })).toBeInTheDocument();
    expect(appel).toHaveBeenCalledWith(`https://teiki5320.github.io/veille/articles/solelis/${ID}.json`, expect.anything());
    expect(screen.getByText(article.chapo)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Ce que cela change' })).toBeInTheDocument();
    expect(screen.getByText(/2 min de lecture/)).toBeInTheDocument();
    expect(screen.getAllByAltText('La façade du magasin')[0]).toHaveAttribute('loading', 'eager');
    expect(screen.getAllByAltText('La façade du magasin')[1]).toHaveAttribute('loading', 'lazy');
    expect(screen.getAllByText('Photo : Chabe01 · CC BY-SA 4.0').length).toBeGreaterThan(0);
    const source = screen.getByRole('link', { name: /Le Monde/ });
    expect(source).toHaveAttribute('href', 'https://www.lemonde.fr/article');
    expect(source).toHaveAttribute('rel', 'noopener nofollow');
    expect(screen.getByText(/Article rédigé par Solelis à partir de/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /franceinfo\.fr/ })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /Lire la fiche « Dettes URSSAF »/ })).toHaveAttribute('href', '/situation/dettes-urssaf');
    // Autres actus : l'article lui-même n'y est pas ; la carte mène à l'article sur le site.
    expect(screen.getByRole('link', { name: 'Une autre actu' })).toHaveAttribute('href', `/actus/article?id=${'c'.repeat(40)}`);
    expect(document.title).toBe(`${article.titre} — Solelis`);
  });

  it('id inconnu : message simple et lien vers /actus', async () => {
    parametres = new URLSearchParams({ id: ID });
    vi.stubGlobal('fetch', repondre(false));
    const { ArticleSecours } = await import('../../app/actus/article/ArticleSecours');
    render(<ArticleSecours />);
    expect(await screen.findByText('Article introuvable')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /toute l’actualité/i })).toHaveAttribute('href', '/actus');
  });

  it('id invalide : rien n’est demandé à la veille', async () => {
    parametres = new URLSearchParams({ id: '../secret' });
    const appel = repondre(true);
    vi.stubGlobal('fetch', appel);
    const { ArticleSecours } = await import('../../app/actus/article/ArticleSecours');
    render(<ArticleSecours />);
    expect(await screen.findByText('Article introuvable')).toBeInTheDocument();
    expect(appel).not.toHaveBeenCalled();
  });
});

describe('Page de secours : métadonnées', () => {
  it('porte noindex', async () => {
    const { metadata } = await import('../../app/actus/article/page');
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
