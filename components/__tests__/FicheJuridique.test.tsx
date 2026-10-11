// @vitest-environment jsdom
/**
 * Non-régression du lot « juridique-coherence » côté blocs de la fiche.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';
import { FicheProvider, type FicheContextType } from '@/lib/FicheContext';
import { getSectorInfo } from '@/lib/secteur';
import type { CompanyData, Reponses } from '@/lib/types';
import BlocChecklist from '../fiche/BlocChecklist';
import BlocProtectionFamille from '../fiche/BlocProtectionFamille';
import BlocConjointCollaborateur from '../fiche/BlocConjointCollaborateur';
import BlocPGE from '../fiche/BlocPGE';
import BlocPlateformes from '../fiche/BlocPlateformes';
import BlocCessationDecompte from '../fiche/BlocCessationDecompte';
import BlocFranchise from '../fiche/BlocFranchise';
import BlocCreditBail from '../fiche/BlocCreditBail';
import BlocReclassement from '../fiche/BlocReclassement';
import BlocCSP from '../fiche/BlocCSP';
import BlocSurendettement from '../fiche/BlocSurendettement';
import BlocArretLongueDuree from '../fiche/BlocArretLongueDuree';
import BlocProcedureRecommandee from '../fiche/BlocProcedureRecommandee';
import IdentiteHero from '../fiche/dashboard/IdentiteHero';
import { buildPoches } from '../fiche/BlocPatrimoine';
import { buildJalons } from '../fiche/BlocCalendrier';
import { buildAlertes } from '../fiche/BlocPrescription';
import { buildItems } from '../fiche/BlocChecklist';
import { buildDefaultActions } from '../fiche/BlocPlanAction';
import { nomSansSigleRedondant } from '../fiche/layouts/LayoutDashboard';

function company(o: Partial<CompanyData> = {}): CompanyData {
  return {
    siret: '12345678901234',
    nom: 'Test',
    formeJuridique: 'SARL',
    naf: '62.01Z',
    dateCreation: '2015-01-01',
    effectif: '',
    adresse: '',
    codePostal: '33000',
    ville: 'Bordeaux',
    departement: '33',
    fetched: true,
    ...o,
  };
}

function ctx(r: Partial<Reponses> = {}, c: Partial<CompanyData> = {}): FicheContextType {
  const co = company(c);
  return {
    token: 'test',
    reponses: { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif', ...r },
    company: co,
    sector: getSectorInfo(co),
    alertes: [],
    bodacc: [],
    infogreffe: [],
    groupes: [],
    companyAge: 10,
    seuils: { approx: 0, cse: false, obligations50: false },
  };
}

function texte(el: ReactElement, c: FicheContextType): string {
  return renderToStaticMarkup(<FicheProvider value={c}>{el}</FicheProvider>)
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

const EI = 'Entrepreneur individuel';

beforeEach(() => {
  localStorage.clear();
});

describe('Checklist', () => {
  it('les cases cochées survivent au rechargement (clé liée au SIRET)', () => {
    const c = ctx();
    const { unmount } = render(<FicheProvider value={c}><BlocChecklist defaultOpen /></FicheProvider>);
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getByText(/^1 \//)).toBeInTheDocument();
    unmount();
    cleanup();
    render(<FicheProvider value={c}><BlocChecklist defaultOpen /></FicheProvider>);
    expect((screen.getAllByRole('checkbox')[0] as HTMLInputElement).checked).toBe(true);
    expect(localStorage.getItem('solelis_checklist_12345678901234')).toContain('true');
  });

  it('ni « tribunal de commerce » pour un débiteur du tribunal judiciaire, ni « SIE de <ville> », ni « CA »', () => {
    const c = company({ formeJuridique: EI, naf: '01.11Z', ville: 'VERT' });
    const r = { situation: 'prevention', probleme: 'impots', effectif: 'independant', moral: 'combatif' } as Reponses;
    const textes = [...buildItems(r, c, getSectorInfo(c)), ...buildDefaultActions(r, c, getSectorInfo(c))].map((x) => x.texte).join(' ');
    expect(textes).not.toMatch(/tribunal de commerce/i);
    expect(textes).not.toMatch(/SIE de VERT/);
    expect(textes).not.toMatch(/la CA\b/);
    expect(textes).toMatch(/Chambre d'agriculture/);
  });

  it('URSSAF : 36 98 pour un·e indépendant·e, MSA pour un·e agriculteur·rice', () => {
    const c = company();
    const r = { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' } as Reponses;
    expect(buildItems(r, c, getSectorInfo(c)).map((x) => x.texte).join(' ')).toMatch(/3698/);
    const agri = company({ naf: '01.11Z', formeJuridique: EI });
    expect(buildDefaultActions(r, agri, getSectorInfo(agri)).map((x) => x.texte).join(' ')).toMatch(/MSA/);
  });
});

describe('Patrimoine (art. L526-1, L526-22 C. com. ; L221-1 C. com. ; 1857 C. civ.)', () => {
  const r = { situation: 'tresorie', probleme: 'banque', effectif: 'independant', moral: 'combatif', patrimoine: 'proprietaire', caution: 'non', regime: 'separation' } as Reponses;

  it('société : pas de déclaration notariée d\'insaisissabilité conseillée', () => {
    for (const forme of ['SARL', "Groupement agricole d'exploitation en commun (GAEC)", 'SAS / SASU']) {
      const t = buildPoches(r, company({ formeJuridique: forme })).map((p) => p.analyse + p.action).join(' ');
      expect(t).not.toMatch(/déclaration d.insaisissabilité (préventive|sur vos autres biens|peut être possible)|Elle peut être déclarée chez un notaire/);
    }
    const c = ctx(r, { formeJuridique: 'SARL' });
    expect(texte(<BlocProtectionFamille />, c)).not.toMatch(/Consultez un notaire pour une déclaration/);
  });

  it('EI : séparation des patrimoines depuis 2022, plus de « premières cibles des créanciers »', () => {
    const t = buildPoches(r, company({ formeJuridique: EI })).map((p) => p.analyse).join(' ');
    expect(t).not.toMatch(/premières cibles/);
    expect(t).toMatch(/L526-22/);
  });

  it('SNC et société civile : jamais « risque limité à l\'entreprise »', () => {
    for (const forme of ['Société en nom collectif (SNC)', 'Société civile immobilière (SCI)']) {
      const poches = buildPoches(r, company({ formeJuridique: forme }));
      const t = poches.map((p) => p.analyse).join(' ');
      expect(t).not.toMatch(/risque est limité à l'entreprise/);
      expect(poches.find((p) => p.cle === 'epargne')?.niveau).toBe('expose');
    }
  });

  it('caution disproportionnée : art. 2300 C. civ. (et non 2297)', () => {
    const t = texte(<BlocProtectionFamille />, ctx({ ...r, caution: 'oui' }));
    expect(t).toMatch(/art\. 2300 C\. civ\./);
    expect(t).not.toMatch(/2297/);
  });
});

describe('Délais (art. L611-3, L611-4, L631-4, L653-8 C. com.)', () => {
  it('calendrier : pas d\'échéance des 45 jours hors cessation', () => {
    const c = company();
    for (const situation of ['prevention', 'tresorie'] as const) {
      const j = buildJalons({ situation, probleme: 'urssaf', effectif: 'independant', moral: 'combatif' }, c, getSectorInfo(c));
      expect(j.map((x) => x.texte).join(' ')).not.toMatch(/45 jours|cessation des paiements/);
    }
    const j = buildJalons({ situation: 'redressement', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' }, c, getSectorInfo(c));
    expect(j.map((x) => x.texte).join(' ')).toMatch(/dans les 45 jours suivant la date de cessation des paiements/);
  });

  it('mandat ad hoc réservé à l\'entreprise qui n\'est pas en cessation', () => {
    const seuils = { cse: false, obligations50: false };
    const base = { probleme: 'urssaf', effectif: 'independant', moral: 'combatif' } as const;
    const prev = buildAlertes({ ...base, situation: 'prevention' }, 10, seuils).map((a) => a.texte + a.detail).join(' ');
    expect(prev).not.toMatch(/depuis plus de 45 jours, vous pouvez demander un mandat ad hoc/);
    const redr = buildAlertes({ ...base, situation: 'redressement' }, 10, seuils).map((a) => a.texte + a.detail).join(' ');
    expect(redr).toMatch(/conciliation/);
    expect(redr).not.toMatch(/vous pouvez demander un mandat ad hoc/);
  });

  it('assignation : « devant le tribunal judiciaire » pour un agriculteur', () => {
    const a = buildAlertes({ situation: 'assignation', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' }, 10, { cse: false, obligations50: false }, 'le tribunal judiciaire');
    expect(a.map((x) => x.detail).join(' ')).toMatch(/devant le tribunal judiciaire/);
  });

  it('décompte des 45 jours : plus de faillite personnelle ni de banqueroute pour un simple retard', () => {
    const t = texte(<BlocCessationDecompte />, ctx({ situation: 'redressement' }));
    expect(t).not.toMatch(/faillite personnelle/);
    expect(t).toMatch(/L653-8/);
  });
});

describe('Procédures (art. L645-1 C. com.)', () => {
  it('PRP absent avec des salariés ou hors cessation', () => {
    expect(texte(<BlocProcedureRecommandee />, ctx({ situation: 'redressement', effectif: 'salaries' }, { formeJuridique: EI }))).not.toMatch(/Rétablissement professionnel/);
    expect(texte(<BlocProcedureRecommandee />, ctx({ situation: 'tresorie' }, { formeJuridique: EI }))).not.toMatch(/Rétablissement professionnel/);
    expect(texte(<BlocProcedureRecommandee />, ctx({ situation: 'redressement' }, { formeJuridique: EI }))).toMatch(/Rétablissement professionnel/);
  });
});

describe('Conjoint (art. L121-4 C. com.)', () => {
  it('sans statut déclaré : réputé conjoint salarié, pas « présumé collaborateur »', () => {
    const t = texte(<BlocConjointCollaborateur />, ctx({ conjointStatut: 'aucun' }));
    expect(t).not.toMatch(/présumé collaborateur/);
    expect(t).toMatch(/conjoint salarié/);
    expect(t).not.toMatch(/L243-6-2/);
  });
});

describe('CSP (art. L1233-66 C. trav., Unédic)', () => {
  it('pas de sanction au refus du salarié ; contribution 2 ou 3 mois ; préavis limité à 3 mois', () => {
    const c = ctx({ effectif: 'salaries' });
    const recl = texte(<BlocReclassement />, c);
    expect(recl).not.toMatch(/Si le salarié refuse ou si l'employeur omet/);
    expect(recl).toMatch(/3 mois si le salarié adhère/);
    const csp = texte(<BlocCSP />, c);
    expect(csp).not.toMatch(/2 mois max/);
    expect(csp).toMatch(/limite de 3 mois/);
    expect(csp).not.toMatch(/Cdte/);
    expect(csp).not.toMatch(/F31432/);
  });
});

describe('Arrêt longue durée', () => {
  it('plafond IJ 1,4 SMIC ; préavis non suspendu ; indemnité doublée = origine professionnelle', () => {
    const t = texte(<BlocArretLongueDuree />, ctx({ effectif: 'salaries', situation: 'redressement' }));
    expect(t).toMatch(/1,4 SMIC/);
    expect(t).not.toMatch(/1,8 SMIC/);
    expect(t).not.toMatch(/suspendu pendant l'arrêt/);
    expect(t).not.toMatch(/non-professionnelle ouvrant droit à indemnité/);
  });
});

describe('Blocs conditionnels', () => {
  it('bloc PGE affiché quand un PGE est en cours (carte prioritaire « PGE en cours »)', () => {
    expect(texte(<BlocPGE />, ctx({ pgeEnCours: 'oui', probleme: 'urssaf', situation: 'prevention' }))).toMatch(/PGE en difficulté/);
  });
  it('bloc plateformes : pas pour un restaurant, un coiffeur, une aide à domicile', () => {
    for (const naf of ['56.10A', '96.02A', '88.10A']) {
      expect(texte(<BlocPlateformes />, ctx({}, { naf }))).toBe('');
    }
    expect(texte(<BlocPlateformes />, ctx({}, { naf: '49.32Z' }))).toMatch(/plateforme/);
  });
});

describe('Mots collés', () => {
  it('espaces conservés après les mises en gras', () => {
    const c = ctx({ situation: 'tresorie', franchise: 'oui', probleme: 'banque', effectif: 'salaries' });
    const t = [
      texte(<BlocFranchise />, c),
      texte(<BlocCreditBail />, c),
      texte(<BlocReclassement />, c),
      texte(<BlocSurendettement />, c),
    ].join(' ');
    for (const colle of ["l'amiableen", 'FFFpermettent', 'planavec', 'Travailéquivalente', 'manifestede']) {
      expect(t).not.toContain(colle);
    }
  });
});

describe('Identité', () => {
  it('nom non doublé quand le sigle est identique', () => {
    expect(nomSansSigleRedondant('AMP ETANCHEITE (AMP ETANCHEITE)')).toBe('AMP ETANCHEITE');
    expect(nomSansSigleRedondant('SOCIETE DUPONT (SD)')).toBe('SOCIETE DUPONT (SD)');
  });
  it('pas de point « · » isolé après le SIRET', () => {
    render(<FicheProvider value={ctx()}><IdentiteHero /></FicheProvider>);
    const separateurs = screen.queryAllByText('·');
    expect(separateurs).toHaveLength(0);
  });
});
