var path        = require('../paths');
var jspm        = require('jspm');
var gulp        = require('gulp');
var runSequence = require('run-sequence');


var aureliaFiles = 
[
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-loader-default",
        "aurelia-templating-resources",
        "aurelia-event-aggregator",
        "aurelia-templating-router",
        "aurelia-history-browser",
        "aurelia-logging-console",
        "aurelia-templating-binding",
        "text"  //jspm plugin
].join(' + ');


//Bundle aurelia libs
//----------------------------------------------------------------------------------
gulp.task('bundle:aurelia', function (done)
{
    var outFile = path.devOutput + 'aurelia.js';

    jspm.unbundle().then(function()
    {
        jspm.bundle(aureliaFiles, outFile, {inject:true,sourceMaps:false,minify:true,mangle:true}).then(function()
        {
            done();
        });    
    });
});


//Bundle non-aurelia files
//----------------------------------------------------------------------------------
gulp.task('bundle:app', function (done)
{
  var outFile = path.devOutput + 'app.js';

  var cmd = "app/**/* + app/**/*.html!text - aurelia";
  jspm.bundle(cmd, outFile, {inject:true,sourceMaps:false,minify:true,mangle:true}).then(function()
  {
      done();
  });

});


//Bundle all files
//----------------------------------------------------------------------------------
gulp.task('bundle:all', function (done)
{
    var files   = aureliaFiles + " + app/**/* + app/**/*.html!text";
    var outFile = path.devOutput + 'all.js';
    
    //Could be tad more efficient by not injecting bundle info into config.js and instead explictly
    //adding a script tag to index.html for all.js
    jspm.unbundle().then(function()
    {
        jspm.bundle(files, outFile, {inject:true,sourceMaps:false,minify:true,mangle:true}).then(function()
        {
            done();
        });
    });
});


