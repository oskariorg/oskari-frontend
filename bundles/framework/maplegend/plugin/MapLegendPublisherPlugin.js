Oskari.clazz.define( 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin',
  function( config, plugins ) {
    var me = this;
    me._config = config || {};
    me._plugins = plugins;
    me._clazz = 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin';
    me._defaultLocation = 'top right';
    me._templates = {
      maplegend: jQuery( '<div class="mapplugin maplegend questionmark"></div>' ),
      legendContainer: jQuery( '<div class="legendSelector"></div>' )
    };
    me._element = null;
    me._isVisible = false;
    me._loc = Oskari.getLocalization( 'maplegend', Oskari.getLang() );
    me._popup = Oskari.clazz.create( 'Oskari.userinterface.component.Popup' );
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
        legend = me._templates.maplegend.clone(),
        loc = Oskari.getLocalization( 'maplegend', Oskari.getLang() );

        legend.on( "click", function () {
          if( me.isOpen() ) {
            me._isVisible = false;
            me._popup.close( true );
            return;
          }
          me._popup.show( loc.title );
          me._popup.moveTo( legend, 'left', true );
          me._popup.makeDraggable();
          me._popup.createCloseIcon();
          me._isVisible = true;
          me.getLayerLegend();

        })

    return legend;
  },
  getLayerLegend: function() {
    var layers = this.getSandbox().findAllSelectedMapLayers().slice(0),
        n,
        layer,
        groupAttr,
        layerContainer,
        accordionPanel,
        layerNames = [],
        legendContainer = this._templates.legendContainer.clone(),
        me = this;


    var select = Oskari.clazz.create( 'Oskari.userinterface.component.SelectList' );
    var selected;
    layers.forEach( function ( layer ) {
      var layerObject = {
        id: layer.getId(),
        title: layer.getName()
      }
      layerNames.push( layerObject );
    });
    var options = {
        placeholder_text : 'layers',
        allow_single_deselect : true,
        disable_search_threshold: 10,
        width: '100%'
    };
    var dropdown = select.create( layerNames, options );
    dropdown.css( { width : '100%' } );
    select.adjustChosen();
    select.selectFirstValue();
    legendContainer.append( dropdown );

    var accordion = Oskari.clazz.create( 'Oskari.userinterface.component.Accordion' );
    accordion.insertTo( legendContainer );

    dropdown.on( "change", function ( e, params ) {
      if( accordionPanel ){
        accordion.removePanel( accordionPanel );
      }
      layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers( e.target.value );

      groupAttr = layer.getName();
      layerContainer =  me._plugins[ 'Oskari.userinterface.Flyout' ]._createLayerContainer( layer );

      if(layerContainer !== null) {
          accordionPanel = Oskari.clazz.create( 'Oskari.userinterface.component.AccordionPanel' );
          accordionPanel.open();
          accordionPanel.setTitle(layer.getName());
          accordionPanel.getContainer().append( layerContainer );
          accordion.addPanel( accordionPanel );
      }

    });
      jQuery( this._popup.dialog ).append( legendContainer );
  },
   _createUI: function() {
      this._element = this._createControlElement();
      this.addToPluginContainer( this._element );
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
      if( this.getElement() ) {
        this.teardownUI( true );
      }
        var me = this;
        var sandbox = me.getSandbox();
        this._createUI();
    },
    teardownUI : function( stopping ) {
    //detach old element from screen
      this.getElement().detach();
      this.removeFromPluginContainer( this.getElement() );
    },
    /**
     * Get jQuery element.
     * @method @public getElement
     */
    getElement: function(){
        return this._element;
    },
    stopPlugin: function() {
      this.teardownUI( true );
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
