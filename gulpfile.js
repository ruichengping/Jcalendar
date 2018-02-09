const gulp = require('gulp');
const postcss=require('gulp-postcss');
const rename = require("gulp-rename");
const minifyCSS = require('gulp-minify-css');
const uglify = require("gulp-uglify");
const sass=require("gulp-sass");
gulp.task('export-css', function () {
    return gulp.src('./src/scss/Jcalendar.scss')
        .pipe(sass())
        .pipe(postcss())
        .pipe(gulp.dest('./lib/css'))       
        .pipe(minifyCSS())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./lib/css'));
});
gulp.task('export-js',function(){
    return gulp.src('./src/js/Jcalendar.js')
           .pipe(gulp.dest('./lib/js'))
           .pipe(uglify())
           .pipe(rename({suffix:'.min'}))
           .pipe(gulp.dest('./lib/js'));
});   

gulp.task('watch',function(){
    gulp.watch('./src/scss/Jcalendar.scss',['export-css']);
    gulp.watch('./src/js/Jcalendar.js',['export-js']);
});

gulp.task('default', ['export-css','export-js']);