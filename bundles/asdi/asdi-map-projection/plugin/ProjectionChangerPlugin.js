Oskari.clazz.define( 'Oskari.mapping.projection.ProjectionChangerPlugin',
  function ( config, instance ) {
    var me = this;
    me._instance = instance;
    me._config = config || {};
    me._clazz = 'Oskari.mapping.projection.ProjectionChangerPlugin';
    me._defaultLocation = 'top right';
    me._index = 55;
    me._visible = false;
    me._templates = {
      projectionchanger: jQuery('<div class="mapplugin oskari-projection-changer"></div>')
    };
    me._loc = Oskari.getLocalization('map-projection', Oskari.getLang() || Oskari.getDefaultLanguage());
    me._mobileDefs = {
      buttons:  {
          'mobile-projectionchanger': {
              iconCls: 'mobile-projectionchange',
              tooltip: '',
              show: true,
              callback: function () {
              },
              sticky: true,
              toggleChangeIcon: false
          }
      },
      buttonGroup: 'mobile-toolbar'
    };
    me._flyout = me._instance.getFlyout();
    me._flyout.hide();
    me._log = Oskari.log('Oskari.mapping.projection.ProjectionChangerPlugin');
  }, {

    _createControlElement: function () {
        var launcher = this._templates.projectionchanger.clone();

        launcher.attr('title', this._loc.tooltip.tool);

        if ( this._config.noUI ) {
            return null;
        }
      return launcher;
    },
    createUi: function() {
      this._element = this._createControlElement();
      this.handleEvents();
      this.addToPluginContainer(this._element);
    },
    handleEvents: function () {
        var me = this;
        this._flyout.move(1800, 70, true);
        this.getElement().on( "click", function() {
            if ( !me._visible ) {
                me._flyout.open();
                me._visible = true;
            } else {
                me._flyout.hide();
                me._visible = false;
            }
        });
    },
    _createMobileUI: function () {
      var me = this;
      var mobileDefs = this.getMobileDefs();
      var el = jQuery( me.getMapModule().getMobileDiv() ).find('#oskari_toolbar_mobile-toolbar_mobile-coordinatetool');
      this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
      this._element = jQuery( "." + mobileDefs.buttons["mobile-maprotatetool"].iconCls );
      this.handleEvents();  
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
    getElement: function() {
        return this._element;
    },
    stopPlugin: function() {
      this.teardownUI(true);
    }
  }, {
      'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
      'protocol': [
          "Oskari.mapframework.module.Module",
          "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
      ]
  });
