var program = require("commander"),
    fs = require("fs"),
    path = require("path"),
    wrench = require('wrench'),
    util = require('util'),
    markx = require('markx'),
    ejs = require('ejs'),
    fsutils = require("./fsutils.js");


/*
 * Configurations
 */

var markdownDirectory = "md";
var tmpMdDirectory = "tmp";
var layoutDirectory = "layout";
var layoutFile = "index.html";
var cssDirectory = "css";
var imagesDirectory = "images";
var destinationDirectory = "release";
var docsDefaultUrl = "/Oskari/docs/release/";
var apiDefaultUrl = "/Oskari/api/release/";


/*
 * Parsing command line arguments using commander
 */

program
    .usage("[options]")
    .option("--docsurl [location]", "Place where the docs will be released")
    .option("--apiurl [location]", "Place for the API documentation")
    .parse(process.argv);


/*
 * Parse topics: topics => html menu
 */

var linkHtml = ejs.compile('<li id="<%= topic %>"><a href="<%= link %>"><%= topic %></a></li>\n');
var submenuStartHtml = ejs.compile('<li id="<%= topic %>"><a href="<%= index %>"><%= topic %></a><ul class="submenu-level<%= pathLength %>"> \n');
var submenuStopHtml = ejs.compile('</ul></li>\n');


var parseTopics = function(topics, pathLength, html) {
    pathLength = pathLength + 1;
    for(topic in topics) {
        if (typeof topics[topic] == "object") {
            html = html + submenuStartHtml({ pathLength: pathLength, topic: topic, index: topics[topic]["baseUrl"] });
            html = parseTopics(topics[topic], pathLength, html);
            html = html + submenuStopHtml();
        }
        else if(topic != "baseUrl") {
            html = html + linkHtml({ topic: topic, link: topics[topic] });
        }
    }
    return html;
}


/*
 * Parse files: md + menu + template => html
 */

var parseFiles = function(files, topicsHtml) {
    for(file in files) {
        if (typeof files[file] == "object") {
            parseFiles(files[file], topicsHtml);
        }
        else {
            topic = file.substr(0, file.lastIndexOf("."));
            setMdVariables(files[file]);
            parseFile(files[file], topic, topicsHtml);
        }
    }
}


var setMdVariables = function(file) {
    ejs.renderFile(path.join(markdownDirectory, file), {docsurl: program.docsurl, apiurl: program.apiurl}, function(err, md) {
        if (err) {
            console.log(err);
            console.log("Exiting..");
        }

        fs.writeFile(path.join(tmpMdDirectory, file), md, "utf-8", function (err2) {
            if(err2) {
                console.log(err2);
                console.log("Exiting..");
                process.exit(-1);
            }
        });

    });
}


var parseFile = function(file, topic, topicsHtml) {
    var cwd = process.cwd();
    var output = file.substr(0, file.lastIndexOf(".")) + ".html";
    var pathLength = file.split("\\").length - 1;

    // create css path
    var cssPath = "";
    for (var c = 0; c < pathLength; c++) {
        cssPath = "../" + cssPath;
    }

    // parse md + html template => html
    markx({
        input: path.join(tmpMdDirectory, file),
        template: path.join(layoutDirectory, layoutFile),
        menu: topicsHtml,
        highlight: true, //parse code snippets for syntax highlighters, default: true
        data: {
            "cssPath": cssPath,
            "activeId": topic,
        } //data that gets passed into template
    }, function(err, html) {
        if(err) {
            console.log(err);
            console.log("Exiting..");
            process.exit(-1);
        }

        fs.writeFile(path.join(destinationDirectory, output), html, "utf-8", function (err2) {
            if(err2) {
                console.log(err2);
                console.log("Exiting..");
                process.exit(-1);
            }
            console.log("write:", output);
        });

    });
}


/*
 * Run command of the script
 */

var run = function() {
    if(!program.docsurl) {
        console.log("Give parameter: --docsurl <location>");
        console.log("Going with default value: '" + docsDefaultUrl + "'");
        program.docsurl = docsDefaultUrl;
    }
    if(!program.apiurl) {
        console.log("Give parameter: --apiurl <location>");
        console.log("Going with default value: '" + apiDefaultUrl + "'");
        program.apiurl = apiDefaultUrl;
    }
    var cwd = process.cwd();

    wrench.rmdirSyncRecursive(path.join(cwd, destinationDirectory)); // remove all from release
    fsutils.createDirStructure(destinationDirectory, [cssDirectory, imagesDirectory]);
    fsutils.copyFiles(path.join(layoutDirectory, cssDirectory), path.join(destinationDirectory, cssDirectory));
    fsutils.copyFiles(path.join(cwd, imagesDirectory), path.join(destinationDirectory, imagesDirectory));

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

        for (var i = 0; i < res.length; i++) {
            dirMd = folderTreeMd;
            dirHtml = folderTreeTopics;

            // if file
            try {
                stat = fs.statSync(path.join(markdownDirectory, res[i]));
            } catch(err) { }
            if (stat && !stat.isDirectory()) {
                tmp = res[i].split("\\"); // TODO: this is only for windows?

                /// Create folder structure if missing
                filePath = tmp.slice(0,-1);
                folder = "";
                for (var j = 0; j < filePath.length; j++) {
                    folder = path.join(folder, filePath[j]);
                    fsutils.createDirStructure(tmpMdDirectory, [folder]);
                    fsutils.createDirStructure(destinationDirectory, [folder]);
                    if(!dirMd[filePath[j]]) {
                        dirMd[filePath[j]] = {};
                    }
                    if(!dirHtml[filePath[j]]) {
                        dirHtml[filePath[j]] = { "baseUrl": "#" };
                    }

                    // If there is link and dir with same name
                    if (typeof dirHtml[filePath[j]] != "object") {
                        dirHtml[filePath[j]] = { "baseUrl": dirHtml[filePath[j]] };
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

                dirHtml[topic] = program.docsurl + output;
            }
        }
    }
    topics = parseTopics(folderTreeTopics, 0, "");
    parseFiles(folderTreeMd, topics);

}


exports.run = run;
