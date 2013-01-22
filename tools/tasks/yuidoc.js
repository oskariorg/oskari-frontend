/*
 * grunt-contrib-yuidoc
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 George Pantazis, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';

    // TODO: ditch this when grunt v0.4 is released
    grunt.util = grunt.util || grunt.utils;

    grunt.registerMultiTask('yuidoc', 'Create YUIDocs', function() {

        var kindOf = grunt.utils.kindOf;
        var helpers = require('grunt-lib-contrib').init(grunt);
        var Y = require('yuidocjs');
        var done = this.async();
        var starttime = (new Date()).getTime();
        var json;

        var options = helpers.options(this, {
            quiet: true
        });

        // process project data templates
        // TODO: ditch this when grunt v0.4 is released
        var _ = grunt.util._;
        var projectData = {};
        _.each(this.data, function(value, key) {
            if (kindOf(value) === 'string') {
            projectData[key] = grunt.template.process(value);
            }
        });

        // when invoking yuidocs via node, the project details
        // are assigned under the options object using the key
        // 'project'
        options.project = projectData;

        grunt.verbose.writeflags(options, 'Options');

        // Catch if required fields are not provided.
        if ( !options.paths ) {
            grunt.fail.warn('No path(s) provided for YUIDoc to scan.');
        }
        if ( !options.outdir ) {
            grunt.fail.warn('You must specify a directory for YUIDoc output.');
        }

        // ensure destination dir is available
        grunt.file.mkdir(options.outdir);

        // Input path: array expected, but grunt conventions allows for either a string or an array.
        if (kindOf(options.paths) === 'string') {
            options.paths = [ options.paths ];
        }

        // NOTE: Need to override the comment parsing since Oskari has JSDuck style comments
        // YUIDoc expects method/class descriptions to start the API comment where as JSDuck
        // comments start with @method or @class and the description comes after that
        // REGEX_LINE_HEAD_CHAR/REGEX_LINES constants copied from DocParser definition 
        Y.DocParser.prototype.handlecomment = overrides.DocParser.handlecomment;

        json = (new Y.YUIDoc(options)).run();

        options = Y.Project.mix(json, options);

        if (!options.parseOnly) {
            var builder = new Y.DocBuilder(options, json);

            grunt.log.writeln('Start YUIDoc compile...');
            grunt.log.writeln('Scanning: ' + grunt.log.wordlist(options.paths));
            grunt.log.writeln('Output: ' + (options.outdir).cyan);

            builder.compile(function() {
                var endtime = (new Date()).getTime();
                grunt.log.writeln('YUIDoc compile completed in ' + ((endtime - starttime) / 1000) + ' seconds');
                done();
            });
        }
    });

    // constants copied from Y.DocParser definition
    var REGEX_LINE_HEAD_CHAR = {
          js: /^\s*\*/,
          coffee: /^\s*#/
        };
    var REGEX_LINES = /\r\n|\n/;

    var overrides = {
        DocParser : {
            handlecomment: function(comment, file, line) {
                var lines = comment.split(REGEX_LINES),
                    len = lines.length, i,
                    parts, part, peek, skip,
                    results = [{'tag': 'file', 'value': file},
                               {'tag': 'line', 'value': line}],
                    syntaxtype = this.get('syntaxtype'),
                    lineHeadCharRegex = REGEX_LINE_HEAD_CHAR[syntaxtype],
                    hasLineHeadChar  = lines[0] && lineHeadCharRegex.test(lines[0]);
    
                // trim leading line head char(star or harp) if there are any
                if (hasLineHeadChar) {
                    for (i = 0; i < len; i++) {
                        lines[i] = lines[i].replace(lineHeadCharRegex, '');
                    }
                }
    
                // reconsitute and tokenize the comment block
                comment = this.unindent(lines.join('\n'));
                parts = comment.split(/(?:^|\n)\s*(@\w*)/);
                len = parts.length;
                var lastTag,
                    value = '',
                    tag = '';
                for (i = 0; i < len; i++) {
                    value = '';
                    part = parts[i];
                    if (part === '') {
                        continue;
                    }
                    skip = false;
    
                    // the first token may be the description, otherwise it should be a tag
                    if (i === 0 && part.substr(0, 1) !== '@') {
                        if (part) {
                            tag = '@description';
                            value = part;
                        } else {
                            skip = true;
                        }
                    } else {
                        tag = part;
                        // lookahead for the tag value
                        peek = parts[i + 1];
                        if (peek) {
                            value = peek;
                            // ----- start override part here --------
                            var lineBreakIndex = value.indexOf('\n');
                            // if value has linebreaks, it's the description, exceptions are @param and @return
                            if(tag !== '@param' && tag !== '@return' && lineBreakIndex != -1) {
                                var desc = value.substring(lineBreakIndex + 1);
                                results.push({
                                    tag: 'description',
                                    value: desc
                                });
                                value = value.substring(0, lineBreakIndex);
                            }
                            // ----- end override part here --------
                            i++;
                        }
                    }
    
                    if (!skip && tag) {
                        results.push({
                            tag: tag.substr(1).toLowerCase(),
                            value: value
                        });
                    }
                }
    
                return results;
            }
        }
    }
};
