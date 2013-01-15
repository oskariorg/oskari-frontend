var program = require("commander"),
    fs = require("fs"),
    path = require("path"),
    wrench = require('wrench'),
    util = require('util'),
    //marked = require("marked"),
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
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  highlight: function(code, lang) {
    if (lang === 'js') {
      return highlighter.javascript(code);
    }
    return code;
  }
});
*/


/*
 * Parsing command line arguments using commander
 */

program
    .usage("[options]")
    .option("--apiurl [location]", "Place for the API documentation")
    .parse(process.argv);


var parseFile = function(file) {
    markx({
        input: file, //can be either a filepath or a source string
        template: path.join(layoutDirectory, layoutFile), //can either be filepath or source string
        highlight: true, //parse code snippets for syntax highlighters, default: true
        data: {} //data that gets passed into template
    }, function(err, html) {
        if(err) { 
            console.log(err);
            console.log("Exiting..");
            process.exit(-1);
        }

        fs.writeFile(path.join(destinationDirectory, "test.html"), html, "utf-8", function (err) {
            if(err) { 
                console.log(err);
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
        if(res) {
            for (var i=0,len=res.length; i<len; i++) {
                console.log(res[i]);
                fs.stat(path.join(markdownDirectory, res[i]), function(err, stat) {
                    if (stat && stat.isDirectory()) { // folder
                        console.log("folder", res[i]);
                    }
                    else { // file
                        console.log("file", res[i]);
                    }
                });
            }
            //console.log(res);
            var file = res[0].split("\\");
            if(typeof file !== 'string') {
                console.log("last", file.slice(-1)[0].split(".")[0]);
            }
            //console.log(file);
        }
    });
}


exports.run = run;