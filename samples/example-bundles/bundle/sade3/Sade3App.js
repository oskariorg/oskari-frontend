	/**
	 * Bundle Instance
	 */


Oskari.clazz.define('Oskari.poc.sade3.SadeApp',function(a) {


	this.args = a || {};

	this.uiManager = null;

	this.core = null;

	this.userInterfaceLanguage = this.args.lang || "fi";

	this.locale = Oskari.clazz.create('Oskari.poc.sade3.SadeLocale',this.userInterfaceLanguage);

	this.worker = null;

	this.mediator = null;

	this.adapter = null;
	
	
	this.sandbox = null;
	
	this.layermanager  = null;
	
	

},{

	getWorker : function(w) {

		return this.worker;

	},

	setWorker : function(w) {

		this.worker = w;

	},

	getLocale : function() {

		return this.locale;

	},


	getMediator : function() {

		return this.mediator;

	},

	setMediator : function(m) {

		this.mediator = m;

	},

	setAdapter : function(a) {

		this.adapter = a;

	},

	getAdapter : function() {

		return this.adapter;

	},
	
	setSandbox: function(sb) {
		this.sandbox = sb;
	},
	getSandbox: function() {
		return this.sandbox;
	},
	setLayerManager: function(lm) {
		this.layermanager = lm;
	},
	getLayerManager: function() {
		return this.layermanager;
	}
	
});
