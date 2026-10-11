// @vitest-environment node
/**
 * Non-régression : CCI du ressort de la commune. La fiche d'une entreprise
 * du Havre proposait « CCI Rouen Métropole » ; Le Havre relève de la CCI
 * Seine Estuaire (annuaire officiel, api-lannuaire.service-public.fr).
 */
import { describe, it, expect } from 'vitest';
import data from '@/data/organismes.json';
import {
  buildOrganismes,
  cciSelonCommune,
  getDepartement,
  ANNUAIRE_CCI,
  type DepartementData,
} from '@/lib/organismes';
import type { Reponses } from '@/lib/types';

const DEPS = data as unknown as Record<string, DepartementData>;
const R: Reponses = { situation: 'prevention', probleme: 'banque', effectif: 'salaries', moral: 'combatif' } as Reponses;

function cci(dep: string, cp?: string, ville?: string) {
  return cciSelonCommune(getDepartement(dep)!, cp, ville);
}

describe('cciSelonCommune', () => {
  it('Le Havre (76600) → CCI Seine Estuaire, jamais Rouen Métropole', () => {
    for (const cp of ['76600', '76610', '76620']) {
      const c = cci('76', cp, 'LE HAVRE');
      expect(c.nom).toBe('CCI Seine Estuaire');
      expect(c.telephone).toBe('02 35 55 26 00');
    }
  });

  it('Seine-Maritime : Rouen et Dieppe → Rouen Métropole ; Fécamp → Seine Estuaire', () => {
    expect(cci('76', '76000', 'ROUEN').nom).toBe('CCI Rouen Métropole');
    expect(cci('76', '76200', 'DIEPPE').nom).toBe('CCI Rouen Métropole');
    expect(cci('76', '76400', 'FECAMP').nom).toBe('CCI Seine Estuaire');
  });

  it('commune non rattachée de façon certaine → carte générique + annuaire officiel', () => {
    const c = cci('76', '76420', 'BIHOREL');
    expect(c.nom).toBe('CCI dont dépend votre commune');
    expect(c.telephone).toBeUndefined();
    expect(c.site).toBe(ANNUAIRE_CCI);
    expect(c.adresse).toBe('Dans le département : CCI Rouen Métropole, CCI Seine Estuaire');
    // Sans code postal non plus, pas de CCI possiblement fausse.
    expect(cci('76').nom).toBe('CCI dont dépend votre commune');
  });

  it('code postal partagé : la commune départage (Fécamp seule dans 76400)', () => {
    expect(cci('76', '76400', 'FECAMP').nom).toBe('CCI Seine Estuaire');
    expect(cci('76', '76400', 'SENNEVILLE SUR FECAMP').nom).toBe('CCI dont dépend votre commune');
  });

  it('autres départements à plusieurs CCI : commune d’implantation reconnue', () => {
    expect(cci('64', '64100', 'BAYONNE').nom).toBe('CCI Bayonne Pays Basque');
    expect(cci('64', '64000', 'PAU').nom).toBe('CCI Pau Béarn');
    expect(cci('13', '13200', 'ARLES').nom).toBe("CCI du Pays d'Arles");
    expect(cci('13', '13008', 'MARSEILLE').nom).toMatch(/^CCI Aix-Marseille-Provence/);
    expect(cci('38', '38200', 'VIENNE').nom).toBe('CCI Nord-Isère');
    expect(cci('59', '59300', 'VALENCIENNES').nom).toBe('CCI Grand Hainaut');
    expect(cci('59', '59140', 'DUNKERQUE').nom).toMatch(/^CCI Littoral Hauts-de-France/);
    expect(cci('62', '62100', 'CALAIS').nom).toBe('CCI Littoral Hauts-de-France');
    expect(cci('62', '62500', 'SAINT-OMER').nom).toMatch(/^CCI Grand Lille/);
    expect(cci('61', '61100', 'FLERS').nom).toMatch(/^CCI Ouest Normandie/);
    expect(cci('61', '61000', 'ALENÇON').nom).toMatch(/^CCI Portes de Normandie/);
    expect(cci('14', '14100', 'LISIEUX').nom).toMatch(/^CCI Seine Estuaire/);
    expect(cci('14', '14000', 'CAEN').nom).toBe('CCI Caen Normandie');
    expect(cci('69', '69400', 'LIMAS').nom).toBe('CCI Beaujolais');
    expect(cci('80', '80100', 'ABBEVILLE').nom).toMatch(/^CCI Littoral Hauts-de-France/);
  });

  it('département à une seule CCI : inchangé', () => {
    expect(cci('40', '40420', 'VERT').nom).toBe('CCI des Landes (Mont-de-Marsan)');
    expect(cci('10').nom).toBe(DEPS['10'].cci.nom);
  });

  it('Charente-Maritime : CCI Charente-Maritime (CCI de La Rochelle fermée fin 2021)', () => {
    const c = cci('17', '17000', 'LA ROCHELLE');
    expect(c.nom).toBe('CCI Charente-Maritime');
    expect(JSON.stringify(DEPS['17'])).not.toContain('CCI de La Rochelle');
  });

  it('carte « Institutionnel » de la fiche : CCI du Havre', () => {
    const inst = buildOrganismes(getDepartement('76'), R, [], 'commerce', undefined, 'TC', {
      codePostal: '76600',
      ville: 'LE HAVRE',
    }).find((g) => g.cle === 'institutionnel')!;
    const carte = inst.cartes.find((c) => c.type === 'CCI')!;
    expect(carte.nom).toBe('CCI Seine Estuaire');
    expect(JSON.stringify(inst)).not.toContain('Rouen Métropole');
  });
});

