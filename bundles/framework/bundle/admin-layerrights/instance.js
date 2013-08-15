/**
 * @class Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance
 *
 * Main component and starting point for the layer rights management functionality. 
 * 
 * See Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundle for bundle definition. 
 *
 */
Oskari.clazz
  .define("Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance", 

      /**
       * @method create called automatically on construction
       * @static
       */
      function() {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.service = null;
      }, {
        /**
         * @static
         * @property __name
         */
        __name : 'admin-layerrights',
        /**
         * @method getName
         * @return {String} the name for the component 
         */
        "getName" : function() {
          return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox : function(sandbox) {
          this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox : function() {
          return this.sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for 
         * current language.
         * If key-parameter is not given, returns the whole localization 
         * data.
         * 
         * @param {String} key (optional) if given, returns the value for 
         *         key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization : function(key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        "start" : function() {
            var me = this;

            if(me.started) {
                return;
            }

            me.started = true;

            var conf = this.conf ;
            var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
            var sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;
          
            this.localization = Oskari.getLocalization(this.getName());
          
            var ajaxUrl = null;
            if(this.conf && this.conf.url) {
                ajaxUrl = this.conf.url;
            }
            else {
                ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetSearchResult';
            } 
          
            /*var servName = 
            'Oskari.framework.bundle.admin-layerrights.service.SearchService';
            this.service = Oskari.clazz.create(servName, ajaxUrl);*/
          
            sandbox.register(me);
            for(p in me.eventHandlers) {
                sandbox.registerForEventByName(me, p);
            }

            //Let's extend UI
            var reqName = 'userinterface.AddExtensionRequest';
            var reqBuilder = sandbox.getRequestBuilder(reqName)
            var request = reqBuilder(this);
            sandbox.request(this, request);

            sandbox.registerAsStateful(this.mediator.bundleId, this);



        
            /* admin rights plugin*/

/*            var rightsPlugin = Oskari.clazz.create('Oskari.framework.bundle.admin-layerrights.plugin.ManageAdminRightsPlugin', rightsConf, locale);
            mapModule.registerPlugin(rightsPlugin);
            mapModule.startPlugin(rightsPlugin);
            this.rightsPlugin = rightsPlugin;
*/

            // draw ui
            me.createUi();
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        "init" : function() {
          return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does 
         * nothing atm
         */
        "update" : function() {

        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event 
         * object
         * Event is handled forwarded to correct #eventHandlers if found 
         * or discarded if not.
         */
        onEvent : function(event) {

          var handler = this.eventHandlers[event.getName()];
          if(!handler)
        return;

          return handler.apply(this, [event]);

        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers : {
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        "stop" : function() {
          var sandbox = this.sandbox();
          for(p in this.eventHandlers) {
        sandbox.unregisterFromEventByName(this, p);
          }

          var reqName = 'userinterface.RemoveExtensionRequest';
          var reqBuilder = sandbox.getRequestBuilder(reqName);
          var request = reqBuilder(this);

          sandbox.request(this, request);

          this.sandbox.unregisterStateful(this.mediator.bundleId);
          this.sandbox.unregister(this);
          this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol 
         * startExtension method
         * Creates a flyout and a tile:
         * Oskari.mapframework.bundle.publisher.Flyout
         * Oskari.mapframework.bundle.publisher.Tile
         */
        startExtension : function() {
          this.plugins['Oskari.userinterface.Flyout'] = 
        Oskari.clazz.create('Oskari.framework.bundle.admin-layerrights.Flyout', 
                    this);
          this.plugins['Oskari.userinterface.Tile'] = 
        Oskari.clazz.create('Oskari.framework.bundle.admin-layerrights.Tile', 
                    this);
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol 
         * stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension : function() {
          this.plugins['Oskari.userinterface.Flyout'] = null;
          this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins 
         * method
         * @return {Object} references to flyout and tile
         */
        getPlugins : function() {
          return this.plugins;
        },
        /**
         * @method getTitle 
         * @return {String} localized text for the title of the component 
         */
        getTitle : function() {
          return this.getLocalization('title');
        },
        /**
         * @method getDescription 
         * @return {String} localized text for the description of the 
         * component 
         */
        getDescription : function() {
          return this.getLocalization('desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi : function() {
          var me = this;
          me.plugins['Oskari.userinterface.Flyout'].setContent();
          me.plugins['Oskari.userinterface.Tile'].refresh();
        },
        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState : function(state) {
          this.plugins['Oskari.userinterface.Flyout'].setState(state);
        },
        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState : function() {
          return this.plugins['Oskari.userinterface.Flyout'].getState();
          /*
        var state = {
        
        };
        
        return state;
          */
    }
      }, {
        /**
         * @property {String[]} protocol
         * @static 
         */
        "protocol" : [
          'Oskari.bundle.BundleInstance', 
          'Oskari.mapframework.module.Module', 
          'Oskari.userinterface.Extension'
        ]
      }
     );
