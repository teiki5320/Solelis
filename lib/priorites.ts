import type { Reponses, CompanyData } from './types';
import type { SectorInfo, EffectifSeuils } from './secteur';
import { resolveStrategie, AXE_META, getTribunalCompetent } from './strategie';
import { relevantDeLaMsa } from './organismes';

export type Tone = 'rouge' | 'jaune' | 'bleu' | 'vert' | 'navy';

export const TONES: Record<Tone, { bg: string; border: string; accent: string; text: string; hover: string }> = {
  rouge: { bg: 'bg-rouge/5', border: 'border-rouge/30', accent: 'bg-rouge', text: 'text-rouge', hover: 'hover:bg-rouge/10' },
  jaune: { bg: 'bg-jaune/10', border: 'border-jaune/40', accent: 'bg-jaune', text: 'text-jaune', hover: 'hover:bg-jaune/15' },
  bleu: { bg: 'bg-bleu/5', border: 'border-bleu/30', accent: 'bg-bleu-fonce', text: 'text-bleu-fonce', hover: 'hover:bg-bleu/10' },
  vert: { bg: 'bg-vert/5', border: 'border-vert/30', accent: 'bg-vert', text: 'text-vert', hover: 'hover:bg-vert/10' },
  navy: { bg: 'bg-white/70', border: 'border-navy/15', accent: 'bg-navy', text: 'text-navy', hover: 'hover:bg-white' },
};

