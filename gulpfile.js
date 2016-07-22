"use strict";

const gulp = require('gulp');
const amdOptimize = require("amd-optimize");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const runSequence = require('run-sequence');
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const spa = require("gulp-spa");
const revCollector = require('gulp-rev-collector');
//const watch = require('gulp-watch');
//var plumber = require('gulp-plumber');

gulp.task('default', ['watch']);

gulp.task('build', function(){
    runSequence(
        ['clean:build', 'clean:tmp'],
        ['spa', 'requirejs', 'cpy:all'],
        ['replace']
    )
});

gulp.task('clean:build', function(){
    del.sync('build')
});

gulp.task('clean:tmp', function(){
    del.sync('.tmp')
});

//gulp.task('clean:sassCache', function(){
//    del.sync('.sass-cache')
//});

gulp.task('clean:all', ['clean:build', 'clean:tmp']);

gulp.task('cpy:all', ['cpy:vendor-js', 'cpy:requirejs', 'cpy:vendor-css', 'cpy:fonts']);

gulp.task('requirejs', function(){
    return gulp.src('src/scripts/*.js')
        .pipe(
            amdOptimize(
                'main',
                {baseUrl: 'src/scripts/'}
            )
        )
        .pipe(uglify())
        .pipe(concat("scripts/main.js"))
        .pipe(rev())
        .pipe(gulp.dest('build/'))
        .pipe(rev.manifest('main.json', {merge: true}))
        .pipe(gulp.dest('.tmp/'))
});

gulp.task('replace', function(){
    return gulp.src(['.tmp/*.json', 'build/**/*.html', 'build/scripts/*.js', 'build/**/*.css'], {base: 'build'})
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('spa', function(){
    return gulp.src('src/*.html')
        .pipe(replace(/\{\{\ static_prefix\ \}\}/g, ''))
        .pipe(spa.html({
            assetsDir: 'src/',
            pipelines:{
                css: function(files) {
                    return files
                        .pipe(sassGlob())
                        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                        .pipe(cssnano({safe: true, autoprefixer: true}))
                        .pipe(rev())
                },
                lib: function(files) {
                    return files
                        .pipe(concat('scripts/lib.js'))
                        .pipe(uglify())
                        .pipe(rev())
                }
            }
        }))
        // "scripts/ 替换回 {{ static_prefix }}/scripts/
        // "styles/ 替换回 {{ static_prefix }}/styles/
        .pipe(replace(/"\/(scripts|styles|bower_components)\//g, '"{{ static_prefix }}/$1/'))
        .pipe(gulp.dest('build/'))
});

gulp.task('cpy:vendor-js', function(){
    gulp.src('src/scripts/vendor/*.js')
        .pipe(gulp.dest('build/scripts/vendor/'))
});

gulp.task('cpy:vendor-css', function(){
    gulp.src('src/styles/*.css')
        .pipe(gulp.dest('build/styles'))
    gulp.src('src/bower_components/bootstrap/dist/css/bootstrap.css')
        .pipe(gulp.dest('build/bower_components/bootstrap/dist/css'))
});

gulp.task('cpy:fonts', function(){
    gulp.src('src/bower_components/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('build/bower_components/bootstrap/dist/fonts'))
});

gulp.task('cpy:requirejs', function(){
    gulp.src('src/bower_components/requirejs/require.js')
        .pipe(gulp.dest('build/bower_components/requirejs'))
});
