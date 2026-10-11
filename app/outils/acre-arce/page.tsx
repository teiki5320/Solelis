'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// ACRE : Aide aux Créateurs et Repreneurs d'Entreprise
// Source : urssaf.fr / art. L131-6-4 CSS + décret 2019-1215
// Exonération partielle des cotisations de sécurité sociale pendant 12 mois.
// Conditions d'éligibilité (au moins l'une) :
// - Demandeur d'emploi indemnisé ou non indemnisé (inscrit depuis ≥ 6 mois dans les 18 derniers mois)
// - Bénéficiaire du RSA / ASS / PreParE
// - 18-25 ans, < 30 ans non indemnisé (durée d'activité insuffisante) ou < 30 ans handicapé
// - Salarié ou licencié d'une entreprise en sauvegarde / RJ / LJ qui la reprend
// - Contrat d'appui au projet d'entreprise (CAPE)
// - Création en QPV ou en ZFRR / ZFRR+
// - Ne pas avoir bénéficié de l'Acre dans les 3 années précédentes (urssaf.fr)
// Exonération (LFSS 2026, art. 23 ; décret n° 2026-69 du 6 février 2026) :
// - Hors micro (créations depuis le 1er janvier 2026) : exonération du QUART des
//   cotisations maladie-maternité, allocations familiales, retraite de base et
//   invalidité-décès si revenu ≤ 75 % du PASS, dégressive jusqu'à 100 % du PASS.
// - Micro (créations depuis le 1er juillet 2026) : taux de cotisations réduit de 25 %
//   jusqu'à la fin du 3e trimestre civil suivant le début d'activité.
// - Demande à l'Urssaf obligatoire dans les 60 jours suivant le début d'activité.
// Source : entreprendre.service-public.gouv.fr/vosdroits/F11677

// ARCE : Aide à la Reprise ou Création d'Entreprise
// Source : francetravail.fr / art. R5141-2 C. trav.
// Versement en capital de 60 % du reliquat des droits ARE
// Conditions :
// - Être bénéficiaire de l'ARE
// - Avoir obtenu l'ACRE
// - Créer ou reprendre une entreprise
// Montant : 60 % des droits restants (fins de contrat depuis le 1er juillet 2023),
// puis déduction de la participation de 3 % au financement des retraites
// complémentaires, calculée sur ce capital. Exemple Unédic : 40 € × 518 j ×
// 60 % = 12 432 € ; 12 432 € − 373 € (3 %) = 12 059 €.
// Source : unedic.org, fiche thématique « Aide à la reprise ou à la création
// d'entreprise (ARCE) ».
const TAUX_ARCE = 0.6;
const PARTICIPATION_RETRAITE_COMPLEMENTAIRE = 0.03;

// PASS 2026 (arrêté du 22 décembre 2025) : 48 060 €.
const PASS_2026 = 48060;
// Part approximative des cotisations visées par l'Acre (maladie, famille,
// retraite de base, invalidité-décès) dans le revenu d'un·e indépendant·e.
const PART_COTISATIONS_VISEES = 0.3;

type Statut =
  | 'demandeur-indemnise'
  | 'demandeur-6mois'
  | 'rsa-ass'
  | 'jeune-25'
  | 'licencie-rjlj'
  | 'cape'
  | 'qpv'
  | 'aucun';

