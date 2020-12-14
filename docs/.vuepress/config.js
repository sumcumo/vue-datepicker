const sidebar = require('./sidebar')
const nav = require('./nav')
const pkg = require('../../package')

module.exports = {
  title: pkg.name,
  description: pkg.description,
  base: '/vue-datepicker/',
  evergreen: true,
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
  themeConfig: {
    sidebar,
    nav,
    repo: pkg.homepage,
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
  },
}
