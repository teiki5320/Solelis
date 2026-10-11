import type { Reponses, CompanyData } from './types';
import { getCompanyAge } from './secteur';
import { getDepartement, carteTribunal, tribunalSelonCodePostal, type OrganismeCard } from './organismes';

export type Axe = 'restructurer' | 'ceder' | 'sauvegarder' | 'liquider' | 'rebondir';

export interface Strategie {
  axe: Axe;
  titre: string;
  verdict: string;
  pourquoi: string[];
  etapes: string[];
  alternatives: string[];
  score: number;
}

/**
 * Entreprise individuelle (EI, EIRL, micro-entreprise) ?
 * S'appuie sur getFormeDetail : l'ancienne regex trouvait « ei » dans
 * « Non renseignée » ou « Société… ». Une forme inconnue n'est pas une EI.
 */
export function isEI(forme: string): boolean {
  return getFormeDetail(forme) !== 'societe';
}

export type FormeJuridiqueDetail = 'micro' | 'ei' | 'eirl' | 'societe';

/**
 * Sous-classifie la forme juridique pour affiner le moteur stratégie.
 * - micro : régime micro-entreprise (CA limité, franchise TVA, statut allégé)
 * - eirl : entrepreneur individuel à responsabilité limitée (patrimoine affecté, statut éteint depuis 2022 mais EIRL existants conservent leur statut)
 * - ei : entrepreneur individuel classique (statut unifié depuis loi du 14 fév. 2022 — séparation patrimoine pro/perso de droit)
 * - societe : SARL, SAS, SA, SCI, SNC… (personne morale, responsabilité limitée par défaut)
 *
 * Limite : l'INSEE renvoie « Entrepreneur individuel » (cat. juridique 1000)
 * pour TOUS les EI, micro-entrepreneurs compris — le régime micro n'est pas
 * dans Sirene. La branche 'micro' n'est donc atteinte que si la source de
 * données le précise explicitement ; les contenus destinés aux 'ei' doivent
 * rester valables pour un micro-entrepreneur.
 */
export function getFormeDetail(forme: string): FormeJuridiqueDetail {
  const f = (forme || '').toLowerCase();
  if (/micro|auto[\s-]?entrepren/i.test(f)) return 'micro';
  if (/eirl/i.test(f)) return 'eirl';
  if (/(?:^|[\s,])(ei|entrepreneur individuel|profession lib[ée]rale ind|artisan|commer[çc]ant)(?:[\s,]|$)/i.test(f) || /individuel/.test(f)) return 'ei';
  return 'societe';
}

export interface ResponsabiliteAssocies {
  /**
   * - ei : entrepreneur individuel (patrimoine personnel séparé de plein droit
   *   depuis le 15 mai 2022, art. L526-22 C. com.) ;
   * - limitee : société ou personne morale dont les dettes ne sont pas celles
   *   du dirigeant (sauf caution ou faute de gestion, art. L651-2 C. com.) ;
   * - illimitee : SNC, sociétés civiles, GIE — les associés répondent
   *   personnellement des dettes sociales, même sans caution ;
   * - inconnue : forme non renseignée.
   */
  regime: 'ei' | 'limitee' | 'illimitee' | 'inconnue';
  illimitee: boolean;
  /** Phrase complète (avec sa source) pour les régimes à risque illimité. */
  texte: string;
  /** Libellé court de la forme, pour les phrases (« associé·e de SNC »). */
  qui: string;
}

/**
 * Étendue de la responsabilité personnelle selon la forme juridique.
 * Sources : art. L221-1 C. com. (SNC), art. 1857 et 1858 C. civ. (sociétés
 * civiles), art. L323-10 C. rur. (GAEC : deux fois la part du capital),
 * art. L251-6 C. com. (GIE), art. L526-22 C. com. (EI).
 */
