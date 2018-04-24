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

        me.userFiles = [];

        me.inputSystem.on('CoordSystemChanged', function(type){
            me.onSystemSelectionChange(type);
        });
        me.outputSystem.on('CoordSystemChanged', function(type){
            me.onSystemSelectionChange(type);
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
                     '<input id="overlay-btn" class="export" type="button" value="<%= fileexport %> ">' +
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

            var inputTitle = this._template.title( { title: this.loc('flyout.coordinateSystem.input') } ); //TODO move
            var resultTitle = this._template.title( { title: this.loc('flyout.coordinateSystem.output') } ); //TODO move

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
            if ( this.inputSystem.getElement() ) { //TODO move
                var element = this.inputSystem.getElement();
                element.attr('data-type', 'coordinate-input');
                element.prepend( inputTitle );
                system.append( element );
            }
            if ( this.outputSystem.getElement() ) { //TODO move
                var element = this.outputSystem.getElement();
                element.attr('data-type', 'coordinate-output');
                element.prepend( resultTitle );
                system.append( element );
            }
            wrapper.append(system);
            this.fileinput.create();
            if ( this.fileinput.canUseAdvancedUpload() ) { //TODO
                var fileInputElement = this.fileinput.handleDragAndDrop( this.storeFileData.bind( this ) );
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
        //TODO do we need this??
        getTable: function (type){
            if (type === "input"){
                return this.inputTable;
            } else if (type === "output"){
                return this.outputTable;
            }
        },
        getSourceSelection: function () {
            return this.sourceSelection;
        },
        /**
         * @method readFileData
         * Pass this function as a callback to fileinput to get the file-data
         */
        storeFileData: function( fileData ) {
            this.userFiles = fileData;
            //var dataJson = this.instance.getDataHandler().validateData( fileData );
            //this.updateCoordinateData( "import", dataJson );
        },
        //TODO do we need this??
        getSelectionValue: function ( selectListInstance ) {
            return selectListInstance.getValue();
        },
        //TODO do we need this??
        setSelectionValue: function ( selectInstance, value ) {
            selectInstance.setValue( value );
        },
        getCrsOptions: function () {
            var input = this.inputSystem;
            var target = this.outputSystem;

            return options = {
                sourceCrs: input.getSrsSelection(),
                sourceElevationCrs: input.getElevationSelection(),
                targetCrs: target.getSrsSelection(),
                targetElevationCrs: target.getElevationSelection()
            }
        },
        showMessage: function (title, message){
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                btn = dialog.createCloseButton(this.loc('actions.close'));
            dialog.show(title, message, [btn]);
        },
        onSystemSelectionChange: function (type){
            var selections,
                epsgValues,
                srs,
                table,
                heightSystem,
                dimension;

            if (type === "input"){
                selections = this.inputSystem.getSelections();
                table = this.inputTable;
            } else {
                selections = this.outputSystem.getSelections();
                table = this.outputTable;
            }

            srs = selections['geodetic-coordinate'];
            heightSystem = selections.elevation;
            this.instance.setDimension(type, srs, heightSystem);
            epsgValues = this.instance.getEpsgValues(srs);

            if (epsgValues){
                table.updateHeader(epsgValues, heightSystem);
            } else {
                table.updateHeader(); //remove header
            }
            dimension =  this.instance.getDimension(type);
            table.handleDisplayingElevationRows(dimension);
        },
        confirmResetFlyout: function (blnSystems){ //TODO handle resetFlyout (systems, coords) and clearTables (coords) more properly
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
                    evt.preventDefault();
                    me.confirmResetFlyout(true);
                    //TODO if yes then select radio button and handle source selection
                } else {
                    me.handleSourceSelection(this.value);
                }
            });
        },
        handleSourceSelection: function(value){
            this.sourceSelection = value;
            var me = this;
            var container = me.getContainer();
            var keyboardInfoElement = container.find('.coordinateconversion-keyboardinfo');
            var mapSelectInfoElement = container.find('.coordinateconversion-mapinfo')
            var fileInputElement = container.find('.oskari-fileinput');

            if (value == 'file') {
                me.inputTable.setIsEditable(false);
                me.importFileHandler.showFileDialogue();
                keyboardInfoElement.hide();
                mapSelectInfoElement.hide();
                fileInputElement.show();
                me.inputSystem.disableInputSelections(false);
                me.bindInputTableHandler(false);
            }
            else if (value == 'keyboard') {
                me.inputTable.setIsEditable(true);
                fileInputElement.hide();
                mapSelectInfoElement.hide();
                keyboardInfoElement.show();
                me.inputSystem.disableInputSelections(false);
                me.bindInputTableHandler(true);
            }
            else if (value == 'map') {
                me.inputTable.setIsEditable(false);
                keyboardInfoElement.hide();
                fileInputElement.hide();
                mapSelectInfoElement.show();
                me.inputSystem.selectMapProjection();
                me.inputSystem.disableInputSelections(true);
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
            var dimension = me.instance.getDimension("input");
            var rows = jQuery(event.currentTarget).find("tr");
            var cells;
            var coord;
            var inputCoords = [];

            rows.each(function(){
                coord = [];
                cells = jQuery(this).find("td");
                for (var i = 0; i < dimension ; i++){
                    if(me.handleCell(coord, cells[i])===false){
                        //add only valid row
                        return false;
                    }
                }
                inputCoords.push(coord);
                // TODO: check if epsg bbox contains coord
            });
            //update input coordinates and don't render input table
            me.instance.getDataHandler().setInputCoords(inputCoords, true);
            me.inputTable.handleTableSize(inputCoords.length);
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

            jQuery('.selectFromMap').on("click", function() {
                me.instance.setMapSelectionMode(true); //TODO flyout show/hide
                //TODO
                var inputCoords = me.instance.getDataHandler().getInputCoords();
                me.instance.getHelper().showMarkersOnMap(inputCoords, true);
                //---
                me.instance.toggleViews("MapSelection");
            });

            container.find('.clear').on("click", function () {
                me.confirmResetFlyout(false); //don't reset coord systems
            });
            container.find('.show').on("click", function () {
                var inputCoords = me.instance.getDataHandler().getInputCoords();
                me.instance.getHelper().showMarkersOnMap(inputCoords);
                me.instance.toggleViews("mapmarkers");
            });
            container.find('.export').on("click", function () {
                me.exportFileHandler.showFileDialogue(me.transformToFile.bind(me));
            });
            container.find('#transform').on("click", function () {
                me.transformToTable();
            });
        },
        transformToTable: function () {
            var me = this;
            var crsSettings = me.getCrsOptions();
            var source = me.getSourceSelection();
            var coords;
            var validTransform;
            var fileSettings;
            var file;
            if (source === "file"){
                fileSettings = this.importFileHandler.getSettings();
                file = this.userFiles[0];
            } else {
                coords = me.instance.getDataHandler().getInputCoords();
            }
            validTransform = this.instance.getHelper().validateSelectionsForTransform (crsSettings, fileSettings, me.instance.hasInputCoords());
            if (validTransform !== true){
                me.showMessage(me.loc('flyout.transform.validateErrors.title'), validTransform);
                return;
            }
            if (source === "file"){
                me.instance.getService().transformFileToArray( file, crsSettings, fileSettings, me.handleFileResponse.bind( me ), me.handleErrorResponse.bind(me) ); //callback
            } else {
                me.instance.getService().transformArrayToArray( coords, crsSettings, me.handleArrayResponse.bind( me ), me.handleErrorResponse.bind(me) ); //callback
            }
        },
        transformToFile: function (settings){
            var me = this;
            var crsSettings = this.getCrsOptions();
            var fileSettings = settings;
            var file;
            var coords;
            var source =this.sourceSelection;
            if (source === "file"){
                fileSettings = this.exportFileHandler.getSettings();
                file = this.userFiles[0];
            } else {
                coords = this.instance.getDataHandler().getInputCoords();
            }
            //TODO should check on export button click
            var validTransform = this.instance.getHelper().validateSelectionsForTransform (crsSettings, fileSettings, me.instance.hasInputCoords());
            if (validTransform !== true){
                me.showMessage(me.loc('flyout.transform.validateErrors.title'), validTransform);
                return;
            }

            if (source === "file"){
                this.instance.getService().transformFileToFile(file, crsSettings, fileSettings, this.handleFileResponse.bind( this ), this.handleErrorResponse.bind(this) );
            } else {
                this.instance.getService().transformArrayToFile( coords, crsSettings, fileSettings, this.handleFileResponse.bind( this ), this.handleErrorResponse.bind(this) );
            }
        },
        handleArrayResponse: function ( coords, dimension) {
            this.instance.getDataHandler().setResultCoords(coords);
        },
        handleFileResponse: function (){
            //TODO
        },
        handleErrorResponse: function (errorCode){
            this.showMessage(this.loc('flyout.transform.responseErrors.title'), this.loc('flyout.transform.responseErrors.errorMsg'))
        }
    }
);
 