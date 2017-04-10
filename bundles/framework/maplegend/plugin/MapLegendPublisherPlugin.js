Oskari.clazz.define( 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin',
  function(config) {
    var me = this;
    me._config = config || {};
    me._clazz = 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin';
    me._defaultLocation = 'top right';
    me._templates = {
      maplegend: jQuery('<div class="mapplugin maplegend questionmark"></div>')
    };
    me._element = null;
    me._isVisible = false;
  }, {
  /**
   * Creates UI for coordinate display and places it on the maps
   * div where this plugin registered.
   * @private @method _createControlElement
   *
   * @return {jQuery}
   */
  _createControlElement: function () {
    var me = this,
        legend = me._templates.maplegend.clone();

        //on click show flyout(?) with legend image only
        legend.on("click", function(){
          if(me.isOpen()) {
            me._isVisible = false;
            return;
          }
          this._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
          me._isVisible = true;
          
        })

    return legend;
  },
   _createUI: function() {
      this._element = this._createControlElement();
      this.addToPluginContainer(this._element);
  },
  isOpen: function() {
    return this._isVisible;
  },

    /**
     * Handle plugin UI and change it when desktop / mobile mode
     * @method  @public redrawUI
     * @param  {Boolean} mapInMobileMode is map in mobile mode
     * @param {Boolean} forced application has started and ui should be rendered with assets that are available
     */
    redrawUI: function() {
      if(this.getElement()){
        this.teardownUI(true);
      }
        var me = this;
        var sandbox = me.getSandbox();
        this._createUI();
    },
    teardownUI : function(stopping) {
    //detach old element from screen
      this.getElement().detach();
      this.removeFromPluginContainer(this.getElement());
    },
    /**
     * Get jQuery element.
     * @method @public getElement
     */
    getElement: function(){
        return this._element;
    },
    stopPlugin: function() {
      this.teardownUI(true);
    }
}, {
    'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
    /**
     * @static @property {string[]} protocol array of superclasses
     */
    'protocol': [
        "Oskari.mapframework.module.Module",
        "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
    ]
});
