/**
 * @class Oskari.map.LogoPluginService
 */
Oskari.clazz.define('Oskari.map.LogoPluginService',
/**
 * @method create called automatically on construction
 * @static
 */
function(link) {
    this._link = link;
    this._plugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin');
}, {
  __name: "map.logo.service",
  __qname : "Oskari.map.LogoPluginService",
  getQName : function() {
      return this.__qname;
  },
  getName: function() {
      return this.__name;
  },
  extend: function() {
    this._plugin.addContentFromService(this._link);
  },
  /**
   * Initializes the service (does nothing atm).
   *
   * @method init
   */
  init: function() {
  },
},{
    'protocol' : ['Oskari.framework.service.Service']
});
