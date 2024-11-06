import fs from 'node:fs'
import path from 'node:path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))

const name = '__ignore_attr'
const banner = `/*!
 * ${packageJson.name} v${packageJson.version} | Licensed under the table.
 *
 * NOuSantx do that? ¯\\_(ツ)_/¯
 */`

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name,
      banner,
      exports: 'named'
    },
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name,
      banner,
      exports: 'named',
      plugins: [
        terser({
          mangle: {
            properties: {
              regex: /^[^_]/,
              reserved: [
                name,
                'ignoreAttributes',
                'ariaAttributes',
                'standardAttributes',
                'vueAttributes',
                'angularAttributes',
                'reactAttributes',
                'fullAttributes'
              ]
            }
          },
          compress: {
            defaults: true,
            passes: 2,
            pure_getters: true,
            unsafe_methods: true
          },
          format: {
            // comments: false,
            preserve_annotations: true
          },
          keep_classnames: true,
          keep_fnames: /ariaAttributes|standardAttributes|vueAttributes|angularAttributes|reactAttributes|fullAttributes/,
         })
      ]
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      banner
    },
    {
      file: 'dist/index.esm.min.js',
      format: 'es',
      banner,

      plugins: [terser()]
    }
  ],
  plugins: [typescript(), resolve(), commonjs()]
}

export default config
