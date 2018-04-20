Oskari.clazz.define('Oskari.coordinatetransformation.view.transformation',
    function (instance, coordSystemOptions) {
        var me = this;
        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        me.conversionContainer = null
        me.sourceSelection = null; //TODO move

        me.fileinput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', me.loc);
        me.importFileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.dataHandler, me.loc, "import");
        me.exportFileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.dataHandler, me.loc, "export");

        me.inputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc, "input" );
        me.outputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc, "output");

        me.inputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this,  me.loc, "input", coordSystemOptions);
        me.outputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this,  me.loc, "output", coordSystemOptions);

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
                Oskari.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest',[this.instance, 'minimize']);

            } else {
                Oskari.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest',[this.instance, 'restore']);
            }
        },
        /*updateCoordinateData: function ( flag, coordinates ) {
            this.instance.getDataHandler().modifyCoordinateObject( flag, coordinates );
            this.refreshTableData();
        },*/
        getUserFileSettings: function () {
            return this.userFileSettings;
        },
        handleTableElevationRows: function (type, setEnabled){
            var table = this.getTable(type);
            table.handleDisplayingElevationRows(setEnabled);
        },
        getTable: function (type){
            if (type === "input"){
                return this.inputTable;
            } else if (type === "output"){
                return this.outputTable;
            }
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
        getCrsOptions: function () { //TODO
            var input = this.inputSystem.getSelectInstances();
            var target = this.outputSystem.getSelectInstances();
            var helper = this.instance.getHelper();
            var sourceSrs = this.getSelectionValue( input["geodetic-coordinate"] );
            var targetSrs = this.getSelectionValue( target["geodetic-coordinate"] );
            var sourceElevation = this.getSelectionValue( input.elevation );
            var targetElevation = this.getSelectionValue( target.elevation );

            return options = {
                source: sourceSrs,
                sourceElevation: sourceElevation,
                target: targetSrs,
                targetElevation: targetElevation
            }
        },

        /**
         * @method selectMapProjectionValues
         *  TODO set the projection to the one in the Oskari instance
         *
        selectMapProjectionValues: function () {
            var input = this.inputSystem.getSelectInstance();
            // EPSG-3067 settings
            this.setSelectionValue( input.datum, "DATUM_EUREF-FIN" );
            this.setSelectionValue( input.coordinate, "KOORDINAATISTO_SUORAK_2D" );
            this.setSelectionValue( input.projection, "TM" );
            this.setSelectionValue( input["geodetic-coordinate"], "ETRS-TM35FIN" );

            this.updateTableTitle();
        },*/
        handleSuccessResponse: function ( coords, dimension) {
            //var obj = this.getDataHandler().constructLonLatObjectFromArray(response.coordinates);
            //this.updateCoordinateData("output", obj);
            this.instance.getDataHandler().getData().resultCoords = coords; //setResultCoords(coords)
            this.refreshTableData();
        },
        handleErrorResponse: function (errorCode){
            this.showMessage(this.loc('flyout.transform.responseErrors.title'), this.loc('flyout.transform.responseErrors.errorMsg'))
        },
        showMessage: function (title, message){
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                btn = dialog.createCloseButton(this.loc('actions.close'));
            dialog.show(title, message, [btn]);
        },
        /**
         * @method refreshTableData
         * @description refreshes both input and output tables with current data
         */
         //TODO should we use coordsChanged event to trigger refresh table
        refreshTableData: function () {
            var data = this.instance.getDataHandler().getData();

            this.inputTable.render(data.inputCoords);
            this.outputTable.render(data.resultCoords);
        },
        /*updateTableHeaders: function () {
            this.inputTable.updateHeader( this.inputSystem.getSelectionValues() );
            this.outputTable.updateHeader( this.outputSystem.getSelectionValues() );
        },*/
        updateTableHeader: function (tableType, srs, elevSystem){
            var values = this.instance.getEpsgValues(srs);
            if (tableType === "input"){
                if (values){
                    this.inputTable.updateHeader(values.coord, values.lonFirst, elevSystem);
                } else {
                    this.inputTable.updateHeader("","",""); //remove header
                }
            } else if (values && tableType === "output") {
                if (values){
                    this.outputTable.updateHeader(values.coord, values.lonFirst, elevSystem);
                } else {
                    this.outputTable.updateHeader("","",""); //remove header
                }
            }
        },
        /*updateTableTitle: function (type, values){
            var table = this.getTable(type);
            table.updateTitle(values);
        },*/
        confirmResetFyout: function (blnSystems){ //TODO handle resetFlyout (systems, coords) and clearTables (coors) more properly
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelBtn = dialog.createCloseButton(this.loc('actions.cancel'));
            okBtn.setTitle(this.loc('actions.ok'));
            okBtn.addClass('primary');
            okBtn.setHandler(function() {
                me.resetFlyout(blnSystems);
                dialog.close();
            });
            if (blnSystems === true){
                dialog.show(this.loc('flyout.dataSource.title'), this.loc('flyout.dataSource.confirmChange'), [cancelBtn, okBtn]);
            } else {
                dialog.show(this.loc('flyout.coordinateTable.clearTables'), this.loc('flyout.coordinateTable.confirmClear'), [cancelBtn, okBtn]);
            }
        },
        resetFlyout: function (blnSystems) {
            var me = this;
            me.instance.getDataHandler().clearCoords();
            me.refreshTableData();
            if(blnSystems){
                me.inputSystem.resetSelectsToPlaceholder(true);
                me.outputSystem.resetSelectsToPlaceholder(true);
            }
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         */
        handleRadioButtons: function () {
            var me = this;
            jQuery('input[type=radio][name=load]').click(function(evt) {
                if (me.sourceSelection !== this.value && me.instance.hasInputCoords()){
                    me.confirmResetFyout(true);
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
                me.inputSystem.disableInputSelections(false);
                me.bindInputTableHandler(false);
            }
            else if (value == 'keyboard') {
                me.inputTable.isEditable(true);
                fileInputElement.hide();
                mapSelectInfoElement.hide();
                keyboardInfoElement.show();
                me.inputSystem.disableInputSelections(false);
                me.bindInputTableHandler(true);
            }
            else if (value == 'map') {
                me.inputTable.isEditable(false);
                keyboardInfoElement.hide();
                fileInputElement.hide();
                mapSelectInfoElement.show();
                me.inputSystem.selectMapProjection();
                me.inputSystem.disableInputSelections(true);
                me.updateTableHeader("input", Oskari.getSandbox().getMap().getSrsName(), ""); //TODO handle in listener
                me.bindInputTableHandler(false);
            }
        },
        //bind and unbind table input listener
        bindInputTableHandler: function (blnBind){
            var me = this;
            var tableElem = me.inputTable.getContainer();

            if (blnBind === true){
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
                //if adding more points should we show input coords (already added)
                //--- //TODO
                var inputCoords = me.instance.getDataHandler().getData().inputCoords; 
                me.instance.getHelper().showMarkersOnMap(inputCoords, true);
                //---
                me.instance.toggleViews("MapSelection");
            });

            container.find('.clear').on("click", function () {
                me.confirmResetFyout(false); //don't reset coord systems
            });
            container.find('.show').on("click", function () {
                var inputCoords = me.instance.getDataHandler().getData().inputCoords; //TODO
                me.instance.getHelper().showMarkersOnMap(inputCoords);
                me.instance.toggleViews("mapmarkers");
            });
            container.find('.export').on("click", function () {
                me.exportFileHandler.showFileDialogue();
                var userSettings = me.getUserFileSettings().export; 
            });
            container.find('#transform').on("click", function () {
                var crs = me.getCrsOptions();
                var fileSettings = me.getUserFileSettings().import;
                var validTransform = me.instance.getHelper().validateSelectionsForTransform (crs, fileSettings, me.instance.hasInputCoords());

                //TODO handle file transform -> validation and payload
                var payload = {
                    sourceCrs: crs.source,
                    sourceElevationCrs: crs.sourceElevation,
                    targetCrs: crs.target,
                    targetElevationCrs: crs.targetElevation,
                    coords: data.inputCoords
                }
                if (validTransform !== true){
                    me.showMessage(me.loc('flyout.transform.validateErrors.title'), validTransform);
                }else{
                    me.instance.getService().getConvertedCoordinates( payload, me.handleSuccessResponse.bind( me ), me.handleErrorResponse.bind(me) ); //callback
                }
            });
        }
    }
);
 