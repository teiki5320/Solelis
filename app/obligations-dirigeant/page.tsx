import Link from 'next/link';
import { ogMeta } from '@/lib/og';

export const metadata = {
  ...ogMeta({
    chemin: '/obligations-dirigeant',
    titre: 'Obligations du dirigeant en difficulté',
    sous: 'Ce qu\'il faut faire — et ne pas faire',
    description: 'Ce que vous devez faire (et éviter) en tant que dirigeant d\'une entreprise en difficulté : déclaration de cessation, coopération mandataire, comptabilité, période suspecte.',
    cat: 'procedure',
    pageTitle: 'Obligations du dirigeant en difficulté — Solelis',
  }),
  robots: { index: true, follow: true },
};

interface Obligation {
  titre: string;
  description: string;
  reference: string;
  sanction: string;
  conseil: string;
  delai?: string;
}

const OBLIGATIONS_FAIRE: Obligation[] = [
  {
    titre: 'Déclarer la cessation des paiements dans les 45 jours',
    description: 'Dès que vous constatez l\'impossibilité de payer vos dettes échues avec votre actif disponible, vous avez 45 jours pour le déclarer au greffe du tribunal (Cerfa 10530).',
    reference: 'C. com. art. L631-4',
    sanction: 'Si l\'omission est volontaire (« sciemment ») et qu\'aucune conciliation n\'a été demandée : interdiction de gérer jusqu\'à 15 ans (L653-8, L653-11). Le retard peut aussi être retenu comme faute de gestion dans une action en responsabilité pour insuffisance d\'actif (L651-2).',
    delai: '45 jours',
    conseil: 'Le délai court à partir de la cessation des paiements elle-même, pas de votre prise de conscience. Dans ce délai, vous pouvez aussi demander une conciliation au tribunal (L631-4). Si vous hésitez, consultez rapidement un avocat.',
  },
  {
    titre: 'Tenir une comptabilité sincère et à jour',
    description: 'L\'obligation comptable demeure pendant toute la procédure. Comptes annuels, factures, contrats, relevés bancaires : tout doit être documenté.',
    reference: 'C. com. art. L123-12 à L123-28',
    sanction: 'Banqueroute (L654-2, 4° et 5°) en cas de comptabilité fictive, de documents comptables disparus ou de comptabilité manifestement incomplète ou irrégulière : 5 ans de prison + 75 000 € d\'amende (L654-3).',
    conseil: 'Conservez les pièces 10 ans. En cas de difficulté, prévenez votre expert-comptable et le mandataire — la transparence est votre meilleure protection.',
  },
  {
    titre: 'Coopérer pleinement avec le mandataire et le juge',
    description: 'En sauvegarde, redressement ou liquidation, vous devez répondre aux convocations, remettre les documents, ne pas dissimuler d\'actif.',
    reference: 'C. com. art. L622-6 et s.',
    sanction: 'Interdiction de gérer (L653-8) si, de mauvaise foi, vous ne remettez pas au mandataire, à l\'administrateur ou au liquidateur les renseignements dus dans le mois suivant le jugement d\'ouverture. Banqueroute en cas de dissimulation d\'actif (L654-2).',
    conseil: 'Le mandataire n\'est pas votre ennemi : il représente l\'intérêt collectif des créanciers, et la transparence joue en votre faveur. Soyez transparent et proactif.',
  },
  {
    titre: 'Traiter tous les créanciers à égalité',
    description: 'Pendant la période suspecte (de la date de cessation des paiements, qui peut remonter jusqu\'à 18 mois avant le jugement, jusqu\'au jugement d\'ouverture) et pendant la procédure, vous ne pouvez pas privilégier un créancier (paiement d\'une dette antérieure non échue, dation en paiement, sûreté pour dette ancienne).',
    reference: 'C. com. art. L632-1 à L632-3',
    sanction: 'Nullités automatiques (de droit) et facultatives des actes accomplis. Action en responsabilité possible.',
    conseil: 'Ne payez pas en priorité un créancier "amical" (famille, fournisseur historique) — le mandataire pourra faire annuler l\'acte rétroactivement.',
  },
  {
    titre: 'Informer le CSE et les salariés',
    description: 'En cas d\'ouverture de procédure ou de licenciement éco, informez et consultez le CSE avant toute décision. Remettez le CSP aux salariés concernés.',
    reference: 'C. trav. L2312-8, L2317-1, L1233-65, L1233-66',
    sanction: 'Défaut de consultation du CSE : délit d\'entrave au fonctionnement (7 500 € d\'amende, art. L2317-1). CSP non proposé : contribution due à France Travail de 2 mois de salaire brut par salarié (3 mois s\'il adhère au CSP proposé par France Travail — art. L1233-66). Ce n\'est pas un délit d\'entrave.',
    conseil: 'L\'avocat en droit social et le DRH sont vos alliés pour cadrer la procédure. Anticipez les calendriers de réunion CSE.',
  },
  {
    titre: 'Maintenir les cotisations sociales et fiscales courantes',
    description: 'Pendant un échéancier (URSSAF, CCSF, impôts), respectez les échéances du plan et restez en règle avec vos déclarations et paiements fiscaux et sociaux. À défaut, le plan peut prendre fin.',
    reference: 'CSS art. R243-21 (délais Urssaf) ; décret n° 2007-686 du 4 mai 2007 (CCSF)',
    sanction: 'Fin du plan de règlement et reprise des poursuites pour les dettes qu\'il couvrait (saisies possibles).',
    conseil: 'Prévoyez dans votre trésorerie les cotisations, impôts et TVA courants en plus des échéances du plan.',
  },
];

