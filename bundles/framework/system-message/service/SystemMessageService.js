/**
 * @class Oskari.mapframework.bundle.system-message.SystemMessageService
 */
Oskari.clazz.define('Oskari.framework.bundle.system.message.service.SystemMessageService',
/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this._instance = instance;
    this._sandbox = instance.sandbox;
    this.urls = {};
},{
  __name: "system.message.SystemMessageService",
  __qname : "Oskari.framework.bundle.system.message.service.SystemMessageService",
  getQName : function() {
      return this.__qname;
  },
  getName: function() {
      return this.__name;
  },
  /**
   * Initializes the service (does nothing atm).
   *
   * @method init
   */
  init: function() {
  },
  getStatusMessages: function() {
    // this._instance.messages.push();
    this._instance.showStatusMessage();
  }
},{
    'protocol' : ['Oskari.framework.service.Service']
});
