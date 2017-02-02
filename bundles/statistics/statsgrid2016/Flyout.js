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
        this.__sideTools = {
            legend: {}
        };
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
        getLegendFlyout: function(options, comp){
            var me = this;
            if(!comp.__sideTools) {
                comp.__sideTools = {
                    legend: {}
                };
            }
            if(!comp.__sideTools.legend.comp) {
                comp.__sideTools.legend.comp = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', this.instance.getSandbox(), this.instance.getLocalization());
            }
            if(!comp.__sideTools.legend.flyout) {
                options = options || {};
                options.locale = options.locale || { title: ''};
                comp.__sideTools.legend.flyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', me.instance, options.locale, {
                    width: '200px',
                    closeCallback: function(popup) {
                         if(options.callbacks && typeof options.callbacks.close === 'function'){
                            options.callbacks.close(popup);
                         }
                    },
                    showCallback: function(popup) {
                        if(options.callbacks && typeof options.callbacks.show === 'function'){
                            options.callbacks.show(popup);
                         }
                    },
                    cls: options.cls,
                    container: options.container
                });
            }

            if(options.callbacks && typeof options.callbacks.after === 'function') {
                options.callbacks.after();
            }
        },
        showLegend : function(enabled) {
            if(!enabled) {
                this.removeSideTools();
                return;
            }
            var me = this;
            var locale = this.instance.getLocalization();
            this.addSideTool(locale.legend.title, function(el){
                me.__sideTools.legend.sideTool = el;

                me.getLegendFlyout(
                {
                    callbacks: {
                        close: function() {
                            me.__sideTools.legend.opened = false;
                        },
                        show: function(popup) {
                            var classification = me.__sideTools.legend.comp.getClassification();

                            me.__sideTools.legend.flyout.setContent(classification);

                            me.setSideToolPopupPosition(popup);
                        },
                        after: function(){
                            if(me.__sideTools.legend.opened) {
                                me.__sideTools.legend.flyout.hide();
                                me.__sideTools.legend.opened = false;
                            } else {
                                me.__sideTools.legend.flyout.show();
                                me.__sideTools.legend.opened = true;
                            }

                        }
                    },
                    locale: locale.legend,
                    cls: 'statsgrid-legend-flyout'
                }, me);
            });
        },
        /**
         * @method lazyRender
         * Called when flyout is opened (by instance)
         * Creates the UI for a fresh start.
         */
        render: function (isEmbedded) {
            var me = this;
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

        setSideToolPopupPosition: function(popup) {
            var me = this;
            var tool = me.__sideTools.legend.sideTool;
            var position = tool.position();
            var parent = tool.parents('.oskari-flyout');
            if(parent.length === 0) {
                return;
            }
            var left = parent.position().left + parent.outerWidth() + tool.width() - 16;

            if(left + popup.width() > jQuery(window).width()) {
                left = left - popup.width() - tool.width();
            }
            var top = parent.position().top + position.top;
            if(top + popup.height() > jQuery(window).height()) {
                top = top - (popup.height() - tool.height());
            }
            popup.css({
                left: left,
                top: top
            });

            popup.css('z-index', 20000);
        },
        addContent : function (el, isEmbedded) {
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
            grid.showRegionsetSelector(!isEmbedded)
            grid.showIndicatorRemoval(!isEmbedded);
            grid.render(el);

        },
        onClose: function() {
            var me = this;
            for(var tool in me.__sideTools) {
                if(me.__sideTools[tool] && me.__sideTools[tool].flyout) {
                    me.__sideTools[tool].flyout.hide();
                }
            }
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