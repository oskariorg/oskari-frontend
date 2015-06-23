Oskari.clazz.define('Oskari.mapframework.publisher.tool.ControlsTool',
function() {
}, {
    index : 5,

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function() {
        return {
            id: 'Oskari.mapframework.mapmodule.ControlsPlugin',
            name: 'ControlsPlugin',
            config: {}
        };
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
                
        if(me.state.enabled === true) {
            return {
                mapfull: {
                    conf: {
                        plugins: [{ id: this.getTool().id }]
                    }
                }
            };
        } else {
            return null;
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});