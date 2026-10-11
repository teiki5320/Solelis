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

describe('estimateur ATI — revenus (fiche Unédic ATI)', () => {
  it('10 000 € sur l’une des 2 années suffit (pas en moyenne)', () => {
    render(<AtiPage />);
    fireEvent.change(screen.getByLabelText(/Revenus d.activité de l.an dernier/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/Revenus d.activité de l.année d.avant/i), { target: { value: '2000' } });
    expect(screen.getByText(/seuil de 10 000 € respecté/i)).toBeInTheDocument();
    // Moyenne mensuelle 500 € < plancher : 19,73 €/jour.
    expect(screen.getByText('19,73 €')).toBeInTheDocument();
  });

  it('montant : forfait 26,30 €, réduit à la moyenne mensuelle, plancher 19,73 €', async () => {
    const { montantJournalierAti } = await import('@/lib/ati');
    expect(montantJournalierAti(20000, 20000)).toBe(26.3);
    expect(montantJournalierAti(9000, 9000)).toBe(24.66); // 750 €/mois
    expect(montantJournalierAti(10000, 0)).toBe(19.73);
    expect(montantJournalierAti(Number.NaN, -5)).toBe(19.73);
  });
});

describe('outil stocks', () => {
  it('les deux listes déroulantes ont une étiquette accessible', () => {
    render(<StocksPage />);
    expect(screen.getByRole('combobox', { name: 'Nature dominante du stock' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Voie de réalisation envisagée' })).toBeInTheDocument();
  });
});
