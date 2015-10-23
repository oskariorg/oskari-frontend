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

        if(me.state.enabled) {
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                        }
                    }
                }
            };
        } else {
            return null;
        }
    },
    /**
    * Is the tool toggled on by default.
    * @method isDefaultTool
    * @public
    *
    * @returns {Boolean} is the tool toggled on by default.
    */
    isDefaultTool: function() {
        return true;
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});