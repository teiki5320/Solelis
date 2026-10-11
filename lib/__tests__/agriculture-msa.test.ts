// @vitest-environment node
/**
 * Non-régression : un·e exploitant·e agricole (EARL à Vert, 40420 Landes)
 * ne doit jamais être renvoyé·e vers l'action sociale du CPSTI (Urssaf, 36 98) :
 * son régime est celui de la MSA.
 */
import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { CompanyData, Reponses } from '@/lib/types';
import { getSectorInfo, getCompanyAge, getEffectifSeuils, estFormeAgricole } from '@/lib/secteur';
import {
  buildOrganismes,
  buildOrdresProfessionnels,
  buildAidesPersonnelles,
  buildSoutien,
  buildReseauxSpecifiques,
  getDepartement,
  carteActionSocialeNonSalarie,
  relevantDuCpsti,
  MSA_AIDES_PAIEMENT,
  MSA_CONTACT,
} from '@/lib/organismes';
import { getJuridiction, harmoniserCarteTribunal } from '@/lib/strategie';
import { computeAlertes } from '@/lib/bodacc';
import { buildAides } from '@/components/fiche/BlocAides';
import { scorePriorityCards } from '@/lib/priorites';
import { COURRIERS, personalizeCourrier, champsCourrier } from '@/lib/courriers';
import LayoutDashboard from '@/components/fiche/layouts/LayoutDashboard';

const EARL_VERT: CompanyData = {
  siret: '12345678900011',
  nom: 'EARL DU TEST',
  formeJuridique: 'Exploitation agricole à responsabilité limitée (EARL)',
  naf: '01.11Z',
  dateCreation: '2010-01-01',
  effectif: '0 salarié',
  adresse: '1 route de la Forêt',
  codePostal: '40420',
  ville: 'VERT',
  departement: '40',
  fetched: true,
};

const INDEP_URSSAF: Reponses = {
  situation: 'tresorie',
  probleme: 'urssaf',
  effectif: 'independant',
  moral: 'combatif',
} as Reponses;

const CPSTI = /CPSTI|Action sociale des (travailleurs )?indépendants|Urssaf · Action sociale|\b36 ?98\b/;

function ficheComplete(r: Reponses, c: CompanyData) {
  const sector = getSectorInfo(c);
  const dep = getDepartement(c.departement);
  const groupesBase = harmoniserCarteTribunal(
    buildOrganismes(dep, r, [], sector.secteur, c.effectif, getJuridiction(c)),
    c,
  );
  const ordres = buildOrdresProfessionnels(sector);
  const groupes = [
    ...groupesBase,
    ...(ordres ? [ordres] : []),
    buildSoutien(r),
    buildAidesPersonnelles(r, sector.secteur, c.departement),
    ...buildReseauxSpecifiques(r, sector),
  ];
  const html = renderToStaticMarkup(
    createElement(LayoutDashboard, {
      token: 'test',
      company: c,
      reponses: r,
      sector,
      alertes: computeAlertes([], [], r.situation, { bodaccDisponible: true }),
      bodacc: [],
      infogreffe: [],
      bodaccIndisponible: false,
      groupes,
      companyAge: getCompanyAge(c.dateCreation),
      seuils: getEffectifSeuils(c.effectif),
    }),
  );
  return { sector, groupes, html };
}

describe('secteur : formes agricoles', () => {
  it('EARL, GAEC, SCEA → agriculture, même sans code NAF agricole', () => {
    for (const forme of [
      'Exploitation agricole à responsabilité limitée (EARL)',
      "Groupement agricole d'exploitation en commun (GAEC)",
      "Société civile d'exploitation agricole (SCEA)",
      'EARL',
    ]) {
      expect(estFormeAgricole(forme)).toBe(true);
      expect(getSectorInfo({ ...EARL_VERT, formeJuridique: forme, naf: '' }).secteur).toBe('agriculture');
      expect(getSectorInfo({ ...EARL_VERT, formeJuridique: forme, naf: '68.20B' }).secteur).toBe('agriculture');
    }
  });

  it('autres formes : inchangé ; pêche (NAF 03) garde l’ENIM', () => {
    expect(estFormeAgricole('SAS / SASU')).toBe(false);
    expect(estFormeAgricole("Coopérative d'utilisation de matériel agricole (CUMA)")).toBe(false);
    expect(getSectorInfo({ ...EARL_VERT, formeJuridique: 'SAS / SASU', naf: '68.20B' }).secteur).not.toBe('agriculture');
    expect(getSectorInfo({ ...EARL_VERT, naf: '03.11Z' }).secteur).toBe('peche');
  });
});

