Oskari.clazz.define('Oskari.mapframework.publisher.tool.MapLegend',
function() {
}, {
  index : 4,
  allowedLocations : ['top left', 'top right'],
  lefthanded: 'top right',
  righthanded: 'top right',
  allowedSiblings : [
  ],
   bundleName: 'maplegend',
   /**
   * Get tool object.
   * @method getTool
   *
   * @returns {Object} tool description
   */
   getTool: function() {
       return {
           id: 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin',
           title: 'MapLegend',
           config: {
               instance: this.getInstance()
           }
       };
   },
   getInstance : function() {
     return this.__sandbox.findRegisteredModuleInstance(this.bundleName);
   },
   getPlugin: function(){
    var maplegend = this.getInstance() || {};
    return maplegend.publisherplugin;
   },
  /**
   * Initialise tool
   * @method init
   */
  init: function(data) {
      var me = this;
      if (!data || !data.configuration[me.bundleName]) {
          return;
      }
      me.setEnabled(true);
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
        tool = me.getTool(),
        request;

    me.state.enabled = enabled;
    if(tool.config.instance.publisherplugin === null && enabled) {
      me.getInstance().createPlugin();
      me.__started = true;
    }
    if(!enabled && me.__started){
      if(me.getInstance().publisherplugin){
          me.getInstance().stopPlugin();
      }
      me.__started = false;
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
        var pluginConfig = this.getPlugin().getConfig();

          var json = {
              configuration: {}
          };
          json.configuration[me.bundleName] = {
              conf: pluginConfig,
              state: {}
          };
          return json;
        } else {
          return null;
      }
  }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});
