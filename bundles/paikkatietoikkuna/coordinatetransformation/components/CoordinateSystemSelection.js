Oskari.clazz.define('Oskari.coordinatetransformation.component.CoordinateSystemSelection',
    function (view, loc, type, helper) {
        this.view = view;
        this.loc = loc;
        this.helper = helper;
        this.type = type;
        this.element = null;
        this.select = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', view );
        this.systemInfo = Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateSystemInformation');
        this.selectInstances = {};
        this.dropdowns = {};
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

            var json = this.helper.getOptionsJSON();
            Object.keys( json ).forEach( function ( key ) {
                var selector = "." + key;
                var container = jQuery(wrapper.find(selector)).find(".selectMountPoint");
                me.createDropdown (container, json[key], key);

            });
            // hide projection select
            this.showProjectionSelect(false);
            this.handleInfoLinks();
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
                //don't add default/placeholder option
                if (key === "DEFAULT"){
                    return;
                }
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

            dropdown.on('change', function(event) {
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
        handleInfoLinks: function () {
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

        /**
         * @method handleSelectValueChange
         * @param {SelectList} select - dropdown we changed
         * @desc handle hiding and showing dropdown options based on user selection 
         */
        handleSelectValueChange: function (select) {
            var currentValue = select.getValue();
            var selectId = select.getId();
            var disableElevSystem = false;
            switch ( selectId ) {
                case "datum":
                    this.resetAndUpdateSelects();
                    break;
                case "coordinate":
                    if (currentValue === "COORD_PROJ_2D") {
                        this.showProjectionSelect(true);
                    } else {
                        this.showProjectionSelect(false);
                    }
                    if (currentValue === "COORD_GEOG_3D" || currentValue === "COORD_PROJ_3D"){
                        disableElevSystem = true;
                    }
                    this.resetAndUpdateCoordSelect();
                    break;
                case "projection":
                    showProjSystem = true;
                    this.resetAndUpdateCoordSelect();
                    break;
                case "elevation":
                    break;
                case "geodetic-coordinate":
                    if (this.helper.is3DSystem(currentValue)) {
                        disableElevSystem = true;
                    }
                    break;
                default:
                    Oskari.log(this.getName()).warn("Invalid select");
                    return;
            }
            this.disableElevationSelection(disableElevSystem);
            this.trigger('CoordSystemChanged', this.type);
        },
        disableElevationSelection: function (disable){
            var select = this.selectInstances.elevation;
            if (disable === true){
                //TODO
                //select.resetSelectToPlaceholder();
                select.setValue('');
                select.setEnabled(false, true);
            } else {
                select.setEnabled(true, true);
            }
        },
        disableAllSelections: function (disable){
            var selects = this.selectInstances;
            if (disable === true){
                Object.keys( selects ).forEach( function ( key ) {
                    selects[key].setEnabled(false, true);
                });
            }else{
                Object.keys( selects ).forEach( function ( key ) {
                    selects[key].setEnabled(true, true);
                });
            }
        },
        selectMapProjection: function (){
            var srsOptions = this.helper.getMapEpsgValues();
            var selects = this.selectInstances;
            if (srsOptions){
                selects.datum.setValue(srsOptions.datum);
                selects.coordinate.setValue(srsOptions.coord);
                if (srsOptions.coord === "COORD_PROJ_2D"){
                    this.showProjectionSelect(true);
                    selects.projection.setValue(srsOptions.proj);
                }
                selects["geodetic-coordinate"].setValue(srsOptions.srs);
                //TODO
                //selects.elevation.resetSelectToPlaceholder();
                selects.elevation.setValue("");
            }
            this.updateAllDropdowns();
            this.trigger('CoordSystemChanged', this.type);
        },
        showProjectionSelect: function (display){
            var elem = jQuery(this.getElement()).find(".projection");
            if (display === true){
                jQuery(elem).css("display","");
            } else {
                jQuery(elem).css("display", "none");
                //TODO
                //this.selectInstances.projection.resetSelectToPlaceholder();
                this.selectInstances.projection.setValue("");
            }
        },
        getSelections: function (){
            var selects = this.selectInstances;
            var selections = {};
            Object.keys( selects ).forEach( function ( key ) {
                selections[key] = selects[key].getValue();
            });
            return selections;
        },
        getSrs: function () {
            return this.selectInstances["geodetic-coordinate"].getValue();
        },
        getElevation: function () {
            return this.selectInstances.elevation.getValue();
        },
        resetAllSelections: function (){
            this.disableElevationSelection(false);
            this.resetAndUpdateSelects(true);
            this.trigger('CoordSystemChanged', this.type);
        },
        resetAndUpdateSelects: function (resetDatum) {
            var selects = this.selectInstances;
            Object.keys( selects ).forEach( function ( key ) {
                if (key === "datum" && resetDatum !== true){
                    return;
                }
                //TODO
                //selects[key].resetToPlaceholder();
                selects[key].setValue("");
            });
            this.showProjectionSelect(false);
            this.updateAllDropdowns();
        },
        updateAllDropdowns: function (){
            coordSelector = this.makeClassSelectorFromSelections();
            datumSelector = this.makeClassSelectorFromDatum();
            //Filter dropdowns with clsSelector if selector is "" then show all options
            this.updateDropdownOptions( "geodetic-coordinate", coordSelector );
            this.updateDropdownOptions( "projection", datumSelector );
            this.updateDropdownOptions( "coordinate", datumSelector );
            //update chosen-results manually because dropdown's selections are handled after change by css
            this.getElement().find('select').trigger('chosen:updated');
        },
        resetAndUpdateCoordSelect: function (){
            var clsSelector = this.makeClassSelectorFromSelections();
            var select = this.selectInstances["geodetic-coordinate"];
            //TODO
            //select.resetToPlaceholder();
            select.setValue('');
            this.updateDropdownOptions( "geodetic-coordinate", clsSelector );
            //update chosen-results manually because dropdown's selections are handled after change by css
            this.getElement().find(".geodetic-coordinate select").trigger('chosen:updated');
        },
        makeClassSelector: function (variable) {
            if (variable === ""){
                return "";
            }
            return "." + variable;
        },
        makeClassSelectorFromDatum: function (){
            var datum = this.selectInstances.datum.getValue();
            return this.makeClassSelector(datum);
        },
        makeClassSelectorFromSelections: function (){
            var selects = this.getSelections();
            return this.makeClassSelector(selects.coordinate)+
                this.makeClassSelector(selects.projection)+
                this.makeClassSelector(selects.datum);
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
 