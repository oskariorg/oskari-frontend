
module.exports = function(source) {

    dependencies = [];

    const Oskari = {
        clazz: {
            define: function(id, constructor, methods, metadata) {
                if (metadata.source && metadata.source.scripts) {
                    metadata.source.scripts.forEach(script => {
                        dependencies.push(script.src);
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

    return source + '\n' + dependencies.map(d => `import '${d}'`).join('\n');
}