Oskari.clazz.define( 'Oskari.mapping.maprotator.plugin.MapRotatorPlugin',
  function(config) {
    var me = this;
    me._config = config || {};
    me._clazz = 'Oskari.mapping.maprotator.plugin.MapRotatorPlugin';
    me._defaultLocation = 'top left';
    me._toolOpen = false;
    me._index = 600;
    me._currentRot = null;
    me.previousDegrees = null;
    me._templates = {
      maprotatortool: jQuery('<div class="mapplugin maprotator compass"></div>')
    };
    me._log = Oskari.log('Oskari.mapping.maprotator.plugin.MapRotatorPlugin');
  }, {
    isSupported: function(){
      return typeof ol !== 'undefined';
    },
    /**
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     * @private @method _createControlElement
     *
     * @return {jQuery}
     */
    _createControlElement: function () {
        var me = this,
            compass = me._templates.maprotatortool.clone(),
            degrees,
            eventBuilder = Oskari.eventBuilder( 'map.rotated' );

        me._locale = Oskari.getLocalization('maprotator', Oskari.getLang() || Oskari.getDefaultLanguage()).display;


        if(!this.isSupported()){
          return compass;
        }

        compass.on( "click", function(){
          me._map.getView().setRotation( 0 );
          jQuery(this).css({ transform:'rotate(0deg)' });
        });
        compass.attr('title', me._locale.tooltip.tool);

        var DragRotate = new ol.interaction.DragRotate();
        this._map.addInteraction(DragRotate);

        this._map.on( 'pointerdrag', function( e ) {
           degrees = me._getRotation();
           compass.css({ transform:'rotate('+degrees+'deg)' });

           if(degrees != me.previousDegrees) {
             var event = eventBuilder( degrees );
             me._sandbox.notifyAll( event );
           }
           me.previousDegrees = degrees;
        });
        if(me._config.noUI) {
            return null;
        }
      return compass;
    },
    _createUI: function() {
      this._element = this._createControlElement();
      this.addToPluginContainer(this._element);
    },
    setRotation: function(deg) {
      // if deg is number then transform degrees to radians otherwise use 0
      var rot = (typeof deg === 'number') ? deg / 57.3 : 0;
      // if deg is number use it for degrees otherwise use 0
      var degrees = (typeof deg === 'number') ? deg : 0;

      this._element.css({ transform:'rotate('+degrees+'deg)' });
      this._map.getView().setRotation( rot );
    },
    _getRotation: function() {
      var me = this;
      var rot = this._map.getView().getRotation();
      //radians to degrees
      var deg = rot * 57.3;
      return deg;
    },
    /**
     * Create event handlers.
     * @method @private _createEventHandlers
     */
    _createEventHandlers: function () {
        return {
            /**
             * @method RPCUIEvent
             * will open/close coordinatetool's popup
             */
            RPCUIEvent: function (event) {
                var me = this;
                if(event.getBundleId()==='maprotator') {
                     me._toggleToolState();
                }
            }
        };
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
