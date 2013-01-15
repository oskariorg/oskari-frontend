var program = require("commander"),
    fs = require("fs"),
    path = require("path"),
    marked = require("marked");


/*
 * Parsing command line arguments using commander
 */
program
    .usage("[options]")
    .option("--apiurl [location]", "Place for the API documentation")
    .parse(process.argv);


/*
 * Run command of the script
 */
var run = function() {
    if(!program.apiurl) {
        console.log("Give parameter: --apiurl <location>");
        console.log("Exiting..");
        process.exit(0);
    }
    
    
}

exports.run = run;