'use client';
import { useId, useState } from 'react';

interface Props {
  token: string;
  /**
   * Fiche déjà liée à une adresse e-mail (calculé côté serveur ; l'adresse
   * n'est jamais envoyée au navigateur) : on ne redemande pas de l'enregistrer.
   */
  emailEnregistre?: boolean;
}

type Statut = 'idle' | 'sending' | 'done' | 'err';

/** Message d'erreur affiché selon la réponse de /api/fiche/send-link. */
function messageErreur(status: number | null): string {
  if (status === 409) {
    return 'Cette fiche est déjà liée à une autre adresse e-mail. Utilisez l’adresse saisie la première fois.';
  }
  if (status === 429) {
    return 'Trop de demandes en peu de temps. Réessayez dans quelques minutes.';
  }
  if (status === 400) {
    return 'Cette adresse e-mail ne semble pas valide. Vérifiez-la puis réessayez.';
  }
  return 'L’e-mail n’a pas pu être envoyé. Réessayez plus tard — votre fiche reste disponible sur cette page.';
}

/** Fiche déjà enregistrée : court message, même style que le bandeau. */
function FicheEnregistree() {
  return (
    <div role="note" className="no-print dashed-band flex items-center gap-3 p-4 text-sm text-bleu-fonce">
      <span aria-hidden="true">✉︎</span>
      <span>
        <strong>Fiche enregistrée par e-mail.</strong> Pour la retrouver, utilisez le lien
        privé envoyé à l&apos;adresse enregistrée.
      </span>
    </div>
  );
}

export default function SaveBanner({ token, emailEnregistre = false }: Props) {
  if (emailEnregistre) return <FicheEnregistree />;
  return <FormulaireSauvegarde token={token} />;
}

function FormulaireSauvegarde({ token }: { token: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Statut>('idle');
  const [erreur, setErreur] = useState('');
  const idChamp = useId();
  const idAide = useId();
  const idErreur = useId();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setErreur('Saisissez une adresse e-mail complète, par exemple nom@domaine.fr.');
      setStatus('err');
      return;
    }
    setStatus('sending');
    setErreur('');
    try {
      const res = await fetch('/api/fiche/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: email.trim() }),
      });
      let json: { sent?: boolean } | null = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
      // La route répond 200 { sent: false } quand l'envoi échoue : on vérifie `sent`.
      if (res.ok && json?.sent === true) {
        setStatus('done');
        return;
      }
      setErreur(messageErreur(res.ok ? null : res.status));
      setStatus('err');
    } catch {
      setErreur(messageErreur(null));
      setStatus('err');
    }
  }

  return (
    <div>
      {/* Annonce de l'état d'envoi pour les lecteurs d'écran */}
      <p className="sr-only" aria-live="polite" role="status">
        {status === 'sending' && 'Envoi en cours…'}
        {status === 'done' && `E-mail envoyé à ${email.trim()}.`}
      </p>

      {status === 'done' ? (
        <div className="dashed-band flex items-center gap-3 p-4 text-sm text-bleu-fonce">
          <span aria-hidden="true">✉︎</span>
          <span>
            C&apos;est envoyé à <strong>{email.trim()}</strong>. Le lien reste valable
            tant que vous en avez besoin.
          </span>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="no-print dashed-band p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-navy">
                Sauvegardez votre fiche par e-mail
              </p>
              <p id={idAide} className="text-xs text-navy/55">
                Aucun mot de passe. Nous vous envoyons un lien privé pour la
                retrouver.
              </p>
            </div>
            <div className="flex flex-1 gap-2">
              <label htmlFor={idChamp} className="sr-only">
                Votre adresse e-mail
              </label>
              <input
                id={idChamp}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                maxLength={254}
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'err') setStatus('idle');
                }}
                aria-describedby={status === 'err' ? `${idAide} ${idErreur}` : idAide}
                aria-invalid={status === 'err' ? true : undefined}
                className="min-h-[44px] flex-1 rounded-full border border-navy/10 bg-white/80 px-4 py-2 text-sm focus:border-bleu focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                aria-busy={status === 'sending'}
                className="min-h-[44px] rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {status === 'sending' ? 'Envoi…' : 'Envoyer'}
              </button>
            </div>
          </div>
          {status === 'err' && (
            <p id={idErreur} role="alert" className="mt-2 text-xs text-rouge">
              {erreur}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
