/**
 * Tell components to reload data
 */
Oskari.clazz.define(
        'Oskari.mapplet.event.MappletStateChangedEvent',
        function(msg) {
            this._creator = null;
            this._msg = msg;
        }, {
            __name : "Mapplet.MappletStateChangedEvent",
            getName : function() {
                return this.__name;
            },
            getMsg: function() {
            	return this._msg;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

