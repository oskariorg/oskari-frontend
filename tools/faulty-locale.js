const path = require('path');
const fs = require('fs');
const glob = require('glob');

/** -------- CONSTANTS -------- */
const LANGS = ['fi', 'en', 'sv'];
const KEYS_FROM = 'en'; // lang || 'all'
const CSV = ';';

/** -------- PARAMS -------- */
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

// returns diff object with flatten keys {foo.bar: [o1, o2]}
const diff = (o1, o2) => {
    // create flat objects
    const flat1 = flattenKeys(o1);
    const flat2 = flattenKeys(o2);
    
    // merge keys and remove duplicates
    const keys = [...new Set([...Object.keys(flat1) ,...Object.keys(flat2)])];

    return keys.reduce((diff, key) => {
      if (flat1[key] === flat2[key]) return diff;
      return {
        ...diff,
        [key]: [flat1[key], flat2[key]]
      };
    }, {});
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
    let response = {
        missing: allKeys.filter(key => !allKeys.includes(key)),
        additional: allKeys.filter(key => !allKeys.includes(key)),
        empty: allKeys.filter(key => typeof loc[key] === 'string' && !loc[key].trim() && !skipEmptyValues.includes(key)),
        equal: allKeys.filter(key => locales.some(l => l !== lang && loc[key] && flatLocs[l][key] === loc[key]) && !locales.every(l => flatLocs[l][key] === loc[key]))
    };
    if (lang === KEYS_FROM) {
        response = { empty: response.empty };
    }
    const count = Object.values(response).reduce((sum, arr) => sum += arr.length, 0);
    const status = count === 0 ? 'OK' : `${count} faulty keys`;
    console.log(`${lang} -> ${status}`);
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

/** Tool for gathering faulty localizations for bundle
* Usage:
* node faulty-locale.js myplaces3
* node faulty-locale.js myplaces3 text
* node faulty-locale.js myplaces3 csv fr is ru
*/

const [ig, nore, bundle, output, ...langs] = process.argv;
if (!bundle) {
    throw new Error('Must give bundle name as parameter');
}
const locales = [...LANGS, ...langs];
console.log(`Prosessing "${bundle}" localization for: ${locales.join()}. Gather keys from: ${KEYS_FROM}`);
const localeFilePaths = glob.sync('/bundles/**/' + bundle +'/resources/locale/@(' + locales.join('|') + ').js', {root: path.join(__dirname, '..')});

if (!localeFilePaths.length) {
    throw new Error('No files found, check bundle name');
}

const flatLocs = {};
localeFilePaths.forEach(filePath => {
    const Oskari = {
        registerLocalization: ({ lang, value }) => {
            if (!lang) {
                throw new Error('Localization file has no "lang"!');
            }
            console.log("Found and registered localization for: " + lang);
            flatLocs[lang] = flattenKeys(value);
        }
    };
    const source = fs.readFileSync(filePath, 'utf8');
    eval(source);
});

const allKeys = KEYS_FROM === 'all' ? getAllKeys(flatLocs) : Object.keys(flatLocs[KEYS_FROM]);
if (!allKeys.length) {
    throw new Error('No keys found for: ' + KEYS_FROM);
}
console.log(`Gathered ${allKeys.length} keys from: ${KEYS_FROM}`);

const results = {};
locales.forEach(lang => {
    const loc = getFaultyLocales(flatLocs, allKeys, lang);
    if (lang === KEYS_FROM) {
        results[lang] = { empty: loc.empty };
    } else {
        results[lang] = loc;
    }
});

const outputPath = path.join(__dirname, bundle);

if (output === 'text') {
    const text=[
        `"${bundle}" localization for: ${locales.join()}. Base locale for keys: ${KEYS_FROM}`,
        '---------------------------------------------------------------------------------'
    ];
    gatherResultKeys(results).forEach(key => {
        text.push(`${key}:`);
        locales.forEach(lang => text.push(`${lang}: "${flatLocs[lang][key]}"`));
        text.push('');
    });
    fs.writeFileSync(outputPath + '.txt', text.join('\n'));
} else if (output === 'csv') {
    const csv = [['path', ...locales]];
    gatherResultKeys(results).forEach(key => {
        const values = locales.map(lang => flatLocs[lang][key]);
        csv.push([key, ...values]);
    });
    fs.writeFileSync(outputPath + '.csv', csv.map(line => line.join(CSV)).join('\n'));
} else {
    const json = { bundle, locales, base: KEYS_FROM, ...results };
    fs.writeFileSync(outputPath + '.json', JSON.stringify(json, null, 2));
}
    
console.log('Extracted file succesfully');
