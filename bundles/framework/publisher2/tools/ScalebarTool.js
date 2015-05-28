Oskari.clazz.define('Oskari.mapframework.publisher.tool.ScalebarTool', 
function(sandbox, mapmodule, localization) {
    this.__index = 0;
	this.__group = 'maptools';
	this.__allowedLocations = ['bottom right'];
    this.__sandbox = sandbox;
    this.__mapmodule = mapmodule;
    this.__loc = localization;
    this.__plugin = null;
	this.state= {
		enabled: false,
		mode:null
	};
}, {
    /**
    * Get tool object.
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function(){
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
            name: 'scalebar',
            config: {}
        };
    },
	/**
	* Set enabled.
	* @method setEnabled
	* @public
	*
	* @param {Boolean} enabled is tool enabled or not
	*/
   	setEnabled : function(enabled) {
   		var me = this,
            tool = me.getTool();

   		me.state.enabled = enabled;

        if(!me.__plugin && enabled) {
            me.__plugin = Oskari.clazz.create(tool.id, tool.config);
            me.__mapmodule.registerPlugin(me.__plugin);
        }

        if(enabled && enabled == true) {
            Oskari.clazz.create(tool.id, tool.config);
            me.__plugin.startPlugin(me.__sandbox);
        } else {
            me.__plugin.stopPlugin(me.__sandbox);
        }                
    },
    /**
    * Get extra options.
    * @method getExtraOptions
    * @public
    *
    * @returns {Object} jQuery element
    */
    getExtraOptions: function() {
    	return null;
    },
    /**
    * Get name.
    * @method getName
    * @public
    *
    * @returns {String} tool name
    */
    getName: function() {
        var me = this;
    	return me.__loc.ScaleBarPlugin;
    },
    /**
    * Is displayed in mode.
    * @method isDisplayedInMode
    * @public
    *
    * @param {String} mode the checked mode
    *
    * @returns {Boolean} is displayed in wanted mode
    */
    isDisplayedInMode: function(mode) {
    	return true;
    },
    /**
    * Is displayed.
    * @method isDisplayed
    * @public
    *
    * @returns {Boolean} is tool displayed
    */
    isDisplayed: function() {
    	return true;
    },
    /**
    * Set mode to.
    * @method setMode
    * @public
    *
    * @param {String} mode the mode
    */
    setMode: function(mode){
    	var me = this;
    	me.state.mode = mode;
    },
    /**
    * Get group
    * @method getGroup
    * @public
    *
    * @returns {Integer} group id
    */
    getGroup : function() {
    	var me = this;
    	return me.__group;
    },
    /**
    * Get index
    * @method getIndex
    * @public
    *
    * @returns {Integer} index
    */
    getIndex : function() {
        var me = this;
        return me.__index;
    },
    /**
    * Get allowed locations
    * @method getAllowedLocations
    * @public
    *
    * @returns {Object} allowed locations array
    */
    getAllowedLocations: function(){
        var me = this;
        return me.__allowedLocations;
    },
    /**
    * Get values.
    * @method getValues
    * @public
    * 
    * @returns {Object} tool value object
    */
    getValues: function () {
    	var me = this,
    		saveState = {
    			tool: me.getTool().id,
    			show: me.state.enabled,
    			subTools : []
    		};
    	
    	return saveState;
    },
    /**
    * Validate tool.
    *
    * @returns {Object} errors object
    */
    validate: function() {
        // always valid
        return true;
    }
}, { 
    'protocol' : ['Oskari.mapframework.publisher.Tool'] 
}); 