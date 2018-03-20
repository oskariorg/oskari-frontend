Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.view.ContentPanel',
    function (view) {
        var me = this;

        me.view = undefined;
        me.instance = undefined;
        me.sandbox = undefined;
        me.loc = undefined;
        me.mapModule = undefined;
        me.features = undefined;
        me.dataPanel = undefined;
        me.drawToolsPanel = undefined;
        me.drawPluginId = undefined;
        me.drawPlugin = undefined;
        me.drawFilterPluginId = undefined;
        me.drawFilterPlugin = undefined;
        me.featureLayer = undefined;
        me.layerType = undefined;
        me.linkAction = undefined;
        me.isStarted = undefined;
        me.selectedGeometry = undefined;
        me.drawFilterMode = undefined;
        me.helpDialog = undefined;
        me.WFSLayerService = undefined;
        me.stopDrawing = false;

        //styles for drawing request
        me._defaultStyle = {
            draw : {
                fill : {
                     color: 'rgba(255,255,255,0.4)'
                },
                stroke : {
                      color: '#3399CC',
                      width: 2
                },
                image : {
                      radius: 4,
                      fill: {
                        color: '#3399CC'
                      }
                }
            },
            modify : {
                fill : {
                     color: 'rgba(255,255,255,0.4)'
                },
                stroke : {
                      color: '#3399CC',
                      width: 2
                },
                image : {
                      radius: 4,
                      fill: {
                        color: 'rgba(0,0,0,1)'
                      }
                }
            },
            intersect : {
                fill : {
                     color: 'rgba(255,255,255,0.4)'
                },
                stroke : {
                      color: '#3399CC',
                      width: 2,
                      lineDash: 5
                },
                image : {
                      radius: 4,
                      fill: {
                        color: 'rgba(0,0,0,1)'
                      }
                }
            }
        };


        me.init(view);
        me.start();

    }, {

        /**
         * @method getName
         *
         *
         * @return {String}
         */
        getName: function () {
            return this.instance.getName() + 'ContentPanel';
        },

        /**
         * @method getFeatures
         * Returns a list of all temporary features added.
         *
         *
         * @return {Object[]}
         */
        getFeatures: function () {
            return this.features;
        },

        /**
         * @method getSelectedGeometry
         * Returns a geometry selected by the user.
         *
         *
         * @return {Object[]}
         */
        getSelectedGeometry: function () {
            return this.selectedGeometry;
        },

        /**
         * @method parseFeatureFromClickedFeature
         * Returns an OpenLayers feature or null.
         *
         *
         * @return {OpenLayers.Feature.Vector}
         */
        parseFeatureFromClickedFeature: function(clickedGeometry) {
            var data = clickedGeometry[1],
                wkt = new ol.format.WKT(),
                feature = wkt.readFeature(data),
                geom = feature.getGeometry();

            if (geom instanceof ol.geom.LineString || geom instanceof ol.geom.Polygon || geom instanceof ol.geom.MultiPolygon) {
                return new ol.Feature({
                    geometry: geom
                });
            }

            return null;
        },
        /**
         * @method getLayersContainer
         * Returns the element which the layer list is rendered into.
         *
         *
         * @return {jQuery}
         */
        getLayersContainer: function () {
            return this.getDataPanelContainer().find('div.layers');
        },

        /**
         * @method getLayerType
         * Returns the type of the layer we fake here for the temporary
         * features.
         *
         *
         * @return {String}
         */
        getLayerType: function () {
            return this.layerType;
        },

        /**
         * @method emptyLayers
         * Empties the layer list.
         *
         *
         */
        emptyLayers: function () {
            this.getLayersContainer().empty();
        },

        /**
         * @method onEvent
         *
         * @param  {Oskari.Event} event
         *
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(this, [event]);
            }
        },

        /**
         * @static @property eventHandlers
         */
        eventHandlers: {

            'DrawingEvent': function (event) {
                if (event.getId() !== this.drawLayerId || !this.stopDrawing) {
                    // this isn't about analyse, stop processing it
                    return;
                }

                this.stopDrawing = false;

                var mode = event.getData().shape;

                var features = new ol.format.GeoJSON().readFeatures(event.getGeoJson());

                for (i=0; i < features.length; i++) {
                    this.addFeature(features[i], mode);
                }

                //remove drawLayer since we have added the features to analyseFeatureLayer
                this.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [this.drawLayerId, true]);
            },

            'DrawFilterPlugin.FinishedDrawFilteringEvent': function (event) {
                if (this.drawFilterPluginId !== event.getCreatorId()) {
                    return;
                }
                var geometries = event.getFiltered();
                if (geometries === null) {
                    this._cancelDrawFilter();
                }
                this.addFeature(geometries);
                this.drawFilterPlugin.stopDrawFiltering();

            },

            'WFSFeatureGeometriesEvent': function (event) {
                var me = this,
                    layerId = event.getMapLayer().getId();

                if (!me.instance.analyse.isEnabled) {
                    return;
                }
                if (me.drawFilterMode) {
                    return;
                }
                // if selection is made from different layer than previous selection, empty selections from previous layer
                _.forEach(me.sandbox.findAllSelectedMapLayers(), function (layer) {
                    if (layer.hasFeatureData() && layerId !== layer.getId()) {
                        me.WFSLayerService.emptyWFSFeatureSelections(layer);
                    }
                });
                // if there are selected features, unselect them
                me.selectInteraction.getFeatures().clear();

                //set selected geometry for filter json
                var geometries = [];
                _.forEach(event.getGeometries(), function (geometry) {
                    geometries.push(geometry[1]);
                });
                me.view.setFilterGeometry(geometries);

                // set selected geometries for drawFilter function
                var selectedGeometries = event.getGeometries();
                if (selectedGeometries.length > 0) {
                    var selectedGeometry = selectedGeometries[0];
                    me.selectedGeometry = me.parseFeatureFromClickedFeature(selectedGeometry);
                    me._operateDrawFilters();
                }
                me.drawControls.toggleEmptySelectionBtn(true);
            },

            'WFSFeaturesSelectedEvent': function (event) {
                var me = this,
                    layerId = event.getMapLayer().getId();

                if (me.drawFilterMode) {
                    return;
                }
                if (event.getWfsFeatureIds().length === 0 && layerId === me.WFSLayerService.getAnalysisWFSLayerId()) {
                    me.selectedGeometry = null;
                    //TODO: enable when geometryeditor is integrated
                    //me._disableAllDrawFilterButtons();
                    this.drawControls.toggleEmptySelectionBtn(false);
                }
            },

            'AfterMapMoveEvent': function (event) {
                if (this.drawFilterMode || !this.instance.analyse.isEnabled) {
                    return;
                }
                var olMap = this.mapModule.getMap();
                this.mapModule.bringToTop(this.featureLayer);
            },
            'AfterMapLayerAddEvent': function(event) {
                if (!this.instance.analyse.isEnabled) {
                    return;
                }
                this.toggleSelectionTools();
                this.drawControls.toggleEmptySelectionBtn((this.WFSLayerService.getWFSSelections() && this.WFSLayerService.getWFSSelections().length > 0));
                this.mapModule.bringToTop(this.featureLayer);
            },
            'AfterMapLayerRemoveEvent': function(event) {
                if (!this.instance.analyse.isEnabled) {
                    return;
                }
                this.toggleSelectionTools();
                this.drawControls.toggleEmptySelectionBtn((this.WFSLayerService.getWFSSelections() && this.WFSLayerService.getWFSSelections().length > 0));
            }
        },

        /**
         * @method init
         * Initializes the class.
         * Creates draw plugin and feature layer and sets the class/instance variables.
         *
         * @param  {Oskari.analysis.bundle.analyse.view.StartAnalyse} view
         *
         */
        init: function (view) {
            var me = this,
                p;

            me.view = view;
            me.instance = me.view.instance;
            me.sandbox = me.instance.getSandbox();
            me.WFSLayerService = me.sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
            me.loc = me.view.loc;
            me.mapModule = me.sandbox.findRegisteredModuleInstance(
                'MainMapModule'
            );
            me.features = [];
            me.featCounts = {
                point: 0,
                line: 0,
                area: 0
            };
            me.drawControls = Oskari.clazz.create('Oskari.analysis.bundle.analyse.view.DrawControls',
                                me.instance,
                                me.loc,
                                function (isCancel) {me._stopDrawing(isCancel);},
                                function (drawMode) {me._startNewDrawing(drawMode);});

            me.dataPanel = me.drawControls.createDataPanel(me.loc);
            me.drawToolsPanel = me.drawControls.createDrawToolsPanel(me.loc);
            me.drawFilterPluginId = me.instance.getName();
            //me.drawFilterPlugin = me._createDrawFilterPlugin();

            me.analyseHelper = Oskari.clazz.create('Oskari.analysis.bundle.analyse.service.AnalyseHelper');
            me.featureLayer = me.analyseHelper.createFeatureLayer();
            me.featureSource = me.featureLayer.getSource();
            me._createSelectInteractions();
            me._activateSelectControls();

            me.layerType = 'ANALYSE_TEMP';
            me.linkAction = me.loc.content.search.resultLink;
            me.isStarted = false;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }
        },

        /**
         * @method start
         * Adds the feature layer to the map, stops all other draw plugins
         * and starts the draw plugin needed here.
         *
         *
         */
        start: function () {
            var me = this,
                sandbox = me.sandbox,
                rn = 'Search.AddSearchResultActionRequest',
                reqBuilder,
                request;

            // Already started so nothing to do here
            if (me.isStarted) {
                return;
            }

            //me._toggleDrawFilterPlugins(false);
            me.mapModule.getMap().addLayer(me.featureLayer);

            //me.mapModule.registerPlugin(me.drawFilterPlugin);
            //me.mapModule.startPlugin(me.drawFilterPlugin);

            reqBuilder = Oskari.requestBuilder(rn);
            if (reqBuilder) {
                request = reqBuilder(
                    me.linkAction, me._getSearchResultAction(), me);
                sandbox.request(me.instance, request);
            }

            me.isStarted = true;
        },


        getDrawToolsPanel: function () {
            return this.drawToolsPanel;
        },

        getDrawToolsPanelContainer: function () {
            return this.getDrawToolsPanel().getContainer();
        },

        /**
         * @public @method getDataPanel
         *
         *
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getDataPanel: function () {
            return this.dataPanel;
        },

        /**
         * @method getDataPanelContainer
         * Returns the container where all the stuff is.
         *
         *
         * @return {jQuery}
         */
        getDataPanelContainer: function () {
            return this.getDataPanel().getContainer();
        },


        /**
         * @method destroy
         * Destroys the created components and unsets the class/instance variables.
         *
         *
         */
        destroy: function () {
            var me = this,
                p;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.unregisterFromEventByName(me, p);
                }
            }

            me.stop();
            me._destroyFeatureLayer();

            me.view = undefined;
            me.instance = undefined;
            me.sandbox = undefined;
            me.loc = undefined;
            me.mapModule = undefined;
            me.features = undefined;
            me.featCounts = undefined;
            me.dataPanel = undefined;
            me.drawToolsPanel = undefined;
            me.drawPluginId = undefined;
            me.drawPlugin = undefined;
            me.drawFilterPluginId = undefined;
            me.drawFilterPlugin = undefined;
            me.layerType = undefined;
            me.linkAction = undefined;
            me.isStarted = undefined;
        },

        /**
         * @public @method stop
         * Removes the feature layer, stops the draw plugin and
         * restarts all other draw plugins.
         *
         *
         */
        stop: function () {
            var me = this,
                sandbox = me.sandbox,
                rn = 'Search.RemoveSearchResultActionRequest',
                reqBuilder,
                request;

            // Already stopped so nothing to do here
            if (!me.isStarted) {
                return;
            }

            //me.mapModule.stopPlugin(me.drawFilterPlugin);
            //me.mapModule.unregisterPlugin(me.drawFilterPlugin);

            me.mapModule.getMap().removeLayer(me.featureLayer);
            me._deactivateSelectControls();
            me.drawControls.deactivateSelectTools();
            me.drawControls.closeHelpDialog();
            //me._toggleDrawFilterPlugins(true);

            reqBuilder = Oskari.requestBuilder(rn);
            if (reqBuilder) {
                request = reqBuilder(me.linkAction);
                sandbox.request(me.instance, request);
            }

            me.isStarted = false;
        },

        /**
         * @public @method findFeatureById
         * Returns the feature object by its id.
         *
         * @param  {String} id
         *
         * @return {Object}
         */
        findFeatureById: function (id) {
            return _.find(
                this.getFeatures(),
                function (feature) {
                    return feature.getId() === id;
                }
            );
        },

        /**
         * @private @method addFeature
         * Adds the given geometry to the feature layer
         * and to the internal list of features.
         *
         * @param {ol.Feature} feature to add
         * @param {String} mode geometry type
         * @param {String} name optional name for the temp feature
         *
         */
        addFeature: function (feature, mode, name) {
            var me = this;

            feature.setId(this.drawLayerId);

            this.featureSource.addFeature(feature);

            // create temporary layer with the feature to be shown on analyse layer list
            this.getFeatures().push(this._createFakeLayer(this.drawLayerId, mode, name));

            this.view.refreshAnalyseData(this.drawLayerId);
        },

        /**
         * @method removeGeometry
         * Removes the analyse layer by given id and the feature from ol layer by given id
         * and from the internal feature list.
         *
         * @param  {String} id
         *
         */
        removeGeometry: function (id) {
            var arr = this.features || [],
                i,
                arrLen,
                feature;

            for (i = 0, arrLen = arr.length; i < arrLen; i += 1) {
                if (arr[i].getId() === id) {
                    arr.splice(i, 1);
                    break;
                }
            }

            if (this.featureLayer) {
                feature = this.featureSource.getFeatureById(id);
                this.featureSource.removeFeature(feature);
            }

            this.view.refreshAnalyseData();
        },

        /*
         *******************
         * PRIVATE METHODS *
         *******************
         */



        /**
         * @private @method _startNewDrawing
         * Resets currently selected place and sends a draw request to plugin
         * with given config.
         *
         * @param {Object} config params for StartDrawRequest
         *
         */
        _startNewDrawing: function (config) {
            if (this.drawControls.helpDialog) {
                this._stopDrawing(true);
                this.drawControls.closeHelpDialog();
                this.drawControls.activateWFSLayer(true);
                return;
            }

            // Disable WFS highlight and GFI dialog
            this.drawControls.activateWFSLayer(false);

            // notify plugin to start drawing new geometry
            this._sendDrawRequest(config);
        },

        /**
         * Sends a StartDrawRequest with given params.
         *
         * @method _sendDrawRequest
         * @private
         * @param {Object} config params for StartDrawRequest
         */
        _sendDrawRequest: function (config) {
            var requestGeometryType = this.analyseHelper.getDrawRequestType(config.drawMode);

            this._deactivateSelectControls();
            this.drawLayerId = this.analyseHelper.generateDrawLayerId();

            this.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [this.drawLayerId, requestGeometryType, {style: this._defaultStyle, allowMultipleDrawing: 'multiGeom'}]);
        },

        /**
         * Sends a StopDrawingRequest.
         *
         * @ private @method _stopDrawing
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        _stopDrawing: function (isCancel) {
            var suppressEvent = false;
            this.stopDrawing = true;
            this.getDrawToolsPanelContainer()
                .find('div.toolContainer div.buttons')
                .remove();

            if (isCancel) {
                suppressEvent = true;
            }

            this.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [this.drawLayerId, isCancel, suppressEvent]);
        },

        /**
         * Creates a fake layer for analyse view which behaves
         * like an Oskari layer in some sense
         * (has all the methods needed in the view).
         *
         * @method _createFakeLayer
         * @private
         * @param  {String} id the OpenLayers.Feature.Vector id
         * @param  {String} mode either 'Point', 'LineString' or 'Polygon'
         * @param {String} name fake layer's name (optional, generates it if not given)
         * @return {Object}
         */
        _createFakeLayer: function (id, mode, name) {
            var loc = this.loc.content.features.modes,
                layerType = this.getLayerType(),
                featureLayer = this.featureLayer,
                featureSource = this.featureSource,
                formatter = new ol.format.GeoJSON(),
                geometryMode = this.analyseHelper.getInternalType(mode);

            var nonNullName = name || (loc[geometryMode] + ' ' + (this.featCounts[geometryMode] += 1));

            return {
                getId: function () {
                    return id;
                },
                getName: function () {
                    return nonNullName;
                },
                isLayerOfType: function (type) {
                    return type === layerType;
                },
                getLayerType: function () {
                    return 'temp';
                },
                getMode: function () {
                    return geometryMode;
                },
                hasFeatureData: function () {
                    return false;
                },
                getOpacity: function () {
                    return (featureLayer.opacity * 100);
                },
                getFeature: function () {
                    var formattedFeature = formatter.writeFeatureObject(featureSource.getFeatureById(id));
                    if (formattedFeature.properties === null) {
                        formattedFeature.properties = {};
                    }
                    return formattedFeature;
                }
            };
        },

        /**
         * Maps OpenLayers geometries into strings (draw modes).
         *
         * @method _getDrawModeFromGeometry
         * @private
         * @param  {OpenLayers.Geometry} geometry
         * @return {String} 'area'|'line'|'point'
         */
        _getDrawModeFromGeometry: function (geometry) {
            var modes = {
                'MultiPoint': 'point',
                'Point': 'point',
                'MultiLineString': 'line',
                'LineString': 'line',
                'MultiPolygon': 'area',
                'Polygon': 'area'
            };

            return (geometry ? modes[geometry.GeometryType] : undefined);
        },

        _createSelectInteractions: function () {
            var me = this;
            me.hoverInteraction = me.analyseHelper.createHoverInteraction(me.featureLayer);
            me.selectInteraction = me.analyseHelper.createSelectInteraction(me.featureLayer);

            me.selectInteraction.on('select', function (evt) {
              if (evt.selected.length > 0) {
                  var wkt = new ol.format.WKT();
                      featureWKT = wkt.writeFeature(evt.selected[0]);

                  //set geometry for drawFilter
                  me.selectedGeometry = featureWKT;
                  //set geometry for filter Json
                  var geometries = [];
                  geometries.push(featureWKT);
                  me.view.setFilterGeometry(geometries);
                  me.WFSLayerService.emptyAllWFSFeatureSelections();
              } else if (evt.deselected.length) {
                  me.selectedGeometry = undefined;
              }
            });
        },

        /**
         * Activates featureLayer Highlight and Select Controls
         *
         * @method _activateSelectControls
         * @private
         */
        _activateSelectControls: function () {
            this.mapModule.getMap().addInteraction(this.hoverInteraction);
            this.mapModule.getMap().addInteraction(this.selectInteraction);
        },
        /**
         * Deactivates featureLayer Highlight and Select Controls
         *
         * @method _deactivateSelectControls
         * @private
         */
        _deactivateSelectControls: function () {
            this.mapModule.getMap().removeInteraction(this.hoverInteraction);
            this.mapModule.getMap().removeInteraction(this.selectInteraction);
        },
        /**
         * Destroys the feature layer and removes it from the map.
         *
         * @method _destroyFeatureLayer
         * @private
         */
        _destroyFeatureLayer: function () {
            var map = this.mapModule.getMap();

            if (this.featureLayer) {
                map.removeLayer(this.featureLayer);
                this.featureLayer.destroyFeatures();
                this.featureLayer.destroy();
                this.featureLayer = undefined;
            }
        },

        /**
         * @method toggleSelectionTools
         * Sets the selection tools' status after a map layer has been added or removed. Disables controls if no wfs layers selected, enables tools otherwise
         *
         */
        toggleSelectionTools: function() {
            var me = this,
                selectionToolsToolContainer = jQuery('div.toolContainerToolDiv'),
                analysisWFSLayerSelected = (me.WFSLayerService.getAnalysisWFSLayerId() !== undefined && me.WFSLayerService.getAnalysisWFSLayerId() !== null);

            if (analysisWFSLayerSelected) {
                selectionToolsToolContainer.find('div[class*=selection-]').removeClass('disabled');
                if (!_.isEmpty(me.WFSLayerService.getSelectedFeatureIds(me.WFSLayerService.getAnalysisWFSLayerId()))) {
                    me.drawControls.toggleEmptySelectionBtn(true);
                } else {
                    me.drawControls.toggleEmptySelectionBtn(false);
                }
            } else {
                me.drawControls.deactivateSelectTools();
                selectionToolsToolContainer.find('div[class*=selection-]').addClass('disabled');
            }
            me.WFSLayerService.setSelectionToolsActive(analysisWFSLayerSelected);
        },

        /**
         * @method  @private _isPluginNamed
         * @param  {Object}  plugin Oskari plugin
         * @param  {String}  regex  regex
         * @return {Boolean}        is plugin not named
         */
        _isPluginNamed: function(plugin, regex) {
            // Check at puligin has name
            if(!plugin || !plugin.getName()) {
                return false;
            }

            return plugin.getName().match(regex) && plugin.getName() !== this.drawPlugin.getName();
        },

        /**
         * Returns a function that gets called in search bundle with
         * the search result as an argument which in turn returns
         * a function that gets called when the user clicks on the link
         * in the search result popup.
         *
         * @method _getSearchResultAction
         * @private
         * @return {Function}
         */
        _getSearchResultAction: function () {
            var me = this;

            return function (result) {
                return function () {
                    var geometry = new ol.geom.Point(
                            result.lon, result.lat
                        ),
                        name = (result.name + ' (' + result.village + ')');

                    var feature = new ol.Feature({
                        geometry: geometry
                    });

                    var shape = 'Point';

                    me.addFeature(feature, shape, name);
                };
            };
        },


        // Next functions are related to drawFilter functionality --->

        /**
         * Creates and returns the draw filter plugin needed here.
         *
         * @method _createDrawFilterPlugin
         * @private
         * @return {Oskari.mapframework.ui.module.common.geometryeditor.DrawFilterPlugin}
         */
        _createDrawFilterPlugin: function () {
            var drawFilterPlugin = Oskari.clazz.create(
                'Oskari.mapframework.ui.module.common.geometryeditor.DrawFilterPlugin',
                {
                    id: this.drawFilterPluginId
                }
            );

            return drawFilterPlugin;
        },

        /**
         * Creates and returns the filter control buttons.
         *
         * @method _createDrawFilterControls
         * @private
         * @return {Oskari.userinterface.component.Button[]}
         */
        _createDrawFilterControls: function () {
            var me = this,
                loc = me.loc.content.drawFilter.buttons,
                finishBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'
                );

            me.drawFilterMode = true;

            cancelBtn.setHandler(function () {
                me._cancelDrawFilter();
            });

            finishBtn.setTitle(loc.finish);
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me.drawFilterMode = false;
                // Disable all buttons
                me._disableAllDrawFilterButtons();
                me._sendStopDrawFilterRequest(false);
                me.drawControls.activateWFSLayer(true);
            });

            return [cancelBtn, finishBtn];
        },


        /**
         * Either starts or stops draw filter plugins which are added to the map module
         *
         * @method _toggleDrawFilterPlugins
         * @private
         * @param  {Boolean} enabled
         */
        _toggleDrawFilterPlugins: function (enabled) {
            var me = this,
                sandbox = this.sandbox,
                mapModule = this.mapModule;

            var drawFilterPlugins = _.filter(
                mapModule.getPluginInstances(),
                function (plugin) {
                    return  me._isPluginNamed(plugin, /DrawFilterPlugin$/);
                }
            );

            _.each(drawFilterPlugins, function (plugin) {
                if (enabled) {
                    mapModule.startPlugin(plugin);
                } else {
                    mapModule.stopPlugin(plugin);
                }
            });
        },

        _startNewDrawFiltering: function (config) {
            if (this.drawControls.helpDialog) {
                me._cancelDrawFilter();
                return;
            }


            var me = this,
                diaLoc = this.loc.content.drawFilter.dialog,
                controlButtons = [],
                dialogTitle,
                dialogText;

            // Enable and disable correct buttons
            if (config.mode === 'remove') {
                this._cancelDrawFilter();
            } else {
                // Enable only the remove button
                this._disableAllDrawFilterButtons();
                this.drawControls.activateWFSLayer(false);
                jQuery('div.drawFilter.analysis-selection-remove').removeClass('disabled');
                jQuery('div.drawFilter.analysis-selection-' + config.mode).addClass('selected');

                // Create help dialog
                this.helpDialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                );
                dialogTitle = diaLoc.modes[config.mode].title;
                dialogText = diaLoc.modes[config.mode].message;
                controlButtons = this._createDrawFilterControls();
                this.drawControls.helpDialog.addClass('drawfilterdialog');
                this.drawControls.helpDialog.show(dialogTitle, dialogText, controlButtons);
                this.drawControls.helpDialog.
                moveTo('div.drawFilter.analysis-selection-' + config.mode, 'bottom');
            }

            // Disable WFS highlight and GFI dialog
            this.drawControls.activateWFSLayer(false);

            // notify plugin to start draw filtering new geometries
            this._sendDrawFilterRequest(config);
        },

        _cancelDrawFilter: function () {
            this.drawFilterMode = false;
            this._sendStopDrawFilterRequest(true);
            this._disableAllDrawFilterButtons();
            this.drawControls.activateWFSLayer(true);
            this.selectedGeometry = null;
            // Disable the remove button
            jQuery('div.drawFilter.analysis-selection-remove').addClass('disabled');
            // Remove the finish button
            this.getDrawToolsPanelContainer()
                .find('div.drawFilterContainer')
                .find('div.buttons').remove();
            delete this.drawControls.helpDialog;
        },

        /**
         * Sends a StartDrawFilteringRequest with given params.
         *
         * @method _sendDrawFilterRequest
         * @private
         * @param {Object} config params for StartDrawFilteringRequest
         */
        _sendDrawFilterRequest: function (config) {
            var sandbox = this.sandbox,
                reqBuilder = sandbox.getRequestBuilder(
                    'DrawFilterPlugin.StartDrawFilteringRequest'
                ),
                request;

            if (reqBuilder) {
                request = reqBuilder(config);
                sandbox.request(this.instance, request);
            }
        },

        /**
         * Sends a StopDrawFilteringRequest with given params.
         *
         * @method _sendStopDrawFilterRequest
         * @private
         * @param {Object} config params for StopDrawFilteringRequest
         */
        _sendStopDrawFilterRequest: function (config) {
            var sandbox = this.sandbox,
                reqBuilder = sandbox.getRequestBuilder(
                    'DrawFilterPlugin.StopDrawFilteringRequest'
                ),
                request;

            if (reqBuilder) {
                request = reqBuilder(config);
                sandbox.request(this.instance, request);
            }
        },

        _operateDrawFilters: function () {
            //TODO: enable when geometryeditor is integrated
            return;

            var preSelector = 'div.drawFilter.analysis-selection-',
                pointButton = jQuery(preSelector + 'point'),
                lineButton = jQuery(preSelector + 'line'),
                editButton = jQuery(preSelector + 'edit'),
                removeButton = jQuery(preSelector + 'remove');

            if ((typeof this.selectedGeometry === 'undefined') || (this.selectedGeometry === null)) {
                // Disable all buttons
                this._disableAllDrawFilterButtons();
                return;
            }
            var type = this.selectedGeometry.geometry.GeometryType;
            // Enable or disable buttons depending on the selected feature type
            switch (type) {
                case 'LineString':
                    pointButton.removeClass('disabled');
                    lineButton.addClass('disabled');
                    editButton.addClass('disabled');
                    removeButton.addClass('disabled');
                    break;
                case 'MultiPolygon':
                    pointButton.addClass('disabled');
                    lineButton.removeClass('disabled');
                    editButton.removeClass('disabled');
                    removeButton.addClass('disabled');
                    break;
                default:
                    pointButton.addClass('disabled');
                    lineButton.addClass('disabled');
                    editButton.addClass('disabled');
                    removeButton.addClass('disabled');
                    break;
            }
        },

        _disableAllDrawFilterButtons: function () {
            jQuery('div.drawFilter').addClass('disabled');
            jQuery('div.drawFilter').removeClass('selected');
            // Close the help dialog
            this.drawControls.closeHelpDialog();
        }
    }
);
