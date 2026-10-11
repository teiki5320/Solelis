// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AtiPage from '../ati/page';
import StocksPage from '../stocks/page';

describe('estimateur ATI', () => {
  it('le plafond est celui d’une personne seule : la taille du foyer ne change rien', () => {
    render(<AtiPage />);
    expect(screen.queryByText(/pour votre foyer/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Sans effet sur le calcul/i)).toBeInTheDocument();

    const ressources = screen.getByLabelText(/Vos ressources personnelles mensuelles/i);
    fireEvent.change(ressources, { target: { value: '700' } });
    expect(screen.getByText(/supérieures au plafond : RSA d'une personne seule/i)).toBeInTheDocument();
    // Un foyer de 4 personnes ne relève pas le plafond.
    fireEvent.change(screen.getByLabelText(/Nombre de personnes dans le foyer/i), { target: { value: '4' } });
    expect(screen.getByText(/supérieures au plafond : RSA d'une personne seule/i)).toBeInTheDocument();
  });
});

describe('outil stocks', () => {
  it('les deux listes déroulantes ont une étiquette accessible', () => {
    render(<StocksPage />);
    expect(screen.getByRole('combobox', { name: 'Nature dominante du stock' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Voie de réalisation envisagée' })).toBeInTheDocument();
  });
});
