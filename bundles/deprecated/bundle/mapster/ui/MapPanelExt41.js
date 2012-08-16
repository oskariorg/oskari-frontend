Ext.define('MapPanel', {
	extend : 'Ext.Panel',
	alias : 'widget.nlsfimappanel',
	requires : [ 'Ext.window.MessageBox' ],

	initComponent : function(config) {

		Ext.applyIf(this, config);

		this.callParent();
	},

	afterRender : function() {

		this.callParent();

		this.renderMap();
	},

	renderMap : function() {
		var maptarget = this.body.dom;

		this.getMap().render(maptarget);

	},

	afterComponentLayout : function(w, h) {

		if (typeof this.getMap() == 'object') {
			this.getMap().updateSize();
		}

		this.callParent(arguments);

	},
	setSize : function(width, height, animate) {

		if (typeof this.getMap() == 'object') {
			this.getMap().updateSize();
		}

		this.callParent(arguments);

	},
	getMap : function() {
		return this.olmap;

	},
	getCenter : function() {
		return this.getMap().getCenter();

	},
	getCenterLatLng : function() {
		var ll = this.getCenter();
		return {
			lat : ll.lat(),
			lng : ll.lng()
		};

	}

});