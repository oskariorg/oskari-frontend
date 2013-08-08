Oskari.clazz
        .define(
                'Oskari.mapframework.myplaces.request.StopDrawingRequest',
                function(isCancel) {
                    this._creator = null;
                	this._isCancel = (isCancel == true);
                }, {
                    __name : "LupaPisteMyPlaces.StopDrawingRequest",
                    getName : function() {
                        return this.__name;
                    },
                    isCancel : function() {
                        return (this._isCancel === true);
                    }
                },
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
