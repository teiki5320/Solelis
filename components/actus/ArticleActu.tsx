import Link from 'next/link';
import { dateLongue, type Actu, type ArticleActu as Article } from '@/lib/veille';
import { CreditImage } from './CreditImage';
import { ActuVignette } from './ActuVignette';

/** Nom lisible d'une autre source : son domaine sans « www. ». */
function domaine(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Article complet d'une actu, rendu à l'identique sur la page construite /actus/<slug>
 * (serveur) et sur la page de secours /actus/article?id=… (navigateur). Sans état ni effet.
 * Légal : texte réécrit par la veille, source et crédit de l'image toujours visibles ;
 * aucune publicité ni lien partenaire (Solelis n'en a pas).
 */
export function ArticleActu({
  article,
  autres,
  fiches,
}: {
  article: Article;
  /** 3 autres actus au plus (bloc « Autres actus »). */
  autres: readonly Actu[];
  /** Pages du site liées par les tags de l'article. */
  fiches: readonly { href: string; libelle: string }[];
}) {
  const date = dateLongue(article.publie_le);
  return (
    <article className="mx-auto max-w-[44rem] px-5 py-10 sm:py-14">
      <nav aria-label="Fil d’Ariane" className="mb-6 text-sm text-navy/60">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-navy">Accueil</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/actus" className="hover:text-navy">Actus</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="min-w-0 break-words text-navy/80">{article.titre}</li>
        </ol>
      </nav>

      <p className="mb-3 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">Actualité</p>
      <h1 className="break-words font-display text-3xl leading-tight text-navy sm:text-4xl">{article.titre}</h1>
      <p className="mt-4 text-lg font-medium leading-relaxed text-navy/85 sm:text-xl">{article.chapo}</p>
      <p className="mt-4 text-sm text-navy/60">
        {date && (
          <>
            Publié le <time dateTime={article.publie_le}>{date}</time> ·{' '}
          </>
        )}
        {article.lecture_min} min de lecture
      </p>

      <figure className="mt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image.url}
          alt={article.image.alt}
          width={article.image.largeur}
          height={article.image.hauteur}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer"
          className="aspect-video w-full rounded-2xl bg-navy/10 object-cover"
        />
        <figcaption className="mt-2">
          <CreditImage image={article.image} />
        </figcaption>
      </figure>

      <div className="mt-8 space-y-5 text-base leading-relaxed text-navy/85 sm:text-[1.0625rem]">
        {article.blocs.map((bloc, i) => (
          <section key={i} className="space-y-4">
            {bloc.intertitre && <h2 className="pt-4 font-display text-2xl leading-snug text-navy">{bloc.intertitre}</h2>}
            {bloc.paragraphes.map((p, j) => (
              <p key={j} className="break-words">{p}</p>
            ))}
          </section>
        ))}
      </div>

      <aside className="mt-10 rounded-2xl border border-navy/15 bg-white/60 p-5" aria-labelledby="sources">
        <h2 id="sources" className="font-display text-base text-navy">Sources</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/80">
          Article rédigé par Solelis à partir de :{' '}
          <a href={article.source_url} target="_blank" rel="noopener nofollow" className="font-medium text-bleu-fonce underline-offset-2 hover:underline">
            {article.source_nom} <span aria-hidden>↗</span>
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
          {article.autres_sources && article.autres_sources.length > 0 && (
            <>
              {' '}(+ autres sources :{' '}
              {article.autres_sources.map((url, i) => (
                <span key={url}>
                  {i > 0 && ', '}
                  <a href={url} target="_blank" rel="noopener nofollow" className="break-words text-bleu-fonce underline-offset-2 hover:underline">
                    {domaine(url)} <span aria-hidden>↗</span>
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </span>
              ))}
              )
            </>
          )}
          .
        </p>
        <p className="mt-2 text-xs text-navy/60">Cette actualité ne remplace pas un conseil personnalisé.</p>
      </aside>

      {fiches.length > 0 && (
        <nav className="mt-6 flex flex-wrap gap-3" aria-label="Fiches liées">
          {fiches.map((f) => (
            <Link key={f.href} href={f.href} className="glass-soft inline-flex min-h-11 items-center px-4 py-2 text-sm font-medium text-bleu-fonce hover:shadow-md">
              {f.libelle} →
            </Link>
          ))}
        </nav>
      )}

      <div className="glass card-top-line mt-10 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-navy/80">
          Votre entreprise traverse une période difficile ?{' '}
          <Link href="/" className="font-medium text-bleu-fonce underline">Répondez au questionnaire gratuit</Link>{' '}
          pour recevoir une fiche personnalisée, ou{' '}
          <Link href="/parler" className="font-medium text-bleu-fonce underline">parlez à quelqu’un dès maintenant</Link>.
        </p>
      </div>

      {autres.length > 0 && (
        <section className="mt-12" aria-labelledby="autres-actus">
          <h2 id="autres-actus" className="mb-4 font-display text-xl text-navy">Autres actus</h2>
          <div className="grid gap-3">
            {autres.map((a) => (
              <ActuVignette key={a.id} actu={a} dateFixe />
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link href="/actus" className="text-bleu-fonce underline">Toute l’actualité des entreprises en difficulté</Link>
          </p>
        </section>
      )}
    </article>
  );
}

/** Les 3 actus à proposer sous un article (les plus récentes, sans l'article lui-même). */
export function autresActus(actus: readonly Actu[], id: string, limite = 3): Actu[] {
  return actus.filter((a) => a.id !== id).slice(0, limite);
}
