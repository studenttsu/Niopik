const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');
const notify = require("gulp-notify");
const rigger = require("gulp-rigger");

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('html', () => gulp
    .src('src/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('src'))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task('js', () => gulp
    .src([
        'scr/libs/slick-carousel/slick/slick.min.js',
        'src/js/main.js',
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify()) // Минимизировать весь js (на выбор)
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task('scss', () => gulp
    .src('src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    .pipe(autoprefixer(['last 15 versions']))
    // .pipe(cleanCSS())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream())
);

gulp.task('watch', ['html', 'scss', 'js', 'browser-sync'], () => {
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch(['libs/**/*.js', 'src/js/main.js'], ['js']);
    gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('imagemin', () => gulp
    .src('src/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img'))
);

gulp.task('build', ['removedist', 'imagemin', 'html', 'scss', 'js'], () => {

    gulp.src([
        'src/*.html',
        'src/.htaccess',
    ]).pipe(gulp.dest('dist'));

    gulp.src([
        'src/css/main.css',
    ]).pipe(gulp.dest('dist/css'));

    gulp.src([
        'src/js/scripts.min.js',
    ]).pipe(gulp.dest('dist/js'));

    gulp.src([
        'src/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('removedist', () => del.sync('dist'));
gulp.task('clearcache', () => cache.clearAll());

gulp.task('default', ['watch']);
