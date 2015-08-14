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
            tmpDirectory = "tmp_sprite_dir_remove_it_" + Math.random().toString(36).substring(7);

        var iconDirectoryPath = options.iconDirectoryPath,
            resultImageName = options.resultImageName,
            resultCSSName = options.resultCSSName,
            spritePathInCSS = options.spritePathInCSS;

        function normalizePath(path) {
            // add missing / to directory path
            if (path.lastIndexOf("/") !== path.length-1) {
                return path + "/";
            } else {
                return path;
            }
        }

        iconDirectoryPath = normalizePath(iconDirectoryPath);

        // verify the sprite path in css includes the sprite name
        if (spritePathInCSS.indexOf(resultImageName) === -1) {
            spritePathInCSS = normalizePath(spritePathInCSS);
            spritePathInCSS += resultImageName.substring(resultImageName.lastIndexOf("/")+1);
        }

        function checkIconDirectoriesExists(callback) {
            if (options.defaultIconDirectoryPath) {
                fs.exists(options.defaultIconDirectoryPath, function (defaultExists) {
                    if (defaultExists) {
                        fs.exists(iconDirectoryPath, function (iconExists) {
                            if (iconExists) {
                                // both exist, we'll handle that later
                                callback();
                            } else {
                                iconDirectoryPath = options.defaultIconDirectoryPath;
                                options.defaultIconDirectoryPath = null;
                                callback();
                            }
                        });
                    } else {
                        console.log('Default icons directory was NOT found. Please provide a proper defaultIconDirectoryPath!');
                        process.exit(0);                                
                    }
                });
            } else {
                fs.exists(iconDirectoryPath, function (iconExists) {
                    if (iconExists) {
                        callback();
                    } else {
                        console.log(path,' was NOT found. Please provide a proper defaultIconDirectoryPath or application icons folder!');
                        process.exit(0);
                    }
                });
            }
        }

        function createTemporaryDirectory() {
            fs.mkdir(tmpDirectory, 0755, readIconDirectory);
        }

        function removeDuplicateAndResultIcons(iconsArray) {
            // assumes icons are arranged in importance order, first being the most important
            var i,
                ilen,
                j,
                jlen,
                array,
                icon,
                icons = {},
                result,
                results = [];

            // filter resultImage
            // assume there is a "/" in the resultImageName
            icons[resultImageName.substring(resultImageName.lastIndexOf('/') + 1)] = true;

            // travers arrays and add to hashmap for fast comparison
            // non duplicate values are added to the results array
            for (i = 0, ilen = iconsArray.length; i < ilen; i++) {
                array = iconsArray[i];
                result = [];
                for (j = 0, jlen = array.length; j < jlen; j++) {
                    icon = array[j];
                    if (!icons[icon]) {
                        icons[icon] = true;
                        result.push(icon);
                    }
                }
                results.push(result);
            }
            return results;
        }

        function addIconPaths(paths, iconsArray) {
            var i,
                ilen = paths.length,
                iconslen = iconsArray.length,
                j,
                jlen,
                path,
                array,
                results = [];

            if (ilen !== iconslen) {
                console.log('addIconPaths was provided with different sized arguments', ilen, iconslen);
                console.log("You probably need to manually remove the temporary directory ", tmpDirectory);
                process.exit(0);
            }

            for (i = 0, ilen = paths.length; i < ilen; i++) {
                path = paths[i];
                array = iconsArray[i];
                for (j = 0, jlen = array.length; j < jlen; j++) {
                    results.push(path + array[j]);
                }
            }

            return results;
        }

        function readIconDirectory() {
            var paths = [iconDirectoryPath];
            if (options.defaultIconDirectoryPath) {
                paths.push(options.defaultIconDirectoryPath);
            }
            async.map(paths, fs.readdir, function (err, files) {
                if (!err) {
                    filterHoverIcons(addIconPaths(paths, removeDuplicateAndResultIcons(files)));
                } else {
                    console.log('Directory could not be read.', err);
                    process.exit(0);
                }
            });
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
                    // remove path so that only the filename remains
                    next = next.substring(next.lastIndexOf('/') + 1);
                    // add the future generated combined icon
                    icons.push(outputDirectory + next.replace(HOVERPOSTFIX, COMBINEDPOSTFIX));
                } else if (current.indexOf(HOVERPOSTFIX) > 0) {
                    // skip _hover images as these have already been handled
                } else {
                    icons.push(current);
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
            async.map(files, function (current, callback) {
                var icon = current.substring(current.lastIndexOf('/') + 1),
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
                if (currentIcon.indexOf(tmpDirectory) == 0) {
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


                if (file.indexOf(tmpDirectory) != 0) {
                    // generate CSS style declarations
                    css += generateCSS(className, icon.width, icon.height, icon.offsetX, 0);
                } else {
                    // generate CSS style declarations
                    css += generateCSS(className, icon.width, icon.height/2, icon.offsetX, 0);

                    // add hover style
                    css += generateCSS(className + ":hover", icon.width, icon.height/2, icon.offsetX, icon.offsetY);
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
            async.map(files, function (current, callback) {
                var icon = current.substring(current.lastIndexOf('/') + 1),
                    outputDirectory = tmpDirectory + "/",
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
                    console.log("cleanUp didn't work. Error", err);
                    console.log("You probably need to manually remove the temporary directory ", tmpDirectory);
                }
            });
        }

        // remove sprite if exists and then create temporary directory where generated sprite stuff goes
        fs.unlink(resultImageName, function (err, result) {
            checkIconDirectoriesExists(function () {
                fs.mkdir(tmpDirectory, 0755, createTemporaryDirectory);
            });
        });
    });

};
