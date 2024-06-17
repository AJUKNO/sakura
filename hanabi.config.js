/**
 * @type {import('@hanabi/hanabi-cli').HanabiConfig}
 */

const config = {
  directory: 'src',
  entryPoints: ['src/index.ts'],
  outFile: 'shopify/assets/sakura.js',
  shopifyConfig: {
    enabled: true,
    open: true,
    port: 9292,
    path: 'shopify',
    host: '127.0.0.1',
    store: 'ajukno-sample',
  },
}

export default config
