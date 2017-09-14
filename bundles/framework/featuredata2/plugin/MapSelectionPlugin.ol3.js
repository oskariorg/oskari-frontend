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
        me._currentRequestID = null;
        me._features;
        me._drawing;

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
        getCurrentDrawReqId: function () {
            return this._currentRequestID;
        },
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
                    me.getCurrentDrawReqId(),
                    true,
                    false
            ]);
        },
        /**
         * @method stopDrawing
         * Disables all draw controls and
         * clears the layer of any drawn features
         * @params {Boolean} remove active draw tool
         */
        stopDrawing: function (removeActive) {
            this.WFSLayerService.setSelectionToolsActive(false);
            removeActive === true ? this.removeActiveClass() : this.clearDrawing();
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
         * @method removeActiveClass
         * triggers the click event on the button container in PopupHandler after draw has ended to deselct the drawing tool
         */
        removeActiveClass: function () {
            if( this.caller ) {
                this.caller.btnContainer.trigger("click", true);
            } else {
                Oskari.log(this.getName() + " no caller provided in configuration.");
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
                    me._currentRequestID = me.getName() +'PointDrawRequest';
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                    me.getName() +'PointDrawRequest', 
                    'Point'
                    ]
                )},
                line: function() {
                    me._currentRequestID = me.getName() +'LineStringDrawRequest';
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                    me.getName() +'LineStringDrawRequest', 
                    'LineString'
                    ]
                )},
                polygon: function() {
                    me._currentRequestID = me.getName() +'PolygonDrawRequest';
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                    me.getName() +'PolygonDrawRequest', 
                    'Polygon'
                ])},
                square: function() {
                    me._currentRequestID = me.getName() +'SquareDrawRequest';
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                    me.getName() +'SquareDrawRequest', 
                    'Square'
                    ]
                )},
                circle: function() {
                    me._currentRequestID = me.getName() +'CircleDrawRequest';
                    sb.postRequestByName('DrawTools.StartDrawingRequest', [
                    me.getName() +'CircleDrawRequest', 
                    'Circle'
                    ]
                )}
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