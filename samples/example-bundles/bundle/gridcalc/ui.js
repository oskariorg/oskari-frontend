 /*
  *
  * tobe removed
  * 	 	
  * 
  */

/**
 * UI for this Bundle Instance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.GridCalcBundleUI", function(
		libs,bundle) {
	this.libs = libs;
	this.form = null;
	this.ui = null;
	this.store = null;
	this.form = null;
	this.grid = null;
	this.bundle = bundle;
	this.items = {};
	this.gridmath = null;

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
		return this.pnl;
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
	
	showTile: function(featAtts) {
		this.items.lbl.setValue(featAtts.title||'');
	},
	showTileDetails: function(featAtts) {
		var store = this.getStore();
		//store.removeAll();		
		//store.add([featAtts]);
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
		var grid = xt.create('Ext.grid.Panel', {

			store : me.getStore(),
			width : 400,
			height : 200,
			title : 'gridcalc',
			columns : [ {
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    icon   : '../resource/silk-icons/control_play.png', 
                    tooltip: 'Show',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = me.getStore().getAt(rowIndex);
                        
                    }
                }]},
            {
				text: 'Left',
				flex: 1,
				dataIndex: 'left'
			},{
				text : 'Bottom',
				flex: 1,
				dataIndex: 'bottom'
			}, {
				text : 'Right',
				flex: 1,
				dataIndex : 'right'
			},{
				text : 'Top',
				flex: 1,
				dataIndex : 'top'
			}
			]
		});
		this.grid = grid;
		
		/*
		 * form
		 */
		
		var lbl = xt.create('Ext.form.field.Text',{
	        name: 'name',
	        fieldLabel: 'Name',
	        allowBlank: false  
	    });
		this.items.lbl = lbl;
		
		var form = xt.create('Ext.form.Panel',{
			items: [lbl,grid]
		});
		this.form = form;
		
		var pnl = xt.create('Ext.Panel', {

			bodyStyle : 'padding:5px 5px 0',
			height : 384,
			
			layout : 'fit',
			defaults : {
				bodyPadding : 4
			},
			items : [form ]
		});

		this.pnl = pnl;
		return pnl;
	}
	
});