'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();

gulp.task('default', ['watch'], function() {

});

gulp.task('build', function() {
  return gulp.src('./public/css/src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/build'));
});

gulp.task('sass', function () {
  return gulp.src('./public/css/src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/build'))
    .pipe(browserSync.stream());
});

gulp.task('lint', function() {
  return gulp.src(['./**/*.js', '!node_modules/**'])
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

gulp.task('watch', ['browser-sync', 'sass'], function () {
  gulp.watch('./public/css/src/**/*.scss', ['sass']);
  gulp.watch('./public/js/**/*.js', browserSync.reload);
  gulp.watch('./views/**/*.ejs', browserSync.reload);
});
