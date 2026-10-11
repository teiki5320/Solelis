/**
 * Mapping NAF → OPCO (Opérateur de Compétences).
 *
 * Les OPCO financent l'apprentissage, le développement des compétences
 * dans les entreprises de moins de 50 salariés, la Pro-A… Identifier le
 * bon OPCO permet à un employeur en difficulté de mobiliser FNE-Formation,
 * POE, Pro-A.
 *
 * Sources : loi n° 2018-771 du 5 septembre 2018 (création des OPCO,
 * art. L6332-1 du Code du travail) ; décret n° 2018-1209 du 21 décembre
 * 2018 (agrément) ; arrêtés d'agrément du 29 mars 2019 (effet au 1er avril
 * 2019). Rattachement d'une entreprise : outil officiel de France
 * compétences https://quel-est-mon-opco.francecompetences.fr/ (par SIRET
 * ou IDCC). L'OPCO dépend de la convention collective (IDCC) appliquée,
 * PAS du code NAF : le mapping ci-dessous ne donne que l'OPCO le plus
 * fréquent pour un NAF (vérifié sur la répartition publiée par France
 * compétences, API « quel-est-mon-opco », octobre 2026).
 *
 * 11 OPCO : Afdas, AKTO, Atlas, Constructys, OCAPIAT, OPCO 2i, OPCO EP,
 * OPCO Mobilités, OPCO Santé, Uniformation (OPCO de la Cohésion sociale),
 * L'Opcommerce.
 */

export type Opco =
  | 'akto'
  | 'opco-ep'
  | 'opco-2i'
  | 'opco-construction'
  | 'opco-mobilites'
  | 'opco-sante'
  | 'opcommerce'
  | 'uniformation'
  | 'afdas'
  | 'atlas'
  | 'ocapiat'
  | 'autre';

export interface OpcoInfo {
  cle: Opco;
  nom: string;
  description: string;
  telephone?: string;
  site: string;
  secteursClefs: string;
}

