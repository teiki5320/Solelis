import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { META_PAGE_INTROUVABLE } from '@/lib/og';

interface QR {
  q: string;
  r: string;
}

interface FaqCiblee {
  titre: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  questions: QR[];
  liensConseilles: { href: string; label: string }[];
}

const FAQ_PAR_SITUATION: Record<string, FaqCiblee> = {
  'urssaf-impayee': {
    titre: 'FAQ — URSSAF impayée : vos questions, nos réponses',
    metaTitle: 'URSSAF impayée : que faire ? Toutes vos questions — Solelis',
    metaDesc: 'Cotisations URSSAF impayées, mise en demeure, prescription, CCSF : 12 questions et réponses claires pour les dirigeants en difficulté.',
    intro: "Cotisations en retard, lettre recommandée, ATD imminent ? Vous êtes loin d'être seul·e. Voici les 12 questions qui reviennent le plus souvent — sources officielles à l'appui.",
    questions: [
      { q: 'L\'URSSAF peut-elle saisir mon compte bancaire ?', r: 'Oui, une fois qu\'elle dispose d\'un titre exécutoire (par exemple une contrainte), via une opposition à tiers détenteur (art. L133-4-9 CSS), contestable dans le mois devant le juge de l\'exécution. Pour l\'éviter, négociez un échéancier avant, ou contestez la mise en demeure devant la CRA (Commission de recours amiable) dans les 2 mois.' },
      { q: 'Mes cotisations de 2018, sont-elles encore dues ?', r: 'Pas forcément. L\'art. L244-3 CSS prescrit les cotisations par 3 ans à compter de la fin de l\'année au titre de laquelle elles sont dues (5 ans en cas de travail dissimulé). Si vous n\'avez reçu aucune mise en demeure dans ce délai, elles sont prescrites ; si une mise en demeure a été envoyée à temps, l\'URSSAF dispose d\'un nouveau délai de 3 ans pour agir (art. L244-8-1 CSS). À vérifier avec votre expert-comptable ou un avocat.' },
      { q: 'Qu\'est-ce que la CCSF et comment la saisir ?', r: 'La Commission des chefs des services financiers (CCSF) coordonne fisc + Urssaf en un guichet unique. Permet un échelonnement des dettes fiscales ET sociales (part patronale), d\'une durée fixée par la commission. Saisine via la DDFiP de votre département (dossier de saisine sur impots.gouv.fr), à condition d\'être à jour de vos déclarations et de la part salariale des cotisations. Confidentiel, gratuit.' },
      { q: 'Je suis micro-entrepreneur : puis-je négocier ?', r: 'Oui. L\'URSSAF répond aux travailleurs indépendants, micro-entrepreneurs compris, au 36 98. La fiche officielle de la CCSF n\'est pas destinée aux micro-entrepreneurs (entreprendre.service-public.gouv.fr) : adressez-vous d\'abord à l\'URSSAF et à votre SIE ; vous pouvez en outre solliciter l\'action sociale de l\'URSSAF (aide d\'urgence, prise en charge partielle). Demande à formuler par écrit, avec justificatifs de baisse d\'activité.' },
      { q: 'L\'URSSAF peut-elle me poursuivre personnellement ?', r: 'En société, les cotisations sont une dette de la société, pas la vôtre. Exceptions : en cas de travail dissimulé accompagné de manœuvres frauduleuses ou d\'inobservation grave et répétée des obligations sociales, le dirigeant peut être déclaré solidairement responsable (art. L243-3-2 CSS) ; en liquidation, le tribunal peut aussi retenir une faute de gestion (art. L651-2 C. com.). Entrepreneur individuel : depuis 2022, l\'URSSAF peut saisir l\'ensemble de votre patrimoine en cas de manœuvres frauduleuses ou d\'inobservation grave et répétée (art. L133-4-7 CSS) — pas pour une simple difficulté ponctuelle.' },
      { q: 'Je suis en redressement judiciaire : que devient ma dette URSSAF ?', r: 'Elle entre dans le passif et fait l\'objet d\'une déclaration de créance par l\'URSSAF dans les 2 mois suivant la publication. Elle sera traitée comme les autres créances dans le plan de continuation. Les cotisations postérieures au jugement deviennent des créances privilégiées à payer normalement.' },
      { q: 'Le moratoire est-il automatique ?', r: 'Non. Vous devez le demander explicitement, par écrit, en justifiant votre situation (baisse de CA, événement personnel, baisse d\'activité saisonnière). Tant que l\'échéancier accordé est respecté, l\'URSSAF ne poursuit pas le recouvrement. Bon à savoir : une mise en demeure peut quand même vous être envoyée pendant le délai accordé ; selon l\'URSSAF, c\'est une garantie pour sa créance, qui ne remet pas en cause votre accord de délai.' },
      { q: 'Et si je ne réponds pas à la mise en demeure ?', r: 'La mise en demeure vous laisse 1 mois pour payer (art. L244-2 et R133-3 CSS) et 2 mois pour la contester devant la CRA (art. R142-1 CSS). À défaut, l\'URSSAF peut délivrer une contrainte : sans opposition devant le tribunal judiciaire dans les 15 jours de sa signification, elle a les effets d\'un jugement et permet des saisies (art. L244-9 et R133-3 CSS). Ne laissez pas traîner : un simple appel à l\'URSSAF (36 98 indépendant·e·s, 39 57 employeurs) permet souvent d\'éviter l\'engrenage.' },
      { q: 'Mes salariés sont-ils impactés par mes dettes URSSAF ?', r: 'Ne pas reverser les cotisations salariales prélevées sur leur salaire est une infraction pénale (art. L244-6 CSS). Les salariés conservent leurs droits Sécu (CPAM, retraite) sur la base des déclarations faites. Mais en cas de fraude grave, le dirigeant peut être poursuivi pénalement.' },
      { q: 'L\'URSSAF accepte-t-elle des remises gracieuses ?', r: 'Oui, sur les majorations et pénalités (rarement sur le principal). Demande écrite, justifier la bonne foi et la situation. La CRA peut accorder une remise partielle. À combiner avec un échéancier.' },
      { q: 'Je suis en cessation : URSSAF ou tribunal d\'abord ?', r: 'En théorie, la déclaration de cessation au tribunal est prioritaire (45 j max — art. L631-4 C. com.). En pratique, prévenir l\'URSSAF en parallèle (36 98 indépendant·e·s, 39 57 employeurs) peut éviter une opposition à tiers détenteur (art. L133-4-9 CSS) qui aggraverait votre trésorerie pendant les 45 j.' },
      { q: 'Une procédure collective efface-t-elle ma dette URSSAF ?', r: 'En liquidation judiciaire avec clôture pour insuffisance d\'actif : la dette n\'est pas éteinte, mais l\'URSSAF ne retrouve pas, en principe, le droit de poursuivre le débiteur (art. L643-11 C. com., sauf exceptions comme la fraude) ; cela ne protège pas le dirigeant s\'il a été déclaré solidairement responsable (art. L243-3-2 CSS). En RJ avec plan : la dette est échelonnée selon le plan. Le rétablissement professionnel (PRP) efface la plupart des dettes professionnelles d\'un entrepreneur individuel sans salarié depuis 6 mois et dont l\'actif est inférieur à 15 000 € (art. L645-1 et R645-1 C. com.).' },
    ],
    liensConseilles: [
      { href: '/situation/dettes-urssaf', label: 'Guide complet — Dettes URSSAF' },
      { href: '/courriers/echelonnement-urssaf', label: 'Courrier d\'échelonnement' },
      { href: '/outils/prescription', label: 'Vérificateur de prescription' },
    ],
  },

  'pge-en-difficulte': {
    titre: 'FAQ — PGE en difficulté : restructuration, médiation, alternatives',
    metaTitle: 'PGE en difficulté : restructurer ou pas ? — Solelis',
    metaDesc: 'Prêt Garanti par l\'État (Covid) en remboursement : restructuration jusqu\'à 10 ans, médiation, conséquences d\'une procédure collective. 10 questions clés.',
    intro: 'Le remboursement de votre PGE pèse sur la trésorerie ? Vous avez plusieurs leviers, mais l\'ordre dans lequel vous les actionnez change tout. Voici les 10 questions essentielles.',
    questions: [
      { q: 'Mon PGE peut-il être étalé au-delà de 6 ans ?', r: 'C\'est possible, mais ce n\'est pas un droit. L\'accord de place du 19 janvier 2022 permet de le restructurer via la Médiation du crédit (PGE de 50 000 € au plus — au-delà, seulement sur orientation du conseiller départemental aux entreprises en difficulté —, entreprise de moins de 250 salariés, pas en cessation des paiements, difficultés attestées par un expert-comptable) : allongement de 2 ans en général, 4 ans au plus à titre exceptionnel (10 ans au total), garantie d\'État maintenue. Il faut l\'accord de toutes les banques concernées, et l\'entreprise est alors classée en défaut. L\'allongement est aussi possible en conciliation, sauvegarde ou redressement judiciaire.' },
      { q: 'Si je passe en sauvegarde / RJ, je perds la garantie d\'État ?', r: 'Non — l\'ouverture d\'une sauvegarde ou d\'un redressement judiciaire ne fait pas perdre la garantie de l\'État : c\'est un « évènement de crédit » qui permet à la banque de l\'appeler (arrêté du 23 mars 2020 modifié, art. 6). Si le PGE est rééchelonné dans le plan, la garantie l\'accompagne et la banque n\'est indemnisée qu\'à la fin du prêt restructuré (FAQ PGE du ministère de l\'Économie). Tenter d\'abord une restructuration amiable reste préférable : c\'est confidentiel et plus souple.' },
      { q: 'Comment saisir la Médiation du crédit ?', r: 'Gratuit, confidentiel : appelez le 34 14 ou remplissez le formulaire sur mediateur-credit.banque-france.fr. Le médiateur vous contacte sous 48 h ; vos banques ont ensuite 5 jours ouvrés pour revoir leur position (banque-france.fr). À utiliser si la banque refuse ou tarde.' },
      { q: 'Mon banquier peut-il appeler la garantie sans m\'en parler ?', r: 'Oui : l\'arrêté du 23 mars 2020 (art. 6) ne prévoit pas d\'information préalable de l\'emprunteur. La banque peut appeler la garantie dès un « événement de crédit » : impayé, restructuration (conciliation, Médiation du crédit…) ou ouverture d\'une procédure collective. L\'appel de la garantie ne vous libère pas : la banque reste tenue d\'exercer ses recours amiables et judiciaires contre l\'entreprise, et l\'État ne l\'indemnise que de la perte finale.' },
      { q: 'Le PGE peut-il être renégocié plusieurs fois ?', r: 'Pas via la Médiation du crédit : la procédure de l\'accord de place du 19 janvier 2022 ne peut être utilisée qu\'une seule fois, et seulement si le PGE n\'a jamais été restructuré. L\'allongement reste plafonné à 4 ans au-delà des 6 ans initiaux.' },
      { q: 'Je peux différer 12 mois supplémentaires de plus ?', r: 'Non. Dans la procédure de Médiation du crédit, un différé de remboursement supplémentaire de 6 mois au plus peut être accordé, uniquement si c\'est particulièrement justifié, et il s\'impute sur la durée d\'allongement (accord de place du 19 janvier 2022, art. 6).' },
      { q: 'Le PGE peut-il être effacé en procédure collective ?', r: 'En liquidation : il suit le sort des autres dettes de l\'entreprise ; la banque est indemnisée par l\'État à hauteur de la quotité garantie (70 à 90 % de sa perte). En sauvegarde ou redressement avec plan : il est rééchelonné dans le plan et la garantie d\'État est maintenue jusqu\'à la fin du prêt restructuré (arrêté du 23 mars 2020, art. 6).' },
      { q: 'Y a-t-il une aide pour les PME post-PGE ?', r: 'Bpifrance et les Régions proposent des prêts de renforcement de la trésorerie ou de développement, dont les conditions évoluent régulièrement : renseignez-vous auprès de votre direction régionale Bpifrance (www.bpifrance.fr). Le FSE+ peut cofinancer la formation et le reclassement des salariés.' },
      { q: 'Suis-je personnellement caution du PGE ?', r: 'Normalement non : le PGE doit être accordé « sans autre garantie ou sûreté » que celle de l\'État (arrêté du 23 mars 2020, art. 1). Si votre banque vous a fait signer une caution pour ce prêt, faites vérifier l\'acte par un avocat. Une caution signée pour d\'autres crédits reste valable : vérifiez sa proportionnalité (art. 2300 C. civ. depuis 2022 ; anciens art. L332-1 et L343-4 C. conso avant).' },
      { q: 'Mandat ad hoc + PGE : compatible ?', r: 'Oui. Le mandat ad hoc est confidentiel (pas de publication) et permet de renégocier avec l\'ensemble des créanciers. Si le PGE doit être allongé au-delà de 6 ans, faites-le dans un cadre prévu par l\'arrêté du 23 mars 2020 (conciliation constatée ou homologuée, Médiation du crédit, sauvegarde ou redressement) : en dehors, la garantie d\'État peut prendre fin. Rémunération du mandataire fixée par le président du tribunal, avec votre accord (art. L611-14 C. com.).' },
    ],
    liensConseilles: [
      { href: '/situation/credit-bancaire', label: 'Guide crédit bancaire' },
      { href: '/aides-personnelles', label: 'Aides financières' },
    ],
  },

  'caution-personnelle': {
    titre: 'FAQ — Caution personnelle : contester, négocier, se protéger',
    metaTitle: 'Caution personnelle : peut-elle être annulée ? — Solelis',
    metaDesc: 'Caution bancaire signée pour votre entreprise : disproportion, défaut d\'information, durée — 10 questions et réponses pour la contester.',
    intro: 'La caution personnelle est la première source de ruine patrimoniale des dirigeants. Mais une part importante est contestable. Voici les 10 questions clés.',
    questions: [
      { q: 'Ma caution peut-elle être annulée si elle est disproportionnée ?', r: 'Oui — art. 2300 C. civ. (cautions depuis 2022) / anciens art. L332-1 et L343-4 C. conso : si la caution était manifestement disproportionnée à vos biens et revenus au jour de la signature : pour une caution signée depuis 2022, elle est réduite au montant que vous pouviez garantir (art. 2300) ; pour une caution plus ancienne, elle ne peut pas être invoquée contre vous, sauf si votre patrimoine vous permet d\'y faire face au moment où elle est appelée.' },
      { q: 'Qu\'est-ce que le défaut d\'information annuelle ?', r: 'L\'article 2302 C. civ. impose au créancier professionnel (votre banque, par exemple) de vous informer chaque année (avant le 31 mars) du montant restant dû, du terme de l\'engagement ou, s\'il n\'y en a pas, de votre faculté de résiliation. À défaut : déchéance des intérêts et pénalités courus depuis la précédente information. Depuis le 1er janvier 2022, cette obligation s\'applique à toutes les cautions, y compris celles signées avant cette date (ordonnance 2021-1192, art. 37 III). Vérifiez vos courriers annuels.' },
      { q: 'Ma caution a-t-elle une durée maximale ?', r: 'Non, la loi n\'impose pas de durée. Si votre caution garantit des dettes futures (découvert, cautionnement « tous engagements ») sans durée fixée, vous pouvez y mettre fin à tout moment en respectant le préavis prévu ou, à défaut, un délai raisonnable (art. 2315 C. civ.) ; vous restez tenu·e des dettes nées avant (art. 2316). Si elle est à durée déterminée, vérifiez la date de fin dans l\'acte.' },
      { q: 'Je n\'ai pas relu le contrat, est-ce contestable ?', r: 'La caution personne physique doit apposer elle-même une mention précisant le montant et la nature de son engagement (art. 2297 C. civ. ; anciennement mention manuscrite de l\'art. L341-2 C. conso). À défaut, l\'engagement est nul. Demandez copie de l\'acte original (signé physiquement) et vérifiez la mention.' },
      { q: 'Mon conjoint a-t-il signé en mon nom ?', r: 'Si vous êtes marié·e en communauté, la caution donnée par un seul époux n\'engage que ses biens propres et ses revenus — pas les biens communs (art. 1415 C. civ., sauf consentement exprès du conjoint). Vérifier la signature de votre conjoint sur l\'acte.' },
      { q: 'La caution survit-elle à la liquidation de la société ?', r: 'Oui — la caution est un engagement personnel autonome. La liquidation de la société ne l\'éteint pas. La banque peut vous poursuivre individuellement, même après la clôture pour insuffisance d\'actif.' },
      { q: 'Peut-on négocier après l\'appel en garantie ?', r: 'Oui — la banque préfère souvent négocier qu\'engager une procédure longue. Proposez un règlement partiel forfaitaire ou un échéancier. Faites-vous accompagner d\'un avocat en droit bancaire (première consultation gratuite possible dans un point-justice, 3039).' },
      { q: 'L\'aide juridictionnelle peut-elle couvrir un avocat ?', r: 'Oui — si vos revenus sont devenus modestes après la liquidation (en 2026, pour une personne seule : RFR ≤ 12 957 € pour l\'aide totale, jusqu\'à 19 433 € pour l\'aide partielle), vous pouvez obtenir l\'aide juridictionnelle. Cela couvre l\'avocat pour une action de contestation de caution.' },
      { q: 'Y a-t-il un délai pour contester ?', r: 'La disproportion et le défaut d\'information annuelle s\'invoquent le plus souvent en défense, quand la banque vous réclame le paiement. Pour agir vous-même (par exemple en nullité de l\'acte), le délai de droit commun est de 5 ans à compter du jour où vous avez connu ou auriez dû connaître les faits (art. 2224 C. civ.). Faites vérifier le point de départ par un avocat.' },
      { q: 'Que devient ma caution si la banque a perdu son privilège ?', r: 'Si la banque a négligé sa garantie principale (hypothèque non renouvelée, gage non publié, etc.), la caution est libérée à proportion de ce qu\'elle aurait pu recevoir par subrogation (art. 2314 C. civ., bénéfice de subrogation). Levier souvent méconnu.' },
    ],
    liensConseilles: [
      { href: '/proteger-famille', label: 'Guide protection famille' },
      { href: '/outils/aide-juridictionnelle', label: 'Calculateur AJ' },
    ],
  },

  'cessation-paiements': {
    titre: 'FAQ — Cessation des paiements : déclarer, anticiper, comprendre',
    metaTitle: 'Cessation des paiements : que faire dans les 45 jours ? — Solelis',
    metaDesc: 'Vous êtes en cessation des paiements : déclaration au tribunal, conséquences, alternatives. 12 questions clés pour les dirigeants.',
    intro: 'La cessation des paiements n\'est pas une sanction — c\'est un état juridique à déclarer. Ce que vous faites dans les 45 jours détermine la suite.',
    questions: [
      { q: 'Qu\'est-ce que la cessation des paiements exactement ?', r: 'Définie par l\'art. L631-1 C. com. : impossibilité de faire face au passif exigible avec l\'actif disponible. Ce n\'est pas un découvert, ni des dettes globales — c\'est l\'impossibilité de payer les dettes ÉCHUES (URSSAF échu, factures payables, salaires) avec la trésorerie + créances clients immédiatement encaissables.' },
      { q: 'Quel est le délai exact pour déclarer ?', r: '45 jours à compter de la cessation (art. L631-4 C. com.). Le délai court à partir du moment où l\'état existe — pas de votre prise de conscience. Omettre sciemment de déclarer dans ce délai expose à une interdiction de gérer (art. L653-8) jusqu\'à 15 ans.' },
      { q: 'Le tribunal va-t-il me mettre en liquidation immédiate ?', r: 'Non — il examine d\'abord si un redressement est possible. Le RJ est privilégié pour les entreprises viables. La LJ n\'est ouverte que si le redressement est manifestement impossible (art. L640-1 C. com.) — ce qui peut être décidé dès la première audience. Présenter un projet de plan = atout.' },
      { q: 'Comment se déclare la cessation ?', r: 'Formulaire Cerfa 10530*02 disponible sur service-public.fr. Pièces : K-bis < 3 mois, état actif/passif exigible, comptes annuels, trésorerie < 1 mois, liste créanciers (nom, adresse, montant). Dépôt au greffe du tribunal compétent (tribunal de commerce ou tribunal judiciaire selon votre activité).' },
      { q: 'Puis-je continuer à diriger pendant la procédure ?', r: 'En sauvegarde : oui, sous la surveillance ou avec l\'assistance de l\'administrateur s\'il y en a un. En RJ : en principe oui, mais le tribunal peut charger l\'administrateur d\'assurer seul l\'administration (art. L631-12). En LJ : non, le liquidateur prend la main. La poursuite d\'activité peut être autorisée pendant 3 mois au plus, prolongeables une fois (art. R641-18 C. com.), si l\'intérêt public ou celui des créanciers l\'exige, ou si une cession de l\'entreprise est envisageable (art. L641-10).' },
      { q: 'Mes salaires et ceux de mes salariés sont-ils garantis ?', r: 'Les salaires des salariés sont garantis par l\'AGS jusqu\'à 96 120 € en 2026 lorsque le contrat de travail a au moins 2 ans d\'ancienneté au jugement (80 100 € entre 6 mois et 2 ans, 64 080 € en dessous). Vos propres rémunérations de dirigeant non-salarié ne sont pas couvertes par l\'AGS (mais peuvent ouvrir droit à l\'ATI).' },
      { q: 'Mes biens personnels sont-ils saisissables ?', r: 'Si vous êtes en société à risque limité (SARL, SAS…) sans caution : non, la responsabilité est limitée aux apports (pas en SNC ni en société civile). Si vous êtes EI : depuis la loi du 14 fév. 2022, séparation de droit entre patrimoine pro et perso. Si vous avez signé des cautions personnelles : la banque peut vous poursuivre individuellement.' },
      { q: 'Que devient mon contrat de bail commercial ?', r: 'Le bailleur ne peut pas résilier pour les loyers antérieurs au jugement. L\'administrateur peut décider de ne pas poursuivre le bail ; pour des loyers postérieurs impayés, le bailleur ne peut agir qu\'après 3 mois à compter du jugement (art. L622-14 C. com.). Les loyers postérieurs doivent être payés à leur échéance.' },
      { q: 'Mes contrats avec mes fournisseurs continuent-ils ?', r: 'Oui — les contrats en cours se poursuivent. L\'administrateur peut exiger leur continuation (art. L622-13 C. com.) et le fournisseur ne peut pas les résilier pour impayés antérieurs. Les prestations postérieures sont créances privilégiées.' },
      { q: 'Mon entreprise figure-t-elle au BODACC ?', r: 'Oui — l\'ouverture de toute procédure collective est publiée au BODACC. La publication est publique : vos partenaires, banque, clients, fournisseurs peuvent le savoir. Sauf en mandat ad hoc et conciliation, qui sont confidentiels (art. L611-15 C. com.) ; seul le jugement homologuant un accord de conciliation fait l\'objet d\'une publicité (art. L611-10).' },
      { q: 'Combien coûte la procédure ?', r: 'RJ/LJ : frais de greffe et rémunération des mandataires suivent des tarifs réglementés (art. L444-1 et R663-3 et s. C. com.), payés sur les fonds de la procédure. Demandez une estimation au mandataire ; voir notre page « Coût des procédures ».' },
      { q: 'Puis-je éviter la procédure si je trouve un repreneur ?', r: 'Pas totalement, mais vous pouvez l\'abréger : la cession en pré-pack est préparée confidentiellement en mandat ad hoc ou en conciliation, puis réalisée rapidement dans une sauvegarde, un redressement ou une liquidation judiciaire. Idéale si vous avez un repreneur identifié. Demander conseil à un avocat spécialisé immédiatement.' },
    ],
    liensConseilles: [
      { href: '/procedures', label: 'Toutes les procédures expliquées' },
      { href: '/glossaire', label: 'Glossaire des termes' },
      { href: '/outils/cout-procedures', label: 'Comparateur du coût des procédures' },
    ],
  },

  'rebondir-apres-liquidation': {
    titre: 'FAQ — Rebondir après une liquidation : aides, statuts, mental',
    metaTitle: 'Rebondir après une liquidation : guide complet — Solelis',
    metaDesc: 'Après une liquidation : ATI, ACRE, ARCE, recréer une activité, 60 000 Rebonds, redémarrage psychologique. 12 questions essentielles.',
    intro: 'Une liquidation n\'est pas la fin : vous pouvez recréer une activité, avec des aides et des réseaux pour vous accompagner. Voici comment.',
    questions: [
      { q: 'Puis-je recréer une activité immédiatement après une liquidation ?', r: 'Oui — sauf interdiction de gérer prononcée par le tribunal (rare en cas de bonne foi). La liquidation de votre société/EI n\'éteint pas votre capacité juridique à entreprendre. Rien n\'oblige à attendre la clôture de la liquidation pour créer une nouvelle entreprise (sauf sanction : interdiction de gérer, faillite personnelle). Si vous êtes entrepreneur individuel, vous pouvez même exercer une nouvelle activité pendant votre liquidation, avec un nouveau patrimoine professionnel qui n\'est pas concerné par la procédure (art. L681-2 C. com.), sauf liquidation pour insuffisance d\'actif ou rétablissement professionnel clôturé depuis moins de 5 ans.' },
      { q: 'Combien de temps après ma liquidation puis-je toucher l\'ATI ?', r: 'Dès la fin de l\'activité — l\'ATI (Allocation Travailleurs Indépendants) est versée pendant 6 mois, de 19,73 à 26,30 €/jour (environ 600 à 800 €/mois) selon vos revenus antérieurs. Conditions : cessation involontaire (liquidation, redressement avec remplacement du dirigeant, ou activité non viable attestée par un tiers de confiance avec baisse de revenus d\'au moins 30 %), au moins 10 000 € de revenus sur l\'une des 2 dernières années, 2 ans d\'activité, ressources personnelles inférieures au RSA. Inscription à France Travail dans les 12 mois.' },
      { q: 'Qu\'est-ce que l\'ACRE et puis-je en bénéficier ?', r: 'L\'ACRE = exonération partielle de cotisations sociales pendant environ 1 an pour les créateurs/repreneurs, quel que soit le statut (micro, EI, gérant), mais réservée à certains publics : demandeurs d\'emploi, bénéficiaires du RSA ou de l\'ASS, jeunes de 18 à 25 ans, création en quartier prioritaire… et pas d\'ACRE dans les 3 années précédentes (entreprendre.service-public.gouv.fr). Depuis 2026, l\'exonération est réduite (un quart des cotisations visées hors micro ; 25 % pour les micro-entreprises créées depuis le 1er juillet 2026) et la demande doit être faite à l\'Urssaf dans les 60 jours suivant le début d\'activité.' },
      { q: 'L\'ARCE m\'est-elle accessible ?', r: 'L\'ARCE (Aide à la Reprise et la Création d\'Entreprise) = versement en capital de 60 % de votre ARE restant à percevoir. Conditions : bénéficier de l\'ARE (allocation chômage) et avoir obtenu l\'ACRE, à demander à l\'Urssaf au plus tard 60 jours après le début d\'activité. Retenue de 3 % pour les retraites complémentaires ; versement en 2 fois (la moitié au démarrage, l\'autre 6 mois plus tard si l\'activité se poursuit et, pour une création depuis le 1er avril 2025, sans CDI à temps plein). Demande à remettre à France Travail avec le justificatif de création et l\'attestation d\'ACRE (francetravail.fr).' },
      { q: 'Suis-je obligé de payer mes anciennes dettes professionnelles ?', r: 'En LJ avec clôture pour insuffisance d\'actif : les dettes ne sont pas éteintes, mais les créanciers ne retrouvent pas, en principe, le droit de poursuivre le débiteur (art. L643-11 C. com. ; exceptions : fraude, faillite personnelle, banqueroute…). Pour un EI avec PRP : les dettes pro antérieures signalées au juge sont effacées (art. L645-11 C. com.), sauf exceptions. Si vous avez signé des cautions personnelles : elles survivent à la liquidation et peuvent être réclamées par les créanciers.' },
      { q: 'Suis-je interdit bancaire après une liquidation ?', r: 'Non — pas automatiquement. L\'inscription FICP (5 ans) suit les incidents personnels de paiement. L\'inscription FCC suit les chèques sans provision. Vérifiez votre fichier sur particuliers.banque-france.fr. Droit au compte garanti par la BdF (art. L312-1 CMF).' },
      { q: 'Le micro-entreprise est-il un bon statut pour rebondir ?', r: 'Souvent oui — simplicité, charges proportionnelles au CA (en 2026 : 12,3 % pour la vente, 21,2 % pour les services commerciaux et artisanaux, 25,6 % pour les autres services, 23,2 % pour les libéraux relevant de la Cipav), franchise de TVA jusqu\'à 37 500 € (services) ou 85 000 € (ventes) de CA. Revenus cumulables avec l\'ATI pendant 3 mois au plus (francetravail.fr). Limite : plafond de CA, et statut peu adapté si vous prévoyez une vraie croissance.' },
      { q: 'Comment retrouver la confiance des banques ?', r: 'Cela prend du temps. Stratégies : compte pro dans une banque différente, micro-crédit Adie (accepte les profils fragiles), Prêt d\'honneur Initiative France (sans intérêts, sans garantie), prêts Bpifrance et régionaux (renseignez-vous auprès de votre direction régionale Bpifrance).' },
      { q: 'Qu\'est-ce que 60 000 Rebonds et comment y accéder ?', r: '60 000 Rebonds est une association nationale qui accompagne gratuitement les dirigeants post-liquidation : coaching, parrainage et accompagnement collectif. Plus de 80 points d\'accueil en métropole et outre-mer. Inscription sur 60000rebonds.com.' },
      { q: 'Comment gérer le choc psychologique ?', r: 'C\'est un deuil — anticipable et surmontable. APESA (www.apesa-france.com) propose une prise en charge gratuite par un·e psychologue, déclenchée avec votre accord par une « sentinelle » (greffe, mandataire, expert-comptable…). 3114 disponible 24 h/24 si crise. CMP secteur public gratuit. 60 000 Rebonds a aussi un volet écoute. L\'épuisement est fréquent chez les dirigeant·e·s en difficulté — vous n\'êtes pas seul·e.' },
      { q: 'Combien de temps avant de retravailler salarié ?', r: 'Si vous avez été salarié auparavant, vos droits ARE peuvent être réactivés sous certaines conditions. Si vous n\'avez pas de droits ARE et que vous avez touché l\'ATI : à l\'issue des 6 mois, vous pouvez basculer vers une nouvelle activité indépendante ou un emploi salarié.' },
      { q: 'Quels réseaux pour me reconstruire professionnellement ?', r: 'BGE Boutiques de Gestion (accompagnement créateurs), Initiative France (plus de 200 associations locales, prêts d\'honneur), Réseau Entreprendre (mentorat), France Active (garanties), Pépinières d\'entreprises. Tous gratuits ou peu coûteux.' },
    ],
    liensConseilles: [
      { href: '/rebond', label: 'Guide rebond complet' },
      { href: '/outils/ati', label: 'Estimateur ATI' },
      { href: '/outils/acre-arce', label: 'Vérificateur ACRE/ARCE' },
    ],
  },

  'assignation-tribunal': {
    titre: 'FAQ — Assignation au tribunal : urgence et défense',
    metaTitle: 'Assignation au tribunal : que faire ? — Solelis',
    metaDesc: 'Vous avez reçu une assignation : audience, défense, aide juridictionnelle, plan de cession. Réponses claires aux 10 questions essentielles.',
    intro: 'Une assignation au tribunal est urgente mais pas désespérée. Voici les 10 questions à se poser ce soir.',
    questions: [
      { q: 'Je n\'ai pas le temps de me défendre. Que se passe-t-il si je ne viens pas ?', r: 'Le tribunal peut statuer sans vous, sur les seuls arguments du créancier. Présentez-vous (ou faites-vous représenter par un avocat) : l\'audience est souvent brève, préparez vos documents.' },
      { q: 'Combien de temps ai-je pour réagir ?', r: 'Variable selon l\'assignation : généralement 15 j minimum entre la signification et l\'audience. Lisez la date d\'audience sur l\'acte. Contactez un avocat AUJOURD\'HUI.' },
      { q: 'Puis-je obtenir un délai supplémentaire ?', r: 'Oui, en demandant un renvoi à l\'audience (argument : préparation du dossier, recherche d\'avocat). Le tribunal décide s\'il l\'accorde et fixe la nouvelle date.' },
      { q: 'Mon RFR est faible : puis-je avoir un avocat gratuit ?', r: 'Oui via l\'aide juridictionnelle : en 2026, pour une personne seule, aide totale si votre RFR ≤ 12 957 €, partielle jusqu\'à 19 433 € (plafonds majorés par personne à charge). Demande en ligne sur justice.fr ou par formulaire Cerfa 16146 ; aucun délai de réponse n\'est fixé (aide provisoire possible si une audience approche). Attention : l\'aide juridictionnelle est réservée aux personnes physiques (et, exceptionnellement, aux personnes morales à but non lucratif) ; une société commerciale assignée n\'y a pas droit (loi 91-647, art. 2). Elle vous concerne si vous êtes entrepreneur individuel, ou pour vos procédures personnelles (caution, par exemple). Voir notre calculateur dédié.' },
      { q: 'L\'assignation peut-elle me faire mettre en liquidation immédiate ?', r: 'Le tribunal examine d\'abord s\'il y a cessation des paiements (L631-1). Si oui, il ouvre une procédure (RJ ou LJ). Si non, il rejette l\'assignation. Préparer : trésorerie, liste créanciers, derniers bilans, justificatifs.' },
      { q: 'Puis-je proposer un plan de cession à l\'audience ?', r: 'Oui — proposer une cession partielle ou totale peut éviter la liquidation pure. Le tribunal préfère sauver l\'activité quand c\'est possible. Préparer un repreneur identifié = atout majeur.' },
      { q: 'Le créancier qui m\'assigne peut-il être condamné aux dépens ?', r: 'Oui, si l\'assignation est manifestement abusive ou non fondée. Le juge peut imposer le paiement des frais à l\'assignant. Argument à soulever par l\'avocat.' },
      { q: 'Que faire des autres créanciers pendant l\'audience ?', r: 'Suspendre les paiements non-essentiels. Ne PAS payer un créancier en priorité (risque de période suspecte = annulation). Continuer à payer les fournisseurs essentiels à l\'activité.' },
      { q: 'Quel est le coût d\'un avocat pour cette audience ?', r: 'Les honoraires sont libres et fixés par une convention d\'honoraires écrite : demandez un devis à 2 ou 3 cabinets. Aide juridictionnelle si vous êtes éligible (personnes physiques seulement : une société commerciale n\'y a pas droit) ; première consultation gratuite possible dans un point-justice (3039).' },
      { q: 'Si je perds, ai-je un recours ?', r: 'Appel possible dans les 10 jours qui suivent la notification du jugement (art. R661-3 C. com.). Attention : la plupart des jugements de procédure collective sont exécutoires de plein droit à titre provisoire (art. R661-1 C. com.) — l\'appel n\'en suspend pas l\'exécution. À discuter immédiatement avec l\'avocat.' },
    ],
    liensConseilles: [
      { href: '/outils/aide-juridictionnelle', label: 'Calculateur AJ' },
      { href: '/situation/credit-bancaire', label: 'Guide complet' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(FAQ_PAR_SITUATION).map((situation) => ({ situation }));
}

export async function generateMetadata({ params }: { params: Promise<{ situation: string }> }): Promise<Metadata> {
  const { situation } = await params;
  const data = FAQ_PAR_SITUATION[situation];
  if (!data) return META_PAGE_INTROUVABLE;
  const ogUrl = `/api/og?${new URLSearchParams({ titre: data.titre.replace(/^FAQ — /, ''), sous: 'Questions fréquentes', cat: 'faq' }).toString()}`;
  return {
    title: data.metaTitle,
    description: data.metaDesc,
    alternates: { canonical: `/faq/${situation}` },
    openGraph: {
      title: data.titre,
      description: data.metaDesc,
      type: 'article',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: data.titre }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.titre,
      description: data.metaDesc,
      images: [ogUrl],
    },
  };
}

export default async function FaqCibleePage({ params }: { params: Promise<{ situation: string }> }) {
  const { situation } = await params;
  const data = FAQ_PAR_SITUATION[situation];
  if (!data) return notFound();

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map((qr) => ({
      '@type': 'Question',
      name: qr.q,
      acceptedAnswer: { '@type': 'Answer', text: qr.r },
    })),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://solelis.com/faq' },
      { '@type': 'ListItem', position: 3, name: data.titre },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <Link href="/faq" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Toutes les FAQ
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">{data.titre}</h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">{data.intro}</p>

      <div className="mt-10 space-y-5">
        {data.questions.map((qr, i) => (
          <details key={i} className="glass-soft rounded-2xl p-5">
            <summary className="cursor-pointer list-none font-display text-base text-navy hover:text-bleu-fonce">
              <span className="mr-2 text-navy/40">{i + 1}.</span>
              {qr.q}
            </summary>
            <p className="mt-3 text-sm text-navy/80">{qr.r}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-navy/15 bg-white/60 p-5">
        <p className="font-display text-base text-navy">Pour aller plus loin</p>
        <ul className="mt-3 space-y-1.5 text-sm text-navy/80">
          {data.liensConseilles.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-bleu-fonce hover:underline">
                → {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
