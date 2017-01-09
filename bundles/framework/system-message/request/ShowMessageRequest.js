/**
 * @class Oskari.mapframework.bundle.system.message.request.ShowMessageRequest
 *
 *
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.framework.bundle.system.message.request.ShowMessageRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function( message, level ) {
  this._message = message;
  this._level = level;
}, {
  /** @static @property __name request name */
  __name: 'ShowMessageRequest',
  colors : {
      'info' : 'blue',
      'warning' : 'orange',
      'error' : 'red'
  },
  /**
   * @method getName
   * @return {String} request name
   */
  getName: function () {
      return this.__name;
  },
  /**
   * @method getMessage
   */
  getMessage: function () {
      return this._message;
  },
  /**
   * @method getUrgency
   */
  getUrgencyLevel: function() {
    return this.colors[this._level] || 'gray';
  }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
