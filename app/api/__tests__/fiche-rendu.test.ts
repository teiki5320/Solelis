import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isValidElement, type ReactNode } from 'react';
import type { CompanyData } from '@/lib/types';

const TOKEN = 'abcdef0123456789abcdef01';
let company: CompanyData;

vi.mock('@/lib/db', () => ({
  getFicheByToken: async () => ({ token: TOKEN, siret: company.siret, reponses: REPONSES, company_data: company }),
  getFicheByTokenMemo: async () => ({ token: TOKEN, siret: company.siret, reponses: REPONSES, company_data: company }),
}));
vi.mock('@/lib/sirene', () => ({ fetchSirene: vi.fn(async () => company) }));
vi.mock('@/lib/bodacc', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/bodacc')>()),
  fetchBodaccResultat: async () => ({ annonces: [], statut: 'ok' }),
  fetchProceduresResultat: async () => ({ annonces: [], statut: 'ok' }),
}));
vi.mock('@/lib/googlePlaces', () => ({
  searchAvocats: async () => [
    { name: 'Cabinet Dupont', address: '1 rue X, Paris', rating: 4.5, reviews: 10, phone: '01 02 03 04 05', mapsUrl: 'https://maps.google.com/?cid=1' },
  ],
}));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined }) }));

const REPONSES = { situation: 'tresorie', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' };

import FichePage from '@/app/fiche/[token]/page';

/** Parcourt l'arbre JSX renvoyé (sans rendre les composants) et rassemble textes et éléments. */
function parcourir(n: ReactNode, textes: string[], elements: { type: unknown; props: Record<string, unknown> }[]) {
  if (n == null || typeof n === 'boolean') return;
  if (typeof n === 'string' || typeof n === 'number') {
    textes.push(String(n));
    return;
  }
  if (Array.isArray(n)) {
    n.forEach((x) => parcourir(x, textes, elements));
    return;
  }
  if (isValidElement(n)) {
    const props = n.props as Record<string, unknown>;
    elements.push({ type: n.type, props });
    parcourir(props.children as ReactNode, textes, elements);
  }
}

async function rendre() {
  // FichePage renvoie <Suspense><ContenuFiche …/></Suspense> : on exécute le contenu.
  const suspense = (await FichePage({
    params: Promise.resolve({ token: TOKEN }),
    searchParams: Promise.resolve({}),
  })) as { props: { children: { type: (p: unknown) => Promise<ReactNode>; props: unknown } } };
  const contenu = suspense.props.children;
  const arbre = await contenu.type(contenu.props);
  const textes: string[] = [];
  const elements: { type: unknown; props: Record<string, unknown> }[] = [];
  parcourir(arbre, textes, elements);
  return { texte: textes.join(''), elements };
}

const BASE: CompanyData = {
  siret: '80186721900026',
  nom: 'Votre entreprise',
  formeJuridique: 'Non renseignée',
  naf: '',
  dateCreation: '',
  effectif: 'Non renseigné',
  adresse: '',
  codePostal: '',
  ville: '',
  departement: '',
  fetched: false,
};

describe('fiche : entreprise introuvable et avocats', () => {
  beforeEach(() => {
    company = { ...BASE };
  });

  it('entreprise non trouvée : message sobre avec le SIRET au format 3-3-3-5', async () => {
    const { texte } = await rendre();
    expect(texte).toContain("Nous n'avons pas trouvé votre entreprise");
    expect(texte).toContain('801 867 219 00026');
  });

  it('entreprise trouvée : pas de message', async () => {
    company = { ...BASE, siret: '80186721900025', nom: 'AMP ETANCHEITE', departement: '85', ville: 'LES SABLES', fetched: true };
    const { texte } = await rendre();
    expect(texte).not.toContain("Nous n'avons pas trouvé votre entreprise");
  });

  it('avocats Google : étiquette neutre « Avocat à proximité »', async () => {
    company = { ...BASE, fetched: true, departement: '75', ville: 'PARIS' };
    const { elements } = await rendre();
    const json = JSON.stringify(elements.map((e) => e.props.groupes).filter(Boolean));
    expect(json).toContain('Cabinet Dupont');
    expect(json).toContain('Avocat à proximité');
    expect(json).not.toContain('droit des entreprises en difficulté');
  });
});
