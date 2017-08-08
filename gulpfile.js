var gulp = require('gulp');
var rename = require("gulp-rename");
var minifyCSS = require('gulp-minify-css');
var uglify = require("gulp-uglify");
gulp.task('export-css', function () {
    return gulp.src('./src/css/Jcalendar.css')
        .pipe(minifyCSS())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./dist'));
});
gulp.task('export-js',function(){
    return gulp.src('./src/js/Jcalendar.js')
           .pipe(uglify())
           .pipe(rename({suffix:'.min'}))
           .pipe(gulp.dest('./dist'));
});   
gulp.task('default', ['export-css','export-js']);