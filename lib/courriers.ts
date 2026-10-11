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

/**
 * Libellé français de chaque champ « {{X}} » des modèles : affiché dans le
 * formulaire et, tant que le champ est vide, dans l'aperçu (« [libellé] »).
 */
export const LIBELLES_CHAMPS: Record<string, string> = {
  NOM_ENTREPRISE: 'Nom de l\'entreprise',
  SIRET: 'SIRET',
  NOM_DIRIGEANT: 'Nom du dirigeant',
  QUALITE: 'Qualité (gérant, président…)',
  ADRESSE: 'Adresse',
  VILLE: 'Ville',
  TRIBUNAL: 'Tribunal compétent (voir la carte « Organismes » de votre fiche)',
  DATE: 'Date du courrier',
  DUREE: 'Durée souhaitée (mois)',
  MONTANT: 'Montant (€)',
  TYPE_IMPOT: 'Nature de l\'impôt (TVA, IS…)',
  DATE_ECHEANCE: 'Date d\'échéance initiale',
  RAISON: 'Raison de la difficulté',
  DATE_DEBUT: 'Date de début du plan',
  NUM_FACTURE: 'Numéro de facture',
  DUREE_RELATION: 'Durée de la relation commerciale',
  MONTANT_1: 'Montant 1er versement (€)',
  MONTANT_2: 'Montant 2e versement (€)',
  MONTANT_3: 'Montant solde (€)',
  DATE_1: 'Date 1er versement',
  DATE_2: 'Date 2e versement',
  DATE_3: 'Date solde',
  NOM_ADVERSAIRE: 'Nom de l\'entreprise adverse',
  SIRET_ADVERSAIRE: 'SIRET de l\'entreprise adverse',
  NATURE_DIFFEREND: 'Nature du différend',
  EXPOSE_FAITS: 'Exposé des faits',
  TENTATIVES: 'Tentatives de résolution déjà faites',
  NOM_BANQUE: 'Nom de votre banque',
  AUTRE_MOTIF: 'Autre motif',
  CONSEQUENCES: 'Conséquences pour l\'entreprise',
  NB_SALARIES: 'Nombre de salariés',
  CA: 'Chiffre d\'affaires annuel (€)',
  FORME_JURIDIQUE: 'Forme juridique',
  CAPITAL: 'Capital social (€)',
  DATE_CESSATION: 'Date de cessation des paiements',
  DATE_CREATION: 'Date de création',
  ACTIVITE: 'Activité principale',
  NATURE_DIFFICULTES: 'Nature des difficultés',
  DISPONIBILITES: 'Vos disponibilités',
  DESCRIPTION_DIFFICULTES: 'Description des difficultés',
  LISTE_CREANCIERS: 'Liste des principaux créanciers',
  MISSION_SOUHAITEE: 'Mission souhaitée pour le mandataire',
  OBJECTIF_CONCILIATION: 'Objectif de la conciliation',
  REFERENCE_DETTE: 'Référence de la dette',
  PROPOSITION_ARRANGEMENT: 'Votre proposition d\'arrangement',
  NUM_AFFILIATION: 'Numéro de sécurité sociale ou de cotisant Urssaf',
  STATUT: 'Statut (indépendant, auto-entrepreneur…)',
  REVENUS: 'Revenus mensuels actuels (€)',
  CHARGES: 'Charges fixes mensuelles (€)',
  SITUATION_FAMILIALE: 'Situation familiale',
  PERSONNES_A_CHARGE: 'Nombre de personnes à charge',
  DESCRIPTION_SITUATION: 'Description de votre situation',
  OBJECTIF_AIDE: 'Ce que l\'aide vous permettrait',
  NUM_MED: 'Numéro de la mise en demeure',
  DATE_MED: 'Date de la mise en demeure',
  MOTIFS_CONTESTATION: 'Motifs de la contestation',
  DATE_FIN: 'Date de fin de la période',
  LISTE_PIECES: 'Liste des pièces justificatives',
  ACTIONS_REDRESSEMENT: 'Actions déjà engagées pour redresser la situation',
  AUTRES_PIECES: 'Autres pièces jointes',
  AVOCAT_CHOISI: 'Avocat choisi (nom, barreau) ou « désignation par le bâtonnier »',
  CAPITAL_RESTANT: 'Capital restant dû (€)',
  CATEGORIE_ACTIVITE: 'Catégorie d\'activité (commerciale, artisanale, libérale…)',
  COMPOSITION_FOYER: 'Composition du foyer fiscal',
  COORDONNEES: 'Vos coordonnées (téléphone, e-mail)',
  DATE_FIN_ACTUELLE: 'Date de fin actuelle du prêt',
  DATE_PREMIER_VERSEMENT: 'Date du premier versement',
  DATE_REPRISE_COURANT: 'Date depuis laquelle les cotisations courantes sont payées',
  DATE_SOUSCRIPTION: 'Date de souscription du prêt',
  DETAIL_DOSSIER: 'Détail du dossier (faits, adversaire, enjeu)',
  DIFFERE_DEMANDE: 'Différé demandé (6 mois au plus, ex. : différé d\'amortissement de 6 mois)',
  DUREE_DEMANDEE: 'Allongement demandé (années : 2 au plus, 4 si particulièrement justifié)',
  DUREE_PLAN: 'Durée souhaitée du plan (mois)',
  EFFECTIF: 'Effectif (nombre de salariés)',
  ETAT_PERSONNEL: 'Ce que vous traversez (en quelques mots)',
  INDICATEURS_FINANCIERS: 'Indicateurs financiers (chiffre d\'affaires, trésorerie…)',
  LOCALISATION: 'Ville / région',
  MENSUALITE_ACTUELLE: 'Mensualité actuelle (€)',
  MENSUALITE_CIBLE: 'Nouvelle mensualité souhaitée (€)',
  MENSUALITE: 'Mensualité proposée (€)',
  MONTANT_FISCAL: 'Montant des dettes fiscales (€)',
  MONTANT_PGE: 'Montant initial du PGE (€)',
  MONTANT_SOCIAL: 'Montant des dettes sociales (€)',
  MONTANT_TOTAL: 'Montant total des dettes (€)',
  NATURE_DIFFICULTE: 'Nature de la difficulté',
  NATURE_PROCEDURE: 'Nature de la procédure (ex. : de redressement judiciaire)',
  ORIGINES_DIFFICULTES: 'Origines des difficultés',
  PATRIMOINE_FIN: 'Patrimoine financier (€)',
  PATRIMOINE_IMMO: 'Patrimoine immobilier hors résidence principale (€)',
  PREFERENCE_CONSULTATION: 'Préférence : rendez-vous sur place ou en visio',
  REFERENCE_AGREMENT: 'Numéro ORIAS / agrément',
  REFERENCE_PGE: 'Numéro du contrat de PGE',
  RFR: 'Revenu fiscal de référence (€)',
  SITUATION_ECONOMIQUE: 'Situation économique de l\'entreprise',
  STADE_DIFFICULTE: 'Stade actuel des difficultés',
  STATUT_DIRIGEANT: 'Votre statut (gérant·e, président·e…)',
};

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

