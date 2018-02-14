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
        me.createPlugin();
        sandbox.register(me);
        sandbox.requestHandler('rotate.map', this);
    },
    createPlugin: function( ) {
      if (this.plugin) {
        return;
      }
      var conf = this.conf || {};
      var plugin = Oskari.clazz.create('Oskari.mapping.maprotator.MapRotatorPlugin', conf);
      if ( !plugin.isSupported() ) {
        // don't create plugin if ol4 is not supported
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
      this.sandbox = null;
      this.started = false;
    }
  }, {
      protocol: ['Oskari.bundle.BundleInstance']
  });
