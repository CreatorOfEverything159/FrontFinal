const sass = require('gulp-sass')(require('sass'));
const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const newer = require('gulp-newer');
const del = require('del');

function browserSYNC() {
    browserSync. init({
        server: { baseDir: 'app/' },
        online: true,
    })
}

function scripts() {
    return src(['app/js/*.js',])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(concat('index.min.css'))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(cleanCSS( { level: { 1: { specialComments: 0 } }} ))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/img-src/**/*')
        .pipe(newer('app/img/'))
        .pipe(dest('app/img/'))
}

function cleanIMG() {
    return del('app/img/**/*', { force: true })
}

function build() {
    return src(['app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/img/**/*',
        'app/**/*.html'],
        { base: 'app' })
        .pipe(dest('build'))
}

function cleanBUILD() {
    return del('build/**/*', { force: true })
}

function startWATCH() {
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
    watch('app/**/scss/**/*', styles);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch('app/img-src/**/*', images);
}

exports.browserSYNC = browserSYNC;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanIMG = cleanIMG;
exports.default = parallel(images, styles, scripts, browserSYNC, startWATCH);
exports.build = series(cleanBUILD, styles, scripts, images, build);
