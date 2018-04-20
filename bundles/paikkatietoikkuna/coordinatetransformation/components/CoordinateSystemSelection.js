Oskari.clazz.define('Oskari.coordinatetransformation.component.CoordinateSystemSelection',
    function (view, loc, type, options) {
        this.view = view;
        this.loc = loc;
        this.options = options;
        this.type = type;
        this.element = null;
        this.select = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', view );
        //this.systemInfo = Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateSystemInformation');
        this.selectInstances = {};
        this.dropdowns = {};
        //this.enableProjectionSystem = false;
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
        updateDropdownOptions: function (dropdownId, selector) {;
            if ( typeof selector === 'string' && selector !=="") {
                this.dropdowns[dropdownId].find( 'option' ).css('display', 'none');
                this.dropdowns[dropdownId].find( selector ).css('display', '');
            } else {
                this.dropdowns[dropdownId].find( 'option' ).css('display', '');
            }
        },
        makeClassSelector: function (variable) {
            if (variable === "DEFAULT" || variable === ""){
                return "";
            }
            return "." + variable;
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
            var dropdowns = this.dropdowns;
            var instances = this.selectInstances;
            var datum = instances.datum.getValue();
            var coordinate = instances.coordinate.getValue();
            var projection = instances.projection.getValue();
            var clsSelector;

            var disableElevSystem = false;
            var showElevationRow = false;
            var showProjSystem = false;
            /*
            var table;
            // transform.js sets a data-type attribute to this element refactor to using Oskari.observable
            var system = this.element.attr('data-type');
            // which table we operate on
            if ( system === 'coordinate-input' ) {
                table = this.instance.inputTable;
            } else {
                table = this.instance.outputTable;
            }
            */
            /*if ( coordinate.indexOf("3D") > -1 ) {
                table.handleDisplayingElevationRows(true);
                instances.elevation.setEnabled( false );
            } else {
                table.handleDisplayingElevationRows(false);
                instances.elevation.setEnabled( true );
            }*/
            if (currentValue === ""){
                currentValue = "DEFAULT";
            }

            switch ( selectId ) {
                case "datum":
                    clsSelector = this.makeClassSelector(currentValue);
                    //enableProjectionSystem = false;
                    this.resetSelectsToPlaceholder();
                    //Update all dropdowns
                    Object.keys( this.dropdowns ).forEach( function ( key ) {
                        me.updateDropdownOptions( key, clsSelector );
                    });
                    break;
                case "coordinate":
                    if (currentValue === "COORD_PROJ_2D") {
                        showProjSystem = true;
                    }
                    clsSelector = this.makeClassSelector(currentValue) + this.makeClassSelector(datum);
                    this.updateDropdownOptions( "geodetic-coordinate", clsSelector );
                    this.resetSelectToPlaceholder("geodetic-coordinate");
                    if (currentValue === "COORD_GEOG_3D" || currentValue === "COORD_PROJ_3D"){
                        disableElevSystem = true;
                        showElevationRow = true;
                    }
                    break;
                case "projection":
                    showProjSystem = true;
                    clsSelector = this.makeClassSelector(currentValue)+this.makeClassSelector(coordinate)+this.makeClassSelector(datum);
                    this.updateDropdownOptions( "geodetic-coordinate", clsSelector );
                    this.resetSelectToPlaceholder("geodetic-coordinate");
                    break;
                case "elevation":
                    if (currentValue !== "DEFAULT" || currentValue !== ""){
                        showElevationRow = true;
                    }
                    this.view.updateTableHeader(this.type, this.getSelectionValues()['geodetic-coordinate'], currentValue);
                    break;
                case "geodetic-coordinate":
                    if (currentValue === "EPSG:4936" || currentValue === "EPSG:4937") { //3D
                        disableElevSystem = true;
                        showElevationRow = true;
                    }
                    this.view.updateTableHeader(this.type, currentValue, this.getSelectionValues().elevation); //TODO
                    break;
                default:
                    return;
            }
            this.disableElevationSelection(disableElevSystem);
            this.showProjectionSelect(showProjSystem);
            this.updateSelectValues( instances ); //TODO only (selectId, currentValue) --> reset placeholders
            this.view.handleTableElevationRows(this.type, showElevationRow);
            //TODO trigger event
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
            }
        },
        showProjectionSelect: function (display){
            var select = this.selectInstances.projection;
            var elem = jQuery(this.getElement()).find(".projection");
            if (display === true){
                jQuery(elem).css("display","");
            } else {
                jQuery(elem).css("display", "none");
                select.resetToPlaceholder();
            }
        },
        /**
         * @method getSelectionValues
         * @description gets all values from all the selectList components associated with this class
         * @return { Object } containing the values
         */
        getSelectionValues: function () { //TODO
            var me = this;
            var values = {};
            Object.keys( this.selectInstances ).forEach( function ( instance ) {
                values[instance] = me.selectInstances[instance].getValue();
            });
            return values;
        },
        resetSelectsToPlaceholder: function (resetDatum) { //TODO
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
        updateSelectValues: function ( instances ) { //TODO
            Object.keys( instances ).forEach( function ( key ) {
                instances[key].update();
            });
        },
        getSelectInstances: function () {
            return this.selectInstances;
        },
    }
);
 