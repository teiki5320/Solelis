import type { Situation, Moral, Probleme, Effectif, Reponses } from './types';

export interface CourrierTemplate {
  slug: string;
  titre: string;
  destinataire: string;
  categorie: 'urssaf' | 'impots' | 'fournisseurs' | 'banque' | 'tribunal' | 'cci' | 'social';
  icone: string;
  description: string;
  objet: string;
  corps: string;
}

export interface CourrierContext {
  situation?: Situation;
  moral?: Moral;
  probleme?: Probleme;
  effectif?: Effectif;
  effectifDetail?: string;
}

export interface PersonalizedCourrier {
  objet: string;
  corps: string;
  preambule?: string;
  closing?: string;
  conseil?: string;
  urgence?: 'normale' | 'elevee' | 'critique';
}

export const COURRIERS: CourrierTemplate[] = [
  {
    slug: 'echelonnement-urssaf',
    titre: 'Demande d\'échelonnement URSSAF',
    destinataire: 'URSSAF de votre département',
    categorie: 'urssaf',
    icone: '🏛️',
    description: 'Demander un échéancier pour vos cotisations sociales impayées.',
    objet: 'Demande d\'échelonnement de cotisations sociales',
    corps: `Madame, Monsieur,

Je me permets de vous solliciter au sujet de mes cotisations sociales dont le règlement connaît actuellement un retard.

En tant que dirigeant de la société {{NOM_ENTREPRISE}} (SIRET : {{SIRET}}), je traverse une période de difficultés financières qui ne me permet pas de régler l'intégralité des sommes dues dans les délais impartis.

Toutefois, mon activité se poursuit et je souhaite honorer mes obligations. C'est pourquoi je vous demande de bien vouloir m'accorder un échelonnement de paiement sur une durée de {{DUREE}} mois.

Je m'engage à reprendre le paiement de mes cotisations courantes dès le mois prochain et à respecter scrupuleusement l'échéancier que vous voudrez bien me proposer.

Je reste à votre disposition pour tout document complémentaire que vous jugeriez utile.

Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations respectueuses.`,
  },
  {
    slug: 'echelonnement-impots',
    titre: 'Demande d\'échelonnement impôts',
    destinataire: 'Service des Impôts des Entreprises (SIE)',
    categorie: 'impots',
    icone: '📋',
    description: 'Demander un délai de paiement pour vos impôts professionnels.',
    objet: 'Demande de délai de paiement — impôts professionnels',
    corps: `Madame, Monsieur le Comptable,

Je soussigné(e), {{NOM_DIRIGEANT}}, dirigeant(e) de la société {{NOM_ENTREPRISE}} (SIRET : {{SIRET}}), me permets de solliciter un délai de paiement pour les impositions suivantes :

- Nature de l'impôt : {{TYPE_IMPOT}}
- Montant restant dû : {{MONTANT}} €
- Échéance initiale : {{DATE_ECHEANCE}}

Mon entreprise traverse actuellement des difficultés de trésorerie liées à {{RAISON}}. Cependant, l'activité se maintient et j'ai la volonté de régulariser ma situation.

Je vous propose un échelonnement sur {{DUREE}} mois à compter du {{DATE_DEBUT}}.

Je joins à ce courrier les pièces justificatives suivantes :
- Dernier bilan comptable
- Situation de trésorerie actuelle
- Prévisionnel de trésorerie

Je reste à votre entière disposition pour tout complément d'information.

Veuillez agréer, Madame, Monsieur le Comptable, l'expression de mes salutations distinguées.`,
  },
  {
    slug: 'delai-fournisseur',
    titre: 'Demande de délai fournisseur',
    destinataire: 'Votre fournisseur',
    categorie: 'fournisseurs',
    icone: '🤝',
    description: 'Proposer un arrangement amiable à un fournisseur.',
    objet: 'Demande de délai de paiement — facture n°{{NUM_FACTURE}}',
    corps: `Madame, Monsieur,

Nous travaillons ensemble depuis {{DUREE_RELATION}} et je tiens à préserver cette relation commerciale qui m'est précieuse.

Je me permets de vous informer que la société {{NOM_ENTREPRISE}} traverse actuellement une période de tensions de trésorerie qui m'empêche de régler votre facture n°{{NUM_FACTURE}} d'un montant de {{MONTANT}} € dans les délais convenus.

Je vous propose le règlement selon l'échéancier suivant :
- {{DATE_1}} : {{MONTANT_1}} €
- {{DATE_2}} : {{MONTANT_2}} €
- {{DATE_3}} : solde de {{MONTANT_3}} €

Cette situation est temporaire. Je m'engage à respecter cet échéancier et à reprendre les conditions de paiement habituelles dès que possible.

Je reste disponible pour en discuter de vive voix si vous le souhaitez.

Avec mes meilleures salutations.`,
  },
  {
    slug: 'mediation-entreprises',
    titre: 'Saisine du Médiateur des entreprises',
    destinataire: 'Médiateur des entreprises',
    categorie: 'fournisseurs',
    icone: '⚖️',
    description: 'Saisir le médiateur en cas de différend avec un client ou fournisseur.',
    objet: 'Demande de médiation — différend commercial',
    corps: `Madame, Monsieur le Médiateur,

Je soussigné(e), {{NOM_DIRIGEANT}}, dirigeant(e) de {{NOM_ENTREPRISE}} (SIRET : {{SIRET}}), souhaite saisir la Médiation des entreprises d'un différend m'opposant à :

Entreprise : {{NOM_ADVERSAIRE}}
SIRET adversaire : {{SIRET_ADVERSAIRE}}
Nature du différend : {{NATURE_DIFFEREND}}

Exposé des faits :
{{EXPOSE_FAITS}}

Tentatives de résolution amiable déjà entreprises :
{{TENTATIVES}}

Je sollicite votre intervention pour parvenir à un accord amiable dans les meilleurs délais.

Je reste à votre disposition pour tout document complémentaire.

Veuillez agréer, Madame, Monsieur le Médiateur, l'expression de mes salutations respectueuses.

Note : la saisine peut aussi se faire en ligne sur https://www.economie.gouv.fr/mediateur-des-entreprises`,
  },
  {
    slug: 'mediation-credit',
    titre: 'Demande de médiation du crédit',
    destinataire: 'Médiateur du crédit — Banque de France',
    categorie: 'banque',
    icone: '🏦',
    description: 'Quand votre banque refuse un prêt ou réduit votre découvert.',
    objet: 'Saisine de la médiation du crédit',
    corps: `Madame, Monsieur le Médiateur,

Je soussigné(e), {{NOM_DIRIGEANT}}, dirigeant(e) de {{NOM_ENTREPRISE}} (SIRET : {{SIRET}}), domiciliée à {{ADRESSE}}, souhaite saisir la médiation du crédit.

Ma banque {{NOM_BANQUE}} m'a notifié :
☐ Un refus de prêt
☐ Une réduction de découvert autorisé
☐ Une dénonciation de concours bancaires
☐ Autre : {{AUTRE_MOTIF}}

Montant concerné : {{MONTANT}} €

Conséquences pour mon entreprise :
{{CONSEQUENCES}}

Mon entreprise emploie {{NB_SALARIES}} salarié(e)s et réalise un chiffre d'affaires de {{CA}} €.

Je sollicite votre médiation afin de trouver une solution permettant la poursuite de mon activité.

Pièces jointes recommandées :
- Courrier de refus de la banque
- 3 derniers bilans
- Prévisionnel de trésorerie
- K-bis de moins de 3 mois

Veuillez agréer, Madame, Monsieur le Médiateur, l'expression de mes salutations respectueuses.

Note : la saisine peut aussi se faire en ligne sur https://mediateur-credit.banque-france.fr`,
  },
  {
    slug: 'cessation-paiements',
    titre: 'Déclaration de cessation des paiements',
    destinataire: 'Tribunal compétent (indiqué dans votre fiche : tribunal de commerce, des activités économiques ou judiciaire)',
    categorie: 'tribunal',
    icone: '⚠️',
    description: 'Déclarer la cessation des paiements auprès du tribunal (obligatoire dans les 45 jours).',
    objet: 'Déclaration de cessation des paiements — Art. L631-4 C. com.',
    corps: `Madame, Monsieur le Président du {{TRIBUNAL}},

Je soussigné(e), {{NOM_DIRIGEANT}}, en qualité de {{QUALITE}} de la société {{NOM_ENTREPRISE}}, {{FORME_JURIDIQUE}} au capital de {{CAPITAL}} €, immatriculée sous le numéro SIRET {{SIRET}}, dont le siège social est situé {{ADRESSE}},

Déclare que ladite société se trouve en état de cessation des paiements au sens de l'article L631-1 du Code de commerce, c'est-à-dire dans l'impossibilité de faire face au passif exigible avec l'actif disponible.

Date de cessation des paiements : {{DATE_CESSATION}}

Nombre de salariés : {{NB_SALARIES}}
Chiffre d'affaires du dernier exercice : {{CA}} €

Pièces jointes (conformément à l'article R631-1 du Code de commerce) :
1. Extrait K-bis de moins de 3 mois
2. État du passif exigible et de l'actif disponible
3. Comptes annuels du dernier exercice
4. État des créances et des dettes
5. État actif et passif des sûretés et engagements hors bilan
6. Inventaire sommaire des biens de l'entreprise
7. Situation de trésorerie datant de moins d'un mois
8. Nombre de salariés et montant du chiffre d'affaires
9. Copie pièce d'identité du dirigeant

Je demande au Tribunal de bien vouloir ouvrir une procédure de redressement judiciaire.

Fait à {{VILLE}}, le {{DATE}}

Signature`,
  },
  {
    slug: 'rdv-cci',
    titre: 'Demande de rendez-vous CCI',
    destinataire: 'CCI de votre département',
    categorie: 'cci',
    icone: '📅',
    description: 'Solliciter un accompagnement gratuit auprès de votre CCI.',
    objet: 'Demande de rendez-vous — accompagnement entreprise en difficulté',
    corps: `Madame, Monsieur,

Dirigeant(e) de la société {{NOM_ENTREPRISE}} (SIRET : {{SIRET}}), je traverse actuellement une période de difficulté et je souhaite bénéficier de l'accompagnement proposé par votre chambre de commerce et d'industrie.

Mon entreprise est spécialisée dans {{ACTIVITE}} et compte {{NB_SALARIES}} salarié(e)s. Les difficultés que je rencontre sont principalement liées à {{NATURE_DIFFICULTES}}.

Je souhaiterais obtenir un rendez-vous avec un conseiller spécialisé dans l'accompagnement des entreprises en difficulté, dans les meilleurs délais.

Je suis disponible {{DISPONIBILITES}}.

Je vous remercie par avance de votre aide et reste à votre disposition.

Cordialement,`,
  },
  {
    slug: 'mandat-ad-hoc',
    titre: 'Demande de mandat ad hoc',
    destinataire: 'Président du tribunal compétent (indiqué dans votre fiche)',
    categorie: 'tribunal',
    icone: '🔒',
    description: 'Demander la désignation d\'un mandataire pour négocier confidentiellement.',
    objet: 'Requête aux fins de désignation d\'un mandataire ad hoc',
    corps: `Madame, Monsieur le Président du {{TRIBUNAL}},

Je soussigné(e), {{NOM_DIRIGEANT}}, en qualité de {{QUALITE}} de la société {{NOM_ENTREPRISE}} (SIRET : {{SIRET}}), ai l'honneur de solliciter, sur le fondement de l'article L611-3 du Code de commerce, la désignation d'un mandataire ad hoc.

Présentation de l'entreprise :
- Activité : {{ACTIVITE}}
- Effectif : {{NB_SALARIES}} salariés
- Chiffre d'affaires : {{CA}} €
- Date de création : {{DATE_CREATION}}

Nature des difficultés rencontrées :
{{DESCRIPTION_DIFFICULTES}}

Créanciers concernés par la négociation envisagée :
{{LISTE_CREANCIERS}}

Je précise que la société n'est pas en état de cessation des paiements.

Mission souhaitée pour le mandataire :
{{MISSION_SOUHAITEE}}

Je reste à la disposition du Tribunal pour tout complément d'information.

Veuillez agréer, Madame, Monsieur le Président, l'expression de ma haute considération.`,
  },
  {
    slug: 'conciliation',
    titre: 'Demande de conciliation',
    destinataire: 'Président du tribunal compétent (indiqué dans votre fiche)',
    categorie: 'tribunal',
    icone: '🤝',
    description: 'Demander l\'ouverture d\'une conciliation pour trouver un accord global.',
    objet: 'Requête aux fins d\'ouverture d\'une procédure de conciliation',
    corps: `Madame, Monsieur le Président du {{TRIBUNAL}},

Je soussigné(e), {{NOM_DIRIGEANT}}, en qualité de {{QUALITE}} de la société {{NOM_ENTREPRISE}} (SIRET : {{SIRET}}), ai l'honneur de solliciter, sur le fondement des articles L611-4 et suivants du Code de commerce, l'ouverture d'une procédure de conciliation.

Présentation de l'entreprise :
- Forme juridique : {{FORME_JURIDIQUE}}
- Activité : {{ACTIVITE}}
- Effectif : {{NB_SALARIES}} salariés
- Chiffre d'affaires : {{CA}} €

L'entreprise éprouve une difficulté juridique, économique ou financière, avérée ou prévisible, sans être en cessation des paiements depuis plus de 45 jours.

Nature des difficultés :
{{DESCRIPTION_DIFFICULTES}}

Principaux créanciers :
{{LISTE_CREANCIERS}}

Accord recherché :
{{OBJECTIF_CONCILIATION}}

Pièces jointes :
- K-bis de moins de 3 mois
- Derniers comptes annuels
- État prévisionnel de trésorerie
- État des créances et dettes

Veuillez agréer, Madame, Monsieur le Président, l'expression de ma haute considération.`,
  },
  {
    slug: 'creancier-arrangement',
    titre: 'Lettre à un créancier — arrangement amiable',
    destinataire: 'Votre créancier',
    categorie: 'fournisseurs',
    icone: '✉️',
    description: 'Proposer un arrangement amiable de paiement à un créancier.',
    objet: 'Proposition d\'arrangement amiable de paiement',
    corps: `Madame, Monsieur,

Je me permets de vous écrire au sujet de la somme de {{MONTANT}} € que je vous dois au titre de {{REFERENCE_DETTE}}.

Je ne conteste pas cette dette et je souhaite l'honorer. Cependant, la société {{NOM_ENTREPRISE}} traverse actuellement des difficultés de trésorerie qui m'empêchent de procéder à un règlement immédiat.

Je vous propose l'arrangement suivant :
{{PROPOSITION_ARRANGEMENT}}

En contrepartie, je m'engage à :
- Respecter scrupuleusement cet échéancier
- Vous informer immédiatement de toute difficulté de paiement
- Reprendre les conditions habituelles dès que ma situation le permettra

Je reste convaincu(e) que cet arrangement est préférable pour nos deux parties à une procédure contentieuse.

Je suis disponible pour en discuter à votre convenance.

Avec mes salutations respectueuses.`,
  },
  {
    slug: 'aide-urgence-social',
    titre: 'Demande d\'aide d\'urgence (Action sociale)',
    destinataire: 'CPAM / SSI — Service Action sociale',
    categorie: 'social',
    icone: '🆘',
    description: 'Demander une aide financière d\'urgence pour indépendant en difficulté.',
    objet: 'Demande d\'aide au titre de l\'action sociale — situation d\'urgence',
    corps: `Madame, Monsieur,

Je soussigné(e), {{NOM_DIRIGEANT}}, affilié(e) sous le numéro {{NUM_AFFILIATION}}, exerçant en tant que {{STATUT}} (SIRET : {{SIRET}}), me permets de solliciter une aide financière au titre de l'action sociale.

Ma situation actuelle :
- Revenus mensuels actuels : {{REVENUS}} €
- Charges fixes mensuelles : {{CHARGES}} €
- Situation familiale : {{SITUATION_FAMILIALE}}
- Personnes à charge : {{PERSONNES_A_CHARGE}}

Nature de la difficulté :
{{DESCRIPTION_SITUATION}}

L'aide sollicitée me permettrait de {{OBJECTIF_AIDE}}.

Pièces jointes :
- Dernier avis d'imposition
- Justificatifs de revenus des 3 derniers mois
- Relevés bancaires du dernier mois
- Tout document attestant de la situation de difficulté

Je reste à votre disposition pour tout complément d'information.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations respectueuses.`,
  },
  {
    slug: 'contestation-urssaf',
    titre: 'Contestation de mise en demeure URSSAF',
    destinataire: 'Commission de Recours Amiable (CRA) de l\'URSSAF',
    categorie: 'urssaf',
    icone: '📝',
    description: 'Contester une mise en demeure ou un redressement URSSAF.',
    objet: 'Contestation de la mise en demeure n°{{NUM_MED}} du {{DATE_MED}}',
    corps: `Madame, Monsieur,

Je soussigné(e), {{NOM_DIRIGEANT}}, dirigeant(e) de la société {{NOM_ENTREPRISE}} (SIRET : {{SIRET}}), conteste par la présente la mise en demeure référencée ci-dessus, pour les motifs suivants :

{{MOTIFS_CONTESTATION}}

Période concernée : du {{DATE_DEBUT}} au {{DATE_FIN}}
Montant contesté : {{MONTANT}} €

Pièces justificatives jointes :
{{LISTE_PIECES}}

Je vous demande de bien vouloir réexaminer ma situation et annuler / modifier les sommes réclamées.

À défaut d'accord amiable, je me réserve le droit de saisir le Tribunal judiciaire compétent dans le délai légal.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : ce courrier doit être envoyé en recommandé avec accusé de réception dans un délai de 2 mois à compter de la réception de la mise en demeure.`,
  },
  {
    slug: 'saisine-ccsf',
    titre: 'Saisine de la CCSF (échelonnement fiscal + social)',
    destinataire: 'Commission des chefs des services financiers — DDFiP',
    categorie: 'impots',
    icone: '🏛️',
    description: 'Demande d\'échelonnement global de vos dettes fiscales ET sociales en un seul dossier (jusqu\'à 36 mois).',
    objet: 'Demande de saisine de la CCSF — plan d\'apurement global',
    corps: `Madame, Monsieur,

Je sollicite la saisine de la Commission des chefs des services financiers (CCSF) du département pour une demande de plan d'apurement global de mes dettes fiscales et sociales.

SITUATION DE L'ENTREPRISE
- Dénomination : {{NOM_ENTREPRISE}}
- SIRET : {{SIRET}}
- Forme juridique : {{FORME_JURIDIQUE}}
- Effectif : {{EFFECTIF}}
- Activité principale : {{ACTIVITE}}

MONTANT DES DETTES À TRAITER
- Dettes fiscales (TVA, IS, CFE, TVA…) : {{MONTANT_FISCAL}} €
- Dettes sociales (URSSAF, MSA…) : {{MONTANT_SOCIAL}} €
- TOTAL : {{MONTANT_TOTAL}} €

ORIGINES DES DIFFICULTÉS
{{ORIGINES_DIFFICULTES}}

ACTIONS DÉJÀ ENGAGÉES
- Cotisations courantes : à jour depuis le {{DATE_REPRISE_COURANT}}
- {{ACTIONS_REDRESSEMENT}}

PROPOSITION DE PLAN D'APUREMENT
- Durée souhaitée : {{DUREE_PLAN}} mois
- Mensualité proposée : {{MENSUALITE}} €
- Premier versement : {{DATE_PREMIER_VERSEMENT}}

PIÈCES JOINTES
- Formulaire Cerfa 15772*02 dûment complété
- Dernier bilan et liasse fiscale
- Plan de trésorerie prévisionnel sur 12 mois
- Attestation de paiement à jour des cotisations courantes
- Tableau récapitulatif des dettes (échéances, montants, créanciers)

Je m'engage à respecter scrupuleusement ce plan et à maintenir le paiement des échéances courantes. Je reste à votre disposition pour tout complément d'information.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : ce courrier doit être adressé à la DDFiP de votre département (service CCSF). La saisine est gratuite et confidentielle. Délai de réponse : généralement 2 à 3 mois.`,
  },
  {
    slug: 'restructuration-pge',
    titre: 'Demande de restructuration de PGE',
    destinataire: 'Votre banque (à l\'attention de votre conseiller)',
    categorie: 'banque',
    icone: '💳',
    description: 'Demande de réaménagement du PGE au titre du protocole de place du 19 janvier 2022 — étalement jusqu\'à 10 ans, garantie d\'État maintenue.',
    objet: 'Demande de réaménagement du PGE n° {{REFERENCE_PGE}}',
    corps: `Madame, Monsieur,

Je sollicite par la présente le réaménagement du Prêt Garanti par l'État (PGE) n° {{REFERENCE_PGE}} contracté par la société {{NOM_ENTREPRISE}} (SIRET {{SIRET}}) auprès de votre établissement, au titre du protocole de place du 19 janvier 2022 (BdF, FBF, Bpifrance).

SITUATION DU PGE
- Montant initial : {{MONTANT_PGE}} €
- Date de souscription : {{DATE_SOUSCRIPTION}}
- Capital restant dû : {{CAPITAL_RESTANT}} €
- Mensualité actuelle : {{MENSUALITE_ACTUELLE}} €
- Échéance actuelle : {{DATE_FIN_ACTUELLE}}

SITUATION ÉCONOMIQUE
{{SITUATION_ECONOMIQUE}}

DEMANDE DE RÉAMÉNAGEMENT
Conformément à l'accord de place signé entre la Banque de France, la Médiation du crédit, la Fédération bancaire française et Bpifrance, je sollicite :
- Allongement de la durée totale du PGE à {{DUREE_DEMANDEE}} ans (plafond 10 ans)
- {{DIFFERE_DEMANDE}}
- Nouvelle mensualité cible : {{MENSUALITE_CIBLE}} €

Je rappelle que cet aménagement, encadré par le protocole de place, est réalisé sans perte de la garantie d'État (Bpifrance) et sans inscription défavorable au fichier des incidents bancaires.

PIÈCES JOINTES
- Plan de trésorerie prévisionnel sur 24 mois
- Dernier bilan et compte de résultat
- Justificatifs des actions correctives engagées
- Avis de votre expert-comptable

Je vous remercie de bien vouloir examiner cette demande et de m'apporter votre réponse motivée par écrit dans les 15 jours, conformément au protocole.

À défaut de réponse positive sous ce délai, je me réserve le droit de saisir gratuitement la Médiation du crédit (34 14 / mediateur-credit.banque-france.fr), conformément au dispositif officiel.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : ce courrier doit être envoyé par LRAR ou e-mail avec accusé de réception à votre conseiller bancaire. En cas de refus ou silence > 15 jours : saisir la Médiation du crédit gratuitement.`,
  },
  {
    slug: 'demande-acpr',
    titre: 'Notification ACPR (entreprise du secteur financier)',
    destinataire: 'Autorité de contrôle prudentiel et de résolution (ACPR)',
    categorie: 'banque',
    icone: '🏦',
    description: 'Pour les entreprises du secteur financier (banque, assurance, intermédiaire ORIAS) en difficulté : notification de la situation et demande d\'accompagnement.',
    objet: 'Notification de situation difficile — demande d\'accompagnement',
    corps: `Madame, Monsieur,

Conformément à mes obligations en tant que dirigeant d'un organisme contrôlé par l'ACPR, je vous notifie par la présente la situation difficile dans laquelle se trouve la société {{NOM_ENTREPRISE}}.

IDENTIFICATION
- Dénomination : {{NOM_ENTREPRISE}}
- Numéro ORIAS / Agrément : {{REFERENCE_AGREMENT}}
- Catégorie d'activité : {{CATEGORIE_ACTIVITE}}
- Effectif : {{EFFECTIF}}

NATURE DE LA DIFFICULTÉ
{{NATURE_DIFFICULTE}}

INDICATEURS DE SOLVABILITÉ
- {{INDICATEURS_FINANCIERS}}

ACTIONS DÉJÀ ENGAGÉES
{{ACTIONS_REDRESSEMENT}}

DEMANDE
Je sollicite un entretien avec votre cellule dédiée pour :
- Examiner les voies de résolution organisée envisageables
- Vérifier la compatibilité de mes actions avec mes obligations prudentielles
- Bénéficier le cas échéant d'un accompagnement préventif

Je m'engage à maintenir un dialogue transparent avec vos services et à informer immédiatement votre cellule de toute évolution significative de ma situation.

PIÈCES JOINTES
- Dernier bilan et compte de résultat
- États financiers prudentiels récents
- Plan d'action de redressement
- Décisions des organes de gouvernance

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : ce courrier doit être adressé à l'ACPR (4 place de Budapest, CS 92459, 75436 Paris Cedex 09). La notification précoce est non seulement une obligation mais aussi un atout : l'ACPR peut vous orienter vers un dispositif de résolution organisée.`,
  },
  {
    slug: 'demande-apesa',
    titre: 'Demande de soutien APESA (urgence psychologique)',
    destinataire: 'APESA — Aide Psychologique aux Entrepreneurs en Souffrance Aiguë',
    categorie: 'social',
    icone: '🤝',
    description: 'Saisir directement APESA pour bénéficier de 5 séances gratuites avec un psychologue clinicien (entrepreneurs en grande souffrance).',
    objet: 'Demande de prise en charge psychologique APESA',
    corps: `Madame, Monsieur,

Je vous contacte en tant que chef d'entreprise traversant une période de très forte tension psychique liée à mes difficultés professionnelles.

SITUATION PROFESSIONNELLE
- Activité : {{ACTIVITE}}
- Statut : {{STATUT_DIRIGEANT}} ({{FORME_JURIDIQUE}})
- Effectif : {{EFFECTIF}}
- Stade actuel : {{STADE_DIFFICULTE}}

ÉTAT PERSONNEL
Sans entrer dans le détail clinique, je traverse actuellement {{ETAT_PERSONNEL}} qui affectent significativement ma capacité à piloter la situation et à prendre des décisions sereines.

Je sollicite le bénéfice du dispositif APESA, qui permet d'accéder à 5 séances gratuites avec un psychologue clinicien spécialisé dans l'accompagnement des dirigeants.

INFORMATIONS UTILES
- Disponibilité : {{DISPONIBILITES}}
- Préférence présentiel / visio : {{PREFERENCE_CONSULTATION}}
- Ville / région : {{LOCALISATION}}
- Contact privilégié : {{COORDONNEES}}

Je m'engage à respecter la confidentialité du dispositif et à honorer les rendez-vous fixés.

Je vous remercie pour votre écoute et votre accompagnement.

Bien à vous.

Important : APESA peut aussi être saisi via le tribunal de commerce, votre expert-comptable, votre avocat, ou directement par téléphone. La saisine est confidentielle et gratuite (www.apesa-france.com).`,
  },
  {
    slug: 'demande-aide-juridictionnelle',
    titre: 'Demande d\'aide juridictionnelle',
    destinataire: 'Bureau d\'aide juridictionnelle du tribunal',
    categorie: 'tribunal',
    icone: '⚖️',
    description: 'Demander la prise en charge totale ou partielle des frais d\'avocat et d\'huissier pour vos procédures (perso ou pro).',
    objet: 'Demande d\'aide juridictionnelle — référence Cerfa 16146*03',
    corps: `Madame, Monsieur,

Je sollicite le bénéfice de l'aide juridictionnelle pour une procédure {{NATURE_PROCEDURE}} en application de la loi n° 91-647 du 10 juillet 1991.

NATURE DU DOSSIER
{{DETAIL_DOSSIER}}

SITUATION FINANCIÈRE
- Revenu fiscal de référence (avis d'imposition N-1) : {{RFR}} €
- Composition du foyer fiscal : {{COMPOSITION_FOYER}}
- Patrimoine immobilier (hors résidence principale) : {{PATRIMOINE_IMMO}} €
- Patrimoine financier (épargne, valeurs mobilières) : {{PATRIMOINE_FIN}} €

Au vu de mon RFR, je sollicite :
- [ ] L'aide juridictionnelle TOTALE (RFR ≤ 12 957 € en 2026)
- [ ] L'aide juridictionnelle PARTIELLE (RFR > 12 957 € et ≤ 19 433 € en 2026)

AVOCAT SOUHAITÉ
{{AVOCAT_CHOISI}}

PIÈCES JOINTES
- Cerfa 16146*03 dûment complété
- Avis d'imposition de l'année N-1 (recto-verso)
- Justificatifs de patrimoine (relevés bancaires, taxe foncière)
- Justificatif d'identité
- Justificatif de domicile
- Convocation au tribunal ou copie de l'assignation
- {{AUTRES_PIECES}}

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : à déposer au bureau d'aide juridictionnelle, installé au tribunal judiciaire. Délai de réponse : 1 à 3 mois. Barème 2026 pour une personne seule (service-public.gouv.fr) : l'AJ totale couvre 100 % des frais (RFR jusqu'à 12 957 €) ; l'AJ partielle couvre 55 % (RFR de 12 958 à 15 316 €) ou 25 % (RFR de 15 317 à 19 433 €).`,
  },
];

