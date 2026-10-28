import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ogMeta } from '../og';
import sitemap from '../../app/sitemap';
import robots from '../../app/robots';
import { COURRIERS } from '../courriers';
import { ARTICLES_VEILLE } from '../veille-articles.generated';

describe('ogMeta', () => {
  it('sans chemin : ni canonique ni og:url', () => {
    const m = ogMeta({ titre: 'Titre', description: 'Desc' });
    expect(m.alternates).toBeUndefined();
    expect((m.openGraph as { url?: string }).url).toBeUndefined();
    expect((m.openGraph as { locale?: string }).locale).toBe('fr_FR');
  });

  it('avec chemin : canonique et og:url', () => {
    const m = ogMeta({ titre: 'Titre', description: 'Desc', chemin: '/courriers/x' });
    expect(m.alternates?.canonical).toBe('/courriers/x');
    expect((m.openGraph as { url?: string }).url).toBe('/courriers/x');
  });
});

describe('sitemap', () => {
  const urls = sitemap().map((e) => e.url);

  it('contient les 17 courriers', () => {
    for (const c of COURRIERS) expect(urls).toContain(`https://solelis.com/courriers/${c.slug}`);
  });

  it('exclut /questionnaire', () => {
    expect(urls).not.toContain('https://solelis.com/questionnaire');
  });

  it('date chaque page par sa vraie dernière modification, stable d’une requête à l’autre', () => {
    const a = sitemap();
    const b = sitemap();
    expect(a.map((e) => String(e.lastModified))).toEqual(b.map((e) => String(e.lastModified)));
    for (const e of a) {
      const t = new Date(e.lastModified as string | Date).getTime();
      expect(Number.isNaN(t), e.url).toBe(false);
      expect(t, e.url).toBeLessThanOrEqual(Date.now() + 60_000);
    }
    // Les 17 courriers partagent la date de leur modèle de page.
    const courriers = new Set(a.filter((e) => /\/courriers\/[^/]+$/.test(e.url)).map((e) => String(e.lastModified)));
    expect(courriers.size).toBe(1);
    expect(a.find((e) => e.url === 'https://solelis.com/actus')?.changeFrequency).toBe('daily');
  });

  it('contient les articles d’actus construits, jamais la page de secours', () => {
    for (const a of ARTICLES_VEILLE) expect(urls).toContain(`https://solelis.com/actus/${a.slug}`);
    expect(urls.some((u) => u.includes('/actus/article'))).toBe(false);
  });
});

describe('robots', () => {
  it('autorise /api/og mais bloque /api/ et /fiche/', () => {
    const r = robots().rules as { allow: string[]; disallow: string[] };
    expect(r.allow).toContain('/api/og');
    expect(r.disallow).toEqual(expect.arrayContaining(['/api/', '/fiche/']));
  });
});

describe('canonical', () => {
  /**
   * Chaque URL du sitemap doit déclarer sa canonique : `alternates.canonical`
   * ou `chemin` (ogMeta) dans sa page, son layout ou son generateMetadata.
   */
  const racine = join(__dirname, '..', '..', 'app');

  function sourcesDe(route: string): string {
    const segments = route.split('/').filter(Boolean);
    // /courriers/x → app/courriers/[slug], /faq/x → app/faq/[situation]…
    const candidats = [segments, [...segments.slice(0, -1), '*']];
    let texte = '';
    for (const segs of candidats) {
      let dossier = racine;
      for (const seg of segs) {
        if (seg !== '*') {
          dossier = join(dossier, seg);
          continue;
        }
        const dyn = readdirSync(dossier).find((d) => d.startsWith('['));
        if (!dyn) return texte;
        dossier = join(dossier, dyn);
      }
      for (const f of ['page.tsx', 'layout.tsx']) {
        const chemin = join(dossier, f);
        if (existsSync(chemin)) texte += readFileSync(chemin, 'utf8');
      }
      if (texte) return texte;
    }
    return texte;
  }

  it.each(sitemap().map((e) => new URL(e.url).pathname))('%s déclare une canonique', (route) => {
    const texte = sourcesDe(route);
    expect(texte, route).not.toBe('');
    expect(texte, route).toMatch(/canonical|chemin:/);
  });
});
