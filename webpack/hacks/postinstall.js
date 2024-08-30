const fs = require('fs-extra');
const path = require('path');

const srcFileCesiumHack = path.join(__dirname, 'cesium', 'buildModuleUrl.js.modified');
if (!fs.existsSync(path.join(__dirname, srcFileCesiumHack))) {
    // possibly running on oskari-frontend-contrib
    return;
}
const destFileCesiumHack = path.join(__dirname, '..', '..', 'node_modules', '@cesium', 'engine', 'Source', 'Core', 'buildModuleUrl.js');
// Overwrites node_modules/@cesium/engine/Source/Core/buildModuleUrl.js
// with a modified on to fix issues with Webpack 4.x
fs.copyFile(srcFileCesiumHack, destFileCesiumHack);
