Oskari.clazz.define('Oskari.coordinatetransformation.component.CoordinateSystemSelection',
    function (view) {
        this.instance = view;
        this.loc = view.loc;
        this.element = null;
        this.select = Oskari.clazz.create('Oskari.coordinatetransformation.component.select', view );
        this.selectInstance = null;
        this.dropdowns = null;
        this._template = {
            systemWrapper: jQuery('<div class="coordinateSystemWrapper"></div>'),
            coordinatSystemSelection: _.template(
                '<div class="transformation-system">' +
                    '<h5><%= title %></h5>'+
                    '<div class="geodetic-datum"><b class="dropdown_title"><%= geodetic_datum %></b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br> ' +
                    '<div class="coordinate-system"><b class="dropdown_title"><%= coordinate_system %></b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div>  </div> </br> ' +
                    '<div class="map-projection" style="display:none;"> <%= map_projection %> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br>' +
                    '<div class="geodetic-coordinatesystem"><b class="dropdown_title"><%= geodetic_coordinate_system %> *</b> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> </div> </br> ' +
                    '<div class="height-system"><b class="dropdown_title"><%= height_system %></b></div> <a href="#"><div class="infolink icon-info"></div></a> <div class="select"></div> '+
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
                height_system:this.loc.coordinatesystem.heigth_system 
            });
            wrapper.append(coordinatSystemSelection);
            this.setElement(wrapper);
            this.populateSelect();
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
            this.select.handleSelectionChanged(wrapper);
        },
        getSelectInstance: function () {
            return this.selectInstance;
        },
    }
);
 