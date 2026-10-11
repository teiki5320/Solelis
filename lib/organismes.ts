import data from '@/data/organismes.json';
import type { Reponses } from './types';
import type { SectorInfo, Secteur } from './secteur';
import { trancheDepuisLibelle } from './secteur';

interface OrganismeLocal {
  nom: string;
  type: string;
  telephone?: string;
  /** Mention à afficher à côté d'un numéro non gratuit ou surtaxé. */
  telephoneNote?: string;
  adresse?: string;
  site?: string;
}

/**
 * Juridiction commerciale avec son ressort, quand le département en compte
 * plusieurs : codes postaux propres aux communes du ressort (`codesPostaux`)
 * et, pour un code postal partagé entre plusieurs communes, clés
 * « code postal|COMMUNE » (`communes`, noms normalisés par normaliserCommune).
 */
type TribunalAvecRessort = OrganismeLocal & { codesPostaux?: string[]; communes?: string[] };

export interface DepartementData {
  code: string;
  nom: string;
  chefLieu: string;
  /**
   * Juridiction du chef-lieu. Si elle porte `codesPostaux`, le département
   * compte plusieurs juridictions commerciales et elle ne couvre que ce
   * ressort ; sinon elle couvre tout le département hors tribunaux secondaires.
   */
  tribunal: TribunalAvecRessort;
  /**
   * Autres juridictions commerciales du département, avec leur ressort
   * (ex. tribunal mixte de commerce de Saint-Pierre, 974 ; tribunal de
   * commerce de Bayonne, 64 ; tribunal de commerce de Saint-Malo pour Dinan, 22).
   * Sources : « Données géocodées des structures de la Justice » et « Liste des
   * juridictions compétentes pour les communes » (ministère de la Justice,
   * data.gouv.fr, 2026), communes rattachées à chaque tribunal de commerce ou
   * TAE dans l'annuaire officiel (lannuaire.service-public.gouv.fr), base
   * officielle des codes postaux (La Poste).
   */
  tribunauxSecondaires?: (TribunalAvecRessort & { codesPostaux: string[] })[];
  cci: OrganismeLocal;
  urssaf: OrganismeLocal;
  sie: OrganismeLocal;
  mandataires?: OrganismeLocal[];
  banqueDeFrance?: OrganismeLocal;
  dreets?: OrganismeLocal;
  ddfip?: OrganismeLocal;
  cma?: OrganismeLocal;
  chambreAgriculture?: OrganismeLocal;
  prefecture?: OrganismeLocal;
  pointJustice?: OrganismeLocal;
  carsat?: OrganismeLocal;
  conciliateur?: OrganismeLocal;
}

const DATA = data as Record<string, DepartementData>;

export function getDepartement(code: string): DepartementData | null {
  return DATA[code] ?? null;
}

export interface ContactCotisations {
  /** Organisme, ex. « URSSAF », « CGSS La Réunion », « MSA (Mutualité Sociale Agricole) ». */
  org: string;
  /** Avec son article : « l'URSSAF », « la CGSS La Réunion », « votre caisse de MSA »… */
  orgAvecArticle: string;
  /** Numéro à composer, ou null (MSA : pas de numéro national). */
  tel: string | null;
  /** Ce qu'on affiche à la place du numéro : le numéro, ou « numéro de votre caisse sur msa.fr ». */
  telLibelle: string;
  telephoneNote?: string;
  site: string;
  /** « URSSAF (3698) », « CGSS La Réunion (3957) », « MSA (numéro de votre caisse sur msa.fr) ». */
  libelle: string;
}

/**
 * Organisme de recouvrement des cotisations et numéro à appeler, seule
 * source pour toute la fiche (plan d'action, checklist, mode perdu, aides…) :
 * - outre-mer : la caisse locale (CGSS, CSSM Mayotte, CPS, CAFAT…) ;
 * - exploitant·e agricole : la MSA (pas de numéro national : msa.fr) ;
 * - marin-pêcheur : l'ENIM ;
 * - sinon l'Urssaf : 36 98 pour les travailleurs indépendants, 39 57 pour
 *   les employeurs (urssaf.fr, « Contacter l'Urssaf »).
 */
export function contactCotisations(
  sector: Pick<SectorInfo, 'secteur' | 'cotisationOrg' | 'cotisationTel' | 'cotisationSite'>,
  effectif: Reponses['effectif'],
  departement?: string,
): ContactCotisations {
  const fabrique = (org: string, tel: string | null, telLibelle: string, site: string, telephoneNote?: string): ContactCotisations => ({
    org,
    orgAvecArticle: /^(URSSAF|ENIM)/.test(org) ? `l'${org}` : /^MSA/.test(org) ? 'votre caisse de MSA' : `la ${org}`,
    tel,
    telLibelle,
    telephoneNote,
    site,
    libelle: `${org} (${telLibelle})`,
  });
  if (sector.secteur === 'peche') {
    return fabrique(sector.cotisationOrg, sector.cotisationTel, sector.cotisationTel, sector.cotisationSite);
  }
  const dep = departement ? DATA[departement] : undefined;
  if (dep?.urssaf && /^9[78]/.test(departement ?? '')) {
    // CGSS : 39 57 pour les employeurs, 36 98 pour les indépendant·e·s
    // (cgss-martinique.fr, « Urssaf employeurs » / « Urssaf indépendants »).
    const brut = dep.urssaf.telephone ?? null;
    const tel = effectif === 'independant' && brut?.replace(/\s/g, '') === '3957' ? '3698' : brut;
    return fabrique(dep.urssaf.nom, tel, tel ?? 'coordonnées sur le site de la caisse', dep.urssaf.site ?? 'https://www.urssaf.fr', dep.urssaf.telephoneNote);
  }
  if (sector.secteur === 'agriculture') {
    return fabrique('MSA (Mutualité Sociale Agricole)', null, 'numéro de votre caisse sur msa.fr', 'https://www.msa.fr');
  }
  // Le numéro et l'échelonnement concernent l'Urssaf seule : les caisses du
  // secteur (BTP, retraite des libéraux…) ne se joignent pas au 39 57.
  const tel = effectif === 'independant' ? '3698' : '3957';
  return fabrique('URSSAF', tel, tel, 'https://www.urssaf.fr');
}

