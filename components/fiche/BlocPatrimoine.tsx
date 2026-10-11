'use client';
import type { Reponses, CompanyData } from '@/lib/types';
import { useFiche } from '@/lib/FicheContext';
import { isEI, getResponsabiliteAssocies } from '@/lib/strategie';
import BlocAccordeon from './BlocAccordeon';

type Niveau = 'protege' | 'mixte' | 'expose';

interface Poche {
  cle: string;
  icone: string;
  titre: string;
  niveau: Niveau;
  analyse: string;
  action: string;
}

export function buildPoches(r: Reponses, c: CompanyData): Poche[] {
  const ei = isEI(c.formeJuridique);
  const resp = getResponsabiliteAssocies(c.formeJuridique);
  const aCaution = r.caution === 'oui';
  const cautionInconnue = r.caution === 'ne-sais-pas';
  const proprietaire = r.patrimoine === 'proprietaire';
  const communaute = r.regime === 'communaute' || r.regime === 'ne-sais-pas';
  const separation = r.regime === 'separation';
  const marie = r.regime && r.regime !== 'non-marie';

  const poches: Poche[] = [];

  // Résidence principale
  if (proprietaire) {
    if (ei && !aCaution) {
      poches.push({
        cle: 'residence',
        icone: '🏠',
        titre: 'Résidence principale',
        niveau: 'protege',
        analyse:
          "En tant qu'entrepreneur·e individuel·le, votre résidence principale est insaisissable de droit par les créanciers professionnels, sans démarche (art. L526-1 C. com., loi Macron 2015).",
        action: "Vérifiez qu'aucune caution hypothécaire ne vise cette résidence — elle annulerait la protection.",
      });
    } else if (ei && aCaution) {
      poches.push({
        cle: 'residence',
        icone: '🏠',
        titre: 'Résidence principale',
        niveau: 'mixte',
        analyse:
          "L'insaisissabilité de droit des EI ne joue pas contre un créancier pour lequel vous avez signé une caution personnelle ou hypothécaire.",
        action: "Faites vérifier par un avocat chacune de vos cautions — certaines sont annulables (disproportion, art. 2300 C. civ.).",
      });
    } else if (resp.illimitee) {
      poches.push({
        cle: 'residence',
        icone: '🏠',
        titre: 'Résidence principale',
        niveau: 'expose',
        analyse: `Même sans caution, ${resp.texte} Votre résidence peut donc être saisie par un créancier de la société.`,
        action: "Faites le point avec un avocat ou un notaire sur votre exposition personnelle avant toute décision.",
      });
    } else if (resp.regime === 'limitee') {
      poches.push({
        cle: 'residence',
        icone: '🏠',
        titre: 'Résidence principale',
        niveau: aCaution ? 'expose' : cautionInconnue ? 'mixte' : 'protege',
        analyse:
          "Les dettes de la société ne sont pas les vôtres : votre résidence n'en répond que si vous avez signé une caution (personnelle ou hypothécaire) ou si le tribunal vous condamne pour faute de gestion (insuffisance d'actif, art. L651-2 C. com.). La déclaration notariée d'insaisissabilité est réservée aux entrepreneur·e·s individuel·le·s (art. L526-1 C. com.).",
        action: aCaution
          ? "Faites vérifier par un avocat chacune de vos cautions — certaines sont annulables (disproportion, art. 2300 C. civ.)."
          : "Ne signez aucune nouvelle caution ni hypothèque sur ce bien sans l'avis d'un avocat.",
      });
    } else {
      poches.push({
        cle: 'residence',
        icone: '🏠',
        titre: 'Résidence principale',
        niveau: 'mixte',
        analyse:
          "Sa protection dépend de votre forme juridique (entreprise individuelle ou société) et des cautions que vous avez signées.",
        action: "Faites vérifier votre situation par un avocat ou un notaire.",
      });
    }
  } else {
    poches.push({
      cle: 'residence',
      icone: '🏠',
      titre: 'Logement',
      niveau: 'protege',
      analyse:
        "En tant que locataire, votre logement n'est pas une cible directe pour les créanciers.",
      action:
        "Vérifiez votre bail : certaines clauses de caution personnelle sur le loyer existent.",
    });
  }

  // Épargne bancaire
  poches.push({
    cle: 'epargne',
    icone: '💰',
    titre: 'Épargne bancaire (comptes, livrets)',
    niveau: aCaution || resp.illimitee ? 'expose' : 'mixte',
    analyse: aCaution
      ? "Les créanciers munis d'un titre exécutoire peuvent faire saisir vos comptes. Une fraction reste toujours insaisissable (solde bancaire insaisissable ~ 600 €)."
      : resp.illimitee
        ? `Même sans caution, ${resp.texte}`
        : resp.regime === 'ei'
          ? "Depuis le 15 mai 2022, votre patrimoine personnel est séparé de plein droit de votre patrimoine professionnel : vos créanciers professionnels ne peuvent pas saisir vos comptes personnels pour des dettes nées après cette date (art. L526-22 C. com.), sauf renonciation signée au profit d'un créancier, fraude, ou certaines dettes fiscales et sociales."
          : resp.regime === 'limitee'
            ? "Sans caution signée, vos comptes personnels ne répondent pas des dettes de la société — sauf condamnation pour faute de gestion (insuffisance d'actif, art. L651-2 C. com.)."
            : "Leur exposition dépend de votre forme juridique et des cautions signées : faites-la vérifier.",
    action:
      "Ne videz pas vos comptes vers des proches : en procédure collective, ces transferts peuvent être annulés s'ils tombent dans la période suspecte (jusqu'à 18 mois avant le jugement), et un créancier peut agir en action paulienne s'il prouve la fraude.",
  });

  // Assurance-vie
  poches.push({
    cle: 'assurance-vie',
    icone: '📜',
    titre: 'Assurance-vie',
    niveau: 'protege',
    analyse:
      "Une assurance-vie avec bénéficiaire désigné est hors succession ET difficilement saisissable — sauf primes manifestement exagérées au regard des revenus.",
    action:
      "Ne faites PAS de versements inhabituels aujourd'hui. Vérifiez la clause bénéficiaire avec un notaire.",
  });

  // Autres biens immo / SCI
  if (proprietaire) {
    poches.push({
      cle: 'autres-immo',
      icone: '🏘️',
      titre: 'Autres biens immobiliers (locatif, SCI)',
      niveau: aCaution || resp.illimitee ? 'expose' : 'mixte',
      analyse: resp.illimitee
        ? `Même sans caution, ${resp.texte}`
        : resp.regime === 'ei'
          ? "Ces biens ne bénéficient pas de l'insaisissabilité de droit de la résidence principale (art. L526-1 C. com.). Mais depuis le 15 mai 2022, tout votre patrimoine personnel est séparé de plein droit : vos créanciers professionnels ne peuvent pas les saisir pour des dettes nées après cette date (art. L526-22 C. com.), sauf renonciation, fraude ou certaines dettes fiscales et sociales. Les dettes plus anciennes et les cautions signées restent un risque."
          : resp.regime === 'limitee'
            ? "Ils ne répondent pas des dettes de la société, sauf caution, hypothèque consentie sur ces biens ou condamnation pour faute de gestion (art. L651-2 C. com.)."
            : "Leur exposition dépend de votre forme juridique et des cautions signées : faites-la vérifier.",
      action:
        "Un notaire peut examiner un démembrement ou une donation antérieure. Attention : en procédure collective, une donation faite pendant la période suspecte ou dans les 6 mois qui précèdent la cessation des paiements est annulable (art. L632-1 C. com.), et un créancier peut agir en action paulienne s'il prouve la fraude.",
    });
  }

  // Conjoint / régime matrimonial
  if (marie) {
    if (communaute) {
      poches.push({
        cle: 'conjoint',
        icone: '👥',
        titre: 'Biens du couple (communauté)',
        niveau: 'expose',
        analyse:
          "En régime de communauté, les biens communs (salaires, comptes joints, immobilier commun) répondent des dettes de l'entreprise.",
        action:
          "Un changement de régime (séparation de biens) est possible — 1 500 à 3 000 € chez le notaire — mais n'est opposable aux créanciers que pour les dettes FUTURES. Ne tardez pas.",
      });
    } else if (separation) {
      poches.push({
        cle: 'conjoint',
        icone: '👥',
        titre: 'Biens du conjoint (séparation)',
        niveau: 'protege',
        analyse:
          "En séparation de biens, les biens personnels de votre conjoint·e ne sont pas exposés aux dettes de l'entreprise — à condition qu'il·elle n'ait signé aucun acte de caution.",
        action:
          "Vérifiez systématiquement qu'aucun acte (prêt bancaire, bail, caution fournisseur) n'a été co-signé par votre conjoint·e.",
      });
    }
  }

  // Parts d'entreprise (si société)
  if (!ei) {
    poches.push({
      cle: 'parts',
      icone: '📊',
      titre: 'Parts sociales / actions de l\'entreprise',
      niveau: 'mixte',
      analyse:
        "Vos parts ont une valeur qui peut être saisie par vos créanciers personnels. En cas de liquidation, elles deviennent quasi sans valeur.",
      action:
        "Si une cession est envisagée, elle doit l'être à un prix de marché — une cession à vil prix serait annulée comme paulienne.",
    });
  }

  // Véhicule pro
  poches.push({
    cle: 'vehicule',
    icone: '🚗',
    titre: 'Véhicule personnel',
    niveau: 'mixte',
    analyse:
      "Les véhicules peuvent être saisis sauf s'ils sont nécessaires à une activité professionnelle salariée (pas à l'entreprise en difficulté).",
    action:
      "Un véhicule financé en LOA/LLD reste propriété du loueur — il est protégé de la saisie.",
  });

  // Cautions (rappel si pertinent)
  if (aCaution) {
    poches.push({
      cle: 'cautions',
      icone: '🛡️',
      titre: 'Engagements de caution signés',
      niveau: 'expose',
      analyse:
        "Vos cautions personnelles sont la porte d'entrée principale vers votre patrimoine. Mais elles sont aussi très souvent contestables.",
      action:
        "Voir le bloc dédié « Audit de vos cautions » plus bas pour une analyse détaillée.",
    });
  } else if (cautionInconnue) {
    poches.push({
      cle: 'cautions',
      icone: '🛡️',
      titre: 'Cautions potentielles',
      niveau: 'mixte',
      analyse:
        "Vous n'êtes pas certain·e d'avoir signé des cautions. C'est fréquent : les cautions sont souvent incluses dans des prêts bancaires anciens ou des baux commerciaux.",
      action:
        "Demandez par courrier à votre banque, votre bailleur et vos principaux fournisseurs copie de tout acte vous engageant personnellement.",
    });
  }

  return poches;
}

