/**
 * Non-régression du lot « juridique-coherence » : points de droit corrigés
 * (sources officielles en commentaire) et cohérence d'une même fiche.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { Reponses, CompanyData } from '../types';
import {
  computeScores,
  resolveStrategie,
  buildStrategie,
  prpEnvisageable,
  getTribunalCompetent,
  getJuridictionLabel,
  harmoniserCarteTribunal,
  getResponsabiliteAssocies,
  nomTribunalPourCourrier,
} from '../strategie';
import {
  buildOrganismes,
  buildOrdresProfessionnels,
  contactCotisations,
  getDepartement,
} from '../organismes';
import { getSectorInfo, libelleChambre } from '../secteur';
import { scorePriorityCards } from '../priorites';
import { COURRIERS, personalizeCourrier, getCourrier } from '../courriers';
import { computeAlertes, dateFr } from '../bodacc';

function rep(o: Partial<Reponses> = {}): Reponses {
  return { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif', ...o };
}

function co(o: Partial<CompanyData> = {}): CompanyData {
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

const EI = 'Entrepreneur individuel';
const SITUATIONS: Reponses['situation'][] = ['prevention', 'tresorie', 'redressement', 'assignation'];
const MORAUX: Reponses['moral'][] = ['combatif', 'epuise', 'perdu'];

describe('Rétablissement professionnel (art. L645-1 C. com.)', () => {
  it('jamais proposé hors cessation des paiements', () => {
    for (const situation of ['prevention', 'tresorie'] as const) {
      for (const moral of MORAUX) {
        const r = rep({ situation, moral, antecedents: 'oui' });
        expect(computeScores(r, co({ formeJuridique: EI })).rebondir).toBe(0);
        expect(prpEnvisageable(r, co({ formeJuridique: EI }))).toBe(false);
      }
    }
  });

  it('jamais proposé avec des salariés, ni à une société', () => {
    for (const situation of SITUATIONS) {
      expect(computeScores(rep({ situation, effectif: 'salaries' }), co({ formeJuridique: EI })).rebondir).toBe(0);
      expect(computeScores(rep({ situation }), co({ formeJuridique: 'SARL' })).rebondir).toBe(0);
    }
  });

  it('envisageable pour un·e EI sans salarié en cessation', () => {
    const r = rep({ situation: 'redressement', moral: 'perdu' });
    expect(prpEnvisageable(r, co({ formeJuridique: EI }))).toBe(true);
    expect(computeScores(r, co({ formeJuridique: EI })).rebondir).toBeGreaterThan(0);
  });

  it('la liquidation ne cite le PRP que si le débiteur y est éligible', () => {
    const avecSalaries = buildStrategie('liquider', rep({ situation: 'redressement', effectif: 'salaries' }), co({ formeJuridique: EI }), 3);
    expect(avecSalaries.alternatives.join(' ')).not.toMatch(/PRP|rétablissement/i);
    const eligible = buildStrategie('liquider', rep({ situation: 'redressement' }), co({ formeJuridique: EI }), 3);
    expect(eligible.alternatives.join(' ')).toMatch(/rétablissement professionnel/);
  });
});

describe('Phrases de stratégie conditionnelles', () => {
  it('« Votre moral… atouts forts » réservé au moral combatif', () => {
    for (const moral of ['epuise', 'perdu'] as const) {
      const s = buildStrategie('restructurer', rep({ situation: 'redressement', moral }), co(), 3);
      expect(s.pourquoi.join(' ')).not.toMatch(/Votre moral et votre volonté/);
    }
  });

  it('la cession n\'est pas proposée à qui a répondu « non » à la vente', () => {
    for (const situation of SITUATIONS) {
      for (const moral of MORAUX) {
        const r = rep({ situation, moral, vente: 'non', effectif: 'salaries' });
        const res = resolveStrategie(r, co())!;
        expect(res.main.axe).not.toBe('ceder');
        expect(res.secondary?.axe).not.toBe('ceder');
      }
    }
  });

  it('« Vous y êtes ouvert·e » seulement si vente = peut-être', () => {
    expect(buildStrategie('ceder', rep({ vente: undefined }), co(), 2).pourquoi.join(' ')).not.toMatch(/ouvert·e/);
    expect(buildStrategie('ceder', rep({ vente: 'peut-etre' }), co(), 2).pourquoi.join(' ')).toMatch(/ouvert·e/);
  });

  it('« Même avec cautions » seulement si une caution est déclarée', () => {
    const sans = buildStrategie('liquider', rep({ situation: 'redressement', caution: 'ne-sais-pas' }), co(), 3);
    expect(sans.pourquoi.join(' ')).not.toMatch(/Même avec cautions/);
    const avec = buildStrategie('liquider', rep({ situation: 'redressement', caution: 'oui' }), co(), 3);
    expect(avec.pourquoi.join(' ')).toMatch(/Même avec cautions/);
  });
});

describe('Tribunal : une seule source (getJuridiction + data/organismes.json)', () => {
  it('ne construit jamais « tribunal de commerce de <commune> »', () => {
    for (const [dep, ville, cp] of [['2A', 'CARGESE', '20130'], ['85', "LES SABLES D'OLONNE", '85100'], ['33', 'VERT', '33000']]) {
      const c = co({ departement: dep, ville, codePostal: cp });
      const label = getJuridictionLabel(c);
      expect(label).not.toContain(ville);
      const textes = (['sauvegarder', 'liquider'] as const).flatMap((a) => buildStrategie(a, rep({ situation: 'redressement' }), c, 3).etapes);
      expect(textes.join(' ')).not.toContain(ville);
    }
  });

  it('cite le tribunal réel du département', () => {
    expect(getTribunalCompetent(co({ departement: '2A' })).nom).toBe("Tribunal de commerce d'Ajaccio");
    expect(getTribunalCompetent(co({ departement: '13', codePostal: '13006', ville: 'MARSEILLE' })).nom).toBe('Tribunal des activités économiques de Marseille');
    expect(getTribunalCompetent(co({ departement: '57', codePostal: '57000', ville: 'METZ' })).generique).toBe('chambre commerciale du tribunal judiciaire');
    expect(getTribunalCompetent(co({ departement: '57', codePostal: '57000', ville: 'METZ' })).leGenerique).toBe('la chambre commerciale du tribunal judiciaire');
    expect(getTribunalCompetent(co({ departement: '971' })).generique).toBe('tribunal mixte de commerce');
  });

  it('courriers : {{TRIBUNAL}} prérempli avec le tribunal compétent, vide s’il est inconnu', () => {
    expect(nomTribunalPourCourrier(co({ departement: '2A' }))).toBe("Tribunal de commerce d'Ajaccio");
    expect(nomTribunalPourCourrier(co({ departement: '67', codePostal: '67000', ville: 'STRASBOURG' }))).toBe('Tribunal judiciaire de Strasbourg (chambre commerciale)');
    expect(nomTribunalPourCourrier(co({ departement: '986' }))).toBe('Tribunal de première instance de Mata-Utu');
    expect(nomTribunalPourCourrier(co({ departement: '' }))).toBe('');
    expect(nomTribunalPourCourrier(co({ departement: '33', formeJuridique: EI, naf: '01.11Z' }))).toBe('');
  });

  it('départements à plusieurs juridictions : celle du ressort, sinon une carte générique (jamais un tribunal faux)', () => {
    // Juridictions : « Données géocodées des structures de la Justice » (2026) ;
    // ressort des TC/TAE : communes rattachées à chaque juridiction dans
    // l'annuaire officiel (lannuaire.service-public.gouv.fr), identique au
    // ressort fixé par l'arrêté du 5 juillet 2024 pour les 12 TAE ;
    // Alsace-Moselle : ressort du tribunal judiciaire (compétences territoriales 2026).
    const t = (departement: string, codePostal: string, ville: string) =>
      getTribunalCompetent(co({ departement, codePostal, ville })).nom;
    expect(t('76', '76600', 'LE HAVRE')).toBe('Tribunal des activités économiques du Havre');
    expect(t('76', '76000', 'ROUEN')).toBe('Tribunal de commerce de Rouen');
    expect(t('76', '76190', 'YVETOT')).toBe('Tribunal de commerce de Rouen');
    expect(t('76', '76400', 'FECAMP')).toBe('Tribunal des activités économiques du Havre');
    expect(t('76', '76999', 'INCONNUE')).toBe('Tribunal de commerce ou des activités économiques dont dépend votre siège');
    expect(t('64', '64100', 'BAYONNE')).toBe('Tribunal de commerce de Bayonne');
    expect(t('59', '59140', 'DUNKERQUE')).toBe('Tribunal de commerce de Dunkerque');
    expect(t('02', '02100', 'Saint-Quentin')).toBe('Tribunal de commerce de Saint-Quentin');
    expect(t('02', '02100', 'Harly')).toBe('Tribunal de commerce de Saint-Quentin');
    expect(t('02', '02999', 'Inconnue')).toBe('Tribunal de commerce dont dépend votre siège');
    // Ressorts qui débordent du département (annuaire officiel, cours d’appel de Rennes et Besançon) : Dinan
    // relève du TC de Saint-Malo, Montbéliard du TC de Belfort.
    expect(t('22', '22100', 'DINAN')).toBe('Tribunal de commerce de Saint-Malo');
    expect(t('22', '22300', 'LANNION')).toBe('Tribunal des activités économiques de Saint-Brieuc');
    expect(t('25', '25200', 'MONTBELIARD')).toBe('Tribunal de commerce de Belfort');
    expect(t('25', '25300', 'PONTARLIER')).toBe('Tribunal de commerce de Besançon');
    expect(t('57', '57100', 'THIONVILLE')).toBe('Tribunal judiciaire de Thionville - Chambre commerciale');
    expect(t('67', '67600', 'SELESTAT')).toBe('Tribunal judiciaire de Colmar - Chambre commerciale');
    expect(t('68', '68100', 'MULHOUSE')).toBe('Tribunal judiciaire de Mulhouse - Chambre commerciale');
    // Courrier : champ laissé à compléter quand le ressort est inconnu.
    expect(nomTribunalPourCourrier(co({ departement: '76', codePostal: '76999', ville: 'INCONNUE' }))).toBe('');
    // Agriculteur·rice d'un département à TAE, ressort inconnu : TAE ou tribunal judiciaire.
    const agri = getTribunalCompetent(co({ departement: '13', codePostal: '13999', ville: 'INCONNUE', formeJuridique: EI, naf: '01.11Z' }));
    expect(agri.nom).toMatch(/^Tribunal judiciaire ou tribunal des activités économiques/);
    expect(agri.leGenerique).toBe('le tribunal compétent');
  });

  it('établissement secondaire : tribunal du siège (C. com. art. R600-1)', () => {
    const etab = co({ departement: '35', codePostal: '35000', ville: 'RENNES', siege: { codePostal: '22100', ville: 'DINAN', departement: '22' } });
    expect(getTribunalCompetent(etab).nom).toBe('Tribunal de commerce de Saint-Malo');
    expect(nomTribunalPourCourrier(etab)).toBe('Tribunal de commerce de Saint-Malo');
    // Siège inconnu (API INSEE) : carte générique, champ du courrier à compléter.
    const inconnu = co({ departement: '35', codePostal: '35000', ville: 'RENNES', siege: { codePostal: '', ville: '', departement: '' } });
    expect(getTribunalCompetent(inconnu).nom).toMatch(/dont dépend votre siège/);
    expect(nomTribunalPourCourrier(inconnu)).toBe('');
  });

  it('Saint-Pierre-et-Miquelon : profession libérale → tribunal de première instance (C. com. L910-2)', () => {
    const t = getTribunalCompetent(co({ departement: '975', codePostal: '97500', ville: 'SAINT-PIERRE', formeJuridique: EI, naf: '71.11Z' }));
    expect(t.nom).toBe('Tribunal de première instance de Saint-Pierre');
  });

  it('agriculteur, libéral, association, société civile → tribunal judiciaire', () => {
    const cas: Partial<CompanyData>[] = [
      { formeJuridique: EI, naf: '01.11Z' },
      { formeJuridique: EI, naf: '71.11Z' },
      { formeJuridique: 'Association déclarée', naf: '94.99Z' },
      { formeJuridique: 'Société civile immobilière (SCI)', naf: '68.20A' },
      { formeJuridique: "Groupement agricole d'exploitation en commun (GAEC)", naf: '01.11Z' },
    ];
    for (const c of cas) {
      const t = getTribunalCompetent(co(c));
      expect(t.juridiction).toBe('TJ');
      expect(t.nom).not.toMatch(/^Tribunal de commerce/);
    }
  });

  it('La Réunion : tribunal mixte de commerce de Saint-Pierre selon le code postal', () => {
    expect(getTribunalCompetent(co({ departement: '974', codePostal: '97410' })).nom).toBe('Tribunal mixte de commerce de Saint-Pierre');
    expect(getTribunalCompetent(co({ departement: '974', codePostal: '97430' })).nom).toBe('Tribunal mixte de commerce de Saint-Pierre');
    expect(getTribunalCompetent(co({ departement: '974', codePostal: '97400' })).nom).toMatch(/Saint-Denis/);
  });

  it('professions du droit : tribunal judiciaire même dans le ressort d\'un TAE', () => {
    const t = getTribunalCompetent(co({ formeJuridique: EI, naf: '69.10Z', departement: '75' }));
    expect(t.nom).toBe('Tribunal judiciaire de votre ressort');
  });

  it('la carte « Organismes » est alignée sur le même tribunal', () => {
    const c = co({ formeJuridique: EI, naf: '69.10Z', departement: '75', codePostal: '75001' });
    const groupes = harmoniserCarteTribunal(buildOrganismes(getDepartement('75'), rep(), [], 'liberal', '', 'TJ'), c);
    const inst = groupes.find((g) => g.cle === 'institutionnel')!;
    expect(inst.cartes.filter((x) => /^tribunal/i.test(x.nom)).map((x) => x.nom)).toEqual(['Tribunal judiciaire de votre ressort']);
  });

  it('carte « audience » : le nom du tribunal, pas la commune', () => {
    const c = co({ departement: '2A', ville: 'CARGESE', codePostal: '20130' });
    const cartes = scorePriorityCards({ reponses: rep({ situation: 'assignation' }), company: c, sector: getSectorInfo(c), seuils: { approx: 0, cse: false, obligations50: false } });
    expect(cartes.find((x) => x.id === 'audience')?.detail).toBe("Tribunal de commerce d'Ajaccio");
  });
});

describe('Responsabilité des associés', () => {
  it('SNC : indéfinie et solidaire (art. L221-1 C. com.)', () => {
    const r = getResponsabiliteAssocies('Société en nom collectif (SNC)');
    expect(r.illimitee).toBe(true);
    expect(r.texte).toMatch(/L221-1/);
  });
  it('sociétés civiles : indéfinie à proportion des parts (art. 1857 C. civ.)', () => {
    for (const f of ['Société civile immobilière (SCI)', 'Société civile professionnelle (SCP)', "Société civile d'exploitation agricole (SCEA)"]) {
      const r = getResponsabiliteAssocies(f);
      expect(r.illimitee).toBe(true);
      expect(r.texte).toMatch(/1857/);
    }
  });
  it('GAEC : deux fois la part du capital (art. L323-10 C. rur.)', () => {
    const r = getResponsabiliteAssocies("Groupement agricole d'exploitation en commun (GAEC)");
    expect(r.illimitee).toBe(true);
    expect(r.texte).toMatch(/L323-10/);
  });
  it('SARL, SAS, EARL : limitée ; EI : régime propre ; inconnue : inconnue', () => {
    expect(getResponsabiliteAssocies('SARL').regime).toBe('limitee');
    expect(getResponsabiliteAssocies('SAS / SASU').regime).toBe('limitee');
    expect(getResponsabiliteAssocies('Exploitation agricole à responsabilité limitée (EARL)').regime).toBe('limitee');
    expect(getResponsabiliteAssocies(EI).regime).toBe('ei');
    expect(getResponsabiliteAssocies('Non renseignée').regime).toBe('inconnue');
  });
});

describe('Cotisations : bon organisme, bon numéro', () => {
  const generique = getSectorInfo(co({ naf: '62.01Z' }));
  it('URSSAF : 36 98 pour les indépendant·e·s, 39 57 pour les employeurs', () => {
    expect(contactCotisations(generique, 'independant', '33').tel).toBe('3698');
    expect(contactCotisations(generique, 'salaries', '33').tel).toBe('3957');
  });
  it('employeur du BTP ou libéral : « l’URSSAF (3957) », sans y mêler les caisses du secteur', () => {
    for (const naf of ['43.99A', '69.10Z', '86.21Z']) {
      const c = contactCotisations(getSectorInfo(co({ naf })), 'salaries', '85');
      expect(c.org).toBe('URSSAF');
      expect(c.libelle).toBe('URSSAF (3957)');
    }
  });
  it('outre-mer : la CGSS / CSSM, au 39 57 (employeurs) ou 36 98 (indépendant·e·s)', () => {
    // Pages « nous contacter » des CGSS et annuaire service-public (2026) :
    // le 0 820 000 97x n'est plus publié.
    for (const dep of ['971', '972', '973', '974']) {
      const c = contactCotisations(generique, 'salaries', dep);
      expect(c.org).toMatch(/CGSS/);
      expect(c.tel).toBe('3957');
      expect(contactCotisations(generique, 'independant', dep).tel).toBe('3698');
    }
    expect(contactCotisations(generique, 'salaries', '976').org).toMatch(/CSSM/);
  });
  it('agriculteur : MSA, sans numéro national', () => {
    const agri = getSectorInfo(co({ naf: '01.11Z', formeJuridique: EI }));
    const c = contactCotisations(agri, 'independant', '33');
    expect(c.org).toMatch(/MSA/);
    expect(c.tel).toBeNull();
    const fin = buildOrganismes(getDepartement('33'), rep(), [], 'agriculture').find((g) => g.cle === 'financier')!;
    expect(fin.cartes.some((x) => x.type === 'URSSAF')).toBe(false);
    expect(fin.cartes.some((x) => /MSA/.test(x.type))).toBe(true);
  });
});

describe('Organismes', () => {
  it('carte CIP : site cip-national.fr, aucun faux téléphone', () => {
    const jur = buildOrganismes(getDepartement('33'), rep(), []).find((g) => g.cle === 'juridique')!;
    const cip = jur.cartes.find((x) => /CIP/.test(x.nom))!;
    expect(cip.site).toBe('https://www.cip-national.fr');
    expect(cip.telephone).toBeUndefined();
    expect(JSON.stringify(jur)).not.toMatch(/ciprofessionnels/);
  });
  it('avocats trouvés à proximité : étiquette neutre', () => {
    const jur = buildOrganismes(getDepartement('33'), rep(), [{ nom: 'Me X', type: 'Avocat · droit des entreprises en difficulté' }]).find((g) => g.cle === 'juridique')!;
    expect(jur.cartes[0].type).toBe('Avocat à proximité');
  });
  it('une seule carte par caisse de retraite (CARCDSF, CAVOM)', () => {
    for (const naf of ['86.23Z', '71.12A', '69.10Z']) {
      const g = buildOrdresProfessionnels(getSectorInfo(co({ naf })));
      if (!g) continue;
      const noms = g.cartes.map((x) => x.nom);
      expect(new Set(noms).size).toBe(noms.length);
    }
  });
  it('noms des Urssaf : ceux de l’annuaire officiel (les Urssaf n’ont pas suivi les régions de 2016)', () => {
    // api-lannuaire.service-public.fr (2026) : « Urssaf Rhône-Alpes - site de l'Ain »…
    const attendus: Record<string, RegExp> = {
      '01': /^Urssaf Rhône-Alpes/,
      '31': /^Urssaf Midi-Pyrénées/,
      '67': /^Urssaf Alsace/,
      '59': /^Urssaf Nord-Pas-de-Calais/,
      '17': /^Urssaf Poitou-Charentes/,
      '15': /^Urssaf Auvergne/,
    };
    for (const [code, re] of Object.entries(attendus)) {
      expect(getDepartement(code)!.urssaf.nom).toMatch(re);
    }
  });
  it('interlocuteur adapté : pas de CCI pour un libéral ou une association, pas d\'abréviation « CA »', () => {
    const lib = co({ naf: '71.11Z', formeJuridique: EI });
    expect(libelleChambre(getSectorInfo(lib), lib)).toMatch(/CIP/);
    const asso = co({ naf: '94.99Z', formeJuridique: 'Association déclarée' });
    expect(libelleChambre(getSectorInfo(asso), asso)).toMatch(/DLA/);
    const agri = co({ naf: '01.11Z', formeJuridique: EI });
    expect(libelleChambre(getSectorInfo(agri), agri)).toBe("la Chambre d'agriculture (33)");
  });
});

describe('Cartes prioritaires', () => {
  it('toujours 4 cartes, même pour un profil minimal', () => {
    const c = co();
    const cartes = scorePriorityCards({ reponses: rep({ probleme: 'fournisseurs' }), company: c, sector: getSectorInfo(c), seuils: { approx: 0, cse: false, obligations50: false } });
    expect(cartes).toHaveLength(4);
  });
  it('co-gérance : pas de référence non confirmée à L243-6-2 CSS', () => {
    const c = co();
    const cartes = scorePriorityCards({ reponses: rep({ coGerants: 'oui' }), company: c, sector: getSectorInfo(c), seuils: { approx: 0, cse: false, obligations50: false } });
    expect(JSON.stringify(cartes)).not.toMatch(/L243-6-2/);
  });
});

describe('Courriers', () => {
  it('la phrase personnelle précède la formule de politesse (échelonnement URSSAF)', () => {
    for (const t of COURRIERS) {
      for (const moral of MORAUX) {
        const p = personalizeCourrier(t, { moral, situation: 'tresorie', effectif: 'salaries' });
        if (!p.closing) continue;
        const iFormule = p.corps.search(/je vous prie d.agr|veuillez agr|cordialement|bien à vous/i);
        if (iFormule >= 0) expect(p.corps.indexOf(p.closing), t.slug).toBeLessThan(iFormule);
      }
    }
  });
  it('formulations inclusives', () => {
    const t = getCourrier('echelonnement-urssaf') ?? COURRIERS[0];
    expect(personalizeCourrier(t, { moral: 'combatif' }).corps).toMatch(/mobilisé·e/);
    expect(personalizeCourrier(t, { moral: 'perdu' }).corps).toMatch(/accompagné·e/);
  });
  it('conseil URSSAF : 36 98 pour un·e indépendant·e', () => {
    const t = COURRIERS.find((x) => x.categorie === 'urssaf')!;
    expect(personalizeCourrier(t, { situation: 'assignation', effectif: 'independant' }).conseil).toMatch(/3698/);
    expect(personalizeCourrier(t, { situation: 'assignation', effectif: 'salaries' }).conseil).toMatch(/3957/);
  });
  it('courriers au tribunal : pas de « Tribunal de Commerce » imposé', () => {
    for (const slug of ['cessation-paiements', 'mandat-ad-hoc', 'conciliation']) {
      const t = getCourrier(slug)!;
      expect(t.corps).not.toMatch(/Tribunal de Commerce/);
      expect(t.corps).toMatch(/\{\{TRIBUNAL\}\}/);
    }
  });
});

describe('BODACC', () => {
  it('pas de parenthèses vides quand la date manque', () => {
    for (const situation of SITUATIONS) {
      const a = computeAlertes([{ type: 'Annonce', date: '' }], [{ type: 'Procédures collectives', date: '' }], situation, { bodaccDisponible: true });
      expect(a.map((x) => x.message).join(' ')).not.toMatch(/\(\s*\)/);
    }
  });
  it('dates au format « 7 mai 2026 »', () => {
    expect(dateFr('2026-05-07')).toBe('7 mai 2026');
    expect(dateFr('2026-05-01')).toBe('1er mai 2026');
    expect(dateFr('')).toBe('');
    expect(dateFr('pas-une-date')).toBe('');
  });
});

describe('Liens', () => {
  it('plus aucun lien mort connu dans les données', () => {
    const json = JSON.stringify(getDepartement('75')) + JSON.stringify(getDepartement('974'));
    expect(json).not.toMatch(/tribunal-de-commerce\.fr|mdph\.fr|urps-ml\.org/);
  });
});

describe('Textes des pages : références URSSAF', () => {
  // Lecture des sources (pages statiques, questionnaire, blocs de la fiche).
  const racine = path.resolve(__dirname, '../..');
  const fichiers = (dossier: string): string[] =>
    readdirSync(path.join(racine, dossier), { recursive: true, encoding: 'utf8' })
      .filter((f) => /\.tsx?$/.test(f) && !f.includes('__tests__'))
      .map((f) => path.join(racine, dossier, f));
  const sources = [...fichiers('app'), ...fichiers('components')].map((f) => ({ f, texte: readFileSync(f, 'utf8') }));

  it('plus de « L243-6-2 CSS » (article sans rapport avec la responsabilité du dirigeant)', () => {
    expect(sources.filter((s) => /L\.?\s?243-6-2/.test(s.texte)).map((s) => s.f)).toEqual([]);
  });

  it('jamais « 3957 » seul : 36 98 pour les indépendant·e·s, 39 57 pour les employeurs', () => {
    expect(sources.filter((s) => /\b3957\b/.test(s.texte)).map((s) => s.f)).toEqual([]);
  });
});
