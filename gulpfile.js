var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');


gulp.task('sass',  function () {
  return gulp.src('./scss/*.scss')
      .pipe(sass({
        errLogToConsole : true,
        sourceComments : true,
      }).on('error', sass.logError))
      .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('browserSync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
        port: 7000
  });
});

gulp.task('watch', function () {
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('public/**/*.*').on('change', browserSync.reload);

});

gulp.task('nodemon', function (cb) {
  var started = false;
  return nodemon({
    script: 'server.js'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('default', ['watch', 'sass', 'browserSync']);