describe('action sociale du non-salarié : CPSTI, MSA ou rien', () => {
  it('régime général : CPSTI (Urssaf, 36 98)', () => {
    expect(relevantDuCpsti('commerce')).toBe(true);
    expect(carteActionSocialeNonSalarie('commerce', '33')?.nom).toContain('CPSTI');
  });

  it('agriculture en métropole : MSA, sans numéro inventé', () => {
    const carte = carteActionSocialeNonSalarie('agriculture', '40');
    expect(carte?.nom).toMatch(/^MSA/);
    expect(carte?.telephone).toBeUndefined();
    expect(carte?.site).toBe(MSA_AIDES_PAIEMENT);
  });

  it('agriculture outre-mer et pêche : ni CPSTI ni MSA', () => {
    expect(carteActionSocialeNonSalarie('agriculture', '971')).toBeNull();
    expect(carteActionSocialeNonSalarie('peche', '29')).toBeNull();
  });
});

describe('EARL à Vert (40420) : aucune orientation CPSTI / Urssaf indépendants', () => {
  it('carte Organismes « Social » : MSA, pas de CPSTI ni de 36 98', () => {
    const { groupes } = ficheComplete(INDEP_URSSAF, EARL_VERT);
    const social = groupes.find((g) => g.cle === 'social')!;
    expect(JSON.stringify(social)).not.toMatch(CPSTI);
    expect(social.cartes.some((c) => c.site === MSA_AIDES_PAIEMENT)).toBe(true);
    const fin = groupes.find((g) => g.cle === 'financier')!;
    const msa = fin.cartes.find((c) => /^MSA/.test(c.nom));
    expect(msa?.site).toBe(MSA_CONTACT);
  });

  it('bloc Aides : MSA à la place de l’action sociale Urssaf, RSA à la MSA', () => {
    for (const probleme of ['urssaf', 'banque'] as const) {
      const r = { ...INDEP_URSSAF, probleme };
      const sections = buildAides(r, EARL_VERT, getSectorInfo(EARL_VERT));
      const texte = JSON.stringify(sections);
      expect(texte).not.toMatch(CPSTI);
      expect(texte).toContain(MSA_AIDES_PAIEMENT);
      // Une seule carte MSA « aides aux exploitant·e·s », pas de doublon.
      expect(texte.split(MSA_AIDES_PAIEMENT).length - 1).toBe(1);
      const rsa = sections.flatMap((s) => s.aides).find((a) => a.nom === 'RSA');
      expect(rsa?.site).toBe('https://www.msa.fr/lfp/rsa');
    }
  });

  it('« Aide d’urgence MSA » : lien vers la page de contact des caisses, sans faux numéro', () => {
    const aide = getSectorInfo(EARL_VERT).aidesSpecifiques.find((a) => /MSA/.test(a.nom))!;
    expect(aide.site).toBe(MSA_CONTACT);
    expect((aide as { telephone?: string }).telephone).toBeUndefined();
  });

  it('fiche rendue en entier : jamais CPSTI, « Action sociale des indépendants » ni 36 98', () => {
    for (const probleme of ['urssaf', 'banque', 'impots', 'fournisseurs'] as const) {
      const { html } = ficheComplete({ ...INDEP_URSSAF, probleme }, EARL_VERT);
      const m = CPSTI.exec(html);
      expect(m ? html.slice(Math.max(0, m.index - 120), m.index + 80) : null).toBeNull();
      expect(html).not.toContain('tel:3698');
      expect(html).toContain('msa.fr');
    }
  });

  it('prescription et contestation : art. L725-7 C. rur. et CRA de la MSA', () => {
    const { html } = ficheComplete(INDEP_URSSAF, EARL_VERT);
    expect(html).toContain('Les cotisations MSA se prescrivent par 3 ans');
    expect(html).toContain('art. L725-7 du Code rural et de la pêche maritime');
    expect(html).toContain('Vous avez 2 mois pour contester une mise en demeure de la MSA');
    expect(html).not.toContain('Les cotisations URSSAF se prescrivent');
    expect(html).not.toContain('art. L244-3');
    expect(html).toContain('Date de mise en demeure MSA reçue');
    expect(html).toContain('Pour votre situation (MSA)');
  });

  it('ACRE (rebond) : pas de 36 98, orientation vers la caisse de MSA', () => {
    const acre = buildAidesPersonnelles(INDEP_URSSAF, 'agriculture', '40').cartes.find((c) => c.nom.startsWith('ACRE'))!;
    expect(acre.telephone).toBeUndefined();
    expect(acre.site).toBe(MSA_CONTACT);
    expect(acre.type).toMatch(/MSA/);
    // Hors agriculture : inchangé (Urssaf, 36 98).
    expect(buildAidesPersonnelles(INDEP_URSSAF, 'commerce', '33').cartes.find((c) => c.nom.startsWith('ACRE'))!.telephone).toBe('3698');
  });

  it('témoin non agricole : prescription Urssaf (art. L244-3 CSS) inchangée', () => {
    const commercant = { ...EARL_VERT, formeJuridique: 'Entrepreneur individuel', naf: '47.11B' };
    const { html } = ficheComplete(INDEP_URSSAF, commercant);
    expect(html).toContain('Les cotisations URSSAF se prescrivent par 3 ans');
    expect(html).toContain('Date de mise en demeure URSSAF reçue');
  });

  it('carte prioritaire « Aides » : MSA + CCSF + BPI (pas URSSAF)', () => {
    const sector = getSectorInfo(EARL_VERT);
    const cartes = scorePriorityCards({ reponses: INDEP_URSSAF, company: EARL_VERT, sector, seuils: getEffectifSeuils(EARL_VERT.effectif) });
    const aides = cartes.find((c) => c.id === 'aides');
    expect(aides?.detail).toBe('MSA + CCSF + BPI');
  });

  it('témoin : un commerçant indépendant garde l’action sociale du CPSTI', () => {
    const commercant = { ...EARL_VERT, formeJuridique: 'Entrepreneur individuel', naf: '47.11B' };
    const { html } = ficheComplete(INDEP_URSSAF, commercant);
    expect(html).toMatch(/CPSTI/);
  });
});

