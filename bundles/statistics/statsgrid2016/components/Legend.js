Oskari.clazz.define('Oskari.statistics.statsgrid.Legend', function(instance) {
    this.instance = instance;
    this.sb = this.instance.getSandbox();
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.classificationService = this.sb.getService('Oskari.statistics.statsgrid.ClassificationService');
    this.colorService = this.sb.getService('Oskari.statistics.statsgrid.ColorService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.locale = this.instance.getLocalization();
    this.__bindToEvents();
    this.__templates = {
    	legendContainer: jQuery('<div class="statsgrid-legend-container"></div>'),
    	noActiveSelection: jQuery('<div class="legend-noactive">'+this.locale.legend.noActive+'</div>')
    };
    this.__legendElement = this.__templates.legendContainer.clone();
    this.log = Oskari.log('Oskari.statistics.statsgrid.Legend');
}, {
	getClassification: function(){
		var me = this;
		me.__legendElement.html(me.__templates.noActiveSelection.clone());
		me.renderActiveIndicator();
		return me.__legendElement;
	},
	__update: function(){},
	handleIndicatorRemoved: function(){
		var me = this;
		me.__legendElement.html(me.__templates.noActiveSelection.clone());
	},
	handleIndicatorChanged: function(datasrc, indicatorId, selections) {
		this.renderActiveIndicator();
	},
	renderActiveIndicator: function(){
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
            	var legend = classify.createLegend(colors, me.locale.statsgrid.source + ' ' + state.getIndicatorIndex(ind.hash) + ': ' + Oskari.getLocalized(indicator.name));
            	me.__legendElement.html(legend);
            });
        });
	},
    __bindToEvents : function() {
        var me = this;

        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            var ind = event.getCurrent();
            if(!ind) {
                // last indicator was removed -> no active indicators
                me.handleIndicatorRemoved();
            } else {
                // active indicator changed -> update map
                me.handleIndicatorChanged(ind.datasource, ind.indicator, ind.selections);
            }
        });

        this.service.on('StatsGrid.RegionsetChangedEvent', function (event) {
            this.handleRegionsetChanged(event.getRegionset());
        });


/*
         this.service.on('StatsGrid.IndicatorEvent', function(event) {
            if(event.isRemoved()) {
                me.handleIndicatorRemoved(event.getDatasource(), event.getIndicator(), event.getSelections());
            } else {
                me.handleIndicatorAdded(event.getDatasource(), event.getIndicator(), event.getSelections());
            }
        });*/
    }/*,
    handleIndicatorAdded: function(datasrc, indId, selections) {
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        var src = this.service.getDatasource(datasrc);
        log.info('Indicator added ', src, indId, selections);
        this.handleRegionsetChanged(this.getCurrentRegionset());
    },
    handleIndicatorRemoved: function(datasrc, indId, selections) {
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        var src = this.service.getDatasource(datasrc);
        log.info('Indicator removed', src, indId, selections);
        this.handleRegionsetChanged(this.getCurrentRegionset());
    }*/
});