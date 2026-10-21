import nextVitals from 'eslint-config-next/core-web-vitals';

// Configuration « flat » (ESLint CLI) — `next lint` n'existe plus depuis Next.js 16.
// Mêmes règles qu'avant : next/core-web-vitals.

const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      'public/sw.js',
      // Généré au build depuis content/conseils/*.md (npm run conseils).
      'lib/conseils/donnees.generated.ts',
      // Copies de travail des assistants (déjà exclues des tests et du typage).
      '.claude/**',
    ],
  },
  ...nextVitals,
  {
    // Règles « compilateur React » ajoutées par eslint-config-next 16 : absentes
    // de la configuration d'avant (Next.js 15). Désactivées pour garder les mêmes
    // règles ; le code concerné fonctionne et est couvert par les tests.
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
    },
  },
];

export default config;
