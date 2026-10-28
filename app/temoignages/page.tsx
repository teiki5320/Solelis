import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/temoignages' },
  title: 'Exemples de parcours (fictifs) — Solelis',
  description: 'Exemples fictifs, inspirés de situations courantes, de dirigeant·e·s en difficulté : prévention, redressement, cession, liquidation puis rebond.',
};

interface Temoignage {
  prenom: string;
  situation: string;
  secteur: string;
  region: string;
  annee: string;
  citation: string;
  contexte: string;
  aidePar: string[];
  issue: string;
  issueCouleur: 'vert' | 'bleu' | 'jaune';
}

const TEMOIGNAGES: Temoignage[] = [
  {
    prenom: 'Marc',
    situation: 'Cessation de paiements',
    secteur: 'Restauration',
    region: 'Lyon (69)',
    annee: 'Exemple fictif',
    citation:
      "J’ai mis trois mois à accepter que mon restaurant ne s’en sortirait pas seul. Quand j’ai enfin pris rendez-vous au CIP, on m’a expliqué calmement les options. Le redressement judiciaire a gelé les dettes antérieures, et l’administrateur m’a aidé à renégocier le bail et à réorganiser l’équipe. Aujourd’hui le restaurant tourne, pas comme avant, mais il tourne. Le plus dur, c’est de demander de l’aide. Après, ça va.",
    contexte:
      'Gérant d’un restaurant de 8 salariés. Après le Covid et la hausse des matières premières, les impayés fournisseurs et URSSAF se sont accumulés. Accompagné par un CIP (centre d’information sur la prévention), puis par un administrateur judiciaire désigné par le tribunal.',
    aidePar: ['CIP (Centre d’information sur la prévention)', 'Administrateur judiciaire', 'CCI'],
    issue: 'Plan de redressement sur 8 ans arrêté par le tribunal, activité poursuivie',
    issueCouleur: 'vert',
  },
  {
    prenom: 'Sophie',
    situation: 'Liquidation puis rebond',
    secteur: 'Commerce de détail',
    region: 'Bordeaux (33)',
    annee: 'Exemple fictif',
    citation:
      "La liquidation, c’est un deuil. J’ai pleuré, j’ai eu honte, je me suis isolée. C’est une psychologue d’APESA, alertée par le greffe du tribunal, qui m’a aidée à remonter. Quelques mois plus tard, j’ai commencé à réfléchir à un nouveau projet. Aujourd’hui je suis consultante en merchandising, en auto-entreprise. Je ne regrette pas d’avoir essayé. Je regrette d’avoir attendu si longtemps avant de parler.",
    contexte:
      'Gérante d’une boutique de prêt-à-porter, 3 salariées. Baisse continue du chiffre d’affaires face au e-commerce. Dépôt de bilan après 18 mois de difficultés de trésorerie. Soutenue par APESA et 60 000 Rebonds.',
    aidePar: ['APESA (soutien psychologique)', '60 000 Rebonds', 'France Travail (ATI)'],
    issue: 'Liquidation judiciaire, puis création d’une activité de conseil quelques mois plus tard',
    issueCouleur: 'bleu',
  },
  {
    prenom: 'Thierry',
    situation: 'Prévention réussie (mandat ad hoc)',
    secteur: 'BTP',
    region: 'Lille (59)',
    annee: 'Exemple fictif',
    citation:
      "Mon expert-comptable m’a dit : « Thierry, dans six mois vous ne pourrez plus payer les salaires. » Ça m’a fait l’effet d’une gifle. Il m’a parlé du mandat ad hoc, une procédure confidentielle que l’on demande au président du tribunal. Le mandataire ad hoc a négocié avec ma banque et deux fournisseurs clés. Tout est resté confidentiel, vis-à-vis des salariés comme des clients. En quatre mois, un accord était trouvé. Si j’avais attendu la cessation des paiements, les solutions auraient été bien plus lourdes.",
    contexte:
      'Dirigeant d’une entreprise de maçonnerie, 12 salariés. Impayé majeur d’un promoteur (120 000 euros) ayant déséquilibré la trésorerie. Le mandat ad hoc a permis un rééchelonnement bancaire et un accord amiable avec les fournisseurs.',
    aidePar: ['Expert-comptable', 'Mandataire ad hoc', 'Tribunal de commerce (président)'],
    issue: 'Difficultés résolues sans procédure collective, activité préservée',
    issueCouleur: 'vert',
  },
  {
    prenom: 'Nadia',
    situation: 'Redressement puis cession',
    secteur: 'Artisanat (boulangerie)',
    region: 'Montpellier (34)',
    annee: 'Exemple fictif',
    citation:
      "Quand le tribunal a ouvert le redressement, j’ai cru que c’était fini. En fait, c’est le contraire qui s’est passé : l’administrateur a trouvé un repreneur en trois mois. Un boulanger de la région qui cherchait un deuxième point de vente. Mes quatre salariés ont tous gardé leur poste. Moi, j’ai pu tourner la page, et surtout sans culpabilité. Le plus important, c’est que l’équipe a été protégée.",
    contexte:
      'Artisane boulangère, 4 salariés. Travaux de voirie devant la boutique pendant 8 mois ayant fait chuter le chiffre d’affaires de 60 %. Endettement progressif auprès du meunier et de l’URSSAF. Cession de l’activité dans le cadre d’un plan de cession arrêté par le tribunal.',
    aidePar: ['Administrateur judiciaire', 'Chambre de métiers et de l’artisanat', 'URSSAF (plan d’apurement)'],
    issue: 'Plan de cession arrêté par le tribunal, les 4 emplois repris par le repreneur',
    issueCouleur: 'jaune',
  },
];

