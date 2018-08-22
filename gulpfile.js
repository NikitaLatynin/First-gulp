var gulp = require('gulp');
	sass = require('gulp-sass');
	browserSync = require('browser-sync');
	autoprefixer = require('gulp-autoprefixer');
	sourcemaps = require('gulp-sourcemaps');
	notify = require('gulp-notify');
	plumber = require('gulp-plumber');
	concat = require('gulp-concat');
	uglify = require('gulp-uglifyjs');
	cssnano = require('gulp-cssnano');
	rename = require('gulp-rename');
	del = require('del');


var onError = function(error){
	return error.messageOriginal ?
	"File: " + error.file +
	"\rAt: " + error.line + error.column +
	"r" + error.messageOriginal :
	error;
}

gulp.task('sass', function(){
	return gulp.src('app/scss/*.scss')
	.pipe(sourcemaps.init())
	.pipe(plumber({
		errorHandler : notify.onError({
			title: 'SCSS error',
			message: onError
		})
	}))
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(plumber.stop())
	.pipe(gulp.dest('app/css'))
	.pipe(notify('SCSS is completed'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir: 'app'
		}
	});
});

gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('css-libs',['sass'], function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

gulp.task('watch',['browser-sync','css-libs','scripts'], function (){
	gulp.watch('app/scss/*.scss',['sass']);
	gulp.watch('app/*.html',browserSync.reload);
	gulp.watch('app/*.js',browserSync.reload);
});

gulp.task('default',['watch']);

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('build',['clean','sass', 'scripts'], function(){
	var buildCss = gulp.src([
		'app/css/main.css',
        'app/css/libs.min.css'
        ])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'))
});