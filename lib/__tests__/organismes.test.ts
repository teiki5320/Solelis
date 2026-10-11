import { describe, it, expect } from 'vitest';
import {
  getDepartement,
  buildOrganismes,
  orientationRestructuration,
  carteTribunal,
  institutionEmission,
  type DepartementData,
} from '../organismes';
import type { Reponses } from '../types';

/* ─── Helpers ─── */

function makeReponses(overrides: Partial<Reponses> = {}): Reponses {
  return {
    situation: 'prevention',
    probleme: 'urssaf',
    effectif: 'independant',
    moral: 'combatif',
    ...overrides,
  };
}

/* ─── getDepartement ─── */

describe('getDepartement', () => {
  it('retourne les données pour un département existant', () => {
    const result = getDepartement('75');
    expect(result).not.toBeNull();
    expect(result!.code).toBe('75');
    expect(result!.nom.length).toBeGreaterThan(0);
  });

  it('retourne les champs structurels attendus', () => {
    const result = getDepartement('75');
    expect(result).not.toBeNull();
    expect(result!.chefLieu).toBeDefined();
    expect(result!.tribunal).toBeDefined();
    expect(result!.tribunal.nom).toBeDefined();
    expect(result!.cci).toBeDefined();
    expect(result!.cci.nom).toBeDefined();
    expect(result!.urssaf).toBeDefined();
    expect(result!.sie).toBeDefined();
  });

  it('retourne null pour un département inexistant', () => {
    expect(getDepartement('00')).toBeNull();
    expect(getDepartement('')).toBeNull();
    expect(getDepartement('ZZZ')).toBeNull();
  });

  it('gère la Corse (2A et 2B)', () => {
    const corseA = getDepartement('2A');
    expect(corseA).not.toBeNull();
    expect(corseA!.code).toBe('2A');

    const corseB = getDepartement('2B');
    expect(corseB).not.toBeNull();
    expect(corseB!.code).toBe('2B');
  });

  it('gère les départements d\'outre-mer', () => {
    const guadeloupe = getDepartement('971');
    expect(guadeloupe).not.toBeNull();
    expect(guadeloupe!.code).toBe('971');
  });

  it('chaque organisme a un nom et un type', () => {
    const dep = getDepartement('13');
    expect(dep).not.toBeNull();
    for (const champ of ['tribunal', 'cci', 'urssaf', 'sie'] as const) {
      expect(dep![champ].nom.length).toBeGreaterThan(0);
      expect(dep![champ].type.length).toBeGreaterThan(0);
    }
  });
});

/* ─── buildOrganismes ─── */

