/**
 * @class Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundleInstance
 */
Oskari.clazz.define(
    'Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundleInstance',
    function() {
        this.map = null;
        this.core = null;
        this.sandbox = null;
        this.mapmodule = null;
        this.started = false;
        this.plugins = {};
        this._locale = null;
        this._requestHandlers = {};
        this.loader = null;
        this.layerPlugin = null;
        this.layer = null;
        this.conf = this.conf || {};
        this.state = this.state || {};
    }, {
        /**
         * @static
         * @property __name
         *
         */
        __name: 'catalogue.bundle.metadataflyout',

        getName: function() {
            return this.__name;
        },

        /**
         * @method getSandbox
         */
        getSandbox: function() {
            return this.sandbox;
        },

        getLocale: function() {
            return this._locale;
        },

        getLoader: function() {
            return this.loader;
        },

        /**
         * @property defaults
         *
         * some defaults for this bundle
         */

        layerSpec: {
            text: '',
            name: 'Metadata',
            wmsName: '1',
            type: 'vectorlayer',
            styles: {
                title: 'Trains',
                legend: '',
                name: '1'
            },
            descriptionLink: '',
            orgName: 'Metadata',
            inspire: 'Metadata',
            legendImage: '',
            info: '',
            isQueryable: true,
            formats: {
                value: 'text/html'
            },
            id: 'catalogue_metadataflyout_layer',
            minScale: 36000000,
            maxScale: 1,
            style: '',
            dataUrl: '',
            wmsUrl: 'x',
            opacity: 60,
            checked: 'false',
            styledLayerDescriptor: '<StyledLayerDescriptor version="1.0.0" ' +
                'xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" ' +
                '    xmlns="http://www.opengis.net/sld" ' +
                '    xmlns:ogc="http://www.opengis.net/ogc" ' +
                '    xmlns:xlink="http://www.w3.org/1999/xlink" ' +
                '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> ' +
                '  <NamedLayer> ' +
                '    <Name>Simple point with stroke</Name> ' +
                '    <UserStyle>' +
                '      <Title>GeoServer SLD Cook Book: Simple point with stroke</Title> ' +
                '      <FeatureTypeStyle>' +
                '        <Rule>' +
                '          <PolygonSymbolizer>' +
                '            <Graphic>' +
                '              <Mark>' +
                '                <WellKnownName>circle</WellKnownName>' +
                '                <Fill>' +
                '                  <CssParameter name="fill">#000040</CssParameter>' +
                '                </Fill>' +
                '                <Stroke>' +
                '                  <CssParameter name="stroke">#000040</CssParameter>' +
                '                  <CssParameter name="stroke-width">2</CssParameter>' +
                '                </Stroke>' +
                '              </Mark>' +
                '              <Size>12</Size>' +
                '            </Graphic>' +
                '          </PolygonSymbolizer>' +
                '          <TextSymbolizer>' +
                '            <Label>' +
                '              <ogc:PropertyName>title</ogc:PropertyName>' +
                '            </Label>' +
                '            <Fill>' +
                '              <CssParameter name="fill">#000000</CssParameter>' +
                '            </Fill>' +
                '          </TextSymbolizer>' +
                '        </Rule>' +
                '      </FeatureTypeStyle>' +
                '    </UserStyle>' +
                '  </NamedLayer>' +
                '</StyledLayerDescriptor>'
        },

        /**
         * @method implements BundleInstance start methdod
         *
         */
        start: function() {
            var me = this;
            if (this.started) {
                return;
            }

            this.started = true;

            /* locale */
            this._locale = Oskari.getLocalization(this.getName());

            /* sandbox */
            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            this.sandbox = sandbox;
            this.mapmodule = this.sandbox.findRegisteredModuleInstance("MainMapModule");
            /* loader */
            this.loader = Oskari.clazz.create(
                'Oskari.catalogue.bundle.metadataflyout.service.MetadataLoader', {
                    baseUrl: sandbox.getAjaxUrl(),
                    srs: me.mapmodule.getProjection()

                }
            );

            sandbox.register(this);

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            var request = sandbox.getRequestBuilder(
                'userinterface.AddExtensionRequest'
            )(this);

            sandbox.request(this, request);

            this._requestHandlers = {
                'catalogue.ShowMetadataRequest': Oskari.clazz.create(
                    'Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler',
                    sandbox,
                    this
                ),
                'catalogue.AddTabRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.catalogue.request.AddTabRequestHandler',
                    sandbox,
                    this.plugins['Oskari.userinterface.Flyout']
                )
            };

            for (var key in this._requestHandlers) {
                sandbox.addRequestHandler(key, this._requestHandlers[key]);
            }

            /* stateful */
            sandbox.registerAsStateful(this.mediator.bundleId, this);

            // handle state
            var state = me.getState();
            me.setState(state);

            me._setupLayerTools();

        },
        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function() {
            return this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        },

        /**
         * Adds tools for all layers
         */
        _setupLayerTools: function() {
            var me = this;
            // add tools for feature data layers
            var service = this.getLayerService();
            var layers = service.getAllLayers();
            _.each(layers, function(layer) {
                me._addTool(layer, true);
            });
            // update all layers at once since we suppressed individual events
            var event = me.sandbox.getEventBuilder('MapLayerEvent')(null, 'tool');
            me.sandbox.notifyAll(event);
        },

        /**
         * Adds the metadata tool for layer
         * @method  @private _addTool
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        _addTool: function(layer, suppressEvent) {
            var me = this;
            var service = me.getLayerService();
            if (typeof layer !== 'object') {
                // detect layerId and replace with the corresponding layerModel
                layer = service.findMapLayer(layer);
            }
            if (!layer || !layer.getMetadataIdentifier()) {
                return;
            }

            // add feature data tool for layer
            var tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName('metadata');
            tool.setIconCls('show-metadata-tool');
            tool.setTooltip(me._locale.tooltip);
            var subLayers = layer.getSubLayers();
            var additionalUuidsCheck = {};
            var additionalUuids = [];
            if (subLayers && subLayers.length > 0) {
                for (var s = 0; s < subLayers.length; s += 1) {
                    var subUuid = subLayers[s].getMetadataIdentifier();
                    if (subUuid && subUuid !== '' && !additionalUuidsCheck[subUuid]) {
                        additionalUuidsCheck[subUuid] = true;
                        additionalUuids.push({
                            uuid: subUuid
                        });
                    }
                }
            }
            tool.setCallback(function() {
                me.sandbox.postRequestByName('catalogue.ShowMetadataRequest', [{
                        uuid: layer.getMetadataIdentifier()
                    },
                    additionalUuids
                ]);
            });

            service.addToolForLayer(layer, tool, suppressEvent);
        },

        init: function() {
            return null;
        },

        /**
         * @method update
         *
         * implements bundle instance update method
         */
        update: function() {},

        /**
         * @method onEvent
         */
        onEvent: function(event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

        },

        /**
         * @property eventHandlers
         * @static
         *
         */
        eventHandlers: {
            AfterMapLayerAddEvent: function(event) {
                /* this might react when layer added */
                /* this.scheduleShowMetadata(event.getMapLayer().getMetadataResourceUUID(); */
            },
            /**
             * @method AfterMapLayerRemoveEvent
             */
            AfterMapLayerRemoveEvent: function(event) {
                /* this might react when layer removed */
                /* this.scheduleShowMetadata(event.getMapLayer().getMetadataResourceUUID(); */
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Fetch when flyout is opened
             */
            'userinterface.ExtensionUpdatedEvent': function(event) {
                var me = this;
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }
                var viewState = event.getViewState();
                if (viewState == 'close') {
                    this.state = {};
                }
            },
            'MapLayerEvent': function(event) {
                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }

                if (event.getLayerId()) {
                    this._addTool(event.getLayerId());
                } else {
                    // ajax call for all layers
                    this._setupLayerTools();
                }
            },
        },

        /**
         * @method stop
         *
         * implements bundle instance stop method
         */
        stop: function() {
            var sandbox = this.sandbox,
                p;

            /* request handler cleanup */
            /*
            sandbox.removeRequestHandler(
                'catalogue.ShowMetadataRequest',
                this._requestHandlers['catalogue.ShowMetadataRequest']
            );
            */
            for (var key in this._requestHandlers) {
                sandbox.removeRequestHandler(key, this._requestHandlers[key]);
            }

            /* sandbox cleanup */
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            var request = sandbox.getRequestBuilder(
                'userinterface.RemoveExtensionRequest'
            )(this);

            sandbox.request(this, request);

            sandbox.unregisterStateful(this.mediator.bundleId);
            sandbox.unregister(this);
            this.started = false;
        },

        setSandbox: function(sandbox) {
            this.sandbox = null;
        },

        startExtension: function() {
            this.plugins['Oskari.userinterface.Flyout'] =
                Oskari.clazz.create(
                    'Oskari.catalogue.bundle.metadataflyout.Flyout',
                    this,
                    this.getLocale().flyout,
                    this.getLoader()
                );
        },

        stopExtension: function() {
            this.plugins['Oskari.userinterface.Flyout'] = null;
        },

        getTitle: function() {
            return this.getLocale().title;
        },

        getDescription: function() {
            return 'Sample';
        },

        getPlugins: function() {
            return this.plugins;
        },

        /**
         * @method scheduleShowMetadata
         * schedules a refresh of the UI to load metadata asynchronously
         */
        scheduleShowMetadata: function(allMetadata) {
            /** update flyout content */
            this.plugins[
                'Oskari.userinterface.Flyout'
            ].scheduleShowMetadata(allMetadata);

            this.getSandbox().requestByName(
                this,
                'userinterface.UpdateExtensionRequest', [this, 'detach']
            );
        },
        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function(state) {
            this.state = state;
            if (state && state.current) {
                this.scheduleShowMetadata(state.current);
            }
        },

        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function() {
            return this.state;
        }
    }, {
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);