Oskari.clazz.define('Oskari.coordinatetransformation.view.FileHandler',
    function (dataHandler, loc) {
        var me = this;
        Oskari.makeObservable(this);
        me.dataHandler = dataHandler;
        me.loc = loc;
        me.element = null;
        me._template = {
            settings: _.template(' <div class="oskari-coordinate-form">' +
                                    '<% if (typeof(filename) !== "undefined") { %> '+
                                        '<div class="fileRow"> <b class="title">${filename}</b> <input id="filename" type="text"> </div>'+
                                    '<% } %>'+            
                                    '<div class="formatRow"> '+
                                    '<b class="title">${format}</b> '+
                                    '<div class="settingsSelect">'+
                                        '<select id="unit">'+
                                            '<option value="degree">${degree}</option>'+
                                            '<option value="gradian">${gradian}</option>'+
                                            '<option value="radian">${radian}</option>'+
                                        '</select>'+
                                    '</div>'+
                                    '<label class="lbl"><input id="prefixId" class="chkbox" type="checkbox">${id}</label>'+
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
                                    '<% if(typeof(fileExport) !== "undefined") { %>'+
                                        '<input id="overlay-btn" class="export" type="button" value="${fileExport}" />'+
                                    '<% } else { %>'+
                                        '<input id="overlay-btn" class="import" type="button" value="${done}" />' +
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
            this.element = jQuery(el);
        },
        getName: function() {
            return 'Oskari.coordinatetransformation.view.FileHandler';
        },
        create: function( type ) {
            var fileSettings;
            if ( type === "export" ) {
                fileSettings = this._template.settings({
                    title: this.loc.filesetting.export.title,
                    filename:this.loc.filesetting.export.filename,
                    fileExport: this.loc.utils.export,
                    format: this.loc.filesetting.general.format,
                    decimalseparator: this.loc.filesetting.general.decimalseparator,
                    id: this.loc.filesetting.general.id,
                    reversecoords: this.loc.filesetting.general.reversecoords,
                    headercount: this.loc.filesetting.general.headercount,
                    cancel: this.loc.utils.cancel,
                    degree:this.loc.filesetting.general.degree,
                    gradian:this.loc.filesetting.general.gradian,
                    radian: this.loc.filesetting.general.radian,
                    point:this.loc.filesetting.general.point,
                    comma: this.loc.filesetting.general.comma
                });
            } else {
                fileSettings = this._template.settings({
                    format: this.loc.filesetting.general.format,
                    decimalseparator: this.loc.filesetting.general.decimalseparator,
                    id: this.loc.filesetting.general.id,
                    reversecoords: this.loc.filesetting.general.reversecoords,
                    headercount: this.loc.filesetting.general.headercount,
                    cancel: this.loc.utils.cancel,
                    done: this.loc.utils.done,
                    degree:this.loc.filesetting.general.degree,
                    gradian:this.loc.filesetting.general.gradian,
                    radian: this.loc.filesetting.general.radian,
                    point: this.loc.filesetting.general.point,
                    comma: this.loc.filesetting.general.comma 
                });
            }

            this.setElement( fileSettings );
        },
        createEventHandlers: function () {
            var me = this;
            jQuery( '.oskari-coordinate-form' ).on('click', '.import', function () {
                me.trigger('GetSettings', me.getImportSettings() );
            });
            jQuery( 'oskari-coordinate-form' ).on('click', '.export', function () {
                me.trigger('GetSettings', me.getExportSettings() );
            });
            jQuery( '.oskari-coordinate-form' ).on('click', '.cancel', function () {

            });
        },
        /**
         * @method getExportSettings
         */
        getExportSettings: function () {
            var element = jQuery('.oskari-coordinate-form');
            var settings = {
                filename: element.find('#filename').val(),
                unit: element.find('#unit option:checked').val(),
                decimalSeparator: element.find('#decimalseparator option:checked').val(),
                prefixId: element.find('#prefixId').is(":checked"),
                axisFlip: element.find('#reversecoordinates').is(":checked"),
                headerLineCount: element.find('#headerrow').val(),
            }
            return settings;
        },
        /**
         * @method getImportSettings
         */
        getImportSettings: function () {
            var element = jQuery('.oskari-coordinate-form');
            var settings = {
                unit: element.find('#unit option:checked').val(),
                decimalseparator: element.find('#decimalseparator option:checked').val(),
                prefixId: element.find('#prefixId').is(":checked"),
                axisFlip: element.find('#reversecoordinates').is(":checked"),
                headerLineCount: element.find('#headerrow').val()
            }
            return settings;
        },
        showFileDialogue: function() {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.makeDraggable();
            dialog.createCloseIcon();
            dialog.show(this.loc.filesetting.export.title, jQuery( this.getElement() ));
            this.createEventHandlers();
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
        }
    }
);
 