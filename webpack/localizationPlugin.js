const fs = require('fs');
const path = require('path');
const merge = require('merge');

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
            const allKeys = new Set();
            const Oskari = {
                registerLocalization: (loc) => {
                    const lang = loc.lang;
                    if (!lang) {
                        throw new Error('Localization file has no "lang"!');
                    }
                    let agg = new Map();
                    if (parsed.has(lang)) {
                        agg = parsed.get(lang);
                    } else {
                        parsed.set(lang, agg);
                    }
                    agg.set(loc.key, loc);
                    allKeys.add(loc.key);
                }
            }
            localeFiles
                .filter(path => {
                    const lang = this.langFromPath(path);
                    return lang === 'en' || changedLanguages.has(lang); // Always process English as it might be needed as fallback
                })
                .forEach(path => {
                    const source = fs.readFileSync(path, 'utf8');
                    eval(source);
                });


            const english = parsed.get('en') || new Map();
            for (let entry of parsed.entries()) {
                const lang = entry[0];
                const contents = entry[1];
                
                const keyContents = Array.from(allKeys)
                    .filter(key => english.has(key) || contents.has(key))
                    .map(key => {
                        const fallback = english.get(key);
                        const locForKey = contents.get(key);
                        if (locForKey && fallback) {
                            return merge.recursive(true, fallback, locForKey);
                        }
                        return locForKey || {lang: lang, key: key, value: fallback.value};
                    });

                let fileContent = keyContents.map(content => `Oskari.registerLocalization(${JSON.stringify(content)});`).join('\n');
                compilation.assets[`oskari_lang_${lang}.js`] = {
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