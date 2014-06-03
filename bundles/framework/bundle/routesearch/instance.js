/**
 * @class Oskari.mapframework.bundle.routesearch.RouteSearchBundleInstance
 *
 * Main component and starting point for the "route search" functionality.
 *
 * See Oskari.mapframework.bundle.routesearch.RouteSearchBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.routesearch.RouteSearchBundleInstance",
    function () {},
    {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        "getName": function () {
            return 'RouteSearch';
        },

        /**
         * @method startPlugin
         */
        startPlugin: function () {
            this.setDefaultTile(this.getLocalization('tile').title);
        },

        eventHandlers: {
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Fetch users when flyout is opened
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    doOpen = event.getViewState() !== "close";
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }
                if (!doOpen) {
                    console.log("disableMapClick");
                    this.plugins['Oskari.userinterface.Flyout'].disableMapClick();
                }
            }
        },

        /**
         * @method registerMapClickHandler
         * Registers the map click handler so we can pass the clicks to flyout.
         */
        registerMapClickHandler: function () {
            console.log("registerMapClickHandler");
            if (this.eventHandlers.MapClickedEvent) {
                return;
            }
            this.eventHandlers.MapClickedEvent = function (event) {
                this.plugins['Oskari.userinterface.Flyout'].onMapClick(
                    event.getLonLat()
                );
            }
            this.sandbox.registerForEventByName(this, 'MapClickedEvent');
        },

        /**
         * @method unregisterMapClickHandler
         * Unregisters the map click handler
         */
        unregisterMapClickHandler: function () {
            console.log("unregisterMapClickHandler");
            delete this.eventHandlers.MapClickedEvent;
            this.sandbox.unregisterFromEventByName(this, 'MapClickedEvent');
        },

        /**
         * Sends the search request to the search service
         * and handles the response.
         * 
         * @method __handleMapClick
         * @private
         * @param {OpenLayers.LonLat} lonlat
         */
        __handleMapClick: function (lonlat) {
            console.log("Map Clicked:", lonlat);
        }
    },
    {
        /**
         * @property {String[]} extend
         * @static
         */
        "extend": ['Oskari.userinterface.extension.DefaultExtension']
    });
