var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var slim = require("gulp-slim");

gulp.task('connect', function(){
  connect.server({
    root: 'public',
    livereload: true,
    port: 3000
  });
});

// keeps gulp from crashing for scss errors
gulp.task('sass', function () {
  return gulp.src(['!./sass/_*.sass','./sass/*.sass'])
      .pipe(sass({ includePaths: require('node-normalize-scss').includePaths, errLogToConsole: true }))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('livereload', function (){
  gulp.src('./public/**/*')
  .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('./sass/**/*.sass', ['sass']);
  gulp.watch('./slim/**/*.slim', ['slim']);
  gulp.watch('./images/**/*.*', ['img']);
  gulp.watch('./public/**/*.*', ['livereload']);
});

gulp.task('slim', function(){
  gulp.src("./slim/**/*.slim")
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest("./public"));
});


//Minify
var minify = require('gulp-minifier');

gulp.task('minify', function() {
  return gulp.src('public/**/*').pipe(minify({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('public/'));
});


//Concat
var concat = require('gulp-concat');
 
gulp.task('concat-scripts', function() {
  return gulp.src(["./bower_components/jquery/dist/jquery.min.js", "./bower_components/bootstrap/dist/js/bootstrap.min.js", "./lib/*.js"])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./public/dist/'));
});

gulp.task('concat-styles', function() {
  return gulp.src(["./bower_components/bootstrap/dist/css/bootstrap.min.css"])
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/dist/'));
});


//Images
gulp.task('img', function() {
  return gulp.src("./images/**/*.*")
    .pipe(gulp.dest('./public/img/'));
});

//Root files
gulp.task('root', function() {
  return gulp.src("./root-files/*.*")
    .pipe(gulp.dest('./public/'));
});

//Main task
gulp.task('default', ['connect', 'watch', 'sass', 'slim', 'concat-scripts', 'concat-styles', 'img', 'root']);