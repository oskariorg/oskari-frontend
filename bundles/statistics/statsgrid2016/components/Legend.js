Oskari.clazz.define('Oskari.statistics.statsgrid.Legend', function(sandbox, locale) {
    this.sb = sandbox;
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.classificationService = this.sb.getService('Oskari.statistics.statsgrid.ClassificationService');
    this.locale = locale;
    this._bindToEvents();
    this.__templates = {
        legendContainer: jQuery('<div class="statsgrid-legend-container"></div>'),
        noActiveSelection: jQuery('<div class="legend-noactive">'+this.locale.legend.noActive+'</div>'),
        noEnoughData: jQuery('<div class="legend-noactive">'+this.locale.legend.noEnough+'</div>')
    };
    this.__legendElement = this.__templates.legendContainer.clone();
    this.log = Oskari.log('Oskari.statistics.statsgrid.Legend');
    this._panel = null;
    this._accordion = null;
    this._container = jQuery('<div class="accordion-theming"></div>');
    this._notHandleColorSelect = false;

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

                service.getSelectionsText(ind, me.locale.panels.newSearch, function(text){
                    var legend = classify.createLegend(colors, me.locale.statsgrid.source + ' ' + stateService.getIndicatorIndex(ind.hash) + ': ' + Oskari.getLocalized(indicator.name) + text);
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

                    setTimeout(function(){
                        me._refreshEditClassification();
                    }, 0);

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