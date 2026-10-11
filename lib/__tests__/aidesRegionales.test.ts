import { describe, it, expect } from 'vitest';
import {
  getRegionFromDepartement,
  getAidesRegionales,
  type Region,
} from '../aidesRegionales';

/* ─── Les 13 régions métropolitaines + outre-mer ─── */

const REGIONS_METROPOLITAINES: Region[] = [
  'auvergne-rhone-alpes',
  'bourgogne-franche-comte',
  'bretagne',
  'centre-val-de-loire',
  'corse',
  'grand-est',
  'hauts-de-france',
  'ile-de-france',
  'normandie',
  'nouvelle-aquitaine',
  'occitanie',
  'pays-de-la-loire',
  'provence-alpes-cote-dazur',
];

/* ─── getRegionFromDepartement ─── */

describe('getRegionFromDepartement', () => {
  it('retourne la bonne région pour un département métropolitain classique', () => {
    expect(getRegionFromDepartement('75')).toBe('ile-de-france');
    expect(getRegionFromDepartement('69')).toBe('auvergne-rhone-alpes');
    expect(getRegionFromDepartement('33')).toBe('nouvelle-aquitaine');
    expect(getRegionFromDepartement('59')).toBe('hauts-de-france');
    expect(getRegionFromDepartement('13')).toBe('provence-alpes-cote-dazur');
  });

  it('gère la Corse (2A et 2B)', () => {
    expect(getRegionFromDepartement('2A')).toBe('corse');
    expect(getRegionFromDepartement('2B')).toBe('corse');
  });

  it('gère les départements d\'outre-mer', () => {
    expect(getRegionFromDepartement('971')).toBe('outre-mer');
    expect(getRegionFromDepartement('972')).toBe('outre-mer');
    expect(getRegionFromDepartement('973')).toBe('outre-mer');
    expect(getRegionFromDepartement('974')).toBe('outre-mer');
    expect(getRegionFromDepartement('976')).toBe('outre-mer');
  });

  it('retourne null pour un code vide', () => {
    expect(getRegionFromDepartement('')).toBeNull();
  });

  it('retourne null pour un code invalide', () => {
    expect(getRegionFromDepartement('99')).toBeNull();
    expect(getRegionFromDepartement('ZZ')).toBeNull();
    expect(getRegionFromDepartement('000')).toBeNull();
  });
});

/* ─── getAidesRegionales ─── */

describe('getAidesRegionales', () => {
  it('retourne des aides pour chacune des 13 régions métropolitaines', () => {
    // On teste avec un département représentatif de chaque région
    const depParRegion: Record<string, Region> = {
      '69': 'auvergne-rhone-alpes',
      '21': 'bourgogne-franche-comte',
      '35': 'bretagne',
      '37': 'centre-val-de-loire',
      '2A': 'corse',
      '67': 'grand-est',
      '59': 'hauts-de-france',
      '75': 'ile-de-france',
      '76': 'normandie',
      '33': 'nouvelle-aquitaine',
      '31': 'occitanie',
      '44': 'pays-de-la-loire',
      '13': 'provence-alpes-cote-dazur',
    };

    for (const [dep, regionAttendue] of Object.entries(depParRegion)) {
      const result = getAidesRegionales(dep);
      expect(result, `Pas de résultat pour le département ${dep}`).not.toBeNull();
      expect(result!.code).toBe(regionAttendue);
      expect(result!.aides.length).toBeGreaterThan(0);
    }
  });

  it('retourne des aides pour l\'outre-mer', () => {
    const result = getAidesRegionales('971');
    expect(result).not.toBeNull();
    expect(result!.code).toBe('outre-mer');
    expect(result!.aides.length).toBeGreaterThan(0);
  });

  it('chaque aide a les champs attendus (nom, description)', () => {
    const result = getAidesRegionales('75');
    expect(result).not.toBeNull();
    for (const aide of result!.aides) {
      expect(aide.nom.length).toBeGreaterThan(0);
      expect(aide.description.length).toBeGreaterThan(0);
    }
  });

  it('retourne un label lisible pour la région', () => {
    const result = getAidesRegionales('75');
    expect(result!.label).toBe('Île-de-France');

    const corsica = getAidesRegionales('2A');
    expect(corsica!.label).toBe('Corse');
  });

  it('retourne null pour un département inexistant', () => {
    expect(getAidesRegionales('99')).toBeNull();
    expect(getAidesRegionales('')).toBeNull();
  });

  it('les sites d\'aides sont des URLs valides quand présents', () => {
    // Vérifie sur toutes les régions
    const deps = ['75', '69', '33', '59', '2A', '971'];
    for (const dep of deps) {
      const result = getAidesRegionales(dep);
      if (!result) continue;
      for (const aide of result.aides) {
        if (aide.site) {
          expect(aide.site).toMatch(/^https?:\/\//);
        }
      }
    }
  });

  it('n\'utilise plus le domaine solutions-co.fr (il ne répond plus)', () => {
    const result = getAidesRegionales('44');
    expect(result).not.toBeNull();
    expect(result!.aides.length).toBeGreaterThan(0);
    for (const aide of result!.aides) {
      expect(aide.site ?? '').not.toContain('solutions-co.fr');
    }
  });
});
