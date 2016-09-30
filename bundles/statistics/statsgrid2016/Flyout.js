/**
 * @class Oskari.statistics.statsgrid.Flyout
 *
 * Renders the thematic maps flyout.
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher2.PublisherBundleInstance} instance
     *      reference to component that created the flyout
     */
    function () {
        this.__components = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.statistics.statsgrid.Flyout';
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.getEl().addClass('statsgrid');
        },
        /**
         * @method lazyRender
         * Called when flyout is opened (by divmanazer)
         * Creates the UI for a fresh start.
         */
        lazyRender: function (config) {
            if(this.__components) {
                // already rendered
                return;
            }
            this.addContent(this.getEl(), config);
        },
        addContent : function (el, config) {
            var comps = this.getComponents(config);
            comps.forEach(function(component, index) {
                component.render(el);
                var notLastComponent = index < comps.length - 1;
                if(notLastComponent) {
                    el.append('<hr style="border: 1px dashed #c3c3c3;" />');
                }
            });
        },
        getComponents : function(config) {
            if(this.__components) {
                return this.__components;
            }
            this.__components = true;
            var sb = this.instance.getSandbox();
            config = config || {};
            var comps = [];
            if(config.indicatorSelector !== false) {
                comps.push(Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', sb));
            }
            if(config.regionSelector !== false) {
                comps.push(Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetSelection', sb));
            }
            if(config.grid !== false) {
                comps.push(Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', sb));
            }
            this.__components = comps;
            return comps;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });