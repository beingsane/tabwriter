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
var babelify = require('babelify');
var cssnano = require('gulp-cssnano')

gulp.task('default', ['watch']);

gulp.task('build', ['build-css', 'build-js']);

gulp.task('build-css', function () {
  return gulp.src('./public/css/src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('./public/css/build'))
    .pipe(browserSync.stream());
});

gulp.task('build-js', function() {
  return browserify('./public/js/src/main.js')
    .transform('babelify', {presets: ['env']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/build'))
    .pipe(browserSync.stream());
});

gulp.task('lint', function() {
  return gulp.src(['./**/*.js', '!node_modules/**', '!./public/js/build/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init({
    proxy: 'localhost:3000',
    port: '3001',
    ui:{
      port: '3002'
    }
  });
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'app.js'
  });
});

gulp.task('watch', ['browser-sync', 'build-css', 'build-js'], function () {
  gulp.watch('./public/css/src/**/*.scss', ['build-css']);
  gulp.watch(['./public/js/src/**/*.js'], ['build-js']);
  gulp.watch('./views/**/*.ejs', browserSync.reload);
});
