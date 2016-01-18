var path        = require('../paths');
var gulp        = require('gulp');
var runSequence = require('run-sequence');


//deploy:copy - Copies files from dev to production
//-----------------------------------------------------------------------------
gulp.task('deploy:copy', function (cb)
{
    var files = 
    [
        path.devOutput + 'all.js',
        path.devOutput + 'config.js',
        path.devOutput + 'app.css',
        path.devOutput + 'index.html',
    ];
    return gulp.src(files)
               .pipe(gulp.dest(path.prodOutput));
});


//deploy:copyJSPM - Copies JSPM from dev to production
//-----------------------------------------------------------------------------
gulp.task('deploy:copyJSPM', function (cb)
{
    return gulp.src(path.devOutput + 'jspm_packages/system.js')
               .pipe(gulp.dest(path.prodOutput + '/jspm_packages'));
});


//deploy - Builds for production
//-----------------------------------------------------------------------------
gulp.task('deploy', function (cb)
{
  return runSequence(
    ['clean','clean:prod'],
    ['build:style', 'build:html', 'build:js', 'build:img'],
    'bundle:all',
    ['deploy:copy','deploy:copyJSPM'],
    cb
  );
});
