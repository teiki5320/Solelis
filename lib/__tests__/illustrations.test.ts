import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ILLUSTRATIONS } from '../illustrations';
import { SLUGS_SITUATIONS } from '../situations';

const racine = join(__dirname, '..', '..');
const entrees = Object.entries(ILLUSTRATIONS);
const conseils = readdirSync(join(racine, 'content', 'conseils'))
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => `conseil:${f.slice(0, -3)}`);

describe('illustrations des conseils et des guides', () => {
  it('chaque conseil et chaque guide a son image', () => {
    const attendues = [...conseils, ...SLUGS_SITUATIONS.map((s) => `situation:${s}`)];
    expect(attendues.filter((c) => !ILLUSTRATIONS[c])).toEqual([]);
  });

  it.each(entrees)('%s : image WebP présente dans le dépôt, alt et crédit renseignés', (_cle, img) => {
    expect(img.fichier).toMatch(/^\/illustrations\/(conseils|situations)\/[a-z0-9-]+\.webp$/);
    const chemin = join(racine, 'public', img.fichier);
    expect(existsSync(chemin)).toBe(true);
    expect(statSync(chemin).size).toBeLessThan(400_000);
    expect(img.alt.trim().length).toBeGreaterThan(10);
    expect(img.credit.trim()).not.toBe('');
    expect(img.credit).not.toMatch(/unknown|inconnu|anonym/i);
    if (img.source === 'carte') {
      expect(img.page).toBeNull();
    } else {
      expect(img.page).toMatch(/^https:\/\//);
      expect(img.licence).toMatch(/^(CC0|CC BY|CC BY-SA|Domaine public|Public domain|PD)/i);
      expect(img.licence).not.toMatch(/NC|ND/);
    }
  });

  it('jamais deux fois la même image sur le site', () => {
    const origines = entrees.map(([, i]) => i.origine);
    const fichiers = entrees.map(([, i]) => i.fichier);
    expect(new Set(origines).size).toBe(origines.length);
    expect(new Set(fichiers).size).toBe(fichiers.length);
  });
});
