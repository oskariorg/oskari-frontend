Oskari.clazz.define('Oskari.coordinatetransformation.view.FileHandler',
    function (instance, loc) {
        var me = this;
        me.instance = instance;
        me.dataHandler = instance.dataHandler;
        me.loc = loc;
        me.element = {
            import: null, 
            export: null
        }
        me._userSelections = { import: null, export: null };
        me._template = {
            import: _.template(' <div class="oskari-import" > </br> ' +
                                    '<div class="formatRow"> '+
                                        '<b class="title">${format}</b> '+
                                        '<div class="settingsSelect">'+
                                            '<select id="unit">'+
                                                '<option value="degree">${degree}</option>'+
                                                '<option value="gradian">${gradian}</option>'+
                                                '<option value="radian">${radian}</option>'+
                                            '</select>'+
                                        '</div>'+
                                        '<label class="lbl"><input id="useid" class="chkbox" type="checkbox">${id}</label>'+
                                    '</div>'+
                                    '<div class="decimalSeparator"> '+
                                        '<b class="title">${decimalseparator}</b> '+
                                        '<div class="settingsSelect">'+
                                            '<select id="decimalseparator">'+
                                                '<option value="point">${point}</option>'+
                                                '<option value="comma">${comma}</option>'+
                                            '</select>'+
                                        '</div>' +
                                        '<label class="lbl"> <input id="reversecoordinates" class="chkbox" type="checkbox"> ${reversecoords}</label> '+
                                    '</div>' +
                                    '<div class="headerLineCount"> '+
                                        '<b class="title">${headercount}</b>'+
                                        '<input id="headerrow" type="number"> '+
                                    '</div>'+
                                        '<input id="overlay-btn" class="cancel" type="button" value="${cancel} " />' +
                                        '<input id="overlay-btn" class="import" type="button" value="${done}" />' +
                                    '</div>' +
                                '</div>'
                                ),
            export: _.template(' <div class="oskari-export">' +
                                    '<div class="fileRow"> <b class="title">${filename}</b> <input id="filename" type="text"> </div>'+
                                    '<div class="formatRow"> '+
                                    '<b class="title">${format}</b> '+
                                    '<div class="settingsSelect">'+
                                        '<select id="unit">'+
                                            '<option value="degree">${degree}</option>'+
                                            '<option value="gradian">${gradian}</option>'+
                                            '<option value="radian">${radian}</option>'+
                                        '</select>'+
                                    '</div>'+
                                    '<label class="lbl"><input id="useid" class="chkbox" type="checkbox">${id}</label>'+
                                '</div>'+
                                '<div class="decimalSeparator"> '+
                                    '<b class="title">${decimalseparator}</b> '+
                                    '<div class="settingsSelect">'+
                                        '<select id="decimalseparator">'+
                                            '<option value="point">${point}</option>'+
                                            '<option value="comma">${comma}</option>'+
                                        '</select>'+
                                    '</div>' +
                                    '<label class="lbl"> <input id="reversecoordinates" class="chkbox" type="checkbox"> ${reversecoords}</label> '+
                                '</div>' +
                                '<div class="headerLineCount"> '+
                                    '<b class="title">${headercount}</b>'+
                                    '<input id="headerrow" type="number"> '+
                                '</div>'+
                                    '<input id="overlay-btn" class="cancel" type="button" value="${cancel} " />' +
                                    '<input id="overlay-btn" class="import" type="button" value="${fileExport}" />' +
                                '</div>' +
                                '</div>'
                                ),
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
        create: function() {
            var me = this;
            var fileexport = this._template.export({
                title: me.loc.filesetting.export.title,
                filename:me.loc.filesetting.export.filename,
                format: me.loc.filesetting.general.format,
                decimalseparator: me.loc.filesetting.general.decimalseparator,
                id: me.loc.filesetting.general.id,
                reversecoords: me.loc.filesetting.general.reversecoords,
                headercount: me.loc.filesetting.general.headercount,
                cancel: me.loc.utils.cancel,
                fileExport: me.loc.utils.export,
                degree:me.loc.filesetting.general.degree,
                gradian:me.loc.filesetting.general.gradian,
                radian: me.loc.filesetting.general.radian,
                point: me.loc.filesetting.general.point,
                comma: me.loc.filesetting.general.comma
            });
            var fileimport = this._template.import({
                format: me.loc.filesetting.general.format,
                decimalseparator: me.loc.filesetting.general.decimalseparator,
                id: me.loc.filesetting.general.id,
                reversecoords: me.loc.filesetting.general.reversecoords,
                headercount: me.loc.filesetting.general.headercount,
                cancel: me.loc.utils.cancel,
                done: me.loc.utils.done,
                degree:me.loc.filesetting.general.degree,
                gradian:me.loc.filesetting.general.gradian,
                radian: me.loc.filesetting.general.radian,
                point: me.loc.filesetting.general.point,
                comma: me.loc.filesetting.general.comma 
            });

            this.setElement( { import: fileimport, export: fileexport } );
        },
        /**
         * @method getExportSettings
         * {function} callback, send the settings back to callback-function
         * {context} context in which to look for elements
         */
        getExportSettings: function () {
                var element = jQuery(this.element.export);
                var settings = {
                    filename: element.find('#filename').val(),
                    unit: element.find('#unit option:checked').val(),
                    decimalSeparator: element.find('#decimalseparator option:checked').val(),
                    id: element.find('#useid').is(":checked"),
                    axisFlip: element.find('#reversecoordinates').is(":checked"),
                    headerLineCount: element.find('#headerrow').val(),
                }
                return settings;
        },
        /**
         * @method getImportSettings
         * {function} callback, send the settings back to callback-function
         * {context} context in which to look for elements
         */
        getImportSettings: function () {
            var element = jQuery(this.element.import);
            var settings = {
                    unit: element.find('#unit option:checked').val(),
                    decimalseparator: element.find('#decimalseparator option:checked').val(),
                    id: impelementort.find('#useid').is(":checked"),
                    axisFlip: element.find('#reversecoordinates').is(":checked"),
                    headerLineCount: element.find('#headerrow').val(),
            }
            return settings;
        },
        showFileDialogue: function( content, shouldExport ) {
            var jc = jQuery(content);
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.makeDraggable();
            dialog.createCloseIcon();
            if( shouldExport ) {
                dialog.show(this.loc.filesetting.export.title, jc);
                this.getExportSettings( this.exportFile.bind(this), dialog.getJqueryContent(), dialog );
            } else {
                dialog.show(this.loc.filesetting.import.title, jc);
                var settings = this.getImportSettings();
                debugger;
            }
        },
        importSettings: function ( settings ) {
            this._userSelections = { "import": settings };
        },
        exportFile: function ( settings ) {
            var exportArray = [];
            this.dataHandler.getCoordinateObject().forEach( function ( pair ) {
                exportArray.push( pair.input );
            });  
            if( exportArray.length !== 0 ) {
                this.fileInput.exportToFile( exportArray, settings.filename+'.txt' );
            } else {
                Oskari.log(this.getName()).warn("No transformed coordinates to write to file!");
            }
        },
        getUserFileSettingSelections: function () {
            return this._userSelections;
        }
    }
);
 