
function matchLocalization(localizationBundleKey, languageList) {
    printDebug('Testing localizations for bundle:' + localizationBundleKey);
    var defLang = languageList[0];
    Oskari.setLang(defLang);
    var defStruct = Oskari.getLocalization(localizationBundleKey);
    // match other localizations against first
    for(var i = 1; i < languageList.length; ++i) {
        var lang = languageList[i];
        Oskari.setLang(lang);
        var struct = Oskari.getLocalization(localizationBundleKey);
        if(!hasSameStructure(defStruct, struct, defLang, lang)) {
            return 'Localizations dont match:' + defLang + "/" + lang;
        }
    }
    return true;
}

function hasSameStructure(first, second, langFirst, langSecond) {
    var flattenedKeys1 = getFlattenedStructureKeys(first);
    var flattenedKeys2 = getFlattenedStructureKeys(second);
    var isDifferent = flattenedKeys1.length != flattenedKeys2.length;
    if(isDifferent) {
        return false;
    }
    // even if length matches -> could have different keys
    for(var i = 0; i < flattenedKeys1.length; ++i) {
        var key1 = flattenedKeys1[i];
        var found = false;
        for(var j = 0; j < flattenedKeys2.length; ++j) {
            var key2 = flattenedKeys2[j]; 
            if(key1.key == key2.key) {
                found = true;
                if(key1.value.indexOf(key2.value) != -1) {
                    // same value for both languages
                    printDebug('Same value for ' + key1.key + '::\r\n' +
                        langFirst + '=' + key1.value + '\r\n' +
                        langSecond + '=' + key2.value + '\r\n');
                }
                break;
            }
        }
        if(!found) {
            printDebug('Key not found on all localizations:' + key1.key);
            return false;
        }
    }
    return true;
} 

function getFlattenedStructureKeys(struct) {
    var flattenedKeys = [];
    for(var key in struct) {
        var subStruct = struct[key];
        if(typeof subStruct !== 'object') {
            flattenedKeys.push({
                key : key,
                value : subStruct});
        }
        else {
            var keys = getFlattenedStructureKeys(subStruct);
            for(var i = 0; i < keys.length; ++i) {
                flattenedKeys.push({
                    key : key + '.' + keys[i].key,
                    value : keys[i].value
                });
            }

        }
    }
    return flattenedKeys;
}