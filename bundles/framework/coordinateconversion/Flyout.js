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
        me.insertWithClipboard = false;
        me._template = {
            coordinatesystem: _.template(' <div class="coordinateconversion-csystem"> </br> ' +
                                    '<h4><%= title %></h4>'+
                                    '<div class="geodetic-datum"><b class="dropdown_title"><%= geodetic_datum %></b> <div class="select"></div>  <a href="#"><div class="infolink"></div></a> </div> </br> ' +
                                    '<div class="coordinate-system"><b class="dropdown_title"><%= coordinate_system %></b> <div class="select"></div>  <a href="#"><div class="infolink"></div></a> </div> </br> ' +
                                    '<div class="map-projection" style="display:none;"> <%= map_projection %> <div class="select"></div>  <a href="#"><div class="infolink"></div></a> </div> </br>' +
                                    '<div class="geodetic-coordinatesystem"><b class="dropdown_title"><%= geodetic_coordinate_system %> </b> <div class="select"></div>  <a href="#"><div class="infolink"></div></a> </div> </br> ' +
                                    '<div class="height-system"><b class="dropdown_title"><%= height_system %></b></div> <div class="select"></div> <a href="#"><div class="infolink"></div></a> </div>'
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
                                    '</div>' +
                                    '<div class="coordinateconversion-mapinfo" style=display:none;">'+
                                        '<div class="mapinfo"> <i><%= mapinfo %><i> </div>'+
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
                                                '<th id="nort"><%= north %></th>'+
                                                '<th id="east"><%= east %></th>'+
                                                '<th id="ellipse_height" ><%= ellipse_height %></th>'+
                                            '</tr>'),
            resultcoordinatefield: _.template('<div class="coordinatefield-result" style="display:inline-block; padding-left: 8px;">' +
                                                    '<h5> <%= result %> </h5>' +
                                                    '<div class="scrollable">'+
                                                    '<table class=" hoverable" id="coordinatefield-target" style="border: 1px solid black;">'+
                                                    '<tbody></tbody'+
                                                    '</table>'+
                                                '</div> </div>'),
            conversionbutton: _.template('<div class="conversionbtn" style="display:inline-block; padding-left: 8px;">' +
                                            '<input id="convert" type="button" value="<%= convert %> >>">' +
                                         '</div>'),
            tablerow: _.template('<tr>' +
                                    '<td class="cell" headers="north" style=" border: 1px solid black ;"> <%= coords.lon %> </td>'+
                                    '<td class="cell" headers="east" style=" border: 1px solid black ;"> <%= coords.lat %> </td>'+
                                    '<td class="cell" headers="ellipse_height" style=" border: 1px solid black;"> <div class="removerow"></div></td>'+
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
                                                            mapinfo: this.loc.datasourceinfo.mapinfo,
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
            jQuery( this.container ).find('#inputcoordsystem').find('.select').each(function (index) {
                jQuery(this).append(input_instance.dropdowns[index]);
            });
            var target_instance = me.createSelect();
            jQuery( this.container ).find('#targetcoordsystem').find('.select').each(function (index) {
                jQuery(this).append(target_instance.dropdowns[index]);
            });
            var coords = {} 
            for( var i = 0; i < 10; i++ ) {
                jQuery(this.container).find("#coordinatefield-input").append(this._template.tablerow( { coords: coords } ) );
                jQuery(this.container).find("#coordinatefield-target").append(this._template.tablerow( { coords: coords } ) );
            }
        var inputValues = this.selectGetValue(input_instance, false);
        var targetValues = this.selectGetValue(target_instance, true);
        this.handleClipboard();
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
            var me = this;
            var values = [];
            if( !called ) {
                jQuery( this.container ).find('#inputcoordsystem').on("change", function() {
                    for (var i = 0; i < instance.instances.length; i++ ) {

                    instance.dropdowns[i].find('option').hide();
                    instance.dropdowns[i].find('.'+ instance.instances[0].getValue()).show();

                    // Koordinaatisto special cases
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_MAANT_2D" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[1].getValue()).show();
                    }
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_MAANT_3D" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[1].getValue()).show();
                    }
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_SUORAK_2D" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[1].getValue()).show();
                    }
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_SUORAK_3D" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[1].getValue()).show();
                    }
                    // Karttaprojektiojärjestelmä special cases
                    if( instance.instances[2].getValue() === "KKJ_KAISTA" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[2].getValue()).show();
                    }
                    if( instance.instances[2].getValue() === "TM" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[2].getValue()).show();
                    } 
                    if( instance.instances[2].getValue() === "GK" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[2].getValue()).show();
                    }
                        
                    if( instance.instances[1].getValue() === 'KOORDINAATISTO_SUORAK_2D' ) {
                        jQuery('.map-projection').show();
                    } else {
                        jQuery('.map-projection').hide();
                    }
                    
                    values = [];
                    instance.instances[i].update();
                    for (var j = 0; j < instance.instances.length; j++ ) {
                        var vl = instance.instances[j].getValue();
                        values.push(vl);
                    }
                    me.updateEditable(values);
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
        updateEditable: function (values) {
            if(typeof values === null) {
                values = undefined;
            }
            var rows = jQuery(this.container).find("#coordinatefield-input tr");
            if( !this.insertWithClipboard ) {
                rows.each( function ( row ) {
                    jQuery(this).find('td').attr("contenteditable", false);
                });
            }
            else {
                rows.each( function ( row ) {
                    jQuery(this).find('td').attr("contenteditable", true);
                });
            }
            if(values === undefined) {
                return;
            }
            if( values[4] !== "KORKEUSJ_DEFAULT" ) {
                rows.each( function ( row ) {
                    jQuery(this).find('td:last').attr("contenteditable", true);
                    jQuery(this).find('td:last').css('background-color','');
                });
                
            } else {
                rows.each( function ( row ) {
                    var lastCell = jQuery(this).find('td:last');
                    lastCell.attr("contenteditable", false);
                    // if last cell is not empty and no heightsystem is selected, gray it out
                    if(lastCell.html() !== ' ') {
                        lastCell.css('background-color','gray');
                    }
                })
            }
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

            if(jQuery(this.container).find('.rowHeader')) {
                jQuery(this.container).find('.rowHeader').remove();
            }

            var fieldheader = this._template.fieldheader({  north: x,
                                                            east: y,
                                                            ellipse_height: z });

            jQuery(this.container).find("#coordinatefield-input tbody").prepend(fieldheader);
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
         * @method handleClipboard
         *
         * Handles the paste event in the input table
         * example data to paste:
            lon:1234, lat:1234,
            lon:0000, lat:123456
         * currently only works in format specified above in the example
         * https://regex101.com <- good place to test
         */
        handleClipboard: function () {
            
            var me = this;
            var cells = document.getElementsByClassName("cell");

            for(var i = 0; i < cells.length; i++ ) {
                cells[i].addEventListener('paste', function(e) {
                        // Stop data actually being pasted into div
                        e.stopPropagation();
                        e.preventDefault();

                    if( me.insertWithClipboard === false ) {
                        return;
                    }
                    var clipboardData, pastedData;

                        // Get pasted data via clipboard API
                        clipboardData = e.clipboardData || window.clipboardData;
                        pastedData = clipboardData.getData('Text');

                        var lonlat = new RegExp(/(lon|lat)[\:][0-9]+[\,]?/g);
                        var fullLonlat = new RegExp(/(?:lon|lat)[\:][0-9]+[\,].*,?/g);
                        var numeric = new RegExp(/[0-9]+/);
                        
                        var jsonLonLat = {};
                        var fullLonLatMatch = pastedData.match(fullLonlat);
                        for(var i = 0; i < fullLonLatMatch.length; i++) {
                            jsonLonLat[i] = {lon:'',lat:''};
                            var lonlatMatch = fullLonLatMatch[i].match(lonlat);
                            var lonValue = lonlatMatch[0].match(numeric);
                            var latValue = lonlatMatch[1].match(numeric);
                            jsonLonLat[i].lon = lonValue[0];
                            jsonLonLat[i].lat = latValue[0]
                        }

                        me.populateTableWithData(jsonLonLat);

                });
            }
        },
        populateTableWithData: function( data ) {
            var table = jQuery(this.container).find('.coordinatefield-input');
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var row = this._template.tablerow( { coords: data[key] } );
                    table.find('tr:first').after(row);
                }
            }
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         * 
         */
        handleRadioButtons: function() {
            var me = this;
            var clipboardInfo = jQuery(me.container).find('.coordinateconversion-clipboardinfo');
            var mapInfo = jQuery(me.container).find('.coordinateconversion-mapinfo');
            var fileInput = jQuery(me.container).find('#fileinput');

            jQuery('input[type=radio][name=load]').change(function() {
                if (this.value == '1') {
                    clipboardInfo.hide();
                    mapInfo.hide();
                    fileInput.show();
                    me.selectFromMap = false;
                    me.insertWithClipboard = false;
                }
                else if (this.value == '2') {
                    fileInput.hide();
                    me.insertWithClipboard = true;
                    clipboardInfo.show();
                    mapInfo.hide();
                    me.selectFromMap = false;
                }
                if(this.value == '3') {
                    fileInput.hide();
                    clipboardInfo.hide();
                    mapInfo.show();
                    me.selectFromMap = true; 
                    me.insertWithClipboard = false;                   
                }
                me.updateEditable();
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
                        jQuery(table[i]).parent().remove();
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
                        "geodeticdatum": {
                            0: { "id":"DATUM_DEFAULT", "title":"Mikä tahansa", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            1: { "id":"DATUM_KKJ", "title":"KKJ", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            2: { "id":"DATUM_EUREF-FIN", "title":"EUREF-FIN", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"}
                            },
                        "koordinaatisto": {
                            0: { "id":"KOORDINAATISTO_DEFAULT", "title":"Mikä tahansa" },
                            1: { "id":"KOORDINAATISTO_SUORAK_2D", "title":"Suorakulmainen 2D (Taso)", "cls":"DATUM_KKJ DATUM_EUREF-FIN" },
                            2: { "id":"KOORDINAATISTO_SUORAK_3D", "title":"Suorakulmainen 3D", "cls":"DATUM_EUREF-FIN" },
                            3: { "id":"KOORDINAATISTO_MAANT_2D", "title":"Maantieteellinen 2D", "cls":"DATUM_EUREF-FIN DATUM_KKJ" },
                            4: { "id":"KOORDINAATISTO_MAANT_3D", "title":"Maantieteellinen 3D", "cls":"DATUM_EUREF-FIN" }
                            },
                        "mapprojection": {
                            0: { "id":"DATUM_KARTTAPJ_DEFAULT", "title":"Mikä tahansa"},
                            1: { "id":"KKJ_KAISTA", "title":"KKJ", "cls":"DATUM_KKJ"},
                            2: { "id":"TM", "title":"ETRS-TM",  "cls":"DATUM_EUREF-FIN"},
                            3: { "id":"GK", "title":"ETRS-GK",  "cls":"DATUM_EUREF-FIN"}
                            },
                        "coordinatesystem": {
                            0: { "id":"COORDSYS_DEFAULT", "title":"Valitse" },
                            1: { "id":"COORDSYS_ETRS-GK19", "title":"ETRS-GK19", "cls":"DATUM_EUREF-FIN GK" },
                            2: { "id":"COORDSYS_ETRS-GK20", "title":"ETRS-GK20", "cls":"DATUM_EUREF-FIN GK" },
                            3: { "id":"COORDSYS_ETRS-GK21", "title":"ETRS-GK21", "cls":"DATUM_EUREF-FIN GK" },
                            4: { "id":"COORDSYS_ETRS-GK22", "title":"ETRS-GK22", "cls":"DATUM_EUREF-FIN GK" },
                            5: { "id":"COORDSYS_ETRS-GK23", "title":"ETRS-GK23", "cls":"DATUM_EUREF-FIN GK" },
                            6: { "id":"COORDSYS_ETRS-GK24", "title":"ETRS-GK24", "cls":"DATUM_EUREF-FIN GK" },
                            7: { "id":"COORDSYS_ETRS-GK25", "title":"ETRS-GK25", "cls":"DATUM_EUREF-FIN GK" },
                            8: { "id":"COORDSYS_ETRS-GK26", "title":"ETRS-GK26", "cls":"DATUM_EUREF-FIN GK" },
                            9: { "id":"COORDSYS_ETRS-GK27", "title":"ETRS-GK27", "cls":"DATUM_EUREF-FIN GK" },
                            10: { "id":"COORDSYS_ETRS-GK28", "title":"ETRS-GK28", "cls":"DATUM_EUREF-FIN GK" },
                            11: { "id":"COORDSYS_ETRS-GK29", "title":"ETRS-GK29", "cls":"DATUM_EUREF-FIN GK" },
                            12: { "id":"COORDSYS_ETRS-GK30", "title":"ETRS-GK30", "cls":"DATUM_EUREF-FIN GK" },
                            13: { "id":"COORDSYS_ETRS-GK31", "title":"ETRS-GK31", "cls":"DATUM_EUREF-FIN GK" },
                            14: { "id":"COORDSYS_ETRS-LAEA", "title":"ETRS-LAEA", "cls":"DATUM_EUREF-FIN GK" },
                            15: { "id":"COORDSYS_ETRS-LCC", "title":"ETRS-LCC", "cls":"DATUM_EUREF-FIN" },
                            16: { "id":"COORDSYS_ETRS-TM34", "title":"ETRS-TM34", "cls":"DATUM_EUREF-FIN TM" },
                            17: { "id":"COORDSYS_ETRS-TM35", "title":"ETRS-TM35", "cls":"DATUM_EUREF-FIN TM" },
                            18: { "id":"COORDSYS_ETRS-TM35", "title":"ETRS-TM36", "cls":"DATUM_EUREF-FIN TM" },
                            19: { "id":"COORDSYS_ETRS-TM35FIN", "title":"ETRS-TM35FIN", "cls":"DATUM_EUREF-FIN TM" },
                            20: { "id":"COORDSYS_EUREF-FIN-GEO2D", "title":"EUREF-FIN-GRS80", "cls":"DATUM_EUREF-FIN KOORDINAATISTO_MAANT_2D" },
                            21: { "id":"COORDSYS_EUREF-FIN-GEO3D", "title":"EUREF-FIN-GRS80h", "cls":"DATUM_EUREF-FIN KOORDINAATISTO_MAANT_3D" },
                            22: { "id":"COORDSYS_ETRS-EUREF-FIN_SUORAK3d", "title":"EUREF-FIN-XYZ", "cls":"DATUM_EUREF-FIN KOORDINAATISTO_SUORAK_3D" },
                            23: { "id":"COORDSYS_KKJ0", "title":"KKJ kaista 0", "cls":"DATUM_KKJ KKJ_KAISTA" },
                            24: { "id":"COORDSYS_KKJ1", "title":"KKJ kaista 1", "cls":"DATUM_KKJ KKJ_KAISTA" },
                            25: { "id":"COORDSYS_KKJ2", "title":"KKJ kaista 2", "cls":"DATUM_KKJ KKJ_KAISTA" },
                            26: { "id":"COORDSYS_KKJ3", "title":"KKJ kaista 3 / YKJ", "cls":"DATUM_KKJ KKJ_KAISTA" },
                            27: { "id":"COORDSYS_KKJ4", "title":"KKJ kaista 4", "cls":"DATUM_KKJ KKJ_KAISTA" },
                            28: { "id":"COORDSYS_KKJ5", "title":"KKJ kaista 5", "cls":"DATUM_KKJ KKJ_KAISTA" },
                            29: { "id":"COORDSYS_KKJ_GEO", "title":"KKJ-Hayford", "cls":"DATUM_KKJ KOORDINAATISTO_MAANT_2D" }
                            },
                        "heigthsystem": {
                            0: { "id":"KORKEUSJ_DEFAULT", "title":"Ei mitään","cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            1: { "id":"KORKEUSJ_N2000", "title":"N2000", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            2: { "id":"KORKEUSJ_N60", "title":"N60", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            3: { "id":"KORKEUSJ_N43", "title":"N43", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"}
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
                        title : val.title,
                        cls: val.cls
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

                        dropdown.css({width:'130px', float:'right'});
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
