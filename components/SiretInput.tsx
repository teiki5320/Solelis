'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { m } from 'framer-motion';
import { formaterSiret, siretValide } from '@/lib/siret';

export default function SiretInput() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clean = (value || '').replace(/\s/g, '');
  const quatorzeChiffres = /^\d{14}$/.test(clean);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quatorzeChiffres) {
      setError('Un SIRET contient 14 chiffres.');
      return;
    }
    if (!siretValide(clean)) {
      setError(
        'Ce numéro SIRET n’existe pas : un chiffre semble mal saisi. Vérifiez-le sur une facture ou votre extrait Kbis.'
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      sessionStorage.setItem('solelis_siret', clean);
    } catch {}
    router.push(`/questionnaire?siret=${clean}`);
  }

  return (
    <m.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass card-top-line mx-auto mt-10 max-w-xl p-6 sm:p-8"
    >
      <label
        htmlFor="siret"
        className="block text-sm font-medium text-navy/70"
      >
        Votre numéro SIRET
      </label>
      <input
        id="siret"
        name="siret"
        inputMode="numeric"
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'siret-erreur' : undefined}
        value={value}
        onChange={(e) => {
          setValue(formaterSiret(e.target.value));
          setError(null);
        }}
        placeholder="123 456 789 00012"
        className="mt-3 w-full rounded-2xl border border-navy/10 bg-white/70 px-5 py-4 text-lg tracking-wider placeholder:text-navy/30 focus:border-bleu focus:outline-none focus:ring-2 focus:ring-bleu"
      />
      {error && (
        <p id="siret-erreur" className="mt-2 text-sm text-rouge" role="alert">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-navy/50">
          Vos données restent privées. Aucun compte n&apos;est créé.
        </p>
        {/* Ni disabled ni opacité réduite quand le SIRET est incomplet : un
            bouton qui semble inactif décourage le clic. La validation se fait
            au clic (ou à Entrée) et affiche le message via role="alert". */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Chargement…' : 'Commencer'}
          {!loading && <span aria-hidden>→</span>}
        </button>
      </div>
    </m.form>
  );
}
