const path = require('path');
const fs = require('fs');

module.exports = function (source) {
    const callback = this.async();

    // get the bundles resources/locale path
    const resourcesPath = path.resolve(
        path.join(
            path.dirname(this.resourcePath), 'resources/locale'));
    // this.context ~= path.dirname(this.resourcePath)

    const localePromises = [];

    try {
        // accessSync throw an error if there's a problem
        fs.accessSync(resourcesPath, fs.constants.R_OK);
        // dir exists and we can read the locales
        fs.readdirSync(resourcesPath).forEach(file => {
            const fileWithPath = path.join(resourcesPath, file);
            localePromises.push(
                new Promise((resolve, reject) => {
                    this.resolve(this.context, fileWithPath, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                })
            );
        });
    } catch (err) {
        console.error('No Read and Write access to locale files');
    }

    Promise.all(localePromises)
        .then((localePaths) => {
            localePaths.forEach(p => this.addDependency(p));
            callback(null, source);
        })
        .catch((err) => {
            callback(err);
        });
};
