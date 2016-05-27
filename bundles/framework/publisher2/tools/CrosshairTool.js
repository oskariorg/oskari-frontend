Oskari.clazz.define('Oskari.mapframework.publisher.tool.CrosshairTool',
function() {
}, {
    getName: function() {
        return "Oskari.mapframework.publisher.tool.CrosshairTool";
    },
    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        return {
        	//doesn't actually map to anything real, just need this in order to not break stuff in publisher
            id: 'Oskari.mapframework.publisher.tool.CrosshairTool',
            title: 'CrosshairTool',
            config: {}
        };
    },
    init: function(data) {
        var me = this;
        if (Oskari.util.keyExists(data, 'configuration.mapfull.conf.mapOptions.crosshair')) {
            me.setEnabled(data.configuration.mapfull.conf.mapOptions.crosshair);
        }
    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        var me = this;
        if(me.state.enabled) {
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            mapOptions: {
                            	crosshair: true
                            }
                        }
                    }
                }
            };
        } else {
            return null;
        }
    },
    setEnabled: function(enabled) {
    	var me = this;
    	var mapModule = me.__sandbox.findRegisteredModuleInstance('MainMapModule');
    	if (mapModule) {
    		mapModule.toggleCrosshair(enabled);
    	}
    	me.state.enabled = (enabled === true) ? true : false;
    },
    stop: function() {
    	//remove crosshair when exiting
    	this.setEnabled(false);
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});