/**
 * Institution qui assure la médiation du crédit et le correspondant TPE-PME :
 * la Banque de France en métropole, l'IEDOM dans les départements d'outre-mer,
 * à Saint-Pierre-et-Miquelon, Saint-Barthélemy et Saint-Martin, l'IEOM dans
 * le Pacifique (iedom.fr, ieom.fr). Téléphone : 34 14 (annuaire service-public,
 * y compris pour les agences de l'IEOM). Le « correspondant TPE-PME » est un
 * dispositif de la Banque de France et de l'IEDOM ; l'IEOM présente son offre
 * comme un « accompagnement des entreprises » (ieom.fr/Entreprises).
 */
export function institutionEmission(departement?: string): {
  nom: 'Banque de France' | 'IEDOM' | 'IEOM';
  /** « la Banque de France », « l'IEDOM », « l'IEOM ». */
  avecArticle: string;
  telephone: string;
  /** Site de l'institution (accompagnement des entreprises). */
  site: string;
  /** « Correspondant TPE-PME » (Banque de France, IEDOM) ou « Accompagnement des entreprises » (IEOM). */
  accompagnement: string;
} {
  const code = departement ?? '';
  const tel = DATA[code]?.banqueDeFrance?.telephone;
  if (/^97[1-8]$/.test(code)) return { nom: 'IEDOM', avecArticle: "l'IEDOM", telephone: tel ?? '34 14', site: 'https://www.iedom.fr', accompagnement: 'Correspondant TPE-PME' };
  if (/^98[678]$/.test(code)) return { nom: 'IEOM', avecArticle: "l'IEOM", telephone: tel ?? '34 14', site: 'https://www.ieom.fr/Entreprises', accompagnement: 'Accompagnement des entreprises' };
  return { nom: 'Banque de France', avecArticle: 'la Banque de France', telephone: '34 14', site: 'https://entreprises.banque-france.fr', accompagnement: 'Correspondant TPE-PME' };
}

/** Nom de commune comparable à la base officielle des codes postaux (« ST QUENTIN »). */
export function normaliserCommune(ville: string): string {
  return ville
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim()
    .replace(/\bSAINTE\b/g, 'STE')
    .replace(/\bSAINT\b/g, 'ST');
}

function sansRessort(t: OrganismeLocal): OrganismeLocal {
  return {
    nom: t.nom,
    type: t.type,
    telephone: t.telephone,
    telephoneNote: t.telephoneNote,
    adresse: t.adresse,
    site: t.site,
  };
}

/**
 * Tribunal du département dont dépend l'entreprise, d'après son code postal
 * (et sa commune quand le code postal est partagé) :
 * - tribunal secondaire si l'adresse est dans son ressort ;
 * - département à une seule juridiction : le tribunal principal ;
 * - département à plusieurs juridictions et ressort non déterminé : carte
 *   générique « … dont dépend votre siège », avec la liste des juridictions
 *   du département (jamais un tribunal possiblement faux).
 */
export function tribunalSelonCodePostal(dep: DepartementData, codePostal?: string, ville?: string): OrganismeLocal {
  const cp = (codePostal ?? '').trim();
  const cle = cp && ville ? `${cp}|${normaliserCommune(ville)}` : '';
  const couvre = (t: TribunalAvecRessort) =>
    !!cp && ((t.codesPostaux ?? []).includes(cp) || (!!cle && (t.communes ?? []).includes(cle)));
  const secondaire = dep.tribunauxSecondaires?.find(couvre);
  if (secondaire) return sansRessort(secondaire);
  if (!dep.tribunal.codesPostaux || couvre(dep.tribunal)) return sansRessort(dep.tribunal);
  const tous = [dep.tribunal, ...(dep.tribunauxSecondaires ?? [])];
  const alsaceMoselle = tous.every((t) => /chambre commerciale/i.test(t.type));
  const avecTae = tous.some((t) => /activit[ée]s [ée]conomiques/i.test(t.type));
  const liste = tous
    .map((t) => t.nom.replace(/\s+-\s+Chambre commerciale$/i, ''))
    .join(', ');
  if (alsaceMoselle) {
    return {
      nom: 'Chambre commerciale du tribunal judiciaire dont dépend votre siège',
      type: 'Chambre commerciale du tribunal judiciaire',
      adresse: `Dans le département : ${liste}`,
      site: 'https://www.justice.fr/recherche/annuaires',
    };
  }
  return {
    nom: avecTae
      ? 'Tribunal de commerce ou des activités économiques dont dépend votre siège'
      : 'Tribunal de commerce dont dépend votre siège',
    type: avecTae ? 'Tribunal de commerce ou tribunal des activités économiques' : 'Tribunal de commerce',
    adresse: `Dans le département : ${liste}`,
    site: 'https://www.justice.fr/recherche/annuaires',
  };
}

