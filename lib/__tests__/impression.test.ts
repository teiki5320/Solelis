import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/** Contenu du bloc @media print de app/globals.css (accolades équilibrées). */
function blocPrint(): string {
  const css = readFileSync(path.resolve(__dirname, '../../app/globals.css'), 'utf8');
  const debut = css.indexOf('@media print');
  expect(debut).toBeGreaterThan(-1);
  let profondeur = 0;
  for (let i = css.indexOf('{', debut); i < css.length; i++) {
    if (css[i] === '{') profondeur++;
    if (css[i] === '}') profondeur--;
    if (profondeur === 0) return css.slice(debut, i + 1);
  }
  return css.slice(debut);
}

describe('styles d’impression (PDF de la fiche et des courriers)', () => {
  const print = blocPrint().replace(/\s+/g, ' ');

  it('le texte blanc devient foncé (les fonds colorés sont blanchis)', () => {
    expect(print).toMatch(/\.text-white, \[class\*="text-white\/"\] \{ color: #0A1628 !important; \}/);
  });

  it('le décor flou en position fixe est masqué (poids du PDF)', () => {
    expect(print).toMatch(/\[data-bg-blobs\] \{ display: none !important; \}/);
  });

  it('un courrier long peut se couper : la lettre commence en page 1', () => {
    expect(print).toMatch(/\.courrier-preview \{ break-inside: auto !important; \}/);
  });
});
