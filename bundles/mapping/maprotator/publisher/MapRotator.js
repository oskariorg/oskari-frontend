
Oskari.clazz.define('Oskari.mapping.publisher.tool.MapRotator',
function() {
}, {
  index : 500,
  allowedLocations : ['top left', 'top right'],
  lefthanded: 'top left',
  righthanded: 'top right',
  allowedSiblings : [],
  templates: {
      'toolOptions': '<div class="tool-options"></div>'
  },
  noUI: null,
  noUiIsCheckedInModifyMode: false,
/**
  * Get tool object.
  * @method getTool
  *
  * @returns {Object} tool description
  */
  getTool: function() {
      return {
          id: 'Oskari.mapping.maprotator.MapRotatorPlugin',
          title: 'MapRotator',
          config: {}
      };
  },
  isDisplayed: function() {
    // shouldn't be shown if bundle is not started
    // otherwise results in js errors
    return !!this.getMapRotatorInstance();
  },
  getMapRotatorInstance : function() {
    return this.__sandbox.findRegisteredModuleInstance(this.bundleName);
  },
  //Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
  bundleName: 'maprotator',
  /**
   * Initialise tool
   * @method init
   */
  init: function (data) {
    var me = this;

    if ( !data || !data.configuration[me.bundleName] ) {
        return;
    }
    me.setEnabled(true);

    var conf = data.configuration[me.bundleName].conf || {};
    me.noUiIsCheckedInModifyMode = !!conf.noUI;
  },
  /**
  * Get values.
  * @method getValues
  * @public
  *
  * @returns {Object} tool value object
  */
  getValues: function () {
      var me = this;
      if(me.state.enabled) {
        var pluginConfig = this.getPlugin().getConfig();
        for (var configName in pluginConfig) {
            if (configName === 'noUI' && !me.noUI) {
                pluginConfig[configName] = null;
                delete pluginConfig[configName];
            }
        }
        if(me.noUI) {
            pluginConfig.noUI = me.noUI;
        }
        var json = {
            configuration: {}
        };
        json.configuration[me.bundleName] = {
            conf: pluginConfig,
            state: {}
        };
        return json;
    } else {
        return null;
      }
  },
  /**
  * Get extra options.
  * @method @public getExtraOptions
  * @param {Object} jQuery element toolContainer
  * @return {Object} jQuery element template
  */
  getExtraOptions: function (toolContainer) {
    var me = this,
        template = jQuery(me.templates.toolOptions).clone(),
        loc = Oskari.getLocalization('maprotator', Oskari.getLang()),
        labelNoUI = loc.display.publisher.noUI;
    var input = Oskari.clazz.create(
        'Oskari.userinterface.component.CheckboxInput'
    );

    input.setTitle( labelNoUI );
    input.setHandler( function( checked ) {
        if ( !me.getPlugin() ) {
            return;
        }
        if ( checked === 'on' ) {
            me.noUI = true;
            me.getPlugin().teardownUI();
        } else {
            me.noUI = false;
            me.getPlugin().redrawUI();
        }
    });
    if(me.noUiIsCheckedInModifyMode) {
        input.setChecked(true);
        me.noUI = true;
    }
    var inputEl = input.getElement();
    template.append(inputEl);
    return template;

  }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});
