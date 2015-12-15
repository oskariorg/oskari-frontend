// FIXME require('path') and change path separators to path.sep
module.exports = function (grunt) {

    /* Imports lozalization excels */
    grunt.registerMultiTask(
        'impL10nMixedExcels',
        'Import localization excel file translations back to localization json.',
        function () {
            var pattern = grunt.option('pattern'),
                delimiter = grunt.option('delimiter') || '.',
                locale = grunt.option('locale'),
                templateLocale = grunt.option('templateLocale') || 'en';

            if (!pattern) {
                grunt.fail.fatal('No import pattern defined');
            }
            if (grunt.option('delimiter')) {
                console.log('User set delimiter:', delimiter);
            }
            if (grunt.option('locale')) {
                console.log('User set locale:', locale);
            }
            var files = grunt.file.expandMapping([pattern]),
                idx = 0;

            files.forEach(function (file) {
                console.log('xxxxxxxxx');
                file.src.map(function (filepath) {
                    console.log('yyyyyy');
                    console.log('delimiter:', delimiter);
                    console.log('file:', filepath);
                    console.log('templateLocale:', templateLocale);
                    var config = {
                        delimiter: delimiter,
                        file: filepath,
                        templateLocale: templateLocale
                    };
                    if (locale) {
                        config.locale = locale;
                    }
                    grunt.config.set(
                        'import-l10n-mixed-excel.' + new Date().getTime() + '' + idx,
                        [config]
                    );
                    idx += 1;
                });
            });
            grunt.task.run('import-l10n-mixed-excel');
        }
    );



    /* Imports a single localization excel
     * oskari-import-l10n-excel
     */
    grunt.registerMultiTask(
        'import-l10n-mixed-excel',
        'Import localization excel files',
        function () {
        
            var fs = require('fs'),
                file = this.data[0].file;

            if (!file) {
                grunt.fail.fatal('No file defined.');
            }
            if (!fs.existsSync(file)) {
                grunt.fail.fatal('File ' + file + ' doesn\'t exist.');
            }
            console.log('Importing', file);
            var AdmZip = require('adm-zip'),
                parseString = require('xml2js').parseString,
                path = require('path'),
                sst = [],
                si,
                i,
                j,
                k,
                row,
                cell,
                localeDir,
                localeFile = null,
                targetFile,
                key,
                original,
                localized,
                translation,
                sourceLocale,
                me = this,
                delimiter = this.data[0].delimiter,
                locale = this.data[0].locale,
                templateLocale = this.data[0].templateLocale,
                textNode;

            
            console.log('Parsing', file);
            // xl/sharedStrings.xml, Shared strings <si><t>val, 0-based index
            // (partially?) styled strings <si><r><t><_>val, <si><r><t>val
            parseString(
                new AdmZip(file).readAsText('xl/sharedStrings.xml'),
                function (err, result) {
                    if (result && result.sst && result.sst.si) {
                        si = result.sst.si;
                        for (i = 0; i < si.length; i += 1) {

                            //console.log('si', si);
                            if (si[i].t) {
                                textNode = si[i].t[0];
                                console.log('textNode', textNode);
                            } else {
                                // (partially?) styled text is chopped into pieces
                                console.log('TYHJÄ NODE');
                                textNode = '';
                                for (j = 0, k = si[i].r.length; j < k; j += 1) {
                                    textNode += si[i].r[j].t[0]._ || si[i].r[j].t;
                                }
                            }
                            if (typeof textNode === 'string' || textNode instanceof String) {
                                sst.push(textNode.trim());
                            } else if (textNode.hasOwnProperty('_')) {
                                sst.push(textNode._.trim());
                            } else {
                                sst.push('');
                            }
                        }
                    }
                }
            );
            // Hackhack, easy way to read/load the localization files.
            // Won't be needed with the require locale files methinks
            var Oskari = {
                registerLocalization: function (localization) {
                    return localization;
                }
            };

            // Get the original translation. Returns '' if translation is not available.
            var getTranslation = function (pathStack) {
                if (!translation) {
                    return '';
                }
                var currNode = translation,
                    i;

                for (i = 0; i < pathStack.length; i += 1) {
                    currNode = currNode[pathStack[i]];
                    if (!currNode) {
                        return '';
                    }
                    console.log('-----------------------------------------------------------------------------');
                    console.log('currNode', currNode);
                    console.log('');
                }
                return currNode || '';
            };

            // Sets a new translation value
            /**
             *
             * @param pathStack
             * @param val        new value
             * @param val_en     if no value, use english and record lacking value
             */
            var setNewValue = function (pathStack, val, val_en) {
                var currNode = sourceLocale,
                    i,
                    newValue = val && val.length ? val : 'NOT TRANSLATED';


                console.log('&&&&&&&&&&  val',newValue);
                for (i = 0; i < pathStack.length; i += 1) {
                    if (i + 1 === pathStack.length) {
                        if (pathStack.join('.') !== 'key') {
                            if (currNode.hasOwnProperty(pathStack[i])) {
                                if (currNode[pathStack[i]] && currNode[pathStack[i]].length) {
                                    // We have an old value, replace it with something (why would anyone translate an empty string?)
                                    currNode[pathStack[i]] = newValue;
                                } else {
                                    // No previous value, set a new value only if we have one.
                                    if (val && val.length) {
                                        currNode[pathStack[i]] = newValue;
                                    }
                                }
                            } else {
                                grunt.log.warn(
                                    'Unknown localization key: ',
                                    pathStack.join('.')
                                );
                                break;
                            }
                        }
                    } else {
                        currNode = currNode[pathStack[i]];
                        if (!currNode) {
                            grunt.log.warn(
                                'Unknown localization key: ',
                                pathStack.join('.')
                            );
                            break;
                        }
                    }
                }
            };
            var initLocalization = function (node, stack) {

                console.log('......................................................................................... node',node);

                var pathStack = stack || [],
                    p;

                if (typeof node === 'string' || node instanceof String) {
                    setNewValue(pathStack, getTranslation(pathStack), getTranslation(pathStack, 'en'));
                } else if (node.constructor === Object) {
                    // Node value is an object, recurse
                    for (p in node) {
                        if (node.hasOwnProperty(p)) {
                            pathStack.push(p);
                            initLocalization(node[p], pathStack);
                            pathStack.pop();
                        }
                    }
                } else if (node instanceof Array) {
                    for (p = 0; p < node.length; p += 1) {
                        pathStack.push(p);
                        initLocalization(node[p], pathStack);
                        pathStack.pop();
                    }
                } else {
                    // booleans, numbers... stuff that isn't translated
                }
            };
            var getLocalization = function (filePath, fileName) {
                var data = null;
                // read template
                console.log('------------------------------');
                console.log('filePath',filePath);
                console.log('fileName',fileName);
                console.log('------------------------------');
                if (fs.existsSync(filePath + path.sep + templateLocale + '.js')) {
                    //TÄSSÄ KOHTAAN LUETAAN TIEDOSTO data MUUTTUJAAN
                    data = fs.readFileSync(
                        filePath + path.sep + templateLocale + '.js',
                        {
                            encoding: 'utf8'
                        }
                    );
                    /* jshint ignore:start */
                    sourceLocale = eval(data);
                    /* jshint ignore:end */
                } else {
                    grunt.fail.fatal(
                        'Couldn\'t read template localization:',
                        filePath + path.sep + templateLocale + '.js'
                    );
                }

                // Read old locale
                targetFile = filePath + path.sep + fileName;
                if (fs.existsSync(targetFile)) {
                    data = fs.readFileSync(targetFile, {
                        encoding: 'utf8'
                    });
                    /* jshint ignore:start */
                    translation = eval(data);
                    /* jshint ignore:end */
                } else {
                    grunt.log.warn(
                        'Couldn\'t find old translation: ',
                        filePath + path.sep + fileName
                    );
                }
                initLocalization(sourceLocale);
            };
            var getCellValue = function (cell) {
                if (cell === null || cell === undefined) {
                    return '';
                }
                if (cell.v) {
                    return sst[parseInt(cell.v)];
                } else if (cell.is) {
                    return cell.is[0].t[0].trim();
                } else {
                    return '';
                }
            };
            // xl/worksheets/sheet1.xml Table <sheetData><row><c>[<v>sharedstringid|<is><t>val]
            console.log('Reading sheet from', file);
            var sheet = new AdmZip(file).readAsText('xl/worksheets/sheet1.xml'),
                cells;

            parseString(
                sheet,
                function (err, result) {
                    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
                    if (result && result.worksheet && result.worksheet.sheetData && result.worksheet.sheetData[0].row) {
                        console.log('===========================================');
                        // skip header row
                        for (i = 1; i < result.worksheet.sheetData[0].row.length; i += 1) {
                            console.log(')))))))))))))))))))))))))))))))))))))))))))');
                            cells = result.worksheet.sheetData[0].row[i].c;
                            if (localeFile === null) {
                                console.log('ooooooooooooooooooooooooooooooooooooooooo');
                                localeDir = '..' + path.sep + getCellValue(cells[0]).substring(8);
                                localeDir = localeDir.replace('\\bundle\\','\\');
                                localeDir = localeDir.replace('\\locale','\\resources\\locale');
                                console.log('localeDir', localeDir);
                                localeFile = getCellValue(cells[1]);
                                console.log('localeFile', localeFile);
                                getLocalization(
                                    localeDir,
                                    locale ? locale + '.js' : localeFile
                                );
                                console.log('ooooooooooooooooooooooooooooooooooooooooo');
                            }

                            key = getCellValue(cells[2]);
                            if (key && key !== 'key') {

                                original = getCellValue(cells[3]);
                                localized = getCellValue(cells[4]);

                                var pathStack = key.split(delimiter);
                                setNewValue(pathStack, localized, original);
                            }
                        }
                    } else {
                        grunt.fail.fatal('No parse result');
                    }
                }
            );

            // Set user defined locale if available
            if (locale) {
                console.log('KKKKKKKKKKKKKK');
                setNewValue(['lang'], locale, locale);
            }
            console.log('IIIIIIIIIIIIII');
            console.log('B', JSON.stringify(sourceLocale, null, 4));
            // Write file to targetFile
            fs.writeFileSync(
                targetFile,
                'Oskari.registerLocalization(\r\n' +
                JSON.stringify(sourceLocale, null, 4).replace(/\n/g,'\r\n') +
                '\r\n);'
            );
        }
    );
};
