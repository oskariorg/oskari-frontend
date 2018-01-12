/*
 * @class Oskari.mapframework.bundle.mapwfs.domain.WfsLayerModelBuilder
 * JSON-parsing for wfs layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',

    function(sandbox) {
        this.localization = Oskari.getLocalization('MapWfs2');
        this.sandbox = sandbox;
        this.service = null;
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
         * @param {Oskari.mapframework.domain.WfsLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function(layer, mapLayerJson, maplayerService) {
            var me = this;

            if (layer.isLayerOfType("WFS")) {
                var locOwnStyle = me.localization['own-style'];
                var toolOwnStyle = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
                toolOwnStyle.setName("ownStyle");
                toolOwnStyle.setTitle(locOwnStyle);
                toolOwnStyle.setIconCls('show-own-style-tool');
                toolOwnStyle.setTooltip(locOwnStyle);
                toolOwnStyle.setCallback(function() {
                    me.sandbox.postRequestByName('ShowOwnStyleRequest', [layer.getId()]);
                });
                layer.addTool(toolOwnStyle);
            }

            if (layer.isLayerOfType("WFS") || layer.isLayerOfType("ANALYSIS")) {
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
                        var aggregateAnalyseFilter = Oskari.clazz.create('Oskari.analysis.bundle.analyse.aggregateAnalyseFilter', null, filterDialog); // todo loc

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

            // create a default style
            var locDefaultStyle = this.localization['default-style'],
                defaultStyle = Oskari.clazz.create('Oskari.mapframework.domain.Style'),
                i;
            defaultStyle.setName("default");
            defaultStyle.setTitle(locDefaultStyle);
            defaultStyle.setLegend("");

            // check if default style comes and give localization for it if found
            if (mapLayerJson.styles && mapLayerJson.styles.length > 0) {
                for (i = 0; i < mapLayerJson.styles.length; i++) {
                    if (mapLayerJson.styles[i].name === "default") {
                        mapLayerJson.styles[i].title = locDefaultStyle;
                        break;
                    }
                }
            }

            // default style for WFS is given as last parameter
            maplayerService.populateStyles(layer, mapLayerJson, defaultStyle);

            //Set current Style
            if (mapLayerJson.style) {
                layer.selectStyle(mapLayerJson.style);
            }

            // Wps Params
            layer.setWpsLayerParams(mapLayerJson.wps_params);

            // WMS link layer id for wfs rendering option
            if (mapLayerJson.WMSLayerId) {
                layer.setWMSLayerId(mapLayerJson.WMSLayerId);
            }

        }
    });