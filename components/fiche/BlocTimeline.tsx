'use client';
import { useFiche } from '@/lib/FicheContext';
import type { Reponses } from '@/lib/types';
import BlocAccordeon from './BlocAccordeon';

interface Etape {
  jour: string;
  titre: string;
  description: string;
  niveau: 'passe' | 'present' | 'urgent' | 'futur';
}

function etapesAssignation(): Etape[] {
  return [
    {
      jour: 'J-0',
      titre: 'Réception de l\'assignation',
      description:
        "L'huissier vous remet l'assignation. À partir de maintenant, les délais courent.",
      niveau: 'present',
    },
    {
      jour: 'J+2 à 5',
      titre: 'Prise de contact avocat',
      description:
        "Rendez-vous avec un avocat en droit des entreprises en difficulté. Ne restez pas seul·e à gérer — même une consultation de 30 min éclaire la stratégie.",
      niveau: 'urgent',
    },
    {
      jour: 'J+7 à 15',
      titre: 'Audience de comparution',
      description:
        "Date fixée dans l'assignation. Vous pouvez vous présenter seul·e ou assisté·e/représenté·e par un·e avocat·e. Se présenter est crucial.",
      niveau: 'urgent',
    },
    {
      jour: 'J+15 à 45',
      titre: 'Délibéré / jugement',
      description:
        "Le tribunal rend sa décision (souvent : ouverture d'une procédure collective, rejet de la demande, ou renvoi).",
      niveau: 'futur',
    },
    {
      jour: 'Après jugement',
      titre: 'Notification et publication',
      description:
        "Le jugement est notifié puis publié au BODACC. Possibilité d'appel dans les 10 jours suivant la notification (C. com. R661-3).",
      niveau: 'futur',
    },
  ];
}

function etapesRedressement(): Etape[] {
  return [
    {
      jour: 'Aujourd\'hui',
      titre: 'État de cessation des paiements constaté',
      description:
        "Vous êtes dans l'impossibilité de faire face au passif exigible avec l'actif disponible.",
      niveau: 'present',
    },
    {
      jour: 'Sous 45 jours max',
      titre: 'Déclaration au tribunal (OBLIGATOIRE)',
      description:
        "L'article L631-4 du Code de commerce impose de déclarer la cessation dans les 45 jours. Au-delà, votre responsabilité personnelle peut être engagée.",
      niveau: 'urgent',
    },
    {
      jour: '+ 7 à 15 j',
      titre: 'Jugement d\'ouverture',
      description:
        "Ouverture d'une procédure de redressement ou de liquidation. Désignation d'un mandataire judiciaire et d'un administrateur.",
      niveau: 'futur',
    },
    {
      jour: '+ 6 mois',
      titre: 'Fin de la période d\'observation',
      description:
        "La période d'observation initiale est de 6 mois, renouvelable. Le tribunal décide : plan de continuation, plan de cession, ou liquidation.",
      niveau: 'futur',
    },
    {
      jour: 'Plan : + 10 ans max',
      titre: 'Plan de redressement adopté',
      description:
        "Un plan d'apurement du passif peut s'étaler sur 10 ans. Les créanciers sont payés selon l'échéancier prévu.",
      niveau: 'futur',
    },
  ];
}

function etapesPrevention(): Etape[] {
  return [
    {
      jour: 'Aujourd\'hui',
      titre: 'Vous anticipez — c\'est la bonne décision',
      description:
        "Les dispositifs amiables sont ouverts : le mandat ad hoc tant que vous n'êtes pas en cessation des paiements, la conciliation jusqu'à 45 jours après la cessation (art. L611-3 et L611-4 C. com.).",
      niveau: 'present',
    },
    {
      jour: 'Semaines 1 à 2',
      titre: 'Premier RDV confidentiel',
      description:
        "Prenez rendez-vous avec la CCI, le CIP, ou un avocat/mandataire. Ce premier échange est gratuit et confidentiel.",
      niveau: 'urgent',
    },
    {
      jour: 'Semaines 2 à 4',
      titre: 'Requête mandat ad hoc ou conciliation',
      description:
        "Si pertinent, déposez la requête au Président du tribunal. Le mandataire ad hoc est désigné en quelques jours, confidentiel.",
      niveau: 'futur',
    },
    {
      jour: '+ 3 à 5 mois',
      titre: 'Négociation avec les créanciers',
      description:
        "Sous l'égide du mandataire, vous renégociez les dettes avec vos principaux créanciers. La conciliation peut durer jusqu'à 4 mois (prolongeable 1 mois).",
      niveau: 'futur',
    },
    {
      jour: '+ 6 mois',
      titre: 'Accord ou bascule en procédure collective',
      description:
        "Soit un accord est trouvé (en conciliation, il peut être constaté ou homologué par le tribunal), soit la situation s'aggrave et il faut basculer en redressement. Agir tôt donne plus d'options.",
      niveau: 'futur',
    },
  ];
}

