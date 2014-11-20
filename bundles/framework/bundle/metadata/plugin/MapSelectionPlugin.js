/**
 * @class Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin
 *
 * Provides functionality to draw a selection box on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin',
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin';
        me._name = 'Metadata.MapSelectionPlugin';

        me.drawControls = null;
        me.drawLayer = null;
        me.listeners = [];
        me.currentDrawMode = null;
    }, {

        /**
         * @method addListener
         * Registers a listener that will be notified when a selection has been made.
         * The function will receive the selection geometry as parameter (OpenLayers.Geometry).
         * @param {Function} listenerFunction
         */
        addListener: function (listenerFunction) {
            this.listeners.push(listenerFunction);
        },

        /**
         * @method startDrawing
         * Clears previous selection and activates the selection tool
         */
        startDrawing: function () {
            // remove possible old drawing
            this.drawLayer.removeAllFeatures();
            // activate requested draw control for new geometry
            this._toggleControl('area');
        },

        /**
         * @method stopDrawing
         * Disables all draw controls and
         * clears the layer of any drawn features
         */
        stopDrawing: function () {
            // disable all draw controls
            this._toggleControl();
            // clear drawing
            this.drawLayer.removeAllFeatures();
        },

        /**
         * @method setDrawing
         * Sets an initial geometry
         */
        setDrawing: function (geometry) {
            var features = [new OpenLayers.Feature.Vector(geometry)];
            this.drawLayer.addFeatures(features);
        },

        /**
         * @method _finishedDrawing
         * Called when drawing is finished.
         * Disables all draw controls and
         * calls all listeners with the drawn the geometry.
         * @private
         */
        _finishedDrawing: function () {
            var geometry,
                event,
                i;

            this._toggleControl();
            geometry = this.getDrawing();
            for (i = 0; i < this.listeners.length; i += 1) {
                this.listeners[i](geometry);
            }
            // create event
            event = this.getSandbox().getEventBuilder(
                'Metadata.MapSelectionEvent'
            )(geometry);
            this.getSandbox().notifyAll(event);
        },

        /**
         * @method _toggleControl
         * Enables the given draw control
         * Disables all the other draw controls
         * @param drawMode draw control to activate (if undefined, disables all
         * controls)
         */
        _toggleControl: function (drawMode) {
            var control,
                key,
                me = this;

            me.currentDrawMode = drawMode;

            for (key in me.drawControls) {
                if (me.drawControls.hasOwnProperty(key)) {
                    control = me.drawControls[key];
                    if (drawMode === key) {
                        control.activate();
                    } else {
                        control.deactivate();
                    }
                }
            }
        },

        /**
         * Initializes the plugin:
         * - layer that is used for drawing
         * - drawControls
         * - registers for listening to requests
         * @method
         */
        _initImpl: function () {
            var key,
                me = this;

            me.drawLayer = new OpenLayers.Layer.Vector(
                'Metadata Draw Layer',
                {
                    /*style: {
                     strokeColor: "#ff00ff",
                     strokeWidth: 3,
                     fillOpacity: 0,
                     cursor: "pointer"
                     },*/
                    eventListeners: {
                        featuresadded: function (layer) {
                            // send an event that the drawing has been completed
                            me._finishedDrawing();
                        }
                    }
                }
            );

            me.drawControls = {
                area: new OpenLayers.Control.DrawFeature(
                    me.drawLayer,
                    OpenLayers.Handler.Polygon
                ),
                box: new OpenLayers.Control.DrawFeature(
                    me.drawLayer,
                    OpenLayers.Handler.RegularPolygon,
                    {
                        handlerOptions: {
                            sides: 4,
                            irregular: true
                        }
                    }
                )
            };

            me._map.addLayers([me.drawLayer]);
            for (key in me.drawControls) {
                if (me.drawControls.hasOwnProperty(key)) {
                    me.getMap().addControl(me.drawControls[key]);
                }
            }
        },

        /**
         * Returns the drawn geometry from the draw layer
         * @method
         */
        getDrawing: function () {
            return this.drawLayer.features[0].geometry;
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
    }
);