export function getResponsabiliteAssocies(forme: string): ResponsabiliteAssocies {
  const f = (forme || '').toLowerCase();
  if (!f.trim() || /non renseign|^catégorie juridique/.test(f)) {
    return { regime: 'inconnue', illimitee: false, texte: '', qui: '' };
  }
  if (getFormeDetail(forme) !== 'societe') {
    return { regime: 'ei', illimitee: false, texte: '', qui: 'entrepreneur·e individuel·le' };
  }
  if (/nom collectif|\bsnc\b/.test(f)) {
    return {
      regime: 'illimitee',
      illimitee: true,
      qui: 'associé·e de SNC',
      texte:
        "les associé·e·s d'une SNC répondent indéfiniment et solidairement des dettes de la société sur leurs biens personnels, même sans caution, après une mise en demeure de la société restée sans effet (art. L221-1 C. com.).",
    };
  }
  if (/groupement d.int[ée]r[êe]t [ée]conomique|\bgie\b/.test(f)) {
    return {
      regime: 'illimitee',
      illimitee: true,
      qui: 'membre de GIE',
      texte:
        "les membres d'un GIE sont tenus des dettes du groupement sur leur patrimoine propre, solidairement sauf convention contraire avec le créancier (art. L251-6 C. com.).",
    };
  }
  if (/placement immobilier|\bscpi\b/.test(f)) {
    return { regime: 'limitee', illimitee: false, texte: '', qui: 'associé·e' };
  }
  if (/\bgaec\b|groupement agricole d.exploitation/.test(f)) {
    return {
      regime: 'illimitee',
      illimitee: true,
      qui: 'associé·e de GAEC',
      texte:
        "les associé·e·s d'un GAEC répondent des dettes sociales sur leurs biens personnels, dans la limite de deux fois leur part du capital, sauf si les statuts prévoient davantage (art. L323-10 C. rur.).",
    };
  }
  if (/soci[ée]t[ée] civile|\bsci\b|\bscp\b|\bscm\b|\bscea\b|groupement foncier|groupement forestier/.test(f)) {
    return {
      regime: 'illimitee',
      illimitee: true,
      qui: 'associé·e de société civile',
      texte:
        "les associé·e·s d'une société civile répondent indéfiniment des dettes sociales, à proportion de leur part dans le capital, une fois la société poursuivie en vain (art. 1857 et 1858 C. civ.).",
    };
  }
  return { regime: 'limitee', illimitee: false, texte: '', qui: 'dirigeant·e de société' };
}

/**
 * Détermine la juridiction compétente en cas de procédure collective.
 *
 * Depuis la loi du 22 décembre 2021 :
 * - Tribunal de commerce (TC) : commerçants et artisans — dont toutes les
 *   sociétés commerciales par la forme (art. L210-1 C. com. : SARL, SAS, SA,
 *   SNC, commandites), quel que soit leur code NAF. Les SEL, commerciales
 *   par la forme malgré leur objet civil, relèvent aussi du TC.
 * - Tribunal judiciaire (TJ) : les autres débiteurs — professions libérales
 *   en nom propre, agriculteurs, sociétés civiles, associations.
 */
export function getJuridiction(company: CompanyData): 'TC' | 'TJ' {
  const forme = (company.formeJuridique || '').toLowerCase();

  // 1. Formes civiles et agricoles → TJ (à tester avant les formes commerciales :
  //    « exploitation agricole à responsabilité limitée » contient « responsabilité limitée »)
  if (/(soci[ée]t[ée] civile|\bsci\b|\bscp\b|\bscm\b|exploitation agricole|\bgaec\b|\bearl\b|\bscea\b|coop[ée]rative agricole|mat[ée]riel agricole|\bcuma\b|association|fondation|syndicat|copropri)/.test(forme)) {
    return 'TJ';
  }

  // 2. Sociétés commerciales par la forme → TC quel que soit le NAF
  //    (la société européenne est commerciale : art. L229-1 C. com.)
  if (/(\bsarl\b|\beurl\b|\bsas\b|\bsasu\b|\bsnc\b|\bsa\b|responsabilit[ée] limit[ée]e|par actions|anonyme|nom collectif|commandite|exercice lib[ée]ral|coop[ée]rative de commer[çc]ants|soci[ée]t[ée] europ[ée]enne)/.test(forme)) {
    return 'TC';
  }

  // 3. Entrepreneurs individuels : on distingue selon l'activité (NAF)
  const naf = company.naf?.replace(/\./g, '').toUpperCase() ?? '';
  // Libéraux (section M, codes 69-74 : juridique, comptable, conseil, archi, R&D, pub, autres)
  if (/^(69|70|71|72|73|74)/.test(naf)) return 'TJ';
  // Agriculteurs (section A : agriculture, sylviculture, pêche)
  if (/^(01|02|03)/.test(naf)) return 'TJ';
  // Activités de santé humaine (section Q, codes 86-88 : médecins, infirmiers…)
  if (/^(86|87|88)/.test(naf)) return 'TJ';
  // Tous les autres (commerçants, artisans) → tribunal de commerce
  return 'TC';
}

export interface TribunalCompetent {
  juridiction: 'TC' | 'TJ';
  /**
   * Nom du tribunal tel qu'affiché sur la carte « Organismes » : tribunal
   * réel du département (data/organismes.json — tribunal de commerce,
   * tribunal des activités économiques, chambre commerciale du tribunal
   * judiciaire en Alsace-Moselle, tribunal mixte de commerce outre-mer), ou
   * « Tribunal judiciaire de votre ressort » pour un débiteur relevant du TJ.
   * Jamais construit à partir de la commune de l'entreprise.
   */
  nom: string;
  /** Le même nom, à insérer dans une phrase (« au … », « le … »). */
  enPhrase: string;
  /** Type générique en minuscules : « tribunal de commerce », « tribunal judiciaire »… */
  generique: string;
  /** Type générique avec son article : « le tribunal de commerce », « la chambre commerciale… ». */
  leGenerique: string;
  /** Carte à afficher dans le groupe « Institutionnel ». */
  carte: OrganismeCard;
}

const CARTE_TJ_GENERIQUE: OrganismeCard = {
  nom: 'Tribunal judiciaire de votre ressort',
  type: 'Tribunal judiciaire · activité ni commerciale ni artisanale',
  site: 'https://www.justice.fr',
  badge: 'Art. L621-2 C. com.',
};

function generiqueDepuisType(type: string, juridiction: 'TC' | 'TJ'): string {
  const t = type.toLowerCase();
  // Ressort non déterminé dans un département qui compte un TAE et des TC.
  if (/ ou (le )?tribunal des activit/.test(t)) return 'tribunal compétent';
  if (/activit[ée]s [ée]conomiques/.test(t)) return 'tribunal des activités économiques';
  if (/chambre commerciale/.test(t)) return 'chambre commerciale du tribunal judiciaire';
  if (/mixte de commerce/.test(t)) return 'tribunal mixte de commerce';
  if (/premi[èe]re instance/.test(t)) return 'tribunal de première instance';
  if (/tribunal judiciaire/.test(t)) return 'tribunal judiciaire';
  return juridiction === 'TJ' ? 'tribunal judiciaire' : 'tribunal de commerce';
}

/**
 * Source unique du tribunal compétent pour une fiche : getJuridiction()
 * (TC ou TJ, art. L621-2 C. com.) croisé avec le tribunal du département
 * (data/organismes.json). Utilisé par la stratégie, les cartes prioritaires,
 * le plan d'action, la checklist, les courriers et la carte « Organismes ».
 */
export function getTribunalCompetent(
  company: Pick<CompanyData, 'formeJuridique' | 'naf' | 'departement'> & Partial<Pick<CompanyData, 'codePostal' | 'ville'>>,
): TribunalCompetent {
  const juridiction = getJuridiction(company as CompanyData);
  const dep = getDepartement(company.departement);
  const local = dep?.tribunal ? tribunalSelonCodePostal(dep, company.codePostal, company.ville) : null;
  let carte: OrganismeCard =
    (local && carteTribunal(local, juridiction)) ??
    (juridiction === 'TJ'
      ? CARTE_TJ_GENERIQUE
      : {
          nom: 'Tribunal de commerce dont dépend votre siège',
          type: 'Tribunal de commerce',
          site: 'https://www.justice.fr',
        });
  // Tribunaux des activités économiques : les professions du droit (avocats,
  // notaires, commissaires de justice… — NAF 69.10Z) restent au tribunal judiciaire.
  const naf = (company.naf || '').replace(/\./g, '').toUpperCase();
  if (juridiction === 'TJ' && /^6910/.test(naf) && /activit[ée]s [ée]conomiques/i.test(carte.type)) {
    carte = CARTE_TJ_GENERIQUE;
  }
  const nom = carte.nom;
  const generique = generiqueDepuisType(carte.type, juridiction);
  const enPhrase = /dont dépend|de votre ressort/.test(nom) ? nom.charAt(0).toLowerCase() + nom.slice(1) : nom;
  const leGenerique = `${generique.startsWith('chambre') ? 'la' : 'le'} ${generique}`;
  return { juridiction, nom, enPhrase, generique, leGenerique, carte };
}

