Oskari.clazz.define('Oskari.statistics.statsgrid.Legend', function(sandbox, locale) {
    this.sb = sandbox;
    this.locale = locale;
    this.log = Oskari.log('Oskari.statistics.statsgrid.Legend');
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.__templates = {
        error: _.template('<div class="legend-noactive">${ msg }</div>'),
        header: _.template('<div class="header"><div class="link">${ link }</div><div class="title">${ source }</div><div class="sourcename">${ label }</div></div>')
    };
    this.__element = jQuery('<div class="statsgrid-legend-container"></div>');
    this._bindToEvents();

    this.editClassification = Oskari.clazz.create('Oskari.statistics.statsgrid.EditClassification', sandbox, locale);
    this._renderState = {};
    this._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
}, {
    allowClassification : function(enabled) {
        this.editClassification.setEnabled(enabled);
    },
    // Header
    //   Source nn
    //   Indicator name + params
    //   (Link to change source - only shown if we have more than one indicator)
    // Accordion (or note about "insufficient data")
    //   Classification panel
    //   Legend
    //
    // Alternatively note about no indicator selected
    render : function(el) {
        if(this._renderState.inProgress) {
            // handle render being called multiple times in quick succession
            // previous render needs to end before repaint since we are doing async stuff
            this._renderState.repaint = true;
            this._renderState.el = el;
            // need to call this._renderDone(); to trigger repaint after render done
            return;
        }
        this._renderState.inProgress = true;
        // start rendering
        var me = this;
        var container = this.__element;
        var accordion = this._accordion;
        // cleanup previous UI
        // NOTE! detach classification before re-render to keep eventhandlers
        this.editClassification.getElement().detach();
        accordion.removeAllPanels();
        container.empty();
        if(el) {
            // attach container to parent if provided, otherwise updates UI in the current parent
            el.append(container);
        }
        // check if we have an indicator to use or just render "no data"
        var activeIndicator = this.service.getStateService().getActiveIndicator();
        if(!activeIndicator) {
            container.append(this.__templates.error({msg : this.locale.legend.noActive}));
            me._renderDone();
            return;
        }
        // Start creating the actual UI
        this._createHeader(activeIndicator, function(header) {
            // append header
            container.append(header);
            // start creating legend
            me._createLegend(activeIndicator, function(legendUI, classificationOpts) {
                if(!classificationOpts) {
                    // didn't get classification options so not enough data to classify or other error
                    container.append(legendUI);
                    me._renderDone();
                    return;
                }
                // we have a legend and should display options in accordion
                var panelLegend = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                panelLegend.setTitle(me.locale.legend.title);

                panelLegend.setContent(legendUI);
                panelLegend.open();

                // render classification options
                me._createClassificationUI(classificationOpts, function(classificationUI) {

                    var panelClassification = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                    panelClassification.setTitle(me.locale.classify.editClassifyTitle);
                    panelClassification.setContent(classificationUI);
                    panelClassification.open();
                    // add panels to accordion
                    accordion.addPanel(panelClassification);
                    accordion.addPanel(panelLegend);
                    // add accordion to the container
                    accordion.insertTo(container);
                    // notify that we are done (to start a repaint if requested in middle of rendering)
                    me._renderDone();
                });
            });
        });
    },
    /****** PRIVATE METHODS ******/

    /**
     * @method  @private _bindToEvents bind events
     */
    _bindToEvents : function() {
        var me = this;

        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            me.render();
        });

        me.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
            me.render();
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function(event) {
            // update legendpanel in accordion if available
            var accordion = me._accordion;
            var state = me.service.getStateService();
            var ind = state.getActiveIndicator();
            // update legend in place instead of full render
            accordion.panels.forEach(function(panel) {
                if(!panel.getContainer().find('.geostats-legend').length) {
                    return;
                }
                // found panel with legend - update content with new legend
                me._createLegend(ind.hash, function(legend) {
                    panel.setContent(legend);
                });
            });
        });
    },

    /**
     * Triggers a new render when needed (render was called before previous was ready)
     */
    _renderDone : function() {
        var state = this._renderState;
        this._renderState = {};
        if(state.repaint) {
            this.render(state.el);
        }
    },
    _createHeader: function (activeIndicator, callback) {
        var service = this.service;
        if(!service) {
            // not available yet
            return;
        }
        var sb = this.sb;
        var headerTemplate = this.__templates.header;
        var sourceUILabel = this.locale.statsgrid.source;
        var stateService = this.service.getStateService();
        var indicators = stateService.getIndicators();

        var getSourceLink = function(currentHash){
            var currentIndex = stateService.getIndicatorIndex(currentHash);
            var nextIndicatorIndex = currentIndex + 1;
            if(nextIndicatorIndex === indicators.length) {
                nextIndicatorIndex = 0;
            }
            return {
                indexForUI: nextIndicatorIndex + 1,
                handler: function() {
                    var i = indicators[nextIndicatorIndex];
                    stateService.setActiveIndicator(i.hash);
                }
            };
        };

        service.getUILabels(activeIndicator, function(labels) {
            var tplParams = {
                source : sourceUILabel + ' ' + (stateService.getIndicatorIndex(activeIndicator.hash) + 1),
                link : '',
                label : labels.full
            };
            if(indicators.length < 2) {
                // no need to setup link, remove it instead
                var noLinksHeader = jQuery(headerTemplate(tplParams));
                noLinksHeader.find('.link').remove();
                callback(noLinksHeader);
                return;
            }

            var link = getSourceLink(activeIndicator.hash);
            tplParams.link = sourceUILabel + ' ' + link.indexForUI  + ' >>';
            var head = jQuery(headerTemplate(tplParams));
            var indicatorChangedLink = head.find('.link');
            indicatorChangedLink.click(function(){
                link.handler();
            });
            callback(head);
        });
    },
    _createLegend : function(activeIndicator, callback) {
        if(!this.service) {
            return false;
        }
        var me = this;
        var service = this.service;
        var stateService = this.service.getStateService();
        var currentRegionset = stateService.getRegionset();
        var locale = this.locale;

        this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, currentRegionset, function(err, data) {
            if(err) {
                me.log.warn('Error getting indicator data', activeIndicator, currentRegionset);
                callback(me.__templates.error({msg : locale.legend.noEnough}));
                return;
            }
            var classificationOpts = stateService.getClassificationOpts(activeIndicator.hash);
            var classification = service.getClassificationService().getClassification(data, classificationOpts);

            if(!classification) {
                me.log.warn('Error getting indicator classification', data);
                callback(me.__templates.error({msg : locale.legend.noEnough}));
                return;
            }
            if(classificationOpts.count !== classification.getGroups().length) {
                // classification count changed!! -> show error + re-render
                classificationOpts.count = classification.getGroups().length;
                callback(me.__templates.error({msg : locale.legend.noEnough}));
                stateService.setClassification(activeIndicator.hash, classificationOpts);
                return;
            }
            var colors = service.getColorService().getColorsForClassification(classificationOpts, true);
            var legend = classification.createLegend(colors);
            callback(legend, classificationOpts);
        });
    },
    _createClassificationUI : function(options, callback) {
        var me = this;
        var element = this.editClassification.getElement();
        this.editClassification.setValues(options);
        callback(element);
    }
});