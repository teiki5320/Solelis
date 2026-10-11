import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  formatForme,
  fetchSirene,
  departementDepuisCommune,
  departementDepuisCodePostal,
  determinerDepartement,
  choisirNom,
  nettoyerNomComplet,
  DELAIS_REESSAI,
} from '../sirene';
import { getDepartement } from '../organismes';
import { getRegionFromDepartement } from '../aidesRegionales';
import { getJuridiction, getFormeDetail } from '../strategie';
import type { CompanyData } from '../types';

function company(formeJuridique: string, naf = '47.11Z'): CompanyData {
  return {
    siret: '12345678900012',
    nom: 'Test',
    formeJuridique,
    naf,
    dateCreation: '2015-01-01',
    effectif: '0 salarié',
    adresse: '',
    codePostal: '75001',
    ville: 'Paris',
    departement: '75',
    fetched: true,
  };
}

/* ─── Catégories juridiques INSEE ─── */

describe('formatForme (catégories juridiques INSEE)', () => {
  it('libelle correctement les codes courants (nomenclature INSEE niveau III)', () => {
    expect(formatForme('1000')).toBe('Entrepreneur individuel');
    expect(formatForme('5499')).toBe('SARL'); // et non SAS
    expect(formatForme('5710')).toBe('SAS / SASU');
    expect(formatForme('5202')).toBe('Société en nom collectif (SNC)');
    expect(formatForme('5307')).toBe('Société en commandite simple coopérative'); // et non SNC
    expect(formatForme('5585')).toContain('SELAFA'); // et non SCP
    expect(formatForme('5485')).toContain('SELARL');
    expect(formatForme('6540')).toBe('Société civile immobilière (SCI)');
    expect(formatForme('6598')).toContain('EARL');
    expect(formatForme('9220')).toBe('Association déclarée');
  });

  it('se replie sur la catégorie de niveau II (2 premiers chiffres)', () => {
    expect(formatForme('5460')).toBe('SARL');
    expect(formatForme('5599')).toBe('Société anonyme (SA)');
    expect(formatForme('5699')).toBe('Société anonyme (SA)');
    expect(formatForme('6599')).toBe('Société civile');
    expect(formatForme('6539')).toBe('Société civile');
    expect(formatForme('9260')).toBe('Association');
    expect(formatForme('9900')).toBe('Autre personne morale de droit privé');
  });

  it('reconnaît les SCP (6561 à 6578)', () => {
    expect(formatForme('6561')).toBe('Société civile professionnelle (SCP)');
    expect(formatForme('6571')).toBe('Société civile professionnelle (SCP)');
  });

  it('gère les codes absents ou inconnus', () => {
    expect(formatForme(undefined)).toBe('Non renseignée');
    expect(formatForme('')).toBe('Non renseignée');
    expect(formatForme('0000')).toBe('Catégorie juridique 0000');
  });

  it('aucune forme sociétaire ou associative n\'est classée comme EI', () => {
    for (const code of ['5202', '5306', '5499', '5485', '5599', '5710', '5785', '5800', '6220', '6540', '6585', '6598', '9220', '9224', '9300']) {
      expect(getFormeDetail(formatForme(code))).toBe('societe');
    }
    expect(getFormeDetail(formatForme('1000'))).toBe('ei');
  });
});

/* ─── Impact sur la juridiction compétente (TC / TJ) ─── */

describe('getJuridiction selon la catégorie juridique INSEE', () => {
  it('sociétés commerciales par la forme → tribunal de commerce, même en NAF libéral', () => {
    for (const code of ['5202', '5306', '5308', '5499', '5599', '5699', '5710', '5800']) {
      expect(getJuridiction(company(formatForme(code), '70.22Z'))).toBe('TC');
    }
  });

  it('5499 (SARL) reste au TC — l\'ancien libellé « SAS » aussi, mais « SA » seul n\'était pas reconnu', () => {
    expect(getJuridiction(company('SA', '70.22Z'))).toBe('TC');
  });

  it('sociétés civiles, agricoles, associations, fondations → tribunal judiciaire', () => {
    for (const code of ['6540', '6585', '6589', '6597', '6598', '6533', '6317', '6316', '6599', '9220', '9260', '9300', '9100']) {
      expect(getJuridiction(company(formatForme(code), '47.11Z'))).toBe('TJ');
    }
  });

  it('SEL (exercice libéral) → tribunal de commerce (choix existant du moteur)', () => {
    for (const code of ['5385', '5485', '5585', '5685', '5785']) {
      expect(getJuridiction(company(formatForme(code), '69.10Z'))).toBe('TC');
    }
  });

  it('entrepreneur individuel → selon le NAF (forme inconnue aussi)', () => {
    expect(getJuridiction(company(formatForme(undefined), '69.10Z'))).toBe('TJ');
    expect(getJuridiction(company(formatForme('1000'), '69.10Z'))).toBe('TJ');
    expect(getJuridiction(company(formatForme('1000'), '01.11Z'))).toBe('TJ');
    expect(getJuridiction(company(formatForme('1000'), '47.11Z'))).toBe('TC');
  });
});

/* ─── Département (Corse, outre-mer) ─── */

describe('département depuis le code commune INSEE', () => {
  it('Corse : 2A / 2B', () => {
    expect(departementDepuisCommune('2A004')).toBe('2A'); // Ajaccio
    expect(departementDepuisCommune('2B033')).toBe('2B'); // Bastia
  });
  it('outre-mer : 3 chiffres', () => {
    expect(departementDepuisCommune('97411')).toBe('974'); // Saint-Denis (La Réunion)
    expect(departementDepuisCommune('97701')).toBe('977'); // Saint-Barthélemy
    expect(departementDepuisCommune('98735')).toBe('987'); // Papeete
  });
  it('métropole : 2 chiffres', () => {
    expect(departementDepuisCommune('75056')).toBe('75');
    expect(departementDepuisCommune('01053')).toBe('01');
  });
  it('code invalide → vide', () => {
    expect(departementDepuisCommune(undefined)).toBe('');
    expect(departementDepuisCommune('123')).toBe('');
  });
});

describe('département depuis le code postal', () => {
  it('Corse-du-Sud (200xx, 201xx) et Haute-Corse (202xx à 206xx)', () => {
    expect(departementDepuisCodePostal('20000')).toBe('2A'); // Ajaccio
    expect(departementDepuisCodePostal('20137')).toBe('2A'); // Porto-Vecchio
    expect(departementDepuisCodePostal('20200')).toBe('2B'); // Bastia
    expect(departementDepuisCodePostal('20260')).toBe('2B'); // Calvi
    expect(departementDepuisCodePostal('20600')).toBe('2B'); // Bastia
  });
  it('outre-mer → 3 chiffres', () => {
    expect(departementDepuisCodePostal('97100')).toBe('971');
    expect(departementDepuisCodePostal('97200')).toBe('972');
    expect(departementDepuisCodePostal('97300')).toBe('973');
    expect(departementDepuisCodePostal('97400')).toBe('974');
    expect(departementDepuisCodePostal('97600')).toBe('976');
    expect(departementDepuisCodePostal('98800')).toBe('988');
  });
  it('métropole → 2 chiffres', () => {
    expect(departementDepuisCodePostal('69001')).toBe('69');
    expect(departementDepuisCodePostal('01000')).toBe('01');
  });
  it('le code commune prime sur le code postal (Saint-Barthélemy 97133)', () => {
    expect(determinerDepartement('97701', '97133')).toBe('977');
    expect(determinerDepartement(undefined, '97133')).toBe('971');
  });
  it('les clés produites existent dans data/organismes.json et lib/aidesRegionales.ts', () => {
    for (const cp of ['20000', '20200', '97100', '97200', '97300', '97400', '97600', '75001']) {
      const dep = departementDepuisCodePostal(cp);
      expect(getDepartement(dep), dep).not.toBeNull();
      expect(getRegionFromDepartement(dep), dep).not.toBeNull();
    }
  });
});

describe('choisirNom', () => {
  it('ignore les chaînes vides ou blanches', () => {
    expect(choisirNom('', '  ', 'Jean DUPONT')).toBe('Jean DUPONT');
    expect(choisirNom(undefined, null, [].join(' '))).toBe('Votre entreprise');
    expect(choisirNom('  ACME  ')).toBe('ACME');
  });
});

describe('nettoyerNomComplet', () => {
  it('retire la parenthèse qui répète le nom', () => {
    expect(nettoyerNomComplet('AMP ETANCHEITE (AMP ETANCHEITE)')).toBe('AMP ETANCHEITE');
    expect(nettoyerNomComplet('Amp  Etancheite (AMP ETANCHEITE)')).toBe('Amp  Etancheite');
  });

  it('garde un sigle ou un nom commercial différent', () => {
    expect(nettoyerNomComplet('SOCIETE NATIONALE SNCF (SNCF)')).toBe('SOCIETE NATIONALE SNCF (SNCF)');
    expect(nettoyerNomComplet('ACME')).toBe('ACME');
    expect(nettoyerNomComplet(undefined)).toBe('');
  });
});

describe('fetchSirene (API recherche-entreprises simulée)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function reponse(etab: Record<string, unknown>, extra: Record<string, unknown> = {}) {
    return new Response(
      JSON.stringify({
        results: [
          {
            nom_complet: 'AIR CORSICA',
            nature_juridique: '5599',
            activite_principale: '51.10Z',
            tranche_effectif_salarie: '41',
            siege: { siret: '34963839500021', ...etab },
            matching_etablissements: [{ siret: '34963839500021', ...etab }],
            ...extra,
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  it('Corse : département 2A via le code commune (et non « 20 »)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        reponse({ code_postal: '20090', commune: '2A004', libelle_commune: 'AJACCIO', departement: '2A' }),
      ),
    );
    const c = await fetchSirene('34963839500021');
    expect(c.departement).toBe('2A');
    expect(c.formeJuridique).toBe('Société anonyme (SA)');
  });

  it('La Réunion : département 974 (et non « 97 »)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(reponse({ code_postal: '97400', commune: '97411', libelle_commune: 'SAINT-DENIS' })),
    );
    expect((await fetchSirene('34963839500021')).departement).toBe('974');
  });

  it('nom complet doublé « X (X) » → « X »', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        reponse({ code_postal: '85100' }, { nom_complet: 'AMP ETANCHEITE (AMP ETANCHEITE)' }),
      ),
    );
    expect((await fetchSirene('34963839500021')).nom).toBe('AMP ETANCHEITE');
  });

  it('nom vide (diffusion partielle) → « Votre entreprise »', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(reponse({ code_postal: '75001' }, { nom_complet: '', nom_raison_sociale: null })),
    );
    expect((await fetchSirene('34963839500021')).nom).toBe('Votre entreprise');
  });

  it('sans réponse : département vide, jamais les 2 premiers chiffres du SIREN', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('réseau')));
    const c = await fetchSirene('34963839500021');
    expect(c.fetched).toBe(false);
    expect(c.departement).toBe('');
  });

  it('429 (limite d\'appels) puis succès : on réessaie et on trouve l\'entreprise', async () => {
    vi.useFakeTimers();
    const f = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 429 }))
      .mockResolvedValueOnce(new Response('', { status: 429 }))
      .mockResolvedValueOnce(reponse({ code_postal: '75009', commune: '75109', libelle_commune: 'PARIS' }));
    vi.stubGlobal('fetch', f);
    const promesse = fetchSirene('34963839500021');
    await vi.runAllTimersAsync();
    const c = await promesse;
    vi.useRealTimers();
    expect(f).toHaveBeenCalledTimes(3);
    expect(c.fetched).toBe(true);
    expect(c.ville).toBe('PARIS');
  });

  it('toujours 429 : abandon après les essais prévus, puis repli INSEE avec la clé en en-tête', async () => {
    vi.useFakeTimers();
    vi.stubEnv('INSEE_API_KEY', 'cle-de-test');
    const f = vi.fn().mockImplementation((url: string) =>
      Promise.resolve(
        url.includes('api.insee.fr')
          ? new Response(
              JSON.stringify({
                etablissement: {
                  uniteLegale: { denominationUniteLegale: 'ACME' },
                  adresseEtablissement: { codePostalEtablissement: '75009', codeCommuneEtablissement: '75109', libelleCommuneEtablissement: 'PARIS' },
                },
              }),
              { status: 200 },
            )
          : new Response('', { status: 429 }),
      ),
    );
    vi.stubGlobal('fetch', f);
    const promesse = fetchSirene('34963839500021');
    await vi.runAllTimersAsync();
    const c = await promesse;
    vi.useRealTimers();
    vi.unstubAllEnvs();
    const appelsGouv = f.mock.calls.filter(([u]) => String(u).includes('recherche-entreprises'));
    expect(appelsGouv).toHaveLength(1 + DELAIS_REESSAI.length);
    const [urlInsee, initInsee] = f.mock.calls.find(([u]) => String(u).includes('api.insee.fr'))!;
    expect(urlInsee).toBe('https://api.insee.fr/api-sirene/3.11/siret/34963839500021');
    expect(initInsee.headers['X-INSEE-Api-Key-Integration']).toBe('cle-de-test');
    expect(c.nom).toBe('ACME');
    expect(c.departement).toBe('75');
  });
});
