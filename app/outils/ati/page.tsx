'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { dureeEnAnnees } from '@/lib/format';
import { montantJournalierAti } from '@/lib/ati';

// ATI (Allocation des Travailleurs Indépendants)
// Source : francetravail.fr / chomage-independant.francetravail.fr / Code du travail L5424-24 à L5424-26
// Montant (fiche Unédic ATI) : forfait de 26,30 €/jour (environ 800 €/mois),
// réduit à la moyenne mensuelle des revenus d'activité des 2 années
// précédentes si elle est plus basse, sans descendre sous 19,73 €/jour
// (environ 600 €/mois), pendant 182 jours. Mayotte : 13,15 à 19,73 €/jour.
// Plafond de ressources mensuelles : RSA pour une personne seule (revenus
// personnels, ceux du conjoint ne comptent pas — fiche Unédic ATI).
// Conditions cumulatives :
// - 2 ans d'activité non salariée
// - Cessation judiciaire (LJ, RJ avec plan imposant remplacement, ou activité économiquement non viable)
// - Revenus d'au moins 10 000 € sur l'une des 2 années précédentes (7 500 € à Mayotte)
// - Ressources personnelles < RSA personne seule (651,69 € au 1er avril 2026)

const DUREE_JOURS = 182;
const MIN_REVENU_ANNUEL = 10000;
const DUREE_ACTIVITE_MIN_MOIS = 24;

