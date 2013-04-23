Oskari.clazz
        .define(
                'Oskari.mapframework.bundle.printout.request.PrintMapRequest',
                function(selections) {
                    this._creator = null;
                    this._selections = selections;
                }, {
                    __name : "printout.PrintMapRequest",
                    getName : function() {
                        return this.__name;
                    },
                    getSelections : function() {
                        return this._selections;
                    }
                },
                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
