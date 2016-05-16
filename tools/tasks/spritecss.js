/*
 * grunt-generate-sprite
 */
var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
var gm = require('gm');
var async = require('async');
// constants
var HOVERPOSTFIX = "_hover";
var COMBINEDPOSTFIX = "_combined";

function validateOptions(grunt, options) {
        // Catch if required fields are not provided.
        if ( !options.iconDirectoryPath ) {
            grunt.fail.warn('No path provided for CSS Sprite to scan.');
        }
        if ( !options.resultImageName ) {
            grunt.fail.warn('You must specify a filename for CSS Sprite sprite output.');
        }
        if ( !options.resultCSSName ) {
            grunt.fail.warn('You must specify a filename for CSS Sprite css output.');
        }
        if ( !options.spritePathInCSS ) {
            grunt.fail.warn('You must specify a path to the sprite from CSS.');
        }
}
function validateIconDirectories(grunt, cfg) {
    //iconDirectoryPath = normalizePath(iconDirectoryPath);
    var stats;
    var appOverrideDirStats;
    try {
        var stats = fs.statSync(cfg.baseIconsDir);
    } catch(e) {
        grunt.fail.warn('Default icons directory ('  + cfg.baseIconsDir + ') was NOT found. Please provide a proper baseIconsDir!');
        return;
    }
    if(stats && !stats.isDirectory()) {
        grunt.fail.warn('Default icons directory ('  + cfg.baseIconsDir + ') is NOT a directory. Please provide a proper baseIconsDir!');
    }
    // check application overrides
    if(!cfg.appIconsDir) {
        // no override
        return;
    }
    try {
        appOverrideDirStats = fs.statSync(cfg.appIconsDir);
    } catch(e) {
        // doesn't exist -> act as not given 
        grunt.log.warn('Application icons override directory ('  + cfg.appIconsDir + ') was NOT found. Please provide a proper appIconsDir!');
        delete cfg.appIconsDir;
        return;
    }
    if(!appOverrideDirStats) {
        // no app overrides
        return;
    }
    if(appOverrideDirStats && !appOverrideDirStats.isDirectory()) {
        grunt.fail.warn('Application icons override directory ('  + cfg.appIconsDir + ') is NOT a directory. Please provide a proper appIconsDir!');
        return;
    }
}
function removeOldIconsPng(path) {
    try {
        var iconDirStats = fs.statSync(path);
        var iconExists = iconDirStats.isFile();
        if (iconExists) {
            fs.unlinkSync(path);
        }
    } catch(ignored) { }
}

function normalizePath(path) {
    // add missing / to directory path
    if (path && path.lastIndexOf("/") !== path.length-1) {
        return path + "/";
    }
    return path;
}

function copyPngIcons(src, dest) {
    try {
        fs.copySync(src, dest, {
            // overwrite any existing file
            clobber : true,
            // dereference symlinks
            dereference : true,
            // only include png files
            filter : function(file) {
                return file.endsWith('.png');
            }
        }); 
    } catch(e) {
        console.log('Error copying icon files from ' + src);
    }
}

function getIconArrays(files) {
    var hoverIcons = [],
        icons = [],
        current,
        next;
    for(var i = 0, j = 1, ilen = files.length; i < ilen; i++, j++) {
        current = files[i];
        next = files[j];
        if (next && (next.indexOf(HOVERPOSTFIX) > 0)) {
            // separate images with _hover images to separate array
            hoverIcons.push(next);
            // remove path so that only the filename remains
            next = next.substring(next.lastIndexOf('/') + 1);
            // add the future generated combined icon
            icons.push(next.replace(HOVERPOSTFIX, COMBINEDPOSTFIX));
        } else if (current.indexOf(HOVERPOSTFIX) > 0) {
            // skip _hover images as these have already been handled
        } else {
            icons.push(current);
        }
    }
    return {
        icons : icons,
        hover : hoverIcons
    };
}

