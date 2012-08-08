 /*
  * http://188.117.35.14/TrainRSS/TrainService.svc/AllTrains
  * 
  * http://jkorhonen.nls.fi/rss/TrainRSS/TrainService.svc/AllTrains
  * 
  * 
  * To-DO 
  * - train IMAGES! 
  * - load and reload RSS feed in 'background' as interval callback 
  * - read lastBuildDate? from RSS response to check updates?
  * - move (with easing...) features instead of rebuilding from scratch
  * --> will need "merge" op and uuid for features to implement this one
  *   
  * - update grid data
  * -  
  * 
  * depends: OpenLayers, ExtJS4, Mapframework
  * 
  * 
  * @to-do train direction arrow or such
  * @to-do train trail for all or selected train(s)
  * @to-do spatial feed filter to to select feed content based on location
  * @to-do server side georss buffer that fetches feed from backend and
  * 		buffers feed content to support massive access
  * 
  * 	 	
  * 
  */

/**
 * @class Oskari.mapframework.bundle.TrainsBundleUI
 * 
 * (Ext) UI for the Trains Bundle Instance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.TrainsBundleUI", function(
		libs,bundle) {
	this.libs = libs;
	this.form = null;
	this.ui = null;
	this.store = null;
	this.form = null;
	this.grid = null;
	this.bundle = bundle;
	this.items = {};

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
	
	
	showTrain: function(featAtts) {
		this.items.lbl.setValue(featAtts.title||'');
	},
	showTrainDetails: function(featAtts) {
		var store = this.getStore();
		store.removeAll();		
		store.add([featAtts]);
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
			title : 'Trains',
			columns : [ {
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    icon   : '../map-application-framework/resource/silk-icons/control_play.png', 
                    tooltip: 'Show',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = me.getStore().getAt(rowIndex);
                        
                    }
                }]},
                
            {
				text : 'Title',
				flex : 1,
				dataIndex : 'title'
			}, {
				text: 'Guid',
				flex: 1,
				dataIndex: 'guid'
			},{
				text : 'From',
				flex: 1,
				dataIndex: 'from'
			}, {
				text : 'To',
				flex: 1,
				dataIndex : 'to'
			},{
				text : 'Status',
				flex: 1,
				dataIndex : 'status'
			},{
				text : 'Dir',
				flex: 1,
				dataIndex : 'dir'
			}]
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
