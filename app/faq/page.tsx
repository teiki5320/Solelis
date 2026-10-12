import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/faq' },
  title: 'Questions fréquentes — Solelis',
  description:
    'Réponses aux questions les plus courantes sur la cessation des paiements, les procédures collectives, les dettes, la protection personnelle et le rebond.',
};

interface QuestionReponse {
  question: string;
  reponse: string;
  liens?: { href: string; label: string; externe?: boolean }[];
}

interface SectionFAQ {
  titre: string;
  id: string;
  questions: QuestionReponse[];
}

const SECTIONS: SectionFAQ[] = [
  {
    titre: 'Cessation des paiements',
    id: 'cessation',
    questions: [
      {
        question: "Qu'est-ce que la cessation des paiements exactement ?",
        reponse:
          "La cessation des paiements est définie par l'article L631-1 du Code de commerce : c'est l'impossibilité de faire face au passif exigible avec l'actif disponible. Concrètement, vous ne pouvez plus payer vos dettes échues (URSSAF, fournisseurs, impôts, loyer) avec votre trésorerie et vos créances clients encaissables immédiatement. Ce n'est pas un simple découvert bancaire — c'est une situation juridique précise, constatée à une date donnée.",
        liens: [
          { href: '/outils/prescription', label: 'Calculateur de délais' },
        ],
      },
      {
        question: 'Quel est le délai pour la déclarer ?',
        reponse:
          "Vous disposez de 45 jours maximum après la date de cessation des paiements pour la déclarer au greffe du tribunal de commerce (article L631-4 du Code de commerce). Ce délai court à partir du moment où vous ne pouvez plus payer vos dettes échues — pas à partir du moment où vous en prenez conscience. La déclaration se fait via le formulaire Cerfa n°10530*02, accompagné des documents comptables.",
        liens: [
          { href: '/courriers', label: 'Modèles de courriers' },
        ],
      },
      {
        question: 'Que se passe-t-il si je ne la déclare pas à temps ?',
        reponse:
          "Ne pas déclarer sciemment la cessation des paiements dans les 45 jours expose le dirigeant à une interdiction de gérer (article L653-8 du Code de commerce), pouvant aller jusqu'à 15 ans. Le tribunal peut aussi remonter la date de cessation des paiements jusqu'à 18 mois en arrière (période suspecte), ce qui annule certains paiements et garanties consentis pendant cette période. En cas de faute de gestion avérée, une action en responsabilité pour insuffisance d'actif est possible (article L651-2).",
      },
      {
        question: 'Puis-je continuer à diriger mon entreprise ?',
        reponse:
          "Cela dépend de la procédure ouverte. En sauvegarde, vous restez aux commandes, le cas échéant avec un administrateur chargé de vous surveiller ou de vous assister (il n'est obligatoire qu'au-delà de seuils de salariés et de chiffre d'affaires fixés par décret, article L621-4). En redressement judiciaire, le tribunal détermine si vous administrez seul ou avec un administrateur (article L631-12). En liquidation judiciaire, vous perdez la gestion : un liquidateur est nommé pour réaliser les actifs et payer les créanciers (article L641-9).",
        liens: [
          { href: '/procedures', label: 'Comparer les procédures' },
        ],
      },
    ],
  },
  {
    titre: 'Procédures collectives',
    id: 'procedures',
    questions: [
      {
        question: 'Quelle est la différence entre sauvegarde et redressement ?',
        reponse:
          "La différence fondamentale est le timing. La sauvegarde (article L620-1) est ouverte avant la cessation des paiements : l'entreprise a des difficultés qu'elle ne peut surmonter seule, mais elle peut encore payer ses dettes. Le redressement (article L631-1) intervient après la cessation des paiements. Dans les deux cas, les poursuites individuelles sont suspendues et un plan d'apurement sur 10 ans maximum peut être adopté. Avantage clé de la sauvegarde : le dirigeant reste toujours aux commandes.",
        liens: [
          { href: '/procedures', label: 'Tableau comparatif des procédures' },
        ],
      },
      {
        question: 'Combien coûte une procédure collective ?',
        reponse:
          "Les frais de greffe suivent un tarif réglementé. Le coût principal vient de la rémunération des mandataires de justice (administrateur, mandataire judiciaire), fixée par un tarif réglementé (art. R663-1 et suivants du Code de commerce) qui dépend notamment du chiffre d'affaires et du nombre de salariés ; elle est payée sur les fonds de la procédure. Demandez une estimation au mandataire. Si vous êtes entrepreneur individuel (personne physique), l'aide juridictionnelle est possible lorsque vos ressources sont faibles.",
      },
      {
        question: 'Combien de temps dure un redressement judiciaire ?',
        reponse:
          "La période d'observation initiale est de 6 mois au plus, renouvelable une fois pour 6 mois (article L621-3), et exceptionnellement prolongeable de 6 mois à la demande du procureur de la République (article L631-7) : 18 mois au maximum. Pendant cette période, le tribunal évalue si l'entreprise est viable. Si oui, un plan de redressement est adopté (apurement des dettes sur 10 ans maximum). Si non, la liquidation judiciaire est prononcée.",
      },
      {
        question: 'Puis-je choisir mon mandataire judiciaire ?',
        reponse:
          "Non, c'est le tribunal qui désigne le mandataire judiciaire et l'administrateur judiciaire (articles L621-4 et L631-9 du Code de commerce). Cependant, vous pouvez proposer le nom d'un ou plusieurs administrateurs judiciaires (article L621-4), le tribunal restant libre de sa décision. Vous pouvez aussi demander au juge-commissaire de saisir le tribunal pour remplacer l'administrateur ou le mandataire judiciaire (article L621-7).",
        liens: [
          { href: '/annuaires/mandataires', label: 'Annuaire des mandataires' },
        ],
      },
    ],
  },
  {
    titre: 'Dettes et créanciers',
    id: 'dettes',
    questions: [
      {
        question: "Puis-je négocier directement avec l'URSSAF ?",
        reponse:
          "Oui. Vous pouvez demander des délais de paiement directement à l'URSSAF (36 98 pour les travailleurs indépendants, 39 57 pour les employeurs ; MSA pour les exploitants agricoles, CGSS outre-mer) ou via la Commission des chefs des services financiers (CCSF) de votre département, qui regroupe tous les créanciers publics (URSSAF, impôts, douanes). La CCSF peut accorder un plan d'échelonnement dont elle fixe la durée. L'URSSAF peut aussi accorder une remise partielle des majorations de retard (article R243-20 du Code de la sécurité sociale).",
        liens: [
          { href: '/courriers/echelonnement-urssaf', label: 'Modèle courrier URSSAF' },
          { href: '/courriers/saisine-ccsf', label: 'Courrier de saisine CCSF' },
        ],
      },
      {
        question: 'Mes dettes personnelles sont-elles concernées ?',
        reponse:
          "Si vous êtes en société (SARL, SAS, SA), vos dettes personnelles sont en principe séparées de celles de l'entreprise — c'est le principe de la personnalité morale. Exceptions : les cautions personnelles que vous avez signées et, en liquidation, la faute de gestion ayant contribué à l'insuffisance d'actif (action en responsabilité pour insuffisance d'actif, article L651-2). Les sommes que vous avez prêtées à la société en compte courant d'associé risquent, elles, de ne pas vous être remboursées. Si vous êtes entrepreneur individuel, la loi du 14 février 2022 protège désormais votre patrimoine personnel de plein droit (article L526-22 du Code de commerce).",
        liens: [
          { href: '/proteger-famille', label: 'Protéger famille et patrimoine' },
        ],
      },
      {
        question: 'Que couvre la garantie AGS pour mes salariés ?',
        reponse:
          "L'AGS (Association pour la gestion du régime de Garantie des créances des Salariés) avance les salaires, indemnités de licenciement, préavis et congés payés impayés en cas de procédure collective. Les plafonds sont fixés par décret (article D3253-5 du Code du travail) : la garantie maximale (« plafond 6 », contrat de travail conclu au moins 2 ans avant le jugement) atteint 6 fois le plafond mensuel retenu pour les contributions d'assurance chômage (4 plafonds mensuels de la Sécurité sociale), soit 96 120 euros en 2026 ; 80 100 euros pour un contrat de 6 mois à 2 ans et 64 080 euros en dessous de 6 mois. La demande est faite par le mandataire judiciaire, pas par le dirigeant.",
        liens: [
          { href: '/annuaires/ags', label: 'Contacts AGS' },
          { href: '/outils/licenciement', label: 'Calculateur indemnités' },
        ],
      },
    ],
  },
  {
    titre: 'Protection personnelle',
    id: 'protection',
    questions: [
      {
        question: 'Ma résidence principale est-elle saisissable ?',
        reponse:
          "Depuis la loi Macron du 6 août 2015 (article L526-1 du Code de commerce), la résidence principale de l'entrepreneur individuel est insaisissable de plein droit par les créanciers professionnels — aucune déclaration notariée n'est nécessaire. Pour les dirigeants de société, les créanciers de la société ne peuvent pas saisir vos biens personnels, mais votre résidence n'est pas protégée contre une banque à qui vous avez donné une caution personnelle ou une hypothèque. Attention : l'insaisissabilité ne joue pas face à l'administration fiscale en cas de manœuvres frauduleuses ou d'inobservation grave et répétée de vos obligations fiscales (article L526-1).",
        liens: [
          { href: '/proteger-famille', label: 'Protection du patrimoine' },
        ],
      },
      {
        question: 'Ma caution personnelle peut-elle être annulée ?',
        reponse:
          "Une caution personnelle peut être contestée dans plusieurs cas : si elle est disproportionnée par rapport à vos revenus et patrimoine au moment de la signature (article 2300 du Code civil pour les cautions signées depuis 2022, ancien article L332-1 du Code de la consommation pour les plus anciennes), si la banque n'a pas respecté son obligation d'information annuelle (article 2302 du Code civil), ou si les conditions de mise en jeu ne sont pas respectées. Un avocat peut analyser votre acte de cautionnement pour identifier des failles.",
        liens: [
          { href: '/proteger-famille', label: 'Cautions : vos protections' },
        ],
      },
      {
        question: 'Quelles sont mes aides personnelles (ATI, RSA) ?',
        reponse:
          "L'ATI (Allocation des travailleurs indépendants) est versée par France Travail aux indépendants après une liquidation judiciaire, un redressement judiciaire avec remplacement du dirigeant, ou l'arrêt d'une activité non viable attesté par un tiers de confiance. Conditions : 2 ans d'activité, au moins 10 000 euros de revenus sur l'une des 2 dernières années, ressources personnelles inférieures au RSA. Elle va d'environ 600 à 800 euros par mois selon les revenus antérieurs, pendant 6 mois (décrets n° 2022-450 et 2022-451 du 30 mars 2022). Le RSA est accessible sous conditions de ressources. La CSS (Complémentaire santé solidaire) couvre vos frais de santé. APESA propose un soutien psychologique gratuit et confidentiel.",
        liens: [
          { href: '/aides-personnelles', label: 'Toutes les aides personnelles' },
          { href: '/outils/ati', label: 'Simulateur ATI' },
          { href: '/parler', label: "Numéros d'écoute gratuits" },
        ],
      },
    ],
  },
  {
    titre: 'Rebondir après',
    id: 'rebond',
    questions: [
      {
        question: 'Puis-je recréer une entreprise après une liquidation ?',
        reponse:
          "Oui, sauf si le tribunal a prononcé une interdiction de gérer (article L653-8 du Code de commerce), ce qui est réservé aux cas de faute de gestion grave. Vous n'avez pas à attendre la clôture de la liquidation pour recréer une entreprise ; un entrepreneur individuel peut même exercer une nouvelle activité pendant sa liquidation, avec un nouveau patrimoine professionnel non concerné par la procédure (article L681-2). À la clôture pour insuffisance d'actif, les créanciers ne retrouvent pas, sauf exceptions (fraude, faillite personnelle, banqueroute…), le droit de vous poursuivre (article L643-11) ; mais les cautions et coobligés qui ont payé à votre place peuvent, eux, agir contre vous. Pour les dirigeants de société, la clôture met fin à la procédure mais pas aux cautions personnelles.",
        liens: [
          { href: '/rebond', label: 'Guide du rebond' },
        ],
      },
      {
        question: 'Quelles aides existent pour repartir (ACRE, ARCE) ?',
        reponse:
          "L'ACRE (Aide aux créateurs et repreneurs d'entreprise) offre une exonération partielle de cotisations sociales pendant environ 12 mois, réservée à certains publics (demandeurs d'emploi, bénéficiaires du RSA ou de l'ASS, jeunes de 18 à 25 ans, création en quartier prioritaire…), à demander à l'Urssaf dans les 60 jours. L'ARCE (Aide à la reprise ou à la création d'entreprise) permet de percevoir 60 % de ses droits ARE restants en deux versements pour capitaliser le projet. Le prêt d'honneur (Initiative France, Réseau Entreprendre) est un prêt personnel à taux zéro et sans garantie, dont le montant dépend du réseau et du projet. 60 000 Rebonds accompagne gratuitement les entrepreneurs après une liquidation. Bpifrance et les Régions proposent aussi des prêts de développement : renseignez-vous auprès de votre direction régionale Bpifrance.",
        liens: [
          { href: '/rebond', label: 'Guide complet du rebond' },
          { href: '/aides', label: 'Toutes les aides entreprise' },
        ],
      },
      {
        question: 'Combien de temps faut-il pour se relancer ?',
        reponse:
          "Il n'y a pas de délai légal d'attente (sauf interdiction de gérer). En pratique, le délai varie beaucoup d'une personne à l'autre. L'accompagnement par des réseaux spécialisés (60 000 Rebonds, BGE, CCI) aide à préparer le nouveau projet. Le plus important est de prendre le temps de tirer les enseignements de l'expérience précédente et de se faire accompagner psychologiquement si besoin (APESA, associations de pairs).",
        liens: [
          { href: '/parler', label: "Parler à quelqu'un" },
          { href: '/accompagnant', label: "J'accompagne un proche" },
        ],
      },
    ],
  },
];