/**
 * Nom du tribunal à placer dans les courriers ({{TRIBUNAL}} : « Madame,
 * Monsieur le Président du … »). Vide quand on ne connaît pas le tribunal
 * précis (carte générique « dont dépend votre siège » / « de votre
 * ressort ») : le champ reste alors à compléter par le dirigeant.
 */
export function nomTribunalPourCourrier(
  company: Pick<CompanyData, 'formeJuridique' | 'naf' | 'departement'> & Partial<Pick<CompanyData, 'codePostal' | 'ville'>>,
): string {
  const { nom } = getTribunalCompetent(company);
  if (/dont dépend|de votre ressort/.test(nom)) return '';
  return nom
    .replace(/\s*\((?:compétence commerciale|compétent pour [^)]*)\)\s*$/i, '')
    .replace(/\s+-\s+Chambre commerciale$/i, ' (chambre commerciale)')
    .trim();
}

/**
 * Libellé du tribunal à insérer dans une phrase. N'utilise JAMAIS la
 * commune de l'entreprise (« tribunal de commerce de Cargèse » n'existe pas).
 */
export function getJuridictionLabel(company: CompanyData): string {
  return getTribunalCompetent(company).enPhrase;
}

/**
 * Remplace la carte « tribunal » du groupe « Institutionnel » par celle de
 * getTribunalCompetent, pour que la carte et les textes de la fiche citent
 * le même tribunal (ex. tribunal mixte de commerce de Saint-Pierre à La
 * Réunion, choisi d'après le code postal).
 */
export function harmoniserCarteTribunal<G extends { cle: string; cartes: OrganismeCard[] }>(
  groupes: G[],
  company: CompanyData,
): G[] {
  const { carte } = getTribunalCompetent(company);
  return groupes.map((g) => {
    if (g.cle !== 'institutionnel') return g;
    const i = g.cartes.findIndex((c) => /^tribunal/i.test(c.nom) || /^tribunal/i.test(c.type));
    const cartes = [...g.cartes];
    if (i === -1) cartes.unshift(carte);
    else cartes[i] = carte;
    return { ...g, cartes };
  });
}

/**
 * Situations déclarées impliquant une cessation des paiements
 * (redressement à déclarer, ou assignation par un créancier).
 */
export function estEnCessation(r: Pick<Reponses, 'situation'>): boolean {
  return r.situation === 'redressement' || r.situation === 'assignation';
}

/**
 * Le rétablissement professionnel (PRP) peut-il être évoqué ? Conditions
 * déclarables dans le questionnaire (art. L645-1 C. com.) : personne
 * physique (EI, micro, EIRL), en cessation des paiements, sans salarié.
 * Restent à vérifier avec un conseil : redressement manifestement
 * impossible, aucun salarié au cours des 6 derniers mois, actif déclaré
 * inférieur à 15 000 € (art. R645-1).
 */
export function prpEnvisageable(
  r: Pick<Reponses, 'situation' | 'effectif'>,
  c: Pick<CompanyData, 'formeJuridique'>,
): boolean {
  return isEI(c.formeJuridique) && r.effectif === 'independant' && estEnCessation(r);
}

