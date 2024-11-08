const fs = require('fs');
const merge = require('merge');

/** -------- CONSTANTS -------- */
const LANGS = ['fi', 'en', 'sv', 'is', 'fr', 'ru'];
const CSV = ';';
const KVP = ':';

/** -------- HELPERS -------- */
const count = {};
LANGS.forEach(lang => count[lang] = 0);
let total = 0;

const unifyPath = (path) => {
    const end = path.endsWith('/') ? path.length - 1 : path.length;
    const start = path.startsWith('/') ? 1 : 0;
    return path.substring(start, end);
};

const getJSON = (fileExt, content) => {
    return fileExt === 'csv' ? getJsonFromCSV(content) : getJsonFromText(content);
};

const injectJson = (base, parts, value = '') => {
    const trimmed = value.trim();
    if (!trimmed) return;

    let temp = base;
    parts.map(p => p.trim()).forEach((part, i) => {
        if (i === parts.length - 1) {
            temp[part] = trimmed;
            total++;
            return;
        }
        if (!temp[part]) {
            temp[part] = {};
        }
        temp = temp[part];
    });
};

const getJsonFromCSV = (content) => {
    const [heading, ...lines] = content.split('\n');
    const [ignore, ...langs] = heading.split(CSV);
    const json = {};
    langs.forEach(lang => json[lang] = {});

    lines.filter(line => line.trim()).forEach(line => {
        const [key, ...values] = line.split(CSV);
        langs.forEach((lang, i) => {
            const value = values[i];
            const parts = key.split('.');
            injectJson(json[lang], parts, value);
        });
    });
    return json;
};

const getJsonFromText = (content) => {
    const lines = content.split('\n');
    const json = {};
    let parts = [];
    lines.forEach(line => {
        if (!line.trim()) return;
        const [raw, value] = line.replaceAll('"','').split(KVP);
        const key = raw.trim();
        if(!LANGS.includes(key)) {
            parts = key.split('.');
            return;
        }
        const lang = key;
        if (!json[lang]) {
            json[lang] = {};
        }
        injectJson(json[lang], parts, value);
    });
    return json;
};

const getBaseLocalization = filePath => {
    let locale = {};
    const Oskari = {
        registerLocalization: (loc) => {
            if (!loc.lang) {
                throw new Error('Localization file has no "lang"!');
            }
            console.log("Found localization for: " + loc.lang);
            locale = loc;
        }
    };
    const source = fs.readFileSync(filePath, 'utf8');
    eval(source);
    return locale;
};

/** Tool for injecting bundle localizations from file
* Usage:
* node inject-bundle-locale.js locales.csv ../bundles/framework/myplaces3/
*/

const [ig, nore, file, path, lang] = process.argv;

if (!file) {
    throw new Error('Must give file name as parameter');
}
const fileExt = file.split('.').pop();
if (fileExt === 'json' && !lang) {
    throw new Error('Must give language as parameter with json file');
}
if (!path) {
    throw new Error('Must give bundle path as parameter');
}
const oskariBasePath = __dirname.replace('/tools', '');
const bundlePath = unifyPath(path.substring(2)); // removes '..'

const content = fs.readFileSync(`${__dirname}/${file}`, 'utf8');
const values = fileExt === 'json' ? { [lang]: content } : getJSON(fileExt, content);
const languages = Object.keys(values).filter(lang => LANGS.includes(lang));

let bundle = 'bundle';

languages.forEach(function(lang) {
    const source = `${oskariBasePath}/${bundlePath}/resources/locale/${lang}.js`;
    const locale = getBaseLocalization(source);
    bundle = locale.key || bundle;

    const value = values[lang] || {};
    const json = merge.recursive(true, locale, { value });

    const string = JSON.stringify(json, null, 4);
    const content = `Oskari.registerLocalization(${string});\n`;
    fs.writeFileSync(source, content, 'utf8');
});

console.log(`Injected ${total} localization strings to "${bundle}" locales. Use git to inspect changes.`);
