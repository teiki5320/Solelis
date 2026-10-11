'use client';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié au crédit-bail (leasing) et à la location longue durée.
 * Le matériel financé est très répandu (véhicules, machines,
 * équipements) — le bloc s'affiche systématiquement.
 *
 * Couvre la qualification des contrats, le sort du matériel et de
 * l'indemnité de résiliation en procédure collective, et les contacts
 * utiles (ASF — Association française des Sociétés Financières).
 */
export default function BlocCreditBail() {
  return (
    <BlocAccordeon
      icone="🚛"
      titre="Crédit-bail et leasing"
      soustitre="Continuation du contrat, restitution, indemnité de résiliation : ce qui change en procédure"
    >
      <p className="text-sm text-navy/80">
        Véhicules utilitaires, machines, matériel informatique, copieurs :
        une part importante du parc productif est financée en{' '}
        <strong>crédit-bail</strong> ou en <strong>location longue durée
        (LLD)</strong>. En cas de difficulté, le traitement de ces contrats
        obéit à des règles très différentes du simple loyer d&apos;exploitation.
      </p>

      {/* Distinction des contrats */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Bien distinguer les trois formules
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Loyer simple (location classique)</strong> : aucune
            option d&apos;achat. Le matériel reste la propriété du bailleur.
          </li>
          <li>
            <strong>Crédit-bail (leasing)</strong> : contrat encadré par
            les art. <strong>L313-7 et s. du Code monétaire et financier</strong>,
            avec <strong>option d&apos;achat</strong> en fin de contrat
            (valeur résiduelle prédéfinie).
          </li>
          <li>
            <strong>Location longue durée (LLD)</strong> : pas d&apos;option
            d&apos;achat. Souvent assortie de prestations (entretien,
            assurance). Régime juridique de la location civile / commerciale.
          </li>
        </ul>
      </div>

      {/* Continuation du contrat en procédure */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">
          Continuation du contrat en cours
        </p>
        <p className="mt-2 text-sm text-navy/80">
          En sauvegarde, redressement ou liquidation,{' '}
          <strong>l&apos;administrateur judiciaire (ou le liquidateur)
          dispose d&apos;une option</strong> sur les contrats en cours
          (art. <strong>L622-13 C. com.</strong> ; art. L641-11-1 en
          liquidation) :
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Poursuivre le contrat</strong> : le crédit-bailleur ne
            peut pas le résilier pour les impayés antérieurs au jugement.
            Les loyers postérieurs deviennent des créances privilégiées.
          </li>
          <li>
            <strong>Renoncer au contrat</strong> : le matériel est restitué,
            l&apos;indemnité de résiliation devient une créance chirographaire
            antérieure (déclarée au passif).
          </li>
        </ul>
        <p className="mt-2 text-sm text-navy/80">
          C&apos;est un levier majeur : un matériel essentiel à
          l&apos;exploitation peut être conservé même en cas d&apos;impayés.
        </p>
      </div>

      {/* Restitution du matériel */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Restitution du matériel
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Le crédit-bailleur reste propriétaire du bien tant que
          l&apos;option d&apos;achat n&apos;est pas levée. En cas de
          résiliation, il peut exiger la restitution. Pour être opposable
          aux autres créanciers en procédure collective, le contrat doit
          être <strong>publié au greffe</strong> (art. R313-4 à R313-10
          CMF). À défaut, le bailleur ne peut pas opposer son droit de
          propriété aux créanciers (sauf s&apos;il prouve qu&apos;ils en
          avaient connaissance), et le matériel peut être vendu au profit
          de la procédure. Même publié, le contrat ne dispense pas de
          demander la restitution du bien dans les 3 mois suivant la
          publication du jugement d&apos;ouverture (art. L624-9 et L624-10
          C. com.).
        </p>
      </div>

      {/* Indemnité de résiliation */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          Indemnité de résiliation — souvent négociable
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Le contrat peut prévoir une indemnité égale à{' '}
          <strong>la totalité des loyers restant à échoir</strong>{' '}
          (parfois actualisés), majorée de la valeur résiduelle : lisez la
          clause de résiliation. Une telle indemnité est une{' '}
          <strong>clause pénale</strong> : le juge peut la réduire à de <strong>justes proportions</strong>{' '}
          (art. <strong>1231-5 C. civ.</strong>) si elle est manifestement
          excessive par rapport au préjudice réel du bailleur (perte
          financière nette après revente du matériel).
        </p>
        <p className="mt-2 text-sm text-navy/80">
          En procédure collective, l&apos;indemnité constitue une{' '}
          <strong>créance chirographaire</strong> (sans privilège) qui sera
          payée au marc le franc selon les disponibilités. En liquidation,
          elle n&apos;est payée que si l&apos;actif le permet.
        </p>
      </div>

      {/* Plan de continuation */}
      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">
          Plan de continuation incluant le matériel
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Dans le cadre d&apos;un plan de sauvegarde ou de redressement,
          le matériel essentiel peut être <strong>intégré au plan</strong>{' '}
          : les loyers impayés antérieurs au jugement (déclarés au passif)
          peuvent être rééchelonnés sur la durée du plan, 10 ans au plus
          (art. L626-12 et L626-18 C. com.) ; le tribunal peut imposer ces
          délais au crédit-bailleur qui les refuse. Les loyers à échoir du
          contrat poursuivi restent dus à leurs échéances.
        </p>
      </div>

      {/* Exemples concrets */}
      <div className="mt-4 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          3 cas concrets pour comprendre
        </p>
        <div className="mt-3 space-y-4 text-sm text-navy/80">
          <div>
            <p className="font-medium text-navy">
              🚛 Cas 1 — Camion 19T en crédit-bail, RJ avec 4 mois d&apos;impayés
            </p>
            <p className="mt-1">
              Loyer mensuel 1 600 € · contrat 60 mois, 38 mois écoulés ·
              valeur résiduelle 8 000 €. Au jugement d&apos;ouverture, le
              crédit-bailleur ne peut pas résilier pour les impayés
              antérieurs. L&apos;administrateur opte pour la continuation
              (le camion est indispensable). Les 4 mois d&apos;impayés
              deviennent créance antérieure (chirographaire) ; les loyers
              à venir sont créances postérieures privilégiées et doivent
              être payés rubis sur l&apos;ongle.
            </p>
          </div>
          <div>
            <p className="font-medium text-navy">
              🖨️ Cas 2 — Photocopieur en LLD, liquidation
            </p>
            <p className="mt-1">
              Loyer 320 €/mois · contrat 36 mois, 24 mois restants ·
              indemnité contractuelle de résiliation = 320 × 24 = 7 680 €.
              Le liquidateur restitue le matériel. Le bailleur revend
              4 000 €. Préjudice réel ≈ 3 680 €. La clause de
              7 680 € est jugée excessive → le juge la réduit à
              4 500 € (art. 1231-5 C. civ.). Le bailleur déclare 4 500 €
              au passif chirographaire — payé seulement si l&apos;actif le permet.
            </p>
          </div>
          <div>
            <p className="font-medium text-navy">
              🏗️ Cas 3 — Pelleteuse leasing, contrat non publié au greffe
            </p>
            <p className="mt-1">
              Valeur matériel 80 000 €. Crédit-bailleur n&apos;a pas
              publié son contrat au greffe. En liquidation, il revendique
              la pelleteuse. <strong>Le liquidateur refuse</strong> : sans
              publication, ses droits sont inopposables aux créanciers
              (art. R313-10 CMF). La pelleteuse est vendue au profit de
              tous les créanciers. Conséquence :
              le bailleur perd son bien et ne récupère que sa part
              chirographaire — c&apos;est dur, mais c&apos;est la règle.
            </p>
          </div>
        </div>
      </div>

      {/* Contact ASF */}
      <div className="mt-5 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">
          ASF — Association française des Sociétés Financières
        </p>
        <p className="mt-1 text-xs text-navy/60">
          Association professionnelle des sociétés de financement
          spécialisées, dont le crédit-bail. Elle propose un service de
          médiation en cas de litige avec un établissement adhérent.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a
            href="tel:0153815151"
            className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
          >
            <span aria-hidden>☎</span> 01 53 81 51 51
          </a>
          <a
            href="https://www.asf-france.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
          >
            <span aria-hidden>🌐</span> asf-france.com
          </a>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : Code monétaire et financier, art. L313-7 à L313-11 et
        R313-4 à R313-10 (publicité) ;
        Code de commerce, art. L622-13 et L641-11-1 (contrats en cours),
        L624-9 et L624-10 (revendication), L626-12 et L626-18 (plan) ;
        Code civil, art. 1231-5 (réduction des clauses pénales).
      </p>
    </BlocAccordeon>
  );
}
