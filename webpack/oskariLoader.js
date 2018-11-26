module.exports = function (source) {
    const callback = this.async();
    const dependencies = [];
    let localePromises = [];

    /* eslint-disable-next-line */
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
                    localePromises = metadata.source.locales.map(l => {
                        return new Promise((resolve, reject) => {
                            this.resolve(this.context, l.src, (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        });
                    });
                }
            }
        },
        bundle_manager: {
            installBundleClass: function (id, path) { }
        }
    };
    /* eslint-disable-next-line */
    eval(source);

    const output = source + '\n' + dependencies.map(d => {
        if (d.expose) {
            return `import 'expose-loader?${d.expose}!${d.src}'`;
        }
        return `import '${d.src}'`;
    }).join('\n');

    Promise.all(localePromises)
        .then((localePaths) => {
            localePaths.forEach(p => this.addDependency(p));
            callback(null, output);
        })
        .catch((err) => {
            callback(err);
        });
};
