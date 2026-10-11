export type Region =
  | 'auvergne-rhone-alpes'
  | 'bourgogne-franche-comte'
  | 'bretagne'
  | 'centre-val-de-loire'
  | 'corse'
  | 'grand-est'
  | 'hauts-de-france'
  | 'ile-de-france'
  | 'normandie'
  | 'nouvelle-aquitaine'
  | 'occitanie'
  | 'pays-de-la-loire'
  | 'provence-alpes-cote-dazur'
  | 'outre-mer';

export interface AideRegionale {
  nom: string;
  description: string;
  site?: string;
  telephone?: string;
  badge?: string;
}

export interface RegionInfo {
  code: Region;
  label: string;
  aides: AideRegionale[];
}

const DEP_TO_REGION: Record<string, Region> = {
  // Auvergne-Rhône-Alpes
  '01': 'auvergne-rhone-alpes', '03': 'auvergne-rhone-alpes', '07': 'auvergne-rhone-alpes',
  '15': 'auvergne-rhone-alpes', '26': 'auvergne-rhone-alpes', '38': 'auvergne-rhone-alpes',
  '42': 'auvergne-rhone-alpes', '43': 'auvergne-rhone-alpes', '63': 'auvergne-rhone-alpes',
  '69': 'auvergne-rhone-alpes', '73': 'auvergne-rhone-alpes', '74': 'auvergne-rhone-alpes',
  // Bourgogne-Franche-Comté
  '21': 'bourgogne-franche-comte', '25': 'bourgogne-franche-comte', '39': 'bourgogne-franche-comte',
  '58': 'bourgogne-franche-comte', '70': 'bourgogne-franche-comte', '71': 'bourgogne-franche-comte',
  '89': 'bourgogne-franche-comte', '90': 'bourgogne-franche-comte',
  // Bretagne
  '22': 'bretagne', '29': 'bretagne', '35': 'bretagne', '56': 'bretagne',
  // Centre-Val de Loire
  '18': 'centre-val-de-loire', '28': 'centre-val-de-loire', '36': 'centre-val-de-loire',
  '37': 'centre-val-de-loire', '41': 'centre-val-de-loire', '45': 'centre-val-de-loire',
  // Corse
  '2A': 'corse', '2B': 'corse',
  // Grand Est
  '08': 'grand-est', '10': 'grand-est', '51': 'grand-est', '52': 'grand-est',
  '54': 'grand-est', '55': 'grand-est', '57': 'grand-est', '67': 'grand-est',
  '68': 'grand-est', '88': 'grand-est',
  // Hauts-de-France
  '02': 'hauts-de-france', '59': 'hauts-de-france', '60': 'hauts-de-france',
  '62': 'hauts-de-france', '80': 'hauts-de-france',
  // Île-de-France
  '75': 'ile-de-france', '77': 'ile-de-france', '78': 'ile-de-france',
  '91': 'ile-de-france', '92': 'ile-de-france', '93': 'ile-de-france',
  '94': 'ile-de-france', '95': 'ile-de-france',
  // Normandie
  '14': 'normandie', '27': 'normandie', '50': 'normandie', '61': 'normandie', '76': 'normandie',
  // Nouvelle-Aquitaine
  '16': 'nouvelle-aquitaine', '17': 'nouvelle-aquitaine', '19': 'nouvelle-aquitaine',
  '23': 'nouvelle-aquitaine', '24': 'nouvelle-aquitaine', '33': 'nouvelle-aquitaine',
  '40': 'nouvelle-aquitaine', '47': 'nouvelle-aquitaine', '64': 'nouvelle-aquitaine',
  '79': 'nouvelle-aquitaine', '86': 'nouvelle-aquitaine', '87': 'nouvelle-aquitaine',
  // Occitanie
  '09': 'occitanie', '11': 'occitanie', '12': 'occitanie', '30': 'occitanie',
  '31': 'occitanie', '32': 'occitanie', '34': 'occitanie', '46': 'occitanie',
  '48': 'occitanie', '65': 'occitanie', '66': 'occitanie', '81': 'occitanie', '82': 'occitanie',
  // Pays de la Loire
  '44': 'pays-de-la-loire', '49': 'pays-de-la-loire', '53': 'pays-de-la-loire',
  '72': 'pays-de-la-loire', '85': 'pays-de-la-loire',
  // Provence-Alpes-Côte d'Azur
  '04': 'provence-alpes-cote-dazur', '05': 'provence-alpes-cote-dazur',
  '06': 'provence-alpes-cote-dazur', '13': 'provence-alpes-cote-dazur',
  '83': 'provence-alpes-cote-dazur', '84': 'provence-alpes-cote-dazur',
  // Outre-mer
  '971': 'outre-mer', '972': 'outre-mer', '973': 'outre-mer',
  '974': 'outre-mer', '976': 'outre-mer',
};

const REGION_LABELS: Record<Region, string> = {
  'auvergne-rhone-alpes': 'Auvergne-Rhône-Alpes',
  'bourgogne-franche-comte': 'Bourgogne-Franche-Comté',
  'bretagne': 'Bretagne',
  'centre-val-de-loire': 'Centre-Val de Loire',
  'corse': 'Corse',
  'grand-est': 'Grand Est',
  'hauts-de-france': 'Hauts-de-France',
  'ile-de-france': 'Île-de-France',
  'normandie': 'Normandie',
  'nouvelle-aquitaine': 'Nouvelle-Aquitaine',
  'occitanie': 'Occitanie',
  'pays-de-la-loire': 'Pays de la Loire',
  'provence-alpes-cote-dazur': 'Provence-Alpes-Côte d\'Azur',
  'outre-mer': 'Outre-mer',
};

