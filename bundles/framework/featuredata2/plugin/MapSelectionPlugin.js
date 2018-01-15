/**
 * @class Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin
 *
 * Provides functionality to draw a selection box on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin',
    function (config, sandbox) {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin';
        me._name = 'MapSelectionPlugin';
        if( config.instance ) {
            me.caller = config.instance;
        }
        me.drawControls = null;
        me.editMode = false;
        me.currentDrawMode = null;
        me.prefix = 'Default.';
        me.sandbox = sandbox;
        me.WFSLayerService = me.sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
        me._features = null;
        me._drawing = null;

        if (me._config && me._config.id) {
            me.prefix = me._config.id + '.';
        }
        // graphicFill, instance
        if (me._config && me._config.graphicFill) {
            me.graphicFill = me._config.graphicFill;
        }
        me.multipart = (me._config && me._config.multipart === true);
        Oskari.makeObservable(this);
    }, {
        DRAW_REQUEST_ID: 'FeatureData.featureselection',
        /**
         * @method startDrawing
         * Activates the selection tool
         * @params {String} includes drawMode, geometry and style
         */
        startDrawing: function (params) {
            //Set the flag for the mediator to know that no gfi-popups are allowed until the popup is closed...
            this.WFSLayerService.setSelectionToolsActive(true);
            this._toggleControl(params.drawMode);
        },
        clearDrawing: function() {
            var me = this;
            var sb = this.getSandbox();
            sb.postRequestByName('DrawTools.StopDrawingRequest', [
                    me.DRAW_REQUEST_ID,
                    true,
                    true
            ]);
        },
        /**
         * @method stopDrawing
         * Disables all draw controls and
         * clears the layer of any drawn features
         */
        stopDrawing: function () {
            this.clearDrawing();
            // disable all draw controls
            this._toggleControl();
        },

        /**
         * @method _toggleControl
         * Enables the given draw control
         * Disables all the other draw controls
         * @param {String} drawMode draw control to activate (if undefined, disables all
         * controls)
         * @private
         */
        _toggleControl: function (drawMode) {
            var key,
                control;
            this.currentDrawMode = drawMode;
            for (key in this.drawControls) {
                if (this.drawControls.hasOwnProperty(key)) {
                    control = this.drawControls[key];
                    if (this.currentDrawMode === key) {
                        control();
                    } else {
                    }
                }
            }
        },

        /**
         * Initializes the plugin:
         * - drawControls
         * - registers for listening to requests
         * @param sandbox reference to Oskari sandbox
         * @method
         */
        _initImpl: function () {
            var me = this;
            var sb = this.getSandbox();

            me.drawControls = {
                point: function() {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'Point'
                    ]);
                },
                line: function() {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'LineString'
                    ]);
                },
                polygon: function() {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'Polygon'
                    ]);
                },
                square: function() {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'Square'
                    ]);
                },
                circle: function() {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'Circle'
                    ]);
                }
            };
        },
        /**
         * @Return the drawn geometry from the draw layer from drawing event
         * @method setDrawing
         */
        setDrawing: function (drawing) {
            this._drawing = drawing;
        },
        /**
         * @Return the drawn geometry from the draw layer
         * @method getDrawing
         */
        getDrawing: function () {
            return this._drawing;
        },
        /**
         * @method setFeatures
         * @param features Features from the drawing event when drawing is finished
         */
        setFeatures: function(features) {
            this._features = features;
        },
        /**
         * @Return {String} the drawn geometry from the draw layer
         * @method getFeatures
         */
        getFeatures: function () {
            return this._features;
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