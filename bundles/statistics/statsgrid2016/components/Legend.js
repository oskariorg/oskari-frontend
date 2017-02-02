Oskari.clazz.define('Oskari.statistics.statsgrid.Legend', function(sandbox, locale) {
    this.sb = sandbox;
    this.locale = locale;
    this.log = Oskari.log('Oskari.statistics.statsgrid.Legend');
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.classificationService = this.sb.getService('Oskari.statistics.statsgrid.ClassificationService');
    this._bindToEvents();
    this.__templates = {
        main: jQuery('<div class="statsgrid-legend-container"></div>'),
        noActiveSelection: jQuery('<div class="legend-noactive">'+this.locale.legend.noActive+'</div>'),
        noEnoughData: jQuery('<div class="legend-noactive">'+this.locale.legend.noEnough+'</div>')
    };
    this.__legendElement = this.__templates.main.clone();
    this.__element = this.__templates.main.clone();
    this._panel = null;
    this._accordion = null;
    this._container = jQuery('<div class="accordion-theming"></div>');

    this.editClassification = Oskari.clazz.create('Oskari.statistics.statsgrid.EditClassification', this.sb, this.locale);
    this.editClassificationElement = this.editClassification.getElement();
}, {
    allowClassification : function(enabled) {
        this.editClassification.setEnabled(enabled);
    },
    /****** PRIVATE METHODS ******/

    /**
     * @method  @private _bindToEvents bind events
     */
    _bindToEvents : function() {
        var me = this;

        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            var ind = event.getCurrent();
            if(!ind) {
                // last indicator was removed -> no active indicators
                me._handleIndicatorRemoved();
            } else {
                // active indicator changed -> update map
                me._handleIndicatorChanged(ind.datasource, ind.indicator, ind.selections);
            }
        });

        me.service.on('StatsGrid.RegionsetChangedEvent', function (event) {
            me._renderActiveIndicator();
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function(event) {
            me._renderActiveIndicator();
            setTimeout(function(){
                me._addEditHandlers();
            }, 200);
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function(event) {
            me._renderActiveIndicator();
        });
    },

    /**
     * @method  @private _handleIndicatorRemoved handle indicator removed
     */
    _handleIndicatorRemoved: function(){
        var me = this;
        me.__legendElement.html(me.__templates.noActiveSelection.clone());
    },

    /**
     * @method  @private _handleIndicatorChanged handle active indicator changed
     * @return {[type]} [description]
     */
    _handleIndicatorChanged: function() {
        this._renderActiveIndicator();
    },

    getActiveIndicator : function() {
        if(!this.service) {
            return false;
        }

        return this.service.getStateService().getActiveIndicator();
    },
    // Header
    //   Source nn
    //   Indicator name + params
    //   (Next source link)
    // Accordion (or note about "insufficient data")
    //   Classification panel
    //   Legend
    //
    // Alternatively note about no indicator selected
    render : function(el) {
        this.__element.empty();
        var activeIndicator = this.getActiveIndicator();
        if(!activeIndicator) {
            this.__element.append(this.__templates.noActiveSelection.clone());
            return;
        }
        this._renderHeader(activeIndicator);
        // check if we have data to classify
        // if no:
        if(true) {
            this.__element.append(this.__templates.noEnoughData.clone());
            return;
        }
        // if yes:
        this._renderClassification();
        this._renderLegend(activeIndicator);

    },
        createHeader: function (activeIndicator, callback) {
            var sb = this.getSandbox();
            var locale = this.locale;

            var service = this.service;
            if(!service) {
                // not available yet
                return;
            }
            var stateService = this.service.getStateService();

            this.service.getIndicatorMetadata(activeIndicator.datasource, activeIndicator.indicator, function(err, indicator) {

                var getSourceLink = function(currentHash){
                    var indicators = stateService.getIndicators();
                    var currentIndex = stateService.getIndicatorIndex(currentHash);
                    var nextIndicatorIndex = currentIndex + 1;
                    if(nextIndicatorIndex === indicators.length) {
                        nextIndicatorIndex = 0;
                    }
                    return {
                        indexForUI: currentIndex + 1,
                        handler: function(){
                            var i = indicators[nextIndicatorIndex];
                            stateService.setActiveIndicator(i.hash);
                        }
                    };
                };

                var link = getSourceLink(ind.hash);

                var linkButton = '';
                if(stateService.indicators.length > 1) {
                    linkButton = jQuery('<div class="link">' + me._locale.statsgrid.source + ' ' + link.indexForUI + ' >></div>');
                    linkButton.click(function(){
                        link.handler();
                    });
                }
                service.getUILabels(ind, function(labels){
                    me.__sideTools.legend.flyout.setTitle('<div class="header">' + me._locale.statsgrid.source + ' ' + state.getIndicatorIndex(ind.hash) + '</div>' +
                        linkButton +
                        '<div class="sourcename">' + labels.full + '</div>');
                });
/*
                me.__sideTools.legend.flyout.getTitle().find('.link').unbind('click');
                me.__sideTools.legend.flyout.getTitle().find('.link').bind('click', function(){
                    link.handler();
                });
*/
            });

        },
    _renderBody : function(activeIndicator) {
        if(!this.service) {
            return false;
        }
        var me = this;
        var stateService = this.service.getStateService();
        var currentRegionset = stateService.getRegionset();

        this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, currentRegionset, function(err, data) {
            if(err) {
                me.log.warn('Error getting indicator data', activeIndicator, currentRegionset);
                me.__legendElement.html(me.__templates.noEnoughData.clone());
                return;
            }
        });
    },
    /**
     * @method  @private _renderActiveIndicator render active indicator changed
     */
    _renderActiveIndicator: function(){
        var me = this;
        var service = me.service;
        if(!service) {
            // not available yet
            return;
        }

        var state = service.getStateService();
        var ind = state.getActiveIndicator();
        if(!ind) {
            return;
        }

        me.__legendElement.empty();

        service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
            if(err) {
                me.log.warn('Error getting indicator data', ind.datasource, ind.indicator, ind.selections, state.getRegionset());
                me.__legendElement.html(me.__templates.noEnoughData.clone());
                return;
            }
            var classification = state.getClassification(ind.hash);
            var classify = service.getClassificationService().getClassification(data, classification);

            if(!classify) {
                me.log.warn('Error getting indicator classification', data);
                me.__legendElement.html(me.__templates.noEnoughData.clone());
                return;
            }

            // format regions to groups for url
            var regiongroups = classify.getGroups();
            var classes = [];
            regiongroups.forEach(function(group) {
                // make each group a string separated with comma
                classes.push(group.join());
            });

            var colorsWithoutHash = me.service.getColorService().getColors(classification.type, classification.count, classification.reverseColors)[classification.colorIndex];

            var colors = [];
            colorsWithoutHash.forEach(function(color) {
                colors.push('#' + color);
            });

            var stateService = service.getStateService();

            service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {
                if(err) {
                    me.log.warn('Error getting indicator metadata', ind.datasource, ind.indicator);
                    return;
                }

                service.getUILabels(ind, function(labels){
                    var legend = classify.createLegend(colors, me.locale.statsgrid.source + ' ' + stateService.getIndicatorIndex(ind.hash) + ': ' + labels.full);
                    var jQueryLegend = jQuery(legend);

                    var isAccordion = true;

                    if(!me._accordion) {
                        me._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');

                        me._panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                        me._panel.setVisible(true);
                        me._panel.setTitle(me.locale.classify.editClassifyTitle);
                        me._panel.setContent(me.editClassificationElement);
                        me._accordion.addPanel(me._panel);
                        me._accordion.insertTo(me._container);
                        isAccordion = false;
                    }

                    me._container.insertAfter(jQueryLegend.find('.geostats-legend-title'));

                    me.__legendElement.append(jQueryLegend);

                    // the accordion header clicks not handlet correctly. Thats why we add custom click handler.
                    if(isAccordion) {
                        setTimeout(function(){
                            me._addEditHandlers();
                        }, 0);
                    }
/*
                    setTimeout(function(){
                        me._refreshEditClassification();
                    }, 0);
*/
                });

            });
        });
    },

    /**
     * @method  @private _changeColors Change colors
     * @param  {Object} classification classification
     */
    _changeColors: function(classification){
        var me = this;
        me.editClassification.changeColors(classification);
    },

    /**
     * @method  @private _refreshEditClassification refresh edit classification
     */
    _refreshEditClassification: function(){
        var me = this;
        if(!me.__legendElement || !me._panel) {
            return;
        }

        me.editClassification.refresh();
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

    /****** PUBLIC METHODS ******/

    /**
     * @method  @public getClassification get classification element
     * @return {Object} jQuery element of classification
     */
    getClassification: function(){
        var me = this;
        me.__legendElement.html(me.__templates.noActiveSelection.clone());
        me._renderActiveIndicator();
        return me.__legendElement;
    }

});