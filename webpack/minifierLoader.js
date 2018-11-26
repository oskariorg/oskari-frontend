
module.exports = function(source) {

    const appSetup = JSON.parse(source);
    let output = '';

    appSetup.startupSequence.forEach(bundle => {
        const imports = bundle.metadata['Import-Bundle'];
        const name = bundle.bundlename;
        Object.keys(imports).forEach(key => {
            const bundlePath  = imports[key].bundlePath + key + '/bundle.js'
            if (bundle.lazy) {
                output += `import 'oskari-lazy-loader?${name}!${bundlePath}';\n`;
            } else {
                output += `import 'oskari-loader!${bundlePath}';\n`;
            }
        });
    });
    
    return output;
}