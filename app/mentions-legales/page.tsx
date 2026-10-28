import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Identification de l'éditeur (LCEN, art. 6 III).
 * Mêmes informations que les mentions légales publiées sur toakeur.com.
 */
const EDITEUR = {
  nomOuRaisonSociale: 'ALOHASH, nom commercial TOA CORP',
  formeEtCapital: 'Société par actions simplifiée (SAS) au capital de 200 €',
  adresse: 'La Petite Sigonnière, 85190 Maché, France',
  siren: 'RCS La Roche-sur-Yon 938 522 596',
  tva: 'FR16 938 522 596',
  directeurPublication: 'le président de la société ALOHASH',
  email: 'solelis@toakeur.com',
};

export const metadata: Metadata = {
  alternates: { canonical: '/mentions-legales' },
  title: 'Mentions légales — Solelis',
  description: 'Mentions légales de la plateforme Solelis : éditeur, hébergeur, contact, propriété intellectuelle.',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

export default function MentionsLegalesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Accueil
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">Mentions légales</h1>
      <p className="mt-3 text-sm text-navy/60">Dernière mise à jour : 10 octobre 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy/80">

        <section>
          <h2 className="font-display text-lg text-navy">1. Éditeur du site</h2>
          <p className="mt-2">
            Le présent site <strong>solelis.com</strong> est un service gratuit d&apos;information et d&apos;orientation
            des dirigeant·e·s d&apos;entreprise en difficulté. Il est édité par :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Nom ou raison sociale</strong> : {EDITEUR.nomOuRaisonSociale}</li>
            <li><strong>Forme juridique et capital</strong> : {EDITEUR.formeEtCapital}</li>
            <li><strong>Siège social</strong> : {EDITEUR.adresse}</li>
            <li><strong>SIREN / RCS</strong> : {EDITEUR.siren}</li>
            <li><strong>Directeur·rice de la publication</strong> : {EDITEUR.directeurPublication}</li>
            <li><strong>TVA intracommunautaire</strong> : {EDITEUR.tva}</li>
            <li>
              <strong>Email</strong> :{' '}
              <a href={`mailto:${EDITEUR.email}`} className="text-bleu-fonce underline">{EDITEUR.email}</a>
            </li>
          </ul>
          <p className="mt-2">
            Solelis n&apos;est ni un cabinet d&apos;avocat, ni un mandataire judiciaire, ni un expert-comptable.
            Il s&apos;agit d&apos;un outil d&apos;information et d&apos;orientation, qui ne se substitue en aucun cas
            à un conseil personnalisé.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">2. Hébergeur</h2>
          <p className="mt-2">
            Le site est hébergé par <strong>Cloudflare, Inc.</strong> · 101 Townsend St, San Francisco, CA 94107, États-Unis ·
            téléphone : +1 650 319 8930 ·{' '}
            <a href="https://www.cloudflare.com" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">cloudflare.com</a>
          </p>
          <p className="mt-2">
            La base de données utilisateurs (Cloudflare D1) est hébergée par <strong>Cloudflare, Inc.</strong>, avec
            un stockage limité à l&apos;Union européenne.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">3. Propriété intellectuelle</h2>
          <p className="mt-2">
            L&apos;ensemble des contenus du site (textes, illustrations, calculateurs, modèles de courriers, données
            structurées) sont protégés par le Code de la propriété intellectuelle.
          </p>
          <p className="mt-2">
            Toute reproduction, représentation ou diffusion totale ou partielle nécessite une autorisation préalable.
            L&apos;usage personnel et l&apos;impression de votre fiche personnalisée sont libres.
          </p>
          <p className="mt-2">
            Les marques, logos et signes distinctifs des organismes cités (URSSAF, Bpifrance, CCSF, etc.) restent
            la propriété de leurs détenteurs respectifs.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">4. Sources et fiabilité des informations</h2>
          <p className="mt-2">
            Toutes les informations juridiques publiées sur Solelis sont issues de sources officielles :
            Code de commerce, Code du travail, Code de la sécurité sociale, sites .gouv.fr, INSEE, BODACC, etc.
            Les références aux articles de loi sont systématiquement citées.
          </p>
          <p className="mt-2">
            Les coordonnées des organismes (DDFiP, barreaux, chambres notaires, chambres d&apos;agriculture)
            sont collectées via des annuaires publics et vérifiées périodiquement. Pour une garantie absolue
            d&apos;exactitude, vérifiez systématiquement auprès du site officiel de l&apos;organisme avant tout
            envoi de courrier ou de pièce.
          </p>
          <p className="mt-2">
            Les fourchettes de coûts, multiples sectoriels et taux de réfaction issus de la pratique des
            mandataires/commissaires-priseurs sont <strong>indicatifs</strong> et non opposables.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">5. Limitation de responsabilité</h2>
          <p className="mt-2">
            Solelis met à disposition des informations pour orienter les dirigeants. <strong>Ces informations ne
            constituent en aucun cas un conseil juridique, fiscal ou comptable personnalisé.</strong>
          </p>
          <p className="mt-2">
            Aucune décision de procédure collective (sauvegarde, redressement, liquidation, mandat ad hoc,
            conciliation, PRP) ne doit être prise sans l&apos;avis préalable d&apos;un avocat, d&apos;un mandataire
            judiciaire et/ou d&apos;un expert-comptable.
          </p>
          <p className="mt-2">
            L&apos;éditeur ne saurait être tenu responsable des conséquences d&apos;une décision prise sur la base
            des informations publiées sans validation par un professionnel qualifié.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">6. Liens externes</h2>
          <p className="mt-2">
            Solelis contient des liens vers des sites externes (administrations, syndicats, fédérations,
            outils tiers). Ces liens sont fournis à titre indicatif. L&apos;éditeur n&apos;est pas responsable
            du contenu, de la disponibilité ou de la sécurité de ces sites externes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">7. Cookies, stockage local et données personnelles</h2>
          <p className="mt-2">
            Solelis ne dépose <strong>aucun cookie</strong> : ni cookie publicitaire, ni traceur tiers, ni cookie
            de session.
          </p>
          <p className="mt-2">
            Le site utilise seulement le <strong>stockage local de votre navigateur</strong> (localStorage et
            sessionStorage) pour des besoins de confort : thème d&apos;affichage choisi, questionnaire en cours,
            lien vers votre dernière fiche, progression et saisies dans les outils de la fiche. Ces informations
            restent sur votre appareil, ne nous sont pas transmises et peuvent être effacées depuis les
            réglages de votre navigateur.
          </p>
          <p className="mt-2">
            Les statistiques de visites agrégées sont collectées via Cloudflare Web Analytics, sans cookie ni
            stockage dans votre navigateur et sans données personnelles identifiantes. Seule la page d&apos;arrivée
            est comptée ; votre fiche et le questionnaire ne sont jamais mesurés.
          </p>
          <p className="mt-2">
            Pour le détail du traitement des données personnelles (RGPD), consultez la{' '}
            <Link href="/politique-donnees" className="text-bleu-fonce underline">politique de protection des données</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">8. Droit applicable et juridiction</h2>
          <p className="mt-2">
            Le présent site est soumis au droit français. Tout litige relatif à son utilisation relève de
            la compétence des tribunaux français.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">9. Contact</h2>
          <p className="mt-2">
            Pour toute question, demande de rectification ou signalement d&apos;information erronée :
            <a href="mailto:solelis@toakeur.com" className="text-bleu-fonce underline ml-1">solelis@toakeur.com</a>
          </p>
        </section>
      </div>
    </section>
  );
}
