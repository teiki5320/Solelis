// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import Questionnaire from '../Questionnaire';

// Mocks Next + fetch + redirection
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

const originalLocation = window.location;
beforeEach(() => {
  vi.useFakeTimers();
  // @ts-ignore
  delete (window as any).location;
  (window as any).location = { href: '' };
  vi.stubGlobal('fetch', vi.fn(async () => ({
    json: async () => ({ token: 'tok123', persisted: true }),
  })));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  (window as any).location = originalLocation;
  cleanup();
  localStorage.clear();
});

describe('Questionnaire — anti double-clic', () => {
  it('le double-clic rapide sur un choix ne saute pas l\'étape suivante', async () => {
    render(<Questionnaire siret="12345678901234" />);
    // On est à l'étape 1 (situation)
    expect(screen.getAllByText(/Étape 1 sur 18/).length).toBeGreaterThan(0);

    // Le premier choix : "Je sens que ça se dégrade"
    const choix = screen.getAllByRole('button').filter((b) => /Je sens que ça se dégrade/i.test(b.getAttribute('aria-label') ?? ''));
    expect(choix.length).toBeGreaterThan(0);

    // Double-clic rapide (avant l'expiration du setTimeout)
    fireEvent.click(choix[0]);
    fireEvent.click(choix[0]); // 2e clic dans la fenêtre de 280 ms

    // Avance le temps après les 280 ms du setTimeout
    act(() => { vi.advanceTimersByTime(300); });

    // On doit être à l'étape 2 (et pas étape 3 — pas de saut)
    expect(screen.getAllByText(/Étape 2 sur 18/).length).toBeGreaterThan(0);
  });

  it('les boutons-choix sont désactivés pendant la transition', () => {
    render(<Questionnaire siret="12345678901234" />);
    const choix = screen.getAllByRole('button').filter((b) => /Je sens que ça se dégrade/i.test(b.getAttribute('aria-label') ?? ''));
    fireEvent.click(choix[0]);
    // Immédiatement après le clic, avant les 280 ms, tous les boutons-choix sont disabled
    const tousChoix = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-label'));
    const disabled = tousChoix.filter((b) => (b as HTMLButtonElement).disabled);
    expect(disabled.length).toBeGreaterThan(0);
  });

  it('le clic sur le bouton « Précédent » fonctionne après une transition', () => {
    render(<Questionnaire siret="12345678901234" />);
    const choix = screen.getAllByRole('button').filter((b) => /Je sens que ça se dégrade/i.test(b.getAttribute('aria-label') ?? ''));
    fireEvent.click(choix[0]);
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getAllByText(/Étape 2 sur 18/).length).toBeGreaterThan(0);

    const prev = screen.getByRole('button', { name: /Précédent/i });
    fireEvent.click(prev);
    expect(screen.getAllByText(/Étape 1 sur 18/).length).toBeGreaterThan(0);
  });
});

describe('Questionnaire — ergonomie', () => {
  function choixParLibelle(re: RegExp) {
    return screen.getAllByRole('button').filter((b) => re.test(b.getAttribute('aria-label') ?? ''))[0];
  }

  it('« Précédent » est verrouillé pendant la transition (pas de saut d’étape)', () => {
    render(<Questionnaire siret="12345678901234" />);
    fireEvent.click(choixParLibelle(/Je sens que ça se dégrade/));
    act(() => { vi.advanceTimersByTime(300); });
    // Étape 2 : on choisit, puis on clique « Précédent » pendant la transition
    fireEvent.click(choixParLibelle(/Dettes URSSAF/));
    const prev = screen.getByRole('button', { name: /Précédent/i });
    expect(prev).toBeDisabled();
    fireEvent.click(prev);
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getAllByText(/Étape 3 sur 18/).length).toBeGreaterThan(0);
  });

  it('affiche l’option déjà choisie quand on revient en arrière (aria-pressed)', () => {
    render(<Questionnaire siret="12345678901234" />);
    fireEvent.click(choixParLibelle(/Je ne peux plus faire face/));
    act(() => { vi.advanceTimersByTime(300); });
    fireEvent.click(screen.getByRole('button', { name: /Précédent/i }));
    expect(choixParLibelle(/Je ne peux plus faire face/)).toHaveAttribute('aria-pressed', 'true');
    expect(choixParLibelle(/Je sens que ça se dégrade/)).toHaveAttribute('aria-pressed', 'false');
  });

  it('distingue les deux choix « salariés » qui ont la même valeur', () => {
    render(<Questionnaire siret="12345678901234" />);
    fireEvent.click(choixParLibelle(/Je sens que ça se dégrade/));
    act(() => { vi.advanceTimersByTime(300); });
    fireEvent.click(choixParLibelle(/Dettes URSSAF/));
    act(() => { vi.advanceTimersByTime(300); });
    fireEvent.click(choixParLibelle(/Oui, 5 ou plus/));
    act(() => { vi.advanceTimersByTime(300); });
    fireEvent.click(screen.getByRole('button', { name: /Précédent/i }));
    expect(choixParLibelle(/Oui, 5 ou plus/)).toHaveAttribute('aria-pressed', 'true');
    expect(choixParLibelle(/Oui, moins de 5/)).toHaveAttribute('aria-pressed', 'false');
  });

  it('les boutons de navigation font au moins 44 px de haut et le survol est réservé aux appareils qui le permettent', () => {
    render(<Questionnaire siret="12345678901234" />);
    const prev = screen.getByRole('button', { name: /Précédent/i });
    expect(prev.className).toContain('min-h-[44px]');
    const choix = choixParLibelle(/Je sens que ça se dégrade/);
    expect(choix.className).not.toMatch(/(^|\s)hover:/);
    expect(choix.className).toContain('[@media(hover:hover)]:hover:');
  });
});

