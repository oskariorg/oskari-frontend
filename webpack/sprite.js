const fs = require('fs-extra');
const { lstatSync, readdirSync, existsSync } = require('fs');
const path = require('path');
const _ = require('lodash');
const gm = require('gm');
const async = require('async');
// constants
const HOVERPOSTFIX = '_hover';
const COMBINEDPOSTFIX = '_combined';

function failWarn (msg) {
    console.error(msg);
    process.exit(1);
}

function validateIconDirectories (cfg) {
    var stats;
    var appOverrideDirStats;
    try {
        stats = fs.statSync(cfg.baseIconsDir);
    } catch (e) {
        failWarn('Default icons directory (' + cfg.baseIconsDir + ') was NOT found. Please provide a proper baseIconsDir!');
        return;
    }
    if (stats && !stats.isDirectory()) {
        failWarn('Default icons directory (' + cfg.baseIconsDir + ') is NOT a directory. Please provide a proper baseIconsDir!');
    }
    // check application overrides
    if (!cfg.appIconsDir) {
        // no override
        return;
    }
    try {
        appOverrideDirStats = fs.statSync(cfg.appIconsDir);
    } catch (e) {
        // doesn't exist -> act as not given
        failWarn('Application icons override directory (' + cfg.appIconsDir + ') was NOT found. Please provide a proper appIconsDir!');
    }
    if (!appOverrideDirStats) {
        // no app overrides
        return;
    }
    if (appOverrideDirStats && !appOverrideDirStats.isDirectory()) {
        failWarn('Application icons override directory (' + cfg.appIconsDir + ') is NOT a directory. Please provide a proper appIconsDir!');
    }
}

function copyPngIcons (src, dest) {
    try {
        fs.copySync(src, dest, {
            // overwrite any existing file
            clobber: true,
            // dereference symlinks
            dereference: true,
            // only include png files
            filter: function (file) {
                return file.endsWith('.png');
            }
        });
    } catch (e) {
        failWarn('Error copying icon files from ' + src);
    }
}

function getIconArrays (files) {
    var hoverIcons = [];
    var icons = [];
    var current;
    var next;

    for (var i = 0, j = 1, ilen = files.length; i < ilen; i++, j++) {
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
        icons: icons,
        hover: hoverIcons
    };
}

function getConfig (opts) {
    var defaultOptions = {
        baseIconsDir: path.resolve(__dirname, '../resources/icons'),
        targetDir: path.resolve(__dirname, '../resources'),
        result: {
            css: 'icons.css',
            img: 'icons.png'
        }
    };

    var options = _.cloneDeep(defaultOptions);
    _.assignIn(options, opts);
    // force temp dir
    options.tmpDir = 'tmp_sprite_dir_remove_it_' + Math.random().toString(36).substring(7);
    var relative = path.relative(path.dirname(options.result.css), path.dirname(options.result.img));
    if (relative.length) {
        // force / separator instead of os specific
        relative = relative.split(path.sep).join('/');
        // add final / since we will append the filename
        relative = relative + '/';
    }
    options.result.pathToSprite = relative + path.basename(options.result.img);
    return options;
}

