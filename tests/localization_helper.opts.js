function printWarning(msg) {
    "use strict";
    if (window.console) {
        console.warn(msg);
    }
}

/**
 * Flattens an object structure to a list for easier analysis
 * @method getFlattenedStructure
 * @private
 * @param {Object} struct localization structure
 * @return {Object[]} returns flattened version of the structure so that keys are concatenated with dots. 
 *      The objects have properties {key : <concatenated key>, value: <value>}
 */
function getFlattenedStructure(struct) {
    "use strict";
    var flattenedKeys = [],
        key,
        subStruct,
        keys,
        i;
    for (key in struct) {
        if (struct.hasOwnProperty(key)) {
            subStruct = struct[key];
            if (typeof subStruct !== 'object') {
                flattenedKeys.push(
                    {
                        key : key,
                        value : subStruct
                    }
                );
            } else {
                keys = getFlattenedStructure(subStruct);
                for (i = 0; i < keys.length; i += 1) {
                    flattenedKeys.push({
                        key : key + '.' + keys[i].key,
                        value : keys[i].value
                    });
                }
            }
        }
    }
    return flattenedKeys;
}

/**
 * Compares two localization structures and checks if they have similar key-structure.
 * Prints out warnings to browser window if keys have similar values between languages
 * @method hasSameStructure
 * @private
 * @param {Object} first localization structure for first language
 * @param {Object} second localization structure for second language
 * @param {String} langFirst language code first structure
 * @param {String} langSecond language code second structure
 * @return {Boolean} returns true if everything was ok
 */
function hasSameStructure(first, second, langFirst, langSecond) {
    "use strict";
    var flattenedKeys1 = getFlattenedStructure(first),
        flattenedKeys2 = getFlattenedStructure(second),
        isDifferent = flattenedKeys1.length !== flattenedKeys2.length,
        key1,
        key2,
        found,
        i,
        j,
        value1;
    if (isDifferent) {
        printWarning('Localization lengths not matching\r\n' +
            langFirst + '::' + flattenedKeys1.length + '\r\n' +
            langSecond + '::' + flattenedKeys2.length + '\r\n');
        return false;
    }
    // even if length matches -> could have different keys
    for (i = 0; i < flattenedKeys1.length; i += 1) {
        key1 = flattenedKeys1[i];
        found = false;
        for (j = 0; j < flattenedKeys2.length; j += 1) {
            key2 = flattenedKeys2[j];
            if (key1.key === key2.key) {
                found = true;
                value1 = key1.value;
                // check that values are not identical if they are over 2 characters
                if (value1.length > 2 && value1.indexOf(key2.value) !== -1) {
                    // same value for both languages
                    printWarning('Same value for ' + key1.key + '::\r\n' +
                        langFirst + '=' + key1.value + '\r\n' +
                        langSecond + '=' + key2.value + '\r\n');
                }
                break;
            }
        }
        if (!found) {
            printWarning('Key not found on all localizations:' + key1.key);
            return false;
        }
    }
    return true;
}

/**
 * Tests localization files for a bundle. Uses the first language in parameter languageList as 
 * reference and checks that other languages have the same structure == same keys.
 * @method matchLocalization
 * @param {String} localizationBundleKey the localization key, usually the bundles name using the localization
 * @param {String[]} languageList list of language codes to test f.ex. ['fi', 'sv', 'en']
 * @return {Boolean/String} returns true if everything was ok and error message if not
 */
function matchLocalization(localizationBundleKey, languageList) {
    "use strict";
    var defLang = languageList[0],
        defStruct,
        i,
        lang,
        struct;
    Oskari.setLang(defLang);
    defStruct = Oskari.getLocalization(localizationBundleKey);
    // match other localizations against first
    for (i = 1; i < languageList.length; i += 1) {
        lang = languageList[i];
        Oskari.setLang(lang);
        struct = Oskari.getLocalization(localizationBundleKey);
        if (!hasSameStructure(defStruct, struct, defLang, lang)) {
            return 'Localizations dont match:' + defLang + "/" + lang;
        }
    }
    return true;
}