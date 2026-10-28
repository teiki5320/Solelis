'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { chargerArticle, chargerFlux, idActuValide, type Actu, type ArticleActu as Article } from '@/lib/veille';
import { fichesDesTags } from '@/lib/fichesVeille';
import { ArticleActu, autresActus } from '@/components/actus/ArticleActu';

type Etat = { phase: 'chargement' } | { phase: 'absent' } | { phase: 'pret'; article: Article; autres: Actu[] };

/** Article lu dans le navigateur depuis la veille (articles/solelis/<id>.json). */
export function ArticleSecours() {
  const id = useSearchParams().get('id');
  const [etat, setEtat] = useState<Etat>({ phase: 'chargement' });

  useEffect(() => {
    let actif = true;
    if (!idActuValide(id)) {
      setEtat({ phase: 'absent' });
      return;
    }
    setEtat({ phase: 'chargement' });
    Promise.all([chargerArticle(id), chargerFlux()]).then(([article, flux]) => {
      if (!actif) return;
      if (!article) return setEtat({ phase: 'absent' });
      document.title = `${article.titre} — Solelis`;
      setEtat({ phase: 'pret', article, autres: autresActus(flux?.actus ?? [], article.id) });
    });
    return () => {
      actif = false;
    };
  }, [id]);

  if (etat.phase === 'chargement') {
    return <p className="mx-auto max-w-[44rem] px-5 py-14 text-sm text-navy/60" role="status">Chargement de l’article…</p>;
  }
  if (etat.phase === 'absent') {
    return (
      <section className="mx-auto max-w-[44rem] px-5 py-14">
        <h1 className="font-display text-2xl text-navy">Article introuvable</h1>
        <p className="mt-3 text-navy/70">Cet article n’est pas disponible pour le moment.</p>
        <p className="mt-4">
          <Link href="/actus" className="text-bleu-fonce underline">Voir toute l’actualité</Link>
        </p>
      </section>
    );
  }
  return <ArticleActu article={etat.article} autres={etat.autres} fiches={fichesDesTags(etat.article.tags)} />;
}
