'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié aux spécificités du franchisé en difficulté.
 * Ne s'affiche que si la personne s'est identifiée comme franchisé·e
 * dans le questionnaire (reponses.franchise === 'oui').
 *
 * Couvre les principaux leviers : DIP, royalties, droit d'entrée,
 * clause de non-concurrence, médiation FFF, et articulation avec
 * une conciliation au tribunal de commerce pour suspendre les
 * paiements au franchiseur.
 */
export default function BlocFranchise() {
  const { reponses } = useFiche();

  if (reponses.franchise !== 'oui') return null;

  return (
    <BlocAccordeon
      icone="🏪"
      titre="Franchise — vos droits spécifiques"
      soustitre="DIP, royalties, non-concurrence : leviers méconnus pour franchisés en difficulté"
    >
      <p className="text-sm text-navy/80">
        Le contrat de franchise crée une dépendance économique forte vis-à-vis
        du franchiseur. En cas de difficulté, plusieurs leviers légaux et
        contractuels existent pour rééquilibrer la relation, suspendre
        certains paiements ou sortir du réseau dans de bonnes conditions.
      </p>

      {/* DIP */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          DIP — Document d&apos;Information Précontractuel
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Le franchiseur doit vous remettre un DIP <strong>au moins 20 jours
          avant la signature</strong> du contrat (art. <strong>L330-3 du
          Code de commerce</strong>, loi Doubin). Le DIP doit contenir :
          présentation du réseau, état du marché local, comptes du
          franchiseur, liste des franchisés sortants, etc.
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Un DIP <strong>incomplet, mensonger ou tardif</strong> peut justifier
          l&apos;annulation du contrat pour <strong>vice du consentement</strong>{' '}
          (dol ou erreur), avec restitution du droit d&apos;entrée et
          dommages-intérêts. Faites auditer votre DIP par un avocat
          spécialisé en droit de la distribution.
        </p>
      </div>

      {/* Royalties */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">
          Royalties et redevances — renégociation possible
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Les redevances (forfaitaires ou indexées sur le chiffre
          d&apos;affaires) peuvent être <strong>renégociées à l&apos;amiable</strong>{' '}
          en cas de baisse durable d&apos;activité. La <strong>médiation
          interne</strong> au réseau, puis la <strong>médiation FFF</strong>{' '}
          permettent d&apos;obtenir des moratoires, des baisses temporaires
          ou la suspension de la redevance de publicité.
        </p>
        <p className="mt-2 text-sm text-navy/80">
          En cas de <strong>conciliation au tribunal de commerce</strong>, le
          conciliateur peut négocier une <strong>suspension des paiements au
          franchiseur</strong> dans le cadre du protocole d&apos;accord, au
          même titre que les autres créanciers.
        </p>
      </div>

      {/* Droit d'entrée */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Droit d&apos;entrée — récupération difficile
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Le droit d&apos;entrée versé à la signature est en principe{' '}
          <strong>non remboursable</strong>, sauf si vous démontrez un{' '}
          <strong>vice du contrat</strong> (DIP défaillant, défaut d&apos;assistance
          du franchiseur, savoir-faire inexistant ou inadapté). La
          jurisprudence retient la nullité dès lors que le franchiseur n&apos;a
          pas réellement transmis un savoir-faire substantiel et identifié.
        </p>
      </div>

      {/* Non-concurrence */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          Clause de non-concurrence post-contractuelle
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Depuis la <strong>loi Macron (2015)</strong> et le règlement
          européen 330/2010, la clause de non-concurrence post-contractuelle
          n&apos;est valable que si elle est :
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li><strong>Limitée à 1 an maximum</strong> après la fin du contrat</li>
          <li>Limitée aux <strong>locaux où vous exerciez</strong> (pas de
            zone géographique étendue)</li>
          <li>Indispensable à la protection du savoir-faire transmis</li>
          <li>Proportionnée aux intérêts du franchiseur</li>
        </ul>
        <p className="mt-2 text-sm text-navy/80">
          Toute clause excédant ces limites est <strong>réputée non écrite</strong>.
          Vous pouvez donc reprendre une activité similaire dès lors que
          ces conditions ne sont pas respectées.
        </p>
      </div>

      {/* Médiation FFF */}
      <div className="mt-5 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">
          Médiation de la Fédération Française de la Franchise (FFF)
        </p>
        <p className="mt-1 text-xs text-navy/60">
          Service gratuit et confidentiel, ouvert même si le franchiseur
          n&apos;est pas adhérent FFF
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a
            href="tel:0153752225"
            className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
          >
            <span aria-hidden>☎</span> 01 53 75 22 25
          </a>
          <a
            href="https://www.franchise-fff.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
          >
            <span aria-hidden>🌐</span> franchise-fff.com
          </a>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : Code de commerce, art. L330-3 (loi Doubin du 31 décembre 1989) ;
        Règlement UE 330/2010 sur les restrictions verticales ; loi Macron
        n° 2015-990 du 6 août 2015 ; Fédération Française de la Franchise.
      </p>
    </BlocAccordeon>
  );
}
