/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.view.DiagramVisualizer', function(instance) {
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization();
    this.isEmbedded = instance.isEmbedded();
    this.instance = instance;
    this.container = null;
    this.service = instance.statsService;
    this._isOpen = false;
    this._indicatorSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.SelectedIndicatorsMenu', this.service);
    this._chartInstance = Oskari.clazz.create('Oskari.userinterface.component.Chart');
    this._chartElement = null;
    this.events();
    this._renderState = {
        inProgress: false,
        repaint: false
    };
}, {
    _template: {
        container: jQuery('<div class="oskari-datacharts"><div class="chart-controls"></div></div>')
    },
    setElement: function(el) {
        this.container = el;
    },
    getElement: function() {
        return this.container;
    },
    getIndicator: function() {
        return this.service.getStateService().getActiveIndicator();
    },
    hasIndicators: function() {
        return !!this.service.getStateService().getIndicators().length;
    },
    createUi: function() {
        if (this.getElement()) {
            // already created ui
            return;
        }
        var el = this._template.container.clone();
        this.setElement(el);
        this.updateUI();
    },
    updateUI: function() {
        var me = this;
        var el = this.getElement();
        if (!el) {
            // ui not yet created so no need to update it
            return;
        }
        if(this._renderState.inProgress) {
            // handle render being called multiple times in quick succession
            // previous render needs to end before repaint since we are doing async stuff
            this._renderState.repaint = true;
            // need to call this._renderDone(); to trigger repaint after render done
            return;
        }
        this._renderState.inProgress = true;
        if (!this.hasIndicators()) {
            this.clearChart();
            el.html(this.loc.statsgrid.noResults);
            return;
        }
        // this.loc.datacharts.indicatorVar as label?
        this._indicatorSelector.render(el.find('.chart-controls'));
        // this.loc.datacharts.descColor
        // Oskari.clazz.define('Oskari.statistics.statsgrid.SelectedIndicatorsMenu');
        this.getIndicatorData(this.getIndicator(), function(data) {
            if(!data) {
                me._renderDone();
                return;
            }
            if (!me._chartElement) {
                me._chartElement = me.createBarCharts(data);
                el.append(me._chartElement);
            } else {
                me.redrawCharts(data);
            }
            me._renderDone();
        });
    },
    /****** PRIVATE METHODS ******/
    /**
     * Triggers a new render when needed (if render was called before previous was finished)
     */
    _renderDone : function() {
        var state = this._renderState;
        this._renderState = {};
        if(state.repaint) {
            this.updateUI();
        }
    },
    getChartInstance: function() {
        return this._chartInstance;
    },
    clearChart: function() {
        var chart = this.getChartInstance();
        if (chart) {
            chart.clear();
        }
    },
    getIndicatorData: function(indicator, callback) {
        if (!indicator) {
            callback();
            return;
        }
        this.service.getCurrentDataset(function(err, response) {
            if(err) {
                callback();
                return;
            }
            var indicatorData = [];
            response.data.forEach(function(dataItem) {
                indicatorData.push({
                    name: dataItem.name,
                    value: dataItem.values[indicator.hash]
                });
            });
            callback(indicatorData);
        });
    },
    events: function() {
        var me = this;
        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            if(event.getCurrent()) {
                me.updateUI();
            }
        });
        this.service.on('StatsGrid.IndicatorEvent', function(event) {
            if (event.isRemoved() && !me.hasIndicators()) {
                // last indicator removed -> update ui/cleanup
                me.updateUI();
            }
        });
        this.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
            me.updateUI();
        });
    },
    /**
     * @method getColorScale
     * gets the color scale of the mapselection
     * @return colors[] containing colors
     */
    getColorScale: function() {
        var stateService = this.service.getStateService();
        var activeIndicator = stateService.getActiveIndicator();
        var classificationOpts = stateService.getClassificationOpts(activeIndicator.hash);
        var colors = this.service.getColorService().getColorsForClassification(classificationOpts, true);
        return colors;
    },
    /**
     * @method redrawCharts
     * redraws the charts
     */
    redrawCharts: function(data) {
        this.getChartInstance().redraw(data, {
            colors: this.getColorScale()
        });
    },
    /**
     * @method createBarCharts
     * Creates the barchart component if chart is not initialized
     */
    createBarCharts: function(data) {
        var me = this;
        if (data === undefined || data.length === 0) {
            Oskari.log("statsgrid.DiagramVisualizer").debug("no indicator data");
            return null;
        }

        if (!this.getChartInstance().chartIsInitialized()) {
            var barchart = this.getChartInstance().createBarChart(data, {
                colors: me.getColorScale()
            });
            var el = jQuery(barchart);
            el.css({
                "width": "100%"
            });
            el.attr('id', 'graphic');
            return el;
        }
    },
    isVisible: function() {
        return this._isOpen;
    }
}, {
    extend: ['Oskari.userinterface.extension.DefaultView']
});