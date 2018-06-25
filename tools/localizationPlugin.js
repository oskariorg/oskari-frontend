const fs = require('fs');

const localeFile = /\/locale\/.{2}\.js$/;

class LocalizationPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync('LocalizationPlugin', (compilation, callback) => {

            const localeFiles = Array.from(compilation.fileDependencies).filter(path => localeFile.test(path));

            const parsed = new Map();
            const Oskari = {
                registerLocalization: (loc) => {
                    const lang = loc.lang;
                    if (!lang) {
                        throw new Error('Localization file has no "lang"!');
                    }
                    let agg = [];
                    if (parsed.has(lang)) {
                        agg = parsed.get(lang);
                    } else {
                        parsed.set(lang, agg);
                    }
                    agg.push(loc);
                }
            }
            localeFiles.forEach(filePath => {
                const source = fs.readFileSync(filePath, 'utf8');
                eval(source);
            });

            
            for (let entry of parsed.entries()) {
                let fileContent = entry[1].map(def => `Oskari.registerLocalization(${JSON.stringify(def)});`).join('\n');
                compilation.assets[`oskari_lang_${entry[0]}.js`] = {
                    source() {
                        return fileContent;
                    },
                    size() {
                        return fileContent.length;
                    }
                };
            }

            callback();
        });
    }
}

module.exports = LocalizationPlugin;