Oskari.clazz.define('Oskari.statistics.statsgrid.Legend', function(sandbox, locale) {
    this.sb = sandbox;
    this.locale = locale;
    this.log = Oskari.log('Oskari.statistics.statsgrid.Legend');
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.__templates = {
        error: _.template('<div class="legend-noactive">${ msg }</div>'),
        header: _.template('<div class="header"><div class="link">${ link }</div><div class="title">${ source }</div><div class="sourcename">${ label }</div></div>'),
        activeHeader: _.template('<div class="title">${label}</div>'),
        edit: jQuery('<div class="edit-legend"></div>')
    };
    this._element = jQuery('<div class="statsgrid-legend-container"> '+
        '<div class="active-header"></div>'+
        '<div class="classification"></div>'+
        '<div class="active-legend"></div>'+
    '</div>');
    this._bindToEvents();

    this.editClassification = Oskari.clazz.create('Oskari.statistics.statsgrid.EditClassification', sandbox, this.locale);
    this._renderState = {
        panels : {}
    };
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

        var me = this;
        var container = this._element;
        var accordion = this._accordion;
        // NOTE! detach classification before re-render to keep eventhandlers
        this.editClassification.getElement().detach();
        accordion.removeAllPanels();

        container.find('.legend-noactive').remove();
        container.children().empty();

        if ( el ) {
            // attach container to parent if provided, otherwise updates UI in the current parent
            el.append(container);
        }
        // render classification options
        me._createClassificationUI(classificationOpts, function(classificationUI) {
            container.append(classificationUI);

            var panelClassification = me._createAccordionPanel(me.locale('classify.editClassifyTitle'));
            panelClassification.setContent(classificationUI);
            // add panels to accordion
            accordion.addPanel(panelClassification);
            var mountPoint = container.find('.classification');
            // add accordion to the container
            accordion.insertTo( mountPoint );
            // notify that we are done (to start a repaint if requested in middle of rendering)
            me._renderDone();
        });
        // check if we have an indicator to use or just render "no data"
        var activeIndicator = this.service.getStateService().getActiveIndicator();
        if ( !activeIndicator ) {
            container.append(this.__templates.error({ msg : this.locale('legend.noActive') }));
            me._renderDone();
            return;
        }

        var classificationOpts = this.service.getStateService().getClassificationOpts(activeIndicator.hash);

        this._createLegend(activeIndicator, function(legendUI, classificationOpts) {
            var headerContainer = container.find('.active-header');
            var legendContainer = container.find('.active-legend');
            headerContainer.empty();
            legendContainer.empty();

            // create inidicator dropdown if we have more than one indicator
            if ( me.service.getStateService().getIndicators().length > 1 ) {
                var edit = me.__templates.edit.clone();
                var indicatorMenu = Oskari.clazz.create('Oskari.statistics.statsgrid.SelectedIndicatorsMenu', me.service);
                indicatorMenu.render( headerContainer );
                indicatorMenu.setWidth('94%');
                headerContainer.append(edit);
                me._createEditClassificationListener();
            } else {
                me._getLabels(activeIndicator, function (labels) {
                    var header = me.__templates.activeHeader({
                        label: labels.label
                    });
                    var edit = me.__templates.edit.clone();
                    headerContainer.empty();
                    headerContainer.append(header);
                    headerContainer.append(edit);
                    me._createEditClassificationListener();
                }); //_getLabels
            }
            if(!classificationOpts) {
                // didn't get classification options so not enough data to classify or other error
                container.append(legendUI);
                me._renderDone();
                return;
            }
            //legend
            legendContainer.html( legendUI );
        }); //_createLegend
    },

    /****** PRIVATE METHODS ******/
    /**
     * Adds functionality to edit classification button.
     */
    _createEditClassificationListener : function() {
        var me = this;
        this._element.find('.edit-legend').on('click', function (event) {
            // toggle accordion
            me._accordion.getPanels().forEach(function (panel) {
                panel.isOpen() ? panel.close() : panel.open();
            });
        });
    },
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
            me._element.find('.edit-legend').addClass('edit-active');
        });
        panel.on('close', function() {
            me._setPanelState(panel);
            me._element.find('.edit-legend').removeClass('edit-active');
        });
        panel.setTitle(title);
        panel.getHeader().remove();
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
    _getLabels: function (activeIndicator, callback ) {
        var sourceUILabel = this.locale('statsgrid.source');
        var stateService = this.service.getStateService();

        this.service.getUILabels(activeIndicator, function(labels) {
            var labels = {
                source : sourceUILabel + ' ' + (stateService.getIndicatorIndex(activeIndicator.hash) + 1),
                link : '',
                label : labels.full
            }
            callback(labels);
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
                callback(me.__templates.error({msg : locale('legend.noEnough') }));
                return;
            }
            var classificationOpts = stateService.getClassificationOpts(activeIndicator.hash);
            var classification = service.getClassificationService().getClassification(data, classificationOpts);

            if(!classification) {
                me.log.warn('Error getting indicator classification', data);
                callback(me.__templates.error({msg : locale('legend.noEnough') }));
                return;
            }
            if(classificationOpts.count !== classification.getGroups().length) {
                // classification count changed!! -> show error + re-render
                classificationOpts.count = classification.getGroups().length;
                callback(me.__templates.error({msg : locale('legend.noEnough') }));
                stateService.setClassification(activeIndicator.hash, classificationOpts);
                return;
            }
            var colors = service.getColorService().getColorsForClassification(classificationOpts, true);
            var legend = classification.createLegend(colors);

            if(!legend) {
                legend = '<div>'+locale('legend.cannotCreateLegend') +'</div>';
            }
            callback(legend, classificationOpts);
        });
    },
    _updateLegend: function () {
        var state = this.service.getStateService();
        var ind = state.getActiveIndicator();
        var legendElement = this._element.find('.active-legend');
        legendElement.empty();

        this._createLegend(ind.hash, function(legend) {
            legendElement.append(legend);
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
            me._updateLegend();
        });
    }
});