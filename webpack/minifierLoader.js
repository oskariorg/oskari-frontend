
module.exports = function(source) {

    const appSetup = JSON.parse(source);
    let output = '';

    appSetup.startupSequence.forEach(bundle => {
        const imports = bundle.metadata['Import-Bundle'];
        const name = bundle.bundlename;
        Object.keys(imports).forEach(key => {
            const bundlePath  = imports[key].bundlePath + key + '/bundle.js'
            if (!bundle.lazy) {
                output += `import 'oskari-loader!${bundlePath}';\n`
            } else {
                let loadFunc = `function() {return import(/* webpackChunkName: "chunk_${name}" */'oskari-loader!${bundlePath}');}`
                output += `Oskari.bundle_manager.registerDynamic('${name}', ${loadFunc});\n`;
            }
        });
    });
    
    return output;
}