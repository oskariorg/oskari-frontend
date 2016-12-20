/**
 * @class Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (instance, config, locale, mapmodule, sandbox) {
        var me = this;
        me._locale = locale;
        me._config = config || {};
        me._mapmodule = mapmodule;
        me._sandbox = sandbox;
        me._instance = instance;
        me._messageDialog = null;
        me._clazz = 'Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin';
        me._defaultLocation = 'top right';
        me._index = 10;
        me._name = 'ClassificationToolPlugin';
        me._toolOpen = false;
        me._flyout = null;
        me.__sideTools = me._instance.__sideTools;
        me._element = null;
        me._templates = {
            classification: jQuery('<div class="statsgrid-legend-flyout-published"></div>')
        };

        me._publishedComponents = {
            panelClassification: null,
            editClassification: null
        };

        me._mobileDefs = {
            buttons:  {
                'mobile-coordinatetool': {
                    iconCls: 'mobile-xy',
                    tooltip: '',
                    show: true,
                    callback: function () {
                        me._toggleToolState();
                    },
                    sticky: true,
                    toggleChangeIcon: true
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me.log = Oskari.log('Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin');
    }, {

        /**
         * Toggle tool state.
         * @method @private _toggleToolState
         */
        _toggleToolState: function(){
           var me = this,
                el = me.getElement();

            if(me._toolOpen) {
                if(el) {
                    el.removeClass('active');
                }
                me._toolOpen = false;
                me._popup.close(true);
            } else {
                if(el) {
                    el.addClass('active');
                }
                me._toolOpen = true;
                me._showPopup();
            }
        },

        /**
         * Show popup.
         * @method @private _showPopup
         */
        _showPopup: function() {
            var me = this,
                //popupContent = me._templates.popupContent.clone(),
                isMobile = Oskari.util.isMobile(),
                popupService = me.getSandbox().getService('Oskari.userinterface.component.PopupService');

            me._popup = popupService.createPopup();
            me._popup.show(null, me.getElement());

        },

        /**
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         * @private @method _createControlElement
         *
         * @return {jQuery}
         */
        _createControlElement: function () {
            var me = this;

            var sb = me._sandbox;
            var locale = me._locale;
            var config = me._config;

            var isMobile = Oskari.util.isMobile();

            if(me._element === null) {
                me._element = me._templates.classification.clone();
                config.publishedClassification = true;
                jQuery('.statsgrid-legend-flyout-published').show();

                if(config.showLegend === false) {
                    jQuery('.statsgrid-legend-flyout-published').hide();
                    return;
                }

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

                    var flyout = me._instance.getFlyout();

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

                    service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err) {
                        if(err) {
                            me.log.warn('Error getting indicator metadata', ind.datasource, ind.indicator);
                            return;
                        }
                        flyout.getLegendFlyout(
                        {
                            callbacks: {
                                show: function() {
                                    var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
                                    var container = jQuery('<div class="accordion-published"></div>');

                                    // classification
                                    me._publishedComponents.panelClassification = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                                    me._publishedComponents.panelClassification.setVisible(true);
                                    me._publishedComponents.panelClassification.setTitle(locale.classify.editClassifyTitle);
                                    me._publishedComponents.editClassification = Oskari.clazz.create('Oskari.statistics.statsgrid.EditClassification', me._instance);
                                    var editClassificationElement = me._publishedComponents.editClassification.getElement();
                                    me._publishedComponents.panelClassification.setContent(editClassificationElement);
                                    accordion.addPanel(me._publishedComponents.panelClassification);
                                    if(!config.allowClassification) {
                                        me._publishedComponents.editClassification.setEnabled(false);
                                        me._publishedComponents.panelClassification.setTitle(locale.classify.classifyFieldsTitle);
                                    }

                                    var panelLegend = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                                    panelLegend.setTitle(locale.legend.title);

                                    var classification = me.__sideTools.legend.comp.getClassification();
                                    classification.find('.accordion-theming').remove();
                                    panelLegend.setContent(classification);
                                    panelLegend.setVisible(true);
                                    panelLegend.open();

                                    accordion.addPanel(panelLegend);
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
                            cls: 'statsgrid-legend-flyout-published',
                            container: me._element
                        }, me);

                        service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
                            var ind = event.getCurrent();
                            if(ind) {
                                me.updatePublishedFlyoutTitle(ind, config);
                            }
                        });

                        me.updatePublishedFlyoutTitle(state.getActiveIndicator(), config);
                    });
                });

            }
            return me._element;
        },

        /**
         * @method  @public updatePublishedFlyoutTitle update published map legend
         * @param  {Object} ind indicator
         * @param {Object} config config
         */
        updatePublishedFlyoutTitle: function (ind, config){
            var me = this;
            var sb = me.getSandbox();

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
                var selectionsText = '';

                if(config.grid !== true || config.showLegend !== false) {
                    var linkButton = '';
                    if(state.indicators.length>1) {
                        linkButton = '<div class="link">' + me._locale.statsgrid.source + ' ' + link.index + ' >></div>';
                    }
                    selectionsText = service.getSelectionsText(ind, me._locale.panels.newSearch, function(text){
                        me.__sideTools.legend.flyout.setTitle('<div class="header">' + me._locale.statsgrid.source + ' ' + state.getIndicatorIndex(ind.hash) + '</div>' +
                            linkButton +
                            '<div class="sourcename">' + Oskari.getLocalized(indicator.name) + text + '</div>');
                    });
                }

                me.__sideTools.legend.flyout.getTitle().find('.link').unbind('click');
                me.__sideTools.legend.flyout.getTitle().find('.link').bind('click', function(){
                    link.handler();
                });

            });

        },

        setFlyout: function(flyout){
            this._flyout = flyout;
        },
        teardownUI : function() {
            //remove old element
            var me = this;

            this.removeFromPluginContainer(me._element, true, true);
            if (this._popup) {
                this._popup.close(true);
            }
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function(mapInMobileMode, forced) {
            var me = this;
            var sandbox = me.getSandbox();
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if(!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            if (!toolbarNotReady && mapInMobileMode) {
                // create mobile
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);

            }

            me._element = me._createControlElement();
            this.addToPluginContainer(me._element);
            me.refresh();
        },

        /**
         * Updates the given coordinates to the UI
         * @method @public refresh
         *
         * @param {Object} data contains lat/lon information to show on UI
         */
        refresh: function (data) {
            var me = this,
                conf = me._config;


            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            } else {
                var toolStyle = me.getToolStyleFromMapModule();
                me.changeToolStyle(toolStyle, me.getElement());
            }

            return data;
        },

        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function(){
            return this._element;
        },

        /**
         * Create event handlers.
         * @method @private _createEventHandlers
         */
        _createEventHandlers: function () {
            return {};
        },

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el || el.length === 0) {
                return;
            }

            var styleClass = 'toolstyle-' + (style ? style : 'default');

            var classList = el.attr('class').split(/\s+/);
            for(var c=0;c<classList.length;c++){
                var className = classList[c];
                if(className.indexOf('toolstyle-') > -1){
                    el.removeClass(className);
                }
            }
            el.addClass(styleClass);
        },
        /**
         * @method  @private addEditHandlers add edit handlers again
         */
        _addEditHandlers: function(){
            var me = this;
            if(!me.__legendElement || !me._panel) {
                return;
            }

            me.__legendElement.find('.accordion_panel .header').bind('click', function(event){
                var el = jQuery(this).parent();

                if(el.hasClass('open')) {
                    me._panel.close();
                } else {
                    me._panel.open();
                }
            });
        },
        setEnabled: function(enabled) {
            var me = this;
            if(me._publishedComponents.editClassification) {
                me._publishedComponents.editClassification.setEnabled(enabled);
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });
