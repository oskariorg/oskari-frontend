Oskari.clazz.define('Oskari.coordinateconversion.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.coordinateconversion.instance}
     *        instance reference to component that created the tile
     */
    function( instance ) {
        var me = this;
        me.instance = instance;
        me.loc = this.instance.getLocalization();
        me.container = null;
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
            var view = this.instance.getViews().conversion.createUI(this.container);
        },
        toggleFlyout: function ( visible ) {
            if( !visible ) {
                jQuery( this.container ).parent().parent().hide();
            } else {
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
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });
