import AccompagnantQuestionnaire from './AccompagnantQuestionnaire';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/accompagnant' },
  title: 'J\'accompagne un·e dirigeant·e — Solelis',
  description:
    'Vous êtes proche d\'un·e dirigeant·e en difficulté. Solelis vous aide à comprendre et à l\'accompagner.',
};

const urgences = [
  {
    nom: 'APESA',
    telephone: '05 46 98 42 85',
    tel: '0546984285',
    description: 'Secrétariat de l’association · soutien psychologique gratuit des entrepreneur·e·s · Pas un service d’urgence',
    couleur: 'bg-bleu/10 text-bleu-fonce',
  },
  {
    nom: '3114',
    telephone: '3114',
    tel: '3114',
    description: 'Prévention du suicide · 24 h/24, 7 j/7 · Répond aussi aux proches',
    couleur: 'bg-rouge/10 text-rouge',
  },
  {
    nom: 'Accès au droit',
    telephone: '3039',
    tel: '3039',
    description: 'Numéro unique de l’accès au droit : mise en relation avec un point-justice proche · Gratuit et anonyme',
    couleur: 'bg-jaune/10 text-jaune',
  },
  {
    nom: 'SOS Amitié',
    telephone: '09 72 39 40 50',
    tel: '0972394050',
    description: 'Écoute anonyme · 24 h/24, 7 j/7',
    couleur: 'bg-vert/10 text-vert',
  },
];

export default function AccompagnantPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-4 pb-20">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-vert/80">
          Aux côtés d&apos;un·e dirigeant·e
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
          Vous accompagnez un·e dirigeant·e
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-navy/70">
          Vous n&apos;êtes pas le ou la dirigeant·e, mais quelqu&apos;un qui
          veut l&apos;aider. Merci d&apos;être là — c&apos;est déjà
          énorme.
        </p>
      </div>

      {/* Bandeau d'urgence */}
      <div className="mb-10 rounded-2xl border border-rouge/20 bg-rouge/5 p-5 sm:p-6">
        <p className="text-center text-sm font-medium text-navy/80">
          Si vous êtes inquiet·e pour sa sécurité, n&apos;attendez pas :
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {urgences.map((u) => (
            <a
              key={u.nom}
              href={`tel:${u.tel}`}
              className="glass flex flex-col items-center rounded-2xl p-4 text-center transition hover:shadow-lg"
            >
              <span
                className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${u.couleur}`}
              >
                {u.nom}
              </span>
              <span className="mt-3 font-display text-xl font-bold tracking-wide text-navy sm:text-2xl">
                {u.telephone}
              </span>
              <span className="mt-1 text-xs text-navy/60">
                {u.description}
              </span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-navy/50">
          Ces services sont confidentiels ; APESA et le 3114 sont gratuits.
        </p>
      </div>

      <AccompagnantQuestionnaire />
    </section>
  );
}
