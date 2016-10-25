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
            legend: {
                opened: false,
                flyout: null,
                comp: null
            }
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
        getLegendFlyout: function(options){
            var me = this;
            if(!me.__sideTools.legend.comp) {
                me.__sideTools.legend.comp = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', me.instance);
            }
            if(!me.__sideTools.legend.flyout) {
                options = options || {};
                options.locale = options.locale || { title: ''};
                me.__sideTools.legend.flyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', me.instance, options.locale, {
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
                    cls: options.cls
                });
            }

            if(options.callbacks && typeof options.callbacks.after === 'function') {
                options.callbacks.after();
            }
        },
        /**
         * @method lazyRender
         * Called when flyout is opened (by divmanazer)
         * Creates the UI for a fresh start.
         */
        lazyRender: function (config) {
            var me = this;
            var sb = me.instance.getSandbox();
            var locale = this.instance.getLocalization();
            /*
            if(this.__panels) {
                // already rendered
                // open first panel
                //this.__panels[0].panel.open();
                return;
            }
            */

            // empties all
            this.getEl().empty();
            this.removeSideTools();

            config = config || {};


            if(config.mouseEarLegend !== false && sb.mapMode !== 'mapPublishMode') {
                this.addSideTool(locale.legend.title, function(el){
                    me.__sideTools.legend.sideTool = el;
                    me.getLegendFlyout(
                    {
                        callbacks: {
                            close: function(popup) {
                                me.__sideTools.legend.opened = false;
                            },
                            show: function(popup) {
                                me.__sideTools.legend.flyout.setContent(me.__sideTools.legend.comp.getClassification());
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
                    });
                });
            } else {
                me.renderPublishedLegend();
            }
            this.addContent(this.getEl(), config);
        },
        renderPublishedLegend: function(){
            var me = this;
            var sb = me.instance.getSandbox();
            var locale = this.instance.getLocalization();

            var service = sb.getService('Oskari.statistics.statsgrid.StatisticsService');
            if(!service) {
                // not available yet
                return;
            }

            var state = service.getStateService();
            var ind = state.getActiveIndicator();
            if(!ind) {
                return;
            }

            service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
                if(err) {
                    me.log.warn('Error getting indicator data', ind.datasource, ind.indicator, ind.selections, state.getRegionset());
                    return;
                }
                var classify = service.getClassificationService().getClassification(data);
                if(!classify) {
                    me.log.warn('Error getting indicator classification', data);
                    return;
                }

                // TODO: check that we got colors
                var regions = [];
                var vis = [];

                // format regions to groups for url
                var regiongroups = classify.getGroups();
                var classes = [];
                regiongroups.forEach(function(group) {
                    // make each group a string separated with comma
                    classes.push(group.join());
                });

                var colorsWithoutHash = service.getColorService().getColorset(regiongroups.length);
                var colors = [];
                colorsWithoutHash.forEach(function(color) {
                    colors.push('#' + color);
                });

                var state = service.getStateService();

                service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {
                    if(err) {
                        me.log.warn('Error getting indicator metadata', ind.datasource, ind.indicator);
                        return;
                    }
                    me.getLegendFlyout(
                    {
                        callbacks: {
                            show: function(popup) {
                                var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
                                var container = jQuery('<div class="accordion-published"></div>');

                                var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                                panel.setTitle(locale.legend.title);
                                panel.setContent(me.__sideTools.legend.comp.getClassification());
                                panel.setVisible(true);
                                panel.open();

                                accordion.addPanel(panel);
                                accordion.insertTo(container);

                                me.__sideTools.legend.flyout.setContent(container);
                            },
                            after: function(){
                                me.__sideTools.legend.flyout.show();
                            }
                        },
                        locale: {
                            title: ''
                        },
                        cls: 'statsgrid-legend-flyout-published'
                    });

                    service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
                        var ind = event.getCurrent();
                        if(ind) {
                            me.updatePublishedFlyoutTitle(ind);
                        }
                    });

                    me.updatePublishedFlyoutTitle(state.getActiveIndicator());
                });
            });
        },
        updatePublishedFlyoutTitle: function (ind){
            var me = this;
            var sb = me.instance.getSandbox();
            var service = sb.getService('Oskari.statistics.statsgrid.StatisticsService');
            if(!service) {
                // not available yet
                return;
            }
            var state = service.getStateService();

            service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {

                var getSourceLink = function(currentHash){
                    var indicators = state.getIndicators();
                    var currentIndex = state.getIndicatorIndex(currentHash);
                    var nextIndicatorIndex = 1;
                    if(currentIndex === indicators.length) {
                        nextIndicatorIndex = 1;
                    } else {
                        nextIndicatorIndex=currentIndex + 1;
                    }

                    return {
                        index: nextIndicatorIndex,
                        handler: function(){
                            var curIndex = nextIndicatorIndex-1;
                            var i = indicators[curIndex];
                            state.setActiveIndicator(i.hash);
                        }
                    };
                };

                var link = getSourceLink(ind.hash);

                me.__sideTools.legend.flyout.setTitle('<div class="header">' + me.instance.getLocalization().statsgrid.source + ' ' + state.getIndicatorIndex(ind.hash) + '</div>' +
                    '<div class="link">' + me.instance.getLocalization().statsgrid.source + ' ' + link.index + ' >></div>'+
                    '<div class="sourcename">' + Oskari.getLocalized(indicator.name) + '</div>');
                me.__sideTools.legend.flyout.getTitle().find('.link').unbind('click');
                me.__sideTools.legend.flyout.getTitle().find('.link').bind('click', function(){
                    link.handler();
                });

            });

        },
        setSideToolPopupPosition: function(popup) {
            var me = this;
            var tool = me.__sideTools.legend.sideTool;
            var position = tool.position();
            var parent = tool.parents('.oskari-flyout');
            if(parent.length === 0) {
                return;
            }
            var left = parent.position().left + parent.outerWidth() + tool.width();

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
        addContent : function (el, config) {
            var sb = this.instance.getSandbox();
            config = config || {};

            var accordion = Oskari.clazz.create(
                    'Oskari.userinterface.component.Accordion'
                );
            var panels = this.getPanels(config);
            _.each(panels, function(p) {
                if(p.id === 'newSearchPanel') {
                    p.panel.open();
                }
                accordion.addPanel(p.panel);
            });

            accordion.insertTo(el);

            // Add grid
            if(config.grid !== false) {
                var grid = Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', this.instance, sb);
                grid.render(el);
            }

        },
        handleClose: function(){
            var me = this;
            for(var tool in me.__sideTools) {
                if(me.__sideTools[tool] && me.__sideTools[tool].flyout) {
                    me.__sideTools[tool].flyout.hide();
                }
            }
        },
        closePanels: function(){
            var panels = this.__panels || [];
            _.each(panels, function(p) {
                p.panel.close();
            });
        },
        getPanels : function(config) {
            var locale = this.instance.getLocalization();
            /*if(this.__panels) {
                return this.__panels;
            }*/
            //this.__panels = true;
            var sb = this.instance.getSandbox();
            var panels = [];

            // Generate first panel
            if(config.search !== false) {
                panels.push(this.getNewSearchPanel(config));
            }

            // Generate extra features panel
            if(config.extraFeatures !== false) {
                panels.push(this.getExtraFeaturesPanel(config));
            }

            //this.__panels = panels;
            return panels;
        },
        getNewSearchPanel: function(config){
            var sb = this.instance.getSandbox();
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            var container = panel.getContainer();
            var locale = this.instance.getLocalization();

            panel.setTitle(locale.panels.newSearch.title);

            container.append(Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', this.instance, sb).getPanelContent(config));

            return {id:'newSearchPanel', panel:panel};
        },
        getExtraFeaturesPanel: function(config){
            var sb = this.instance.getSandbox();
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            var container = panel.getContainer();
            var locale = this.instance.getLocalization();

            panel.setTitle(locale.panels.extraFeatures.title);

            container.append(Oskari.clazz.create('Oskari.statistics.statsgrid.ExtraFeatures', this.instance, sb).getPanelContent(config));

            return {id:'extraFeaturesPanel', panel:panel};
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });