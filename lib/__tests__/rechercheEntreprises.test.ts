import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  reduireResultatRecherche,
  etablissementExact,
  rechercherEntrepriseNavigateur,
  DELAIS_REESSAI_NAVIGATEUR,
} from '../rechercheEntreprises';
import { entrepriseRechercheSchema, fichePayloadSchema } from '../schemas';

const SIEGE = '34963839500021';
const SECONDAIRE = '34963839500039';

/** Forme d'un résultat réel de l'API (champs inutiles compris). */
function brut(extra: Record<string, unknown> = {}) {
  return {
    siren: '349638395',
    nom_complet: 'ACME (ACME)',
    nom_raison_sociale: 'ACME',
    nature_juridique: '5710',
    activite_principale: '43.32A',
    section_activite_principale: 'F',
    date_creation: '2015-03-12',
    tranche_effectif_salarie: '11',
    dirigeants: [{ nom: 'DUPONT', prenoms: 'JEAN', date_de_naissance: '1970-01' }],
    finances: { 2024: { ca: 1000 } },
    siege: {
      siret: SIEGE,
      code_postal: '22100',
      commune: '22050',
      departement: '22',
      libelle_commune: 'DINAN',
      adresse: '1 RUE DU PORT 22100 DINAN',
      latitude: '48.45',
      liste_idcc: ['1597'],
    },
    matching_etablissements: [
      { siret: SECONDAIRE, code_postal: '35000', commune: '35238', libelle_commune: 'RENNES', adresse: '2 RUE X 35000 RENNES', nom_commercial: 'X' },
      { siret: '34963839500047', code_postal: '29200', libelle_commune: 'BREST' },
    ],
    ...extra,
  };
}

describe('reduireResultatRecherche', () => {
  it('ne garde que les champs utiles (ni dirigeant·e·s, ni finances, ni GPS)', () => {
    const r = reduireResultatRecherche(brut(), SIEGE)!;
    expect(r).not.toHaveProperty('dirigeants');
    expect(r).not.toHaveProperty('finances');
    expect(r).not.toHaveProperty('siren');
    expect(r.siege).not.toHaveProperty('latitude');
    expect(r.siege).not.toHaveProperty('liste_idcc');
    expect(r.nom_raison_sociale).toBe('ACME');
    // Siège consulté : aucun établissement secondaire transmis.
    expect(r.matching_etablissements).toBeUndefined();
    expect(entrepriseRechercheSchema.safeParse(r).success).toBe(true);
  });

  it('établissement secondaire : seul celui du SIRET saisi est gardé', () => {
    const r = reduireResultatRecherche(brut(), SECONDAIRE)!;
    expect(r.matching_etablissements).toHaveLength(1);
    expect(r.matching_etablissements?.[0]).toEqual({
      siret: SECONDAIRE,
      code_postal: '35000',
      commune: '35238',
      libelle_commune: 'RENNES',
      adresse: '2 RUE X 35000 RENNES',
    });
    expect(entrepriseRechercheSchema.safeParse(r).success).toBe(true);
  });

  it('aucun établissement au SIRET saisi : null', () => {
    expect(reduireResultatRecherche(brut(), '11111111111111')).toBeNull();
    expect(reduireResultatRecherche(undefined, SIEGE)).toBeNull();
    expect(reduireResultatRecherche('texte', SIEGE)).toBeNull();
  });

  it('retire les balises et caractères de contrôle, borne les longueurs, écarte les codes mal formés', () => {
    const r = reduireResultatRecherche(
      brut({ nom_complet: '<b>ACME</b>\u0007' + 'x'.repeat(400), nature_juridique: '57-10', date_creation: 'hier' }),
      SIEGE,
    )!;
    expect(r.nom_complet).not.toMatch(/[<>\u0007]/);
    expect(r.nom_complet!.length).toBeLessThanOrEqual(250);
    expect(r.nature_juridique).toBeUndefined();
    expect(r.date_creation).toBeUndefined();
    expect(entrepriseRechercheSchema.safeParse(r).success).toBe(true);
  });

  it('valeurs null de l’API : omises', () => {
    const r = reduireResultatRecherche(brut({ nom_raison_sociale: null, prenom_usuel: null }), SIEGE)!;
    expect(r).not.toHaveProperty('nom_raison_sociale');
    expect(r).not.toHaveProperty('prenom_usuel');
  });
});

describe('etablissementExact', () => {
  it('établissement secondaire, siège, ou rien', () => {
    const r = reduireResultatRecherche(brut(), SECONDAIRE)!;
    expect(etablissementExact(r, SECONDAIRE)?.libelle_commune).toBe('RENNES');
    expect(etablissementExact(r, SIEGE)?.libelle_commune).toBe('DINAN');
    expect(etablissementExact(r, '34963839500047')).toBeUndefined();
  });
});

