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
        me.selectFromMap = false;
        me._template = {
            coordinatesystem: _.template(' <div class="coordinateconversion-csystem"> </br> ' +
                                    '<h4><%= title %></h4>'+
                                    '<div class="geodetic-datum"><b><%= geodetic_datum %></b></div> </br> ' +
                                    '<div class="coordinate-system"><b><%= coordinate_system %></b></div> </br> ' +
                                    '<div class="map-projection" style="display:none;"> <%= map_projection %> </div> </br>' +
                                    '<div class="geodetic-coordinatesystem"><b><%= geodetic_coordinate_system %> </b></div> </br> ' +
                                    '<div class="height-system"><b><%= height_system %></b></div> </div>'
                                ),
            coordinatedatasource: _.template('<div class="coordinateconversion-datasource"> </br> ' +
                                            '<h4><%= title %></h4>'+
                                            '<form>'+
                                                '<input type="radio" id="file" name="load" value="1"><label for="file"> <span></span> <%= file %> </label>'+
                                                '<input type="radio" id="clipboard" name="load" value="2"><label for="clipboard"><span></span> <%= clipboard %> </label>'+
                                                '<input type="radio" id="map" name="load" value="3"><label for="map"> <span></span> <%= map %> </label>'+
                                            '</form> </div>'),
            datasourceinfo: _.template('<div class="coordinateconversion-datasourceinfo" style=display:none;"></div>' +
                                    '<form method="post" action="", enctype="multipart/form-data" class="box" id="fileinput" style="display:none">'+
                                        '<div class="box__input">'+
                                            '<input type="file" name="file" id="file" class="box__file" />'+
                                            '<label>  <%= fileupload %> <label for="file" style="cursor: pointer;"> <a> <%= link %> </a> </label> </label> '+
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
            inputcoordinatefield: _.template('<div class="coordinatefield-input" style="display:inline-block;">' +
                                        '<h5> <%= input %> </h5>' +
                                        '<div class="scrollable">'+
                                        '<table class="hoverable" id="coordinatefield-input" style="border: 1px solid black;">'+
                                        '<tbody>'+
                                        '</tbody'+
                                        '</table>'+
                                    '</div> </div>'),
            fieldheader: _.template('<tr class="rowHeader">' +
                                                '<th style=" border: 1px solid black ;" id="nort"><%= north %></th>'+
                                                '<th style=" border: 1px solid black ;" id="east"><%= east %></th>'+
                                                '<th style=" border: 1px solid black;" id="ellipse_height" ><%= ellipse_height %></th>'+
                                            '</tr>'),
            resultcoordinatefield: _.template('<div class="coordinatefield-result" style="display:inline-block; padding-left: 8px;">' +
                                                    '<h5> <%= result %> </h5>' +
                                                    '<div class="scrollable">'+
                                                    '<table class="hoverable" id="coordinatefield-target" style="border: 1px solid black;">'+
                                                    '<tbody></tbody'+
                                                    '</table>'+
                                                '</div> </div>'),
            conversionbutton: _.template('<div class="conversionbtn" style="display:inline-block; padding-left: 8px;">' +
                                            '<input id="convert" type="button" value="<%= convert %> >>">' +
                                         '</div>'),
            tablerow: _.template('<tr>' +
                                    '<td headers="north" style=" border: 1px solid black ;"> <%= coords.lon %> </td>'+
                                    '<td headers="east" style=" border: 1px solid black ;"> <%= coords.lat %> </td>'+
                                    '<td headers="ellipse_height" style=" border: 1px solid black;"> <div class="removerow"></div> </td>'+
                                '</tr> '),
            utilbuttons: _.template('<div class="coordinateconversion-buttons">' +
                                        '<input id="overlay-btn" class="clear" type="button" value="<%= clear %> ">' +
                                        '<input id="overlay-btn" class="show" type="button" value="<%= show %> ">' +
                                        '<input id="overlay-btn" class="export" type="button" value="<%= fileexport %> ">' +
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
                                                          geodetic_datum: this.loc.coordinatesystem.geodetic_datum,
                                                          coordinate_system: this.loc.coordinatesystem.coordinate_system,
                                                          map_projection: this.loc.coordinatesystem.map_projection,
                                                          geodetic_coordinate_system:this.loc.coordinatesystem.geodetic_coordinatesystem,
                                                          height_system:this.loc.coordinatesystem.heigth_system });

            var coordinatedatasource = this._template.coordinatedatasource({ title: this.loc.datasource.title, 
                                                                             file: this.loc.datasource.file,
                                                                             clipboard: this.loc.datasource.clipboard,
                                                                             map: this.loc.datasource.map,
                                                                             choose: this.loc.datasource.choose });
    
            var inputcoordinatefield = this._template.inputcoordinatefield({  input: this.loc.coordinatefield.input,
                                                                            north:this.loc.coordinatefield.north,
                                                                            east:this.loc.coordinatefield.east,
                                                                            ellipse_height: "" });

            var conversionbutton = this._template.conversionbutton({ convert: this.loc.coordinatefield.convert });

            var resultcoordinatefield = this._template.resultcoordinatefield({ result: this.loc.coordinatefield.result });

            var datasourceinfo = this._template.datasourceinfo({ fileupload: this.loc.datasourceinfo.fileupload,
                                                            link: this.loc.datasourceinfo.link,
                                                            clipboardupload: this.loc.datasourceinfo.clipboardupload,
                                                            uploading: this.loc.datasourceinfo.uploading,
                                                            success: this.loc.datasourceinfo.success,
                                                            error: this.loc.datasourceinfo.error });

            var utilbuttons = this._template.utilbuttons({ clear: this.loc.utils.clear,
                                                            show: this.loc.utils.show,
                                                            fileexport: this.loc.utils.export });

            jQuery(this.container).append(coordinatesystem);
            jQuery( this.container ).find('.coordinateconversion-csystem').attr('id','inputcoordsystem');
            jQuery(this.container).append(coordinatesystem);
            jQuery( this.container ).find('.coordinateconversion-csystem').not('#inputcoordsystem').attr('id','targetcoordsystem');
            jQuery(this.container).append(coordinatedatasource);
            jQuery(this.container).append(datasourceinfo);

            this._template.conversionfield.append(inputcoordinatefield);
            this._template.conversionfield.append(conversionbutton);
            this._template.conversionfield.append(resultcoordinatefield);
            jQuery(this.container).append(this._template.conversionfield);
            jQuery(this.container).append(utilbuttons);

            var input_instance = me.createSelect();
            jQuery( this.container ).find('#inputcoordsystem').find('div').each(function (index) {
                jQuery(this).append(input_instance.dropdowns[index]);
            });
            var target_instance = me.createSelect();
            jQuery( this.container ).find('#targetcoordsystem').find('div').each(function (index) {
                jQuery(this).append(target_instance.dropdowns[index]);
            });
            var coords = {} 
            for( var i = 0; i < 10; i++ ) {
                jQuery(this.container).find("#coordinatefield-input").append(this._template.tablerow( { coords: coords } ) );
                jQuery(this.container).find("#coordinatefield-target").append(this._template.tablerow( { coords: coords } ) );
            }
        var inputValues = this.selectGetValue(input_instance, false);
        var targetValues = this.selectGetValue(target_instance, true);

        this.handleButtons();
        this.handleRadioButtons();
         if( this.canUseAdvancedUpload() ) {
            this.handleDragAndDrop();
         }
        },
        /**
         * @method selectGetValue
         * which key corresponds to which dropdown in the array:
         * [0] = geodetic datum,
         * [1] = coordinate system
         * [2] = map projection
         * [3] = geodetic coordinate system
         * [4] = heigth system
         */
        selectGetValue: function ( instance, called ) {
            var kkj = false;
            var me = this;
            var values = [];
            if( !called ) {
                jQuery( this.container ).find('#inputcoordsystem').on("change", function() {
                    for (var i = 0; i < instance.instances.length; i++ ) {

                    //First dropdown
                    if( instance.instances[0].getValue() === 'DATUM.KKJ' ) {
                        kkj = true;
                        instance.dropdowns[1].find('option:contains(3D)').hide();

                        instance.dropdowns[3].find('option:not(:contains(KKJ))').hide();
                        //if hidden
                        instance.dropdowns[3].find('option:contains(KKJ)').show();
                    } else {
                        kkj = false;
                        instance.dropdowns[3].find('option:contains(KKJ)').hide();
                        
                        //if hidden
                        instance.dropdowns[1].find('option:contains(3D)').show();
                        instance.dropdowns[3].find('option:not(:contains(KKJ))').show();

                    }
                    
                    if( instance.instances[1].getValue() === 'KOORDINAATISTO.SUORAK.3D' ) {
                        instance.dropdowns[3].find('option:not(:contains(EUREF-FIN-XYZ))').hide();
                    }
                    if( instance.instances[1].getValue() === 'KOORDINAATISTO.MAANT.2D' ) {
                        if( kkj ) {
                            instance.dropdowns[3].find('option:not(:contains(KKJ-Hayford))').hide();
                        } else {
                            instance.dropdowns[3].find('option:not(:contains(EUREF-FIN-GRS80))').hide();
                        }
                    }
                    if( instance.instances[1].getValue() === 'KOORDINAATISTO.MAANT.3D' ) {
                        instance.dropdowns[3].find('option:not(:contains(EUREF-FIN-GRS80h))').hide();
                    }
                    if( instance.instances[1].getValue() === 'KOORDINAATISTO.SUORAK.2D' ) {
                        if( kkj ) {
                            instance.dropdowns[2].find('option:contains(KKJ)').show();
                            instance.dropdowns[2].find('option:not(:contains(KKJ))').hide();
                        } else {
                            instance.dropdowns[2].find('option:contains(ETRS)').show();
                            instance.dropdowns[2].find('option:not(:contains(ETRS))').hide();
                        }
                    }

                    if( instance.instances[1].getValue() === 'KOORDINAATISTO.SUORAK.2D' ) {
                        jQuery('.map-projection').show();
                    } else {
                        jQuery('.map-projection').hide();
                    }

                    instance.instances[i].update();
                    values = [];
                    for (var i = 0; i < instance.instances.length; i++ ) {
                        var vl = instance.instances[i].getValue();
                        values.push(vl);
                    }
                    me.updateTableTitle(values);
                    }
                });
            } else {
                jQuery( this.container ).find('#targetcoordsystem').on("change", function() {
                var selects = jQuery(this).find(".oskari-select");
                for (var i = 0; i < selects.length; i++ ) {
                   var vl = instance.instances[i].getValue();
                }
                });
            }
            return values;
        },
        updateTableTitle: function (values) {
            var x = y = z = "";
            if( values[3].indexOf("COORDSYS.KKJ") !== -1 ) {
                x = this.loc.coordinatefield.kkjnorth
                y = this.loc.coordinatefield.kkjeast
                z = ""
            }
            if( values[3].indexOf("COORDSYS.ETRS") !== -1 ) {
                x = this.loc.coordinatefield.kkjeast
                y = this.loc.coordinatefield.kkjnorth
                z = ""
            }
            if( values[1].indexOf("KOORDINAATISTO.MAANT.2D") !== -1 ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = ""
            } else if(values[1].indexOf("KOORDINAATISTO.MAANT.3D") !== -1 ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = this.loc.coordinatefield.ellipse_height
            }
            if(values[1].indexOf("KOORDINAATISTO.SUORAK.3D") !== -1 ) {
                   x = this.loc.coordinatefield.geox
                   y = this.loc.coordinatefield.geoy
                   z = this.loc.coordinatefield.geoz
            }
               

                // if(value === 'MAANT') {
                //    x = this.loc.coordinatefield.north
                //    y = this.loc.coordinatefield.east
                //    z = ""
                // }

            if(jQuery(this.container).find('.rowHeader')) {
                jQuery(this.container).find('.rowHeader').remove();
            }

            var fieldheader = this._template.fieldheader({
                                                                north: x,
                                                                east: y,
                                                                ellipse_height: z });

            jQuery(this.container).find("#coordinatefield-input").prepend(fieldheader);
        },
        /**
         * @method canUseAdvancedUpload
         *
         * Checks if the browser supports drag and drop events aswell as formdata & filereader
         * @return {boolean} true if supported 
         */
        canUseAdvancedUpload: function() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
         },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         * 
         */
        handleRadioButtons: function() {
            var me = this;
            jQuery('input[type=radio][name=load]').change(function() {
                if (this.value == '1') {
                    jQuery(me.container).find('.coordinateconversion-clipboardinfo').hide();
                    jQuery(me.container).find('.choosecoords').hide();
                    jQuery(me.container).find('#fileinput').show();
                    me.selectFromMap = false;
                }
                else if (this.value == '2') {
                    jQuery(me.container).find('#fileinput').hide();
                    jQuery(me.container).find('.choosecoords').hide();
                    jQuery(me.container).find('.coordinateconversion-clipboardinfo').show();
                    me.selectFromMap = false;
                }
                if(this.value == '3') {
                    jQuery(me.container).find('#fileinput').hide();
                    jQuery(me.container).find('.coordinateconversion-clipboardinfo').hide();
                    me.selectFromMap = true;                    
                }
            });
         },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         * 
         */
        handleButtons: function () {
            var me = this;
            var helper = Oskari.clazz.create('Oskari.framework.bundle.coordinateconversion.helper', this.instance, this.loc);
            jQuery(this.container).find('.clear').on("click", function () {
                var table = jQuery('#coordinatefield-input tr td');
                for(var i = 0; i < table.length; i++){
                    if( table[i].textContent != "  ") {
                        table[i].remove();
                    }
                }
            });
            jQuery('#mapdiv').on("click", function () {
                if( me.selectFromMap ) {
                    var coords = helper.getCoordinatesFromMap();
                    me.addToInputTable(coords);
                }
            });
            jQuery(this.container).find('.show').on("click", function () {
                /* 
                * Need to get the real coordinates which have been converted by the backend
                * Use these to test the functionality:
                * var coord = { lon: 385545.5, lat: 6675310.75 }
                */
                var coord = { lon: 385545.5, lat: 6675310.75 }
                helper.moveToCoords( coord );                
            });
            jQuery('.removerow').on('click', function () {
                
            });
        },
        addToInputTable: function (coords) {
            var table = jQuery(this.container).find('#coordinatefield-input');
            var row = this._template.tablerow( { coords: coords } );
            table.find('tr:first').after(row);
            //append the click event to the new rows aswell
            jQuery('.removerow').on('click', function () {
                jQuery(this).parent().parent().remove();
            });
        },
        /**
         * @method handleDragAndDrop
         * Checks for drag and drop events, on submit makes ajax request
         * 
         *
         */
        handleDragAndDrop: function() {
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
        createSelect: function() {
            var json = {
                        "geodesicdatum": {
                            0: { "id":"DATUM.DEFAULT", "title":"Mikä tahansa"},
                            1: { "id":"DATUM.KKJ", "title":"KKJ"},
                            2: { "id":"DATUM.EUREF-FIN", "title":"EUREF-FIN"}
                            },
                        "koordinaatisto": {
                            0: { "id":"KOORDINAATISTO.DEFAULT", "title":"Mikä tahansa" },
                            1: { "id":"KOORDINAATISTO.SUORAK.2D", "title":"Suorakulmainen 2D (Taso)" },
                            2: { "id":"KOORDINAATISTO.SUORAK.3D", "title":"Suorakulmainen 3D" },
                            3: { "id":"KOORDINAATISTO.MAANT.2D", "title":"Maantieteellinen 2D" },
                            4: { "id":"KOORDINAATISTO.MAANT.3D", "title":"Maantieteellinen 3D" }
                            },
                        "mapprojection": {
                            0: { "id":"DATUM.KARTTAPJ.DEFAULT", "title":"Mikä tahansa"},
                            1: { "id":"DATUM.KKJ", "title":"KKJ"},
                            2: { "id":"DATUM.EUREF-FIN", "title":"ETRS-TM"},
                            3: { "id":"DATUM.EUREF-FIN", "title":"ETRS-GK"}
                            },
                        "etrsCoordsys": {
                            0: { "id":"COORDSYS.DEFAULT", "title":"Valitse" },
                            1: { "id":"COORDSYS.ETRS-GK19", "title":"ETRS-GK19" },
                            2: { "id":"COORDSYS.ETRS-GK20", "title":"ETRS-GK20" },
                            3: { "id":"COORDSYS.ETRS-GK21", "title":"ETRS-GK21" },
                            4: { "id":"COORDSYS.ETRS-GK22", "title":"ETRS-GK22" },
                            5: { "id":"COORDSYS.ETRS-GK23", "title":"ETRS-GK23" },
                            6: { "id":"COORDSYS.ETRS-GK24", "title":"ETRS-GK24" },
                            7: { "id":"COORDSYS.ETRS-GK25", "title":"ETRS-GK25" },
                            8: { "id":"COORDSYS.ETRS-GK26", "title":"ETRS-GK26" },
                            9: { "id":"COORDSYS.ETRS-GK27", "title":"ETRS-GK27" },
                            10: { "id":"COORDSYS.ETRS-GK28", "title":"ETRS-GK28" },
                            11: { "id":"COORDSYS.ETRS-GK29", "title":"ETRS-GK29" },
                            12: { "id":"COORDSYS.ETRS-GK30", "title":"ETRS-GK30" },
                            13: { "id":"COORDSYS.ETRS-GK31", "title":"ETRS-GK31" },
                            14: { "id":"COORDSYS.ETRS-LAEA", "title":"ETRS-LAEA" },
                            15: { "id":"COORDSYS.ETRS-LCC", "title":"ETRS-LCC" },
                            16: { "id":"COORDSYS.ETRS-TM34", "title":"ETRS-TM34" },
                            17: { "id":"COORDSYS.ETRS-TM35", "title":"ETRS-TM35" },
                            18: { "id":"COORDSYS.ETRS-TM35FIN", "title":"ETRS-TM35FIN" },
                            19: { "id":"COORDSYS.EUREF-FIN-GEO2D", "title":"EUREF-FIN-GRS80" },
                            20: { "id":"COORDSYS.EUREF-FIN-GEO3D", "title":"EUREF-FIN-GRS80h" },
                            21: { "id":"COORDSYS.ETRS-EUREF-FIN.SUORAK3d", "title":"EUREF-FIN-XYZ" },
                            22: { "id":"COORDSYS.KKJ0", "title":"KKJ kaista 0" },
                            23: { "id":"COORDSYS.KKJ1", "title":"KKJ kaista 1" },
                            23: { "id":"COORDSYS.KKJ2", "title":"KKJ kaista 2" },
                            24: { "id":"COORDSYS.KKJ3", "title":"KKJ kaista 3 / YKJ" },
                            25: { "id":"COORDSYS.KKJ4", "title":"KKJ kaista 4" },
                            26: { "id":"COORDSYS.KKJ5", "title":"KKJ kaista 5" },
                            27: { "id":"COORDSYS.KKJ.GEO", "title":"KKJ-Hayford" }
                            },
                        "heigthsystem": {
                            0: { "id":"KORKEUSJ.DEFAULT", "title":"Ei mitään"},
                            1: { "id":"KORKEUSJ.N2000", "title":"N2000"},
                            2: { "id":"KORKEUSJ.N60", "title":"N60"},
                            3: { "id":"KORKEUSJ.N43", "title":"N43"}
                            }
                        }

            var selections = [];
            var dropdowns = [];
            var selectInstances = [];
            var options = {}
            jQuery.each( json, function ( key, value ) {
                var size = Object.keys(value).length;
                 jQuery.each( value, function ( key, val ) {
                    var valObject = {
                        id : val.id,
                        title : val.title
                    };
                    selections.push( valObject );
                    if (key === "0") {
                        options = {
                            placeholder_text: val.title,
                            allow_single_deselect : true,
                            disable_search_threshold: 10,
                            width: '100%'
                        };
                    }
                     if (key == size -1) {
                        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', "id");
                        var dropdown = select.create(selections, options);
                        selections = [];
                        options = {};

                        dropdown.css({width:'150px', float:'right'});
                        select.adjustChosen();
                        select.selectFirstValue();
                        // if(index > 0) {
                        //     dropdown.parent().addClass('margintop');
                        // }
                        dropdowns.push(dropdown);
                        selectInstances.push(select);
                     }
                });
            });
            return {"instances": selectInstances, "dropdowns": dropdowns};
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
