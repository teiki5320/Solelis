import Link from 'next/link';
import { ogMeta } from '@/lib/og';

export const metadata = {
  ...ogMeta({
    chemin: '/mediation-vs-conciliation',
    titre: 'Médiation, mandat ad hoc, conciliation',
    sous: 'Quelle procédure amiable choisir ?',
    description: 'Quelle procédure amiable choisir entre la médiation (crédit ou entreprises), le mandat ad hoc et la conciliation : critères, durée, coût, confidentialité.',
    cat: 'procedure',
    pageTitle: 'Médiation, mandat ad hoc, conciliation : différences — Solelis',
  }),
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

export default function MediationVsConciliationPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <Link href="/procedures" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Procédures
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Médiation, mandat ad hoc, conciliation : quelles différences ?
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">
        Trois dispositifs distincts pour traiter une difficulté en amont d&apos;une procédure publique. À ne pas confondre.
      </p>

      <div className="mt-10 space-y-6">
        <article className="glass card-top-line p-6">
          <h2 className="font-display text-xl text-navy">🤝 La médiation (du crédit ou des entreprises)</h2>
          <p className="mt-3 text-sm text-navy/80">
            Procédure <strong>extra-judiciaire, gratuite, confidentielle</strong>, à initier par le dirigeant lui-même
            sur un litige précis. <strong>Aucune intervention du tribunal</strong>.
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-vert/5 p-3"><dt className="text-navy/55">Durée</dt><dd className="font-medium text-navy">Médiation du crédit : contact sous 48 h, puis 5 jours ouvrés pour les banques</dd></div>
            <div className="rounded-xl bg-vert/5 p-3"><dt className="text-navy/55">Coût</dt><dd className="font-medium text-navy">Gratuit</dd></div>
            <div className="rounded-xl bg-vert/5 p-3"><dt className="text-navy/55">Confidentielle</dt><dd className="font-medium text-navy">Oui (totalement)</dd></div>
            <div className="rounded-xl bg-vert/5 p-3"><dt className="text-navy/55">Taux de succès</dt><dd className="font-medium text-navy">Médiation du crédit : 64 % des dossiers éligibles en 2025 (Banque de France)</dd></div>
          </dl>
          <p className="mt-4 text-sm text-navy/80">
            <strong>Quand l&apos;utiliser</strong> : litige bancaire (refus de prêt, PGE), différend fournisseur ou client, désaccord sur un contrat commercial.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li><strong>Médiation du crédit</strong> (Banque de France, 34 14) — pour les litiges bancaires</li>
            <li><strong>Médiation des entreprises</strong> (saisine en ligne sur economie.gouv.fr) — pour les litiges entre entreprises</li>
            <li><strong>ARPE</strong> — pour les travailleurs des plateformes</li>
          </ul>
        </article>

        <article className="glass card-top-line p-6">
          <h2 className="font-display text-xl text-navy">📝 Le mandat ad hoc</h2>
          <p className="mt-3 text-sm text-navy/80">
            Procédure <strong>judiciaire mais confidentielle</strong>. Le président du tribunal nomme un mandataire ad hoc à la demande du dirigeant.
            La société <strong>n&apos;est pas en cessation des paiements</strong>.
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-bleu/5 p-3"><dt className="text-navy/55">Durée</dt><dd className="font-medium text-navy">Fixée par le président du tribunal (pas de durée légale)</dd></div>
            <div className="rounded-xl bg-bleu/5 p-3"><dt className="text-navy/55">Coût</dt><dd className="font-medium text-navy">Fixé par le président du tribunal, avec votre accord (art. L611-14)</dd></div>
            <div className="rounded-xl bg-bleu/5 p-3"><dt className="text-navy/55">Confidentielle</dt><dd className="font-medium text-navy">Oui (pas de publication BODACC)</dd></div>
            <div className="rounded-xl bg-bleu/5 p-3"><dt className="text-navy/55">Référence</dt><dd className="font-medium text-navy">C. com. art. L611-3</dd></div>
          </dl>
          <p className="mt-4 text-sm text-navy/80">
            <strong>Quand l&apos;utiliser</strong> : négocier globalement avec PLUSIEURS créanciers, restructurer une dette importante (banques, fournisseurs, fisc, social) dans un cadre formalisé.
          </p>
          <p className="mt-3 text-sm text-navy/80">
            <strong>Avantage clé</strong> : la nomination par le tribunal donne du poids au mandataire pour obtenir des concessions des créanciers, sans publicité ni risque procédural.
          </p>
        </article>

        <article className="glass card-top-line p-6">
          <h2 className="font-display text-xl text-navy">⚖️ La conciliation</h2>
          <p className="mt-3 text-sm text-navy/80">
            Procédure <strong>judiciaire confidentielle</strong>, plus encadrée que le mandat ad hoc. Le conciliateur est désigné par le président du tribunal.
            Possible <strong>même en cessation des paiements de moins de 45 jours</strong>.
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-bleu/5 p-3"><dt className="text-navy/55">Durée</dt><dd className="font-medium text-navy">4 mois + 1 mois</dd></div>
            <div className="rounded-xl bg-bleu/5 p-3"><dt className="text-navy/55">Coût</dt><dd className="font-medium text-navy">Fixé par le président du tribunal, avec votre accord (art. L611-14)</dd></div>
            <div className="rounded-xl bg-bleu/5 p-3"><dt className="text-navy/55">Confidentielle</dt><dd className="font-medium text-navy">Oui (sauf homologation)</dd></div>
            <div className="rounded-xl bg-bleu/5 p-3"><dt className="text-navy/55">Référence</dt><dd className="font-medium text-navy">C. com. art. L611-4 à L611-15</dd></div>
          </dl>
          <p className="mt-4 text-sm text-navy/80">
            <strong>Quand l&apos;utiliser</strong> : situation plus tendue qu&apos;un simple mandat ad hoc, besoin d&apos;un accord homologué (privilège « new money », arrêt des poursuites possible). Préparer un éventuel basculement en sauvegarde accélérée.
          </p>
          <p className="mt-3 text-sm text-navy/80">
            <strong>Avantage clé</strong> : si l&apos;accord est <strong>homologué par le tribunal</strong> (sur demande), il devient public mais bénéficie du « privilège new money » : les apporteurs de fonds nouveaux sont prioritaires en cas de procédure ultérieure.
          </p>
        </article>
      </div>

      {/* Tableau récap */}
      <div className="mt-10 rounded-2xl border border-bleu/30 bg-bleu/5 p-5">
        <h2 className="font-display text-lg text-bleu-fonce">Comment choisir en 30 secondes</h2>
        <ul className="mt-3 space-y-2 text-sm text-navy/80">
          <li><strong>UN litige précis avec UN créancier</strong> → médiation (gratuite et rapide)</li>
          <li><strong>PLUSIEURS créanciers à restructurer + pas en cessation</strong> → mandat ad hoc</li>
          <li><strong>Situation tendue + cessation possible ou récente</strong> → conciliation</li>
          <li><strong>Cessation depuis &gt; 45 j</strong> → redressement ou liquidation judiciaire (la sauvegarde est fermée en cas de cessation des paiements)</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/procedures-comparaison" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Comparatif des 8 procédures
        </Link>
        <Link href="/glossaire" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Glossaire
        </Link>
        <Link href="/outils/cout-procedures" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Coûts détaillés
        </Link>
      </div>
    </section>
  );
}