function formatEuros(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

function formatEurosCentimes(n: number): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

type TypeCessation =
  | 'liquidation'
  | 'redressement-remplacement'
  | 'non-viable'
  | 'autre';

interface Result {
  eligible: boolean;
  motifs: string[];
  blocages: string[];
  montantJournalier: number;
  montantMensuel: number;
  montantTotal: number;
}

export default function AtiPage() {
  const [activiteMois, setActiviteMois] = useState(36);
  const [revenuN1, setRevenuN1] = useState(20000);
  const [revenuN2, setRevenuN2] = useState(20000);
  const [ressourcesMensuelles, setRessourcesMensuelles] = useState(0);
  const [typeCessation, setTypeCessation] = useState<TypeCessation>('liquidation');
  const [foyer, setFoyer] = useState(1);

  // Plafond : montant forfaitaire du RSA pour une personne seule, quelle que
  // soit la taille du foyer (C. trav. R5424-70, 4° ; décret n° 2026-220 du
  // 30 mars 2026 : 651,69 € au 1er avril 2026). Le champ « foyer » est gardé
  // pour la mise en page, mais il n'entre pas dans le calcul.
  const plafondRSA = 651.69;

  const result = useMemo<Result>(() => {
    const motifs: string[] = [];
    const blocages: string[] = [];

    if (activiteMois >= DUREE_ACTIVITE_MIN_MOIS) {
      motifs.push(`${dureeEnAnnees(activiteMois)} d'activité — seuil de 2 ans respecté.`);
    } else {
      blocages.push(`Activité de ${dureeEnAnnees(activiteMois)}, seuil légal minimum : 2 ans.`);
    }

    const meilleureAnnee = Math.max(revenuN1, revenuN2);
    if (meilleureAnnee >= MIN_REVENU_ANNUEL) {
      motifs.push(`Revenus de ${formatEuros(meilleureAnnee)} sur l'une des 2 dernières années — seuil de 10 000 € respecté.`);
    } else {
      blocages.push(`Revenus de ${formatEuros(meilleureAnnee)} au mieux sur les 2 dernières années. Seuil : 10 000 € sur l'une des 2 années.`);
    }

    const typeOk = typeCessation === 'liquidation' || typeCessation === 'redressement-remplacement' || typeCessation === 'non-viable';
    if (typeOk) {
      const labels: Record<TypeCessation, string> = {
        'liquidation': 'Liquidation judiciaire — situation type couverte.',
        'redressement-remplacement': "Plan de redressement imposant remplacement du dirigeant — couvert depuis la réforme 2022.",
        'non-viable': "Activité déclarée économiquement non viable — couverte depuis la réforme 2022 (baisse ≥ 30 % du revenu).",
        'autre': 'Cas non couvert par l\'ATI.',
      };
      motifs.push(labels[typeCessation]);
    } else {
      blocages.push('Type de cessation non couvert par l\'ATI (cessation volontaire, par exemple).');
    }

    if (ressourcesMensuelles <= plafondRSA) {
      motifs.push(`Ressources personnelles sous le plafond (RSA d'une personne seule : ${formatEuros(plafondRSA)}/mois).`);
    } else {
      blocages.push(
        `Ressources personnelles (${formatEuros(ressourcesMensuelles)}/mois) supérieures au plafond : RSA d'une personne seule (${formatEuros(plafondRSA)}/mois).`
      );
    }

    const eligible = blocages.length === 0;
    const montantJournalier = montantJournalierAti(revenuN1, revenuN2);

    return {
      eligible,
      motifs,
      blocages,
      montantJournalier,
      montantMensuel: (montantJournalier * 365) / 12,
      montantTotal: montantJournalier * DUREE_JOURS,
    };
  }, [activiteMois, revenuN1, revenuN2, ressourcesMensuelles, typeCessation, plafondRSA]);

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Estimer votre allocation chômage (ATI)',
    description:
      'Vérifiez votre éligibilité à l\'Allocation des Travailleurs Indépendants et estimez le montant perçu pendant 6 mois.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Indiquer la durée d\'activité',
        text: 'Saisissez la durée totale de votre activité non salariée en mois (seuil légal : 24 mois).',
      },
      {
        '@type': 'HowToStep',
        name: 'Saisir vos revenus des 2 dernières années',
        text: 'Indiquez vos revenus d\'activité de chacune des 2 dernières années (seuil : 10 000 euros sur l\'une des deux).',
      },
      {
        '@type': 'HowToStep',
        name: 'Choisir le type de cessation',
        text: 'Sélectionnez la raison de la cessation : liquidation judiciaire, redressement avec remplacement, ou activité non viable.',
      },
      {
        '@type': 'HowToStep',
        name: 'Renseigner vos ressources',
        text: 'Indiquez vos ressources personnelles mensuelles : le plafond est le RSA d\'une personne seule, quelle que soit la taille du foyer.',
      },
      {
        '@type': 'HowToStep',
        name: 'Lire le résultat',
        text: 'L\'outil affiche votre éligibilité, les conditions remplies ou bloquantes, et le montant estimé (de 19,73 à 26,30 euros/jour pendant 182 jours selon vos revenus).',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Estimateur ATI' },
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
      <Link
        href="/outils"
        className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Estimateur ATI — chômage des indépendants
      </h1>
      <p className="mt-3 text-base text-navy/70">
        L&apos;<strong>Allocation des Travailleurs Indépendants</strong>{' '}
        (ATI) est une aide forfaitaire de France Travail versée aux
        indépendants ayant involontairement cessé leur activité. Cet
        outil vérifie vos conditions d&apos;éligibilité officielles.
      </p>

      <div className="glass mt-8 space-y-4 p-6 sm:p-8">
        <label className="block text-sm text-navy">
          Durée totale d&apos;activité non salariée (en mois)
          <input
            type="number"
            min={0}
            value={activiteMois}
            onChange={(e) => setActiviteMois(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          />
          <span className="mt-1 block text-[11px] text-navy/55">
            Seuil légal : 24 mois continus au titre d&apos;une seule et même entreprise.
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-navy">
            Revenus d&apos;activité de l&apos;an dernier (€)
            <input
              type="number"
              min={0}
              value={revenuN1}
              onChange={(e) => setRevenuN1(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
          </label>
          <label className="block text-sm text-navy">
            Revenus d&apos;activité de l&apos;année d&apos;avant (€)
            <input
              type="number"
              min={0}
              value={revenuN2}
              onChange={(e) => setRevenuN2(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
          </label>
        </div>
        <span className="-mt-2 block text-[11px] text-navy/55">
          Seuil : 10 000 € sur l&apos;une des 2 années (7 500 € à Mayotte). Revenus déclarés à l&apos;administration fiscale ; le montant de l&apos;ATI dépend de leur moyenne.
        </span>

        <label className="block text-sm text-navy">
          Type de cessation d&apos;activité
          <select
            value={typeCessation}
            onChange={(e) => setTypeCessation(e.target.value as TypeCessation)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          >
            <option value="liquidation">Liquidation judiciaire</option>
            <option value="redressement-remplacement">Redressement avec plan imposant remplacement du dirigeant</option>
            <option value="non-viable">Activité économiquement non viable (baisse revenu ≥ 30 %)</option>
            <option value="autre">Autre (cessation volontaire, rupture conventionnelle, etc.)</option>
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-navy">
            Nombre de personnes dans le foyer
            <input
              type="number"
              min={1}
              value={foyer}
              onChange={(e) => setFoyer(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
            <span className="mt-1 block text-[11px] text-navy/55">
              Sans effet sur le calcul : pour l&apos;ATI, le plafond est celui d&apos;une personne seule, quelle que soit la taille du foyer.
            </span>
          </label>
          <label className="block text-sm text-navy">
            Vos ressources personnelles mensuelles (€)
            <input
              type="number"
              min={0}
              value={ressourcesMensuelles}
              onChange={(e) => setRessourcesMensuelles(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
            <span className="mt-1 block text-[11px] text-navy/55">
              Plafond : RSA d&apos;une personne seule, {formatEuros(plafondRSA)}/mois depuis le 1er avril 2026 (les revenus du conjoint ne comptent pas).
            </span>
          </label>
        </div>

        <div
          className={`rounded-2xl border p-5 ${
            result.eligible
              ? 'border-vert/30 bg-vert/10'
              : 'border-rouge/30 bg-rouge/10'
          }`}
        >
          <p className={`font-display text-lg ${result.eligible ? 'text-vert' : 'text-rouge'}`}>
            {result.eligible ? 'Éligibilité probable à l\'ATI' : 'Blocages identifiés'}
          </p>

          {result.motifs.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase text-vert">✓ Conditions remplies</p>
              <ul className="mt-1 space-y-1 text-sm text-navy/80">
                {result.motifs.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          )}

          {result.blocages.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase text-rouge">✗ Blocages</p>
              <ul className="mt-1 space-y-1 text-sm text-navy/80">
                {result.blocages.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </div>
          )}

          {result.eligible && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/80 p-3 text-center">
                <p className="text-[11px] uppercase text-navy/55">Montant / jour</p>
                <p className="mt-1 font-display text-lg text-navy">{formatEurosCentimes(result.montantJournalier)}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 text-center">
                <p className="text-[11px] uppercase text-navy/55">Montant / mois</p>
                <p className="mt-1 font-display text-lg text-navy">{formatEuros(result.montantMensuel)}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 text-center">
                <p className="text-[11px] uppercase text-navy/55">Sur 6 mois</p>
                <p className="mt-1 font-display text-lg text-vert">{formatEuros(result.montantTotal)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">Comment demander l&apos;ATI</p>
        <ol className="mt-2 space-y-1.5 pl-5">
          <li>
            <strong>1.</strong> Inscrivez-vous à France Travail dès la cessation d&apos;activité (au plus tard dans les 12 mois). Conseiller France Travail : 39 49.
          </li>
          <li>
            <strong>2.</strong> Joignez le jugement de liquidation (ou le plan de redressement), vos avis d&apos;imposition, la déclaration de cessation d&apos;activité.
          </li>
          <li>
            <strong>3.</strong> La demande se fait en ligne sur{' '}
            <a
              href="https://chomage-independant.francetravail.fr"
              target="_blank"
              rel="noreferrer"
              className="text-bleu-fonce underline"
            >
              chomage-independant.francetravail.fr
            </a>
            .
          </li>
          <li>
            <strong>4.</strong> L&apos;ATI peut être cumulée avec une nouvelle activité pendant 3 mois au plus ; au-delà, elle est suspendue. À Mayotte, elle va de 13,15 à 19,73 €/jour.
          </li>
        </ol>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources officielles : Code du travail art. L5424-24 à L5424-26 et R5424-69 à R5424-72 (plafond de ressources : R5424-70, 4°) ;
        décret n° 2019-796 ; loi n° 2022-172 du 14 février 2022 et décret n° 2022-450 du 30 mars 2022 ;
        www.francetravail.fr et www.unedic.org (fiche ATI) ; décret n° 2026-220 du 30 mars 2026 (RSA).
      </p>
    </section>
  );
}
