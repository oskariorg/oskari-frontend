const fs = require('fs');
const path = require('path');

const fileRex = /^(.{2})\.js$/;

function isLocaleFile(filePath) {
    if (path.basename(path.dirname(filePath)) !== 'locale') {
        return false;
    }
    return fileRex.test(path.basename(filePath));
}

class LocalizationPlugin {
    constructor() {
        this.startTime = Date.now();
        this.prevTimestamps = new Map();
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('LocalizationPlugin', (compilation, callback) => {

            const localeFiles = Array.from(compilation.fileDependencies)
                .filter(isLocaleFile);
            const changedLanguages = new Set();
            localeFiles
                .filter(path => {
                    return (this.prevTimestamps.get(path) || this.startTime) < (compilation.fileTimestamps.get(path) || Infinity);
                })
                .forEach(path => {
                    const lang = this.langFromPath(path);
                    if (lang) {
                        changedLanguages.add(lang);
                    }
                });

            this.prevTimestamps = compilation.fileTimestamps;

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
            localeFiles
                .filter(path => changedLanguages.has(this.langFromPath(path)))
                .forEach(path => {
                    const source = fs.readFileSync(path, 'utf8');
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

    langFromPath(filePath) {
        const match = path.basename(filePath).match(fileRex);
        return match ? match[1] : null;
    }
}

module.exports = LocalizationPlugin;