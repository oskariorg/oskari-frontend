Oskari.clazz.define('Oskari.poc.sade3.SadeUI', function() {

	this.form = Oskari.clazz.create('Oskari.poc.sade3.SadeFormView');

	this.ui = null;

	this.app = null;

	this.panel = null;

	this.mapAdapter = null;

},

{

	getFormView : function() {
		return this.form;
	},

	getLocale : function() {

		return this.app.getLocale();

	},

	setApp : function(a) {

		this.app = a;

	},

	getApp : function() {

		return this.app;

	},

	setMapAdapter : function(ma) {
		return this.mapAdapter = ma;
	},
	
	getUserInterface: function() {
		return this.ui;
	},
	setUserInterface: function(ui) {
		this.ui = ui;
	},

	createUserInterface : function(listeners) {

		var formPanel = this.form.createView(this);

		this.panel = formPanel;

		/*var ui = Ext.create('Ext.window.Window', {
			shadow : 'sides',
			hideMode : 'offsets',
			frame : false,
			maximizable : true,
			closable: false,

			minimizable: true,
			bodyBorder : false,
			border : 0,
			bodyCls : 'webform',
			x : 40 + 120,
			resizable: false,
			y : 96,
			width : 555,

			height : 666,

			layout : 'fit',

			items : [ formPanel ],
			listeners : listeners

		});
		*/
		var ui = Ext.create('Ext.panel.Panel', {
		hideMode : 'offsets',
		floating : true,
		shadow : 'sides',
		/* modal: true, */
		frame : false,
		autoShow : false,
		preventHeader : true,
		width : 768,
		height : 480,
		x : 40 + 120,
		y : 96,
		closable : false,
		resizable : true,
		resizeHandles : 'se',
		bodyBorder : false,
		layout : 'fit',
		border : 0,
		items : [ formPanel ],
		bodyCls : 'webform',
			items : [ formPanel ],
			listeners : listeners
		});


		this.ui = ui;

	},

	showUserInterface : function() {

		this.ui.show();

	},
	hideUserInterface : function() {

		this.ui.hide();

	},

	setAddress : function(atts) {

		this.form.setAddress(atts);

	},

	setCU : function(atts) {

		this.form.setCU(atts);

	},

	reset : function() {

		this.form.reset();
		this.clearFeaturesFromMap();
	},

	zoomTo : function(lon, lat, scale) {

		if (this.mapAdapter)
			this.mapAdapter.zoomTo(lon, lat, scale);

	},
	clearFeaturesFromMap : function(lid) {

		if (this.mapAdapter)
			this.mapAdapter.clearFeatures(lid);

	}

});