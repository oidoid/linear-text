import {esbuildPlugin} from '@web/dev-server-esbuild'

export default {
  files: ['src/elements/**/*.test.ts'],
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ts: true, tsconfig: 'src/elements/test/tsconfig.json'})
  ]
}
