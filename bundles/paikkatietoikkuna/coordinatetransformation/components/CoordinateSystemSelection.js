Oskari.clazz.define('Oskari.coordinatetransformation.component.CoordinateSystemSelection',
    function (view) {
        this.instance = view;
        this.loc = view.loc;
        this.element = null;
        this.select = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', view );
        this.systemInfo = Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateSystemInformation');
        this.selectInstance = null;
        this.dropdowns = null;
        this.projectionSelected = false;
        this._template = {
            systemWrapper: jQuery('<div class="coordinateSystemWrapper"></div>'),
            coordinateSystemSelection: _.template(
                '<div class="transformation-system">' +
                    '<h5> ${ title }</h5>'+
                    '<div class="system geodetic-datum" data-system="datum"><b class="dropdown_title"> ${ geodetic_datum }</b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br> ' +
                    '<div class="system coordinate" data-system="coordinate"><b class="dropdown_title"> ${ coordinate_system }</b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div>  </div> </br> ' +
                    '<div class="system projection" style="display:none;" data-system="projection"> ${ map_projection } <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br>' +
                    '<div class="system geodetic-coordinate" data-system="geodetic-coordinate"><b class="dropdown_title"> ${ geodetic_coordinate_system } *</b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br> ' +
                    '<div class="system elevation" data-system="elevation"><b class="dropdown_title"> ${ elevation_system } </b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> '+
                '</div>'
            ),
        }
        this.createUi();
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.view.SourceSelect';
        },
        setElement: function (el) {
            this.element = el;
        },
        getElement: function () {
            return this.element;
        },
        createUi: function () {
            var wrapper = this._template.systemWrapper.clone();

            var coordinateSystemSelection = this._template.coordinateSystemSelection({
                title: this.loc.coordinatesystem.title,
                geodetic_datum: this.loc.coordinatesystem.geodetic_datum,
                coordinate_system: this.loc.coordinatesystem.coordinate_system,
                map_projection: this.loc.coordinatesystem.map_projection,
                geodetic_coordinate_system:this.loc.coordinatesystem.geodetic_coordinatesystem,
                elevation_system:this.loc.coordinatesystem.heigth_system 
            });
            wrapper.append(coordinateSystemSelection);
            this.setElement(wrapper);
            this.populateSelect();
            this.handleInfoLink();
        },
        populateSelect: function () {
            var me = this;
            var wrapper = this.getElement();
            this.select.create();
            this.selectInstance = this.select.getSelectInstances();
            this.dropdowns = this.select.getDropdowns();
            var i = 0;
            Object.keys( this.dropdowns ).forEach( function( key ) {
                jQuery( wrapper.find( '.transformation-system' ).find( '.select' )[i] ).append( me.dropdowns[key] );
                i++;
            });
            this.handleSelectionChanged();
        },
        handleInfoLink: function () {
            var me = this;
            this.getElement().find('.infolink').on('click', function ( event ) {
                event.stopPropagation();
                var key = this.parentElement.parentElement.dataset.system;
                me.systemInfo.show( jQuery( this ), key );
            });
        },
        handleSelectionChanged: function () {
            var element = this.getElement();
            var systems = element.find('.system');
            var me = this;
            systems.each(function (idx, system) {
                jQuery( this ).on('change', function ( e ) {
                    me.handleSystemChange(e);
                });
            })
        },
        handleSystemChange: function (e) {
            var current = this.selectInstance[e.currentTarget.dataset.system];
            var currentValue = current.getValue();
            this.handleSelectValueChange(currentValue);
        },
        /**
         * @method handleDropdownOptions
         * @param {string} valueClass - class selector to show options for 
         * @param {string} keyToEmpty - optional param to empty only one specific key in the dropdown 
         */
        handleDropdownOptions: function (valueClass, keyToEmpty) {
            var dropdowns = this.dropdowns;
            if ( valueClass.indexOf("DATUM_DEFAULT") !== -1 ) {
                //show all options
                Object.keys( dropdowns ).forEach( function ( key ) {
                    dropdowns[key].find( 'option' ).show();
                });
                return;
            }
            if ( typeof keyToEmpty === 'undefined') {
                Object.keys( dropdowns ).forEach( function ( key ) {
                    dropdowns[key].find( 'option' ).hide();
                    dropdowns[key].find( valueClass ).show();
                });
            } else {
                Object.keys( dropdowns ).forEach( function ( key ) {
                    dropdowns[keyToEmpty].find( 'option' ).hide();
                    dropdowns[key].find( valueClass ).show();
                });
            }
        },
        makeClassSelector: function (variable) {
            return "." + variable;
        },
        /**
         * @method handleSelectValueChange
         * @param {string} currentValue - value of the dropdown we changed
         * @desc handle hiding and showing dropdown options based on user selection 
         */
        handleSelectValueChange: function (currentValue) {
            var me = this;
            var dropdowns = this.dropdowns;
            var instances = this.selectInstance;
            var datum = instances.datum.getValue();
            var coordinate = instances.coordinate.getValue();
            var projection = instances.projection.getValue();
            var clsSelector = this.makeClassSelector;

            me.instance.startingSystem = true;
            
            switch ( currentValue ) {
                case "DATUM_DEFAULT":
                case "DATUM_KKJ":
                case "DATUM_EUREF-FIN":
                    this.projectionSelected = false;
                    this.resetSelectToPlaceholder();
                    this.handleDropdownOptions( clsSelector( currentValue) );
                    break;
                case "KOORDINAATISTO_MAANT_2D":
                    this.projectionSelected = false;
                    var valueClass = clsSelector( datum ) + clsSelector( currentValue );
                    this.handleDropdownOptions( valueClass, "geodetic-coordinate" );
                    break;
                case "KOORDINAATISTO_MAANT_3D":
                case "KOORDINAATISTO_SUORAK_3D":
                    this.projectionSelected = false;
                    this.handleDropdownOptions( clsSelector( currentValue ), "geodetic-coordinate" );
                    instances["geodetic-coordinate"].resetToPlaceholder();
                    break;
                case "KOORDINAATISTO_SUORAK_2D":
                case "KKJ_KAISTA":
                case "TM":
                case "GK":
                    this.projectionSelected = true;
                    this.handleDropdownOptions( clsSelector( currentValue ), "geodetic-coordinate" );
                    break;
                case "COORDSYS_DEFAULT":
                    me.instance.startingSystem = true;
                    break;
                case "KORKEUSJ_DEFAULT":
                    this.displayTableElevationRow(false);
                    break;
                case "KORKEUSJ_N2000":
                case "KORKEUSJ_N60":
                case "KORKEUSJ_N43":
                    this.displayTableElevationRow(true);        
                    break;
                default:
                    break;
            }

            var classesToShow = clsSelector(datum);

            if ( this.projectionSelected ) {
                dropdowns.projection.parent().parent().show();
               if ( projection ) {
                    classesToShow += clsSelector(datum) + clsSelector(projection);
                }
            } else {
                dropdowns.projection.parent().parent().hide();
                instances.projection.resetToPlaceholder();

                if ( coordinate ) {
                    classesToShow += clsSelector(datum) + clsSelector(coordinate);
                }
            }
            dropdowns["geodetic-coordinate"].find(classesToShow).show();
            this.updateSelectValues( instances );
        },
        /**
         * @method displayTableElevationRow
         * @param {boolean} display - true - display the row, false - hide or grey out depending if there is data in the row
         * @desc handle hiding and showing the elevation row in the table
         */
        displayTableElevationRow: function ( display ) {
            var me = this;
            var isEmpty = true;
            var elevationCells = me.instance.inputTable.getElements().rows.find('.elevation');

            if ( !display ) {
                elevationCells.attr("contenteditable", false);
                //check if elevationcells have value, if true don't hide but grey out
                elevationCells.each( function (key, val) {
                    var element = jQuery( val );
                    element.html().trim();
                    if ( !element.is(':empty') ) {
                        isEmpty = false;
                    }
                });
                if ( !isEmpty ) {
                    elevationCells.addClass('disabled');
                } else {
                    me.instance.inputTable.toggleElevationRows();
                }
            } else {
                elevationCells.attr("contenteditable", true);

                if ( elevationCells.hasClass('disabled') ) {
                    elevationCells.removeClass('disabled');
                } else if( !elevationCells.hasClass('oskari-hidden') ) {
                    return;
                } else {
                    me.instance.inputTable.toggleElevationRows();   
                }
            }
        },
        resetSelectToPlaceholder: function () {
            //reset all but the datum
            this.selectInstance.coordinate.resetToPlaceholder();
            this.selectInstance.projection.resetToPlaceholder();
            this.selectInstance["geodetic-coordinate"].resetToPlaceholder();
            this.selectInstance.elevation.resetToPlaceholder();
        },
        updateSelectValues: function ( instances ) {
            Object.keys( instances ).forEach( function ( key ) {
                instances[key].update();
            });
        },
        getSelectInstance: function () {
            return this.selectInstance;
        },
    }
);
 