export interface OrganismeCard {
  nom: string;
  type: string;
  telephone?: string;
  /** Ex. « Numéro non gratuit (service payant + prix d'un appel) ». */
  telephoneNote?: string;
  adresse?: string;
  site?: string;
  badge?: string;
  note?: number;
  avis?: number;
  mapsUrl?: string;
}

export interface GroupeOrganismes {
  cle: string;
  titre: string;
  couleur: string;
  icone: string;
  cartes: OrganismeCard[];
}

/**
 * CIRI (> 400 salariés) ou CODEFI (< 400 salariés) selon la tranche
 * d'effectif INSEE (libellé de CompanyData.effectif). La tranche
 * « 250 à 499 salariés » chevauche le seuil : les deux sont proposés.
 * Effectif inconnu → CODEFI (cas de loin le plus fréquent).
 */
export function orientationRestructuration(
  effectifInsee: string | undefined,
): 'ciri' | 'codefi' | 'les-deux' {
  const tranche = trancheDepuisLibelle(effectifInsee ?? '');
  if (!tranche) return 'codefi';
  if (tranche.min > 400) return 'ciri';
  if (tranche.max !== null && tranche.max < 400) return 'codefi';
  return 'les-deux';
}

/**
 * Carte « tribunal » de la fiche, avec le libellé réel de la juridiction du
 * département (tribunal de commerce, tribunal des activités économiques,
 * chambre commerciale du tribunal judiciaire, tribunal mixte de commerce).
 * Pour un débiteur relevant du tribunal judiciaire (art. L621-2 C. com. :
 * activité ni commerciale ni artisanale), le tribunal de commerce du
 * département n'est pas compétent : on oriente vers le tribunal judiciaire,
 * sauf dans les tribunaux des activités économiques expérimentaux, qui
 * reçoivent aussi les professions libérales (hors
 * professions du droit : avocats, notaires, commissaires de justice…).
 */
export function carteTribunal(
  tribunal: OrganismeLocal,
  juridiction?: 'TC' | 'TJ',
): OrganismeCard | null {
  const carteLocale: OrganismeCard = {
    nom: tribunal.nom,
    type: tribunal.type || 'Tribunal de commerce',
    telephone: tribunal.telephone,
    telephoneNote: tribunal.telephoneNote,
    adresse: tribunal.adresse,
    site: tribunal.site,
  };
  if (juridiction !== 'TJ') return carteLocale;
  // Département à TAE et tribunaux de commerce, ressort non déterminé : TAE
  // (compétent pour tous les débiteurs) ou tribunal judiciaire.
  if (/ ou tribunal des activit/i.test(tribunal.type)) {
    return {
      nom: 'Tribunal judiciaire ou tribunal des activités économiques dont dépend votre siège',
      type: 'Tribunal judiciaire ou tribunal des activités économiques',
      adresse: tribunal.adresse,
      site: 'https://www.justice.fr/recherche/annuaires',
      badge: 'Art. L621-2 C. com.',
    };
  }
  if (/activit[ée]s [ée]conomiques/i.test(tribunal.type)) {
    return { ...carteLocale, badge: 'Sauf professions du droit (tribunal judiciaire)' };
  }
  if (/tribunal judiciaire/i.test(tribunal.type)) return carteLocale;
  // Saint-Pierre-et-Miquelon (C. com. L910-2) et Wallis-et-Futuna : pas de
  // tribunal judiciaire, le tribunal de première instance en tient lieu.
  if (/premi[èe]re instance/i.test(tribunal.type)) {
    return {
      ...carteLocale,
      nom: tribunal.nom.replace(/\s*\(comp[ée]tence commerciale\)\s*$/i, ''),
      type: 'Tribunal de première instance',
    };
  }
  return {
    nom: 'Tribunal judiciaire de votre ressort',
    type: 'Tribunal judiciaire · activité ni commerciale ni artisanale',
    site: 'https://www.justice.fr',
    badge: 'Art. L621-2 C. com.',
  };
}

