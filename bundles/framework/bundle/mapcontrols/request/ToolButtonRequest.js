Oskari.clazz
        .define(
                'Oskari.mapframework.mapcontrols.request.ToolButtonRequest',
                function(config, type) {
                    this._creator = null;
                    
                    // check that we support the request type
                    for(var i=0; i < this.requestTypes.length; ++i) {
                    	if(type === this.requestTypes[i]) {
                    		this._type = type;
                    	}
                    }
	                if(!this._type) {
	                    throw "Unknown type '" + type + "'";
	                }
                    this._config = config;
                }, {
                    __name : "MapControls.ToolButtonRequest",
                    getName : function() {
                        return this.__name;
                    },
                    
                    requestTypes :  ['add', 'remove', 'disable', 'enable', 'toggle'],
                    
                    getConfig : function() {
                        return this._config;
                    },
                    
                    getType : function() {
                        return this._type;
                    }
                },
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
