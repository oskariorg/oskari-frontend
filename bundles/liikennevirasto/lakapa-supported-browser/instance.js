/**
* @class Oskari.liikennevirasto.bundle.lakapa.LaKaPaSupportedBrowserBundleInstance
*
* Registers and starts the
* Oskari.liikennevirasto.bundle.lakapa.LaKaPaSupportedBrowserBundleInstance plugin for main map.
*/
Oskari.clazz.define("Oskari.liikennevirasto.bundle.lakapa.LaKaPaSupportedBrowserBundleInstance",

	/**
	* @method create called automatically on construction
	* @static
	*/
	function() {
	this.sandbox = null;
	this.started = false;
	this._localization = null;
	this.requestHandlers = {};
	}, {
		/**
		* @static
		* @property __name
		*/
		__name : 'LaKaPaSupportedBrowserBundle',

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
		* @param {Oskari.Sandbox} sandbox
		* Sets the sandbox reference to this component
		*/
		setSandbox : function(sbx) {
			this.sandbox = sbx;
		},
		/**
		* @method getSandbox
		* @return {Oskari.Sandbox}
		*/
		getSandbox : function() {
			return this.sandbox;
		},
		/**
		* @method start
		* BundleInstance protocol method
		*/
		start : function() {
			var me = this;
			if(me.started){
				return;
			}
			var conf = me.conf;

			me.started = true;

			var conf = this.conf;
			var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
			var sandbox = Oskari.getSandbox(sandboxName);
			me.sandbox = sandbox;

			sandbox.register(me);
			var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
			var locale = this.getLocalization('display');
			var browser = me.testBrowser();
			/*
			 * Application currently provides support for:
			 * - Interner Explorer 9 or newer
			 * - Opera 12.16 or newer
			 * - Firefox 18 or newer
			 * - Safari 5.1 or newer
			 * - Chrome
			 */
			if(browser.name !== 'Chrome') {
				if(browser.name === 'Firefox') {
					if (browser.fullVersion < 18) {
						me.sandbox.postRequestByName('ShowMessageRequest', [locale.title, locale.html]);
					}
				} else if(browser.name === 'Opera') {
					if (browser.fullVersion < 12.16) {
						me.sandbox.postRequestByName('ShowMessageRequest', [locale.title, locale.html]);
					}
				} else if(browser.name === 'IE') {
					if (browser.fullVersion < 9) {
						me.sandbox.postRequestByName('ShowMessageRequest', [locale.title, locale.html]);
					}
				} else if(browser.name === 'Safari') {
					if (browser.fullVersion < 5.1) {
						me.sandbox.postRequestByName('ShowMessageRequest', [locale.title, locale.html]);
					}
				} else {
					me.sandbox.postRequestByName('ShowMessageRequest', [locale.title, locale.html]);
				}
			}
			/*
			 * Test if the Liferay dockbar is visible and give some more margin to spesific elements.
			 * TODO: Make a bundle out of it?
			 */
			var isDockbar = jQuery(".dockbar").length;
			if(isDockbar) {
				jQuery(".logoplugin").css("bottom", "30px");
			}
		},
		/**
		* @method stop
		* BundleInstance protocol method
		*/
		stop : function() {
			var sandbox = this.sandbox();
			for(p in this.eventHandlers) {
				sandbox.unregisterFromEventByName(this, p);
			}

			this.sandbox.unregister(this);
			this.started = false;
		},
		/**
		* @method init
		* implements Module protocol init method - initializes request handlers
		*/
		init : function() {

		},
		/**
		* @method update
		* BundleInstance protocol method
		*/
		update : function() {
		},
		/**
		 * @method checkBrowser
		 * Test the browser and returns an object with the browser name and version.
		 */
		testBrowser : function() {
			var browser;
			var nVer = navigator.appVersion;
			var nAgt = navigator.userAgent;
			var browserName  = navigator.appName;
			var fullVersion  = ''+parseFloat(navigator.appVersion);
			var majorVersion = parseInt(navigator.appVersion,10);
			var nameOffset,verOffset,ix;
			// Parse userAgent for more spesific IE testing. Actual version is defined by trident.
			var testIE = nAgt.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
			// In Opera 15+, the true version is after "OPR/"
			if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
				browserName = "Opera";
				fullVersion = nAgt.substring(verOffset+4);
			}
			// In older Opera, the true version is after "Opera" or after "Version"
			else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
				browserName = "Opera";
				fullVersion = nAgt.substring(verOffset+6);
				if ((verOffset=nAgt.indexOf("Version"))!=-1) {
					fullVersion = nAgt.substring(verOffset+8);
				}
			}
			// In MSIE, the true version is after "MSIE" in userAgent
			else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
				browserName = "IE";
				fullVersion = nAgt.substring(verOffset+5);
			}
			// In Chrome, the true version is after "Chrome"
			else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
				browserName = "Chrome";
				fullVersion = nAgt.substring(verOffset+7);
			}
			// In Safari, the true version is after "Safari" or after "Version"
			else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
				browserName = "Safari";
				fullVersion = nAgt.substring(verOffset+7);
				if ((verOffset=nAgt.indexOf("Version"))!=-1) {
					fullVersion = nAgt.substring(verOffset+8);
				}
			}
			// In Firefox, the true version is after "Firefox"
			else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
				browserName = "Firefox";
				fullVersion = nAgt.substring(verOffset+8);
			}
			// In most other browsers, "name/version" is at the end of userAgent
			else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {
				browserName = nAgt.substring(nameOffset,verOffset);
				fullVersion = nAgt.substring(verOffset+1);
				if (browserName.toLowerCase()==browserName.toUpperCase()) {
					browserName = navigator.appName;
				}
			}
			// Test for IE correctly
			else if(/trident/i.test(testIE[1])) {
				var tmp =  /\brv[ :]+(\d+)/g.exec(nAgt) || [];
		        browserName = 'IE';
		        fullVersion = tmp[1] || '';
			}
			// trim the fullVersion string at semicolon/space if present
			if ((ix=fullVersion.indexOf(";"))!=-1) {
			   fullVersion=fullVersion.substring(0,ix);
			}
			if ((ix=fullVersion.indexOf(" "))!=-1) {
				fullVersion=fullVersion.substring(0,ix);
			}
			majorVersion = parseInt(''+fullVersion,10);
			if (isNaN(majorVersion)) {
				fullVersion  = ''+parseFloat(navigator.appVersion);
				majorVersion = parseInt(navigator.appVersion,10);
			}
			browser = {
				'name': browserName,
				'fullVersion' : fullVersion,
				'majorVersion' : majorVersion,
				'appName' : navigator.appName,
				'userAgent' : navigator.userAgent
			};
			return browser;
		}
	}, {
	/**
	* @property {String[]} protocol
	* @static
	*/
	protocol : ['Oskari.bundle.BundleInstance']
});