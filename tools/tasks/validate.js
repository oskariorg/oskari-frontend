/*
 * oskari-validate
 */

module.exports = function (grunt) {

    grunt.registerMultiTask('validate', 'Validate appsetup js', function () {
        var starttime = (new Date()).getTime();

        var options = this.data.options;

        // Run some sync stuff.
        grunt.log.writeln('Validating...');

        // Catch if required fields are not provided.
        if (!options.appSetupFile) {
            grunt.fail.warn('No path provided for Validate to scan.');
        }

        var fs = require('fs');
        var parser = require('../parser.js');
        var JSHint = require('jshint');
        var logMessages = [];
        var ignoredFiles = [
            'chosen.jquery.js',
            'comp.js',
            'geostats.min.js',
            'jenks.util.js',
            'jquery.base64.min.js',
            'jquery.cookie.js',
            'jquery.event.drag-2.0.min.js',
            'jquery.placeholder.js',
            'jquery-ui-1.9.1.custom.min.js',
            'jquery-ui-1.9.2.custom.min.js',
            'jscolor.js',
            'lodash.js',
            'OpenLayers.2_13_1-full-map.js',
            'Popover.js',
            'proj4js-compressed.js',
            'raphael_export_icons.js',
            'slick.core.js',
            'slick.formatters.js.',
            'slick.editors.js',
            'slick.cellselectionmodel.js',
            'slick.headermenu2.js',
            'slick.headerbuttons.js',
            'slick.rowselectionmodel.js',
            'slick.checkboxselectcolumn2.js',
            'slick.grid.js',
            'slick.dataview.js',
            'slick.pager.js',
            'slick.columnpicker.js'
        ];

        this.validateJS = function (file, bundleFile) {
            var i;
            for (i = 0; i < ignoredFiles.length; i++) {
                if (file.indexOf(ignoredFiles[i], file.length - ignoredFiles[i].length) > -1) {
                    console.log("Ignoring ", file);
                    return;
                }
            }
            var code = fs.readFileSync(file, 'utf8');
            JSHint.JSHINT(code);
            var nErrors = JSHint.JSHINT.errors;
            if (nErrors.length > 0) {
                this.log('Validation errors!');
                if (bundleFile) {
                    this.log('   in files linked by: ' + bundleFile);
                }
                this.log('Found ' + nErrors.length + ' lint errors on ' + file + '.\n');
            }
            // JSON.stringify()
            for (i = 0; i < nErrors.length; ++i) {
                if (nErrors[i]) {
                    // too may errors can cause array object to be undefined
                    this.log('Error (line ' + nErrors[i].line + ' char ' + nErrors[i].character + '): ' + nErrors[i].reason + ' ' + nErrors[i].id);
                    this.log('       ' + nErrors[i].evidence + '\n');
                }
            }
        };

        this.log = function (message) {
            logMessages.push(message);
        };

        this.writeLog = function (logFile) {

            if (logMessages.length === 0) {
                return;
            }
            var value = '',
                i;
            for (i = 0; i < logMessages.length; ++i) {
                value = value + logMessages[i] + '\n';
            }
            if (!logFile) {
                console.log(value);
            } else {
                fs.writeFileSync(logFile, value);
                console.log('Wrote ', i, 'logs to ', logFile);
            }
            logMessages = [];
        };

        var processedAppSetup = parser.getComponents(options.appSetupFile);
        // validate parsed appsetup
        var files = [];
        var validationDir = './validation/',
            i,
            j;
        if (!fs.existsSync(validationDir)) {
            fs.mkdirSync(validationDir);
        }
        for (j = 0; j < processedAppSetup.length; ++j) {
            var array = parser.getFilesForComponent(processedAppSetup[j], 'javascript');
            for (i = 0; i < array.length; ++i) {
                this.validateJS(array[i], processedAppSetup[j].name);
            }
            this.writeLog(validationDir + processedAppSetup[j].name + '.txt');
        }

        var unknownfiles = [];
        for (j = 0; j < processedAppSetup.length; ++j) {
            unknownfiles = unknownfiles.concat(parser.getFilesForComponent(processedAppSetup[j], 'unknown'));
        }
        if (unknownfiles.length !== 0) {
            console.log('Appsetup referenced types of files that couldn\'t be handled: ' + unknownfiles);
        }

        var endtime = (new Date()).getTime();
        grunt.log.writeln('Validate completed in ' + ((endtime - starttime) / 1000) + ' seconds');
    });
};