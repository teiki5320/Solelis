/**
 * Les 4 pages « situation » (guides pratiques) : contenu des pages /situation/<slug>
 * et liste exposée à la veille actus (https://solelis.com/veille/entites.json).
 */

export interface SituationData {
  titre: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  loi: string;
  etapes: { titre: string; texte: string }[];
  courrier?: { slug: string; label: string };
  ressources: { href: string; label: string }[];
}

export const SITUATIONS: Record<string, SituationData> = {
  'dettes-urssaf': {
    titre: 'Dettes URSSAF : que faire quand on ne peut plus payer ?',
    metaTitle: 'Dettes URSSAF : que faire ? Guide pratique — Solelis',
    metaDesc: 'Vous avez des dettes URSSAF et ne pouvez plus payer ? Échelonnement, prescription 3 ans, contestation — toutes vos options expliquées simplement.',
    intro: 'Les cotisations URSSAF impayées sont l\'une des premières causes de difficulté pour les dirigeants. La bonne nouvelle : des solutions existent, et plus vous agissez tôt, plus elles sont efficaces. Vous n\'êtes pas le premier ni le dernier à traverser ça.',
    loi: 'Les cotisations sociales se prescrivent par 3 ans à compter de la fin de l\'année civile au titre de laquelle elles sont dues — pour les travailleurs indépendants, à compter du 30 juin de l\'année suivante (article L244-3 du Code de la sécurité sociale). Une mise en demeure envoyée dans ce délai ouvre un nouveau délai de 3 ans pour le recouvrement (art. L244-8-1) : des cotisations anciennes ne sont donc pas forcément prescrites, faites vérifier les dates. L\'échelonnement n\'est pas un droit : l\'URSSAF peut l\'accorder sur demande (employeur : déclarations faites et part salariale des cotisations payée, selon urssaf.fr). En cas de mise en demeure, vous disposez de 2 mois pour saisir la Commission de recours amiable (CRA).',
    etapes: [
      { titre: 'Appelez l\'URSSAF avant qu\'ils ne vous appellent', texte: 'Appelez l\'URSSAF — 36 98 si vous êtes travailleur·se indépendant·e, 39 57 si vous êtes employeur (exploitant·e agricole : votre caisse MSA ; outre-mer : votre CGSS) — et demandez un échelonnement. Préparez votre dernier bilan et une estimation du montant dû. Un appel proactif est toujours mieux perçu qu\'un silence.' },
      { titre: 'Vérifiez les prescriptions', texte: 'Avec votre expert-comptable ou un avocat, vérifiez pour chaque période la date d\'exigibilité et la date de la mise en demeure : certaines cotisations anciennes peuvent être prescrites (article L244-3 du Code de la sécurité sociale).' },
      { titre: 'Envoyez une demande écrite d\'échelonnement', texte: 'Un courrier formel engage le dialogue et laisse une trace. Nous avons un modèle prêt à l\'emploi.' },
      { titre: 'Contestez si nécessaire', texte: 'Si vous recevez une mise en demeure injustifiée, saisissez la CRA dans les 2 mois. Passé ce délai, la contestation devient beaucoup plus difficile.' },
    ],
    courrier: { slug: 'echelonnement-urssaf', label: 'Modèle de courrier URSSAF' },
    ressources: [
      { href: '/courriers/echelonnement-urssaf', label: 'Courrier d\'échelonnement URSSAF' },
      { href: '/courriers/contestation-urssaf', label: 'Contestation de mise en demeure' },
      { href: '/aides', label: 'Aides financières d\'urgence' },
      { href: '/parler', label: 'Parler à quelqu\'un maintenant' },
    ],
  },
  'dettes-fournisseurs': {
    titre: 'Dettes fournisseurs : comment négocier sans tout perdre ?',
    metaTitle: 'Dettes fournisseurs : comment négocier ? — Solelis',
    metaDesc: 'Des factures fournisseurs impayées s\'accumulent ? Négociation amiable, médiation des entreprises, risques — guide pratique pour dirigeants.',
    intro: 'Des factures impayées qui s\'empilent, des relances qui arrivent, la peur d\'une assignation… C\'est un scénario que vivent des milliers de dirigeants chaque année. La négociation amiable reste toujours la meilleure option — et elle fonctionne plus souvent qu\'on ne le croit.',
    loi: 'En cas de facture impayée, le créancier peut vous assigner en paiement devant le tribunal de commerce. Cependant, la loi encourage d\'abord la résolution amiable. Le Médiateur des entreprises (gratuit, confidentiel) peut intervenir pour faciliter un accord. En cas de procédure collective, les fournisseurs deviennent des créanciers chirographaires — ils seront payés selon le plan, mais pas en priorité.',
    etapes: [
      { titre: 'Prenez les devants — écrivez en premier', texte: 'Un courrier proposant un échéancier montre votre bonne foi et évite l\'escalade. Les fournisseurs préfèrent un client qui communique à un client qui disparaît.' },
      { titre: 'Proposez un échéancier réaliste', texte: 'Divisez la dette en 3 à 6 mensualités. Engagez-vous à reprendre les paiements courants immédiatement. Un plan réaliste a davantage de chances d\'être accepté.' },
      { titre: 'Saisissez le Médiateur si nécessaire', texte: 'Le Médiateur des entreprises est gratuit et confidentiel. Vous pouvez le saisir en ligne.' },
      { titre: 'Protégez-vous d\'une assignation', texte: 'Si un fournisseur vous assigne, consultez immédiatement un avocat. Le fait d\'avoir proposé un plan de paiement écrit joue en votre faveur devant le tribunal.' },
    ],
    courrier: { slug: 'delai-fournisseur', label: 'Modèle de courrier fournisseur' },
    ressources: [
      { href: '/courriers/delai-fournisseur', label: 'Courrier de demande de délai' },
      { href: '/courriers/creancier-arrangement', label: 'Proposition d\'arrangement amiable' },
      { href: '/courriers/mediation-entreprises', label: 'Saisine du Médiateur' },
      { href: '/procedures', label: 'Tableau comparatif des procédures' },
    ],
  },
  'credit-bancaire': {
    titre: 'Crédit bancaire : que faire quand la banque lâche ?',
    metaTitle: 'Problème de crédit bancaire : vos recours — Solelis',
    metaDesc: 'Refus de prêt, découvert réduit, dénonciation de concours ? Médiation du crédit, mandat ad hoc — vos droits et recours expliqués.',
    intro: 'Quand votre banque refuse un prêt, réduit votre découvert ou menace de couper les concours, c\'est toute l\'entreprise qui vacille. Mais vous avez des droits — et des recours gratuits que beaucoup de dirigeants ignorent.',
    loi: 'Une banque ne peut pas supprimer un découvert autorisé du jour au lendemain : elle doit respecter un préavis de 60 jours minimum (article L313-12 du Code monétaire et financier). Pour une dénonciation de concours bancaires, le préavis est de 60 jours également, sauf en cas de comportement gravement répréhensible ou de situation irrémédiablement compromise. La médiation du crédit, gérée par la Banque de France, est gratuite et confidentielle.',
    etapes: [
      { titre: 'Vérifiez les préavis légaux', texte: 'Si votre banque a réduit ou coupé un concours à durée indéterminée sans préavis écrit de 60 jours, elle est en tort, sauf comportement gravement répréhensible de votre part ou situation irrémédiablement compromise (art. L313-12 C. mon. fin.). Gardez tous les courriers.' },
      { titre: 'Saisissez la médiation du crédit', texte: 'C\'est gratuit, confidentiel, et ça prend quelques jours. Le médiateur contacte votre banque et cherche une solution avec elle.' },
      { titre: 'Envisagez un mandat ad hoc', texte: 'Si le problème bancaire fait partie d\'un ensemble de difficultés, un mandataire nommé par le tribunal peut négocier confidentiellement avec la banque et les autres créanciers.' },
      { titre: 'Ne restez pas seul·e', texte: 'La CCI et Bpifrance proposent des accompagnements gratuits pour les entreprises qui cherchent des solutions de financement alternatives.' },
    ],
    courrier: { slug: 'mediation-credit', label: 'Modèle de saisine médiation du crédit' },
    ressources: [
      { href: '/courriers/mediation-credit', label: 'Courrier de médiation du crédit' },
      { href: '/aides', label: 'Aides financières et prêts alternatifs' },
      { href: '/procedures', label: 'Mandat ad hoc et conciliation' },
      { href: '/parler', label: 'Parler à quelqu\'un maintenant' },
    ],
  },
  'impots-impayes': {
    titre: 'Impôts impayés : comment régulariser sans panique ?',
    metaTitle: 'Impôts impayés : comment régulariser ? — Solelis',
    metaDesc: 'TVA, IS, impôts impayés ? Délais de paiement, CCSF, remise gracieuse — toutes vos options pour régulariser votre situation fiscale.',
    intro: 'Des impôts impayés, ça fait peur. Mais l\'administration fiscale n\'est pas votre ennemie : elle accorde des délais, des échelonnements, et parfois même des remises gracieuses. La clé, c\'est de ne pas rester silencieux.',
    loi: 'Le droit de reprise de l\'administration fiscale (pour rectifier un impôt) est en principe de 3 ans pour l\'IR, l\'IS et la TVA (art. L169 et L176 LPF) ; une fois l\'impôt mis en recouvrement, le Trésor a 4 ans pour le recouvrer (art. L274 LPF). Vous pouvez demander un délai au SIE, saisir la CCSF pour un échelonnement global, demander une remise gracieuse (art. L247 LPF), négocier une transaction sur les pénalités (art. L247 LPF), ou obtenir un sursis de paiement en cas de contestation formelle (art. L277 LPF). Un dégrèvement d\'office est aussi possible si l\'administration a commis une erreur en votre défaveur.',
    etapes: [
      { titre: 'Contactez votre SIE immédiatement', texte: 'Le Service des Impôts des Entreprises est votre interlocuteur direct. Un contribuable qui demande est toujours mieux traité qu\'un contribuable qui se cache.' },
      { titre: 'Saisissez la CCSF', texte: 'Si vous avez à la fois des dettes fiscales ET sociales, la CCSF les regroupe en un seul échéancier. Guichet unique gratuit.' },
      { titre: 'Demandez une remise gracieuse', texte: 'En cas de gêne ou indigence, réduction totale ou partielle de l\'impôt (pas de la TVA). Ce n\'est ni automatique ni un droit : l\'administration apprécie votre situation (art. L247 LPF).' },
      { titre: 'Contestez si erreur', texte: 'Dans votre réclamation, demandez expressément le sursis de paiement (art. L277 LPF) : le recouvrement de la somme contestée est alors suspendu (des garanties peuvent être demandées au-delà d\'un certain montant). Un dégrèvement d\'office est possible si l\'erreur vient d\'eux.' },
      { titre: 'Transaction fiscale', texte: 'Accord écrit : vous renoncez à contester, l\'administration réduit les amendes et majorations (pas l\'impôt lui-même), tant qu\'elles ne sont pas définitives (art. L247 LPF). Utile pour mettre fin à un litige long.' },
      { titre: 'Vérifiez les prescriptions', texte: 'Avec votre expert-comptable : droit de reprise de 3 ans en principe (IR, IS, TVA) et 4 ans pour recouvrer un impôt mis en recouvrement (art. L274 LPF). Cela peut réduire le montant dû.' },
    ],
    courrier: { slug: 'echelonnement-impots', label: 'Modèle de courrier impôts' },
    ressources: [
      { href: '/courriers/echelonnement-impots', label: 'Courrier de demande de délai' },
      { href: '/aides', label: 'Aides financières d\'urgence' },
      { href: '/glossaire', label: 'Comprendre les procédures' },
      { href: '/parler', label: 'Parler à quelqu\'un maintenant' },
    ],
  },
};

