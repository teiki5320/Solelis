'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// Barèmes AJ 2026 — circulaire du 16 janvier 2026
// Source : www.service-public.gouv.fr (fiche F18074) / loi 91-647 / décret 2020-1717
// RFR annuel de référence (personne seule) pour :
// - AJ totale : ≤ 12 957 €
// - AJ partielle 55 % : 12 958 à 15 316 €
// - AJ partielle 25 % : 15 317 à 19 433 €
// Majorations : +2 332 € par personne à charge (2 premières), +1 473 € au-delà

const PLAFOND_TOTAL = 12957;
const PLAFOND_55 = 15316;
const PLAFOND_25 = 19433;
const MAJORATION_2_PREMIERES = 2332;
const MAJORATION_SUIVANTES = 1473;

function plafondMajore(base: number, personnesACharge: number): number {
  const p = Math.max(0, personnesACharge);
  const m2 = Math.min(p, 2) * MAJORATION_2_PREMIERES;
  const reste = Math.max(0, p - 2) * MAJORATION_SUIVANTES;
  return base + m2 + reste;
}

function formatEuros(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

type Taux = 100 | 55 | 25 | 0;

export default function AidejuridictionnellePage() {
  const [rfr, setRfr] = useState<number>(0);
  const [personnesACharge, setPersonnesACharge] = useState<number>(0);
  const [patrimoineMobilier, setPatrimoineMobilier] = useState<number>(0);
  const [patrimoineImmobilier, setPatrimoineImmobilier] = useState<number>(0);

  const plafonds = useMemo(() => {
    return {
      total: plafondMajore(PLAFOND_TOTAL, personnesACharge),
      partielle55: plafondMajore(PLAFOND_55, personnesACharge),
      partielle25: plafondMajore(PLAFOND_25, personnesACharge),
    };
  }, [personnesACharge]);

  // Plafonds de patrimoine 2026 (service-public.gouv.fr, fiche F18074)
  // Mobilier : même montant que le plafond de l'AJ totale + majorations
  // Immobilier hors résidence principale : 38 866 € pour une personne seule
  // (majoré d'environ 6 995 € pour chacune des 2 premières personnes à charge,
  // puis d'environ 4 419 € au-delà)
  const plafondMobilier = plafondMajore(PLAFOND_TOTAL, personnesACharge);
  const plafondImmobilier =
    38866 + Math.min(Math.max(0, personnesACharge), 2) * 6995 + Math.max(0, personnesACharge - 2) * 4419;

  const result = useMemo<{ taux: Taux; motif: string; restePayer: string }>(() => {
    // Si patrimoine dépasse un plafond → exclu
    if (patrimoineMobilier > plafondMobilier) {
      return {
        taux: 0,
        motif: `Patrimoine mobilier (${formatEuros(patrimoineMobilier)}) supérieur au plafond (${formatEuros(plafondMobilier)}).`,
        restePayer: '',
      };
    }
    if (patrimoineImmobilier > plafondImmobilier) {
      return {
        taux: 0,
        motif: `Patrimoine immobilier hors résidence principale (${formatEuros(patrimoineImmobilier)}) supérieur au plafond (${formatEuros(plafondImmobilier)}).`,
        restePayer: '',
      };
    }
    if (rfr <= plafonds.total) {
      return { taux: 100, motif: "Vous êtes dans le plafond de l'aide juridictionnelle totale.", restePayer: "0 € — l'État prend en charge intégralement vos honoraires d'avocat." };
    }
    if (rfr <= plafonds.partielle55) {
      return { taux: 55, motif: "Aide juridictionnelle partielle à 55 %.", restePayer: "L'État prend en charge 55 % des honoraires, vous réglez les 45 % restants (honoraire conventionné)." };
    }
    if (rfr <= plafonds.partielle25) {
      return { taux: 25, motif: "Aide juridictionnelle partielle à 25 %.", restePayer: "L'État prend en charge 25 %, vous réglez les 75 % restants." };
    }
    return { taux: 0, motif: `RFR (${formatEuros(rfr)}) supérieur au plafond maximal pour votre foyer (${formatEuros(plafonds.partielle25)}).`, restePayer: '' };
  }, [rfr, plafonds, patrimoineMobilier, patrimoineImmobilier, plafondMobilier, plafondImmobilier]);

  const STYLE_TAUX: Record<Taux, string> = {
    100: 'bg-vert/10 border-vert/30 text-vert',
    55: 'bg-bleu/10 border-bleu/30 text-bleu-fonce',
    25: 'bg-jaune/15 border-jaune/40 text-jaune',
    0: 'bg-rouge/10 border-rouge/30 text-rouge',
  };

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Vérifier votre éligibilité à l\'aide juridictionnelle',
    description:
      'Déterminez si vous pouvez bénéficier de l\'aide juridictionnelle (totale ou partielle) selon vos revenus, votre patrimoine et la composition de votre foyer.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Saisir le Revenu Fiscal de Référence',
        text: 'Indiquez votre RFR annuel, disponible sur votre dernier avis d\'imposition.',
      },
      {
        '@type': 'HowToStep',
        name: 'Indiquer les personnes à charge',
        text: 'Renseignez le nombre de personnes à charge (conjoint, enfants, ascendants) pour ajuster les plafonds.',
      },
      {
        '@type': 'HowToStep',
        name: 'Renseigner le patrimoine',
        text: 'Indiquez votre patrimoine mobilier et immobilier (hors résidence principale) pour vérifier les plafonds.',
      },
      {
        '@type': 'HowToStep',
        name: 'Lire le résultat',
        text: 'L\'outil affiche votre taux de prise en charge (100 %, 55 %, 25 % ou non éligible) et le reste à votre charge.',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Aide juridictionnelle' },
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
        Aide juridictionnelle — éligibilité
      </h1>
      <p className="mt-3 text-base text-navy/70">
        L&apos;aide juridictionnelle prend en charge, totalement ou en
        partie, les honoraires d&apos;avocat et les frais de procédure.
        Barèmes 2026 officiels (circulaire du 16 janvier 2026) basés sur le Revenu Fiscal de Référence
        (RFR) et le patrimoine.
      </p>

      <div className="glass mt-8 space-y-4 p-6 sm:p-8">
        <label className="block text-sm text-navy">
          Revenu Fiscal de Référence (RFR) annuel du foyer (€)
          <input
            type="number"
            min={0}
            value={rfr || ''}
            onChange={(e) => setRfr(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          />
          <span className="mt-1 block text-[11px] text-navy/55">
            Chiffre figurant sur votre dernier avis d&apos;imposition
            (cadre « vos références », ligne RFR).
          </span>
        </label>

        <label className="block text-sm text-navy">
          Nombre de personnes à charge
          <input
            type="number"
            min={0}
            value={personnesACharge}
            onChange={(e) => setPersonnesACharge(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          />
          <span className="mt-1 block text-[11px] text-navy/55">
            Autres personnes de votre foyer fiscal (conjoint ou partenaire de Pacs, enfants, autres personnes à charge). Majoration de {formatEuros(MAJORATION_2_PREMIERES)} pour les 2 premières, {formatEuros(MAJORATION_SUIVANTES)} ensuite.
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-navy">
            Patrimoine mobilier du foyer (€)
            <input
              type="number"
              min={0}
              value={patrimoineMobilier || ''}
              onChange={(e) => setPatrimoineMobilier(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
            <span className="mt-1 block text-[11px] text-navy/55">
              Épargne, comptes, placements. Plafond : {formatEuros(plafondMobilier)} pour votre foyer.
            </span>
          </label>
          <label className="block text-sm text-navy">
            Immobilier hors résidence principale (€)
            <input
              type="number"
              min={0}
              value={patrimoineImmobilier || ''}
              onChange={(e) => setPatrimoineImmobilier(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
            <span className="mt-1 block text-[11px] text-navy/55">
              Hors résidence principale + hors outil de travail. Plafond : {formatEuros(plafondImmobilier)}.
            </span>
          </label>
        </div>

        <div className="rounded-2xl border border-navy/10 bg-white/60 p-4 text-xs text-navy/70">
          <p className="font-medium text-navy/80">Plafonds RFR pour votre foyer (personnes à charge : {personnesACharge})</p>
          <ul className="mt-1 space-y-0.5">
            <li>• AJ totale (100 %) : RFR ≤ <strong>{formatEuros(plafonds.total)}</strong></li>
            <li>• AJ partielle 55 % : RFR entre {formatEuros(plafonds.total)} et {formatEuros(plafonds.partielle55)}</li>
            <li>• AJ partielle 25 % : RFR entre {formatEuros(plafonds.partielle55)} et {formatEuros(plafonds.partielle25)}</li>
          </ul>
        </div>

        {rfr > 0 && (
          <div className={`rounded-2xl border p-5 ${STYLE_TAUX[result.taux]}`}>
            <p className="font-display text-lg">
              {result.taux > 0 ? `Aide juridictionnelle à ${result.taux} %` : 'Non éligible'}
            </p>
            <p className="mt-2 text-sm text-navy/80">{result.motif}</p>
            {result.restePayer && (
              <p className="mt-2 text-sm text-navy/75">
                <strong>Reste à votre charge :</strong> {result.restePayer}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">Comment la demander</p>
        <ol className="mt-2 space-y-1.5 pl-5">
          <li>
            <strong>1.</strong> Faites la demande en ligne ou avec le formulaire cerfa (n°16146) disponible sur{' '}
            <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F18074" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">
              service-public.fr
            </a>
            .
          </li>
          <li>
            <strong>2.</strong> Joignez : avis d&apos;imposition, RIB, pièce
            d&apos;identité, justificatif de patrimoine, documents de la
            procédure concernée.
          </li>
          <li>
            <strong>3.</strong> Déposez-la au Bureau de l&apos;Aide
            Juridictionnelle (BAJ) du tribunal judiciaire de votre domicile
            (ou de celui où l&apos;affaire est déjà engagée).
            Aucun délai n&apos;est fixé : la décision est notifiée « dans les
            meilleurs délais ». Si une audience approche avant la décision,
            demandez l&apos;aide juridictionnelle provisoire.
          </li>
          <li>
            <strong>4.</strong> Vous pouvez choisir votre avocat (s&apos;il
            accepte l&apos;AJ) ou en laisser le choix au bâtonnier.
          </li>
        </ol>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources officielles : Loi n°91-647 du 10 juillet 1991, décret
        n°2020-1717 du 28 décembre 2020, service-public.fr (fiche F18074).
        Plafonds 2026 (circulaire du 16 janvier 2026), revalorisés chaque année — vérifiez le barème en vigueur sur www.service-public.gouv.fr.
      </p>
    </section>
  );
}
