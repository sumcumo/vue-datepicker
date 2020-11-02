import path from 'path'
import autoprefixer from 'autoprefixer'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import del from 'rollup-plugin-delete'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

const {
  author,
  name,
  version,
  license,
} = require('../package.json')

const banner = `/*
* ${name} v${version}
* (c) 2018-${new Date().getFullYear()} ${author}
* Released under the ${license} License.
*/`

let generateCounter = 0
const generateConfig = ({
  type,
  extraPlugins = [],
  extraName = '',
}) => {
  let babelrc = true
  const output = {
    dir: 'dist/',
    format: type,
    entryFileNames: '[name].js',
    assetFileNames: '[name].js',
    sourcemap: true,
    exports: 'auto',
    banner,
    name: 'vuejsDatepicker',
  }
  if (type === 'esm') {
    output.entryFileNames = '[name].esm.js'
    output.assetFileNames = '[name].esm.js'
    babelrc = false
  }
  if (type === 'cjs') {
    output.entryFileNames = '[name].common.js'
    output.assetFileNames = '[name].common.js'
  }
  if (extraName) {
    output.entryFileNames = `[name]${extraName}.js`
    output.assetFileNames = `[name]${extraName}.js`
  }
  const pluginsOnlyOnce = []
  if (generateCounter === 0) {
    pluginsOnlyOnce.push(
      del({
        targets: 'dist/*',
      }),
    )

    generateCounter += 1
  }

  return {
    input: './src/components/Datepicker.vue',
    external: ['vue'],
    output,
    plugins: [
      ...pluginsOnlyOnce,
      alias({
        resolve: ['.vue', '.js'],
        entries: [
          {
            find: '~',
            replacement: path.join(__dirname, '..', '/src'),
          },
        ],
      }),
      resolve(),
      commonjs(),
      vue({
        css: false,
      }),
      postcss({
        extract: 'vuejs-datepicker.css',
        minimize: true,
        plugins: [
          autoprefixer(),
        ],
      }),
      babel({
        extensions: ['.js'],
        babelHelpers: 'bundled',
        babelrc,
      }),
      ...extraPlugins,
    ],
    preserveModules: false,
  }
}

export default [
  generateConfig({ type: 'esm' }),
  generateConfig({ type: 'cjs' }),
  generateConfig({ type: 'umd' }),
  generateConfig({ type: 'umd', extraPlugins: [terser()], extraName: '.min' }),
]
