/**
* @class Oskari.mapframework.publisher.tool.Tool
* This clazz documentates publisher2 tools definations. When new tools has implemented it's must define these functions and properties.
* Protocol/interface declaration for Publisher2 tool.
* Provides an interface for bundles to add tool to publisher2.
*/

Oskari.clazz.define('Oskari.mapframework.publisher.tool.Tool',
function(sandbox, mapmodule, localization) {
    // sandbox
    this.__sandbox = sandbox;
    // mapmodule
    this.__mapmodule = mapmodule;
    // localization
    this.__loc = localization;
    // plugin
    this.__plugin = null;
    // tool state
    this.state= {
        enabled: false,
        mode:null
    };

}, {
    // the panel group where tool is appended
    group : 'maptools',
    // tool index in group, 0 is top
    index : 999,
    // allowed locations
    allowedLocations : ['top left', 'top right', 'bottom left', 'bottom right'],
    allowedSiblings : [
        'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons'
    ],

    groupedSiblings : true,
    /**
    * Get tool object.
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function(){
        return {
            id: '<plugin id>',
            title: '<plugin name>',
            config: {}
        };
    },
    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */
    setEnabled : function(enabled) {

    },
    /**
    * Get extra options.
    * @method getExtraOptions
    * @public
    *
    * @returns {Object} jQuery element
    */
    getExtraOptions: function() {
        return null;
    },
    /**
    * Get name.
    * @method getName
    * @public
    *
    * @returns {String} tool name
    */
    getName: function() {

    },
    /**
    * Is displayed in mode.
    * @method isDisplayedInMode
    * @public
    *
    * @param {String} mode the checked mode
    *
    * @returns {Boolean} is displayed in wanted mode
    */
    isDisplayedInMode: function(mode) {
        var me = this,
            supportedModes = [];

        supportedModes = jQuery.grep(me.__supportedModes, function(modename) {
            return modename === mode;
        });

        return supportedModes > 0;
    },
    /**
    * Is displayed.
    * @method isDisplayed
    * @public
    *
    * @returns {Boolean} is tool displayed
    */
    isDisplayed: function() {
        return true;
    },
    /**
    * Get group
    * @method getGroup
    * @public
    *
    * @returns {Integer} group id
    */
    getGroup : function() {
        var me = this;
        return me.__group;
    },
    /**
    * Get index
    * @method getIndex
    * @public
    *
    * @returns {Integer} index
    */
    getIndex : function() {
        var me = this;
        return me.__index;
    },
    /**
    * Get allowed locations
    * @method getAllowedLocations
    * @public
    *
    * @returns {Object} allowed locations array
    */
    getAllowedLocations: function(){
        var me = this;
        return me.__allowedLocations;
    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        var me = this,
            saveState = {
                tool: me.getTool().id,
                show: me.state.enabled,
                subTools : []
            };

        return saveState;
    },
    /**
    * Validate tool.
    *
    * @returns {Object} errors object
    */
    validate: function() {
        // always valid
        return true;
        // or tool create validation
    }
}, {
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});