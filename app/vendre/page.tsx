import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/vendre' },
  title: 'Vendre ou transmettre votre entreprise — Solelis',
  description:
    'Cession de fonds de commerce, cession de parts, location-gérance, plan de cession, vente à la barre  -  toutes vos options expliquées simplement.',
};

/* ---------- data ---------- */

type Option = {
  titre: string;
  borderColor: string;
  dotColor: string;
  champs: { label: string; value: string }[];
  conseil: string;
};

const options: Option[] = [
  {
    titre: 'Cession de fonds de commerce',
    borderColor: 'border-vert',
    dotColor: 'bg-vert',
    champs: [
      {
        label: 'Quoi',
        value:
          'Vente de l’activité (clientèle, marque, bail, équipement) à un repreneur.',
      },
      {
        label: 'Quand',
        value:
          'À tout moment, même en difficulté. En procédure collective, nécessite autorisation du juge-commissaire.',
      },
      {
        label: 'Avantages',
        value:
          'Préserve l’activité et les emplois. Le repreneur ne reprend PAS les dettes du vendeur (mais les contrats de travail lui sont transférés — C. trav. art. L1224-1).',
      },
      {
        label: 'Formalités',
        value:
          'Publication dans un journal d’annonces légales sous 15 jours, puis au BODACC. Les créanciers ont 10 jours après la publication au BODACC pour s’opposer au paiement du prix.',
      },
      {
        label: 'Coût',
        value:
          'Droits d’enregistrement : 0 % jusqu’à 23 000 €, 3 % de 23 000 à 200 000 €, 5 % au-delà. En principe à la charge de l’acheteur (l’acte peut prévoir autre chose).',
      },
      {
        label: 'Salarié·e·s',
        value:
          'Hors procédure collective ou conciliation, et hors vente à un·e conjoint·e, ascendant·e ou descendant·e : entreprise de moins de 50 salarié·e·s (ou sans CSE, carence constatée), informez chaque salarié·e au moins 1 mois avant la vente. En cas de manquement : amende civile jusqu’à 0,5 % du montant de la vente, prononcée par le tribunal à la demande du ministère public (C. com. art. L141-23, modifié par la loi n° 2026-403 du 26 mai 2026). Pour les ventes conclues avant le 26 juillet 2026, le délai était de 2 mois et l’amende pouvait atteindre 2 %. À partir de 50 salarié·e·s, s’il existe un CSE, c’est lui qui est informé et consulté (art. L141-28).',
      },
    ],
    conseil:
      'Faites évaluer votre fonds par un expert-comptable avant toute négociation.',
  },
  {
    titre: 'Cession de parts sociales',
    borderColor: 'border-bleu',
    dotColor: 'bg-bleu',
    champs: [
      {
        label: 'Quoi',
        value:
          'Vente de vos parts/actions dans la société (SARL, SAS, SA).',
      },
      {
        label: 'Quand',
        value:
          'À tout moment. Respecter les clauses d’agrément des statuts.',
      },
      {
        label: 'Attention',
        value:
          'Ne vous libère PAS de vos cautions personnelles : seul le créancier (la banque) peut accepter de vous en décharger, par exemple contre une nouvelle garantie du repreneur.',
      },
      {
        label: 'Salarié·e·s',
        value:
          'Cession de plus de 50 % du capital, hors procédure collective ou conciliation, et hors cession à un·e conjoint·e, ascendant·e ou descendant·e : société de moins de 50 salarié·e·s (ou sans CSE, carence constatée), informez chaque salarié·e au moins 1 mois avant. En cas de manquement : amende civile jusqu’à 0,5 % du montant de la vente, prononcée par le tribunal à la demande du ministère public (C. com. art. L23-10-1, modifié par la loi n° 2026-403 du 26 mai 2026). Pour les cessions conclues avant le 26 juillet 2026, le délai était de 2 mois et l’amende pouvait atteindre 2 %. À partir de 50 salarié·e·s, s’il existe un CSE, c’est lui qui est informé et consulté (art. L23-10-7).',
      },
      {
        label: 'Si en difficulté',
        value:
          'La valeur peut être faible voire nulle  -  mais c’est parfois mieux que la liquidation.',
      },
    ],
    conseil:
      'Un avocat doit vérifier que la cession vous libère bien de vos engagements personnels.',
  },
  {
    titre: 'Location-gérance',
    borderColor: 'border-jaune',
    dotColor: 'bg-jaune',
    champs: [
      {
        label: 'Quoi',
        value:
          'Vous restez propriétaire mais un tiers exploite l’entreprise et vous verse un loyer.',
      },
      {
        label: 'Quand',
        value:
          'Alternative à la vente. En procédure, le tribunal peut l’autoriser même contre les clauses du bail.',
      },
      {
        label: 'Avantages',
        value:
          'Revenus sans exploiter. Le locataire-gérant peut devenir acheteur ensuite.',
      },
      {
        label: 'Durée',
        value:
          'Libre. Dans un plan de cession, l’entreprise doit être effectivement vendue dans les 2 ans du jugement qui arrête le plan (art. L642-15 Code de commerce).',
      },
    ],
    conseil:
      'La location-gérance peut être un tremplin vers une vente dans de meilleures conditions.',
  },
  {
    titre: 'Plan de cession (redressement ou liquidation judiciaire)',
    borderColor: 'border-rouge',
    dotColor: 'bg-rouge',
    champs: [
      {
        label: 'Quoi',
        value:
          'Le tribunal ordonne le transfert de tout ou partie de l’entreprise à un repreneur.',
      },
      {
        label: 'Quand',
        value:
          'En redressement judiciaire, quand l’entreprise ne peut pas se redresser seule (art. L631-22 Code de commerce), ou en liquidation judiciaire (art. L642-1).',
      },
      {
        label: 'Le repreneur',
        value:
          'Reprend l’activité et les contrats de travail compris dans son offre, mais PAS les dettes antérieures (sauf exceptions, par exemple certains prêts ayant financé des biens repris — art. L642-12).',
      },
      {
        label: 'Interdiction',
        value:
          'Le dirigeant (de droit ou de fait) et ses parents ou alliés jusqu’au 2e degré ne peuvent pas présenter d’offre (art. L642-3 Code de commerce), sauf autorisation exceptionnelle du tribunal, sur requête du ministère public, par un jugement spécialement motivé.',
      },
    ],
    conseil:
      'Si un repreneur vous contacte, orientez-le vers le mandataire judiciaire.',
  },
  {
    titre: 'Vente à la barre du tribunal',
    borderColor: 'border-rouge',
    dotColor: 'bg-rouge',
    champs: [
      {
        label: 'Quoi',
        value:
          'Vente aux enchères des biens de l’entreprise (immeubles, matériel…) ordonnée par le juge-commissaire pendant la liquidation (art. L642-18 et L642-19 Code de commerce).',
      },
      {
        label: 'Quand',
        value: 'Pendant une liquidation judiciaire.',
      },
      {
        label: 'Prix',
        value:
          'Souvent en dessous de la valeur  -  mais rapide.',
      },
      {
        label: 'Interdiction',
        value:
          'Même interdiction que pour le plan de cession (dirigeant, parents ou alliés jusqu’au 2e degré), sauf dérogation du juge-commissaire sur requête du ministère public (art. L642-20).',
      },
    ],
    conseil:
      'La vente à la barre est la dernière étape  -  explorez toutes les autres options avant.',
  },
];

