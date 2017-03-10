
Oskari.clazz.define('Oskari.mapframework.publisher.tool.MapRotator',
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
  supportedProjections: null,
  noUI: null,
  projectionTrasformationIsCheckedInModifyMode: false,
  noUiIsCheckedInModifyMode: false,
  /**
  * Get tool object.
  * @method getTool
  *
  * @returns {Object} tool description
  */
  getTool: function() {
      var maprotator = this.__sandbox.findRegisteredModuleInstance('maprotator') || null;
      return {
          id: 'Oskari.mapframework.bundle.maprotator.plugin.MapRotatorPlugin',
          title: 'MapRotator',
          config: {
              instance: maprotator
          }
      };
  },
  getPlugin: function(){
    var maprotator = this.__sandbox.findRegisteredModuleInstance('maprotator') || null;
    return maprotator.plugin;
  },
  //Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
  bundleName: 'maprotator',
  /**
   * Initialise tool
   * @method init
   */
  init: function(data) {
      var me = this;
      if ( !data || !data.configuration[me.bundleName] ) {
          return;
      }
      me.setEnabled(true);

  },
  /**
  * Set enabled.
  * @method setEnabled
  * @public
  *
  * @param {Boolean} enabled is tool enabled or not
  */
  setEnabled : function(enabled) {
      var me = this,
          tool = me.getTool(),
          request;

      me.state.enabled = enabled;

      var rotator = Oskari.getSandbox().findRegisteredModuleInstance('maprotator');
      if(!rotator) {
          return;
      }
      if(enabled) {
        rotator.createPlugin(true);
          // reset flyout location to the edge of the publish sidebar for the preview (this doesn't open the flyout)

      }
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
          return {
              configuration: {
                  maprotator: {

                  }
              }
          };
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
    //CREATE CHECKBOX
    var me = this,
        template = jQuery(me.templates.toolOptions).clone(),
        labelNoUI = "Hide UI";
    var input = Oskari.clazz.create(
        'Oskari.userinterface.component.CheckboxInput'
    );

    input.setTitle( labelNoUI );
    input.setHandler( function( checked ) {
        if( checked === 'on' ){
            me.noUI = true;
            me.getPlugin().teardownUI();
        } else {
            me.noUI = null;
            me.getPlugin().redrawUI(Oskari.util.isMobile());
        }
    });
    var inputEl = input.getElement();
    template.append(inputEl);

    return template;

  }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});
