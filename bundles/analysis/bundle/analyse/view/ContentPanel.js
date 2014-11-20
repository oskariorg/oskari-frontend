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

        me.init(view);
        me.start();
    }, {
        /**
         * @static
         * @property _templates
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
            search: '<div class="analyse-search"></div>'
        },
        /**
         * @method getDataPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getDataPanel: function () {
            return this.dataPanel;
        },
        getDrawToolsPanel: function () {
            return this.drawToolsPanel;
        },
        /**
         * Returns the container where all the stuff is.
         *
         * @method getDataPanelContainer
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
         * @return {String}
         */
        getName: function () {
            return this.instance.getName() + 'ContentPanel';
        },
        /**
         * Returns a list of all temporary features added.
         *
         * @method getFeatures
         * @return {Object[]}
         */
        getFeatures: function () {
            return this.features;
        },
        /**
         * Returns a geometry selected by the user.
         *
         * @method getSelectedGeometry
         * @return {Object[]}
         */
        getSelectedGeometry: function () {
            return this.selectedGeometry;
        },
        /**
         * Returns the element which the layer list is rendered into.
         *
         * @method getLayersContainer
         * @return {jQuery}
         */
        getLayersContainer: function () {
            return this.getDataPanelContainer().find('div.layers');
        },
        /**
         * Returns the type of the layer we fake here for the temporary features.
         *
         * @method getLayerType
         * @return {String}
         */
        getLayerType: function () {
            return this.layerType;
        },
        /**
         * Empties the layer list.
         *
         * @method emptyLayers
         */
        emptyLayers: function () {
            this.getLayersContainer().empty();
        },
        /**
         * @method onEvent
         * @param  {Oskari.Event} event
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(this, [event]);
            }
        },
        /**
         * @static
         * @property eventHandlers
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

            WFSFeatureGeometriesEvent: function (event) {
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
                    var data = clickedGeometry[1],
                        wkt = new OpenLayers.Format.WKT(),
                        feature = wkt.read(data),
                        gcn = feature.geometry.CLASS_NAME;

                    if (gcn === 'OpenLayers.Geometry.LineString') {
                        this.selectedGeometry = new OpenLayers.Feature.Vector(
                            feature.geometry
                        );
                    } else if (gcn === 'OpenLayers.Geometry.MultiPolygon') {
                        this.selectedGeometry = new OpenLayers.Feature.Vector(
                            feature.geometry
                        );
                    } else if (gcn === 'OpenLayers.Geometry.Polygon') {
                        this.selectedGeometry = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.MultiPolygon(
                                [feature.geometry]
                            )
                        );
                    }
                    this._operateDrawFilters();
                }
            },

            WFSFeaturesSelectedEvent: function (event) {
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
        init: function (view) {
            var me = this,
                p;

            me.view = view;
            me.instance = me.view.instance;
            me.sandbox = me.instance.getSandbox();
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
            me.dataPanel = me._createDataPanel(me.loc);
            me.drawToolsPanel = me._createDrawToolsPanel(me.loc);
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
         * Adds the feature layer to the map, stops all other draw plugins
         * and starts the draw plugin needed here.
         *
         * @method start
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

            me._toggleDrawPlugins(false);
            me._toggleDrawFilterPlugins(false);
            me.mapModule.getMap().addLayer(me.featureLayer);

            me.mapModule.registerPlugin(me.drawPlugin);
            me.mapModule.startPlugin(me.drawPlugin);

            me.mapModule.registerPlugin(me.drawFilterPlugin);
            me.mapModule.startPlugin(me.drawFilterPlugin);

            reqBuilder = sandbox.getRequestBuilder(rn);
            if (reqBuilder) {
                request = reqBuilder(
                    me.linkAction, me._getSearchResultAction(), me);
                sandbox.request(me.instance, request);
            }

            me.isStarted = true;
        },
        /**
         * Destroys the created components and unsets the class/instance variables.
         *
         * @method destroy
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
         * Removes the feature layer, stops the draw plugin and
         * restarts all other draw plugins.
         *
         * @method stop
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

            me.mapModule.stopPlugin(me.drawPlugin);
            me.mapModule.unregisterPlugin(me.drawPlugin);

            me.mapModule.stopPlugin(me.drawFilterPlugin);
            me.mapModule.unregisterPlugin(me.drawFilterPlugin);

            me.mapModule.getMap().removeLayer(me.featureLayer);
            me._toggleDrawPlugins(true);
            me._toggleDrawFilterPlugins(true);

            reqBuilder = sandbox.getRequestBuilder(rn);
            if (reqBuilder) {
                request = reqBuilder(me.linkAction);
                sandbox.request(me.instance, request);
            }

            me.isStarted = false;
        },
        /**
         * Returns the feature object by its id.
         *
         * @method findFeatureById
         * @param  {String} id
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
         * Adds the given geometry to the feature layer
         * and to the internal list of features.
         *
         * @method addGeometry
         * @private
         * @param {OpenLayers.Geometry} geometry
         * @param {String} name optional name for the temp feature
         */
        addGeometry: function (geometry, name) {
            var feature,
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
                feature = new OpenLayers.Feature.Vector(geometry, null, style);
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

        /*
         *******************
         * PRIVATE METHODS *
         *******************
         */

        /**
         * Creates the content layer selection panel for analyse
         *
         * @method _createDataPanel
         * @private
         * @param {Object} loc
         * @return {Oskari.userinterface.component.AccordionPanel}
         *         Returns the created panel
         */
        _createDataPanel: function (loc) {
            var panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                ),
                panelHeader = panel.getHeader(),
                panelContainer = panel.getContainer(),
                layersCont = jQuery(this._templates.layersContainer).clone(),
                tooltipCont = jQuery(this._templates.help).clone();

            panel.setTitle(loc.content.label);
            tooltipCont.attr('title', loc.content.tooltip);
            tooltipCont.addClass('header-icon-info');

            panelHeader.append(tooltipCont);
            panelContainer.append(layersCont);
            panelContainer.append(this._createDataButtons(loc));

            return panel;
        },
        _createDrawToolsPanel: function (loc) {
            var panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                ),
                panelHeader = panel.getHeader(),
                panelContainer = panel.getContainer(),
                tooltipCont = jQuery(this._templates.help).clone();

            panel.setTitle(loc.content.drawToolsLabel);
            tooltipCont.attr('title', loc.content.drawToolsTooltip);
            tooltipCont.addClass('header-icon-info');

            panelHeader.append(tooltipCont);
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
        _createDrawPlugin: function () {
            var drawPlugin = Oskari.clazz.create(
                'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin',
                {
                    id: this.drawPluginId,
                    multipart: true
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
         * Creates and returns the data button which opens the layer selector
         * and the search button which opens the search flyout.
         *
         * @method _createDataButtons
         * @private
         * @param {Object} loc
         * @return {jQuery}
         */
        _createDataButtons: function (loc) {
            var me = this,
                buttons = jQuery(this._templates.buttons).clone(),
                dataButton = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                searchButton = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                );

            dataButton.setId(
                'oskari_analysis_analyse_view_analyse_buttons_data'
            );
            dataButton.setTitle(loc.buttons.data);
            dataButton.addClass('primary');
            dataButton.setHandler(function () {
                me._openFlyoutAs('LayerSelector');
            });
            dataButton.insertTo(buttons);

            searchButton.setId(
                'oskari_analysis_analyse_view_analyse_content_search_title'
            );
            searchButton.setTitle(loc.content.search.title);
            searchButton.addClass('primary');
            searchButton.setHandler(function () {
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
        _createDrawButtons: function (loc) {
            var me = this,
                toolContainer = jQuery(this._templates.toolContainer).clone(),
                toolTemplate = jQuery(this._templates.tool),
                tools = ['point', 'line', 'area'];

            toolContainer.find('h4').html(loc.content.features.title);

            return _.foldl(tools, function (container, tool) {
                var toolDiv = toolTemplate.clone();
                toolDiv.addClass('add-' + tool);
                toolDiv.attr({
                    'title': loc.content.features.tooltips[tool],
                    'id': 'oskari_analysis_analyse_view_analyse_content_features_' + tool
                });
                toolDiv.click(function () {
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
        _createDrawFilterButtons: function (loc) {
            var me = this,
                drawFilterContainer = jQuery(me._templates.drawFilterContainer).clone(),
                drawFilterTemplate = jQuery(me._templates.drawFilter),
                drawFilters = ['point', 'line', 'edit'];

            drawFilterContainer.find('h4').html(loc.content.drawFilter.title);

            return _.foldl(drawFilters, function (container, drawFilter) {
                var drawFilterDiv = drawFilterTemplate.clone(),
                    groupName = 'analysis-selection-';
                drawFilterDiv.addClass(groupName + drawFilter);
                drawFilterDiv.addClass('disabled');
                drawFilterDiv.attr('title', me.loc.content.drawFilter.tooltip[drawFilter]);
                drawFilterDiv.click(function () {
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
         * @return {Oskari.userinterface.component.Button[]}
         */
        _createDrawControls: function () {
            var me = this,
                loc = this.loc.content.features.buttons,
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'),
                finishBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                );

            cancelBtn.setId(
                'oskari_analysis_analyse_view_analyse_content_features_cancel'
            );
            cancelBtn.setHandler(function () {
                me._sendStopDrawRequest(true);
                me._closeHelpDialog();
                me._activateWFSLayer(true);
            });

            finishBtn.setTitle(loc.finish);
            finishBtn.setId(
                'oskari_analysis_analyse_view_analyse_content_features_finish'
            );
            finishBtn.addClass('primary');
            finishBtn.setHandler(function () {
                me._sendStopDrawRequest(false);
                me._closeHelpDialog();
                me._activateWFSLayer(true);
            });

            return [cancelBtn, finishBtn];
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
            var controlButtons = this._createDrawControls(),
                loc = this.loc.content.drawDialog,
                dialogTitle = loc[config.drawMode].title,
                dialogText = loc[config.drawMode].add;

            // Disable WFS highlight and GFI dialog
            this._activateWFSLayer(false);

            // notify plugin to start drawing new geometry
            this._sendDrawRequest(config);

            this.helpDialog = Oskari.clazz.create(
                'Oskari.userinterface.component.Popup');
            this.helpDialog.show(dialogTitle, dialogText, controlButtons);
            this.helpDialog.addClass('analyse-draw-dialog');
            this.helpDialog.
            moveTo('div.tool.add-' + config.drawMode, 'bottom');
        },

        _startNewDrawFiltering: function (config) {
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
                this._activateWFSLayer(false);
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
            this._activateWFSLayer(false);

            // notify plugin to start draw filtering new geometries
            this._sendDrawFilterRequest(config);
        },

        _cancelDrawFilter: function () {
            this.drawFilterMode = false;
            this._sendStopDrawFilterRequest(true);
            this._disableAllDrawFilterButtons();
            this._activateWFSLayer(true);
            this.selectedGeometry = null;
            // Disable the remove button
            jQuery('div.drawFilter.analysis-selection-remove').addClass('disabled');
            // Remove the finish button
            this.getDrawToolsPanelContainer()
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
                    'DrawPlugin.StartDrawingRequest'
                ),
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
                reqBuilder = sandbox.getRequestBuilder(
                    'DrawPlugin.StopDrawingRequest'
                ),
                request;

            this.getDrawToolsPanelContainer()
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
         * Either starts or stops draw plugins which are added to the map module
         * (except the one created in this class).
         *
         * @method _toggleDrawPlugins
         * @private
         * @param  {Boolean} enabled
         */
        _toggleDrawPlugins: function (enabled) {
            var me = this,
                sandbox = me.sandbox,
                mapModule = me.mapModule,
                drawPlugins = _.filter(
                    mapModule.getPluginInstances(),
                    function (plugin) {
                        return (plugin.getName().match(/DrawPlugin$/) &&
                            plugin.getName() !== me.drawPlugin.getName());
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
                sandbox = this.sandbox,
                mapModule = this.mapModule,
                drawFilterPlugins = _.filter(
                    mapModule.getPluginInstances(),
                    function (plugin) {
                        return (plugin.getName().match(/DrawFilterPlugin$/) &&
                            plugin.getName() !== me.drawFilterPlugin.getName());
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
            this._closeHelpDialog();
        },

        _closeHelpDialog: function () {
            if (this.helpDialog) {
                this.helpDialog.close(true);
            }
        },

        _activateWFSLayer: function (activate) {
            var sandbox = this.sandbox,
                evtB = sandbox.getEventBuilder(
                    'DrawFilterPlugin.SelectedDrawingEvent'
                ),
                gfiReqBuilder = sandbox.getRequestBuilder(
                    'MapModulePlugin.GetFeatureInfoActivationRequest'
                ),
                hiReqBuilder = sandbox.getRequestBuilder(
                    'WfsLayerPlugin.ActivateHighlightRequest'
                );

            // notify components to reset any saved "selected place" data
            if (evtB) {
                sandbox.notifyAll(evtB());
            }

            // enable or disable gfi requests
            if (gfiReqBuilder) {
                sandbox.request(this.instance, gfiReqBuilder(activate));
            }

            // enable or disable wfs highlight
            if (hiReqBuilder) {
                sandbox.request(this.instance, hiReqBuilder(activate));
            }
        }
    }
);
