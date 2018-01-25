Oskari.clazz.define( 'Oskari.projection.change.ProjectionChangerPlugin',
  function ( config, instance ) {
    this._instance = instance;
    this._config = config || {};
    this._clazz = 'Oskari.projection.change.ProjectionChangerPlugin';
    this._defaultLocation = 'top right';
    this._index = 55;
    this._visible = false;
    this._templates = {
      projectionchanger: jQuery('<div class="mapplugin oskari-projection-changer"></div>')
    };
    this._loc = instance.getLocalization();
    this._mobileDefs = {
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
    this._flyout = this._instance.getFlyout();
    this._flyout.hide();
    this._log = Oskari.log('Oskari.projection.change.ProjectionChangerPlugin');
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
        this._flyout.move(1300, 120, true);
        this.getElement().on( "click", function() {
            if ( !me._visible ) {
                me._flyout.show();
                me._visible = true;
            } else {
                me._flyout.hide();
                me._visible = false;
            }
        });
    },
    _createMobileUI: function () {

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
