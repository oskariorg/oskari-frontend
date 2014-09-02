/**
 * @class Oskari.mapframework.bundle.publisher.PublisherBundleInstance
 *
 * Main component and starting point for the "map publisher" functionality. Publisher
 * is a wizardish tool to configure a subset of map functionality. It uses the map
 * plugin functionality to start and stop plugins when the map is running. Also it
 * changes plugin language and map size.
 *
 * See Oskari.mapframework.bundle.publisher.PublisherBundle for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.PublisherBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.publisher = null;
        this.disabledLayers = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'Publisher',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
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
        getLocalization: function (key) {
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
        start: function () {
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

            //sandbox.registerAsStateful(this.mediator.bundleId, this);
            // draw ui
            me._createUi();


            // create request handlers
            me.publishMapEditorRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.request.PublishMapEditorRequestHandler', me);

            // register request handlers
            sandbox.addRequestHandler('Publisher.PublishMapEditorRequest', me.publishMapEditorRequestHandler);
        },
        /**
         * @method init
         * Implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },
        /**
         * @method update
         * Implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {

        },
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            'AfterMapLayerRemoveEvent': function (event) {
                this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
                //update maplayerPanel in publisher too.
                if (this.publisher) {
                    this.publisher.maplayerPanel.handleLayerSelectionChanged();
                }
            },
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Calls flyouts handleLayerSelectionChanged() method
             */
            'AfterMapLayerAddEvent': function (event) {
                this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();

                if (this.publisher) {
                    this.publisher.maplayerPanel.handleLayerSelectionChanged();
                }
            },
            /**
             * @method AfterRearrangeSelectedMapLayerEvent
             * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent} event
             *
             * Rearranges layers
             */
            'AfterRearrangeSelectedMapLayerEvent': function (event) {
                if (event._creator !== this.getName() && event._fromPosition !== event._toPosition) {
                    // Layer order has been changed by someone else, resort layers
                    this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
                    if (this.publisher) {
                        this.publisher.maplayerPanel.handleLayerOrderChanged(event._movedMapLayer, event._fromPosition, event._toPosition);
                        if (event._creator !== this.publisher.maplayerPanel.plugin.getName()) {
                            this.publisher.maplayerPanel.handleLayerSelectionChanged();
                        }
                    }
                }
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             * Calls flyouts handleLayerSelectionChanged() and handleDrawLayerSelectionChanged() functions
             */
            'MapLayerEvent': function (event) {
                this.plugins['Oskari.userinterface.Flyout'].handleLayerSelectionChanged();
                if ((this.publisher) && (event.getOperation() === 'add')) {
                    // handleLayerSelectionChanged and handleDrawLayerSelectionChanged both rebuild the DOM
                    this.publisher.maplayerPanel.handleLayerSelectionChanged();
                    this.publisher.toolsPanel.handleDrawLayerSelectionChanged(event.getLayerId());
                }
            },
            /**
             * @method Publisher.MapPublishedEvent
             * @param {Oskari.mapframework.bundle.publisher.event.MapPublishedEvent} event
             */
            'Publisher.MapPublishedEvent': function (event) {
                var loc = this.getLocalization(),
                    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    okBtn = dialog.createCloseButton(loc.BasicView.buttons.ok),
                    url,
                    iframeCode,
                    textarea,
                    content;
                okBtn.addClass('primary');
                url = this.sandbox.getLocalizedProperty(this.conf.publishedMapUrl) + event.getId();
                iframeCode = '<div class="codesnippet"><code>&lt;iframe src="' + url + '" style="border: none;" width="'  + event.getWidth() +
                    '" height="' + event.getHeight() + '"&gt;&lt;/iframe&gt;</code></div>';

                content = loc.published.desc + '<br/><br/>' + iframeCode;

                dialog.show(loc.published.title, content, [okBtn]);
                this.setPublishMode(false);
            },
            /**
             * @method Publisher.ToolStyleChangedEvent
             */
            'Publisher.ToolStyleChangedEvent': function (event) {
                if (!this.publisher) {
                    return;
                }

                this.publisher.changeToolStyles(event.getStyle());
            },
            /**
             * @method Publisher.ColourSchemeChangedEvent
             */
            'Publisher.ColourSchemeChangedEvent': function (event) {
                if (!this.publisher) {
                    return;
                }

                this.publisher.changeColourScheme(event.getColourScheme());
            },
            /**
             * @method Publisher.FontChangedEvent
             */
            'Publisher.FontChangedEvent': function (event) {
                if (!this.publisher) {
                    return;
                }

                this.publisher.changeFont(event.getFont());
            },
            /**
             * @method MapLayerVisibilityChangedEvent
             */
            'MapLayerVisibilityChangedEvent': function (event) {
                if (this.publisher && this.publisher.maplayerPanel) {
                    this.publisher.maplayerPanel.handleLayerVisibilityChanged(event.getMapLayer(), event.isInScale(), event.isGeometryMatch());
                }
            }
        },

        /**
         * @method stop
         * Implements BundleInstance protocol stop method
         */
        stop: function () {
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

            //this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.publisher.Flyout
         * Oskari.mapframework.bundle.publisher.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.Tile', this);
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },
        /**
         * @method _createUi
         * @private
         * (re)creates the UI for "publisher" functionality
         */
        _createUi: function () {
            var me = this;
            me.plugins['Oskari.userinterface.Flyout'].createUi();
            me.plugins['Oskari.userinterface.Tile'].refresh();
        },

        /**
         * @method setPublishMode
         * Transform the map view to publisher mode if parameter is true and back to normal if false.
         * Makes note about the map layers that the user cant publish, removes them for publish mode and
         * returns them when exiting the publish mode.
         *
         * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
         * @param {Layer[]} deniedLayers layers that the user can't publish
         * @param {Object} data View data that is used to prepopulate publisher (optional)
         */
        setPublishMode: function (blnEnabled, deniedLayers, data) {
            var me = this,
                map = jQuery('#contentMap'),
                selectedLayers,
                statsLayer,
                i,
                layer,
                request,
                requestBuilder;

            // check if statsgrid mode is on
            // -> disable statsgrid mode
            selectedLayers = me.sandbox.findAllSelectedMapLayers();
            statsLayer = null;
            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                if (layer.getLayerType() === 'stats') {
                    request = me.sandbox.getRequestBuilder('StatsGrid.StatsGridRequest')(false, layer);
                    me.sandbox.request(me.getName(), request);
                    statsLayer = layer;
                    break;
                }
            }
            if (blnEnabled) {
                me.disabledLayers = deniedLayers;
                me.oskariLang = Oskari.getLang();
                // remove denied
                me._removeLayers();

                map.addClass('mapPublishMode');
                me.sandbox.mapMode = 'mapPublishMode';
                // close/hide flyout - TODO: how about other flyouts, popups/gfi?
                jQuery(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', 'none');

                // proceed with publisher view
                me.publisher = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.BasicPublisher',
                    me, me.getLocalization('BasicView'), data);
                me.publisher.render(map);
                me.publisher.setEnabled(true);
                if (statsLayer) {
                    me.publisher.initGrid(statsLayer);
                }

            } else {
                //this._destroyGrid()?
                jQuery('#contentMap').width('');
                jQuery('.oskariui-left')
                    .css({
                        'width': '',
                        'height': '',
                        'float': ''
                    })
                    .removeClass('published-grid-left')
                    .empty();
                jQuery('.oskariui-center').css({
                    'width': '100%',
                    'float': ''
                }).removeClass('published-grid-center');


                Oskari.setLang(me.oskariLang);
                if (me.publisher) {
                    jQuery(me.plugins['Oskari.userinterface.Flyout'].container).parent().parent().css('display', '');
                    // make sure edit mode is disabled
                    if (me.publisher.toolLayoutEditMode) {
                        me.publisher._editToolLayoutOff();
                    }
                    me.publisher.setEnabled(false);
                    me.publisher.destroy();
                }
                // first return all needed plugins before adding the layers back
                map.removeClass('mapPublishMode');
                if (me.sandbox._mapMode === 'mapPublishMode') {
                    delete me.sandbox._mapMode;
                }
                me._addLayers();
                //postRequestByName brakes mode change functionality! me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [undefined, 'close']);
                request = me.sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(me, 'close', me.getName());
                me.sandbox.request(me.getName(), request);
            }
            // publishing mode should be sent to mapfull to disable resizing
            requestBuilder = me.sandbox.getRequestBuilder('MapFull.MapResizeEnabledRequest');
            if (requestBuilder) {
                // got the builder, request can be sent
                request = requestBuilder(!blnEnabled);
                me.sandbox.request(me, request);
            }
        },
        /**
         * @method _addLayers
         * Adds temporarily removed layers to map
         * @private
         */
        _addLayers: function () {
            var me = this,
                sandbox = this.sandbox,
                addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest'),
                i,
                layer;
            if (me.disabledLayers) {
                for (i = 0; i < me.disabledLayers.length; i += 1) {
                    // remove
                    layer = me.disabledLayers[i];
                    sandbox.request(me, addRequestBuilder(layer.getId(), true));
                }
            }
        },
        /**
         * @method _removeLayers
         * Removes temporarily layers from map that the user cant publish
         * @private
         */
        _removeLayers: function () {
            var me = this,
                sandbox = me.sandbox,
                removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest'),
                i,
                layer;
            if (me.disabledLayers) {
                for (i = 0; i < me.disabledLayers.length; i += 1) {
                    // remove
                    layer = me.disabledLayers[i];
                    sandbox.request(me, removeRequestBuilder(layer.getId()));
                }
            }
        },
        /**
         * @method hasPublishRight
         * Checks if the layer can be published.
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
         * layer
         *      layer to check
         * @return {Boolean} true if the layer can be published
         */
        hasPublishRight: function (layer) {
            // permission might be "no_publication_permission"
            // or nothing at all
            return (layer.getPermission('publish') === 'publication_permission_ok');
        },
        /**
         * @method getLayersWithoutPublishRights
         * Checks currently selected layers and returns a subset of the list
         * that has the layers that can't be published. If all selected
         * layers can be published, returns an empty list.
         * @return
         * {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
         * list of layers that can't be published.
         */
        getLayersWithoutPublishRights: function () {
            var deniedLayers = [],
                selectedLayers = this.sandbox.findAllSelectedMapLayers(),
                i,
                layer;
            for (i = 0; i < selectedLayers.length; i += 1) {
                layer = selectedLayers[i];
                if (!this.hasPublishRight(layer) &&
                        layer.getId().toString().indexOf('myplaces_') < 0) {
                    deniedLayers.push(layer);
                }
            }
            return deniedLayers;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
