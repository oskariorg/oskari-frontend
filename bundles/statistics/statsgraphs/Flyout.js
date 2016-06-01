/**
 * @class Oskari.mapframework.statsgraphs.Flyout
 *
 * Renders the "help" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.statsgraphs.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.userguide.UserGuideBundleInstance}
     *        instance reference to component that created the tile
     */
    function() {
        this.chart = null;
    }, {

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
        setEl: function(el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('statsgraphs')) {
                jQuery(this.container).addClass('statsgraphs');
            }
        },

        /**
         * @method startPlugin
         * called by host to start flyout operations
         */
        startPlugin: function() {},
        onOpen: function() {
            this.createUi(this.container);
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */

        createUi: function(container) {
            if (this.chart) {
                return;
            }
            // init a chart - http://c3js.org/gettingstarted.html
            this.chart = c3.generate({
                bindto: container,
                data: {
                    columns: []
                }
            });
        },
        updateUI : function(name, regions, data) {
            if (!this.chart) {
                // ui not on screen yet
                return;
            }
            Oskari.log('StatsGraph').info('TODO: graph for indicator ' + name);
            this.chart.load({
              columns: [
                [name].concat(data)
              ],
               keys: {
                  // this doesn't seem to work really
                 value: regions
               }
            });

        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });