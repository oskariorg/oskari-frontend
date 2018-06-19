
module.exports = function(source) {

    const appSetup = JSON.parse(source);
    const bundles = []

    appSetup.startupSequence.forEach(bundle => {
        const imports = bundle.metadata['Import-Bundle'];
        Object.keys(imports).forEach(key => {
            bundles.push(imports[key].bundlePath + key + '/bundle.js');
        });
    });

    return bundles.map(b => `import '${b}'`).join('\n');
}