var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var cachebreaker = require('gulp-cache-breaker');
var uglify = require('gulp-uglify');

gulp.task('default', ['images', 'scripts', 'html', 'styles'], function() {
});

gulp.task('images', function(){
    return gulp.src('web/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('scripts', function() {
    return gulp.src([
        'web/bower_components/jquery/dist/jquery.min.js',
        'web/bower_components/bootstrap/dist/js/bootstrap.min.js',
        'web/bower_components/angular/angular.min.js',
        'web/bower_components/angular-route/angular-route.min.js',
        'web/bower_components/angular-resource/angular-resource.min.js',
        'web/bower_components/angular-animate/angular-animate.min.js',
        'web/bower_components/angular-sanitize/angular-sanitize.min.js',
        'web/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'web/bower_components/moment/min/moment.min.js',
        'web/bower_components/angular-moment/angular-moment.min.js',
        'web/bower_components/angular-loading-bar/src/loading-bar.js',
        'web/bower_components/ng-file-upload/ng-file-upload-shim.min.js"',
        'web/bower_components/ng-file-upload/ng-file-upload.min.js',
        'web/js/analyticsService.js',
        'web/js/app.js',
        'web/js/main.js',
        'web/js/controllers/homepageController.js',
        'web/js/controllers/highlightController.js',
        'web/js/controllers/searchController.js',
        'web/js/controllers/modalController.js',
        'web/js/controllers/replayController.js'
    ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', ['bower-styles'], function () {
    return gulp.src('web/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));
});

gulp.task('bower-styles', function() {
    return gulp.src([
        'web/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'web/bower_components/bootstrap-social/bootstrap-social.css',
        'web/bower_components/font-awesome/css/font-awesome.min.css',
        'web/bower_components/angular-loading-bar/src/loading-bar.css'
    ])
        .pipe(concat('bower-main.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
    return gulp.src('web/**/*.html')
        .pipe(minifyhtml())
        .pipe(cachebreaker('dist'))
        .pipe(gulp.dest('dist'));
});