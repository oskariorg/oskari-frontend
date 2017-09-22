Oskari.clazz.define('Oskari.framework.bundle.coordinateconversion.view.conversion',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = Oskari.clazz.create('Oskari.framework.bundle.coordinateconversion.helper', me.instance, me.loc);
        me.mapselect = false;
        me.clipboardInsert = false;
        me.conversionContainer = null
        me.startingSystem = false;
        me.fileinput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', me.loc);
        me.file = Oskari.clazz.create('Oskari.framework.bundle.coordinateconversion.view.filesettings', me.instance, me.loc);
        me.file.create();
        me.numrows = 1;
        me._userSelections = { "import": null, "export": null };
        me._template = {
            wrapper: jQuery('<div class="conversionwrapper"></div>'),
            title: _.template('<h4 class="header"><%= title %></h4>'),
            coordinatesystem: _.template(' <div class="coordinateconversion-csystem">' +
                                    '<h5><%= title %></h5>'+
                                    '<div class="geodetic-datum"><b class="dropdown_title"><%= geodetic_datum %></b> <a href="#"><div class="infolink"></div></a> <div class="select"></div> </div> </br> ' +
                                    '<div class="coordinate-system"><b class="dropdown_title"><%= coordinate_system %></b> <a href="#"><div class="infolink"></div></a> <div class="select"></div>  </div> </br> ' +
                                    '<div class="map-projection" style="display:none;"> <%= map_projection %> <a href="#"><div class="infolink"></div></a> <div class="select"></div> </div> </br>' +
                                    '<div class="geodetic-coordinatesystem"><b class="dropdown_title"><%= geodetic_coordinate_system %> *</b> <a href="#"><div class="infolink"></div></a> <div class="select"></div> </div> </br> ' +
                                    '<div class="height-system"><b class="dropdown_title"><%= height_system %></b></div> <a href="#"><div class="infolink"></div></a> <div class="select"></div> </div>'
                                ),
            coordinatedatasource: _.template('<div class="coordinateconversion-datasource"> </br> ' +
                                            '<h4><%= title %></h4>'+
                                            '<form>'+
                                                '<input type="radio" id="clipboard" name="load" value="2"><label for="clipboard"><span></span> <%= clipboard %> </label>'+
                                                '<input type="radio" id="file" name="load" value="1"><label for="file"> <span></span> <%= file %> </label>'+
                                                '<input type="button" id="overlay-btn" class="mapselect" name="load" value="<%= map %>">'+
                                            '</form>'+
                                            '</div>'),
            datasourceinfo: _.template('<div class="datasource-info">' +
                                            '<div class="coordinateconversion-clipboardinfo" style=display:none;">'+
                                                '<div class="clipboardinfo"> <i><%= clipboardupload %><i> </div>'+
                                            '</div>' +
                                            '<div class="coordinateconversion-mapinfo" style=display:none;">'+
                                                '<div class="mapinfo"> <i><%= mapinfo %><i> </div>'+
                                            '</div>' +
                                    '</div>'
                                    ),  
            conversionfield: jQuery('<div class="coordinateconversion-field"></div>'),
            rowcounter: _.template('<div class="rowcount"><span id="num"></span> <%= rows %> </div>'),
            oskari_input_table_content: _.template('<div class="coordinatefield-input" style="display:inline-block;">' +
                                        '<h5> <%= input %> </h5>' +
                                        '<div class="oskari-table-content">'+
                                         '<div style="width:100%;height:98%; overflow:auto;">'+
                                            '<table class="hoverable" id="oskari-coordinate-table" style="border: 1px solid black;" cellpadding="0" cellspacing="0" border="0">'+
                                                '<tbody></tbody'+
                                            '</table>'+
                                         '</div>'+
                                        '</div>'+
                                    '</div>'),
            oskari_table_header: _.template('<div class="oskari-table-header">'+
                                        '<table id="oskari-tbl-header" cellpadding="0" cellspacing="0" border="0">'+
                                            '<thead>'+
                                                '<tr>' +
                                                    '<th id="nort"><%= north %></th>'+
                                                    '<th id="east"><%= east %></th>'+
                                                    '<th id="ellipse_height" ><%= ellipse_height %></th>'+
                                                '</tr>'+
                                             '</thead>'+
                                        ' </table>'+
                                     '</div>'),
            oskari_result_table_content: _.template('<div class="coordinatefield-result" style="display:inline-block; padding-left:8px;">' +
                                        '<h5> <%= result %> </h5>' +
                                        '<div class="oskari-table-content-target">'+
                                         '<div style="width:100%;height:98%; overflow:auto;">'+
                                            '<table class="hoverable" id="oskari-coordinate-table-result" style="border: 1px solid black;" cellpadding="0" cellspacing="0" border="0">'+
                                                '<tbody></tbody'+
                                            '</table>'+
                                         '</div>'+
                                        '</div>'+
                                    '</div>'),
            conversionbutton: _.template('<div class="conversionbtn" style="display:inline-block; padding-left: 8px;">' +
                                            '<input id="convert" type="button" value="<%= convert %> >>">' +
                                         '</div>'),
            tablerow: _.template('<tr>' +
                                    '<td class="cell lon" headers="north" style=" border: 1px solid black ;"> <%= coords.lon %> </td>'+
                                    '<td class="cell lat" headers="east" style=" border: 1px solid black ;"> <%= coords.lat %> </td>'+
                                    '<td class="cell heightsystem" headers="ellipse_height" style=" border: 1px solid black;"></td>'+
                                    '<td class="cell control"> <div class="removerow"></div></td>'+
                                '</tr> '),
            utilbuttons: _.template('<div class="coordinateconversion-buttons">' +
                                        '<input id="overlay-btn" class="clear" type="button" value="<%= clear %> ">' +
                                        '<input id="overlay-btn" class="show" type="button" value="<%= show %> ">' +
                                        '<input id="overlay-btn" class="export" type="button" value="<%= fileexport %> ">' +
                                        '</div>')
        }
    }, {
        getName: function() {
            return 'Oskari.framework.bundle.coordinateconversion.view.conversion';
        },
        createUI: function( container ) {
           var me = this;
           this.conversionContainer = container;

           var inputTitle = this._template.title( { title: this.loc.title.input } );
           var resultTitle = this._template.title( { title: this.loc.title.result } ); 
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
    
            var inputcoordinatefield = this._template.oskari_input_table_content({  input: this.loc.coordinatefield.input,
                                                                            north:this.loc.coordinatefield.north,
                                                                            east:this.loc.coordinatefield.east,
                                                                            ellipse_height: "" });

            var conversionbutton = this._template.conversionbutton({ convert: this.loc.coordinatefield.convert });

            var resultcoordinatefield = this._template.oskari_result_table_content({ result: this.loc.coordinatefield.result });

            var datasourceinfo = this._template.datasourceinfo({ clipboardupload: this.loc.datasourceinfo.clipboardupload,
                                                            mapinfo: this.loc.datasourceinfo.mapinfo,});

            var utilbuttons = this._template.utilbuttons({ clear: this.loc.utils.clear,
                                                            show: this.loc.utils.show,
                                                            fileexport: this.loc.utils.export });
            var rowcounter = this._template.rowcounter({ rows: this.loc.utils.rows })
                                                            
            var wrapper = me._template.wrapper;
            wrapper.append(coordinatesystem);
            wrapper.find('.coordinateconversion-csystem').attr('id','inputcoordsystem');
            // jQuery(inputTitle).insertBefore(wrapper.find('#inputcoordsystem'));
            wrapper.find('#inputcoordsystem').prepend(inputTitle);
            wrapper.append(coordinatesystem);
            wrapper.find('.coordinateconversion-csystem').not('#inputcoordsystem').attr('id','targetcoordsystem');
            // jQuery(resultTitle).insertBefore(wrapper.find('#targetcoordsystem'));
            wrapper.find('#targetcoordsystem').prepend(resultTitle);
            wrapper.append(coordinatedatasource);
            wrapper.append(datasourceinfo);

            me.fileinput.create();
            if( me.fileinput.canUseAdvancedUpload() ) {
                var fileInputElement = me.fileinput.handleDragAndDrop( this.handleFile.bind(this) );
            }
            wrapper.find('.datasource-info').append( fileInputElement );
            wrapper.append(inputcoordinatefield);
            wrapper.find('.coordinatefield-input h5').append(rowcounter);
            wrapper.append(conversionbutton);
            wrapper.append(resultcoordinatefield);
            // wrapper.append(this._template.conversionfield);
            wrapper.append(utilbuttons);

            var input_instance = me.createSelect();
            wrapper.find('#inputcoordsystem').find('.select').each(function (index) {
                jQuery(this).append(input_instance.dropdowns[index]);
            });
            var target_instance = me.createSelect();
           wrapper.find('#targetcoordsystem').find('.select').each(function (index) {
                jQuery(this).append(target_instance.dropdowns[index]);
            });

            jQuery(container).append(wrapper);

            var coords = {} 
            for( var i = 0; i < 6; i++ ) {
                wrapper.find("#oskari-coordinate-table").append(this._template.tablerow( { coords: coords } ) );
                wrapper.find("#oskari-coordinate-table-result").append(this._template.tablerow( { coords: coords } ) );
                me.updateRowCount();
            }

            var inputValues = this.getSelection(input_instance, false);
            var targetValues = this.getSelection(target_instance, true);
            this.handleClipboard();
            this.handleButtons();
            this.handleRadioButtons();
            this.tableDisplayNumOfRows();
        },
        createSelect: function() {
            var json = this.helper.getOptionsJSON();

            var selections = [];
            var dropdowns = [];
            var selectInstances = [];
            var options = {}
            jQuery.each( json, function ( key, value ) {
                var size = Object.keys( value ).length;
                 jQuery.each( value, function ( key, val ) {
                    var valObject = {
                        id : val.id,
                        title : val.title,
                        cls: val.cls
                    };
                    selections.push( valObject );
                    if ( key === "0" ) {
                        options = {
                            placeholder_text: val.title,
                            allow_single_deselect : true,
                            disable_search_threshold: 10,
                            width: '100%'
                        };
                    }
                     if ( key == size -1 ) {
                        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', "id");
                        var dropdown = select.create(selections, options);
                        selections = [];
                        options = {};

                        dropdown.css( { width:'170px', float:'right' } );
                        select.adjustChosen();
                        select.selectFirstValue();

                        dropdowns.push( dropdown );
                        selectInstances.push( select );
                     }
                });
            });
            return { "instances": selectInstances, "dropdowns": dropdowns };
        },
          /**
         * @method getSelection
         * which key corresponds to which dropdown in the array:
         * [0] = geodetic datum,
         * [1] = coordinate system
         * [2] = map projection
         * [3] = geodetic coordinate system
         * [4] = heigth system
         */
        getSelection: function ( instance, called ) {
            var me = this;
            var values = [];
            var rows = this.getElements().rows;
            if( !called ) {
                jQuery( this.conversionContainer ).find('#inputcoordsystem').on("change", function() {
                    for (var i = 0; i < instance.instances.length; i++ ) {

                    instance.dropdowns[i].find('option').hide();
                    instance.dropdowns[i].find('.'+ instance.instances[0].getValue()).show();

                    // Koordinaatisto special cases
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_MAANT_2D" ) {
                        instance.dropdowns[3].find('option').hide();
                        jQuery(instance.dropdowns[i].find('.'+instance.instances[0].getValue()+'.'+ instance.instances[1].getValue())).show();
        
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
                    if( instance.instances[3].getValue() !== "COORDSYS_DEFAULT" ) {
                        me.startingSystem = true;
                    } else {
                        me.startingSystem = true;
                    }
                    if( instance.instances[4].getValue() === "KORKEUSJ_DEFAULT") {
                        rows.each( function ( idx, row ) {
                            var lastCell = jQuery(this).find('td:nth-last-child(2)');
                            if( !lastCell.hasClass('heightsystem' )) {
                                lastCell.addClass('heightsystem');
                            }
                        });
                    } else {
                        rows.each( function ( idx, row ) {
                            var lastCell = jQuery(this).find('td:nth-last-child(2)');
                            lastCell.attr("contenteditable", false);
                            lastCell.removeClass('heightsystem');
                        })
                    }
                        
                    if( instance.instances[1].getValue() === 'KOORDINAATISTO_SUORAK_2D' ) {
                        jQuery('.map-projection').show();
                    } else {
                        jQuery('.map-projection').hide();
                        instance.instances[2].resetToPlaceholder();
                    }

                    if( instance.instances[0].getValue() !== this.currentDatum || this.currentDatum === undefined ) {
                        if( i !== 0 ) {
                            instance.instances[i].resetToPlaceholder();
                        }
                    }
                    if( instance.instances[1].getValue() !== this.currentCoordinatesystem || this.currentCoordinatesystem === undefined ) {
                        if( i > 1) {
                            instance.instances[i].resetToPlaceholder();
                        }
                    }
                    values = [];
                    instance.instances[i].update();
                    for ( var j = 0; j < instance.instances.length; j++ ) {
                        var vl = instance.instances[j].getValue();
                        values.push( vl );
                    }
                    if( i == instance.instances.length -1 ) {
                        me.updateTableTitle( values );
                        me.updateEditable( values );
                        this.currentDatum = instance.instances[0].getValue();
                        this.currentCoordinatesystem = instance.instances[1].getValue();
                    }
                }
                });
            } else {
                jQuery( this.conversionContainer ).find('#targetcoordsystem').on("change", function() {
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
            var rows = this.getElements().rows;
            if( !this.clipboardInsert ) {
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

        },
        updateTableTitle: function (values) {
            this.getElements().tableHeader.remove();
            
            var x = y = z = "";
            if( values[3].indexOf("COORDSYS_KKJ" ) !== -1 ) {
                x = this.loc.coordinatefield.kkjnorth
                y = this.loc.coordinatefield.kkjeast
                z = ""
            }
            if( values[3].indexOf("COORDSYS_ETRS" ) !== -1 ) {
                x = this.loc.coordinatefield.kkjeast
                y = this.loc.coordinatefield.kkjnorth
                z = ""
            }
            if( values[1].indexOf("KOORDINAATISTO_MAANT_2D" ) !== -1 ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = ""
            } else if( values[1].indexOf("KOORDINAATISTO_MAANT_3D" ) !== -1 ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = this.loc.coordinatefield.ellipse_height
            }
            if(values[1].indexOf("KOORDINAATISTO_SUORAK_3D" ) !== -1 ) {
                   x = this.loc.coordinatefield.geox
                   y = this.loc.coordinatefield.geoy
                   z = this.loc.coordinatefield.geoz
            }

            if( x !== '' && y !== '' || z !== '' ) {
            var tableHeader = this._template.oskari_table_header({  north: x,
                                                            east: y,
                                                            ellipse_height: z });
            jQuery(tableHeader).insertBefore(jQuery(this.conversionContainer).find(".oskari-table-content"));
            jQuery(tableHeader).insertBefore(jQuery(this.conversionContainer).find(".oskari-table-content-target"));
            }
        },
        updateRowCount: function () {
            jQuery(this.conversionContainer).find("#num").text(this.numrows++);
        },
        /**
         * @method validateData
         * check different conditions if data matches to them
         */
        validateData: function( data ) {
            var userSpec = this.getUserSelections().import;
            if( !userSpec ) {
                Oskari.log(this.getName()).warn("No specification for file-import");
            }
            var lonlat = new RegExp(/(lon|lat)[\:][0-9.]+[\,]?/g);
            var fullLonlat = new RegExp(/(?:lon|lat)[\:][0-9.]+[\,].*,?/g);
            var numeric = new RegExp(/[0-9.]+/);
            var numericMatcher = new RegExp(/([0-9.])+\s*,?/g);
            var whitespaceseparatednum = new RegExp(/^[0-9.]+\s[0-9.]+,/gmi)

            var getMatchedValues = function( matchedData, useLonLatMatcher ) {
                var jsonLonLat = {};
                for(var i = 0; i < matchedData.length; i++) {
                    jsonLonLat[i] = {lon:'',lat:''};

                    if( useLonLatMatcher ) {
                        var match = matchedData[i].match(lonlat);
                    } else {
                        var match = matchedData[i].match(numericMatcher);
                    }
                    var lonValue = match[0].match(numeric);
                    var latValue = match[1].match(numeric);
                    jsonLonLat[i].lon = lonValue[0];
                    jsonLonLat[i].lat = latValue[0];
                }
                return jsonLonLat;
            };
            var jsonLonLat = {};
            var fullLonLatMatch = data.match(fullLonlat);
            var numMatch = data.match(whitespaceseparatednum);
            if( fullLonLatMatch !== null ) {
                return getMatchedValues( fullLonLatMatch, true );
            } else {
                if( numMatch !== null ) {
                    return getMatchedValues( numMatch, false );
                }
            }
        },
        /**
         * @method handleClipboard
         *
         * Handles the paste event in the input table
         * example data to paste:
            lon:385000.5, lat:667500.75,
            lon:385545.5, lat:6675310.75
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

                    if( me.clipboardInsert === false ) {
                        return;
                    }
                    var clipboardData, pastedData;

                        // Get pasted data via clipboard API
                        clipboardData = e.clipboardData || window.clipboardData;
                        pastedData = clipboardData.getData('Text');

                        var dataJson = me.validateData(pastedData);

                        me.populateTableWithData(e.target, dataJson);

                });
            }
        },
        /**
         * @method handleFile
         * Pass this function as a callback to fileinput to get the file-data
         */
        handleFile: function( fileContent ) {
            var dataJson = this.validateData( fileContent );
            var insertTarget = jQuery('#oskari-coordinate-table').find('td').first();
            this.populateTableWithData( insertTarget, dataJson );
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         * 
         */
        handleRadioButtons: function() {
            var me = this;
            var clipboardInfo = jQuery(me.conversionContainer).find('.coordinateconversion-clipboardinfo');
            var mapInfo = jQuery(me.conversionContainer).find('.coordinateconversion-mapinfo');
            var fileInput = jQuery(me.conversionContainer).find('.oskari-fileinput');
            var importfile = me.file.getElement().import;
            jQuery('input[type=radio][name=load]').change(function() {
                if (this.value == '1') {
                    me.showDialogue( importfile, false );
                    clipboardInfo.hide();
                    fileInput.show();
                    me.mapselect = false;
                    me.clipboardInsert = false;
                }
                else if (this.value == '2') {
                    fileInput.hide();
                    me.clipboardInsert = true;
                    clipboardInfo.show();
                    me.mapselect = false;
                }
                me.updateEditable();
            });
                jQuery('.mapselect').on("click", function() {
                    me.instance.plugins['Oskari.userinterface.Flyout'].shouldUpdate(me.getName());
                    me.mapselect = true; 
                    me.clipboardInsert = false;                   
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
            jQuery(this.conversionContainer).find('.clear').on("click", function () {
                var cells = jQuery('#oskari-coordinate-table tr .cell:not(.cell.control)');
                for(var i = 0; i < cells.length; i++) {
                    var trimmedCellValue = jQuery.trim( jQuery( cells[i] ).html());
                    if( trimmedCellValue !== "" ) {
                        jQuery(cells[i]).parent().remove();
                    }
                }
            });
            jQuery(this.conversionContainer).find('.show').on("click", function () {
                var rows = me.getElements().rows;
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html();
                    var lon = jQuery(this).find('.lon').html();
                    if(lat != "  " && lon != "  "){
                        var coords = { lon: lon, lat: lat };
                        helper.addMarkerForCoords(coords, me.startingSystem);
                    }
                })
            });
            jQuery(this.conversionContainer).find('.export').on("click", function () {
                var exportfile = me.file.getElement().export;
                me.showDialogue( exportfile, true );
            });
        },
        /**
         * @method populateTableWithData
         *
         * {Object} data, each key need to have property lon & lat 
         */
        populateTableWithData: function( cell, data ) {
            var table = this.getElements().table;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var row = this._template.tablerow( { coords: data[key] } );
                    jQuery(cell).parent().after(row);
                    this.updateRowCount();
                }
            }
            table.trigger('rowCountChanged');
        },
        showDialogue: function( content, shouldExport ) {
            var jc = jQuery(content);
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.makeDraggable();
            dialog.createCloseIcon();
            if( shouldExport ) {
                dialog.show(this.loc.filesetting.export.title, jc);
                this.file.getExportSettings( this.exportFile.bind(this), dialog.getJqueryContent(), dialog );
            } else {
                dialog.show(this.loc.filesetting.import.title, jc);
                this.file.getImportSettings(  this.importSettings.bind(this), dialog.getJqueryContent(), dialog );
            }
        },
        importSettings: function ( settings ) {
            this._userSelections = { "import": settings };
        },
        exportFile: function ( settings ) {
            var me = this;
                var rows = me.getElements().rows;
                var arr = [];
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html();
                    var lon = jQuery(this).find('.lon').html();
                    if ( lat != "  " && lon != "  " ) {
                        var coords = { lon: lon, lat: lat };
                        arr.push( JSON.stringify( coords ) );
                    }
                });
            if( arr.length !== 0 ) {
                me.fileinput.exportToFile( arr, settings.filename+'.txt' );
            } else {
                Oskari.log(me.getName()).warn("No transformed coordinates to write to file!");
            }
        },
        addToInputTable: function (coords) {
            var table = this.getElements().table;
            for (var i = 0; i < coords.length; i++ ) {
                var row = this._template.tablerow( { coords: coords[i] } );
                table.find('tr:first').after(row);
                me.updateRowCount();
            }
            table.trigger('rowCountChanged');
        },
        tableDisplayNumOfRows: function () {
            var me = this;
            var table = this.getElements().table;
            table.bind('rowCountChanged', function (evt) {
                var rows = me.getElements().rows;
                    if( rows.length >= 1000 ) {
                        rows.slice(1000).css('display', 'none');
                    }
                });
        },
        getElements: function () {
            var elements = {
                "table": jQuery(this.conversionContainer).find('#oskari-coordinate-table'),
                "rows": jQuery(this.conversionContainer).find("#oskari-coordinate-table tr"),
                "tableHeader": jQuery(this.conversionContainer).find(".oskari-table-header")
            }
            return elements;
        },
        getUserSelections: function () {
            return this._userSelections;
        }
    }
);
 