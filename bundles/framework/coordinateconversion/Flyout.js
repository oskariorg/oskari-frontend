Oskari.clazz.define('Oskari.coordinateconversion.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance}
     *        instance reference to component that created the tile
     */
    function( instance ) {
        var me = this;
        me.instance = instance;
        me.loc = this.instance.getLocalization();
        me.container = null;
        this.views = {
            conversion: Oskari.clazz.create('Oskari.coordinateconversion.view.conversion', me.instance),
            mapselect: Oskari.clazz.create('Oskari.coordinateconversion.view.mapselect', me.instance)
        }
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function() {
            return 'Oskari.coordinateconversion.Flyout';
        },
        getTitle: function() {
            return this.loc.title;
        },
        getViews: function () {
            return this.views;
        },
        setEl: function(el, width, height) {
            this.container = el[0];
            if ( !jQuery( this.container ).hasClass('coordinateconversion-flyout') ) {
                jQuery( this.container ).addClass('coordinateconversion-flyout');
            }
        },
        createUi: function() {
            var view = this.getViews().conversion.createUI(this.container);
        },
        shouldUpdate: function ( caller ) {
            if( caller === this.getViews().conversion.getName() ) {
                jQuery( this.container ).parent().parent().hide();
                var mapselect = this.getViews().mapselect.show();
            }
            else {
                jQuery( this.container ).parent().parent().show();
            }
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
            jQuery( elParent ).addClass('coordinateconversion-flyout');
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
