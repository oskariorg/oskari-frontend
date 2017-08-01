Oskari.clazz.define('Oskari.framework.bundle.coordinateconversion.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance}
     *        instance reference to component that created the tile
     */
    function( instance ) {
        var me = this;
        me.instance = instance;
        me.container = null;
        me.loc = me.instance.getLocalization("flyout");
        me._template = {
            coordinatesystem: _.template(' <div class="coordinateconversion-csystem"> </br> ' +
                                    '<h4><%= title %></h4>'+
                                    '<span><b><%= datum %></b></span> </br> ' +
                                    '<span><b><%= coordsystem %></b></span> </br> ' +
                                    '<span><b><%= geodesiccsystem%></b></span> </br> ' +
                                    '<span><b><%= heightsystem %></b></span> </div>'
                                ),
            coordinatedatasource: _.template('<div class="coordinateconversion-datasource"> </br> ' +
                                            '<h4><%= title %></h4>'+
                                            '<table>' +
                                            '<tr>' +
                                                '<td><input type="radio" value="1"><%= file %></td>'+
                                                '<td><input type="radio" value="2"><%= clipboard %></td>'+
                                                '<td><input type="radio" value="3"><%= map %></td>'+
                                                '<td><input id="choose" type="button" value="<%= choose %>"></td>'+
                                            '</tr>'+
                                            '</table> </div>'),
            coordinatefield: _.template('<div class="coordinateconverision-field">' +
                                        '<span> <h4> <% input %> </h4> <h4> <% result %> </h4> </span>' +
                                        '</div>'),
            coordinatefieldbuttons: _.template('<div class="coordinateconverision-buttons">' +
                                        
                                        '</div>')
        }
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function() {
            return 'Oskari.framework.bundle.coordinateconversion.Flyout';
        },
        getTitle: function() {
            return this.loc.flyoutTtitle;
        },
        setEl: function(el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('coordinateconversion-flyout')) {
                jQuery(this.container).addClass('coordinateconversion-flyout');
            }
        },
        createUi: function() {
            var coordinatesystem = this._template.coordinatesystem({ title: this.loc.coordinatesystem.title,
                                                          datum: this.loc.coordinatesystem.geodesicdatum,
                                                          coordsystem: this.loc.coordinatesystem.coordinatesystem,
                                                          geodesiccsystem:this.loc.coordinatesystem.geodesiccoordinatesystem,
                                                          heightsystem:this.loc.coordinatesystem.heightsystem });

            var coordinatedatasource = this._template.coordinatedatasource({ title: this.loc.datasource.title, 
                                                                             file: this.loc.datasource.file,
                                                                             clipboard: this.loc.datasource.clipboard,
                                                                             map: this.loc.datasource.map,
                                                                             choose: this.loc.datasource.choose });
    
            var coordinatefield = this._template.coordinatefield({  input: this.loc.coordinatefield.input,
                                                                    result: this.loc.coordinatefield.result,
                                                                    convert: this.loc.coordinatefield.convert });

            jQuery(this.container).append(coordinatesystem);
            jQuery(this.container).append(coordinatesystem);
            jQuery(this.container).append(coordinatedatasource);
            jQuery(this.container).append(coordinatefield);
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function() {

            this.template = jQuery();
            var elParent = this.container.parentElement.parentElement;
            jQuery(elParent).addClass('coordinateconversion-flyout');
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function() {
            "use strict";
        },

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
