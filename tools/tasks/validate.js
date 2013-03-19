/*
 * oskari-validate
 */

module.exports = function(grunt) {

    grunt.registerMultiTask('validate', 'Validate appsetup js', function() {
        var starttime = (new Date()).getTime();

        var options = this.data.options;

        // Run some sync stuff.
        grunt.log.writeln('Validating...');

        // Catch if required fields are not provided.
        if ( !options.appSetupFile ) {
            grunt.fail.warn('No path provided for Validate to scan.');
        }

        var fs = require('fs');
        var parser = require('../parser.js');
        var JSHint = require('jshint');
        var logMessages = [];
    
        this.validateJS = function(file, bundleFile) {
            var code = fs.readFileSync(file, 'utf8');
            JSHint.JSHINT(code);
            var nErrors = JSHint.JSHINT.errors;
            if(nErrors.length > 0) {
                this.log('Validation errors!');
                if(bundleFile) {
                    this.log('   in files linked by: ' + bundleFile);
                }
                this.log('Found ' + nErrors.length + ' lint errors on ' + file + '.\n');
            }
            // JSON.stringify()
            for (var i = 0; i < nErrors.length; ++i) {
                if(nErrors[i]) {
                    // too may errors can cause array object to be undefined
                    this.log('Error (line ' + nErrors[i].line + ' char ' + nErrors[i].character + '): ' + nErrors[i].reason + ' ' + nErrors[i].id);
                    this.log('       ' + nErrors[i].evidence + '\n');
                }
            }
        }
        
        this.log = function(message) {
            logMessages.push(message);
        }
        
        this.writeLog = function(logFile) {
            
            if(logMessages.length === 0) {
                return;
            }
            var value = '';
            for(var i = 0; i < logMessages.length; ++i) {
                value = value + logMessages[i] + '\n';
            }
            if(!logFile) {
                console.log(value);
            }
            else {
                fs.writeFileSync(logFile, value);
                console.log('Wrote ', i, 'logs to ', logFile);
            }
            logMessages = [];
        }

        var processedAppSetup = parser.getComponents(options.appSetupFile);
        // validate parsed appsetup
        var files = [];
        var validationDir = './validation/';
        if (!fs.existsSync(validationDir)) {
            fs.mkdirSync(validationDir);
        }
        for (var j = 0; j < processedAppSetup.length; ++j) {
            var array = parser.getFilesForComponent(processedAppSetup[j], 'javascript');
            for (var i = 0; i < array.length; ++i) {
                this.validateJS(array[i], processedAppSetup[j].name);
            }
            this.writeLog(validationDir + processedAppSetup[j].name + '.txt');
        }

        var unknownfiles = [];
        for(var j = 0; j < processedAppSetup.length; ++j) {
            unknownfiles = unknownfiles.concat(parser.getFilesForComponent(processedAppSetup[j], 'unknown'));
        }
        if(unknownfiles.length != 0) {
            console.log('Appsetup referenced types of files that couldn\'t be handled: ' + unknownfiles);
        }

        var endtime = (new Date()).getTime();
        grunt.log.writeln('Validate completed in ' + ((endtime - starttime) / 1000) + ' seconds');
    });
};
