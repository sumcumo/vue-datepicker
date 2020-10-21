import fs from 'fs'
import chalk from 'chalk'
import { rollup } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const babelConfig = {
  extensions: ['.js'],
  babelHelpers: 'bundled',
  babelrc: true,
}

async function build() {
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
        babel(babelConfig),
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

async function buildAll() {
  // eslint-disable-next-line no-console
  console.time('Index')
  console.info(chalk.cyan('Building translation importer.'))
  const bundleUmd = await rollup({
    input: './src/locale/index.js',
    plugins: [
      resolve(),
      babel(babelConfig),
      terser(),
    ],
  })
  const bundleCjs = await rollup({
    input: './src/locale/index.js',
    plugins: [
      resolve(),
      commonjs(),
      babel(babelConfig),
    ],
  })
  await bundleUmd.write({
    file: './dist/locale/index.bundle.js',
    format: 'umd',
    name: 'languages',
  })
  await bundleCjs.write({
    file: './dist/locale/index.js',
    format: 'cjs',
  })
  await console.info(chalk.green('All translations built.'))
  // eslint-disable-next-line no-console
  console.timeEnd('Index')
}

const run = async () => {
  // eslint-disable-next-line no-console
  console.time('Overall')
  await build()
  await buildAll()
  // eslint-disable-next-line no-console
  console.timeEnd('Overall')
}

run()
