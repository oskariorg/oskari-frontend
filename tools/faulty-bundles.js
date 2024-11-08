const path = require('path');
const fs = require('fs');
const glob = require('glob');

/** -------- CONSTANTS -------- */
const LANGS = ['fi', 'en', 'sv'];
const DEFAULT = 'en';
const CSV = ';';

/** -------- PARAMS -------- */
const skipEqual = false;
const skipEmpty = false;
const skipEmptyValues = ['desc'];

/** -------- HELPERS -------- */
const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

// returns object with flatten keys {foo: {bar: 1 }} => {foo.bar: 1}
const flattenKeys = (obj) => {
    if (!isObject(obj)) return {}; // or throw error

    const getEntries = (o, prefix = '') => 
      Object.entries(o).flatMap(([k, v]) => 
        isObject(v) ? getEntries(v, `${prefix}${k}.`) : [ [`${prefix}${k}`, v] ]
    );
    return Object.fromEntries(getEntries(obj));
};

const getAllKeys = (obj = {}) => {
    const keys = [];
    Object.values(obj)
        .forEach(langObj => Object.keys(langObj)
            .forEach(key => keys.includes(key) || keys.push(key)));
    return keys;
};

const getFaultyLocales = (flatLocs, allKeys, lang) => {
    const loc = flatLocs[lang] || {};
    const response = {
        missing: allKeys.filter(key => !allKeys.includes(key)),
        additional: allKeys.filter(key => !allKeys.includes(key)),
        empty: allKeys.filter(key => typeof loc[key] === 'string' && !loc[key].trim() && !skipEmptyValues.includes(key)),
        equal: allKeys.filter(key => locales.some(l => l !== lang && loc[key] && flatLocs[l][key] === loc[key]) && !locales.every(l => flatLocs[l][key] === loc[key]))
    };
    if (skipEqual) {
        delete response.equal;
    }
    if (skipEmpty) {
        delete response.empty;
    }
    return response;
};

const gatherResultKeys = (results) => {
    const allPaths = new Set();
    Object.values(results).forEach(langResult => {
        const paths = Object.values(langResult).flat();
        paths.forEach(path => allPaths.add(path));
    });
    return Array.from(allPaths);
};

/** Tool for gathering faulty localizations for all bundles
* Usage:
* node faulty-bundles.js
* node faulty-bundles.js csv all fr is ru
*/

const [ig, nore, output, base = DEFAULT, ...langs] = process.argv;
const locales = [...LANGS, ...langs];
console.log(`Prosessing localization for: ${locales.join()}. Gather keys from: ${base}`);
const localeFilePaths = glob.sync('/bundles/**/resources/locale/@(' + locales.join('|') + ').js', {root: path.join(__dirname, '..')});

if (!localeFilePaths.length) {
    throw new Error('No files found, check bundle name');
}
console.log(`Found ${localeFilePaths.length} localization files`);

const flat = {};
localeFilePaths.forEach(filePath => {
    const Oskari = {
        registerLocalization: ({ lang, value, key }) => {
            if (!flat[key]) {
                flat[key] = {};
            }          
            flat[key][lang] = flattenKeys(value);
        }
    };
    const source = fs.readFileSync(filePath, 'utf8');
    eval(source);
});

const results = {};
Object.keys(flat).forEach(bundle => {
    const values = flat[bundle];
    const allKeys = base === 'all' ? getAllKeys(values) : Object.keys(values[base]);
    Object.keys(values).forEach(lang => {
        const response = getFaultyLocales(values, allKeys, lang);
        const count = Object.values(response).reduce((sum, arr) => sum += arr.length, 0);
        if (count === 0) return;
        if (!results[bundle]) {
            results[bundle] = {};
        }
        results[bundle][lang] = output === 'csv' ? response : count;
    });
});
const outputPath = path.join(__dirname, 'summary');
if (output === 'csv') {
    const csv = [];
    Object.keys(results).forEach(bundle => {
        csv.push([bundle, ...locales]);
        gatherResultKeys(results[bundle]).forEach(key => {
            const values = locales.map(lang => flat[bundle][lang][key]);
            csv.push([key, ...values]);
        });
        csv.push([]); // empty line
    });
    fs.writeFileSync(outputPath + '.csv', csv.map(line => line.join(CSV)).join('\n'));
} else {
    const json = { locales, base: base, ...results };
    fs.writeFileSync(outputPath + '.json', JSON.stringify(json, null, 2));
}
console.log('Extracted file succesfully');
