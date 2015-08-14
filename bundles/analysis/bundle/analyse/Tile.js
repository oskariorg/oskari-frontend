/*
 * @class Oskari.analysis.bundle.analyse.Tile
 *
 * Renders the "analyse" tile.
 */
Oskari.clazz.define('Oskari.analysis.bundle.analyse.Tile',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
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
            return 'Oskari.analysis.bundle.analyse.Tile';
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
         * @param {Object} state
         *      state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {

        },
        /**
         * @method refresh
         * Creates the UI for a fresh start
         */
        refresh: function () {},

        clickHandler: function (extensionState) {
            var i = this.instance,
                s = i.getSandbox();
            if (extensionState === 'close') {
                // Close statsgrid... trying to close all breaks things.
                s.postRequestByName(
                                'userinterface.UpdateExtensionRequest',
                                [{
                                    getName: function () {
                                        return 'StatsGrid';
                                    }
                                }, 'close']
                            );
            }
            s.postRequestByName(
                            'userinterface.UpdateExtensionRequest',
                            [i, 'toggle']
                        );
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Tile']
    });