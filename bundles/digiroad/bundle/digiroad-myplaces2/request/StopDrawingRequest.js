Oskari.clazz
        .define(
                'Oskari.digiroad.myplaces.request.StopDrawingRequest',
                function(isCancel) {
                    this._creator = null;
                	this._isCancel = (isCancel == true);
                }, {
                    __name : "DigiroadMyPlaces.StopDrawingRequest",
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