export const OPCO_DATA: Record<Opco, OpcoInfo> = {
  'akto': {
    cle: 'akto',
    nom: 'AKTO',
    description: 'Services à forte intensité de main-d\'œuvre : hôtellerie-restauration, restauration rapide et collective, propreté, prévention-sécurité, travail temporaire, commerces de gros, organismes de formation, enseignement privé…',
    // Numéro unique (akto.fr, « Un numéro unique pour contacter AKTO »).
    telephone: '01 88 13 10 00',
    site: 'https://www.akto.fr',
    secteursClefs: 'HCR, propreté, sécurité, intérim, commerce de gros, formation',
  },
  'opco-ep': {
    cle: 'opco-ep',
    nom: 'OPCO EP — Entreprises de Proximité',
    description: 'Artisanat, commerce et professions libérales de proximité : coiffure, esthétique, fleuristes, boulangerie-pâtisserie artisanale, cabinets d\'avocats, notariat, cabinets médicaux et dentaires, pharmacie d\'officine, immobilier, architecture, services à la personne…',
    // opcoep.fr/contact (appel non surtaxé).
    telephone: '09 70 83 88 37',
    site: 'https://www.opcoep.fr',
    secteursClefs: 'artisanat, libéral, services proximité',
  },
  'opco-2i': {
    cle: 'opco-2i',
    nom: 'OPCO 2i — Interindustriel',
    description: 'Industrie : métallurgie, chimie, plasturgie, papier-carton, textile, ameublement, verre, céramique.',
    // opco2i.fr/vos-contacts : « Votre contact pour les Directions du Siège ».
    telephone: '0 805 69 03 57',
    site: 'https://www.opco2i.fr',
    secteursClefs: 'industrie, métallurgie, chimie',
  },
  'opco-construction': {
    cle: 'opco-construction',
    nom: 'Constructys — OPCO Construction',
    description: 'Bâtiment, travaux publics, négoce des matériaux de construction et du bois d\'œuvre.',
    // Numéro vert (constructys.fr/contact).
    telephone: '0 800 94 09 99',
    site: 'https://www.constructys.fr',
    secteursClefs: 'BTP, gros œuvre, second œuvre, TP',
  },
  'opco-mobilites': {
    cle: 'opco-mobilites',
    nom: 'OPCO Mobilités',
    description: 'Transports routier, urbain, ferroviaire, maritime et fluvial ; services de l\'automobile (garages, auto-écoles…) ; agences de voyages et de tourisme.',
    // Pas de numéro national publié sur opcomobilites.fr (contact par formulaire).
    site: 'https://www.opcomobilites.fr',
    secteursClefs: 'transport, taxi/VTC, automobile, tourisme',
  },
  'opco-sante': {
    cle: 'opco-sante',
    nom: 'OPCO Santé',
    description: 'Établissements sanitaires, sociaux et médico-sociaux privés : hospitalisation privée, cliniques, EHPAD, établissements à but non lucratif…',
    // opco-sante.fr/contact : « Nos conseillers sont à votre écoute au 04 13 68 00 15 ».
    telephone: '04 13 68 00 15',
    site: 'https://www.opco-sante.fr',
    secteursClefs: 'santé, médico-social',
  },
  'opcommerce': {
    cle: 'opcommerce',
    nom: "L'Opcommerce",
    description: 'Commerce de détail : grande distribution et commerce à prédominance alimentaire, bricolage, optique-lunetterie, succursales d\'habillement, négoce de l\'ameublement, photographie…',
    site: 'https://www.lopcommerce.com',
    secteursClefs: 'commerce de détail, distribution',
  },
  'uniformation': {
    cle: 'uniformation',
    nom: 'Uniformation — OPCO de la Cohésion sociale',
    description: "Économie sociale et solidaire : animation, centres sociaux, aide et soins à domicile, habitat social (HLM), mutualité, organismes de sécurité sociale, ateliers et chantiers d'insertion…",
    // uniformation.fr/entreprise/contacts : ligne « Employeur ».
    telephone: '09 69 32 79 79',
    site: 'https://www.uniformation.fr',
    secteursClefs: 'ESS, mutualité, habitat social, animation, aide à domicile, insertion, associations',
  },
  'afdas': {
    cle: 'afdas',
    nom: 'AFDAS',
    description: 'Culture, industries créatives, médias, publicité, télécommunications, sport, loisirs ; formation des intermittent·e·s du spectacle et des artistes-auteurs.',
    // afdas.com/nous-contacter.html.
    telephone: '01 44 78 39 39',
    site: 'https://www.afdas.com',
    secteursClefs: 'culture, audiovisuel, spectacle, presse, sport',
  },
  'atlas': {
    cle: 'atlas',
    nom: 'ATLAS',
    description: 'Services financiers et conseil : banque, assurance, expertise comptable, bureaux d\'études techniques, ingénierie, conseil et numérique (convention Syntec).',
    // opco-atlas.fr/contact : ligne « Entreprises ».
    telephone: '01 43 46 01 10',
    site: 'https://www.opco-atlas.fr',
    secteursClefs: 'banque, assurance, conseil, numérique, expertise comptable',
  },
  'ocapiat': {
    cle: 'ocapiat',
    nom: 'OCAPIAT',
    description: 'Agriculture, agroalimentaire, pêche, aquaculture, coopératives agricoles.',
    // ocapiat.fr/nous-contacter (appel non surtaxé).
    telephone: '09 70 84 51 18',
    site: 'https://www.ocapiat.fr',
    secteursClefs: 'agriculture, agroalimentaire, pêche',
  },
  'autre': {
    cle: 'autre',
    nom: 'OPCO non identifié',
    description: 'Votre branche n\'a pas été identifiée. Retrouvez votre OPCO avec votre SIRET ou votre IDCC sur l\'outil officiel de France compétences, ou demandez-le à votre expert-comptable.',
    site: 'https://quel-est-mon-opco.francecompetences.fr/',
    secteursClefs: 'divers',
  },
};

