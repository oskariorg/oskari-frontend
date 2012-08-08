/**
 * 
 * http://jkorhonen.nls.fi/geoserver/wms?request=GetCapabilities&version=1.3.0
 * 
 * Luodaan layerhandlerilla dynaamisesti WMS palvelun layereita
 * 
 */
/*
 * OpenLayers.Format.WMSCapabilities
 */

	/**
	 * WmsLayer Instance
	 */


Oskari.clazz.define("Oskari.mapframework.bundle.WmsCapsUI", function(
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

	playWmsLayer : function(WmsLayerRec) {
		this.bundle.playWmsLayer(WmsLayerRec);
		
	},
		
	stopWmsLayer: function(WmsLayerRec) {
		this.bundle.stopWmsLayer(WmsLayerRec);
		
	},
	
	refresh: function() {
		this.grid.getView().refresh();
	},

	/**
	 * create UI with the provided libraries
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
							icon : '../resource/silk-icons/control_play_blue.png',
							handler : function(grid, rowIndex,
									colIndex) {
								var rec = me.getStore().getAt(rowIndex);
								me.playWmsLayer(rec);
							},
							getClass : function(v, meta, rec) {
								
								var layername = rec.get('name');
								if( me.bundle.layerManager.layers[layername ])
									return "hidden";

								else 
									return "";
								
									
							}
						},
						{
							icon : '../resource/silk-icons/control_stop.png',
							handler : function(grid, rowIndex,
									colIndex) {
								var rec = me.getStore().getAt(rowIndex);
								me.stopWmsLayer(rec);

							},
							getClass : function(v, meta, rec) {
								
								var layername  = rec.get('name');
								if( !me.bundle.layerManager.layers[layername ])
									return "hidden";
								else 
									return "";
							}
						} ]
			};

		
		var grid = xt.create('Ext.grid.Panel', {

			store : me.getStore(),
			/*
			 * width : 400, height : 200,
			 */
			title : 'Layers',
			columns : [ gridActionColumn/*
										 * { xtype : 'actioncolumn', width : 50,
										 * items : [ { icon :
										 * '../resource/silk-icons/control_play.png',
										 * tooltip : 'Apply', handler :
										 * function(grid, rowIndex, colIndex) { } } ] }
										 */, {
				text : 'Title',
				flex : 1,
				dataIndex : 'title'
				
					
			}, {
				text: "Layer Name",
				dataIndex : "name",
				flex: 1
				
			}]
		});
		this.grid = grid;

		/*
		 * form
		 */

		var form = new xt.create('Ext.Panel', {
			// title : 'Data',
			bodyStyle : 'padding:5px 5px 0',
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
