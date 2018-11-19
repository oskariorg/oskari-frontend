
module.exports = function(source) {

    const appSetup = JSON.parse(source);
    const bundlePaths = [];
    const dynamicBundles = [];

    appSetup.startupSequence.forEach(bundle => {
        const imports = bundle.metadata['Import-Bundle'];
        const dynamicPaths = [];
        let target = bundlePaths;
        if (bundle.lazy) {
            target = dynamicPaths;
            dynamicBundles.push({
                name: bundle.bundlename,
                paths: dynamicPaths
            });
        }
        Object.keys(imports).forEach(key => {
            target.push(imports[key].bundlePath + key + '/bundle.js');
        });
    });

    let output = bundlePaths.map(bundlePath => `import 'oskaribundle-loader!${bundlePath}';`).join('\n') + '\n';
    output += dynamicBundles.map(b => {
        const dependencies = b.paths.map(p => `    import(/* webpackChunkName: "chunk_${b.name}" */'oskaribundle-loader!${p}')`);
        return `Oskari.bundle_manager.registerDynamic('${b.name}', function() { return [\n${dependencies.join(',\n')}\n];});`
    }).join('\n');
    
    return output;
}