var gulp        = require('gulp');
var browserSync = require('browser-sync');

//serve - Runs build, then uses browser-sync to create a server
//-----------------------------------------------------------------------------
gulp.task('serve', ['build'], function(done)
{
    browserSync(
    {
        open: false,  //Open browser?
        port: 9000,
        //proxy: "http://localhost:8080",
        server:
        {
            baseDir: ['./wwwdev'],
            middleware: function (req, res, next)
            {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    }, done);
 });