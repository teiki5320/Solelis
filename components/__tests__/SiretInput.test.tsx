// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SiretInput from '../SiretInput';

// Mock next/navigation
const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn() }),
}));

describe('SiretInput', () => {
  it('rend un champ de saisie SIRET', () => {
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i);
    expect(input).toBeInTheDocument();
  });

  it('refuse les caractères non numériques (filtrage par formatSiret)', () => {
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc123def456' } });
    expect(input.value).toMatch(/^[\d ]*$/);
  });

  it('formate comme l\'INSEE : SIREN en 3 × 3 chiffres puis NIC (5 chiffres)', () => {
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '80186721900025' } });
    expect(input.value).toBe('801 867 219 00025');
  });

  it('refuse un SIRET inventé (clé de contrôle fausse) avec un message clair', () => {
    push.mockClear();
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i) as HTMLInputElement;
    for (const faux of ['12345678901234', '80186721900026']) {
      fireEvent.change(input, { target: { value: faux } });
      fireEvent.submit(input.closest('form')!);
      expect(screen.getByRole('alert')).toHaveTextContent(/chiffre semble mal saisi/i);
    }
    expect(push).not.toHaveBeenCalled();
  });

  it('accepte un SIRET valide et ouvre le questionnaire', () => {
    push.mockClear();
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '801 867 219 00025' } });
    fireEvent.submit(input.closest('form')!);
    expect(push).toHaveBeenCalledWith('/questionnaire?siret=80186721900025');
  });

  it('affiche un message d\'erreur si le SIRET est trop court à la soumission', () => {
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345' } });
    const form = input.closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByText(/14 chiffres/i)).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'siret-erreur');
  });

  it('le bouton Commencer ne paraît pas désactivé quand le SIRET est incomplet', () => {
    render(<SiretInput />);
    const bouton = screen.getByRole('button', { name: /Commencer/i });
    expect(bouton).not.toBeDisabled();
    expect(bouton.className).not.toMatch(/opacity-/);
  });
});