export function computeScores(r: Reponses, c: CompanyData): Record<Axe, number> {
  const age = getCompanyAge(c.dateCreation) ?? 0;

  const scores: Record<Axe, number> = {
    restructurer: 0,
    sauvegarder: 0,
    ceder: 0,
    liquider: 0,
    rebondir: 0,
  };

  if (r.situation === 'prevention') scores.restructurer += 3;
  if (r.situation === 'tresorie') scores.restructurer += 2;
  if (r.moral === 'combatif') scores.restructurer += 2;
  if (age >= 5) scores.restructurer += 1;
  if (r.vente === 'non') scores.restructurer += 2;
  // PGE en cours = forte indication restructuration amiable (médiation crédit)
  if (r.pgeEnCours === 'oui' && r.situation !== 'assignation') scores.restructurer += 2;

  if (r.situation === 'tresorie') scores.sauvegarder += 2;
  if (r.situation === 'prevention') scores.sauvegarder += 1;
  if (r.effectif === 'salaries') scores.sauvegarder += 1;
  if (r.vente === 'non') scores.sauvegarder += 1;
  // La sauvegarde est fermée au débiteur en cessation des paiements
  // (art. L620-1 C. com.) : jamais proposée, même en axe secondaire.
  if (estEnCessation(r)) scores.sauvegarder = 0;

  if (r.vente === 'oui') scores.ceder += 4;
  if (r.vente === 'peut-etre') scores.ceder += 2;
  if (r.moral === 'epuise') scores.ceder += 1;
  if (age >= 10) scores.ceder += 1;
  if (r.effectif === 'salaries') scores.ceder += 1;
  if (r.situation === 'redressement') scores.ceder += 1;
  // Le dirigeant a répondu qu'il ne veut pas vendre : on ne lui propose pas
  // la cession comme cap (le tribunal peut toujours l'envisager en procédure).
  if (r.vente === 'non') scores.ceder = 0;

  if (r.situation === 'redressement' && r.moral === 'perdu') scores.liquider += 2;
  if (r.situation === 'assignation') scores.liquider += 1;
  if (r.vente === 'non' && r.moral === 'perdu') scores.liquider += 1;
  if (r.caution === 'non') scores.liquider += 1;
  if (r.effectif === 'independant' && r.moral !== 'combatif') scores.liquider += 1;
  // Antécédents : récidive = sauvegarde / RJ déjà tentés, liquidation devient plus probable
  if (r.antecedents === 'oui') scores.liquider += 1;

  // Rebondir : rétablissement professionnel (art. L645-1 C. com.) — débiteur
  // personne physique EN CESSATION DES PAIEMENTS dont le redressement est
  // manifestement impossible, sans salarié au cours des 6 derniers mois,
  // actif déclaré < 15 000 € (R645-1). Jamais proposé hors cessation.
  const eligiblePRP = prpEnvisageable(r, c);
  if (eligiblePRP) scores.rebondir += 3;
  if (eligiblePRP && r.situation === 'redressement') scores.rebondir += 2;
  if (r.moral === 'perdu' && eligiblePRP) scores.rebondir += 1;
  // Antécédent : le texte affiché rappelle que le PRP est fermé après une liquidation
  // pour insuffisance d'actif ou un PRP clôturés depuis moins de 5 ans (art. L645-2).
  if (r.antecedents === 'oui' && eligiblePRP) scores.rebondir += 1;

  return scores;
}

