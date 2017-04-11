Oskari.clazz.define( 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin',
  function(config, plugins) {
    var me = this;
    me._config = config || {};
    me._plugins = plugins;
    me._clazz = 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin';
    me._defaultLocation = 'top right';
    me._templates = {
      maplegend: jQuery('<div class="mapplugin maplegend questionmark"></div>')
    };
    me._element = null;
    me._isVisible = false;
    me._loc = Oskari.getLocalization('maplegend', Oskari.getLang());
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
        popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
        legend = me._templates.maplegend.clone(),
        loc = Oskari.getLocalization('maplegend', Oskari.getLang());

        //on click show flyout(?) with legend image only
        legend.on("click", function(){
          if(me.isOpen()) {
            me._isVisible = false;
            popup.close(true);
            return;
          }
          popup.show(loc.title);
          popup.moveTo(legend, 'left', true);
          popup.makeDraggable();
          popup.createCloseIcon();
          // var legend = me._plugins['Oskari.userinterface.Flyout']._populateLayerList(popup);
          me._isVisible = true;
          me.getLayerLegend(popup);

        })

    return legend;
  },
  getLayerLegend: function(element) {
    var layers = this.getSandbox().findAllSelectedMapLayers().slice(0),
        n,
        layer,
        groupAttr,
        layerContainer,
        accordionPanel,
        layerNames = [];

    var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
    layers.forEach(function(layer){
      layerNames.push(layer.getName());
    });
    var options = {
        placeholder_text : 'layers',
        allow_single_deselect : true,
        disable_search_threshold: 10,
        width: '100%'
    };
    var dropdown = select.create(layerNames, options);
    dropdown.css({width:'100%'});
    jQuery(element.dialog).append(dropdown);
    select.adjustChosen();

    var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    accordion.insertTo(jQuery(element.dialog));
    // for (n = layers.length - 1; n >= 0; n -= 1) {
    //     layer = layers[n];
    //     groupAttr = layer.getName();
    //     layerContainer =  this._plugins['Oskari.userinterface.Flyout']._createLayerContainer(layer);
    //
    //   if(layerContainer !== null) {
    //       accordionPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
    //       accordionPanel.open();
    //       accordionPanel.setTitle(layer.getName());
    //       accordionPanel.getContainer().append(layerContainer);
    //       accordion.addPanel(accordionPanel);
    //   }
    // }

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
