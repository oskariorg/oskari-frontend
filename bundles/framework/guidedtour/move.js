// utility script for moving localizations into bundles

const fs = require('fs');
const glob = require('glob');

const localePath = 'resources/locale/';

const omitStart = /^\s*Oskari[.]registerLocalization[(]([\s\S]*)/;
const omitEnd = /([\s\S]*)[)][;]*\s*$/;

// edit these
const mappings = {
    'page2': {path: '/../search/'},
    'page3': {path: '/../layerselector2/'},
    'page4': {path: '/../layerselection2/'},
    'page5': {path: '/../personaldata/'},
    'page6': {path: '/../publisher2/'},
    'page7': {path: '/../../mapping/toolbar/'},
    'page8': {path: '/../../mapping/mapmodule/', multi: 'help1'},
    'page9': {path: '/../../mapping/mapmodule/', multi: 'help2'}
};
const targetProperty = 'guidedTour';

var localizations = glob.sync(__dirname + '/' + localePath + '**.js').map(path => {return {path, lang: path.match(/([^/]*)[.]js$/)[1]}});

localizations.forEach(loc => {

    var fileContent = fs.readFileSync(loc.path, 'utf-8');

    var json = omitAndParse(fileContent);

    Object.keys(mappings).forEach(key => {
        var targetPath = __dirname + mappings[key].path + localePath + loc.lang + '.js';
        var englishPath = __dirname + mappings[key].path + localePath + 'en.js';
        var targetJson;
        if(json.value[key]) {
            try {
                let target = fs.readFileSync(targetPath, 'utf-8');
                targetJson = omitAndParse(target);
            } catch (e) {
                console.log('could not open', targetPath, '. Creating file.');
                let target = fs.readFileSync(englishPath, 'utf-8');
                targetJson = omitAndParse(target);
                targetJson.value = {};
                targetJson.lang = loc.lang;
            }
            if(mappings[key].multi){ // multiple help screens per module
                if(!targetJson.value[targetProperty]){
                    targetJson.value[targetProperty] = {};
                }
                targetJson.value[targetProperty][mappings[key].multi] = json.value[key];
            } else {
                targetJson.value[targetProperty] = json.value[key];
            }
            writeLocFile(targetPath, targetJson);
        }
        delete json.value[key];
    })

    writeLocFile(loc.path, json);
});

function omitAndParse(fileText) {
    return JSON.parse(fileText.match(omitStart)[1].match(omitEnd)[1]);
}

function writeLocFile(path, json){
    fs.writeFileSync(path, 'Oskari.registerLocalization(\n' + JSON.stringify(json, null, 4) + ');', 'utf-8');
}