// Vérification du 11 octobre 2026 : beaucoup de « prêts Rebond » régionaux
// étaient des produits de la période Covid, aujourd'hui fermés. On ne garde
// un montant que s'il figure sur une page officielle de la Région ; sinon,
// on oriente vers l'agence ou le service économique régional.
const REGION_AIDES: Record<Region, AideRegionale[]> = {
  'auvergne-rhone-alpes': [
    {
      nom: 'Auvergne-Rhône-Alpes Entreprises',
      description: "Agence régionale d'accompagnement des entreprises : diagnostic préalable et orientation vers les aides régionales (soutien de trésorerie, garantie) pour entreprises fragilisées.",
      site: 'https://www.auvergnerhonealpes-entreprises.fr',
    },
  ],
  'bourgogne-franche-comte': [
    {
      nom: 'Agence Économique Régionale BFC',
      description: "Accompagnement des entreprises par un réseau de conseillers territoriaux ; la Région propose aussi des avances remboursables pour PME fragilisées (se renseigner auprès d'elle).",
      site: 'https://www.aer-bfc.com',
    },
  ],
  'bretagne': [
    {
      nom: 'Région Bretagne · Développement économique',
      description: 'Prêts et garanties régionaux pour entreprises fragilisées : se renseigner auprès de la Région ou de Bpifrance Bretagne.',
      site: 'https://www.bretagne.bzh',
    },
  ],
  'centre-val-de-loire': [
    {
      nom: 'Dev\'Up Centre-Val de Loire',
      description: "Agence de développement régionale : orientation des dirigeant·e·s et appui à la reprise d'entreprise.",
      site: 'https://devup-centrevaldeloire.fr',
    },
  ],
  'corse': [
    {
      nom: 'ADEC · Agence de Développement Économique de la Corse',
      description: "Dispositifs régionaux de soutien aux entreprises en difficulté (restructuration, aide aux procédures amiables) et à la transmission.",
      site: 'https://www.adec.corsica',
    },
  ],
  'grand-est': [
    {
      nom: 'Prêt Rebond Grand Est',
      description: "Prêt régional sans garantie (avec Bpifrance) pour PME confrontées à une fragilité passagère, sous conditions (ancienneté, cofinancement bancaire) ; ne concerne pas les entreprises déjà « en difficulté » au sens européen ni les entreprises individuelles.",
      site: 'https://www.grandest.fr/vos-aides-regionales/pret-rebond-grand-est/',
    },
  ],
  'hauts-de-france': [
    {
      nom: 'Hauts-de-France Prévention',
      description: "Dispositif de la Région et des CCI pour entreprises en tension de trésorerie (avance remboursable sous conditions) ; exclut les entreprises déjà en procédure collective : se renseigner auprès de la CCI ou de la Région.",
      site: 'https://www.hautsdefrance.fr',
    },
  ],
  'ile-de-france': [
    {
      nom: 'Chèque prévention · Région Île-de-France',
      description: "Prise en charge d'une partie des frais d'un mandat ad hoc ou d'une conciliation ayant abouti à un accord, pour TPE/PME franciliennes (sous conditions).",
      site: 'https://www.iledefrance.fr/aides-et-appels-a-projets/cheque-prevention',
    },
  ],
  'normandie': [
    {
      nom: 'AD Normandie',
      description: "Agence de développement de la Région : aides pour entreprises fragilisées (conseil, reprise) et orientation vers les dispositifs régionaux.",
      site: 'https://www.adnormandie.fr',
    },
  ],
  'nouvelle-aquitaine': [
    {
      nom: 'Région Nouvelle-Aquitaine · Entreprises en difficulté',
      description: "Service régional dédié aux entreprises en difficulté : aide au conseil et prêts de restructuration financière, sous conditions.",
      site: 'https://entreprises.nouvelle-aquitaine.fr',
    },
  ],
  'occitanie': [
    {
      nom: 'AD\'OCC',
      description: "Agence régionale de développement économique : conseil, orientation et accompagnement des dirigeant·e·s en difficulté.",
      site: 'https://www.agence-adocc.com',
    },
  ],
  'pays-de-la-loire': [
    {
      nom: 'Région Pays de la Loire',
      description: "Prêts régionaux et groupement de prévention agréé soutenu par la Région : se renseigner auprès du service économique régional.",
      site: 'https://www.paysdelaloire.fr',
    },
  ],
  'provence-alpes-cote-dazur': [
    {
      nom: 'Région Sud · Économie',
      description: "Aides régionales au rebond (subvention ou avance remboursable selon les dispositifs en vigueur) : se renseigner auprès de la Région.",
      site: 'https://www.maregionsud.fr',
    },
  ],
  'outre-mer': [
    {
      nom: 'Bpifrance (directions ultramarines)',
      description: "Prêts et garanties pour entreprises ultramarines (directions Antilles-Guyane et Réunion-Mayotte).",
      site: 'https://www.bpifrance.fr',
    },
  ],
};

export function getRegionFromDepartement(dep: string): Region | null {
  if (!dep) return null;
  const normalized = dep.trim().toUpperCase();
  return DEP_TO_REGION[normalized] ?? null;
}

export function getAidesRegionales(dep: string): RegionInfo | null {
  const region = getRegionFromDepartement(dep);
  if (!region) return null;
  return {
    code: region,
    label: REGION_LABELS[region],
    aides: REGION_AIDES[region] ?? [],
  };
}
