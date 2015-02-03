/**
 * @class Oskari.digiroad.myplaces.event.MyPlacesChangedEvent
 *
 * Tell components to reload data
 */
Oskari.clazz.define(
        'Oskari.digiroad.myplaces.event.MyPlacesChangedEvent',
        function(config) {
            this._creator = null;
        }, {
            __name : "DigiroadMyPlaces.MyPlacesChangedEvent",
            getName : function() {
                return this.__name;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

