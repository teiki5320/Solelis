import { describe, it, expect } from 'vitest';
import {
  COURRIERS,
  getCourrier,
  personalizeCourrier,
  CATEGORIES,
  champsCourrier,
  remplirChamps,
  type CourrierTemplate,
  type CourrierContext,
} from '../courriers';

/* ─── COURRIERS (données) ─── */

describe('COURRIERS', () => {
  it('contient au moins 12 templates', () => {
    expect(COURRIERS.length).toBeGreaterThanOrEqual(12);
  });

  it('chaque template possède les champs requis', () => {
    const champsRequis: (keyof CourrierTemplate)[] = [
      'slug',
      'titre',
      'destinataire',
      'categorie',
      'objet',
      'corps',
    ];
    for (const courrier of COURRIERS) {
      for (const champ of champsRequis) {
        expect(courrier[champ], `${courrier.slug} manque le champ « ${champ} »`).toBeDefined();
        expect(typeof courrier[champ]).toBe('string');
        expect((courrier[champ] as string).length).toBeGreaterThan(0);
      }
    }
  });

  it('chaque slug est unique', () => {
    const slugs = COURRIERS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(COURRIERS.length);
  });

  it('chaque catégorie est dans CATEGORIES', () => {
    for (const courrier of COURRIERS) {
      expect(CATEGORIES).toHaveProperty(courrier.categorie);
    }
  });

  it('chaque template a une icone et une description', () => {
    for (const courrier of COURRIERS) {
      expect(courrier.icone.length).toBeGreaterThan(0);
      expect(courrier.description.length).toBeGreaterThan(0);
    }
  });
});

/* ─── getCourrier ─── */

describe('getCourrier', () => {
  it('retourne le bon courrier par slug', () => {
    const result = getCourrier('echelonnement-urssaf');
    expect(result).toBeDefined();
    expect(result!.slug).toBe('echelonnement-urssaf');
    expect(result!.categorie).toBe('urssaf');
  });

  it('retourne chaque courrier par son slug', () => {
    for (const courrier of COURRIERS) {
      const result = getCourrier(courrier.slug);
      expect(result).toBeDefined();
      expect(result!.slug).toBe(courrier.slug);
    }
  });

  it('retourne undefined pour un slug invalide', () => {
    expect(getCourrier('slug-inexistant')).toBeUndefined();
    expect(getCourrier('')).toBeUndefined();
  });
});

/* ─── personalizeCourrier ─── */

