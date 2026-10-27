/**
 * Crédit obligatoire d'une image (actus de la veille et illustrations des conseils et guides).
 * Photo : « Photo : auteur · licence », avec un lien vers la page d'origine ;
 * carte générée : « Illustration : Solelis ».
 * Sans état ni effet : utilisable dans un composant serveur comme dans un composant client.
 */
export interface ImageCreditee {
  source: 'wikimedia' | 'openverse' | 'banque' | 'carte';
  credit: string;
  licence?: string | null;
  page?: string | null;
}

export function texteCredit(image: ImageCreditee): string {
  if (image.source === 'carte') return 'Illustration : Solelis';
  return `${image.source === 'banque' ? 'Image' : 'Photo'} : ${image.credit}${image.licence ? ` · ${image.licence}` : ''}`;
}

export function CreditImage({ image, className = '' }: { image: ImageCreditee; className?: string }) {
  const classes = `text-xs leading-snug text-navy/60 ${className}`;
  const texte = texteCredit(image);
  if (image.source === 'carte' || !image.page) return <p className={classes}>{texte}</p>;
  return (
    <p className={classes}>
      <a href={image.page} target="_blank" rel="noopener nofollow" className="underline decoration-navy/25 underline-offset-2 hover:text-navy">
        {texte}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    </p>
  );
}
