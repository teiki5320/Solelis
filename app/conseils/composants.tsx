import Link from 'next/link';

/**
 * Corps d'un article (HTML produit au build par marked) : mêmes polices,
 * couleurs et espacements que le reste du site, appliqués aux balises.
 * Classes écrites en entier ici (dossier app/ scanné par Tailwind JIT).
 */
export const CLASSES_CORPS =
  'mt-10 break-words text-base leading-relaxed text-navy/80 ' +
  '[&_h2]:mt-10 [&_h2]:scroll-mt-28 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-navy sm:[&_h2]:text-2xl ' +
  '[&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-navy ' +
  '[&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-navy ' +
  '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 ' +
  '[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 ' +
  '[&_li>p]:mt-0 [&_a]:text-bleu-fonce [&_a]:underline ' +
  '[&_blockquote]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-bleu/30 [&_blockquote]:pl-4 [&_blockquote]:text-navy/70 ' +
  '[&_blockquote>p]:mt-0 [&_code]:rounded [&_code]:bg-navy/5 [&_code]:px-1 ' +
  '[&_table]:mt-4 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:text-sm ' +
  '[&_th]:border [&_th]:border-navy/15 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold ' +
  '[&_td]:border [&_td]:border-navy/15 [&_td]:px-3 [&_td]:py-2 [&_hr]:my-8 [&_hr]:border-navy/15';

/** Rappel du rôle de Solelis (même formulation que les mentions légales). */
export function RappelConseil() {
  return (
    <p className="mt-10 text-sm text-navy/60">
      Solelis informe et oriente : cet article ne remplace pas un conseil personnalisé (avocat,
      expert-comptable, mandataire judiciaire…). Chaque situation est particulière.
    </p>
  );
}

/** Appel vers l'accueil (saisie du SIRET), même bloc que la FAQ. */
export function AppelFiche() {
  return (
    <div className="mt-10 glass-soft rounded-2xl p-6 text-center">
      <p className="font-display text-lg text-navy">Et pour votre entreprise ?</p>
      <p className="mt-2 text-sm text-navy/60">
        Entrez votre numéro SIRET : Solelis prépare votre fiche personnalisée en 5 minutes environ
        (stratégie, courriers, échéances, aides). Gratuit et confidentiel.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-xl bg-bleu-fonce px-6 py-3 text-sm font-medium text-white transition hover:bg-bleu-fonce/90"
      >
        Créer ma fiche
      </Link>
    </div>
  );
}
