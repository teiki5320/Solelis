import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { META_PAGE_INTROUVABLE } from '../og';
import { generateMetadata as metaSituation } from '../../app/situation/[slug]/page';
import { generateMetadata as metaFaq } from '../../app/faq/[situation]/page';
import { generateMetadata as metaCourrier } from '../../app/courriers/[slug]/page';
import { metadata as meta404 } from '../../app/not-found';

const TITRE_404 = 'Page introuvable — Solelis';

describe('routes dynamiques : titre d’onglet des pages introuvables', () => {
  it('la 404 générale et la constante partagée portent le même titre', () => {
    expect(META_PAGE_INTROUVABLE.title).toBe(TITRE_404);
    expect(meta404.title).toBe(TITRE_404);
  });

  it('/situation/[slug] inconnu → « Page introuvable — Solelis » (et pas « Solelis »)', async () => {
    const m = await metaSituation({ params: Promise.resolve({ slug: 'nexiste-pas' }) });
    expect(m.title).toBe(TITRE_404);
    expect(m.robots).toEqual({ index: false, follow: true });
  });

  it('/faq/[situation] inconnu → « Page introuvable — Solelis » (et pas un titre vide)', async () => {
    const m = await metaFaq({ params: Promise.resolve({ situation: 'nexiste-pas' }) });
    expect(m.title).toBe(TITRE_404);
  });

  it('/courriers/[slug] inconnu → « Page introuvable — Solelis »', async () => {
    const m = await metaCourrier({ params: Promise.resolve({ slug: 'nexiste-pas' }) });
    expect(m.title).toBe(TITRE_404);
  });

  it('un slug existant garde son propre titre', async () => {
    const m = await metaSituation({ params: Promise.resolve({ slug: 'dettes-urssaf' }) });
    expect(m.title).not.toBe(TITRE_404);
  });
});

describe('calculateur de licenciement : condition d’ancienneté (art. L1234-9 C. trav.)', () => {
  const source = readFileSync(join(__dirname, '../../app/outils/licenciement/page.tsx'), 'utf8');

  it('annonce « au moins 8 mois », jamais « < 8 mois requise »', () => {
    expect(source).toContain('ancienneté d&apos;au moins 8 mois requise, art. L1234-9 C. trav.');
    expect(source).not.toMatch(/&lt;\s*8 mois requise/);
  });
});
