Oskari.clazz.define( 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin',
  function( config, plugins ) {
    var me = this;
    me._config = config || {};
    me._plugins = plugins;
    me._clazz = 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPublisherPlugin';
    me._defaultLocation = 'top right';
    me._templates = {
      maplegend: jQuery( '<div class="mapplugin maplegend questionmark"></div>' ),
      legendContainer: jQuery( '<div class="legendSelector"></div>' ),
      legendInfo: jQuery('<div class="legendInfo"></div>'),
      legendDivider: jQuery('<div class="maplegend-divider"></div>')
    };
    me._element = null;
    me._isVisible = false;
    me._loc;
  }, {

  _createControlElement: function () {
    var me = this,
        loc = Oskari.getLocalization( 'maplegend', Oskari.getLang() ),
        legend = me._templates.maplegend.clone(),
        popup = Oskari.clazz.create( 'Oskari.userinterface.component.Popup' );

        me._loc = loc;

        legend.on( "click", function () {
          if( me.isOpen() ) {
            me._isVisible = false;
            popup.dialog.children().empty();
            popup.close( true );
            return;
          }
          popup.show( me._loc.title );
          popup.setColourScheme( { "bgColour" : "#424343", "titleColour" : "white" } );
          popup.moveTo( legend, 'left', true );
          popup.makeDraggable();
          popup.createCloseIcon();
          me._isVisible = true;
          var legendContainer = me.getLayerLegend();
          jQuery(popup.dialog).append(legendContainer);
          legendContainer.find('div.oskari-select').trigger('change');
        });

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
        legendInfo = this._templates.legendInfo.clone(),
        legendDivider = this._templates.legendDivider.clone(),
        me = this;


    legendInfo.text(me._loc.infotext);
    legendContainer.append(legendInfo);
    legendContainer.append(legendDivider);

    var select = Oskari.clazz.create( 'Oskari.userinterface.component.SelectList' );
    layers.forEach( function ( layer ) {
      if(!layer.getLegendImage()){
        return;
      }
      var layerObject = {
        id: layer.getId(),
        title: layer.getName()
      }
      layerNames.push( layerObject );
    });
    var options = {
        placeholder_text : 'layers',
        allow_single_deselect : false,
        disable_search_threshold: 10,
        width: '100%'
    };
    var dropdown = select.create( layerNames, options );
    dropdown.css( { width : '96%' } );
    select.adjustChosen();
    select.selectFirstValue();
    legendContainer.append( dropdown );

    var accordion = Oskari.clazz.create( 'Oskari.userinterface.component.Accordion' );
    accordion.insertTo( legendContainer );

    dropdown.on( "change", function ( e, params ) {
      if( accordionPanel ){
        accordion.removePanel( accordionPanel );
      }
      var id = e.target.value  ? e.target.value : jQuery(e.target).find(':selected').val();
      layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers( id );

      if( !layer ) {
        return;
      }
      var legendImg = jQuery( '<img></img>' );
      var legendLink = jQuery( '<a target="_blank" ></a></br></br>' );
      legendImg.attr('src', layer.getLegendImage());
      legendLink.attr('href', layer.getLegendImage());
      legendLink.text(me._loc.newtab);

      groupAttr = layer.getName();

          accordionPanel = Oskari.clazz.create( 'Oskari.userinterface.component.AccordionPanel' );
          accordionPanel.open();
          accordionPanel.getContainer().append( legendLink );
          accordionPanel.getContainer().append( legendImg );
          accordionPanel.getHeader().remove();
          accordion.addPanel( accordionPanel );

    });
    return legendContainer;
  },
   _createUI: function() {
      this._element = this._createControlElement();
      this.addToPluginContainer( this._element );
  },
  isOpen: function() {
    return this._isVisible;
  },

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
