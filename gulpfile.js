var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect');
 
gulp.task('connect', function() {
  connect.server({
    root: './demo',
    port: 9000,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./demo/*.html')
    .pipe(connect.reload());
});

gulp.task('demo-js', function () {
  gulp.src('./demo/*.js')
    .pipe(connect.reload());
});

gulp.task('src-js', function (done) {

  var files = gulp.src('./src/*.js');
  var stream = files
        .pipe(concat('ss-velocity.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(gulp.dest('./demo'));

  files
    .pipe(concat('ss-velocity.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));

  stream.on('end', function() {
    if(connect) { connect.reload(); }
    done();
  });
});

gulp.task('watch', function () {
  gulp.watch(['./demo/*.html'], ['html']);
  gulp.watch(['./demo/*.js'], ['demo-js']);
  gulp.watch(['./src/*.js'], ['src-js']);
});

gulp.task('default', ['src-js', 'connect', 'watch']);