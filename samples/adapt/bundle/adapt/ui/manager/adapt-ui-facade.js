
Oskari.clazz
		.define(
				'Oskari.mapframework.ui.manager.adapt.Facade',

				/**
				 * @constructor
				 * 
				 * creates a facade
				 */
				function(sandbox, manager, parts) {

					this.sandbox = sandbox;
					this.manager = manager;
					this.parts = parts;
					this.additionalComponents = {};
				},
				{
					/**
					 * @method registerPart
					 */
					registerPart : function(part, mod) {
						this.parts[part] = mod;
					},

					/**
					 * @method getSandbox
					 */
					getSandbox : function() {
						return this.sandbox;
					},

					/**
					 * @method getManager
					 */
					getManager : function() {
						return this.manager;
					},

					/**
					 * @method getParts
					 */
					getParts : function() {
						return this.parts;
					},

					/**
					 * @method appendExtensionModule
					 * 
					 * append and register bundle with optional UI component If
					 * UI component is not provided. Module init method should
					 * return UI component.
					 * 
					 * Wraps portlet kinds of panels with bundle close
					 * operations.
					 * 
					 * Registers events for extension bundle if requested
					 * 
					 */
					appendExtensionModule : function(module, identifier,
							eventHandlers, bundleInstance, regionDef, loc, comp) {

						var lang = this.sandbox.getLanguage();

						var def = this.manager.addExtensionModule(module,
								identifier, regionDef, loc, comp);

						def.bundleInstance = bundleInstance;
						if (def.module) {
							if (def.component)
								def.initialisedComponent = this.getSandbox()
										.register(def.module);
							else
								def.component = this.getSandbox().register(
										def.module);

						}

						if (def.component) {

							var region = null;

							var isPortlet = true;

							if (typeof regionDef == "string") {
								region = regionDef;
							}

							isPortlet = this.parts['Portlet'][region];

							if (isPortlet) {
								var portlet = {
									border: false,
									title : def.loc[lang].title,
									xtype : 'portlet',
									layout : 'fit',
									items : [ def.component ],
									tools : [ {
										type : 'gear',

										handler : function(event, toolEl, panel) {
											def.bundleInstance.config();
										}
									} ],
									listeners : {
										'close' : function() {
											def.bundleInstance.stop();
											var manager = def.bundleInstance.mediator.manager;
											var instanceid = def.bundleInstance.mediator.instanceid;
											manager.destroyInstance(instanceid);
											def.bundleInstance = null;

										}
									}

								};

								/*var partHost = this.parts['Drawer'][region];
								partHost.expand(false);*/

								var host = null;

								/**
								 * first column so need to getComponent(0)
								 */
								host = this.parts['Portlet'][region].getComponent(0);

								var cmp = host.add(portlet);
								def.host = host;
								def.cmp = cmp;

							} else {
								var host = this.parts[region];

								var cmp = host.add(def.component);
								def.host = host;
								def.cmp = cmp;

							}

							def.component = null;
						}

						/*
						 * register events
						 */
						for (p in eventHandlers) {
							this.sandbox.registerForEventByName(module, p);
						}

						return def;
					},
					
					/**
					 * @method addUIComponent
					 * 
					 * adds ui component to requested region
					 * 
					 */
					addUIComponent : function(identifier, component, region) {
						
						// TODO: should we call actual manager instead of manipulating panels here?
						this.parts[region].add(component);
						
						var compConf = {
							ident : identifier,
							region : region,
							comp: component
						};
						this.additionalComponents[identifier] = compConf;
					},

					/**
					 * @method removeUIComponent
					 * 
					 * removes an added ui component that matches given identifier
					 * TODO: experimental and lacking error handling
					 * 
					 */
					removeUIComponent : function(identifier) {
					
						var compConf = this.additionalComponents[identtifier];
						this.parts[compConf.region].remove(compConf.comp);
					},

					/**
					 * @method removeExtensionModule
					 * 
					 * remove and unregister module unregisters any events
					 */
					removeExtensionModule : function(module, identifier,
							eventHandlers, bundleInstance, def) {
						/*
						 * unregister events
						 */
						for (p in eventHandlers) {
							this.sandbox.unregisterFromEventByName(module, p);
						}

						this.sandbox.unregister(module);

					},

					/**
					 * @property collapseDirections
					 */
					collapseDirections : {
						'N' : Ext.Component.DIRECTION_TOP,
						'E' : Ext.Component.DIRECTION_RIGHT,
						'S' : Ext.Component.DIRECTION_BOTTOM,
						'W' : Ext.Component.DIRECTION_LEFT
					},

					/**
					 * @method collapsePart
					 */
					collapsePart : function(part) {
						this.parts['Drawer'][part].collapse(
								this.collapseDirections[part], false);
					},

					/**
					 * @method expandPart
					 */
					expandPart : function(part) {
						this.parts['Drawer'][part].expand(false);
					}

				}, {
					'protocol' : [ 'Oskari.mapframework.ui.manager.Facade' ]
				});

