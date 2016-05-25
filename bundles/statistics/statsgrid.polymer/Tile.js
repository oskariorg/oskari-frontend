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

    function () { }, {
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
            // disable on start
            this.setEnabled(false);
        }
    }, {
        /**
         * @property {String[]} extend
         * @static
         */
        "extend": ["Oskari.userinterface.extension.DefaultTile"]
    });