var gulp    = require('gulp');
var path    = require('../paths');
var ghPages = require('gulp-gh-pages');
 
gulp.task('publish', function() 
{
  return gulp.src('./wwwprod/**/*')
             .pipe(ghPages());
});