describe('personalizeCourrier', () => {
  const template = COURRIERS.find((c) => c.slug === 'echelonnement-urssaf')!;

  it('retourne objet et corps même sans contexte', () => {
    const result = personalizeCourrier(template, {});
    expect(result.objet).toBe(template.objet);
    expect(result.corps).toContain('Madame, Monsieur');
    expect(result.urgence).toBeUndefined();
  });

  it('ajoute un préambule en situation de prévention', () => {
    const ctx: CourrierContext = { situation: 'prevention' };
    const result = personalizeCourrier(template, ctx);
    expect(result.preambule).toBeDefined();
    expect(result.preambule).toContain('amiable');
    expect(result.urgence).toBe('normale');
  });

  it('ajoute un closing quand moral est « combatif »', () => {
    const ctx: CourrierContext = { moral: 'combatif' };
    const result = personalizeCourrier(template, ctx);
    expect(result.closing).toBeDefined();
    expect(result.closing).toContain('mobilisé');
  });

  it('ajoute un closing quand moral est « epuise »', () => {
    const ctx: CourrierContext = { moral: 'epuise' };
    const result = personalizeCourrier(template, ctx);
    expect(result.closing).toContain('éprouvante');
  });

  it('ajoute un closing quand moral est « perdu »', () => {
    const ctx: CourrierContext = { moral: 'perdu' };
    const result = personalizeCourrier(template, ctx);
    expect(result.closing).toContain('accompagné');
  });

  it('urgence est critique en situation d\'assignation', () => {
    const ctx: CourrierContext = { situation: 'assignation' };
    const result = personalizeCourrier(template, ctx);
    expect(result.urgence).toBe('critique');
  });

  it('urgence est elevee en situation de redressement', () => {
    const ctx: CourrierContext = { situation: 'redressement' };
    const result = personalizeCourrier(template, ctx);
    expect(result.urgence).toBe('elevee');
  });

  it('fournit un conseil contextuel pour URSSAF', () => {
    const ctx: CourrierContext = { situation: 'prevention' };
    const result = personalizeCourrier(template, ctx);
    expect(result.conseil).toBeDefined();
    expect(result.conseil).toContain('recommandé');
  });

  it('conseil URSSAF mentionne l\'urgence en cas d\'assignation', () => {
    const ctx: CourrierContext = { situation: 'assignation' };
    const result = personalizeCourrier(template, ctx);
    expect(result.conseil).toContain('URGENT');
  });

  it('ne met pas de preambule sur les courriers formels (cessation, mandat ad hoc)', () => {
    const formel = COURRIERS.find((c) => c.slug === 'cessation-paiements')!;
    const ctx: CourrierContext = { situation: 'redressement', moral: 'combatif' };
    const result = personalizeCourrier(formel, ctx);
    expect(result.preambule).toBeUndefined();
  });

  it('ne met pas de closing sur les courriers formels (cessation, mandat ad hoc)', () => {
    const formel = COURRIERS.find((c) => c.slug === 'cessation-paiements')!;
    const ctx: CourrierContext = { moral: 'combatif' };
    const result = personalizeCourrier(formel, ctx);
    expect(result.closing).toBeUndefined();
  });

  it('ajoute un fragment effectif pour indépendant sur courrier URSSAF', () => {
    const ctx: CourrierContext = { situation: 'prevention', effectif: 'independant' };
    const result = personalizeCourrier(template, ctx);
    expect(result.corps).toContain('sans salarié');
  });

  it('ajoute un fragment effectif détaillé pour salariés', () => {
    const ctx: CourrierContext = {
      situation: 'tresorie',
      effectif: 'salaries',
      effectifDetail: 'Oui, 5 ou plus',
    };
    const result = personalizeCourrier(template, ctx);
    expect(result.corps).toContain('salariés');
  });

  it('conseil pour catégorie tribunal mentionne avocat', () => {
    const tribunal = COURRIERS.find((c) => c.categorie === 'tribunal')!;
    const result = personalizeCourrier(tribunal, {});
    expect(result.conseil).toContain('avocat');
  });

  it('conseil pour catégorie banque mentionne médiation', () => {
    const banque = COURRIERS.find((c) => c.categorie === 'banque')!;
    const result = personalizeCourrier(banque, {});
    expect(result.conseil).toContain('médiation');
  });
});

/* ─── CATEGORIES ─── */

describe('CATEGORIES', () => {
  it('contient toutes les catégories utilisées par les courriers', () => {
    const catsUsees = new Set(COURRIERS.map((c) => c.categorie));
    for (const cat of catsUsees) {
      expect(CATEGORIES[cat]).toBeDefined();
      expect(CATEGORIES[cat].label.length).toBeGreaterThan(0);
      expect(CATEGORIES[cat].couleur.length).toBeGreaterThan(0);
    }
  });
});

describe('champs à compléter', () => {
  it('reconnaît les champs numérotés ({{DATE_1}}, {{MONTANT_3}}) : aucun « {{ » ne reste', () => {
    const delai = getCourrier('delai-fournisseur')!;
    expect(champsCourrier(delai.corps)).toEqual(expect.arrayContaining(['DATE_1', 'MONTANT_1', 'DATE_3', 'MONTANT_3']));
    for (const c of COURRIERS) {
      const p = personalizeCourrier(c, {});
      const rempli = remplirChamps(p.objet + '\n' + p.corps, (k) => `[${k}]`);
      expect(rempli, c.slug).not.toMatch(/\{\{|\}\}/);
    }
  });
});
