'use client';
import type { Reponses } from '@/lib/types';
import { useFiche } from '@/lib/FicheContext';
import { getTribunalCompetent } from '@/lib/strategie';
import BlocAccordeon from './BlocAccordeon';

interface Alerte {
  texte: string;
  detail: string;
  urgence: 'info' | 'attention';
}

export function buildAlertes(
  r: Reponses,
  age: number | null,
  seuils: { cse: boolean; obligations50: boolean },
  tribunal = 'le tribunal',
): Alerte[] {
  const alertes: Alerte[] = [];

  if (r.probleme === 'urssaf') {
    alertes.push({
      texte: 'Les cotisations URSSAF se prescrivent par 3 ans',
      detail:
        'Si vous avez des dettes URSSAF datant de plus de 3 ans, elles sont potentiellement prescrites. Vérifiez les dates exactes avec un avocat — cela pourrait réduire significativement votre dette.',
      urgence: 'attention',
    });
    alertes.push({
      texte: 'Vous avez 2 mois pour contester une mise en demeure URSSAF',
      detail:
        'À compter de la réception de la mise en demeure, vous disposez de 2 mois pour saisir la Commission de Recours Amiable (CRA). Passé ce délai, la contestation est beaucoup plus difficile.',
      urgence: 'attention',
    });
  }

  if (r.probleme === 'impots') {
    alertes.push({
      texte: 'Dettes fiscales : reprise 3 ans, recouvrement 4 ans',
      detail:
        'Le délai de reprise de l\'administration fiscale est de 3 ans pour l\'impôt sur le revenu, l\'IS et la TVA (articles L169 et L176 du Livre des procédures fiscales). Une fois l\'impôt mis en recouvrement, le comptable public dispose de 4 ans pour agir (article L274) — au-delà, la dette est prescrite.',
      urgence: 'info',
    });
  }

  if (r.situation === 'redressement' || r.situation === 'assignation') {
    alertes.push({
      texte: 'Vous avez 45 jours pour déclarer la cessation des paiements',
      detail:
        'L\'article L631-4 du Code de commerce impose de demander l\'ouverture d\'une procédure dans les 45 jours qui suivent la cessation des paiements, sauf si une conciliation a été demandée dans ce délai. L\'omettre sciemment expose à une interdiction de gérer (art. L653-8 C. com.).',
      urgence: 'attention',
    });
  }

  if (r.situation === 'assignation') {
    alertes.push({
      texte: 'Respectez les délais de comparution du tribunal',
      detail:
        `Une assignation devant ${tribunal} contient une date de comparution. Si vous ne vous présentez pas et ne vous faites pas représenter, un jugement peut être rendu par défaut — souvent en votre défaveur.`,
      urgence: 'attention',
    });
  }

  if (r.effectif === 'salaries') {
    alertes.push({
      texte: 'Les salaires ont un super-privilège',
      detail:
        'En cas de procédure collective, les 60 derniers jours de salaires sont garantis par l\'AGS et bénéficient d\'un super-privilège. Vos salariés seront payés — mais vous devez déclarer rapidement.',
      urgence: 'info',
    });
  }

  if (age !== null && age < 2) {
    alertes.push({
      texte: 'Votre entreprise a moins de 2 ans — des protections spécifiques existent',
      detail:
        'Les entreprises de moins de 2 ans peuvent bénéficier de dispositifs spécifiques : exonération ACRE la première année, prêts d\'honneur (Initiative France, Réseau Entreprendre), garanties Bpifrance sur les prêts bancaires.',
      urgence: 'info',
    });
  }

  if (seuils.cse) {
    alertes.push({
      texte: 'Avec 11+ salariés, le CSE doit être informé en cas de difficulté',
      detail:
        'Le Code du travail impose d\'informer le CSE en cas de difficulté économique. Ne pas le faire peut engager votre responsabilité. C\'est aussi un allié : le CSE peut déclencher un droit d\'alerte économique.',
      urgence: 'attention',
    });
  }

  if (seuils.obligations50) {
    alertes.push({
      texte: 'Avec 50+ salariés, des obligations renforcées s\'appliquent',
      detail:
        'PSE (Plan de Sauvegarde de l\'Emploi) obligatoire en cas de licenciement économique de 10+ salariés sur 30 jours. Le CSE doit être consulté avec un expert-comptable.',
      urgence: 'attention',
    });
  }

  if (r.situation === 'redressement' || r.situation === 'assignation') {
    alertes.push({
      texte: 'La conciliation reste possible jusqu\'à 45 jours après la cessation des paiements',
      detail:
        'Le mandat ad hoc suppose de ne pas être en cessation des paiements. La conciliation, elle, peut encore être demandée si la cessation date de moins de 45 jours (art. L611-4 C. com.). C\'est confidentiel, et la demander dans ce délai dispense de l\'obligation de déclarer la cessation sous 45 jours (art. L631-4).',
      urgence: 'info',
    });
  } else {
    alertes.push({
      texte: 'Un mandat ad hoc peut être demandé tant que vous n\'êtes pas en cessation des paiements',
      detail:
        'Le mandat ad hoc (art. L611-3 C. com.) est ouvert à l\'entreprise qui n\'est pas en cessation des paiements. Si la cessation survient, la conciliation reste possible pendant 45 jours (art. L611-4). C\'est confidentiel, peu coûteux, et souvent très efficace.',
      urgence: 'info',
    });
  }

  return alertes;
}

export default function BlocPrescription() {
  const { reponses, company, companyAge, seuils } = useFiche();
  const alertes = buildAlertes(reponses, companyAge, seuils, getTribunalCompetent(company).leGenerique);

  return (
    <BlocAccordeon
      icone="⏰"
      titre="Délais et prescriptions"
      soustitre="Ce que la loi prévoit — à vérifier avec un avocat"
    >
      <div className="space-y-3">
        {alertes.map((a, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 ${
              a.urgence === 'attention'
                ? 'border-jaune/30 bg-jaune/5'
                : 'border-navy/10 bg-white/60'
            }`}
          >
            <p className="font-medium text-navy">
              {a.urgence === 'attention' && (
                <span className="mr-2 text-jaune" aria-hidden>⚠️</span>
              )}
              {a.texte}
            </p>
            <p className="mt-2 text-sm text-navy/70">{a.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-navy/50">
        Ces informations sont générales. Les délais exacts dépendent de
        votre situation. Un avocat peut les vérifier gratuitement lors
        d&apos;une première consultation.
      </p>
    </BlocAccordeon>
  );
}
