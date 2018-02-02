Oskari.clazz.define('Oskari.coordinatetransformation.view.filesettings',
    function (instance, loc) {
        var me = this;
        me.instance = instance; 
        me.loc = loc;
        me.element = {
            import: null, 
            export: null
        }
        me._template = {
            import: _.template(' <div class="oskari-import" > </br> ' +
                                    '<div class="formatrow"> <b class="title"><%= format %></b> <div class="file-select">'+
                                    '<select id="angletype">'+
                                        '<option value="degree"><%= degree %></option>'+
                                        '<option value="gradian"><%= gradian %></option>'+
                                        '<option value="radian"><%= radian %></option>'+
                                        '</select></div>'+
                                    '<label class="lbl"><input id="useid" class="chkbox" type="checkbox"><%= id %></label> </div>'+
                                    '<div class="separatorrow"> <b class="title"><%= decimalseparator %></b> <div class="file-select">'+
                                    '<select id="decimalseparator">'+
                                        '<option value="point"><%= point %></option>'+
                                        '<option value="comma"><%= comma %></option>'+
                                    '</select>'+
                                    '</div>' +
                                    '<label class="lbl"> <input id="reversecoordinates" class="chkbox" type="checkbox"> <%= reversecoords %></label> </div>' +
                                    '<div class="headerrow">  <b class="title"><%= headercount %></b> <input id="headerrow" type="number"> </div>'+
                                    '<input id="overlay-btn" class="cancel" type="button" value="<%= cancel %> " />' +
                                    '<input id="overlay-btn" class="import" type="button" value="<%= done %>" />' +
                                '</div>'
                                ),
            export: _.template(' <div class="oskari-export">' +
                                    '<div class="filerow"> <b class="title"><%= filename %></b> <input id="filename" type="text"> </div>'+
                                    '<div class="formatrow"> <b class="title"><%= format %></b> <div class="file-select">'+
                                    '<select id="angletype">'+
                                        '<option value="degree"><%= degree %></option>'+
                                        '<option value="gradian"><%= gradian %></option>'+
                                        '<option value="radian"><%= radian %></option>'+
                                        '</select></div>'+
                                    '<label class="lbl"><input id="useid" class="chkbox" type="checkbox"><%= id %></label> </div>'+
                                    '<div class="separatorrow"> <b class="title"><%= decimalseparator %></b> <div class="file-select">'+
                                    '<select id="decimalseparator">'+
                                        '<option value="point"><%= point %></option>'+
                                        '<option value="comma"><%= comma %></option>'+
                                    '</select>'+
                                    '</div>' +
                                    '<label class="lbl"> <input id="reversecoordinates" class="chkbox" type="checkbox"> <%= reversecoords %></label> </div>' +
                                    '<div class="headerrow">  <b class="title"><%= headercount %></b> <input id="headerrow" type="number"> </div>'+
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
            return 'Oskari.coordinatetransformation.view.filesettings';
        },
        create: function() {
            var me = this;
            var fileexport = this._template.export({ title: me.loc.filesetting.export.title,
                                                      filename:me.loc.filesetting.export.filename,
                                                      format: me.loc.filesetting.general.format,
                                                      decimalseparator: me.loc.filesetting.general.decimalseparator,
                                                      id: me.loc.filesetting.general.id,
                                                      reversecoords: me.loc.filesetting.general.reversecoords,
                                                      headercount: me.loc.filesetting.general.headercount,
                                                      cancel: me.loc.utils.cancel,
                                                      fileexport: me.loc.utils.export,
                                                      degree:me.loc.filesetting.general.degree,
                                                      gradian:me.loc.filesetting.general.gradian,
                                                      radian: me.loc.filesetting.general.radian,
                                                      point: me.loc.filesetting.general.point,
                                                      comma: me.loc.filesetting.general.comma
                                                    });
            var fileimport = this._template.import({   format: me.loc.filesetting.general.format,
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
        getExportSettings: function (cb, ctx, caller) {
            jQuery(ctx).find('.export').on("click", function () {
                var el = jQuery(this).parent();
                var settings = {
                    filename: el.find('#filename').val(),
                    angle: el.find('#angletype option:checked').val(),
                    decimalseparator: el.find('#decimalseparator option:checked').val(),
                    id: el.find('#useid').is(":checked"),
                    reversecoordinates: el.find('#reversecoordinates').is(":checked"),
                    headerrow: el.find('#headerrow').val(),
                }
                cb( settings );
                if( caller ) {
                    caller.close(true);
                }
            });
            jQuery( ctx ).find('.cancel').on("click", function () {
                if( caller ) {
                    caller.close(true);
                }
            });
        },
        /**
         * @method getImportSettings
         * {function} callback, send the settings back to callback-function
         * {context} context in which to look for elements
         */
        getImportSettings: function (cb, ctx, caller) {
            jQuery( ctx ).find('.import').on("click", function () {
            var el = jQuery(this).parent();
            var settings = {
                    angle: el.find('#angletype option:checked').val(),
                    decimalseparator: el.find('#decimalseparator option:checked').val(),
                    id: el.find('#useid').is(":checked"),
                    reversecoordinates: el.find('#reversecoordinates').is(":checked"),
                    headerrow: el.find('#headerrow').val(),
                }
                cb( settings );
                if( caller ) {
                    caller.close(true);
                }
            });
            jQuery( ctx ).find('.cancel').on("click", function () {
                if( caller ) {
                    caller.close(true);
                }
            });
        }
    }
);
 