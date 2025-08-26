import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        all: true,
        include: ['src/routes/**/*.ts'],
        exclude: ['**/*.test.ts', 'src/tests/**'],
    },
  },
})