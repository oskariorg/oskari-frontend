var path = require("path"),
    fs = require("fs");

/**
 * Create a directory structure
 */
var createDirStructure = function(root, subdirs) {
    var stat = null;

    try {
        stat = fs.statSync(root);
    } catch(err) { }

    if(!stat || !stat.isDirectory()) {
        fs.mkdirSync(root);
    }

    subdirs.forEach(function(f) {
        if(!fs.existsSync(path.join(root, f)))
            fs.mkdirSync(path.join(root, f));
    });
};

/**
 * Copy all files of sourceDir to destinationDir
 */
var copyFiles = function(sourceDir, destinationDir) {
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

exports.createDirStructure = createDirStructure;
exports.copyFiles = copyFiles;