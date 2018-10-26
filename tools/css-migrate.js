// Reads all bundle.js files under packages/, replaces CSS file paths with SCSS files paths, if matching path found. Removes CSS file in this case.

var path = require('path');
var fs = require('fs');
var glob = require('glob');

var bundleFilePaths = glob.sync('/packages/**/bundle.js', {root: path.join(__dirname, '..')});

const isCSS = /\.css$/;


bundleFilePaths.forEach(bundlePath => {
    let fileContent = fs.readFileSync(bundlePath, 'utf8');
    let modifed = false;
    const Oskari = {
        clazz: {
            define: (id, constructor, methods, metadata) => {
                if (!metadata.source) {
                    return;
                }
    
                if (metadata.source.scripts) {
                    metadata.source.scripts.forEach(script => {
    
                        if (!isCSS.test(script.src)) {
                            return;
                        }
    
                        let scssPath = script.src
                                .replace(/\/css\//, '/scss/')
                                .replace(/\.css$/, '.scss');
    
                        const scssAbsolutePath = path.join(path.dirname(bundlePath), scssPath);
                        if (!fs.existsSync(scssAbsolutePath)) {
                            return;
                        }
                        fileContent = fileContent.replace(script.src, scssPath);
                        modifed = true;

                        const cssAbsolutePath = path.join(path.dirname(bundlePath), script.src);
                        if (fs.existsSync(cssAbsolutePath)) {
                            fs.unlinkSync(cssAbsolutePath);
                        }
                    });
                }
            }
        },
        bundle_manager: {
            installBundleClass: function (id, path) { }
        }
    }
    
    eval(fileContent);
    if (modifed) {
        fs.writeFileSync(bundlePath, fileContent, 'utf8');
    }
});