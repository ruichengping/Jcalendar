var gulp = require('gulp');
var rename = require("gulp-rename");
var minifyCSS = require('gulp-minify-css');
var uglify = require("gulp-uglify");
var autoprefixer=require("gulp-autoprefixer");
gulp.task('export-css', function () {
    return gulp.src('./src/css/Jcalendar.css')
        .pipe(autoprefixer({
            browsers:["Android>=4.0","iOS>=7"]
        }))
        .pipe(minifyCSS())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./lib'));
});
gulp.task('export-js',function(){
    return gulp.src('./src/js/Jcalendar.js')
           .pipe(uglify())
           .pipe(rename({suffix:'.min'}))
           .pipe(gulp.dest('./lib'));
});   
gulp.task('default', ['export-css','export-js']);