export function getCourrier(slug: string): CourrierTemplate | undefined {
  return COURRIERS.find((c) => c.slug === slug);
}

export const CATEGORIES: Record<string, { label: string; couleur: string }> = {
  urssaf: { label: 'URSSAF', couleur: 'rouge' },
  impots: { label: 'Impôts', couleur: 'jaune' },
  fournisseurs: { label: 'Fournisseurs', couleur: 'bleu' },
  banque: { label: 'Banque', couleur: 'bleu-fonce' },
  tribunal: { label: 'Tribunal', couleur: 'navy' },
  cci: { label: 'CCI', couleur: 'vert' },
  social: { label: 'Social', couleur: 'vert' },
};

// ─────────────────────────────────────────────────────────────
// Personnalisation contextuelle des courriers
// ─────────────────────────────────────────────────────────────

/**
 * Les courriers de ces slugs sont déjà très structurés ou ne
 * supportent pas un préambule émotionnel (contestation, saisine
 * de médiateur, requêtes judiciaires).
 */
const SLUGS_SANS_PREAMBULE = new Set<string>([
  'cessation-paiements',
  'mandat-ad-hoc',
  'conciliation',
  'mediation-entreprises',
  'contestation-urssaf',
]);

/**
 * Les courriers très formels (tribunal, contestation) ne reçoivent pas
 * de ligne de clôture émotionnelle : seule la formule standard du template
 * est conservée.
 */
