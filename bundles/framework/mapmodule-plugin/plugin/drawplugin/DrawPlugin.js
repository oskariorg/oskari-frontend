/**
 * @class Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin',
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin';
        me._name = 'DrawPlugin';

        me.drawControls = null;
        me.currentDrawing = null;
        me.drawLayer = null;
        me.editMode = false;
        me.currentDrawMode = null;
        me.prefix = 'DrawPlugin.';
        me.creatorId = undefined;
        var config = me.getConfig();
        if (config) {
            if (config.id) {
                // Note that the events and requests need to match the configured
                // prefix based on the id!
                me.prefix = config.id + '.';
                me.creatorId = config.id;
            }
            // graphicFill, instance
            if (config.graphicFill) {
                me.graphicFill = config.graphicFill;
            }
        }

        me.registerRequests = (config && config.requests !== false);
        me.multipart = (config && config.multipart === true);
    }, {
        __name: 'DrawPlugin',

        getName: function () {
            return this.prefix + this.pluginName;
        },

        /**
         * Enables the draw control for given params.drawMode.
         * Clears the layer of any previously drawn features.
         * TODO: draws the given params.geometry with params.style
         * @param params includes drawMode, geometry and style
         * @method
         */
        startDrawing: function (params) {
            this.getMapModule().bringToTop(this.drawLayer);
            // no harm in activating straight away
            this.modifyControls.modify.activate();
            if (params.isModify) {
                // preselect it for modification
                this.modifyControls.select.select(this.drawLayer.features[0]);

            } else {
                // Solve OL problem in select modify feature
                if(this.modifyControls.modify.feature){
                     this.modifyControls.modify.feature = null;
                }
                // remove possible old drawing
                this.drawLayer.destroyFeatures();


                if (params.geometry) {
                    // sent existing geometry == edit mode
                    this.editMode = true;
                    // add feature to draw layer
                    var features = [
                        new OpenLayers.Feature.Vector(params.geometry)
                    ];
                    this.drawLayer.addFeatures(features);
                    // preselect it for modification
                    this.modifyControls.select.select(
                        this.drawLayer.features[0]
                    );
                } else {
                    // otherwise activate requested draw control for new geometry
                    this.editMode = false;
                    this.toggleControl(params.drawMode);
                }
            }


        },
        /**
         * Disables all draw controls and
         * clears the layer of any drawn features
         * @method
         */
        stopDrawing: function () {
            // disable all draw controls
            this.toggleControl();
            // clear drawing
            this.currentDrawing = null;
            if (this.drawLayer) {
                this.drawLayer.destroyFeatures();
                // no harm in activating straight away
                this.modifyControls.modify.deactivate();
            }
        },

        forceFinishDraw: function () {
            var activeControls = this._getActiveDrawControls(),
                drawControls = this.drawControls,
                drawLayer = this.drawLayer;

            for (i = 0; i < activeControls.length; i += 1) {
                activeControl = activeControls[i];
                switch (activeControl) {
                    case 'point':
                        if(drawLayer.features.length === 0){
                            return;
                        }
                        break;
                    case 'line':
                        if (!drawControls.line.handler.line){
                            return;
                        }
                        if (drawControls.line.handler.line.geometry.components.length < 3 && drawLayer.features.length === 0) {
                            return;
                        }
                        break;
                    case 'area':
                        if (!drawControls.area.handler.polygon){
                            return;
                        }
                        components = drawControls.area.handler.polygon.geometry.components;
                        if (components[components.length - 1].components.length < 5 && drawLayer.features.length === 0) {
                            return;
                        }
                        break;
                }
            };
            try {
                //needed when preparing unfinished objects but causes unwanted features into the layer:
                //this.drawControls[this.currentDrawMode].finishSketch();
                this.finishedDrawing(true);
            } catch (error) {
                // happens when the sketch isn't even started -> reset state
                this.stopDrawing();
                var evtBuilder = this.getSandbox().getEventBuilder(
                    'DrawPlugin.SelectedDrawingEvent'
                );
                var event = evtBuilder(null, null, this.creatorId);
                this.getSandbox().notifyAll(event);
            }
        },

        /**
         * Called when drawing is finished.
         * Disables all draw controls and
         * sends a '[this.prefix] + FinishedDrawingEvent' with the drawn the geometry.
         * @method
         */
        finishedDrawing: function (isForced) {
            var me = this,
                activeControl,
                activeControls,
                components,
                drawControls = me.drawControls,
                i,
                lastIndex,
                sandbox = me.getSandbox(),
                evtBuilder,
                event;

            if (!me.multipart || isForced) {
                // not a multipart, stop editing
                activeControls = me._getActiveDrawControls();

                for (i = 0; i < activeControls.length; i += 1) {
                    activeControl = activeControls[i];
                    // only lines and polygons have the finishGeometry function
                    if (typeof drawControls[activeControl].handler.finishGeometry === 'function') {
                        // No need to finish geometry if already finished
                        switch (activeControl) {
                            case 'line':
                                if (drawControls.line.handler.line.geometry.components.length < 3) {
                                    continue;
                                }
                                break;
                            case 'area':
                                components = drawControls.area.handler.polygon.geometry.components;
                                if (components[components.length - 1].components.length < 5) {
                                    continue;
                                }
                                break;
                        }
                        drawControls[activeControl].handler.finishGeometry();
                    }
                }
                me.toggleControl();
            }

            if (!me.editMode) {
                // programmatically select the drawn feature ("not really supported by openlayers")
                // http://lists.osgeo.org/pipermail/openlayers-users/2009-February/010601.html
                lastIndex = me.drawLayer.features.length - 1;
                me.modifyControls.select.select(
                    me.drawLayer.features[lastIndex]
                );
            }

            if (!me.multipart || isForced) {
                evtBuilder = sandbox.getEventBuilder(
                    'DrawPlugin.FinishedDrawingEvent'
                );
                event = evtBuilder(
                    me.getDrawing(),
                    me.editMode,
                    me.creatorId
                );
            } else {
                evtBuilder = sandbox.getEventBuilder(
                    'DrawPlugin.AddedFeatureEvent'
                );
                event = evtBuilder(
                    me.getDrawing(),
                    me.currentDrawMode,
                    me.creatorId
                );
            }
            sandbox.notifyAll(event);
        },

        /**
         * Enables the given draw control
         * Disables all the other draw controls
         * @param drawMode draw control to activate (if undefined, disables all
         * controls)
         * @method
         */
        toggleControl: function (drawMode) {
            var key,
                control,
                activeDrawing,
                event;

            this.currentDrawMode = drawMode;

            for (key in this.drawControls) {
                if (this.drawControls.hasOwnProperty(key)) {
                    control = this.drawControls[key];
                    if (drawMode === key) {
                        control.activate();
                    } else {
                        control.deactivate();
                    }
                }
            }
        },

        /**
         * @private @method _initImpl
         * Initializes the plugin:
         * - layer that is used for drawing
         * - drawControls
         * - registers for listening to requests
         *
         *
         */
        _initImpl: function () {
            var me = this,
                geodesic = me.getConfig().geodesic === undefined ? true : me.getConfig().geodesic,
                key;

            me.drawLayer = new OpenLayers.Layer.Vector(
                me.prefix + 'DrawLayer', {
                    /*style: {
                     strokeColor: "#ff00ff",
                     strokeWidth: 3,
                     fillOpacity: 0,
                     cursor: "pointer"
                     },*/
                    eventListeners: {
                        featuresadded: function (layer) {
                            // send an event that the drawing has been completed
                            me.finishedDrawing();
                        },
                        vertexmodified: function (event) {
                            me._sendActiveGeometry(event.feature.geometry);
                        }
                    }
                });

            me.drawControls = {
                point: new OpenLayers.Control.DrawFeature(
                    me.drawLayer,
                    OpenLayers.Handler.Point
                ),
                line: new OpenLayers.Control.DrawFeature(
                    me.drawLayer,
                    OpenLayers.Handler.Path,
                    {
                        callbacks: {
                            modify: function (geom, feature) {
                                me._sendActiveGeometry(
                                    me.getActiveDrawing(feature.geometry),
                                    'line'
                                );
                            }
                        },
                        geodesic: geodesic
                    }
                ),
                area: new OpenLayers.Control.DrawFeature(
                    me.drawLayer,
                    OpenLayers.Handler.Polygon,
                    {
                        callbacks: {
                            modify: function (geom, feature) {
                                me._sendActiveGeometry(
                                    me.getActiveDrawing(feature.geometry),
                                    'area'
                                );
                            }
                        },
                        handlerOptions: {
                            holeModifier: 'altKey'
                        },
                        geodesic: geodesic
                    }
                ),
                /*cut : new OpenLayers.Control.DrawFeature(me.drawLayer,
                                                          OpenLayers.Handler.Polygon,
                                                          {handlerOptions:{drawingHole: true}}),*/
                box: new OpenLayers.Control.DrawFeature(
                    me.drawLayer,
                    OpenLayers.Handler.RegularPolygon,
                    {
                        geodesic: geodesic,
                        handlerOptions: {
                            sides: 4,
                            irregular: true
                        }
                    }
                )
            };

            if (me.graphicFill !== null && me.graphicFill !== undefined) {
                var str = this.graphicFill,
                    format = new OpenLayers.Format.SLD(),
                    obj = format.read(str),
                    p;

                if (obj && obj.namedLayers) {
                    for (p in obj.namedLayers) {
                        if (obj.namedLayers.hasOwnProperty(p)) {
                            me.drawLayer.styleMap.styles['default'] = obj.namedLayers[p].userStyles[0];
                            me.drawLayer.redraw();
                            break;
                        }
                    }
                }
            }

            // doesn't really need to be in array, but lets keep it for future development
            me.modifyControls = {
                modify: new OpenLayers.Control.ModifyFeature(me.drawLayer, {
                    standalone: true
                })
            };

            me.modifyControls.select = new OpenLayers.Control.SelectFeature(
                me.drawLayer,
                {
                    onBeforeSelect: me.modifyControls.modify.beforeSelectFeature,
                    onSelect: me.modifyControls.modify.selectFeature,
                    onUnselect: me.modifyControls.modify.unselectFeature,
                    scope: me.modifyControls.modify
                }
            );


            me.getMap().addLayers([me.drawLayer]);
            for (key in me.drawControls) {
                if (me.drawControls.hasOwnProperty(key)) {
                    me.getMap().addControl(me.drawControls[key]);
                }
            }
            for (key in me.modifyControls) {
                if (me.modifyControls.hasOwnProperty(key)) {
                    me.getMap().addControl(me.modifyControls[key]);
                }
            }
        },

        _createRequestHandlers: function () {
            var me = this,
                sandbox = me.getSandbox();

            if(!me.registerRequests) {
                return {};
            }

            return {
                'DrawPlugin.StartDrawingRequest': Oskari.clazz.create(
                    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StartDrawingRequestPluginHandler',
                    sandbox,
                    me
                ),
                'DrawPlugin.StopDrawingRequest': Oskari.clazz.create(
                    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StopDrawingRequestPluginHandler',
                    sandbox,
                    me
                ),
                'DrawPlugin.GetGeometryRequest': Oskari.clazz.create(
                    'Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.GetGeometryRequestPluginHandler',
                    sandbox,
                    me
                )
            };
        },


        /**
         * Returns the drawn geometry from the draw layer
         * @method
         */
        getDrawing: function () {
            if (this.drawLayer.features.length === 0) {
                return null;
            }
            var featClass = this.drawLayer.features[0].geometry.CLASS_NAME;
            if ((featClass === 'OpenLayers.Geometry.MultiPoint') ||
                (featClass === 'OpenLayers.Geometry.MultiLineString') ||
                (featClass === 'OpenLayers.Geometry.MultiPolygon')) {
                return this.drawLayer.features[0].geometry;
            }
            var drawing = null,
                components = [],
                i,
                geom;

            for (i = 0; i < this.drawLayer.features.length; i += 1) {
                geom = this.drawLayer.features[i].geometry;
                // Remove unfinished polygons
                if (this._unfinishedPolygon(geom)) {
                    // Unfinished poly, ignore.
                } else {
                    components.push(geom);
                }
            }
            switch (featClass) {
                case 'OpenLayers.Geometry.Point':
                    drawing = new OpenLayers.Geometry.MultiPoint(components);
                    break;
                case 'OpenLayers.Geometry.LineString':
                    drawing = new OpenLayers.Geometry.MultiLineString(
                        components
                    );
                    break;
                case 'OpenLayers.Geometry.Polygon':
                    drawing = new OpenLayers.Geometry.MultiPolygon(components);
                    break;
            }
            this.currentDrawing = drawing;
            return drawing;
        },

        _unfinishedPolygon: function (geom) {
            return geom.CLASS_NAME === 'OpenLayers.Geometry.Polygon' &&
                geom.components.length &&
                geom.components[0].CLASS_NAME === 'OpenLayers.Geometry.LinearRing' &&
                geom.components[0].components.length < 4;
        },

        /**
         * Clones the drawing on the map and adds the geometry
         * currently being drawn to it.
         *
         * @method getActiveDrawing
         * @param  {OpenLayers.Geometry} geometry
         * @return {OpenLayers.Geometry}
         */
        getActiveDrawing: function (geometry) {
            var prevGeom = this.currentDrawing,
                composedGeom;

            if (prevGeom !== null && prevGeom !== undefined) {
                composedGeom = prevGeom.clone();
                composedGeom.addComponent(geometry);
                return composedGeom;
            }
            return geometry;
        },

        /**
         * Returns active draw control names
         * @method
         */
        _getActiveDrawControls: function () {
            var activeDrawControls = [],
                drawControl;
            for (drawControl in this.drawControls) {
                if (this.drawControls.hasOwnProperty(drawControl)) {
                    if (this.drawControls[drawControl].active) {
                        activeDrawControls.push(drawControl);
                    }
                }
            }
            return activeDrawControls;
        },

        _sendActiveGeometry: function (geometry, drawMode) {
            var eventBuilder = this.getSandbox().getEventBuilder(
                    'DrawPlugin.ActiveDrawingEvent'
                ),
                event,
                featClass;

            if (drawMode === null || drawMode === undefined) {
                featClass = geometry.CLASS_NAME;
                switch (featClass) {
                    case 'OpenLayers.Geometry.LineString':
                    case 'OpenLayers.Geometry.MultiLineString':
                        drawMode = 'line';
                        break;
                    case 'OpenLayers.Geometry.Polygon':
                    case 'OpenLayers.Geometry.MultiPolygon':
                        drawMode = 'area';
                        break;
                    default:
                        return;
                }
            }

            if (eventBuilder) {
                event = eventBuilder(geometry, drawMode, this.creatorId);
                this.getSandbox().notifyAll(event);
            }
        },


        _stopPluginImpl: function () {
            this.toggleControl();

            if (this.drawLayer) {
                this.drawLayer.destroyFeatures();
                this.getMap().removeLayer(this.drawLayer);
                this.drawLayer = undefined;
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
