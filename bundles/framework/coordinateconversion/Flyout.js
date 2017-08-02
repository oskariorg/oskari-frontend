Oskari.clazz.define('Oskari.framework.bundle.coordinateconversion.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance}
     *        instance reference to component that created the tile
     */
    function( instance ) {
        var me = this;
        me.instance = instance;
        me.container = null;
        me.loc = me.instance.getLocalization("flyout");
        me._template = {
            coordinatesystem: _.template(' <div class="coordinateconversion-csystem"> </br> ' +
                                    '<h4><%= title %></h4>'+
                                    '<span class="datum"><b><%= datum %></b></span> </br> ' +
                                    '<span class="coordsystem"><b><%= coordsystem %></b></span> </br> ' +
                                    '<span class="geodesiccsystem"><b><%= geodesiccsystem%></b></span> </br> ' +
                                    '<span class="heightsystem"><b><%= heightsystem %></b></span> </div>'
                                ),
            coordinatedatasource: _.template('<div class="coordinateconversion-datasource"> </br> ' +
                                            '<h4><%= title %></h4>'+
                                            '<form>'+
                                                '<input type="radio" id="file" name="load" value="1"><label for="file"> <span></span> <%= file %> </label>'+
                                                '<input type="radio" id="clipboard" name="load" value="2"><label for="clipboard"><span></span> <%= clipboard %> </label>'+
                                                '<input type="radio" id="map" name="load" value="3"><label for="map"> <span></span> <%= map %> </label>'+
                                                '<input style="display: none;" id="choose" type="button" value="<%= choose %>">'+
                                            '</form> </div>'),
            datasourceinfo: _.template('<div class="coordinateconversion-datasourceinfo" style=display:none;"></div>' +
                                    '<form method="post" action="", enctype="multipart/form-data" class="box" id="fileinput" style="display:none">'+
                                        '<div class="box__input">'+
                                            '<input type="file" name="file" id="file" class="box__file" />'+
                                            '<label>  <%= fileupload %> <label for="file" style="cursor: pointer;"><a><%= link %></a> </label> </label> '+
                                        '</div>'+
                                        '<div class="box__uploading"> <%= uploading %>&hellip;</div>'+
                                        '<div class="box__success"><%= success %></div>'+
                                        '<div class="box__error"><%= error %></div>'+
                                    '</form>'+
                                    '<div class="coordinateconversion-clipboardinfo" style=display:none;">'+
                                        '<div class="clipboardinfo"> <i><%= clipboardupload %><i> </div>'+
                                    '</div>'
                                    ),  
            conversionfield: jQuery('<div class="coordinateconversion-field"></div>'),
            inputcoordinatefield: _.template('<div class="coordinatefield" style="display:inline-block;">' +
                                        '<h5> <%= input %> </h5>' +
                                        '<table id="coordinatestoconvert" style="border: 1px solid black;">'+
                                        '</table>'+
                                    '</div>'),
            resultcoordinatefield: _.template('<div class="coordinatefield" style="display:inline-block; padding-left: 8px;">' +
                                                    '<h5> <%= result %> </h5>' +
                                                    '<table id="convertedcoordinates" style="border: 1px solid black;">'+
                                                    '</table>'+
                                                '</div>'),
            conversionbutton: _.template('<div class="conversionbtn" style="display:inline-block; padding-left: 8px;">' +
                                            '<span> <input id="convert" type="button" value="<%= convert %> >>"> </span>' +
                                         '</div>'),
            tablerow: _.template('<tr>' +
                                    '<td style=" border: 1px solid black ;">'+
                                    '</td>'+
                                    '<td style=" border: 1px solid black ;">'+
                                    '</td>'+
                                    '<td style=" border: 1px solid black ;">'+
                                    '</td>'+
                                    '</tr>'),
            coordinatefieldbuttons: _.template('<div class="coordinateconverision-buttons">' +
                                        
                                        '</div>')
        }
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function() {
            return 'Oskari.framework.bundle.coordinateconversion.Flyout';
        },
        getTitle: function() {
            return this.loc.flyoutTtitle;
        },
        setEl: function(el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('coordinateconversion-flyout')) {
                jQuery(this.container).addClass('coordinateconversion-flyout');
            }
        },
        createUi: function() {
            var me = this;
            var coordinatesystem = this._template.coordinatesystem({ title: this.loc.coordinatesystem.title,
                                                          datum: this.loc.coordinatesystem.geodesicdatum,
                                                          coordsystem: this.loc.coordinatesystem.coordinatesystem,
                                                          geodesiccsystem:this.loc.coordinatesystem.geodesiccoordinatesystem,
                                                          heightsystem:this.loc.coordinatesystem.heightsystem });

            var coordinatedatasource = this._template.coordinatedatasource({ title: this.loc.datasource.title, 
                                                                             file: this.loc.datasource.file,
                                                                             clipboard: this.loc.datasource.clipboard,
                                                                             map: this.loc.datasource.map,
                                                                             choose: this.loc.datasource.choose });
    
            var inputcoordinatefield = this._template.inputcoordinatefield({  input: this.loc.coordinatefield.input });

            var conversionbutton = this._template.conversionbutton({ convert: this.loc.coordinatefield.convert });

            var resultcoordinatefield = this._template.resultcoordinatefield({ result: this.loc.coordinatefield.result });

            var datasourceinfo = this._template.datasourceinfo({ fileupload: this.loc.datasourceinfo.fileupload,
                                                            link: this.loc.datasourceinfo.link,
                                                            clipboardupload: this.loc.datasourceinfo.clipboardupload,
                                                            uploading: this.loc.datasourceinfo.uploading,
                                                            success: this.loc.datasourceinfo.success,
                                                            error: this.loc.datasourceinfo.error });


            jQuery( coordinatesystem ).find('span').each(function (index) {
               var select = me.createSelect({title:"asd",id:"1"}, "span");
               this.append(select);
            });
            jQuery(this.container).append(coordinatesystem);
            jQuery(this.container).append(coordinatesystem);
            jQuery(this.container).append(coordinatedatasource);
            jQuery(this.container).append(datasourceinfo);

            this._template.conversionfield.append(inputcoordinatefield);
            this._template.conversionfield.append(conversionbutton);
            this._template.conversionfield.append(resultcoordinatefield);
            jQuery(this.container).append(this._template.conversionfield);

            for( var i = 0; i < 10; i++ ) {
                jQuery(this.container).find("#coordinatestoconvert").append(this._template.tablerow);
                jQuery(this.container).find("#convertedcoordinates").append(this._template.tablerow);
            }

        jQuery('input[type=radio][name=load]').change(function() {
            if (this.value == '1') {
                jQuery(me.container).find('.coordinateconversion-clipboardinfo').hide();
                jQuery(me.container).find('#choose').hide();
                jQuery(me.container).find('#fileinput').show();
            }
            else if (this.value == '2') {
                jQuery(me.container).find('#fileinput').hide();
                jQuery(me.container).find('#choose').hide();
                jQuery(me.container).find('.coordinateconversion-clipboardinfo').show();
            }
            if(this.value == '3') {
                jQuery(me.container).find('#fileinput').hide();
                jQuery(me.container).find('.coordinateconversion-clipboardinfo').hide();    
                jQuery(me.container).find('#choose').show();
            }
        });
         if( this.canUseAdvancedUpload() ) {
            this.handleDragAndDrop();
         }
        },
        canUseAdvancedUpload: function() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
         },
        handleDragAndDrop: function() {
            //Function for newer browsers with support for drag and drop
            var me = this;
            var form = jQuery(this.container).find('.box');
            var input = form.find('input[type="file"]');
            form.addClass('has-advanced-upload');

             var droppedFiles = false;

            form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
            })
            .on('dragover dragenter', function() {
                form.addClass('is-dragover');
            })
            .on('dragleave dragend drop', function() {
                form.removeClass('is-dragover');
            })
            .on('drop', function(e) {
                droppedFiles = e.originalEvent.dataTransfer.files;
                form.trigger('submit');
            });
            

            form.on('submit', function(e) {
                if (form.hasClass('is-uploading')) return false;

                form.addClass('is-uploading').removeClass('is-error');

                e.preventDefault();

                var ajaxData = new FormData(form.get(0));

                if (droppedFiles) {
                    jQuery.each( droppedFiles, function(i, file) {
                    ajaxData.append( input.attr('name'), file );
                    });
                }

                jQuery.ajax({
                    url: form.attr('action'),
                    type: form.attr('method'),
                    data: ajaxData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    complete: function() {
                        form.removeClass('is-uploading');
                    },
                    success: function(data) {
                        form.addClass( data.success == true ? 'is-success' : 'is-error' );
                        if (!data.success) $errorMsg.text(data.error);
                    },
                    error: function() {
                        form.addClass('is-error').removeClass('is-uploading');
                    // Log the error, show an alert, whatever works for you
                    }
                });
            
            });
        },
        createSelect: function(data, id) {
            var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', id);
            var selections = [];
            var valObject = {
                id : data.id || data,
                title : data.title
            };
            var options = {
                placeholder_text: "placeholderText",
                allow_single_deselect : true,
                disable_search_threshold: 10,
                width: '100%'
            };
            selections.push(valObject);
            var dropdown = select.create(selections, options);
            dropdown.css({width:'205px'});
            select.adjustChosen();
            select.selectFirstValue();
            if(index > 0) {
                dropdown.parent().addClass('margintop');
            }
            return dropdown;
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function() {

            this.template = jQuery();
            var elParent = this.container.parentElement.parentElement;
            jQuery(elParent).addClass('coordinateconversion-flyout');
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function() {
            "use strict";
        },

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
