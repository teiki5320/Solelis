'use client';
import { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import data from '@/data/organismes.json';
import { departementDepuisCodePostal } from '@/lib/sirene';

interface OrganismeLocal {
  nom: string;
  type: string;
  telephone?: string;
  /** Mention de coût pour les numéros à tarification spéciale (08 1x, 08 2x, 08 9x). */
  telephoneNote?: string;
  adresse?: string;
  site?: string;
}

interface DepartementData {
  code: string;
  nom: string;
  chefLieu: string;
  tribunal: OrganismeLocal;
  cci: OrganismeLocal;
  urssaf: OrganismeLocal;
  sie: OrganismeLocal;
  mandataires?: OrganismeLocal[];
  banqueDeFrance?: OrganismeLocal;
  dreets?: OrganismeLocal;
  ddfip?: OrganismeLocal;
  cma?: OrganismeLocal;
  prefecture?: OrganismeLocal;
  pointJustice?: OrganismeLocal;
  carsat?: OrganismeLocal;
  conciliateur?: OrganismeLocal;
}

const ORGANISMES = data as Record<string, DepartementData>;

/** Département (ou collectivité d'outre-mer) d'un code postal : même règle que la fiche. */
function codePostalVersDepartement(cp: string): string | null {
  return departementDepuisCodePostal(cp) || null;
}

type Lien = 'conjoint' | 'associe' | 'ami' | 'comptable' | 'autre';
type EtatPercu = 'stress' | 'epuise' | 'en-colere' | 'ferme';
type Besoin = 'comprendre' | 'parler' | 'agir' | 'proteger';

interface Choice<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

const LIENS: Choice<Lien>[] = [
  { value: 'conjoint', label: 'Conjoint·e / partenaire' },
  { value: 'associe', label: 'Associé·e' },
  { value: 'ami', label: 'Ami·e proche' },
  { value: 'comptable', label: 'Expert-comptable / avocat' },
  { value: 'autre', label: 'Autre (salarié, famille…)' },
];

const ETATS: Choice<EtatPercu>[] = [
  { value: 'stress', label: 'Stressé·e mais encore actif·ve', hint: 'Il/elle agit, mais vous sentez la pression' },
  { value: 'epuise', label: 'Épuisé·e, replié·e sur soi', hint: 'Il/elle ne parle plus, dort mal, s\'isole' },
  { value: 'en-colere', label: 'En colère, dans le déni', hint: 'Il/elle refuse d\'en parler ou minimise' },
  { value: 'ferme', label: 'Fermé·e, vous n\'arrivez plus à communiquer', hint: 'Le sujet est devenu tabou' },
];

const BESOINS: Choice<Besoin>[] = [
  { value: 'comprendre', label: 'Comprendre ce qu\'il/elle traverse', hint: 'Vous voulez y voir clair' },
  { value: 'parler', label: 'Savoir comment lui en parler', hint: 'Trouver les bons mots' },
  { value: 'agir', label: 'Savoir quoi faire concrètement', hint: 'Appeler quelqu\'un, l\'orienter' },
  { value: 'proteger', label: 'Protéger votre famille / patrimoine', hint: 'Anticiper l\'impact sur votre foyer' },
];

/** Libellé lisible d'une réponse (jamais le code technique « en-colere »). */
function libelleChoix<T extends string>(choix: Choice<T>[], valeur?: T): string {
  const label = choix.find((c) => c.value === valeur)?.label ?? '';
  return label ? label.charAt(0).toLowerCase() + label.slice(1) : '';
}

interface Answers {
  lien?: Lien;
  etat?: EtatPercu;
  besoin?: Besoin;
}

function buildConseils(a: Answers) {
  const conseils: { titre: string; texte: string; lien?: string; lienLabel?: string }[] = [];

  // Always first: take care of yourself
  conseils.push({
    titre: 'Prenez soin de vous aussi',
    texte: 'Accompagner un·e dirigeant·e en difficulté, c\'est porter du poids. Vous avez le droit de demander de l\'aide pour vous : le 3114 répond aussi aux proches inquiets, 24 h/24, gratuitement.',
    lien: 'tel:3114',
    lienLabel: 'Appeler le 3114',
  });

  if (a.etat === 'epuise' || a.etat === 'ferme') {
    conseils.push({
      titre: 'Ne restez pas seul·e face à son silence',
      texte: 'Quand un·e dirigeant·e s\'isole, c\'est souvent par honte — pas par rejet de vous. Ne forcez pas la conversation, mais restez présent·e. Un simple « je suis là » suffit parfois.',
    });
    conseils.push({
      titre: 'Alertez un professionnel',
      texte: 'Si vous êtes inquiet·e pour sa santé mentale, vous pouvez appeler le 3114 vous-même — il vous conseillera sur la marche à suivre, même si ce n\'est pas vous qui dirigez l\'entreprise. Pour un soutien psychologique de la personne dirigeante, orientez-la vers le numéro vert 0 805 65 50 50 (association APESA).',
      lien: 'tel:3114',
      lienLabel: 'Appeler le 3114',
    });
  }

  if (a.etat === 'en-colere') {
    conseils.push({
      titre: 'La colère est souvent de la peur déguisée',
      texte: 'Un dirigeant en colère qui « refuse d\'en parler » a souvent très peur de perdre le contrôle. Ne le/la confrontez pas frontalement — proposez plutôt un rendez-vous avec un tiers (CCI, expert-comptable).',
    });
  }

  if (a.besoin === 'comprendre') {
    conseils.push({
      titre: 'Les procédures expliquées simplement',
      texte: 'Redressement, liquidation, conciliation… ces mots font peur, mais la plupart des procédures visent à sauver l\'entreprise, pas à la condamner.',
      lien: '/glossaire',
      lienLabel: 'Voir le glossaire',
    });
    conseils.push({
      titre: 'Comparez les options',
      texte: 'Un tableau clair des procédures possibles selon la situation.',
      lien: '/procedures',
      lienLabel: 'Voir le tableau comparatif',
    });
  }

  if (a.besoin === 'parler') {
    conseils.push({
      titre: 'Comment aborder le sujet',
      texte: 'Des phrases concrètes pour ouvrir la conversation sans dramatiser ni minimiser.',
      lien: '/proches',
      lienLabel: 'Lire le guide',
    });
  }

  if (a.besoin === 'agir') {
    conseils.push({
      titre: 'Orientez-le/la vers la CCI',
      texte: 'La CCI propose un accompagnement gratuit et confidentiel pour les dirigeants en difficulté. Vous pouvez même appeler à sa place pour prendre un premier rendez-vous.',
    });
    conseils.push({
      titre: 'Proposez-lui de faire le diagnostic Solelis ensemble',
      texte: 'Asseyez-vous avec lui/elle, entrez son SIRET sur Solelis et parcourez la fiche ensemble. C\'est souvent plus facile à deux.',
      lien: '/',
      lienLabel: 'Commencer le diagnostic',
    });
  }

  if (a.besoin === 'proteger') {
    conseils.push({
      titre: 'Consultez un notaire',
      texte: 'Si vous êtes conjoint·e, un notaire peut vous aider à protéger votre patrimoine personnel (résidence principale, épargne). Demandez un rendez-vous rapidement.',
      lien: 'https://www.notaires.fr',
      lienLabel: 'notaires.fr',
    });
    if (a.lien === 'conjoint') {
      conseils.push({
        titre: 'Vérifiez votre régime matrimonial',
        texte: 'En communauté de biens, les dettes de l\'entreprise peuvent affecter le patrimoine commun. Un avocat peut vous éclairer sur vos droits et protections possibles.',
      });
    }
  }

  if (a.lien === 'comptable') {
    conseils.push({
      titre: 'Votre rôle est clé',
      texte: 'En tant que professionnel du chiffre, vous pouvez orienter votre client vers un mandat ad hoc ou une conciliation avant qu\'il ne soit trop tard. Un CIP (Centre d\'Information sur la Prévention) peut vous accompagner.',
      lien: 'https://www.cip-national.fr',
      lienLabel: 'cip-national.fr',
    });
  }

  // Always: aides financières
  conseils.push({
    titre: 'Des aides existent — beaucoup sont méconnues',
    texte: 'Bpifrance, médiation du crédit, action sociale CPAM… Parcourez la liste ensemble.',
    lien: '/aides',
    lienLabel: 'Voir les aides',
  });

  return conseils;
}

export default function AccompagnantQuestionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [codePostal, setCodePostal] = useState('');

  const departement = useMemo(() => {
    const dep = codePostalVersDepartement(codePostal);
    if (!dep) return null;
    return ORGANISMES[dep] ?? null;
  }, [codePostal]);

  const slides = [
    { title: 'Quel est votre lien avec le dirigeant ?', key: 'lien' as const, choices: LIENS },
    { title: 'Comment percevez-vous son état ?', key: 'etat' as const, choices: ETATS },
    { title: 'De quoi avez-vous besoin aujourd\'hui ?', key: 'besoin' as const, choices: BESOINS },
  ];

  function select(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => {
      if (step < 2) setStep((s) => s + 1);
    }, 280);
  }

  const showResults = step >= 2 && answers.besoin;
  const conseils = showResults ? buildConseils(answers) : [];
  const progress = showResults ? 100 : ((step + 1) / 3) * 100;

  return (
    <div>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-navy/50">
          <span>{showResults ? 'Vos conseils' : `Étape ${step + 1} sur 3`}</span>
          <span>{Math.round(progress)} %</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
          <m.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full rounded-full bg-gradient-to-r from-vert to-bleu"
          />
        </div>
      </div>

      {!showResults && (
        <AnimatePresence mode="wait">
          <m.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="glass card-top-line p-6 sm:p-10"
          >
            <h2 className="font-display text-2xl text-navy sm:text-3xl">
              {slides[Math.min(step, slides.length - 1)].title}
            </h2>
            <div className="mt-6 space-y-3">
              {slides[Math.min(step, slides.length - 1)].choices.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { const s = slides[step]; if (s) select(s.key, c.value); }}
                  className="group flex w-full items-start gap-4 rounded-2xl border border-navy/10 bg-white/70 px-5 py-4 text-left transition hover:border-vert hover:bg-white"
                >
                  <span className="mt-1 h-5 w-5 shrink-0 rounded-full border border-navy/20 group-hover:border-vert" />
                  <span>
                    <span className="block font-medium text-navy">{c.label}</span>
                    {c.hint && (
                      <span className="mt-0.5 block text-xs text-navy/55">{c.hint}</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-sm text-navy/50 hover:text-navy disabled:opacity-40"
              >
                ← Précédent
              </button>
            </div>
          </m.div>
        </AnimatePresence>
      )}

      {showResults && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass card-top-line p-6 sm:p-8">
            <h2 className="font-display text-2xl text-navy">
              Ce que nous vous conseillons
            </h2>
            <p className="mt-2 text-sm text-navy/60">
              Basé sur vos réponses : {[libelleChoix(LIENS, answers.lien), libelleChoix(ETATS, answers.etat), libelleChoix(BESOINS, answers.besoin)].filter(Boolean).join(' · ')}.
            </p>
          </div>

          {conseils.map((c, i) => (
            <div key={i} className="glass-soft p-5">
              <h3 className="font-display text-lg text-navy">{c.titre}</h3>
              <p className="mt-2 text-sm text-navy/80">{c.texte}</p>
              {c.lien && (
                <a
                  href={c.lien}
                  target={c.lien.startsWith('/') ? undefined : '_blank'}
                  rel={c.lien.startsWith('/') ? undefined : 'noreferrer'}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-bleu-fonce underline underline-offset-4"
                >
                  {c.lienLabel} →
                </a>
              )}
            </div>
          ))}

          {/* Services localisés */}
          <div className="glass card-top-line p-6 sm:p-8">
            <h2 className="font-display text-xl text-navy">
              Services près de chez vous
            </h2>
            <p className="mt-2 text-sm text-navy/60">
              Entrez un code postal pour trouver les interlocuteurs locaux.
            </p>
            <div className="mt-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="Code postal (ex : 75001)"
                value={codePostal}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setCodePostal(v);
                }}
                className="w-full rounded-xl border border-navy/15 bg-white/60 px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-bleu/50 focus:outline-none focus:ring-1 focus:ring-bleu/30 sm:w-64"
                aria-label="Code postal"
              />
            </div>

            {codePostal.length === 5 && !departement && (
              <p className="mt-3 text-sm text-rouge/80">
                Aucune donnée pour ce code postal. Vérifiez votre saisie.
              </p>
            )}

            {departement && (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 space-y-3"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-navy/50">
                  {departement.nom} ({departement.code})
                </p>

                {/* CCI locale */}
                {departement.cci && (
                  <div className="glass-soft flex items-start gap-3 rounded-2xl p-4">
                    <span className="mt-0.5 text-lg" aria-hidden="true">🏢</span>
                    <div>
                      <p className="font-display text-base text-navy">{departement.cci.nom}</p>
                      <p className="mt-0.5 text-xs text-navy/60">
                        Accompagnement gratuit · Premier rendez-vous confidentiel
                      </p>
                      {departement.cci.telephone && (
                        <a
                          href={`tel:${departement.cci.telephone.replace(/\s/g, '')}`}
                          className="mt-1 inline-block text-sm font-medium text-bleu-fonce"
                        >
                          {departement.cci.telephone}
                        </a>
                      )}
                      {departement.cci.telephoneNote && (
                        <span className="block text-[11px] text-navy/55">{departement.cci.telephoneNote}</span>
                      )}
                      {departement.cci.site && (
                        <a
                          href={departement.cci.site}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-3 text-sm text-bleu-fonce underline underline-offset-4"
                        >
                          Site web
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Tribunal compétent (commerce, activités économiques ou chambre commerciale) */}
                {departement.tribunal && (
                  <div className="glass-soft flex items-start gap-3 rounded-2xl p-4">
                    <span className="mt-0.5 text-lg" aria-hidden="true">🏛️</span>
                    <div>
                      <p className="font-display text-base text-navy">{departement.tribunal.nom}</p>
                      <p className="mt-0.5 text-xs text-navy/60">
                        Procédures collectives, conciliation, mandat ad hoc
                      </p>
                      {departement.tribunal.telephone && (
                        <a
                          href={`tel:${departement.tribunal.telephone.replace(/\s/g, '')}`}
                          className="mt-1 inline-block text-sm font-medium text-bleu-fonce"
                        >
                          {departement.tribunal.telephone}
                        </a>
                      )}
                      {departement.tribunal.telephoneNote && (
                        <span className="block text-[11px] text-navy/55">{departement.tribunal.telephoneNote}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* CIP */}
                <div className="glass-soft flex items-start gap-3 rounded-2xl p-4">
                  <span className="mt-0.5 text-lg" aria-hidden="true">🤝</span>
                  <div>
                    <p className="font-display text-base text-navy">
                      CIP — Prévention des difficultés
                    </p>
                    <p className="mt-0.5 text-xs text-navy/60">
                      Permanence gratuite, confidentielle, sans rendez-vous
                    </p>
                    <a
                      href="/annuaires/cip"
                      className="mt-1 inline-block text-sm text-bleu-fonce underline underline-offset-4"
                    >
                      Trouver le CIP le plus proche →
                    </a>
                  </div>
                </div>

                {/* Lien annuaires */}
                <div className="glass-soft flex items-start gap-3 rounded-2xl p-4">
                  <span className="mt-0.5 text-lg" aria-hidden="true">⚖️</span>
                  <div>
                    <p className="font-display text-base text-navy">
                      Trouver un avocat près de chez vous
                    </p>
                    <p className="mt-0.5 text-xs text-navy/60">
                      Droit des entreprises en difficulté, droit social
                    </p>
                    <a
                      href="/annuaires"
                      className="mt-1 inline-block text-sm text-bleu-fonce underline underline-offset-4"
                    >
                      Consulter les annuaires →
                    </a>
                  </div>
                </div>
              </m.div>
            )}
          </div>

          <button
            type="button"
            onClick={() => { setStep(0); setAnswers({}); setCodePostal(''); }}
            className="btn-ghost mx-auto flex"
          >
            ← Recommencer
          </button>
        </m.div>
      )}
    </div>
  );
}
