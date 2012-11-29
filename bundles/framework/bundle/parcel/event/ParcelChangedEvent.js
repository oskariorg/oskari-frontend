/**
 * Tell components to reload data
 */
Oskari.clazz.define(
        'Oskari.mapframework.parcel.event.ParcelChangedEvent',
        function(config) {
            this._creator = null;
        }, {
            __name : "Parcel.ParcelChangedEvent",
            getName : function() {
                return this.__name;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

