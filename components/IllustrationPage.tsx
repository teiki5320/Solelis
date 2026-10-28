import { illustrationDe } from '@/lib/illustrations';
import { CreditImage } from '@/components/actus/CreditImage';

/** Version 640 px (téléphones) de chaque image, faite par scripts/illustrations.mjs. */
export function petiteVersion(fichier: string): string {
  return fichier.replace(/\.webp$/, '-640.webp');
}

/**
 * Image d'un conseil ou d'un guide, avec son crédit juste dessous
 * (« Photo : auteur · licence » avec le lien vers la page d'origine, ou « Illustration : Solelis »).
 * Rien n'est affiché si la page n'a pas encore d'image.
 * Image en haut de page, souvent le plus grand élément affiché : chargée en priorité,
 * en petite version sur téléphone (sizes : largeur de la colonne d'article, max-w-3xl).
 */
export function IllustrationPage({ cle, className = '' }: { cle: string; className?: string }) {
  const image = illustrationDe(cle);
  if (!image) return null;
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.fichier}
        srcSet={`${petiteVersion(image.fichier)} 640w, ${image.fichier} ${image.largeur}w`}
        sizes="(max-width: 808px) calc(100vw - 40px), 768px"
        alt={image.alt}
        width={image.largeur}
        height={image.hauteur}
        fetchPriority="high"
        decoding="async"
        className="aspect-video w-full rounded-2xl bg-navy/10 object-cover"
      />
      <figcaption>
        <CreditImage image={image} className="mt-2" />
      </figcaption>
    </figure>
  );
}
