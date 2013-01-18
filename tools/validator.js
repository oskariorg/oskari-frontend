var fs = require('fs');
var path = require('path');
var JSHint = require('jshint');

module.exports = new OskariValidator();
function OskariValidator() {
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
}