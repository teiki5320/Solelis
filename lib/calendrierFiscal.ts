// Échéances fiscales et sociales « types » (outil /outils/calendrier-fiscal).
// Les dates exactes peuvent varier : la date qui fait foi est celle affichée
// dans l'espace professionnel impots.gouv.fr / net-entreprises.fr.

export type RegimeTVA = 'franchise' | 'reel-mensuel' | 'reel-trimestriel' | 'mini-reel';
export type RegimeIS = 'is' | 'ir-bic' | 'ir-bnc' | 'micro';
export type ExerciceFin = 'dec' | 'juin' | 'sept';

export interface Echeance {
  date: Date;
  titre: string;
  description: string;
  categorie: 'TVA' | 'IS' | 'IR' | 'CFE' | 'CVAE' | 'URSSAF' | 'DSN' | 'Comptes' | 'Taxes';
  source: string;
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** Dernier jour du mois (month : 0 = janvier, peut dépasser 11). */
function finDeMois(annee: number, mois: number): Date {
  return new Date(annee, mois + 1, 0);
}

/** Mois de clôture (0 = janvier). */
const MOIS_CLOTURE: Record<ExerciceFin, number> = { dec: 11, juin: 5, sept: 8 };

function echeancesAnnee(
  y: number,
  tva: RegimeTVA,
  is: RegimeIS,
  fin: ExerciceFin,
  salaries: boolean,
  proprietaire: boolean,
): Echeance[] {
  const items: Echeance[] = [];
  const at = (m: number, d: number) => new Date(y, m, d);

  // TVA au réel normal : entre le 15 et le 24 du mois suivant (date propre à
  // chaque entreprise, affichée dans l'espace professionnel).
  if (tva === 'reel-mensuel') {
    for (let m = 0; m < 12; m++) {
      items.push({
        date: at(m, 15),
        titre: 'Déclaration et paiement TVA mensuelle (CA3)',
        description: `TVA du mois de ${MOIS[(m + 11) % 12]}. Date limite entre le 15 et le 24 selon votre entreprise : la date exacte figure dans votre espace professionnel (impots.gouv.fr).`,
        categorie: 'TVA',
        source: 'impots.gouv.fr · CGI ann. IV art. 39',
      });
    }
  } else if (tva === 'reel-trimestriel') {
    // Trimestre écoulé déclaré en avril, juillet, octobre et janvier.
    [0, 3, 6, 9].forEach((m) => {
      items.push({
        date: at(m, 15),
        titre: 'Déclaration TVA trimestrielle (CA3)',
        description: 'Possible quand la TVA exigible annuelle est inférieure à 4 000 €. Date limite entre le 15 et le 24 selon votre entreprise (espace professionnel impots.gouv.fr).',
        categorie: 'TVA',
        source: 'CGI art. 287 · impots.gouv.fr',
      });
    });
  } else if (tva === 'mini-reel') {
    // Régime réel simplifié : CA12 début mai, acomptes de juillet (55 %) et
    // décembre (40 %).
    items.push({
      date: at(4, 4),
      titre: 'Déclaration annuelle de TVA (CA12)',
      description: 'À télétransmettre au plus tard le 2e jour ouvré suivant le 1er mai, sous déduction des acomptes versés.',
      categorie: 'TVA',
      source: 'impots.gouv.fr · BOI-TVA-DECLA-20-20-30',
    });
    items.push({
      date: at(6, 15),
      titre: 'Acompte TVA de juillet (régime réel simplifié)',
      description: '55 % de la TVA due au titre de l\'exercice précédent (dispense si elle était inférieure à 1 000 €). Date exacte dans votre espace professionnel.',
      categorie: 'TVA',
      source: 'BOI-TVA-DECLA-20-20-30',
    });
    items.push({
      date: at(11, 15),
      titre: 'Acompte TVA de décembre (régime réel simplifié)',
      description: '40 % de la TVA due au titre de l\'exercice précédent (dispense si elle était inférieure à 1 000 €). Date exacte dans votre espace professionnel.',
      categorie: 'TVA',
      source: 'BOI-TVA-DECLA-20-20-30',
    });
  }

  // IS : acomptes les 15 mars, juin, septembre et décembre (CGI art. 1668).
  const cloture = MOIS_CLOTURE[fin];
  if (is === 'is') {
    [2, 5, 8, 11].forEach((m, i) => {
      items.push({
        date: at(m, 15),
        titre: `Acompte IS n°${i + 1}`,
        description: `Acompte calculé sur le résultat du dernier exercice clos (ou réduit si vous prévoyez une baisse). Échéance : 15 ${MOIS[m]}.`,
        categorie: 'IS',
        source: 'CGI art. 1668 · BOI-IS-DECLA-20',
      });
    });
    // Solde : le 15 du 4e mois suivant la clôture (15 mai pour une clôture au 31 décembre).
    const moisSolde = cloture === 11 ? 4 : cloture + 4;
    items.push({
      date: at(moisSolde, 15),
      titre: 'Solde IS',
      description: "Paiement du solde de l'IS du dernier exercice clos, après déduction des acomptes.",
      categorie: 'IS',
      source: 'CGI art. 1668',
    });
    // Liasse : 2e jour ouvré suivant le 1er mai (clôture au 31 décembre),
    // sinon dans les 3 mois de la clôture.
    items.push({
      date: cloture === 11 ? at(4, 4) : finDeMois(y, cloture + 3),
      titre: 'Déclaration de résultats (liasse 2065)',
      description: cloture === 11
        ? 'Au plus tard le 2e jour ouvré suivant le 1er mai (délai supplémentaire de 15 jours en cas de télétransmission).'
        : 'Dans les 3 mois suivant la clôture de l\'exercice (délai supplémentaire de 15 jours en cas de télétransmission).',
      categorie: 'IS',
      source: 'CGI art. 223',
    });
  }

  // IR (BIC, BNC, micro) : déclaration de revenus au printemps, dates
  // fixées chaque année selon le département.
  if (is === 'ir-bic' || is === 'ir-bnc' || is === 'micro') {
    items.push({
      date: at(4, 20),
      titre: 'Déclaration de revenus n°2042 + 2042-C-PRO',
      description: 'Revenus professionnels déclarés avec vos revenus personnels ; le volet social sert au calcul de vos cotisations Urssaf. Date limite fixée chaque année selon votre département (fin mai-début juin).',
      categorie: 'IR',
      source: 'impots.gouv.fr',
    });
  }

  // CFE : solde au 15 décembre, acompte au 15 juin si la CFE N-1 ≥ 3 000 €.
  items.push({
    date: at(11, 15),
    titre: 'Cotisation Foncière des Entreprises (CFE)',
    description: 'Solde de la CFE de l\'année. Avis disponible sur l\'espace professionnel impots.gouv.fr.',
    categorie: 'CFE',
    source: 'CGI art. 1447 et s.',
  });
  items.push({
    date: at(5, 15),
    titre: 'Acompte CFE (si la CFE de l\'an dernier atteint 3 000 €)',
    description: '50 % de la CFE de l\'année précédente.',
    categorie: 'CFE',
    source: 'CGI art. 1679 quinquies',
  });

  // CVAE : suppression reportée à 2030 (loi de finances pour 2025, art. 62).
  items.push({
    date: at(4, 4),
    titre: 'Déclaration CVAE n°1330-CVAE',
    description: 'Cotisation sur la Valeur Ajoutée des Entreprises (si chiffre d\'affaires supérieur à 152 500 €). Suppression reportée à 2030 : taux maximal de 0,28 % en 2026 et 2027, 0,19 % en 2028, 0,09 % en 2029 (loi de finances pour 2025, art. 62).',
    categorie: 'CVAE',
    source: 'CGI art. 1586 ter',
  });

  if (salaries) {
    for (let m = 0; m < 12; m++) {
      items.push({
        date: at(m, 15),
        titre: 'DSN mensuelle',
        description: 'Déclaration sociale nominative du mois précédent : le 15 du mois (le 5 pour les entreprises de 50 salariés et plus).',
        categorie: 'DSN',
        source: 'CSS art. L133-5-3 · net-entreprises.fr',
      });
    }
  }

  // Dépôt des comptes : 1 mois après l'approbation, soit 7 mois après la
  // clôture (8 mois en cas de dépôt dématérialisé).
  items.push({
    date: finDeMois(y, cloture + 7),
    titre: 'Dépôt des comptes annuels au greffe (sociétés)',
    description: "Dans les 7 mois suivant la clôture (8 mois en cas de dépôt dématérialisé). Sanctions pénales et civiles en cas de défaut.",
    categorie: 'Comptes',
    source: 'C. com. art. L232-21 à L232-23',
  });

  if (proprietaire) {
    items.push({
      date: at(9, 15),
      titre: 'Taxe foncière (locaux professionnels)',
      description: 'Date limite indiquée sur votre avis (mi-octobre, quelques jours de plus en cas de paiement en ligne).',
      categorie: 'Taxes',
      source: 'CGI art. 1380 et s.',
    });
  }
  return items;
}

/**
 * Prochaines échéances : de aujourd'hui (inclus) à dans 12 mois. Aucune
 * date passée n'est proposée.
 */
export function buildEcheances(
  tva: RegimeTVA,
  is: RegimeIS,
  fin: ExerciceFin,
  salaries: boolean,
  proprietaire: boolean,
  maintenant: Date = new Date(),
): Echeance[] {
  const debut = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  const limite = new Date(debut);
  limite.setFullYear(limite.getFullYear() + 1);
  const y = debut.getFullYear();
  const items = [y - 1, y, y + 1].flatMap((annee) => echeancesAnnee(annee, tva, is, fin, salaries, proprietaire));
  return items
    .filter((e) => e.date.getTime() >= debut.getTime() && e.date.getTime() < limite.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
