/**
 * Bundle Instance
 * 
 * @class Oskari.mapframework.bundle.WMTSModuleInstance
 * 
 * This class is a POC for displaying WMTS some layers on the main map
 * 
 */

Oskari.clazz
		.define(
				"Oskari.mapframework.bundle.WMTSModuleInstance",
				/**
				 * @constructor
				 */
				function(b) {
					this.name = 'wmts';
					this.mediator = null;
					this.sandbox = null;
					this.conf = null;

					this.impl = null;

					this.ui = null;
					this.regionSelector = 'Center';
				},
				/*
				 * 
				 */
				{

					/**
					 * @method getName
					 * returns module name 
					 */
					getName : function() {
						return this.name;
					},

					
					

					/**
					 * @method start
					 * 
					 * starts the bundle registers events creates map, map
					 * container and ui panel
					 */
					"start" : function() {

						if (this.mediator.getState() == "started")
							return;

						this.mediator.setState("started");
						return this;
					},

					
					/**
					 * @method update notifications from bundle manager
					 */
					"update" : function(manager, b, bi, info) {
						manager
								.alert("RECEIVED update notification @BUNDLE_INSTANCE: "
										+ info);
					},

					/**
					 * @method stop
					 * 
					 * stop bundle instance
					 */
					"stop" : function() {

					
						this.mediator.setState("stopped");

						return this;
					},

					/**
					 * @method getName
					 * 
					 */
					getName : function() {
						return this.__name;
					},
					__name : "Oskari.mapframework.bundle.WMTSModuleInstance"

				}, {
					"protocol" : [ "Oskari.bundle.BundleInstance",
							"Oskari.mapframework.bundle.extension.Extension" ]
				});

