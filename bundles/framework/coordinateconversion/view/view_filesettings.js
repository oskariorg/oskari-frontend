Oskari.clazz.define('Oskari.framework.bundle.coordinateconversion.view.filesettings',
    function (instance, loc) {
        var me = this;
        me.instance = instance; 
        me.loc = loc;
        me.element = {
            import: null, 
            export: null
        }
        me._template = {
            import: _.template(' <div class="oskari-import" style=display:none;> </br> ' +
                                    '<h5> </h5>'+
                                    '<div></div>'+
                                    '<div></div>'+
                                    '<div></div>'+
                                '</div>'
                                ),
            export: _.template(' <div class="oskari-export">' +
                                    '<div class="filerow"> <b class="title"><%= filename %></b> <input id="filename" type="text"> </div>'+
                                    '<div class="formatrow"> <b class="title"><%= format %></b> <div class="file-select">'+
                                    '<select>'+
                                        '<option value="volvo">Volvo</option>'+
                                        '<option value="saab">Saab</option>'+
                                        '<option value="mercedes">Mercedes</option>'+
                                        '<option value="audi">Audi</option>'+
                                        '</select></div>'+
                                    '<label class="lbl"><input id="useid" class="chkbox" type="checkbox"><%= id %></label> </div>'+
                                    '<div class="separatorrow"> <b class="title"><%= decimalseparator %></b> <div class="file-select">'+
                                    '<select>'+
                                        '<option value="volvo">Volvo</option>'+
                                        '<option value="saab">Saab</option>'+
                                        '<option value="mercedes">Mercedes</option>'+
                                        '<option value="audi">Audi</option>'+
                                    '</select>'+
                                    '</div>' +
                                    '<label class="lbl"> <input id="reversecoordinates" class="chkbox" type="checkbox"> <%= reversecoords %></label> </div>' +
                                    '<div class="headerrow">  <b class="title"><%= headercount %></b> <input id="headerrow" type="text"> </div>'+
                                    '<input id="overlay-btn" class="cancel" type="button" value="<%= cancel %> " />' +
                                    '<input id="overlay-btn" class="export" type="button" value="<%= fileexport %>" />' +
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
            return 'Oskari.framework.bundle.coordinateconversion.view.filesettings';
        },
        create: function() {
            var me = this;
            var fileexport = this._template.export({ title: me.loc.filesetting.export.title,
                                                      filename:me.loc.filesetting.export.filename,
                                                      format: me.loc.filesetting.export.format,
                                                      decimalseparator: me.loc.filesetting.export.decimalseparator,
                                                      id: me.loc.filesetting.export.id,
                                                      reversecoords: me.loc.filesetting.export.reversecoords,
                                                      headercount: me.loc.filesetting.export.headercount,
                                                      cancel: me.loc.utils.cancel,
                                                      fileexport: me.loc.utils.export
                                                    });
            var fileimport = this._template.import();
            this.setElement( { import: fileimport, export: fileexport } );
            // this.handleButtons();
        },
        /**
         * @method getExportSettings
         * {function} callback, send the settings back to callback-function
         * {context} context in which to look for elements
         */
        getExportSettings: function (cb, ctx) {
            jQuery(ctx).find('.export').on("click", function () {
                var settings = {
                    filename: jQuery(this).parent().find('#filename').val(),
                    angle: null,
                    id: jQuery(this).parent().find('#useid').is(":checked"),
                    reversecoordinates: jQuery(this).parent().find('#reversecoordinates').is(":checked"),
                    headerrow: jQuery(this).parent().find('#headerrow').val(),
                }
                cb( settings );
            });
        },
        /**
         * @method getImportSettings
         * {function} callback, send the settings back to callback-function
         * {context} context in which to look for elements
         */
        getImportSettings: function (cb) {
            jQuery( ctx ).find('.import').on("click", function () {
                var settings = {

                }
                cb( settings );
            });
        }
    }
);
 