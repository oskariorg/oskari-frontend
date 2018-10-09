Oskari.clazz.define('Oskari.coordinatetransformation.view.FileHandler',
    function (helper, loc, type) {
        var me = this;
        Oskari.makeObservable(this);
        me.helper = helper;
        me.loc = loc;
        me.element = null;
        me.type = type; // import, export
        me.infoPopup = Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateSystemInformation');
        me.fileInput;
        me.settings = {};
        me.dialog;
        me.degreeSystem = true; //show degree systems options by default
        me._template = {
            settings: _.template('<div class="coordinatetransformation-file-form">' +
                                    '<% if (obj.export === true) { %> ' +
                                        '<div class="selection-wrapper fileName without-infolink">' +
                                            '<b class="title">${fileName}</b>' +
                                            '<input type="text">' +
                //'<div class="infolink icon-info" data-selection="fileName"></div>' +
                                        '</div>' +
                                    '<% } else { %>' +
                                        '<div class="selection-wrapper fileInput without-infolink"></div>' +
                                        '<div class="selection-wrapper headerLineCount">' +
                                            '<b class="title">${headerCount}</b>' +
                                            '<input type="number" value="0" min="0" required> ' +
                                            '<div class="infolink icon-info" data-selection="headerLineCount"></div>' +
                                        '</div>' +
                                    '<% } %> ' +
                                    '<div class="selection-wrapper unitFormat">' +
                                        '<b class="title">${units.label}</b> ' +
                                        '<div class="settingsSelect">' +
                                            '<select>' +
                                                '<option value="degree" data-decimals="8">${units.degree}</option>' +
                                                '<option value="gradian" data-decimals="8">${units.gradian}</option>' +
                                                '<option value="radian" data-decimals="10">${units.radian}</option>' +
                                                '<option value="DD" data-decimals="8">DD</option>' +
                                                '<option value="DD MM SS" data-decimals="4">DD MM SS</option>' +
                                                '<option value="DD MM" data-decimals="6">DD MM</option>' +
                                                '<option value="DDMMSS" data-decimals="4">DDMMSS</option>' +
                                                '<option value="DDMM" data-decimals="6">DDMM</option>' +
                                            '</select>' +
                                        '</div>' +
                                        '<div class="infolink icon-info" data-selection="unitFormat"></div>' +
                                    '</div>' +
                                    '<% if (obj.export === true) { %> ' +
                                        '<div class="selection-wrapper decimalCount">' +
                                            '<b class="title">${decimalCount}</b>' +
                                            '<input type="number" value="0" min="0" max = "20" required> ' +
                                            '<div class="infolink icon-info" data-selection="decimalCount"></div>' +
                                        '</div>' +
                                    '<% } %> ' +
                                    '<div class="selection-wrapper decimalSeparator">' +
                                        '<b class="title">${decimalSeparator}</b> ' +
                                        '<div class="settingsSelect">' +
                                            '<select>' +
                                                '<option value="" selected disabled>${choose}</option>' +
                                                '<option value=".">${delimeters.point}</option>' +
                                                '<option value=",">${delimeters.comma}</option>' +
                                            '</select>' +
                                        '</div>' +
                                        '<div class="infolink icon-info" data-selection="decimalSeparator"></div>' +
                                    '</div>' +
                                    '<div class="selection-wrapper coordinateSeparator">' +
                                        '<b class="title">${coordinateSeparator}</b> ' +
                                        '<div class="settingsSelect">' +
                                            '<select>' +
                                                '<option value="" selected disabled>${choose}</option>' +
                                                '<option value="tab">${delimeters.tab}</option>' +
                                                '<option value="space">${delimeters.space}</option>' +
                                                '<option value="comma">${delimeters.comma}</option>' +
                                                '<option value="semicolon">${delimeters.semicolon}</option>' +
                                            '</select>' +
                                        '</div>' +
                                        '<div class="infolink icon-info" data-selection="coordinateSeparator"></div>' +
                                    '</div>' +
                                    '<% if (obj.export === true) { %> ' +
                                        '<div class="selection-wrapper lineSeparator">' +
                                            '<b class="title">${lineSeparator}</b> ' +
                                            '<div class="settingsSelect">' +
                                                '<select>' +
                                                    '<option value="win">Windows / DOS</option>' +
                                                    '<option value="unix">Unix</option>' +
                                                    '<option value="mac">MacOS</option>' +
                                                '</select>' +
                                            '</div>' +
                                            '<div class="infolink icon-info" data-selection="lineSeparator"></div>' +
                                        '</div>' +
                                    '<% } %> ' +
                                    '<label class="lbl prefixId">' +
                                        '<input class="chkbox" type="checkbox">' +
                                        '<span>${prefixId}</span>' +
                                        '<div class="infolink icon-info" data-selection="prefixId"></div>' +
                                    '</label>' +
                                    '<label class="lbl reverseCoordinates">' +
                                        '<input class="chkbox" type="checkbox">' +
                                        '<span>${reverseCoords}</span>' +
                                        '<div class="infolink icon-info" data-selection="reverseCoordinates"></div>' +
                                    '</label> ' +
                                    '<% if (obj.export === true) { %>' +
                                        '<label class="lbl writeHeader">' +
                                            '<input class="chkbox" type="checkbox">' +
                                            '<span>${writeHeader}</span>' +
                                            '<div class="infolink icon-info" data-selection="writeHeader"></div>' +
                                        '</label>' +
                                        '<label class="lbl lineEnds">' +
                                            '<input class="chkbox" type="checkbox">' +
                                            '<span>${lineEnds}</span>' +
                                            '<div class="infolink icon-info" data-selection="lineEnds"></div>' +
                                        '</label>' +
                                        '<label class="lbl useCardinals">' +
                                            '<input class="chkbox" type="checkbox">' +
                                            '<span>${useCardinals}</span>' +
                                            '<div class="infolink icon-info" data-selection="useCardinals"></div>' +
                                        '</label>' +
                                    '<% } %>' +
                                '</div>' +
                            '</div>'
            )
        };
    }, {
        getElement: function () {
            return this.element;
        },
        setElement: function (el) {
            this.element = el;
        },
        getName: function () {
            return 'Oskari.coordinatetransformation.view.FileHandler';
        },
        getSettings: function () {
            // force unit to metric for non-degree systems
            if (this.degreeSystem === false && this.settings.selects) {
                this.settings.selects.unit = 'metric';
            }
            return this.settings;
        },
        setIsDegreeSystem: function (isDegree) {
            this.degreeSystem = !!isDegree;
        },
        create: function () {
            var fileSettings,
                element;
            fileSettings = {
                export: false,
                fileName: this.loc('fileSettings.export.fileName'),
                decimalSeparator: this.loc('fileSettings.options.decimalSeparator'),
                coordinateSeparator: this.loc('fileSettings.options.coordinateSeparator'),
                prefixId: this.loc('fileSettings.options.useId'),
                reverseCoords: this.loc('fileSettings.options.reverseCoords'),
                headerCount: this.loc('fileSettings.options.headerCount'),
                decimalCount: this.loc('fileSettings.options.decimalCount'),
                units: this.loc('fileSettings.options.degreeFormat'),
                delimeters: this.loc('fileSettings.options.delimeters'),
                writeHeader: this.loc('fileSettings.options.writeHeader'),
                lineEnds: this.loc('fileSettings.options.lineEnds'),
                useCardinals: this.loc('fileSettings.options.useCardinals'),
                lineSeparator: this.loc('fileSettings.options.lineSeparator.label'),
                choose: this.loc('fileSettings.options.choose')
            };
            if (this.type === 'export') {
                fileSettings.export = true;
            }
            element = jQuery(this._template.settings(fileSettings));
            if (this.type === 'import') {
                this.fileInput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', {
                    'allowMultipleFiles': false,
                    'maxFileSize': 50,
                    'allowedFileTypes': ['text/plain', 'text/csv'],
                    'allowedFileExtensions': ['txt', 'csv'],
                    'showNoFile': false
                });
                element.find('.fileInput').append(this.fileInput.getElement());
            }
            this.setElement(element);
            this.setTooltips();
        },
        /*createEventHandlers: function ( dialog ) {
            var me = this;
            jQuery( '.oskari-coordinate-form' ).on('click', '.done', function () {
                me.trigger('GetSettings', me.getFormSelections() );
                dialog.close();
            });

            jQuery( '.oskari-coordinate-form' ).on('click', '.cancel', function () {
                dialog.close();
            });
        },*/
        /**
         * @method getFormSelections
         */
        getFormSelections: function () {
            //var element = jQuery('.oskari-coordinate-form');
            var element = this.getElement();
            var settings = {
                fileName: element.find('.fileName input').val(),
                unit: element.find('.unitFormat option:checked').val(),
                decimalSeparator: element.find('.decimalSeparator option:checked').val(),
                coordinateSeparator: element.find('.coordinateSeparator option:checked').val(),
                prefixId: element.find('.prefixId input').is(':checked'),
                axisFlip: element.find('.reverseCoordinates input').is(':checked'),
                headerLineCount: element.find('.headerLineCount input').val(),
                lineSeparator: element.find('.lineSeparator option:checked').val(),
                decimalCount: element.find('.decimalCount input').val(),
                writeHeader: element.find('.writeHeader input').is(':checked'),
                writeLineEndings: element.find('.lineEnds').is(':checked'),
                writeCardinals: element.find('.useCardinals input').is(':checked')
            };
            return settings;
        },
        showFileDialogue: function (callback) {
            if (this.dialog) {
                this.dialog.close(true);
                this.dialog = null;
            }
            var me = this;
            var elem = this.getElement();
            var formatRow = elem.find('.unitFormat');
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var title = this.type === 'import' ? this.loc('fileSettings.import.title') : this.loc('fileSettings.export.title');
            var btnText = this.type === 'import' ? this.loc('actions.done') : this.loc('actions.export');
            var cancelBtn = dialog.createCloseButton(this.loc('actions.cancel'));
            var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            var decimalInput = elem.find('.decimalCount input');
            btn.addClass('primary');
            btn.setTitle(btnText);
            btn.setHandler(function () {
                me.settings.selects = me.getFormSelections();
                if (me.type === 'import') {
                    me.settings.file = me.fileInput.getFiles();
                }
                me.settings.type = me.type;
                if (me.helper.validateFileSelections(me.getSettings()) === false) {
                    return;
                }
                if (typeof callback === 'function') {
                    callback(me.getSettings());
                }
                dialog.close();
            });
            dialog.createCloseIcon();
            dialog.makeDraggable();
            if (this.degreeSystem === false) {
                formatRow.css('display','none');
                decimalInput.val(3);
            } else {
                formatRow.css('display','');
                decimalInput.val(8);
            }
            this.bindInfoLinks();
            //when degree unit is changed, change also default decimal value
            elem.find('.unitFormat select').on('change', function () {
                var decimals = jQuery(this).find(':checked').data('decimals');
                decimalInput.val(decimals);
            });
            // HACK //
            //TODO handle listeners if fileinput is moved to file settings form instead of flyout
            if (this.type === 'import' && jQuery._data(this.fileInput.getElement().get(0), 'events') === undefined) {
                this.fileInput._bindAdvancedUpload();
            }
            dialog.show(title, elem, [cancelBtn, btn]);
            this.dialog = dialog;
            //this.createEventHandlers( dialog );

        },
        bindInfoLinks: function () {
            var me = this;
            this.getElement().find('.infolink').on('click', function (event) {
                event.preventDefault();
                var key = this.dataset.selection;
                me.infoPopup.show(jQuery(this), key, true);
            });
        },
        setTooltips: function () {
            var infoElems = this.getElement().find('.infolink');
            var infoLoc = this.loc('infoPopup');
            infoElems.each(function () {
                var key = this.dataset.selection;
                var tooltip = infoLoc[key].info;
                if (tooltip) {
                    jQuery(this).prop('title', tooltip);
                }
            });
        }/*,
        showInfoPopup: function(){
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var btn = dialog.createCloseButton(this.loc('actions.ok'));
            btn.addClass('primary');
            btn.setHandler( function () {
                dialog.close(true);
            });
            dialog.show("title", "info", [btn]);
            dialog.moveTo(this);
            dialog.makeDraggable();

        },*/
        /*
        exportFile: function ( settings ) {
            var exportArray = this.dataHandler.getOutputCoords();
            //this.dataHandler.getCoordinateObject().forEach( function ( pair ) {
            //    exportArray.push( pair.input );
            //});
            if( exportArray.length !== 0 ) {
                this.fileInput.exportToFile( exportArray, settings.filename+'.txt' );
            } else {
                Oskari.log(this.getName()).warn("No transformed coordinates to write to file!");
            }
        }*/
    }
);
