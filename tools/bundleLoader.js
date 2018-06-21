
module.exports = function(source) {

    dependencies = [];

    const Oskari = {
        clazz: {
            define: function(id, constructor, methods, metadata) {
                if (metadata.source && metadata.source.scripts) {
                    metadata.source.scripts.forEach(script => {
                        dependencies.push(script);
                    });
                }
                // TODO: load locales
            }
        },
        bundle_manager: {
            installBundleClass: function(id, path) {}
        }
    }
    eval(source);

    return source + '\n' + dependencies.map(d => {
        if (d.expose) {
            return `import 'expose-loader?${d.expose}!${d.src}'`;
        }
        return `import '${d.src}'`;
    }).join('\n');
}