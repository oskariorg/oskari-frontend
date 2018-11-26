const path = require('path');
const { existsSync } = require('fs');

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

    const overwrittenCssPath = path.join(this.context, 'css/overwritten.css');
    if (existsSync(overwrittenCssPath)) {
        output += `import '${overwrittenCssPath}';\n`;
    }
    
    return output;
}