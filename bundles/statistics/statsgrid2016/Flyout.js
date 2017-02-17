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
        getLegendFlyout : function() {
            if(this.__legendFlyout) {
                return this.__legendFlyout;
            }
            var locale = this.instance.getLocalization().legend;
            var flyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', locale.title, {
                width: '200px',
                cls: 'statsgrid-legend-flyout'
            });
            flyout.makeDraggable({
                handle : '.oskari-flyouttoolbar, .statsgrid-legend-container > .header',
                scroll : false
            });
            this.__legendFlyout = flyout;
            // render content
            this.__legend = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', this.instance.getSandbox(), this.instance.getLocalization());
            var container = jQuery('<div/>');
            this.__legend.render(container);
            flyout.setContent(container);
            return this.__legendFlyout;
        },
        showLegend : function(enabled) {
            if(!enabled) {
                this.removeSideTools();
                return;
            }
            var me = this;
            var locale = this.instance.getLocalization();
            this.addSideTool(locale.legend.title, function(el, bounds) {
                // lazy render
                var flyout = me.getLegendFlyout();
                if(flyout.isVisible()) {
                    flyout.hide();
                } else {
                    // show and reset position
                    flyout.move(bounds.right, bounds.top, true);
                    // init legend panel open when the flyout is opened
                    me.__legend.openLegendPanel();
                    flyout.show();
                    flyout.bringToTop();
                }
            });
        },
        /**
         * @method lazyRender
         * Called when flyout is opened (by instance)
         * Creates the UI for a fresh start.
         */
        render: function (isEmbedded) {
            var locale = this.instance.getLocalization();
            // empties all
            this.getEl().empty();

            var title = locale.flyout.title;
            var parent = this.getEl().parent().parent();
            if(isEmbedded) {
                parent.find('.oskari-flyout-title p').html(title);
                // Remove close button from published
                parent.find('.oskari-flyouttools').hide();
            } else {
                // resume defaults (important if user used publisher)
                parent.find('.oskari-flyout-title p').html(title);
                parent.find('.oskari-flyouttools').show();
            }
            this.showLegend(!isEmbedded);

            this.addContent(this.getEl(), isEmbedded);
        },

        setGridHeaderHeight: function(){
            var me = this;

            if(me._grid) {
                me._grid.setHeaderHeight();
            }
        },

        addContent : function (el, isEmbedded) {
            var me = this;
            var sb = this.instance.getSandbox();

            var accordion = Oskari.clazz.create(
                    'Oskari.userinterface.component.Accordion'
                );
            var panels = this.getPanels(isEmbedded);
            var service = sb.getService('Oskari.statistics.statsgrid.StatisticsService');
            var state = service.getStateService();
            var openFirstPanel = state.getIndicators().length === 0;

            _.each(panels, function(p) {
                if(p.id === 'newSearchPanel' && openFirstPanel) {
                    p.panel.open();
                }
                accordion.addPanel(p.panel);
            });

            accordion.insertTo(el);

            // Add grid
            var grid = Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', sb, this.instance.getLocalization());
            grid.showRegionsetSelector(!isEmbedded);
            grid.showIndicatorRemoval(!isEmbedded);
            grid.render(el);

            me._grid = grid;

        },
        closePanels: function() {
            var panels = this.__panels || [];
            _.each(panels, function(p) {
                p.panel.close();
            });
        },
        getPanels : function(isEmbedded) {
            var panels = [];
            if(isEmbedded) {
                // no panels for embedded map
                return panels;
            }

            panels.push(this.getNewSearchPanel());
            panels.push(this.getExtraFeaturesPanel());
            return panels;
        },
        getNewSearchPanel: function(){
            var sb = this.instance.getSandbox();
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            var container = panel.getContainer();
            var locale = this.instance.getLocalization();

            panel.setTitle(locale.panels.newSearch.title);

            var selectionComponent = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', this.instance, sb);
            container.append(selectionComponent.getPanelContent());

            return {id:'newSearchPanel', panel:panel};
        },
        getExtraFeaturesPanel: function(){
            var sb = this.instance.getSandbox();
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            var container = panel.getContainer();
            var locale = this.instance.getLocalization();

            panel.setTitle(locale.panels.extraFeatures.title);
            container.append(Oskari.clazz.create('Oskari.statistics.statsgrid.ExtraFeatures', sb, locale.panels.extraFeatures).getPanelContent());

            return {id:'extraFeaturesPanel', panel:panel};
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });