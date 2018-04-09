/**
 * @class Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance
 *
 * See Oskari.tampere.bundle.content-editor.ContentEditorBundle for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function() {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.sideContentEditor = null;
        this.disabledLayers = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'ContentEditor',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function() {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function() {
            return this.sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function(key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method start
         * Implements BundleInstance protocol start method
         */
        start: function() {
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request,
                p;

            if (me.started) {
                return;
            }

            me.started = true;

            me.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());
            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            //Let's extend UI
            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            // draw ui
            me._createUi();

            // create request handlers
            me.showContentEditorRequestHandler = Oskari.clazz.create(
                'Oskari.tampere.bundle.content-editor.request.ShowContentEditorRequestHandler',
                me
            );

            // register request handlers
            sandbox.addRequestHandler(
                'ContentEditor.ShowContentEditorRequest',
                me.showContentEditorRequestHandler
            );

            this.__setupLayerTools();
        },

        /**
         * @method init
         * Implements Module protocol init method - does nothing atm
         */
        init: function() {
            return null;
        },

        /**
         * @method update
         * Implements BundleInstance protocol update method - does nothing atm
         */
        update: function() {

        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function(event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },

        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function() {
            return this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        },

        /**
         * Adds the Feature data tool for layer
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        __addTool: function(layerModel, suppressEvent) {
            var me = this;
            var service = this.getLayerService();
            if (typeof layerModel !== 'object') {
                // detect layerId and replace with the corresponding layerModel
                layerModel = service.findMapLayer(layerModel);
            }
            if (!layerModel || !layerModel.getPermission("EDIT_LAYER_CONTENT") || !layerModel.isLayerOfType("WFS")) {
                return;
            }

            // add feature data tool for layer
            var label = this.getLocalization('title') || {},
                tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName("content-editor");
            tool.setTitle(label);
            tool.setIconCls('show-content-editor-tool');
            tool.setTooltip(label);
            tool.setCallback(function() {
                me.sandbox.postRequestByName('ContentEditor.ShowContentEditorRequest', [layerModel.getId()]);
            });

            service.addToolForLayer(layerModel, tool, suppressEvent);
        },
        /**
         * Adds tools for all layers
         */
        __setupLayerTools: function() {
            var me = this;
            // add tools for feature data layers
            var service = this.getLayerService();
            var layers = service.getAllLayers();
            _.each(layers, function(layer) {
                me.__addTool(layer, true);
            });
            // update all layers at once since we suppressed individual events
            var event = me.sandbox.getEventBuilder('MapLayerEvent')(null, 'tool');
            me.sandbox.notifyAll(event);
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            GetInfoResultEvent: function(evt) {
                if (this.sideContentEditor != null) {
                    this.sideContentEditor._handleInfoResult(evt.getData());
                }
            },
            'DrawPlugin.FinishedDrawingEvent': function(evt) {
                if ('ContentEditorDrawPlugin' !== evt.getCreatorId()) {
                    return;
                }
                this.sideContentEditor.prepareRequest(evt.getDrawing());
            },
            WFSFeatureGeometriesEvent: function(evt) {
                if (this.sideContentEditor != null) {
                    this.sideContentEditor.ParseWFSFeatureGeometries(evt);
                }
            },
            'MapClickedEvent': function(event) {
                if (this.sideContentEditor != null) {
                    this.sideContentEditor.setClickCoords({
                        x: event.getLonLat().lon,
                        y: event.getLonLat().lat
                    });
                }
            },
            'MapLayerEvent': function(event) {
                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }
                if (event.getLayerId()) {
                    this.__addTool(event.getLayerId());
                } else {
                    // ajax call for all layers
                    this.__setupLayerTools();
                }
            }
        },
        /**
         * @method stop
         * Implements BundleInstance protocol stop method
         */
        stop: function() {
            var sandbox = this.sandbox(),
                request,
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         */
        startExtension: function() {},
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout
         */
        stopExtension: function() {},
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout
         */
        getPlugins: function() {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function() {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function() {
            return this.getLocalization('desc');
        },
        /**
         * @method _createUi
         * @private
         * (re)creates the UI
         */
        _createUi: function() {},

        /**
         * @method setEditorMode
         *
         * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
         * @param {string} layerId
         */
        setEditorMode: function(blnEnabled, layerId) {
            var me = this,
                map = jQuery('#contentMap'),
                request;
            if (blnEnabled) {
                me.oskariLang = Oskari.getLang();

                map.addClass('mapContentEditorMode');
                me.sandbox.mapMode = 'mapContentEditorMode';

                me.sideContentEditor = Oskari.clazz.create(
                    'Oskari.tampere.bundle.content-editor.view.SideContentEditor',
                    me,
                    me.getLocalization('ContentEditorView'),
                    layerId
                );
                me.sideContentEditor.render(map);
            } else {
                jQuery('#contentMap').width('');
                jQuery('.oskariui-left')
                    .css({
                        'width': '',
                        'height': '',
                        'float': ''
                    })
                    .empty();
                jQuery('.oskariui-center').css({
                    'width': '100%',
                    'float': ''
                });


                Oskari.setLang(me.oskariLang);
                if (me.sideContentEditor) {
                    me.sideContentEditor.destroy();
                }
                // first return all needed plugins before adding the layers back
                map.removeClass('mapContentEditorMode');
                if (me.sandbox._mapMode === 'mapContentEditorMode') {
                    delete me.sandbox._mapMode;
                }

                request = me.sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(me, 'close', me.getName());
                me.sandbox.request(me.getName(), request);

            }

            me.sandbox.postRequestByName('MapFull.MapSizeUpdateRequest', []);
        },
        _getFakeExtension: function(name) {
            return {
                getName: function() {
                    return name;
                }
            };
        },
        _closeExtension: function(name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [extension, 'close']);
        },
        showContentEditor: function(layerId) {
            this._closeExtension("LayerSelection");
            this.setEditorMode(true, layerId);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.userinterface.Extension'
        ]
    }
);