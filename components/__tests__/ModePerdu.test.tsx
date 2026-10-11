// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModePerdu, { ID_TITRE_FICHE } from '../fiche/ModePerdu';
import { FicheProvider, type FicheContextType } from '@/lib/FicheContext';
import type { Reponses, CompanyData } from '@/lib/types';

function makeContext(overrides: Partial<Reponses> = {}): FicheContextType {
  const reponses: Reponses = {
    situation: 'redressement',
    probleme: 'banque',
    effectif: 'independant',
    moral: 'perdu',
    ...overrides,
  };
  const company: CompanyData = {
    siret: '12345678901234',
    nom: 'Test',
    formeJuridique: 'SARL',
    naf: '62.01Z',
    dateCreation: '2015-01-01',
    effectif: '0',
    adresse: '1 rue',
    codePostal: '75001',
    ville: 'Paris',
    departement: '75',
    fetched: true,
  };
  return {
    token: 'test-token',
    reponses,
    company,
    sector: {} as never,
    alertes: [],
    bodacc: [],
    infogreffe: [],
    groupes: [],
    companyAge: null,
    seuils: { approx: 0, cse: false, obligations50: false } as never,
  };
}

describe('ModePerdu', () => {
  it('s\'affiche quand moral = perdu', () => {
    const ctx = makeContext({ moral: 'perdu' });
    render(<FicheProvider value={ctx}><ModePerdu /></FicheProvider>);
    expect(screen.getByText(/3 choses/i)).toBeInTheDocument();
  });

  it('ne s\'affiche PAS quand moral != perdu', () => {
    const ctx = makeContext({ moral: 'combatif' });
    const { container } = render(<FicheProvider value={ctx}><ModePerdu /></FicheProvider>);
    expect(container.querySelector('[role="region"]')).toBeNull();
  });

  it('contient un bouton « Voir tout » qui masque le composant', () => {
    const ctx = makeContext({ moral: 'perdu' });
    render(<FicheProvider value={ctx}><ModePerdu /></FicheProvider>);
    const button = screen.getByRole('button', { name: 'Voir tout' });
    fireEvent.click(button);
    expect(screen.queryByText(/3 choses/i)).toBeNull();
  });

  it('« Voir tout » : nom accessible = texte visible, masqué à l\'impression, focus conservé', () => {
    const ctx = makeContext({ moral: 'perdu' });
    render(
      <FicheProvider value={ctx}>
        <h1 id={ID_TITRE_FICHE} tabIndex={-1}>Titre</h1>
        <ModePerdu />
      </FicheProvider>,
    );
    const button = screen.getByRole('button', { name: 'Voir tout' });
    expect(button).toHaveClass('no-print');
    expect(button).not.toHaveAttribute('aria-label');
    fireEvent.click(button);
    expect(document.activeElement?.id).toBe(ID_TITRE_FICHE);
  });

  it('URSSAF : 36 98 pour un·e indépendant·e, CGSS outre-mer — jamais 3957 par défaut', () => {
    const indep = makeContext({ moral: 'perdu', situation: 'prevention', probleme: 'urssaf', effectif: 'independant' });
    const { unmount } = render(<FicheProvider value={indep}><ModePerdu /></FicheProvider>);
    expect(screen.getByText(/3698/)).toBeInTheDocument();
    expect(screen.queryByText(/3957/)).toBeNull();
    unmount();
    const dom = makeContext({ moral: 'perdu', situation: 'prevention', probleme: 'urssaf', effectif: 'salaries' });
    dom.company = { ...dom.company, departement: '974', codePostal: '97400' };
    render(<FicheProvider value={dom}><ModePerdu /></FicheProvider>);
    expect(screen.getByText(/CGSS Réunion/)).toBeInTheDocument();
    expect(screen.queryByText(/3957/)).toBeNull();
  });

  it('priorise l\'avocat en assignation', () => {
    const ctx = makeContext({ moral: 'perdu', situation: 'assignation' });
    render(<FicheProvider value={ctx}><ModePerdu /></FicheProvider>);
    expect(screen.getAllByText(/avocat/i).length).toBeGreaterThan(0);
  });

  it('priorise le CIP en redressement', () => {
    const ctx = makeContext({ moral: 'perdu', situation: 'redressement' });
    render(<FicheProvider value={ctx}><ModePerdu /></FicheProvider>);
    expect(screen.getAllByText(/CIP/i).length).toBeGreaterThan(0);
  });

  it('contient le 3114 et APESA dans la section soutien', () => {
    const ctx = makeContext({ moral: 'perdu' });
    render(<FicheProvider value={ctx}><ModePerdu /></FicheProvider>);
    // 3114 apparaît à la fois dans la description et dans le bouton tel — au moins une occurrence suffit
    const matches3114 = screen.getAllByText(/3114/i);
    expect(matches3114.length).toBeGreaterThan(0);
    const matchesApesa = screen.getAllByText(/APESA/i);
    expect(matchesApesa.length).toBeGreaterThan(0);
  });
});
