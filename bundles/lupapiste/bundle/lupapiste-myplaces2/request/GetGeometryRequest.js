Oskari.clazz
        .define(
                'Oskari.lupapiste.bundle.myplaces2.request.GetGeometryRequest',
                function(callbackMethod) {
                    this._creator = null;
                    this._callbackMethod = callbackMethod;
                }, {
                    __name : "MyPlaces.GetGeometryRequest",
                    getName : function() {
                        return this.__name;
                    },
                    getCallBack : function() {
                        return this._callbackMethod;
                    }
                },
                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
