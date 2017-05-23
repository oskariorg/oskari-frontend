/**
 * @class Oskari.map.LogoPluginService
 */
Oskari.clazz.define('Oskari.map.LogoPluginService',
/**
 * @method create called automatically on construction
 * @static
 */
function(sandbox, link) {
    this._link = link;
    this._sandbox = sandbox;
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
  extend: function(div) {
    var extend = {
      link: this._link.link,
      linkTitle: this._link.title,
      title: 'About'
    }
    this._plugin.addContentFromService(div, extend);
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
