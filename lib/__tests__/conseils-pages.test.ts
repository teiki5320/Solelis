import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Conseil } from '../conseils/types';

// Données des articles remplacées : un publié le 12 octobre, un programmé le 13, un brouillon.
vi.mock('@/lib/conseils/donnees.generated', () => {
  const base = (slug: string, date: string, brouillon = false): Conseil => ({
    slug,
    title: `Titre ${slug}`,
    description: 'Description',
    date,
    miseAJour: date,
    publieLe: `${date}T00:00:00+02:00`,
    modifieLe: `${date}T00:00:00+02:00`,
    dateLisible: date,
    miseAJourLisible: date,
    theme: 'dettes',
    resume: 'Résumé',
    sources: [{ titre: 'Source', url: 'https://www.legifrance.gouv.fr' }],
    liens: [],
    brouillon,
    html: '<p>Corps</p>',
    conseilsCites: [],
  });
  return { CONSEILS: [base('demain', '2026-10-13'), base('publie', '2026-10-12'), base('brouillon', '2026-10-01', true)] };
});

import ConseilPage, { generateMetadata } from '../../app/conseils/[slug]/page';
import { GET as rss } from '../../app/conseils/rss.xml/route';
import sitemap from '../../app/sitemap';

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
/** notFound() de Next lève une erreur dont le digest annonce un 404. */
const est404 = (e: unknown) => String((e as { digest?: string }).digest).includes('404');

describe('pages Conseils à la requête (fuseau Paris)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 12 octobre 2026, 23 h 30 à Paris (21 h 30 UTC)
    vi.setSystemTime(new Date('2026-10-12T21:30:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('article programmé pour demain → 404 et titre « Page introuvable »', async () => {
    await expect(ConseilPage(params('demain'))).rejects.toSatisfy(est404);
    expect((await generateMetadata(params('demain'))).title).toBe('Page introuvable — Solelis');
  });

  it('brouillon → 404, même une fois sa date passée', async () => {
    await expect(ConseilPage(params('brouillon'))).rejects.toSatisfy(est404);
  });

  it('article du jour → page rendue, titre et canonique', async () => {
    await expect(ConseilPage(params('publie'))).resolves.toBeTruthy();
    const m = await generateMetadata(params('publie'));
    expect(m.title).toBe('Titre publie — Solelis');
    expect(m.alternates?.canonical).toBe('/conseils/publie');
  });

  it('le lendemain à 0 h 00 (Paris), l’article programmé apparaît sans redéploiement', async () => {
    vi.setSystemTime(new Date('2026-10-12T22:00:00Z'));
    await expect(ConseilPage(params('demain'))).resolves.toBeTruthy();
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain('https://solelis.com/conseils/demain');
  });

  it('sitemap et RSS ne contiennent que les articles publiés', async () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain('https://solelis.com/conseils');
    expect(urls).toContain('https://solelis.com/conseils/publie');
    expect(urls).not.toContain('https://solelis.com/conseils/demain');
    expect(urls).not.toContain('https://solelis.com/conseils/brouillon');

    const res = rss();
    expect(res.headers.get('content-type')).toContain('application/rss+xml');
    const xml = await res.text();
    expect(xml).toContain('<link>https://solelis.com/conseils/publie</link>');
    expect(xml).not.toContain('demain');
    expect(xml).not.toContain('brouillon');
  });
});
