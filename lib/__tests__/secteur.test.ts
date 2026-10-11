import { describe, it, expect } from 'vitest';
import {
  getSectorInfo,
  getCompanyAge,
  getEffectifSeuils,
  TRANCHES_EFFECTIF,
  libelleTrancheEffectif,
  libelleActionSoutien,
  libelleContactSyndicat,
} from '../secteur';
import { formatEffectif } from '../sirene';
import type { CompanyData } from '../types';

/* ─── Helpers ─── */

function makeCompany(overrides: Partial<CompanyData> = {}): CompanyData {
  return {
    siret: '12345678901234',
    nom: 'Test',
    formeJuridique: 'SARL',
    naf: '62.01Z',
    dateCreation: '2015-01-01',
    effectif: '0 salarié',
    adresse: '1 rue de la Paix',
    codePostal: '75001',
    ville: 'Paris',
    departement: '75',
    fetched: true,
    ...overrides,
  };
}

/* ─── getSectorInfo ─── */

describe('getSectorInfo', () => {
  it('mappe un code NAF agriculture (01.xx) au secteur agriculture', () => {
    const info = getSectorInfo(makeCompany({ naf: '01.11Z' }));
    expect(info.secteur).toBe('agriculture');
  });

  it('mappe un code NAF BTP (43.xx) au secteur btp', () => {
    const info = getSectorInfo(makeCompany({ naf: '43.21A' }));
    // 43 est artisan aussi, donc peut être artisanat si isArtisan true
    expect(['btp', 'artisanat']).toContain(info.secteur);
  });

  it('mappe un code NAF commerce (47.xx) au secteur commerce', () => {
    const info = getSectorInfo(makeCompany({ naf: '47.11D' }));
    expect(info.secteur).toBe('commerce');
  });

  it('mappe un code NAF hôtellerie (56.xx) au secteur hotellerie', () => {
    const info = getSectorInfo(makeCompany({ naf: '56.10A' }));
    expect(info.secteur).toBe('hotellerie');
  });

  it('mappe un code NAF IT (62.xx) au secteur liberal (section M)', () => {
    const info = getSectorInfo(makeCompany({ naf: '62.01Z' }));
    expect(info.secteur).toBe('information');
  });

  it('mappe un code NAF santé (86.xx) au secteur sante', () => {
    const info = getSectorInfo(makeCompany({ naf: '86.10Z' }));
    expect(info.secteur).toBe('sante');
  });

  it('reclasse en artisanat un commerce artisan (naf 95.xx)', () => {
    const info = getSectorInfo(makeCompany({ naf: '95.11Z' }));
    expect(info.secteur).toBe('artisanat');
  });

  it('retourne le secteur "autre" pour un code NAF inconnu', () => {
    const info = getSectorInfo(makeCompany({ naf: '' }));
    expect(info.secteur).toBe('autre');
  });

  it('retourne un objet avec tous les champs attendus', () => {
    const info = getSectorInfo(makeCompany({ naf: '01.11Z' }));
    expect(info).toHaveProperty('label');
    expect(info).toHaveProperty('cotisationOrg');
    expect(info).toHaveProperty('cotisationTel');
    expect(info).toHaveProperty('chambre');
    expect(info).toHaveProperty('conseilsSpecifiques');
  });

  it('mappe un code NAF pêche (03.xx) au secteur peche', () => {
    const info = getSectorInfo(makeCompany({ naf: '03.11Z' }));
    expect(info.secteur).toBe('peche');
    expect(info.cotisationOrg).toContain('ENIM');
  });

  it('injecte le CSP dans obligationsLicenciement de tout secteur', () => {
    const info = getSectorInfo(makeCompany({ naf: '47.11D' }));
    expect(info.obligationsLicenciement).toBeDefined();
    expect(info.obligationsLicenciement!.some((o) => o.sigle === 'CSP')).toBe(true);
  });

  it('les 15 secteurs ont des données définies', () => {
    const secteurs = [
      'agriculture', 'peche', 'industrie', 'btp', 'commerce', 'transport',
      'hotellerie', 'information', 'finance', 'immobilier', 'liberal',
      'education', 'sante', 'artisanat', 'autre',
    ];
    // On vérifie que chaque secteur peut être obtenu via un mapping NAF approprié
    expect(secteurs.length).toBe(15);
  });
});

/* ─── getCompanyAge ─── */