export function buildOrganismes(
  dep: DepartementData | null,
  reponses: Reponses,
  avocats: OrganismeCard[],
  sectorKey?: string,
  /** CompanyData.effectif (tranche INSEE), pour orienter vers le CIRI ou le CODEFI. */
  effectifInsee?: string,
  /** Résultat de getJuridiction(company) : tribunal de commerce ou judiciaire. */
  juridiction?: 'TC' | 'TJ',
): GroupeOrganismes[] {
  const groups: GroupeOrganismes[] = [];
  // Urssaf : 36 98 pour les travailleurs indépendants, 39 57 pour les
  // employeurs (urssaf.fr, rubrique « Contacter l'Urssaf »).
  const telUrssaf = (tel?: string): string => {
    const brut = (tel ?? '').replace(/\s/g, '');
    if (reponses.effectif === 'independant' && (!brut || brut === '3957')) return '3698';
    return tel ?? '3957';
  };

  // Conseil juridique (violet)
  // La recherche d'avocats (Google Places, à proximité) ne garantit pas la
  // spécialité « entreprises en difficulté » : étiquette neutre.
  const juridique: OrganismeCard[] = avocats.map((a) =>
    /^avocat/i.test(a.type) ? { ...a, type: 'Avocat à proximité' } : a,
  );
  juridique.push({
    nom: 'CIP · Centre d\'information sur la prévention',
    type: 'Entretien avec un ancien juge, un avocat et un expert-comptable',
    site: 'https://www.cip-national.fr',
    badge: 'Gratuit · confidentiel',
  });
  if (reponses.probleme === 'banque' || reponses.probleme === 'fournisseurs') {
    juridique.push({
      nom: 'Notaire',
      type: 'Protection du patrimoine',
      site: 'https://www.notaires.fr',
      badge: 'Si patrimoine concerné',
    });
  }
  groups.push({
    cle: 'juridique',
    titre: 'Conseil juridique',
    couleur: 'violet',
    icone: '⚖️',
    cartes: juridique,
  });

  // Institutionnel (rouge)
  const inst: OrganismeCard[] = [];
  if (dep?.tribunal) {
    const carte = carteTribunal(dep.tribunal, juridiction);
    if (carte) inst.push(carte);
  }
  if (dep?.cci) {
    inst.push({
      nom: dep.cci.nom,
      type: 'CCI',
      telephone: dep.cci.telephone,
      telephoneNote: dep.cci.telephoneNote,
      adresse: dep.cci.adresse,
      site: dep.cci.site,
      badge: 'Accompagnement gratuit',
    });
  }
  // Chambre d'agriculture départementale (CDA) — pour les exploitants agricoles
  // et la pêche (CDA Mayotte couvre aussi pêche/aquaculture).
  if ((sectorKey === 'agriculture' || sectorKey === 'peche') && dep?.chambreAgriculture) {
    inst.push({
      nom: dep.chambreAgriculture.nom,
      type: 'Chambre d\'agriculture',
      telephone: dep.chambreAgriculture.telephone,
      adresse: dep.chambreAgriculture.adresse,
      site: dep.chambreAgriculture.site,
      badge: 'Diagnostic gratuit',
    });
  }
  if (reponses.situation === 'redressement' || reponses.situation === 'assignation') {
    inst.push({
      nom: 'CNAJMJ · Mandataires judiciaires',
      type: 'Annuaire national',
      site: 'https://www.cnajmj.fr',
      badge: 'Mandataires agréés',
    });
  }
  // Conseillers-Entreprises : guichet unique pour les dirigeants en difficulté.
  // Pas de numéro : la demande se fait en ligne, un·e conseiller·ère rappelle.
  // (L'ancien 0 806 000 245 était la ligne DGFiP/Urssaf de la crise Covid.)
  inst.push({
    nom: 'Conseillers-Entreprises',
    type: 'Guichet unique État · demande en ligne',
    site: 'https://conseillers-entreprises.service-public.gouv.fr',
    badge: 'Gratuit · confidentiel',
  });
  // Cellules de l'État pour les restructurations : CIRI au-delà de 400
  // salariés, CODEFI en dessous. L'orientation se fait sur l'effectif INSEE
  // (reponses.effectifDetail ne vaut que « Oui, moins de 5 » / « Oui, 5 ou plus »).
  const orientation = orientationRestructuration(effectifInsee);
  if (orientation === 'ciri' || orientation === 'les-deux') {
    inst.push({
      nom: 'CIRI',
      type: 'Comité Interministériel de Restructuration Industrielle',
      telephone: '01 44 87 72 58',
      site: 'https://www.economie.gouv.fr/ciri',
      badge: 'Entreprises > 400 salariés',
    });
  }
  if (orientation === 'codefi' || orientation === 'les-deux') {
    inst.push({
      nom: 'CODEFI',
      type: 'Comité Départemental d\'Examen des Problèmes de Financement',
      site: 'https://www.economie.gouv.fr/codefi',
      badge: 'Via la DDFiP · entreprises < 400 salariés',
    });
  }
  inst.push({
    nom: 'CRP · Commissaire aux Restructurations',
    type: 'Préfecture / DREETS',
    site: 'https://www.economie.gouv.fr',
    badge: 'Saisine via Préfecture',
  });
  groups.push({
    cle: 'institutionnel',
    titre: 'Institutionnel',
    couleur: 'rouge',
    icone: '🏛️',
    cartes: inst,
  });

  // Financier (bleu marine)
  const fin: OrganismeCard[] = [];
  const outreMer = /^9[78]/.test(dep?.code ?? '');
  if (reponses.probleme === 'urssaf' && sectorKey === 'agriculture' && !outreMer) {
    // Exploitant·e agricole : cotisations recouvrées par la MSA, pas l'Urssaf.
    fin.push({
      nom: 'MSA · caisse de votre département',
      type: 'MSA (Mutualité Sociale Agricole)',
      site: 'https://www.msa.fr',
      badge: 'Échelonnement possible',
    });
  } else if (reponses.probleme === 'urssaf' && sectorKey === 'peche') {
    fin.push({
      nom: 'ENIM',
      type: 'Cotisations des marins (ENIM)',
      // lannuaire.service-public.gouv.fr (« service gratuit + prix d'un appel »).
      telephone: '08 09 54 00 64',
      site: 'https://www.enim.eu',
      badge: 'Échelonnement possible',
    });
  } else if (reponses.probleme === 'urssaf' && dep?.urssaf) {
    fin.push({
      nom: dep.urssaf.nom,
      // Outre-mer : caisse locale (CGSS, CSSM, CPS, CAFAT…), pas l'Urssaf.
      type: outreMer ? 'Caisse de sécurité sociale · cotisations' : 'URSSAF',
      telephone: telUrssaf(dep.urssaf.telephone),
      telephoneNote: dep.urssaf.telephoneNote,
      site: dep.urssaf.site ?? 'https://www.urssaf.fr',
      badge: 'Échelonnement possible',
    });
  }
  if (reponses.probleme === 'impots' && dep?.sie) {
    fin.push({
      nom: dep.sie.nom,
      type: 'Service des impôts (SIE)',
      telephone: dep.sie.telephone,
      adresse: dep.sie.adresse,
      site: dep.sie.site ?? 'https://www.impots.gouv.fr',
    });
  }
  fin.push({
    nom: 'Bpifrance',
    type: 'Diagnostic + financement',
    site: 'https://www.bpifrance.fr',
    badge: 'Entretien gratuit',
  });
  // Correspondant TPE-PME Banque de France (IEDOM / IEOM outre-mer) — diagnostic gratuit et confidentiel
  const emission = institutionEmission(dep?.code);
  fin.push({
    nom: emission.nom === 'IEOM' ? `${emission.accompagnement} de ${emission.avecArticle}` : `${emission.accompagnement} ${emission.nom}`,
    type: 'Diagnostic financier confidentiel',
    telephone: emission.telephone || undefined,
    site: emission.site,
    badge: 'Gratuit · confidentiel',
  });
  if (reponses.probleme === 'banque' && dep?.banqueDeFrance) {
    fin.push({
      nom: dep.banqueDeFrance.nom,
      type: 'Médiation du crédit',
      telephone: dep.banqueDeFrance.telephone ?? '34 14',
      site: 'https://mediateur-credit.banque-france.fr',
      badge: 'Gratuit · confidentiel',
    });
  }
  if (reponses.probleme === 'fournisseurs') {
    fin.push({
      // Saisine en ligne uniquement : aucun numéro public sur le site du
      // Médiateur des entreprises.
      nom: 'Médiateur des entreprises',
      type: 'Différends fournisseurs · saisine en ligne',
      site: 'https://www.economie.gouv.fr/mediateur-des-entreprises',
      badge: 'Gratuit',
    });
  }
  groups.push({
    cle: 'financier',
    titre: 'Financier',
    couleur: 'bleu-fonce',
    icone: '💳',
    cartes: fin,
  });

  // Social (vert)
  const soc: OrganismeCard[] = [];
  if (reponses.effectif === 'salaries') {
    soc.push({
      // Pas de numéro national publié (ags-garantie-salaires.org : formulaire
      // de contact et CGEA régionaux).
      nom: 'AGS',
      type: 'Garantie des salaires',
      site: 'https://www.ags-garantie-salaires.org',
      badge: 'Si salariés',
    });
    if (dep?.dreets) {
      soc.push({
        nom: dep.dreets.nom,
        type: dep.dreets.type || 'Services de l\'État · travail et emploi',
        telephone: dep.dreets.telephone,
        site: dep.dreets.site ?? 'https://dreets.gouv.fr',
      });
    } else {
      soc.push({
        nom: 'DREETS de votre région',
        type: 'Accompagnement social',
        site: 'https://dreets.gouv.fr',
      });
    }
  }
  if (reponses.effectif === 'independant') {
    // La « Sécurité sociale des indépendants » (SSI) a disparu le 1er janvier
    // 2020 : l'action sociale des indépendant·e·s est celle du CPSTI, demandée
    // à l'Urssaf (urssaf.fr, « Comment solliciter l'action sanitaire et sociale
    // du CPSTI ? »).
    soc.push({
      nom: 'Urssaf · Action sociale du CPSTI',
      type: 'Aides aux indépendant·e·s en difficulté (cotisations, aide financière exceptionnelle)',
      telephone: '3698',
      site: 'https://www.urssaf.fr/accueil/services/services-independants/solliciter-action-sociale-cpsti.html',
      badge: 'Sur demande · au cas par cas',
    });
    soc.push({
      nom: 'France Travail Indépendants',
      type: 'ATI · Allocation Travailleurs Indépendants',
      telephone: '39 49',
      site: 'https://chomage-independant.francetravail.fr',
      badge: '19,73 à 26,30 €/jour · 182 jours',
    });
  }
  groups.push({
    cle: 'social',
    titre: 'Social',
    couleur: 'vert',
    icone: '🤝',
    cartes: soc,
  });

  return groups;
}

