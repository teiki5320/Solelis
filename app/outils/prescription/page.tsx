'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { REGLES, calculerPrescription, aideAnnee, type Categorie } from './calcul';

function formatDateFR(d: Date): string {
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PrescriptionPage() {
  const [categorie, setCategorie] = useState<Categorie>('urssaf');
  const [dateExig, setDateExig] = useState<string>('');
  const [interrompue, setInterrompue] = useState(false);
  const [dateInterruption, setDateInterruption] = useState<string>('');

  const regle = REGLES.find((r) => r.cle === categorie)!;

  const result = useMemo(
    () => calculerPrescription(regle, dateExig, interrompue ? dateInterruption : null),
    [dateExig, dateInterruption, interrompue, regle]
  );

  const statut = !result
    ? null
    : result.restants < 0
    ? { ton: 'safe' as const, label: 'Dette potentiellement prescrite' }
    : result.restants < 90
    ? { ton: 'urgent' as const, label: 'Prescription proche' }
    : { ton: 'normal' as const, label: 'Prescription à venir' };

  const STATUT_STYLES = {
    safe: 'bg-vert/10 border-vert/30 text-vert',
    urgent: 'bg-jaune/15 border-jaune/40 text-jaune',
    normal: 'bg-bleu/10 border-bleu/30 text-bleu-fonce',
  } as const;

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Vérifier la prescription de vos dettes',
    description:
      'Calculez si une dette est prescrite en fonction de sa catégorie (URSSAF, fiscale, civile, commerciale) et de sa date de point de départ.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Choisir le type de dette',
        text: 'Sélectionnez la catégorie de dette (URSSAF, impôt sur le revenu, TVA, civile, commerciale, loyer, salaire, amende pour contravention).',
      },
      {
        '@type': 'HowToStep',
        name: 'Saisir la date du point de départ',
        text: 'Indiquez la date d\'exigibilité, d\'échéance ou du fait générateur de la dette.',
      },
      {
        '@type': 'HowToStep',
        name: 'Indiquer une éventuelle interruption',
        text: 'Si la prescription a été interrompue (mise en demeure, jugement, reconnaissance écrite), cochez la case et indiquez la date du dernier acte.',
      },
      {
        '@type': 'HowToStep',
        name: 'Lire le résultat',
        text: 'L\'outil affiche la date de prescription estimée et le nombre de jours restants, avec un verdict (prescrite, proche, à venir).',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Vérificateur de prescription' },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <Link
        href="/outils"
        className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Vérificateur de prescription
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Une dette qui dépasse son délai de prescription ne peut plus être
        recouvrée judiciairement. Cet outil applique les durées et points
        de départ officiels.
      </p>

      <div className="glass mt-8 space-y-4 p-6 sm:p-8">
        <label className="block text-sm text-navy">
          Type de dette
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value as Categorie)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          >
            {REGLES.map((r) => (
              <option key={r.cle} value={r.cle}>
                {r.label} — {r.duree} ans
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl border border-navy/10 bg-white/60 p-4 text-sm text-navy/80">
          <p>
            <strong>Base légale :</strong> {regle.base} ({regle.reference})
          </p>
          <p className="mt-1">
            <strong>Point de départ :</strong> {regle.point}
          </p>
          <p className="mt-1">
            <strong>Causes d&apos;interruption :</strong> {regle.interruption}
          </p>
        </div>

        <label className="block text-sm text-navy">
          Date du point de départ (exigibilité, échéance, fait générateur)
          <input
            type="date"
            value={dateExig}
            onChange={(e) => setDateExig(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          />
          {aideAnnee(regle) && (
            <span className="mt-1 block text-[11px] text-navy/55">
              {aideAnnee(regle)}
            </span>
          )}
        </label>

        <label className="flex items-center gap-2 text-sm text-navy">
          <input
            type="checkbox"
            checked={interrompue}
            onChange={(e) => setInterrompue(e.target.checked)}
            className="h-4 w-4"
          />
          La prescription a été interrompue (mise en demeure, jugement, reconnaissance écrite…)
        </label>

        {interrompue && (
          <label className="block text-sm text-navy">
            Date du dernier acte d&apos;interruption
            <input
              type="date"
              value={dateInterruption}
              onChange={(e) => setDateInterruption(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
            <span className="mt-1 block text-[11px] text-navy/55">
              L&apos;interruption fait courir un nouveau délai entier (art. 2231 C. civ.).
            </span>
          </label>
        )}

        {result && statut && (
          <div className={`rounded-2xl border p-5 ${STATUT_STYLES[statut.ton]}`}>
            <p className="font-display text-lg">{statut.label}</p>
            <p className="mt-2 text-sm text-navy/80">
              Date de prescription estimée : <strong>{formatDateFR(result.echeance)}</strong>
            </p>
            <p className="mt-1 text-sm text-navy/70">
              {result.restants < 0
                ? `Le délai est dépassé de ${Math.abs(result.restants)} jours. Vérifiez avec un avocat avant tout paiement.`
                : `Encore ${result.restants} jours avant prescription.`}
            </p>
            {result.departFutur && (
              <p className="mt-2 text-sm text-navy/80">
                ⚠️ La date saisie est dans le futur : le délai n&apos;a pas encore commencé à courir. Vérifiez la date.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">⚠️ Limites</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Cet outil ne tient pas compte des suspensions (mineurs, force majeure, etc. — art. 2233 et s. C. civ.).
          </li>
          <li>
            Impôts et TVA : ces délais sont ceux du <strong>contrôle</strong> (droit de reprise).
            Une fois l&apos;impôt mis en recouvrement, le Trésor dispose de 4 ans pour le
            recouvrer (LPF art. L274).
          </li>
          <li>
            Une prescription <strong>n&apos;efface pas la dette</strong> mais empêche
            son recouvrement forcé. Un paiement volontaire reste valable.
          </li>
          <li>
            Faites toujours vérifier par un avocat avant d&apos;invoquer la prescription,
            notamment si une procédure est en cours.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources officielles : Code civil (art. 2219 à 2254), Code de la
        Sécurité sociale (L244-3), Livre des procédures fiscales (L169,
        L176, L274), Code du travail (L3245-1), Code de commerce (L110-4).
      </p>
    </section>
  );
}