Note : la saisine se fait en ligne, en créant votre dossier sur https://www.banque-france.fr/fr/a-votre-service/entreprises/saisir-mediation-credit (renseignements au 34 14) ; ce courrier vous sert de base pour exposer votre situation. Il faut d'abord avoir tenté de régler la difficulté avec votre banque. En cas de dénonciation de découvert, saisissez la médiation avant la fin du préavis de 60 jours.`,
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

Pièces jointes (article R631-1 du Code de commerce) :
1. Formulaire Cerfa n° 10530*02 « Déclaration de cessation des paiements », comprenant l'état du passif exigible et de l'actif disponible
2. Comptes annuels du dernier exercice
3. Numéro unique d'identification (SIREN) de l'entreprise
4. Situation de trésorerie datant de moins d'un mois
5. Nombre de salariés à la date de la demande (nom et adresse de chacun) et chiffre d'affaires du dernier exercice
6. État chiffré des créances et des dettes (nom et domicile des créanciers, montant global des salaires impayés)
7. État actif et passif des sûretés et engagements hors bilan
8. Inventaire sommaire des biens de l'entreprise
9. Le cas échéant : liste des associés responsables solidairement des dettes sociales ; nom et adresse des représentants du CSE ; ordre professionnel dont relève l'activité (profession libérale réglementée)
10. Attestation sur l'honneur certifiant l'absence de mandat ad hoc ou de conciliation dans les 18 mois précédant la demande (sinon, date de désignation ou d'ouverture et autorité qui y a procédé)

Je demande au Tribunal de bien vouloir ouvrir une procédure de redressement judiciaire (ou de liquidation judiciaire si le redressement est manifestement impossible).

Fait à {{VILLE}}, le {{DATE}}`,
  },
  {
    slug: 'rdv-cci',
    titre: 'Demande de rendez-vous CCI',
    destinataire: 'CCI de votre département',
    categorie: 'cci',
    icone: '📅',
    description: 'Solliciter un rendez-vous d\'accompagnement auprès de votre CCI (artisan·e : votre chambre de métiers et de l\'artisanat).',
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

Pièces jointes :
- Extrait K-bis ou justificatif d'immatriculation au RNE
- État des créances et des dettes, avec échéancier et liste des principaux créanciers
- État actif et passif des sûretés et engagements hors bilan
- Comptes annuels, tableau de financement et situation de l'actif disponible et du passif exigible des 3 derniers exercices (s'ils ont été établis)
- Attestation sur l'honneur de l'absence de cessation des paiements

Je reste à la disposition du Tribunal pour tout complément d'information.

Veuillez agréer, Madame, Monsieur le Président, l'expression de ma haute considération.

Note : le greffe propose un formulaire « Demande de désignation d'un mandataire ad hoc ». La demande se dépose en ligne (Tribunal digital) ou en 2 exemplaires au greffe du tribunal du siège. La procédure est confidentielle ; la rémunération du mandataire, fixée par le président du tribunal avec votre accord, est à la charge de l'entreprise.`,
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

Situation économique, sociale, financière et patrimoniale, besoins de financement et moyens d'y faire face :
{{DESCRIPTION_DIFFICULTES}}

Principaux créanciers :
{{LISTE_CREANCIERS}}

Accord recherché :
{{OBJECTIF_CONCILIATION}}

Pièces jointes (article R611-22 du Code de commerce) :
- Extrait K-bis ou justificatif d'immatriculation au RNE (numéro unique d'identification)
- État des créances et des dettes, avec échéancier et liste des principaux créanciers
- État actif et passif des sûretés et engagements hors bilan
- Comptes annuels, tableau de financement et situation de l'actif réalisable et disponible et du passif exigible des 3 derniers exercices (s'ils ont été établis)
- Attestation sur l'honneur certifiant l'absence de procédure de conciliation dans les 3 mois précédant la demande
- Déclaration indiquant, le cas échéant, si un tiers prend en charge les frais de la procédure

