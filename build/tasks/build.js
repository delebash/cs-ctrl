var path        = require('../paths');
var gulp        = require('gulp');
var babel       = require('gulp-babel');
var sourcemaps  = require('gulp-sourcemaps');
var plumber     = require('gulp-plumber');
var changed     = require('gulp-changed');
var runSequence = require('run-sequence');
var concat      = require('gulp-concat');
var less        = require('gulp-less');
var AutoPrefix  = require('less-plugin-autoprefix');
var autoPrefix  = new AutoPrefix({browsers: ['last 2 versions']});
var minCSS      = require('gulp-cssnano');
var notify      = require("gulp-notify");
var htmlmin     = require('gulp-htmlmin');

//build:js - Builds changed javascript files to the devOutput directory
//-----------------------------------------------------------------------------
gulp.task('build:js', function() 
{
    return gulp.src(path.js)
               .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
               .pipe(sourcemaps.init())       
               .pipe(changed(path.devOutput, {extension: '.js'}))
               //.pipe(babel({presets: ['es2015'], plugins: ['transform-decorators-legacy']}))   //v6.x currently doesn't work w/ decorators
               .pipe(babel({modules: 'system',
                            moduleIds: false,
                            comments: false,
                            compact: false,
                            stage: 2,
                            optional: ['es7.decorators','es7.classProperties']
                }))
               .pipe(sourcemaps.write())
               .pipe(gulp.dest(path.devOutput));
});



//build:html - Minifies & copies changed html files to the devOutput directory
//-----------------------------------------------------------------------------
gulp.task('build:html', function ()
{
    return gulp.src(path.html)
               .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
               .pipe(changed(path.devOutput))
               .pipe(htmlmin({collapseWhitespace: true}))
               .pipe(gulp.dest(path.devOutput));
});


//build:img - Copies changed image files to the devOutput directory
//-----------------------------------------------------------------------------
gulp.task('build:img', function ()
{
    return gulp.src(path.img)
               .pipe(changed(path.devOutput))
               .pipe(gulp.dest(path.devOutput));
});


//build:style - Builds style files into css and writes them to devOutput
//-----------------------------------------------------------------------------
gulp.task('build:style', function ()
{
    return gulp.src(path.style)
               .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
               .pipe(concat('app.css'))
               .pipe(less({
                   plugins: [autoPrefix]
                }))   
               .pipe(minCSS())
               .pipe(gulp.dest(path.devOutput));
});


//build - Calls the clean task, then runs the build:* tasks in parallel, then bundles aurelia
//-----------------------------------------------------------------------------
gulp.task('build', function (callback)
{
  return runSequence(
    'clean',
    ['build:style', 'build:html', 'build:js', 'build:img'],
    'bundle:aurelia',
    callback
  );
});

