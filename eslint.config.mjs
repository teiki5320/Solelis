import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

// Configuration « flat » (ESLint CLI) — remplace `next lint`, déprécié.
// Mêmes règles qu'avant : next/core-web-vitals.
const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

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
  ...compat.extends('next/core-web-vitals'),
];

export default config;
