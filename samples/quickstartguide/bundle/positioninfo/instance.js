
/**
 * @class Oskari.mapframework.bundle.PositionInfoInstance
 * 
 * Bundle Instance
 */
Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.PositionInfoInstance",
				
				/**
				 * constructor
				 * 
				 * NOTE: ! This SHALL not do anything complex
				 * 
				 */
				function(b) {
					this.name = 'positioninfoModule';
					this.mediator = null;
					this.sandbox = null;

				
					
					this.ui = null;
				},
				/*
				 * prototype
				 */
				{

					/**
					 * @method start
					 * 
					 * start bundle instance
					 * called by bundle manager
					 * 
					 */					
					"start" : function() {

						if (this.mediator.getState() == "started")
							return;

						/**
						 * These should be SET BY Manifest begin 
						 */
						this.libs = {
							ext : Oskari.$("Ext")
						};
						
						this.facade = Oskari.$('UI.facade');
						/**
						 * These should be SET BY Manifest end 
						 */
						/**
						 * register to framework and eventHandlers
						 */
						var def = this.facade.appendExtensionModule(this, this.name,
								this.eventHandlers, 
								this, 
								'W', {
									'fi' : {
										title : 'positioninfo'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : 'positioninfo'
									}

								});
						this.def = def;
						
						this.mediator.setState("started");
						return this;
					},

					/**
					 * @method init
					 * 
					 * init UI module called after start
					 */
					init : function(sandbox) {
						this.sandbox = sandbox;
						/*
						 * build UI
						 */

						var ui = Oskari.clazz.create(
								'Oskari.mapframework.bundle.PositionInfoUI',
								this.libs);
						this.ui = ui;

						ui.create();

						return ui.get();
					},

					/**
					 * @method update 
					 * 
					 * notifications from bundle manager
					 */
					"update" : function(manager, b, bi, info) {
						manager
								.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
										+ info);
					},

					/**
					 * @method stop
					 * stop bundle instance
					 */
					"stop" : function() {
						this.facade.removeExtensionModule(this, this.name,this.eventHandlers,this,this.def);
						this.def = null;
						this.mediator.setState("stopped");

						return this;
					},
					
					/*
					 * @method onEvent
					 * 
					 * dispatches events to eventHandlers
					 */
					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					/*
					 * @property eventHandlers
					 * eventHandlers to be bound to map framework
					 */
					eventHandlers : {
						
						/**
						 * @method MouseHoverEvent
						 * 
						 * updated frequently (re-using same event
						 * with updated infos)
						 */
						"MouseHoverEvent" : function(event) {
							var n = event.getLat();
							var e = event.getLon();
							this.ui.updateLocationInfo(n, e);
						},
						
						/**
						 * @method AfterMapMoveEvent
						 * 
						 * called after user's stopped moving the map
						 */
						"AfterMapMoveEvent" : function(event) {

							var n = event.getCenterY();
							var e = event.getCenterX();

							this.ui.updateLocationInfo(n, e);

							this.mediator.manager
									.alert("AfterMapMoveEvent "
											+ n
											+ ","
											+ e
											+ " @Oskari.mapframework.bundle.PositionInfoInstance "
											+ event.getName());
						}
					},

					/**
					 * @method getName
					 * 
					 * required to return a unique name for this bundle
					 */
					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.PositionInfoInstance"

				},
				{
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.module.Module",
							"Oskari.mapframework.bundle.extension.Extension",
							"Oskari.mapframework.bundle.extension.EventListener" ]
				});
