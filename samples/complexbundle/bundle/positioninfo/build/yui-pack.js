/* This is a unpacked Oskari bundle (bundle script version Mon Feb 27 2012 09:45:18 GMT+0200 (Suomen normaaliaika)) */ 
/**
 *
 * A Copy As IS of the very first Oskari Proof of Concept Bundle
 * 
 * an application bundle
 * 
 * bundle consists of three  parts: 
 * - bundle
 * - bundle_instance
 * - ui
 * 
 * bundle lifecycle installed resolved instantiated (1-n times) started/stopped
 * removed / uninstalled
 * 
 * bundle instance lifecycle start -> started stop -> stopped
 * 
 */

/**
 * UI for this Bundle Instance
 * 
 * @class Oskari.mapframework.bundle.PositionInfoUI
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.PositionInfoUI",
		function(libs) {
			this.libs = libs;
			this.form = null;
			this.ui = null;
		}, {
			get : function() {
				return this.form;
			},

			/**
			 * create UI with the provided libraries
			 */
			create : function() {
				var xt = this.libs.ext;

				var fldN = xt.create('Ext.form.field.Text', {
					fieldLabel : 'N',
					name : 'fldN'
				});
				var fldE = xt.create('Ext.form.field.Text', {
					fieldLabel : 'E',
					name : 'fldE'
				});

				this.ui = {
					'N' : fldN,
					'E' : fldE
				};

				var form = new xt.create('Ext.form.Panel', {
					title : 'Simple Form with FieldSets',
					labelWidth : 75,
					frame : true,
					bodyStyle : 'padding:5px 5px 0',
					width : 550,
					
					layout : 'column',
					defaults : {
						bodyPadding : 4
					},
					items : [ {

						xtype : 'fieldset',
						columnWidth : 1.0,
						title : 'Fieldset 1',
						collapsible : true,
						defaultType : 'textfield',
						defaults : {
							anchor : '100%'
						},
						layout : 'anchor',
						items : [ fldN, fldE ]
					} ]
				});

				this.form = form;
				return form;
			},
			/*
			 * move data to UI
			 */
			updateLocationInfo : function(n, e) {
				if (!this.ui)
					return;

				this.ui.E.setValue(e);
				this.ui.N.setValue(n);

			}

		});

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
