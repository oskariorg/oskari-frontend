/**
 * @class Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
    }, {
        __name : 'StatsLayerPlugin',
        _clazz : 'Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin',
        layertype : 'statslayer',

        getLayerTypeSelector: function () {
            return 'STATS';
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            var mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (!mapLayerService) {
              return;
            }
            // register domain builder
            mapLayerService.registerLayerModel(this.layertype,
                'Oskari.mapframework.bundle.mapstats.domain.StatsLayer');

            var layerModelBuilder = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder',
                this.getSandbox()
            );
            mapLayerService.registerLayerModelBuilder(this.layertype, layerModelBuilder);
        },
        getService : function() {
            // references to visualization from this
            this.service = this.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
            return this.service;
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol.
         */
        _startPluginImpl: function () {
             this.ajaxUrl = this.getSandbox().getAjaxUrl('GetStatsTile');
        },
        _createPluginEventHandlers: function () {
            return {
                'StatsGrid.RegionsetChangedEvent' : function (event) {
                    this.handleRegionsetChanged(event.getRegionset());
                },
                'StatsGrid.IndicatorEvent' : function (event) {
                    if(event.isRemoved()) {
                        //this.handleIndicatorRemoved(event.getDatasource(), event.getIndicator(), event.getSelections());
                    } else {
                        this.handleIndicatorAdded(event.getDatasource(), event.getIndicator(), event.getSelections());
                    }
                }
            };
        },
        handleRegionsetChanged: function(newSetId) {
            // 1) add new layer to map or bring existing layer on top
            // 2) remove other statslayers from map
            // 3) render the new layer with active indicator
            var me = this;
            var sb = this.getSandbox();
            var layers = sb.findAllSelectedMapLayers();
            var selected = null;
            layers.forEach(function(layer) {
                if (!me.isLayerSupported(layer)) {
                    return;
                }
                // remove other region sets from the map
                if(layer.getId() !== newSetId) {
                    sb.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
                }
                else {
                    // detect if set is already on map
                    selected = layer;
                }
            });
            if(!selected) {
                // add to top
                sb.postRequestByName('AddMapLayerRequest', [newSetId]);
            }
            else {
                // bring to top
                sb.postRequestByName('RearrangeSelectedMapLayerRequest', [newSetId, -1]);
                // TODO: get indicator data -> classify -> update params
                this.renderActiveIndicator();
            }
        },
        handleIndicatorAdded: function(datasrc, indicatorId, selections) {
            // TODO: setup visualization
            this.renderActiveIndicator();
        },

        renderActiveIndicator: function() {
            var service = this.getService();
            if(!service) {
                // not available yet
                return;
            }
            var state = service.getStateService();
            var ind = state.getActiveIndicator();
            if(!ind) {
                return;
            }
            // TODO: setup visualization
            var layer = this.getSandbox().findMapLayerFromSelectedMapLayers(state.getRegionset());
            var mapLayer = this.getOLMapLayers(layer);
            if(mapLayer.length) {
                mapLayer = mapLayer[0];
            }
            else {
                return;
            }
            // TODO: get all statslayers on map?
            service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
                if(err) {
                    log.warn('Error getting indicator data', datasrc, indId, selections, me.getCurrentRegionset());
                    return;
                }
                var classify = service.getClassificationService().getClassification(data);

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

                var attrs = layer.getAttributes("statistics") || {};
                if(!attrs.regionIdTag) {
                     // 'kuntakoodi' - This must be the name of the attribute that has the values.
                    return;
                }
                var colors = service.getColorService().getColorset(regiongroups.length);
                mapLayer.mergeNewParams({
                    VIS_NAME: layer.getLayerName(),
                    VIS_ATTR: attrs.regionIdTag,
                    // classes=020,091|186,086,982|111,139,740
                    VIS_CLASSES: classes.join('|'),
                    // vis=choro:ccffcc|99cc99|669966
                    VIS_COLORS: 'choro:' + colors.join('|')
                });
            });
        },

        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         */
        addMapLayerToMap: function (layer, keepLayerOnTop) {
            if (!this.isLayerSupported(layer)) {
                return;
            }

            var me = this,
                sandbox = me.getSandbox();

            var layerScales = me.getMapModule().calculateLayerScales(
                layer.getMaxScale(),
                layer.getMinScale()
            );
            var openLayer = new OpenLayers.Layer.WMS('layer_' + layer.getId(),
                    me.ajaxUrl + '&LAYERID=' + layer.getId(),
                    {
                        layers: layer.getLayerName(),
                        transparent: true,
                        format: 'image/png'
                    },
                    {
                        scales: layerScales,
                        tileOptions: {maxGetUrlLength: 1024},
                        visibility: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                        singleTile: true,
                        buffer: 0
                    }
                );

            openLayer.opacity = layer.getOpacity() / 100;

            this.getMapModule().addLayer(openLayer, !keepLayerOnTop);

            me.getSandbox().printDebug('#!#! CREATED OPENLAYER.LAYER.WMS for StatsLayer ' + layer.getId());

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openLayer);
            this.renderActiveIndicator();
        },

        _afterStatsVisualizationChangeEvent: function (event) {
            var layer = event.getLayer(),
                params = event.getParams(),
                mapLayer = this.getFirstOLMapLayer(layer);

            this.featureAttribute = params.VIS_ATTR;

            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.mergeNewParams({
                    VIS_ID: params.VIS_ID,
                    VIS_NAME: params.VIS_NAME,
                    VIS_ATTR: params.VIS_ATTR, // This must be the name of the attribute that has the values.
                    VIS_CLASSES: params.VIS_CLASSES,
                    VIS_COLORS: params.VIS_COLORS,
                    LAYERS: params.VIS_NAME
                });
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });