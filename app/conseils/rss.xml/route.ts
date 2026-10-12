import { SITE, conseilsPublies } from '@/lib/conseils';
import { LIBELLES_THEMES } from '@/lib/conseils/themes';

// Flux RSS des articles publiés ce jour (heure de Paris) : rendu à la requête,
// comme la liste, pour suivre la publication programmée.
export const dynamic = 'force-dynamic';

const xml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export function GET() {
  const articles = conseilsPublies();
  const derniere = articles.reduce((max, c) => (c.modifieLe > max ? c.modifieLe : max), '');
  const items = articles
    .map((c) => {
      const lien = `${SITE}/conseils/${c.slug}`;
      return [
        '    <item>',
        `      <title>${xml(c.title)}</title>`,
        `      <link>${lien}</link>`,
        `      <guid isPermaLink="true">${lien}</guid>`,
        `      <pubDate>${new Date(c.publieLe).toUTCString()}</pubDate>`,
        `      <category>${xml(LIBELLES_THEMES[c.theme])}</category>`,
        `      <description>${xml(c.resume)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const corps = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Solelis — Conseils aux dirigeants en difficulté</title>
    <link>${SITE}/conseils</link>
    <atom:link href="${SITE}/conseils/rss.xml" rel="self" type="application/rss+xml" />
    <description>Des réponses claires aux questions des chefs d’entreprise en difficulté, avec leurs sources officielles.</description>
    <language>fr-FR</language>${derniere ? `\n    <lastBuildDate>${new Date(derniere).toUTCString()}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>
`;

  return new Response(corps, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // Navigateurs et lecteurs RSS : une heure (un article programmé paraît au plus 1 h après minuit).
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