/**
 * Aides personnelles destinées au dirigeant (et non à l'entreprise) :
 * revenus de remplacement, couverture santé, logement, accès au droit…
 * Retourne un groupe indépendant des 4 groupes "entreprise" de buildOrganismes.
 */
export function buildAidesPersonnelles(reponses: Reponses): GroupeOrganismes {
  const cartes: OrganismeCard[] = [];

  // Indépendants : ATI en priorité
  if (reponses.effectif === 'independant') {
    cartes.push({
      nom: 'ATI · Allocation Travailleurs Indépendants',
      type: 'France Travail',
      telephone: '39 49',
      site: 'https://chomage-independant.francetravail.fr',
      badge: '19,73 à 26,30 €/jour · 182 jours',
    });
  }

  // ACRE : exonération de charges 1ère année après rebond
  cartes.push({
    nom: 'ACRE · Aide à la Création/Reprise d\'Entreprise',
    type: 'URSSAF · exonération de charges',
    // Ligne Urssaf des travailleurs indépendants (créateurs, repreneurs).
    telephone: '3698',
    site: 'https://www.urssaf.fr',
    badge: 'Rebond après liquidation',
  });

  // ARCE : capital France Travail pour rebondir
  cartes.push({
    nom: 'ARCE · Aide à la Reprise/Création',
    type: 'France Travail · capital',
    telephone: '39 49',
    site: 'https://www.francetravail.fr',
    badge: '60 % des droits chômage versés en capital',
  });

  // CSS : couverture santé
  cartes.push({
    nom: 'CSS · Complémentaire Santé Solidaire',
    type: 'Assurance Maladie',
    // 3646 : numéro de l'Assurance Maladie (lannuaire.service-public.gouv.fr).
    telephone: '3646',
    site: 'https://www.complementaire-sante-solidaire.gouv.fr',
    badge: 'Gratuit ou < 1€/jour',
  });

  // RSA via CAF
  cartes.push({
    nom: 'RSA · Revenu de Solidarité Active',
    type: 'CAF',
    site: 'https://www.caf.fr',
    badge: 'Si ressources < seuil',
  });

  // ASS via France Travail
  cartes.push({
    nom: 'ASS · Allocation de Solidarité Spécifique',
    type: 'France Travail',
    telephone: '39 49',
    site: 'https://www.francetravail.fr',
    badge: '19,48 €/jour · fin de droits chômage',
  });

  // APL logement
  cartes.push({
    nom: 'APL · Aide Personnalisée au Logement',
    type: 'CAF',
    site: 'https://www.caf.fr',
    badge: 'Logement principal',
  });

  // Aide juridictionnelle
  cartes.push({
    nom: 'Aide juridictionnelle',
    type: 'Tribunal judiciaire / Tribunal de commerce',
    site: 'https://www.service-public.fr/particuliers/vosdroits/F18074',
    badge: 'Prise en charge des frais d\'avocat',
  });

  return {
    cle: 'aides-personnelles',
    titre: 'Aides personnelles au dirigeant',
    couleur: 'vert',
    icone: '💚',
    cartes,
  };
}

