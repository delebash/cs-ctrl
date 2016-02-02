var gulp        = require('gulp');
var path        = require('../paths');
var browserSync = require('browser-sync');

//Outputs changes to files to the console
function reportChange(event)
{
    console.log(event.path + ' - ' + event.type + ':');
}


//watch - Runs, build/serve & watches for changes to files. On change it builds them, & calls reportChange()
//-----------------------------------------------------------------------------
gulp.task('watch', ['serve'], function ()
{
    gulp.watch(path.js, ['build:js', browserSync.reload]).on('change', reportChange);
    gulp.watch(path.html, ['build:html', browserSync.reload]).on('change', reportChange);
    gulp.watch(path.style, ['build:style', browserSync.reload]).on('change', reportChange);
    gulp.watch(path.img, ['build:img', browserSync.reload]).on('change', reportChange);
}); 