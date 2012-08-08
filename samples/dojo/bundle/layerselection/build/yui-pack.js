/* This is a unpacked Oskari bundle (bundle script version Wed Feb 29 2012 07:56:03 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * @class Oskari.poc.dojo.bundle.LayerSelectionBundleInstance
 * 
 * http://dojotoolkit.org/documentation/tutorials/1.7/dom_functions/
 * 
 * 
 * 
 */
Oskari.clazz
		.define(
				"Oskari.poc.dojo.bundle.LayerSelectionBundleInstance",
				function() {
					this.map = null;
					this.core = null;
					this.sandbox = null;
					this.mapmodule = null;
					this.started = false;
					this.template = null;

					/**
					 * @property injected dojo property (by bundle)
					 */
					this.dojo = null;

				},
				{
					/**
					 * @static
					 * @property __name
					 * 
					 */
					__name : 'DojoLayerSelection',
					"getName" : function() {
						return this.__name;
					},

					/**
					 * @method implements BundleInstance start methdod
					 * 
					 * Note this is async as DOJO requires are resolved and
					 * notified by callback
					 * 
					 */
					"start" : function() {
						var me = this;

						if (me.started)
							return;

						me.started = true;

						var sandbox = Oskari.$("sandbox");
						me.sandbox = sandbox;

						/**
						 * let's dojo me
						 */
						me.mediator.bundle.require(function(dojo) {

							me.dojo = dojo;
							sandbox.register(me);

							for (p in me.eventHandlers) {
								sandbox.registerForEventByName(me, p);
							}
							me.refresh();
						});

					},

					"init" : function() {
						return null;
					},

					/**
					 * @method update
					 * 
					 * implements bundle instance update method
					 */
					"update" : function() {

					},

					/**
					 * @method refresh
					 * 
					 * (re)creates selected layers to a hardcoded DOM div
					 * #layerselection This
					 */
					refresh : function() {
						var me = this;
						if (!me.dojo) {

							return;
						}

						var me = this;
						var conn = me.dojo['dojo'];
						var domConstruct = me.dojo['dojo/dom-construct'];
						var dom = me.dojo['dojo/dom'];
						var me = this;
						var cel = dom.byId("layerselection");
						var tpl = this.template;
						var sandbox = this.sandbox;
						var opacityRequestBuilder = sandbox
								.getRequestBuilder('ChangeMapLayerOpacityRequest');

						domConstruct.empty(cel);

						var layers = sandbox.findAllSelectedMapLayers();

						for ( var n = 0, len = layers.length; n < len; n++) {
							var layer = layers[n];
							var layerId = layer.getId();
							var value = layer.getOpacity();

							var lel = domConstruct.create("div", {
								className : "layer",
								style : {

								}
							}, cel);

							var pel = domConstruct.create("p", {
								className : 'layer',
								innerHTML : layer.getName()

							}, lel);

							var slider = new me.dojo['dijit/form/HorizontalSlider'](
									{
										minimum : 0,
										maximum : 100,
										pageIncrement : 20,
										value : value,
										intermediateChanges : true,
										style : "width: 200px;",
										layer : layer,
										moduleName : me.getName()
									}, lel);

							conn.connect(slider, "onChange",
									function(newValue) {
										var moduleName = this.moduleName;
										var layerId = this.layer.getId();
										sandbox.request(moduleName,
												opacityRequestBuilder(layerId,
														newValue));
									});

							/*
							 * slide: function(event, ui) { var newValue =
							 * ui.value; sandbox.request(me.getName(),
							 * opacityRequestBuilder(layerId, newValue)); }
							 */

							slider.startup();

						}

					},

					/**
					 * @method afterChangeMapLayerOpacityEvent
					 */
					afterChangeMapLayerOpacityEvent : function(event) {

					},

					/**
					 * @method onEvent
					 */
					onEvent : function(event) {

						var handler = this.eventHandlers[event.getName()];
						if (!handler)
							return;

						return handler.apply(this, [ event ]);

					},

					/**
					 * @property eventHandlers
					 * @static
					 * 
					 */
					eventHandlers : {
						'AfterMapLayerAddEvent' : function(event) {
							this.refresh();
						},

						/**
						 * @method AfterMapLayerRemoveEvent
						 */
						'AfterMapLayerRemoveEvent' : function(event) {
							this.refresh();
						},

						/**
						 * @method AfterMapLayerRemoveEvent
						 */
						'AfterMapMoveEvent' : function(event) {

						},

						/**
						 * @method AfterChangeMapLayerOpacityEvent
						 */
						'AfterChangeMapLayerOpacityEvent' : function(event) {
							if (this.sandbox.getObjectCreator(event) != this
									.getName()) {
								/* someone changed opacity */
								this.afterChangeMapLayerOpacityEvent(event);
							}
						}
					},

					/**
					 * @method stop
					 * 
					 * implements bundle instance stop method
					 */
					"stop" : function() {
						var sandbox = this.sandbox();
						for (p in this.eventHandlers) {
							sandbox.unregisterFromEventByName(this, p);
						}
						this.sandbox.unregister(this);
						this.started = false;
					}
				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							'Oskari.mapframework.module.Module' ]
				});