describe('courriers : exploitant·e agricole → caisse de MSA', () => {
  const get = (slug: string) => COURRIERS.find((c) => c.slug === slug)!;

  it('aide d’urgence : adressée à la MSA, plus aucune mention du CPSTI ni de l’Urssaf', () => {
    const p = personalizeCourrier(get('aide-urgence-social'), { regimeMsa: true, effectif: 'independant' });
    expect(p.destinataire).toMatch(/caisse de MSA/);
    expect(p.corps).not.toMatch(/CPSTI|urssaf/i);
    expect(p.corps).toContain('Demande de prise en charge de cotisations sociales (fonds ASS)');
    // Mise en page inchangée : mêmes champs à remplir.
    expect(champsCourrier(p.corps).sort()).toEqual(champsCourrier(get('aide-urgence-social').corps).sort());
  });

  it('échelonnement et contestation : titre et destinataire MSA', () => {
    const e = personalizeCourrier(get('echelonnement-urssaf'), { regimeMsa: true });
    expect(e.titre).toBe("Demande d'échelonnement de cotisations MSA");
    expect(e.destinataire).toMatch(/caisse de MSA/);
    const c = personalizeCourrier(get('contestation-urssaf'), { regimeMsa: true, situation: 'assignation', effectif: 'independant' });
    expect(c.destinataire).toBe('Commission de Recours Amiable (CRA) de votre caisse de MSA');
    expect(c.conseil).toMatch(/caisse de MSA/);
    expect(c.conseil).not.toMatch(/3698|URSSAF/);
  });

  it('CCSF : attestation de la caisse de MSA', () => {
    const p = personalizeCourrier(get('saisine-ccsf'), { regimeMsa: true });
    expect(p.corps).toContain('Attestation de votre caisse de MSA de paiement des parts salariales');
    expect(p.corps).not.toContain('Attestation Urssaf');
  });

  it('aucun courrier personnalisé pour un·e exploitant·e ne s’adresse à l’Urssaf', () => {
    for (const t of COURRIERS) {
      const p = personalizeCourrier(t, { regimeMsa: true, situation: 'assignation', effectif: 'independant' });
      expect(`${p.titre} ${p.destinataire} ${p.conseil ?? ''}`, t.slug).not.toMatch(/urssaf|cpsti/i);
      expect(p.corps, t.slug).not.toMatch(/CPSTI|urssaf\.fr|Attestation Urssaf/i);
    }
  });

  it('hors agriculture : courriers inchangés (Urssaf, CPSTI)', () => {
    const p = personalizeCourrier(get('aide-urgence-social'), { effectif: 'independant' });
    expect(p.destinataire).toBe(get('aide-urgence-social').destinataire);
    expect(p.corps).toContain('CPSTI');
    expect(personalizeCourrier(get('echelonnement-urssaf'), {}).titre).toBe(get('echelonnement-urssaf').titre);
  });
});
