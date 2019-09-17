/*
 * @class Oskari.sample.bundle.tetris.Tile
 *
 * Renders the "tetris" tile.
 */
Oskari.clazz.define('Oskari.sample.bundle.tetris.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param
 * {Oskari.sample.bundle.tetris.LayerSelectionBundleInstance}
 * instance
 *      reference to component that created the tile
 */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.template = null;
        this.shownLayerCount = null;
    }, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
        getName: function () {
            return 'Oskari.sample.bundle.tetris.Tile';
        },
        /**
     * @method setEl
     * @param {Object} el
     *      reference to the container in browser
     *
     * Interface method implementation
     */
        setEl: function (el) {
            this.container = jQuery(el);
        },
        /**
     * @method startPlugin
     * Interface method implementation, calls #refresh()
     */
        startPlugin: function () {
            this.refresh();
        },
        /**
     * @method stopPlugin
     * Interface method implementation, clears the container
     */
        stopPlugin: function () {
            this.container.empty();
        },
        /**
     * @method getTitle
     * @return {String} localized text for the title of the tile
     */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
     * @method getDescription
     * @return {String} localized text for the description of the tile
     */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
     * @method getOptions
     * Interface method implementation, does nothing atm
     */
        getOptions: function () {

        },
        /**
     * @method setState
     * Interface method implementation, does nothing atm
     */
        setState: function () {
        },
        /**
     * @method refresh
     * Creates the UI for a fresh start
     */
        refresh: function () {

        }
    }, {
    /**
     * @property {String[]} protocol
     * @static
     */
        'protocol': ['Oskari.userinterface.Tile']
    });