/**
 * Ordres professionnels et caisses de retraite spécifiques selon le secteur
 * (libéral, santé). Retourne null si non pertinent.
 */
export function buildOrdresProfessionnels(
  sector: Pick<SectorInfo, 'secteur' | 'ordresProfessionnels' | 'caissesRetraite'>
): GroupeOrganismes | null {
  if (sector.secteur !== 'liberal' && sector.secteur !== 'sante') {
    return null;
  }
  const cartes: OrganismeCard[] = [];

  for (const ordre of sector.ordresProfessionnels ?? []) {
    cartes.push({
      nom: ordre.nom,
      type: `Ordre · ${ordre.profession}`,
      telephone: ordre.telephone,
      site: ordre.site,
      badge: ordre.note ?? 'Entraide confraternelle',
    });
  }

  // Une même caisse couvre parfois plusieurs professions (CARCDSF : dentistes
  // et sages-femmes ; CAVOM : commissaires de justice, commissaires-priseurs…) : une
  // seule carte, professions regroupées.
  const parCaisse = new Map<string, { caisse: NonNullable<SectorInfo['caissesRetraite']>[number]; professions: string[] }>();
  for (const caisse of sector.caissesRetraite ?? []) {
    const deja = parCaisse.get(caisse.caisse);
    if (deja) {
      if (!deja.professions.includes(caisse.profession)) deja.professions.push(caisse.profession);
    } else {
      parCaisse.set(caisse.caisse, { caisse, professions: [caisse.profession] });
    }
  }
  for (const { caisse, professions } of parCaisse.values()) {
    cartes.push({
      nom: `${caisse.caisse} · Action sociale`,
      type: `Caisse de retraite · ${professions.join(', ')}`,
      telephone: caisse.telephone,
      site: caisse.site,
      badge: 'Aide d\'urgence possible',
    });
  }


  if (cartes.length === 0) return null;

  return {
    cle: 'ordres-professionnels',
    titre: 'Ordres professionnels et caisses',
    couleur: 'violet',
    icone: '🎓',
    cartes,
  };
}

/**
 * Réseaux d'accompagnement et de soutien : BGE (créateurs/repreneurs),
 * AGEFIPH (handicap), conciliateurs de justice, médecine du travail…
 */
export function buildSoutien(reponses: Reponses): GroupeOrganismes {
  const cartes: OrganismeCard[] = [];

  cartes.push({
    nom: 'BGE · Boutiques de Gestion',
    // Pas de numéro national : chaque BGE a ses coordonnées (bge.asso.fr).
    type: 'Accompagnement créateurs/repreneurs',
    site: 'https://www.bge.asso.fr',
    badge: 'Rebond et reconversion',
  });

  cartes.push({
    nom: 'AGEFIPH',
    type: 'Handicap au travail',
    telephone: '0 800 11 10 09',
    site: 'https://www.agefiph.fr',
    badge: 'Salariés ou dirigeant en situation de handicap',
  });

  cartes.push({
    nom: 'Conciliateur de justice',
    type: 'Règlement amiable des litiges',
    site: 'https://www.conciliateurs.fr',
    badge: 'Saisine via mairie · gratuit',
  });

  if (reponses.effectif === 'salaries') {
    cartes.push({
      nom: 'Médecine du travail · SIST',
      type: 'Service de santé au travail',
      site: 'https://www.presanse.fr',
      badge: 'Selon votre région',
    });
  }

  // Crédit-bail / leasing : ASF pour négocier les contrats
  if (reponses.probleme === 'fournisseurs' || reponses.probleme === 'banque') {
    cartes.push({
      nom: 'ASF · Association française des Sociétés Financières',
      type: 'Crédit-bail / leasing',
      site: 'https://www.asf-france.com',
      badge: 'Négocier un contrat de leasing',
    });
  }

  return {
    cle: 'soutien',
    titre: 'Soutien et accompagnement',
    couleur: 'bleu',
    icone: '🤲',
    cartes,
  };
}

