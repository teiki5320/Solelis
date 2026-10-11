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
      "Si le bailleur a délivré un commandement de payer visant la clause résolutoire, vous disposez de 1 mois pour régler. À défaut, vous pouvez saisir le juge des référés qui peut accorder des délais de paiement jusqu'à 24 mois et suspendre les effets de la clause résolutoire pendant ce temps. C'est une bouée de sauvetage très puissante.",
    source: "C. com. art. L145-41 ; C. civ. art. 1343-5",
    niveau: 'cle',
  });

  // Triennale - droit de résiliation
  leviers.push({
    titre: 'Résiliation triennale (3-6-9)',
    description:
      "Sauf clause contraire (interdite dans les baux conclus depuis la loi Pinel 2014 pour les baux de moins de 9 ans), vous pouvez résilier à chaque échéance triennale moyennant un préavis de 6 mois par acte d'huissier ou LRAR.",
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
    titre: 'Indemnité d\'éviction si congé non motivé du bailleur',
    description:
      "Si le bailleur refuse le renouvellement sans motif grave et légitime, il vous doit une indemnité d'éviction couvrant : valeur du fonds de commerce, frais de réinstallation, indemnité de licenciement éventuel. Souvent supérieure à plusieurs années de loyer.",
    source: "C. com. art. L145-14",
    niveau: 'cle',
  });

  // Procédure collective : protection du bail
  if (r.situation === 'redressement' || r.situation === 'assignation') {
    leviers.push({
      titre: 'Le bail est protégé par la procédure collective',
      description:
        "L'ouverture d'un redressement ou d'une sauvegarde gèle l'action en résiliation du bail pour loyers antérieurs au jugement. Le bail peut être cédé dans le cadre d'un plan de cession (L642-7), même malgré une clause d'agrément.",
      source: "C. com. art. L622-13 et L642-7",
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
      "Si le dialogue est rompu avec votre bailleur, saisissez gratuitement le Médiateur des entreprises. Taux d'accord supérieur à 75 %. Plus rapide qu'un contentieux.",
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
        fixes. Le statut des baux commerciaux (loi du 30 sept. 1953, codifiée
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
          <li>Saisir le juge des référés : à faire <strong>avant l&apos;expiration du mois</strong></li>
          <li>Préavis de résiliation triennale : <strong>6 mois</strong> avant l&apos;échéance</li>
          <li>Action en paiement de loyers : prescription de <strong>5 ans</strong></li>
          <li>Demande de révision triennale : à formuler après expiration de chaque période de 3 ans</li>
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <a
          href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000005634379/LEGISCTA000006149846/"
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
        Code civil, art. 1343-5 (délais de grâce).
      </p>
    </BlocAccordeon>
  );
}
