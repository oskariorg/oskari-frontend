Oskari.clazz
		.define(
				'Oskari.mapframework.ui.module.common.OverlayPopupModule',
				function() {

					this._sandbox;
					
					this._overlayPopup = null;
				},
				{

					/***********************************************************
					 * Get module name
					 */
					__name : "OverlayPopupModule",
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

				        this.showOverlayPopupRequestHandler = 
				        	Oskari.clazz.create('Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequestHandler', sandbox, this);
				       
						return null;
					},

					closePopup : function() {
						if (this._overlayPopup != null) {
							this._overlayPopup.destroy();
							this._overlayPopup = null;
						}
					},
					/**
					 * return a wrapped function to get the scope right
					 * (http://www.mennovanslooten.nl/blog/post/62)
					 * Also add the closePopup call to each button
					 * @param callback actual callback gotten from request buttonConf
					 */
					_getButtonCallbackWrapper : function(callback) {
						var me = this;
			            return function() {
			                if(callback) {
			                	callback();
			                }
		            		me.closePopup();
			            }
			        },
					
					showPopup : function(autoLoadUrl, buttonsConfigArray) {
						
						var me = this;
						
						var dockedItems = [];
						
						if(buttonsConfigArray && buttonsConfigArray.length > 0) {
							for(var i=0; i < buttonsConfigArray.length; ++i) {
								var btnConf = buttonsConfigArray[i];
						        var button = Ext.create('Ext.button.Button', {
						            text : btnConf.text,
						            handler : me._getButtonCallbackWrapper(btnConf.callback)
						        });
						        
						        dockedItems.push(button);
							}
						}
						
						// let's not block
						Ext.Function.defer(function(){
						    me.showWebContent(autoLoadUrl, dockedItems);
						}, 100);
						
					},
					
					showWebContent: function(thisModuleWindowUrl, dockedItems) {
						
						this.closePopup();
		
//						var me = this;
						
						var windowSize = this._sandbox.getBrowserWindowSize();
						var height = windowSize.height - 200;

						var overlayPopup = Ext.create('Ext.Window',
								{
									autoScroll : true,
									bodyCssClass : 'overlay-popup-module-content',
									closable: true,
									animate: false,
									width : 800,
									height : height,// 800,
									frame : true,
									header : false,
									draggable : false,
									maximizable : false,
									resizable : false,
									modal : true,
									layout : 'fit',
									html : '<iframe src="' + thisModuleWindowUrl + '" style="width:100%;height:100%;border:0;">',
									listeners : {}
								});
						if(dockedItems && dockedItems.length > 0) {
							var toolbar = {
					            xtype : 'toolbar',
					            dock : 'bottom',
					            items : dockedItems
					        };
							overlayPopup.addDocked(toolbar);
						}
						this._overlayPopup = overlayPopup;
						overlayPopup.show();
					},
					
					/***********************************************************
					 * Start module
					 * 
					 * @param {Object}
					 *            sandbox
					 */
					start : function(sandbox) {
						sandbox.printDebug("Starting " + this.getName());
        				sandbox.addRequestHandler('ShowOverlayPopupRequest', this.showOverlayPopupRequestHandler);
					},
					
					stop: function(sandbox) {
        				sandbox.removeRequestHandler('ShowOverlayPopupRequest', this.showOverlayPopupRequestHandler);
					},

					/***********************************************************
					 * Event handler
					 * 
					 * @param {Object}
					 *            event
					 */
					onEvent : function(event) {
						/*
						if (event.getName() == 'AfterShowOverlayPopupEvent') {
							this.handleAfterShowOverlayPopupEvent(event.getAutoLoadUrl());
						}*/
					}
				},
				{
					'protocol' : ['Oskari.mapframework.module.Module']
				});

/** Inheritance */