describe('buildOrganismes', () => {
  it('retourne des groupes même sans données département', () => {
    const groupes = buildOrganismes(null, makeReponses(), []);
    expect(groupes.length).toBeGreaterThan(0);
  });

  it('retourne toujours 4 groupes (juridique, institutionnel, financier, social)', () => {
    const dep = getDepartement('75');
    const groupes = buildOrganismes(dep, makeReponses(), []);
    expect(groupes).toHaveLength(4);
    expect(groupes.map((g) => g.cle)).toEqual([
      'juridique',
      'institutionnel',
      'financier',
      'social',
    ]);
  });

  it('chaque groupe a les champs requis', () => {
    const dep = getDepartement('75');
    const groupes = buildOrganismes(dep, makeReponses(), []);
    for (const g of groupes) {
      expect(g.cle.length).toBeGreaterThan(0);
      expect(g.titre.length).toBeGreaterThan(0);
      expect(g.couleur.length).toBeGreaterThan(0);
      expect(g.icone.length).toBeGreaterThan(0);
      expect(Array.isArray(g.cartes)).toBe(true);
    }
  });

  it('inclut les avocats passés en paramètre dans le groupe juridique', () => {
    const avocats = [
      { nom: 'Me Dupont', type: 'Avocat', badge: 'Google Places' },
    ];
    const groupes = buildOrganismes(null, makeReponses(), avocats);
    const juridique = groupes.find((g) => g.cle === 'juridique')!;
    expect(juridique.cartes.some((c) => c.nom === 'Me Dupont')).toBe(true);
  });

  it('inclut le CIP dans le groupe juridique', () => {
    const groupes = buildOrganismes(null, makeReponses(), []);
    const juridique = groupes.find((g) => g.cle === 'juridique')!;
    expect(juridique.cartes.some((c) => c.nom.includes('CIP'))).toBe(true);
  });

  it('inclut un notaire si le problème est banque', () => {
    const groupes = buildOrganismes(null, makeReponses({ probleme: 'banque' }), []);
    const juridique = groupes.find((g) => g.cle === 'juridique')!;
    expect(juridique.cartes.some((c) => c.nom === 'Notaire')).toBe(true);
  });

  it('n\'inclut pas de notaire si le problème est urssaf', () => {
    const groupes = buildOrganismes(null, makeReponses({ probleme: 'urssaf' }), []);
    const juridique = groupes.find((g) => g.cle === 'juridique')!;
    expect(juridique.cartes.some((c) => c.nom === 'Notaire')).toBe(false);
  });

  it('inclut le CNAJMJ en situation de redressement', () => {
    const dep = getDepartement('75');
    const groupes = buildOrganismes(dep, makeReponses({ situation: 'redressement' }), []);
    const institutionnel = groupes.find((g) => g.cle === 'institutionnel')!;
    expect(institutionnel.cartes.some((c) => c.nom.includes('CNAJMJ'))).toBe(true);
  });

  it('inclut URSSAF dans le financier si problème urssaf', () => {
    const dep = getDepartement('75');
    const groupes = buildOrganismes(dep, makeReponses({ probleme: 'urssaf' }), []);
    const financier = groupes.find((g) => g.cle === 'financier')!;
    expect(financier.cartes.some((c) => c.type === 'URSSAF')).toBe(true);
  });

  it('inclut Bpifrance dans le financier systématiquement', () => {
    const groupes = buildOrganismes(null, makeReponses(), []);
    const financier = groupes.find((g) => g.cle === 'financier')!;
    expect(financier.cartes.some((c) => c.nom === 'Bpifrance')).toBe(true);
  });

  it('inclut l\'action sociale du CPSTI (Urssaf) pour les indépendants dans le groupe social', () => {
    const groupes = buildOrganismes(null, makeReponses({ effectif: 'independant' }), []);
    const social = groupes.find((g) => g.cle === 'social')!;
    expect(social.cartes.some((c) => c.nom.includes('CPSTI'))).toBe(true);
    // La SSI n'existe plus depuis le 1er janvier 2020.
    expect(social.cartes.some((c) => /\bSSI\b|Sécurité Sociale des Indépendants/.test(c.nom))).toBe(false);
  });

  it('inclut AGS pour les salariés dans le groupe social', () => {
    const groupes = buildOrganismes(null, makeReponses({ effectif: 'salaries' }), []);
    const social = groupes.find((g) => g.cle === 'social')!;
    expect(social.cartes.some((c) => c.nom === 'AGS')).toBe(true);
  });

  it('inclut le médiateur des entreprises si problème fournisseurs', () => {
    const groupes = buildOrganismes(null, makeReponses({ probleme: 'fournisseurs' }), []);
    const financier = groupes.find((g) => g.cle === 'financier')!;
    expect(financier.cartes.some((c) => c.nom.includes('Médiateur'))).toBe(true);
  });
});

/* ─── CIRI / CODEFI selon l'effectif INSEE ─── */

