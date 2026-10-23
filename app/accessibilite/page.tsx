import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/accessibilite' },
  title: 'Accessibilité — Solelis',
  description: 'Déclaration d\'accessibilité de Solelis : conformité RGAA, fonctionnalités d\'accessibilité, contact en cas de difficulté.',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

export default function AccessibilitePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Accueil
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">Accessibilité</h1>
      <p className="mt-3 text-sm text-navy/60">Déclaration d&apos;accessibilité — mise à jour 10 octobre 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy/80">

        <section className="rounded-2xl border border-bleu/30 bg-bleu/5 p-5">
          <p className="font-display text-base text-bleu-fonce">État de conformité</p>
          <p className="mt-2">
            Solelis est <strong>partiellement conforme</strong> au RGAA 4.1 (Référentiel Général d&apos;Amélioration
            de l&apos;Accessibilité). L&apos;objectif est la conformité totale d&apos;ici fin 2026.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">Fonctionnalités d&apos;accessibilité implémentées</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li><strong>Navigation au clavier</strong> : tous les boutons, liens et accordéons sont accessibles via Tab/Entrée/Espace</li>
            <li><strong>Skip link</strong> en haut de page pour accéder directement au contenu principal</li>
            <li><strong>Aria-labels</strong> et <strong>aria-expanded/controls</strong> sur les accordéons (37+ blocs)</li>
            <li><strong>Aria-current</strong> sur la navigation principale</li>
            <li><strong>Focus visible</strong> sur tous les éléments interactifs</li>
            <li><strong>Hiérarchie sémantique</strong> respectée (H1 unique, H2/H3 imbriqués)</li>
            <li><strong>Contraste de couleurs</strong> respectant WCAG AA sur la majorité des textes</li>
            <li><strong>Lang=“fr”</strong> déclaré sur la balise HTML</li>
            <li><strong>Polices lisibles</strong> (Outfit + Playfair Display), tailles définies en unités relatives — le zoom navigateur jusqu&apos;à 200 % est pris en charge sans perte de contenu</li>
            <li><strong>Animations décoratives</strong> (fonds animés) désactivées lorsque la préférence système <code>prefers-reduced-motion</code> est active</li>
            <li><strong>Formulaires</strong> : labels visibles, messages d&apos;erreur explicites</li>
            <li><strong>Impression</strong> : feuille de style dédiée pour une lecture papier sobre</li>
            <li><strong>Thèmes d&apos;affichage</strong> : clair, sombre et contraste élevé, au choix dans la barre de navigation (le choix est mémorisé dans votre navigateur)</li>
            <li><strong>Emojis décoratifs</strong> marqués <code>aria-hidden=“true”</code> pour ne pas perturber les lecteurs d&apos;écran</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">Limitations connues</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>Les visualisations de trésorerie (mini-barres) n&apos;ont pas encore d&apos;alternative tabulaire texte</li>
            <li>Certains tableaux de seuils utilisent des badges colorés sans label textuel — un libellé est ajouté en accompagnement, mais le retrait des couleurs peut limiter la lisibilité</li>
            <li>Le module d&apos;export PDF utilise le rendu navigateur — vérifier l&apos;accessibilité de l&apos;export PDF dépendra du lecteur (à terme, génération côté serveur PDF/UA)</li>
            <li>Audit RGAA 4.1 complet pas encore effectué par un expert externe</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">Compatibilité</h2>
          <p className="mt-2">
            Solelis est testé sur :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Navigateurs : Chrome, Firefox, Safari, Edge (versions des 2 dernières années)</li>
            <li>Lecteurs d&apos;écran : NVDA (Windows), VoiceOver (macOS/iOS)</li>
            <li>Mobile : iOS Safari, Android Chrome</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">Voie de recours</h2>
          <p className="mt-2">
            Si vous rencontrez une difficulté d&apos;accessibilité, contactez-nous à
            <a href="mailto:solelis@toakeur.com" className="text-bleu-fonce underline ml-1">solelis@toakeur.com</a>
            {' '}— nous nous engageons à proposer une réponse sous 5 jours ouvrés.
          </p>
          <p className="mt-2">
            Si vous estimez que vos droits n&apos;ont pas été respectés, vous pouvez saisir le Défenseur des
            droits : <a href="https://www.defenseurdesdroits.fr" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">www.defenseurdesdroits.fr</a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">Améliorations en cours</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Audit RGAA complet par un expert externe (date à fixer)</li>
            <li>Alternative textuelle aux visualisations graphiques</li>
            <li>Sous-titres et transcriptions si vidéos ajoutées</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
