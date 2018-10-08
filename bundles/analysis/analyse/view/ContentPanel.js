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
        me.init(view);
        me.start();
    }, {
        /**
         * @static @property _templates
         */
        _templates: {
            help: '<div class="help icon-info"></div>',
            buttons: '<div class="buttons"></div>',
            layersContainer: '<div class="layers"></div>',
            toolContainer: '<div class="toolContainer">' +
                '  <h4 class="title"></h4>' +
                '</div>',
            tool: '<div class="tool"></div>',
            drawFilterContainer: '<div class="drawFilterContainer">' +
                '  <h4 class="title"></h4>' +
                '</div>',
            drawFilter: '<div class="drawFilter"></div>',
            selectionToolsContainer: '<div class="toolContainer">'+
                '   <h4 class="title"></h4>'+
                '   <div class="toolContainerToolDiv"></div>'+
                '   <div class="toolContainerFooter"></div>'+
                '   <div class="toolContainerButtons"></div>'+
                '</div>',
            search: '<div class="analyse-search"></div>'
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

        getDrawToolsPanel: function () {
            return this.drawToolsPanel;
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

        getDrawToolsPanelContainer: function () {
            return this.getDrawToolsPanel().getContainer();
        },

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
                wkt = new OpenLayers.Format.WKT(),
                feature = wkt.read(data),
                gcn = feature.geometry.CLASS_NAME;

            if (gcn === 'OpenLayers.Geometry.LineString') {
                return new OpenLayers.Feature.Vector(
                    feature.geometry
                );
            } else if (gcn === 'OpenLayers.Geometry.MultiPolygon') {
                return new OpenLayers.Feature.Vector(
                    feature.geometry
                );
            } else if (gcn === 'OpenLayers.Geometry.Polygon') {
                return new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.MultiPolygon(
                        [feature.geometry]
                    )
                );
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

            'DrawPlugin.FinishedDrawingEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) {
                    return;
                }

                this.addGeometry(event.getDrawing());
                this.drawPlugin.stopDrawing();
            },

            'DrawFilterPlugin.FinishedDrawFilteringEvent': function (event) {
                if (this.drawFilterPluginId !== event.getCreatorId()) {
                    return;
                }
                var geometries = event.getFiltered();
                if (geometries === null) {
                    this._cancelDrawFilter();
                }
                this.addGeometry(event.getFiltered());
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
                me.selectControl.unselectAll();

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
                    me._disableAllDrawFilterButtons();
                    me.drawControls.toggleEmptySelectionBtn(false);
                }
            },

            'AfterMapMoveEvent': function (event) {
                if (this.drawFilterMode || !this.instance.analyse.isEnabled) {
                    return;
                }
                var olMap = this.mapModule.getMap(),
                    layer = olMap.getLayersByName('AnalyseFeatureLayer')[0];
                this.mapModule.bringToTop(layer, 20);
            },
            'AfterMapLayerAddEvent': function(event) {
                this.toggleSelectionTools();
                this.drawControls.toggleEmptySelectionBtn((this.WFSLayerService.getWFSSelections() && this.WFSLayerService.getWFSSelections().length > 0));
            },
            'AfterMapLayerRemoveEvent': function(event) {
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

            me.drawPluginId = me.instance.getName();
            me.drawPlugin = me._createDrawPlugin();
            me.drawFilterPluginId = me.instance.getName();
            me.drawFilterPlugin = me._createDrawFilterPlugin();
            me.featureLayer = me._createFeatureLayer(me.mapModule);
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
            var me = this;
            var sandbox = me.sandbox;
            var requestName = 'Search.AddSearchResultActionRequest';

            // Already started so nothing to do here
            if (me.isStarted) {
                return;
            }

            me._toggleDrawPlugins(false);
            me._toggleDrawFilterPlugins(false);
            me.mapModule.getMap().addLayer(me.featureLayer);

            me.mapModule.registerPlugin(me.drawPlugin);
            me.mapModule.startPlugin(me.drawPlugin);

            me.mapModule.registerPlugin(me.drawFilterPlugin);
            me.mapModule.startPlugin(me.drawFilterPlugin);

            if (sandbox.hasHandler(requestName)) {
                var reqBuilder = Oskari.requestBuilder(requestName);
                var request = reqBuilder(me.linkAction, me._getSearchResultAction(), me);
                sandbox.request(me.instance, request);
            }

            me.isStarted = true;
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
            var me = this;
            var sandbox = me.sandbox;
            var requestName = 'Search.RemoveSearchResultActionRequest';

            // Already stopped so nothing to do here
            if (!me.isStarted) {
                return;
            }

            me.mapModule.stopPlugin(me.drawPlugin);
            me.mapModule.unregisterPlugin(me.drawPlugin);

            me.drawControls.closeHelpDialog();

            me.mapModule.stopPlugin(me.drawFilterPlugin);
            me.mapModule.unregisterPlugin(me.drawFilterPlugin);

            me.mapModule.getMap().removeLayer(me.featureLayer);

            me._deactivateSelectControls();
            me.drawControls.deactivateSelectTools();

            me._toggleDrawPlugins(true);
            me._toggleDrawFilterPlugins(true);

            if (sandbox.hasHandler(requestName)) {
                var reqBuilder = Oskari.requestBuilder(requestName);
                var request = reqBuilder(me.linkAction);
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
         * @private @method addGeometry
         * Adds the given geometry to the feature layer
         * and to the internal list of features.
         *
         * @param {OpenLayers.Geometry} geometry
         * @param {String} name optional name for the temp feature
         *
         */
        addGeometry: function (geometry, name) {
            var me = this,
                feature,
                mode = this._getDrawModeFromGeometry(geometry),
                style;

            if (mode) {
                style = OpenLayers.Util.extend(
                    {},
                    OpenLayers.Feature.Vector.style['default']
                );
                style.fillOpacity = 0.7;
                style.graphicOpacity = 1;
                style.strokeWidth = 2;
                style.strokeColor = '#000000';
                style.strokeOpacity = 1;
                feature = new OpenLayers.Feature.Vector(geometry, null);
                this.getFeatures().push(
                    this._createFakeLayer(feature.id, mode, name)
                );

                if (this.featureLayer) {
                    this.featureLayer.addFeatures([feature]);
                }
                this.featureLayer.events.on({
                    'featureselected': function (event) {
                        var wkt = new OpenLayers.Format.WKT(),
                            featureWKT = wkt.write(event.feature);

                        //set geometry for drawFilter
                        me.selectedGeometry = featureWKT;
                        //set geometry for filter Json
                        var geometries = [];
                        geometries.push(featureWKT);
                        me.view.setFilterGeometry(geometries);
                        me.WFSLayerService.emptyAllWFSFeatureSelections();
                    },
                    'featureunselected': function(feature) {
                        me.selectedGeometry = undefined;
                    }
                });
                this.view.refreshAnalyseData(feature.id);
            }
        },

        /**
         * @method removeGeometry
         * Removes the feature by given id from the feature layer
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
                feature = this.featureLayer.getFeatureById(id);
                this.featureLayer.destroyFeatures([feature]);
            }

            this.view.refreshAnalyseData();
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

        /*
         *******************
         * PRIVATE METHODS *
         *******************
         */

        /**
         * Creates and returns the draw plugin needed here.
         *
         * @method _createDrawPlugin
         * @private
         * @return {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin}
         */
        _createDrawPlugin: function () {
            var drawPlugin = Oskari.clazz.create(
                'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin',
                {
                    id: this.drawPluginId,
                    multipart: true,
                    requests : false
                }
            );

            return drawPlugin;
        },

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
                me._activateWFSLayer(true);
            });

            return [cancelBtn, finishBtn];
        },

        /**
         * Sends a request to open a Flyout impersonating
         * as the bundle provided in the name param.
         *
         * @method _openFlyoutAs
         * @private
         * @param  {String} name
         */
        _openFlyoutAs: function (name) {
            var me = this,
                extension = {
                    getName: function () {
                        return name;
                    }
                },
                rn = 'userinterface.UpdateExtensionRequest';

            if(name === 'LayerSelector') {
                var requestName = 'ShowFilteredLayerListRequest';
                me.sandbox.postRequestByName(
                    requestName,
                    [null, 'featuredata']
                );
                clearTimeout(this._flyoutTimeOut);
                this._flyoutTimeOut = setTimeout(function(){
                    me.sandbox.postRequestByName(rn, [extension, 'attach', rn, '0', '424']);
                },100);
            } else {
                me.sandbox.postRequestByName(rn, [extension, 'attach', rn, '0', '424']);
            }
        },

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
                this.stopDrawing(true);
                this.drawControls.closeHelpDialog();
                this.drawControls.activateWFSLayer(true);
                return;
            }

            // Disable WFS highlight and GFI dialog
            this.drawControls.activateWFSLayer(false);

            // notify plugin to start drawing new geometry
            this._sendDrawRequest(config);
        },

        _startNewDrawFiltering: function (config) {
            if (this.helpDialog) {
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
                this.helpDialog.addClass('drawfilterdialog');
                this.helpDialog.show(dialogTitle, dialogText, controlButtons);
                this.helpDialog.
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
            delete this.helpDialog;
        },

        /**
         * Sends a StartDrawRequest with given params.
         *
         * @method _sendDrawRequest
         * @private
         * @param {Object} config params for StartDrawRequest
         */
        _sendDrawRequest: function (config) {
            if(this.drawPlugin) {
                this.drawPlugin.startDrawing(config);
            }
        },

        /**
         * Sends a StopDrawingRequest.
         *
         * @method _sendStopDrawRequest
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        _stopDrawing: function (isCancel) {
            this.getDrawToolsPanelContainer()
                .find('div.toolContainer div.buttons')
                .remove();

            if (this.drawPlugin) {
                if (isCancel) {
                    // we wish to clear the drawing without sending further events
                    this.drawPlugin.stopDrawing();
                } else {
                    // pressed finished drawing, act like dblclick
                    this.drawPlugin.forceFinishDraw();
                }
            }
        },

        /**
         * Sends a StartDrawFilteringRequest with given params.
         *
         * @method _sendDrawFilterRequest
         * @private
         * @param {Object} config params for StartDrawFilteringRequest
         */
        _sendDrawFilterRequest: function (config) {
            if (!this.sandbox.hasHandler('DrawFilterPlugin.StartDrawFilteringRequest')) {
                return;
            }
            var reqBuilder = Oskari.requestBuilder('DrawFilterPlugin.StartDrawFilteringRequest');
            var request = reqBuilder(config);
            this.sandbox.request(this.instance, request);
        },

        /**
         * Sends a StopDrawFilteringRequest with given params.
         *
         * @method _sendStopDrawFilterRequest
         * @private
         * @param {Object} config params for StopDrawFilteringRequest
         */
        _sendStopDrawFilterRequest: function (config) {
            if (!this.sandbox.hasHandler('DrawFilterPlugin.StopDrawFilteringRequest')) {
                return;
            }
            var reqBuilder = Oskari.requestBuilder('DrawFilterPlugin.StopDrawFilteringRequest');
            var request = reqBuilder(config);
            this.sandbox.request(this.instance, request);
        },

        /**
         * Creates a fake layer for analyse view which behaves
         * like an Oskari layer in some sense
         * (has all the methods needed in the view).
         *
         * @method _createFakeLayer
         * @private
         * @param  {String} id the OpenLayers.Feature.Vector id
         * @param  {String} mode either 'area', 'line' or 'point'
         * @param {String} name fake layer's name (optional, generates it if not given)
         * @return {Object}
         */
        _createFakeLayer: function (id, mode, name) {
            var loc = this.loc.content.features.modes,
                nonNullName = name || (loc[mode] + ' ' + (this.featCounts[mode] += 1)),
                layerType = this.getLayerType(),
                featureLayer = this.featureLayer,
                formatter = new OpenLayers.Format.GeoJSON();

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
                    return mode;
                },
                hasFeatureData: function () {
                    return false;
                },
                getOpacity: function () {
                    return (featureLayer.opacity * 100);
                },
                getFeature: function () {
                    return formatter.write(featureLayer.getFeatureById(id));
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
                'OpenLayers.Geometry.MultiPoint': 'point',
                'OpenLayers.Geometry.Point': 'point',
                'OpenLayers.Geometry.MultiLineString': 'line',
                'OpenLayers.Geometry.LineString': 'line',
                'OpenLayers.Geometry.MultiPolygon': 'area',
                'OpenLayers.Geometry.Polygon': 'area'
            };

            return (geometry ? modes[geometry.CLASS_NAME] : undefined);
        },

        /**
         * Creates the feature layer where the drawn features are added to
         * and adds it to the map.
         *
         * @method _createFeatureLayer
         * @private
         * @return {OpenLayers.Layer.Vector}
         */
        _createFeatureLayer: function (mapModule) {
            var me = this,
                layer = new OpenLayers.Layer.Vector('AnalyseFeatureLayer');

            //add select possibility to temp layers
            // requires highlight refactoring so is not in use yet
            me.highlightControl = new OpenLayers.Control.SelectFeature(
                layer,
                {
                    hover: true,
                    highlightOnly: true,
                    renderIntent: 'temporary'
                });

            me.selectControl = new OpenLayers.Control.SelectFeature(
                layer,
                {
                    clickout: true
                });

            me.mapModule.getMap().addControl(this.highlightControl);
            me.mapModule.getMap().addControl(this.selectControl);
            me._activateSelectControls();

            return layer;
        },
        /**
         * Activates featureLayer Highlight and Select Controls
         *
         * @method _activateSelectControls
         * @private
         */
        _activateSelectControls: function () {
            this.highlightControl.activate();
            this.selectControl.activate();
        },
        /**
         * Deactivates featureLayer Highlight and Select Controls
         *
         * @method _deactivateSelectControls
         * @private
         */
        _deactivateSelectControls: function () {
            this.highlightControl.deactivate();
            this.selectControl.deactivate();
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

            return plugin.getName().match(regex) && plugin.getName() !== me.drawPlugin.getName();
        },

        /**
         * Either starts or stops draw plugins which are added to the map module
         * (except the one created in this class).
         *
         * @method _toggleDrawPlugins
         * @private
         * @param  {Boolean} enabled
         */
        _toggleDrawPlugins: function (enabled) {
            var me = this,
                mapModule = me.mapModule;

            var drawPlugins = _.filter(
                mapModule.getPluginInstances(),
                function (plugin) {
                    return me._isPluginNamed(plugin, /DrawPlugin$/);
                }
            );

            _.each(drawPlugins, function (plugin) {
                if (enabled) {
                    mapModule.startPlugin(plugin);
                } else {
                    mapModule.stopPlugin(plugin);
                }
            });
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
                    var geometry = new OpenLayers.Geometry.Point(
                            result.lon, result.lat
                        ),
                        name = (result.name + ' (' + result.village + ')');

                    me.addGeometry(geometry, name);
                };
            };
        },

        _operateDrawFilters: function () {
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
            var type = this.selectedGeometry.geometry.CLASS_NAME;
            // Enable or disable buttons depending on the selected feature type
            switch (type) {
            case 'OpenLayers.Geometry.LineString':
                pointButton.removeClass('disabled');
                lineButton.addClass('disabled');
                editButton.addClass('disabled');
                removeButton.addClass('disabled');
                break;
            case 'OpenLayers.Geometry.MultiPolygon':
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
        },
    }
);