export function buildStrategie(axe: Axe, r: Reponses, c: CompanyData, score: number): Strategie {
  const juridictionLabel = getJuridictionLabel(c);
  const responsabilite = getResponsabiliteAssocies(c.formeJuridique);

  switch (axe) {
    case 'restructurer': {
      const enCessation = estEnCessation(r);
      return {
        axe,
        score,
        titre: 'Restructurer en interne',
        verdict: enCessation
          ? "Vous êtes probablement déjà en cessation des paiements : la restructuration reste possible, mais elle passera par le cadre judiciaire (redressement avec plan de continuation) plutôt que par la seule voie amiable. La stratégie : préparer un plan crédible, couper les coûts non vitaux, et sécuriser la trésorerie à 6 mois."
          : "Votre situation est encore récupérable sans procédure publique. La stratégie : négocier des délais, couper les coûts non vitaux, et sécuriser la trésorerie à 6 mois.",
        pourquoi: [
          r.situation === 'prevention' || r.situation === 'tresorie'
            ? "Vous n'êtes pas (ou pas depuis plus de 45 j) en cessation des paiements — les outils amiables restent accessibles."
            : r.moral === 'combatif'
              ? "Votre moral et votre volonté de continuer sont des atouts forts."
              : "Un plan de redressement permet de poursuivre l'activité en étalant les dettes, sur 10 ans au plus (15 ans pour une activité agricole — art. L626-12 C. com.).",
          r.moral === 'combatif'
            ? "Vous avez l'énergie nécessaire pour piloter la restructuration."
            : 'Une restructuration ciblée préserve votre outil de travail.',
          r.vente === 'non' ? "Vous souhaitez garder l'entreprise — c'est cohérent avec cette voie." : 'Cette option laisse toutes les autres ouvertes.',
        ],
        etapes: [
          'Prévisionnel de trésorerie à 6 mois avec votre expert-comptable',
          'Demandes de délais : URSSAF, SIE, bailleur, fournisseurs (courriers Solelis)',
          r.pgeEnCours === 'oui'
            ? 'PGE en cours : demande de réaménagement auprès de votre banque, puis Médiation du crédit (renseignements au 3414) — l\'accord de place, prolongé jusqu\'au 31 décembre 2026, permet d\'allonger le PGE de 2 ans au plus (4 ans au plus si c\'est particulièrement justifié) en gardant la garantie de l\'État'
            : 'Saisine médiation du crédit si tension bancaire',
          'Audit des coûts fixes — éliminer le non-essentiel',
          'RDV avec le CIP (Centre d\'information sur la prévention des difficultés des entreprises) : entretien gratuit et confidentiel pour faire le point',
        ],
        alternatives: enCessation
          ? [
              "Si un accord global avec les créanciers est encore possible : conciliation (cessation < 45 j)",
              'Si le redressement échoue : plan de cession ou liquidation',
            ]
          : [
              'Si les négociations échouent : bascule en mandat ad hoc ou conciliation',
              'Si la situation se dégrade rapidement : sauvegarde judiciaire',
            ],
      };
    }

    case 'sauvegarder':
      return {
        axe,
        score,
        titre: 'Ouvrir une procédure de sauvegarde',
        verdict:
          "L'entreprise est viable à moyen terme mais a besoin d'une bulle de protection pour respirer. La sauvegarde fige les dettes, suspend les poursuites, et laisse le dirigeant aux commandes.",
        pourquoi: [
          "Vous n'êtes pas encore en cessation des paiements — la sauvegarde est la procédure la plus protectrice ouverte à votre cas.",
          r.effectif === 'salaries'
            ? "L'activité, et donc l'emploi, se poursuit pendant la période d'observation."
            : "Elle gèle les poursuites individuelles (banque, fournisseurs).",
          "Le plan de sauvegarde peut s'étaler sur 10 ans au plus (15 ans pour une activité agricole — art. L626-12 C. com.).",
        ],
        etapes: [
          "Rendez-vous confidentiel avec un avocat en droit des entreprises en difficulté",
          `Préparation du dossier (bilan, trésorerie, passif exigible) — ${juridictionLabel}`,
          "Dépôt de la requête en sauvegarde",
          "Audience d'ouverture et désignation du juge-commissaire / mandataire",
          "Élaboration du plan de sauvegarde (avec l'administrateur judiciaire, s'il en a été désigné un)",
        ],
        alternatives: [
          'Si vous préférez la confidentialité totale : mandat ad hoc puis conciliation',
          'Si la situation se dégrade : bascule en redressement',
        ],
      };

    case 'ceder':
      return {
        axe,
        score,
        titre: "Organiser la cession de l'entreprise",
        verdict:
          "Céder n'est pas échouer — c'est souvent la décision qui préserve le plus : les emplois, votre patrimoine, votre santé. La cession peut s'organiser hors procédure (amiable) ou en procédure (plan de cession).",
        pourquoi: [
          r.vente === 'oui'
            ? "Vous êtes prêt·e à céder — c'est l'axe qui maximise les options."
            : r.vente === 'peut-etre'
              ? "Vous y êtes ouvert·e — c'est le bon moment pour évaluer sérieusement cette piste."
              : "Sans engagement de votre part : connaître la valeur de l'entreprise aide à décider, même si vous préférez la garder.",
          r.moral === 'epuise'
            ? 'Céder vous libère de la charge psychique quotidienne.'
            : "La cession préserve la valeur accumulée pendant des années.",
          r.effectif === 'salaries'
            ? "En cas de reprise de l'activité, les contrats de travail passent en principe au repreneur (art. L1224-1 C. trav.) ; dans un plan de cession, seuls les emplois prévus par l'offre retenue le sont."
            : 'Même en indépendant, la clientèle et la marque ont une valeur.',
        ],
        etapes: [
          "Valorisation par un expert-comptable (multiple d'EBE, valeur patrimoniale)",
          'Identification de repreneurs : salariés, concurrents, réseaux CCI/CMA, bourses d\'annonces (Transentreprise des CCI et CMA, Bourse de la transmission de Bpifrance)',
          'Data room (bilan, contrats, litiges) + mandat à un intermédiaire de cession',
          'Négociation accompagnée (avocat + expert-comptable)',
          r.situation === 'redressement'
            ? 'Si en procédure : les offres de reprise sont déposées auprès de l\'administrateur judiciaire et le tribunal choisit (plan de cession)'
            : 'Signature compromis puis acte définitif',
        ],
        alternatives: [
          "Location-gérance avec option d'achat (transition en douceur)",
          'Cession partielle (actifs clés seulement)',
        ],
      };

    case 'liquider':
      return {
        axe,
        score,
        titre: 'Organiser une liquidation propre',
        verdict:
          "Quand l'entreprise ne peut plus être sauvée ni cédée, la liquidation judiciaire est la sortie la plus propre — pour vos créanciers et pour vous. Elle est encadrée et peut protéger le dirigeant de bonne foi.",
        pourquoi: [
          r.situation === 'redressement' || r.situation === 'assignation'
            ? "Vous êtes en cessation des paiements — la procédure devient inévitable si la reprise n'est pas possible."
            : "La situation rend la poursuite d'activité peu réaliste.",
          responsabilite.illimitee
            ? `Attention : ${responsabilite.texte} Une liquidation rapide limite l'aggravation du passif.`
            : r.caution === 'oui'
              ? 'Même avec cautions, une liquidation rapide peut limiter les dégâts.'
              : r.caution === 'non'
                ? "Vous n'avez pas de caution personnelle — votre patrimoine personnel est en principe à l'abri des dettes professionnelles."
                : 'Vérifiez si vous avez signé des cautions : ce sont elles qui exposent le plus votre patrimoine personnel.',
          r.moral !== 'combatif'
            ? 'Arrêter dignement préserve votre santé pour la suite.'
            : "Arrêter n'est pas renoncer — c'est choisir son moment.",
        ],
        etapes: [
          `Déclaration de cessation des paiements au ${juridictionLabel}, dans les 45 jours qui suivent la cessation`,
          "Le tribunal désigne un liquidateur judiciaire — vous lui remettez les informations sur vos biens et vos dettes",
          'Licenciement des éventuels salariés par le liquidateur ; leurs créances sont garanties par l\'AGS',
          "Réalisation de l'actif et répartition entre créanciers",
          'Clôture de la procédure — puis rebond personnel',
        ],
        alternatives: [
          ...(prpEnvisageable(r, c)
            ? ['Entrepreneur individuel sans salarié avec un actif de moins de 15 000 € : rétablissement professionnel (PRP, 4 mois — art. L645-1 et L645-4 C. com.)']
            : []),
          "Si un repreneur apparaît en dernière minute : plan de cession",
        ],
      };

    case 'rebondir': {
      const forme = getFormeDetail(c.formeJuridique);
      const labelForme =
        forme === 'micro' ? 'micro-entrepreneur'
        : forme === 'eirl' ? 'EIRL (statut figé depuis 2022 mais procédure ouverte)'
        : forme === 'ei' ? 'entrepreneur individuel (micro-entreprise comprise)'
        : 'entrepreneur';
      const pourquoi = [
        'La procédure dure 4 mois (art. L645-4 C. com.).',
        "Pas de liquidation de vos biens et vous gardez la gestion : un mandataire judiciaire aide le juge commis à recenser votre actif et vos dettes.",
        'Rien dans la procédure ne vous empêche de lancer une nouvelle activité après la clôture.',
      ];
      if (r.antecedents === 'oui') {
        pourquoi.push(
          "Vous avez déjà connu une procédure : le rétablissement professionnel est fermé si une liquidation clôturée pour insuffisance d'actif ou un rétablissement professionnel a été clôturé il y a moins de 5 ans (art. L645-2 C. com.). Un accompagnement au rebond (60 000 Rebonds : coach et parrain) aide aussi à ne pas répéter les mêmes pièges.",
        );
      }
      return {
        axe,
        score,
        titre: 'Rétablissement professionnel (PRP) puis rebond',
        verdict:
          `Vous êtes ${labelForme}, sans salarié et en cessation des paiements. Si votre actif est inférieur à 15 000 €, le rétablissement professionnel peut, en 4 mois et sans liquidation, aboutir à l'effacement de vos dettes nées avant la procédure et signalées au juge (sauf exceptions), pour vous permettre de repartir. C'est le tribunal qui décide.`,
        pourquoi,
        etapes: [
          "Vérifier l'éligibilité (art. L645-1, L645-2 et R645-1 C. com.) : personne physique, redressement manifestement impossible, activité arrêtée depuis moins d'un an (ou toujours en cours), aucun salarié au cours des 6 derniers mois, aucune instance prud'homale en cours, actif déclaré inférieur à 15 000 €, pas de liquidation clôturée pour insuffisance d'actif ni de rétablissement professionnel clôturé depuis moins de 5 ans",
          `Dépôt de la demande au ${juridictionLabel}`,
          "Le tribunal désigne un juge commis et un mandataire judiciaire, qui informe vos créanciers : signalez toutes vos dettes, seules celles portées à la connaissance du juge peuvent être effacées",
          "Clôture au bout de 4 mois : effacement des dettes antérieures signalées au juge, sauf notamment les créances des salarié·e·s, les pensions alimentaires et les condamnations pénales (art. L645-11 C. com.) ; si votre bonne foi est mise en cause, le tribunal peut ouvrir une liquidation à la place (art. L645-9)",
          "Rebond : accompagnement par l'association 60 000 Rebonds (coach et parrain, pour les entrepreneur·e·s ayant perdu leur entreprise depuis moins de 24 mois)",
        ],
        alternatives: [
          'Si votre actif dépasse 15 000 € ou si vous avez eu un salarié dans les 6 derniers mois : liquidation judiciaire (simplifiée selon la taille)',
          ...(forme === 'micro' || forme === 'ei'
            ? ["Arrêter simplement l'activité (déclaration de cessation dans les 30 jours sur le guichet des formalités des entreprises, formalites.entreprises.gouv.fr) n'efface aucune dette : cotisations, impôts et fournisseurs restent dus. Et après plus d'un an d'arrêt, le rétablissement professionnel n'est plus possible (art. L645-1 C. com.)."]
            : []),
        ],
      };
    }
  }
}

