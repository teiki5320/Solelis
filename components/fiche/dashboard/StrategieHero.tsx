'use client';
import { useState } from 'react';
import { resolveStrategie, estEnCessation, AXE_META, type Axe } from '@/lib/strategie';
import { useFiche } from '@/lib/FicheContext';

// Classes Tailwind statiques pour que le JIT les détecte
const PASTILLE_CLASSES: Record<Axe, string> = {
  restructurer: 'bg-bleu/15 text-bleu-fonce',
  sauvegarder: 'bg-vert/15 text-vert',
  ceder: 'bg-jaune/20 text-navy',
  liquider: 'bg-navy/15 text-navy',
  rebondir: 'bg-rouge/15 text-rouge',
};

const GRADIENT_CLASSES: Record<Axe, string> = {
  restructurer: 'bg-gradient-to-br from-bleu/15 via-white/40 to-bleu-fonce/10',
  sauvegarder: 'bg-gradient-to-br from-vert/15 via-white/40 to-vert/5',
  ceder: 'bg-gradient-to-br from-jaune/20 via-white/40 to-jaune/5',
  liquider: 'bg-gradient-to-br from-navy/10 via-white/40 to-navy/5',
  rebondir: 'bg-gradient-to-br from-rouge/15 via-white/40 to-rouge/5',
};

export default function StrategieHero() {
  const { reponses, company } = useFiche();
  const [showMore, setShowMore] = useState(false);
  const res = resolveStrategie(reponses, company);
  if (!res) return null;

  const { main } = res;
  // Garde-fou : la sauvegarde n'est jamais présentée comme alternative à un
  // débiteur en cessation des paiements (art. L620-1 C. com.).
  const secondary =
    res.secondary && !(res.secondary.axe === 'sauvegarder' && estEnCessation(reponses))
      ? res.secondary
      : null;
  const meta = AXE_META[main.axe];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-navy/10 shadow-sm">
      {/* Gradient de fond subtil */}
      <div
        className={`absolute inset-0 ${GRADIENT_CLASSES[main.axe]}`}
        aria-hidden
      />

      <div className="relative p-6 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-navy/50">
              🎯 Stratégie recommandée pour vous
            </p>
            <h2 className="mt-2 font-display text-2xl text-navy sm:text-4xl">
              <span className="mr-3 text-3xl sm:text-4xl" aria-hidden>
                {meta.icone}
              </span>
              {main.titre}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-navy/80 sm:text-base">
              {main.verdict}
            </p>
          </div>

          <div className="hidden shrink-0 text-right sm:block">
            <span className={`pastille ${PASTILLE_CLASSES[main.axe]}`}>
              Cap · {meta.label}
            </span>
          </div>
        </div>

        {/* Prochaines étapes toujours visibles */}
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {main.etapes.slice(0, 4).map((e, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-white/70 p-3 backdrop-blur"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span className="text-sm text-navy/85">{e}</span>
            </div>
          ))}
        </div>

        {/* Bouton voir plus */}
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-bleu-fonce hover:text-navy"
        >
          {showMore ? '↑ Replier' : '↓ Voir pourquoi, étapes détaillées, alternatives'}
        </button>

        {showMore && (
          <div className="mt-5 space-y-5 border-t border-navy/10 pt-5">
            <div>
              <p className="font-display text-sm uppercase tracking-wide text-navy/60">
                Pourquoi cette voie
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-navy/80">
                {main.pourquoi.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-navy/40">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {main.etapes.length > 4 && (
              <div>
                <p className="font-display text-sm uppercase tracking-wide text-navy/60">
                  Autres étapes
                </p>
                <ol className="mt-2 space-y-1.5 text-sm text-navy/80">
                  {main.etapes.slice(4).map((e, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0 rounded-full bg-white/80 px-2 text-xs font-semibold text-navy">
                        {i + 5}
                      </span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div>
              <p className="font-display text-sm uppercase tracking-wide text-navy/60">
                Alternatives si la situation évolue
              </p>
              <ul className="mt-2 space-y-1 text-sm text-navy/70">
                {main.alternatives.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </div>

            {secondary && (
              <div className="rounded-2xl border border-navy/10 bg-white/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-navy/50">
                  Alternative possible
                </p>
                <p className="mt-1 font-display text-base text-navy">
                  <span aria-hidden>{AXE_META[secondary.axe].icone}</span> {secondary.titre}
                </p>
                <p className="mt-1 text-sm text-navy/70">{secondary.verdict}</p>
              </div>
            )}

            <p className="text-xs text-navy/50">
              Cette stratégie est une synthèse automatique. Un avocat ou un
              mandataire peut confirmer — une première consultation gratuite
              est possible dans un point-justice (3039).
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
