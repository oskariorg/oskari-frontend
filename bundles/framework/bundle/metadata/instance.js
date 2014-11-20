/**
 * @class Oskari.mapframework.bundle.metadata.MetadataSearchInstance
 *
 * This bundle adds a selection box plugin to the map and updates the metadata
 * search forms hidden fields to pass that selection to the search implementation
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.metadata.MetadataSearchInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.buttons = {};
    }, {
        __name: 'MetadataSearch',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {},

        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            var me = this,
                conf = me.conf,
                drawPlugin,
                eventToListen,
                mapModule,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            // register instance to sandbox so that requests can be made
            sandbox.register(me);
            for (eventToListen in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(eventToListen)) {
                    sandbox.registerForEventByName(me, eventToListen);
                }
            }
            me.sandbox = sandbox;

            sandbox.printDebug('Initializing metadata module...');
            me.setupToolbar();

            // register plugin for map (drawing for selection box)
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            drawPlugin = Oskari.clazz.create(
                'Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin'
            );
            mapModule.registerPlugin(drawPlugin);
            mapModule.startPlugin(drawPlugin);
            me.drawPlugin = drawPlugin;

            me.setupInitialSelection();
            // start listening to plugins selection
            drawPlugin.addListener(function (geometry) {
                me.selectionChanged(geometry);
            });
        },

        /**
         * @method setupToolbar
         * Renders the toolbar and buttons
         */
        setupToolbar: function () {
            var me = this,
                sandbox = this.sandbox,
                reqBuilder = sandbox.getRequestBuilder(
                    'Toolbar.AddToolButtonRequest'
                );

            sandbox.request(this, reqBuilder('tool-selection-area', 'selectiontools', {
                iconCls: 'tool-selection-area',
                tooltip: '',
                sticky: true,
                callback: function () {
                    me.drawPlugin.startDrawing();
                }
            }));

        },

        /**
         * @method setupInitialSelection
         * Reads the forms #metadataBbox field and sets
         * up the geometry on the map if any
         */
        setupInitialSelection: function () {
            var features,
                initialGeometry,
                wkt;
            // check if form has an initial selection box
            initialGeometry = jQuery('#tmpMetadataBbox').val();
            if (initialGeometry) {
                wkt = new OpenLayers.Format.WKT();
                features = wkt.read(initialGeometry);
                if (features) {
                    // use the initial box
                    this.drawPlugin.setDrawing(features.geometry);
                }
            }
        },

        /**
         * @method selectionChanged
         * Resets toolbar and updates metadata search forms fields to
         * current selection
         * @param {OpenLayers.Geometry} geometry new selection
         */
        selectionChanged: function (geometry) {
            // transform coordinates to 'EPSG:4326'
            var currentProj = this.drawPlugin.getMapModule().getMap().getProjectionObject();

            // update metadata search form fields
            jQuery('#tmpMetadataBbox').val(geometry);

            // FIXME a hardcoded projection?
            jQuery('#metadataBbox').val(geometry.transform(
                currentProj,
                new OpenLayers.Projection('EPSG:4326')
                )
            );
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {},

        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {},

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded if not.
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
             * @method Toolbar.ToolSelectedEvent
             * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
             */
            'Toolbar.ToolSelectedEvent': function (event) {
                this.drawPlugin.stopDrawing();
            },

            /**
             * @method Metadata.MapSelectionEvent
             * Requests toolbar to select default tool
             * @param {Oskari.mapframework.bundle.metadata.event.MapSelectionEvent} event
             */
            'Metadata.MapSelectionEvent': function (event) {
                // ask toolbar to select default tool
                var toolbarRequest = this.sandbox.getRequestBuilder(
                    'Toolbar.SelectToolButtonRequest'
                )();
                this.sandbox.request(this, toolbarRequest);
            }
        }
    }, {
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    });
