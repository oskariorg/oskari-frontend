// FIXME require('path') and change path separators to path.sep
module.exports = function (grunt) {
    /* Generates localization excel files */
    grunt.registerMultiTask(
        'genrateL10nExcels',
        'Generate localization excel files',
        function () {
            var locale = grunt.option('locale'),
                locales,
                path = require('path'),
                fse = require('fs-extra'),
                templateLocale = grunt.option('templateLocale') || 'en',
                logpath = '..' + path.sep + 'dist' + path.sep + 'L10N' + path.sep + 'genL10nExcels.log' ,
                i;

            // log all lacking translation locations
            global.logfile = logfile = fse.createOutputStream(logpath);

            if (!locale) {
                // TODO: rather check languages based on bundles /locale/<lang>.js
                locale = 'af,ak,am,ar,az,be,bg,bm,bn,bo,br,bs,ca,cs,cy,da,de,dz,ee,el,en,eo,es,et,eu,fa,ff,fi,fo,fr,fy,ga,gd,gl,gu,ha,he,hi,hr,hu,hy,ia,id,ig,is,it,ja,ka,ki,kk,kl,km,kn,ko,ks,kw,ky,lb,lg,ln,lo,lt,lu,lv,mg,mk,ml,mn,mr,ms,mt,my,nb,nd,ne,nl,nn,om,or,os,pa,pl,ps,pt,qu,rm,rn,ro,ru,rw,se,sg,si,sk,sl,sn,so,sq,sr,sv,sw,ta,te,th,ti,tn,to,tr,ts,ug,uk,ur,uz,vi,yi,yo,zh,zu';
//                grunt.fail.fatal('Locale not defined.');
            }
            locales = locale.split(',').map(
                Function.prototype.call,
                String.prototype.trim
            );
            this.files.forEach(function (file) {
                file.src.map(function (filepath) {
                    var fp = path.normalize(filepath),
                        pathTokens = fp.split(path.sep),
                        bundleName = pathTokens[pathTokens.length - 2];

                    for (i = 0; i < locales.length; i += 1) {
                        grunt.config.set(
                            'generate-l10n-excel.' + bundleName + '_' + locales[i],
                            [{
                                bundleName: bundleName,
                                bundleDir: fp,
                                locale: locales[i],
                                templateLocale: templateLocale
                            }]
                        );
                    }
                });
            });
            grunt.task.run('gen-l10n-excel');
        }
    );


    /* Generates a single localization excel */
    grunt.registerMultiTask(
        'gen-l10n-excel',
        'Generate localization excel files for given bundles and locales',
        function () {
            var done = this.async(),
                AdmZip = require('adm-zip'),
                archiver = require('archiver'),
                fs = require('node-fs-extra'),
                path = require('path'),
                me = this,
                bundleName = me.data[0].bundleName,
                bundleDir = me.data[0].bundleDir,
                locale = me.data[0].locale,
                templateLocale = me.data[0].templateLocale,
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
                localizationDir = '..' + path.sep + 'dist' + path.sep + 'L10N' + path.sep + locale,
                notesFile = '..' + path.sep + 'docs' + path.sep + 'L10N' + path.sep + bundleDir.substring(3) + 'notes.js',
                worksheetFile = localizationDir + path.sep + bundleName + '_' + locale + path.sep + 'xl' + path.sep + 'worksheets' + path.sep + 'sheet1.xml',
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
                var templateDir = localizationDir + path.sep + bundleName + '_' + locale;

                if (fs.existsSync(templateDir)) {
                    fs.remove(templateDir, function (err) {
                        if (err) {
                            grunt.log.error(
                                'Failed to remove temporary files from ' + templateDir + ':\n' + err
                            );
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
                    if(!translation){
                        row = row.replace('{translation}', escape(value));
                    }
                    else {
                        row = row.replace('{translation}', escape(translation));
                    }
                    row = row.replace('{notes}', escape(notes));
                    //grunt.log.writeln(row);
                    output += row;
                    rowIndex += 1;
                },
                getTranslation = function (pathStack) {
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
                    }
                    return currNode !== 'NOT TRANSLATED' ? currNode : '';
                },
                getTranslationNote = function (pathStack) {
                    if (!notes) {
                        return '';
                    }
                    var currNode = notes,
                        i;

                    for (i = 0; i < pathStack.length; i += 1) {
                        currNode = currNode[pathStack[i]];
                        if (!currNode) {
                            return '';
                        }
                    }
                    return currNode;
                },
                printNodePath = function (node, stack) {
                    var pathStack = stack || [],
                        translation,
                        i,
                        p,
                        note = getTranslationNote(pathStack);

                    // Print the node if its value is a string
                    if (typeof node === 'string' || node instanceof String) {
                        translation = getTranslation(pathStack);
                        if (!translation && pathStack.join('') === 'lang') {
                            translation = locale;
                        }
                        if(!note) {

                                // Add extra note, if lacking locale en and current lang
                                if (!node) {
                                    note = 'NO ' + templateLocale + ' TRANSLATION  - '
                                }
                                if (!translation) {
                                    note = note + 'NO ' + locale + ' TRANSLATION'
                                }
                            if (note) {
                                if (localizationDir + path.sep + bundleName + '_' + locale + '.xlsx' !== global.savfile) {
                                    if (!node && !translation) {
                                        // both translations are empty
                                        grunt.log.writeln(
                                            path.sep + 'Oskari' + bundleDir.substring(2) + 'locale' + ' <-> ' +
                                            locale + '.js' + ' <-> ' +
                                            pathStack.join('.') + ' <-> ' +
                                            node + ' <-> ' + 'NO TRANSLATIONS: ' + templateLocale +
                                            ',' + locale + ' <-> ' +
                                            localizationDir + path.sep + bundleName + '_' + locale + '.xlsx\n'
                                        );
                                    }
                                    else {
                                        global.logfile.write(path.sep + 'Oskari' + bundleDir.substring(2) + 'locale' + ' <-> ' +
                                        locale + '.js' + ' <-> ' +
                                        pathStack.join('.') + ' <-> ' +
                                        node + ' <-> MISSINGS TRANSLATIONS IN ' +
                                        localizationDir + path.sep + bundleName + '_' + locale + '.xlsx\n');
                                        global.savfile = localizationDir + path.sep + bundleName + '_' + locale + '.xlsx';
                                    }
                                }
                            }


                        }

                        addExcelRow(
                            path.sep + 'Oskari' + bundleDir.substring(2) + 'locale',
                            locale + '.js',
                            pathStack.join('.'),
                            node,
                            translation,
                            note
                        );
                    } else if ((!!node) && (node.constructor === Object)) {
                        // Node value is an object, recurse
                        for (p in node) {
                            if (node.hasOwnProperty(p)) {
                                pathStack.push(p);
                                printNodePath(node[p], pathStack);
                                pathStack.pop();
                            }
                        }
                    } else if (Object.prototype.toString.call(node) === '[object Array]') {
                        // FIXME change toString check to isArray()?
                        for (i = 0; i < node.length; i += 1) {
                            pathStack.push(i);
                            printNodePath(node[i], pathStack);
                            pathStack.pop();
                        }
                    } else {
                        // ignore...
                    }
                },
                writeExcelFile = function () {
                    // write output to worksheet xml
                    fs.writeFileSync(worksheetFile, output);

                    // create zip file
                    var out = fs.createWriteStream(
                            localizationDir + path.sep + bundleName + '_' + locale + '.xlsx'
                        ),
                        archive = archiver('zip');

                    out.on('close', function () {
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
                        src: ['*', '**' + path.sep + '*', '**' + path.sep + '**' + path.sep + '*', '_rels' + path.sep + '.rels']
                    }]);
                    archive.finalize();
                },

                checkAsyncStatus = function () {
                    asyncCounter -= 1;
                    if (asyncCounter === 0) {
                        // All async tasks are done
                        // Check that we have everything we need
                        if (sourceLocale) {
                            // write rows to output
                            printNodePath(sourceLocale);

                            // write rest of the template to output
                            output += worksheet.substring(
                                worksheet.indexOf('</row>') + '</row>'.length
                            );

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
                        output = data.substring(
                            0,
                            data.indexOf('</row>') + '</row>'.length
                        );
                        checkAsyncStatus();
                    }
                });
            };

            // TODO support new locale directory structure
            // Read english locale
            // TODO move source locale to options
            fs.readFile(
                bundleDir + 'resources' + path.sep + 'locale' + path.sep + templateLocale + '.js',
                {
                    encoding: 'utf8'
                },
                function (err, data) {
                    if (err) {
                        // We must have a source locale, fail in checkAsyncStatus when all asyncs are done
                        grunt.log.writeln(
                            'No source location file found for ' + bundleName + ' in ' + bundleDir + 'locale' + path.sep + templateLocale + '.js' + ', skipping.'
                        );
                    } else {
                        /* jshint ignore:start */
                        sourceLocale = eval(data);
                        /* jshint ignore:end */
                    }
                    checkAsyncStatus();
                }
            );

            // Read old locale
            fs.readFile(
                bundleDir + 'resources' + path.sep + 'locale' + path.sep + locale + '.js', {
                    encoding: 'utf8'
                },
                function (err, data) {
                    if (err) {
                        // ignore, old translation isn't mandatory
                    } else {
                        try {
                            /* jshint ignore:start */
                            translation = eval(data);
                            /* jshint ignore:end */
                        } catch (e) {
                            grunt.fail.fatal(
                                'Couldn\'t read localization file: ' + bundleDir + 'locale' + path.sep + locale + '.js, ' + e
                            );
                        }
                    }
                    checkAsyncStatus();
                }
            );

            // Read translation notes
            fs.readFile(
                notesFile, {
                    encoding: 'utf8'
                },
                function (err, data) {
                    if (err) {
                        // ignore, notes aren't mandatory
                    } else {
                        notes = JSON.parse(data);
                    }
                    checkAsyncStatus();
                }
            );

            // make sure we have a L10N folder in dist
            if (!fs.existsSync(localizationDir + path.sep + bundleName + '_' + locale)) {
                fs.mkdirsSync(localizationDir + path.sep + bundleName + '_' + locale);
            }
            var templateLoc = '..' + path.sep + 'tools' + path.sep + 'template.xlsx';
            // Extract excel template to dist/L10n/bundleName_??
            if (!fs.existsSync(templateLoc)) {
                grunt.log.error(
                    'Template excel file "' + templateLoc + '" doesn\'t exist.'
                );
            }
            var zip = new AdmZip(templateLoc);
            zip.extractAllTo(localizationDir + path.sep + bundleName + '_' + locale, true);
            readTemplate(worksheetFile);
        }

    );

};
