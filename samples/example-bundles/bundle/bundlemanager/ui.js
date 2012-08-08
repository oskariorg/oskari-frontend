/**
 * 
 *  
 */

/**
 * 
 * @class Oskari.mapframework.bundle.BundleManagerUI
 * 
 * UI for this Bundle Instance. Show a list of bundles in a grid.
 * 
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.BundleManagerUI", function(
		libs, bundle) {
	this.libs = libs;
	this.form = null;
	this.ui = null;
	this.store = null;
	this.form = null;
	this.grid = null;
	this.bundle = bundle;
	this.lang = null;

}, {
	clear : function() {
		this.store = null;
		this.form = null;
		this.libs = null;
		this.ui = null;
		this.grid = null;
	},
	setLibs : function(libs) {
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
	getGrid : function() {
		return this.grid;
	},
	setLang : function(l) {
		this.lang = l;
	},
	getLang : function() {
		return this.lang;
	},
	/*
	 * ...
	 */

	playBundle : function(bundleRec) {
		this.bundle.playBundle(bundleRec);
	},
	
	pauseBundle: function(bundleRec) {
		this.bundle.pauseBundle(bundleRec);
	},
	resumeBundle: function(bundleRec) {
		this.bundle.resumeBundle(bundleRec);
	},
	stopBundle: function(bundleRec) {
		this.bundle.stopBundle(bundleRec);
	},
	
	refresh: function() {
		this.grid.getView().refresh();
	},

	/**
	 * @method create
	 * 
	 * create UI 
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
		var lang = me.lang;
		
		var gridActionColumn = {
				xtype : 'actioncolumn',
				width : 64,
				items : [
						{
							text: 'Play',
							icon : '../../map-application-framework/resource/silk-icons/control_play.png',							
							handler : function(grid, rowIndex,
									colIndex) {
								var rec = me.getStore().getAt(rowIndex);
								me.playBundle(rec);
							},
							getClass : function(v, meta, rec) {
								
								var bundleinstancename = rec.get('bundleinstancename');
								
								var isSingleton = rec.get('metadata')["Singleton"];
								if( isSingleton && me.bundle.bundleInstances[bundleinstancename])
									return "hidden";
								
								
									return "";
									
							}
						},
						{
							text: 'Stop',
							icon : '.../../map-application-framework/resource/silk-icons/control_eject.png',
							handler : function(grid, rowIndex,
									colIndex) {
								var rec = me.getStore().getAt(rowIndex);
								me.stopBundle(rec);

							},
							getClass : function(v, meta, rec) {
								var isSingleton = rec.get('metadata')["Singleton"];
								if( !isSingleton )
									return "hidden";
								
								var bundleinstancename = rec.get('bundleinstancename');
								if( !me.bundle.bundleInstances[bundleinstancename])
									return "hidden";
								
									return "";
							}
						} ]
			};

		
		var grid = xt.create('Ext.grid.Panel', {
			defaults: { bodyPadding: 4 },
			store : me.getStore(),
			/*width : 400,
			height : 200,*/
			title : 'Bundles',
			columns : [ gridActionColumn/*{
				xtype : 'actioncolumn',
				width : 50,
				items : [ {
					icon : '../resource/silk-icons/control_play.png',
					tooltip : 'Apply',
					handler : function(grid, rowIndex, colIndex) {
					
					}
				} ]
			}*/, {
				text : 'Title',
				flex : 1,
				dataIndex : 'title',
				hidden: true
					
			}, {
				text : 'fi',
				flex : 1,
				dataIndex : 'fi',
				hidden : lang != 'fi'
			}, {
				text : 'sv',
				flex : 1,
				dataIndex : 'sv',
				hidden : lang != 'sv'
			}, {
				text : 'en',
				flex : 1,
				dataIndex : 'en',
				hidden : lang != 'en'
			},{
				text: "bundlename",
				dataIndex : "bundlename",
				hidden: true
			},{
				
				text: "bundleinstancename",
				dataIndex : "bundleinstancename",
				hidden: true
					
			}]
		});
		this.grid = grid;

		/*
		 * form
		 */

		var form = new xt.create('Ext.Panel', {
			//title : 'Data',
			bodyStyle : 'padding:5px 5px 5px 5px',
			height : 384,
			layout : 'fit',
			defaults : {
				bodyPadding : 4
			},
			items : [ grid ]
		});

		this.form = form;
		return form;
	}

});
