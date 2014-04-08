Oskari.clazz.define('Oskari.analysis.bundle.analyse.view.ContentPanel',
    function (view) {
        this.view         = view;
        this.instance     = view.instance;
        this.loc          = view.loc;
        this.features     = {
            point: [],
            line: [],
            area: []
        };
        this.featureLayer = this._createFeatureLayer();;
        this.panel        = this._createPanel();
        this.drawPluginId = this.instance.getName();
        this.drawPlugin   = this._createDrawPlugin();

        this.start();
    }, {
        _templates: {
            'layersContainer': '<div class="layers"></div>',
            'toolContainer': '<div class="toolContainer"></div>',
            'tool': '<div class="tool"></div>',
            'buttons': '<div class="buttons"></div>'
        },
        getPanel: function() {
            return this.panel;
        },
        getPanelContainer: function() {
            return this.getPanel().getContainer();
        },
        getName: function() {
            return this.instance.getName() + 'ContentPanel';
        },
        getFeatures: function() {
            return this.features;
        },
        getLayersContainer: function() {
            return this.getPanelContainer().find('div.layers');
        },
        emptyLayers: function() {
            this.getLayersContainer().empty();
        },
        onEvent: function(event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) return handler.apply(this, [event]);
        },
        eventHandlers: {
            'DrawPlugin.FinishedDrawingEvent': function (event) {
                if (this.drawPluginId !== event.getCreatorId()) return;

                this._addGeometry(event.getDrawing());
            }
        },
        start: function() {
            var sandbox = this.instance.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
                p;

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            mapModule.registerPlugin(this.drawPlugin);
            mapModule.startPlugin(this.drawPlugin);
        },
        stop: function() {
            var sandbox = this.instance.getSandbox(),
                mapModule = sandbox.findRegisteredModuleInstance('MainMapModule'),
                p;

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            mapModule.unregisterPlugin(this.drawPlugin);
            mapModule.stopPlugin(this.drawPlugin);

            this._destroyFeatureLayer();
            this.drawPluginId = undefined;
            this.drawPlugin = undefined;
            this.panel = undefined;
            this.features = undefined;
            this.loc = undefined;
            this.instance = undefined;
            this.view = undefined;
        },
        /**
         * Creates the content layer selection panel for analyse
         * 
         * @method _createPanel
         * @private
         * @return {Oskari.userinterface.component.AccordionPanel}
         *         Returns the created panel
         */
        _createPanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'),
                panelContainer = panel.getContainer(),
                layersCont = jQuery(this._templates.layersContainer).clone(),
                tooltipCont = this.view.template.help.clone(),
                dataBtn = this._createDataButton();

            panel.setTitle(this.loc.content.label);
            tooltipCont.attr('title', this.loc.content.tooltip);

            panelContainer.append(tooltipCont);
            panelContainer.append(layersCont);
            dataBtn.insertTo(panelContainer);
            panelContainer.append(this._createDrawButtons());

            return panel;
        },
        _createDrawPlugin: function() {
            var drawPlugin = Oskari.clazz.create(
                    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', {
                        id: this.drawPluginId,
                        multipart: true
                    });
            
            return drawPlugin;
        },
        _createDataButton: function() {
            var me = this,
                button = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button');

            button.setTitle(this.loc.buttons.data);
            button.addClass('primary');
            button.setHandler(function () {
                me._modifyAnalyseData();
            });

            return button;
        },
        _createDrawButtons: function() {
            var me = this,
                toolContainer = jQuery(this._templates.toolContainer).clone(),
                toolTemplate = jQuery(this._templates.tool),
                tools = ['point', 'line', 'area'];

            return _.foldl(tools, function(container, tool) {
                var toolDiv = toolTemplate.clone();
                toolDiv.addClass('add-' + tool);
                toolDiv.click(function() {
                    me._startNewDrawing({
                        drawMode: tool
                    });
                });
                container.append(toolDiv);

                return container;
            }, toolContainer);
        },
        _createDrawControls: function () {
            var me = this,
                container = jQuery(this._templates.buttons).clone(),
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            cancelBtn.setTitle('Peruuta');
            cancelBtn.setHandler(function () {
                me._sendStopDrawRequest(true);
            });

            finishBtn.setTitle('Tallenna');
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me._sendStopDrawRequest();
            });

            cancelBtn.insertTo(container);
            finishBtn.insertTo(container);

            return container;
        },
        /**
         * modify analyse data layers in selection box
         * 
         * @method _modifyAnalyseData
         * @private
         */
        _modifyAnalyseData: function () {
            var sandbox = this.instance.getSandbox(),
                extension = this._getFakeExtension('LayerSelector'),
                rn = 'userinterface.UpdateExtensionRequest';

            sandbox.postRequestByName(rn, [extension, 'attach']);
        },
        _getFakeExtension: function (name) {
            return {
                getName: function () {
                    return name;
                }
            };
        },
        /**
         * Resets currently selected place and sends a draw request to plugin
         * with given config.
         * 
         * @method _startNewDrawing
         * @private
         * @param {Object} config params for StartDrawRequest
         */
        _startNewDrawing: function (config) {
            var sandbox = this.instance.getSandbox(),
                evtB = sandbox.getEventBuilder(
                    'DrawPlugin.SelectedDrawingEvent'),
                gfiReqBuilder = sandbox.getRequestBuilder(
                    'MapModulePlugin.GetFeatureInfoActivationRequest');

            // notify components to reset any saved "selected place" data
            if (evtB) sandbox.notifyAll(evtB());

            // notify plugin to start drawing new geometry
            this._sendDrawRequest(config);

            // disable gfi requests
            if (gfiReqBuilder) {
                sandbox.request(this.instance, gfiReqBuilder(false));
            }

            // remove old draw buttons and append new ones
            this.getPanelContainer()
                .find('div.toolContainer')
                .find('div.buttons').remove().end()
                .append(this._createDrawControls());
        },
        /**
         * Sends a StartDrawRequest with given params.
         * Changes the panel controls to match the application state (new/edit)
         * 
         * @method _sendDrawRequest
         * @param {Object} config params for StartDrawRequest
         */
        _sendDrawRequest: function (config) {
            var sandbox = this.instance.getSandbox(),
                reqBuilder = sandbox.getRequestBuilder(
                    'DrawPlugin.StartDrawingRequest'),
                request;

            if (reqBuilder) {
                request = reqBuilder(config);
                sandbox.request(this.instance, request);
            }
        },
        /**
         * Sends a StopDrawingRequest.
         * Changes the panel controls to match the application state (new/edit)
         * if propagateEvent != true
         * 
         * @method _sendStopDrawRequest
         * @private
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        _sendStopDrawRequest: function (isCancel) {
            var sandbox = this.instance.getSandbox(),
                reqBuilder = sandbox.getRequestBuilder('DrawPlugin.StopDrawingRequest'),
                request;

            this.getPanelContainer()
                .find('div.toolContainer div.buttons')
                .remove();

            if (reqBuilder) {
                request = reqBuilder(isCancel);
                sandbox.request(this.instance, request);
            }
        },
        _addGeometry: function(geometry) {
            var mode = this._getDrawModeFromGeometry(geometry),
                feature;

            if (mode) {
                feature = new OpenLayers.Feature.Vector(geometry);
                this.features[mode].push({
                    id: feature.id
                });

                if (this.featureLayer) {
                    this.featureLayer.addFeatures([feature]);
                }

                this.view.refreshAnalyseData();
            }
        },
        removeGeometry: function(id, mode) {
            var arr = this.features[mode],
                i,
                arrLen,
                feature;

            for (i = 0, arrLen = arr.length; i < arrLen; ++i) {
                if (arr[i].id === id) {
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
        _getDrawModeFromGeometry : function(geometry) {
            var modes = {
                'OpenLayers.Geometry.MultiPoint'      : 'point',
                'OpenLayers.Geometry.Point'           : 'point',
                'OpenLayers.Geometry.MultiLineString' : 'line',
                'OpenLayers.Geometry.LineString'      : 'line',
                'OpenLayers.Geometry.MultiPolygon'    : 'area',
                'OpenLayers.Geometry.Polygon'         : 'area'
            };

            return (geometry ? modes[geometry.CLASS_NAME] : undefined);
        },
        _createFeatureLayer: function() {
            var layer = new OpenLayers.Layer.Vector('AnalyseFeatureLayer'),
                map = this.instance
                    .getSandbox()
                    .findRegisteredModuleInstance('MainMapModule')
                    .getMap();

            map.addLayer(layer);

            return layer;
        },
        _destroyFeatureLayer: function() {
            var map = this.instance
                .getSandbox()
                .findRegisteredModuleInstance('MainMapModule')
                .getMap();

            if (this.featureLayer) {
                map.removeLayer(this.featureLayer);
                this.featureLayer.destroyFeatures();
                this.featureLayer.destroy();
                this.featureLayer = undefined;
            }
        }
});