/**
 * Sous-classes NAF (rév. 2) dont l'OPCO majoritaire diffère des règles par
 * division ci-dessous. Source : répartition des établissements par OPCO
 * publiée par France compétences (API de l'outil officiel
 * quel-est-mon-opco.francecompetences.fr, « /public/opco/ape/{code} »,
 * consultée le 11 octobre 2026). Retenu quand l'OPCO majoritaire dépasse
 * 50 % des établissements du code, ou quand la règle par division en
 * couvre moins de 15 %. Administrations publiques (84.1, 84.2) et
 * organismes extraterritoriaux (99) exclus : pas d'OPCO pour l'emploi public.
 */
const OPCO_MAJORITAIRE_PAR_APE: Partial<Record<string, Opco>> = {
  // → afdas
  '1811Z': 'afdas', '1820Z': 'afdas', '5530Z': 'afdas', '6110Z': 'afdas', '6120Z': 'afdas',
  '6130Z': 'afdas', '6190Z': 'afdas', '6391Z': 'afdas', '6399Z': 'afdas', '7311Z': 'afdas',
  '7312Z': 'afdas', '7990Z': 'afdas', '8551Z': 'afdas',
  // → akto
  '0220Z': 'akto', '1200Z': 'akto', '1610A': 'akto', '1610B': 'akto', '1622Z': 'akto',
  '1624Z': 'akto', '1629Z': 'akto', '3291Z': 'akto', '3600Z': 'akto', '3811Z': 'akto',
  '3821Z': 'akto', '4531Z': 'akto', '4622Z': 'akto', '4624Z': 'akto', '4631Z': 'akto',
  '4632C': 'akto', '4633Z': 'akto', '4635Z': 'akto', '4636Z': 'akto', '4639A': 'akto',
  '4644Z': 'akto', '4649Z': 'akto', '4662Z': 'akto', '4669A': 'akto', '4669B': 'akto',
  '4669C': 'akto', '4673B': 'akto', '4674A': 'akto', '4674B': 'akto', '4711A': 'akto',
  '4799B': 'akto', '5110Z': 'akto', '5121Z': 'akto', '5223Z': 'akto', '8510Z': 'akto',
  '8520Z': 'akto', '8531Z': 'akto', '8532Z': 'akto', '8541Z': 'akto', '8542Z': 'akto',
  '8559A': 'akto', '8559B': 'akto', '8560Z': 'akto', '9491Z': 'akto', '9601A': 'akto',
  '9601B': 'akto',
  // → atlas
  '5821Z': 'atlas', '5829A': 'atlas', '5829B': 'atlas', '5829C': 'atlas', '5913B': 'atlas',
  '6201Z': 'atlas', '6202A': 'atlas', '6202B': 'atlas', '6203Z': 'atlas', '6209Z': 'atlas',
  '6311Z': 'atlas', '6312Z': 'atlas', '7022Z': 'atlas', '8230Z': 'atlas',
  // → ocapiat
  '0893Z': 'ocapiat', '1071A': 'ocapiat', '1071B': 'ocapiat', '4621Z': 'ocapiat',
  '4623Z': 'ocapiat', '4632A': 'ocapiat', '4632B': 'ocapiat', '4634Z': 'ocapiat',
  '7731Z': 'ocapiat', '7830Z': 'ocapiat', '8130Z': 'ocapiat', '9104Z': 'ocapiat',
  '9411Z': 'ocapiat', '9412Z': 'ocapiat',
  // → opco-2i
  '1041A': 'opco-2i', '1041B': 'opco-2i', '1062Z': 'opco-2i', '4329B': 'opco-2i',
  '4612A': 'opco-2i', '4612B': 'opco-2i', '4614Z': 'opco-2i', '4645Z': 'opco-2i',
  '4646Z': 'opco-2i', '4648Z': 'opco-2i', '4652Z': 'opco-2i', '4672Z': 'opco-2i',
  '4675Z': 'opco-2i', '4676Z': 'opco-2i', '4950Z': 'opco-2i', '5122Z': 'opco-2i',
  '6530Z': 'opco-2i', '7010Z': 'opco-2i', '7211Z': 'opco-2i', '7219Z': 'opco-2i',
  '7220Z': 'opco-2i', '7733Z': 'opco-2i', '7734Z': 'opco-2i', '8292Z': 'opco-2i',
  '9511Z': 'opco-2i', '9512Z': 'opco-2i', '9523Z': 'opco-2i', '9524Z': 'opco-2i',
  '9525Z': 'opco-2i', '9529Z': 'opco-2i',
  // → opco-construction
  '3900Z': 'opco-construction', '4673A': 'opco-construction',
  // → opco-ep
  '1013B': 'opco-ep', '1812Z': 'opco-ep', '1813Z': 'opco-ep', '1814Z': 'opco-ep',
  '2312Z': 'opco-ep', '3320B': 'opco-ep', '3700Z': 'opco-ep', '4110A': 'opco-ep',
  '4110B': 'opco-ep', '4110C': 'opco-ep', '4110D': 'opco-ep', '4638A': 'opco-ep',
  '4661Z': 'opco-ep', '4663Z': 'opco-ep', '4671Z': 'opco-ep', '4722Z': 'opco-ep',
  '4723Z': 'opco-ep', '4724Z': 'opco-ep', '4761Z': 'opco-ep', '4774Z': 'opco-ep',
  '4775Z': 'opco-ep', '4778B': 'opco-ep', '4939C': 'opco-ep', '5310Z': 'opco-ep',
  '6619A': 'opco-ep', '6621Z': 'opco-ep', '6910Z': 'opco-ep', '7111Z': 'opco-ep',
  '7729Z': 'opco-ep', '7732Z': 'opco-ep', '7739Z': 'opco-ep', '8110Z': 'opco-ep',
  '8129A': 'opco-ep', '8211Z': 'opco-ep', '8219Z': 'opco-ep', '8220Z': 'opco-ep',
  '8291Z': 'opco-ep', '8622A': 'opco-ep', '8622B': 'opco-ep', '8622C': 'opco-ep',
  '8623Z': 'opco-ep', '8690B': 'opco-ep', '8690F': 'opco-ep', '8891A': 'opco-ep',
  // → opco-mobilites
  '4677Z': 'opco-mobilites', '4730Z': 'opco-mobilites', '7120A': 'opco-mobilites',
  '7711A': 'opco-mobilites', '7711B': 'opco-mobilites', '7712Z': 'opco-mobilites',
  '8690A': 'opco-mobilites',
  // → opcommerce
  '5210A': 'opcommerce', '7420Z': 'opcommerce', '7721Z': 'opcommerce', '7722Z': 'opcommerce',
  '9521Z': 'opcommerce', '9522Z': 'opcommerce',
  // → uniformation
  '5590Z': 'uniformation', '6629Z': 'uniformation', '6820A': 'uniformation',
  '8810A': 'uniformation', '8899B': 'uniformation', '9101Z': 'uniformation',
  '8552Z': 'uniformation',
  // Organismes de sécurité sociale (84.30) : employeurs de droit privé,
  // convention des organismes de sécurité sociale → Uniformation.
  '8430A': 'uniformation', '8430B': 'uniformation', '8430C': 'uniformation',
};

