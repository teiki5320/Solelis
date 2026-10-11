'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié aux emprunts garantis par Bpifrance (ex-OSEO Garantie).
 * À ne pas confondre avec le PGE (couvert par BlocPGE).
 *
 * Concerne tout prêt bancaire dont une part est
 * garantie par Bpifrance — courant en TPE/PME, notamment pour
 * création, croissance, transmission, innovation.
 *
 * S'affiche dès qu'il y a une tension bancaire (probleme === 'banque'
 * ou situation === 'tresorie').
 */
export default function BlocGarantieBPI() {
  const { reponses } = useFiche();
  const pertinent =
    reponses.probleme === 'banque' || reponses.situation === 'tresorie';
  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="🤝"
      titre="Emprunt garanti Bpifrance — comprendre vos marges de négociation"
      soustitre="Tout prêt avec garantie Bpifrance (hors PGE) : règles, leviers, médiation"
    >
      <p className="text-sm text-navy/80">
        Si votre banque a obtenu une <strong>garantie Bpifrance</strong>{' '}
        (ex-OSEO) sur tout ou partie de votre prêt, elle est partiellement
        protégée contre votre défaillance. Cela <strong>change la
        dynamique de négociation</strong> : la banque a moins à perdre,
        mais la garantie elle-même obéit à des règles que votre banque
        doit respecter pour en bénéficier.
      </p>

      {/* Comment ça marche */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Comment fonctionne la garantie Bpifrance
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            La garantie est <strong>plafonnée</strong> : elle ne couvre
            qu&apos;une partie du capital restant dû (quotité indiquée dans
            le contrat).
          </li>
          <li>
            Elle n&apos;indemnise la banque qu&apos;aux conditions prévues
            par les conditions générales de Bpifrance (défaillance de
            l&apos;emprunteur, diligences de recouvrement).
          </li>
          <li>
            <strong>Elle protège la banque, pas vous</strong> : la
            garantie ne réduit pas ce que vous devez. Vous (et vos
            cautions éventuelles) restez tenus de la totalité du prêt.
          </li>
          <li>
            Selon Bpifrance, sa garantie <strong>limite en général la
            demande de cautions personnelles</strong> et protège votre
            résidence principale ; vérifiez dans votre contrat le montant
            exact de la caution demandée (bpifrance-creation.fr).
          </li>
        </ul>
      </div>

      {/* Marges de négociation */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">Vos marges de négociation</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>La banque préfère négocier qu&apos;activer la garantie</strong> :
            l&apos;activation est longue, lourde administrativement,
            partielle. Beaucoup préfèrent un réaménagement amiable.
          </li>
          <li>
            <strong>Demandez explicitement un moratoire</strong> ou un
            allongement : votre banque peut vérifier auprès de Bpifrance
            les conditions de maintien de la garantie en cas de
            réaménagement.
          </li>
          <li>
            <strong>Une procédure collective permet à la banque de
            mettre en jeu la garantie</strong> : elle déclare sa créance
            au passif et se tourne vers Bpifrance pour sa perte. Une fois
            le jugement d&apos;ouverture prononcé, la marge de
            négociation amiable se réduit — d&apos;où l&apos;intérêt
            d&apos;anticiper avec un mandat ad hoc / une conciliation
            (confidentiels).
          </li>
          <li>
            <strong>Caution personnelle sur un prêt garanti par Bpifrance</strong> : si vous avez signé
            une caution personnelle pour la part NON garantie, vérifiez
            sa proportionnalité et l&apos;information annuelle — art. 2300
            et 2302 du code civil pour les cautions signées depuis 2022,
            anciens art. L332-1 et L333-2 C. conso (ex-L341-4 et L341-6)
            pour les plus anciennes. Certaines sont contestables.
          </li>
        </ul>
      </div>

      {/* Cas particuliers */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Dispositifs Bpifrance courants en TPE/PME
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Garantie Création</strong> : prêt création/reprise.
          </li>
          <li>
            <strong>Garantie Développement</strong> : croissance,
            investissement.
          </li>
          <li>
            <strong>Garantie Transmission</strong> : rachat de fonds ou
            de parts.
          </li>
          <li>
            <strong>Garantie Innovation</strong> : projets R&amp;D,
            innovation.
          </li>
          <li>
            La <strong>quotité garantie</strong> varie selon le fonds et
            l&apos;opération (par exemple 50 % pour une reprise, 70 % avec
            une intervention de la Région) : elle figure dans votre contrat.
          </li>
          <li>
            <strong>Prêts directs Bpifrance</strong> (développement,
            renforcement de trésorerie) — différents de la garantie sur
            prêt bancaire ; les offres et montants évoluent, vérifiez-les
            sur www.bpifrance.fr.
          </li>
        </ul>
      </div>

      {/* Procédure */}
      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">Procédure recommandée</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-navy/80">
          <li>
            <strong>Identifier la garantie</strong> dans votre contrat
            de prêt (souvent dans les conditions particulières).
          </li>
          <li>
            <strong>Contacter votre conseiller bancaire</strong> en LRAR
            pour demander un réaménagement (moratoire, allongement,
            différé). Demandez une réponse écrite.
          </li>
          <li>
            <strong>En parallèle, contacter la direction régionale
            Bpifrance</strong> — son conseiller pourra vous dire si la
            garantie permet ce réaménagement.
          </li>
          <li>
            <strong>Si refus</strong> : saisir la Médiation du crédit
            (34 14, gratuit, confidentiel).
          </li>
          <li>
            <strong>Mandat ad hoc ou conciliation</strong> si la
            situation est plus grave : permet de tout renégocier dans un
            cadre confidentiel sans déclencher la procédure collective.
            Seul l&apos;accord de conciliation peut être homologué par le
            tribunal (art. L611-8 C. com.).
          </li>
        </ol>
      </div>

      {/* Contacts */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">Bpifrance Direction Régionale</p>
          <p className="mt-1 text-xs text-navy/60">Conseil sur le statut de votre garantie</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://www.bpifrance.fr/contactez-nous"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> bpifrance.fr/contactez-nous
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">Médiation du crédit BdF</p>
          <p className="mt-1 text-xs text-navy/60">Gratuit et confidentiel</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a href="tel:3414" className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"><span aria-hidden>☎</span> 34 14</a>
            <a
              href="https://mediateur-credit.banque-france.fr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> mediateur-credit.banque-france.fr
            </a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : Bpifrance — conditions générales des garanties ;
        bpifrance-creation.fr (dispositifs de garantie : quotités,
        cautions personnelles) ; Médiation du crédit aux entreprises ; Code
        civil, art. 2300 et 2302.
      </p>
    </BlocAccordeon>
  );
}
