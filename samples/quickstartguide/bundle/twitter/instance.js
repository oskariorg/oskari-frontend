/**
 * @class Oskari.mapframework.bundle.TwitterBundleInstance
 * 
 * A very basic BundleInstance that adds Twitter Widget Module to the UI.
 * 
 * Most code is for registering the bundle, bundle instance and ui component to
 * the application
 */

Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.TwitterBundleInstance",
				/**
				 * @constructor
				 */
				function() {

				},
				{
					/** class methods */
					"start" : function() {
						var me = this;

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
						var def = this.facade.appendExtensionModule(this,
								this.name, {}, this, 'W', {
									'fi' : {
										title : ' Twitter'
									},
									'sv' : {
										title : '?'
									},
									'en' : {
										title : ' Twitter'
									}

								});
						this.def = def;

						this.mediator.setState("started");

					},
					/**
					 * @method init
					 * 
					 * init UI module called after start
					 * 
					 * This will be called by the framework
					 * 
					 */

					init : function(sandbox) {
						this.sandbox = sandbox;
						/*
						 * build UI
						 */
						var xt = this.libs.ext;

						var twitterWgt = "<iframe border='0' width='100%' height='100%' src='bundle/twitter/twitter.html'></iframe>";

						var pnl = xt.create('Ext.Panel', {

							// bodyStyle : 'padding:5px 5px 0',
							border : false,
							height : 384,
							layout : 'fit',
							defaults : {
								bodyPadding : 4
							},
							items : [ {
								html : twitterWgt
							} ]
						});

						return pnl;
					},

					"update" : function() {
					},
					"stop" : function() {
						this.stopped = true;

						this.facade.removeExtensionModule(this, this.name,
								{}, this, this.def);
						this.def = null;

						this.mediator.setState("stopped");

					},
					/**
					 * @method getName
					 * 
					 * required method for Oskari.mapframework.module.Module
					 * protocol
					 * 
					 */
					getName : function() {
						return this.__name;
					},

					/**
					 * @property __name
					 * 
					 * this BundleInstance's name
					 * 
					 */
					__name : "Oskari.mapframework.bundle.TwitterBundleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.module.Module" ]
				})
