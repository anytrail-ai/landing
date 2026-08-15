import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // dist-ssr is build output too. Without it, `npm run lint` passes or fails
  // depending on whether a build happens to be on disk. demo-backend/cdk.out
  // is the same class of problem: CDK synth output written by
  // `npm run synth`, not source we own or want linted.
  globalIgnores(['dist', 'dist-ssr', 'demo-backend/cdk.out']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
