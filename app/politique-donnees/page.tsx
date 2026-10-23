import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/politique-donnees' },
  title: 'Politique de protection des données — Solelis',
  description: 'Comment Solelis protège vos données personnelles : RGPD, base légale, durée, vos droits.',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

export default function PolitiqueDonneesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Accueil
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">Politique de protection des données</h1>
      <p className="mt-3 text-sm text-navy/60">Conforme au RGPD (UE 2016/679) — mise à jour 10 octobre 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy/80">

        <section className="rounded-2xl border border-vert/30 bg-vert/5 p-5">
          <p className="font-display text-base text-vert">L&apos;essentiel</p>
          <ul className="mt-3 space-y-2 text-navy/80">
            <li><strong>Aucun cookie publicitaire</strong>, aucun traceur tiers</li>
            <li>Vos réponses au questionnaire et votre fiche sont <strong>stockées dans une base Cloudflare limitée à l&apos;UE</strong> derrière un token aléatoire (24 caractères)</li>
            <li>L&apos;<strong>email n&apos;est demandé que pour vous envoyer un lien magique</strong> de retour vers votre fiche — pas de mailing, pas de partage</li>
            <li>Vous pouvez <strong>demander la suppression</strong> de votre fiche à tout moment, sur simple demande à solelis@toakeur.com</li>
            <li>Certains prestataires techniques sont des sociétés américaines (Cloudflare, Resend, Google) : les transferts hors UE sont encadrés par le <strong>cadre de protection des données UE–États-Unis</strong> (Data Privacy Framework) et/ou les <strong>clauses contractuelles types</strong> de la Commission européenne (détail en section 6)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">Responsable du traitement</h2>
          <p className="mt-2">
            ALOHASH (nom commercial TOA CORP), SAS au capital de 200 €, La Petite Sigonnière, 85190 Maché,
            RCS La Roche-sur-Yon 938 522 596. Contact :{' '}
            <a href="mailto:solelis@toakeur.com" className="text-bleu-fonce underline">solelis@toakeur.com</a>
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">1. Données collectées</h2>
          <p className="mt-2">
            Solelis ne collecte que les données strictement nécessaires à la production de votre fiche personnalisée :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>SIRET</strong> de votre entreprise (saisie obligatoire)</li>
            <li><strong>Réponses au questionnaire</strong> (situation, problème, effectif, moral, statut conjoint, nationalité, etc.) — 8 réponses sont nécessaires pour produire la fiche (situation, problème, effectif, caution, patrimoine, régime, vente, moral) ; les 10 autres questions sont facultatives</li>
            <li><strong>Données entreprise INSEE</strong> récupérées via l&apos;API publique Sirene (nom, NAF, forme juridique, effectif déclaré, adresse postale)</li>
            <li><strong>Email</strong> uniquement si vous souhaitez recevoir le lien magique vers votre fiche</li>
            <li><strong>Token aléatoire</strong> de 24 caractères qui identifie votre fiche, sans information personnelle</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">2. Données NON collectées</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Pas de nom, prénom, date de naissance, adresse personnelle saisis par vous. Attention : pour une entreprise individuelle (micro-entreprise, EI), la dénomination enregistrée à l&apos;INSEE est le nom de l&apos;entrepreneur·e, et l&apos;adresse de l&apos;entreprise peut être son domicile — ces données publiques sont alors récupérées avec le SIRET</li>
            <li>Pas de numéro de téléphone</li>
            <li>Pas de RIB, IBAN, numéro de compte</li>
            <li>Pas de pièces d&apos;identité</li>
            <li>Pas de données fiscales personnelles</li>
            <li>Pas de traceurs publicitaires ni de profilage</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">3. Base légale et finalités</h2>
          <p className="mt-2">
            Le traitement repose sur votre <strong>consentement explicite</strong> (art. 6.1.a RGPD) lors de la
            saisie du questionnaire, et sur <strong>l&apos;intérêt légitime</strong> de l&apos;éditeur pour fournir
            le service (art. 6.1.f RGPD).
          </p>
          <p className="mt-2">
            Deux questions facultatives portent sur des informations sensibles : la{' '}
            <strong>reconnaissance de la qualité de travailleur handicapé (RQTH)</strong>, qui est une donnée
            de santé au sens de l&apos;article 9 du RGPD, et la <strong>nationalité</strong>. Elles ne sont
            traitées qu&apos;avec votre <strong>consentement explicite</strong> (art. 9.2.a RGPD pour la RQTH) :
            vous pouvez passer ces questions sans que cela empêche la création de votre fiche, et retirer
            votre consentement à tout moment en demandant la suppression de la réponse ou de la fiche.
            Elles servent uniquement à afficher les aides et démarches adaptées (AGEFIPH, Cap emploi, titre
            de séjour, etc.).
          </p>
          <p className="mt-2">Les finalités sont strictement limitées à :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Produire votre fiche personnalisée</li>
            <li>Vous renvoyer un lien magique pour retrouver votre fiche (si email fourni)</li>
            <li>Vous envoyer des rappels que vous avez explicitement demandés</li>
            <li>Mesurer l&apos;usage du site de manière agrégée (Plausible Analytics, sans cookie ni profilage)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">4. Conservation des données</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Fiche personnalisée</strong> : conservée 24 mois maximum après sa création. Vous pouvez en obtenir la suppression à tout moment sur simple demande à solelis@toakeur.com. L&apos;effacement automatique à l&apos;issue de ce délai sera mis en place prochainement ; d&apos;ici là, les fiches arrivées à échéance sont supprimées manuellement.</li>
            <li><strong>Email associé à un lien magique</strong> : 24 mois.</li>
            <li><strong>Logs serveur</strong> : 90 jours (à des fins de sécurité et de diagnostic).</li>
            <li><strong>Statistiques agrégées Plausible</strong> : indéfiniment, sans données identifiantes.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">5. Vos droits (RGPD)</h2>
          <p className="mt-2">Vous disposez à tout moment des droits suivants :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Droit d&apos;accès</strong> : obtenir copie des données vous concernant</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l&apos;effacement</strong> (« droit à l&apos;oubli ») : demander la suppression de votre fiche</li>
            <li><strong>Droit à la limitation</strong> du traitement</li>
            <li><strong>Droit d&apos;opposition</strong> au traitement</li>
            <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, écrivez à{' '}
            <a href="mailto:solelis@toakeur.com" className="text-bleu-fonce underline">solelis@toakeur.com</a>
            {' '}en précisant votre token de fiche (visible dans l&apos;URL : <code>/fiche/XXXX</code>).
            Réponse sous 30 jours.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">6. Sous-traitants et destinataires</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Cloudflare, Inc.</strong> (États-Unis) : hébergement de l&apos;application — transfert UE → États-Unis encadré par le cadre de protection des données UE–États-Unis (Data Privacy Framework), auquel Cloudflare est certifiée, et par les clauses contractuelles types de la Commission européenne</li>
            <li><strong>Cloudflare, Inc.</strong> (base Cloudflare D1, stockage limité à l&apos;UE) : base de données fiches</li>
            <li><strong>Resend</strong> (Plus Five Five, Inc., États-Unis) : envoi du lien magique et des rappels par email — vos données d&apos;email sont traitées aux États-Unis ; transfert encadré par le Data Privacy Framework UE–États-Unis, auquel Resend est certifiée, et par les clauses contractuelles types (décision 2021/914 de la Commission européenne)</li>
            <li><strong>Plausible Analytics</strong> (UE) : statistiques d&apos;usage agrégées</li>
            <li><strong>INSEE / API Sirene</strong> : récupération des données publiques d&apos;entreprise (en lecture uniquement)</li>
            <li><strong>API Recherche d&apos;entreprises</strong> (État, api.gouv.fr) : même recherche des données publiques d&apos;entreprise, faite par notre serveur et aussi directement par votre navigateur pendant le questionnaire — l&apos;API reçoit alors le SIRET saisi et l&apos;adresse IP de votre connexion, sans cookie ni autre donnée</li>
            <li><strong>Google LLC</strong> (États-Unis, API Google Places) : recherche d&apos;avocats à proximité — la requête, envoyée par notre serveur, contient seulement une zone géographique, sans donnée personnelle directe ; Google est certifiée au Data Privacy Framework UE–États-Unis et recourt aux clauses contractuelles types</li>
          </ul>
          <p className="mt-3">
            Aucune donnée n&apos;est revendue à des partenaires marketing ou publicitaires.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">7. Sécurité</h2>
          <p className="mt-2">
            Les données sont protégées par les mesures techniques et organisationnelles suivantes :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Chiffrement en transit (HTTPS / TLS 1.3)</li>
            <li>Chiffrement au repos (Cloudflare D1)</li>
            <li>Accès à la base limité à l&apos;application, sans clé d&apos;accès exposée</li>
            <li>Tokens aléatoires (24 caractères) non devinables</li>
            <li>Validation Zod sur toutes les entrées utilisateur</li>
            <li>Rate limiting sur les routes API</li>
            <li>Audit régulier des dépendances (npm audit)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">8. Réclamation CNIL</h2>
          <p className="mt-2">
            En cas de difficulté à exercer vos droits, vous pouvez introduire une réclamation auprès de la
            <strong> CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) :
            3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">www.cnil.fr</a>
          </p>
        </section>

      </div>
    </section>
  );
}
