import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Keep formatting simple and consistent (configured by .prettierrc).
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  },
  // Disable ESLint rules that conflict with Prettier.
  prettierConfig,
])

export default eslintConfig
