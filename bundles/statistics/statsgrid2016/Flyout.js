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
        this.__panels = null;
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
            if(this.__panels) {
                // already rendered
                // open first panel
                this.__panels[0].open();
                return;
            }
            this.addContent(this.getEl(), config);
        },
        addContent : function (el, config) {
            var accordion = Oskari.clazz.create(
                    'Oskari.userinterface.component.Accordion'
                );
            var panels = this.getPanels(config);
            _.each(panels, function(panel) {
                accordion.addPanel(panel);
            });

            accordion.insertTo(el);
        },
        getPanels : function(config) {
            var locale = this.instance.getLocalization();
            if(this.__panels) {
                return this.__panels;
            }
            this.__panels = true;
            var sb = this.instance.getSandbox();
            config = config || {};
            var panels = [];

            // Generate first panel
            panels.push(this.getNewSearchPanel(config));

            // Generate extra features panel
            panels.push(this.getExtraFeaturesPanel(config));

            if(config.grid !== false) {
                //panels.push(Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', sb));
            }
            this.__panels = panels;
            return panels;
        },
        getNewSearchPanel: function(config){
            var sb = this.instance.getSandbox();
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.open();
            var container = panel.getContainer();
            var locale = this.instance.getLocalization();

            panel.setTitle(locale.panels.newSearch.title);

            container.append(Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', this.instance, sb).getPanelContent(config));

            return panel;
        },
        getExtraFeaturesPanel: function(config){
            var sb = this.instance.getSandbox();
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            var container = panel.getContainer();
            var locale = this.instance.getLocalization();

            panel.setTitle(locale.panels.extraFeatures.title);

            container.append(Oskari.clazz.create('Oskari.statistics.statsgrid.ExtraFeatures', this.instance, sb).getPanelContent(config));

            return panel;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });