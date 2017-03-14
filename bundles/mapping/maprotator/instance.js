/*
Oskari.app.playBundle(
{
  bundlename : 'maprotator',
  metadata : {
  "Import-Bundle" : {
  "maprotator" : {
  bundlePath : '/Oskari/packages/framework/bundle/'
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
    /**
     * Needed by sandbox.register()
     */
    init : function() {},
    /**
     * @method setSandbox
     * @param {Oskari.Sandbox} sandbox
     * Sets the sandbox reference to this component
     */
    setSandbox: function (sbx) {
        this.sandbox = sbx;
    },
    /**
     * @method getSandbox
     * @return {Oskari.Sandbox}
     */
    getSandbox: function () {
        return this.sandbox;
    },

    handleRequest: function (core, request) {
      this.plugin.setRotation(request.getDegrees());
    },
    /**
     * @method start
     *
     * implements BundleInstance start methdod
     *
     * creates and registers request handlers
     *
     */
    start: function(sandbox) {
        var me = this;
        if(me._started){
          return;
        }
        me._started = true;
        me._sandbox = Oskari.getSandbox('sandbox');
        me.setSandbox(me._sandbox);
        me._mapmodule = me._sandbox.findRegisteredModuleInstance('MainMapModule');
        me.createPlugin(true);

        sandbox.register(me);
    },
    createPlugin: function( enabled ) {
      var plugin = Oskari.clazz.create('Oskari.mapping.maprotator.plugin.MapRotatorPlugin');
      this._mapmodule.registerPlugin(plugin);
      this._mapmodule.startPlugin(plugin);
      this.plugin = plugin;
      this._sandbox.requestHandler('rotate.map', this);
    }
  }, {
      /**
       * @property {String[]} protocol
       * @static
       */
      protocol: ['Oskari.bundle.BundleInstance']
  });
