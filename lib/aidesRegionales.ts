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

const REGION_AIDES: Record<Region, AideRegionale[]> = {
  'auvergne-rhone-alpes': [
    {
      nom: 'Auvergne-Rhône-Alpes Entreprises',
      description: "Agence régionale d'accompagnement des entreprises. Diagnostic 360° et orientation vers les dispositifs régionaux.",
      site: 'https://www.auvergnerhonealpes-entreprises.fr',
      badge: 'Gratuit',
    },
    {
      nom: 'Prêt ARR — Aide au Rebond Régional',
      description: 'Prêt régional à taux 0 % pour les TPE/PME en difficulté (jusqu\'à 200 000 €).',
      site: 'https://www.auvergnerhonealpes.fr',
    },
  ],
  'bourgogne-franche-comte': [
    {
      nom: 'Agence Économique Régionale BFC',
      description: "Accompagnement des entreprises en difficulté via un réseau de conseillers territoriaux.",
      site: 'https://www.aer-bfc.com',
      badge: 'Gratuit',
    },
  ],
  'bretagne': [
    {
      nom: 'Bretagne Commerce International · Retournement',
      description: 'Cellule régionale dédiée aux entreprises en difficulté, orientée export.',
      site: 'https://www.bretagne.bzh',
      badge: 'Gratuit',
    },
    {
      nom: 'Prêt de sauvegarde économique',
      description: "Prêt à taux 0 % de la Région Bretagne pour les PME fragilisées (< 50 salariés).",
      site: 'https://www.bretagne.bzh',
    },
  ],
  'centre-val-de-loire': [
    {
      nom: 'Dev\'Up Centre-Val de Loire',
      description: "Agence de développement régionale. Aide au diagnostic et à la recherche de repreneurs.",
      site: 'https://devup-centrevaldeloire.fr',
      badge: 'Gratuit',
    },
  ],
  'corse': [
    {
      nom: 'ADEC · Agence de Développement Économique de la Corse',
      description: "Dispositifs d'aide au redressement et à la transmission adaptés à l'économie insulaire.",
      site: 'https://www.adec.corsica',
      badge: 'Gratuit',
    },
  ],
  'grand-est': [
    {
      nom: 'Business Act Grand Est',
      description: "Plan régional d'accompagnement à la relance, incluant des dispositifs de retournement.",
      site: 'https://www.grandest.fr',
    },
    {
      nom: 'Prêt Rebond Grand Est',
      description: 'Prêt sans garantie jusqu\'à 300 000 € pour les entreprises en situation de fragilité.',
      site: 'https://www.grandest.fr',
    },
  ],
  'hauts-de-france': [
    {
      nom: 'Hauts-de-France Relance',
      description: "Plan régional coordonnant BPI, Région et CCI pour les entreprises en difficulté.",
      site: 'https://www.hautsdefrance.fr',
      badge: 'Gratuit',
    },
    {
      nom: 'Fonds Régional de Garantie HdF',
      description: "Garantie régionale pouvant se cumuler à celle de Bpifrance pour les prêts bancaires.",
      site: 'https://www.hautsdefrance.fr',
    },
  ],
  'ile-de-france': [
    {
      nom: 'PM\'up Entreprises en difficulté · Région Île-de-France',
      description: "Accompagnement et cofinancement pour TPE/PME franciliennes en retournement.",
      site: 'https://www.iledefrance.fr',
      badge: 'Gratuit',
    },
    {
      nom: 'Back\'up Prévention',
      description: "Dispositif régional de prévention et retournement piloté avec le CODEFI et la CCI Paris IDF.",
      site: 'https://www.iledefrance.fr',
    },
  ],
  'normandie': [
    {
      nom: 'ADN (Agence de Développement Normandie) · Cellule retournement',
      description: "Diagnostic rapide et mise en relation avec les dispositifs régionaux et nationaux.",
      site: 'https://www.adnormandie.fr',
      badge: 'Gratuit',
    },
  ],
  'nouvelle-aquitaine': [
    {
      nom: 'ADI Nouvelle-Aquitaine · Cellule Retournement',
      description: "Cellule dédiée aux entreprises en difficulté : diagnostic, plan d'action, médiation.",
      site: 'https://www.adi-na.fr',
      badge: 'Gratuit',
    },
    {
      nom: 'Prêt Nouvelle-Aquitaine Rebond',
      description: "Prêt sans garantie jusqu'à 200 000 € pour les PME fragilisées (durée 7 ans, différé 2 ans).",
      site: 'https://entreprises.nouvelle-aquitaine.fr',
    },
  ],
  'occitanie': [
    {
      nom: 'AD\'OCC · Transformation & Retournement',
      description: "Agence régionale. Diagnostic flash gratuit, orientation vers financements et experts.",
      site: 'https://www.agence-adocc.com',
      badge: 'Gratuit',
    },
    {
      nom: 'Occitanie Pass Rebond',
      description: "Prêt à taux bonifié pour entreprises en retournement, pouvant atteindre 300 000 €.",
      site: 'https://www.laregion.fr',
    },
  ],
  'pays-de-la-loire': [
    {
      nom: 'Pays de la Loire Redéploiement',
      description: "Dispositif régional de soutien aux entreprises en cours de restructuration.",
      site: 'https://www.paysdelaloire.fr',
    },
  ],
  'provence-alpes-cote-dazur': [
    {
      nom: 'Rising SUD · Cellule de retournement',
      description: "Agence de développement économique de la Région Sud. Appui au redressement et à la cession.",
      site: 'https://risingsud.fr',
      badge: 'Gratuit',
    },
    {
      nom: 'Prêt Région Sud Rebond',
      description: "Prêt sans garantie jusqu'à 300 000 € pour TPE/PME en difficulté.",
      site: 'https://www.maregionsud.fr',
    },
  ],
  'outre-mer': [
    {
      nom: 'AFD Outre-mer · Soutien aux entreprises',
      description: "Dispositifs spécifiques Outre-mer : défiscalisation, prêts, garanties.",
      site: 'https://www.afd.fr',
    },
    {
      nom: 'Bpifrance Outre-mer',
      description: "Financements dédiés aux entreprises ultramarines en difficulté (prêt Outre-mer, garanties).",
      site: 'https://bpifrance.fr',
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
