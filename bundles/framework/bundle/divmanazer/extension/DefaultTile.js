/**
 * @class Oskari.userinterface.extension.DefaultTile
 *
 * Default Menu Tile implementation which assumes a locale
 * of kind
 * {
 *     "title" : "<title shown to user>",
 *     "description" : "<a longer localised description>"
 * }
 *
 */
Oskari.clazz.define('Oskari.userinterface.extension.DefaultTile',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */

    function (instance, locale) {
        /**
         * @property locale localisation for this tile
         */
        this.locale = locale;

        /**
         * @property extension bundle instance
         */
        this.instance = instance;

        this.container = null;
        this.template = null;
    }, {
        /**
         * @method getName
         * @return {String} tile implementation name
         */
        getName: function () {
            return 'Oskari.userinterface.extension.DefaultTile';
        },

        /**
         * @method setEl
         * called by host implementation to add DOM element where the
         * tile is to be rendered
         */
        setEl: function (el, width, height) {
            this.container = $(el);
        },

        /**
         * @method startPlugin
         * called by host implementation when the tile is to be started
         * f.ex to provide some kind of active visualisations.
         */
        startPlugin: function () {
        },

        /**
         * @method stopPlugin
         * called by host when the tile is to be removed
         */
        stopPlugin: function () {
            if (this.container && this.container.empty) {
                this.container.empty();
            }
        },

        /**
         * @method getTitle
         * @return {String} called by host to get a localised title to be shown
         *
         */
        getTitle: function () {
            return this.locale.title;
        },

        /**
         * @method getDescription
         * @return {String} called by host to get a longer description for display
         */
        getDescription: function () {
            return this.locale.description;
        },

        /**
         * @method getOptions
         * @return {JSON} a placeholder for future implementations
         */
        getOptions: function () {
        },

        /**
         * @method setState
         * placeholder for future implementations
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method getState
         * @return {JSON} placeholder for future implementations
         */
        getState: function (state) {
            return this.state;
        },
        /**
         * Enables or disables the tile
         * @param {Boolean} blnEnabled true to enable.
         */
        setEnabled: function (blnEnabled) {
            if(!!blnEnabled) {
                this.container.removeClass('disabled');
            }
            else {
                this.container.addClass('disabled');
            }
        },
        /**
         * Returns true if tile is enabled
         * @return {Boolean} true if enabled
         */
        isEnabled: function () {
            return !this.container.hasClass('disabled');
        }

    }, {
        'protocol': ['Oskari.userinterface.Tile']
    });
