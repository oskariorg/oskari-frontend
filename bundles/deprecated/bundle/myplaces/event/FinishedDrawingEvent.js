Oskari.clazz.define(
        'Oskari.mapframework.myplaces.event.FinishedDrawingEvent',
        function(config) {
            this._creator = null;
            if(config) {
            	if(config.geometry) {
            		this._drawing = config.geometry;
            	}
            	if(config.modification) {
            		this._modification = config.modification;
            	}
            }
        }, {
            __name : "MyPlaces.FinishedDrawingEvent",
            getName : function() {
                return this.__name;
            },
            getDrawing : function() {
                return this._drawing;
            },
            isModification : function() {
                return this._modification;
            }
        },
        {
            'protocol' : ['Oskari.mapframework.event.Event']
        });

/* Inheritance */

