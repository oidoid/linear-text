/**
 * Just the configs that can be shared with test:ui. See
 * https://modern-web.dev/docs/dev-server/plugins/esbuild. Note that esbuild
 * uses `loader` whereas @web/dev-server-esbuild uses `loaders`.
 * @arg {string} linearTextVersion
 * @return {import('esbuild').BuildOptions}
 */
export function esbuildConfig(linearTextVersion) {
  return {
    define: {linearTextVersion: `'${linearTextVersion}'`}, // See defines.d.ts.
    // See loaders.d.ts.
    loader: {
      '.png': 'dataurl', // do i need to specify?
      '.svg': 'dataurl', // why not text?
      '.text': 'text'
    }
  }
}
