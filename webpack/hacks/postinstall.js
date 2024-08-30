const fs = require('fs-extra');
const path = require('path');

const srcFileCesiumHack = path.join(__dirname, 'cesium', 'buildModuleUrl.js.modified');
if (fs.existsSync(path.join(__dirname, srcFileCesiumHack))) {
    const destFileCesiumHack = path.join(__dirname, '..', '..', 'node_modules', '@cesium', 'engine', 'Source', 'Core', 'buildModuleUrl.js');
    // Overwrites node_modules/@cesium/engine/Source/Core/buildModuleUrl.js
    // with a modified on to fix issues with Webpack 4.x
    fs.copyFile(srcFileCesiumHack, destFileCesiumHack);
} else {
    // possibly running on oskari-frontend-contrib or cesium is not available
}
