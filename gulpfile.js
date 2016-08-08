var gulp = require('gulp'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload,
		$ = require('gulp-load-plugins')();

gulp.task('styles', function() {
	return gulp.src('src/styles/styles.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass())
		.pipe($.autoprefixer({ browsers: ['last 2 versions'], cascade: false}))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('.tmp'))
		.pipe(reload({ stream: true }));
});

gulp.task('slides', function() {
  return gulp.src('src/*.njk')
	  .pipe($.plumber())
	  .pipe($.nunjucksRender({
      path: ['src', 'src/slides']
    }))
	  .pipe(gulp.dest('.tmp'))
});

gulp.task('serve', ['styles', 'slides'], function() {
  browserSync({
    server: {
      baseDir: ['.tmp', 'src']
    }
  });

  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/**/*.njk', ['slides']);
  gulp.watch('.tmp/*.html').on('change', reload);
});

gulp.task('build', ['styles', 'slides'], () => {
  return gulp.src([
    '.tmp/*.*',
    'src/**/*.*',
    '!src/styles/**/*.*',
    '!src/**/*.njk'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('default', ['serve']);