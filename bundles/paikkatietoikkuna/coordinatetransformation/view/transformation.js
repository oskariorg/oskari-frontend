Oskari.clazz.define('Oskari.coordinatetransformation.view.transformation',
    function (instance, helper, dataHandler) {
        var me = this;
        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        me.conversionContainer = null
        //me.sourceSelection = null; //TODO move
        me.helper = helper;
        me.dataHandler = dataHandler;
        //TODO remove fileInput here if is ok to move it to importfilehandler
        /*me.fileInput = Oskari.clazz.create('Oskari.userinterface.component.FileInput', {
            'allowMultipleFiles': false,
            'maxFileSize': 50,
            'allowedFileTypes': ["text/plain"]
        });*/
        me.importFileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.helper, me.loc, "import");
        me.exportFileHandler = Oskari.clazz.create('Oskari.coordinatetransformation.view.FileHandler', me.helper, me.loc, "export");

        me.inputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateTable', this, me.loc, "input" );
        me.outputTable = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateTable', this, me.loc, "output");
        me.bindTableHoverListeners();
        me.inputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this,  me.loc, "input", me.helper);
        me.outputSystem = Oskari.clazz.create('Oskari.coordinatetransformation.component.CoordinateSystemSelection', this,  me.loc, "output", me.helper);

        me.sourceSelect = Oskari.clazz.create('Oskari.coordinatetransformation.component.SourceSelect', me.loc );

        me.importFileHandler.create();
        me.exportFileHandler.create();
        //TODO move to bind listeners
        me.inputSystem.on('CoordSystemChanged', function(type){
            me.onSystemSelectionChange(type);
        });
        me.outputSystem.on('CoordSystemChanged', function(type){
            me.onSystemSelectionChange(type);
        });
        me.sourceSelect.on('SourceSelectChange', function(value){
            if (me.dataHandler.hasInputCoords()){
                //me.confirmResetFlyout(true, me.handleSourceSelection.bind(me, value), me.sourceSelect );
                me.confirmResetFlyout(true, value);
            } else {
                me.handleSourceSelection(value);
            }
        });
        me.sourceSelect.on('SourceSelectClick', function(value){
            me.handleSourceClick(value);
        });
        me._template = {
            wrapper: jQuery('<div class="transformation-wrapper"></div>'), //TODO flyout container
            systems: jQuery('<div class="coordinate-systems-wrapper"></div>'),
            tables: jQuery('<div class="coordinate-tables-wrapper"></div>'),
            divider: jQuery('<div class="auto-margin-divider"></div>'),
            //title: _.template('<h4 class="header"><%= title %></h4>'), //TODO move
            //TODO oskari btn
            transformButton: _.template(
                '<div class="transformation-button">' +
                    '<input class="primary transform" type="button" value="<%= convert %> >>">' +
                '</div>'
            ),
            //TODO oskari btn
            utilRow: _.template(
                '<div class="util-row-wrapper">' +
                    '<input class="clear" type="button" value="<%= clear %> ">' +
                    '<input class="show" type="button" value="<%= show %> ">' +
                    '<input class="export primary" type="button" value="<%= fileexport %> ">' +
                '</div>'
            ),
            filterSystems: _.template(
                '<div class="systems-filter-wrapper">' +
                    '<h4>${title}</h4>'+
                    '<div class="coordinate-systems-filters">' +
                        '<div class="source-select">'+
                            '<input type="radio" id="filter-systems" name="filter-select" value="systems" checked>' +
                            '<label for="filter-systems">' +
                                '<span/>' +
                                '${systems}' +
                            '</label>'+
                            //'<div class="infolink icon-info" data-source="systems" title="${systemsInfo}"></div>' +
                        '</div>'+
                        '<div class="source-select">'+
                            '<input type="radio" id="filter-epsg" name="filter-select" value="epsg">' +
                            '<label for="filter-epsg">' +
                                '<span/>' +
                                '${epsg}' +
                            '</label>'+
                            //'<div class="infolink icon-info" data-source="espg" title="${epsgInfo}"></div>' +
                        '</div>'+
                    '</div>'+
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

            //var inputTitle = this._template.title( { title: this.loc('flyout.coordinateSystem.input') } ); //TODO move
            //var resultTitle = this._template.title( { title: this.loc('flyout.coordinateSystem.output') } ); //TODO move

            var inputTable = this.inputTable.create();
            var targetTable = this.outputTable.create();

            var transformButton = this._template.transformButton({ convert: this.loc('actions.convert') });

            var utilRow = this._template.utilRow({
                clear: this.loc('actions.clearTable'),
                show: this.loc('actions.showMarkers'),
                fileexport: this.loc('actions.export')
            });

            var wrapper = this._template.wrapper.clone();

            if ( this.sourceSelect.getElement() ) {
                wrapper.append( this.sourceSelect.getElement() );
            }
            var sourceFilter = this._template.filterSystems({
                title: this.loc('flyout.filterSystems.title'),
                systems: this.loc('flyout.filterSystems.systems'),
                systemsInfo: this.loc('flyout.filterSystems.systemsInfo'),
                epsg: this.loc('flyout.filterSystems.epsg'),
                epsgInfo: this.loc('flyout.filterSystems.epsgInfo')
            });
            wrapper.append(sourceFilter);
            var systems = this._template.systems.clone();
            if ( this.inputSystem.getElement() ) { //TODO move
                //var element = this.inputSystem.getElement();
                //element.attr('data-type', 'coordinate-input');
                //element.prepend( inputTitle );
                systems.append( this.inputSystem.getElement());
            }
            systems.append( this._template.divider.clone());
            if ( this.outputSystem.getElement() ) { //TODO move
                //var element = this.outputSystem.getElement();
                //element.attr('data-type', 'coordinate-output');
                //element.prepend( resultTitle );
                systems.append( this.outputSystem.getElement() );
            }
            wrapper.append(systems);

            //this.fileInput.setVisible(false);
            //wrapper.find( '.datasource-info' ).append( this.fileInput.getElement() );
            var tables = this._template.tables.clone();
            tables.append( inputTable );
            tables.append( transformButton );
            tables.append( targetTable );
            wrapper.append( tables );
            wrapper.append( utilRow );

            jQuery(container).append(wrapper);

            this.handleButtons();
            //this.handleRadioButtons();
            // preselect radio button here beceause event listeners are not ready
            this.handleSourceSelection(this.sourceSelect.sources[0]);//me.sourceSelect.sourceSelection);
            this.bindFilterRadioButtons();
        },
        bindTableHoverListeners: function(){
            var me = this;
            this.inputTable.on('HighlightTableRow', function(data){
                me.inputTable.highlightRow (data);
                me.outputTable.highlightRow (data);
            });
            this.outputTable.on('HighlightTableRow', function(data){
                me.inputTable.highlightRow (data);
                me.outputTable.highlightRow (data);
            });
        },
        bindFilterRadioButtons: function () {
            var me = this;
            var container = this.getContainer();
            container.find('input[type=radio][name=filter-select]').on("change", function(evt) {
                var value = this.value;
                me.inputSystem.toggleFilter(value);
                me.outputSystem.toggleFilter(value);
            });
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
        confirmResetFlyout: function (blnSystems, value, resetCb, cancelCb){
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelBtn = dialog.createCloseButton(this.loc('actions.cancel'));
            okBtn.setTitle(this.loc('actions.ok'));
            okBtn.addClass('primary');
            okBtn.setHandler(function() {
                me.dataHandler.clearCoords();
                me.inputSystem.resetAllSelections();
                me.outputSystem.resetAllSelections();
                me.handleSourceSelection(value);
                if (typeof resetCb === "function"){
                    resetCb();
                }
                dialog.close();
            });
            dialog.show(this.loc('dataSource.title'), this.loc('dataSource.confirmChange'), [cancelBtn, okBtn]);
        },
        confirmResetTable: function () {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelBtn = dialog.createCloseButton(this.loc('actions.cancel'));
            okBtn.setTitle(this.loc('actions.ok'));
            okBtn.addClass('primary');
            okBtn.setHandler(function() {
                me.dataHandler.clearCoords();
                dialog.close();
            });
            dialog.show(this.loc('flyout.coordinateTable.clearTables'), this.loc('flyout.coordinateTable.confirmClear'), [cancelBtn, okBtn]);
        },
        handleSourceSelection: function(value){
            //this.sourceSelection = value;
            var me = this;
            //var container = me.getContainer();
            //var keyboardInfoElement = container.find('.coordinateconversion-keyboardinfo');
            //var mapSelectInfoElement = container.find('.coordinateconversion-mapinfo')
            me.sourceSelect.selectSource(value);

            if (value === 'file') {
                me.inputTable.setIsEditable(false);
                me.importFileHandler.showFileDialogue(me.readFileToArray.bind(me));
                //keyboardInfoElement.hide();
                //mapSelectInfoElement.hide();
                //this.fileInput.setVisible(true);
                me.inputSystem.disableAllSelections(false);
                me.bindInputTableHandler(false);
            }
            else if (value === 'keyboard') {
                me.inputTable.setIsEditable(true);
                //this.fileInput.setVisible(false);
                //mapSelectInfoElement.hide();
                //keyboardInfoElement.show();
                me.inputSystem.disableAllSelections(false);
                me.bindInputTableHandler(true);
            }
            else if (value === 'map') {
                me.inputTable.setIsEditable(false);
                me.selectFromMap();
                //keyboardInfoElement.hide();
                //this.fileInput.setVisible(false);
                //mapSelectInfoElement.show();
                me.inputSystem.selectMapProjection();
                me.inputSystem.disableAllSelections(true);
                me.bindInputTableHandler(false);
            }
        },
        handleSourceClick: function(value) {
            if (value === 'file') {
                this.importFileHandler.showFileDialogue();
            } else if (value === 'map') {
                this.selectFromMap();
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

        //TODO to table
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
        //TODO to table
        handleCell: function(coord, cell){ //or handleRow
            var cell = jQuery(cell).find('.cellContent');
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

            jQuery('.selectFromMap').on("click", function() {
                me.selectFromMap();
            });

            container.find('.clear').on("click", function () {
                me.confirmResetTable();
            });
            container.find('.show').on("click", function () {
                var inputCoords = me.dataHandler.getInputCoords();
                var inputSrs = me.inputSystem.getSrs();
                me.helper.showMarkersOnMap(inputCoords, false, inputSrs);
                me.instance.toggleViews("mapmarkers");
            });
            container.find('.export').on("click", function () {
                validCrsSelects = me.helper.validateCrsSelections (me.getCrsOptions());
                if (validCrsSelects === true){
                    me.helper.checkDimensions(me.getCrsOptions(), me.handleExport.bind(me));
                }
            });
            container.find('.transform').on("click", function () {
                validCrsSelects = me.helper.validateCrsSelections (me.getCrsOptions());
                if (validCrsSelects === true){
                    me.helper.checkDimensions(me.getCrsOptions(), me.transformToTable.bind(me));
                }
            });
        },
        selectFromMap: function(){
            this.instance.setMapSelectionMode(true);
            if (this.dataHandler.hasInputCoords()){
                this.helper.showMarkersOnMap(this.dataHandler.getInputCoords(), true, this.inputSystem.getSrs());
            }
            this.instance.toggleViews("MapSelection");
        },
        handleExport: function (){
            this.exportFileHandler.showFileDialogue(this.transformToFile.bind(this));
        },
        readFileToArray: function (settings) {
            var crsSettings = this.getCrsOptions();
            var fileSettings = settings;
            if (this.helper.validateFileSelections(fileSettings)){
                this.instance.getService().readFileToArray(crsSettings, fileSettings, this.handleArrayResponse.bind( this ), this.handleErrorResponse.bind(this) );
            }
        },
        transformToTable: function () {
            var crsSettings = this.getCrsOptions();
            var source = this.sourceSelect.getSourceSelection();
            var coords;
            var validTransform;
            var fileSettings;
            var file;
            if (source === "file"){
                fileSettings = this.importFileHandler.getSettings();
                //file = this.fileInput.getFiles();
                if (this.helper.validateFileSelections(fileSettings)){
                    this.instance.getService().transformFileToArray( crsSettings, fileSettings, this.handleArrayResponse.bind( this ), this.handleErrorResponse.bind(this) );
                }
            } else {
                if (this.dataHandler.hasInputCoords()){
                    coords = this.dataHandler.getInputCoords();
                    this.instance.getService().transformArrayToArray( coords, crsSettings, this.handleArrayResponse.bind( this ), this.handleErrorResponse.bind(this) );
                } else {
                    this.showMessage(this.loc('flyout.transform.validateErrors.title'), this.loc('flyout.transform.validateErrors.noInputData'));
                    return;
                }
            }
            /*
            if (source === "file"){
                this.instance.getService().transformFileToArray( file, crsSettings, fileSettings, this.handleArrayResponse.bind( this ), this.handleErrorResponse.bind(this) ); //callback
            } else {
                this.instance.getService().transformArrayToArray( coords, crsSettings, this.handleArrayResponse.bind( this ), this.handleErrorResponse.bind(this) ); //callback
            }*/
        },
        transformToFile: function (settings){
            var crsSettings = this.getCrsOptions();
            var exportSettings = settings;
            var file;
            var coords;
            var source = this.sourceSelect.getSourceSelection();
            if (source === "file"){
                var importSettings = this.importFileHandler.getSettings();
                //file = this.fileInput.getFiles();
                if (this.helper.validateFileSelections(importSettings)){
                    this.instance.getService().transformFileToFile(crsSettings, importSettings, exportSettings, this.handleFileResponse.bind( this ), this.handleErrorResponse.bind(this) );
                }
            } else {
                if (this.dataHandler.hasInputCoords()){
                    coords = this.dataHandler.getInputCoords();
                    this.instance.getService().transformArrayToFile( coords, crsSettings, exportSettings, this.handleFileResponse.bind( this ), this.handleErrorResponse.bind(this) );
                } else {
                    this.showMessage(this.loc('flyout.transform.validateErrors.title'), this.loc('flyout.transform.validateErrors.noInputData'));
                    return;
                }
            }/*
            if (source === "file"){
                this.instance.getService().transformFileToFile(file, crsSettings, importSettings, exportSettings, this.handleFileResponse.bind( this ), this.handleErrorResponse.bind(this) );
            } else {
                this.instance.getService().transformArrayToFile( coords, crsSettings, exportSettings, this.handleFileResponse.bind( this ), this.handleErrorResponse.bind(this) );
            }*/
        },
        handleArrayResponse: function (response) {
            var resultCoords = response.resultCoordinates;
            var inputCoords = response.inputCoordinates;
            //TODO check that response dimension matches
            var dimension = response.dimension;
            var hasMoreCoordinates = response.hasMoreCoordinates;
            if (resultCoords){
                this.dataHandler.setResultCoords(resultCoords);
            }
            if (inputCoords){
                this.dataHandler.setInputCoords(inputCoords);
            }
            if (hasMoreCoordinates === true){
                this.showMessage(this.loc('flyout.transform.responseFile.title'), this.loc('flyout.transform.responseFile.hasMoreCoordinates', {maxCoordsToArray: 100}));
            }
        },
        handleFileResponse: function (data, filename, type){
            //TODO exportToFile should be moved from fileInput to helper
            this.helper.exportToFile(data, filename, type);
        },
        handleErrorResponse: function (errorInfo, errorText){
            var errors = this.loc('flyout.transform.responseErrors');
            var errorMsg = errors.generic;
            var code;
            if (errorInfo && errorInfo.errorKey){
                code = errorInfo.errorKey;
                if (code === "invalid_coord_in_row") {
                    errorMsg = Oskari.getMsg('coordinatetransformation', 'flyout.transform.responseErrors.invalid_coord_in_row', {coordinate: errorInfo.line, rowIndex: errorInfo.lineIndex});
                } else if (errors[code]) {
                    errorMsg = errors[code];
                }
            } else if (errorText){
                errorMsg += "<br> Error: " + errorText; //TODO adds backend msg. use only generic message, when localized messages are ready
            }
            this.showMessage(this.loc('flyout.transform.responseErrors.title'), errorMsg);
        }
    }
);
