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
           id: 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin',
           title: 'MapLegend',
           config: {
               instance: this.getInstance()
           }
       };
   },
   getInstance : function() {
     return this.__sandbox.findRegisteredModuleInstance(this.bundleName);
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
      this.getInstance().createPlugin();
  },
  /**
  * Get values.
  * @method getValues
  * @public
  *
  * @returns {Object} tool value object
  */
  getValues: function () {

  }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});
