import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/annuaires/tae' },
  title: 'Tribunaux des activités économiques (TAE) — Solelis',
  description:
    'Les 12 tribunaux des activités économiques expérimentaux depuis janvier 2025. Compétences, ressort et réforme des procédures collectives.',
};

interface TAE {
  ville: string;
  ressort: string;
  competence: string;
}

// Source : arrêté du 5 juillet 2024 relatif à l'expérimentation du tribunal des
// activités économiques — 12 TAE, du 1er janvier 2025 au 31 décembre 2028
// (justice.gouv.fr). Chaque TAE reprend le ressort de l'ancien tribunal de
// commerce de la ville : dans les départements qui comptent plusieurs tribunaux
// de commerce, il ne couvre qu'une partie du département.
const TAES: TAE[] = [
  { ville: 'Avignon (84)', ressort: 'celui du tribunal de commerce d\'Avignon (Vaucluse)', competence: 'Procédures amiables et collectives quel que soit le statut, sauf pour les professions réglementées du droit (avocat, notaire, commissaire de justice, greffier de tribunal de commerce, administrateur et mandataire judiciaires), qui restent devant le tribunal judiciaire.' },
  { ville: 'Auxerre (89)', ressort: 'celui du tribunal de commerce d\'Auxerre (une partie de l\'Yonne)', competence: 'Idem' },
  { ville: 'Le Havre (76)', ressort: 'celui du tribunal de commerce du Havre (une partie de la Seine-Maritime)', competence: 'Idem' },
  { ville: 'Le Mans (72)', ressort: 'celui du tribunal de commerce du Mans (Sarthe)', competence: 'Idem' },
  { ville: 'Limoges (87)', ressort: 'celui du tribunal de commerce de Limoges (Haute-Vienne)', competence: 'Idem' },
  { ville: 'Lyon (69)', ressort: 'celui du tribunal de commerce de Lyon (une partie du Rhône)', competence: 'Idem' },
  { ville: 'Marseille (13)', ressort: 'celui du tribunal de commerce de Marseille (une partie des Bouches-du-Rhône)', competence: 'Idem' },
  { ville: 'Nancy (54)', ressort: 'celui du tribunal de commerce de Nancy (une partie de la Meurthe-et-Moselle)', competence: 'Idem' },
  { ville: 'Nanterre (92)', ressort: 'celui du tribunal de commerce de Nanterre (Hauts-de-Seine)', competence: 'Idem' },
  { ville: 'Paris (75)', ressort: 'celui du tribunal de commerce de Paris', competence: 'Idem' },
  { ville: 'Saint-Brieuc (22)', ressort: 'celui du tribunal de commerce de Saint-Brieuc (Côtes-d\'Armor)', competence: 'Idem' },
  { ville: 'Versailles (78)', ressort: 'celui du tribunal de commerce de Versailles (Yvelines)', competence: 'Idem' },
];

export default function TaePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/annuaires" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les annuaires
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Tribunaux des Activités Économiques (TAE)
      </h1>
      <p className="mt-3 text-base text-navy/70">
        La <strong>loi du 20 novembre 2023</strong> (n°2023-1059) crée le
        Tribunal des Activités Économiques, à titre expérimental, pour
        rassembler en une seule juridiction les procédures amiables et
        collectives des entreprises en difficulté, quel que soit leur
        statut (commerçant, artisan, agriculteur, libéral, association),
        sauf les professions réglementées du droit. <strong>12 tribunaux</strong> expérimentent
        ce dispositif depuis le <strong>1er janvier 2025</strong>, pour 4 ans
        (jusqu&apos;au 31 décembre 2028).
      </p>

      <div className="mt-6 rounded-2xl border border-bleu/30 bg-bleu/5 p-5 text-sm text-navy">
        <p className="font-display text-base text-bleu-fonce">Ce qui change</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Ailleurs :</strong> tribunal de commerce pour les commerçants, artisans et sociétés commerciales, tribunal judiciaire pour les libéraux, agriculteurs, associations et sociétés civiles (C. com. L621-2).
          </li>
          <li>
            <strong>Avec le TAE :</strong> un seul tribunal traite toutes les procédures (mandat ad hoc, conciliation, sauvegarde, RJ, LJ) <strong>quel que soit le statut</strong>, sauf pour les professions réglementées du droit.
          </li>
          <li>
            <strong>Composition :</strong> les juges élus du tribunal de commerce, rejoints par des juges exerçant la profession d&apos;exploitant agricole ; le greffe reste celui du tribunal de commerce.
          </li>
          <li>
            <strong>Bilan :</strong> un comité d&apos;experts et de parlementaires doit remettre un rapport d&apos;évaluation au Parlement avant le 1er juillet 2028.
          </li>
        </ul>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {TAES.map((t) => (
          <div key={t.ville} className="glass-soft rounded-2xl p-4">
            <p className="font-display text-lg text-navy">{t.ville}</p>
            <p className="mt-1 text-sm text-navy/70">Ressort : {t.ressort}</p>
            <p className="mt-2 text-[11px] text-navy/55">{t.competence}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-jaune/30 bg-jaune/5 p-5 text-sm text-navy/80">
        <p className="font-display text-base text-navy">⚠️ Hors de ces ressorts</p>
        <p className="mt-2">
          Si votre entreprise ne relève pas du ressort de l&apos;un de ces
          tribunaux, votre procédure relève du tribunal de commerce
          (commerçants, artisans, sociétés commerciales) ou du tribunal
          judiciaire (libéraux, agriculteurs, associations, sociétés
          civiles), selon les règles habituelles.
        </p>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Source : Loi n°2023-1059 du 20 novembre 2023 (art. 26 et 27),
        décret n°2024-674 du 3 juillet 2024, arrêté du 5 juillet 2024,
        ministère de la Justice (justice.gouv.fr) —
        entreprendre.service-public.gouv.fr.
      </p>
    </section>
  );
}
