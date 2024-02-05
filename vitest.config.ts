import {defineConfig} from 'vitest/config'
export default defineConfig({
  test: {
    exclude: ['node_modules', 'src/elements/**/*.test.ts'],
    reporters: 'dot'
  }
})
