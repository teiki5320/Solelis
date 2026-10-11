import Link from 'next/link';
import { ogMeta } from '@/lib/og';

export const metadata = {
  ...ogMeta({
    chemin: '/ciri-codefi',
    titre: 'CIRI / CODEFI : l\'accompagnement de l\'État',
    sous: 'Quel dispositif selon votre taille',
    description: 'CIRI (Comité Interministériel de Restructuration Industrielle) et CODEFI (Comité Départemental) : conditions, saisine, accompagnement État pour entreprises en difficulté.',
    cat: 'aide',
    pageTitle: 'CIRI vs CODEFI : quel dispositif pour ma taille ? — Solelis',
  }),
  robots: { index: true, follow: true },
};

export default function CiriCodefiPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <Link href="/aides" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Aides
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        CIRI / CODEFI : l&apos;accompagnement de l&apos;État
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">
        Deux dispositifs gratuits et confidentiels de l&apos;État pour les entreprises en difficulté, organisés
        selon votre taille. CRP (Commissaire aux Restructurations) en région.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {/* CODEFI */}
        <article className="glass card-top-line p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h2 className="font-display text-xl text-navy">CODEFI</h2>
              <p className="mt-1 text-xs text-navy/55">Comité Départemental d&apos;Examen des problèmes de Financement</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-navy/80">
            Cellule départementale pilotée par le préfet et le directeur de la DDFiP. Coordonne les créanciers
            publics (URSSAF, fisc) et privés (banques) pour les <strong>entreprises de moins de 400 salariés</strong>.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Cible</dt><dd className="font-medium text-navy">&lt; 400 salariés</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Saisine</dt><dd className="font-medium text-navy">Secrétaire permanent du CODEFI (DDFiP) ou CRP de la région</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Confidentialité</dt><dd className="font-medium text-navy">Totale</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Coût</dt><dd className="font-medium text-navy">Gratuit</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Délai</dt><dd className="font-medium text-navy">Pas de délai fixé</dd></div>
          </dl>
          <p className="mt-4 text-sm text-navy/80">
            <strong>Ce que peut faire le CODEFI :</strong> faire réaliser, avec votre accord, un audit de votre
            situation, accorder un prêt du FDES (Fonds de développement économique et social) pour financer la
            restructuration, faciliter le dialogue avec les créanciers publics et les banques. Pour un prêt du FDES, il faut être à
            jour de vos obligations fiscales et sociales.
          </p>
          <p className="mt-3 text-xs text-navy/60">
            <strong>Source :</strong> impots.gouv.fr, « CCSF et CODEFI/CIRI ». Confidentialité couverte par le secret professionnel des agents publics (LPF L103).
          </p>
        </article>

        {/* CIRI */}
        <article className="glass card-top-line p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🇫🇷</span>
            <div>
              <h2 className="font-display text-xl text-navy">CIRI</h2>
              <p className="mt-1 text-xs text-navy/55">Comité Interministériel de Restructuration Industrielle</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-navy/80">
            Cellule interministérielle de Bercy. Coordonne l&apos;État (Trésor, DGFiP, URSSAF), les banques
            et les créanciers pour les <strong>grandes entreprises et ETI stratégiques</strong>.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Cible</dt><dd className="font-medium text-navy">Plus de 400 salariés</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Saisine</dt><dd className="font-medium text-navy">DG Trésor / contact direct</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Confidentialité</dt><dd className="font-medium text-navy">Totale</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Coût</dt><dd className="font-medium text-navy">Gratuit</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Téléphone</dt><dd className="font-medium text-navy">01 44 87 72 58</dd></div>
          </dl>
          <p className="mt-4 text-sm text-navy/80">
            <strong>Ce que peut faire le CIRI :</strong> coordination ÉTAT/banques/créanciers privés sur des
            dossiers de retournement complexes (PSE, cession partielle, transformation), médiation à très haut
            niveau, mobilisation de prêts FDES (Fonds de Développement Économique et Social).
          </p>
          <p className="mt-3 text-xs text-navy/60">
            <strong>Source :</strong> direction générale du Trésor, qui assure le secrétariat général du CIRI (tresor.economie.gouv.fr, rubrique « Services aux entreprises »).
          </p>
        </article>
      </div>

      {/* CRP */}
      <article className="glass card-top-line mt-8 p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🗺️</span>
          <div>
            <h2 className="font-display text-xl text-navy">CRP — Commissaire aux restructurations et à la prévention des difficultés des entreprises</h2>
            <p className="mt-1 text-xs text-navy/55">Représentant de l&apos;État en région (DREETS / Préfecture)</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-navy/80">
          <strong>Au moins un CRP par région</strong>, placé auprès de la DREETS. Le CRP intervient en amont d&apos;une
          procédure collective publique pour les entreprises en difficulté. Particulièrement
          utile pour les PME et ETI stratégiques régionalement.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>Coordination des créanciers publics et privés (banques, fournisseurs)</li>
          <li>Mobilisation des dispositifs régionaux (Bpifrance, FEDER, aides régionales)</li>
          <li>Médiation avec les donneurs d&apos;ordre publics</li>
          <li>Confidentialité totale, gratuit</li>
        </ul>
        <p className="mt-3 text-sm text-navy/80">
          <strong>Saisine :</strong> via la DREETS de votre région ou le préfet. Site officiel :{' '}
          <a href="https://www.entreprises.gouv.fr/espace-entreprises/etre-accompagne/annuaire-commissaires-restructurations-prevention-difficultes-entreprises" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">
            annuaire des CRP sur entreprises.gouv.fr
          </a>.
        </p>
      </article>

      {/* Comparaison rapide */}
      <div className="mt-10 rounded-2xl border border-bleu/30 bg-bleu/5 p-6">
        <h2 className="font-display text-xl text-bleu-fonce">Comment choisir</h2>
        <ul className="mt-4 space-y-2 text-sm text-navy/80">
          <li>
            <strong>TPE / PME &lt; 400 salariés</strong> → CODEFI (départemental)
          </li>
          <li>
            <strong>Entreprise de plus de 400 salariés</strong> → CIRI (national)
          </li>
          <li>
            <strong>ETI / activité critique régionalement</strong> → CRP (régional, complémentaire)
          </li>
          <li>
            <strong>Vous ne savez pas par où commencer</strong> → Conseillers-Entreprises (demande en ligne), guichet unique
            qui vous oriente vers le bon dispositif
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/procedures-comparaison" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Comparatif des procédures
        </Link>
        <Link href="/aides" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Toutes les aides
        </Link>
        <Link href="/glossaire" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Glossaire
        </Link>
      </div>
    </section>
  );
}
