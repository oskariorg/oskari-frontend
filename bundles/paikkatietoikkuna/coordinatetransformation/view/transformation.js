Oskari.clazz.define('Oskari.coordinatetransformation.view.transformation',
    function (instance, helper, dataHandler) {
        var me = this;
        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        me.conversionContainer = null
        me.sourceSelection = null; //TODO move
        me.helper = helper;
        me.dataHandler = dataHandler;
        me.fileInput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', {
            'allowMultipleFiles': false,
            'maxFileSize': 50,
            'allowedFileTypes': ["text/plain"]
        });
        me.importFileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.helper, me.loc, "import");
        me.exportFileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.helper, me.loc, "export");

        me.inputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc, "input" );
        me.outputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.table', this, me.loc, "output");

        me.inputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this,  me.loc, "input", me.helper);
        me.outputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this,  me.loc, "output", me.helper);

        me.sourceSelect = Oskari.clazz.create('Oskari.coordinatetransformation.component.SourceSelect', me.loc );

        me.importFileHandler.create();
        me.exportFileHandler.create();

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

            this.fileInput.setVisible(false);
            wrapper.find( '.datasource-info' ).append( this.fileInput.getElement() );

            wrapper.append( inputTable );
            wrapper.append( transformButton );
            wrapper.append( targetTable );
            wrapper.append( utilRow );

            jQuery(container).append(wrapper);

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
            var dimensions = this.instance.getDimensions();

            return options = {
                sourceCrs: input.getSrs(),
                sourceElevationCrs: input.getElevation(),
                targetCrs: target.getSrs(),
                targetElevationCrs: target.getElevation(),
                sourceDimension: dimensions.input,
                targetDimension: dimensions.output
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
                dimension,
                fileHandler;
            if (type === "input"){
                selections = this.inputSystem.getSelections();
                table = this.inputTable;
                fileHandler = this.importFileHandler;
            } else {
                selections = this.outputSystem.getSelections();
                table = this.outputTable;
                fileHandler = this.exportFileHandler;
            }
            srs = selections['geodetic-coordinate'];
            heightSystem = selections.elevation;
            this.instance.setDimension(type, srs, heightSystem);
            epsgValues = this.helper.getEpsgValues(srs);
            if (epsgValues){
                table.updateHeader(epsgValues, heightSystem);
                if (this.helper.isGeogSystem(srs)){
                    fileHandler.setShowFormatRow(true);
                } else {
                    fileHandler.setShowFormatRow(false);
                }
            } else {
                table.updateHeader(); //remove header
                fileHandler.setShowFormatRow(true);

            }
            dimension =  this.instance.getDimension(type);
            table.handleDisplayingElevationRows(dimension);
        },
        confirmResetFlyout: function (blnSystems, callback){ //TODO handle resetFlyout (systems, coords) and clearTables (coords) more properly
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelBtn = dialog.createCloseButton(this.loc('actions.cancel'));
            okBtn.setTitle(this.loc('actions.ok'));
            okBtn.addClass('primary');
            okBtn.setHandler(function() {
                me.resetFlyout(blnSystems);
                if (typeof callback === "function"){
                    callback();
                }
                dialog.close();
            });
            if (blnSystems === true){
                dialog.show(this.loc('flyout.dataSource.title'), this.loc('flyout.dataSource.confirmChange'), [cancelBtn, okBtn]);
            } else {
                dialog.show(this.loc('flyout.coordinateTable.clearTables'), this.loc('flyout.coordinateTable.confirmClear'), [cancelBtn, okBtn]);
            }
        },
        resetFlyout: function (blnSystems) {
            this.dataHandler.clearCoords();
            if(blnSystems){
                this.inputSystem.resetAllSelections();
                this.outputSystem.resetAllSelections();
            }
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         */
        handleRadioButtons: function () {
            var me = this;
            jQuery('input[type=radio][name=load]').click(function(evt) {
                if (me.sourceSelection !== this.value && me.dataHandler.hasInputCoords()){
                    var selectCb = function(){
                        jQuery(evt.target).prop("checked", true);
                        me.handleSourceSelection(evt.target.value);
                    }
                    evt.preventDefault();
                    me.confirmResetFlyout(true, selectCb);
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

            if (value == 'file') {
                me.inputTable.setIsEditable(false);
                me.importFileHandler.showFileDialogue();
                keyboardInfoElement.hide();
                mapSelectInfoElement.hide();
                this.fileInput.setVisible(true);
                me.inputSystem.disableAllSelections(false);
                me.bindInputTableHandler(false);
            }
            else if (value == 'keyboard') {
                me.inputTable.setIsEditable(true);
                this.fileInput.setVisible(false);
                mapSelectInfoElement.hide();
                keyboardInfoElement.show();
                me.inputSystem.disableAllSelections(false);
                me.bindInputTableHandler(true);
            }
            else if (value == 'map') {
                me.inputTable.setIsEditable(false);
                keyboardInfoElement.hide();
                this.fileInput.setVisible(false);
                mapSelectInfoElement.show();
                me.inputSystem.selectMapProjection();
                me.inputSystem.disableAllSelections(true);
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
            var srs = me.inputSystem.getSrs();

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
                //Check that coord is in bounds
                /*
                if (me.helper.isCoordInBounds(srs, coord) === false){
                    me.showMessage("Error", "Coordinate: " + coord + " isn't inside bounds.");
                    return false;
                }else{
                    inputCoords.push(coord);
                }*/
            });
            //update input coordinates and don't render input table
            me.dataHandler.setInputCoords(inputCoords, true);
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
            var validCrsSelects;
            var inputSrs;
            var inputCoords;
            var checkDimensions;

            jQuery('.selectFromMap').on("click", function() {
                me.instance.setMapSelectionMode(true);
                if (me.dataHandler.hasInputCoords()){
                    inputSrs = me.inputSystem.getSrs();
                    inputCoords = me.dataHandler.getInputCoords();
                    me.helper.showMarkersOnMap(inputCoords, true, inputSrs);
                }
                me.instance.toggleViews("MapSelection");
            });

            container.find('.clear').on("click", function () {
                me.confirmResetFlyout(false); //don't reset coord systems
            });
            container.find('.show').on("click", function () {
                inputCoords = me.dataHandler.getInputCoords();
                inputSrs = me.inputSystem.getSrs();
                me.helper.showMarkersOnMap(inputCoords, false, inputSrs);
                me.instance.toggleViews("mapmarkers");
            });
            container.find('.export').on("click", function () {
                validCrsSelects = me.helper.validateCrsSelections (me.getCrsOptions());
                if (validCrsSelects === true){
                    me.helper.checkDimensions(me.getCrsOptions(), me.handleExport.bind(me));
                }
            });
            container.find('#transform').on("click", function () {
                validCrsSelects = me.helper.validateCrsSelections (me.getCrsOptions());
                if (validCrsSelects === true){
                    me.helper.checkDimensions(me.getCrsOptions(), me.transformToTable.bind(me));
                }
            });
        },
        handleExport: function (){
            this.exportFileHandler.showFileDialogue(this.transformToFile.bind(this), true);
        },
        transformToTable: function () {
            var crsSettings = this.getCrsOptions();
            var source = this.getSourceSelection();
            var coords;
            var validTransform;
            var fileSettings;
            var file;
            if (source === "file"){
                fileSettings = this.importFileHandler.getSettings();
                file = this.fileInput.getFiles();
                if (file === null){ //FileInput shows error popup
                    return;
                }
            } else {
                if (this.dataHandler.hasInputCoords()){
                    coords = this.dataHandler.getInputCoords();
                } else {
                    this.showMessage(this.loc('flyout.transform.validateErrors.title'), this.loc('flyout.transform.validateErrors.noInputData'));
                    return;
                }
            }
            if (source === "file"){
                this.instance.getService().transformFileToArray( file, crsSettings, fileSettings, this.handleArrayResponse.bind( this ), this.handleErrorResponse.bind(this) ); //callback
            } else {
                this.instance.getService().transformArrayToArray( coords, crsSettings, this.handleArrayResponse.bind( this ), this.handleErrorResponse.bind(this) ); //callback
            }
        },
        transformToFile: function (settings){
            var crsSettings = this.getCrsOptions();
            var exportSettings = settings;
            var file;
            var coords;
            var source = this.sourceSelection;
            if (source === "file"){
                var importSettings = this.importFileHandler.getSettings();
                file = this.fileInput.getFiles();
                if (file === null){ //FileInput shows error popup
                    return;
                }
            } else {
                if (this.dataHandler.hasInputCoords()){
                    coords = this.dataHandler.getInputCoords();
                } else {
                    this.showMessage(this.loc('flyout.transform.validateErrors.title'), this.loc('flyout.transform.validateErrors.noInputData'));
                    return;
                }
            }
            if (source === "file"){
                this.instance.getService().transformFileToFile(file, crsSettings, importSettings, exportSettings, this.handleFileResponse.bind( this ), this.handleErrorResponse.bind(this) );
            } else {
                this.instance.getService().transformArrayToFile( coords, crsSettings, exportSettings, this.handleFileResponse.bind( this ), this.handleErrorResponse.bind(this) );
            }
        },
        handleArrayResponse: function (response) {
            var coords = response.coordinates;
            var inputCoords = response.inputCoordinates;
            //TODO check that response dimension matches
            var dimension = response.dimension;
            var hasMoreCoordinates = response.hasMoreCoordinates;
            this.dataHandler.setResultCoords(coords);
            if (inputCoords){
                this.dataHandler.setInputCoords(inputCoords);
            }
            if (hasMoreCoordinates === true){
                this.showMessage(this.loc('flyout.transform.responseFile.title'), this.loc('flyout.transform.responseFile.hasMoreCoordinates', {maxCoordsToArray: 100}));
            }
        },
        handleFileResponse: function (data, filename, type){
            //TODO exportToFile should be moved from fileInput to helper
            this.fileInput.exportToFile(data, filename, type);
        },
        handleErrorResponse: function (error, errorCode){
            var errors = this.loc('flyout.transform.responseErrors');
            var errorMsg = errors.generic;
            if (errorCode && errors[errorCode]){
                errorMsg = errors[errorCode];
            } else if (error){
                errorMsg += "<br> Error: " + error; //TODO adds backend msg. use only generic message, when localized messages are ready
            }
            this.showMessage(this.loc('flyout.transform.responseErrors.title'), errorMsg);
        }
    }
);
 