const NIVEAU_STYLES: Record<Niveau, { bg: string; border: string; pill: string; label: string }> = {
  protege: { bg: 'bg-vert/10', border: 'border-vert/30', pill: 'bg-vert/20 text-vert', label: 'Protégé' },
  mixte: { bg: 'bg-jaune/10', border: 'border-jaune/30', pill: 'bg-jaune/25 text-navy', label: 'Partiellement exposé' },
  expose: { bg: 'bg-rouge/10', border: 'border-rouge/30', pill: 'bg-rouge/20 text-rouge', label: 'Exposé' },
};

export default function BlocPatrimoine() {
  const { reponses, company } = useFiche();
  const poches = buildPoches(reponses, company);
  if (poches.length === 0) return null;

  const expose = poches.filter((p) => p.niveau === 'expose').length;
  const protege = poches.filter((p) => p.niveau === 'protege').length;

  return (
    <BlocAccordeon
      icone="🗺️"
      titre="Cartographie de votre patrimoine"
      soustitre={`${poches.length} poches analysées · ${protege} protégée${protege > 1 ? 's' : ''} · ${expose} exposée${expose > 1 ? 's' : ''}`}
    >
      <p className="mb-4 text-sm text-navy/80">
        Voici comment votre patrimoine personnel se positionne face aux
        dettes professionnelles. Chaque poche est analysée selon votre
        statut, votre régime matrimonial et l&apos;existence de cautions.
      </p>

      <div className="space-y-3">
        {poches.map((p) => {
          const style = NIVEAU_STYLES[p.niveau];
          return (
            <div
              key={p.cle}
              className={`rounded-2xl border p-4 ${style.bg} ${style.border}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-base text-navy">
                  <span className="mr-1" aria-hidden>{p.icone}</span>
                  {p.titre}
                </p>
                <span className={`pastille shrink-0 text-[10px] ${style.pill}`}>
                  {style.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-navy/80">{p.analyse}</p>
              <p className="mt-2 text-sm text-navy/70">
                <span className="font-medium text-navy/80">Action : </span>
                {p.action}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Cette cartographie est indicative et ne remplace pas un audit
        patrimonial chez un notaire ou un avocat spécialisé. Toute action
        de réorganisation du patrimoine doit être validée juridiquement
        pour éviter l&apos;action paulienne.
      </p>
    </BlocAccordeon>
  );
}
