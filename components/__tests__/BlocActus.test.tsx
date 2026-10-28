// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const flux = {
  version: 3,
  genere_le: '2026-10-27T08:01:05.037Z',
  actus: [1, 2, 3].map((n) => ({
    id: String(n).padStart(40, '0'),
    titre: `Actu ${n}`,
    resume: 'Résumé réécrit de l’actu, en deux phrases.',
    source_nom: 'Le Monde',
    source_url: `https://www.lemonde.fr/${n}`,
    publie_le: '2026-10-27T08:00:00.000Z',
    tags: n === 2 ? ['situation:dettes-urssaf'] : [],
    image:
      n === 3
        ? { url: 'https://teiki5320.github.io/veille/cartes/solelis/3.svg', source: 'carte', credit: 'Illustration : Solelis', licence: null, page: null, alt: 'Illustration Solelis', largeur: 1600, hauteur: 900 }
        : { url: `https://teiki5320.github.io/veille/images/solelis/${n}.webp`, source: 'wikimedia', credit: 'Florent', licence: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:X.jpg', alt: `Photo ${n}`, largeur: 1600, hauteur: 900 },
  })),
};

describe('BlocActus', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.resetModules();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('affiche les actus avec source, crédit et texte alternatif', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => flux }));
    const { BlocActus } = await import('../actus/BlocActus');
    render(<BlocActus limite={20} avecDate />);
    expect(await screen.findByText('Actu 1')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    // Sans article rédigé, la carte entière mène à l'article d'origine ; le nom de la source reste en texte.
    expect(screen.getAllByText(/Source : Le Monde/)).toHaveLength(3);
    const titre = screen.getByRole('link', { name: /Actu 1/ });
    expect(titre).toHaveAttribute('href', 'https://www.lemonde.fr/1');
    expect(titre).toHaveAttribute('target', '_blank');
    expect(titre).toHaveAttribute('rel', 'noopener nofollow');
    expect(screen.getAllByText('Photo : Florent · CC BY-SA 3.0')).toHaveLength(2);
    expect(screen.getByText('Illustration : Solelis')).toBeInTheDocument();
    expect(screen.getByAltText('Photo 1')).toHaveAttribute('loading', 'lazy');
    expect(screen.getByAltText('Photo 2').getAttribute('src')).toMatch(/2-carre\.webp$/);
    expect(screen.getByText(/Mis à jour le 27 octobre 2026/)).toBeInTheDocument();
  });

  it('ne garde que les actus de la situation', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => flux }));
    const { BlocActus } = await import('../actus/BlocActus');
    render(<BlocActus titre="Dans l'actualité" limite={3} tag="situation:dettes-urssaf" bandeau={false} />);
    expect(await screen.findByText('Actu 2')).toBeInTheDocument();
    expect(screen.queryByText('Actu 1')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Dans l\'actualité' })).toBeInTheDocument();
  });

  it('n’affiche rien si aucune actu ne correspond', async () => {
    const appel = vi.fn().mockResolvedValue({ ok: true, json: async () => flux });
    vi.stubGlobal('fetch', appel);
    const { BlocActus } = await import('../actus/BlocActus');
    const { container } = render(<BlocActus titre="Dans l'actualité" limite={3} tag="situation:credit-bancaire" />);
    await waitFor(() => expect(appel).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 0));
    expect(container).toBeEmptyDOMElement();
  });

  it('n’affiche rien (ou le message prévu) si la veille ne répond pas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('coupé')));
    const { BlocActus } = await import('../actus/BlocActus');
    const { container } = render(<BlocActus titre="Dans l'actualité" limite={3} />);
    render(<BlocActus limite={20} siVide={<p>Indisponible</p>} />);
    expect(await screen.findByText('Indisponible')).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});

describe('grilleVignettes : jamais de case vide sur la dernière rangée', () => {
  it('adapte les colonnes au nombre de vignettes', async () => {
    const { grilleVignettes } = await import('../actus/BlocActus');
    expect(grilleVignettes(1, false)).toEqual({ grille: '', derniere: '' });
    expect(grilleVignettes(2, false).grille).toBe('md:grid-cols-2');
    expect(grilleVignettes(3, false)).toEqual({ grille: 'md:grid-cols-2', derniere: 'md:col-span-2' });
    expect(grilleVignettes(4, false)).toEqual({ grille: 'md:grid-cols-2', derniere: '' });
    expect(grilleVignettes(5, false)).toEqual({ grille: 'md:grid-cols-2', derniere: 'md:col-span-2' });
    expect(grilleVignettes(19, false).derniere).toBe('md:col-span-2');
    expect(grilleVignettes(3, true)).toEqual({ grille: '', derniere: '' });
  });
});
