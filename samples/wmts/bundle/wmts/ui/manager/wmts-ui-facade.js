
Oskari.clazz
		.define(
				'Oskari.mapframework.oskari.ui.WmtsFacade',

				/**
				 * @constructor
				 * 
				 * creates a facade
				 */
				function(sandbox, manager, parts) {

					this.sandbox = sandbox;
					this.manager = manager;
					this.parts = parts;

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

							var host = this.parts[region];

							var ttl = null;
							if( loc && loc[lang] )
								ttl = loc[lang].title;
							
							var subcmp = {
									title: ttl,
									layout: 'fit',
									items: [def.component]
							};
							
							var cmp = host.add(subcmp);
							def.host = host;
							def.cmp = cmp;

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

