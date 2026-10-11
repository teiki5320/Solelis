import { describe, it, expect, vi, beforeEach } from 'vitest';

const getFicheByToken = vi.fn(async (_t: string) => null);
let valeurCookie: string | undefined;

vi.mock('@/lib/db', () => ({
  getFicheByToken: (t: string) => getFicheByToken(t),
  getFicheByTokenMemo: (t: string) => getFicheByToken(t),
}));
vi.mock('@/lib/sirene', () => ({
  fetchSirene: vi.fn(async (siret: string) => ({ siret, nom: 'ACME', departement: '75', ville: 'Paris' })),
}));
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (nom: string) => (nom === 'solelis_fiche_locale' && valeurCookie ? { value: valeurCookie } : undefined),
  }),
}));

import FichePage from '@/app/fiche/[token]/page';
import FicheTokenLayout, { generateMetadata as metadataLayout } from '@/app/fiche/[token]/layout';
import { generateMetadata as metadataPage } from '@/app/fiche/[token]/page';

function props(token: string, d?: string) {
  return { params: Promise.resolve({ token }), searchParams: Promise.resolve(d ? { d } : {}) };
}

/** notFound() de Next lève une erreur dont le digest porte le code 404. */
async function attendre404(p: Promise<unknown>) {
  await expect(p).rejects.toMatchObject({ digest: expect.stringContaining('404') });
}

describe('page /fiche/[token]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    valeurCookie = undefined;
  });

  it('fiche inconnue : notFound() remonte jusqu’à Next (vrai 404)', async () => {
    await attendre404(FichePage(props('abcdef0123456789abcdef01')));
    expect(getFicheByToken).toHaveBeenCalledWith('abcdef0123456789abcdef01');
  });

  it('token mal formé : 404 sans interroger la base', async () => {
    await attendre404(FichePage(props('../../etc')));
    expect(getFicheByToken).not.toHaveBeenCalled();
  });

  it('/fiche/local sans données : vrai 404 (la page 404 du segment relit l’onglet)', async () => {
    await attendre404(FichePage(props('local')));
  });

  it('/fiche/local?d= avec des réponses hors schéma : 404, pas de fiche rendue', async () => {
    const d = Buffer.from(JSON.stringify({ siret: '12345678901234', reponses: { situation: 'x' } })).toString('base64');
    await attendre404(FichePage(props('local', d)));
  });

  it('/fiche/local avec le cookie : la fiche se charge (pas de 404)', async () => {
    valeurCookie = encodeURIComponent(
      JSON.stringify({
        siret: '80186721900025',
        reponses: { situation: 'tresorie', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' },
      }),
    );
    const rendu = (await FichePage(props('local'))) as { props: { children: { props: { token: string } } } };
    expect(rendu.props.children.props.token).toBe('local');
  });
});

describe('layout /fiche/[token] (avant la frontière de chargement)', () => {
  const layout = (token: string) =>
    FicheTokenLayout({ children: 'contenu', params: Promise.resolve({ token }) });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('token inconnu : 404 avant tout streaming', async () => {
    await attendre404(layout('abcdef0123456789abcdef01'));
  });

  it('token mal formé : 404 sans interroger la base', async () => {
    await attendre404(layout('../../etc'));
    expect(getFicheByToken).not.toHaveBeenCalled();
  });

  it('fiche existante : rend la page', async () => {
    getFicheByToken.mockResolvedValueOnce({ token: 'x' } as never);
    expect(await layout('abcdef0123456789abcdef01')).toBe('contenu');
  });

  it('« local » : laissé à la page', async () => {
    expect(await layout('local')).toBe('contenu');
    expect(getFicheByToken).not.toHaveBeenCalled();
  });
});

describe('titre des pages introuvables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    valeurCookie = undefined;
  });

  it('token inconnu : « Page introuvable — Solelis »', async () => {
    const m = await metadataLayout({ params: Promise.resolve({ token: 'abcdef0123456789abcdef01' }) });
    expect(m.title).toBe('Page introuvable — Solelis');
  });

  it('fiche existante : titre par défaut', async () => {
    getFicheByToken.mockResolvedValueOnce({ token: 'x' } as never);
    const m = await metadataLayout({ params: Promise.resolve({ token: 'abcdef0123456789abcdef01' }) });
    expect(m.title).toBeUndefined();
  });

  it('/fiche/local sans données : « Page introuvable — Solelis », jamais indexée', async () => {
    const m = await metadataPage(props('local'));
    expect(m.title).toBe('Page introuvable — Solelis');
    expect(m.robots).toMatchObject({ index: false });
  });
});
