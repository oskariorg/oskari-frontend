/**
 * @class Oskari.mapframework.bundle.PluginMapModuleBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.PluginMapModuleBundleInstance", function(b) {
	this.name = 'mapmodule';
	this.mediator = null;
	this.sandbox = null;
	this.conf = null;

	this.impl = null;

	this.facade = null;

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

		var facade = Oskari.$('UI.facade');
		this.facade = facade;

		var sandbox = facade.getSandbox();
		this.sandbox = sandbox;

		var conf = Oskari.$("startup");

		this.conf = conf;

		var showIndexMap = conf.mapConfigurations.index_map;
		var showZoomBar = conf.mapConfigurations.zoom_bar;
		var showScaleBar = conf.mapConfigurations.scala_bar;
		var allowMapMovements = conf.mapConfigurations.pan;

		var impl = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Main", showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
		// impl.setOpt('createTilesGrid', false);
		this.impl = impl;

		var pnl = this.createMapPanel();
		this._panel = pnl;

		var def = this.facade.appendExtensionModule(this.impl, this.name, {}, this, 'Center', {
			'fi' : {
				title : ''
			},
			'sv' : {
				title : '?'
			},
			'en' : {
				title : ''
			}

		}, pnl);
		this.def = def;

		/**
		 * plugins
		 */
		var plugins = [];
		plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
		plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
		//plugins.push('Oskari.mapframework.mapmodule.SketchLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.MarkersPlugin');
		plugins.push('Oskari.mapframework.mapmodule.VectorLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.TilesGridPlugin');
		plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
		plugins.push('Oskari.mapframework.mapmodule.WfsLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.GetInfoPlugin');

		for(var i = 0; i < plugins.length; i++) {
			var plugin = Oskari.clazz.create(plugins[i]);
			impl.registerPlugin(plugin);
		}

		var mapster = this.createMapContainer(this.impl.getMap());
		this._mapster = mapster;
		pnl.add(mapster);

		facade.registerPart('Mapster', this._mapster);

		// call real modules start 
		this.impl.start(sandbox);
		this.mediator.setState("started");
		return this;
	},
	/**
	 * creates (Ext) map panel
	 */
	createMapPanel : function() {
		var xt = this.libs.ext;
		var pnl = xt.create('Ext.Panel', {
			region : 'center',
			layout : 'fit',
			items : []
		});

		return pnl;

	},
	createMapContainer : function(map) {
		var xt = this.libs.ext;
		var mapster = xt.createWidget('nlsfimappanel', {
			olmap : map,
			layout : 'absolute'
		});

		return mapster;
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

		this.facade.removeExtensionModule(this.impl, this.name, this.impl.eventHandlers, this, this.def);
		this.def = null;

		this.mediator.setState("stopped");

		return this;
	},
	getName : function() {
		return this.__name;
	},
	__name : "Oskari.mapframework.bundle.PluginMapModuleBundleInstance"

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
