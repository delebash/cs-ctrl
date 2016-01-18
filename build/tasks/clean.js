var gulp = require('gulp');
var del  = require('del');
var path = require('../paths');

gulp.task('clean', function(cb) 
{
    return del(path.devClean, cb);
});


gulp.task('clean:prod', function(cb) 
{
    return del(path.prodClean, cb);
});