describe('Questionnaire — enregistrement impossible', () => {
  it('ne met pas les réponses dans l’URL : sessionStorage puis /fiche/local', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ json: async () => ({ token: 'tok', persisted: false }) })));
    render(<Questionnaire siret="12345678901234" />);
    for (let i = 0; i < 18; i++) {
      const choix = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-label'));
      fireEvent.click(choix[0]);
      await act(async () => { vi.advanceTimersByTime(300); });
    }
    await act(async () => { await Promise.resolve(); });
    expect(window.location.href).toBe('/fiche/local');
    const stocke = JSON.parse(sessionStorage.getItem('solelis_fiche_locale') ?? 'null');
    expect(stocke.siret).toBe('12345678901234');
    expect(stocke.reponses.situation).toBe('prevention');
  });
});

describe('Questionnaire — recherche de l’entreprise depuis le navigateur', () => {
  const SIRET = '34963839500021';
  function fetchSimule(persisted: boolean) {
    return vi.fn(async (url: string, _init?: RequestInit) => {
      if (String(url).startsWith('https://recherche-entreprises.api.gouv.fr/')) {
        return new Response(
          JSON.stringify({
            results: [
              {
                nom_complet: 'ACME',
                nature_juridique: '5710',
                dirigeants: [{ nom: 'DUPONT' }],
                siege: { siret: SIRET, code_postal: '75009', commune: '75109', libelle_commune: 'PARIS', latitude: '48.8' },
              },
            ],
          }),
          { status: 200 },
        );
      }
      return { json: async () => ({ token: 'tok123', persisted }) } as unknown as Response;
    });
  }

  async function repondreATout() {
    for (let i = 0; i < 18; i++) {
      const choix = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-label'));
      fireEvent.click(choix[0]);
      await act(async () => { vi.advanceTimersByTime(300); });
    }
    await act(async () => { await Promise.resolve(); });
  }

  it('cherche dès l’arrivée, une seule fois, puis joint le résultat réduit à la création de la fiche', async () => {
    const f = fetchSimule(true);
    vi.stubGlobal('fetch', f);
    render(<Questionnaire siret={SIRET} />);
    const appelsApi = () => f.mock.calls.filter(([u]) => String(u).includes('recherche-entreprises'));
    expect(appelsApi()).toHaveLength(1);
    await repondreATout();
    expect(appelsApi()).toHaveLength(1);
    const envoi = f.mock.calls.find(([u]) => u === '/api/fiche');
    const corps = JSON.parse(String(envoi?.[1]?.body));
    expect(corps.siret).toBe(SIRET);
    expect(corps.entreprise.siege).toEqual({ siret: SIRET, code_postal: '75009', commune: '75109', libelle_commune: 'PARIS' });
    expect(corps.entreprise).not.toHaveProperty('dirigeants');
    expect(window.location.href).toBe('/fiche/tok123');
  });

  it('fiche locale : le résultat est aussi gardé dans l’onglet', async () => {
    vi.stubGlobal('fetch', fetchSimule(false));
    render(<Questionnaire siret={SIRET} />);
    await repondreATout();
    expect(window.location.href).toBe('/fiche/local');
    const stocke = JSON.parse(sessionStorage.getItem('solelis_fiche_locale') ?? 'null');
    expect(stocke.entreprise.nom_complet).toBe('ACME');
  });
});
