'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');

gulp.task('default', ['watch']);

gulp.task('build', ['build-css', 'build-js']);

gulp.task('build-css', function () {
  return gulp
    .src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
});

gulp.task('build-js', function () {
  return browserify('./src/js/main.js')
    .transform('babelify', { presets: ['env'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream());
});

gulp.task('lint', function () {
  return gulp
    .src([
      './**/*.js',
      '!node_modules/**',
      '!./public/**',
      '!./src/js/logourl.js',
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init({
    proxy: 'localhost:3000',
    port: '3001',
    ui: {
      port: '3002',
    },
    reloadDelay: 1000,
  });
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
  });
});

gulp.task('watch', ['browser-sync', 'build-css', 'build-js'], function () {
  gulp.watch('./src/sass/**/*.scss', ['build-css']);
  gulp.watch('./src/js/**/*.js', ['build-js']);
  gulp.watch('./views/**/*.ejs', browserSync.reload);
});
