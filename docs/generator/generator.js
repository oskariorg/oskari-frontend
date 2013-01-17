var program = require("commander"),
    fs = require("fs"),
    path = require("path"),
    wrench = require('wrench'),
    util = require('util'),
    markx = require('markx'),
    fsutils = require("./fsutils.js");


/*
 * Configurations
 */ 

var markdownDirectory = "md";
var layoutDirectory = "layout";
var layoutFile = "index.html";
var cssDirectory = "css";
var imagesDirectory = "images";
var destinationDirectory = "release";


/*
 * Parsing command line arguments using commander
 */

program
    .usage("[options]")
    .option("--apiurl [location]", "Place for the API documentation")
    .parse(process.argv);


var parseFile = function(file) {
    var cwd = process.cwd();
    var output = file.substr(0, file.lastIndexOf(".")) + ".html";
    console.log("parse:", path.join(cwd, markdownDirectory, file));
    console.log("output:", output);
    markx({
        input: path.join(markdownDirectory, file), //can be either a filepath or a source string
        template: path.join(layoutDirectory, layoutFile), //can either be filepath or source string
        highlight: true, //parse code snippets for syntax highlighters, default: true
        data: {} //data that gets passed into template
    }, function(err, html) {
        if(err) { 
            console.log(err);
            console.log("Exiting..");
            process.exit(-1);
        }
        /// TODO: change file extension .md => .html file.
        console.log("write:", output);
        fs.writeFile(path.join(destinationDirectory, output), html, "utf-8", function (err2) {
            if(err2) { 
                console.log(err2);
                console.log("Exiting..");
                process.exit(-1);
            }
        });

    });

}

/*
 * Run command of the script
 */

var run = function() {
    if(!program.apiurl) {
        console.log("Give parameter: --apiurl <location>");
        console.log("Exiting..");
        process.exit(0);
    }
    var cwd = process.cwd();

    wrench.rmdirSyncRecursive(path.join(cwd, destinationDirectory));
    fsutils.createDirStructure(destinationDirectory, [cssDirectory, imagesDirectory]);
    fsutils.copyFiles(path.join(layoutDirectory, cssDirectory), path.join(destinationDirectory, cssDirectory));
    fsutils.copyFiles(path.join(cwd, imagesDirectory), path.join(destinationDirectory, imagesDirectory));

    wrench.readdirRecursive(path.join(cwd, markdownDirectory), function(err, res) {
        if(err) { 
            console.log(err);
            console.log("Exiting..");
            process.exit(-1);
        }
        if(res && res.length > 0) {
            var tmp = null;
            var filePath = null;
            var folder = null;
            var file = null;
            for (var i = 0; i < res.length; i++) {
                try {
                    stat = fs.statSync(path.join(markdownDirectory, res[i]));
                } catch(err) { }

                if (stat && !stat.isDirectory()) { // file
                    console.log("file:", res[i]);
                    tmp = res[i].split("\\");
                    filePath = tmp.slice(0,-1);
                    console.log(filePath);

                    folder = "";
                    for (var j = 0; j < filePath.length; j++) {
                        folder = path.join(folder, filePath[j]);
                        console.log("folder", folder);
                        fsutils.createDirStructure(destinationDirectory, [folder]);
                    }

                    file = tmp.slice(-1)[0].split(".")[0];
                    console.log(file);
                    parseFile(res[i]);
                }
                console.log("--------");
            }
        }
    });
}


exports.run = run;