Veuillez agréer, Madame, Monsieur le Président, l'expression de ma haute considération.

Note : la requête se dépose en ligne (Tribunal digital) ou en 2 exemplaires au greffe du tribunal du siège. Le conciliateur est désigné pour 4 mois au plus, prolongeables à sa demande dans la limite de 5 mois au total (art. L611-6). La procédure est confidentielle ; la rémunération du conciliateur est à la charge de l'entreprise.`,
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
    destinataire: 'Urssaf — Action sociale du CPSTI (travailleurs indépendants)',
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

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations respectueuses.

Important : joignez à ce courrier le formulaire de l'aide demandée (rubrique « Action sanitaire et sociale »), rempli et signé, et envoyez le tout depuis la messagerie de votre espace en ligne urssaf.fr (motif « Un autre sujet », puis « Solliciter l'action sociale du CPSTI »). L'aide est accordée au cas par cas.`,
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

À défaut d'accord amiable, je me réserve le droit de saisir le pôle social du tribunal judiciaire compétent dans le délai légal.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : la commission de recours amiable doit être saisie dans un délai de 2 mois à compter de la notification de la mise en demeure (art. R142-1 du Code de la sécurité sociale). Envoyez ce courrier en recommandé avec accusé de réception, pour garder la preuve de la date.`,
  },
  {
    slug: 'saisine-ccsf',
    titre: 'Saisine de la CCSF (échelonnement fiscal + social)',
    destinataire: 'Commission des chefs des services financiers — DDFiP',
    categorie: 'impots',
    icone: '🏛️',
    description: 'Demande d\'échelonnement global de vos dettes fiscales ET sociales en un seul dossier.',
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
- Dettes fiscales (TVA, IS, CFE…) : {{MONTANT_FISCAL}} €
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
- Dossier de saisine de la CCSF dûment complété (formulaire sur entreprendre.service-public.gouv.fr)
- Attestation de l'expert-comptable sur les difficultés financières de l'entreprise
- Attestation Urssaf de paiement des parts salariales des cotisations (ou attestation sur l'honneur qu'aucune n'est due)
- Dernier bilan, chiffre d'affaires depuis le 1er janvier et situation de trésorerie actuelle
- Plan de trésorerie prévisionnel couvrant la durée du plan demandé
- Tableau récapitulatif des dettes (principal, pénalités, frais de poursuite, créanciers)

Je m'engage à respecter scrupuleusement ce plan et à maintenir le paiement des échéances courantes. Je reste à votre disposition pour tout complément d'information.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : ce courrier doit être adressé au secrétariat permanent de la CCSF de votre département (à la DDFiP). Conditions : être à jour de vos déclarations fiscales et sociales et avoir payé les parts salariales des cotisations. La saisine est gratuite et confidentielle. La commission a 2 mois pour répondre ; sans réponse, la demande est considérée comme rejetée.`,
  },
  {
    slug: 'restructuration-pge',
    titre: 'Demande de restructuration de PGE',
    destinataire: 'Votre banque (à l\'attention de votre conseiller)',
    categorie: 'banque',
    icone: '💳',
    description: 'Ouvrir le dialogue avec votre banque avant de saisir la Médiation du crédit, qui organise les restructurations de PGE (accord de place reconduit jusqu\'au 31 décembre 2026) : allongement de 2 ans en général, 4 ans au plus, garantie de l\'État maintenue.',
    objet: 'Demande de réaménagement du PGE n° {{REFERENCE_PGE}}',
    corps: `Madame, Monsieur,

Je vous sollicite au sujet du Prêt garanti par l'État (PGE) n° {{REFERENCE_PGE}} contracté par la société {{NOM_ENTREPRISE}} (SIRET {{SIRET}}) auprès de votre établissement, dont l'entreprise n'est plus en mesure d'honorer les échéances selon l'échéancier actuel.

SITUATION DU PGE
- Montant initial : {{MONTANT_PGE}} €
- Date de souscription : {{DATE_SOUSCRIPTION}}
- Capital restant dû : {{CAPITAL_RESTANT}} €
- Mensualité actuelle : {{MENSUALITE_ACTUELLE}} €
- Échéance actuelle : {{DATE_FIN_ACTUELLE}}

SITUATION ÉCONOMIQUE
{{SITUATION_ECONOMIQUE}}

DEMANDE DE RÉAMÉNAGEMENT
Je souhaite examiner avec vous un réaménagement de ce prêt :
- Allongement de la durée de remboursement de {{DUREE_DEMANDEE}} an(s)
- {{DIFFERE_DEMANDE}}
- Nouvelle mensualité cible : {{MENSUALITE_CIBLE}} €

À défaut de solution, j'envisage de saisir la Médiation du crédit dans le cadre de l'accord de place du 19 janvier 2022 sur les restructurations de PGE, reconduit jusqu'au 31 décembre 2026. Je vous remercie, le cas échéant, de m'indiquer par écrit que vous m'orientez vers cette procédure : ce document est demandé lors de la saisine.

PIÈCES JOINTES
- Situation prévisionnelle de trésorerie à 12 mois
- État des dettes fiscales et sociales
- Dernier bilan et compte de résultat
- Attestation de l'expert-comptable ou du commissaire aux comptes sur les difficultés de l'entreprise
- Justificatifs des actions correctives engagées

Je vous remercie de bien vouloir examiner cette demande et de m'apporter votre réponse par écrit dans les meilleurs délais.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : une restructuration de PGE avec maintien de la garantie de l'État passe par la Médiation du crédit (saisine en ligne sur le site de la Banque de France, renseignements au 34 14), une seule fois. Conditions : PGE de 50 000 € au plus (au-delà, adressez-vous d'abord au conseiller départemental à la sortie de crise), moins de 250 salariés, pas de cessation des paiements, attestation d'un expert-comptable ou d'un commissaire aux comptes. La restructuration porte sur l'ensemble des crédits bancaires à échéance (hors crédit-bail, location financière, affacturage et concours à durée indéterminée). L'allongement est de 2 ans au plus (4 ans si la situation le justifie particulièrement), un éventuel différé supplémentaire de 6 mois au plus étant compris dans cet allongement. À savoir : l'entreprise est alors classée en défaut par les banques, ce qui complique l'accès à de nouveaux financements pendant au moins un an.`,
  },
  {
    slug: 'demande-acpr',
    titre: 'Information de l\'ACPR (organisme financier contrôlé)',
    destinataire: 'Autorité de contrôle prudentiel et de résolution (ACPR) — votre service de contrôle habituel',
    categorie: 'banque',
    icone: '🏦',
    description: 'Pour un organisme contrôlé par l\'ACPR (banque, établissement de paiement, organisme d\'assurance) : informer votre superviseur de vos difficultés. L\'ACPR n\'accorde ni financement ni délai ; les intermédiaires (courtiers, IOBSP) relèvent des dispositifs de droit commun.',
    objet: 'Information sur une situation financière difficile',
    corps: `Madame, Monsieur,

En tant que dirigeant·e d'un organisme soumis au contrôle de l'ACPR, je vous informe de la situation financière difficile que traverse la société {{NOM_ENTREPRISE}}.

IDENTIFICATION
- Dénomination : {{NOM_ENTREPRISE}}
- Numéro ORIAS / Agrément : {{REFERENCE_AGREMENT}}
- Catégorie d'activité : {{CATEGORIE_ACTIVITE}}
- Effectif : {{EFFECTIF}}

NATURE DE LA DIFFICULTÉ
{{NATURE_DIFFICULTE}}

INDICATEURS FINANCIERS ET RÉGLEMENTAIRES
- {{INDICATEURS_FINANCIERS}}

ACTIONS DÉJÀ ENGAGÉES
{{ACTIONS_REDRESSEMENT}}

DEMANDE
Je sollicite un échange avec le service chargé du contrôle de notre organisme afin de :
- vous présenter la situation et les mesures de redressement envisagées ;
- m'assurer que ces mesures respectent nos obligations réglementaires.

Je m'engage à vous tenir informé·e de toute évolution significative de la situation.

PIÈCES JOINTES
- Dernier bilan et compte de résultat
- Derniers états réglementaires remis (le cas échéant)
- Plan d'action de redressement
- Décisions des organes de gouvernance

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : l'ACPR contrôle les banques, les organismes d'assurance et leurs intermédiaires ; elle n'accorde ni financement ni délai de paiement et n'intervient pas dans les litiges avec les clients. Adressez ce courrier à votre interlocuteur habituel à l'ACPR (siège : 4 place de Budapest, 75009 Paris). Si vous êtes intermédiaire immatriculé·e à l'ORIAS (courtier, agent, IOBSP), vos difficultés se traitent avec les outils de droit commun (CCI, mandat ad hoc, conciliation, médiation du crédit) ; pensez à mettre à jour vos informations auprès de l'ORIAS et de votre association professionnelle en cas de changement.`,
  },
  {
    slug: 'demande-apesa',
    titre: 'Demande de soutien APESA (souffrance psychologique)',
    destinataire: 'Une sentinelle APESA (expert-comptable, avocat, conseiller CCI ou CMA, greffe ou juge du tribunal, mandataire…) ou l\'APESA de votre territoire',
    categorie: 'social',
    icone: '🤝',
    description: 'Demander à un professionnel formé (« sentinelle ») de déclencher une alerte APESA : un psychologue vous rappelle, souvent dans les 24 heures, et propose jusqu\'à 5 consultations gratuites. APESA n\'est pas un service d\'urgence : en cas d\'idées suicidaires, appelez le 3114.',
    objet: 'Demande de mise en relation avec APESA (soutien psychologique)',
    corps: `Madame, Monsieur,

Je vous contacte en tant que chef d'entreprise traversant une période de très forte tension psychique liée à mes difficultés professionnelles.

SITUATION PROFESSIONNELLE
- Activité : {{ACTIVITE}}
- Statut : {{STATUT_DIRIGEANT}} ({{FORME_JURIDIQUE}})
- Effectif : {{EFFECTIF}}
- Stade actuel : {{STADE_DIFFICULTE}}

ÉTAT PERSONNEL
Sans entrer dans le détail clinique, je traverse actuellement {{ETAT_PERSONNEL}} qui affectent significativement ma capacité à piloter la situation et à prendre des décisions sereines.

J'accepte d'être aidé·e et je vous demande de déclencher une alerte APESA à mon nom, afin qu'un·e psychologue du dispositif me contacte. Le dispositif propose jusqu'à 5 consultations de soutien psychologique, gratuites et confidentielles.

INFORMATIONS UTILES
- Disponibilité : {{DISPONIBILITES}}
- Préférence présentiel / visio : {{PREFERENCE_CONSULTATION}}
- Ville / région : {{LOCALISATION}}
- Contact privilégié : {{COORDONNEES}}

Je vous remercie pour votre écoute et votre accompagnement.

Bien à vous.

Important : l'alerte APESA est déclenchée, avec votre accord, par une « sentinelle » formée (juge ou greffier, mandataire ou administrateur judiciaire, avocat, expert-comptable, conseiller de CCI ou de chambre de métiers…). Vous pouvez aussi trouver l'APESA de votre territoire sur www.apesa-france.com (« Trouver mon APESA ») ou joindre son secrétariat au 05 46 98 42 85. APESA n'est pas un dispositif d'urgence : en cas d'idées suicidaires, appelez le 3114 (24 h/24, 7 j/7), ou le 15.`,
  },
  {
    slug: 'demande-aide-juridictionnelle',
    titre: 'Demande d\'aide juridictionnelle',
    destinataire: 'Bureau d\'aide juridictionnelle du tribunal judiciaire',
    categorie: 'tribunal',
    icone: '⚖️',
    description: 'Demander la prise en charge totale ou partielle des frais d\'avocat et de commissaire de justice (ex-huissier). Réservée aux personnes physiques (y compris l\'entrepreneur individuel) : une société commerciale n\'y a pas droit.',
    objet: 'Demande d\'aide juridictionnelle — Cerfa 16146*04',
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
- [ ] L'aide juridictionnelle TOTALE (RFR ≤ 12 957 € en 2026 pour une personne seule)
- [ ] L'aide juridictionnelle PARTIELLE (RFR > 12 957 € et ≤ 19 433 € en 2026 pour une personne seule)

AVOCAT SOUHAITÉ
{{AVOCAT_CHOISI}}

PIÈCES JOINTES
- Formulaire Cerfa 16146*04 dûment complété
- Avis d'imposition de l'année N-1 (recto-verso)
- Justificatifs de patrimoine (relevés bancaires, taxe foncière)
- Justificatif d'identité
- Justificatif de domicile
- Convocation au tribunal ou copie de l'assignation
- {{AUTRES_PIECES}}

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Important : la demande se fait en ligne (service « Demande d'aide juridictionnelle en ligne ») ou avec le formulaire, déposé au bureau d'aide juridictionnelle du tribunal judiciaire de votre domicile (avant le procès) ou de celui où l'affaire est traitée. Aucun délai de réponse n'est fixé : la décision est notifiée « dans les meilleurs délais » ; si une audience approche, demandez l'aide juridictionnelle provisoire. Barème 2026 pour une personne seule (service-public.gouv.fr) : l'AJ totale couvre 100 % des frais (RFR jusqu'à 12 957 €) ; l'AJ partielle couvre 55 % (RFR de 12 958 à 15 316 €) ou 25 % (RFR de 15 317 à 19 433 €). Plafonds majorés selon les personnes à charge. Le patrimoine compte aussi : pour une personne seule, au-delà de 12 957 € de patrimoine mobilier ou de 38 866 € de patrimoine immobilier (hors résidence principale), aucune aide n'est possible.`,
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
  if (template.slug === 'demande-apesa') {
    return "Remettez ce courrier à un professionnel formé APESA (expert-comptable, avocat, conseiller CCI ou CMA, greffe du tribunal…) : c'est lui qui déclenche l'alerte. En cas d'idées suicidaires, n'attendez pas : appelez le 3114 (24 h/24).";
  }
  if (template.slug === 'demande-acpr') {
    return "L'ACPR n'accorde ni financement ni délai. Pour négocier avec vos créanciers, utilisez plutôt le mandat ad hoc ou la conciliation, et la médiation du crédit en cas de refus bancaire.";
  }
  switch (template.categorie) {
    case 'urssaf':
      if (ctx.situation === 'assignation') {
        return `URGENT : envoyez ce courrier en recommandé AR sous 48 h et appelez en parallèle votre URSSAF (${telUrssaf(ctx.effectif)}). En cas d'assignation, demandez explicitement une suspension des poursuites.`;
      }
      return "Envoyez en recommandé AR et joignez bilan + situation de trésorerie + prévisionnel : une demande argumentée est plus facile à instruire.";
    case 'impots':
      if (ctx.situation === 'redressement' || ctx.situation === 'assignation') {
        return "Demandez en parallèle un rendez-vous avec votre interlocuteur dédié au SIE (Service des Impôts des Entreprises) et mentionnez la possibilité d'une CCSF (Commission des chefs des services financiers).";
      }
      return "Joignez impérativement un prévisionnel de trésorerie, et faites la demande dès que vous anticipez la difficulté, sans attendre les relances.";
    case 'tribunal':
      return "Ce courrier engage votre entreprise. Faites-le relire par un avocat avant envoi : des consultations gratuites d'avocats sont proposées dans les points-justice.";
    case 'banque':
      if (ctx.situation === 'redressement' || ctx.situation === 'assignation') {
        return "Joignez immédiatement la médiation du crédit (gratuit) : le médiateur vous contacte sous 48 h, puis vos banques ont 5 jours ouvrés pour revoir leur position.";
      }
      return "Sollicitez en parallèle la médiation du crédit (Banque de France). Service gratuit qui facilite le dialogue avec votre établissement.";
    case 'fournisseurs':
      return "Téléphonez avant d'envoyer le courrier : un appel humain change souvent l'issue. Le courrier sécurise ensuite l'accord par écrit.";
    case 'cci':
      return "Appelez aussi votre CCI (ou votre chambre de métiers et de l'artisanat) pour demander le service chargé des entreprises en difficulté, et relancez par téléphone sans réponse sous une semaine.";
    case 'social':
      return "Préparez vos justificatifs avant l'envoi : avis d'imposition, relevés bancaires, quittances. Un dossier complet évite les allers-retours.";
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
