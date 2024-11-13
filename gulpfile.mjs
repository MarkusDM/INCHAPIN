import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import imageminSvgo from 'imagemin-svgo'; 
import { deleteAsync } from 'del';
import fileInclude from 'gulp-file-include';
import browserSync from 'browser-sync';
import gulpRename from 'gulp-rename';
import gulpReplace from 'gulp-replace';

const { src, dest, series, parallel, watch } = gulp;

const sassCompiler = gulpSass(dartSass);

const paths = {
    styles: {
        src: 'app/scss/**/*.scss',
        dest: 'dist/css'
    },
    images: {
        src: 'app/images/**/*.{jpg,png}', 
        dest: 'dist/images'
    },
    html: {
        src: 'app/*.html',
        dest: 'dist'
    },
    templates: {
        src: 'app/template/**/*.html',
        dest: 'dist/template'
    },
    fonts: {
        src: 'app/fonts/**/*.{woff,woff2}',
        dest: 'dist/fonts'
    },
    svg: {
        src: 'app/images/**/*.svg',
        dest: 'dist/images'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'dist/js'
    },
    videos: { 
        src: 'app/video/**/*.{mp4,webm}', 
        dest: 'dist/video'
    }
};

async function clean() {
    await deleteAsync(['dist']);
}

function processHtml() {
    return src(paths.html.src)
        .pipe(fileInclude({
            prefix: '@',
            basepath: 'app'
        }))
        .pipe(gulpReplace(/\.(png|jpg)/g, '.webp')) // Только PNG и JPG
        .pipe(dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function styles() {
    return src(paths.styles.src)
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(gulpReplace(/\.(png|jpg)/g, '.webp')) 
        .pipe(autoprefixer({ cascade: false }))
        .pipe(dest(paths.styles.dest))
        .pipe(gulpRename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function convertToWebp() {
    return src(paths.images.src)
        .pipe(imagemin())
        .pipe(webp({ quality: 85 }))
        .pipe(dest(paths.images.dest));
}

function copySVG() {
    return src(paths.svg.src) 
        .pipe(imagemin([imageminSvgo()])) 
        .pipe(dest(paths.svg.dest))
        .pipe(browserSync.stream());
}

function fonts() {
    return src(paths.fonts.src)
        .pipe(dest(paths.fonts.dest))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(paths.scripts.src)
        .pipe(dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}


function videos() {
    return src(paths.videos.src)
        .pipe(dest(paths.videos.dest))
        .pipe(browserSync.stream());
}

function serve() {
    browserSync.init({
        server: './dist'
    });

    watch(paths.styles.src, styles);
    watch(paths.images.src, series(convertToWebp, processHtml)); 
    watch(paths.svg.src, copySVG);
    watch(paths.html.src, processHtml);
    watch(paths.templates.src, processHtml);
    watch(paths.fonts.src, fonts);
    watch(paths.scripts.src, scripts); 
    watch(paths.videos.src, videos);
}

export default series(clean, parallel(styles, convertToWebp, copySVG, processHtml, fonts, scripts, videos), serve);


