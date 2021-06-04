const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const uglifycss = require('gulp-uglifycss');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const { src, series } = require('gulp');
const imagemin = require('gulp-imagemin');

//compile scss to css
function style() {
    return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifycss({'uglyComments': true}))
    .pipe(autoprefixer())		
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

//minify images
function images() {
    return src('img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
}


//watch
function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./scss/**/*.scss', style);
    gulp.watch('./**/*.html').on('change', browserSync.reload);
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);
} 

exports.style = style;
exports.watch = watch;
exports.images = images;
exports.default = watch;