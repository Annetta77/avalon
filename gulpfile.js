import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import newer from 'gulp-newer';

const sync = browserSync.create();

const paths = {
  sass: 'src/sass/**/*.scss',
  mainSass: 'src/sass/main.scss',
  html: 'src/*.html',
  js: 'src/js/**/*.js',
  images: 'src/images/**/*.{jpg,jpeg,png,gif,svg,webp}',
  fonts: 'src/fonts/**/*.{woff,woff2}',
};

function handleError(err) {
  console.error('Sass Error:', err.message);
  this.emit('end');
}

function compileSass() {
  return src(paths.mainSass, { sourcemaps: true })
    .pipe(sass().on('error', handleError))
    .pipe(autoprefixer())
    .pipe(dest('dist/css', { sourcemaps: '.' }))
    .pipe(sync.stream());
}

function optimizeImages() {
  return src(paths.images)
    .pipe(newer('dist/images'))
    .pipe(imagemin([mozjpeg({ quality: 80 }), pngquant({ quality: [0.6, 0.8] }), imagemin.svgo(), imagemin.gifsicle()]))
    .pipe(dest('dist/images'))
    .pipe(sync.stream());
}

function copyHtml() {
  return src(paths.html).pipe(dest('dist')).pipe(sync.stream());
}

function copyJs() {
  return src(paths.js).pipe(dest('dist/js')).pipe(sync.stream());
}

function copyFonts() {
  return src(paths.fonts).pipe(dest('dist/fonts')).pipe(sync.stream());
}

function serve() {
  sync.init({
    server: './dist',
    notify: false,
    open: true,
    injectChanges: true,
  });

  watch(paths.sass, compileSass).on('change', sync.reload);
  watch(paths.html, copyHtml).on('change', sync.reload);
  watch(paths.js, copyJs).on('change', sync.reload);
  watch(paths.images, optimizeImages).on('change', sync.reload);
  watch(paths.fonts, copyFonts).on('change', sync.reload);
}

const build = series(parallel(copyHtml, copyJs, optimizeImages, copyFonts), compileSass);

export { build, optimizeImages as images };
export const start = serve;
export default serve;
