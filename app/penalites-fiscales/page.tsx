import Link from 'next/link';
import { ogMeta } from '@/lib/og';

export const metadata = {
  ...ogMeta({
    chemin: '/penalites-fiscales',
    titre: 'Pénalités fiscales : comprendre et contester',
    sous: 'Intérêts, majorations 10/40/80 %, remises',
    description: 'Comprendre les pénalités fiscales (intérêts de retard, majorations 10/40/80 %), les voies de recours et de remise gracieuse.',
    cat: 'aide',
    pageTitle: 'Pénalités fiscales : intérêts, majorations, remises — Solelis',
  }),
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

interface Penalite {
  nom: string;
  taux: string;
  motif: string;
  reference: string;
  contestable: boolean;
}

const PENALITES: Penalite[] = [
  { nom: 'Intérêts de retard', taux: '0,20 % par mois (2,40 %/an)', motif: 'Tout retard de déclaration ou de paiement.', reference: 'CGI art. 1727', contestable: true },
  { nom: 'Majoration pour retard de paiement', taux: '5 %', motif: 'Paiement après échéance, sans rappel.', reference: 'CGI art. 1731', contestable: true },
  { nom: 'Majoration pour défaut de déclaration', taux: '10 %', motif: 'Déclaration tardive sans mise en demeure.', reference: 'CGI art. 1728-1-a', contestable: true },
  { nom: 'Majoration après mise en demeure', taux: '40 %', motif: 'Déclaration > 30 j après mise en demeure.', reference: 'CGI art. 1728-1-b', contestable: true },
  { nom: 'Majoration pour activité occulte', taux: '80 %', motif: 'Travail dissimulé, activité non déclarée.', reference: 'CGI art. 1728-1-c', contestable: true },
  { nom: 'Manquement délibéré', taux: '40 %', motif: 'Volonté manifeste de tromper l\'administration.', reference: 'CGI art. 1729-a', contestable: true },
  { nom: 'Manœuvres frauduleuses', taux: '80 %', motif: 'Manœuvres caractérisées (fausses factures, comptabilité fictive).', reference: 'CGI art. 1729-c', contestable: true },
  { nom: 'Abus de droit (rectification)', taux: '40 % à 80 %', motif: 'Montage artificiel à but exclusivement fiscal.', reference: 'CGI art. 1729-b, LPF art. L64', contestable: true },
];

export default function PenalitesFiscalesPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <Link href="/situation/impots-impayes" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Impôts impayés
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Pénalités fiscales : tout comprendre, tout contester
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">
        Une mise en demeure ou un avis avec pénalités ? La plupart sont négociables ou contestables. Voici les
        barèmes officiels, les motifs, et les voies de remise.
      </p>

      {/* Tableau pénalités */}
      <section className="mt-10">
        <h2 className="font-display text-xl text-navy">Les principales pénalités</h2>
        <div className="mt-4 space-y-3">
          {PENALITES.map((p) => (
            <article key={p.nom} className="glass-soft rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base text-navy">{p.nom}</p>
                  <p className="mt-1 text-xs text-navy/55">{p.reference}</p>
                </div>
                <span className="rounded-full bg-rouge/10 px-3 py-1 text-sm font-medium text-rouge">{p.taux}</span>
              </div>
              <p className="mt-3 text-sm text-navy/80">{p.motif}</p>
              <p className="mt-2 text-xs">
                {p.contestable ? (
                  <span className="rounded-full bg-vert/10 px-2 py-0.5 text-vert">✓ Contestable / remise possible</span>
                ) : (
                  <span className="rounded-full bg-navy/10 px-2 py-0.5 text-navy/70">Légale, application automatique</span>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Voies de recours */}
      <section className="mt-12">
        <h2 className="font-display text-xl text-navy">Comment obtenir une remise ou un échelonnement</h2>

        <article className="glass card-top-line mt-5 p-6">
          <h3 className="font-display text-lg text-navy">1️⃣ Remise gracieuse (LPF art. L247)</h3>
          <p className="mt-2 text-sm text-navy/80">
            L&apos;administration peut accorder une remise totale ou partielle des majorations, amendes et, le cas
            échéant, intérêts de retard devenus définitifs ; et, pour les impôts directs, de l&apos;impôt lui-même
            <strong>en cas de gêne ou d&apos;indigence</strong> (pas pour la TVA). C&apos;est une faculté, pas un droit. La demande est gratuite et confidentielle.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>Demande motivée à votre SIE (Service des Impôts des Entreprises)</li>
            <li>Pièces : dernier bilan, état de trésorerie, justificatifs de la difficulté</li>
            <li>Délai de réponse : non garanti</li>
            <li>Réponse motivée par écrit, recours possible</li>
          </ul>
        </article>

        <article className="glass card-top-line mt-5 p-6">
          <h3 className="font-display text-lg text-navy">2️⃣ Délai de paiement / échelonnement</h3>
          <p className="mt-2 text-sm text-navy/80">
            Vous pouvez demander un échelonnement de votre dette fiscale. Il n&apos;est pas automatique : il suppose
            des difficultés passagères, des déclarations à jour et, en principe, des garanties. Les intérêts de retard
            continuent de courir pendant l&apos;échelonnement.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>Demande au SIE de votre département</li>
            <li>Plan maintenu tant que vous payez les échéances et vos impôts courants</li>
            <li>Si dettes fiscales ET sociales : passer par la <strong>CCSF</strong> (guichet unique)</li>
          </ul>
        </article>

        <article className="glass card-top-line mt-5 p-6">
          <h3 className="font-display text-lg text-navy">3️⃣ Contester une rectification</h3>
          <p className="mt-2 text-sm text-navy/80">
            Si vous estimez la pénalité injustifiée (manquement délibéré non caractérisé, manœuvres non
            établies, abus de droit contestable), <strong>vous pouvez contester jusqu&apos;au 31 décembre de la 2e année suivant la mise en recouvrement</strong> (3e année après une proposition de rectification ; LPF art. R196-1 et R196-3).
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>Réclamation écrite au SIE dans le délai ci-dessus (ne jamais l&apos;oublier)</li>
            <li>Recours hiérarchique gratuit (auprès du supérieur hiérarchique de votre interlocuteur)</li>
            <li>Conciliateur fiscal départemental : recours médiateur, gratuit</li>
            <li>Tribunal administratif : si désaccord persistant</li>
          </ul>
        </article>

        <article className="glass card-top-line mt-5 p-6">
          <h3 className="font-display text-lg text-navy">4️⃣ Procédure de redressement / liquidation</h3>
          <p className="mt-2 text-sm text-navy/80">
            En procédure collective, les pénalités fiscales sont déclarées au passif par le comptable public comme les
            autres créances fiscales. En cas de plan : étalées sur 10 ans max (art. L626-12 C. com.). En liquidation
            close pour insuffisance d&apos;actif : le Trésor ne retrouve pas, sauf exceptions, le droit de vous
            poursuivre (art. L643-11 C. com.).
          </p>
        </article>
      </section>

      {/* Conseils */}
      <div className="mt-12 rounded-2xl border border-bleu/30 bg-bleu/5 p-6">
        <h2 className="font-display text-lg text-bleu-fonce">Conseils pratiques</h2>
        <ul className="mt-3 space-y-2 text-sm text-navy/80">
          <li>✓ Ne laissez jamais une mise en demeure sans réponse — sans déclaration dans les 30 jours, la majoration passe de 10 % à 40 % (CGI art. 1728)</li>
          <li>✓ Demandez systématiquement la remise gracieuse en amont d&apos;un échéancier — c&apos;est gratuit et confidentiel</li>
          <li>✓ Conservez tous les courriers, accusés de réception, copies d&apos;écran (preuve en cas de contestation)</li>
          <li>✓ Le conciliateur fiscal départemental est gratuit : saisissez-le si votre désaccord avec le service des impôts persiste</li>
          <li>✓ Si vous êtes en procédure : ne payez aucune dette antérieure au jugement d&apos;ouverture (interdiction légale, art. L622-7 C. com.)</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dettes-fiscales-sociales" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Dettes fiscales et sociales
        </Link>
        <Link href="/faq/urssaf-impayee" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          FAQ URSSAF (équivalent social)
        </Link>
        <Link href="/courriers" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Modèles de courriers
        </Link>
        <Link href="/outils/calendrier-fiscal" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Calendrier fiscal
        </Link>
      </div>

      <p className="mt-12 text-xs text-navy/50">
        Sources : Code général des impôts (CGI) art. 1727 à 1729 ; Livre des procédures fiscales (LPF) art. L247
        et R196-1 ; impots.gouv.fr ; jurisprudence Conseil d&apos;État sur la caractérisation des manœuvres et
        manquements délibérés.
      </p>
    </section>
  );
}
