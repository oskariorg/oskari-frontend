/**
* @class Oskari.tampere.bundle.tampere.AdminWfsSearchChannelBundleInstance
*
* Oskari.tampere.bundle.tampere.AdminWfsSearchChannelBundleInstance.
*/
Oskari.clazz.define("Oskari.tampere.bundle.tampere.AdminWfsSearchChannelBundleInstance",
	
	/**
	* @method create called automatically on construction
	* @static
	*/
	function() {
	this.sandbox = null;
	this.started = false;
	this.plugins = {};
	this._localization = null;
	this.requestHandlers = {};
	}, {
		/**
		* @static
		* @property __name
		*/
		__name : 'AdminWfsSearchChannelBundle',
		
		/**
		* @method getName
		* @return {String} the name for the component 
		*/
		getName : function() {
			return this.__name;
		},
		/**
		* @method getLocalization
		* Returns JSON presentation of bundles localization data for
		* current language.
		* If key-parameter is not given, returns the whole localization
		* data.
		*
		* @param {String} key (optional) if given, returns the value for
		*	key
		* @return {String/Object} returns single localization string or
		*	JSON object for complete data depending on localization
		*	structure and if parameter key is given
		*/
		getLocalization : function(key) {
			if(!this._localization) {
				this._localization = Oskari.getLocalization(this.getName());
			}
			if(key) {
				return this._localization[key];
			}
			return this._localization;
		},
		/**
		* @method setSandbox
		* @param {Oskari.mapframework.sandbox.Sandbox} sandbox
		* Sets the sandbox reference to this component
		*/
		setSandbox : function(sbx) {
			this.sandbox = sbx;
		},
		/**
		* @method getSandbox
		* @return {Oskari.mapframework.sandbox.Sandbox}
		*/
		getSandbox : function() {
			return this.sandbox;
		},
		/**
        * @method start
        * implements BundleInstance protocol start methdod
        */
        start: function () {
            var me = this;

            if (me.started)
                return;

            me.started = true;

            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;

            me.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            //Let's extend UI
            var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            // draw ui
            me.createUi();
        },
		/**
		* @method stop
		* BundleInstance protocol method
		*/
        stop: function () {
            var sandbox = this.sandbox,
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

            sandbox.request(this, request);

            //this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
		  /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Flyout
         * Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Tile
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Flyout', this);
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.tampere.bundle.tampere.AdminWfsSearchChannel.Tile', this);
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "selected layers" functionality
         */
        createUi: function () {
            var me = this;
            this.plugins['Oskari.userinterface.Flyout'].createUi();
            this.plugins['Oskari.userinterface.Tile'].refresh();
        },  
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        "init": function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        "update": function () {

        }
	}, {
   	/**
 	* @property {String[]} protocol
 	* @static
	*/
    "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});