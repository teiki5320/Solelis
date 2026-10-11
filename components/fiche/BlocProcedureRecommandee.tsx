'use client';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import { getEffectifSeuils } from '@/lib/secteur';
import { prpEnvisageable, estEnCessation, resolveStrategie } from '@/lib/strategie';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

interface Procedure {
  nom: string;
  pertinence: 'recommandee' | 'possible' | 'info';
  description: string;
  conditions?: string;
  lien: string;
}

function buildProcedures(r: Reponses, c: CompanyData, s: SectorInfo): Procedure[] {
  const procs: Procedure[] = [];
  const seuils = getEffectifSeuils(c.effectif);

  if (r.situation === 'prevention') {
    procs.push({
      nom: 'Mandat ad hoc',
      pertinence: 'recommandee',
      description: "Négociation confidentielle avec vos créanciers, supervisée par un mandataire nommé par le tribunal. Personne n’est au courant. Très efficace en prévention.",
      conditions: 'Pas encore en cessation des paiements.',
      lien: '/glossaire',
    });
    procs.push({
      nom: 'Conciliation',
      pertinence: 'possible',
      description: "Plus formel que le mandat ad hoc. Un conciliateur négocie un accord global avec vos créanciers. Confidentiel sauf si l’accord est homologué.",
      conditions: 'Cessation des paiements depuis moins de 45 jours ou pas encore.',
      lien: '/glossaire',
    });
  }

  if (r.situation === 'tresorie') {
    procs.push({
      nom: 'Conciliation',
      pertinence: 'recommandee',
      description: "Un conciliateur négocie un accord global avec vos créanciers. Vous gardez le contrôle. Confidentiel.",
      conditions: 'Cessation des paiements depuis moins de 45 jours ou pas encore.',
      lien: '/glossaire',
    });
    procs.push({
      nom: 'Sauvegarde',
      pertinence: 'possible',
      description: "Le tribunal vous protège de vos créanciers pendant que vous restructurez. Procédure publique mais protectrice.",
      conditions: "Pas encore en cessation des paiements.",
      lien: '/glossaire',
    });
  }

  // Cap « Liquider proprement » (stratégie) : la liquidation doit figurer
  // parmi les procédures, et le redressement n'est plus qu'une option.
  const capLiquidation = estEnCessation(r) && resolveStrategie(r, c)?.main.axe === 'liquider';

  if (r.situation === 'redressement') {
    procs.push({
      nom: 'Redressement judiciaire',
      pertinence: capLiquidation ? 'possible' : 'recommandee',
      description: "Vous êtes en cessation. Le tribunal tente de sauver l’entreprise via un plan. Un administrateur est nommé.",
      conditions: "Cessation des paiements. Déclaration dans les 45 jours obligatoire.",
      lien: '/glossaire',
    });
  }

  if (r.situation === 'assignation') {
    procs.push({
      nom: 'Consulter un avocat en urgence',
      pertinence: 'recommandee',
      description: "Une assignation implique des délais stricts. Un avocat est indispensable pour préparer votre défense et vous orienter vers la procédure adaptée.",
      lien: '/parler',
    });
    procs.push({
      nom: 'Redressement judiciaire',
      pertinence: 'possible',
      description: "Si l’entreprise peut encore être sauvée. Le tribunal peut ordonner un plan de continuation ou un plan de cession.",
      conditions: 'Cessation des paiements.',
      lien: '/glossaire',
    });
  }

  if (estEnCessation(r)) {
    procs.push({
      nom: 'Liquidation judiciaire',
      pertinence: capLiquidation ? 'recommandee' : 'possible',
      description: "Si l’entreprise ne peut pas être sauvée : l’activité s’arrête, un liquidateur vend les actifs et règle les créanciers. Procédure simplifiée et plus rapide pour les petites entreprises sans immeuble.",
      conditions: 'Cessation des paiements et redressement manifestement impossible (art. L640-1 C. com.).',
      lien: '/glossaire',
    });
  }

  // Rétablissement professionnel : débiteur personne physique en cessation
  // des paiements, sans salarié (art. L645-1 C. com.).
  if (prpEnvisageable(r, c)) {
    procs.push({
      nom: 'Rétablissement professionnel (PRP)',
      pertinence: 'possible',
      description: "Efface vos dettes professionnelles en 4 mois, sans liquidation complète. Réservé aux entrepreneur·e·s individuel·le·s en cessation des paiements, sans salarié et avec peu d’actif.",
      conditions: 'Personne physique en cessation des paiements, redressement manifestement impossible, aucun salarié au cours des 6 derniers mois, aucune instance prud’homale en cours, actif déclaré inférieur à 15 000 € (art. L645-1 et R645-1 C. com.).',
      lien: '/rebond',
    });
  }

  if (r.vente === 'oui' || r.vente === 'peut-etre') {
    procs.push({
      nom: 'Cession de fonds de commerce',
      pertinence: r.vente === 'oui' ? 'recommandee' : 'possible',
      description: "Vente de l’activité à un repreneur. Préserve les emplois. Le repreneur ne reprend pas les dettes.",
      lien: '/vendre',
    });
    procs.push({
      nom: 'Location-gérance',
      pertinence: 'possible',
      description: "Vous restez propriétaire, un tiers exploite et vous verse un loyer. Peut mener à une vente ultérieure dans de meilleures conditions.",
      lien: '/vendre',
    });
  }

  procs.push({
    nom: 'Aides personnelles',
    pertinence: 'info',
    description: "Indépendamment de l’entreprise, vous avez peut-être droit à l’ATI (chômage indépendant), la CSS (mutuelle gratuite), l’aide juridictionnelle, ou le RSA.",
    lien: '/aides-personnelles',
  });

  return procs;
}

const STYLES = {
  recommandee: 'border-l-4 border-l-vert bg-vert/5',
  possible: 'border-l-4 border-l-bleu bg-bleu/5',
  info: 'border-l-4 border-l-navy/20 bg-white/60',
};

const LABELS = {
  recommandee: 'Recommandée',
  possible: 'Option possible',
  info: 'À connaître',
};

export default function BlocProcedureRecommandee() {
  const { reponses, company, sector } = useFiche();
  const procs = buildProcedures(reponses, company, sector);

  return (
    <BlocAccordeon
      icone="⚖️"
      titre="Procédures et options pour votre situation"
      soustitre={`${procs.length} pistes identifiées`}
    >
      <div className="space-y-3">
        {procs.map((p, i) => (
          <div key={i} className={`rounded-2xl border border-navy/10 p-4 ${STYLES[p.pertinence]}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-base text-navy">{p.nom}</p>
              <span className={`pastille shrink-0 text-[10px] ${
                p.pertinence === 'recommandee' ? 'bg-vert/15 text-vert' :
                p.pertinence === 'possible' ? 'bg-bleu/15 text-bleu-fonce' :
                ''
              }`}>
                {LABELS[p.pertinence]}
              </span>
            </div>
            <p className="mt-2 text-sm text-navy/70">{p.description}</p>
            {p.conditions && (
              <p className="mt-1 text-xs text-navy/50">Conditions : {p.conditions}</p>
            )}
            <a href={p.lien} className="mt-2 inline-block text-xs text-bleu-fonce underline underline-offset-2">
              En savoir plus →
            </a>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-navy/50">
        Ces recommandations sont indicatives. Un avocat (ou le CIP, gratuitement) peut confirmer la procédure la plus adaptée.
      </p>
    </BlocAccordeon>
  );
}