function etapesTresorerie(): Etape[] {
  return [
    {
      jour: 'Aujourd\'hui',
      titre: 'Tension de trésorerie identifiée',
      description:
        "Vous gérez l'activité mais l'équilibre devient fragile. Agir maintenant évite une bascule en cessation des paiements.",
      niveau: 'present',
    },
    {
      jour: 'Semaine 1',
      titre: 'Prévisionnel de trésorerie à 3 mois',
      description:
        "Chiffrez précisément vos entrées/sorties sur 90 jours avec votre expert-comptable. C'est le document qui justifiera vos demandes de délais.",
      niveau: 'urgent',
    },
    {
      jour: 'Semaines 1-2',
      titre: 'Demandes de délais (URSSAF, SIE, fournisseurs, banque)',
      description:
        "Utilisez les modèles de courriers de Solelis. La plupart des demandes argumentées aboutissent à un accord partiel ou total.",
      niveau: 'urgent',
    },
    {
      jour: 'Semaine 2-3',
      titre: 'Saisine médiation du crédit',
      description:
        "Si votre banque refuse de discuter, saisissez gratuitement la médiation du crédit (réponse sous 5 jours).",
      niveau: 'futur',
    },
    {
      jour: '+ 1 mois',
      titre: 'Point de situation',
      description:
        "Évaluez avec votre expert-comptable : si les tensions persistent, envisager un mandat ad hoc avant de basculer en cessation des paiements.",
      niveau: 'futur',
    },
  ];
}

function getEtapes(r: Reponses): { titre: string; etapes: Etape[] } {
  switch (r.situation) {
    case 'assignation':
      return { titre: 'Après une assignation', etapes: etapesAssignation() };
    case 'redressement':
      return { titre: 'Procédure de redressement', etapes: etapesRedressement() };
    case 'prevention':
      return { titre: 'Parcours préventif', etapes: etapesPrevention() };
    case 'tresorie':
      return { titre: 'Sortie de tension de trésorerie', etapes: etapesTresorerie() };
    default:
      return { titre: 'Parcours', etapes: etapesPrevention() };
  }
}

const STYLES: Record<Etape['niveau'], { line: string; dot: string; bg: string; text: string }> = {
  passe: { line: 'bg-navy/20', dot: 'bg-navy/40', bg: 'bg-navy/5', text: 'text-navy/60' },
  present: { line: 'bg-bleu', dot: 'bg-bleu', bg: 'bg-bleu/10', text: 'text-bleu-fonce' },
  urgent: { line: 'bg-rouge', dot: 'bg-rouge', bg: 'bg-rouge/5', text: 'text-rouge' },
  futur: { line: 'bg-navy/15', dot: 'bg-navy/25', bg: 'bg-white/60', text: 'text-navy' },
};

export default function BlocTimeline() {
  const { reponses } = useFiche();
  const { titre, etapes } = getEtapes(reponses);

  return (
    <BlocAccordeon
      icone="🗓️"
      titre={`Déroulé juridique · ${titre}`}
      soustitre={`${etapes.length} étapes · repères légaux`}
    >
      <ol className="relative ml-3 space-y-4 border-l border-navy/15 pl-6">
        {etapes.map((e, i) => {
          const style = STYLES[e.niveau];
          return (
            <li key={i} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[31px] top-1.5 block h-3 w-3 rounded-full ring-4 ring-white ${style.dot}`}
              />
              <div className={`rounded-2xl border p-4 ${style.bg} border-navy/10`}>
                <p className={`text-xs font-semibold uppercase tracking-wide ${style.text}`}>
                  {e.jour}
                </p>
                <p className="mt-1 font-display text-base text-navy">{e.titre}</p>
                <p className="mt-1 text-sm text-navy/75">{e.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-xs text-navy/50">
        Ces délais sont indicatifs et dépendent du tribunal et de la
        complexité du dossier. Un avocat peut préciser votre cas.
      </p>
    </BlocAccordeon>
  );
}
