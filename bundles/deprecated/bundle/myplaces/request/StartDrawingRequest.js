Oskari.clazz
        .define(
                'Oskari.mapframework.myplaces.request.StartDrawingRequest',
                function(config) {
                    this._creator = null;
                    
                    // TODO: do we pass selected category colors here?
                    
                    if(config.geometry) {
                        // editing existing 
                        this._geometry = config.geometry;
                    }
                    else if(config.continueCurrent) {
                        // editing new
                        this._continueCurrent = config.continueCurrent;
                    }
                    else {
                    	// start drawing new
		                if(!this.drawModes[config.drawMode]) {
		                    throw "Unknown draw mode '" + config.drawMode + "'";
		                }
		                this._drawMode = config.drawMode;
                    }
                    
                }, {
                    __name : "MyPlaces.StartDrawingRequest",
                    getName : function() {
                        return this.__name;
                    },

                    isModify : function() {
                        if(this._continueCurrent) {
                            return true;
                        }
                        return false;
                    },
                    
                    drawModes :  {
                        point: 'point',
                        line: 'line',
                        area: 'area'
                    },
                    
                    getDrawMode : function() {
                        return this._drawMode;
                    },
                    
                    getGeometry : function() {
                        return this._geometry;
                    }
                },
                
                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
