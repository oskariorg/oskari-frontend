Oskari.clazz.define('Oskari.coordinatetransformation.component.CoordinateSystemSelection',
    function (view, loc, type, options) {
        this.view = view;
        this.loc = loc;
        this.options = options;
        this.type = type;
        this.element = null;
        this.select = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', view );
        this.systemInfo = Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateSystemInformation');
        this.selectInstances = {};
        this.dropdowns = {};
        //this.enableProjectionSystem = false;
        this.selections;
        this._template = {
            systemWrapper: jQuery('<div class="coordinateSystemWrapper"></div>'),
            coordinateSystemSelection: _.template(
                '<div class="transformation-system">' +
                    '<h5> ${ title }</h5>'+
                    '<div class="system datum center-align" data-system="datum">' +
                        '<b class="dropdown_title"> ${ geodetic_datum }</b>' +
                        '<div class="selectMountPoint"></div>' +
                        '<a href="#">' +
                            '<div class="infolink icon-info"></div>' +
                        '</a>' +
                    '</div>' +
                    '<div class="system coordinate center-align" data-system="coordinate">' +
                        '<b class="dropdown_title"> ${ coordinate_system }</b>' +
                        '<div class="selectMountPoint"></div>' +
                        '<a href="#">' +
                            '<div class="infolink icon-info"></div>' +
                        '</a>' +
                    '</div>' +
                    '<div class="system projection center-align" data-system="projection">' +
                        '<b class="dropdown_title"> ${ map_projection }</b>' +
                        '<div class="selectMountPoint"></div>' +
                        '<a href="#">' +
                            '<div class="infolink icon-info"></div>' +
                        '</a>' +
                    '</div>'+
                    '<div class="system geodetic-coordinate center-align" data-system="geodetic-coordinate">' +
                        '<b class="dropdown_title"> ${ geodetic_coordinate_system } *</b>' +
                        '<div class="selectMountPoint"></div>' +
                        '<a href="#">' +
                            '<div class="infolink icon-info"></div>' +
                        '</a>' +
                    '</div>' +
                    '<div class="system elevation center-align" data-system="elevation">' +
                        '<b class="dropdown_title"> ${ elevation_system } </b>' +
                        '<div class="selectMountPoint"></div>' +
                        '<a href="#">' +
                            '<div class="infolink icon-info"></div>' +
                        '</a>' +
                    '</div>'+
                '</div>'
            )
        }
        this.createUi();
        Oskari.makeObservable(this);
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.component.CoordinateSystemSelection';
        },
        setElement: function (el) {
            this.element = el;
        },
        getElement: function () {
            return this.element;
        },
        createUi: function () {
            var me = this;
            var wrapper = this._template.systemWrapper.clone();

            var coordinateSystemSelection = this._template.coordinateSystemSelection({
                title: this.loc('flyout.coordinateSystem.title'),
                geodetic_datum: this.loc('flyout.coordinateSystem.geodeticDatum.label'),
                coordinate_system:  this.loc('flyout.coordinateSystem.coordinateSystem.label'),
                map_projection:  this.loc('flyout.coordinateSystem.mapProjection.label'),
                geodetic_coordinate_system: this.loc('flyout.coordinateSystem.geodeticCoordinateSystem.label'),
                elevation_system: this.loc('flyout.coordinateSystem.heightSystem.label')
            });
            wrapper.append(coordinateSystemSelection);
            this.setElement(wrapper);

            var json = this.options;
            Object.keys( json ).forEach( function ( key ) {
                var selector = "." + key;
                var container = jQuery(wrapper.find(selector)).find(".selectMountPoint");
                me.createDropdown (container, json[key], key);

            });
            // hide projection select
            this.showProjectionSelect(false);
            //init selections
            this.storeSelectionValues();
            this.handleInfoLink();
        },
        createDropdown: function (container, json, key){
            var me = this;
            var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', key);
            var dropdown;
            var options = {
                    placeholder_text: json['DEFAULT'].title,
                    allow_single_deselect : true,
                    disable_search_threshold: 10,
                    width: '100%'
                };
            var selections = [];
            Object.keys( json ).forEach( function ( key ) {
                var obj = json[key];
                var valObj = {
                    id : key,
                    title : obj.title,
                    cls: obj.cls
                };
                selections.push(valObj);
            });
            dropdown = select.create(selections, options);
            dropdown.css({
                width:'180px'
            });
            select.adjustChosen();
            select.selectFirstValue();
            dropdown.on('change', function(event) {
                //event.stopPropagation();
                me.handleSelectValueChange( select );
            });
            container.append(dropdown);
            this.dropdowns[key] = dropdown;
            this.selectInstances[key] = select;
        },
        /**
         * @method createAndHandleSelect
         * @desc creates an instance of the { Oskari.coordinatetransformation.component.select },
         * and fills it with data
         *
        createAndHandleSelect: function () {
            var me = this;
            var wrapper = this.getElement();
            this.select.create();
            this.selectInstance = this.select.getSelectInstances();
            this.dropdowns = this.select.getDropdowns();
            Object.keys( this.dropdowns ).forEach( function( key ) {
                var system = jQuery( wrapper.find( '.transformation-system' ).find( me.makeClassSelector(key) ).find('.selectMountPoint').append( me.dropdowns[key] ));
                system.parent().on('change', { 'self': me }, function ( e ) {
                    var self = e.data.self;
                    var currentValue = self.selectInstance[e.currentTarget.dataset.system].getValue();
                    self.handleSelectValueChange(currentValue);
                });
            });
        },*/
        //TODO
        handleInfoLink: function () {
            var me = this;
            this.getElement().find('.infolink').on('click', function ( event ) {
                event.stopPropagation();
                var key = this.parentElement.parentElement.dataset.system;
                me.systemInfo.show( jQuery( this ), key );
                //TODO showInfoPopup();
            });
        },
        /**
         * @method updateDropdownOptions
         * @param {string} valueClass - class selector to show options for 
         * @param {string} keyToEmpty - optional param to empty only one specific key in the dropdown 
         */
        updateDropdownOptions: function (dropdownId, selector) {
            if ( typeof selector === 'string' && selector !=="") {
                this.dropdowns[dropdownId].find( 'option' ).css('display', 'none');
                this.dropdowns[dropdownId].find( selector ).css('display', '');
            } else {
                this.dropdowns[dropdownId].find( 'option' ).css('display', '');
            }
        },
        updateGoeCoordDropdown: function () {
            var clsSelector = this.makeClassSelectorFromSelections();
            this.updateDropdownOptions( "geodetic-coordinate", clsSelector );
            this.resetSelectToPlaceholder("geodetic-coordinate");
        },
        makeClassSelector: function (variable) {
            if (variable === "DEFAULT" || variable === ""){
                return "";
            }
            return "." + variable;
        },
        makeClassSelectorFromSelections: function (){
            var selects = this.selections;
            return this.makeClassSelector(selects.coordinate)+
                this.makeClassSelector(selects.projection)+
                this.makeClassSelector(selects.datum);
        },
        /**
         * @method handleSelectValueChange
         * @param {string} currentValue - value of the dropdown we changed
         * @desc handle hiding and showing dropdown options based on user selection 
         */
        handleSelectValueChange: function (select) {
            var currentValue = select.getValue();
            var selectId = select.getId();
            var me = this;
            this.storeSelectionValue(selectId, currentValue);
            var clsSelector;
            var disableElevSystem = false;
            var showElevationRow = false;
            //placeholder value is DEFAULT, removed value is ""
            if (currentValue === ""){
                currentValue = "DEFAULT";
            }

            switch ( selectId ) {
                case "datum":
                    clsSelector = this.makeClassSelector(currentValue);
                    this.resetSelectsToPlaceholder();
                    //Update all dropdowns
                    Object.keys( this.dropdowns ).forEach( function ( key ) {
                        me.updateDropdownOptions( key, clsSelector );
                    });
                    this.showProjectionSelect(false);
                    break;
                case "coordinate":
                    if (currentValue === "COORD_PROJ_2D") {
                        this.showProjectionSelect(true);
                    } else {
                        this.showProjectionSelect(false);
                    }
                    if (currentValue === "COORD_GEOG_3D" || currentValue === "COORD_PROJ_3D"){
                        disableElevSystem = true;
                        showElevationRow = true;
                    }
                    this.updateGoeCoordDropdown();
                    break;
                case "projection":
                    showProjSystem = true;
                    this.updateGoeCoordDropdown();
                    break;
                case "elevation":
                    if (currentValue !== "DEFAULT" ){
                        showElevationRow = true;
                    }
                    break;
                case "geodetic-coordinate":
                    if (currentValue === "EPSG:4936" || currentValue === "EPSG:4937") { //3D
                        disableElevSystem = true;
                        showElevationRow = true;
                    }
                    break;
                default:
                    return;
            }
            this.storeSelectionValues();
            this.disableElevationSelection(disableElevSystem);
            this.updateSelectValues();
            this.trigger('CoordSystemChanged', this.type);
        },
        disableElevationSelection: function (disable){
            var select = this.selectInstances.elevation;
            if (disable === true){
                select.resetToPlaceholder();
                select.setValue('DEFAULT');
                select.setEnabled(false);
            } else {
                select.setEnabled(true);
            }
        },
        disableInputSelections: function (disable){
            var selects = this.selectInstances;
            if (disable === true){
                Object.keys( selects ).forEach( function ( key ) {
                    selects[key].setEnabled(false);
                });
            }else{
                Object.keys( selects ).forEach( function ( key ) {
                    selects[key].setEnabled(true);
                });
            }
        },
        selectMapProjection: function (){
            var mapSrs = Oskari.getSandbox().getMap().getSrsName();
            var srsOptions = this.view.instance.getEpsgValues(mapSrs);
            var selects = this.selectInstances;
            if (srsOptions){
                selects.datum.setValue(srsOptions.datum);
                selects.coordinate.setValue(srsOptions.coord);
                selects["geodetic-coordinate"].setValue(mapSrs);
                this.resetSelectToPlaceholder("elevation");
            }
            this.storeSelectionValues();
            this.updateSelectValues();
            this.trigger('CoordSystemChanged', this.type);
        },
        showProjectionSelect: function (display){
            var elem = jQuery(this.getElement()).find(".projection");
            if (display === true){
                jQuery(elem).css("display","");
            } else {
                jQuery(elem).css("display", "none");
                this.resetSelectToPlaceholder("projection");
            }
        },
        getSelections: function (){
            return this.selections;
        },
        getSrs: function () {
            return this.selections["geodetic-coordinate"];
        },
        getElevation: function () {
            return this.selections.elevation;
        },
        storeSelectionValue: function (key, value){
            if (value === "DEFAULT"){
                this.selections[key] = ""; //TODO null or ""
            } else {
                this.selections[key] = value
            }
        },
        storeSelectionValues: function () {
            var me = this;
            var values = {};
            var value;
            Object.keys( this.selectInstances ).forEach( function ( instance ) {
                value = me.selectInstances[instance].getValue();
                if (value === "DEFAULT"){
                    values[instance] = ""; //TODO null or ""
                } else {
                    values[instance] = value
                }
            });
            me.selections = values;
        },
        resetSelectsToPlaceholder: function (resetDatum) {
            var selects = this.selectInstances;
            Object.keys( selects ).forEach( function ( key ) {
                if (key === "datum" && resetDatum !== true){
                    return;
                }
                selects[key].resetToPlaceholder();
                selects[key].setValue('DEFAULT'); //TODO
            });
        },
        resetSelectToPlaceholder: function (key){
            var select = this.selectInstances[key];
            if (select){
                select.resetToPlaceholder();
                select.setValue('DEFAULT'); //TODO
            }
        },
        updateSelectValues: function () {
            var selects = this.selectInstances;
            Object.keys( selects ).forEach( function ( key ) {
                selects[key].update();
            });
        },
        getSelectInstances: function () {
            return this.selectInstances;
        },
    }
);
 