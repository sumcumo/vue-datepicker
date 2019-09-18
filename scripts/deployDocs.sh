#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'chore(docs): deploying'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:sumcumo/vue-datepicker.git master:gh-pages

cd -
