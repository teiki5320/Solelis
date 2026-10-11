'use client';
// Partie interactive d'un modèle de courrier (champs, aperçu, copie,
// impression). La page serveur (page.tsx) gère métadonnées et 404.
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  getCourrier,
  CATEGORIES,
  personalizeCourrier,
  loadContextFromStorage,
  type CourrierContext,
  type PersonalizedCourrier,
  champsCourrier,
  remplirChamps,
  LIBELLES_CHAMPS,
} from '@/lib/courriers';

const FIELD_LABELS = LIBELLES_CHAMPS;

export default function CourrierDetail({ slug }: { slug: string }) {
  const template = getCourrier(slug);
  const textRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [context, setContext] = useState<CourrierContext | null>(null);

  useEffect(() => {
    const merged: Record<string, string> = {};
    try {
      const stored = sessionStorage.getItem('solelis_company');
      if (stored) Object.assign(merged, JSON.parse(stored));
    } catch {}
    try {
      const url = new URL(window.location.href);
      const prefill = url.searchParams.get('prefill');
      // searchParams.get() renvoie déjà la valeur décodée : un second
      // decodeURIComponent levait une URIError dès qu'un champ contenait « % ».
      if (prefill) Object.assign(merged, JSON.parse(prefill));
    } catch {}
    merged.DATE = merged.DATE || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    if (Object.keys(merged).length > 0) {
      setValues((prev) => ({ ...merged, ...prev }));
    }
    setContext(loadContextFromStorage());
  }, []);

  const personalized: PersonalizedCourrier | null = useMemo(
    () => (template ? personalizeCourrier(template, context ?? {}) : null),
    [template, context]
  );

  const allFields = useMemo(
    () => template ? champsCourrier(template.objet + '\n' + template.corps) : [],
    [template]
  );

  // Slug inconnu : page.tsx renvoie déjà une vraie 404 (notFound).
  if (!template) return null;

  function rendered(text: string): string {
    return remplirChamps(text, (key) => {
      const v = values[key];
      return v ? v : `[${FIELD_LABELS[key] ?? key}]`;
    });
  }

  async function handleCopy() {
    if (!template || !personalized) return;
    const text = `Objet : ${rendered(personalized.objet)}\n\n${rendered(personalized.corps)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  function handlePrint() {
    window.print();
  }

  const meta = template ? CATEGORIES[template.categorie] : undefined;

  const todayFR = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const nomEntreprise = values.NOM_ENTREPRISE || '';

  return (
    <section className="courrier-page mx-auto max-w-4xl px-5 pb-24">
      {/* Entête imprimable — n'apparaît qu'à l'impression */}
      <div className="courrier-print-header hidden">
        <div className="courrier-print-brand">Solelis</div>
        <div className="courrier-print-meta">
          {nomEntreprise && <span>{nomEntreprise} · </span>}
          <span>Document préparé le {todayFR}</span>
        </div>
      </div>

      <Link
        href="/courriers"
        className="no-print mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les modèles
      </Link>

      <div className="courrier-page-header no-print mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="pastille inline-flex">
            {template.icone} {meta?.label}
          </span>
          {personalized?.urgence === 'critique' && (
            <span className="pastille inline-flex bg-rouge/15 text-rouge">
              ⚠️ Urgence critique
            </span>
          )}
          {personalized?.urgence === 'elevee' && (
            <span className="pastille inline-flex bg-jaune/20 text-navy">
              ⏱ Urgence élevée
            </span>
          )}
        </div>
        <h1 className="font-display text-2xl text-navy sm:text-4xl">
          {personalized?.titre ?? template.titre}
        </h1>
        <p className="mt-2 text-navy/60">
          Destinataire : {personalized?.destinataire ?? template.destinataire}
        </p>
        {context && (personalized?.preambule || personalized?.closing) && (
          <p className="mt-3 text-xs text-vert">
            ✓ Courrier adapté à votre situation
          </p>
        )}
      </div>

      <div className="courrier-grid grid gap-6 lg:grid-cols-5">
        {/* Fields column */}
        <div className="courrier-fields no-print space-y-3 lg:col-span-2">
          <h2 className="font-display text-lg text-navy">
            Vos informations
          </h2>
          <p className="text-xs text-navy/50">
            Remplissez les champs ci-dessous — le courrier se met à jour
            automatiquement.
          </p>
          <div className="space-y-2">
            {allFields.map((f) => (
              <div key={f}>
                <label
                  htmlFor={f}
                  className="mb-1 block text-xs font-medium text-navy/70"
                >
                  {FIELD_LABELS[f] ?? f}
                </label>
                {(f.includes('DESCRIPTION') ||
                  f.includes('EXPOSE') ||
                  f.includes('TENTATIVES') ||
                  f.includes('LISTE') ||
                  f.includes('MOTIFS') ||
                  f.includes('PROPOSITION') ||
                  f.includes('MISSION') ||
                  f.includes('OBJECTIF') ||
                  f.includes('CONSEQUENCES')) ? (
                  <textarea
                    id={f}
                    rows={3}
                    value={values[f] ?? ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm focus:border-bleu focus:outline-none"
                    placeholder={FIELD_LABELS[f] ?? f}
                  />
                ) : (
                  <input
                    id={f}
                    type="text"
                    value={values[f] ?? ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm focus:border-bleu focus:outline-none"
                    placeholder={FIELD_LABELS[f] ?? f}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview column — la seule partie imprimée */}
        <div className="courrier-preview-col lg:col-span-3">
          <div className="courrier-preview glass card-top-line p-6 sm:p-8">
            <div className="courrier-print-date hidden">
              <p>{nomEntreprise || '________________'}</p>
              <p className="mt-1">Fait le {todayFR}</p>
            </div>
            <p className="courrier-objet mb-6 text-sm font-medium text-bleu-fonce">
              Objet : {rendered(personalized?.objet ?? template.objet)}
            </p>
            <div
              ref={textRef}
              className="courrier-corps whitespace-pre-wrap text-sm leading-relaxed text-navy/90"
            >
              {rendered(personalized?.corps ?? template.corps)}
            </div>
            <div className="courrier-signature hidden">
              <p>Signature :</p>
            </div>
          </div>

          {personalized?.conseil && (
            <div className="courrier-conseil no-print mt-4 rounded-2xl border border-bleu/20 bg-bleu/5 p-4 text-sm text-navy">
              <p className="mb-1 font-display text-sm text-bleu-fonce">
                Conseil pour ce courrier
              </p>
              <p className="text-navy/80">{personalized.conseil}</p>
            </div>
          )}

          <div className="no-print mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-primary"
            >
              {copied ? '✓ Copié !' : '📋 Copier le texte'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-ghost"
            >
              📄 Télécharger en PDF
            </button>
          </div>
          <p className="no-print mt-2 text-xs text-navy/50">
            « Télécharger en PDF » ouvre la boîte d&apos;impression de votre
            navigateur — choisissez « Enregistrer en PDF » comme destination.
          </p>
        </div>
      </div>

      <div className="dashed-band no-print mt-8 p-5 text-sm text-navy/70">
        <p>
          Ce modèle est une base de travail. Adaptez-le à votre situation.
          Pour les courriers au tribunal, un avocat peut vous aider à le
          vérifier.
        </p>
      </div>
    </section>
  );
}
