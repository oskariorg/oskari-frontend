Oskari.clazz
        .define(
                'Oskari.mapframework.bundle.parcel.request.GetGeometryRequest',
                function(callbackMethod) {
                    this._creator = null;
                    this._callbackMethod = callbackMethod;
                }, {
                    __name : "Parcel.GetGeometryRequest",
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