const OBLIGATIONS_NE_PAS_FAIRE: Obligation[] = [
  {
    titre: 'Ne pas dissimuler d\'actifs',
    description: 'Ne sortez aucun bien du patrimoine de l\'entreprise (vente sous-évaluée, transfert à une autre société, déménagement à l\'étranger). Tout est traçable et tout sera trouvé.',
    reference: 'C. com. art. L654-2, 2° (banqueroute par détournement ou dissimulation d\'actif)',
    sanction: 'Banqueroute : 5 ans de prison + 75 000 € d\'amende (L654-3). Le tribunal de la procédure peut aussi prononcer la faillite personnelle ou une interdiction de gérer, jusqu\'à 15 ans (L653-4, L653-8, L653-11).',
    conseil: 'Pendant la procédure, demandez l\'autorisation du juge-commissaire avant tout acte qui sort de la gestion courante (vente d\'un bien, garantie…).',
  },
  {
    titre: 'Ne pas faire de donation ou de vente à un proche',
    description: 'Donations à un enfant/conjoint, vente d\'un immeuble à prix anormalement bas à un proche, changement de régime matrimonial fait pour échapper aux créanciers : ces actes peuvent être annulés ou rendus inopposables aux créanciers.',
    reference: 'C. com. art. L632-1 ; C. civ. art. 1341-2 (action paulienne)',
    sanction: 'En procédure collective : nullité de droit des actes à titre gratuit faits pendant la période suspecte ; ceux des 6 mois qui la précèdent peuvent aussi être annulés par le tribunal (L632-1). Hors de ces délais : action paulienne d\'un créancier, qui doit prouver la fraude (prescription 5 ans).',
    conseil: 'Avant tout acte significatif (mariage, divorce, donation, succession), consultez un avocat ET un notaire pour analyser l\'impact procédure.',
  },
  {
    titre: 'Ne pas poursuivre l\'activité à perte de manière déloyale',
    description: 'Continuer à acheter à crédit en sachant que vous ne pourrez pas payer = comportement frauduleux. Aggraver volontairement le passif est une faute caractérisée.',
    reference: 'C. com. art. L654-2, 1° et 3° (moyens ruineux pour retarder la procédure, augmentation frauduleuse du passif)',
    sanction: 'Banqueroute : 5 ans de prison + 75 000 € d\'amende (L654-3). Action en responsabilité pour insuffisance d\'actif (L651-2).',
    conseil: 'Si la situation est désespérée, ARRÊTEZ et déclarez. Continuer "pour gagner du temps" expose le dirigeant personnellement.',
  },
  {
    titre: 'Ne pas signer de nouvelles cautions personnelles',
    description: 'Pendant la période difficile, refusez toute nouvelle caution personnelle, surtout si elle dépasse vos revenus et vos biens.',
    reference: 'C. civ. art. 2300 (disproportion)',
    sanction: 'Pour vous : ruine patrimoniale personnelle, jusqu\'à la résidence si pas insaisissable.',
    conseil: 'Une caution manifestement disproportionnée à vos revenus et à votre patrimoine au jour de la signature est réduite au montant que vous pouviez garantir (art. 2300) — mais c\'est à vous de prouver la disproportion. Mieux vaut ne pas en signer du tout.',
  },
  {
    titre: 'Ne pas mélanger patrimoine perso et pro',
    description: 'Compte mixte, paiement de dépenses personnelles avec la carte société, prêt direct à la société sans formalisme : risque de confusion de patrimoine.',
    reference: 'C. com. art. L621-2 (extension de procédure)',
    sanction: 'Extension de la procédure collective à votre patrimoine personnel.',
    conseil: 'Comptes séparés strictement. Tout flux entre vous et la société doit avoir un fondement contractuel (compte courant d\'associé, rémunération, dividende).',
  },
  {
    titre: 'Ne pas négliger les obligations sociales',
    description: 'Cotisations salariales prélevées sur les salaires et non reversées à l\'URSSAF : infraction pénale (délit en cas de récidive). Travail dissimulé : délit.',
    reference: 'CSS art. L244-6, L243-3-2 ; C. trav. L8221-1, L8224-1',
    sanction: 'Retenue indue des cotisations salariales, en récidive dans les 3 ans : 2 ans de prison + 3 750 € d\'amende (CSS L244-6). Délit de travail dissimulé : 3 ans de prison + 45 000 € d\'amende (C. trav. L8224-1). Après un travail dissimulé, le dirigeant auteur de manœuvres frauduleuses ou de manquements graves et répétés peut être déclaré solidairement responsable des cotisations de la société (CSS L243-3-2).',
    conseil: 'Si vous devez choisir où ne PAS payer, ce ne sont pas les salaires nets ni les cotisations salariales. Mieux : préventif → CCSF.',
  },
];

