// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import BlocRappels, { dateEnvoiRappel, dateIsoLocale, messageErreurRappel } from '../fiche/BlocRappels';
import { FicheProvider, type FicheContextType } from '@/lib/FicheContext';
import type { CompanyData, Reponses } from '@/lib/types';

const COMPANY: CompanyData = {
  siret: '80186721900025',
  nom: 'ACME',
  formeJuridique: 'SARL',
  naf: '43.99A',
  dateCreation: '2015-01-01',
  effectif: '1 ou 2 salariés',
  adresse: '',
  codePostal: '85100',
  ville: 'LES SABLES',
  departement: '85',
  fetched: true,
};
const REPONSES: Reponses = { situation: 'redressement', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' };

function rendre(token: string) {
  const value = { token, reponses: REPONSES, company: COMPANY } as unknown as FicheContextType;
  render(
    <FicheProvider value={value}>
      <BlocRappels />
    </FicheProvider>,
  );
  // Ouvre l'accordéon puis saisit une date de cessation récente (échéance à venir).
  fireEvent.click(screen.getByRole('button', { name: /Rappels d'échéances/i }));
  const il_y_a_10_jours = new Date();
  il_y_a_10_jours.setDate(il_y_a_10_jours.getDate() - 10);
  fireEvent.change(screen.getByLabelText(/Date de cessation des paiements/i), {
    target: { value: dateIsoLocale(il_y_a_10_jours) },
  });
}

function reponse(status: number, body: unknown = {}) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
});

describe('BlocRappels — rappel par e-mail', () => {
  it('propose le formulaire pour une fiche enregistrée', () => {
    rendre('abcdef0123456789abcdef01');
    expect(screen.getByText('Recevoir un rappel par e-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Échéance à rappeler')).toBeInTheDocument();
    expect(screen.getByLabelText('Quand recevoir le rappel')).toBeInTheDocument();
  });

  it('ne le propose pas pour une fiche locale (non enregistrée)', () => {
    rendre('local');
    expect(screen.queryByText('Recevoir un rappel par e-mail')).not.toBeInTheDocument();
  });

  it('envoie token, échéance, date et libellé ; confirme la programmation', async () => {
    const f = vi.fn(async () => reponse(200, { ok: true }));
    vi.stubGlobal('fetch', f);
    rendre('abcdef0123456789abcdef01');
    fireEvent.click(screen.getByRole('button', { name: 'Programmer' }));
    await waitFor(() => expect(screen.getByText(/Rappel programmé : un e-mail/)).toBeInTheDocument());
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/fiche/rappels');
    const corps = JSON.parse(String(init.body));
    expect(corps.token).toBe('abcdef0123456789abcdef01');
    expect(corps.echeance).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(corps.dateRappel <= corps.echeance).toBe(true);
    expect(corps.libelle.length).toBeLessThanOrEqual(80);
    expect(corps).not.toHaveProperty('email');
  });

  it('409 : explique qu’il faut d’abord enregistrer la fiche par e-mail', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => reponse(409, { error: 'x' })));
    rendre('abcdef0123456789abcdef01');
    fireEvent.click(screen.getByRole('button', { name: 'Programmer' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Enregistrez d’abord votre fiche par e-mail/);
  });

  it('messages clairs pour 400 et 404', () => {
    expect(messageErreurRappel(400)).toMatch(/entre aujourd’hui et dans 2 ans/);
    expect(messageErreurRappel(404)).toMatch(/pas enregistrée/);
  });
});

describe('BlocRappels — texte des sanctions et copie', () => {
  it('cessation tardive : interdiction de gérer (L653-8), banqueroute réservée aux actes frauduleux (L654-2)', () => {
    rendre('local');
    const texte = document.body.textContent ?? '';
    expect(texte).toContain('interdiction de gérer (L653-8)');
    expect(texte).toMatch(/banqueroute \(L654-2\) vise, elle, des actes frauduleux/i);
    expect(texte).not.toMatch(/faillite personnelle/i);
    expect(texte).toContain('faute de gestion (L651-2)');
    expect(texte).not.toMatch(/L653-1|L654-1\b/);
    // Appel : 10 jours à compter de la notification, pas du prononcé (C. com. R661-3).
    expect(texte).toContain('10 jours à compter de la notification');
    expect(texte).not.toMatch(/prononcé/);
  });

  it('« Copier l’ICS » affiche « Copié ! »', async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    rendre('local');
    fireEvent.click(screen.getByRole('button', { name: /Copier l’ICS/ }));
    expect(await screen.findByRole('button', { name: /✓ Copié !/ })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalled();
  });
});

describe('dateEnvoiRappel', () => {
  it('N jours avant l’échéance, jamais avant aujourd’hui', () => {
    const maintenant = new Date(2026, 9, 11);
    expect(dateEnvoiRappel(new Date(2026, 9, 30, 9), 7, maintenant)).toBe('2026-10-23');
    expect(dateEnvoiRappel(new Date(2026, 9, 13, 9), 7, maintenant)).toBe('2026-10-11');
    expect(dateEnvoiRappel(new Date(2026, 9, 13, 9), 0, maintenant)).toBe('2026-10-13');
  });
});
