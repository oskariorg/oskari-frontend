/*
 *
 * @to-do
 * 
 * STORE
 *   Adapter,Package,SubPackage,Classname,method,signature,source,resource	 	
 * 
 */

/**
 * @class Oskari.mapframework.bundle.ClazzBrowserBundleUI
 * 
 * (Ext) UI for the ClazzBrowser Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.ClazzBrowserBundleUI",
				function(libs, bundle) {
					this.libs = libs;
					this.form = null;
					this.ui = null;
					this.store = null;
					this.form = null;
					this.grid = null;
					this.bundle = bundle;
					this.items = {};

				},
				{
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
						return this.pnl;
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
					getBundle: function() {
						return this.bundle;
					},
					/*
					 * ...
					 */

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

						var grid = this.createGrid();

						this.grid = grid;

						grid.on("selectionchange", function(selectionModel,
								selected, eOpts) {

							me.showObjInfos(selected);
						});

						var srcPanel = xt
								.create(
										'Ext.panel.Panel',
										{
											title : 'Content',
											autoScroll : true,
											layout : 'fit',
											region : 'south',
											height : 256,
											html : '<pre id="code" name="code" class="prettyprint"></pre>'

										});
						this.srcPanel = srcPanel;

						/*
						 * form
						 */

						var pnl = xt.create('Ext.Panel', {

							bodyStyle : 'padding:5px 5px 0',
							height : 512,

							layout : 'border',
							defaults : {
								bodyPadding : 4
							},
							items : [ grid, srcPanel ]
						});

						this.pnl = pnl;
						return pnl;
					},

					gridColumns : [
					/*
					 * { xtype : 'actioncolumn', width : 50, items : [ { icon :
					 * '../map-application-framework/resource/silk-icons/control_play.png',
					 * tooltip : 'Show', handler : function(grid, rowIndex,
					 * colIndex) { var rec = me.getStore().getAt(rowIndex); } } ] },
					 */{
						text : 'Bundle',
						flex : 1,
						dataIndex : 'bundle'
					}, {
						text : 'Adapter',
						flex : 1,
						dataIndex : 'adapter',
						hidden : true
					}, {
						text : 'Package',
						flex : 1,
						dataIndex : 'bp',
						hidden : true
					}, {
						text : 'SubPackage',
						flex : 1,
						dataIndex : 'sp',
						hidden : true
					}, {
						text : 'Class',
						flex : 1,
						dataIndex : 'clazz'//,
						//hidden : true
					}, {
						text : 'Method',
						flex : 1,
						dataIndex : 'method'//,
						//hidden : true
					}, {
						text : 'Signature',
						flex : 1,
						dataIndex : 'signature',
						hidden : true
					}, /*
						 * { text : 'Source', flex : 1, dataIndex : 'source' },
						 */
					{
						text : 'Resource',
						flex : 2,
						dataIndex : 'resource'
					}, {
						text : 'Type',
						flex : 1,
						hidden : true,
						dataIndex : 'type'
					} ],

					/**
					 * @method createGrid
					 */
					createGrid : function() {
						var me = this;
						var xt = me.libs.ext;
						var columns = this.gridColumns;

						var groupingFeature = Ext
								.create(
										'Ext.grid.feature.Grouping',
										{
											groupHeaderTpl : 'Bundle: {bundle} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
										});

						var grid = xt.create('Ext.grid.Panel', {
							region : 'center',
							store : me.getStore(),
							title : 'ClazzBrowser',
							columns : columns,
							features : [ groupingFeature ]
						// ,
								// paging bar on the bottom
								/*
								 * fbar : Ext .create( 'Ext.PagingToolbar', {
								 * store : this .getStore(), displayInfo : true,
								 * displayMsg : 'Displaying topics {0} - {1} of
								 * {2}', emptyMsg : "No topics to display" })
								 */
								});

						return grid;
					},

					showObjInfos : function(selected) {

						var me = this;

						var sel = selected[0];
						var rc = sel.get('resource');
						var clazzSrc = sel.get('clazzSrc')

						if( rc ) {

						Ext.Ajax.request( {
							url : rc,

							/**
							 * reports failure although is a sucssss
							 */
							failure : function(response) {
								me.showSource(response.responseText);
							},
							success : function(response) {
								var text = response.responseText;
								// process server response here

							me.showSource(response.responseText);
						}
						});
						
						} else if(clazzSrc ) {
							var clazzarr = me.getBundle().getClazzArr();
							var func = clazzarr[clazzSrc];
							me.showSource(''+func);
						}
						
					},

					showSource : function(content) {

						// alert(this.srcPanel.getComponent(0).getEl().dom);
						var docel = document.getElementById("code");
						docel.innerText = content;
						prettyPrint();

				}

				});
