/*
 * grunt-generate-sprite
 */

module.exports = function(grunt) {

    grunt.registerMultiTask('sprite', 'Generate CSS Sprite', function() {
        var done = this.async();
        var starttime = (new Date()).getTime();

        var options = this.data.options;

        // Run some sync stuff.
        grunt.log.writeln('Generating CSS Sprite...');

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

        var fs = require('fs'),
            gm = require('gm'),
            async = require('async'),
            HOVERPOSTFIX = "_hover",
            COMBINEDPOSTFIX = "_combined",
            tmpDirectory = Math.random().toString(36).substring(7);

        var iconDirectoryPath = options.iconDirectoryPath,
            resultImageName = options.resultImageName,
            resultCSSName = options.resultCSSName,
            spritePathInCSS = options.spritePathInCSS;

        // add missing / to icon directory path
        if (iconDirectoryPath.lastIndexOf("/") !== iconDirectoryPath.length-1) {
            iconDirectoryPath += "/";
        }

        // verify the sprite path in css includes the sprite name
        if (spritePathInCSS.indexOf(resultImageName) === -1) {
            // add missing / to sprite path
            if (spritePathInCSS.lastIndexOf("/") !== spritePathInCSS.length-1) {
                spritePathInCSS += "/";
            }
            spritePathInCSS += resultImageName.substring(resultImageName.lastIndexOf("/")+1);
        }

        function readIconDirectory() {
            var files = fs.readdir(iconDirectoryPath, function (err, files) {
                if (!err) {
                    filterHoverIcons(filterResultIcon(files));
                } else {
                    console.log('Directory could not be read.', err);
                    process.exit(0);
                }
            });
        }

        function filterResultIcon(files) {
            var result = [];
            // assume there is a "/" in the resultImageName
            var icons = resultImageName.substring(resultImageName.lastIndexOf('/') + 1);

            for(var i = 0, ilen = files.length; i < ilen; i++) {
                current = files[i];
                if (current !== icons) {
                    result.push(current);
                }
            }
            
            return result;
        }

        function filterHoverIcons(files) {
            var hoverIcons = [],
                icons = [],
                current,
                next,
                outputDirectory = tmpDirectory + "/";
            for(var i = 0, j = 1, ilen = files.length; i < ilen; i++, j++) {
                current = files[i];
                next = files[j];
                if (next && (next.indexOf(HOVERPOSTFIX) > 0)) {
                    // separate images with _hover images to separate array
                    hoverIcons.push(next);
                    // add the future generated combined icon
                    icons.push(outputDirectory + next.replace(HOVERPOSTFIX, COMBINEDPOSTFIX));
                } else if (current.indexOf(HOVERPOSTFIX) > 0) {
                    // skip _hover images as these have already been handled
                } else {
                    icons.push(iconDirectoryPath + current);
                }
            }
            generateHoverIcons(hoverIcons, function() {
                readIconData(icons, function() {
                    cleanUp(hoverIcons);
                });
            });
        }

        function generateHoverIcons(files, next) {
            var combined,
                current,
                original,
                outputDirectory = tmpDirectory + "/";
            async.map(files, function (icon, callback) {
                var current = iconDirectoryPath + icon,
                    original = current.replace(HOVERPOSTFIX, ""),
                    combined = outputDirectory + icon.replace(HOVERPOSTFIX, COMBINEDPOSTFIX);

                // appends another.jpg to img.png from top-to-bottom
                gm(original).append(current, false).write(combined, callback);
            }, function (err, results) {
                if (!err && results) {
                    next();
                } else {
                    console.log("generateHoverIcons didn't work. Error", err);
                }
            });
        }

        function readIconData(icons, next) {
            async.map(icons, function (icon, callback) {
                gm(icon).size(callback);
            }, function (err, results) {
                if (!err) {
                    for(var i = 0, ilen = results.length; i < ilen; i++) {
                        results[i].file = icons[i];
                    }
                    writeSpriteImage(results, next);
                } else {
                    console.log("readIconData didn't work.");
                    next();
                }
            });
        }

        function writeSpriteImage(iconImages, next) {
            var sprite = null,
                offsetX = 0;

            for(var i = 0, ilen = iconImages.length; i < ilen; i++) {
                var currentIcon = iconImages[i].file;

                // calculate offset for sprite
                iconImages[i].offsetX = offsetX;
                // Note negative on purpose
                offsetX -= iconImages[i].width;
                if (currentIcon.indexOf(iconDirectoryPath) == 0) {
                    iconImages[i].offsetY = 0;
                } else {
                    // the icon has a hover state
                    // Note negative on purpose
                    iconImages[i].offsetY = -(iconImages[i].height/2);
                }

                if (sprite === null) {
                    sprite = gm(currentIcon);
                } else {
                    // appends another.jpg to img.png from left-to-right
                    sprite.append(currentIcon, true);
                }
            }

            // create parent folder as there the parent folder should not exist
            fs.mkdir(resultImageName.substring(0, resultImageName.lastIndexOf("/")), 0755, function (err) {
                if (!err || (err && err.code === 'EEXIST')){
                    // write sprite if directory has been created or exists
                    sprite.write(resultImageName, function (err) {
                        if (!err) {
                            writeSpriteCSS(iconImages, next);
                        } else {
                            console.log("writeSpriteImage didn't work. Error", err);
                        }
                    });
                } else {
                    console.log("writeSpriteImage create folder didn't work. Error", err);
                }
            });
        }

        function writeSpriteCSS(iconImages, next) {
            var file,
                className,
                css = "";

            for(var i = 0, ilen = iconImages.length; i < ilen; i++) {
                icon = iconImages[i],
                file = icon.file,
                className = file.substring(file.lastIndexOf("/") + 1, file.lastIndexOf(".")).replace(COMBINEDPOSTFIX, "");


                if (file.indexOf(iconDirectoryPath) != 0) {
                    // generate CSS style declarations
                    css += generateCSS(className, icon.width, icon.height/2, icon.offsetX, 0);

                    // add hover style
                    css += generateCSS(className + ":hover", icon.width, icon.height/2, icon.offsetX, icon.offsetY);
                } else {
                    // generate CSS style declarations
                    css += generateCSS(className, icon.width, icon.height, icon.offsetX, 0);
                }
            }

            // write CSS
            fs.writeFile(resultCSSName, css, function(err) {
                if (!err) {
                    next();
                } else {
                    console.log("writeSpriteCSS didn't work. ", err);
                    console.log("You probably need to manually remove the temporary directory ", tmpDirectory);
                }
            });
        }

        function generateCSS(className, width, height, offsetX, offsetY) {
            var spriteBackgroundImage = "    background-image: url('" + spritePathInCSS + "') !important;\n",
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

        function cleanUp(files) {
            async.map(files, function (icon, callback) {
                var outputDirectory = tmpDirectory + "/",
                    combined = outputDirectory + icon.replace(HOVERPOSTFIX, COMBINEDPOSTFIX);

                fs.unlink(combined, callback);
            }, function (err, results) {
                if (!err && results) {
                    fs.rmdir(tmpDirectory, function(err, result) {
                        if (!err) {
                            var endtime = (new Date()).getTime();
                            grunt.log.writeln('CSS Sprite completed in ' + ((endtime - starttime) / 1000) + ' seconds');
                            done();
                        } else {
                            console.log("cleanUp didn't work. ", err);
                            console.log("You probably need to manually remove the temporary directory ", tmpDirectory);
                        }
                    });
                } else {
                    console.log("generateHoverIcons didn't work. Error", err);
                }
            });
        }

        // remove sprite if exists and then create temporary directory where generated sprite stuff goes
        fs.unlink(resultImageName, function (err, result) {
            fs.mkdir(tmpDirectory, 0755, readIconDirectory);
        });
    });

};
