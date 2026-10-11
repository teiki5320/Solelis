import { ogMeta } from '@/lib/og';

export const metadata = ogMeta({
  chemin: '/glossaire',
  titre: 'Le glossaire, expliqué simplement',
  sous: 'Procédures, dispositifs, sigles — sans jargon',
  description:
    'Les procédures collectives et dispositifs expliqués simplement : mandat ad hoc, conciliation, sauvegarde, RJ, LJ, PRP, PGE, CCSF, AGS, CSP, ATI…',
  cat: 'procedure',
  pageTitle: 'Glossaire des procédures — Solelis',
});

interface Term {
  name: string;
  enClair: string;
  pourQui: string;
  duree: string;
}

const terms: Term[] = [
  {
    name: 'Mandat ad hoc',
    enClair:
      "Un juge désigne quelqu'un (le mandataire ad hoc) pour vous aider à négocier avec vos créanciers. C'est préventif, confidentiel, et personne n'est au courant.",
    pourQui:
      'Un dirigeant qui sent que la situation se complique mais qui peut encore payer ses dettes.',
    duree: 'Pas de durée légale : elle est fixée par le président du tribunal (art. L611-3 C. com.).',
  },
  {
    name: 'Conciliation',
    enClair:
      "Similaire au mandat ad hoc, mais un peu plus encadré. Un conciliateur est nommé par le tribunal pour trouver un accord avec vos créanciers. C'est confidentiel.",
    pourQui:
      "Un dirigeant en difficulté, avec ou sans cessation des paiements depuis moins de 45 jours.",
    duree: '4 mois, prolongeable 1 mois.',
  },
  {
    name: 'Sauvegarde',
    enClair:
      "Le tribunal vous protège de vos créanciers pendant que vous restructurez. Vous gardez le contrôle de l'entreprise, avec l'aide d'un administrateur.",
    pourQui:
      "Un dirigeant qui n'est PAS encore en cessation des paiements, mais qui ne peut pas surmonter ses difficultés seul.",
    duree: 'Période d’observation de 6 mois, renouvelable une fois 6 mois : 12 mois au maximum (art. L621-3 C. com.).',
  },
  {
    name: 'Sauvegarde accélérée',
    enClair:
      "Version express de la sauvegarde, qui intervient après une conciliation. Le tribunal impose un plan aux créanciers récalcitrants en quelques semaines.",
    pourQui:
      "Entreprise engagée dans une conciliation, qui a préparé un projet de plan susceptible d'être largement soutenu, et dont les comptes sont certifiés par un commissaire aux comptes ou établis par un expert-comptable (art. L628-1 C. com.). Il n'y a plus de seuil de salariés ou de chiffre d'affaires depuis le 1er octobre 2021.",
    duree: '2 mois, prolongeable — 4 mois au total maximum (art. L628-8 C. com.).',
  },
  {
    name: 'Redressement judiciaire',
    enClair:
      "Vous êtes en cessation des paiements. Le tribunal tente de sauver l'entreprise en mettant en place un plan. Un administrateur est nommé pour vous aider (ou vous remplacer dans les cas graves).",
    pourQui:
      "Un dirigeant en cessation des paiements, dont l'entreprise peut encore être sauvée.",
    duree: '6 mois, renouvelable une fois, et exceptionnellement prolongeable de 6 mois à la demande du procureur : 18 mois au maximum (art. L621-3 et L631-7 C. com.).',
  },
  {
    name: 'Liquidation judiciaire',
    enClair:
      "Quand le redressement n'est pas possible. L'activité s'arrête, les actifs sont vendus pour payer les créanciers. Un liquidateur gère tout.",
    pourQui:
      "Quand l'entreprise ne peut manifestement pas être sauvée.",
    duree: 'Variable — de 6 mois à plusieurs années.',
  },
  {
    name: 'Liquidation judiciaire simplifiée',
    enClair:
      "Version plus rapide et moins coûteuse de la liquidation, pour les petites entreprises. Même effet, procédure allégée.",
    pourQui:
      "Obligatoire si : aucun bien immobilier, 5 salariés au plus sur les 6 mois précédant l'ouverture et chiffre d'affaires hors taxes de 750 000 € au plus (art. L641-2 et D641-10 C. com.).",
    duree: 'Clôture dans les 6 mois (1 salarié au plus et CA HT de 300 000 € au plus) ou dans l’année sinon, prorogeable de 3 mois maximum (art. L644-5 et D641-10 C. com.).',
  },
  {
    name: 'Plan de continuation',
    enClair:
      "Après un redressement judiciaire, le tribunal valide un plan pour rembourser les dettes sur plusieurs années tout en poursuivant l'activité.",
    pourQui:
      "Entreprises en redressement judiciaire dont l'activité est viable.",
    duree: "Jusqu'à 10 ans.",
  },
  {
    name: 'Plan de cession',
    enClair:
      "Le tribunal ordonne le transfert de l'entreprise à un repreneur. L'activité et les emplois sont préservés — les dettes restent dans l'ancienne structure.",
    pourQui:
      "En redressement judiciaire, quand un plan de continuation n'est pas viable mais que l'activité mérite d'être sauvée.",
    duree: 'Variable — dépend des offres de reprise.',
  },
  {
    name: 'Rétablissement professionnel (PRP)',
    enClair:
      "Procédure simplifiée qui efface vos dettes professionnelles SANS passer par une liquidation complète. Un vrai nouveau départ, rapide et discret.",
    pourQui:
      "Entrepreneurs individuels uniquement (pas les sociétés). Conditions : cessation des paiements, aucun salarié, actifs inférieurs à 15 000 €.",
    duree: '4 mois maximum.',
  },
  {
    name: 'Clôture pour insuffisance d’actif',
    enClair:
      "La façon la plus courante de clore une liquidation : quand il n'y a plus assez d'actifs pour payer toutes les dettes. Ce n'est pas une sanction — c'est simplement la fin de la procédure.",
    pourQui:
      "Toute entreprise en liquidation dont les actifs sont épuisés.",
    duree: 'Intervient quand le liquidateur a réalisé tous les actifs.',
  },
  {
    name: 'Cessation des paiements',
    enClair:
      "Définition légale : vous ne pouvez plus payer vos dettes avec l'argent dont vous disposez immédiatement. Vous avez 45 jours pour le déclarer au tribunal.",
    pourQui:
      "Toute entreprise qui ne peut plus faire face à son passif exigible avec son actif disponible.",
    duree: 'Ce n’est pas une procédure — c’est un état.',
  },
  {
    name: 'Tribunal de commerce',
    enClair:
      "Le tribunal spécialisé dans les litiges entre commerçants et les procédures collectives. Les juges sont eux-mêmes des chefs d'entreprise bénévoles.",
    pourQui:
      "Toute entreprise commerciale confrontée à un litige ou à des difficultés.",
    duree: "Il n'y a pas de durée — c'est une institution.",
  },
  {
    name: 'Mandataire judiciaire',
    enClair:
      "Un professionnel nommé par le tribunal pour représenter les créanciers pendant la procédure. Il vérifie les créances et défend leurs intérêts.",
    pourQui:
      "Nommé dans toute procédure de sauvegarde, redressement ou liquidation.",
    duree: 'Présent pendant toute la durée de la procédure.',
  },
  {
    name: 'Administrateur judiciaire',
    enClair:
      "Un professionnel nommé par le tribunal pour aider le dirigeant à gérer l'entreprise pendant la procédure. Il peut aussi préparer un plan de redressement.",
    pourQui:
      'Nommé dans les procédures de sauvegarde et de redressement judiciaire.',
    duree: "Présent pendant la période d'observation.",
  },
  {
    name: 'Caution personnelle',
    enClair:
      "Engagement personnel du dirigeant à payer les dettes de l'entreprise avec ses propres biens. Survit à la liquidation de l'entreprise. Peut être contestée si disproportionnée.",
    pourQui:
      "Tout dirigeant qui a signé une garantie personnelle auprès d'une banque ou d'un bailleur.",
    duree: 'Dure tant que la dette garantie existe.',
  },
  {
    name: 'CODEFI',
    enClair:
      "Comité départemental qui aide les entreprises de moins de 400 salariés en difficulté de financement. Peut négocier avec vos créanciers et débloquer des aides.",
    pourQui:
      "Entreprises de moins de 400 salariés, tous secteurs. Accès via la Préfecture ou la DREETS.",
    duree: "Accompagnement sur mesure, pas de durée fixe.",
  },
  {
    name: 'CIP (Centre d’Information sur la Prévention)',
    enClair:
      "Réseau de centres locaux qui informent gratuitement et confidentiellement les dirigeants sur les options de prévention. Animé par des bénévoles (anciens chefs d'entreprise, avocats, comptables).",
    pourQui:
      "Tout dirigeant inquiet pour son entreprise, à n'importe quel stade.",
    duree: 'Rendez-vous ponctuel, gratuit.',
  },
  {
    name: 'PGE (Prêt Garanti par l’État)',
    enClair:
      "Prêt distribué par votre banque pendant la crise Covid (2020-2021), garanti à 70 à 90 % par l’État. Le protocole de place du 19 janvier 2022 permet de l’étaler jusqu’à 10 ans sans perdre la garantie d’État.",
    pourQui:
      "Toute entreprise ayant souscrit un PGE et qui peine aujourd’hui à le rembourser.",
    duree: 'Restructuration amiable à tenter en priorité ; en sauvegarde ou redressement, le PGE peut aussi être rééchelonné dans le plan, garantie d’État maintenue.',
  },
  {
    name: 'APLD-R (Activité Partielle Longue Durée Rebond)',
    enClair:
      "Dispositif créé par la loi de finances 2025 (décret n° 2025-338 du 14 avril 2025) pour réduire l’horaire de travail jusqu’à 40 % en contrepartie d’engagements de maintien de l’emploi et de formation. Il ne peut plus être mis en place depuis le 1er mars 2026 : seuls les accords et documents transmis avant le 28 février 2026 continuent de s’appliquer.",
    pourQui:
      "Employeurs déjà couverts par un accord ou un document APLD-R validé. Pour une nouvelle demande : activité partielle de droit commun.",
    duree: '18 mois maximum, consécutifs ou non, sur 24 mois ; accords applicables jusqu’au 30 avril 2028 au plus tard.',
  },
  {
    name: 'CCSF (Commission des chefs des services financiers)',
    enClair:
      "Guichet unique qui regroupe vos dettes fiscales (SIE) et sociales (URSSAF) pour un échéancier global. Saisine confidentielle via la DDFiP (dossier de saisine sur impots.gouv.fr).",
    pourQui:
      "Dirigeants avec dettes fiscales ET sociales — sauf en RJ/LJ.",
    duree: 'Durée du plan fixée par la commission ; réponse sous 2 mois, sinon la demande est rejetée.',
  },
  {
    name: 'CRP (Commissaire aux Restructurations et à la Prévention)',
    enClair:
      "Représentant de l’État en région (DREETS / Préfecture) chargé d’accompagner confidentiellement les entreprises en difficulté. Aide à coordonner les créanciers publics et privés.",
    pourQui:
      "Entreprises en difficulté de toute taille — particulièrement utile pour les ETI et PME stratégiques.",
    duree: 'Accompagnement confidentiel, pas de durée fixe.',
  },
  {
    name: 'CIRI (Comité Interministériel de Restructuration Industrielle)',
    enClair:
      "Cellule interministérielle dédiée aux entreprises de plus de 400 salariés (ou plus de 250 stratégiques). Coordonne État, banques et créanciers publics pour structurer un plan de retournement.",
    pourQui:
      "Entreprises >250 salariés stratégiques ou >400 salariés.",
    duree: 'Accompagnement confidentiel.',
  },
  {
    name: 'AGS (Association pour la Gestion du régime de garantie des créances des Salariés)',
    enClair:
      "L’AGS garantit le paiement des salaires et indemnités quand l’entreprise est en procédure collective et ne peut plus payer. Plafonds 2026 : 64 080 €, 80 100 € ou 96 120 € selon l’ancienneté du contrat de travail (4, 5 ou 6 fois le plafond mensuel retenu pour les contributions d’assurance chômage (lui-même égal à 4 plafonds mensuels de la Sécurité sociale), art. D3253-5 C. trav.).",
    pourQui:
      "Tous les salariés d’une entreprise en RJ ou LJ.",
    duree: 'Fonds versés au mandataire 5 à 8 jours après réception des relevés de créances (C. trav. L3253-21).',
  },
  {
    name: 'CSP (Contrat de Sécurisation Professionnelle)',
    enClair:
      "Document obligatoire à remettre à chaque salarié licencié pour motif économique dans une entreprise < 1 000 salariés (ou en RJ/LJ). Le salarié touche jusqu’à 12 mois une allocation (ASP) de 75 % de son salaire journalier de référence s’il a au moins 1 an d’ancienneté (sinon le montant de l’allocation chômage).",
    pourQui:
      "Employeurs en licenciement économique, sous peine de devoir 2 mois de salaire à France Travail par salarié non informé.",
    duree: 'Le salarié a 21 jours pour accepter ou refuser.',
  },
  {
    name: 'PSE (Plan de Sauvegarde de l’Emploi)',
    enClair:
      "Plan obligatoire si l’entreprise a au moins 50 salariés ET licencie au moins 10 salariés sur 30 jours. Doit prévoir reclassement, formation, indemnités supra-légales. Validé/homologué par la DREETS.",
    pourQui:
      "Entreprises ≥ 50 salariés en licenciement collectif important.",
    duree: 'Validation accord 15 j / homologation document unilatéral 21 j.',
  },
  {
    name: 'ATI (Allocation des Travailleurs Indépendants)',
    enClair:
      "Allocation chômage spécifique aux indépendants : de 19,73 à 26,30 €/jour (environ 600 à 800 €/mois) selon vos revenus antérieurs, pendant 6 mois. Conditions : 2 ans d’activité dans la même entreprise, au moins 10 000 € de revenus d’activité sur l’une des 2 dernières années, ressources personnelles inférieures au RSA d’une personne seule.",
    pourQui:
      "Indépendants (EI, micro, gérant majoritaire) après une liquidation judiciaire, un redressement judiciaire avec remplacement du dirigeant, ou l’arrêt d’une activité non viable attesté par un tiers de confiance.",
    duree: '6 mois maximum.',
  },
  {
    name: 'ACRE / ARCE',
    enClair:
      "ACRE = exonération partielle de cotisations sociales pendant 1 an pour les créateurs et repreneurs (depuis 2026 : un quart des cotisations visées hors micro, et 25 % de réduction pour les micro-entreprises créées depuis le 1er juillet 2026 ; demande à l’Urssaf sous 60 jours). ARCE = versement en capital de l’allocation chômage (60 % des droits restants, moins 3 % pour la retraite complémentaire) si vous percevez l’ARE et avez obtenu l’ACRE, et que vous créez/reprenez.",
    pourQui:
      "Toute personne créant ou reprenant une activité — particulièrement utile pour rebondir.",
    duree: 'ACRE : 12 mois. ARCE : versement en 2 fois.',
  },
  {
    name: 'FSE+ (Fonds Social Européen Plus 2021-2027)',
    enClair:
      "Cofinancement européen jusqu’à 60 % des actions de reclassement, formation et accompagnement des salariés lors de restructurations. Géré par les Régions et la DGEFP.",
    pourQui:
      "Employeurs en PSE ou plan de reclassement.",
    duree: 'Programme 2021-2027.',
  },
  {
    name: 'FNE-Formation',
    enClair:
      "Financement public de la formation des salariés pendant une baisse d’activité ou une restructuration. Cumulable avec l’activité partielle (et l’APLD-R pour les accords encore en vigueur).",
    pourQui:
      "Employeurs en difficulté économique, demande déposée à l’OPCO.",
    duree: 'Selon plan de formation.',
  },
  {
    name: 'Médiation du crédit (Banque de France)',
    enClair:
      "Service gratuit et confidentiel de la Banque de France pour aider les entreprises confrontées à un refus bancaire (prêt, découvert, restructuration PGE).",
    pourQui:
      "Tout dirigeant face à une difficulté bancaire.",
    duree: 'Le médiateur vous contacte sous 48 h ; vos banques ont ensuite 5 jours ouvrés pour revoir leur position.',
  },
  {
    name: 'Médiation des entreprises',
    enClair:
      "Service gratuit et confidentiel pour résoudre les litiges entre entreprises (fournisseurs, clients, donneurs d’ordres).",
    pourQui:
      "Tout dirigeant en litige commercial.",
    duree: 'Variable selon dossier.',
  },
  {
    name: 'Conseillers-Entreprises',
    enClair:
      "Plateforme unique de l’État (Bercy) pour identifier l’aide ou l’interlocuteur public adapté à votre situation. Un conseiller vous rappelle gratuitement.",
    pourQui:
      "Tout dirigeant qui ne sait pas par quoi commencer.",
    duree: 'Rappel sous 5 jours ouvrés.',
  },
  {
    name: 'Période suspecte',
    enClair:
      "La période qui va de la date de cessation des paiements fixée par le tribunal jusqu’au jugement d’ouverture. Cette date peut être reportée jusqu’à 18 mois avant le jugement (art. L631-8 C. com.). Certains actes accomplis pendant cette période (paiements anticipés, ventes à prix anormal…) peuvent être annulés ; les donations faites dans les 6 mois qui précèdent la cessation des paiements peuvent l’être aussi (art. L632-1 C. com.).",
    pourQui:
      "Toute entreprise entrant en procédure collective — important pour anticiper les actes à risque.",
    duree: 'Au maximum 18 mois avant le jugement d’ouverture.',
  },
  {
    name: 'Action paulienne (art. 1341-2 C. civ.)',
    enClair:
      "Procédure permettant à un créancier d’attaquer un acte fait par le débiteur en fraude de ses droits (donation à un proche, changement de régime matrimonial précipité). Elle ne dépend pas d’une procédure collective ni de la période suspecte : il faut prouver la fraude.",
    pourQui:
      "Créanciers individuels — à connaître pour ne pas faire d’erreur défensive.",
    duree: 'Prescription : 5 ans à compter de la connaissance de l’acte.',
  },
  {
    name: 'APESA (Aide Psychologique aux Entrepreneurs en Souffrance Aiguë)',
    enClair:
      "Dispositif de soutien psychologique gratuit pour les dirigeant·e·s en grande souffrance. Une alerte peut être donnée, avec votre accord, par une « sentinelle » formée (tribunal de commerce, expert-comptable, CCI…) ; vous pouvez aussi appeler le numéro vert 0 805 65 50 50 (7 j/7, de 8 h à 20 h). Site : www.apesa-france.com.",
    pourQui:
      "Tout dirigeant traversant une crise psychique.",
    duree: 'Prise en charge rapide, gratuite et confidentielle par un·e psychologue formé·e.',
  },
  {
    name: '60 000 Rebonds',
    enClair:
      "Association nationale qui accompagne gratuitement les dirigeants après une liquidation : mentor, groupe de pairs, bilan de compétences, projet de rebond.",
    pourQui:
      "Dirigeants post-liquidation souhaitant rebondir.",
    duree: '12 à 24 mois d’accompagnement.',
  },
  {
    name: 'Surendettement (commission BdF)',
    enClair:
      "Procédure spécifique aux personnes physiques pour traiter les dettes non professionnelles (crédit conso, loyer, énergie). Plan conventionnel, mesures imposées ou rétablissement personnel selon les cas.",
    pourQui:
      "Personnes physiques (EI, indépendants, particuliers) en impossibilité manifeste de payer leurs dettes personnelles.",
    duree: 'Plan jusqu’à 7 ans ou effacement total.',
  },
];

export default function GlossairePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-6 pb-20 sm:pt-14">
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Glossaire
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Les procédures expliquées simplement
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Pas de jargon. Pas de panique. Juste ce que ça veut dire,
          concrètement.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {terms.map((term) => (
          <article
            key={term.name}
            className="glass card-top-line p-6 sm:p-8"
          >
            <h2 className="font-display text-xl text-navy sm:text-2xl">
              {term.name}
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-bleu-fonce/70">
                  En clair :
                </span>
                <p className="mt-1 leading-relaxed text-navy/80">
                  {term.enClair}
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-bleu-fonce/70">
                  Pour qui :
                </span>
                <p className="mt-1 leading-relaxed text-navy/80">
                  {term.pourQui}
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-bleu-fonce/70">
                  Durée :
                </span>
                <p className="mt-1 leading-relaxed text-navy/80">
                  {term.duree}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
