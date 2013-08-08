Oskari.clazz.define(
        'Oskari.mapframework.myplaces.event.MyPlaceSelectedEvent',
        function(pMyPlace, dblClick) {
            this._creator = null;
            this._myPlace = pMyPlace;
            this._dblClick = dblClick;
        }, {
            __name : "MyPlaces.MyPlaceSelectedEvent",
            getName : function() {
                return this.__name;
            },
            getPlace : function() {
                return this._myPlace;
            },
            isDblClick : function() {
                return this._dblClick;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

