import { ageActu, dateLongue, type Actu } from '@/lib/veille';

/**
 * Nom de la source, en texte (la carte entière mène à l'article), suivi de l'âge de l'actu
 * ou, avec `dateFixe`, de sa date (pages figées au build : l'âge y serait faux le lendemain).
 */
export function SourceActu({ actu, externe, dateFixe = false }: { actu: Actu; externe: boolean; dateFixe?: boolean }) {
  const quand = dateFixe ? dateLongue(actu.publie_le) : ageActu(actu.publie_le);
  return (
    <p className="text-sm">
      <span className="font-medium text-bleu-fonce">
        Source : {actu.source_nom}
        {externe && <span aria-hidden> ↗</span>}
      </span>
      {quand && <span className="text-navy/60"> · {quand}</span>}
    </p>
  );
}
