'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { dureeEnAnnees } from '@/lib/format';

import {
  PLAFOND_AGS_BAS,
  PLAFOND_AGS_HAUT,
  PLAFOND_AGS_INTER,
  ANCIENNETE_MIN_MOIS,
  calculEquipe,
  type Salarie,
} from './calcul';

function formatEuros(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

export default function LicenciementPage() {
  const [salaries, setSalaries] = useState<Salarie[]>([
    { id: 's1', ancienneteMois: 60, salaireBrut: 2500 },
  ]);

  function update(id: string, field: 'ancienneteMois' | 'salaireBrut', value: number) {
    setSalaries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function add() {
    setSalaries((prev) => [
      ...prev,
      {
        id: `s${prev.length + 1}-${Date.now()}`,
        ancienneteMois: 24,
        salaireBrut: 2000,
      },
    ]);
  }

  function remove(id: string) {
    setSalaries((prev) => prev.filter((s) => s.id !== id));
  }

  const total = useMemo(() => calculEquipe(salaries), [salaries]);

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Estimer l\'indemnité de licenciement',
    description:
      'Calculez l\'indemnité de licenciement économique due à chaque salarié selon les barèmes légaux, et vérifiez la couverture par l\'AGS.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Saisir l\'ancienneté du salarié',
        text: 'Indiquez l\'ancienneté en mois de chaque salarié. L\'indemnité est due à partir de 8 mois (L1234-9).',
      },
      {
        '@type': 'HowToStep',
        name: 'Saisir le salaire brut mensuel de référence',
        text: 'Indiquez la moyenne des 12 ou 3 derniers mois (la plus favorable au salarié).',
      },
      {
        '@type': 'HowToStep',
        name: 'Ajouter d\'autres salariés si besoin',
        text: 'Cliquez sur "Ajouter un salarié" pour estimer le coût total de l\'équipe.',
      },
      {
        '@type': 'HowToStep',
        name: 'Lire les résultats',
        text: 'L\'outil affiche l\'indemnité due, la part couverte par l\'AGS (plafonds 2026) et le reste à votre charge.',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Indemnité de licenciement' },
    ],
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <Link
        href="/outils"
        className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Indemnité de licenciement économique + AGS
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Estimez le coût d&apos;un licenciement économique selon les
        barèmes légaux. Le calcul applique les articles L1234-9 et
        R1234-2 du Code du travail. Les plafonds AGS 2026
        permettent de voir ce qui est couvert en cas de procédure.
      </p>

      <div className="glass mt-8 p-6 sm:p-8">
        <div className="space-y-4">
          {salaries.map((s, i) => {
            const ligne = total.lignes[i];
            return (
              <div key={s.id} className="rounded-2xl border border-navy/10 bg-white/60 p-4">
                <div className="flex items-start justify-between">
                  <p className="font-display text-base text-navy">
                    Salarié {i + 1}
                  </p>
                  {salaries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="text-xs text-navy/55 hover:text-rouge"
                    >
                      ✕ retirer
                    </button>
                  )}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs text-navy/70">
                    Ancienneté (en mois)
                    <input
                      type="number"
                      min={0}
                      value={s.ancienneteMois}
                      onChange={(e) => update(s.id, 'ancienneteMois', Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
                    />
                    <span className="mt-1 block text-[11px] text-navy/55">
                      = {dureeEnAnnees(s.ancienneteMois)}. Indemnité due à partir de 8 mois (L1234-9).
                    </span>
                  </label>
                  <label className="block text-xs text-navy/70">
                    Salaire brut mensuel de référence (€)
                    <input
                      type="number"
                      min={0}
                      value={s.salaireBrut}
                      onChange={(e) => update(s.id, 'salaireBrut', Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
                    />
                    <span className="mt-1 block text-[11px] text-navy/55">
                      Moyenne des 12 ou 3 derniers mois (la plus favorable au salarié).
                    </span>
                  </label>
                </div>

                {ligne && s.ancienneteMois >= ANCIENNETE_MIN_MOIS && (
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    <div className="rounded-xl bg-bleu/5 p-3">
                      <p className="text-[11px] uppercase text-navy/55">Indemnité due</p>
                      <p className="mt-1 font-display text-lg text-navy">{formatEuros(ligne.calc.montant)}</p>
                    </div>
                    <div className="rounded-xl bg-vert/5 p-3">
                      <p className="text-[11px] uppercase text-navy/55">Couverte par AGS</p>
                      <p className="mt-1 font-display text-lg text-vert">{formatEuros(ligne.couvert)}</p>
                      <p className="mt-1 text-[11px] text-navy/50">
                        Plafond : {formatEuros(ligne.plafond)}
                      </p>
                    </div>
                    {ligne.depasse > 0 && (
                      <div className="rounded-xl bg-rouge/5 p-3">
                        <p className="text-[11px] uppercase text-navy/55">Reste à charge</p>
                        <p className="mt-1 font-display text-lg text-rouge">{formatEuros(ligne.depasse)}</p>
                      </div>
                    )}
                  </div>
                )}
                {s.ancienneteMois < ANCIENNETE_MIN_MOIS && (
                  <p className="mt-3 rounded-xl bg-jaune/10 p-3 text-xs text-navy/70">
                    Pas d&apos;indemnité légale de licenciement (ancienneté d&apos;au moins 8 mois requise, art. L1234-9 C. trav.).
                    Une convention collective peut prévoir un seuil inférieur.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={add}
          className="mt-4 rounded-full border border-navy/20 px-4 py-2 text-sm text-navy/80 hover:bg-white"
        >
          + Ajouter un salarié
        </button>

        {salaries.length >= 1 && total.totalIndem > 0 && (
          <div className="mt-6 rounded-2xl border border-navy/10 bg-white/70 p-5">
            <p className="font-display text-lg text-navy">Total équipe</p>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase text-navy/55">Indemnité totale due</p>
                <p className="font-display text-2xl text-navy">{formatEuros(total.totalIndem)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-navy/55">Couvert AGS (en RJ/LJ)</p>
                <p className="font-display text-2xl text-vert">{formatEuros(total.totalAgs)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-navy/55">Reste à votre charge</p>
                <p className={`font-display text-2xl ${total.totalDepasse > 0 ? 'text-rouge' : 'text-vert'}`}>
                  {formatEuros(total.totalDepasse)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">À savoir</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Préavis</strong> : 1 mois (de 6 mois à moins de 2 ans d&apos;ancienneté), 2 mois (2 ans et plus). Indemnisé en plus si dispense.
          </li>
          <li>
            <strong>Congés payés non pris</strong> : à indemniser en plus.
          </li>
          <li>
            <strong>Plafonds AGS 2026</strong> : 4, 5 ou 6 fois le plafond mensuel d&apos;assurance chômage (4 × le plafond mensuel de la Sécurité sociale), selon l&apos;ancienneté du contrat de travail au jugement d&apos;ouverture, toutes créances du salarié confondues (salaires, préavis, congés, indemnités) — moins de 6 mois : {formatEuros(PLAFOND_AGS_BAS)} ; 6 mois à 2 ans : {formatEuros(PLAFOND_AGS_INTER)} ; 2 ans et plus : {formatEuros(PLAFOND_AGS_HAUT)}. Coordonnées des{' '}
            <Link href="/annuaires/ags" className="text-bleu-fonce underline underline-offset-4">15 centres AGS (CGEA)</Link>.
          </li>
          <li>
            <strong>PSE</strong> obligatoire si licenciement de 10+ salariés sur 30 jours dans une entreprise de 50+ salariés (L1233-61).
          </li>
          <li>
            <strong>Convention collective</strong> : peut prévoir une indemnité plus favorable. Vérifiez votre IDCC.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources : Code du travail, art. L1234-1 (préavis), L1234-9 et R1234-2 (indemnité), L1233-61 (PSE), D3253-5 (plafonds AGS) ;
        arrêté du 22 décembre 2025 (plafond de la Sécurité sociale 2026 : 4 005 €/mois) ; www.ags-garantie-salaires.org.
      </p>
    </section>
  );
}
