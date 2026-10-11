'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié aux conséquences d'une procédure collective pour les
 * dirigeants ressortissants hors UE/EEE/Suisse.
 *
 * Une liquidation ou un retrait d'activité peut entraîner la perte
 * d'un titre de séjour Passeport Talent (mention « créateur
 * d'entreprise ») ou d'une carte de séjour entrepreneur/profession
 * libérale.
 *
 * S'affiche uniquement si l'utilisateur a déclaré une nationalité
 * hors UE (RGPD : champ optionnel).
 */
export default function BlocNationaliteSejour() {
  const { reponses } = useFiche();
  if (reponses.nationalite !== 'hors-ue') return null;

  return (
    <BlocAccordeon
      icone="🛂"
      titre="Titre de séjour — impact d&apos;une procédure collective"
      soustitre="Carte « talent », carte entrepreneur, OFII : ce qu&apos;il faut anticiper"
    >
      <p className="text-sm text-navy/80">
        Vous nous avez indiqué une nationalité hors UE. Votre titre de
        séjour est <strong>conditionné à votre activité économique</strong>{' '}
        — une cessation, une liquidation ou un retrait peut entraîner sa
        perte au prochain renouvellement. Ce sujet est rarement abordé
        par les avocats généralistes et nécessite un accompagnement
        spécifique.
      </p>

      {/* Passeport Talent */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Si vous avez une carte « talent – porteur de projet » (ex-passeport talent « créateur d&apos;entreprise »)
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            Délivrée pour <strong>4 ans au plus</strong>, conditionnée
            notamment à un projet réel et sérieux de création
            d&apos;entreprise, financé à hauteur d&apos;au moins 30 000 €,
            et à des ressources au moins égales au SMIC.
          </li>
          <li>
            Une difficulté économique ne fait pas tomber le titre
            d&apos;elle-même : c&apos;est surtout au{' '}
            <strong>renouvellement</strong> que se pose la question du
            respect des conditions.
          </li>
          <li>
            Lors du renouvellement, la Préfecture examine si{' '}
            <strong>l&apos;activité reste viable</strong>. Une procédure
            collective en cours est un signal négatif fort.
          </li>
          <li>
            <strong>Passage possible vers un autre statut</strong> avant
            renouvellement : salarié (si embauche concrète), vie privée
            et familiale (si lien familial), étudiant (si reprise
            d&apos;études).
          </li>
        </ul>
      </div>

      {/* Carte entrepreneur / profession libérale */}
      <div className="mt-4 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Carte de séjour « entrepreneur / profession libérale »
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            Délivrée pour <strong>1 an</strong> au plus, renouvelable ;
            une carte pluriannuelle peut ensuite être demandée.
          </li>
          <li>
            Condition essentielle : <strong>activité économiquement
            viable</strong>, qui vous procure des ressources au moins égales
            au seuil fixé (montant sur service-public.gouv.fr, fiche F35795).
          </li>
          <li>
            En cas de cessation, le titre peut être refusé au
            renouvellement, voire retiré si les conditions ne sont plus
            remplies.
          </li>
        </ul>
      </div>

      {/* Procédure : ce qu'il faut faire */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">
          Actions à anticiper
        </p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-navy/80">
          <li>
            <strong>Avocat en droit des étrangers</strong> aussi tôt que
            possible — séparé de votre avocat en droit des entreprises.
            Conseils gratuits possibles auprès d&apos;un point-justice (3039)
            ou d&apos;associations (Cimade, GISTI, ADDE).
          </li>
          <li>
            <strong>Identifier un changement de statut possible</strong>{' '}
            (salarié si offre, conjoint français, parent d&apos;enfant
            français, séjour pour soins, étudiant).
          </li>
          <li>
            <strong>Préparer un dossier de redressement crédible</strong>{' '}
            si vous souhaitez conserver l&apos;activité (mandat ad hoc
            confidentiel = mieux qu&apos;une procédure collective publique
            pour la Préfecture).
          </li>
          <li>
            <strong>Anticiper le renouvellement</strong> : la demande se
            dépose dans les 2 mois qui précèdent l&apos;expiration ; un dépôt
            tardif entraîne un droit de visa de régularisation de 180 €.
            Rester en France sans titre valide expose à une obligation de
            quitter le territoire (OQTF).
          </li>
        </ol>
      </div>

      {/* OFII et ANEF */}
      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">Interlocuteurs publics</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Préfecture / sous-préfecture</strong> : guichet
            d&apos;instruction des titres de séjour. RDV souvent
            obligatoire via la plateforme ANEF (administration-etrangers-
            en-france.interieur.gouv.fr).
          </li>
          <li>
            <strong>OFII — Office français de l&apos;immigration et de
            l&apos;intégration</strong> : visite médicale, attestation
            d&apos;intégration, aide au retour volontaire si vous le
            souhaitez (voyage pris en charge et allocation forfaitaire,
            sous conditions).
          </li>
          <li>
            <strong>Association CIMADE</strong> : permanences juridiques
            gratuites dans de nombreux départements.
          </li>
        </ul>
      </div>

      {/* Aide au retour */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Si vous envisagez un retour dans votre pays
        </p>
        <p className="mt-2 text-sm text-navy/80">
          L&apos;OFII propose une <strong>aide au retour volontaire</strong>{' '}
          (voyage pris en charge, allocation forfaitaire dont le montant
          dépend de la situation, accompagnement), principalement aux
          personnes en situation irrégulière ou visées par une obligation
          de quitter le territoire (service-public.gouv.fr, fiche F33974).
          Une <strong>aide à la réinsertion</strong> peut compléter, y
          compris pour un projet de création d&apos;entreprise dans le
          pays d&apos;origine (projets sélectionnés).
        </p>
        <p className="mt-2 text-sm text-navy/80">
          C&apos;est une option <strong>volontaire, non infamante</strong>,
          souvent méconnue, qui peut permettre une reconstruction
          professionnelle ailleurs.
        </p>
      </div>

      {/* Contacts */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">CIMADE — droit des étrangers</p>
          <p className="mt-1 text-xs text-navy/60">Permanences juridiques gratuites</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://www.lacimade.org/etre-aide-par-la-cimade/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> lacimade.org
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">OFII — aide au retour</p>
          <p className="mt-1 text-xs text-navy/60">Programme d&apos;aide au retour et à la réinsertion</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://www.ofii.fr/procedure/aide-au-retour-et-aide-a-la-reinsertion"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> ofii.fr/aide-au-retour
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">ANEF — démarches en ligne</p>
          <p className="mt-1 text-xs text-navy/60">Préfecture étrangers (renouvellement, changement)</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://administration-etrangers-en-france.interieur.gouv.fr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> ANEF
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">GISTI / ADDE — appui juridique</p>
          <p className="mt-1 text-xs text-navy/60">Réseaux d&apos;avocats spécialisés</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://www.gisti.org"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> gisti.org
            </a>
            <a
              href="https://www.adde.fr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> adde.fr
            </a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : CESEDA (Code de l&apos;entrée et du séjour des étrangers
        et du droit d&apos;asile), art. L421-5 (entrepreneur / profession
        libérale) et L421-7 à L421-25 (cartes « talent ») ;
        service-public.gouv.fr, fiches F16922 et F35795 ; OFII, programme
        d&apos;aide au retour et à la réinsertion.
      </p>
    </BlocAccordeon>
  );
}
