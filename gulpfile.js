var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var cachebreaker = require('gulp-cache-breaker');
var uglify = require('gulp-uglify');
var bower = require('gulp-bower');
var ngAnnotate = require('gulp-ng-annotate');
var connect = require('gulp-connect');

gulp.task('default', ['build']);

gulp.task('build', ['bower','images', 'scripts', 'html', 'styles']);

gulp.task('bower', function() {
    return bower('./bower_components');
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

gulp.task('scripts', ['bower'], function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-resource/angular-resource.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/angular-moment/angular-moment.min.js',
        'bower_components/angular-loading-bar/src/loading-bar.js',
        'bower_components/ng-file-upload/ng-file-upload-shim.min.js"',
        'bower_components/ng-file-upload/ng-file-upload.min.js',
        'web/js/main.js',
        'web/js/app.js',
        'web/js/analyticsService.js',
        'web/js/controllers/homepageController.js',
        'web/js/controllers/highlightController.js',
        'web/js/controllers/contestController.js',
        'web/js/controllers/searchController.js',
        'web/js/controllers/modalController.js',
        'web/js/controllers/replayController.js'
    ])
        .pipe(concat('main.js'))
        .pipe(ngAnnotate())
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

gulp.task('bower-styles', ['bower','bower-fonts'], function() {
    return gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap-social/bootstrap-social.css',
        'bower_components/font-awesome/css/font-awesome.min.css',
        'bower_components/angular-loading-bar/src/loading-bar.css'
    ])
        .pipe(concat('bower-main.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));
});

gulp.task('bower-fonts', ['bower'], function() {
   return gulp.src([
       'bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff',
       'bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf'
   ])
       .pipe(gulp.dest('dist/fonts'));
});

gulp.task('html', function () {
    return gulp.src('web/**/*.html')
        .pipe(minifyhtml())
        .pipe(cachebreaker('dist'))
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watch'], function() {
    connect.server({
        root: 'dist',
        livereload: true,
        fallback: 'dist/index.html'
    });
});

gulp.task('watch', ['build'], function() {
    gulp.watch('web/**/*.html', ['html']);
    gulp.watch('web/styles/*.scss', ['styles']);
    gulp.watch(['web/js/*.js', 'web/js/controllers/*.js'], ['scripts']);
    gulp.watch('web/images/**/*', ['images']);
});