/**
 * @class Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Flyout
 *
 */
Oskari.clazz.define('Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param
     * {Oskari.tampere.bundle.tampere.AdminWfsSearchChannel}
     * instance
     * Reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this._templates = {
            admin_wfs_search_channel: jQuery('<div class="oskari__adminwfssearchchannel"></div>')
        };
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Flyout';
        },

        /**
         * @public @method setEl
         * Interface method implementation
         *
         * @param {Object} el
         * Reference to the container in browser
         * @param {Number} width
         * Container size(?) - not used
         * @param {Number} height
         * Container size(?) - not used
         *
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('admin__wfs-search-channel')) {
                jQuery(this.container).addClass('admin__wfs-search-channel');
            }
        },
        /**
        * @public @method startPlugin
        * Interface method implementation, assigns the HTML templates
        * that will be used to create the UI
        *
        *
        */
        startPlugin: function () {
            var loc = this.instance.getLocalization('flyout'),
                elParent,
                elId;

            //set id to flyouttool-close
            elParent = this.container.parentElement.parentElement;
            elId = jQuery(elParent).find('.oskari-flyouttoolbar').find('.oskari-flyouttools').find('.oskari-flyouttool-close');
            elId.attr('id', 'oskari_admin_wfs_search_channel_flyout_oskari_flyouttool_close');
        },
        /**
         * @public @method stopPlugin
         * Interface method implementation, does nothing atm
         *
         *
         */
        stopPlugin: function () {

        },

        /**
         * @public @method getTitle
         *
         *
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },

        /**
         * @public @method getDescription
         *
         *
         * @return {String} localized text for the description of the flyout.
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @public @method getOptions
         * Interface method implementation, does nothing atm
         *
         *
         */
        getOptions: function () {

        },

        /**
         * @public @method setState
         * Interface method implementation, does nothing atm
         *
         * @param {Object} state
         * State that this component should use
         *
         */
        setState: function (state) {
            this.state = state;

        },

        /**
         * @public @method createUi
         * Creates the UI for a fresh start
         *
         *
         */
        createUi: function () {
            var me = this,
                container = jQuery(me.container),
                adminWfsSearchChannelContainer = me._templates.admin_wfs_search_channel,
                loc = this.instance.getLocalization('flyout');

            container.empty();
            container.append(adminWfsSearchChannelContainer);


        },

        /**
         * @method refresh
         * utitity to temporarily support rightjs sliders (again)
         */
        refresh: function () {

        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
