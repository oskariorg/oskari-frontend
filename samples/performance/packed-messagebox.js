/*Ext.require( [ '*' ]);
 */


/**
 * Hacks
 */
var debug_injectScriptElement = Ext.Loader.injectScriptElement;
var debug_files = [];
var debug_classes = [];
var debug_extras = {};
Ext.Loader.injectScriptElement = function() {

	debug_files.push( {
		"context" : "inject",
		"type" : "text/javascript",
		"src" : arguments[0]
	});
	return debug_injectScriptElement.apply(Ext.Loader, arguments);
};

var debug_require = Ext.Loader.require;

Ext.Loader.require = function(expressions, fn, scope, excludes) {
	debug_classes.push( {
		require : expressions
	});
	console.log("REQUIRE", expressions);
	return debug_require.apply(Ext.Loader, arguments);
}
Ext.require = Ext.Loader.require;

var debug_triggerCreated = Ext.ClassManager.triggerCreated;

Ext.ClassManager.triggerCreated = function(className) {
	debug_classes.push( {
		created : className
	});
	console.log("CREATED", className);
	return debug_triggerCreated.apply(Ext.ClassManager, arguments);
}

var debug_loadScriptFile = Ext.Loader.loadScriptFile;

Ext.Loader.loadScriptFile = function(url, onLoad, onError, scope, synchronous) {
	console.log("LOADING", url);
	debug_files.push( {
		"context" : "loadCall",
		"type" : "text/javascript",
		"src" : arguments[0]
	});
	return debug_loadScriptFile.apply(Ext.Loader, arguments);
}

Oskari.debug_stats = function() {
	var count = 0;
	for ( var n = 0, len = debug_files.length; n < len; n++) {
		var itm = debug_files[n];

		if (itm.context == 'loadCall')
			count++;
	}

	var count_created = 0;
	var count_requires = 0;
	var count_extras = 0;

	var createdClasses = {};
	var requiredClasses = {};
	var extraClasses = {};

	for ( var n = 0, len = debug_classes.length; n < len; n++) {
		var itm = debug_classes[n];

		if (itm.created) {
			count_created++;
			createdClasses[itm.created] = true;
		}
		if (itm.require) {

			for ( var i = 0; i < itm.require.length; i++) {
				var req = itm.require[i];
				if (requiredClasses[req])
					continue;
				requiredClasses[req] = true;
				count_requires++;
			}

		}
	}

	for (e in debug_extras) {
		if (requiredClasses[e])
			continue;
		extraClasses[e] = true;
		count_extras++;
	}

	console.log("================== Loaded " + count + " files");
	console.log("================== Created " + count_created + " classes");
	console
			.log("================== Resolved Required Classes"
					+ count_requires);
	console.log("================== Created Unreferenced Classes"
			+ count_extras);

	var clsssForInclusion = [];
	var clsssForExclusion = [];

	for ( var n = 0, len = debug_classes.length; n < len; n++) {
		var itm = debug_classes[n];

		if (itm.created)
			clsssForInclusion.push(itm.created);
	}
	for (e in extraClasses) {
		clsssForExclusion.push(e);
	}
	return {
		include : clsssForInclusion,
		exclude : clsssForExclusion,
		createdClasses: createdClasses,
		requiredClasses: requiredClasses,
		extraClasses: extraClasses
	};
}

/*
 * 
 */
Oskari.includeClasses = function(includedClassList) {
	Oskari.ExtSelector = Oskari.ExtSelector||{};
	for ( var n = 0, len = includedClassList.length; n < len; n++) {
		Oskari.ExtSelector[includedClassList[n]] = true;
	}
}

Oskari.excludeClasses = function(exludedClassList) {
	Oskari.ExtExcludes = Oskari.ExtExcludes||{};
	for ( var n = 0, len = exludedClassList.length; n < len; n++) {
		Oskari.ExtExcludes[exludedClassList[n]] = true;
	}
//	Oskari.useSelector = true;
};


// Ext.require('Ext.window.MessageBox');
Oskari.clazz
		.define(
				'Oskari.framework.oskari.QuickStartGuide',
				function() {

				},
				{

					/**
					 * 
					 */

					/**
					 * @method start
					 * 
					 */
					start : function() {

				

						var me = this;

						/**
						 * some bundles are loaded from framework directory
						 * (sources are actually located in coreBundlePath but
						 * bundle defs are in ../framework)
						 */

						/**
						 * portal is located adjacent to this one
						 * 
						 */

						/**
						 * Let's start bundle named 'quickstartguide'
						 * 
						 * This lists any dependencies that need to be loaded.
						 * 
						 * This starts the main bundle 'quickstartguide' which
						 * can be found in bundle/quickstartguide/bundle.js
						 * 
						 */

						var def = {
							title : 'Map',
							fi : 'Map',
							sv : '?',
							en : 'Map',
							bundlename : 'msgbox',
							bundleinstancename : 'msgbox',
							metadata : {
								"Import-Bundle" : {

									"msgbox" : {
										bundlePath : '../ext/bundle/'
									}
								},

								/**
								 * A list of bundles to be started
								 */
								"Require-Bundle-Instance" : []

							},
							instanceProps : {

							}
						};

						/** use sample bundle to fire the engine * */
						Oskari.bundle_facade.playBundle(def, function(bi) {
							
							Ext.require('Ext.window.MessageBox',function(){
								Ext.MessageBox.show( {
								title : 'Oskari Clazz Zystem',
								msg : '...',
								progressText : '...',
								width : 300,
								progress : true,
								closable : true,
								icon : 'logo',
								modal : true
							});
								Oskari.debug_stats();
							});
							
							

						});

					}

				}

		);

Ext.onReady(function() {

	var args = null;
	if (location.search.length > 1) {
		args = Ext.urlDecode(location.search.substring(1));
	} else {
		args = {};
	}

	if (args.oskariLoaderMode)
		Oskari.setLoaderMode(args.oskariLoaderMode);
	else
		Oskari.setLoaderMode('yui');

	if( !args.include || args.include == 'on')
	Oskari.includeClasses(
			["Ext.EventManager", "Ext.util.Format", "Ext.util.TaskRunner", "Ext.TaskManager", "Ext.data.JsonP", "Ext.form.FieldAncestor", "Ext.util.KeyMap", "Ext.util.Memento", "Ext.Number", "Ext.Template", "Ext.fx.CubicBezier", "Ext.panel.Proxy", "Ext.util.KeyNav", "Ext.util.ElementContainer", "Ext.util.TextMetrics", "Ext.util.Floating", "Ext.form.field.VTypes", "Ext.util.Event", "Ext.util.Observable", "Ext.XTemplateParser", "Ext.util.Offset", "Ext.form.action.Action", "Ext.layout.container.boxOverflow.None", "Ext.util.HashMap", "Ext.util.Animate", "Ext.util.ProtoElement", "Ext.ZIndexManager", "Ext.dd.DragTracker", "Ext.data.Connection", "Ext.ComponentQuery", "Ext.util.Renderable", "Ext.form.field.Field", "Ext.util.Sorter", "Ext.fx.target.Target", "Ext.data.writer.Writer", "Ext.AbstractManager", "Ext.util.Filter", "Ext.draw.Color", "Ext.DomQuery", "Ext.state.Provider", "Ext.data.ResultSet", "Ext.util.Bindable", "Ext.grid.feature.Feature", "Ext.grid.feature.Grouping", "Ext.fx.Easing", "Ext.XTemplateCompiler", "Ext.XTemplate", "Ext.util.ClickRepeater", "Ext.slider.Thumb", "Ext.util.ComponentDragger", "Ext.util.Region", "Ext.form.action.Load", "Ext.form.action.Submit", "Ext.layout.Layout", "Ext.layout.container.Container", "Ext.layout.container.Column", "Ext.layout.container.Anchor", "Ext.layout.container.Absolute", "Ext.layout.container.Fit", "Ext.layout.container.Card", "Ext.layout.component.Component", "Ext.layout.component.Dock", "Ext.layout.component.Auto", "Ext.layout.component.Body", "Ext.layout.component.ProgressBar", "Ext.layout.component.Button", "Ext.grid.ColumnComponentLayout", "Ext.util.Sortable", "Ext.fx.Queue", "Ext.fx.target.Element", "Ext.fx.target.ElementCSS", "Ext.fx.target.CompositeElement", "Ext.fx.target.CompositeElementCSS", "Ext.fx.target.Sprite", "Ext.fx.target.CompositeSprite", "Ext.fx.target.Component", "Ext.layout.container.Auto", "Ext.layout.component.Tab", "Ext.layout.component.field.Field", "Ext.layout.component.field.Slider", "Ext.layout.component.field.Text", "Ext.layout.component.field.TextArea", "Ext.layout.container.boxOverflow.Scroller", "Ext.data.writer.Json", "Ext.ComponentManager", "Ext.dd.DragDropManager", "Ext.dd.ScrollManager", "Ext.dd.DragDrop", "Ext.dd.DDTarget", "Ext.dd.DropTarget", "Ext.app.PortalDropZone", "Ext.util.AbstractMixedCollection", "Ext.util.MixedCollection", "Ext.menu.Manager", "Ext.container.DockingContainer", "Ext.fx.Manager", "Ext.fx.Animator", "Ext.data.Errors", "Ext.draw.Draw", "Ext.fx.PropertyHandler", "Ext.fx.Anim", "Ext.form.Labelable", "Ext.dd.DD", "Ext.dd.DDProxy", "Ext.state.Manager", "Ext.state.Stateful", "Ext.AbstractComponent", "Ext.Component", "Ext.form.Label", "Ext.toolbar.Spacer", "Ext.toolbar.Item", "Ext.menu.Item", "Ext.menu.Separator", "Ext.toolbar.TextItem", "Ext.toolbar.Fill", "Ext.ProgressBar", "Ext.menu.CheckItem", "Ext.button.Button", "Ext.button.Split", "Ext.container.AbstractContainer", "Ext.container.Container", "Ext.container.Viewport", "Ext.app.PortalColumn", "Ext.form.FieldSet", "Ext.panel.Header", "Ext.tab.Tab", "Ext.tab.Bar", "Ext.resizer.Splitter", "Ext.resizer.BorderSplitter", "Ext.layout.container.Border", "Ext.FocusManager", "Ext.menu.KeyNav", "Ext.form.field.Base", "Ext.form.field.Text", "Ext.form.field.TextArea", "Ext.grid.header.Container", "Ext.dd.StatusProxy", "Ext.dd.DragSource", "Ext.panel.DD", "Ext.toolbar.Separator", "Ext.layout.container.boxOverflow.Menu", "Ext.layout.container.Box", "Ext.layout.container.HBox", "Ext.layout.container.VBox", "Ext.toolbar.Toolbar", "Ext.ux.statusbar.StatusBar", "Ext.panel.AbstractPanel", "Ext.panel.Panel", "Ext.app.PortalPanel", "Ext.app.Portlet", "Ext.tab.Panel", "Ext.menu.Menu", "Ext.panel.Table", "Ext.window.Window", "Ext.window.MessageBox", "Ext.form.Basic", "Ext.form.Panel", "Ext.grid.ColumnLayout", "Ext.grid.column.Column", "Ext.grid.column.Action", "Ext.tip.Tip", "Ext.slider.Tip", "Ext.slider.Multi", "Ext.slider.Single", "Ext.data.reader.Reader", "Ext.data.reader.Json", "Ext.data.proxy.Proxy", "Ext.data.proxy.Server", "Ext.data.proxy.JsonP", "Ext.data.proxy.Client", "Ext.data.proxy.Memory", "Ext.ux.data.PagingMemoryProxy", "Ext.LoadMask", "Ext.data.StoreManager", "Ext.selection.Model", "Ext.selection.DataViewModel", "Ext.view.AbstractView", "Ext.view.View", "Ext.view.Table", "Ext.grid.View", "Ext.grid.Panel", "Ext.DomHelper", "Ext.util.Point", "Ext.Layer", "Ext.util.CSS", "Ext.PluginManager", "Ext.resizer.Resizer", "Ext.layout.component.FieldSet", "Ext.Img", "Ext.resizer.SplitterTracker", "Ext.resizer.BorderSplitterTracker", "Ext.grid.plugin.HeaderResizer", "Ext.selection.RowModel", "Ext.grid.PagingScroller", "Ext.data.Batch", "Ext.data.Operation", "Ext.data.Request", "Ext.view.TableChunker", "Ext.ElementLoader", "Ext.form.CheckboxManager", "Ext.layout.component.Draw", "Ext.util.Queue", "Ext.grid.LockingView", "Ext.data.IdGenerator", "Ext.data.validations", "Ext.tip.ToolTip", "Ext.dd.DragZone", "Ext.data.association.Association", "Ext.data.SortTypes", "Ext.Ajax", "Ext.draw.CompositeSprite", "Ext.util.Grouper", "Ext.layout.ClassList", "Ext.data.AbstractStore", "Ext.dd.Registry", "Ext.tip.QuickTip", "Ext.tip.QuickTipManager", "Ext.ComponentLoader", "Ext.form.field.Checkbox", "Ext.panel.Tool", "Ext.grid.Lockable", "Ext.grid.header.DragZone", "Ext.ModelManager", "Ext.data.proxy.Ajax", "Ext.draw.Surface", "Ext.draw.Component", "Ext.layout.ContextItem", "Ext.layout.Context", "Ext.dd.DropZone", "Ext.grid.header.DropZone", "Ext.grid.plugin.HeaderReorderer", "Ext.data.Types", "Ext.data.Field", "Ext.data.Model", "Ext.data.Store.ImplicitModel-ext-empty-store", "Ext.data.Store", "Ext.data.ArrayStore", "Ext.resizer.ResizeTracker", "Ext.draw.engine.SvgExporter", "Ext.draw.engine.ImageExporter", "Ext.data.reader.Array", "Ext.ShadowPool", "Ext.draw.Matrix", "Ext.draw.SpriteDD", "Ext.Shadow", "Ext.draw.Sprite", "Ext.draw.engine.Svg", "Ext.draw.engine.Vml", "Oskari.mapframework.ui.module.common.mapmodule.GeoAction", "MapPanel", "MapLayer", "Wiki", "Train"]
	);

	if( !args.exclude || args.exclude == 'on')
	Oskari.excludeClasses(
			['*']
	);



	
	Oskari.clazz.create('Oskari.framework.oskari.QuickStartGuide').start();

});