/**
 * Réseaux d'accompagnement spécifiques selon le profil du dirigeant :
 * femmes, jeunes, seniors, handicap, soutien psy, reprise après liquidation,
 * et entraide sectorielle (marin-pêcheur, vétérinaire…). Retourne plusieurs
 * groupes possibles (chacun affiché comme une section indépendante).
 */
export function buildReseauxSpecifiques(
  reponses: Reponses,
  sector?: Pick<SectorInfo, 'secteur'>
): GroupeOrganismes[] {
  const groupes: GroupeOrganismes[] = [];
  const age = reponses.ageDirigeant;

  // ----- Femmes dirigeantes (réseaux mixtes-femmes affichés systématiquement
  // car le questionnaire ne renseigne pas le genre ; Force Femmes ajouté si >45 ans)
  const femmes: OrganismeCard[] = [
    {
      nom: "Action'elles",
      type: 'Réseau · femmes entrepreneures',
      site: 'https://actionelles.fr',
      badge: 'Accompagnement gratuit',
    },
    {
      nom: 'Bouge ta Boîte',
      type: 'Réseau business · femmes',
      site: 'https://www.bougetaboite.com',
      badge: 'Cercles locaux',
    },
    {
      nom: "Femmes Chefs d'Entreprise (FCE France)",
      type: 'Réseau national',
      site: 'https://www.fcefrance.com',
      badge: 'Entraide entre dirigeantes',
    },
    {
      nom: 'Garantie Égalité Femmes (ex-FGIF)',
      type: 'France Active · garantie de prêt',
      site: 'https://www.franceactive.org',
      badge: 'Garantie de prêt bancaire',
    },
  ];
  if (age === 'plus-60' || age === '50-60') {
    femmes.push({
      nom: 'Force Femmes',
      type: 'Femmes > 45 ans · accompagnement emploi/création',
      // forcefemmes.com/nous-contacter : siège et Île-de-France.
      telephone: '01 42 63 59 49',
      site: 'https://www.forcefemmes.com',
      badge: 'Gratuit · > 45 ans',
    });
  }
  groupes.push({
    cle: 'reseaux-femmes',
    titre: 'Réseaux femmes dirigeantes',
    couleur: 'violet',
    icone: '👩‍💼',
    cartes: femmes,
  });

  // ----- Jeunes dirigeants (< 25 ans)
  if (age === 'moins-25') {
    groupes.push({
      cle: 'reseaux-jeunes',
      titre: 'Réseaux jeunes dirigeants',
      couleur: 'bleu',
      icone: '🌱',
      cartes: [
        {
          nom: '1 jeune 1 mentor',
          type: 'Mentorat · 16-30 ans',
          site: 'https://www.1jeune1mentor.fr',
          badge: 'Gratuit',
        },
        {
          nom: 'Mission Locale',
          type: 'Accompagnement < 26 ans',
          site: 'https://www.unml.info',
          badge: 'Réseau national · gratuit',
        },
        {
          nom: 'France Active Jeunes',
          type: 'Financement solidaire',
          site: 'https://www.franceactive.org',
          badge: 'Prêts d\'honneur, garanties',
        },
        {
          nom: 'Adie Créajeunes',
          type: 'Microcrédit + accompagnement',
          site: 'https://www.adie.org',
          badge: 'Spécial < 32 ans',
        },
        {
          nom: 'CitésLab',
          type: 'Quartiers prioritaires (QPV)',
          site: 'https://www.citeslab.fr',
          badge: 'Si vous habitez un QPV',
        },
      ],
    });
  }

  // ----- Seniors (50-60 ou plus-60) : entraide bénévole d'anciens dirigeants
  if (age === 'plus-60' || age === '50-60') {
    groupes.push({
      cle: 'reseaux-seniors',
      titre: 'Réseaux seniors et entraide bénévole',
      couleur: 'bleu-fonce',
      icone: '🧓',
      cartes: [
        {
          nom: "EGEE · Entente des Générations pour l'Emploi",
          type: 'Anciens dirigeants bénévoles',
          site: 'https://www.egee.asso.fr',
          badge: 'Conseil gratuit · présentiel',
        },
        {
          nom: 'ECTI · Experts retraités',
          type: 'Échanges et Consultations Techniques Internationaux',
          telephone: '01 41 40 36 00',
          site: 'https://www.ecti.org',
          badge: 'Mission de conseil',
        },
        {
          nom: 'AGIRabcd',
          type: 'Retraités bénévoles · accompagnement',
          site: 'https://www.agirabcd.org',
          badge: 'Délégations départementales',
        },
        {
          nom: 'Réseau Entreprendre Repreneurs',
          type: 'Cession et transmission',
          site: 'https://www.reseau-entreprendre.org',
          badge: 'Si vous envisagez de céder',
        },
      ],
    });
  }

  // ----- Handicap : priorisé si RQTH déclarée, sinon affiché en réseau standard
  const rqthDeclaree = reponses.rqth === 'oui';
  groupes.push({
    cle: 'reseaux-handicap',
    titre: rqthDeclaree ? 'Handicap et RQTH — vos interlocuteurs prioritaires' : 'Handicap et accessibilité',
    couleur: 'vert',
    icone: '♿',
    cartes: [
      {
        nom: 'AGEFIPH',
        type: 'Secteur privé · handicap au travail',
        telephone: '0 800 11 10 09',
        site: 'https://www.agefiph.fr',
        badge: rqthDeclaree ? 'Prioritaire pour vous' : 'Aides dirigeant et salariés',
      },
      {
        nom: 'Cap Emploi',
        type: 'Réseau spécialisé handicap',
        site: 'https://www.capemploi.info',
        badge: rqthDeclaree ? 'RDV gratuit recommandé' : 'Accompagnement gratuit',
      },
      {
        nom: 'FIPHFP',
        type: 'Secteur public · handicap',
        site: 'https://www.fiphfp.fr',
        badge: 'Pour les agents publics',
      },
      {
        nom: 'MDPH',
        type: 'Maison Départementale des Personnes Handicapées',
        site: 'https://www.monparcourshandicap.gouv.fr/annuaire',
        badge: 'RQTH, AAH, PCH',
      },
      ...(rqthDeclaree
        ? [{
            nom: 'Comète France',
            type: 'Reconversion professionnelle après accident/maladie',
            site: 'https://www.cometefrance.com',
            badge: 'Reconversion adaptée',
          }]
        : []),
    ],
  });

  // ----- Soutien psy public renforcé (si moral fragile)
  if (reponses.moral === 'perdu' || reponses.moral === 'epuise') {
    groupes.push({
      cle: 'reseaux-psy',
      titre: 'Soutien psychologique — dispositifs publics',
      couleur: 'rouge',
      icone: '💚',
      cartes: [
        {
          nom: 'CMP · Centre Médico-Psychologique',
          type: 'Suivi gratuit · par département',
          site: 'https://www.sante.fr/centre-medico-psychologique-cmp',
          badge: 'Secteur public · sans avance',
        },
        {
          nom: 'CUMP · Cellule d\'Urgence Médico-Psychologique',
          type: 'Choc aigu · activation via SAMU',
          telephone: '15',
          site: 'https://www.santepubliquefrance.fr',
          badge: 'Pour situation de crise',
        },
        {
          nom: 'SAMU + Psy Centre 15',
          type: 'Urgence psychiatrique',
          telephone: '15',
          badge: '24h/24 · gratuit',
        },
        {
          nom: 'SOS Suicide Phénix',
          type: 'Écoute · prévention suicide',
          telephone: '01 40 44 46 45',
          site: 'https://www.sos-suicide-phenix.org',
          badge: 'Tous les jours, 13 h – 23 h · prix d\'un appel local',
        },
        {
          nom: 'Suicide Écoute',
          type: 'Ligne d\'écoute · 24h/24',
          telephone: '01 45 39 40 00',
          site: 'https://suicide-ecoute.fr',
          badge: 'Bénévoles formés',
        },
        {
          nom: '3114 · Numéro national de prévention du suicide',
          type: 'Professionnels de santé',
          telephone: '3114',
          site: 'https://3114.fr',
          badge: '24h/24 · gratuit · confidentiel',
        },
        {
          nom: '3919 · Violences faites aux femmes',
          type: 'Si applicable · écoute et orientation',
          telephone: '3919',
          site: 'https://www.solidaritefemmes.org',
          badge: 'Anonyme · 24h/24',
        },
      ],
    });
  }

  // ----- Reprise après liquidation (toujours utile à connaître)
  groupes.push({
    cle: 'reseaux-rebond',
    titre: 'Rebond après liquidation',
    couleur: 'jaune',
    icone: '🔄',
    cartes: [
      {
        nom: '60 000 Rebonds',
        type: 'Accompagnement post-liquidation',
        site: 'https://www.60000rebonds.com',
        badge: 'Bénévoles · 2 ans de suivi',
      },
      {
        nom: 'Second Souffle',
        type: 'Entraide dirigeants en rebond',
        site: 'https://secondsouffle.org',
        badge: 'Communauté + ateliers',
      },
    ],
  });

  // ----- Pêche : entraide sectorielle spécifique
  const secteur: Secteur | undefined = sector?.secteur;
  if (secteur === 'peche') {
    groupes.push({
      cle: 'reseaux-peche',
      titre: 'Entraide marins-pêcheurs',
      couleur: 'bleu-fonce',
      icone: '⚓',
      // La SNSM (sauvetage en mer) n'aide que les familles de ses propres
      // sauveteurs ; la carte « SSM » retirée (organisme introuvable).
      // L'aide aux marins et à leurs familles relève de l'action sanitaire et
      // sociale de l'ENIM (règlement d'action sanitaire et sociale, enim.eu).
      cartes: [
        {
          nom: 'ENIM · Action sanitaire et sociale',
          type: 'Aides aux marins et à leurs familles',
          telephone: '08 09 54 00 64',
          site: 'https://www.enim.eu',
          badge: 'Sur demande · souvent sous conditions de ressources',
        },
      ],
    });
  }

  // ----- Vétérinaires (libéral / santé) : Vetos-Entraide
  if (secteur === 'liberal' || secteur === 'sante') {
    groupes.push({
      cle: 'reseaux-veto',
      titre: 'Entraide vétérinaires (si applicable)',
      couleur: 'violet',
      icone: '🐾',
      cartes: [
        {
          nom: 'Vetos-Entraide',
          type: 'Vétérinaires en difficulté · équivalent APESA',
          site: 'https://www.vetos-entraide.com',
          badge: 'Écoute par des confrères · gratuit',
        },
      ],
    });
  }

  return groupes;
}
