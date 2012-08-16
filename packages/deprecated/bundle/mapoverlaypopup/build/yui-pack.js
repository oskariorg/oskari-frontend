/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
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
Oskari.clazz.define(
		'Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequest', function(
				autoLoadUrl, buttonsConf) {
			this._creator = null;
			this._autoLoadUrl = autoLoadUrl;
			this._buttonsConf = buttonsConf;
		}, {
			__name : "ShowOverlayPopupRequest",
			getName: function() {
			return this.__name;
			},
			
			getAutoLoadUrl : function() {
				return this._autoLoadUrl;
			},
			
			getButtonsConf : function() {
				return this._buttonsConf;
			}

		},
		{
			'protocol' : ['Oskari.mapframework.request.Request']
		});

/* Inheritance */
Oskari.clazz.define(
        'Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequestHandler',
        
        function(sandbox, plugin) {
            
            this.sandbox = sandbox;
            this.plugin = plugin;
        },
        {
            handleRequest: function(core,request) {
            	var urlToShow = request.getAutoLoadUrl();
                this.sandbox.printDebug("[Oskari.mapframework.mapoverlaypopup.request.ShowOverlayPopupRequestHandler] got dataurl " + urlToShow);
                this.plugin.showPopup(urlToShow, request.getButtonsConf());
            }
        },{
            protocol: ['Oskari.mapframework.core.RequestHandler']
        });/**
 * @class Oskari.mapframework.bundle.DefaultOverlayPopupBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.DefaultOverlayPopupBundleInstance", function(b) {
	this.name = 'mapoverlaypopup';
	this.mediator = null;
	this.sandbox = null;

	this.impl = null;

	this.ui = null;
},
/*
 * prototype
 */
{

	/**
	 * start bundle instance
	 *
	 */
	"start" : function() {

		if(this.mediator.getState() == "started")
			return;

		this.libs = {
			ext : Oskari.$("Ext")
		};

		this.facade = Oskari.$('UI.facade');

		this.impl = Oskari.clazz.create('Oskari.mapframework.ui.module.common.OverlayPopupModule');

		var def = this.facade.appendExtensionModule(this.impl, this.name, this.eventHandlers, this, 'StatusRegion', {
			'fi' : {
				title : ''
			},
			'sv' : {
				title : '?'
			},
			'en' : {
				title : ''
			}

		});
		this.def = def;

		this.impl.start(this.facade.getSandbox());

		this.mediator.setState("started");
		return this;
	},
	/**
	 * notifications from bundle manager
	 */
	"update" : function(manager, b, bi, info) {
		manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
	},
	/**
	 * stop bundle instance
	 */
	"stop" : function() {

		this.impl.stop();

		this.facade.removeExtensionModule(this.impl, this.name, this.eventHandlers, this, this.def);
		this.def = null;

		this.impl = null;

		this.mediator.setState("stopped");

		return this;
	},
	getName : function() {
		return this.__name;
	},
	__name : "Oskari.mapframework.bundle.DefaultOverlayPopupBundleInstance"

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
