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
        "use strict";
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
            "use strict";
            return 'Oskari.userinterface.extension.DefaultTile';
        },

        /**
         * @method setEl
         * called by host implementation to add DOM element where the
         * tile is to be rendered
         */
        setEl: function (el, width, height) {
            "use strict";
            this.container = $(el);
        },

        /**
         * @method startPlugin
         * called by host implementation when the tile is to be started
         * f.ex to provide some kind of active visualisations.
         */
        startPlugin: function () {
            "use strict";
        },

        /**
         * @method stopPlugin
         * called by host when the tile is to be removed
         */
        stopPlugin: function () {
            "use strict";
        },

        /**
         * @method getTitle
         * @return {String} called by host to get a localised title to be shown
         *
         */
        getTitle: function () {
            "use strict";
            return this.locale.title;
        },

        /** 
         * @method getDescription
         * @return {String} called by host to get a longer description for display
         */
        getDescription: function () {
            "use strict";
            return this.locale.description;
        },

        /**
         * @method getOptions
         * @return {JSON} a placeholder for future implementations
         */
        getOptions: function () {
            "use strict";
        },

        /** 
         * @method setState
         * placeholder for future implementations
         */
        setState: function (state) {
            "use strict";
            this.state = state;
        },

        /**
         * @method getState
         * @return {JSON} placeholder for future implementations
         */
        getState: function (state) {
            "use strict";
            return this.state;
        }

    }, {
        'protocol': ['Oskari.userinterface.Tile']
    });
