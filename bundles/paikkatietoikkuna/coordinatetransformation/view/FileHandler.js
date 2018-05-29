Oskari.clazz.define('Oskari.coordinatetransformation.view.FileHandler',
    function (helper, loc, type) {
        var me = this;
        Oskari.makeObservable(this);
        me.helper = helper;
        me.loc = loc;
        me.element = null;
        me.type = type; // import, export
        me.settings;
        me.showFormatRow = true;
        me._template = {
            settings: _.template('<div class="oskari-coordinate-form">' +
                                    '<% if (obj.export === true) { %> '+
                                        '<div class="fileRow">' +
                                            '<b class="title">${fileName}</b>' +
                                            '<input id="filename" type="text">' +
                                        '</div>'+
                                        '<div class="decimalCountLine"> '+
                                            '<b class="title">${decimalCount}</b>'+
                                            '<input id="decimals" type="number" value="0" min="0" max = "20" required> '+
                                            '<div class="infolink icon-info"></div>' +
                                        '</div>'+
                                        '<div class="lineSeparatorRow"> '+
                                            '<b class="title">${lineSeparator}</b> '+
                                            '<div class="settingsSelect">'+
                                                '<select id="lineSeparator">'+
                                                    '<option value="win">Windows / DOS</option>'+
                                                    '<option value="unix">Unix</option>'+
                                                    '<option value="mac">MacOS</option>'+
                                                '</select>'+
                                            '</div>'+
                                            '<div class="infolink icon-info"></div>' +
                                        '</div>'+
                                    '<% } else { %>'+
                                        '<div class="headerLineCount"> '+
                                            '<b class="title">${headerCount}</b>'+
                                            '<input id="headerrow" type="number" value="0" min="0" required> '+
                                            '<div class="infolink icon-info"></div>' +
                                        '</div>'+
                                    '<% } %> ' +
                                    '<div class="formatRow"> '+
                                        '<b class="title">${format}</b> '+
                                        '<div class="settingsSelect">'+
                                            '<select id="unit">'+
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
                                        '<div class="infolink icon-info"></div>' +
                                    '</div>'+
                                    '<div class="decimalSeparator"> '+
                                        '<b class="title">${decimalSeparator}</b> '+
                                        '<div class="settingsSelect">'+
                                            '<select id="decimalSeparator">'+
                                                '<option value=".">${point}</option>'+
                                                '<option value=",">${comma}</option>'+
                                            '</select>'+
                                        '</div>' +
                                        '<div class="infolink icon-info"></div>' +
                                    '</div>' +
                                    '<div class="coordinateSeparator"> '+
                                        '<b class="title">${coordinateSeparator}</b> '+
                                        '<div class="settingsSelect">'+
                                            '<select id="coordinateSeparator">'+
                                                '<option value="tab">${tab}</option>'+
                                                '<option value="space">${space}</option>'+
                                                '<option value="comma">${comma}</option>'+
                                            '</select>'+
                                        '</div>' +
                                        '<div class="infolink icon-info"></div>' +
                                    '</div>' +
                                    '<label class="lbl">' +
                                        '<input id="prefixId" class="chkbox" type="checkbox">' +
                                        '<span>${prefixId}</span>' +
                                        '<div class="infolink icon-info"></div>' +
                                    '</label>'+
                                    '<label class="lbl">' +
                                        '<input id="reversecoordinates" class="chkbox" type="checkbox">' +
                                        '<span>${reverseCoords}</span>' +
                                        '<div class="infolink icon-info"></div>' +
                                    '</label> '+
                                    '<% if (obj.export === true) { %> '+
                                        '<label class="lbl">' +
                                            '<input id="writeHeader" class="chkbox" type="checkbox">' +
                                            '<span>${writeHeader}</span>' +
                                            '<div class="infolink icon-info"></div>' +
                                        '</label>'+
                                        '<label class="lbl">' +
                                            '<input id="lineEnds" class="chkbox" type="checkbox">' +
                                            '<span>${lineEnds}</span>' +
                                            '<div class="infolink icon-info"></div>' +
                                        '</label>'+
                                        '<label class="lbl">' +
                                            '<input id="useCardinals" class="chkbox" type="checkbox">' +
                                            '<span>${useCardinals}</span>' +
                                            '<div class="infolink icon-info"></div>' +
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
            this.element = jQuery(el);
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
                tab: this.loc('fileSettings.options.delimeters.tab'),
                space: this.loc('fileSettings.options.delimeters.space'),
                writeHeader: this.loc('fileSettings.options.writeHeader'),
                lineEnds: this.loc('fileSettings.options.lineEnds'),
                useCardinals: this.loc('fileSettings.options.useCardinals'),
                lineSeparator: this.loc('fileSettings.options.lineSeparator.label')
            };
            if (this.type === "export"){
                fileSettings.export = true;
            }
            element = this._template.settings(fileSettings);
            this.setElement( element );
            this.bindInfoLinks();
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
                fileName: element.find('#filename').val(),
                unit: element.find('#unit option:checked').val(),
                decimalSeparator: element.find('#decimalSeparator option:checked').val(),
                coordinateSeparator: element.find('#coordinateSeparator option:checked').val(),
                prefixId: element.find('#prefixId').is(":checked"),
                axisFlip: element.find('#reversecoordinates').is(":checked"),
                headerLineCount: element.find('#headerrow').val(),
                lineSeparator: element.find("#lineSeparator").val(),
                decimalCount: element.find('#decimals').val(),
                writeHeader: element.find('#writeHeader').is(":checked"),
                writeLineEndings: element.find('#lineEnds').is(":checked"),
                writeCardinals: element.find('#useCardinals').is(":checked")
            }
            return settings;
        },
        showFileDialogue: function(callback, requireFileName) {
            var me = this;
            var elem = this.getElement();
            var formatRow = elem.find('.formatRow');
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var title = this.type === "import" ? this.loc('fileSettings.import.title') : this.loc('fileSettings.export.title');
            var btnText = this.type === "import" ? this.loc('actions.done') : this.loc('actions.export');
            var cancelBtn =  dialog.createCloseButton(this.loc('actions.cancel'));
            var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            btn.setTitle(btnText);
            btn.setHandler(function() {
                me.settings = me.getFormSelections();
                if (me.helper.validateFileSelections(me.settings, requireFileName) === false){
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

            dialog.show(title, elem, [cancelBtn, btn]);
            //this.createEventHandlers( dialog );
        },
        bindInfoLinks: function () {
            var me = this;
            this.getElement().find('.infolink').on('click', function ( event ) {
                event.preventDefault();
                me.showInfoPopup();
            });
        },
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

        },
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
 