const SLUGS_SANS_CLOSING = new Set<string>([
  'cessation-paiements',
  'mandat-ad-hoc',
  'conciliation',
  'contestation-urssaf',
]);

const SITUATION_FRAGMENTS: Record<Situation, string> = {
  prevention:
    "Je vous adresse cette demande à un stade encore amiable, pour anticiper et non subir. Je souhaite honorer mes obligations en les étalant sur une période raisonnable.",
  tresorie:
    "Mon entreprise traverse actuellement une tension de trésorerie identifiée. L'activité est maintenue et je sollicite votre bienveillance pour préserver son équilibre.",
  redressement:
    "Ma société fait face à une difficulté de paiement qu'il m'appartient de traiter dans les règles, au mieux de l'intérêt de mes créanciers et de la continuité d'activité.",
  assignation:
    "Ma démarche revêt un caractère d'urgence, une procédure ayant été initiée à mon encontre. Je souhaite rétablir un dialogue constructif avant l'audience.",
};

const SITUATION_URGENCY: Record<Situation, 'normale' | 'elevee' | 'critique'> = {
  prevention: 'normale',
  tresorie: 'normale',
  redressement: 'elevee',
  assignation: 'critique',
};

const MORAL_CLOSINGS: Record<Moral, string> = {
  combatif:
    "Je reste pleinement mobilisé·e pour traverser cette période et m'engage à respecter scrupuleusement les modalités que nous conviendrons.",
  epuise:
    "Je traverse une période éprouvante et je vous remercie sincèrement de l'attention que vous porterez à ma demande.",
  perdu:
    "Je reconnais avoir besoin d'être accompagné·e pour avancer. Un échange, même bref, m'aiderait à clarifier la marche à suivre.",
};