function formatEuros(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

export default function AcreArcePage() {
  // Aucune situation choisie au départ : pas de verdict avant la première réponse.
  const [statut, setStatut] = useState<Statut | null>(null);
  const [microEntreprise, setMicroEntreprise] = useState(false);
  const [aAre, setAAre] = useState(false);
  // Champs vides au départ (pas de « 0 » pré-rempli) : le capital ARCE
  // n'est estimé qu'une fois les deux montants saisis.
  const [areReliquatMensuel, setAreReliquatMensuel] = useState('');
  const [areMoisRestants, setAreMoisRestants] = useState('');
  const [revenuPrevisionnel, setRevenuPrevisionnel] = useState(20000);

  const statutChoisi = statut !== null;
  const acreEligible = statutChoisi && statut !== 'aucun';

  const exoneration = useMemo(() => {
    if (!acreEligible) return { montant: 0, detail: '' };
    if (microEntreprise) {
      // Micro : taux réduit de 25 % (créations depuis le 1er juillet 2026).
      // Estimation sur un taux plein de 21,2 % (prestations de services BIC).
      const caBase = Math.max(0, revenuPrevisionnel);
      return {
        montant: Math.round(caBase * 0.212 * 0.25),
        detail: "Micro-entreprise créée depuis le 1er juillet 2026 : taux de cotisations réduit de 25 % jusqu'à la fin du 3e trimestre civil suivant le début d'activité (50 % pour les créations antérieures).",
      };
    }
    // Hors micro : exonération du quart des cotisations visées jusqu'à 75 % du
    // PASS, dégressive jusqu'à 100 % du PASS, nulle au-delà.
    const revenu = Math.max(0, revenuPrevisionnel);
    const seuilPlein = PASS_2026 * 0.75;
    let coefficient = 1;
    if (revenu >= PASS_2026) coefficient = 0;
    else if (revenu > seuilPlein) coefficient = (PASS_2026 - revenu) / (PASS_2026 - seuilPlein);
    return {
      montant: Math.round(revenu * PART_COTISATIONS_VISEES * 0.25 * coefficient),
      detail: `Exonération du quart des cotisations maladie, famille, retraite de base et invalidité-décès pendant 12 mois si votre revenu est inférieur ou égal à ${formatEuros(seuilPlein)} (75 % du PASS), dégressive jusqu'à ${formatEuros(PASS_2026)} (1 PASS 2026), nulle au-delà.`,
    };
  }, [acreEligible, microEntreprise, revenuPrevisionnel]);

  const areMensuel = Number(areReliquatMensuel);
  const areMois = Number(areMoisRestants);
  const arceRenseigne =
    areReliquatMensuel.trim() !== '' && areMoisRestants.trim() !== '' && areMensuel > 0 && areMois > 0;

  const arceMontant = useMemo(() => {
    if (!aAre || !acreEligible || !arceRenseigne) return 0;
    const reliquatTotal = areMensuel * areMois;
    const capital = reliquatTotal * TAUX_ARCE;
    return Math.round(capital * (1 - PARTICIPATION_RETRAITE_COMPLEMENTAIRE));
  }, [aAre, acreEligible, arceRenseigne, areMensuel, areMois]);

  const STATUTS: { value: Statut; label: string; description: string }[] = [
    { value: 'demandeur-indemnise', label: 'Demandeur d\'emploi indemnisé (ARE)', description: 'Inscrit à France Travail, indemnisé' },
    { value: 'demandeur-6mois', label: 'Demandeur d\'emploi inscrit ≥ 6 mois', description: 'Non indemnisé mais inscrit sur les 18 derniers mois' },
    { value: 'rsa-ass', label: 'Bénéficiaire du RSA, de l\'ASS ou de la PreParE', description: 'PreParE : prestation partagée d\'éducation de l\'enfant' },
    { value: 'jeune-25', label: 'Jeune de 18 à 25 ans (ou < 30 ans si handicap)', description: 'Ou moins de 30 ans sans ARE faute de durée d\'activité suffisante' },
    { value: 'licencie-rjlj', label: 'Salarié ou licencié d\'une entreprise en sauvegarde, RJ ou LJ', description: 'Qui reprend l\'activité de cette entreprise' },
    { value: 'cape', label: 'Contrat d\'Appui au Projet d\'Entreprise (CAPE)', description: '' },
    { value: 'qpv', label: 'Création dans un Quartier Prioritaire de la Ville (QPV) ou en zone France ruralités revitalisation (ZFRR, ZFRR+)', description: '' },
    { value: 'aucun', label: 'Aucun de ces cas', description: '' },
  ];

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Vérifier votre éligibilité ACRE/ARCE',
    description:
      'Vérifiez si vous êtes éligible à l\'ACRE (exonération de cotisations sociales) et à l\'ARCE (versement en capital de 60 % de l\'ARE restante) pour rebondir après une cessation.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Identifier votre situation d\'éligibilité ACRE',
        text: 'Sélectionnez votre situation parmi les cas d\'éligibilité : demandeur d\'emploi, bénéficiaire RSA/ASS/PreParE, jeune de 18-25 ans, salarié repreneur d\'une entreprise en sauvegarde/RJ/LJ, CAPE, création en QPV ou ZFRR.',
      },
      {
        '@type': 'HowToStep',
        name: 'Préciser le type d\'entreprise et le revenu prévisionnel',
        text: 'Indiquez si vous créez en micro-entreprise et votre revenu prévisionnel de la première année.',
      },
      {
        '@type': 'HowToStep',
        name: 'Renseigner l\'ARE pour l\'ARCE',
        text: 'Si vous percevez l\'ARE, indiquez le montant mensuel et le nombre de mois restants pour calculer le capital ARCE.',
      },
      {
        '@type': 'HowToStep',
        name: 'Lire les résultats',
        text: 'L\'outil affiche votre éligibilité ACRE (économie estimée sur 12 mois) et ARCE (montant du capital en 2 tranches).',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Vérificateur ACRE/ARCE' },
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
        Vérificateur ACRE & ARCE
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Deux dispositifs cumulables pour rebondir après une cessation :
        l&apos;<strong>ACRE</strong> (exonération de cotisations sociales pendant
        12 mois) et l&apos;<strong>ARCE</strong> (versement en capital de 60 % de
        l&apos;ARE restante).
      </p>

      <div className="glass mt-8 space-y-5 p-6 sm:p-8">
        <div>
          <p className="mb-2 font-display text-base text-navy">
            1️⃣ Votre situation correspond-elle à un cas d&apos;éligibilité ACRE ?
          </p>
          <div className="space-y-2">
            {STATUTS.map((s) => (
              <label
                key={s.value}
                className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
                  statut === s.value ? 'border-bleu bg-bleu/5' : 'border-navy/10 bg-white/60'
                }`}
              >
                <input
                  type="radio"
                  name="statut"
                  value={s.value}
                  checked={statut === s.value}
                  onChange={() => setStatut(s.value)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium text-navy">{s.label}</p>
                  {s.description && (
                    <p className="mt-0.5 text-[11px] text-navy/55">{s.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <label className="block text-sm text-navy">
          <input
            type="checkbox"
            checked={microEntreprise}
            onChange={(e) => setMicroEntreprise(e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          Je crée en micro-entreprise (auto-entrepreneur)
        </label>

        <label className="block text-sm text-navy">
          Revenu prévisionnel de la 1re année (€)
          <input
            type="number"
            min={0}
            value={revenuPrevisionnel}
            onChange={(e) => setRevenuPrevisionnel(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          />
        </label>

        <div className="border-t border-navy/10 pt-4">
          <p className="mb-2 font-display text-base text-navy">
            2️⃣ Êtes-vous bénéficiaire de l&apos;ARE (pour l&apos;ARCE) ?
          </p>
          <label className="block text-sm text-navy">
            <input
              type="checkbox"
              checked={aAre}
              onChange={(e) => setAAre(e.target.checked)}
              className="mr-2 h-4 w-4"
            />
            Oui, je perçois ou je vais percevoir l&apos;ARE (allocation de retour à l&apos;emploi)
          </label>

          {aAre && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-navy">
                Montant mensuel ARE (€)
                <input
                  type="number"
                  min={0}
                  value={areReliquatMensuel}
                  onChange={(e) => setAreReliquatMensuel(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
                />
              </label>
              <label className="block text-sm text-navy">
                Mois de droits restants
                <input
                  type="number"
                  min={0}
                  value={areMoisRestants}
                  onChange={(e) => setAreMoisRestants(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
                />
              </label>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-2xl border p-5 ${
              acreEligible ? 'border-vert/30 bg-vert/10' : 'border-navy/10 bg-white/60'
            }`}
          >
            <p className="font-display text-lg text-navy">
              {statutChoisi ? `ACRE — ${acreEligible ? 'éligible ✓' : 'non éligible'}` : 'ACRE'}
            </p>
            {!statutChoisi ? (
              <p className="mt-2 text-sm text-navy/70">
                Choisissez votre situation ci-dessus pour connaître votre éligibilité.
              </p>
            ) : acreEligible ? (
              <>
                <p className="mt-2 text-sm text-navy/80">{exoneration.detail}</p>
                <p className="mt-3 text-2xl font-display text-vert">
                  ~ {formatEuros(exoneration.montant)} économisés
                </p>
                <p className="mt-1 text-[11px] text-navy/55">
                  Estimation sur 12 mois. Le montant exact dépend du statut juridique et du revenu réel.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-navy/70">
                Aucun critère d&apos;éligibilité rempli pour l&apos;ACRE.
              </p>
            )}
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              aAre && acreEligible ? 'border-vert/30 bg-vert/10' : 'border-navy/10 bg-white/60'
            }`}
          >
            <p className="font-display text-lg text-navy">
              {statutChoisi ? `ARCE — ${aAre && acreEligible ? 'éligible ✓' : 'non éligible'}` : 'ARCE'}
            </p>
            {!statutChoisi ? (
              <p className="mt-2 text-sm text-navy/70">
                Choisissez votre situation ci-dessus pour connaître votre éligibilité.
              </p>
            ) : aAre && acreEligible && !arceRenseigne ? (
              <p className="mt-2 text-sm text-navy/70">
                Renseignez le montant mensuel de l&apos;ARE et les mois de droits restants pour estimer le capital.
              </p>
            ) : aAre && acreEligible ? (
              <>
                <p className="mt-2 text-sm text-navy/80">
                  60 % du reliquat ARE, moins la participation de 3 % au financement des retraites complémentaires (déjà déduite ci-dessous), versé en capital en 2 fois : la moitié au démarrage, l&apos;autre moitié 6 mois après si l&apos;activité se poursuit.
                </p>
                <p className="mt-3 text-2xl font-display text-vert">
                  ~ {formatEuros(arceMontant)}
                </p>
                <p className="mt-1 text-[11px] text-navy/55">
                  En contrepartie, l&apos;ARE mensuelle est interrompue.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-navy/70">
                L&apos;ARCE suppose l&apos;ACRE et le bénéfice de l&apos;ARE.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">Démarches</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>ACRE</strong> : depuis le 1er janvier 2026, demande
            obligatoire à l&apos;Urssaf (micro-entrepreneur·e·s comme autres
            statuts) au plus tard 60 jours après le début d&apos;activité.
            <a href="https://www.urssaf.fr/accueil/exoneration-acre-createur.html" target="_blank" rel="noreferrer" className="ml-1 text-bleu-fonce underline">urssaf.fr</a>
          </li>
          <li>
            <strong>ARCE</strong> : demande à France Travail avec
            justificatif de création et attestation d&apos;ACRE.
            <a href="https://www.francetravail.fr" target="_blank" rel="noreferrer" className="ml-1 text-bleu-fonce underline">francetravail.fr</a>
          </li>
          <li>
            <strong>Alternative</strong> à l&apos;ARCE : maintien de l&apos;ARE
            cumulée avec les revenus d&apos;activité (souvent plus avantageux sur la durée).
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources : Code de la sécurité sociale art. L131-6-4 et D131-6-1 ;
        décret n° 2026-69 du 6 février 2026 (ACRE) ; Code du travail
        art. R5141-2 (ARCE) ; www.service-public.gouv.fr, www.urssaf.fr,
        www.francetravail.fr et www.unedic.org. PASS 2026 : 48 060 € (arrêté du 22 décembre 2025).
      </p>
    </section>
  );
}
