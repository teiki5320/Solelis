'use client';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

interface Levier {
  titre: string;
  description: string;
  source: string;
  niveau: 'cle' | 'utile';
}

function buildLeviers(r: Reponses, c: CompanyData, s: SectorInfo): Levier[] {
  const leviers: Levier[] = [];

  // Loyer impayé : commandement de payer + suspension judiciaire
  leviers.push({
    titre: 'Suspension judiciaire de la clause résolutoire (jusqu\'à 24 mois)',
    description:
      "Si le bailleur a délivré un commandement de payer visant la clause résolutoire, vous disposez de 1 mois pour régler. Le juge (en référé ou au fond) peut accorder des délais de paiement jusqu'à 24 mois et suspendre les effets de la clause résolutoire, tant que la résiliation n'a pas été constatée par une décision définitive. Depuis la loi n° 2026-403 du 26 mai 2026, pour des loyers impayés, ces délais dépendent de votre capacité à régler la dette et de la reprise du paiement intégral du loyer courant avant la première audience.",
    source: "C. com. art. L145-41 (modifié par la loi n° 2026-403 du 26 mai 2026) ; C. civ. art. 1343-5",
    niveau: 'cle',
  });

  // Triennale - droit de résiliation
  leviers.push({
    titre: 'Résiliation triennale (3-6-9)',
    description:
      "Vous pouvez donner congé à chaque échéance triennale, au moins 6 mois à l'avance, par lettre recommandée avec avis de réception ou par acte de commissaire de justice. Une clause contraire n'est possible que pour les baux de plus de 9 ans, les locaux construits pour une seule utilisation, à usage exclusif de bureaux ou de stockage.",
    source: "C. com. art. L145-4 ; loi Pinel n° 2014-626",
    niveau: 'cle',
  });

  // Renégociation - état des lieux du marché
  leviers.push({
    titre: 'Demande de révision triennale du loyer',
    description:
      "Tous les 3 ans, le loyer peut être révisé à la hausse ou à la baisse selon l'évolution de l'ILC ou de l'ILAT (plafonnement légal). En cas de baisse manifeste de la valeur locative, vous pouvez demander une diminution.",
    source: "C. com. art. L145-37 et L145-38",
    niveau: 'utile',
  });

  // Indemnité d'éviction
  leviers.push({
    titre: 'Indemnité d\'éviction si refus de renouvellement',
    description:
      "Si le bailleur refuse le renouvellement sans motif grave et légitime, il vous doit une indemnité d'éviction égale au préjudice causé : notamment la valeur marchande du fonds de commerce, augmentée éventuellement des frais de déménagement et de réinstallation et des frais et droits de mutation pour un fonds de même valeur (sauf si le bailleur prouve que le préjudice est moindre).",
    source: "C. com. art. L145-14 et L145-17",
    niveau: 'cle',
  });

  // Procédure collective : protection du bail
  if (r.situation === 'redressement' || r.situation === 'assignation') {
    leviers.push({
      titre: 'Le bail est protégé par la procédure collective',
      description:
        "L'ouverture d'un redressement ou d'une sauvegarde gèle l'action en résiliation du bail pour loyers antérieurs au jugement ; pour des loyers postérieurs impayés, le bailleur ne peut agir qu'après un délai de 3 mois suivant le jugement. Le bail peut être cédé dans le cadre d'un plan de cession (L642-7), même malgré une clause d'agrément.",
      source: "C. com. art. L622-14, L622-21 et L642-7",
      niveau: 'cle',
    });
  }

  // Déspécialisation
  leviers.push({
    titre: 'Déspécialisation pour adapter votre activité',
    description:
      "Vous pouvez demander à étendre l'activité prévue au bail (déspécialisation partielle) ou à la changer complètement (plénière) si elle n'est plus rentable. C'est une voie souvent négligée pour rebondir sans changer de local.",
    source: "C. com. art. L145-47 à L145-55",
    niveau: 'utile',
  });

  // Médiation des entreprises
  leviers.push({
    titre: 'Médiation des entreprises (gratuite, confidentielle)',
    description:
      "Si le dialogue est rompu avec votre bailleur, saisissez gratuitement le Médiateur des entreprises : la médiation est confidentielle et chacun reste libre d’accepter ou non un accord.",
    source: "economie.gouv.fr/mediateur-des-entreprises",
    niveau: 'utile',
  });

  return leviers;
}

const STYLES = {
  cle: 'border-rouge/30 bg-rouge/5',
  utile: 'border-bleu/20 bg-bleu/5',
} as const;

const LABELS = {
  cle: 'Levier majeur',
  utile: 'Levier utile',
} as const;

export default function BlocBailCommercial() {
  const { reponses, company, sector } = useFiche();
  // On affiche pour les secteurs avec local commercial fort
  const secteursAvecLocal = ['commerce', 'hotellerie', 'artisanat', 'liberal', 'sante', 'culture-sport'];
  const pertinent =
    secteursAvecLocal.includes(sector.secteur) ||
    reponses.probleme === 'fournisseurs' ||
    reponses.situation === 'tresorie' ||
    reponses.situation === 'redressement';

  if (!pertinent) return null;

  const leviers = buildLeviers(reponses, company, sector);

  return (
    <BlocAccordeon
      icone="🔑"
      titre="Bail commercial — leviers de négociation"
      soustitre={`${leviers.length} dispositifs légaux à votre disposition`}
    >
      <p className="mb-4 text-sm text-navy/80">
        Le loyer commercial est souvent l&apos;une des premières charges
        fixes. Le statut des baux commerciaux (décret du 30 sept. 1953, codifié
        L145-1 et s. C. com.) offre plusieurs leviers méconnus pour
        renégocier, suspendre ou se libérer.
      </p>

      <div className="space-y-3">
        {leviers.map((l, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 ${STYLES[l.niveau]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-base text-navy">{l.titre}</p>
              <span
                className={`pastille shrink-0 text-[10px] ${
                  l.niveau === 'cle' ? 'bg-rouge/15 text-rouge' : 'bg-bleu/15 text-bleu-fonce'
                }`}
              >
                {LABELS[l.niveau]}
              </span>
            </div>
            <p className="mt-2 text-sm text-navy/75">{l.description}</p>
            <p className="mt-2 text-xs text-navy/55">
              <strong>Source :</strong> {l.source}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-jaune/30 bg-jaune/5 p-4 text-sm text-navy/80">
        <p className="font-display text-sm text-navy">⚠️ Délais à connaître</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Commandement de payer : <strong>1 mois</strong> pour régler avant que la clause résolutoire ne joue</li>
          <li>Saisir le juge pour obtenir des délais : <strong>de préférence avant l&apos;expiration du mois</strong>, et reprendre le paiement du loyer courant avant la première audience</li>
          <li>Préavis de résiliation triennale : <strong>6 mois</strong> avant l&apos;échéance</li>
          <li>Action en paiement de loyers : prescription de <strong>5 ans</strong></li>
          <li>Demande de révision triennale : à formuler après expiration de chaque période de 3 ans</li>
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <a
          href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000005634379/LEGISCTA000006146040/"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
        >
          <span aria-hidden>🌐</span> LegiFrance — statut des baux commerciaux
        </a>
        <a
          href="https://www.economie.gouv.fr/mediateur-des-entreprises"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
        >
          <span aria-hidden>🌐</span> Médiateur des entreprises
        </a>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Source officielle : Code de commerce, articles L145-1 à L145-60 ;
        Code civil, art. 1343-5 (délais de grâce) et 2224 (prescription de
        5 ans).
      </p>
    </BlocAccordeon>
  );
}
