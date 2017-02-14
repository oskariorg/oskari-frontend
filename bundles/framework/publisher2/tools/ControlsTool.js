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
            title: 'ControlsPlugin',
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
        var config = null;

        if(!me.state.enabled) {
          config = {
            keyboardControls: false,
            mouseControls: false
          }
        }
        return {
            configuration: {
                mapfull: {
                    conf: {
                        plugins: [{ id: this.getTool().id, config: config }]
                    }
                }
            }
        };
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});
