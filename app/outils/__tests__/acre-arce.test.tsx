// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AcreArcePage from '../acre-arce/page';

describe('vérificateur ACRE / ARCE', () => {
  it('aucun verdict avant de choisir une situation', () => {
    render(<AcreArcePage />);
    expect(screen.queryByText(/non éligible/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/éligible ✓/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Choisissez votre situation ci-dessus/i)).toHaveLength(2);
  });

  it('ARCE : pas de « ~0 € » tant que les montants ARE ne sont pas saisis', () => {
    render(<AcreArcePage />);
    fireEvent.click(screen.getByLabelText(/Demandeur d'emploi indemnisé/i));
    fireEvent.click(screen.getByLabelText(/je perçois ou je vais percevoir l'ARE/i));
    expect(screen.getByText(/Renseignez le montant mensuel de l'ARE/i)).toBeInTheDocument();
    expect(screen.queryByText('~ 0 €')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Montant mensuel ARE/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Mois de droits restants/i), { target: { value: '10' } });
    // 60 % × 1 000 € × 10 mois
    expect(screen.getByText(/~\s6\s000\s€/)).toBeInTheDocument();
  });

  it('« Aucun de ces cas » : non éligible', () => {
    render(<AcreArcePage />);
    fireEvent.click(screen.getByLabelText(/Aucun de ces cas/i));
    expect(screen.getByText('ACRE — non éligible')).toBeInTheDocument();
  });
});
