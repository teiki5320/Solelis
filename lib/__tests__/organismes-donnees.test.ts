// @vitest-environment node
/**
 * Non-régression du contre-audit tour 4 sur data/organismes.json : données
 * vérifiées sur l'annuaire officiel (api-lannuaire.service-public.fr), les
 * « Données géocodées des structures de la Justice » et la « Liste des
 * juridictions compétentes pour les communes » (data.gouv.fr, 2026).
 */
import { describe, it, expect } from 'vitest';
import data from '@/data/organismes.json';
import { buildOrganismes, getDepartement, type DepartementData } from '@/lib/organismes';
import type { Reponses } from '@/lib/types';

const DEPS = data as unknown as Record<string, DepartementData & Record<string, unknown>>;
const METRO = Object.keys(DEPS).filter((c) => !/^9[78]/.test(c));

function chaines(o: unknown, chemin = ''): { chemin: string; v: string }[] {
  if (typeof o === 'string') return [{ chemin, v: o }];
  if (Array.isArray(o)) return o.flatMap((x, i) => chaines(x, `${chemin}[${i}]`));
  if (o && typeof o === 'object') return Object.entries(o).flatMap(([k, v]) => chaines(v, chemin ? `${chemin}.${k}` : k));
  return [];
}

describe('data/organismes.json', () => {
  it('pas de « DREETS <département> » : services départementaux DDETS / DDETSPP / DRIEETS / DEETS', () => {
    for (const code of METRO) {
      const nom = (DEPS[code].dreets as { nom: string }).nom;
      expect(nom, code).toMatch(/^(DDETS|DDETSPP|DRIEETS)\b/);
    }
    expect((DEPS['974'].dreets as { nom: string }).nom).toMatch(/^DEETS/);
    expect((DEPS['973'].dreets as { nom: string }).nom).toMatch(/^DGCOPOP/);
  });

  it('chefs-lieux de région : DRFiP (et non DDFiP)', () => {
    for (const code of ['13', '31', '33', '59', '69', '75']) {
      expect((DEPS[code].ddfip as { nom: string }).nom, code).toMatch(/^DRFiP/);
    }
    expect((DEPS['10'].ddfip as { nom: string }).nom).toBe("DDFiP de l'Aube");
  });

  it('outre-mer : IEDOM pour la médiation du crédit, CGSS au 39 57', () => {
    for (const code of ['971', '972', '973', '974', '976']) {
      expect((DEPS[code].banqueDeFrance as { nom: string }).nom, code).toMatch(/^IEDOM/);
    }
    expect(JSON.stringify(data)).not.toMatch(/0 820 000 97/);
  });

  it('aucun numéro inventé ou retiré ne revient', () => {
    const t = JSON.stringify(data);
    // Solidarité Paysans (absent de solidaritepaysans.org) ; Impôts service des particuliers.
    expect(t).not.toMatch(/01 43 63 83 83|0 809 401 401/);
    // Conciliateurs : permanence invérifiable.
    expect(t).not.toMatch(/"adresse": ?"Mairie de/);
  });

  it('téléphones au format français (ou international pour les COM)', () => {
    const tels = chaines(data).filter((x) => /telephone$/.test(x.chemin));
    const mauvais = tels.filter(
      (x) => !/^(0\d( \d\d){4}|0 \d{3} \d{3} \d{3}|\d\d \d\d|\d{4}|\+\d{3}( \d\d){3,4}|\d\d \d\d \d\d \d\d)$/.test(x.v),
    );
    expect(mauvais).toEqual([]);
  });

  it('élisions : « d’Aurillac », jamais « de Aurillac »', () => {
    const fautes = chaines(data).filter((x) => /\.nom$/.test(x.chemin) && /\bde [AEIOUYÉÈÊÎ]|\bde la [AEIOUYÉÈÊÎ]/.test(x.v));
    expect(fautes).toEqual([]);
  });

  it('Saint-Pierre-et-Miquelon : tribunal de première instance (C. com. L910-2)', () => {
    expect(getDepartement('975')!.tribunal.nom).toMatch(/^Tribunal de première instance/);
  });

  it('carte « services de l’État · travail » : nom départemental, sans le sigle DREETS', () => {
    const r: Reponses = { situation: 'prevention', probleme: 'banque', effectif: 'salaries', moral: 'combatif' };
    const soc = buildOrganismes(getDepartement('29'), r, []).find((g) => g.cle === 'social')!;
    const carte = soc.cartes.find((c) => /DDETS/.test(c.nom));
    expect(carte?.nom).toBe('DDETS du Finistère');
    expect(carte?.type).not.toBe('DREETS');
  });
});
