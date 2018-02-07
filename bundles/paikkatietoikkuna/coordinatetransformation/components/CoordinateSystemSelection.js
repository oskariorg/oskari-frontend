Oskari.clazz.define('Oskari.coordinatetransformation.component.CoordinateSystemSelection',
    function (view) {
        this.instance = view;
        this.loc = view.loc;
        this.element = null;
        this.select = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', view );
        this.systemInfo = Oskari.clazz.create('Oskari.coordinatetransformation.view.CoordinateSystemInformation');
        this.selectInstance = null;
        this.dropdowns = null;
        this._template = {
            systemWrapper: jQuery('<div class="coordinateSystemWrapper"></div>'),
            coordinatSystemSelection: _.template(
                '<div class="transformation-system">' +
                    '<h5><%= title %></h5>'+
                    '<div class="system geodetic-datum" data-system="datum"><b class="dropdown_title"><%= geodetic_datum %></b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br> ' +
                    '<div class="system coordinate" data-system="coordinate"><b class="dropdown_title"><%= coordinate_system %></b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div>  </div> </br> ' +
                    '<div class="system projection" style="display:none;" data-system="projection"> <%= map_projection %> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br>' +
                    '<div class="system geodetic-coordinate" data-system="geodetic-coordinate"><b class="dropdown_title"><%= geodetic_coordinate_system %> *</b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br> ' +
                    '<div class="system elevation" data-system="elevation"><b class="dropdown_title"><%= elevation_system %></b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> '+
                '</div>'
            ),
        }
        if (this.element === null) {
            this.createUi();
        }
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

            var coordinatSystemSelection = this._template.coordinatSystemSelection({
                title: this.loc.coordinatesystem.title,
                geodetic_datum: this.loc.coordinatesystem.geodetic_datum,
                coordinate_system: this.loc.coordinatesystem.coordinate_system,
                map_projection: this.loc.coordinatesystem.map_projection,
                geodetic_coordinate_system:this.loc.coordinatesystem.geodetic_coordinatesystem,
                elevation_system:this.loc.coordinatesystem.heigth_system 
            });
            wrapper.append(coordinatSystemSelection);
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
        handleSelectionChanged:function () {
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
            this.checkValueAgainstRules(currentValue);
        },
        loopDropdowns: function (valueClass, keyToEmpty) {
            var dropdowns = this.dropdowns;
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
        checkValueAgainstRules: function (currentValue) {
            //we want to hide dropdown selections based on the value we receive
            var me = this;
            var dropdowns = this.dropdowns;
            var instances = this.selectInstance;
            var datum = instances.datum.getValue();
            var clsSelector = this.makeClassSelector;

            // weird
            dropdowns.projection.parent().parent().hide();
            instances.projection.resetToPlaceholder();
            me.instance.startingSystem = true;

            switch ( currentValue ) {
                case "DATUM_DEFAULT":
                    break;
                case "DATUM_KKJ":
                    this.loopDropdowns( clsSelector( currentValue) );
                    break;
                case "DATUM_EUREF-FIN":
                    this.loopDropdowns( clsSelector( currentValue) );
                    break;
                case "KOORDINAATISTO_MAANT_2D":
                    var valueClass = clsSelector( datum ) + clsSelector( currentValue );
                    this.loopDropdowns( valueClass, "geodetic-coordinate" );
                    break;
                case "KOORDINAATISTO_MAANT_3D":
                    this.loopDropdowns( clsSelector( currentValue ), "geodetic-coordinate" );
                    break;
                case "KOORDINAATISTO_SUORAK_2D":
                    this.loopDropdowns( clsSelector( currentValue ), "geodetic-coordinate" );
                    dropdowns.projection.parent().parent().show();
                    break;
                case "KOORDINAATISTO_SUORAK_3D":
                    this.loopDropdowns( clsSelector( currentValue ), "geodetic-coordinate" );
                    break;
                case "KKJ_KAISTA":
                    this.loopDropdowns( clsSelector( currentValue ), "geodetic-coordinate" );
                    break;
                case "TM":
                    this.loopDropdowns( clsSelector( currentValue ), "geodetic-coordinate" );
                    break;
                    this.loopDropdowns( clsSelector( currentValue ), "geodetic-coordinate" );
                case "GK":
                    break;
                case "COORDSYS_DEFAULT":
                    me.instance.startingSystem = true;
                    break;
                case "KORKEUSJ_DEFAULT":
                    var isEmpty = true;
                    var elevationCells = me.instance.inputTable.getElements().rows.find('.elevation');
                    elevationCells.attr("contenteditable", false);
                    //check if elevationcells have value, if true don't hide but grey out
                    jQuery.each( elevationCells, function (key, val) {
                        jQuery(val).html().trim();
                        if ( !jQuery( val ).is(':empty') ) {
                            isEmpty = false;
                        }
                    });
                    if ( !isEmpty ) {
                        elevationCells.addClass('disabled');
                    } else {
                        me.instance.inputTable.toggleElevationRows();
                    }
                    break;
                case "KORKEUSJ_N2000":
                case "KORKEUSJ_N60":
                case "KORKEUSJ_N43":
                    var elevationCells = me.instance.inputTable.getElements().rows.find('.elevation');
                    elevationCells.attr("contenteditable", true);

                    if ( elevationCells.hasClass('disabled') ) {
                        elevationCells.removeClass('disabled');
                    } else if( !elevationCells.hasClass('oskari-hidden') ) {
                        return;
                    } else {
                        me.instance.inputTable.toggleElevationRows();   
                    }            
                    break;
                default:
                    break;
            }
            Object.keys( instances ).forEach( function ( key ) {
                instances[key].update();
            });
        },
        getSelectInstance: function () {
            return this.selectInstance;
        },
    }
);
 