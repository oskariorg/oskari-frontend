/**
 * 
 */

/**
 * @class Oskari.mapframework.bundle.WikipediaBundleUI
 * 
 * UI for this Bundle Instance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.WikipediaBundleUI", function(
		libs,bundle) {
	this.libs = libs;
	this.form = null;
	this.ui = null;
	this.store = null;
	this.form = null;
	this.grid = null;
	this.bundle = bundle;

}, {
	clear: function() {
		this.store = null;
		this.form = null;
		this.libs = null;
		this.ui = null;
		this.grid = null;
	},
	setLibs: function(libs) {
		this.libs = libs;
	},
	get : function() {
		return this.form;
	},
	setStore : function(s) {
		this.store = s;		
	},
	getStore : function() {
		return this.store;
	},
	getGrid: function() {
		return this.grid;
	},
	/*
	 * ...
	 */
	
	showArticle: function(urlPart) {
		this.bundle.showArticle(urlPart);
	},
	
	/**
	 * @method create
	 * 
	 *  create UI with the provided libraries
	 */
	create : function() {
		var xt = this.libs.ext;

		
		/**
		 * store
		 */
		var xt = this.libs.ext;

		
		

		
		/**
		 * grid
		 */
		var me = this;
		var grid = xt.create('Ext.grid.Panel', {
			store : me.getStore(),
			title : 'Nearby Wikimedia',
			columns : [ {
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    icon   : '../../map-application-framework/resource/silk-icons/control_play.png', 
                    tooltip: 'Show',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = me.getStore().getAt(rowIndex);
                        var urlPart = rec.get('wikipediaUrl');
                        me.showArticle(urlPart);
                        
                        /*
						 * xt.create('Ext.Window',{ width: 640, height: 480,
						 * html: '<iframe width="100%" height="100%"
						 * src="http://'+urlPart+'"></iframe>' }).show();
						 */
                    }
                }]}, {
    				text : 'Title',
    				flex : 1,
    				dataIndex : 'title'
    			},{
				text : 'N',
				width : 64,
				sortable : false,
				hideable : false,
				dataIndex : 'n'
			}, {
				text : 'E',
				width : 64,
				dataIndex : 'e',
				sortable : false,
				hideable : false
			} ]
		});
		this.grid = grid;
		
		/*
		 * form
		 */
		
		var form = new xt.create('Ext.panel.Panel', {
			// title : 'Data',
			bodyStyle : 'padding:5px 5px 0',
			height : 384,			
			layout : 'card',
			defaults : {
				bodyPadding : 4
			},
			items : [grid ]
		});

		this.form = form;
		return form;
	}
	
});
