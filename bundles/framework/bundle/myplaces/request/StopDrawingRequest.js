Oskari.clazz
        .define(
                'Oskari.mapframework.myplaces.request.StopDrawingRequest',
                function(propagateFinished) {
                    this._creator = null;
                    if(propagateFinished === true) {
                    	this._propagateFinished = propagateFinished;
                    }
                }, {
                    __name : "MyPlaces.StopDrawingRequest",
                    getName : function() {
                        return this.__name;
                    },
                    isPropagate : function() {
                        return (this._propagateFinished === true);
                    }
                },
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
