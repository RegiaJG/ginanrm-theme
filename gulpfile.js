/**
 * GinanRM - Ghost Theme
 * Gulp Build System
 */

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');

// Paths
const paths = {
    styles: {
        src: 'assets/css/src/**/*.scss',
        dest: 'assets/css/'
    },
    scripts: {
        src: 'assets/js/src/**/*.js',
        dest: 'assets/js/'
    },
    dist: {
        src: [
            '**/*',
            '!node_modules/**',
            '!assets/css/src/**',
            '!assets/js/src/**',
            '!gulpfile.js',
            '!package-lock.json',
            '!*.zip'
        ],
        dest: 'dist/'
    }
};

// Compile SCSS (if using SCSS)
function styles() {
    return src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(dest(paths.styles.dest));
}

// Bundle and minify JS (if using multiple source files)
function scripts() {
    return src(paths.scripts.src)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest(paths.scripts.dest));
}

// Watch for changes
function watchFiles() {
    watch(paths.styles.src, styles);
    watch(paths.scripts.src, scripts);
}

// Create zip for Ghost upload
function createZip() {
    const packageInfo = require('./package.json');
    const filename = `${packageInfo.name}-${packageInfo.version}.zip`;
    
    return src(paths.dist.src)
        .pipe(zip(filename))
        .pipe(dest('./'));
}

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watchFiles;
exports.zip = createZip;

// Dev task
exports.dev = parallel(styles, scripts, watchFiles);

// Build task
exports.build = parallel(styles, scripts);

// Default task
exports.default = series(parallel(styles, scripts), createZip);

