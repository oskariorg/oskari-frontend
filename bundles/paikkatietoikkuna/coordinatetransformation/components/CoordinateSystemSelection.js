Oskari.clazz.define('Oskari.coordinatetransformation.component.CoordinateSystemSelection',
    function (view) {
        this.instance = view;
        this.loc = view.loc;
        this.element = null;
        this.select = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', view );
        this.systemInfo = Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateSystemInformation');
        this.selectInstance = null;
        this.dropdowns = null;
        this.enableProjectionSystem = false;
        this._template = {
            systemWrapper: jQuery('<div class="coordinateSystemWrapper"></div>'),
            coordinateSystemSelection: _.template(
                '<div class="transformation-system">' +
                    '<h5> ${ title }</h5>'+
                    '<div class="system datum center-align" data-system="datum"><b class="dropdown_title"> ${ geodetic_datum }</b>  <div class="selectMountPoint"></div> <a href="#"><div class="infolink icon-info"></div></a> </div>' +
                    '<div class="system coordinate center-align" data-system="coordinate"><b class="dropdown_title"> ${ coordinate_system }</b> <div class="selectMountPoint"></div>  <a href="#"><div class="infolink icon-info"></div></a> </div>' +
                    '<div class="system projection center-align" style="display:none;" data-system="projection"> ${ map_projection } </b> <div class="selectMountPoint"></div> <a href="#"><div class="infolink icon-info"></div></a> </div>'+
                    '<div class="system geodetic-coordinate center-align" data-system="geodetic-coordinate"><b class="dropdown_title"> ${ geodetic_coordinate_system } *</b> <div class="selectMountPoint"></div> <a href="#"><div class="infolink icon-info"></div></a> </div>' +
                    '<div class="system elevation center-align" data-system="elevation"><b class="dropdown_title"> ${ elevation_system } </b> <div class="selectMountPoint"></div>  <a href="#"><div class="infolink icon-info"></div></a> </div> '+
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
            this.createAndHandleSelect();
            this.handleInfoLink();
        },
        /**
         * @method createAndHandleSelect
         * @desc creates an instance of the { Oskari.coordinatetransformation.component.select },
         * and fills it with data
         */
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
        },
        handleInfoLink: function () {
            var me = this;
            this.getElement().find('.infolink').on('click', function ( event ) {
                event.stopPropagation();
                var key = this.parentElement.parentElement.dataset.system;
                me.systemInfo.show( jQuery( this ), key );
            });
        },
        /**
         * @method updateDropdownOptions
         * @param {string} valueClass - class selector to show options for 
         * @param {string} keyToEmpty - optional param to empty only one specific key in the dropdown 
         */
        updateDropdownOptions: function (dropdownId, valueId) {
            if ( typeof valueId === 'string' ) {
                this.dropdowns[dropdownId].find( 'option' ).css('display', 'none');
                this.dropdowns[dropdownId].find( valueId ).css('display', '');
            } else {
                this.dropdowns[dropdownId].find( 'option' ).css('display', '');
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

            var table;
            // transform.js sets a data-type attribute to this element refactor to using Oskari.observable
            var system = this.element.attr('data-type');
            // which table we operate on
            if ( system === 'coordinate-input' ) {
                table = this.instance.inputTable; 
            } else {
                table = this.instance.outputTable;
            }

            me.instance.startingSystem = true;
            
            if ( coordinate.indexOf("3D") > -1 ) {
                table.handleDisplayingElevationRows(true);
                instances.elevation.setEnabled( false );
            } else {
                table.handleDisplayingElevationRows(false);
                instances.elevation.setEnabled( true );
            }

            switch ( currentValue ) {
                case "DATUM_DEFAULT":
                    this.enableProjectionSystem = false;
                    this.resetSelectToPlaceholder();
                    Object.keys( this.dropdowns ).forEach( function ( key ) {
                        me.updateDropdownOptions( key ); 
                    });
                    break;
                case "DATUM_KKJ":
                case "DATUM_EUREF-FIN":
                    this.enableProjectionSystem = false;
                    this.resetSelectToPlaceholder();
                    Object.keys( this.dropdowns ).forEach( function ( key ) {
                        me.updateDropdownOptions( key, clsSelector( currentValue) ); 
                    });
                    break;
                case "KOORDINAATISTO_MAANT_2D":
                    this.enableProjectionSystem = false;
                    var classSelector = clsSelector( datum ) + clsSelector( currentValue );
                    this.updateDropdownOptions( "geodetic-coordinate", classSelector );
                    instances["geodetic-coordinate"].resetToPlaceholder();
                    break;
                case "KOORDINAATISTO_MAANT_3D":
                case "KOORDINAATISTO_SUORAK_3D":
                    this.enableProjectionSystem = false;
                    this.updateDropdownOptions( "geodetic-coordinate", clsSelector( currentValue ) );
                    instances["geodetic-coordinate"].resetToPlaceholder();
                    table.handleDisplayingElevationRows(true);
                    break;
                case "KOORDINAATISTO_SUORAK_2D":
                case "KKJ_KAISTA":
                case "TM":
                case "GK":
                    this.enableProjectionSystem = true;
                    this.updateDropdownOptions( "geodetic-coordinate", clsSelector( currentValue ) );
                    instances["geodetic-coordinate"].resetToPlaceholder();
                    break;
                case "COORDSYS_DEFAULT":
                    me.instance.startingSystem = true;
                    break;
                case "KORKEUSJ_N2000":
                case "KORKEUSJ_N60":
                case "KORKEUSJ_N43":
                    table.handleDisplayingElevationRows(true);        
                    break;
                default:
                    break;
            }

            var classSelector = clsSelector(datum);

            if ( this.enableProjectionSystem ) {
                dropdowns.projection.parent().parent().show();
               if ( projection ) {
                    classSelector += clsSelector(projection);
                }
            } else {
                dropdowns.projection.parent().parent().hide();
                instances.projection.resetToPlaceholder();

                if ( coordinate ) {
                    classSelector += clsSelector(coordinate);
                }
            }
            dropdowns["geodetic-coordinate"].find(classSelector).show();
            this.updateSelectValues( instances );
            table.updateTitle( this.getSelectionValues() );
        },
        /**
         * @method getSelectionValues
         * @description gets all values from all the selectList components associated with this class
         * @return { Object } containing the values
         */
        getSelectionValues: function () {
            var me = this;
            var values = {};
            Object.keys( this.selectInstance ).forEach( function ( instance ) {
                values[instance] = me.selectInstance[instance].getValue();
            });
            return values;
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
 