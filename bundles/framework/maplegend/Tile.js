/**
 * @class Oskari.mapframework.bundle.maplegend.Tile
 * Renders the "all layers" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.Tile',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.maplegend.LayerSelectorBundleInstance} instance
     *      reference to component that created the tile
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
            return 'Oskari.mapframework.bundle.maplegend.Tile';
        },
        /**
         * @method setEl
         * @param {Object} el reference to the container in browser
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
            this._addTileStyleClasses();
            this.refresh();
        },
        _addTileStyleClasses: function() {
            var isContainer = (this.container && this.instance.mediator) ? true : false;
            var isBundleId = (isContainer && this.instance.mediator.bundleId) ? true : false;
            var isInstanceId = (isContainer && this.instance.mediator.instanceId) ? true : false;

            if (isInstanceId && !this.container.hasClass(this.instance.mediator.instanceId)) {
                this.container.addClass(this.instance.mediator.instanceId);
            }
            if (isBundleId && !this.container.hasClass(this.instance.mediator.bundleId)) {
                this.container.addClass(this.instance.mediator.bundleId);
            }
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
        setState: function () {},
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