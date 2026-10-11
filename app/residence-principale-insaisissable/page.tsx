import Link from 'next/link';
import { ogMeta } from '@/lib/og';

export const metadata = {
  ...ogMeta({
    chemin: '/residence-principale-insaisissable',
    titre: 'Résidence principale insaisissable',
    sous: 'Protéger son logement en cas de difficulté',
    description: 'Protection de la résidence principale du dirigeant : insaisissabilité légale (loi Macron 2015), déclaration notariée, EI loi 2022. Limites, conjoint, cautions.',
    cat: 'situation',
    pageTitle: 'Résidence principale insaisissable : ce que vous devez savoir — Solelis',
  }),
  robots: { index: true, follow: true },
};

export default function ResidencePrincipalePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link href="/proteger-famille" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Protéger sa famille
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Résidence principale insaisissable
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">
        En cas de procédure collective, votre résidence principale est en principe protégée — mais ce
        n&apos;est pas automatique pour tout le monde. Voici ce qu&apos;il faut savoir.
      </p>

      {/* EI : insaisissabilité de droit */}
      <article className="glass card-top-line mt-10 p-6">
        <h2 className="font-display text-xl text-navy">✓ Vous êtes Entrepreneur Individuel (EI)</h2>
        <p className="mt-3 text-sm text-navy/80">
          <strong>La résidence principale est INSAISISSABLE DE DROIT</strong> pour les dettes professionnelles
          (loi Macron du 6 août 2015, art. L526-1 C. com. ; la loi du 14 février 2022 sur le statut unique de l&apos;EI a en outre séparé patrimoine professionnel et patrimoine personnel).
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>Aucune formalité à accomplir — la protection s&apos;applique automatiquement</li>
          <li>Vaut pour les dettes contractées <strong>après le 8 août 2015</strong></li>
          <li>Ne protège PAS contre les dettes personnelles (impôts perso, dettes de la vie privée)</li>
          <li>Ne protège PAS si l&apos;EI a fait une déclaration de renonciation à l&apos;insaisissabilité (rare)</li>
          <li>S&apos;étend aux <strong>biens immobiliers non affectés à l&apos;usage professionnel</strong> sur déclaration notariée</li>
        </ul>
      </article>

      {/* Société : déclaration notariée */}
      <article className="glass card-top-line mt-6 p-6">
        <h2 className="font-display text-xl text-navy">📝 Vous êtes dirigeant de société (SARL, SAS, EURL…)</h2>
        <p className="mt-3 text-sm text-navy/80">
          La société est une personne morale distincte : vos biens personnels sont en principe protégés par
          la responsabilité limitée. <strong>Aucune protection spécifique de la résidence n&apos;est nécessaire</strong>...
          SAUF si vous avez signé des <strong>cautions personnelles</strong>.
        </p>
        <p className="mt-3 text-sm text-navy/80">
          Si vous avez signé des cautions personnelles à votre banque ou bailleur, la résidence principale
          peut être saisie en cas d&apos;appel de la caution.
        </p>
        <p className="mt-3 text-sm text-navy/80">
          <strong>Attention :</strong> l&apos;insaisissabilité de l&apos;art. L526-1 C. com. (et la <strong>déclaration
          d&apos;insaisissabilité</strong> chez notaire) est réservée aux <strong>personnes physiques</strong> qui exercent
          elles-mêmes une activité professionnelle (entrepreneur individuel, immatriculé ou non) et ne protège que
          contre les créanciers professionnels. En tant que dirigeant·e de société, vous ne pouvez pas l&apos;utiliser pour
          protéger votre résidence contre une banque dont vous êtes caution.
        </p>
      </article>

      {/* Cautions personnelles */}
      <article className="glass card-top-line mt-6 p-6">
        <h2 className="font-display text-xl text-rouge">⚠️ Attention aux cautions personnelles</h2>
        <p className="mt-3 text-sm text-navy/80">
          <strong>L&apos;insaisissabilité ne joue PAS contre une banque qui détient une caution personnelle.</strong>
          La caution est un engagement personnel autonome qui survit à toute insaisissabilité.
        </p>
        <p className="mt-3 text-sm text-navy/80">
          <strong>Bonne nouvelle :</strong> une caution peut être contestée dans plusieurs cas. Points à vérifier :
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li><strong>Proportionnalité</strong> : la caution ne doit pas être manifestement disproportionnée à vos biens et revenus au jour de la signature (art. 2300 C. civ. pour les cautions signées depuis 2022 ; ancien art. L332-1 C. conso avant)</li>
          <li><strong>Information annuelle</strong> : la banque doit vous informer chaque année avant le 31 mars du montant restant dû (art. 2302 C. civ. ; ancien L313-22 C. mon. fin. pour les cautions antérieures à 2022)</li>
          <li><strong>Mention obligatoire</strong> : vous devez avoir apposé vous-même une mention précisant le montant et la nature de votre engagement, à peine de nullité (art. 2297 C. civ.)</li>
        </ul>
        <p className="mt-3 text-sm text-navy/80">
          → Voir notre{' '}
          <Link href="/faq/caution-personnelle" className="text-bleu-fonce underline">FAQ sur la caution personnelle</Link>{' '}
          pour les 10 questions clés.
        </p>
      </article>

      {/* Conjoint */}
      <article className="glass card-top-line mt-6 p-6">
        <h2 className="font-display text-xl text-navy">👫 Si vous êtes marié(e)</h2>
        <p className="mt-3 text-sm text-navy/80">
          <strong>Régime communauté</strong> : par défaut, les biens acquis pendant le mariage sont communs.
          Les dettes professionnelles d&apos;un époux engagent les biens communs (sauf insaisissabilité)
          mais pas les biens propres du conjoint (art. 1413 C. civ.).
        </p>
        <p className="mt-3 text-sm text-navy/80">
          <strong>Régime séparation</strong> : chacun ses biens. La résidence est-elle indivise (50/50) ou
          propriété d&apos;un seul ? Cela change tout. Les créanciers personnels d&apos;un époux ne peuvent pas saisir directement sa part d&apos;un bien indivis, mais ils peuvent provoquer le partage en son nom (art. 815-17 C. civ.).
        </p>
        <p className="mt-3 text-sm text-navy/80">
          <strong>Changement de régime matrimonial en urgence</strong> : possible par acte notarié, mais vos
          créanciers sont informés par un avis publié et peuvent <strong>s&apos;opposer dans les 3 mois</strong> (le
          changement doit alors être homologué par le juge). Il n&apos;est opposable aux tiers que 3 mois après sa
          mention en marge de l&apos;acte de mariage, et les créanciers peuvent l&apos;attaquer s&apos;il a été fait en
          fraude de leurs droits (art. 1397 et 1341-2 C. civ.).
        </p>
      </article>

      {/* Limites */}
      <article className="rounded-2xl border border-jaune/30 bg-jaune/5 mt-6 p-6">
        <h2 className="font-display text-xl text-jaune">Limites de l&apos;insaisissabilité</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Dettes personnelles et administration fiscale</strong> : l&apos;insaisissabilité ne vise que les
            dettes nées de votre activité professionnelle (pas les impôts personnels ni les dettes privées). Et elle
            ne joue pas face à l&apos;administration fiscale en cas de manœuvres frauduleuses ou d&apos;inobservation
            grave et répétée de vos obligations fiscales (art. L526-1 C. com.).
          </li>
          <li>
            <strong>Liquidation à votre demande</strong> : si vous décidez de vendre votre résidence (par exemple
            pour apurer une partie des dettes), l&apos;insaisissabilité s&apos;efface : l&apos;argent de la vente
            devient saisissable, sauf réemploi dans un délai d&apos;1 an dans une nouvelle résidence principale.
          </li>
          <li>
            <strong>Confusion de patrimoine</strong> : si la justice constate que vous avez confondu votre
            patrimoine personnel et celui de la société (compte mixte, prêts informels, dépenses perso payées par
            la société), la procédure peut être <strong>étendue à votre patrimoine personnel</strong> (art. L621-2 C. com.).
          </li>
          <li>
            <strong>Action paulienne</strong> : un transfert récent de votre résidence (donation à un enfant,
            vente à prix dérisoire à un proche) peut être rendu inopposable au créancier qui prouve la fraude,
            même en dehors de toute procédure collective et de la période suspecte (art. 1341-2 C. civ., prescription 5 ans).
          </li>
        </ul>
      </article>

      {/* Actions à mener */}
      <div className="mt-10 rounded-2xl border border-vert/30 bg-vert/5 p-6">
        <h2 className="font-display text-lg text-vert">Recommandations</h2>
        <ul className="mt-3 space-y-2 text-sm text-navy/80">
          <li>✓ Si vous êtes EI : aucune démarche, mais conservez un état clair de la séparation pro/perso</li>
          <li>✓ Si vous êtes en société : limitez les cautions personnelles et faites vérifier celles déjà signées</li>
          <li>✓ Vérifiez la proportionnalité de toutes vos cautions personnelles signées</li>
          <li>✓ Ne mélangez JAMAIS comptes pro et perso</li>
          <li>✓ Ne réalisez aucun transfert d&apos;actif récent (donation, vente à proches) en période difficile</li>
          <li>✓ Avant tout changement de régime matrimonial, consultez un avocat ET un notaire</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/faq/caution-personnelle" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          FAQ Caution personnelle
        </Link>
        <Link href="/obligations-dirigeant" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Obligations du dirigeant
        </Link>
        <Link href="/proteger-famille" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Protéger sa famille
        </Link>
      </div>

      <p className="mt-12 text-xs text-navy/50">
        Sources : loi Macron du 6 août 2015 (insaisissabilité de droit EI) ; loi n° 2022-172 du 14 février 2022
        (statut unique EI) ; C. com. art. L526-1 (déclaration d&apos;insaisissabilité) ; C. civ. art. 1413
        (régime matrimonial) ; art. 2297 et 2300 (caution).
      </p>
    </section>
  );
}
