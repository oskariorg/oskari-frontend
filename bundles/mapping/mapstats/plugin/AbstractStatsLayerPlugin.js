/**
 * @class Oskari.mapping.mapstats.AbstractStatsLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.mapping.mapstats.AbstractStatsLayerPlugin',

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
                'StatsGrid.ClassificationChangedEvent': function (event) {
                    this.renderActiveIndicator();
                },
                'StatsGrid.ActiveIndicatorChangedEvent' : function (event) {
                    var ind = event.getCurrent();
                    if(!ind) {
                        // last indicator was removed -> no active indicators
                        this.handleIndicatorRemoved();
                    } else {
                        // active indicator changed -> update map
                        this.handleIndicatorChanged(ind.datasource, ind.indicator, ind.selections);
                    }
                }
            };
        },
        getMapLayerForCurrentRegionset : function() {
            var service = this.getService();
            if(!service) {
                // not available yet
                return;
            }
            var state = service.getStateService();
            // setup visualization
            var layer = this.getSandbox().findMapLayerFromSelectedMapLayers(state.getRegionset());
            if(!layer) {
                this.handleRegionsetChanged();
                return;
            }
            var mapLayer = this.getOLMapLayers(layer);
            if(mapLayer && mapLayer.length) {
                return mapLayer[0];
            }
            return null;
        },
        handleIndicatorRemoved: function() {
            var mapLayer = this.getMapLayerForCurrentRegionset();
            if(!mapLayer) {
                return;
            }
            // reset params
            this.__updateLayerParams(mapLayer, {
                VIS_NAME: '',
                VIS_ATTR: '',
                VIS_CLASSES: '',
                VIS_COLORS: ''
            });
        },
        handleRegionsetChanged: function(newSetId) {
            return;
            if(!newSetId) {
                var service = this.getService();
                if(!service) {
                    // not available yet
                    return;
                }
                var state = service.getStateService();
                newSetId = state.getRegionset();
            }
            if(!newSetId) {
                return;
            }

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
        handleIndicatorChanged: function(datasrc, indicatorId, selections) {
            // TODO: setup visualization
            this.renderActiveIndicator();
        },

        renderActiveIndicator: function() {
            var me = this;
            var service = this.getService();
            if(!service) {
                // not available yet
                return;
            }
            var state = service.getStateService();
            var ind = state.getActiveIndicator();

            // setup visualization
            var layer = this.getSandbox().findMapLayerFromSelectedMapLayers(state.getRegionset());
            var mapLayer = this.getMapLayerForCurrentRegionset();
            if(!mapLayer) {
                return;
            }

            if(!ind) {
                Oskari.log('AbstractStatsLayerPlugin').warn('Error getting active indicator');
                this.handleIndicatorRemoved();
                return;
            }


            service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
                if(err) {
                    Oskari.log('AbstractStatsLayerPlugin').warn('Error getting indicator data', ind.datasource, ind.indicator, ind.selections, state.getRegionset());
                    me.__updateLayerParams(mapLayer, {
                        VIS_NAME: layer.getLayerName(),
                        VIS_ATTR: '',
                        VIS_CLASSES: '',
                        VIS_COLORS: ''
                    });
                    return;
                }
                var classification = state.getClassificationOpts(ind.hash);
                var classify = service.getClassificationService().getClassification(data, classification);
                if(!classify) {
                    me.__updateLayerParams(mapLayer, {
                        VIS_NAME: layer.getLayerName(),
                        VIS_ATTR: '',
                        VIS_CLASSES: '',
                        VIS_COLORS: ''
                    });
                    return;
                }

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

                var colors = me.service.getColorService().getColorsForClassification(classification);
                me.__updateLayerParams(mapLayer, {
                    VIS_NAME: layer.getLayerName(),
                    VIS_ATTR: attrs.regionIdTag,
                    VIS_CLASSES: classes.join('|'),
                    VIS_COLORS: 'choro:' + colors.join('|')
                });
            });
        }
        // implement : addMapLayerToMap() and __updateLayerParams()
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