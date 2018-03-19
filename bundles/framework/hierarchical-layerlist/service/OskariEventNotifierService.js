/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.OskariEventNotifierServic
 */
(function(Oskari) {
    var _log = Oskari.log('HierarchicalLayerlist.OskariEventNotifierService');

    Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.OskariEventNotifierService',

        /**
         * @method create called automatically on construction
         * @static
         */
        function() {
            // attach on, off, trigger functions
            Oskari.makeObservable(this);

        }, {
            __name: 'HierarchicalLayerlist.OskariEventNotifierService',
            __qname: 'Oskari.framework.bundle.hierarchical-layerlist.OskariEventNotifierService',
            // handled Oskari events
            eventHandlers: ['AfterMapLayerRemoveEvent','AfterMapLayerAddEvent','MapLayerEvent',
                'BackendStatus.BackendStatusChangedEvent','userinterface.ExtensionUpdatedEvent',
                'MapLayerVisibilityChangedEvent','AfterChangeMapLayerOpacityEvent','AfterChangeMapLayerStyleEvent',
                'AfterRearrangeSelectedMapLayerEvent','MapSizeChangedEvent'],
            /*******************************************************************************************************************************
            /* PUBLIC METHODS
            *******************************************************************************************************************************/
            getQName: function() {
                return this.__qname;
            },
            getName: function() {
                return this.__name;
            },
            getSandbox: function() {
                return this.sandbox;
            },
            onEvent: function(event) {
                this.notifyOskariEvent(event);
            },

            /**
             * Used to propate Oskari events for files that have reference to service, but don't need to be registered to sandbox.
             * Usage: service.on('Event', function(evt) {});
             *
             * instance.js registers eventhandlers and calls this to let components know about events.
             * @param  {Oskari.mapframework.event.Event} event event that needs to be propagated to components
             */
            notifyOskariEvent: function(event) {
                this.trigger(event.getName(), event);
            }

        }, {
            'protocol': ['Oskari.mapframework.service.Service']
        });
}(Oskari));