Oskari.clazz.define( 'Oskari.projection.change.ProjectionChangerPlugin',
  function ( options, localization ) {
    this.options = options || {};
    this._clazz = 'Oskari.projection.change.ProjectionChangerPlugin';
    this._defaultLocation = 'top right';
    this._index = 55;
    this._templates = {
      projectionchanger: jQuery('<div class="mapplugin oskari-projection-changer"></div>')
    };
    this._loc = localization;

    this._flyout = Oskari.clazz.create('Oskari.projection.change.flyout', options, {
        width: 'auto',
        cls: 'projection-change-flyout'
    });
    this._flyout.makeDraggable();
    this._flyout.hide();

    this._log = Oskari.log('Oskari.projection.change.ProjectionChangerPlugin');
  }, {

    _createControlElement: function () {
      var launcher = this._templates.projectionchanger.clone();
      launcher.attr('title', this._loc.tooltip.tool);
      return launcher;
    },
    createUi: function() {
      if ( this.getElement() ) {
        return;
      }
      this._element = this._createControlElement();
      this.handleEvents();
      this.addToPluginContainer(this._element);
    },
    handleEvents: function () {
        var me = this;
        this._flyout.move(1200, 300, true);
        this.getElement().on( "click", function() {
            me._flyout.toggle();
        });
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
      } else {
        this.createUi();
      }
    },
    teardownUI : function(stopping) {
    //detach old element from screen
      this.getElement().detach();
      this.removeFromPluginContainer(this.getElement());
    },
    getElement: function() {
        return this._element;
    },
    getFlyout: function() {
      return this._flyout;
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
