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
    this._renderState = {
        panels : {}
    };
    // initialize with legend panel open
    this._renderState.panels[this.locale.legend.title] = true;
    this._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    // some components need to know when rendering is completed.
    Oskari.makeObservable(this);
}, {
    /**
     * Enables/disables the classification editor form
     * @param  {Boolean} enabled true to enable, false to disable
     */
    allowClassification : function(enabled) {
        this.editClassification.setEnabled(enabled);
    },
    /**
     * Try to open the accordion panel holding the color <> number range UI
     */
    openLegendPanel : function() {
        var panels = this._accordion.getPanels();
        var legendTitle = this.locale.legend.title;
        panels.forEach(function(panel) {
            if(panel.getTitle() === legendTitle) {
                panel.open();
            }
        });
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
            if(!header) {
                me._renderDone();
                return;
            }
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
                var panelLegend = me._createAccordionPanel(me.locale.legend.title);

                panelLegend.setContent(legendUI);

                // render classification options
                me._createClassificationUI(classificationOpts, function(classificationUI) {

                    var panelClassification = me._createAccordionPanel(me.locale.classify.editClassifyTitle);
                    panelClassification.setContent(classificationUI);
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
     * Triggers a new render when needed (if render was called before previous was finished)
     */
    _renderDone : function() {
        var state = this._renderState;
        this._renderState = {};
        this._restorePanelState(this._accordion, state.panels);
        if(state.repaint) {
            this.render(state.el);
        } else {
            // trigger an event in case something needs to know that we just completed rendering
            this.trigger('rendered');
        }
    },
    /**
     * Restores legend/classification panels to given state (open/closed)
     * @param  {Oskari.userinterface.component.Accordion} accordion
     * @param  {Object} state     with keys as panel titles and value as boolean (true == open, false == closed)
     */
    _restorePanelState :function(accordion, state) {
        if(!accordion || !state) {
            return;
        }
        var panels = accordion.getPanels();
        panels.forEach(function(panel) {
            var panelState = state[panel.getTitle()];
            if(typeof panelState !== 'boolean') {
                return;
            }
            if(panelState) {
                panel.open();
            } else {
                panel.close();
            }
        });
    },
    /**
     * Creates an accordion panel for legend and classification edit with eventlisteners on open/close
     * @param  {String} title UI label
     * @return {Oskari.userinterface.component.AccordionPanel} panel without content
     */
    _createAccordionPanel : function(title) {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.on('open', function() {
            me._setPanelState(panel);
        });
        panel.on('close', function() {
            me._setPanelState(panel);
        });
        panel.setTitle(title);
        return panel;
    },
    /**
     * Used to track accordion panel states (open/close)
     * @param {Oskari.userinterface.component.AccordionPanel} panel panel that switched state
     */
    _setPanelState :function(panel) {
        var panels = this._accordion.getPanels();
        if(!this._renderState.panels) {
            this._renderState.panels = {};
        }
        this._renderState.panels[panel.getTitle()] = panel.isOpen();
    },
    /**
     * Creates the header part for the legend UI
     * @param  {Object}   activeIndicator identifies the current active indicator
     * @param  {Function} callback        function to call with header element as param or undefined for error
     */
    _createHeader: function (activeIndicator, callback) {
        var service = this.service;
        if(!service) {
            // not available yet
            callback();
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
    /**
     * Creates the color <> number range UI
     * @param  {Object}   activeIndicator identifies the current active indicator
     * @param  {Function} callback        function to call with legend element as param or undefined for error
     */
    _createLegend : function(activeIndicator, callback) {
        if(!this.service) {
            callback();
            return;
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

            if(!legend) {
                legend = '<div>'+locale.legend.cannotCreateLegend+'</div>';
            }
            callback(legend, classificationOpts);
        });
    },

    /**
     * Creates the classification editor UI
     * @param  {Object}   options  values for the classification form to use as initial values
     * @param  {Function} callback function to call with editpr element as param or undefined for error
     */
    _createClassificationUI : function(options, callback) {
        var me = this;
        var element = this.editClassification.getElement();
        this.editClassification.setValues(options);
        callback(element);
    },
    /**
     * Listen to events that require re-rendering the UI
     */
    _bindToEvents : function() {
        var me = this;

        me.service.on('StatsGrid.IndicatorEvent', function(event) {
            // if indicator is removed/added - recalculate the source 1/2 etc links
            me.render();
        });

        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            // Always show the active indicator - also handles "no indicator selected"
            me.render();
        });

        me.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
            // need to update the legend as data changes when regionset changes
            me.render();
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function(event) {
            // doesn't need full update, but we need to update the legend part when classification changes
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
    }
});