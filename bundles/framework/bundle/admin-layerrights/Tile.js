/*
 * @class Oskari.framework.bundle.admin-layerrights.Tile
 * 
 * Renders the layer rights management tile.
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layerrights.Tile',

      /**
       * @method create called automatically on construction
       * @static
       * @param {Oskari.mapframework.bundle.search.SearchBundleInstance} instance
       *        reference to component that created the tile
       */
      function (instance) {
        "use strict";
        var me = this;
        me.instance = instance;
        me.container = null;
        me.template = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component 
         */
        getName : function () {
            "use strict";
            return 'Oskari.framework.bundle.admin-layerrights.Tile';
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
        setEl : function (el, width, height) {
            "use strict";
            this.container = jQuery(el);
        },
        /**
         * @method startPlugin
         * Interface method implementation, calls #refresh() 
         */
        startPlugin : function () {
            "use strict";
            this.refresh();
        },
        /**
         * @method stopPlugin 
         * Interface method implementation, clears the container 
         */
        stopPlugin : function () {
            "use strict";
            this.container.empty();
        },
        /**
         * @method getTitle 
         * @return {String} localized text for the title of the tile 
         */
        getTitle : function () {
            "use strict";
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription 
         * @return {String} localized text for the description of the tile 
         */
        getDescription : function () {
            "use strict";
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions 
         * Interface method implementation, does nothing atm 
         */
        getOptions : function () {
            "use strict";
        },
        /**
         * @method setState 
         * @param {Object} state
         *      state that this component should use
         * Interface method implementation, does nothing atm 
         */
        setState : function (state) {
            "use strict";
        },
        /**
         * @method refresh
         * Creates the UI for a fresh start
         */
        refresh : function () {
            "use strict";
            /*
            var me = this,
                instance = me.instance,
                tpl = this.template,
                sandbox = instance.getSandbox(),
                cel = me.container,
                status = cel.children('.oskari-tile-status');
            */

            // status.empty();
            // status.append('(' + layers.length + ')');
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static 
         */
        'protocol' : ['Oskari.userinterface.Tile']
    });
