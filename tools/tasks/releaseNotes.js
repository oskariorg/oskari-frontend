/*
 * grunt-releaseNotes
 */


module.exports = function(grunt) {

    grunt.registerTask('releaseNotes', 'Gether Release Notes for version', function(version, username, password) {
        var done = this.async(),
            starttime = (new Date()).getTime(),
            fs = require('fs'),
            exec = require('child_process').exec,
            child,
            credentials = username + ':' + password,
            jiraJQL = 'project=AH+and+cf%5B10310%5D+is+not+EMPTY+order+by+priority+desc&fields=customfield_10310';

        if(!version || !username || !password) {
            grunt.fail.fatal('Missing parameter!\nNote! version is not used at the moment. Edit JQL to include fixVersion if taken into use.\nUsage: grunt releaseNotes:1.0.0:username:password', 1);
        }

        // http://nodejs.org/api.html#_child_processes
        child = exec('curl --noproxy "*" -u ' + credentials + ' -X GET -H "Content-Type: application/json" "http://jira.nls.fi/jira/rest/api/2/search?jql=' + jiraJQL + '"',
            function (error, stdout, stderr) {
                if (error !== null) {
                    grunt.fail.fatal('Error: ' + error, 1);
                } else {
                    if (stdout.charAt(0) === "<") {
                        grunt.fail.fatal('HTML detected instead of json. Check returned HTML below for the cause.\n\n' + stdout, 1);
                    }
                    var result = JSON.parse(stdout);
                    var issues = result.issues;
                    var releaseNotes = "";
                    for(var i = 0, ilen = result.issues.length; i < ilen; i++) {
                        var issue = result.issues[i];
                        var releaseNote = issue.fields.customfield_10310;

                        // include existing release notes, skip nulls
                        if (releaseNote) {
                            // add spacing
                            if (releaseNotes) {
                                releaseNotes += "\n\n";
                            }
                            releaseNotes += releaseNote;
                        }
                    }

                    // write to file
                    grunt.log.writeln('Writing to file:\n' + releaseNotes);
                    fs.writeFileSync("../ReleaseNotes_" + version + ".md", releaseNotes);
                }

                var endtime = (new Date()).getTime();
                grunt.log.writeln('releaseNotes completed in ' + ((endtime - starttime) / 1000) + ' seconds');
                done();
            }
        );
    });
}