'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';
import type { GroupeOrganismes, OrganismeCard } from '@/lib/organismes';

const COULEURS: Record<string, { bord: string; fond: string; texte: string; badge: string }> = {
  violet: {
    bord: 'border-[#7c5fb3]/30',
    fond: 'bg-[#7c5fb3]/6',
    texte: 'text-[#4f3a82]',
    badge: 'bg-[#7c5fb3]/10 text-[#4f3a82]',
  },
  rouge: {
    bord: 'border-rouge/30',
    fond: 'bg-rouge/5',
    texte: 'text-rouge',
    badge: 'bg-rouge/10 text-rouge',
  },
  'bleu-fonce': {
    bord: 'border-bleu-fonce/30',
    fond: 'bg-bleu-fonce/5',
    texte: 'text-bleu-fonce',
    badge: 'bg-bleu-fonce/10 text-bleu-fonce',
  },
  vert: {
    bord: 'border-vert/30',
    fond: 'bg-vert/5',
    texte: 'text-vert',
    badge: 'bg-vert/10 text-vert',
  },
};

function Carte({ o, couleur }: { o: OrganismeCard; couleur: string }) {
  const s = COULEURS[couleur] ?? COULEURS.violet;
  return (
    <div
      className={`glass-soft border ${s.bord} ${s.fond} p-4 transition hover:bg-white`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`font-display text-base ${s.texte}`}>{o.nom}</p>
          <p className="mt-0.5 text-xs text-navy/55">{o.type}</p>
        </div>
        {o.badge && (
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${s.badge}`}
          >
            {o.badge}
          </span>
        )}
      </div>
      {(o.note || o.avis) && (
        <p className="mt-2 text-xs text-navy/70">
          ⭐ {o.note?.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {o.avis ? `· ${o.avis} avis` : ''}
        </p>
      )}
      {o.adresse && (
        <p className="mt-2 text-xs text-navy/55">{o.adresse}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {o.telephone && (
          <a
            href={`tel:${o.telephone.replace(/\s/g, '')}`}
            className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
          >
            <span aria-hidden>☎</span> {o.telephone}
          </a>
        )}
        {o.site && (
          <a
            href={o.site}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
          >
            <span aria-hidden>🌐</span> {(() => { try { return new URL(o.site).hostname.replace('www.', ''); } catch { return o.nom; } })()}
          </a>
        )}
        {o.mapsUrl && (
          <a
            href={o.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
          >
            📍 Maps
          </a>
        )}
      </div>
      {o.telephone && o.telephoneNote && (
        <p className="mt-2 text-xs text-navy/55">{o.telephoneNote}</p>
      )}
    </div>
  );
}

export default function BlocOrganismes() {
  const { groupes } = useFiche();
  const nonVides = groupes.filter((g) => g.cartes.length > 0);
  if (!nonVides.length) return null;
  const total = nonVides.reduce((n, g) => n + g.cartes.length, 0);

  return (
    <BlocAccordeon
      icone="📍"
      titre="Interlocuteurs locaux"
      soustitre={`${total} contacts sélectionnés pour votre situation`}
    >
      <div className="space-y-6">
        {nonVides.map((g) => {
          const s = COULEURS[g.couleur] ?? COULEURS.violet;
          return (
            <div key={g.cle}>
              <h3
                className={`font-display text-lg ${s.texte} flex items-center gap-2`}
              >
                <span aria-hidden>{g.icone}</span>
                {g.titre}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {g.cartes.map((o, i) => (
                  <Carte key={`${g.cle}-${i}`} o={o} couleur={g.couleur} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </BlocAccordeon>
  );
}
