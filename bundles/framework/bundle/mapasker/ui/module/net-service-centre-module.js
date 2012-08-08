Oskari.clazz
		.define(
				'Oskari.mapframework.ui.module.mapasker.NetServiceCentreModule',
				function(viewName) {

					this._sandbox;

					this._viewName = viewName;
				},
				{
					/***********************************************************
					 * Get module name
					 */
					__name : "NetServiceCentreModule",
					getName : function() {
						return this.__name;
					},

					/***********************************************************
					 * Initialize module
					 * 
					 * @param {Object}
					 *            sandbox
					 */
					init : function(sandbox) {
						sandbox.printDebug("Initializing " + this.getName()
								+ " module...");
						/* we will need this later on */
						this._sandbox = sandbox;

						sandbox.registerForEventByName(this,
								'AfterShowNetServiceCentreEvent');
						sandbox.registerForEventByName(this,
								'AfterHideNetServiceCentreEvent');
						sandbox.registerForEventByName(this,
								'AfterUpdateNetServiceCentreEvent');

						var netServiceCentreModule = this.createModule(sandbox);
						netServiceCentreModule && null;

						return null;

					},

					createModule : function(sandbox) {
						var netServicePageUrl = this._viewName;

						var netServiceCentreModule = Ext
								.create(
										'Ext.Window',
										{
											autoLoad : {
												url : netServicePageUrl,
												scripts : true
											},
											autoScroll : true,
											id : 'net-service-centre-module',
											bodyCssClass : 'net-service-centre-module-content',
											width : 1024,
											height : 800,
											frame : true,
											header : false,
											draggable : false,
											maximizable : false,
											resizable : false,
											modal : true,
											layout : 'fit',
											listeners : {
												beforeclose : function(el) {
													var sandbox = Oskari.$().mapframework.runtime
															.findSandbox();
													sandbox
															.request(
																	'NetServiceCentreModule',
																	sandbox.getRequestBuilder('HideNetServiceCentreRequest')());
													return false;
												}
											}
										});
						netServiceCentreModule.hide();
						return netServiceCentreModule;
					},

					/***********************************************************
					 * Start module
					 * 
					 * @param {Object}
					 *            sandbox
					 */
					start : function(sandbox) {
						sandbox.printDebug("Starting " + this.getName());
					},

					/***********************************************************
					 * Handle AfterShowNetServiceCentreEvent
					 * 
					 * @param {Object}
					 *            event
					 */
					handleAfterShowNetServiceCentreEvent : function(event) {
						var nscWindow = Ext.getCmp('net-service-centre-module');
						if (nscWindow != null) {
							nscWindow.show();
						} else {
							this.createModule();
							var nscWindow = Ext
									.getCmp('net-service-centre-module');
							nscWindow.show();
						}
					},

					/***********************************************************
					 * Handle AfterHideNetServiceCentreEvent
					 * 
					 * @param {Object}
					 *            event
					 */
					handleAfterHideNetServiceCentreEvent : function(event) {
						var nscWindow = Ext.getCmp('net-service-centre-module');
						if (nscWindow != null) {
							nscWindow.destroy();
						}
					},

					/***********************************************************
					 * Handle AfterUpdateNetServiceCentreEvent
					 */
					handleAfterUpdateNetServiceCentreEvent : function() {
						var extServiceCentre = Ext
								.getCmp('net-service-centre-module');
						if (extServiceCentre != null) {
							extServiceCentre.load(this._viewName);
						}
					},

					/***********************************************************
					 * Event handler
					 * 
					 * @param {Object}
					 *            event
					 */
					onEvent : function(event) {
						if (event.getName() == 'AfterShowNetServiceCentreEvent') {
							this.handleAfterShowNetServiceCentreEvent(event);
						} else if (event.getName() == 'AfterHideNetServiceCentreEvent') {
							this.handleAfterHideNetServiceCentreEvent(event);
						} else if (event.getName() == 'AfterUpdateNetServiceCentreEvent') {
							this.handleAfterUpdateNetServiceCentreEvent(event);
						}
					}
				},
				{
					'protocol' : ['Oskari.mapframework.module.Module']
				});

/** Inheritance */
