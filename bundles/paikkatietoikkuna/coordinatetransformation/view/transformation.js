Oskari.clazz.define('Oskari.coordinatetransformation.view.transformation',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = me.instance.helper;
        me.isMapSelection = false;
        me.clipboardInsert = false;
        me.conversionContainer = null
        me.startingSystem = false;
        me.fileinput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', me.loc);
        me.file = Oskari.clazz.create('Oskari.coordinatetransformation.view.filesettings', me.instance, me.loc);

        me.inputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc );
        me.outputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc );

        me.inputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this);
        me.outputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this);

        me.sourceSelect = Oskari.clazz.create('Oskari.coordinatetransformation.component.SourceSelect', me.loc );

        me.file.create();
        me._selectInstances = { input: null, target: null };
        me._userSelections = { import: null, export: null };
        me._template = {
            wrapper: jQuery('<div class="transformation-wrapper"></div>'),
            title: _.template('<h4 class="header"><%= title %></h4>'),
            conversionfield: jQuery('<div class="coordinateconversion-field"></div>'),
            transformButton: _.template(
                '<div class="transformation-button" style="display:inline-block;">' +
                    '<input id="transform" type="button" value="<%= convert %> >>">' +
                '</div>'
            ),
            utilRow: _.template(
                '<div class="util-row">' +
                    '<input class="clear" type="button" value="<%= clear %> ">' +
                    '<input class="show" type="button" value="<%= show %> ">' +
                    // '<input id="overlay-btn" class="export" type="button" value="<%= fileexport %> ">' +
                '</div>'
            )
        }
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.view.transformation';
        },
        getContainer: function () {
            return jQuery(this.conversionContainer);
        },
        createUI: function( container ) {
            this.conversionContainer = container;

            var inputTitle = this._template.title( { title: this.loc.title.input } );
            var resultTitle = this._template.title( { title: this.loc.title.result } ); 

            var inputTable = this.inputTable.create();
            var targetTable = this.outputTable.create();

            var transformButton = this._template.transformButton({ convert: this.loc.coordinatefield.convert });

            var utilRow = this._template.utilRow({
                clear: this.loc.utils.clear,
                show: this.loc.utils.show,
                fileexport: this.loc.utils.export
                });
                                                            
            var wrapper = this._template.wrapper.clone();
            if ( this.sourceSelect.getElement() ) {
                wrapper.append( this.sourceSelect.getElement() );
            }
            if ( this.inputSystem.getElement() ) {
                wrapper.append( this.inputSystem.getElement() );
                wrapper.find( '.transformation-system' ).attr( 'id','inputcoordsystem' );
                wrapper.find( '#inputcoordsystem' ).prepend( inputTitle );
            }
            if ( this.outputSystem.getElement() ) {
                wrapper.append( this.outputSystem.getElement() );
                wrapper.find( '.transformation-system' ).not( '#inputcoordsystem' ).attr( 'id','targetcoordsystem' );
                wrapper.find( '#targetcoordsystem' ).prepend( resultTitle );
            }

            this.fileinput.create();
            this.outputTable.getContainer().find( ".coordinatefield-table" ).addClass( 'target' );

            if ( this.fileinput.canUseAdvancedUpload() ) {
                var fileInputElement = this.fileinput.handleDragAndDrop( this.handleFile.bind( this ) );
            }
            wrapper.find( '.datasource-info' ).append( fileInputElement );

            wrapper.append( inputTable );
            wrapper.append( transformButton );
            wrapper.append( targetTable );
            wrapper.append( utilRow );


            jQuery(container).append(wrapper);

            this.handleClipboard();
            this.handleButtons();
            this.handleRadioButtons();
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
            var input = this.inputSystem.getSelectInstance();
            var target = this.outputSystem.getSelectInstance();

            var sourceSelection = this.getSelectionValue( input["geodetic-coordinate"] );
            var targetSelection = this.getSelectionValue( target["geodetic-coordinate"] );
            var sourceElevationSelection = this.getSelectionValue( input.elevation );
            var targetElevationSelection = this.getSelectionValue( target.elevation );

            var source = this.helper.getMappedEPSG( sourceSelection );
            var target = this.helper.getMappedEPSG( targetSelection );
            var sourceElevation = this.helper.getMappedEPSG( sourceElevationSelection );
            var targetElevation = this.helper.getMappedEPSG( targetElevationSelection );

            return options = {
                source: source,
                sourceElevation: sourceElevation,
                target: target,
                targetElevation: targetElevation
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
            var mapSelectInfo = container.find('.coordinateconversion-mapinfo')
            var fileInput = container.find('.oskari-fileinput');
            var importfile = me.file.getElement().import;
            jQuery('input[type=radio][name=load]').change(function() {
                if (this.value == '1') {
                    // me.showDialogue( importfile, false );
                    clipboardInfo.hide();
                    mapSelectInfo.hide();
                    fileInput.show();
                    me.isMapSelection = false;
                    me.clipboardInsert = false;
                }
                else if (this.value == '2') {
                    fileInput.hide();
                    mapSelectInfo.hide();
                    me.clipboardInsert = true;
                    clipboardInfo.show();
                    me.isMapSelection = false;
                }
                else if (this.value == '3') {
                    clipboardInfo.hide();
                    fileInput.hide();
                    mapSelectInfo.show(); 
                    me.isMapSelection = true;    
                }
                me.inputTable.isEditable( me.clipboardInsert );
            });
                jQuery('.selelctFromMap').on("click", function() {
                    me.instance.toggleViews("MapSelection");
                    me.clipboardInsert = false;
                });
         },
        /**
         * @method selectMapProjectionValues
         * Inits the on change listeners for the radio buttons
         */
        selectMapProjectionValues: function () {
            var input = this.inputSystem.getSelectInstance();
            // EPSG-3067 settings
            var sourceSelection = this.setSelectionValue( input.datum, "DATUM_EUREF-FIN" );
            var sourceelevationSelection = this.setSelectionValue( input.coordinate, "KOORDINAATISTO_SUORAK_2D" );
            var sourceSelection = this.setSelectionValue( input.projection, "TM" );
            var sourceelevationSelection = this.setSelectionValue( input["geodetic-coordinate"], "ETRS-TM35FIN" );
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
            container.find('#transform').on("click", function () {
                var crs = me.getCrsOptions();
                var rows = me.inputTable.getElements().rows;
                var coordinateArray = [];
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html().trim();
                    var lon = jQuery(this).find('.lon').html().trim();
                    var elevation = jQuery(this).find('.elevation').html().trim();
                    if (lat != "" && lon != "" && elevation != "" ) {
                        var coords = [ Number(lon), Number(lat), Number(elevation) ];
                        coordinateArray.push( coords );
                    }
                    else if ( lat != "" && lon != "" ) {
                        var coords = [ Number(lon), Number(lat) ];
                        coordinateArray.push( coords );
                    }

                });
                var payload = {
                    sourceCrs: crs.source,
                    sourceElevationCrs: crs.sourceElevation,
                    targetCrs: crs.target,
                    targetElevationCrs: crs.targetElevation,
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
 