Oskari.clazz.define('Oskari.coordinatetransformation.view.transformation',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = me.instance.helper;
        me.isMapSelection = false;
        me.conversionContainer = null
        me.startingSystem = false;

        me.fileinput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', me.loc);
        me.fileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.instance, me.loc);
        me.dataHandler = Oskari.clazz.create( 'Oskari.coordinatetransformation.CoordinateDataHandler', me.getUserFileSettingSelections );

        me.inputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc );
        me.outputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc );

        me.inputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this);
        me.outputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this);

        me.sourceSelect = Oskari.clazz.create('Oskari.coordinatetransformation.component.SourceSelect', me.loc );

        me.fileHandler.create();

        me._template = {
            wrapper: jQuery('<div class="transformation-wrapper"></div>'),
            system: jQuery('<div class="systems"></div>'),
            title: _.template('<h4 class="header"><%= title %></h4>'),            
            transformButton: _.template(
                '<div class="transformation-button" style="display:inline-block;">' +
                    '<input class="primary" id="transform" type="button" value="<%= convert %> >>">' +
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
            var system = this._template.system.clone();
            if ( this.sourceSelect.getElement() ) {
                wrapper.append( this.sourceSelect.getElement() );
            }
            if ( this.inputSystem.getElement() ) {
                var element = this.inputSystem.getElement();
                element.attr('data-type', 'coordinate-input');
                element.prepend( inputTitle );
                system.append( element );
            }
            if ( this.outputSystem.getElement() ) {
                var element = this.outputSystem.getElement();
                element.attr('data-type', 'coordinate-output');
                element.prepend( resultTitle );
                system.append( element );
            }
            wrapper.append(system);
            this.fileinput.create();
            this.outputTable.getContainer().find( ".coordinatefield-table" ).addClass( 'target' );

            if ( this.fileinput.canUseAdvancedUpload() ) {
                var fileInputElement = this.fileinput.handleDragAndDrop( this.readFileData.bind( this ) );
            }
            wrapper.find( '.datasource-info' ).append( fileInputElement );

            wrapper.append( inputTable );
            wrapper.append( transformButton );
            wrapper.append( targetTable );
            wrapper.append( utilRow );


            jQuery(container).append(wrapper);

            this.inputTable.handleClipboardPasteEvent();
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
        updateCoordinateData: function ( flag, coordinates ) {
            this.dataHandler.modifyCoordinateObject( flag, coordinates );
            this.refreshTableData();
        },
        /**
         * @method readFileData
         * Pass this function as a callback to fileinput to get the file-data
         */
        readFileData: function( fileData ) {
            var dataJson = this.dataHandler.validateData( fileData );
            this.updateCoordinateData( dataJson );
        },
        getUserFileSettingSelections: function () {
            this.fileHandler.getUserFileSettingSelections();
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
        handleServerResponse: function ( response ) {
            var obj = this.dataHandler.constructLonLatObjectFromArray(response.coordinates);
            this.updateCoordinateData("output", obj);
        },
        /**
         * @method refreshTableData
         * @description refreshes both input and output tables with current data
         */
        refreshTableData: function () {
            var inputData = [];
            var outputData = [];

            var data = this.dataHandler.getCoordinateObject().coordinates;

            data.map( function ( pair ) {
                if ( pair.input ) {
                    inputData.push( pair.input );
                }
                if ( pair.output ) {
                    outputData.push( pair.output );
                }
            });

            this.inputTable.render( inputData );
            this.outputTable.render( outputData );
        },
        /**
         * @method handleClipboardPasteEvent
         * Handles the paste event in the input table
         */
        handleClipboardPasteEvent: function () {
            var me = this;
            var cells = document.getElementsByClassName("cell");

            for( var i = 0; i < cells.length; i++ ) {
                cells[i].addEventListener('paste', function( e ) {
                    e.stopPropagation();
                    e.preventDefault();

                    var clipboardData, pastedData;
                    // Get pasted data via clipboard API
                    clipboardData = e.clipboardData || window.clipboardData;
                    pastedData = clipboardData.getData('Text');

                    var dataJson = me.dataHandler.validateData( pastedData );
                    me.updateCoordinateData( "input", dataJson );
                });
            }
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         */
        handleRadioButtons: function () {
            var me = this;
            var container = me.getContainer();
            var clipboardInfoElement = container.find('.coordinateconversion-clipboardinfo');
            var mapSelectInfoElement = container.find('.coordinateconversion-mapinfo')
            var fileInputElement = container.find('.oskari-fileinput');
            var importfile = me.fileHandler.getElement().import;

            jQuery('input[type=radio][name=load]').change(function() {
                me.inputTable.isEditable( false );
                me.isMapSelection = false;
                
                if (this.value == '1') {
                    // me.fileHandler.showFileDialogue( importfile, false );
                    clipboardInfoElement.hide();
                    mapSelectInfoElement.hide();
                    fileInputElement.show();
                }
                else if (this.value == '2') {
                    fileInputElement.hide();
                    mapSelectInfoElement.hide();
                    clipboardInfoElement.show();
                    me.inputTable.isEditable( true );
                }
                else if (this.value == '3') {
                    clipboardInfoElement.hide();
                    fileInputElement.hide();
                    mapSelectInfoElement.show(); 
                }
            });
            jQuery('.selectFromMap').on("click", function() {
                me.isMapSelection = true;
                me.instance.toggleViews("MapSelection");
            });
         },
        /**
         * @method handleButtons
         */
        handleButtons: function () {
            var me = this;
            var container = me.getContainer();
            var coordinateObject = me.dataHandler.getCoordinateObject();

            container.find('.clear').on("click", function () {
                me.updateCoordinateData('clear');
                me.helper.removeMarkers();
            });
            container.find('.show').on("click", function () {
                var rows = me.inputTable.getElements().rows;
                coordinateObject.coordinates.forEach( function ( pair ) {
                    me.helper.addMarkerForCoords( pair.input, me.startingSystem );
                });                
                me.instance.toggleViews("mapmarkers");
            });
            container.find('.export').on("click", function () {
                var exportfile = me.fileHandler.getElement().export;
                me.fileHandler.showFileDialogue( exportfile, true );
            });
            container.find('#transform').on("click", function () {
                var crs = me.getCrsOptions();
                var coordinateArray = [];
                coordinateObject.sourceCrs = crs.source;
                coordinateObject.targetCrs = crs.target;

                coordinateObject.coordinates.forEach( function ( pair ) {
                    var input = pair.input;
                    var inputCoordinates = [ Number(input.lon), Number(input.lat) ];
                    coordinateArray.push(inputCoordinates);
                });

                var payload = {
                    sourceCrs: crs.source,
                    sourceElevationCrs: crs.sourceElevation,
                    targetCrs: crs.target,
                    targetElevationCrs: crs.targetElevation,
                    coords: coordinateArray
                }
                me.instance.getService().getConvertedCoordinates( payload, me.handleServerResponse.bind( me ) );
            });
        }
    }
);
 