'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var autoprefix = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});


gulp.task('sass', function () {
    return gulp.src('app/scss/style.scss')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefix())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ // Reloading with Browser Sync
            stream: true
        }))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

gulp.task('vet', function () {
    return gulp.src(['app/js/*.js',
                  './*.js'])
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }));
});




gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch(['app/js/*.js', './*.js'], ['vet']);
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function () {

    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

// Optimizing Images 
gulp.task('images', function () {
    return gulp.src(['app/images/**/*.+(png|jpg|jpeg|gif|svg)'])
        .pipe(gulp.dest('dist/images'));
});




// Copying fonts 
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

// Cleaning 
gulp.task('clean', function () {
    return del.sync('dist').then(function (cb) {
        return cache.clearAll(cb);
    });
});

gulp.task('clean:dist', function () {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    );
});

gulp.task('build', function (callback) {
    runSequence(
        'clean:dist', ['sass', 'useref', 'images', 'fonts'],
        callback
    );
});