function getConfig(opts) {
    var defaultOptions = {
        baseIconsDir : '../resources/icons',
        targetDir : '../resources',
        result : {
            css : "icons.css",
            img : "icons.png"
        }
    };
    //defaultOptions.appIconsDir = defaultOptions.targetFolder + '/icons'; 
    var options = _.cloneDeep(defaultOptions);
    _.assignIn(options, opts);
    // force temp dir
    options.tmpDir = "tmp_sprite_dir_remove_it_" + Math.random().toString(36).substring(7);
    var relative = path.relative(path.dirname(options.result.css), path.dirname(options.result.img));
    if(relative.length) {
        // force / separator instead of os specific
        relative = relative.split(path.sep).join('/');
        // add final / since we will append the filename
        relative = relative + '/';
    }
    options.result.pathToSprite = relative + path.basename(options.result.img);
    return options;
}

module.exports = function(grunt) {

    grunt.registerMultiTask('sprite', 'Generate CSS Sprite', function() {
        var done = this.async();
        var starttime = (new Date()).getTime();
        var cfg = getConfig(this.data.options);

        // Run some sync stuff.
        grunt.log.writeln('Generating CSS Sprite...');
        //validateOptions(grunt, options);

        // remove sprite if exists and then create temporary directory where generated sprite stuff goes
        //removeOldIconsPng(resultImageName);
        validateIconDirectories(grunt, cfg);
        fs.mkdirSync(cfg.tmpDir, "755");
        try {
            // default icons
            copyPngIcons(cfg.baseIconsDir, cfg.tmpDir);
            // application overrides if configured
            if(cfg.appIconsDir) {
                copyPngIcons(cfg.appIconsDir, cfg.tmpDir);
            }
        } catch(e) {
            cleanUp(cfg.tmpDir);
            grunt.fail.warn('Couldn\'t copy icons to temp dir "Oskari/tools/' + cfg.tmpDir + '"!');
        }
        // read all the icons that we have for the sprite, the are now in the tmpDir
        var files = fs.readdirSync(cfg.tmpDir);
        // icons include any non-hover icons and generated hover-combined filenames
        var filtered = getIconArrays(files);
        /*
        { icons : icons,
          hover : hoverIcons }
        */
        // create an image with normal + hover icon as "combined icon" for any icon having hover support
        createHoverCombinedIcons(cfg.tmpDir, filtered.hover, function() {
            // attach image sizes for any icons that will be included in sprite (non-hover and combined)
            detectImageSizes(cfg.tmpDir, filtered.icons, function(icons) {
                // write the actual sprite and css
                writeSpriteImage(cfg, icons, function() {
                    // remove tmp dir
                    cleanUp(cfg.tmpDir);
                })
            });
        });


        function createHoverCombinedIcons(tmpDirectory, files, next) {
            var combined,
                current,
                original,
                outputDirectory = tmpDirectory + "/";
            async.map(files, function (current, callback) {
                var icon = current.substring(current.lastIndexOf('/') + 1),
                    original = outputDirectory + current.replace(HOVERPOSTFIX, ""),
                    combined = outputDirectory + icon.replace(HOVERPOSTFIX, COMBINEDPOSTFIX);

                // appends another.jpg to img.png from top-to-bottom
                gm(original).append(outputDirectory + current, false).write(combined, callback);
            }, function (err, results) {
                if (!err && results) {
                    next();
                } else {
                    console.log("createHoverCombinedIcons didn't work. Error", err);
                }
            });
        }

        function detectImageSizes(tmpDirectory, icons, next) {
            async.map(icons, function (icon, callback) {
                // get sizes for all icons
                gm(tmpDirectory + "/" + icon).size(callback);
            }, function (err, results) {
                // results are objects with sizes of images
                if (!err) {
                    for(var i = 0, ilen = results.length; i < ilen; i++) {
                        results[i].file = icons[i];
                    }
                    next(results);
                } else {
                    console.log("detectImageSizes didn't work.");
                    next();
                }
            });
        }

        function writeSpriteImage(config, iconImages, next) {
            var tmpDirectory = config.tmpDir;
            var spritePath = path.normalize([config.targetDir, config.result.img].join('/'));
            var cssFile = path.normalize([config.targetDir, config.result.css].join('/'));
            var relativeUrlToSprite = config.result.pathToSprite;
            if(!iconImages) {
                next();
                return;
            }
            var sprite = null,
                offsetX = 0;

            for(var i = 0, ilen = iconImages.length; i < ilen; i++) {
                var currentIcon = tmpDirectory + '/' + iconImages[i].file;

                // calculate offset for sprite
                iconImages[i].offsetX = offsetX;
                // Note negative on purpose
                offsetX -= iconImages[i].width;
                if (currentIcon.indexOf(COMBINEDPOSTFIX) > -1) {
                    // the icon has a hover state
                    // Note negative on purpose
                    iconImages[i].offsetY = -(iconImages[i].height/2);
                } else {
                    iconImages[i].offsetY = 0;
                }

                if (sprite === null) {
                    sprite = gm(currentIcon);
                } else {
                    // appends another.jpg to img.png from left-to-right
                    sprite.append(currentIcon, true);
                }
            }

            // write sprite if directory has been created or exists
            sprite.write(spritePath, function (err) {
                if (!err) {
                    writeSpriteCSS(iconImages, cssFile, relativeUrlToSprite, next);
                } else {
                    console.log("writeSpriteImage didn't work. Error", err);
                }
            });
        }

        function writeSpriteCSS(iconImages, cssPath, relativeUrlToSprite, next) {
            var file,
                className,
                css = "";

            for(var i = 0, ilen = iconImages.length; i < ilen; i++) {
                icon = iconImages[i],
                file = icon.file,
                className = file.substring(file.lastIndexOf("/") + 1, file.lastIndexOf(".")).replace(COMBINEDPOSTFIX, "");


                if (file.indexOf(COMBINEDPOSTFIX) === -1) {
                    // generate CSS style declarations
                    css += generateCSS(relativeUrlToSprite, className, icon.width, icon.height, icon.offsetX, 0);
                } else {
                    // generate CSS style declarations
                    css += generateCSS(relativeUrlToSprite, className, icon.width, icon.height/2, icon.offsetX, 0);

                    // add hover style
                    css += generateCSS(relativeUrlToSprite, className + ":hover", icon.width, icon.height/2, icon.offsetX, icon.offsetY);
                }
            }

            // write CSS
            fs.writeFile(cssPath, css, function(err) {
                if (!err) {
                    next();
                } else {
                    console.log("writeSpriteCSS didn't work. ", err);
                    console.log("You probably need to manually remove the temporary directory ", tmpDirectory);
                }
            });
        }

        function generateCSS(relativeUrlToSprite, className, width, height, offsetX, offsetY) {
            var spriteBackgroundImage = "    background-image: url('" + relativeUrlToSprite + "') !important;\n",
                backgroundRepeat = "    background-repeat: no-repeat !important;\n",
                css = "";

            css += "." + className + " {\n";
            css += "    width: " + width + "px;\n";
            css += "    height: " + height + "px;\n";
            css += spriteBackgroundImage;
            css += backgroundRepeat;
            css += "    background-position: " + offsetX + "px " + offsetY + "px !important;\n";
            css += "}\n\n";

            return css;
        }

        function cleanUp(tmpDirectory) {
            fs.remove(tmpDirectory, function(err, result) {
                if (!err) {
                    var endtime = (new Date()).getTime();
                    grunt.log.writeln('CSS Sprite completed in ' + ((endtime - starttime) / 1000) + ' seconds');
                    done();
                } else {
                    console.log("cleanUp didn't work. ", err);
                    console.log("You probably need to manually remove the temporary directory ", tmpDirectory);
                }
            });
        }

    });

};
