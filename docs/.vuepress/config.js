import { defineUserConfig, defaultTheme } from 'vuepress'
import sidebar from './sidebar'
import navbar from './navbar'
import pkg from '../../package.json'

export default defineUserConfig({
  title: pkg.name,
  description: pkg.description,
  base: '/vue-datepicker/',
  displayAllHeaders: true,
  sidebarDepth: 3,
  head: [
    [
      'link',
      {
        rel: 'shortcut icon',
        href: '/favicon.ico?v=2',
      },
    ],
  ],
  theme: defaultTheme({
    sidebar,
    navbar,
    repo: pkg.homepage,
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
  }),
})
