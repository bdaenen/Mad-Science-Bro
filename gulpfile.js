(function() {
    'use strict';
    var gulp = require('gulp');

    var uglify = require('gulp-uglify');
    var concat = require('gulp-concat');
    var browserify = require('browserify');
    var source = require('vinyl-source-stream');
    var watchify = require('watchify');
    var buffer = require('vinyl-buffer');
    var util = require('gulp-util');
    var merge = require('merge-stream');
    var _ = require('lodash');

    gulp.task('watch', function() {
        var bundler = watchify(browserify('./src/app.js', _.assign(
          {},
          watchify.args,
          {
              entries: ['./src/app.js'],
              debug: true,
              paths: ['./node_modules', './src/']
          }
        )));

        bundler.on('log', util.log);
        bundler.on('update', bundle);
        bundle();

        function bundle() {
            var bundle = bundler.bundle()
              .on('error', util.log.bind(util, 'Browserify Error!'))
              .pipe(source('app.js'))
              .pipe(buffer());
            var debug = gulp.src('src/debug.js');

          return merge(bundle, debug)
            .pipe(concat('app.js'))
            .pipe(gulp.dest('./build'));
        }
    });

    gulp.task('build', function() {
        var bundler = browserify('./src/app.js', {
            entries: ['./src/app.js'],
            debug: false,
            paths: ['./node_modules', './src/']
        });

        bundler.bundle()
          .on('error', util.log.bind(util, 'Build Error!'))
          .pipe(source('app.min.js'))
          .pipe(buffer())
          .pipe(uglify())
          .pipe(gulp.dest('./build'));
    });

    gulp.task('default', ['watch']);
}());