/* ---------- component ---------- */

export default function VendrePage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Vos options
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Vendre, céder ou transmettre
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Vendre n’est pas un échec — c’est parfois la
          meilleure décision pour vous, vos salariés et votre
          famille.
        </p>
      </div>

      {/* Option cards */}
      <div className="mt-12 space-y-8">
        {options.map((o) => (
          <article
            key={o.titre}
            className={`glass card-top-line border-l-4 ${o.borderColor} p-6 sm:p-8`}
          >
            {/* Title with dot */}
            <div className="mb-5 flex items-center gap-3">
              <span
                className={`inline-block h-3 w-3 rounded-full ${o.dotColor}`}
                aria-hidden="true"
              />
              <h2 className="font-display text-xl text-navy sm:text-2xl">
                {o.titre}
              </h2>
            </div>

            {/* Detail fields */}
            <dl className="space-y-3 text-sm">
              {o.champs.map((c) => (
                <div key={c.label}>
                  <dt className="font-semibold text-navy/80">{c.label}</dt>
                  <dd className="mt-0.5 leading-relaxed text-navy/65">
                    {c.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Conseil */}
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-navy/[0.04] px-4 py-3 text-sm leading-relaxed text-navy/75">
              <span className="mt-0.5 shrink-0 font-semibold text-navy/80">
                Conseil :
              </span>
              <span>« {o.conseil} »</span>
            </div>
          </article>
        ))}
      </div>

      {/* Dashed band disclaimer */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        Chaque option a ses conséquences fiscales et sociales. Consultez
        votre expert-comptable et un avocat avant de vous engager.
      </div>

      {/* Bottom links */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/courriers" className="btn-ghost">
          Modèles de courriers
        </Link>
        <Link href="/procedures" className="btn-ghost">
          Comprendre les procédures
        </Link>
        <Link href="/parler" className="btn-ghost">
          Parler à quelqu’un
        </Link>
      </div>
    </section>
  );
}
