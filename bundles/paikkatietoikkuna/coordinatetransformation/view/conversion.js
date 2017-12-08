Oskari.clazz.define('Oskari.coordinatetransformation.view.conversion',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = me.instance.helper;
        me.isMapSelect = false;
        me.clipboardInsert = false;
        me.conversionContainer = null
        me.startingSystem = false;
        me.fileinput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', me.loc);
        me.file = Oskari.clazz.create('Oskari.coordinatetransformation.view.filesettings', me.instance, me.loc);
        me.inputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc );
        me.outputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc );       
        me.inputSelect = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', this );
        me.targetSelect = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', this );
        me.file.create();
        me._selectInstances = { input: null, target: null };
        me._userSelections = { import: null, export: null };
        me._template = {
            wrapper: jQuery('<div class="conversionwrapper"></div>'),
            title: _.template('<h4 class="header"><%= title %></h4>'),
            coordinatesystem: _.template(' <div class="coordinateconversion-csystem">' +
                                    '<h5><%= title %></h5>'+
                                    '<div class="geodetic-datum"><b class="dropdown_title"><%= geodetic_datum %></b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br> ' +
                                    '<div class="coordinate-system"><b class="dropdown_title"><%= coordinate_system %></b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div>  </div> </br> ' +
                                    '<div class="map-projection" style="display:none;"> <%= map_projection %> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br>' +
                                    '<div class="geodetic-coordinatesystem"><b class="dropdown_title"><%= geodetic_coordinate_system %> *</b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br> ' +
                                    '<div class="height-system"><b class="dropdown_title"><%= height_system %></b></div> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div>'
                                ),
            coordinatedatasource: _.template('<div class="coordinateconversion-datasource"> </br> ' +
                                            '<h4><%= title %></h4>'+
                                            '<form>'+
                                                '<input type="radio" id="clipboard" name="load" value="2"><label for="clipboard"><span></span> <%= clipboard %> </label>'+
                                                '<input type="radio" id="file" name="load" value="1"><label for="file"> <span></span> <%= file %> </label>'+
                                                '<input type="button" class="mapselect" name="load" value="<%= map %>">'+
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
            conversionbutton: _.template('<div class="conversionbtn" style="display:inline-block;">' +
                                            '<input id="convert" type="button" value="<%= convert %> >>">' +
                                         '</div>'),
            utilbuttons: _.template('<div class="coordinateconversion-buttons">' +
                                        '<input class="clear" type="button" value="<%= clear %> ">' +
                                        '<input class="show" type="button" value="<%= show %> ">' +
                                        // '<input id="overlay-btn" class="export" type="button" value="<%= fileexport %> ">' +
                                        '</div>')
        }
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.view.conversion';
        },
        getContainer: function () {
            return jQuery(this.conversionContainer);
        },
        getSelectInstances: function () {
            return this._selectInstances;
        },
        createUI: function( container ) {
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
                                                            
            var wrapper = this._template.wrapper.clone();
            wrapper.append( coordinatesystem );
            wrapper.find( '.coordinateconversion-csystem' ).attr( 'id','inputcoordsystem' );
            wrapper.find( '#inputcoordsystem' ).prepend( inputTitle );
            wrapper.append( coordinatesystem );
            wrapper.find( '.coordinateconversion-csystem' ).not( '#inputcoordsystem' ).attr( 'id','targetcoordsystem' );
            wrapper.find( '#targetcoordsystem' ).prepend( resultTitle );
            wrapper.append( coordinatedatasource );
            wrapper.append( datasourceinfo );

            this.fileinput.create();
            var inputTable = this.inputTable.create();
            var targetTable = this.outputTable.create();
            this.outputTable.getContainer().find( ".coordinatefield-table" ).addClass( 'target' );

            if ( this.fileinput.canUseAdvancedUpload() ) {
                var fileInputElement = this.fileinput.handleDragAndDrop( this.handleFile.bind( this ) );
            }
            wrapper.find( '.datasource-info' ).append( fileInputElement );

            wrapper.append( inputTable );
            wrapper.append( conversionbutton );
            wrapper.append( targetTable );
            wrapper.append( utilbuttons );

            this.inputSelect.create();
            this._selectInstances.input = this.inputSelect.getSelectInstances();
            var inp_dropdowns = this.inputSelect.getDropdowns();
            var i = 0;
            Object.keys( inp_dropdowns ).forEach( function( key ) {
                jQuery( wrapper.find( '#inputcoordsystem' ).find( '.select' )[i] ).append( inp_dropdowns[key] );
                i++;
            });
            this.targetSelect.create();
            this._selectInstances.target = this.targetSelect.getSelectInstances();
            var out_dropdowns = this.targetSelect.getDropdowns();
            var j = 0;
            Object.keys( out_dropdowns ).forEach( function( key ) {
                jQuery( wrapper.find( '#targetcoordsystem' ).find( '.select' )[j] ).append( out_dropdowns[key] );
                j++;
            });

            jQuery(container).append(wrapper);
            var input = wrapper.find( '#inputcoordsystem' );
            var target = wrapper.find( '#targetcoordsystem' );
            this.inputSelect.handleSelectionChanged( input );
            this.targetSelect.handleSelectionChanged( target );
            this.handleClipboard();
            this.handleButtons();
            this.handleRadioButtons();
            this.inputTable.bindRowCountListener();
        },
        setVisible: function ( visible ) {
            if( !visible ) {
                this.getContainer().parent().parent().hide();
            } else {
                this.getContainer().parent().parent().show();
            }
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
            var whitespaceseparatednum = new RegExp(/^[0-9.]+,+\s[0-9.]+,/gmi)

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
        setSelectionValue: function ( selectInstance, value ) {
            selectInstance.setValue( value );
        },
        getCrsOptions: function () {
            var instances = this.getSelectInstances();
            var sourceSelection = this.getSelectionValue( instances.input.coordinatesystem );
            var targetSelection = this.getSelectionValue( instances.target.coordinatesystem );
            var sourceHeightSelection = this.getSelectionValue( instances.input.heigthsystem );
            var targetHeightSelection = this.getSelectionValue( instances.target.heigthsystem );

            var source = this.helper.getMappedEPSG( sourceSelection );
            var target = this.helper.getMappedEPSG( targetSelection );
            var sourceHeight = this.helper.getMappedEPSG( sourceHeightSelection );
            var targetHeight = this.helper.getMappedEPSG( targetHeightSelection );

            return options = {
                source: source,
                sourceHeight: sourceHeight,
                target: target,
                targetHeight: targetHeight
            }
        },
        handleServerResponce: function ( response ) {
            var responseCoords = response.coordinates;
            var obj = {};
            if( Array.isArray( responseCoords ) ) {
                for ( var i in responseCoords ) {
                    if( Array.isArray(responseCoords[i]) ) {
                        for ( var j = 0; j < responseCoords[i].length; j++ ) {
                            obj[i] = {
                                lon: responseCoords[i][0],
                                lat: responseCoords[i][1]
                            }
                        }
                    }
                }
            }
            this.outputTable.populate( obj );
        },
        /**
         * @method handleClipboard
         * Handles the paste event in the input table
         */
        handleClipboard: function () {
            var me = this;
            var cells = document.getElementsByClassName("cell");

            for( var i = 0; i < cells.length; i++ ) {
                cells[i].addEventListener('paste', function( e ) {
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

                    var dataJson = me.validateData( pastedData );

                    me.inputTable.populate( dataJson );
                });
            }
        },
        /**
         * @method handleFile
         * Pass this function as a callback to fileinput to get the file-data
         */
        handleFile: function( fileContent ) {
            var dataJson = this.validateData( fileContent );
            this.inputTable.populate( dataJson );
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         */
        handleRadioButtons: function () {
            var me = this;
            var container = me.getContainer();
            var clipboardInfo = container.find('.coordinateconversion-clipboardinfo');
            var mapInfo = container.find('.coordinateconversion-mapinfo');
            var fileInput = container.find('.oskari-fileinput');
            var importfile = me.file.getElement().import;
            jQuery('input[type=radio][name=load]').change(function() {
                if (this.value == '1') {
                    // me.showDialogue( importfile, false );
                    clipboardInfo.hide();
                    fileInput.show();
                    me.isMapSelect = false;
                    me.clipboardInsert = false;
                }
                else if (this.value == '2') {
                    fileInput.hide();
                    me.clipboardInsert = true;
                    clipboardInfo.show();
                    me.isMapSelect = false;
                }
                me.inputTable.isEditable( me.clipboardInsert );
            });
                jQuery('.mapselect').on("click", function() {
                    me.isMapSelect = true;    
                    me.instance.toggleViews("mapselect");
                    me.clipboardInsert = false;
                    me.selectEPSG3067();
                });
         },
        selectEPSG3067: function () {
            var instances = this.getSelectInstances();
            // EPSG-3067 settings
            var sourceSelection = this.setSelectionValue( instances.input.datum, "DATUM_EUREF-FIN" );
            var sourceHeightSelection = this.setSelectionValue( instances.input.dimension, "KOORDINAATISTO_SUORAK_2D" );
            var sourceSelection = this.setSelectionValue( instances.input.projection, "TM" );
            var sourceHeightSelection = this.setSelectionValue( instances.input.coordinatesystem, "COORDSYS_ETRS-TM35FIN" );
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         */
        handleButtons: function () {
            var me = this;
            var container = me.getContainer();
            container.find('.clear').on("click", function () {
                me.inputTable.clearRows();
                me.outputTable.clearRows();
                me.helper.removeMarkers();
            });
            container.find('.show').on("click", function () {
                var rows = me.inputTable.getElements().rows;
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html();
                    var lon = jQuery(this).find('.lon').html();
                    if(lat != "  " && lon != "  ") {
                        var coords = { lon: lon, lat: lat };
                        me.helper.addMarkerForCoords(coords, me.startingSystem);
                    }
                });
                me.instance.toggleViews("mapmarkers");
            });
            container.find('.export').on("click", function () {
                var exportfile = me.file.getElement().export;
                me.showDialogue( exportfile, true );
            });
            container.find('#convert').on("click", function () {
                var crs = me.getCrsOptions();
                var rows = me.inputTable.getElements().rows;
                var coordinateArray = [];
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html().trim();
                    var lon = jQuery(this).find('.lon').html().trim();
                    var height = jQuery(this).find('.height').html().trim();
                    if (lat != "" && lon != "" && height != "" ) {
                        var coords = [ Number(lon), Number(lat), Number(height) ];
                        coordinateArray.push( coords );
                    }
                    else if ( lat != "" && lon != "" ) {
                        var coords = [ Number(lon), Number(lat) ];
                        coordinateArray.push( coords );
                    }

                });
                var payload = {
                    sourceCrs: crs.source,
                    sourceHeightCrs: crs.sourceHeight,
                    targetCrs: crs.target,
                    targetHeightCrs: crs.targetHeight,
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
                var rows = me.outputTable.getElements().rows;
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
 