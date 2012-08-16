/**
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
