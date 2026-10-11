'use client';
import { useFiche } from '@/lib/FicheContext';
import { isEI, getResponsabiliteAssocies } from '@/lib/strategie';
import BlocAccordeon from './BlocAccordeon';

export default function BlocProtectionFamille() {
  const { reponses, company } = useFiche();
  const ei = isEI(company.formeJuridique);
  const resp = getResponsabiliteAssocies(company.formeJuridique);
  const aCaution = reponses.caution === 'oui' || reponses.caution === 'ne-sais-pas';
  const proprietaire = reponses.patrimoine === 'proprietaire';
  const communaute = reponses.regime === 'communaute' || reponses.regime === 'ne-sais-pas';
  const marie = reponses.regime !== 'non-marie';

  const items: { titre: string; texte: string; urgence?: 'rouge' | 'jaune' | 'vert' }[] = [];

  if (proprietaire && ei) {
    items.push({
      titre: 'Votre résidence est automatiquement protégée',
      texte: "En tant qu’entrepreneur·e individuel·le, votre résidence principale est insaisissable par les créanciers professionnels depuis la loi Macron 2015 (art. L526-1 C. com.). Depuis le 15 mai 2022, l’ensemble de votre patrimoine personnel est en outre séparé de plein droit de votre patrimoine professionnel (art. L526-22 C. com.). Aucune démarche nécessaire — mais une caution ou une renonciation signée au profit d’un créancier lève cette protection pour ce créancier.",
      urgence: 'vert',
    });
  } else if (proprietaire && resp.illimitee) {
    items.push({
      titre: 'Votre résidence peut répondre des dettes de la société',
      texte: `Même sans caution, ${resp.texte} Faites le point avec un avocat ou un notaire avant toute décision.`,
      urgence: 'rouge',
    });
  } else if (proprietaire && resp.regime === 'limitee') {
    items.push({
      titre: 'Votre résidence : le risque passe par vos cautions',
      texte: `En tant que ${resp.qui}, vos biens personnels ne répondent pas des dettes de la société. Le risque vient des cautions personnelles (ou hypothécaires) que vous avez signées, et d’une éventuelle condamnation pour faute de gestion (art. L651-2 C. com.). La déclaration notariée d’insaisissabilité est réservée aux entrepreneur·e·s individuel·le·s (art. L526-1 C. com.).`,
      urgence: aCaution ? 'rouge' : 'jaune',
    });
  }

  if (aCaution) {
    items.push({
      titre: 'Vos cautions personnelles méritent une vérification',
      texte: "Une caution signée par une personne physique au profit d’un créancier professionnel peut être réduite si elle était manifestement disproportionnée par rapport à vos revenus et patrimoine au moment de la signature (art. 2300 C. civ.) — voire écartée pour une caution signée avant le 1er janvier 2022 (ancien art. L332-1 C. conso). Faites vérifier TOUTES vos cautions par un avocat — beaucoup sont contestables.",
      urgence: 'rouge',
    });
  }

  if (marie && communaute) {
    items.push({
      titre: 'Régime de communauté : votre conjoint·e est exposé·e',
      texte: "En communauté de biens, les biens communs peuvent être saisis pour payer les dettes de l’entreprise. Un changement vers la séparation de biens est possible (acte notarié) mais doit être fait AVANT les difficultés, sous peine d’annulation par un juge.",
      urgence: 'jaune',
    });
  } else if (marie && reponses.regime === 'separation') {
    items.push({
      titre: 'Séparation de biens : votre conjoint·e est protégé·e',
      texte: "Sous réserve que votre conjoint·e n’ait pas co-signé de caution, ses biens personnels sont protégés. C’est une bonne situation.",
      urgence: 'vert',
    });
  }

  if (reponses.situation === 'redressement' || reponses.situation === 'assignation') {
    items.push({
      titre: 'Ne transférez pas d’actifs maintenant',
      texte: "Un transfert de patrimoine (donation aux enfants, vente à un proche) peut être annulé s'il tombe dans la période suspecte — entre la date de cessation des paiements, qui peut remonter jusqu'à 18 mois avant le jugement, et le jugement — ou, pour une donation, dans les 6 mois qui la précèdent (art. L632-1 C. com.). Hors de ces délais, un créancier peut agir en action paulienne s'il prouve la fraude. Attendez les conseils d’un avocat.",
      urgence: 'rouge',
    });
  }

  items.push({
    titre: 'Vos dettes ne se transmettent pas',
    texte: "Les dettes professionnelles sont les vôtres, pas celles de votre famille. Vos proches ne peuvent pas en hériter contre leur volonté.",
  });

  if (items.length === 0) return null;

  return (
    <BlocAccordeon
      icone="🏠"
      titre="Protection de votre famille"
      soustitre={`Adapté à votre situation · ${company.formeJuridique || 'votre statut'}`}
    >
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 ${
              item.urgence === 'rouge' ? 'border-rouge/30 bg-rouge/5' :
              item.urgence === 'jaune' ? 'border-jaune/30 bg-jaune/5' :
              item.urgence === 'vert' ? 'border-vert/30 bg-vert/5' :
              'border-navy/10 bg-white/60'
            }`}
          >
            <p className="font-medium text-navy">{item.titre}</p>
            <p className="mt-2 text-sm text-navy/70">{item.texte}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <a href="/proteger-famille" className="rounded-full bg-white/80 px-3 py-1 text-bleu-fonce hover:bg-white">
          Guide complet : protéger ma famille →
        </a>
        <a href="https://www.notaires.fr" target="_blank" rel="noreferrer" className="rounded-full bg-white/80 px-3 py-1 text-navy/70 hover:bg-white">
          Trouver un notaire →
        </a>
      </div>
    </BlocAccordeon>
  );
}
