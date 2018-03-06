/*
 * @class Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayerModelBuilder
 * JSON-parsing for analysis layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayerModelBuilder', function(sandbox) {
	this.localization = Oskari.getLocalization("MapAnalysis");
    this.sandbox = sandbox;
    this.wfsBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',sandbox);
}, {
    /**
     * @private @method _checkIfAggregateValuesAreAvailable
     * function gives value to addLinkToAggregateValues (true/false)
     *
     * @return {Boolean}
     */
    _checkIfAggregateValuesAreAvailable: function() {
        this.service = this.sandbox.getService(
            'Oskari.analysis.bundle.analyse.service.AnalyseService'
        );
        if (!this.service) {
            return false;
        }
        return true;
    },
	/**
	 * parses any additional fields to model
	 * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer partially populated layer
	 * @param {Object} mapLayerJson JSON presentation of the layer
	 * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
	 */
	parseLayerData : function(layer, mapLayerJson, maplayerService) {
        var me = this;
        if (layer.isFilterSupported()) {
            var filterdataTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            filterdataTool.setName("filterdata");
            filterdataTool.setIconCls('show-filter-tool');
            filterdataTool.setTooltip(me.localization.filterTooltip);
            filterdataTool.setCallback(function() {
                var isAggregateValueAvailable = me._checkIfAggregateValuesAreAvailable();
                var fixedOptions = {
                    bboxSelection: true,
                    clickedFeaturesSelection: false,
                    addLinkToAggregateValues: isAggregateValueAvailable
                };

                var filterDialog = Oskari.clazz.create('Oskari.userinterface.component.FilterDialog', fixedOptions);
                filterDialog.setUpdateButtonHandler(function(filters) {
                    // throw event to new wfs
                    var evt = me.sandbox.getEventBuilder('WFSSetPropertyFilter')(filters, layer.getId());
                    me.sandbox.notifyAll(evt);
                });

                if (me.service) {
                    var aggregateAnalyseFilter = Oskari.clazz.create('Oskari.analysis.bundle.analyse.aggregateAnalyseFilter', null, filterDialog);

                    filterDialog.createFilterDialog(layer, null, function() {
                        me.service._returnAnalysisOfTypeAggregate(_.bind(aggregateAnalyseFilter.addAggregateFilterFunctionality, me));
                    });
                } else {
                    filterDialog.createFilterDialog(layer);
                }
                filterDialog.setCloseButtonHandler(_.bind(function() {
                    filterDialog.popup.dialog.off('click', '.add-link');
                }));
            });
            layer.addTool(filterdataTool);
        }
        var loclayer = me.localization.layer;

        // call parent parseLayerData
        this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
		if(mapLayerJson.fields){
			layer.setFields(mapLayerJson.fields);
		}
		if(mapLayerJson.locales){
            layer.setLocales(mapLayerJson.locales);
        }
		if(mapLayerJson.name){
			layer.setName(mapLayerJson.name);
		}
		if (mapLayerJson.wpsName) {
			layer.setWpsName(mapLayerJson.wpsName);
		}
		if (mapLayerJson.wpsUrl) {
			layer.setWpsUrl(mapLayerJson.wpsUrl);
		}
		if (mapLayerJson.wpsLayerId) {
			layer.setWpsLayerId(mapLayerJson.wpsLayerId);
		}
		if (mapLayerJson.wps_params) {
			layer.setWpsLayerParams(mapLayerJson.wps_params);
		}
        if (mapLayerJson.override_sld) {
            layer.setOverrideSld(mapLayerJson.override_sld);
        }
		if (loclayer.organization) {
		    layer.setOrganizationName(loclayer.organization);
		}
		if (loclayer.inspire) {
            layer.setGroups([{
                id:layer.getId(),
                name:loclayer.inspire
            }]);
        }
	}
});
