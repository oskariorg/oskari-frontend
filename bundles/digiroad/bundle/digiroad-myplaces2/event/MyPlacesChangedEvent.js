/**
 * Tell components to reload data
 */
Oskari.clazz.define(
        'Oskari.mapframework.myplaces.event.MyPlacesChangedEvent',
        function(config) {
            this._creator = null;
        }, {
            __name : "MyPlaces.MyPlacesChangedEvent",
            getName : function() {
                return this.__name;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

