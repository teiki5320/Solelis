import type { Metadata } from 'next';
import Questionnaire from '@/components/Questionnaire';
import { redirect } from 'next/navigation';
import { siretValide } from '@/lib/siret';

export const metadata: Metadata = {
  alternates: { canonical: '/questionnaire' },
  title: 'Questionnaire — Solelis',
  description:
    'Répondez à 8 questions essentielles (et jusqu’à 10 facultatives) sur votre situation pour recevoir une fiche personnalisée gratuite avec vos options concrètes.',
};

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ siret?: string }>;
}

export default async function QuestionnairePage({ searchParams }: Props) {
  const { siret: siretBrut } = await searchParams;
  const siret = (siretBrut ?? '').replace(/\D/g, '');
  // 14 chiffres et clé de contrôle (Luhn, exception La Poste) : sinon retour à l'accueil.
  if (!siretValide(siret)) {
    redirect('/');
  }

  return (
    <section className="pt-4">
      <div className="mx-auto max-w-2xl px-5 pb-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-bleu-fonce/70">
          8 questions essentielles, 10 facultatives
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
          Parlez-nous de votre situation
        </h1>
      </div>
      <Questionnaire siret={siret} />
    </section>
  );
}