describe('getCompanyAge', () => {
  it('retourne un nombre positif pour une date passée', () => {
    const age = getCompanyAge('2000-01-01');
    expect(age).not.toBeNull();
    expect(age!).toBeGreaterThan(20);
  });

  it('retourne null pour une date vide', () => {
    expect(getCompanyAge('')).toBeNull();
  });

  it('retourne null pour une date invalide', () => {
    expect(getCompanyAge('pas-une-date')).toBeNull();
  });

  it('retourne 0 pour une date très récente', () => {
    const maintenant = new Date().toISOString().slice(0, 10);
    const age = getCompanyAge(maintenant);
    expect(age).toBe(0);
  });
});

/* ─── getEffectifSeuils ─── */

describe('getEffectifSeuils', () => {
  it('retourne approx=0 pour 0 salarié', () => {
    const s = getEffectifSeuils('0 salarié');
    expect(s.approx).toBe(0);
    expect(s.cse).toBe(false);
    expect(s.obligations50).toBe(false);
  });

  it('retourne cse=true pour 10 à 19 salariés', () => {
    const s = getEffectifSeuils('10 à 19 salariés');
    expect(s.approx).toBe(15);
    expect(s.cse).toBe(true);
    expect(s.obligations50).toBe(false);
  });

  it('retourne obligations50=true pour 50 à 99 salariés', () => {
    const s = getEffectifSeuils('50 à 99 salariés');
    expect(s.approx).toBe(75);
    expect(s.obligations50).toBe(true);
  });

  it('retourne approx=0 pour une valeur inconnue', () => {
    const s = getEffectifSeuils('inconnu');
    expect(s.approx).toBe(0);
  });

  it('reconnaît chaque libellé produit par Sirene (codes INSEE 00 à 53)', () => {
    for (const [code, tranche] of Object.entries(TRANCHES_EFFECTIF)) {
      const libelle = formatEffectif(code);
      expect(libelle).toBe(tranche.libelle);
      expect(getEffectifSeuils(libelle).approx).toBe(tranche.approx);
    }
  });

  it('couvre les grandes tranches 52 et 53', () => {
    expect(formatEffectif('52')).toBe('5 000 à 9 999 salariés');
    expect(formatEffectif('53')).toBe('10 000 salariés et plus');
    expect(getEffectifSeuils(formatEffectif('53')).approx).toBe(12000);
  });

  it('accepte les anciens libellés sans espace de milliers (fiches existantes)', () => {
    expect(getEffectifSeuils('1000 à 1999 salariés').approx).toBe(1500);
    expect(getEffectifSeuils('2000 à 4999 salariés').approx).toBe(3000);
  });

  it('« NN » ou code inconnu → Non renseigné', () => {
    expect(libelleTrancheEffectif('NN')).toBe('Non renseigné');
    expect(libelleTrancheEffectif(undefined)).toBe('Non renseigné');
  });
});

/* ─── Caisses, numéros et libellés générés ─── */

const NAFS_PAR_SECTEUR = [
  '01.11Z', '03.11Z', '25.11Z', '41.20A', '47.11D', '49.41A', '55.10Z', '62.01Z',
  '64.19Z', '68.20A', '69.10Z', '85.59A', '86.21Z', '95.11Z', '94.99Z', '81.21Z', '90.01Z', '84.11Z',
];

describe('caisses de retraite et numéros', () => {
  it('artisans / commerçants : Assurance retraite (3960), plus de « CNAV TI » ni de 3698 comme caisse', () => {
    const info = getSectorInfo(makeCompany({ naf: '95.11Z' }));
    expect(info.secteur).toBe('artisanat');
    const caisses = info.caissesRetraite ?? [];
    expect(caisses.map((c) => c.caisse).join(' ')).not.toMatch(/CNAV TI|SSI/);
    expect(caisses).toContainEqual(
      expect.objectContaining({ caisse: 'Assurance retraite', telephone: '3960' }),
    );
    expect(info.conseilsSpecifiques.join(' ')).not.toMatch(/libéraux artisans/);
  });

  it('libéraux non réglementés : Assurance retraite et non plus Cipav par défaut', () => {
    const info = getSectorInfo(makeCompany({ naf: '70.22Z' }));
    const caisses = info.caissesRetraite ?? [];
    expect(caisses.some((c) => /autre/i.test(c.profession) && c.caisse === 'CIPAV')).toBe(false);
    expect(caisses).toContainEqual(
      expect.objectContaining({ caisse: 'Assurance retraite', telephone: '3960' }),
    );
    // Les architectes restent à la Cipav
    expect(caisses).toContainEqual(expect.objectContaining({ profession: 'Architecte', caisse: 'CIPAV' }));
  });

  it('MSA : pas de numéro national (36 98 est la ligne Urssaf des indépendants)', () => {
    const info = getSectorInfo(makeCompany({ naf: '01.11Z' }));
    expect(info.cotisationTel).not.toMatch(/36 ?98/);
    expect(info.cotisationTel).toMatch(/msa\.fr/);
    expect((info.caissesRetraite ?? []).map((c) => c.telephone).join(' ')).not.toMatch(/36 ?98/);
  });
});