/** Ordre d'affichage et slugs des situations. */
export const SLUGS_SITUATIONS = Object.keys(SITUATIONS);

export interface EntiteVeille {
  /** Tag posé par la veille sur une actu (`situation:<slug>`). */
  tag: string;
  nom: string;
  /** Autres façons d'en parler dans la presse : aident la veille à relier une actu à la situation. */
  autres_noms: string[];
}

/** Nom court et synonymes de chaque situation, pour la veille. */
const NOMS_VEILLE: Record<string, { nom: string; autres_noms: string[] }> = {
  'dettes-urssaf': {
    nom: 'Dettes URSSAF',
    autres_noms: ['cotisations sociales', 'échéancier URSSAF', 'mise en demeure URSSAF', 'contrainte URSSAF', 'majorations de retard', 'MSA', 'CCSF'],
  },
  'dettes-fournisseurs': {
    nom: 'Dettes fournisseurs',
    autres_noms: ['factures impayées', 'délais de paiement', 'retards de paiement', 'Médiateur des entreprises', 'injonction de payer', 'créanciers'],
  },
  'credit-bancaire': {
    nom: 'Crédit bancaire',
    autres_noms: ['médiation du crédit', 'Banque de France', 'PGE', 'prêt garanti par l\'État', 'découvert', 'Bpifrance', 'concours bancaires'],
  },
  'impots-impayes': {
    nom: 'Impôts impayés',
    autres_noms: ['dettes fiscales', 'SIE', 'CCSF', 'plan de règlement', 'TVA impayée', 'remise gracieuse', 'CODEFI'],
  },
};

/** Contenu de https://solelis.com/veille/entites.json (généré depuis la liste des situations). */
export function entitesVeille(): EntiteVeille[] {
  return SLUGS_SITUATIONS.map((slug) => ({
    tag: `situation:${slug}`,
    nom: NOMS_VEILLE[slug]?.nom ?? SITUATIONS[slug].titre,
    autres_noms: NOMS_VEILLE[slug]?.autres_noms ?? [],
  }));
}
