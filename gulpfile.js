'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rimraf = require('rimraf');

gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      compass: true
    }))
    .pipe($.autoprefixer('last 4 version'))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles'], function () {
  return gulp.src('app/*.html')
    .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    //.pipe($.cache($.imagemin({
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  var streamqueue = require('streamqueue');
  return streamqueue({objectMode: true},
      $.bowerFiles(),
      gulp.src('app/fonts/**/*')
    )
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src(['app/*.*', '!app/*.html'], {dot: true})
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
  rimraf('.tmp', function () {
    rimraf('dist', cb);
  });
});

gulp.task('connect', function () {
  var connect = require('connect');
  var app = connect()
    .use(require('connect-livereload')({port: 35729}))
    .use(connect.static('app'))
    .use(connect.static('.tmp'))
    .use('/bower_components', connect.static('bower_components'))
    .use(connect.directory('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'styles'], function () {
  require('opn')('http://localhost:9000');
});

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({directory: 'bower_components'}))
    .pipe(gulp.dest('app/styles'));
  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'bower_components'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
