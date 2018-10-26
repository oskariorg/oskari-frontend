const path = require('path');

module.exports = function (source) {

    dependencies = [];

    const Oskari = {
        clazz: {
            define: (id, constructor, methods, metadata) => {
                if (!metadata.source) {
                    return;
                }

                if (metadata.source.scripts) {
                    metadata.source.scripts.forEach(script => {
                        dependencies.push(script);
                    });
                }

                if (metadata.source.locales) {
                    metadata.source.locales.forEach(l => {
                        this.addDependency(path.join(this.context, l.src));
                    })
                }
            }
        },
        bundle_manager: {
            installBundleClass: function (id, path) { }
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