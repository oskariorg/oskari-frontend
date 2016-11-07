Oskari.clazz.define('Oskari.statistics.statsgrid.Legend', function(instance) {
    this.instance = instance;
    this.sb = this.instance.getSandbox();
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.classificationService = this.sb.getService('Oskari.statistics.statsgrid.ClassificationService');
    this.colorService = this.sb.getService('Oskari.statistics.statsgrid.ColorService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.locale = this.instance.getLocalization();
    this._bindToEvents();
    this.__templates = {
    	legendContainer: jQuery('<div class="statsgrid-legend-container"></div>'),
    	noActiveSelection: jQuery('<div class="legend-noactive">'+this.locale.legend.noActive+'</div>'),
        noEnoughData: jQuery('<div class="legend-noactive">'+this.locale.legend.noEnough+'</div>')
    };
    this.__legendElement = this.__templates.legendContainer.clone();
    this.log = Oskari.log('Oskari.statistics.statsgrid.Legend');
}, {
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
            me._handleRegionsetChanged(event.getRegionset());
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

        service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
            if(err) {
                me.log.warn('Error getting indicator data', ind.datasource, ind.indicator, ind.selections, state.getRegionset());
                me.__legendElement.html(me.__templates.noEnoughData.clone());
                return;
            }
            var classify = service.getClassificationService().getClassification(data);
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

                service.getSelectionsText(ind, me.instance.getLocalization().panels.newSearch, function(text){
                    var legend = classify.createLegend(colors, me.locale.statsgrid.source + ' ' + state.getIndicatorIndex(ind.hash) + ': ' + Oskari.getLocalized(indicator.name) + text);
                    me.__legendElement.html(legend);
                });

            });
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