/**
 * Reformate l'étiquette brute du questionnaire en une phrase naturelle.
 * Ex. : "Oui, 5 ou plus" → "5 salariés ou plus"
 */
function normaliserEffectifDetail(detail?: string): string | null {
  if (!detail) return null;
  const clean = detail.replace(/^Oui,\s*/i, '').trim();
  if (/^moins de\s+(\d+)/i.test(clean)) return clean + ' salariés';
  if (/^(\d+)\s*ou\s*plus/i.test(clean)) return clean + ' salariés';
  if (/^(\d+)$/.test(clean)) return clean + ' salariés';
  if (/seul·e|seul\(e\)|seul$/i.test(clean)) return null;
  return clean;
}

function effectifFragment(effectif?: Effectif, detail?: string): string | null {
  if (!effectif) return null;
  if (effectif === 'independant') {
    return "J'exerce mon activité sans salarié.";
  }
  const precisions = normaliserEffectifDetail(detail);
  return precisions
    ? `L'entreprise compte ${precisions}, dont l'emploi dépend directement de ma capacité à traverser cette période.`
    : "L'entreprise emploie des salariés dont la situation est directement liée à la résolution de ces difficultés.";
}

function conseilCategorie(template: CourrierTemplate, ctx: CourrierContext): string | null {
  switch (template.categorie) {
    case 'urssaf':
      if (ctx.situation === 'assignation') {
        return `URGENT : envoyez ce courrier en recommandé AR sous 48 h et appelez en parallèle votre URSSAF (${telUrssaf(ctx.effectif)}). En cas d'assignation, demandez explicitement une suspension des poursuites.`;
      }
      return "Envoyez en recommandé AR. L'URSSAF traite les demandes argumentées plus vite — joignez bilan + situation de trésorerie + prévisionnel.";
    case 'impots':
      if (ctx.situation === 'redressement' || ctx.situation === 'assignation') {
        return "Demandez en parallèle un rendez-vous avec votre interlocuteur dédié au SIE (Service des Impôts des Entreprises) et mentionnez la possibilité d'une CCSF (Commission des chefs des services financiers).";
      }
      return "Joignez impérativement un prévisionnel de trésorerie. Le SIE accepte plus volontiers un échelonnement quand la demande est anticipée.";
    case 'tribunal':
      return "Ce courrier engage votre entreprise. Faites-le relire par un avocat ou par un mandataire judiciaire avant envoi — la plupart proposent un premier échange gratuit.";
    case 'banque':
      if (ctx.situation === 'redressement' || ctx.situation === 'assignation') {
        return "Joignez immédiatement la médiation du crédit (gratuit, 5 jours pour répondre). En cas de cessation des paiements, votre banque ne peut pas refuser de discuter sans motif sérieux.";
      }
      return "Sollicitez en parallèle la médiation du crédit (Banque de France). Service gratuit qui facilite le dialogue avec votre établissement.";
    case 'fournisseurs':
      return "Téléphonez avant d'envoyer le courrier : un appel humain change souvent l'issue. Le courrier sécurise ensuite l'accord par écrit.";
    case 'cci':
      return "La CCI propose souvent un premier rendez-vous sous 7 jours. N'hésitez pas à les relancer par téléphone si pas de réponse en une semaine.";
    case 'social':
      return "Préparez vos justificatifs avant l'envoi : avis d'imposition, relevés bancaires, quittances. Une demande complète est traitée en 2 à 4 semaines.";
    default:
      return null;
  }
}

