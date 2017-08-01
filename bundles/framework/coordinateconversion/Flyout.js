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
            coordinatesystem: _.template('<span><%= this.loc.coordinatesystem.geodesicdatum %></span> ' +
                                    '<span><%= this.loc.coordinatesystem.coordinatesystem %></span> ' +
                                    '<span><%= this.loc.coordinatesystem.geodesiccoordinatesystem %></span> ' +
                                    '<span><%= this.loc.coordinatesystem.heightsystem %></span> '
                                ),
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
            var appen = this._template.coordinatesystem;
            this.container.append(appen);
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
