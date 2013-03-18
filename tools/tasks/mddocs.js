/*
 * grunt-generate-sprite
 */

module.exports = function(grunt) {

    grunt.registerTask('mddocs', 'Generate md documentation', function(version) {
        var done = this.async();
        var starttime = (new Date()).getTime();

        var options = this.options();

        // Run some sync stuff.
        grunt.log.writeln('Generating md docs...');

        if(version && !options.version) {
            options.version = version;
        }

        // Catch if required fields are not provided.
        if(!options.docsurl) {
            grunt.fail.warn("Place where the docs will be released from the root URL");
        }
        if(!options.apiurl) {
            grunt.fail.warn("Place for the API documentation (the url)");
        }
        if(!options.version) {
            grunt.fail.warn("No version, add version to options");
        }

        var fs = require("fs"),
            path = require("path"),
            wrench = require('wrench'),
            util = require('util'),
            markx = require('markx'),
            async = require('async'),
            ejs = require('ejs');


        /*
         * Configurations
         */

        var markdownDirectory = "md";
        var layoutDirectory = "layout";
        var layoutFile = "index.html";
        var cssDirectory = "css";
        var imagesDirectory = "images";
        var destinationDirectory = "../dist/" + options.version + "/docs";
        var cwd = path.join(options.toolsPath, options.docsPath);

        /*
         * Parse topics: topics => html menu
         */

        var linkHtml = ejs.compile('<li id="<%= topic %>"><a href="<%= link %>"><%= topic %></a></li>\n');
        var submenuStartHtml = ejs.compile('<li id="<%= topic %>"><a href="<%= index %>"><%= topic %></a><ul class="submenu-level<%= pathLength %>"> \n');
        var submenuStopHtml = ejs.compile('</ul></li>\n');

        function parseTopics(topics, pathLength, html) {
            pathLength = pathLength + 1;
            for(topic in topics) {
                if(typeof topics[topic] == "object") {
                    html = html + submenuStartHtml({
                        pathLength: pathLength,
                        topic: topic,
                        index: topics[topic]["baseUrl"]
                    });
                    html = parseTopics(topics[topic], pathLength, html);
                    html = html + submenuStopHtml();
                } else if(topic != "baseUrl") {
                    html = html + linkHtml({
                        topic: topic,
                        link: topics[topic]
                    });
                }
            }
            return html;
        }

        /**
         * Create a directory structure
         */

        function createDirStructure(root, subdirs) {
            var stat = null;

            try {
                stat = fs.statSync(root);
            } catch(err) {}

            if(!stat || !stat.isDirectory()) {
                fs.mkdirSync(root);
            }

            subdirs.forEach(function(f) {
                if(!fs.existsSync(path.join(root, f))) fs.mkdirSync(path.join(root, f));
            });
        };

        /**
         * Copy all files of sourceDir to destinationDir
         */

        function copyFiles(sourceDir, destinationDir) {
            var files = fs.readdirSync(sourceDir);

            files.forEach(function(f) {
                var fname = path.join(sourceDir, f);
                var dname = path.join(destinationDir, f);

                if(!fs.existsSync(dname)) { /// TODO: if newer file -> replaces
                    var stream = fs.createReadStream(fname);
                    stream.pipe(fs.createWriteStream(dname));
                    stream.resume();
                }
            });
        };

        function generateHtml(mdFilePaths, topicsHtml, callback) {
            var file,
                files = [];

            for(var i = 0, ilen = mdFilePaths.length; i < ilen; i++) {
                file = mdFilePaths[i];
                var pathLength = file.split("\\").length - 1;

                // create css path
                var cssPath = "";
                for(var c = 0; c < pathLength; c++) {
                    cssPath = "../" + cssPath;
                }

                files.push({
                    "mdFilePath": path.join(cwd, markdownDirectory, file),
                    "output": file.substr(0, file.lastIndexOf(".")) + ".html",
                    "markx" : {
                        "template": path.join(cwd, layoutDirectory, layoutFile),
                        "highlight": true,
                        "data": {
                            "cssPath": cssPath,
                            "activeId": file.substring(file.lastIndexOf("\\")+1, file.lastIndexOf(".")),
                            "menu": topicsHtml
                        }
                    }
                });
            }

            async.map(files, generateFile, callback);
        };

        function generateFile(file, cb) {
            ejs.renderFile(file.mdFilePath, {
                docsurl: options.docsurl,
                apiurl: options.apiurl
            }, function(err, md) {
                if(!err) {
                    file.markx.input = md;
                    // parse md + html template => html
                    markx(file.markx, function(err, html) {
                        if(!err) {
                            fs.writeFile(path.join(destinationDirectory, file.output), html, "utf-8", cb);
                        } else {
                            cb(err);
                        }
                    });
                } else {
                    cb(err);
                }
            });
        };


        createDirStructure(destinationDirectory, [cssDirectory, imagesDirectory]);
        copyFiles(path.join(cwd, layoutDirectory, cssDirectory), path.join(destinationDirectory, cssDirectory));
        copyFiles(path.join(cwd, imagesDirectory), path.join(destinationDirectory, imagesDirectory));

        var res = wrench.readdirSyncRecursive(path.join(cwd, markdownDirectory)); // get the md's

        // create folderTrees
        var folderTreeMd = {};
        var folderTreeTopics = {};
        if(res && res.length > 0) {
            var tmp = null;
            var filePath = null;
            var folder = null;
            var filename = null;
            var dirMd = null;
            var dirHtml = null;
            var stat;

            for(var i = 0; i < res.length; i++) {
                dirMd = folderTreeMd;
                dirHtml = folderTreeTopics;

                // if file
                try {
                    stat = fs.statSync(path.join(cwd, markdownDirectory, res[i]));
                } catch(err) {}
                if(stat && !stat.isDirectory()) {
                    tmp = res[i].split("\\"); // TODO: this is only for windows?
                    /// Create folder structure if missing
                    filePath = tmp.slice(0, -1);
                    folder = "";
                    for(var j = 0; j < filePath.length; j++) {
                        folder = path.join(folder, filePath[j]);
                        createDirStructure(destinationDirectory, [folder]);
                        if(!dirMd[filePath[j]]) {
                            dirMd[filePath[j]] = {};
                        }
                        if(!dirHtml[filePath[j]]) {
                            dirHtml[filePath[j]] = {
                                "baseUrl": "#"
                            };
                        }

                        // If there is link and dir with same name
                        if(typeof dirHtml[filePath[j]] != "object") {
                            dirHtml[filePath[j]] = {
                                "baseUrl": dirHtml[filePath[j]]
                            };
                        }

                        dirMd = dirMd[filePath[j]];
                        dirHtml = dirHtml[filePath[j]];
                    }

                    // add file
                    filename = tmp.slice(-1)[0];
                    dirMd[filename] = res[i];

                    // add menu item
                    topic = filename.substr(0, filename.lastIndexOf("."));
                    output = res[i].substr(0, res[i].lastIndexOf(".")) + ".html";
                    output = output.replace(/\\/g, "/");

                    dirHtml[topic] = options.docsurl + output;
                }
            }
        }
        topics = parseTopics(folderTreeTopics, 0, "");

        // for some reason only some directories are include, but all we want are the .md files
        var mdFiles = res.filter(function(file) {
            return file.lastIndexOf('.md') != -1;
        });

        generateHtml(mdFiles, topics, function(err, result) {
            if(!err) {
                var endtime = (new Date()).getTime();
                grunt.log.writeln('md docs completed in ' + ((endtime - starttime) / 1000) + ' seconds');
                done();
            } else {
                grunt.fatal('md docs failed.' + err, 2);
            }
        });
    });

};