export interface BuildCardsProps {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
  seuils: EffectifSeuils;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Construit les PriorityCards brutes (sans JSX expandedContent).
 * Le JSX est injecté par le composant appelant via buildExpandedContent.
 * Ici on ne retourne que les data de scoring + metadata par carte.
 */
export interface PriorityCardMeta {
  id: string;
  icone: string;
  label: string;
  valeur: string;
  detail: string;
  tone: Tone;
  scrollTo?: string;
  score: number;
  /** Données supplémentaires pour construire le contenu étendu */
  extra?: Record<string, unknown>;
}

export function scorePriorityCards({ reponses, company, sector, seuils }: BuildCardsProps): PriorityCardMeta[] {
  const cards: PriorityCardMeta[] = [];
  const dep = company.departement;
  // Tribunal : même source que la stratégie et la carte « Organismes »
  // (jamais « tribunal de commerce de <commune> »).
  const tribunal = getTribunalCompetent(company);

  // 1. Délai de 45 jours pour déclarer la cessation des paiements
  if (reponses.situation === 'redressement' || reponses.situation === 'assignation') {
    const score = reponses.situation === 'assignation' ? 11 : 10;
    cards.push({
      id: 'cessation',
      icone: '⏰',
      label: 'Délai légal',
      valeur: '45 jours',
      detail: 'Pour déclarer la cessation des paiements',
      tone: 'rouge',
      scrollTo: 'echeances',
      score,
      extra: { tribunal: tribunal.enPhrase },
    });
  }

  // 2. Audience à préparer (si assignation)
  if (reponses.situation === 'assignation') {
    cards.push({
      id: 'audience',
      icone: '⚖️',
      label: 'Audience',
      valeur: 'À préparer',
      detail: tribunal.nom,
      tone: 'rouge',
      scrollTo: 'echeances',
      score: 10,
    });
  }

  // 3. Stratégie recommandée
  const strat = resolveStrategie(reponses, company);
  if (strat) {
    const meta = AXE_META[strat.main.axe];
    cards.push({
      id: 'strategie',
      icone: meta.icone,
      label: 'Votre cap',
      valeur: meta.label,
      detail: strat.main.titre,
      tone: 'bleu',
      scrollTo: 'vue-ensemble',
      score: 8,
      extra: { verdict: strat.main.verdict, etapes: strat.main.etapes },
    });
  }

  // 4. Cautions personnelles à auditer
  if (reponses.caution === 'oui') {
    cards.push({
      id: 'cautions',
      icone: '🛡️',
      label: 'Cautions',
      valeur: 'À auditer',
      detail: 'Risque patrimonial personnel',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score: 9,
    });
  }

  // 5. Trésorerie — prioritaire si tension déclarée ; sinon carte de
  // complément (score bas) pour que la grille garde 4 cartes : un
  // prévisionnel à 6 mois est utile à toute entreprise en difficulté.
  const tresoPrioritaire =
    reponses.situation === 'tresorie' || reponses.situation === 'redressement' || reponses.probleme === 'banque';
  cards.push({
    id: 'tresorerie',
    icone: '📊',
    label: 'Trésorerie',
    valeur: 'À projeter',
    detail: 'Horizon 6 mois',
    tone: 'jaune',
    scrollTo: 'echeances',
    score: tresoPrioritaire ? 7 : 1,
  });

  // 6. Patrimoine
  if (reponses.patrimoine === 'proprietaire') {
    const score = reponses.caution === 'oui' ? 7 : 5;
    cards.push({
      id: 'patrimoine',
      icone: '🏠',
      label: 'Patrimoine',
      valeur: 'Propriétaire',
      detail: reponses.regime === 'separation' ? 'Conjoint·e en principe à l\'abri' : reponses.regime === 'communaute' ? 'Biens communs exposés' : 'À analyser',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score,
    });
  }

  // 7. Soutien humain
  const moralFragile = reponses.moral === 'epuise' || reponses.moral === 'perdu';
  cards.push({
    id: 'soutien',
    icone: '🤝',
    label: 'Soutien',
    valeur: 'Gratuit · confidentiel',
    // Le 3114 est le numéro national de prévention du suicide, pas un numéro APESA.
    detail: sector.soutien ? sector.soutien.nom : 'APESA, ou le 3114 en urgence',
    tone: 'vert',
    scrollTo: 'vue-ensemble',
    score: moralFragile ? 9 : 4,
    extra: { sectorSoutien: sector.soutien },
  });

  // 8. Aides disponibles
  const scoreAides = reponses.probleme === 'urssaf' || reponses.probleme === 'impots' ? 6 : 4;
  // Cotisations : MSA pour un·e exploitant·e agricole (métropole), ENIM pour la pêche.
  const orgCotisations =
    sector.secteur === 'peche' ? 'ENIM' : relevantDeLaMsa(sector.secteur, dep) ? 'MSA' : 'URSSAF';
  cards.push({
    id: 'aides',
    icone: '💶',
    label: 'Aides',
    valeur: 'Disponibles',
    detail: reponses.probleme === 'urssaf' ? `${orgCotisations} + CCSF + BPI` : reponses.probleme === 'impots' ? 'SIE + CCSF + CODEFI' : reponses.probleme === 'banque' ? 'Médiation du crédit' : 'Plusieurs leviers',
    tone: 'bleu',
    scrollTo: 'aides',
    score: scoreAides,
    extra: { dep, probleme: reponses.probleme },
  });

  // 9. Bail commercial
  const secteursBail = ['hotellerie', 'commerce', 'artisanat', 'liberal', 'sante', 'culture-sport'];
  if (secteursBail.includes(sector.secteur)) {
    // BlocBailCommercial affiche 6 leviers, + 1 si procédure collective en cours
    const nbLeviers =
      reponses.situation === 'redressement' || reponses.situation === 'assignation' ? 7 : 6;
    cards.push({
      id: 'bail',
      icone: '🔑',
      label: 'Bail commercial',
      valeur: 'Leviers dispo',
      detail: `${nbLeviers} dispositifs légaux`,
      tone: 'bleu',
      scrollTo: 'aides',
      score: 5,
    });
  }

  // 10. Obligations effectif
  if (reponses.effectif === 'salaries' && seuils.approx >= 11) {
    cards.push({
      id: 'obligations',
      icone: '📐',
      label: 'Obligations',
      valeur: `${seuils.approx}+ salariés`,
      detail: seuils.obligations50 ? 'CSE + participation (+ PSE selon licenciements)' : 'CSE requis',
      tone: 'navy',
      scrollTo: 'aides',
      score: 4,
      extra: { obligations50: seuils.obligations50 },
    });
  }

  // 11. PGE en cours : très prioritaire (à traiter avant procédure)
  if (reponses.pgeEnCours === 'oui') {
    cards.push({
      id: 'pge',
      icone: '💳',
      label: 'PGE en cours',
      valeur: 'À restructurer',
      detail: 'Médiation du crédit : jusqu\'à +2 ans (+4 par exception)',
      tone: 'jaune',
      scrollTo: 'echeances',
      score: 8,
    });
  }

  // 12. Conjoint impliqué : protection à vérifier
  if (reponses.conjointStatut && reponses.conjointStatut !== 'sans-conjoint' && reponses.conjointStatut !== 'aucun') {
    cards.push({
      id: 'conjoint',
      icone: '👫',
      label: 'Conjoint',
      valeur: reponses.conjointStatut === 'salarie' ? 'Salarié·e (AGS)' : reponses.conjointStatut === 'collaborateur' ? 'Collaborateur·rice' : 'Associé·e',
      detail: 'Protections et risques spécifiques',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score: 5,
    });
  }

  // 13. Co-gérance : risque solidarité fiscale/sociale
  if (reponses.coGerants === 'oui') {
    cards.push({
      id: 'cogerance',
      icone: '⚖️',
      label: 'Co-gérance',
      valeur: 'Solidarité',
      detail: 'Fiscale (L267 LPF) et faute de gestion (L651-2)',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score: 6,
    });
  }

  return cards.sort((a, b) => b.score - a.score).slice(0, 4);
}
