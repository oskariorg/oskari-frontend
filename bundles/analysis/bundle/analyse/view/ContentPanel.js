Oskari.clazz.define('Oskari.analysis.bundle.analyse.view.ContentPanel',
    function (view) {
        this.view               = undefined;
        this.instance           = undefined;
        this.sandbox            = undefined;
        this.loc                = undefined;
        this.mapModule          = undefined;
        this.features           = undefined;
        this.panel              = undefined;
        this.drawPluginId       = undefined;
        this.drawPlugin         = undefined;
        this.drawFilterPluginId = undefined;
        this.drawFilterPlugin   = undefined;
        this.featureLayer       = undefined;
        this.layerType          = undefined;
        this.linkAction         = undefined;
        this.isStarted          = undefined;
        this.selectedGeometry   = undefined;
        this.drawFilterMode     = undefined;
        this.helpDialog         = undefined;

        this.init(view);
        this.start();
    }, {
        /**
         * @static
         * @property _templates
         */
        _templates: {
            'help': '<div class="help icon-info"></div>',
            'buttons': '<div class="buttons"></div>',
            'layersContainer': '<div class="layers"></div>',
            'toolContainer': '<div class="toolContainer">' +
                    '<h4 class="title"></h4>' +
                '</div>',
            'tool': '<div class="tool"></div>',
            'drawControls': '<div class="buttons"></div>',
            'drawFilterContainer': '<div class="drawFilterContainer">' +
                '<h4 class="title"></h4>' +
                '</div>',
            'drawFilter': '<div class="drawFilter"></div>',
            'drawFilterControls': '<div class="buttons"></div>',
            'search': '<div class="analyse-search"></div>'
        },
        /**
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function() {
            return this.panel;
        },
        /**
         * Returns the container where all the stuff is.
         * 
         * @method getPanelContainer
         * @return {jQuery}
         */
        getPanelContainer: function() {
            return this.getPanel().getContainer();
        },
        /**
         * @method getName
         * @return {String}
         */
        getName: function() {
            return this.instance.getName() + 'ContentPanel';
        },
        /**
         * Returns a list of all temporary features added.
         * 
         * @method getFeatures
         * @return {Object[]}
         */
        getFeatures: function() {
            return this.features;
        },
        /**
         * Returns a geometry selected by the user.
         *
         * @method getSelectedGeometry
         * @return {Object[]}
         */
        getSelectedGeometry: function() {
            return this.selectedGeometry;
        },
        /**
         * Returns the element which the layer list is rendered into.
         * 
         * @method getLayersContainer
         * @return {jQuery}
         */
        getLayersContainer: function() {
            return this.getPanelContainer().find('div.layers');
        },
        /**
         * Returns the type of the layer we fake here for the temporary features.
         * 
         * @method getLayerType
         * @return {String}
         */
        getLayerType: function() {
            return this.layerType;
        },
        /**
         * Empties the layer list.
         * 
         * @method emptyLayers
         */
        emptyLayers: function() {
            this.getLayersContainer().empty();
        },
        /**
         * @method onEvent
         * @param  {Oskari.Event} event
         */
        onEvent: function(event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) return handler.apply(this, [event]);
        },
        /**
         * @static
         * @property eventHandlers
         */
        eventHandlers: {
            'DrawPlugin.FinishedDrawingEvent': function(event) {
                if (this.drawPluginId !== event.getCreatorId()) {
                    return;
                }

                this.addGeometry(event.getDrawing());
                this.drawPlugin.stopDrawing();
            },
            'DrawFilterPlugin.FinishedDrawFilteringEvent': function(event) {
                if (this.drawFilterPluginId !== event.getCreatorId()) {
                    return;
                }
                this.addGeometry(event.getFiltered());
                this.drawFilterPlugin.stopDrawFiltering();

            },
            'WFSFeatureGeometriesEvent': function(event) {
                if (!this.instance.analyse.isEnabled) {
                    return;
                }
                if (this.drawFilterMode) {
                    return;
                }
                var clickedGeometries = event.getGeometries();
                if (clickedGeometries.length > 0) {
                    var clickedGeometry = clickedGeometries[0];
                    // var id = clickedGeometry[0];
                    var data = clickedGeometry[1];
                    var wkt = new OpenLayers.Format.WKT();
                    var feature = wkt.read(data);
                    if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
                        this.selectedGeometry = new OpenLayers.Feature.Vector(feature.geometry);
                    } else if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon") {
                        this.selectedGeometry = new OpenLayers.Feature.Vector(feature.geometry);
                    } else if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
                        this.selectedGeometry = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon([feature.geometry]));
                    }
                    this._operateDrawFilters();
                }
            },
            'WFSFeaturesSelectedEvent': function(event) {
                if (this.drawFilterMode) {
                    return;
                }
                if (event.getWfsFeatureIds().length === 0) {
                    this.selectedGeometry = null;
                    this._disableAllDrawFilterButtons();
                }
            }
        },
        /**
         * Initializes the class.
         * Creates draw plugin and feature layer and sets the class/instance variables.
         * 
         * @method init
         * @param  {Oskari.analysis.bundle.analyse.view.StartAnalyse} view
         */
        init: function(view) {
            this.view               = view;
            this.instance           = this.view.instance;
            this.sandbox            = this.instance.getSandbox();
            this.loc                = this.view.loc;
            this.mapModule          = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            this.features           = [];
            this.featCounts         = {
                point: 0,
                line: 0,
                area: 0
            };
            this.panel              = this._createPanel(this.loc);
            this.drawPluginId       = this.instance.getName();
            this.drawPlugin         = this._createDrawPlugin();
            this.drawFilterPluginId = this.instance.getName();
            this.drawFilterPlugin   = this._createDrawFilterPlugin();
            this.featureLayer       = this._createFeatureLayer(this.mapModule);
            this.layerType          = 'ANALYSE_TEMP';
            this.linkAction         = this.loc.content.search.resultLink;
            this.isStarted          = false;

            for (var p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.registerForEventByName(this, p);
                }
            }
        },
        /**
         * Adds the feature layer to the map, stops all other draw plugins
         * and starts the draw plugin needed here.
         * 
         * @method start
         */
        start: function() {
            var sandbox = this.sandbox,
                rn = 'Search.AddSearchResultActionRequest',
                reqBuilder,
                request;

            // Already started so nothing to do here
            if (this.isStarted) return;    

            this._toggleDrawPlugins(false);
            this._toggleDrawFilterPlugins(false);
            this.mapModule.getMap().addLayer(this.featureLayer);

            this.mapModule.registerPlugin(this.drawPlugin);
            this.mapModule.startPlugin(this.drawPlugin);

            this.mapModule.registerPlugin(this.drawFilterPlugin);
            this.mapModule.startPlugin(this.drawFilterPlugin);

            reqBuilder = sandbox.getRequestBuilder(rn);
            if (reqBuilder) {
                request = reqBuilder(
                    this.linkAction, this._getSearchResultAction(), this);
                sandbox.request(this.instance, request);
            }

            this.isStarted = true;
        },
        /**
         * Destroys the created components and unsets the class/instance variables.
         * 
         * @method destroy
         */
        destroy: function() {
            for (var p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.unregisterFromEventByName(this, p);
                }
            }

            this.stop();
            this._destroyFeatureLayer();

            this.view              = undefined;
            this.instance           = undefined;
            this.sandbox            = undefined;
            this.loc                = undefined;
            this.mapModule          = undefined;
            this.features           = undefined;
            this.featCounts         = undefined;
            this.panel              = undefined;
            this.drawPluginId       = undefined;
            this.drawPlugin         = undefined;
            this.drawFilterPluginId = undefined;
            this.drawFilterPlugin   = undefined;
            this.layerType          = undefined;
            this.linkAction         = undefined;
            this.isStarted          = undefined;
        },
        /**
         * Removes the feature layer, stops the draw plugin and
         * restarts all other draw plugins.
         * 
         * @method stop
         */
        stop: function() {
            var sandbox = this.sandbox,
                rn = 'Search.RemoveSearchResultActionRequest',
                reqBuilder,
                request;

            // Already stopped so nothing to do here
            if (!this.isStarted) return;

            this.mapModule.stopPlugin(this.drawPlugin);
            this.mapModule.unregisterPlugin(this.drawPlugin);

            this.mapModule.stopPlugin(this.drawFilterPlugin);
            this.mapModule.unregisterPlugin(this.drawFilterPlugin);

            this.mapModule.getMap().removeLayer(this.featureLayer);
            this._toggleDrawPlugins(true);
            this._toggleDrawFilterPlugins(true);

            reqBuilder = sandbox.getRequestBuilder(rn);
            if (reqBuilder) {
                request = reqBuilder(this.linkAction);
                sandbox.request(this.instance, request);
            }

            this.isStarted = false;
        },
        /**
         * Returns the feature object by its id.
         * 
         * @method findFeatureById
         * @param  {String} id
         * @return {Object}
         */
        findFeatureById: function(id) {
            return _.find(this.getFeatures(), function(feature) {
                return feature.getId() === id;
            });
        },
        /**
         * Adds the given geometry to the feature layer
         * and to the internal list of features.
         * 
         * @method addGeometry
         * @private
         * @param {OpenLayers.Geometry} geometry
         * @param {String} name optional name for the temp feature
         */
        addGeometry: function(geometry, name) {
            var mode = this._getDrawModeFromGeometry(geometry),
                feature;

            if (mode) {
                var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                style.fillOpacity = 0.7;
                style.graphicOpacity = 1;
                style.strokeWidth = 2;
                style.strokeColor = "#000000";
                style.strokeOpacity = 1;
                feature = new OpenLayers.Feature.Vector(geometry,null,style);
                this.getFeatures().push(
                    this._createFakeLayer(feature.id, mode, name)
                );

                if (this.featureLayer) {
                    this.featureLayer.addFeatures([feature]);
                }

                this.view.refreshAnalyseData(feature.id);
            }
        },
        /**
         * Removes the feature by given id from the feature layer
         * and from the internal feature list.
         * 
         * @method removeGeometry
         * @param  {String} id
         */
        removeGeometry: function(id) {
            var arr = this.features || [],
                i,
                arrLen,
                feature;

            for (i = 0, arrLen = arr.length; i < arrLen; ++i) {
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

        /*
         *******************
         * PRIVATE METHODS *
         *******************
         */

        /**
         * Creates the content layer selection panel for analyse
         * 
         * @method _createPanel
         * @private
         * @param {Object} loc
         * @return {Oskari.userinterface.component.AccordionPanel}
         *         Returns the created panel
         */
        _createPanel: function (loc) {
            var panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'),
                panelContainer = panel.getContainer(),
                layersCont = jQuery(this._templates.layersContainer).clone(),
                tooltipCont = jQuery(this._templates.help).clone();

            panel.setTitle(loc.content.label);
            tooltipCont.attr('title', loc.content.tooltip);

            panelContainer.append(tooltipCont);
            panelContainer.append(layersCont);
            panelContainer.append(this._createDataButtons(loc));
            panelContainer.append(this._createDrawButtons(loc));
            panelContainer.append(this._createDrawFilterButtons(loc));

            return panel;
        },
        /**
         * Creates and returns the draw plugin needed here.
         * 
         * @method _createDrawPlugin
         * @private
         * @return {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin}
         */
        _createDrawPlugin: function() {
            var drawPlugin = Oskari.clazz.create(
                    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', {
                        id: this.drawPluginId,
                        multipart: true
                    });
            
            return drawPlugin;
        },
        /**
         * Creates and returns the draw filter plugin needed here.
         *
         * @method _createDrawFilterPlugin
         * @private
         * @return {Oskari.mapframework.ui.module.common.geometryeditor.DrawFilterPlugin}
         */
        _createDrawFilterPlugin: function() {
            var drawFilterPlugin = Oskari.clazz.create(
                'Oskari.mapframework.ui.module.common.geometryeditor.DrawFilterPlugin', {
                    id: this.drawFilterPluginId
                });

            return drawFilterPlugin;
        },
        /**
         * Creates and returns the data button which opens the layer selector
         * and the search button which opens the search flyout.
         * 
         * @method _createDataButtons
         * @private
         * @param {Object} loc
         * @return {jQuery}
         */
        _createDataButtons: function(loc) {
            var me = this,
                buttons = jQuery(this._templates.buttons).clone(),
                dataButton = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'),
                searchButton = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button');

            dataButton.setTitle(loc.buttons.data);
            dataButton.addClass('primary');
            dataButton.setHandler(function () {
                me._openFlyoutAs('LayerSelector');
            });
            dataButton.insertTo(buttons);

            searchButton.setTitle(loc.content.search.title);
            searchButton.addClass('primary');
            searchButton.setHandler(function() {
                me._openFlyoutAs('Search');
            });
            searchButton.insertTo(buttons);

            return buttons;
        },
        /**
         * Creates and returns the draw buttons from which the user can draw
         * temporary features which can be used in analysis.
         * 
         * @method _createDrawButtons
         * @private
         * @param {Object} loc
         * @return {jQuery}
         */
        _createDrawButtons: function(loc) {
            var me = this,
                toolContainer = jQuery(this._templates.toolContainer).clone(),
                toolTemplate = jQuery(this._templates.tool),
                tools = ['point', 'line', 'area'];

            toolContainer.find('h4').html(loc.content.features.title);

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
        /**
         * Creates and returns the draw filter buttons from which the user can filter
         * by drawing which features are going to be used in analysis.
         *
         * @method _createDrawFilterButtons
         * @private
         * @param {Object} loc
         * @return {jQuery}
         */
        _createDrawFilterButtons: function(loc) {
            var me = this,
                drawFilterContainer = jQuery(this._templates.drawFilterContainer).clone(),
                drawFilterTemplate = jQuery(this._templates.drawFilter),
                drawFilters = ['point', 'line', 'edit', 'remove'];

            drawFilterContainer.find('h4').html(loc.content.drawFilter.title);

            return _.foldl(drawFilters, function(container, drawFilter) {
                var drawFilterDiv = drawFilterTemplate.clone();
                var groupName = 'analysis-selection-';
                drawFilterDiv.addClass(groupName + drawFilter);
                drawFilterDiv.addClass('disabled');
                drawFilterDiv.attr('title',me.loc.content.drawFilter.tooltip[drawFilter]);
                drawFilterDiv.click(function() {
                    if (jQuery(this).hasClass('disabled')) {
                        return;
                    }
                    me._startNewDrawFiltering({
                        mode: drawFilter,
                        sourceGeometry: me.getSelectedGeometry()
                    });
                });
                container.append(drawFilterDiv);
                return container;
            }, drawFilterContainer);
        },

        /**
         * Creates and returns the draw control buttons where the user
         * can either save or discard the drawn feature.
         * 
         * @method _createDrawControls
         * @private
         * @return {jQuery}
         */
        _createDrawControls: function () {
            var me = this,
                loc = this.loc.content.features.buttons,
                container = jQuery(this._templates.drawControls).clone(),
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            cancelBtn.setTitle(loc.cancel);
            cancelBtn.setHandler(function () {
                me._sendStopDrawRequest(true);
            });

            finishBtn.setTitle(loc.finish);
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me._sendStopDrawRequest(false);
            });

            cancelBtn.insertTo(container);
            finishBtn.insertTo(container);

            return container;
        },
        /**
         * Creates and returns the filter control buttons.
         *
         * @method _createDrawFilterControls
         * @private
         * @return {jQuery}
         */
        _createDrawFilterControls: function () {
            var me = this,
                loc = this.loc.content.drawFilter.buttons,
                container = jQuery(this._templates.drawFilterControls).clone(),
                finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            this.drawFilterMode = true;
            finishBtn.setTitle(loc.finish);
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me.drawFilterMode = false;
                // Disable all buttons
                me._disableAllDrawFilterButtons();
                me._sendStopDrawFilterRequest(false);
                me._activateWFSLayer(true);
                jQuery(this).remove();
            });

            finishBtn.insertTo(container);

            return container;
        },

        /**
         * Sends a request to open a Flyout impersonating
         * as the bundle provided in the name param.
         * 
         * @method _openFlyoutAs
         * @private
         * @param  {String} name
         */
        _openFlyoutAs: function(name) {
            var extension = {
                    getName: function () {
                        return name;
                    }
                },
                rn = 'userinterface.UpdateExtensionRequest';

            this.sandbox.postRequestByName(
                rn, [extension, 'attach', rn, '0', '424']);
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
            // Disable WFS highlight and GFI dialog
            this._activateWFSLayer(false);

            // notify plugin to start drawing new geometry
            this._sendDrawRequest(config);

            // remove old draw buttons and append new ones
            this.getPanelContainer()
                .find('div.toolContainer')
                .find('div.buttons').remove().end()
                .append(this._createDrawControls());
        },

        _startNewDrawFiltering: function (config) {
            var me = this;
            // Enable and disable correct buttons
            if (config.mode === "remove") {
                this._cancelDrawFilter();
            } else {
                // Enable only the remove button
                this._disableAllDrawFilterButtons();
                this._activateWFSLayer(false);
                jQuery('div.drawFilter.analysis-selection-remove').removeClass('disabled');
                jQuery('div.drawFilter.analysis-selection-'+config.mode).addClass('selected');
                // remove old draw buttons and append new ones
                this.getPanelContainer()
                    .find('div.drawFilterContainer')
                    .find('div.buttons').remove().end()
                    .append(this._createDrawFilterControls());
                // Create help dialog
                this.helpDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var diaLoc = this.loc.content.drawFilter.dialog;
                var controlButtons = [];
                var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                cancelBtn.setTitle(diaLoc.cancel);
                cancelBtn.setHandler(function() {
                    me._cancelDrawFilter();
                });
                cancelBtn.addClass('primary');
                controlButtons.push(cancelBtn);
                this.helpDialog.addClass("drawfilterdialog");
                this.helpDialog.show(diaLoc.modes[config.mode].title,diaLoc.modes[config.mode].message,controlButtons);
                this.helpDialog.moveTo('div.drawFilter.analysis-selection-'+config.mode, 'bottom');
            }

            // Disable WFS highlight and GFI dialog
            this._activateWFSLayer(false);

            // notify plugin to start draw filtering new geometries
            this._sendDrawFilterRequest(config);
        },

        _cancelDrawFilter: function() {
            this.drawFilterMode = false;
            this._sendStopDrawFilterRequest(true);
            this._disableAllDrawFilterButtons();
            this._activateWFSLayer(true);
            this.selectedGeometry = null;
            // Disable the remove button
            jQuery('div.drawFilter.analysis-selection-remove').addClass('disabled');
            // Remove the finish button
            this.getPanelContainer()
                .find('div.drawFilterContainer')
                .find('div.buttons').remove();
        },

        /**
         * Sends a StartDrawRequest with given params.
         * 
         * @method _sendDrawRequest
         * @private
         * @param {Object} config params for StartDrawRequest
         */
        _sendDrawRequest: function (config) {
            var sandbox = this.sandbox,
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
         * 
         * @method _sendStopDrawRequest
         * @private
         * @param {Boolean} isCancel boolean param for StopDrawingRequest, true == canceled, false = finish drawing (dblclick)
         */
        _sendStopDrawRequest: function (isCancel) {
            var sandbox = this.sandbox,
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
                    'DrawFilterPlugin.StartDrawFilteringRequest'),
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
                    'DrawFilterPlugin.StopDrawFilteringRequest'),
                request;

            if (reqBuilder) {
                request = reqBuilder(config);
                sandbox.request(this.instance, request);
            }
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
        _createFakeLayer: function(id, mode, name) {
            var loc = this.loc.content.features.modes,
                name = name || (loc[mode] + ' ' + (++this.featCounts[mode])),
                layerType = this.getLayerType(),
                featureLayer = this.featureLayer,
                formatter = new OpenLayers.Format.GeoJSON;

            return {
                getId: function() {
                    return id;
                },
                getName: function() {
                    return name;
                },
                isLayerOfType: function(type) {
                    return type === layerType;
                },
                getLayerType: function() {
                    return 'temp';
                },
                getMode: function() {
                    return mode;
                },
                hasFeatureData: function() {
                    return false;
                },
                getOpacity: function() {
                    return (featureLayer.opacity * 100);
                },
                getFeature: function() {
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
        /**
         * Creates the feature layer where the drawn features are added to
         * and adds it to the map.
         * 
         * @method _createFeatureLayer
         * @private
         * @return {OpenLayers.Layer.Vector}
         */
        _createFeatureLayer: function(mapModule) {
            var layer = new OpenLayers.Layer.Vector('AnalyseFeatureLayer');

            mapModule.getMap().addLayer(layer);

            return layer;
        },
        /**
         * Destroys the feature layer and removes it from the map.
         * 
         * @method _destroyFeatureLayer
         * @private
         */
        _destroyFeatureLayer: function() {
            var map = this.mapModule.getMap();

            if (this.featureLayer) {
                map.removeLayer(this.featureLayer);
                this.featureLayer.destroyFeatures();
                this.featureLayer.destroy();
                this.featureLayer = undefined;
            }
        },
        /**
         * Either starts or stops draw plugins which are added to the map module
         * (except the one created in this class).
         * 
         * @method _toggleDrawPlugins
         * @private
         * @param  {Boolean} enabled
         */
        _toggleDrawPlugins: function(enabled) {
            var me = this,
                sandbox = this.sandbox,
                mapModule = this.mapModule,
                drawPlugins = _.filter(mapModule.getPluginInstances(), function(plugin) {
                    return (plugin.getName().match(/DrawPlugin$/) &&
                            plugin.getName() !== me.drawPlugin.getName());
                });

            _.each(drawPlugins, function(plugin) {
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
        _toggleDrawFilterPlugins: function(enabled) {
            var me = this,
                sandbox = this.sandbox,
                mapModule = this.mapModule,
                drawFilterPlugins = _.filter(mapModule.getPluginInstances(), function(plugin) {
                    return (plugin.getName().match(/DrawFilterPlugin$/) &&
                        plugin.getName() !== me.drawFilterPlugin.getName());
                });

            _.each(drawFilterPlugins, function(plugin) {
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
        _getSearchResultAction: function() {
            var me = this;

            return function(result) {
                return function() {
                    var geometry = new OpenLayers.Geometry.Point(
                            result.lon, result.lat),
                        name = (result.name + ' (' + result.village + ')');

                    me.addGeometry(geometry, name);
                };
            };
        },

        _operateDrawFilters: function() {
            var preSelector = 'div.drawFilter.analysis-selection-';
            var pointButton = jQuery(preSelector+'point');
            var lineButton = jQuery(preSelector+'line');
            var editButton = jQuery(preSelector+'edit');
            var removeButton = jQuery(preSelector+'remove');

            if ((typeof this.selectedGeometry === "undefined")||(this.selectedGeometry === null)) {
                // Disable all buttons
                this._disableAllDrawFilterButtons();
                return;
            }
            var type = this.selectedGeometry.geometry.CLASS_NAME;
            // Enable or disable buttons depending on the selected feature type
            switch(type) {
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

        _disableAllDrawFilterButtons: function() {
            jQuery('div.drawFilter').addClass('disabled');
            jQuery('div.drawFilter').removeClass('selected');
            // Close the help dialog
            if (this.helpDialog) {
                this.helpDialog.close(true);
            }
        },

        _activateWFSLayer: function(activate) {
            var sandbox = this.sandbox,
                evtB = sandbox.getEventBuilder(
                    'DrawFilterPlugin.SelectedDrawingEvent'),
                gfiReqBuilder = sandbox.getRequestBuilder(
                    'MapModulePlugin.GetFeatureInfoActivationRequest'),
                hiReqBuilder = sandbox.getRequestBuilder(
                    'WfsLayerPlugin.ActivateHighlightRequest');

            // notify components to reset any saved "selected place" data
            if (evtB) sandbox.notifyAll(evtB());

            // enable or disable gfi requests
            if (gfiReqBuilder) {
                sandbox.request(this.instance, gfiReqBuilder(activate));
            }

            // enable or disable wfs highlight
            if (hiReqBuilder) {
                sandbox.request(this.instance, hiReqBuilder(activate));
            }
        }
});
