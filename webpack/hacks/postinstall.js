const fs = require('fs-extra');
const path = require('path');

const srcFileCesiumHack = path.join(__dirname, 'cesium', 'buildModuleUrl.js.modified');
// installed as ../oskari-frontend
let pathToNodeModules = path.join(__dirname, '..', '..', 'node_modules');
if (!fs.existsSync(pathToNodeModules)) {
    // installed in non-dev-mode
    pathToNodeModules = path.join(__dirname, '..', '..', '..', 'node_modules');
}
// try again with non-dev-mode
if (!fs.existsSync(pathToNodeModules)) {
    // something went terribly wrong
} else {
    // Overwrites node_modules/@cesium/engine/Source/Core/buildModuleUrl.js
    // with a modified on to fix issues with Webpack 4.x
    const destFileCesiumHack = path.join(pathToNodeModules, '@cesium', 'engine', 'Source', 'Core', 'buildModuleUrl.js');
    fs.copyFile(srcFileCesiumHack, destFileCesiumHack);
}