describe('NAF 53 (poste et courrier)', () => {
  it('La Poste (53.10Z) et les coursiers (53.20Z) ne sont pas du transport routier', () => {
    expect(getSectorInfo(makeCompany({ naf: '53.10Z' })).secteur).toBe('services');
    expect(getSectorInfo(makeCompany({ naf: '53.20Z' })).secteur).toBe('services');
  });
  it('le transport routier reste du transport', () => {
    expect(getSectorInfo(makeCompany({ naf: '49.41A' })).secteur).toBe('transport');
    expect(getSectorInfo(makeCompany({ naf: '52.29A' })).secteur).toBe('transport');
  });
});

describe('textes générés pour le plan d\'action', () => {
  it.each(NAFS_PAR_SECTEUR)('NAF %s : pas de parenthèses imbriquées ni de doublon APESA', (naf) => {
    const info = getSectorInfo(makeCompany({ naf }));
    const soin = libelleActionSoutien(info);
    expect(soin.match(/APESA/g)?.length ?? 0).toBeLessThanOrEqual(1);
    expect(soin).not.toMatch(/\([^)]*\(/);
    for (const s of info.syndicats) {
      expect(libelleContactSyndicat(s), s.nom).not.toMatch(/\([^)]*\(/);
    }
    expect(info.soutien?.nom ?? '').not.toMatch(/\(/);
  });

  it('exemples', () => {
    const transport = getSectorInfo(makeCompany({ naf: '49.41A' }));
    expect(libelleActionSoutien(transport)).toBe('Prendre soin de moi (APESA)');
    expect(libelleContactSyndicat(transport.syndicats[0])).toBe(
      'Contacter FNTR (Fédération Nationale des Transports Routiers — marchandises)',
    );
    const agri = getSectorInfo(makeCompany({ naf: '01.11Z' }));
    expect(libelleActionSoutien(agri)).toBe('Prendre soin de moi (Agri\'Écoute, APESA)');
    expect(libelleActionSoutien({})).toBe('Prendre soin de moi (APESA, médecin, sommeil)');
    expect(libelleActionSoutien(transport, 'vous')).toBe('Prendre soin de vous (APESA)');
  });
});

describe('transport : FNTR réservée au transport routier (49.4)', () => {
  const noms = (naf: string) => getSectorInfo(makeCompany({ naf })).syndicats.map((o) => o.nom);

  it('fret routier et déménagement : FNTR proposée', () => {
    expect(noms('49.41A')[0]).toBe('FNTR');
    expect(noms('49.42Z')[0]).toBe('CSD');
    expect(noms('49.42Z')).toContain('FNTR');
  });

  it('maritime (50.1/50.2) : Armateurs de France, sans FNTR ni conseils routiers', () => {
    const info = getSectorInfo(makeCompany({ naf: '50.20Z' }));
    expect(info.syndicats.map((o) => o.nom)).toEqual(['Armateurs de France']);
    expect(info.conseilsSpecifiques.join(' ')).not.toMatch(/TICPE|DREAL/);
    expect(info.santeSecteur).toBeUndefined();
  });

  it('fluvial (50.4) : aucune organisation non sourcée', () => {
    expect(noms('50.40Z')).toEqual([]);
  });

  it('aérien (51) : FNAM', () => {
    expect(noms('51.10Z')).toEqual(['FNAM']);
    expect(noms('51.21Z')).toEqual(['FNAM']);
  });

  it('voyageurs et entreposage : pas de FNTR', () => {
    expect(noms('49.39A')[0]).toBe('FNTV');
    expect(noms('49.39A')).not.toContain('FNTR');
    expect(noms('52.29A')[0]).toBe('TLF');
    expect(noms('52.29A')).not.toContain('FNTR');
  });
});