const ISSUE_CLASSES: Record<string, string> = {
  vert: 'bg-vert/10 text-vert',
  bleu: 'bg-bleu/10 text-bleu-fonce',
  jaune: 'bg-jaune/10 text-jaune',
};

export default function TemoignagesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-bleu-fonce/70">
          Exemples fictifs · inspirés de situations courantes
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-5xl">
          Des parcours possibles
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-navy/70">
          Ces quatre histoires sont des exemples fictifs : les personnes,
          prénoms, lieux et chiffres sont inventés. Elles illustrent des
          parcours possibles et montrent qu&apos;il existe souvent un
          chemin — même quand on ne le voit plus.
        </p>
      </div>

      <div className="space-y-6">
        {TEMOIGNAGES.map((t, i) => (
          <article key={i} className="glass card-top-line p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="pastille">{t.secteur}</span>
              <span className="pastille">{t.region}</span>
              <span className="pastille">{t.annee}</span>
            </div>
            <p className="font-display text-xl text-navy">
              {t.prenom}, {t.situation.toLowerCase()}
            </p>
            <blockquote className="mt-4 border-l-2 border-bleu/30 pl-4 text-sm italic text-navy/80 leading-relaxed">
              « {t.citation} »
            </blockquote>
            <p className="mt-4 text-sm text-navy/60">
              {t.contexte}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.aidePar.map((aide) => (
                <span
                  key={aide}
                  className="inline-flex rounded-lg bg-bleu/10 px-2.5 py-1 text-xs text-bleu-fonce"
                >
                  {aide}
                </span>
              ))}
            </div>
            <p className={`mt-4 rounded-xl px-4 py-3 text-sm ${ISSUE_CLASSES[t.issueCouleur]}`}>
              {t.issue}
            </p>
          </article>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-2xl border border-navy/10 bg-navy/5 px-6 py-4 text-center text-xs text-navy/60 leading-relaxed">
        Exemples fictifs, rédigés par Solelis à partir de situations
        courantes : ce ne sont pas des témoignages de personnes réelles.
        Les prénoms, lieux, dates et chiffres sont inventés. Ces récits
        illustrent des parcours types et ne constituent pas des conseils
        juridiques ; chaque situation est différente.
      </div>

      <div className="dashed-band mt-10 p-5 text-center text-sm text-navy/70">
        <p>
          Vous êtes passé·e par là et vous voulez aider d&apos;autres
          dirigeant·e·s ? Votre expérience compte — même quelques phrases.
        </p>
        <a
          href="mailto:solelis@toakeur.com?subject=Témoignage Solelis"
          className="mt-3 inline-flex text-bleu-fonce underline underline-offset-4"
        >
          Écrire à Solelis →
        </a>
      </div>
    </section>
  );
}