export interface StrategieResult {
  main: Strategie;
  secondary: Strategie | null;
  scores: Record<Axe, number>;
}

export function resolveStrategie(r: Reponses, c: CompanyData): StrategieResult | null {
  const scores = computeScores(r, c);
  const ranked = (Object.entries(scores) as [Axe, number][])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return null;
  return {
    main: buildStrategie(ranked[0][0], r, c, ranked[0][1]),
    secondary: ranked.length > 1 ? buildStrategie(ranked[1][0], r, c, ranked[1][1]) : null,
    scores,
  };
}

export const AXE_META: Record<Axe, { label: string; couleur: string; gradient: string; icone: string }> = {
  restructurer: { label: 'Restructurer', couleur: 'bleu', gradient: 'from-bleu/15 to-bleu-fonce/10', icone: '🔧' },
  sauvegarder: { label: 'Sauvegarder', couleur: 'vert', gradient: 'from-vert/15 to-vert/5', icone: '🛡️' },
  ceder: { label: 'Céder', couleur: 'jaune', gradient: 'from-jaune/20 to-jaune/5', icone: '🔑' },
  liquider: { label: 'Liquider proprement', couleur: 'navy', gradient: 'from-navy/15 to-navy/5', icone: '🔚' },
  rebondir: { label: 'Rebondir (PRP)', couleur: 'rouge', gradient: 'from-rouge/15 to-rouge/5', icone: '♻️' },
};
