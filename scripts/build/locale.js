import fs from 'fs'
import chalk from 'chalk'
import { rollup } from 'rollup'
import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'

const babelConfig = {
  extensions: ['.js'],
  babelHelpers: 'bundled',
  babelrc: true,
}

async function buildLanguages() {
  // eslint-disable-next-line no-console
  console.time('Individual')
  console.info(chalk.cyan('Start building individual translations.'))
  const files = fs.readdirSync('./src/locale/translations')
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    console.info(chalk.cyan(`Building ${file} translations.`))
    // eslint-disable-next-line no-await-in-loop
    const bundle = await rollup({
      input: `./src/locale/translations/${file}`,
      plugins: [
        resolve(),
        babel({
          ...babelConfig,
          exclude: 'node_modules/**',
        }),
        terser(),
      ],
    })
    // eslint-disable-next-line no-await-in-loop
    await bundle.write({
      file: `./dist/locale/translations/${file}`,
      format: 'umd',
      name: file.split('.')[0],
    })
    console.info(chalk.cyan(`Done building ${file} translations.`))
  }
  await console.info(chalk.green('Individual translations built.'))
  // eslint-disable-next-line no-console
  console.timeEnd('Individual')
}

async function buildUmd() {
  const bundle = await rollup({
    input: './src/locale/index.js',
    plugins: [
      resolve(),
      babel({
        ...babelConfig,
        exclude: 'node_modules/**',
      }),
      terser(),
    ],
  })
  await bundle.write({
    file: './dist/locale/index.js',
    format: 'umd',
    name: 'languages',
  })
}

async function buildCjs() {
  const bundle = await rollup({
    input: './src/locale/index.js',
    plugins: [resolve(), babel(babelConfig)],
  })
  await bundle.write({
    file: './dist/locale/index.common.js',
    format: 'cjs',
    exports: 'auto',
  })
}

async function buildEsm() {
  const bundle = await rollup({
    input: './src/locale/index.js',
    plugins: [
      resolve(),
      babel({
        ...babelConfig,
        babelrc: false,
      }),
    ],
  })
  await bundle.write({
    dir: './dist/locale/',
    format: 'esm',
    preserveModules: true,
    entryFileNames: '[name].esm.js',
    assetFileNames: '[name].esm.js',
  })
}

async function buildIndexes() {
  // eslint-disable-next-line no-console
  console.time('Index')
  console.info(chalk.cyan('Building translation importer.'))

  await buildUmd()
  await buildCjs()
  await buildEsm()

  await console.info(chalk.green('All translations built.'))
  // eslint-disable-next-line no-console
  console.timeEnd('Index')
}

const run = async () => {
  // eslint-disable-next-line no-console
  console.time('Overall')
  await buildLanguages()
  await buildIndexes()
  // eslint-disable-next-line no-console
  console.timeEnd('Overall')
}

run()
