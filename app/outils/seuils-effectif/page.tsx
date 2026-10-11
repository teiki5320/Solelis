'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SEUILS, type Seuil } from './seuils';

/**
 * Vérificateur de seuils d'effectif.
 * Indique les obligations sociales et fiscales déclenchées selon le
 * nombre de salariés. Loi PACTE 2019 + Code du travail.
 */

const BADGE_COLORS: Record<NonNullable<Seuil['badge']>, string> = {
  social: 'bg-bleu/10 text-bleu-fonce',
  fiscal: 'bg-jaune/10 text-jaune',
  sante: 'bg-vert/10 text-vert',
  finance: 'bg-rouge/10 text-rouge',
};

const BADGE_LABEL: Record<NonNullable<Seuil['badge']>, string> = {
  social: 'Social',
  fiscal: 'Fiscal',
  sante: 'Santé/RPS',
  finance: 'Financier',
};

export default function SeuilsEffectifPage() {
  const [effectif, setEffectif] = useState(15);

  const declenches = useMemo(
    () => SEUILS.filter((s) => effectif >= s.seuil),
    [effectif]
  );

  const prochainSeuil = useMemo(
    () => SEUILS.find((s) => s.seuil > effectif),
    [effectif]
  );

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Identifier les obligations sociales selon votre effectif',
    description: 'Saisissez votre effectif et l\'outil liste les obligations applicables (CSE, PSE, participation, AGEFIPH…).',
    step: [
      { '@type': 'HowToStep', name: 'Saisir l\'effectif', text: 'Indiquez le nombre total de salariés en équivalents temps plein.' },
      { '@type': 'HowToStep', name: 'Consulter les obligations', text: 'L\'outil liste les seuils franchis et les obligations déclenchées avec références légales.' },
    ],
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      <Link href="/outils" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Vérificateur de seuils d&apos;effectif
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Saisissez votre effectif et découvrez les obligations sociales,
        fiscales et de santé au travail qui s&apos;appliquent.
      </p>

      <div className="glass mt-8 p-6 sm:p-8">
        <label className="block text-sm text-navy/80">
          Effectif (équivalents temps plein, moyenne sur 12 mois)
          <input
            type="number"
            min={0}
            value={effectif}
            onChange={(e) => setEffectif(Math.max(0, Number(e.target.value) || 0))}
            className="mt-2 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-3 text-2xl font-display"
          />
          <span className="mt-1 block text-[11px] text-navy/55">
            Calcul URSSAF : moyenne arithmétique des effectifs mensuels. Pour les seuils soumis à l&apos;art. L130-1 CSS (participation, obligation d&apos;emploi de travailleurs handicapés…), un seuil n&apos;est franchi qu&apos;après 5 années civiles consécutives ; le CSE et d&apos;autres obligations du Code du travail suivent leurs propres règles (12 mois consécutifs pour le CSE).
          </span>
        </label>

        {prochainSeuil && (
          <div className="mt-5 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-jaune">Prochain seuil</p>
            <p className="mt-1 text-sm text-navy/80">
              À <strong>{prochainSeuil.seuil} salariés</strong> ({prochainSeuil.seuil - effectif} de plus) :{' '}
              <strong>{prochainSeuil.nom}</strong> — {prochainSeuil.description}
            </p>
          </div>
        )}

        <div className="mt-6">
          <p className="font-display text-lg text-navy">
            {declenches.length} obligation{declenches.length > 1 ? 's' : ''} déclenchée{declenches.length > 1 ? 's' : ''}
          </p>
          <div className="mt-3 space-y-3">
            {declenches.length === 0 && (
              <p className="rounded-xl bg-vert/5 p-4 text-sm text-navy/70">
                Aucune obligation collective spécifique à votre effectif. Les obligations de base (sécurité, document unique, médecine du travail) s&apos;appliquent dès le 1er salarié.
              </p>
            )}
            {declenches.map((s, i) => (
              <div key={i} className="glass-soft rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-navy">
                      <span className="mr-2 text-navy/40">≥ {s.seuil}</span>
                      {s.nom}
                    </p>
                    <p className="mt-1 text-sm text-navy/70">{s.description}</p>
                    <p className="mt-1 text-[11px] text-navy/50">
                      {s.reference}{s.delai ? ` · ${s.delai}` : ''}
                    </p>
                  </div>
                  {s.badge && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${BADGE_COLORS[s.badge]}`}>
                      {BADGE_LABEL[s.badge]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">À savoir</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Calcul effectif</strong> : moyenne des effectifs mensuels sur 12 mois. CDD, intérimaires, mis à disposition comptés au prorata. Apprentis et contrats aidés exclus.
          </li>
          <li>
            <strong>Franchissement</strong> : pour les seuils qui renvoient à l&apos;art. L130-1 CSS (loi PACTE 2019), un seuil d&apos;effectif n&apos;est pris en compte que s&apos;il est atteint ou dépassé pendant 5 années civiles consécutives (règle reprise par exemple pour l&apos;obligation d&apos;emploi de travailleurs handicapés, L5212-1, et pour la participation, L3322-2). Elle ne vaut pas pour toutes les obligations listées (PSE, BDESE, bilan GES…). Exceptions : le CSE, dû quand 11 salariés sont atteints pendant 12 mois consécutifs (L2311-2), et le règlement intérieur, dû 12 mois après l&apos;atteinte de 50 salariés (L1311-2).
          </li>
          <li>
            <strong>Retour sous le seuil</strong> : une année civile sous le seuil suffit à faire recommencer le décompte des 5 années (art. L130-1, II CSS).
          </li>
          <li>
            <strong>En procédure collective</strong> : le CSP s&apos;impose quel que soit l&apos;effectif. Le PSE reste obligatoire ≥ 50 sal + 10 licenciements.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources : Code du travail (CSE L2311-2, règlement intérieur L1311-2, PSE, participation, BDESE, index égalité, congé de reclassement) ; loi PACTE n° 2019-486 du 22 mai 2019 (lissage des seuils) ; CSS art. L130-1.
      </p>
    </section>
  );
}