// Reconnaît le paragraphe qui contient la formule de politesse finale,
// y compris quand elle n'ouvre pas le paragraphe (« Dans l'attente de
// votre réponse, je vous prie d'agréer… »).
const FORMULE_REGEX = /(veuillez agr[ée]er|je vous prie d.agr[ée]er|avec mes (?:meilleures|sinc[èe]res)? ?salutations|cordialement|bien à vous|^fait à)/i;

/** Urssaf : 36 98 pour les travailleurs indépendants, 39 57 pour les employeurs. */
function telUrssaf(effectif?: Effectif): string {
  if (effectif === 'independant') return '3698';
  if (effectif === 'salaries') return '3957';
  return '3698 pour les indépendant·e·s, 3957 pour les employeurs';
}

function injectFragments(corps: string, preambule?: string, closing?: string): string {
  if (!preambule && !closing) return corps;
  const blocks = corps.split(/\n\n+/);
  if (blocks.length === 0) return corps;

  // Préambule : inséré après la salutation initiale (1er bloc qui contient "Madame" ou "Monsieur").
  if (preambule) {
    const insertAt = blocks[0].match(/^(Madame|Monsieur|Cher)/i) ? 1 : 0;
    blocks.splice(insertAt, 0, preambule);
  }

  // Closing : inséré juste avant la formule de politesse finale.
  if (closing) {
    let formuleIndex = -1;
    for (let i = blocks.length - 1; i >= 0; i--) {
      if (FORMULE_REGEX.test(blocks[i].trim())) {
        formuleIndex = i;
        break;
      }
    }
    if (formuleIndex >= 0) {
      blocks.splice(formuleIndex, 0, closing);
    } else {
      blocks.push(closing);
    }
  }

  return blocks.join('\n\n');
}

