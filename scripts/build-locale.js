import fs from 'fs'
import path from 'path'
import { rollup } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import chalk from 'chalk'
import buble from 'rollup-plugin-buble'

async function build() {
  console.log(chalk.cyan('Building individual translations.'))
  const files = fs.readdirSync('./src/locale/translations')
  files.forEach(async(file) => {
    const inputOptions = {
      input: path.join(__dirname, '..', 'src', 'locale', 'translations', file),
      plugins: [
        buble(),
        terser(),
      ],
    }
    const bundle = await rollup(inputOptions)
    const outputOptions = {
      file: path.join(__dirname, '..', 'dist', 'locale', 'translations', file),
      format: 'umd',
      name: file.split('.')[0],
    }
    await bundle.write(outputOptions)
  })
  await console.log(chalk.green('Individual translations built.'))
}

async function buildAll() {
  console.log(chalk.cyan('Building translation importer.'))
  const bundle = await rollup({
    input: path.join(__dirname, '..', 'src', 'locale', 'index.js'),
    plugins: [
      buble(),
      terser(),
    ],
  })
  await bundle.write({
    file: path.join(__dirname, '..', 'dist', 'locale', 'index.js'),
    format: 'umd',
    name: 'languages',
  })
  await console.log(chalk.green('All translations built.'))
}

build()
buildAll()
