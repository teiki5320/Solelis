// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import SaveBanner from '../fiche/SaveBanner';

function reponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
});

function saisirEtEnvoyer(email = 'moi@exemple.fr') {
  fireEvent.change(screen.getByLabelText('Votre adresse e-mail'), { target: { value: email } });
  fireEvent.click(screen.getByRole('button', { name: 'Envoyer' }));
}

describe('SaveBanner', () => {
  it('le formulaire n’est pas imprimé (classe no-print)', () => {
    render(<SaveBanner token="tok" />);
    expect(screen.getByLabelText('Votre adresse e-mail').closest('form')).toHaveClass('no-print');
  });

  it('le champ e-mail a un vrai libellé', () => {
    render(<SaveBanner token="tok" />);
    const champ = screen.getByLabelText('Votre adresse e-mail');
    expect(champ.tagName).toBe('INPUT');
  });

  it('affiche « C’est envoyé » seulement si la route confirme sent: true', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => reponse(200, { sent: true })));
    render(<SaveBanner token="tok" />);
    saisirEtEnvoyer();
    await waitFor(() => expect(screen.getByText(/C’est envoyé|C'est envoyé/)).toBeInTheDocument());
    expect(screen.getByRole('status')).toHaveTextContent('E-mail envoyé à moi@exemple.fr.');
  });

  it('affiche une erreur (role alert) quand la route répond 200 { sent: false }', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => reponse(200, { sent: false })));
    render(<SaveBanner token="tok" />);
    saisirEtEnvoyer();
    const alerte = await screen.findByRole('alert');
    expect(alerte).toHaveTextContent(/n’a pas pu être envoyé/);
    expect(screen.queryByText(/C'est envoyé/)).not.toBeInTheDocument();
  });

  it('explique le refus 409 (adresse déjà liée)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => reponse(409, { error: 'x' })));
    render(<SaveBanner token="tok" />);
    saisirEtEnvoyer();
    expect(await screen.findByRole('alert')).toHaveTextContent(/déjà liée/);
  });

  it('signale une adresse incomplète sans appeler la route', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    render(<SaveBanner token="tok" />);
    saisirEtEnvoyer('moi@');
    expect(await screen.findByRole('alert')).toHaveTextContent(/adresse e-mail complète/);
    expect(f).not.toHaveBeenCalled();
  });
});

describe('SaveBanner : fiche déjà liée à une adresse e-mail', () => {
  it('affiche « Fiche enregistrée par e-mail » au lieu du formulaire', () => {
    render(<SaveBanner token="tok" emailEnregistre />);
    expect(screen.getByText('Fiche enregistrée par e-mail.')).toBeInTheDocument();
    expect(screen.queryByLabelText('Votre adresse e-mail')).not.toBeInTheDocument();
    expect(screen.queryByText('Sauvegardez votre fiche par e-mail')).not.toBeInTheDocument();
  });

  it('sans adresse enregistrée : le formulaire reste proposé', () => {
    render(<SaveBanner token="tok" emailEnregistre={false} />);
    expect(screen.getByText('Sauvegardez votre fiche par e-mail')).toBeInTheDocument();
    expect(screen.queryByText('Fiche enregistrée par e-mail.')).not.toBeInTheDocument();
  });
});
