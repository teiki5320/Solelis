import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/parler' },
  title: 'Parler à quelqu\'un maintenant — Solelis',
  description:
    'Numéros d’écoute et d’orientation pour les dirigeant·e·s en difficulté : APESA, 3114, CCI, SOS Amitié, Conseillers-Entreprises.',
};

const contacts = [
  {
    name: 'APESA',
    phone: 'Trouver mon APESA',
    tel: null,
    description:
      'Soutien psychologique gratuit et confidentiel pour les entrepreneur·e·s en souffrance : un·e psychologue vous contacte après l’alerte d’une « sentinelle » (greffe, mandataire, expert-comptable…), avec votre accord · Pas un service d’urgence : en cas de crise, 3114',
    url: 'https://www.apesa-france.com',
    urlLabel: 'www.apesa-france.com',
    color: 'bg-bleu/10 text-bleu-fonce',
  },
  {
    name: '3114',
    phone: '3114',
    tel: '3114',
    description:
      'Numéro national de prévention du suicide · 24 h/24, 7 j/7 · Gratuit',
    url: null,
    urlLabel: null,
    color: 'bg-rouge/10 text-rouge',
  },
  {
    name: 'Votre CCI',
    phone: 'Trouver ma CCI',
    tel: null,
    description:
      'Orientation et prévention des difficultés par le réseau des CCI · Coordonnées de la CCI de votre territoire sur cci.fr',
    url: 'https://www.cci.fr',
    urlLabel: 'www.cci.fr',
    color: 'bg-jaune/10 text-jaune',
  },
  {
    name: 'SOS Amitié',
    phone: '09 72 39 40 50',
    tel: '+33972394050',
    description: 'Écoute anonyme et gratuite · 24 h/24, 7 j/7 · Prix d’un appel selon votre opérateur',
    url: null,
    urlLabel: null,
    color: 'bg-vert/10 text-vert',
  },
  {
    name: 'Conseillers-Entreprises',
    phone: 'Demande en ligne',
    tel: null,
    description:
      'Service public gratuit · Décrivez votre situation en ligne : un·e conseiller·ère de votre territoire vous rappelle',
    url: 'https://conseillers-entreprises.service-public.gouv.fr',
    urlLabel: 'conseillers-entreprises.service-public.gouv.fr',
    color: 'bg-bleu/10 text-bleu-fonce',
  },
  {
    name: 'Banque de France TPE-PME',
    phone: '34 14',
    tel: '3414',
    description:
      'Correspondant TPE-PME · Orientation gratuite · Prix d’un appel local',
    url: 'https://entreprises.banque-france.fr',
    urlLabel: 'entreprises.banque-france.fr',
    color: 'bg-navy/10 text-navy',
  },
  {
    name: 'Médiation du crédit',
    phone: '34 14',
    tel: '3414',
    description:
      'Rétablir le dialogue avec votre banque · Gratuit · Confidentiel',
    url: 'https://mediateur-credit.banque-france.fr',
    urlLabel: 'mediateur-credit.banque-france.fr',
    color: 'bg-vert/10 text-vert',
  },
];

export default function ParlerPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-6 pb-20 sm:pt-14">
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Vous n&apos;êtes pas seul·e
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Parler à quelqu&apos;un — maintenant
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Vous n&apos;avez pas besoin de tout expliquer. Décrochez, c&apos;est tout.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {contacts.map((c) => (
          <article
            key={c.name}
            className="glass card-top-line flex flex-col items-center p-8 text-center"
          >
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${c.color}`}
            >
              {c.name}
            </span>

            <a
              href={c.tel ? `tel:${c.tel}` : (c.url ?? undefined)}
              {...(c.tel ? {} : { target: '_blank', rel: 'noreferrer' })}
              className="btn-primary mt-6 w-full text-xl tracking-wide sm:text-2xl"
            >
              <span aria-hidden="true" className="mr-1">📞</span>
              {c.phone}
            </a>

            <p className="mt-4 text-sm leading-relaxed text-navy/70">
              {c.description}
            </p>

            {c.url && (
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 text-sm text-bleu-fonce underline underline-offset-4"
              >
                {c.urlLabel}
              </a>
            )}
          </article>
        ))}
      </div>

      <p className="mt-14 text-center text-base text-navy/60 sm:text-lg">
        Ces services sont confidentiels, et la plupart sont gratuits.<br />
        Personne ne vous jugera.
      </p>
    </section>
  );
}
