import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/proteger-famille' },
  title: 'Protéger votre famille et votre patrimoine — Solelis',
  description:
    'Résidence principale, régime matrimonial, cautions personnelles, protection des enfants : tout ce qu’il faut savoir pour protéger votre famille.',
};

/* ---------- checklist data ---------- */

const checklist = [
  {
    label: 'Vérifier mon régime matrimonial',
    url: 'https://notaires.fr',
    urlLabel: 'notaires.fr',
  },
  {
    label: 'Faire vérifier mes cautions par un avocat',
    url: null,
    urlLabel: null,
  },
  {
    label: 'Consulter un notaire pour protéger mon patrimoine',
    url: null,
    urlLabel: null,
  },
  {
    label: 'Demander la CSS si mes revenus ont baissé',
    url: 'https://www.complementaire-sante-solidaire.gouv.fr',
    urlLabel: 'complementaire-sante-solidaire.gouv.fr',
  },
];

/* ---------- component ---------- */

export default function ProtegerFamillePage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Patrimoine &amp; famille
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Protéger votre famille
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Quand l’entreprise vacille, la première question est
          souvent : qu’est-ce que ma famille risque ? Voici les
          réponses.
        </p>
      </div>

      {/* ---- Section 1 : Résidence principale ---- */}
      <div className="mt-12 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-vert"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Votre résidence principale
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-soft border-l-4 border-vert flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Entrepreneur individuel (EI)
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Depuis la loi Macron 2015, la résidence principale est
              <strong className="text-navy/80"> AUTOMATIQUEMENT </strong>
              protégée contre les créanciers professionnels.
              Aucune démarche nécessaire.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-vert flex flex-col p-5">
            <h3 className="font-display text-base text-navy">EIRL</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Supprimé en 2022. Tous les EI bénéficient
              désormais de la séparation automatique des patrimoines
              — plus besoin de ce statut.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-vert flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Société (SARL, SAS, SA)
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              La résidence n’est
              <strong className="text-navy/80"> PAS </strong>
              automatiquement protégée. La protection dépend
              de votre régime matrimonial et des cautions que vous avez
              signées.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-vert flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Déclaration d’insaisissabilité
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Existe encore pour les <strong className="text-navy/80">AUTRES</strong> biens
              immobiliers (pas la résidence). Doit être faite chez le
              notaire. Ne protège que contre les dettes
              POSTÉRIEURES à la déclaration.
            </p>
          </article>
        </div>
      </div>

      {/* ---- Section 2 : Régime matrimonial ---- */}
      <div className="mt-10 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-jaune"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Votre régime matrimonial
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-soft border-l-4 border-jaune flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Communauté légale (défaut)
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Les biens communs
              <strong className="text-navy/80"> PEUVENT </strong>
              être saisis pour payer les dettes de l’entreprise.
              Risque réel pour le conjoint.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-jaune flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Séparation de biens
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Seuls VOS biens personnels sont à risque. Ceux du conjoint sont
              protégés — sauf s’il a co-signé une
              caution.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-jaune flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Changement de régime
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Possible par acte notarié (coût à
              demander au notaire).
              <strong className="text-navy/80"> ATTENTION :</strong> doit
              être fait AVANT les difficultés — un changement
              effectué pour frauder les créanciers peut être
              annulé par le juge.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-jaune flex flex-col p-5">
            <h3 className="font-display text-base text-navy">Délai</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Depuis 2019, il n’y a plus de délai d’attente de
              2 ans pour changer de régime matrimonial. La
              procédure est donc plus rapide qu’avant.
            </p>
          </article>
        </div>
      </div>

      {/* ---- Section 3 : Cautions personnelles ---- */}
      <div className="mt-10 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-rouge"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Cautions personnelles
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-soft border-l-4 border-rouge flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Ce que c’est
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Un engagement personnel à payer les dettes de
              l’entreprise avec VOS biens. Cet engagement
              <strong className="text-navy/80"> survit à la liquidation </strong>
              de l’entreprise.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-rouge flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Peut-on les contester ?
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              <strong className="text-vert">OUI</strong> si disproportionnée
              par rapport à vos revenus et patrimoine au moment de la
              signature (art. 2297 Code civil).
              <strong className="text-vert"> OUI</strong> si le formalisme n’a
              pas été respecté (mentions manuscrites).
            </p>
          </article>

          <article className="glass-soft border-l-4 border-rouge flex flex-col p-5">
            <h3 className="font-display text-base text-navy">Le conjoint</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Si le conjoint n’a PAS co-signé, ses biens personnels
              sont protégés — même en communauté,
              seuls les biens propres du signataire sont à risque selon la
              jurisprudence.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-rouge flex flex-col p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base text-navy">Conseil</h3>
              <span className="pastille text-rouge">Important</span>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Faites vérifier
              <strong className="text-navy/80"> TOUTES </strong>
              vos cautions par un avocat — beaucoup sont contestables.
            </p>
          </article>
        </div>
      </div>

      {/* ---- Section 4 : Protection des enfants ---- */}
      <div className="mt-10 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-bleu"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Protection des enfants
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="glass-soft border-l-4 border-bleu flex flex-col p-5">
            <h3 className="font-display text-base text-navy">
              Donation-partage
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Possible pour transférer des actifs aux enfants,
              <strong className="text-navy/80"> MAIS </strong>
              attention — en cas de procédure collective, une
              donation faite pendant la période suspecte (qui peut
              remonter jusqu’à 18 mois avant le jugement) ou dans les
              6 mois qui la précèdent peut être annulée, et un
              créancier peut agir en action paulienne s’il prouve la
              fraude.
            </p>
          </article>

          <article className="glass-soft border-l-4 border-bleu flex flex-col p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base text-navy">Conseil</h3>
              <span className="pastille text-bleu">Anticipez</span>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
              Ne PAS transférer d’actifs une fois les
              difficultés commencées. Consultez un notaire
              <strong className="text-navy/80"> EN AMONT</strong>.
            </p>
          </article>
        </div>
      </div>

      {/* ---- Section 5 : Que faire concrètement ---- */}
      <div className="mt-10 glass card-top-line p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full bg-bleu-fonce"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            Que faire concrètement
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {checklist.map((item) => (
            <article
              key={item.label}
              className="glass-soft border-l-4 border-bleu-fonce flex flex-col p-5"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-bleu-fonce/40"
                  aria-hidden="true"
                />
                <h3 className="font-display text-base text-navy">
                  {item.label}
                </h3>
              </div>
              {item.url && (
                <div className="mt-3 pl-8 text-sm">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-bleu-fonce underline underline-offset-4"
                  >
                    {item.urlLabel}
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        La protection du patrimoine familial est un sujet technique. Un notaire et
        un avocat peuvent vous conseiller — une première consultation
        gratuite est possible dans un point-justice (3039).
      </div>
    </section>
  );
}
