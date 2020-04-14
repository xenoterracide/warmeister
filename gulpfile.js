const gulp = require('gulp');
const dumber = require('gulp-dumber');
const au2 = require('@aurelia/plugin-gulp').default;
const fs = require('fs');
const typescript = require('gulp-typescript');
const plumber = require('gulp-plumber');
const merge2 = require('merge2');
const terser = require('gulp-terser');
const gulpif = require('gulp-if');
const del = require('del');
const bs = require('browser-sync').create();
const historyApiFallback = require('connect-history-api-fallback/lib');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const gulpRun = require('gulp-run');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const dist = 'dist';

// Read more in https://dumber.js.org
const dr = dumber({
  // src folder is by default "src".
  // src: 'src',

  // requirejs baseUrl, dumber default is "/dist"
  baseUrl: '/' + dist,

  // can turn off cache for production build
  // cache: !isProduction,

  // entry bundle name, dumber default is "entry-bundle"
  // entryBundle: 'entry-bundle',

  // Turn on hash for production build
  hash: isProduction,

  // Note prepend/append only affects entry bundle.

  // prepend before amd loader.
  // dumber-module-loader is injected automatically by dumber bundler after prepends.
  // prepend: [],

  // append after amd loader and all module definitions in entry bundle.
  append: [
    // Kick off all test files.
    // Note dumber-module-loader requirejs call accepts regex which loads all matched module ids!
    // Note all module ids are relative to dumber option "src" (default to 'src') folder.
    isTest && "requirejs(['../test/setup', /^\\.\\.\\/test\\/.+\\.spec$/]);"
  ],

  // Explicit dependencies, can use either "deps" (short name) or "dependencies" (full name).
  // deps: [],

  // Code split is intuitive and flexible.
  // You provide a function to return a bundle name for every single module.
  // The function takes two parameters:
  //
  // moduleId:
  //   for local src file "src/foo/bar.js", the module id is "foo/bar.js"
  //   for local src file "src/foo/bar.css" (or any other non-js file), the module id is "foo/bar.css"
  //   for npm package file "node_modules/foo/bar.js", the module id is "foo/bar.js"
  //   for npm package file "node_modules/@scoped/foo/bar.js", the module id is "@scoped/foo/bar.js"
  //
  // packageName:
  //   for any local src file, the package name is undefined
  //   for npm package file "node_modules/foo/bar.js", the package name is "foo"
  //   for npm package file "node_modules/@scoped/foo/bar.js", the package name is "@scoped/foo"

  // Here we skip code splitting in test mode.
  codeSplit: isTest ? undefined : function(moduleId, packageName) {
    // Here for any local src, put into app-bundle
    if (!packageName) return 'app-bundle';
    // The codeSplit func does not need to return a valid bundle name.
    // For any undefined return, dumber put the module into entry bundle,
    // this means no module can skip bundling.
  },

  // onManifest is an optional callback, it provides a file name map like:
  // {
  //   "some-bundle.js": "some-bundle.1234.js",
  //   "other-bundle.js": "other-bundle.3455.js"
  // }
  // Or when hash is off
  // {
  //   "some-bundle.js": "some-bundle.js",
  //   "other-bundle.js": "other-bundle.js"
  // }
  // If you turned on hash, you need this callback to update index.html
  onManifest: isTest ? undefined : function(filenameMap) {
    // Update index.html entry-bundle.js with entry-bundle.hash...js
    console.log('Update index.html with ' + filenameMap['entry-bundle.js']);
    const indexHtml = fs.readFileSync('_index.html').toString()
      .replace('entry-bundle.js', filenameMap['entry-bundle.js']);

    fs.writeFileSync('index.html', indexHtml);
  }
});

function buildJs(src) {
  const ts = typescript.createProject('tsconfig.json');
  return gulp.src(src, {sourcemaps: !isProduction})
    .pipe(gulpif(!isProduction && !isTest, plumber()))
    .pipe(au2())
    .pipe(ts());
}

function buildHtml(src) {
  return gulp.src(src)
    .pipe(au2());
}

function buildCss(src) {
  return gulp.src(src, {sourcemaps: !isProduction})
    .pipe(isProduction ? sass.sync() : sass.sync().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      // use postcss-url to inline any image/font/svg.
      // postcss-url by default use base64 for images, but
      // encodeURIComponent for svg which does NOT work on
      // some browsers.
      // Here we enforce base64 encoding for all assets to
      // improve compatibility on svg.
      postcssUrl({url: 'inline', encodeType: 'base64'})
    ]));
}

function build() {
  // Merge all js/css/html file streams to feed dumber.
  // dumber knows nothing about .ts/.less/.scss/.md files,
  // gulp-* plugins transpiled them into js/css/html before
  // sending to dumber.
  return merge2(
    gulp.src('src/**/*.json'),
    buildJs(isTest ? '{src,test}/**/*.ts' : 'src/**/*.ts'),
    buildHtml('src/**/*.html'),
    buildCss('src/**/*.scss')
  )
  // Note we did extra call `dr()` here, this is designed to cater watch mode.
  // dumber here consumes (swallows) all incoming Vinyl files,
  // then generates new Vinyl files for all output bundle files.
  .pipe(dr())
  // Terser fast minify mode
  // https://github.com/terser-js/terser#terser-fast-minify-mode
  // It's a good balance on size and speed to turn off compress.
  .pipe(gulpif(isProduction, terser({compress: false})))
  .pipe(gulp.dest(dist, {sourcemaps: isProduction ? false : (isTest ? true : '.')}));
}

function clean() {
  return del(dist);
}

function clearCache() {
  return dr.clearCache();
}

const serve = gulp.series(
  build,
  function startServer(done) {
    bs.init({
      ghostMode: false,
      online: false,
      open: !process.env.CI,
      port: 9000,
      server: {
        baseDir: ['.'],
        middleware: [
          // connect-history-api-fallback is a tool to help SPA dev.
          // So in dev mode, http://localhost:port/some/route will get
          // the same /index.html as content, instead off 404 at /some/route.html
          historyApiFallback(),
          function(req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
          }
        ]
      }
    }, function(err, bs) {
      if (err) return done(err);
      let urls = bs.options.get('urls').toJS();
      console.log(`Application Available At: ${urls.local}`);
      console.log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });
  }
)

// Reload browserSync
function reload(done) {
  console.log('Refreshing the browser');
  bs.reload();
  done();
}

// Watch all files for rebuild and reload browserSync.
function watch() {
  return gulp.watch('src/**/*', gulp.series(build, reload));
}

const run = gulp.series(clean, serve, watch);

// Watch all files for rebuild and test.
function watchTest() {
  return gulp.watch('{src,test}/**/*', gulp.series(build, test));
}

function test() {
  return gulpRun('npm run test:headless').exec();
}

exports['watch-test'] = watchTest;
exports.build = build;
exports.clean = clean;
exports['clear-cache'] = clearCache;
exports.run = run;
exports.default = run;