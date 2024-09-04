const fs = require('fs-extra');
const path = require('path');

const srcFileCesiumHack = path.join(__dirname, 'cesium', 'buildModuleUrl.js.modified');
// installed as ../oskari-frontend
let pathToCesium = path.join(__dirname, '..', '..', 'node_modules', '@cesium');
if (!fs.existsSync(pathToCesium)) {
    // installed in non-dev-mode
    pathToCesium = path.join(__dirname, '..', '..', '..', 'node_modules', '@cesium');
}
// try again with non-dev-mode
if (!fs.existsSync(pathToCesium)) {
    // something went terribly wrong
} else {
    // Overwrites node_modules/@cesium/engine/Source/Core/buildModuleUrl.js
    // with a modified on to fix issues with Webpack 4.x
    const destFileCesiumHack = path.join(pathToCesium, 'engine', 'Source', 'Core', 'buildModuleUrl.js');
    fs.copyFile(srcFileCesiumHack, destFileCesiumHack);
}
