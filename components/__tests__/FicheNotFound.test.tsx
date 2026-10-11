// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

let chemin = '/fiche/local';
vi.mock('next/navigation', () => ({ usePathname: () => chemin }));

import FicheNotFound from '@/app/fiche/[token]/not-found';

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe('404 du segment /fiche/[token]', () => {
  it('/fiche/local sans données dans l’onglet : explique que la fiche n’est plus disponible', async () => {
    chemin = '/fiche/local';
    render(<FicheNotFound />);
    expect(await screen.findByText(/Cette fiche n.est plus disponible/)).toBeInTheDocument();
  });

  it('autre fiche : page introuvable classique', () => {
    chemin = '/fiche/abcdef0123456789abcdef01';
    render(<FicheNotFound />);
    expect(screen.getByRole('heading', { name: 'Page introuvable' })).toBeInTheDocument();
  });
});
