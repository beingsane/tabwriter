'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', ['watch']);

gulp.task('build', ['sass', 'browserify']);

gulp.task('sass', function () {
  return gulp.src('./public/css/src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/build'))
    .pipe(browserSync.stream());
});

gulp.task('browserify', function() {
  return browserify('./public/js/src/main.js')
    .bundle()
    .pipe(source('bundle.js'))
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

gulp.task('watch', ['browser-sync', 'sass', 'browserify'], function () {
  gulp.watch('./public/css/src/**/*.scss', ['sass']);
  gulp.watch(['./public/jsv2/**/*.js', '!./public/jsv2/bundle.js'], ['browserify']);
  gulp.watch('./public/js/**/*.js', browserSync.reload);
  gulp.watch('./views/**/*.ejs', browserSync.reload);
});
