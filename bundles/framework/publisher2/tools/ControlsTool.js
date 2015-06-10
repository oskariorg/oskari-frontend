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
        var me = this,
            saveState = {
                tool: me.getTool().id,
                show: me.state.enabled,
                subTools : []
            };

        return saveState;
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});