describe('data/organismes.json : ressorts des CCI', () => {
  const multi = Object.entries(DEPS).filter(([, d]) => d.ccisSecondaires?.length);

  it('au moins 10 départements à plusieurs CCI territoriales', () => {
    expect(multi.map(([c]) => c).sort()).toEqual(['13', '14', '38', '59', '61', '62', '64', '69', '76', '80']);
  });

  it('CCI principale avec ressort, aucun code postal ni commune dans deux CCI', () => {
    for (const [code, d] of multi) {
      expect(Array.isArray(d.cci.codesPostaux), code).toBe(true);
      const vus = new Map<string, string>();
      for (const t of [d.cci, ...d.ccisSecondaires!]) {
        for (const k of [...(t.codesPostaux ?? []), ...(t.communes ?? [])]) {
          expect(vus.get(k), `${code} ${k}`).toBeUndefined();
          vus.set(k, t.nom);
          expect(k, `${code} ${k}`).toMatch(/^\d{5}(\|[A-Z0-9 ]+)?$/);
          expect(k.slice(0, 2), `${code} ${k}`).toBe(code === '2A' || code === '2B' ? '20' : code.slice(0, 2));
        }
        expect(t.site, `${code} ${t.nom}`).toMatch(/^https:\/\//);
      }
    }
  });

  it('noms à jour : CCI Métropole de Bourgogne (21, 71), CCI Finistère (29)', () => {
    expect(DEPS['21'].cci.nom).toMatch(/^CCI Métropole de Bourgogne/);
    expect(DEPS['71'].cci.nom).toMatch(/^CCI Métropole de Bourgogne/);
    expect(DEPS['29'].cci.nom).toMatch(/^CCI Finistère/);
    const t = JSON.stringify(data);
    expect(t).not.toContain('CCI de la Côte-d');
    expect(t).not.toContain('CCI de Saône-et-Loire');
    expect(t).not.toContain('Métropolitaine Bretagne Ouest');
  });

  it('pas de CCI régionale à la place d’une CCI territoriale', () => {
    for (const [code, d] of Object.entries(DEPS)) {
      expect(d.cci.nom, code).not.toMatch(/^CCI (Normandie|Hauts-de-France|Occitanie|Bretagne|Nouvelle-Aquitaine|Grand Est)\b/);
    }
  });
});
