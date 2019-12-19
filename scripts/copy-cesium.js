const fse = require('fs-extra');
const cesiumPath = 'node_modules/cesium/Build/Cesium';
const targetPath = './libraries/Cesium';

function copyCesiumToLibs (fromPath) {
    fse.copy(fromPath, targetPath, err => {
        if (err) return console.error(err);
        console.log('Copied Cesium under libraries from ' + fromPath);
    });
}

fse.pathExists('./' + cesiumPath, function (err, exists) {
    if (err) return console.error(err);
    if (exists) {
        // the "normal" case
        copyCesiumToLibs('./' + cesiumPath);
    } else {
        // try dev-mode path
        copyCesiumToLibs('./node_modules/oskari-frontend/' + cesiumPath);
    }
});
