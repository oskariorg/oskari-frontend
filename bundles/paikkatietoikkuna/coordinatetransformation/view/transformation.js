Oskari.clazz.define('Oskari.coordinatetransformation.view.transformation',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        me.helper = me.instance.helper;
        me.conversionContainer = null
        me.startingSystem = false;
        me.sourceSelection = null; //TODO move

        me.fileinput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', me.loc);
        me.importFileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.dataHandler, me.loc, "import");
        me.exportFileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.dataHandler, me.loc, "export");

        me.inputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc );
        me.outputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc );

        me.inputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this,  me.loc);
        me.outputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this,  me.loc);

        me.sourceSelect = Oskari.clazz.create('Oskari.coordinatetransformation.component.SourceSelect', me.loc );

        me.importFileHandler.create();
        me.exportFileHandler.create();

        me.userFileSettings = {
            import: null,
            export: null
        }

        me.importFileHandler.on('GetSettings', function (settings) {
            me.userFileSettings.import = settings;
        });
        me.exportFileHandler.on('GetSettings', function (settings) {
            me.userFileSettings.export = settings;
        });

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

            var inputTitle = this._template.title( { title: this.loc('flyout.coordinateSystem.input') } );
            var resultTitle = this._template.title( { title: this.loc('flyout.coordinateSystem.output') } );

            var inputTable = this.inputTable.create();
            var targetTable = this.outputTable.create();

            var transformButton = this._template.transformButton({ convert: this.loc('actions.convert') });

            var utilRow = this._template.utilRow({
                clear: this.loc('actions.clearTable'),
                show: this.loc('actions.showMarkers'),
                fileexport: this.loc('actions.export')
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

            //this.inputTable.handleClipboardPasteEvent();
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
        /*updateCoordinateData: function ( flag, coordinates ) {
            this.instance.getDataHandler().modifyCoordinateObject( flag, coordinates );
            this.refreshTableData();
        },*/
        getUserFileSettings: function () {
            return this.userFileSettings;
        },
        /**
         * @method readFileData
         * Pass this function as a callback to fileinput to get the file-data
         */
        readFileData: function( fileData ) {
            var dataJson = this.instance.getDataHandler().validateData( fileData );
            //this.updateCoordinateData( "import", dataJson );
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
        disableInputSelections: function (disable){
            var inputSystem = this.inputSystem.getSelectInstance();
            if (disable === true){
                inputSystem["geodetic-coordinate"].setValue("ETRS-TM35FIN"); //TODO mapsrs when epsg is id -> selectMapProjectionValues
                this.updateTableTitle();
                Object.keys( inputSystem ).forEach( function ( key ) {
                    inputSystem[key].setEnabled(false);
                });
            }else{
                Object.keys( inputSystem ).forEach( function ( key ) {
                    inputSystem[key].setEnabled(true);
                });

            }
        },
        /**
         * @method selectMapProjectionValues
         *  TODO set the projection to the one in the Oskari instance
         */
        selectMapProjectionValues: function () {
            var input = this.inputSystem.getSelectInstance();
            // EPSG-3067 settings
            this.setSelectionValue( input.datum, "DATUM_EUREF-FIN" );
            this.setSelectionValue( input.coordinate, "KOORDINAATISTO_SUORAK_2D" );
            this.setSelectionValue( input.projection, "TM" );
            this.setSelectionValue( input["geodetic-coordinate"], "ETRS-TM35FIN" );

            this.updateTableTitle();
        },
        handleServerResponse: function ( coords, dimension) {
            //var obj = this.getDataHandler().constructLonLatObjectFromArray(response.coordinates);
            //this.updateCoordinateData("output", obj);
            this.instance.getDataHandler().getData().resultCoords = coords;
            this.refreshTableData();
        },
        /**
         * @method refreshTableData
         * @description refreshes both input and output tables with current data
         */
         //TODO should we use coordsChanged event to trigger refresh table
        refreshTableData: function () {
            var data = this.instance.getDataHandler().getData();
            //var inputData = data.inputCoords;
            //var outputData = data.resultCoords;

            /*data.map( function ( pair ) {
                if ( pair.input ) {
                    inputData.push( pair.input );
                }
                if ( pair.output ) {
                    outputData.push( pair.output );
                }
            });*/

            this.inputTable.render(data.inputCoords);
            this.outputTable.render(data.resultCoords);
        },
        updateTableTitle: function () {
            this.inputTable.updateTitle( this.inputSystem.getSelectionValues() );
            this.outputTable.updateTitle( this.outputSystem.getSelectionValues() );
        },
        confirmResetFyout: function (){
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelBtn = dialog.createCloseButton(this.loc('actions.cancel'));
            okBtn.setTitle(this.loc('actions.ok'));
            okBtn.addClass('primary');
            okBtn.setHandler(function() {
                me.resetFlyout();
                dialog.close();
            });
            dialog.show(this.loc('flyout.dataSource.title'), this.loc('flyout.dataSource.confirmChange'), [cancelBtn, okBtn]);
        },
        resetFlyout: function () {
            var me = this;
            me.instance.getDataHandler().clearCoords();
            me.refreshTableData();
            //reset coords system selections ??
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         */
        handleRadioButtons: function () {
            var me = this;
            jQuery('input[type=radio][name=load]').click(function(evt) {
                me.inputSystem.resetSelectToPlaceholder(true);
                if (me.sourceSelection !== this.value && me.instance.hasInputCoords()){
                    me.confirmResetFyout();
                    //TODO if yes then select radio button
                    evt.preventDefault();
                } else {
                    me.sourceSelection = this.value;
                    me.handleSourceSelection(me, this.value);
                }
            });
        },
        handleSourceSelection: function(me, value){
            var container = me.getContainer();
            var keyboardInfoElement = container.find('.coordinateconversion-keyboardinfo');
            var mapSelectInfoElement = container.find('.coordinateconversion-mapinfo')
            var fileInputElement = container.find('.oskari-fileinput');

            if (value == 'file') {
                me.inputTable.isEditable(false);
                me.importFileHandler.showFileDialogue();
                keyboardInfoElement.hide();
                mapSelectInfoElement.hide();
                fileInputElement.show();
                me.disableInputSelections(false);
                me.bindInputTableHandler(false);
            }
            else if (value == 'keyboard') {
                me.inputTable.isEditable(true);
                fileInputElement.hide();
                mapSelectInfoElement.hide();
                keyboardInfoElement.show();
                me.disableInputSelections(false);
                me.bindInputTableHandler(true);
            }
            else if (value == 'map') {
                me.inputTable.isEditable(false);
                keyboardInfoElement.hide();
                fileInputElement.hide();
                mapSelectInfoElement.show();
                //me.selectMapProjectionValues();
                me.disableInputSelections(true);
                me.bindInputTableHandler(false);
            }
        },
        //bind and unbind table input listener
        bindInputTableHandler: function (bindBln){
            var me = this;
            var tableElem = me.inputTable.getContainer();

            if (bindBln === true){
                jQuery(tableElem).find('.oskari-table-content').on("focusout", {meRef:me}, me.inputTableHandler); //tbody //focus, focusout,
            } else {
                jQuery(tableElem).find('.oskari-table-content').off("focusout", me.inputTableHandler);
            }
        },
        inputTableHandler: function (event){
            var me = event.data.meRef;
            var dimension = 2; //TODO if dimension === 3  3 2
            var rows = jQuery(event.currentTarget).find("tr");
            var cells;
            var coord;
            var inputCoords = [];
            //var validRowCounter = 0;

            rows.each(function(){
                coord = [];
                cells = jQuery(this).find("td");
                for (var i = 0; i < dimension ; i++){
                    if(me.handleCell(coord, cells[i])===false){
                        //quit and add valid coordinates
                        return false;
                    }
                }
                inputCoords.push(coord);
                // TODO: check if epsg bbox contains coord
                //validRowCounter++;
            });
            //add valid coordinates
            me.instance.getDataHandler().addInputCoords(inputCoords);
        },

        handleCell: function(coord, cell){ //or handleRow
            var cell = jQuery(cell);
            var cellValue = cell.html().replace(',', '.');
            var num = parseFloat(cellValue);
            if (isNaN(num)){ //do not update input coords
                cell.addClass("invalid-coord");
                return false;
            }
            cell.text(num); //update cell content with parsed float
            cell.removeClass("invalid-coord");
            coord.push(num);
            return true;
        },
        /**
         * @method handleButtons
         */
        handleButtons: function () {
            var me = this;
            var container = me.getContainer();
            var data = me.instance.getDataHandler().getData();

            jQuery('.selectFromMap').on("click", function() {
                me.instance.setMapSelectionMode(true);
                me.instance.toggleViews("MapSelection");
            });

            container.find('.clear').on("click", function () {
                me.instance.getDataHandler().clearCoords();
                me.refreshTableData();
                //me.helper.removeMarkers();
            });
            container.find('.show').on("click", function () {
                //var rows = me.inputTable.getElements().rows;
                data.inputCoords.forEach( function ( coords ) {
                    me.helper.addMarkerForCoords( coords, me.startingSystem );
                });                
                me.instance.toggleViews("mapmarkers");
            });
            container.find('.export').on("click", function () {
                me.exportFileHandler.showFileDialogue();
                var userSettings = me.getUserFileSettings().export; 
            });
            container.find('#transform').on("click", function () {
                var crs = me.getCrsOptions();
                var userSettings = me.getUserFileSettings().import;
                //var coordinateArray = [];
                //data.sourceCrs = crs.source; 
                //data.targetCrs = crs.target;

                /*coordinateObject.coordinates.forEach( function ( pair ) {
                    var input = pair.input;
                    var inputCoordinates = [ Number(input.lon), Number(input.lat) ];
                    coordinateArray.push(inputCoordinates);
                });*/

                var payload = {
                    sourceCrs: crs.source,
                    sourceElevationCrs: crs.sourceElevation,
                    targetCrs: crs.target,
                    targetElevationCrs: crs.targetElevation,
                    coords: data.inputCoords
                }
                me.instance.getService().getConvertedCoordinates( payload, me.handleServerResponse.bind( me ) ); //callback
            });
        }
    }
);
 