Oskari.clazz.define('Oskari.coordinatetransformation.view.FileHandler',
    function (helper, loc, type) {
        var me = this;
        Oskari.makeObservable(this);
        me.helper = helper;
        me.loc = loc;
        me.element = null;
        me.type = type; // import, export
        me.infoPopup = Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateSystemInformation');
        me.fileInput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', {
            'allowMultipleFiles': false,
            'maxFileSize': 50,
            'allowedFileTypes': ["text/plain"],
            'showNoFile': false
        });
        me.settings = {};
        me.dialog;
        me.showFormatRow = true;
        me._template = {
            settings: _.template('<div class="coordinatetransformation-file-form">' +
                                    '<% if (obj.export === true) { %> '+
                                        '<div class="selection-wrapper fileName without-infolink">' +
                                            '<b class="title">${fileName}</b>' +
                                            '<input type="text">' +
                                            //'<div class="infolink icon-info" data-selection="fileName"></div>' +
                                        '</div>'+
                                        '<div class="selection-wrapper decimalCount">'+
                                            '<b class="title">${decimalCount}</b>'+
                                            '<input type="number" value="0" min="0" max = "20" required> '+
                                            '<div class="infolink icon-info" data-selection="decimalCount"></div>' +
                                        '</div>'+
                                        '<div class="selection-wrapper lineSeparator">'+
                                            '<b class="title">${lineSeparator}</b> '+
                                            '<div class="settingsSelect">'+
                                                '<select>'+
                                                    '<option value="win">Windows / DOS</option>'+
                                                    '<option value="unix">Unix</option>'+
                                                    '<option value="mac">MacOS</option>'+
                                                '</select>'+
                                            '</div>'+
                                            '<div class="infolink icon-info" data-selection="lineSeparator"></div>' +
                                        '</div>'+
                                    '<% } else { %>'+
                                        '<div class="selection-wrapper fileInput without-infolink"></div>'+
                                        '<div class="selection-wrapper headerLineCount">'+
                                            '<b class="title">${headerCount}</b>'+
                                            '<input type="number" value="0" min="0" required> '+
                                            '<div class="infolink icon-info" data-selection="headerLineCount"></div>' +
                                        '</div>'+
                                    '<% } %> ' +
                                    '<div class="selection-wrapper unitFormat">'+
                                        '<b class="title">${format}</b> '+
                                        '<div class="settingsSelect">'+
                                            '<select>'+
                                                '<option value="degree">${degree}</option>'+
                                                '<option value="gradian">${gradian}</option>'+
                                                '<option value="radian">${radian}</option>'+
                                                '<option value="DD">DD</option>'+
                                                '<option value="DD MM SS">DD MM SS</option>'+
                                                '<option value="DD MM">DD MM</option>'+
                                                '<option value="DDMMSS">DDMMSS</option>'+
                                                '<option value="DDMM">DDMM</option>'+
                                            '</select>'+
                                        '</div>'+
                                        '<div class="infolink icon-info" data-selection="unitFormat"></div>' +
                                    '</div>'+
                                    '<div class="selection-wrapper decimalSeparator">'+
                                        '<b class="title">${decimalSeparator}</b> '+
                                        '<div class="settingsSelect">'+
                                            '<select>'+
                                                '<option value="" selected disabled>${choose}</option>'+
                                                '<option value=".">${point}</option>'+
                                                '<option value=",">${comma}</option>'+
                                            '</select>'+
                                        '</div>' +
                                        '<div class="infolink icon-info" data-selection="decimalSeparator"></div>' +
                                    '</div>' +
                                    '<div class="selection-wrapper coordinateSeparator">'+
                                        '<b class="title">${coordinateSeparator}</b> '+
                                        '<div class="settingsSelect">'+
                                            '<select>'+
                                                '<option value="" selected disabled>${choose}</option>'+
                                                '<option value="tab">${tab}</option>'+
                                                '<option value="space">${space}</option>'+
                                                '<option value="comma">${comma}</option>'+
                                                '<option value="semicolon">${semicolon}</option>'+
                                            '</select>'+
                                        '</div>' +
                                        '<div class="infolink icon-info" data-selection="coordinateSeparator"></div>' +
                                    '</div>' +
                                    '<label class="lbl prefixId">' +
                                        '<input class="chkbox" type="checkbox">' +
                                        '<span>${prefixId}</span>' +
                                        '<div class="infolink icon-info" data-selection="prefixId"></div>' +
                                    '</label>'+
                                    '<label class="lbl reverseCoordinates">' +
                                        '<input class="chkbox" type="checkbox">' +
                                        '<span>${reverseCoords}</span>' +
                                        '<div class="infolink icon-info" data-selection="reverseCoordinates"></div>' +
                                    '</label> '+
                                    '<% if (obj.export === true) { %>'+
                                        '<label class="lbl writeHeader">' +
                                            '<input class="chkbox" type="checkbox">' +
                                            '<span>${writeHeader}</span>' +
                                            '<div class="infolink icon-info" data-selection="writeHeader"></div>' +
                                        '</label>'+
                                        '<label class="lbl lineEnds">' +
                                            '<input class="chkbox" type="checkbox">' +
                                            '<span>${lineEnds}</span>' +
                                            '<div class="infolink icon-info" data-selection="lineEnds"></div>' +
                                        '</label>'+
                                        '<label class="lbl useCardinals">' +
                                            '<input class="chkbox" type="checkbox">' +
                                            '<span>${useCardinals}</span>' +
                                            '<div class="infolink icon-info" data-selection="useCardinals"></div>' +
                                        '</label>'+
                                    '<% } %>' +
                                '</div>' +
                            '</div>'
                                )
        } 
    }, {
        getElement: function() {
            return this.element;
        },
        setElement: function( el ) {
            this.element = el;
        },
        getName: function() {
            return 'Oskari.coordinatetransformation.view.FileHandler';
        },
        getSettings: function (){
            return this.settings;
        },
        setShowFormatRow: function (visible){
            this.showFormatRow = !!visible;
        },
        create: function() {
            var fileSettings,
                element;
            fileSettings = {
                export: false,
                fileName: this.loc('fileSettings.export.fileName'),
                format: this.loc('fileSettings.options.degreeFormat.label'),
                decimalSeparator: this.loc('fileSettings.options.decimalSeparator'),
                coordinateSeparator: this.loc('fileSettings.options.coordinateSeparator'),
                prefixId: this.loc('fileSettings.options.useId'),
                reverseCoords: this.loc('fileSettings.options.reverseCoords'),
                headerCount: this.loc('fileSettings.options.headerCount'),
                decimalCount: this.loc('fileSettings.options.decimalCount'),
                degree: this.loc('fileSettings.options.degreeFormat.degree'),
                gradian: this.loc('fileSettings.options.degreeFormat.gradian'),
                radian: this.loc('fileSettings.options.degreeFormat.radian'),
                point: this.loc('fileSettings.options.delimeters.point'),
                comma: this.loc('fileSettings.options.delimeters.comma'),
                semicolon: this.loc('fileSettings.options.delimeters.semicolon'),
                tab: this.loc('fileSettings.options.delimeters.tab'),
                space: this.loc('fileSettings.options.delimeters.space'),
                writeHeader: this.loc('fileSettings.options.writeHeader'),
                lineEnds: this.loc('fileSettings.options.lineEnds'),
                useCardinals: this.loc('fileSettings.options.useCardinals'),
                lineSeparator: this.loc('fileSettings.options.lineSeparator.label'),
                choose: this.loc('fileSettings.options.choose')
            };
            if (this.type === "export"){
                fileSettings.export = true;
            }
            element = jQuery(this._template.settings(fileSettings));
            if (this.type === "import"){
                element.find('.fileInput').append(this.fileInput.getElement());
                //fileSettings.fileInput = this.fileInput.getElement();
            }
            this.setElement( element );
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
                prefixId: element.find('.prefixId input').is(":checked"),
                axisFlip: element.find('.reverseCoordinates input').is(":checked"),
                headerLineCount: element.find('.headerLineCount input').val(),
                lineSeparator: element.find(".lineSeparator option:checked").val(),
                decimalCount: element.find('.decimalCount input').val(),
                writeHeader: element.find('.writeHeader input').is(":checked"),
                writeLineEndings: element.find('.lineEnds').is(":checked"),
                writeCardinals: element.find('.useCardinals input').is(":checked")
            }
            return settings;
        },
        showFileDialogue: function(callback) {
            if (this.dialog){
                this.dialog.close(true);
                this.dialog = null;
            }
            var me = this;
            var elem = this.getElement();
            var formatRow = elem.find('.unitFormat');
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var title = this.type === "import" ? this.loc('fileSettings.import.title') : this.loc('fileSettings.export.title');
            var btnText = this.type === "import" ? this.loc('actions.done') : this.loc('actions.export');
            var cancelBtn =  dialog.createCloseButton(this.loc('actions.cancel'));
            var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            btn.addClass('primary');
            btn.setTitle(btnText);
            btn.setHandler(function() {
                me.settings.selects = me.getFormSelections();
                me.settings.file = me.fileInput.getFiles();
                me.settings.type = me.type;
                if (me.helper.validateFileSelections(me.settings) === false){
                    return;
                }
                if (typeof callback === "function"){
                    callback(me.settings);
                }
                dialog.close();
            });

            dialog.createCloseIcon();
            dialog.makeDraggable();
            if (this.showFormatRow === false){
                formatRow.css("display","none");
            } else {
                formatRow.css("display","");
            }
            this.bindInfoLinks();
            // HACK //
            //TODO handle listeners if fileinput is moved to file settings form instead of flyout
            if(jQuery._data(this.fileInput.getElement().get(0), "events") === undefined){
                this.fileInput._bindAdvancedUpload();
            }
            dialog.show(title, elem, [cancelBtn, btn]);
            this.dialog = dialog;
            //this.createEventHandlers( dialog );

        },
        bindInfoLinks: function () {
            var me = this;
            this.getElement().find('.infolink').on('click', function ( event ) {
                event.preventDefault();
                var key = this.dataset.selection;
                me.infoPopup.show(jQuery(this), key);
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
 