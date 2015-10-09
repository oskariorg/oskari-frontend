/**
 * @class Oskari.statistics.bundle.statsgrid.Tile
 * Renders the Statsgrid tile.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.Tile',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.statistics.bundle.statsmode.StatsModeInstance}
     *          instance reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.template = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.statistics.bundle.statsgrid.Tile';
        },
        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = jQuery(el);
            // disable until we get defaultlayer
            this.disable();
        },
        /**
         * @method startPlugin
         * Interface method implementation
         */
        startPlugin: function () {},
        /**
         * @method stopPlugin
         * Interface method implementation, clears the container
         */
        stopPlugin: function () {
            if (this.container && this.container.empty) {
                this.container.empty();
            }
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the tile
         */
        getTitle: function () {
            return this.instance.getLocalization().tile.title;
        },
        /**
         * @method refresh
         * Creates the UI for a fresh start
         */
        refresh: function () {
        },
        disable: function () {
            this.container.addClass('disabled');
        },
        enable: function () {
            this.container.removeClass('disabled');
        },
        isEnabled: function () {
            return !this.container.hasClass('disabled');
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Tile']
    });