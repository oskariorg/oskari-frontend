/* This is a unpacked Oskari bundle (bundle script version Wed Feb 29 2012 07:56:03 GMT+0200 (Suomen normaaliaika)) */ 
/**
 * @class Oskari.poc.kendoui.bundle.LayerSelectionBundleInstance
 */
Oskari.clazz
		.define("Oskari.poc.kendoui.bundle.LayerSelectionBundleInstance",
				function() {
					this.map = null;
					this.core = null;
					this.sandbox = null;
					this.mapmodule = null;
					this.started = false;
					this.template = null;
				}, {
					/**
					 * @static
					 * @property __name
					 * 
					 */
					__name : 'JQueryLayerSelection',
					"getName" : function() {
						return this.__name;
					},

					/**
					 * @method implements BundleInstance start methdod
					 * 
					 */
					"start" : function() {
						if (this.started)
							return;

						this.started = true;

						var sandbox = Oskari.$("sandbox");

						this.sandbox = sandbox;

						sandbox.register(this);

						for (p in this.eventHandlers) {
							sandbox.registerForEventByName(this, p);
						}

						this.container = $("#layerselection");
						this.template = $('<div class="layer"><p></p><div class="slider"></div></div>');

						this.refresh();

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
					 */
					refresh : function() {

						var me = this;
						var cel = this.container;
						var tpl = this.template;
						var sandbox = this.sandbox;
						var opacityRequestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
						var layers = sandbox.findAllSelectedMapLayers();

						cel.empty();

						$(layers).each(function(index) {
							var el = $(tpl).clone();
							var layer = this;
							var layerId = layer.getId();
							var value = layer.getOpacity();
						

							$(el).children('p').append(layer.getName());
							$(el).appendTo(cel);
							$(el).children('.slider').kendoSlider({
								min:0, max:100,
								value: value,
								slide: function(evnt) { 
									var newValue = evnt.value;
									sandbox.request(me.getName(), 
											opacityRequestBuilder(layerId, newValue));
								}
							});
							
						});
						
						

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
