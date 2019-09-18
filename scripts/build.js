import autoprefixer from 'autoprefixer'
import chalk from 'chalk'
import path from 'path'
import { rollup } from 'rollup'
import buble from 'rollup-plugin-buble'
import common from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'
import alias from 'rollup-plugin-alias'

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

const configs = {
  umd: {
    output: 'vuejs-datepicker.js',
    format: 'umd',
  },
  umdMin: {
    output: 'vuejs-datepicker.min.js',
    format: 'umd',
    plugins: [terser()],
  },
  cjs: {
    output: 'vuejs-datepicker.common.js',
    format: 'cjs',
  },
  esm: {
    output: 'vuejs-datepicker.esm.js',
    format: 'es',
  },
}

async function build() {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(configs)) {
    const config = configs[key]
    console.log(chalk.cyan(`Building ${key}: ${config.output}`))
    const inputOptions = {
      input: path.join(__dirname, '..', 'src', 'components', 'Datepicker.vue'),
      plugins: [
        alias({
          resolve: [
            '.vue',
            '.js',
          ],
          entries: [
            {
              find: '~',
              replacement: path.join(__dirname, '..', '/src'),
            },
          ],
        }),
        vue({
          css: false,
        }),
        common(),
        postcss({
          extract: 'dist/vuejs-datepicker.css',
          minimize: true,
          plugins: [
            autoprefixer(),
          ],
        }),
        buble({
          objectAssign: 'Object.assign',
        }),
      ].concat(config.plugins || []),
    }
    // eslint-disable-next-line no-await-in-loop
    const bundle = await rollup(inputOptions)
    const outputOptions = {
      file: path.join(__dirname, '..', 'dist', config.output),
      format: config.format,
      banner,
      name: 'vuejsDatepicker',
    }
    // eslint-disable-next-line no-await-in-loop
    await bundle.write(outputOptions)
  }
  await console.log(chalk.green('All modules built'))
}

build()
