'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

import {
  buildEcheances,
  type Echeance,
  type RegimeTVA,
  type RegimeIS,
  type ExerciceFin,
} from '@/lib/calendrierFiscal';

const CATEGORIE_STYLES: Record<Echeance['categorie'], string> = {
  TVA: 'bg-bleu/10 text-bleu-fonce',
  IS: 'bg-jaune/15 text-jaune',
  IR: 'bg-jaune/15 text-jaune',
  CFE: 'bg-vert/10 text-vert',
  CVAE: 'bg-vert/10 text-vert',
  URSSAF: 'bg-rouge/10 text-rouge',
  DSN: 'bg-rouge/10 text-rouge',
  Comptes: 'bg-navy/10 text-navy',
  Taxes: 'bg-jaune/15 text-jaune',
};

export default function CalendrierFiscalPage() {
  const [tva, setTva] = useState<RegimeTVA>('reel-mensuel');
  const [is, setIs] = useState<RegimeIS>('is');
  const [fin, setFin] = useState<ExerciceFin>('dec');
  const [salaries, setSalaries] = useState(false);
  const [proprietaire, setProprietaire] = useState(false);

  const echeances = useMemo(() => buildEcheances(tva, is, fin, salaries, proprietaire), [tva, is, fin, salaries, proprietaire]);

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Générer votre calendrier fiscal',
    description:
      'Générez un calendrier personnalisé de vos prochaines échéances fiscales et sociales (TVA, IS, CFE, DSN, URSSAF) selon votre régime.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Choisir votre régime TVA',
        text: 'Sélectionnez votre régime : franchise en base, réel normal mensuel, réel normal trimestriel ou réel simplifié.',
      },
      {
        '@type': 'HowToStep',
        name: 'Indiquer votre régime fiscal',
        text: 'Choisissez entre IS, IR/BIC, IR/BNC ou micro-entreprise.',
      },
      {
        '@type': 'HowToStep',
        name: 'Préciser la date de clôture et les options',
        text: 'Sélectionnez votre date de clôture d\'exercice et indiquez si vous avez des salariés ou êtes propriétaire des locaux.',
      },
      {
        '@type': 'HowToStep',
        name: 'Consulter les échéances',
        text: 'L\'outil liste chronologiquement toutes vos prochaines échéances déclaratives et de paiement avec les sources officielles.',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Calendrier fiscal' },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <Link href="/outils" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Calendrier fiscal et social
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Les prochaines échéances déclaratives et de paiement selon votre
        régime. Dates issues du Bulletin Officiel des Finances Publiques
        (BOFiP) et du Code général des impôts.
      </p>

      <div className="glass mt-8 space-y-4 p-6 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-navy">
            Régime TVA
            <select
              value={tva}
              onChange={(e) => setTva(e.target.value as RegimeTVA)}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            >
              <option value="franchise">Franchise en base (pas de TVA)</option>
              <option value="reel-mensuel">Réel normal mensuel</option>
              <option value="reel-trimestriel">Réel normal trimestriel</option>
              <option value="mini-reel">Réel simplifié (acomptes semestriels)</option>
            </select>
          </label>
          <label className="block text-sm text-navy">
            Régime fiscal
            <select
              value={is}
              onChange={(e) => setIs(e.target.value as RegimeIS)}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            >
              <option value="is">Impôt sur les Sociétés (IS)</option>
              <option value="ir-bic">IR · BIC (commerçants, artisans)</option>
              <option value="ir-bnc">IR · BNC (professions libérales)</option>
              <option value="micro">Micro-entreprise / micro-BIC / micro-BNC</option>
            </select>
          </label>
          <label className="block text-sm text-navy">
            Clôture d&apos;exercice
            <select
              value={fin}
              onChange={(e) => setFin(e.target.value as ExerciceFin)}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            >
              <option value="dec">31 décembre</option>
              <option value="juin">30 juin</option>
              <option value="sept">30 septembre</option>
            </select>
          </label>
          <div className="flex flex-col gap-2 pt-5 text-sm text-navy">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={salaries} onChange={(e) => setSalaries(e.target.checked)} className="h-4 w-4" />
              J&apos;ai des salariés (DSN)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={proprietaire} onChange={(e) => setProprietaire(e.target.checked)} className="h-4 w-4" />
              Je suis propriétaire des locaux (taxe foncière)
            </label>
          </div>
        </div>

        <div className="border-t border-navy/10 pt-4">
          <p className="mb-3 font-display text-base text-navy">
            Prochaines échéances ({echeances.length})
          </p>
          <ol className="space-y-2">
            {echeances.map((e, i) => {
              const today = new Date();
              const diff = Math.ceil((e.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const urgent = diff <= 15 && diff >= 0;
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 rounded-xl border p-3 ${
                    urgent ? 'border-rouge/40 bg-rouge/5' : 'border-navy/10 bg-white/60'
                  }`}
                >
                  <div className="shrink-0 text-center">
                    <p className="font-display text-lg text-navy">{e.date.getDate()}</p>
                    <p className="text-[10px] uppercase text-navy/50">
                      {e.date.toLocaleDateString('fr-FR', { month: 'short' })}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-navy">{e.titre}</p>
                      <span className={`pastille text-[10px] ${CATEGORIE_STYLES[e.categorie]}`}>{e.categorie}</span>
                      {urgent && (
                        <span className="pastille bg-rouge/20 text-[10px] text-rouge">
                          J-{diff}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-navy/70">{e.description}</p>
                    <p className="mt-1 text-[11px] text-navy/50">Source : {e.source}</p>
                  </div>
                </li>
              );
            })}
            {echeances.length === 0 && (
              <li className="rounded-xl bg-white/60 p-4 text-sm text-navy/60">
                Aucune échéance détectée avec ces paramètres.
              </li>
            )}
          </ol>
        </div>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Calendrier indicatif basé sur les dates-type. Les échéances peuvent
        varier selon votre département (décalage de quelques jours pour la
        TVA), votre IDCC et des circulaires annuelles DGFiP. Vérifiez sur{' '}
        <a href="https://www.impots.gouv.fr/professionnel/calendrier-fiscal" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">
          impots.gouv.fr
        </a>.
      </p>
    </section>
  );
}
