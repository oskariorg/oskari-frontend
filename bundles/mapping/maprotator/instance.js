/*
Oskari.app.playBundle(
{
  bundlename : 'maprotator',
  metadata : {
  "Import-Bundle" : {
  "maprotator" : {
  bundlePath : '/Oskari/packages/mapping/ol3/'
  }
  }
  }
});
*/
Oskari.clazz.define("Oskari.mapping.maprotator.MapRotatorBundleInstance",
  function() {
    this._started = false;
    this.plugin = null;
    this._mapmodule = null;
    this._sandbox = null;
  }, {
    __name:'maprotator',
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName: function () {
        return this.__name;
    },
    init : function() {},
    setSandbox: function (sbx) {
        this.sandbox = sbx;
    },
    getSandbox: function () {
        return this.sandbox;
    },
    handleRequest: function (core, request) {
      this.plugin.setRotation(request.getDegrees());
    },
    start: function(sandbox) {
        var me = this;
        if(me._started){
          return;
        }
        me._started = true;
        sandbox = sandbox || Oskari.getSandbox();
        me.setSandbox(sandbox);
        me._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        me.createPlugin(true);
        me._registerEventHandlers();
        sandbox.register(me);
        sandbox.requestHandler('rotate.map', this);
    },
    createPlugin: function( enabled, publisher ) {
      if(typeof publisher === 'undefined'){
        publisher = false;
      }
      var conf = this.conf || {};
      var plugin = Oskari.clazz.create('Oskari.mapping.maprotator.MapRotatorPlugin', conf);
      if(!plugin.isSupported() && !publisher){
        return;
      }
      this._mapmodule.registerPlugin(plugin);
      this._mapmodule.startPlugin(plugin);
      this.plugin = plugin;
    },
    stopPlugin: function() {
      this._mapmodule.unregisterPlugin(this.plugin);
      this._mapmodule.stopPlugin(this.plugin);
      this.plugin = null;
    },
    stop: function() {
      this.stopPlugin();
      this.getSandbox().requestHandler('rotate.map', null);
      this._unregisterEventHandlers();
      this.sandbox = null;
      this.started = false;
    },
    _registerEventHandlers: function() {
      var me = this;
      for (var p in me.eventHandlers) {
          if (me.eventHandlers.hasOwnProperty(p)) {
              me.sandbox.registerForEventByName(me, p);
          }
      }
    },
    _unregisterEventHandlers: function() {
        var me = this;
        for (var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.sandbox.unregisterFromEventByName(me, p);
            }
        }
    },
    onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
    },
    eventHandlers: {
        MapSizeChangedEvent: function () {
          var previous = this.plugin.getPreviousDegrees();
          this.plugin.setRotation( previous );
        }
    }
  }, {
      /**
       * @property {String[]} protocol
       * @static
       */
      protocol: ['Oskari.bundle.BundleInstance']
  });
