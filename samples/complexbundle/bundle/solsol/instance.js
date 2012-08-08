/**
 * @todo solitairePlayer depends on jQueryUI - REIMPLEMENT with Ext fx
 *  
 */

/**
 * @class Oskari.mapframework.bundle.SolSolBundleInstance
 */

Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.SolSolBundleInstance",
				/**
				 * @constructor
				 */
				function() {

				},
				{
					/** class methods */
					/**
					 * @method start
					 */
					"start" : function() {
						var manager = this.mediator.manager;
						var b = this.mediator.bundle;

						var player = Oskari.clazz
								.create('Oskari.mapframework.solsol.SolSolPlayer');
						player.createAI();
						this.player = player;

						var pnl = Ext
								.create(
										'Ext.panel.Panel',
										{
											"float" : true,
											"id" : 'solsol-win',
											iconCls : 'tabs',
											shim : false,
											closable : false,
											animCollapse : false,
											border : false,
											layout : 'fit',
											html : '<div class="solitaire" style="width:100%;height:100%" id="solitaire"></div>',
											bbar : [ Ext.create('Ext.Action', {
												text : 'Pysäytä/Jatka',
												handler : function() {
													player.solStart();
												},
												iconCls : 'solsol_play'
											}), Ext.create('Ext.Action', {
												text : 'Jaa uudelleen',
												handler : function() {
													player.solNewGame();
												},
												iconCls : 'solsol_new_game'
											}) ]
										})

						var x = this.mediator.clazz.global("Ext");

						var x = Oskari.$("Ext");

						var bundleInstance = this;

						Ext
								.create(
										'Ext.window.Window',
										{
											x : 100,
											y : 100,
											width : 646,
											height : 480,
											layout : 'fit',
											items : [ pnl ],
											listeners : {
												'close' : function() {
													bundleInstance.stop();
													var manager = bundleInstance.mediator.manager;
													var instanceid = bundleInstance.mediator.instanceid;
													bundleInstance = null;
													manager
															.destroyInstance(instanceid);
												}
											}
										}).show();

						var solDom = document.getElementById('solitaire');
						// solDom = Ext.getDom(sol.body);
						player.startup(solDom);

					},
					"update" : function() {
					},
					"stop" : function() {
						this.player.shutdown();
						this.player = null;
					}
				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance" ]
				})
