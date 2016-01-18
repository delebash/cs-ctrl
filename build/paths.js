var src        = 'client-src/';
var devOutput  = 'wwwdev/';
var prodOutput = 'wwwprod/';

module.exports = 
{
    js:        [src + '**/*.js'],   //Client scripts
    
    html:      [src + '**/*.html'],
    style:     [src + '**/*.less'],  
    img:       [src + '**/*.png', src + '**/*.jpg', src + '**/*.svg', src + '**/*.ico'],
    
    devClean:  ['wwwdev/**/*', '!wwwdev/jspm_packages', '!wwwdev/jspm_packages/**/*', '!wwwdev/config.js', '!wwwdev/aurelia.js'],
    prodClean: [prodOutput + '**/*'],
    
    devOutput:   devOutput,
    prodOutput:  prodOutput
};