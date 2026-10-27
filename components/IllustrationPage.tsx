import { illustrationDe } from '@/lib/illustrations';
import { CreditImage } from '@/components/actus/CreditImage';

/**
 * Image d'un conseil ou d'un guide, avec son crédit juste dessous
 * (« Photo : auteur · licence » avec le lien vers la page d'origine, ou « Illustration : Solelis »).
 * Rien n'est affiché si la page n'a pas encore d'image.
 */
export function IllustrationPage({ cle, className = '' }: { cle: string; className?: string }) {
  const image = illustrationDe(cle);
  if (!image) return null;
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.fichier}
        alt={image.alt}
        width={image.largeur}
        height={image.hauteur}
        decoding="async"
        className="aspect-video w-full rounded-2xl bg-navy/10 object-cover"
      />
      <figcaption>
        <CreditImage image={image} className="mt-2" />
      </figcaption>
    </figure>
  );
}
