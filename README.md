# warmeister

This project is bootstrapped by [aurelia/new](https://github.com/aurelia/new).

## Start dev web server

    npm start

## Build the app

Build files to dist folder.

    npm run build

## Unit Tests

    npm run test

Run unit tests in watch mode.

    npm run test:watch

Unit tests run in browser through [browser-do](https://github.com/3cp/browser-do). Please check scripts in `package.json` for more details.

By default, browser-do shuts down browser after tests. To keep browser window open for inspection, pass additional argument `-k` or `--keep-open`.

    npm run build:test && browser-do -k --mocha --browser chrome < dist/entry-bundle.js

Unit tests in watch mode is executed through standard `gulp.watch` with the help of [gulp-run](https://github.com/MrBoolean/gulp-run).

## Clear tracing cache

In rare situation, you might need to run clear-cache after upgrading to new version of dumber bundler.

    npm run clear-cache

## index.html

`index.html` is generated from `_index.html` every time `npm run build` runs. It is handled by dumber's `onManifest()` option, check `gulpfile.js` for details.

## Cypress e2e test

All e2e tests are in `cypress/integration/`.
Note the source code of the app and unit tests is in TypeScript, but e2e tests are in plain ESNext JavaScript. You can however [write e2e tests in TypeScript too for Cypress](https://docs.cypress.io/guides/tooling/typescript-support.html#Transpiling-TypeScript-test-files).

First, run the app in dev mode

    npm start

Then run e2e tests in another terminal window with

    npm run test:e2e

Note if your dev app is not running on port 9000, you need to modify `cypress.json` to update dev app port.

To run Cypress interactively, do

    npx cypress open

For more information, visit https://www.cypress.io

## LICENSE

Copyright (C) 2020 Caleb Cushing <xenoterracide@gmail.com>

> > >

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
