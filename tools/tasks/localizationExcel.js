module.exports = function (grunt) {
    /* Generates localization excel files */
    grunt.registerMultiTask(
        "genL10nExcels",
        "Test how this data src thingie works...",
        function () {
            var locale = grunt.option('locale'),
                locales,
                templateLocale = grunt.option('templateLocale') || 'en',
                i;
            if (!locale) {
                grunt.fail.fatal("Locale not defined.");
            }
            locales = locale.split(',').map(Function.prototype.call, String.prototype.trim);
            this.files.forEach(function (file) {
                file.src.map(function (filepath) {
                    //if (filepath.indexOf('n-layerri') > -1) {
                        var pathTokens = filepath.trim().split('/'),
                            bundleName = pathTokens[pathTokens.length - 2];

                        for (i = 0; i < locales.length; i++) {
                            grunt.config.set(
                                'generate-l10n-excel.' + bundleName + '_' + locales[i], [{
                                    bundleName: bundleName,
                                    bundleDir: filepath,
                                    locale: locales[i],
                                    templateLocale: templateLocale
                                }]

                            );
                        }
                    //}
                });
            });
            grunt.task.run('generate-l10n-excel');
        }
    );

    /* Imports lozalization excels */
    grunt.registerMultiTask(
        "impL10nExcels",
        "Test excel import",
        function () {
            var pattern = grunt.option('pattern'),
                delimiter = grunt.option('delimiter') || '.',
                locale = grunt.option('locale'),
                templateLocale = grunt.option('templateLocale') || 'en';
            if (!pattern) {
                grunt.fail.fatal("No import pattern defined");
            }
            if (grunt.option('delimiter')) {
                grunt.log.writeln("User set delimiter:", delimiter);
            }
            if (grunt.option('locale')) {
                grunt.log.writeln("User set locale:", locale);
            }
            var files = grunt.file.expandMapping([pattern]),
                idx = 0;

            files.forEach(function (file) {
                file.src.map(function (filepath) {
                    var config = {
                        delimiter: delimiter,
                        file: filepath,
                        templateLocale: templateLocale
                    };
                    if (locale) {
                        config.locale = locale;
                    }
                    grunt.config.set(
                        'import-l10n-excel.' + new Date().getTime() + "" + idx, [config]
                    );
                    idx++;
                });
            });
            grunt.task.run('import-l10n-excel');
        }
    );

    /* Generates a single localization excel */
    grunt.registerMultiTask(
        'generate-l10n-excel',
        'Generate localization excel files for given bundles and locales',
        function () {
            var done = this.async(),
                AdmZip = require('adm-zip'),
                archiver = require('archiver'),
                fs = require('node-fs-extra'),
                me = this,
                bundleName = this.data[0].bundleName,
                bundleDir = this.data[0].bundleDir,
                locale = this.data[0].locale,
                templateLocale = this.data[0].templateLocale,
                rowTemplate =
                    '        <row r="{row}" spans="1:6">\n' +
                    '            <c r="A{row}" t="inlineStr">\n' +
                    '                <is>\n' +
                    '                    <t>{path}<\/t>\n' +
                    '                <\/is>\n' +
                    '            <\/c>\n' +
                    '            <c r="B{row}" t="inlineStr">\n' +
                    '                <is>\n' +
                    '                    <t>{filename}<\/t>\n' +
                    '                <\/is>\n' +
                    '            <\/c>\n' +
                    '            <c r="C{row}" t="inlineStr">\n' +
                    '                <is>\n' +
                    '                    <t>{key}<\/t>\n' +
                    '                <\/is>\n' +
                    '            <\/c>\n' +
                    '            <c r="D{row}" t="inlineStr">\n' +
                    '                <is>\n' +
                    '                    <t>{value}<\/t>\n' +
                    '                <\/is>\n' +
                    '            <\/c>\n' +
                    '            <c r="E{row}" t="inlineStr">\n' +
                    '                <is>\n' +
                    '                    <t>{translation}<\/t>\n' +
                    '                <\/is>\n' +
                    '            <\/c>\n' +
                    '            <c r="F{row}" t="inlineStr">\n' +
                    '                <is>\n' +
                    '                    <t>{notes}<\/t>\n' +
                    '                <\/is>\n' +
                    '            <\/c>\n' +
                    '        <\/row>\n',
                sourceLocale,
                translation,
                notes,
                worksheet,
                localizationDir = '..\\dist\\L10N\\' + locale,
                worksheetFile = localizationDir + '\\' + bundleName + '_' + locale + '\\xl\\worksheets\\sheet1.xml',
                output,
                asyncCounter = 4; // decremented on async done

            if (!locale) {
                grunt.log.error('No locale defined.');
                done(false);
            }
            if (!templateLocale) {
                grunt.log.error('No template locale defined.');
                done(false);
            }

            var cleanup = function (finish, ret) {
                // delete copied template...
                var templateDir = localizationDir + '\\' + bundleName + '_' + locale;
                if (fs.existsSync(templateDir)) {
                    fs.remove(templateDir, function (err) {
                        if (err) {
                            grunt.log.error('Failed to remove temporary files from ' + templateDir + ':\n' + err);
                        }
                        if (finish) {
                            done(ret);
                        }
                    });
                } else {
                    if (finish) {
                        done(ret);
                    }
                }
            };

            var rowIndex = 2,
                escape = function (value) {
                    return value.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&apos;');
                },
                addExcelRow = function (path, filename, key, value, translation, notes) {
                    var row = rowTemplate.replace(/{row}/g, rowIndex);
                    row = row.replace('{path}', escape(path));
                    row = row.replace('{filename}', escape(filename));
                    row = row.replace('{key}', escape(key));
                    row = row.replace('{value}', escape(value));
                    row = row.replace('{translation}', escape(translation));
                    row = row.replace('{notes}', escape(notes));
                    //grunt.log.writeln(row);
                    output += row;
                    rowIndex++;
                },
                getTranslation = function (pathStack) {
                    if (!translation) {
                        return '';
                    }
                    var currNode = translation,
                        i;
                    for (i = 0; i < pathStack.length; i++) {
                        currNode = currNode[pathStack[i]];
                        if (!currNode) {
                            return '';
                        }
                    }
                    return currNode !== 'NOT TRANSLATED' ? currNode : '';
                },
                getTranslationNote = function (pathStack) {
                    if (!notes) {
                        return '';
                    }
                    var currNode = notes,
                        i;
                    for (i = 0; i < pathStack.length; i++) {
                        currNode = currNode[pathStack[i]];
                        if (!currNode) {
                            return '';
                        }
                    }
                    return currNode;
                },
                printNodePath = function (node, stack) {
                    var pathStack = stack || [],
                        translation;
                    // Print the node if its value is a string
                    if (typeof node == 'string' || node instanceof String) {
                        translation = getTranslation(pathStack);
                        if (!translation && pathStack.join('') === 'lang') {
                            translation = locale;
                        }
                        addExcelRow('/Oskari' + bundleDir.substring(2) + 'locale', locale + '.js', pathStack.join('.'), node, translation, getTranslationNote(pathStack));
                    } else if (( !! node) && (node.constructor === Object)) {
                        // Node value is an object, recurse
                        var p;
                        for (p in node) {
                            if (node.hasOwnProperty(p)) {
                                pathStack.push(p);
                                printNodePath(node[p], pathStack);
                                pathStack.pop();
                            }
                        }
                    } else {
                        // TODO we need to support array...
                        // it's used in printout
                    }
                },
                writeExcelFile = function () {
                    // write output to worksheet xml
                    fs.writeFileSync(worksheetFile, output);

                    // create zip file
                    var out = fs.createWriteStream(localizationDir + '\\' + bundleName + '_' + locale + '.xlsx'),
                        archive = archiver('zip');

                    out.on('close', function () {
                        //grunt.log.writeln(bundleName + ' done, running cleanup');
                        cleanup(true, true);
                    });
                    archive.on('error', function (err) {
                        grunt.log.error('Failed to create excel archive:\n' + err);
                        cleanup(true, false);
                    });

                    archive.pipe(out);

                    archive.bulk([{
                        expand: true,
                        cwd: localizationDir + '\\' + bundleName + '_' + locale,
                        src: ['*', '**/*', '**/**/*', '_rels\\.rels']
                    }]);
                    archive.finalize();
                },

                checkAsyncStatus = function () {
                    if (--asyncCounter === 0) {
                        // All async tasks are done
                        // Check that we have everything we need
                        if (sourceLocale) {
                            // write rows to output
                            printNodePath(sourceLocale);

                            // write rest of the template to output
                            output += worksheet.substring(worksheet.indexOf('</row>') + '</row>'.length);

                            writeExcelFile();
                        } else {
                            cleanup(true, true);
                        }
                    }
                };

            // Hackhack, easy way to read/load the localization files
            var Oskari = {
                registerLocalization: function (localization) {
                    return localization;
                }
            };

            var readTemplate = function (file) {
                // Read template worksheet
                if (!fs.existsSync(file)) {
                    grunt.log.error('Template file doesn\'t exist.');
                    cleanup(true, false);
                }
                fs.readFile(file, {
                    encoding: 'utf8'
                }, function (err, data) {
                    if (err) {
                        grunt.log.error('Failed to read template:\n' + err);
                        cleanup(true, false);
                    } else {
                        worksheet = data;
                        // Write worksheet to output all the way up to the end of the first row
                        output = data.substring(0, data.indexOf('</row>') + '</row>'.length);
                        checkAsyncStatus();
                    }
                });
            };

            // TODO support new locale directory structure
            // Read english locale
            // TODO move source locale to options
            fs.readFile(bundleDir + '\\locale\\' + templateLocale + '.js', {
                encoding: 'utf8'
            }, function (err, data) {
                if (err) {
                    // We must have a source locale, fail in checkAsyncStatus when all asyncs are done
                    grunt.log.writeln('No source location file found for ' + bundleName + ', skipping.');
                } else {
                    sourceLocale = eval(data);
                }
                checkAsyncStatus();
            });

            // Read old locale
            fs.readFile(bundleDir + '\\locale\\' + locale + '.js', {
                encoding: 'utf8'
            }, function (err, data) {
                if (err) {
                    // ignore, old translation isn't mandatory
                    //grunt.log.writeln('No old ' + locale + ' localization found for ' + bundleName);
                } else {
                    translation = eval(data);
                }
                checkAsyncStatus();
            });

            // Read translation notes
            // TODO magic up a valid path for this
            fs.readFile(bundleDir + '\\docs\\I10N\\' + bundleDir, {
                encoding: 'utf8'
            }, function (err, data) {
                if (err) {
                    // ignore, notes aren't mandatory
                    //grunt.log.writeln('No translation notes found for ' + bundleName);
                } else {
                    notes = JSON.parse(data);
                }
                checkAsyncStatus();
            });

            // make sure we have a L10N folder in dist
            if (!fs.existsSync(localizationDir + '\\' + bundleName + '_' + locale)) {
                fs.mkdirsSync(localizationDir + '\\' + bundleName + '_' + locale);
            }
            // Extract excel template to dist/L10n/bundleName_??
            var zip = new AdmZip('..\\docs\\l10n\\template.xlsx');
            zip.extractAllTo(localizationDir + '\\' + bundleName + '_' + locale, true);
            readTemplate(worksheetFile);
        }

    );

    /* Imports a single localization excel */
    /*
     * oskari-import-l10n-excel
     */

    module.exports = function (grunt) {
        grunt.registerMultiTask(
            'import-l10n-excel',
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
                grunt.log.writeln('Importing', file);
                var AdmZip = require('adm-zip'),
                    parseString = require('xml2js').parseString,
                    sst = [],
                    i,
                    j,
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

                // xl/sharedStrings.xml, Shared strings <si><t>val, 0-based index
                parseString(new AdmZip(file).readAsText('xl/sharedStrings.xml'), function (err, result) {
                    if (result && result.sst && result.sst.si) {
                        for (i = 0; i < result.sst.si.length; i++) {
                            textNode = result.sst.si[i].t[0];
                            if (typeof textNode == 'string' || textNode instanceof String) {
                                sst.push(textNode.trim());
                            } else if (textNode.hasOwnProperty('_')) {
                                sst.push(textNode._.trim());
                            } else {
                                sst.push('');
                            }
                        }
                    }
                });
                // Hackhack, easy way to read/load the localization files
                var Oskari = {
                    registerLocalization: function (localization) {
                        return localization;
                    }
                };
                // Get the original translation. Returns 'NOT TRANSLATED' if translation is not available.
                var getTranslation = function (pathStack) {
                    if (!translation) {
                        return '';
                    }
                    var currNode = translation,
                        i;
                    for (i = 0; i < pathStack.length; i++) {
                        currNode = currNode[pathStack[i]];
                        if (!currNode) {
                            return '';
                        }
                    }
                    return currNode || '';
                };
                // Sets a new translation value
                var setNewValue = function (pathStack, val) {
                    var currNode = sourceLocale,
                        i,
                        newValue = val && val.length ? val : 'NOT TRANSLATED';
                    for (i = 0; i < pathStack.length; i++) {
                        if (i + 1 === pathStack.length) {
                            if (pathStack.join('.') !== 'key') {
                                if (currNode.hasOwnProperty(pathStack[i])) {
                                    if (currNode[pathStack[i]]) {
                                        // We have an old value, replace it with something (why would anyone translate an empty string?)
                                        currNode[pathStack[i]] = newValue;
                                    }
                                } else {
                                    grunt.log.warn('Unknown localization key: ', pathStack.join('.'));
                                    break;
                                }
                            }
                        } else {
                            currNode = currNode[pathStack[i]];
                            if (!currNode) {
                                grunt.log.warn('Unknown localization key: ', pathStack.join('.'));
                                break;
                            }
                        }
                    }
                };
                var initLocalization = function (node, stack) {
                    var pathStack = stack || [],
                        p;

                    if (typeof node == 'string' || node instanceof String) {
                        setNewValue(pathStack, getTranslation(pathStack));
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
                        for (p = 0; p < node.length; p++) {
                            pathStack.push(p);
                            initLocalization(node[p], pathStack);
                            pathStack.pop();
                        }
                    } else {
                        // booleans, numbers... stuff that isn't translated
                    }
                };
                var getLocalization = function (path, fileName) {
                    var data = null;
                    // read template
                    if (fs.existsSync(path + '\\en.js')) {
                        data = fs.readFileSync(path + '\\' + templateLocale + '.js', {
                            encoding: 'utf8'
                        });
                        sourceLocale = eval(data);
                    } else {
                        grunt.fail.fatal('Couldn\'t read template localization:', path + '\\' + templateLocale + '.js');
                    }

                    // Read old locale
                    targetFile = path + '/' + fileName;
                    if (fs.existsSync(targetFile)) {
                        data = fs.readFileSync(targetFile, {
                            encoding: 'utf8'
                        });
                        translation = eval(data);
                    } else {
                        grunt.log.warn('Couldn\'t find old translation at ' + path + '\\' + fileName);
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
                var sheet = new AdmZip(file).readAsText('xl/worksheets/sheet1.xml');
                parseString(sheet, function (err, result) {
                    if (result && result.worksheet && result.worksheet.sheetData && result.worksheet.sheetData[0].row) {
                        // skip header row
                        for (i = 1; i < result.worksheet.sheetData[0].row.length; i++) {
                            cells = result.worksheet.sheetData[0].row[i].c;
                            if (localeFile === null) {
                                localeDir = '..\\' + getCellValue(cells[0]).substring(8);
                                localeFile = getCellValue(cells[1]);
                                getLocalization(localeDir, locale ? locale + '.js' : localeFile);
                            }

                            key = getCellValue(cells[2]);
                            if (key && key !== 'key') {

                                original = getCellValue(cells[3]);
                                localized = getCellValue(cells[4]);

                                var pathStack = key.split(delimiter);
                                setNewValue(pathStack, localized);
                            }
                        }
                    } else {
                        grunt.fail.fatal('No parse result');
                    }
                });

                // Set user defined locale if available
                if (locale) {
                    setNewValue(['lang'], locale);
                }
                // Write file to targetFile
                fs.writeFileSync(
                    targetFile,
                    'Oskari.registerLocalization(\n' +
                    JSON.stringify(sourceLocale, null, 4) +
                    '\n);'
                );
            }
        );
    };


};
