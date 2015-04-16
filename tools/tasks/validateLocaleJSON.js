/*
 * oskari-validate
 */

module.exports = function (grunt) {

    grunt.registerMultiTask('validateLocalizationJSON', 'Make sure localization files are actual JSON', function () {
        var startTime = new Date().getTime(),
            content,
            parsed,
            languageCode;

        // Run some sync stuff.
        grunt.log.writeln('Validating...');


        this.files.forEach(function (file) {
            file.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    // This is not fatal...
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                content = grunt.file.read(filepath);
                // Remove Oskari function call so we don't have to use eval...
                content = content.replace('Oskari.registerLocalization(', '');
                content = content.substring(0, content.lastIndexOf(');'));
                try {
                    parsed = JSON.parse(content);
                    languageCode = filepath.substring(filepath.lastIndexOf('/') + 1, filepath.lastIndexOf('.'));
                    if (languageCode !== parsed.lang) {
                        grunt.fail.fatal('Language code mismatch in ' + filepath + ':\nExpected ' + languageCode + ', found ' + parsed.lang + '.');
                    }
                } catch (err) {
                    grunt.fail.fatal(filepath + ': ' + err);
                }
            });
        });

        var endtime = (new Date()).getTime();
        grunt.log.writeln('Validate completed in ' + ((endtime - starttime) / 1000) + ' seconds');
    });
};