describe('entrepriseRechercheSchema (strict, borné)', () => {
  const ok = { nom_complet: 'ACME', siege: { siret: SIEGE, code_postal: '22100' } };

  it('accepte un résultat réduit', () => {
    expect(entrepriseRechercheSchema.safeParse(ok).success).toBe(true);
  });

  it('refuse tout champ en plus (dirigeants…), y compris dans un établissement', () => {
    expect(entrepriseRechercheSchema.safeParse({ ...ok, dirigeants: [] }).success).toBe(false);
    expect(entrepriseRechercheSchema.safeParse({ ...ok, siege: { ...ok.siege, latitude: '1' } }).success).toBe(false);
  });

  it('refuse le HTML, les textes trop longs et les codes mal formés', () => {
    expect(entrepriseRechercheSchema.safeParse({ ...ok, nom_complet: '<script>x</script>' }).success).toBe(false);
    expect(entrepriseRechercheSchema.safeParse({ ...ok, nom_complet: 'x'.repeat(251) }).success).toBe(false);
    expect(entrepriseRechercheSchema.safeParse({ ...ok, siege: { siret: '123' } }).success).toBe(false);
    expect(entrepriseRechercheSchema.safeParse({ ...ok, siege: { ...ok.siege, code_postal: '2210' } }).success).toBe(false);
    expect(
      entrepriseRechercheSchema.safeParse({
        ...ok,
        matching_etablissements: [ok.siege, ok.siege, ok.siege],
      }).success,
    ).toBe(false);
  });

  it('POST /api/fiche : entreprise facultative, ignorée si mal formée, autres champs toujours refusés', () => {
    const reponses = { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' };
    const sans = fichePayloadSchema.safeParse({ siret: SIEGE, reponses });
    expect(sans.success && sans.data.entreprise).toBeUndefined();
    const avec = fichePayloadSchema.safeParse({ siret: SIEGE, reponses, entreprise: ok });
    expect(avec.success && avec.data.entreprise?.nom_complet).toBe('ACME');
    const malFormee = fichePayloadSchema.safeParse({ siret: SIEGE, reponses, entreprise: { ...ok, dirigeants: [] } });
    expect(malFormee.success).toBe(true);
    expect(malFormee.success && malFormee.data.entreprise).toBeUndefined();
    expect(fichePayloadSchema.safeParse({ siret: SIEGE, reponses, autre: 1 }).success).toBe(false);
  });
});

describe('rechercherEntrepriseNavigateur', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const json = (corps: unknown, status = 200) =>
    new Response(JSON.stringify(corps), { status, headers: { 'Content-Type': 'application/json' } });

  it('appelle l’API publique sans cookie ni Referer et renvoie le résultat réduit', async () => {
    const f = vi.fn().mockResolvedValue(json({ results: [brut()] }));
    vi.stubGlobal('fetch', f);
    const r = await rechercherEntrepriseNavigateur(SIEGE);
    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe(`https://recherche-entreprises.api.gouv.fr/search?q=${SIEGE}&page=1&per_page=1`);
    expect(init.credentials).toBe('omit');
    expect(init.referrerPolicy).toBe('no-referrer');
    expect(r?.siege?.siret).toBe(SIEGE);
    expect(r).not.toHaveProperty('dirigeants');
  });

  it('429 puis succès : réessai après une courte pause', async () => {
    vi.useFakeTimers();
    const f = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 429 }))
      .mockResolvedValueOnce(json({ results: [brut()] }));
    vi.stubGlobal('fetch', f);
    const p = rechercherEntrepriseNavigateur(SIEGE);
    await vi.runAllTimersAsync();
    expect((await p)?.nom_raison_sociale).toBe('ACME');
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('toujours 429 : 2 réessais seulement, puis null', async () => {
    vi.useFakeTimers();
    const f = vi.fn().mockImplementation(async () => new Response('', { status: 429 }));
    vi.stubGlobal('fetch', f);
    const p = rechercherEntrepriseNavigateur(SIEGE);
    await vi.runAllTimersAsync();
    expect(await p).toBeNull();
    expect(f).toHaveBeenCalledTimes(1 + DELAIS_REESSAI_NAVIGATEUR.length);
    expect(DELAIS_REESSAI_NAVIGATEUR).toHaveLength(2);
  });

  it('erreur réseau, réponse vide ou SIRET invalide : null, sans exception', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('réseau')));
    expect(await rechercherEntrepriseNavigateur(SIEGE)).toBeNull();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ results: [] })));
    expect(await rechercherEntrepriseNavigateur(SIEGE)).toBeNull();
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await rechercherEntrepriseNavigateur('123')).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
});
