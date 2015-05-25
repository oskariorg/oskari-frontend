/*
 * code formatter
 */

module.exports = function (grunt) {

    grunt.registerMultiTask('beautifyJS', 'Clean up JS code style', function () {
        
            var startTime = new Date().getTime(),
            beautify = require('js-beautify'),
            beautifyOptions = {
                jslint_happy: true
            },
            contents;

        // Run some sync stuff.
        grunt.log.writeln('Validating...');

        this.files.forEach(function (file) {
            file.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    // This is not fatal...
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                grunt.log.writeln('Beautifying ' + filepath);
                // replace tabs with four spaces, beautify only does this for indentation
                contents = grunt.file.read(filepath).replace(/\t/g, '    ');
                grunt.file.write(filepath, beautify(contents, beautifyOptions));
                return true;
            });
        });
        grunt.log.writeln('Beautification took ' + ((new Date().getTime() - startTime) / 1000) + ' seconds.');
        var endtime = (new Date()).getTime();
        grunt.log.writeln('Validate completed in ' + ((endtime - starttime) / 1000) + ' seconds');
    });
};
