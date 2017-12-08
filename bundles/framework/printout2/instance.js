/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundleInstance
 *
 * Main component and starting point for the "map printout" functionality. Printout
 * is a wizardish tool to configure a printout .
 *
 * See Oskari.mapframework.bundle.printout.PrintoutBundle for bundle definition.
 *
 *
 *             appSetup.startupSequence[17] = {
                "bundlename":"printout2" ,
            }
            appSetup.startupSequence[17].metadata= { "Import-Bundle": { "printout2": { "bundlePath": "/Oskari/packages/framework/bundle/" } } };
 */
Oskari.clazz.define("Oskari.mapping.printout2.instance", function() {
    this.started = false;
    this.sandbox = null;
    this._mapmodule = null;
    this.plugins = {};
    this.printview = null;
    this.isOpen = false;
    //  Format producers
    this.backendConfiguration = {
        formatProducers: {
            "application/pdf": "",
            "image/png": ""
        }
    };
    this.defaultConf = {
        name: 'Printout2'
    };
}, {
    afterStart: function(sandbox) {
        this._mapmodule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        this.printview = Oskari.clazz.create('Oskari.mapping.printout2.view.print', this);
        this.addToToolbar();
    },
    addToToolbar: function() {
        var me = this;
        // request toolbar to add buttons
        var addBtnRequestBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
        var printicon = {
                iconCls: 'tool-print',
                tooltip: this.getLocalization('btnTooltip'),
                sticky: false,
                callback: function() {
                    me.isOpen = !me.isOpen;
                    me.openPrintPanel(me.isOpen);
                }
            };
        this.sandbox.request(this, addBtnRequestBuilder("print", "viewtools", printicon));
    },
    openPrintPanel: function(open) {
        if (open) {
            this.displayContent();
        } else {
            this.closePrintPanel();
        }
        this.sandbox.request(this, Oskari.requestBuilder('MapFull.MapSizeUpdateRequest')(true));
    },
    closePrintPanel: function() {
        this.isOpen = !this.isOpen;
        this.printview.destroy();
        this.sandbox.request(this, Oskari.requestBuilder('MapFull.MapSizeUpdateRequest')(true));
    },
    displayContent: function() {
        this.printview.createUi();
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers: {
        'AfterMapMoveEvent': function(event) {
            if (this.printview && !!this.printview.getElement()) {
                this.printview.refresh();
            }
        },
        /**
         * @method userinterface.ExtensionUpdatedEvent
         */
        'userinterface.ExtensionUpdatedEvent': function(event) {
            var me = this;

            if (event.getExtension().getName() !== me.getName()) {
                // not me -> do nothing
                return;
            }

            var isOpen = event.getViewState() !== "close";
            if (!isOpen) {
                me.openPrintPanel();
            } else {
                me.stop();
            }

        },
        'Printout.PrintableContentEvent': function(event) {
            var contentId = event.getContentId(),
                layer = event.getLayer(),
                layerId = ((layer && layer.getId) ? layer.getId() : null),
                tileData = event.getTileData(),
                geoJson = event.getGeoJsonData();

            // Save the GeoJSON for later use if provided.
            // TODO:
            // Save the GeoJSON for each contentId separately.
            // view/BasicPrintOut.js should be changed as well
            // to parse the geoJson for the backend.
            if (geoJson) {
                this.geoJson = geoJson;
            }
            // Save the tile data per layer for later use.
            if (tileData && layerId) {
                this.tileData[layerId] = tileData;
            }
        },
    }

}, {
    "extend": ["Oskari.userinterface.extension.DefaultExtension"]
});