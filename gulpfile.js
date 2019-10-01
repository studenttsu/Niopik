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
const notify = require('gulp-notify');
const rigger = require('gulp-rigger');
const version = require('gulp-version-number');

const versionConfig = {
    'value': '%MDS%',
    'append': {
        'key': 'v',
        'to': [
            {
                type: 'js',
                files: ['scripts.min.js']
            },
            {
                type: 'css',
                files: ['main.css']
            }
        ],
    },
};

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
});

gulp.task('html', () => gulp
    .src('src/*.html')
    .pipe(rigger())
    .pipe(version(versionConfig))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task('js', () => gulp
    .src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/inputmask/dist/jquery.inputmask.bundle.js',
        'node_modules/jquery-validation/dist/jquery.validate.min.js',
        'node_modules/float-labels.js/dist/float-labels.min.js',
        'node_modules/chosen-js/chosen.jquery.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
        'src/js/jquery.autocomplete.min.js',
        'src/js/floatingLabel.js',
        'src/js/main.js',
    ])
    .pipe(concat('scripts.min.js'))
    // .pipe(uglify()) // Минимизировать весь js (на выбор)
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task('scss', () => gulp
    .src('src/scss/**/*.scss')
    .pipe(sass({
        outputStyle: 'expanded',
        includePaths: [__dirname + '/node_modules']
    }).on('error', notify.onError()))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
);

gulp.task('watch', ['removedist', 'html', 'scss', 'imagemin', 'fonts', 'js', 'browser-sync'], () => {
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('img/**/*', ['imagemin']);
    gulp.watch(['src/js/**/*.js'], ['js', browserSync.reload]);
    gulp.watch(['src/**/*.html'], ['html', browserSync.reload]);
});

gulp.task('imagemin', () => gulp
    .src('src/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img'))
);

gulp.task('fonts', () => gulp
    .src([
        'src/fonts/**/*',
    ])
    .pipe(gulp.dest('dist/fonts'))
);

gulp.task('build', ['removedist', 'imagemin', 'fonts', 'html', 'scss', 'js'], () => {

    gulp.src([
        'src/.htaccess',
    ]).pipe(gulp.dest('dist'));

    gulp.src([
        'src/css/main.css',
    ]).pipe(gulp.dest('dist/css'));

    gulp.src([
        'src/js/scripts.min.js',
    ]).pipe(gulp.dest('dist/js'));

});

gulp.task('removedist', () => del.sync('dist'));
gulp.task('clearcache', () => cache.clearAll());

gulp.task('default', ['watch']);
