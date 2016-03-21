Oskari.clazz.define('Oskari.mapframework.publisher.tool.CoordinateTool',
function() {
}, {
    index : 4,
    allowedLocations : ['top left', 'top right'],
    lefthanded: 'top left',
    righthanded: 'top right',
    allowedSiblings : [
        'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
        'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
    ],

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        var coordinatetool = this.__sandbox.findRegisteredModuleInstance('coordinatetool') || null;
        return {
            id: 'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin',
            title: 'CoordinateToolPlugin',
            config: {
                instance: coordinatetool
            }
        };
    },

    //Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
    bundleName: 'coordinatetool',

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
            var pluginConfig = this.getPlugin().getConfig();
            pluginConfig.instance = null;
            var json = {
                configuration: {}
            };
            json.configuration[me.bundleName] = {
                conf: pluginConfig,
                state: {}
            }
            return json;
        } else {
            return null;
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});