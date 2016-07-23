"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const cssnano = require('gulp-cssnano');

gulp.task('default', ['watch']);

gulp.task('build', function(){
    runSequence(
        ['clean:build', 'clean:tmp'],
        ['replace']
    )
});

gulp.task('sass:dev', function(){
    gulp.src('src/styles/main.scss')
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(cssnano({safe: true, autoprefixer: true}))
        .pipe(gulp.dest('src/styles/'))
});