function buildFaqJsonLd() {
  const mainEntity = SECTIONS.flatMap((section) =>
    section.questions.map((qr) => ({
      '@type': 'Question' as const,
      name: qr.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: qr.reponse,
      },
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

export default function FAQPage() {
  const faqJsonLd = buildFaqJsonLd();

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:pt-32">
      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Questions fréquentes
      </h1>
      <p className="mt-3 text-base text-navy/60 sm:text-lg">
        Les réponses aux questions que se posent les dirigeants en difficulté,
        avec les sources juridiques. Cette page ne remplace pas un conseil
        personnalisé.
      </p>

      {/* FAQ ciblées par situation */}
      <nav className="mt-8 rounded-2xl border border-bleu/30 bg-bleu/5 p-5" aria-label="FAQ ciblées">
        <p className="text-sm font-medium text-bleu-fonce uppercase tracking-wide">
          FAQ ciblées
        </p>
        <p className="mt-1 text-sm text-navy/70">
          Réponses spécifiques à votre situation
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          <li>
            <Link href="/faq/urssaf-impayee" className="block rounded-lg bg-white/80 px-3 py-2 text-sm text-bleu-fonce hover:bg-white">
              💼 URSSAF impayée
            </Link>
          </li>
          <li>
            <Link href="/faq/pge-en-difficulte" className="block rounded-lg bg-white/80 px-3 py-2 text-sm text-bleu-fonce hover:bg-white">
              💳 PGE en difficulté
            </Link>
          </li>
          <li>
            <Link href="/faq/assignation-tribunal" className="block rounded-lg bg-white/80 px-3 py-2 text-sm text-bleu-fonce hover:bg-white">
              ⚖️ Assignation au tribunal
            </Link>
          </li>
          <li>
            <Link href="/faq/caution-personnelle" className="block rounded-lg bg-white/80 px-3 py-2 text-sm text-bleu-fonce hover:bg-white">
              🛡️ Caution personnelle
            </Link>
          </li>
          <li>
            <Link href="/faq/cessation-paiements" className="block rounded-lg bg-white/80 px-3 py-2 text-sm text-bleu-fonce hover:bg-white">
              ⏰ Cessation des paiements
            </Link>
          </li>
          <li>
            <Link href="/faq/rebondir-apres-liquidation" className="block rounded-lg bg-white/80 px-3 py-2 text-sm text-bleu-fonce hover:bg-white">
              ♻️ Rebondir après liquidation
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sommaire */}
      <nav className="mt-8 glass-soft rounded-2xl p-5" aria-label="Sommaire FAQ">
        <p className="text-sm font-medium text-navy/50 uppercase tracking-wide">
          Sommaire général
        </p>
        <ul className="mt-3 space-y-1.5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-sm text-bleu hover:text-bleu-fonce transition"
              >
                {s.titre}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="mt-12 scroll-mt-28">
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            {section.titre}
          </h2>

          <div className="mt-5 space-y-3">
            {section.questions.map((qr, i) => (
              <details
                key={i}
                className="glass-soft rounded-2xl group"
              >
                <summary className="cursor-pointer select-none list-none px-6 py-4 text-navy font-medium hover:bg-navy/5 rounded-2xl transition [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    <span className="text-sm sm:text-base">{qr.question}</span>
                    <span
                      className="shrink-0 text-navy/40 transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <div className="border-t border-navy/5 px-6 py-5">
                  <p className="text-sm leading-relaxed text-navy/75 sm:text-base">
                    {qr.reponse}
                  </p>
                  {qr.liens && qr.liens.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {qr.liens.map((lien) =>
                        lien.externe ? (
                          <a
                            key={lien.href}
                            href={lien.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-bleu/10 px-3 py-1.5 text-xs font-medium text-bleu transition hover:bg-bleu/20"
                          >
                            {lien.label}
                          </a>
                        ) : (
                          <Link
                            key={lien.href}
                            href={lien.href}
                            className="inline-flex items-center gap-1 rounded-lg bg-bleu/10 px-3 py-1.5 text-xs font-medium text-bleu transition hover:bg-bleu/20"
                          >
                            {lien.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}

      {/* Bloc de renvoi */}
      <div className="mt-16 glass-soft rounded-2xl p-6 text-center">
        <p className="font-display text-lg text-navy">
          Vous ne trouvez pas la réponse à votre question ?
        </p>
        <p className="mt-2 text-sm text-navy/60">
          Créez votre fiche personnalisée en 5 minutes environ pour obtenir des réponses
          adaptées à votre situation.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-bleu-fonce px-6 py-3 text-sm font-medium text-white transition hover:bg-bleu-fonce/90"
        >
          Commencer
        </Link>
      </div>
    </div>
    </>
  );
}
