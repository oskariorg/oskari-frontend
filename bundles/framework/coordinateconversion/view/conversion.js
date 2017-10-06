Oskari.clazz.define('Oskari.coordinateconversion.view.conversion',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = Oskari.clazz.create('Oskari.coordinateconversion.helper', me.instance, me.loc);
        me.mapselect = false;
        me.clipboardInsert = false;
        me.conversionContainer = null
        me.startingSystem = false;
        me.fileinput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', me.loc);
        me.file = Oskari.clazz.create('Oskari.coordinateconversion.view.filesettings', me.instance, me.loc);
        me.table = Oskari.clazz.create('Oskari.coordinateconversion.component.table', this, me.loc );
        me.file.create();
        me._selectInstances = { input: null, target: null };
        me._userSelections = { import: null, export: null };
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
            conversionbutton: _.template('<div class="conversionbtn" style="display:inline-block; padding-left: 8px;">' +
                                            '<input id="convert" type="button" value="<%= convert %> >>">' +
                                         '</div>'),
            utilbuttons: _.template('<div class="coordinateconversion-buttons">' +
                                        '<input id="overlay-btn" class="clear" type="button" value="<%= clear %> ">' +
                                        '<input id="overlay-btn" class="show" type="button" value="<%= show %> ">' +
                                        '<input id="overlay-btn" class="export" type="button" value="<%= fileexport %> ">' +
                                        '</div>')
        }
    }, {
        getName: function() {
            return 'Oskari.coordinateconversion.view.conversion';
        },
        getContainer: function () {
            return this.conversionContainer;
        },
        getSelectInstances: function () {
            return this._selectInstances;
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
    

            var conversionbutton = this._template.conversionbutton({ convert: this.loc.coordinatefield.convert });

            var datasourceinfo = this._template.datasourceinfo({ clipboardupload: this.loc.datasourceinfo.clipboardupload,
                                                            mapinfo: this.loc.datasourceinfo.mapinfo,});

            var utilbuttons = this._template.utilbuttons({ clear: this.loc.utils.clear,
                                                            show: this.loc.utils.show,
                                                            fileexport: this.loc.utils.export });
                                                            
            var wrapper = me._template.wrapper;
            wrapper.append(coordinatesystem);
            wrapper.find('.coordinateconversion-csystem').attr('id','inputcoordsystem');
            wrapper.find('#inputcoordsystem').prepend(inputTitle);
            wrapper.append(coordinatesystem);
            wrapper.find('.coordinateconversion-csystem').not('#inputcoordsystem').attr('id','targetcoordsystem');
            wrapper.find('#targetcoordsystem').prepend(resultTitle);
            wrapper.append(coordinatedatasource);
            wrapper.append(datasourceinfo);

            me.fileinput.create();
            var table = me.table.create();

            if( me.fileinput.canUseAdvancedUpload() ) {
                var fileInputElement = me.fileinput.handleDragAndDrop( this.handleFile.bind(this) );
            }
            wrapper.find('.datasource-info').append( fileInputElement );

            wrapper.append( table.input );
            wrapper.append(conversionbutton);
            wrapper.append( table.output );

            wrapper.append(utilbuttons);

            var input_instance = me.createSelect();
            this._selectInstances.input = input_instance.instances;
            wrapper.find('#inputcoordsystem').find('.select').each(function (index) {
                jQuery(this).append(input_instance.dropdowns[index]);
            });
            var target_instance = me.createSelect();
            this._selectInstances.target = target_instance.instances;
           wrapper.find('#targetcoordsystem').find('.select').each(function (index) {
                jQuery(this).append(target_instance.dropdowns[index]);
            });

            jQuery(container).append(wrapper);

            var inputValues = this.handleSelectionChanged(input_instance, false);
            var targetValues = this.handleSelectionChanged(target_instance, true);
            this.handleClipboard();
            this.handleButtons();
            this.handleRadioButtons();
            this.table.displayNumOfRows();
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
         * @method handleSelectionChanged
         * which key corresponds to which dropdown in the array:
         * [0] = geodetic datum,
         * [1] = coordinate system
         * [2] = map projection
         * [3] = geodetic coordinate system
         * [4] = heigth system
         */
        handleSelectionChanged: function ( instance, called ) {
            var me = this;
            var values = [];
            var rows = this.table.getElements().rows;
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
                        me.table.updateTitle( values );
                        me.table.isEditable( me.clipboardInsert );
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
        getSelectionValue: function ( selectListInstance ) {
            return selectListInstance.getValue();
        },
        getCrsOptions: function () {
            var instances = this.getSelectInstances();
            var sourceSelection = this.getSelectionValue( instances.input[3] );
            var targetSelection = this.getSelectionValue( instances.target[3] );
            var heightSelection = this.getSelectionValue( instances.input[4] );
            var source = this.helper.getMappedEPSG( sourceSelection );
            var target = this.helper.getMappedEPSG( targetSelection );
            var inputHeight = this.helper.getMappedEPSG( heightSelection );

            return options = {
                source: source,
                target: target,
                height: inputHeight
            }
        },
        handleServerResponce: function ( response ) {
            var insertTarget = jQuery('#oskari-coordinate-table-result').find('td').first();
            this.table.populate( insertTarget, response );
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

                        me.table.populate(e.target, dataJson);

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
            this.table.populate( insertTarget, dataJson );
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         * 
         */
        handleRadioButtons: function () {
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
                me.table.isEditable( me.clipboardInsert );
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
                var rows = me.table.getElements().rows;
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html();
                    var lon = jQuery(this).find('.lon').html();
                    if(lat != "  " && lon != "  "){
                        var coords = { lon: lon, lat: lat };
                        me.helper.addMarkerForCoords(coords, me.startingSystem);
                    }
                })
            });
            jQuery(this.conversionContainer).find('.export').on("click", function () {
                var exportfile = me.file.getElement().export;
                me.showDialogue( exportfile, true );
            });
            jQuery(this.conversionContainer).find('#convert').on("click", function () {
                var crs = me.getCrsOptions();
                var rows = me.table.getElements().rows;
                var coordinateArray = [];
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html().trim();
                    var lon = jQuery(this).find('.lon').html().trim();
                    var height = jQuery(this).find('.height').html().trim();
                    if ( lat != "" && lon != "" ) {
                        var coords = { lon: lon, lat: lat, height: height };
                        coordinateArray.push( coords );
                    }
                });
                var payload = {
                    sourceCrs: crs.source,
                    heightCrs: crs.height,
                    targetCrs: crs.target,
                    coords: coordinateArray
                }
                me.instance.getService().getConvertedCoordinates( payload, me.handleServerResponce.bind( me ) );
            });
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
                var rows = me.table.getElements().rows;
                var arr = [];
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html();
                    var lon = jQuery(this).find('.lon').html();
                    if ( lat != "  " && lon != "  " ) {
                        var coords = { lon: lon, lat: lat };
                        arr.push( coords );
                    }
                });
            if( arr.length !== 0 ) {
                me.fileinput.exportToFile( arr, settings.filename+'.txt' );
            } else {
                Oskari.log(me.getName()).warn("No transformed coordinates to write to file!");
            }
        },
        getUserSelections: function () {
            return this._userSelections;
        }
    }
);
 