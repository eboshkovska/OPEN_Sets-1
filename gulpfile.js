var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  bowerFiles = require('main-bower-files'),
  concat = require('gulp-concat-sourcemap'),
  deploy = require('gulp-gh-pages'),
  del = require('del'),
  remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul"),
  runSequence = require('run-sequence');

var Server = require('karma').Server;

var paths = {
  assets: 'src/assets/**/*',
  less: 'src/css/main.less',
  index: 'src/index.html',
  ts: 'src/scripts/**/*.ts',
  spec: 'src/tests/**/*.spec.ts',
  build: 'build',
  dist: 'dist'
};

gulp.task('clean', function(cb) {
  return del([paths.build, paths.dist], cb);
});

gulp.task('copy', function() {
  return gulp.src(paths.assets)
    .pipe(gulp.dest(paths.dist + '/assets'));
});

var tsProject = $.typescript.createProject({
  declarationFiles: true,
  noExternalResolve: true,
  sortOutput: true,
  sourceRoot: '../scripts'
});

var specProject = $.typescript.createProject({
  declarationFiles: true,
  noExternalResolve: true,
  sortOutput: true,
  sourceRoot: '../'
});

gulp.task('typescript', function() {
  var tsResult = gulp.src(paths.ts)
    .pipe($.sourcemaps.init())
    .pipe($.typescript(tsProject));

  return tsResult.js
    .pipe(concat('main.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.build));
});

gulp.task('less', function() {
  return gulp.src(paths.less)
    .pipe($.less())
    .pipe(gulp.dest(paths.build));
});

gulp.task('processhtml', function() {
  return gulp.src(paths.index)
    .pipe($.processhtml())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('inject', function() {
  return gulp.src(paths.index)
    .pipe($.inject(gulp.src(bowerFiles()), { name: 'bower', relative: true }))
    .pipe(gulp.dest('src'));
});

gulp.task('reload', ['typescript'], function() {
  gulp.src(paths.index)
    .pipe($.connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.ts, ['typescript', 'reload']);
  gulp.watch(paths.less, ['less', 'reload']);
  gulp.watch(paths.index, ['reload']);
  gulp.watch(paths.assets, ['assets']);
});

gulp.task('connect', function() {
  $.connect.server({
    root: [__dirname + '/src', paths.build],
    port: 9000,
    livereload: true
  });
});

gulp.task('open', function() {
  gulp.src(paths.index)
    .pipe($.open({ uri: 'http://localhost:9000' }));
});

gulp.task('minifyJs', ['typescript'], function() {
  var all = bowerFiles().concat(paths.build + '/main.js');
  return gulp.src(all)
    .pipe($.uglifyjs('all.min.js', { outSourceMap: false }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minifyCss', ['less'], function() {
  return gulp.src(paths.build + '/main.css')
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.dist))
});

gulp.task('deploy', function() {
  return gulp.src('dist/**/*')
    .pipe(deploy());
});

gulp.task('default', function() {
  runSequence('clean', ['inject', 'typescript', 'less', 'connect', 'watch'], 'open');
});
gulp.task('build', function() {
  return runSequence('clean', ['copy', 'minifyJs', 'minifyCss', 'processhtml']);
});

gulp.task('cache:clear', function() {
  return cache.clearAll()
})

gulp.task("build-source", function() {
  return gulp.src('src/scripts/logic/*.ts')
    .pipe($.sourcemaps.init())
    .pipe($.typescript(tsProject))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(__dirname + '/src/scripts/logic/'));
});

gulp.task('tests', ['build-source'], function(done) {
  return new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done)
    .start();
});

gulp.task('coverage', function() {
  gulp.src('./coverage/coverage-final.json')
    .pipe(remapIstanbul({
      reports: {
        'lcovonly': './coverage/remap/lcov.info',
        'json': './coverage/remap/coverage.json',
        'html': './coverage/remap/html-report',
        'text-summary': './coverage/remap/text-summary.txt'
      }
    }))
    .on('finish', function() {
      console.log('Remapping done! View the result in report/remap/html-report');
    });
})