function runSprite (opts, cb) {
    var starttime = (new Date()).getTime();
    var cfg = getConfig(opts);

    // Run some sync stuff.
    console.log('Generating CSS Sprite...');

    // remove sprite if exists and then create temporary directory where generated sprite stuff goes
    validateIconDirectories(cfg);
    fs.mkdirSync(cfg.tmpDir, '755');
    try {
        // default icons
        copyPngIcons(cfg.baseIconsDir, cfg.tmpDir);
        // application overrides if configured
        if (cfg.appIconsDir) {
            copyPngIcons(cfg.appIconsDir, cfg.tmpDir);
        }
    } catch (e) {
        cleanUp(cfg.tmpDir);
        failWarn('Couldn\'t copy icons to temp dir "Oskari/tools/' + cfg.tmpDir + '"!');
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
    createHoverCombinedIcons(cfg.tmpDir, filtered.hover, function () {
        // attach image sizes for any icons that will be included in sprite (non-hover and combined)
        detectImageSizes(cfg.tmpDir, filtered.icons, function (icons) {
            // write the actual sprite and css
            writeSpriteImage(cfg, icons, function () {
                // remove tmp dir
                cleanUp(cfg.tmpDir);
            });
        });
    });

    function createHoverCombinedIcons (tmpDirectory, files, next) {
        var outputDirectory = tmpDirectory + '/';
        async.map(files, function (current, callback) {
            var icon = current.substring(current.lastIndexOf('/') + 1);
            var original = outputDirectory + current.replace(HOVERPOSTFIX, '');
            var combined = outputDirectory + icon.replace(HOVERPOSTFIX, COMBINEDPOSTFIX);

            // appends another.jpg to img.png from top-to-bottom
            gm(original).append(outputDirectory + current, false).write(combined, callback);
        }, function (err, results) {
            if (!err && results) {
                next();
            } else {
                failWarn("createHoverCombinedIcons didn't work. Error:" + err);
            }
        });
    }

    function detectImageSizes (tmpDirectory, icons, next) {
        async.map(icons, function (icon, callback) {
            // get sizes for all icons
            gm(tmpDirectory + '/' + icon).size(callback);
        }, function (err, results) {
            // results are objects with sizes of images
            if (!err) {
                for (var i = 0, ilen = results.length; i < ilen; i++) {
                    results[i].file = icons[i];
                }
                next(results);
            } else {
                console.log("detectImageSizes didn't work.");
                next();
            }
        });
    }

    function writeSpriteImage (config, iconImages, next) {
        var tmpDirectory = config.tmpDir;
        var spritePath = path.normalize([config.targetDir, config.result.img].join('/'));
        var cssFile = path.normalize([config.targetDir, config.result.css].join('/'));
        var relativeUrlToSprite = config.result.pathToSprite;
        if (!iconImages) {
            next();
            return;
        }
        var sprite = null;
        var offsetX = 0;

        for (var i = 0, ilen = iconImages.length; i < ilen; i++) {
            var currentIcon = tmpDirectory + '/' + iconImages[i].file;

            // calculate offset for sprite
            iconImages[i].offsetX = offsetX;
            // Note negative on purpose
            offsetX -= iconImages[i].width;
            if (currentIcon.indexOf(COMBINEDPOSTFIX) > -1) {
                // the icon has a hover state
                // Note negative on purpose
                iconImages[i].offsetY = -(iconImages[i].height / 2);
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
                failWarn("writeSpriteImage didn't work. Error:" + err);
            }
        });
    }

    function writeSpriteCSS (iconImages, cssPath, relativeUrlToSprite, next) {
        var icon;
        var file;
        var className;
        var css = '';

        for (var i = 0, ilen = iconImages.length; i < ilen; i++) {
            icon = iconImages[i];
            file = icon.file;
            className = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.')).replace(COMBINEDPOSTFIX, '');

            if (file.indexOf(COMBINEDPOSTFIX) === -1) {
                // generate CSS style declarations
                css += generateCSS(relativeUrlToSprite, className, icon.width, icon.height, icon.offsetX, 0);
            } else {
                // generate CSS style declarations
                css += generateCSS(relativeUrlToSprite, className, icon.width, icon.height / 2, icon.offsetX, 0);

                // add hover style
                css += generateCSS(relativeUrlToSprite, className + ':hover', icon.width, icon.height / 2, icon.offsetX, icon.offsetY);
            }
        }

        // write CSS
        fs.writeFile(cssPath, css, function (err) {
            if (!err) {
                next();
            } else {
                console.log("writeSpriteCSS didn't work. ", err);
                failWarn('You probably need to manually remove the temporary directory.');
            }
        });
    }

    function generateCSS (relativeUrlToSprite, className, width, height, offsetX, offsetY) {
        var spriteBackgroundImage = "    background-image: url('" + relativeUrlToSprite + "') !important;\n";
        var backgroundRepeat = '    background-repeat: no-repeat !important;\n';
        var css = '';

        css += '.' + className + ' {\n';
        css += '    width: ' + width + 'px;\n';
        css += '    height: ' + height + 'px;\n';
        css += spriteBackgroundImage;
        css += backgroundRepeat;
        css += '    background-position: ' + offsetX + 'px ' + offsetY + 'px !important;\n';
        css += '}\n\n';

        return css;
    }

    function cleanUp (tmpDirectory) {
        fs.remove(tmpDirectory, function (err, result) {
            if (!err) {
                var endtime = (new Date()).getTime();
                console.log('CSS Sprite completed in ' + ((endtime - starttime) / 1000) + ' seconds');
                cb();
            } else {
                console.log("cleanUp didn't work. ", err);
                failWarn('You probably need to manually remove the temporary directory ' + tmpDirectory);
            }
        });
    }
}

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

const param = process.argv[2];

if (!param) {
    failWarn('Version & appsetup directory must be given as param, eg. 1.48:applications/paikkatietoikkuna.fi');
}

const [version, appsetupPath] = param.split(':');

const targets = getDirectories(path.resolve(appsetupPath)).map((dirPath) => {
    const appName = dirPath.split(path.sep).pop();
    return {
        appIconsDir: dirPath + path.sep + 'icons',
        targetDir: path.resolve(`./dist/${version}/${appName}`)
    };
}).filter((target) => {
    return existsSync(target.appIconsDir) && isDirectory(target.appIconsDir);
});

if (targets.length === 0) {
    failWarn('No icons found for app. Make sure your icons are in directory "icons" under appsetup.');
}

targets.forEach((target) => {
    if (!existsSync(target.targetDir) || !isDirectory(target.targetDir)) {
        failWarn(`Target directory "${target.targetDir}" missing. Have you run the app build step?`);
    };
});

function processNext (targets) {
    if (targets.length === 0) {
        return;
    }
    runSprite(targets[0], () => {
        processNext(targets.slice(1));
    });
}

processNext(targets);
