/**
 * @class Oskari.tampere.bundle.content-editor.OskariEventNotifierService
 */
(function(Oskari) {
    var _log = Oskari.log('ContentEditor.OskariEventNotifierService');

    Oskari.clazz.define('Oskari.tampere.bundle.content-editor.OskariEventNotifierService',

        /**
         * @method create called automatically on construction
         * @static
         */
        function() {
            // attach on, off, trigger functions
            Oskari.makeObservable(this);

        }, {
            __name: 'ContentEditor.OskariEventNotifierService',
            __qname: 'Oskari.tampere.bundle.content-editor.OskariEventNotifierService',
            // handled Oskari events
            eventHandlers: ['DrawingEvent'],
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
                this.trigger(event.getName(), event);
            }
        }, {
            'protocol': ['Oskari.mapframework.service.Service']
        });
}(Oskari));