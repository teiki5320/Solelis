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
      soustitre="Passeport Talent, carte entrepreneur, OFII : ce qu&apos;il faut anticiper"
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
          Si vous êtes en Passeport Talent « créateur d&apos;entreprise »
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            Délivré pour <strong>4 ans</strong> renouvelables, conditionné
            à un projet économique sérieux (investissement ≥ 30 000 €,
            création d&apos;emplois).
          </li>
          <li>
            <strong>Le titre n&apos;est PAS automatiquement retiré</strong>{' '}
            en cours de validité en cas de difficulté économique : il
            court jusqu&apos;à son terme. C&apos;est au renouvellement
            que se pose la question.
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
            Délivrée pour <strong>1 an</strong> renouvelable. Plus
            précaire que le Passeport Talent.
          </li>
          <li>
            Condition essentielle : <strong>activité économique en cours
            et viable</strong> (CA suffisant, comptes à jour, paiement
            des cotisations).
          </li>
          <li>
            En cas de cessation, le titre peut être refusé au
            renouvellement ou abrogé prématurément (rare en pratique).
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
            <strong>Anticiper le renouvellement</strong> : déposer le
            dossier 2 à 4 mois avant l&apos;expiration. Tout dépôt tardif
            peut entraîner une obligation de quitter le territoire (OQTF).
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
            souhaitez (allocation forfaitaire 650 € + billet d&apos;avion).
          </li>
          <li>
            <strong>Association CIMADE</strong> : permanences juridiques
            gratuites, dans chaque département.
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
          (montant forfaitaire 650 € + billet d&apos;avion + accompagnement)
          aux ressortissants en situation régulière mais sans perspective.
          Une <strong>aide à la réinsertion économique</strong>{' '}
          (jusqu&apos;à 5 000 €) peut compléter pour un projet de
          création dans le pays d&apos;origine.
        </p>
        <p className="mt-2 text-sm text-navy/80">
          C&apos;est une option <strong>volontaire, non infamante</strong>,
          souvent méconnue, qui peut éviter une OQTF et permettre une
          reconstruction professionnelle ailleurs.
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
        et du droit d&apos;asile), art. L421-1 et s. (Passeport Talent),
        L421-5 (entrepreneur) ; arrêtés ministériels sur les conditions
        d&apos;intégration ; OFII, programme ARR (aide au retour et à la
        réinsertion) ; jurisprudence CE sur le renouvellement des titres
        économiques.
      </p>
    </BlocAccordeon>
  );
}
