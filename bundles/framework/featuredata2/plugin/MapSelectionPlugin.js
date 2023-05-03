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
        if (config.instance) {
            me.caller = config.instance;
        }
        me.drawControls = null;
        me.editMode = false;
        me.currentDrawMode = null;
        me.prefix = 'Default.';
        me.sandbox = sandbox;
        me.selectFromAllLayers = false;

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
            this._toggleControl(params.drawMode);
        },
        clearDrawing: function () {
            this.getSandbox().postRequestByName('DrawTools.StopDrawingRequest', [
                this.DRAW_REQUEST_ID,
                true,
                true
            ]);
        },
        /**
         * @method stopDrawing
         * Disables all draw controls and
         * clears the layer of any drawn features
         */
        stopDrawing: function (keepDrawMode = false) {
            this.clearDrawing();
            // disable all draw controls
            this._toggleControl(null, keepDrawMode);
        },
        setSelectFromAllLayers: function (selectAll) {
            this.selectFromAllLayers = selectAll;
        },
        isSelectFromAllLayers: function () {
            return this.selectFromAllLayers;
        },
        /**
         * @method _toggleControl
         * Enables the given draw control
         * Disables all the other draw controls
         * @param {String} drawMode draw control to activate (if undefined, disables all
         * controls)
         * @private
         */
        _toggleControl: function (drawMode, keepDrawMode = false) {
            var key,
                control;
            if (keepDrawMode && !drawMode) {
                // keep previous draw mode active
            } else {
                this.currentDrawMode = drawMode;
            }
            for (key in this.drawControls) {
                if (this.drawControls.hasOwnProperty(key)) {
                    control = this.drawControls[key];
                    if (this.currentDrawMode === key) {
                        control();
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
                point: function () {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'Point'
                    ]);
                },
                line: function () {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'LineString'
                    ]);
                },
                polygon: function () {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'Polygon'
                    ]);
                },
                square: function () {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'Square'
                    ]);
                },
                circle: function () {
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                        me.DRAW_REQUEST_ID,
                        'Circle'
                    ]);
                }
            };
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
