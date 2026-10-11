/**
 * Indicateur de chargement de la fiche : fallback de la <Suspense> de page.tsx.
 * Ce n'est plus un loading.tsx de segment, qui figeait le statut HTTP à 200
 * avant que la page puisse répondre 404.
 */
export default function Chargement() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-navy/20 border-t-bleu-fonce" />
        <p className="mt-4 text-sm text-navy/50">Chargement…</p>
      </div>
    </div>
  );
}