function SectionList({ titre, icone, items, ton }: { titre: string; icone: string; items: Obligation[]; ton: 'vert' | 'rouge' }) {
  const couleur = ton === 'vert' ? 'border-vert/30 bg-vert/5' : 'border-rouge/30 bg-rouge/5';
  const texte = ton === 'vert' ? 'text-vert' : 'text-rouge';
  return (
    <section className="mt-12">
      <div className={`rounded-2xl border ${couleur} p-5`}>
        <h2 className={`font-display text-xl ${texte}`}>
          <span className="mr-2">{icone}</span>{titre}
        </h2>
      </div>
      <div className="mt-5 space-y-5">
        {items.map((o, i) => (
          <article key={i} className="glass-soft rounded-2xl p-5">
            <h3 className="font-display text-base text-navy">{o.titre}</h3>
            <p className="mt-2 text-sm text-navy/80">{o.description}</p>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-lg bg-white/60 p-3">
                <p className="text-[10px] uppercase tracking-wide text-navy/55">Référence légale</p>
                <p className="mt-1 text-navy/80">{o.reference}</p>
              </div>
              <div className="rounded-lg bg-rouge/5 p-3">
                <p className="text-[10px] uppercase tracking-wide text-rouge">Sanction</p>
                <p className="mt-1 text-navy/80">{o.sanction}</p>
              </div>
              {o.delai && (
                <div className="rounded-lg bg-jaune/5 p-3 sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-wide text-jaune">Délai</p>
                  <p className="mt-1 text-navy/80">{o.delai}</p>
                </div>
              )}
              <div className="rounded-lg bg-bleu/5 p-3 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-wide text-bleu-fonce">Conseil pratique</p>
                <p className="mt-1 text-navy/80">{o.conseil}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ObligationsDirigeantPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Accueil
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Obligations du dirigeant en difficulté
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">
        En période de difficulté, votre statut de dirigeant déclenche des obligations spécifiques. Les respecter
        n&apos;est pas seulement une question de droit : c&apos;est la condition de votre protection personnelle.
      </p>

      <SectionList
        titre="Ce que vous DEVEZ faire"
        icone="✓"
        items={OBLIGATIONS_FAIRE}
        ton="vert"
      />

      <SectionList
        titre="Ce que vous NE DEVEZ PAS faire"
        icone="✗"
        items={OBLIGATIONS_NE_PAS_FAIRE}
        ton="rouge"
      />

      <div className="mt-12 rounded-2xl border border-bleu/30 bg-bleu/5 p-6">
        <h2 className="font-display text-xl text-bleu-fonce">À retenir</h2>
        <p className="mt-3 text-sm text-navy/80">
          Les obligations du dirigeant ne sont pas des chausse-trappes : ce sont des règles destinées à
          protéger l&apos;ensemble des parties prenantes (salariés, créanciers, partenaires) ET à vous protéger
          vous, en limitant les risques de mises en cause personnelle.
        </p>
        <p className="mt-3 text-sm text-navy/80">
          La règle d&apos;or : <strong>transparence + déclaration rapide + accompagnement professionnel</strong>.
          Les sanctions personnelles visent des fautes précises : agir de bonne foi et dans les délais
          vous protège, même si l&apos;entreprise est liquidée.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/procedures-comparaison" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Comparatif des procédures
        </Link>
        <Link href="/proteger-famille" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Protéger sa famille
        </Link>
        <Link href="/glossaire" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Glossaire complet
        </Link>
      </div>
    </section>
  );
}
