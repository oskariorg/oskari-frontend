Oskari.clazz.define( 'Oskari.mapping.maprotator.MapRotatorPlugin',
  function(config) {
    var me = this;
    me._config = config || {};
    me._clazz = 'Oskari.mapping.maprotator.MapRotatorPlugin';
    me._defaultLocation = 'top right';
    me._toolOpen = false;
    me._index = 30;
    me._currentRot = null;
    me.previousDegrees = null;
    me._templates = {
      maprotatortool: jQuery('<div class="mapplugin maprotator compass"></div>')
    };
    me._mobileDefs = {
      buttons:  {
          'mobile-maprotatetool': {
              iconCls: 'mobile-north',
              tooltip: '',
              show: true,
              callback: function () {
                  me.setRotation(0);
              },
              sticky: true,
              toggleChangeIcon: false
          }
      },
      buttonGroup: 'mobile-toolbar'
    };
    me._log = Oskari.log('Oskari.mapping.maprotator.MapRotatorPlugin');
  }, {
    isSupported: function() {
      return typeof ol !== 'undefined';
    },
    handleEvents: function () {
      var me = this;
      var DragRotate = new ol.interaction.DragRotate();
      this._map.addInteraction(DragRotate);
      var degrees;
      var eventBuilder = Oskari.eventBuilder( 'map.rotated' );

      this.getElement().on( "click", function() {
            me.setRotation(0);
      });

      this._map.on( 'pointerdrag', function( e ) {
        degrees = me._getRotation();
        me.updateIconRotation( degrees );
          if ( degrees != me.getPreviousDegrees() ) {
            var event = eventBuilder( degrees );
            me._sandbox.notifyAll( event );
          }
          me.storePreviousDegreeValue( degrees );
      });
    },
    storePreviousDegreeValue: function ( degree ) {
      this.previousDegrees = degree;
    },
    getPreviousDegrees: function () {
      return this.previousDegrees;
    },
    /**
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     * @private @method _createControlElement
     *
     * @return {jQuery}
     */
    _createControlElement: function () {
        var compass = this._templates.maprotatortool.clone();

        this._locale = Oskari.getLocalization('maprotator', Oskari.getLang() || Oskari.getDefaultLanguage()).display;

        if ( !this.isSupported() ) {
          return compass;
        }

        compass.attr('title', this._locale.tooltip.tool);

        if ( this._config.noUI ) {
            return null;
        }
      return compass;
    },
    updateIconRotation: function ( degrees ) {
      this.getElement().css({ transform:'rotate(' + degrees + 'deg)' });
    },
    _createUI: function() {
      this._element = this._createControlElement();
      if ( this.isSupported() ) {
          this.handleEvents();
      }
      this.addToPluginContainer(this._element);
    },
    _createMobileUI: function () {
      var me = this;
      var mobileDefs = this.getMobileDefs();
      var el = jQuery( me.getMapModule().getMobileDiv() ).find('#oskari_toolbar_mobile-toolbar_mobile-coordinatetool');
      this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
      this._element = jQuery( "." + mobileDefs.buttons["mobile-maprotatetool"].iconCls );
      this.handleEvents();  
    },
    setRotation: function ( deg ) {
      // if deg is number then transform degrees to radians otherwise use 0
      var rot = (typeof deg === 'number') ? deg / 57.3 : 0;
      // if deg is number use it for degrees otherwise use 0
      var degrees = (typeof deg === 'number') ? deg : 0;

      this.updateIconRotation( degrees );
      this._map.getView().setRotation( rot );
      this.storePreviousDegreeValue( degrees );
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
          MapSizeChangedEvent: function () {
            this.setRotation( this.getPreviousDegrees() );
          },
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
      var isMobile = Oskari.util.isMobile();
      if( this.getElement() ) {
          this.teardownUI(true);
      }
      if( isMobile ) {
        var mobileDefs = this.getMobileDefs();
        this.removeToolbarButtons( mobileDefs.buttons, mobileDefs.buttonGroup );
        this._createMobileUI();
      } else {
        this._createUI();
      }
    },
    teardownUI : function(stopping) {
    //detach old element from screen
      var mobileDefs = this.getMobileDefs();
      this.getElement().detach();
      this.removeFromPluginContainer(this.getElement());
      this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);  
    },
    /**
     * Get jQuery element.
     * @method @public getElement
     */
    getElement: function() {
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
