Oskari.clazz.define( 'Oskari.projection.change.ProjectionChangerPlugin',
  function ( config, localization ) {
    this._config = config || {};
    this._clazz = 'Oskari.projection.change.ProjectionChangerPlugin';
    this._defaultLocation = 'top right';
    this._index = 55;
    this._templates = {
      projectionchanger: jQuery('<div class="mapplugin oskari-projection-changer"></div>')
    };
    this._loc = localization;
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

    this._flyout = Oskari.clazz.create('Oskari.projection.change.flyout', this._loc, {
        width: 'auto',
        cls: 'projection-change-flyout'
    });
    this._flyout.makeDraggable({
        handle : '.oskari-flyouttoolbar, .projection-data-container > .header',
        scroll : false
    });
    this._flyout.hide();

    this._log = Oskari.log('Oskari.projection.change.ProjectionChangerPlugin');
  }, {

    _createControlElement: function () {
      var launcher = this._templates.projectionchanger.clone();

      launcher.attr('title', this._loc.tooltip.tool);

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
            me._flyout.toggle();
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