/**
 * Champs à compléter d'un modèle : « {{NOM}} », « {{DATE_1}} »… (lettres
 * majuscules, chiffres et « _ »). Source unique pour la page du courrier.
 */
export function champsCourrier(text: string): string[] {
  return Array.from(new Set(Array.from(text.matchAll(/\{\{([A-Z0-9_]+)\}\}/g), (m) => m[1])));
}

/** Remplace chaque champ « {{X}} » par `remplacement(X)`. */
export function remplirChamps(text: string, remplacement: (champ: string) => string): string {
  return text.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, champ: string) => remplacement(champ));
}

export function personalizeCourrier(
  template: CourrierTemplate,
  ctx: CourrierContext
): PersonalizedCourrier {
  const sansPreambule = SLUGS_SANS_PREAMBULE.has(template.slug);
  const sansClosing = SLUGS_SANS_CLOSING.has(template.slug);

  const fragments: string[] = [];

  if (!sansPreambule && ctx.situation && SITUATION_FRAGMENTS[ctx.situation]) {
    fragments.push(SITUATION_FRAGMENTS[ctx.situation]);
  }

  // L'information sur l'effectif n'est pertinente que pour les courriers
  // qui négocient un moratoire/une aide où l'impact sur l'emploi peut peser.
  // Exclu : 'social' (aide personnelle du dirigeant, pas de l'entreprise),
  // 'fournisseurs' (échelle commerciale, pas sociale), 'tribunal' (formel).
  const categoriesAvecEffectif = new Set(['urssaf', 'impots', 'banque', 'cci']);
  if (
    !sansPreambule &&
    categoriesAvecEffectif.has(template.categorie) &&
    // On ne ressort pas l'effectif si le template a déjà un champ {{NB_SALARIES}}.
    !/\{\{NB_SALARIES\}\}/.test(template.corps)
  ) {
    const eff = effectifFragment(ctx.effectif, ctx.effectifDetail);
    if (eff) fragments.push(eff);
  }

  const preambule = fragments.length > 0 ? fragments.join('\n\n') : undefined;
  const closing = !sansClosing && ctx.moral ? MORAL_CLOSINGS[ctx.moral] : undefined;
  const conseil = conseilCategorie(template, ctx) ?? undefined;
  const urgence = ctx.situation ? SITUATION_URGENCY[ctx.situation] : undefined;

  return {
    objet: template.objet,
    corps: injectFragments(template.corps, preambule, closing),
    preambule,
    closing,
    conseil,
    urgence,
  };
}

export function loadContextFromStorage(): CourrierContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('solelis_reponses');
    if (!raw) return null;
    const r = JSON.parse(raw) as Partial<Reponses>;
    return {
      situation: r.situation,
      moral: r.moral,
      probleme: r.probleme,
      effectif: r.effectif,
      effectifDetail: r.effectifDetail,
    };
  } catch {
    return null;
  }
}