describe('orientation CIRI / CODEFI', () => {
  function nomsInstitutionnels(effectifInsee?: string, detail = 'Oui, 5 ou plus') {
    const groupes = buildOrganismes(
      null,
      makeReponses({ effectif: 'salaries', effectifDetail: detail }),
      [],
      'industrie',
      effectifInsee,
    );
    return groupes.find((g) => g.cle === 'institutionnel')!.cartes.map((c) => c.nom);
  }

  it('affiche le CIRI pour une grande entreprise (tranche INSEE ≥ 500)', () => {
    const noms = nomsInstitutionnels('1 000 à 1 999 salariés');
    expect(noms).toContain('CIRI');
    expect(noms).not.toContain('CODEFI');
  });

  it('reconnaît aussi les anciens libellés sans espace de milliers', () => {
    expect(nomsInstitutionnels('2000 à 4999 salariés')).toContain('CIRI');
  });

  it('propose CIRI et CODEFI pour la tranche 250 à 499 (seuil de 400 à cheval)', () => {
    const noms = nomsInstitutionnels('250 à 499 salariés');
    expect(noms).toContain('CIRI');
    expect(noms).toContain('CODEFI');
  });

  it('CODEFI seul pour une PME ou un effectif inconnu', () => {
    expect(nomsInstitutionnels('20 à 49 salariés')).not.toContain('CIRI');
    expect(nomsInstitutionnels('Non renseigné')).toEqual(expect.arrayContaining(['CODEFI']));
    expect(nomsInstitutionnels(undefined)).not.toContain('CIRI');
  });

  it('orientationRestructuration', () => {
    expect(orientationRestructuration('500 à 999 salariés')).toBe('ciri');
    expect(orientationRestructuration('10 000 salariés et plus')).toBe('ciri');
    expect(orientationRestructuration('200 à 249 salariés')).toBe('codefi');
    expect(orientationRestructuration('250 à 499 salariés')).toBe('les-deux');
    expect(orientationRestructuration('')).toBe('codefi');
  });
});

/* ─── Tribunal, numéros, cartes nationales ─── */

describe('carte tribunal et numéros', () => {
  const tous = (g: ReturnType<typeof buildOrganismes>) => g.flatMap((x) => x.cartes);

  it('affiche le libellé réel de la juridiction (TAE de Paris)', () => {
    const inst = buildOrganismes(getDepartement('75'), makeReponses(), [], undefined, undefined, 'TC')
      .find((g) => g.cle === 'institutionnel')!;
    expect(inst.cartes[0].type).toBe('Tribunal des activités économiques');
  });

  it('chambre commerciale du TJ en Moselle', () => {
    const carte = carteTribunal(getDepartement('57')!.tribunal, 'TC');
    expect(carte!.type).toMatch(/Chambre commerciale/);
  });

  it('débiteur relevant du TJ hors TAE : pas de tribunal de commerce proposé', () => {
    const carte = carteTribunal(getDepartement('01')!.tribunal, 'TJ');
    expect(carte!.nom).toMatch(/Tribunal judiciaire/);
    expect(carte!.type).not.toMatch(/commerce/i);
  });

  it('transmet la mention des numéros surtaxés', () => {
    const carte = carteTribunal(getDepartement('93')!.tribunal, 'TC');
    expect(carte!.telephoneNote).toMatch(/surtaxé/);
  });

  it('plus de 3247 ni de 0 806 000 245', () => {
    const cartes = tous(buildOrganismes(getDepartement('75'), makeReponses(), []));
    for (const c of cartes) {
      expect(c.telephone ?? '').not.toMatch(/^3247$|0 806 000 245/);
    }
  });

  it('indépendant·e : Urssaf au 3698 ; employeur : 3957', () => {
    const indep = tous(buildOrganismes(getDepartement('75'), makeReponses({ effectif: 'independant' }), []));
    expect(indep.find((c) => c.type === 'URSSAF')!.telephone).toBe('3698');
    expect(indep.find((c) => c.nom.includes('CPSTI'))!.telephone).toBe('3698');
    const empl = tous(buildOrganismes(getDepartement('75'), makeReponses({ effectif: 'salaries' }), []));
    expect(empl.find((c) => c.type === 'URSSAF')!.telephone).toBe('3957');
  });
});

describe('institutionEmission : Banque de France, IEDOM, IEOM (tour 5)', () => {
  it('métropole : Banque de France, 34 14', () => {
    expect(institutionEmission('75')).toMatchObject({ nom: 'Banque de France', telephone: '34 14' });
  });
  it('outre-mer : IEDOM / IEOM, 34 14 (annuaire service-public)', () => {
    // IEDOM : 34 14 (annuaire service-public, fiches des agences IEDOM).
    expect(institutionEmission('971')).toMatchObject({ nom: 'IEDOM', avecArticle: "l'IEDOM", telephone: '34 14' });
    expect(institutionEmission('974').telephone).toBe('34 14');
    expect(institutionEmission('988')).toMatchObject({ nom: 'IEOM', telephone: '34 14' });
  });
});