/**
 * Retourne l'OPCO le plus probable pour un code NAF donné : l'OPCO
 * majoritaire publié par France compétences pour la sous-classe, sinon
 * une règle par division (2 premiers chiffres, affinée par classe).
 *
 * Indicatif : l'OPCO dépend de la convention collective (IDCC) appliquée,
 * pas du code NAF (une convention couvre des NAF variés, et un même NAF
 * relève parfois de plusieurs OPCO). Pour un cas limite, vérifier l'IDCC
 * sur le bulletin de paie et l'outil officiel quel-est-mon-opco.francecompetences.fr.
 */
export function getOpcoFromNaf(naf: string): OpcoInfo {
  const code = (naf || '').replace(/\./g, '').toUpperCase();
  const prefix2 = code.slice(0, 2);
  const prefix4 = code.slice(0, 4);

  const majoritaire = OPCO_MAJORITAIRE_PAR_APE[code];
  if (majoritaire) return OPCO_DATA[majoritaire];

  // ── Raffinements par classe (testés AVANT les règles par division) ──
  // Boulangerie-pâtisserie artisanale (10.71) : branche boulangerie → OPCO EP
  // (OCAPIAT ne vaut que pour l'industrie agroalimentaire).
  if (prefix4 === '1071') return OPCO_DATA['opco-ep'];
  // Pharmacie d'officine (47.73) : branche pharmacie → OPCO EP.
  if (prefix4 === '4773') return OPCO_DATA['opco-ep'];
  // Auto-écoles (85.53) : branche des services de l'automobile → OPCO Mobilités.
  if (prefix4 === '8553') return OPCO_DATA['opco-mobilites'];

  // Agriculture, pêche (section A)
  if (/^(01|02|03|10|11)/.test(prefix2)) return OPCO_DATA['ocapiat'];

  // BTP (section F) + génie civil
  if (/^(41|42|43)/.test(prefix2)) return OPCO_DATA['opco-construction'];

  // Industrie (sections B-E) : extraction (05-09), tabac (12),
  // manufacture (13-33), énergie (35), eau/déchets/dépollution (36-39)
  if (/^(05|06|07|08|09|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|35|36|37|38|39)/.test(prefix2)) {
    return OPCO_DATA['opco-2i'];
  }

  // Transport + automobile (section H + 45/96 services auto)
  if (/^(45|49|50|51|52|53|55)/.test(prefix2) && prefix2 !== '55') {
    return OPCO_DATA['opco-mobilites'];
  }

  // Commerce (section G hors auto) → L'Opcommerce par défaut ; une grande
  // partie du commerce de gros (AKTO, OPCO 2i, OCAPIAT) et le commerce
  // alimentaire spécialisé (OPCO EP) sont captés par la table ci-dessus.
  if (/^(46|47)/.test(prefix2)) {
    return OPCO_DATA['opcommerce'];
  }

  // Hôtellerie-restauration (section I)
  if (/^(55|56)/.test(prefix2)) return OPCO_DATA['akto'];

  // Information/communication, médias, IT (section J)
  if (/^(58|59|60|61|62|63)/.test(prefix2)) {
    // Édition, audiovisuel, télécommunications → AFDAS ; informatique
    // (convention Syntec) → ATLAS.
    if (/^(58|59|60|61)/.test(prefix2)) return OPCO_DATA['afdas'];
    return OPCO_DATA['atlas'];
  }

  // Finance, assurance, conseil (sections K, M)
  if (/^(64|65|66)/.test(prefix2)) return OPCO_DATA['atlas'];
  // Vétérinaires (75) : branche vétérinaire → OPCO EP
  if (prefix2 === '75') return OPCO_DATA['opco-ep'];
  if (/^(69|70|71|72|73|74)/.test(prefix2)) {
    // Avocats, notaires (69.10) et architectes (71.11) → OPCO EP (table
    // ci-dessus) ; experts-comptables, conseil, ingénierie → ATLAS.
    return OPCO_DATA['atlas'];
  }

  // Immobilier (section L)
  if (/^(68)/.test(prefix2)) return OPCO_DATA['opco-ep'];

  // Services administratifs et soutien (section N)
  if (/^(77|78|80|81|82)/.test(prefix2)) return OPCO_DATA['akto'];
  // Agences de voyage et tourisme (79) → OPCO Mobilités (branche tourisme)
  if (prefix2 === '79') return OPCO_DATA['opco-mobilites'];

  // Enseignement (section P) : enseignement privé et organismes de
  // formation → AKTO (sport et loisirs 85.51 → AFDAS, auto-écoles → Mobilités).
  if (/^(85)/.test(prefix2)) return OPCO_DATA['akto'];

  // Santé humaine et action sociale (section Q)
  if (/^(86|87|88)/.test(prefix2)) return OPCO_DATA['opco-sante'];

  // Arts, spectacles, sport (section R)
  if (/^(90|91|92|93)/.test(prefix2)) {
    if (/^(92|93)/.test(prefix2)) return OPCO_DATA['afdas']; // sport, jeux
    return OPCO_DATA['afdas'];
  }

  // Associations, organisations (94) → Uniformation (Cohésion sociale)
  if (prefix2 === '94') return OPCO_DATA['uniformation'];

  // Services aux ménages, artisans (section S)
  if (/^(95|96)/.test(prefix2)) return OPCO_DATA['opco-ep'];

  return OPCO_DATA['autre'];
}
