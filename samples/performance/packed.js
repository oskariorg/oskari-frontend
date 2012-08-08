/*Ext.require( [ '*' ]);
 */

	/*Ext.Loader.setConfig( {
	enabled : false
});*/

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
// Oskari.useSelector = true;
};




/*
 * Ext.require('Ext.panel.Panel'); Ext.require('Ext.tab.Panel');
 * Ext.require('Ext.toolbar.Toolbar'); Ext.require('Ext.container.Viewport');
 * Ext.require('Ext.app.PortalDropZone'); Ext.require('Ext.app.PortalColumn');
 * Ext.require('Ext.app.PortalPanel'); Ext.require('Ext.app.Portlet');
 * Ext.require('Ext.layout.container.Column');
 * Ext.require('Ext.layout.container.Border'); Ext.require('Ext.button.Split');
 * Ext.require('Ext.form.Label'); Ext.require('Ext.slider.Single');
 * Ext.require('Ext.grid.feature.Grouping'); Ext.require('Ext.grid.Panel');
 * Ext.require('Ext.data.proxy.JsonP'); Ext.require('Ext.grid.column.Action');
 * Ext.require('Ext.form.Panel'); Ext.require('Ext.form.FieldSet');
 * Ext.require('Ext.layout.container.Absolute');
 * Ext.require('Ext.toolbar.Spacer'); Ext.require('Ext.toolbar.Item');
 * Ext.require('Ext.menu.Menu'); Ext.require('Ext.menu.Item');
 * Ext.require('Ext.menu.Separator');
 * Ext.require('Ext.ux.data.PagingMemoryProxy');
 */

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
					start : function(opts) {
						var extpack = opts.extpack;

				

						var me = this;

						var def = {
							title : 'Map',
							fi : 'Map',
							sv : '?',
							en : 'Map',
							bundlename : extpack,
							bundleinstancename : extpack,
							metadata : {
								"Import-Bundle" : {
								},

								/**
								 * A list of bundles to be started
								 */
								"Require-Bundle-Instance" : []

							},
							instanceProps : {

							}
						};
						
						def.metadata["Import-Bundle"][extpack] = {
							bundlePath : '../ext/bundle/'
						};

						/** use sample bundle to fire the engine * */
						Oskari.bundle_facade.playBundle(def, function(bi) {
							// Oskari.debug_stats();
							me.afterExt();
						});

					},

					afterExt : function() {
						var me = this;
						var def = {
							title : 'Map',
							fi : 'Map',
							sv : '?',
							en : 'Map',
							bundlename : 'quickstartguide',
							bundleinstancename : 'quickstartguide',
							metadata : {
								"Import-Bundle" : {
									"core-base" : {
										bundlePath : '../framework/bundle/'
									},
									"core-map" : {
										bundlePath : '../framework/bundle/'
									},
									"sandbox-base" : {
										bundlePath : '../framework/bundle/'
									},
									"sandbox-map" : {
										bundlePath : '../framework/bundle/'
									},
									"event-base" : {
										bundlePath : '../framework/bundle/'
									},

									"event-map" : {
										bundlePath : '../framework/bundle/'
									},
									"event-map-layer" : {
										bundlePath : '../framework/bundle/'
									},
									"event-map-full" : {
										bundlePath : '../framework/bundle/'
									},
									"request-base" : {
										bundlePath : '../framework/bundle/'
									},
									"request-map" : {
										bundlePath : '../framework/bundle/'
									},
									"request-map-layer" : {
										bundlePath : '../framework/bundle/'
									},
									"request-map-full" : {
										bundlePath : '../framework/bundle/'
									},
									"service-base" : {
										bundlePath : '../framework/bundle/'
									},
									"service-map" : {
										bundlePath : '../framework/bundle/'
									},
									"common" : {
										bundlePath : '../framework/bundle/'
									},
									"mapmodule-plugin" : {
										bundlePath : '../framework/bundle/'
									},
									"domain" : {
										bundlePath : '../framework/bundle/'
									},
									"runtime" : {
										bundlePath : '../framework/bundle/'
									},
									"mapster" : {
										bundlePath : '../framework/bundle/'
									},
									"mapposition" : {
										bundlePath : '../framework/bundle/'
									},
									"mapcontrols" : {
										bundlePath : '../framework/bundle/'
									},
									"mapoverlaypopup" : {
										bundlePath : '../framework/bundle/'
									},
									"layerselector" : {
										bundlePath : '../framework/bundle/'
									},

									"searchservice" : {
										bundlePath : '../framework/bundle/'
									},
									"mapfull" : {
										bundlePath : '../framework/bundle/'
									},
									"layerhandler" : {
										bundlePath : '../framework/bundle/'
									},

									"mapportal" : {
										bundlePath : '../portal/bundle/'
									},
									"layers" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"layerselection" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"openlayers-map-full" : {
										bundlePath : '../openlayers/bundle/'
									},

									"yui" : {
										bundlePath : '../tools/bundle/'
									},
									"quickstartguide" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"mapwmts" : {
										bundlePath : '../framework/bundle/'
									}
								/*
								 * "myplaces" : { bundlePath : defBundlePath }
								 */

								},

								/**
								 * A list of bundles to be started
								 */
								"Require-Bundle-Instance" : []

							},
							instanceProps : {

							}
						};

						/* Oskari.setLoaderMode('dev'); */
						/** use sample bundle to fire the engine * */
						Oskari.bundle_facade.playBundle(def, function(bi) {

							/**
							 * up and running - app specific code in
							 * bundle/quickstartguide/bundle.js
							 */

							/**
							 * Now we have the framework bundles and classes.
							 * Let's start the framework & create some more
							 * class instances.
							 */
							var app = bi.getApp();
							app.startFramework();

							app.getUserInterface().getFacade().expandPart('W');
							app.getUserInterface().getFacade().expandPart('E');

							/**
							 * Loading is done. Let's hide status.
							 */

							me.afterFramework();
						});
					},

					afterFramework : function() {
						/**
						 * Let's Start some additional bundle instances
						 */
						var bnlds = {
							title : 'Map',
							fi : 'Map',
							sv : '?',
							en : 'Map',
							bundlename : 'mapmodule-plugin',
							bundleinstancename : 'mapmodule-plugin',
							metadata : {
								"Import-Bundle" : {

									"sample" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"positioninfo" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"twitter" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"trains" : {
										bundlePath : '../quickstartguide/bundle/'
									},
									"wikipedia" : {
										bundlePath : '../quickstartguide/bundle/'
									}

								},
								"Require-Bundle-Instance" : [ "layerhandler",
										"layerselection", "layerselector",
										// "searchservice",
										"mapoverlaypopup", "mapposition",
										// "sample",
										// "twitter", //
										// twitter will not
										// work in IE < 9
										"wikipedia", "trains", "positioninfo" ]

							},
							instanceProps : {

							}
						};

						Oskari.bundle_facade.playBundle(bnlds, function(bi) {

							/**
							 * Let's zoom somewhere with sights familiar
							 */
							bi.sandbox.postRequestByName('MapMoveRequest', [
									385576, 6675364, 8, false ]);

							/**
							 * Let's add map controls at this stage as those
							 * have a hardcoded dependency to MainMapModule
							 */
							Oskari.bundle_facade.requireBundle("mapcontrols",
									"mapcontrols", function(manager, b) {
										var ctrls = manager
												.createInstance("mapcontrols");
										ctrls.start();
									});

							/**
							 * Load unpacked bundles dynamically
							 */
							Oskari.setLoaderMode('dev');

							/*
							 * Oskari.bundle_facade.requireBundle("myplaces","myplaces",
							 * function(manager,b){ var myplaces = manager
							 * .createInstance("myplaces"); myplaces.start();
							 * });
							 */

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

	/*
	 * Oskari.setLoaderMode('dev'); Oskari.setSupportBundleAsync(false);
	 */

	/*
	 * if (args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
	 * Oskari.setSupportBundleAsync(true); }
	 */

	if( !args.include || args.include == 'on') 
	Oskari.includeClasses(
			["Ext.EventManager", "Ext.util.Format", "Ext.util.TaskRunner", "Ext.data.JsonP", "Ext.TaskManager", "Ext.form.FieldAncestor", "Ext.Number", "Ext.util.KeyMap", "Ext.util.Memento", "Ext.Template", "Ext.util.ElementContainer", "Ext.util.TextMetrics", "Ext.util.Floating", "Ext.util.KeyNav", "Ext.form.field.VTypes", "Ext.util.Event", "Ext.util.Observable", "Ext.fx.CubicBezier", "Ext.panel.Proxy", "Ext.util.Offset", "Ext.form.action.Action", "Ext.layout.container.boxOverflow.None", "Ext.util.Animate", "Ext.util.ProtoElement", "Ext.ZIndexManager", "Ext.dd.DragTracker", "Ext.data.Connection", "Ext.util.Renderable", "Ext.ComponentQuery", "Ext.form.field.Field", "Ext.XTemplateParser", "Ext.util.HashMap", "Ext.util.Sorter", "Ext.data.writer.Writer", "Ext.AbstractManager", "Ext.util.Filter", "Ext.DomQuery", "Ext.fx.target.Target", "Ext.state.Provider", "Ext.draw.Color", "Ext.data.ResultSet", "Ext.util.Bindable", "Ext.grid.feature.Feature", "Ext.grid.feature.Grouping", "Ext.util.ClickRepeater", "Ext.slider.Thumb", "Ext.util.ComponentDragger", "Ext.util.Region", "Ext.form.action.Load", "Ext.form.action.Submit", "Ext.fx.Easing", "Ext.XTemplateCompiler", "Ext.XTemplate", "Ext.layout.Layout", "Ext.layout.container.Container", "Ext.layout.container.Column", "Ext.layout.container.Anchor", "Ext.layout.container.Absolute", "Ext.layout.container.Fit", "Ext.layout.container.Card", "Ext.layout.component.Component", "Ext.layout.component.Dock", "Ext.layout.component.Auto", "Ext.layout.component.Body", "Ext.layout.component.ProgressBar", "Ext.layout.component.Button", "Ext.grid.ColumnComponentLayout", "Ext.layout.container.Auto", "Ext.layout.component.field.Field", "Ext.layout.component.field.Slider", "Ext.layout.component.field.Text", "Ext.layout.component.field.TextArea", "Ext.util.Sortable", "Ext.layout.container.boxOverflow.Scroller", "Ext.data.writer.Json", "Ext.ComponentManager", "Ext.dd.DragDropManager", "Ext.dd.ScrollManager", "Ext.dd.DragDrop", "Ext.dd.DDTarget", "Ext.dd.DropTarget", "Ext.app.PortalDropZone", "Ext.util.AbstractMixedCollection", "Ext.util.MixedCollection", "Ext.menu.Manager", "Ext.data.Errors", "Ext.container.DockingContainer", "Ext.form.Labelable", "Ext.fx.Queue", "Ext.fx.target.Element", "Ext.fx.target.ElementCSS", "Ext.fx.target.CompositeElement", "Ext.fx.target.CompositeElementCSS", "Ext.fx.target.Sprite", "Ext.fx.target.CompositeSprite", "Ext.fx.target.Component", "Ext.fx.Manager", "Ext.fx.Animator", "Ext.layout.component.Tab", "Ext.state.Manager", "Ext.state.Stateful", "Ext.AbstractComponent", "Ext.Component", "Ext.form.Label", "Ext.toolbar.Spacer", "Ext.toolbar.Item", "Ext.menu.Item", "Ext.menu.Separator", "Ext.toolbar.TextItem", "Ext.toolbar.Fill", "Ext.ProgressBar", "Ext.button.Button", "Ext.button.Split", "Ext.menu.CheckItem", "Ext.container.AbstractContainer", "Ext.container.Container", "Ext.container.Viewport", "Ext.app.PortalColumn", "Ext.form.FieldSet", "Ext.panel.Header", "Ext.form.field.Base", "Ext.form.field.Text", "Ext.form.field.TextArea", "Ext.grid.header.Container", "Ext.tab.Tab", "Ext.tab.Bar", "Ext.resizer.Splitter", "Ext.resizer.BorderSplitter", "Ext.FocusManager", "Ext.menu.KeyNav", "Ext.dd.StatusProxy", "Ext.toolbar.Separator", "Ext.layout.container.boxOverflow.Menu", "Ext.layout.container.Box", "Ext.layout.container.HBox", "Ext.layout.container.VBox", "Ext.toolbar.Toolbar", "Ext.ux.statusbar.StatusBar", "Ext.panel.AbstractPanel", "Ext.grid.ColumnLayout", "Ext.grid.column.Column", "Ext.grid.column.Action", "Ext.draw.Draw", "Ext.fx.PropertyHandler", "Ext.fx.Anim", "Ext.layout.container.Border", "Ext.data.reader.Reader", "Ext.data.reader.Json", "Ext.data.proxy.Proxy", "Ext.data.proxy.Server", "Ext.data.proxy.JsonP", "Ext.data.proxy.Client", "Ext.data.proxy.Memory", "Ext.ux.data.PagingMemoryProxy", "Ext.dd.DD", "Ext.dd.DDProxy", "Ext.dd.DragSource", "Ext.panel.DD", "Ext.panel.Panel", "Ext.app.PortalPanel", "Ext.app.Portlet", "Ext.tab.Panel", "Ext.menu.Menu", "Ext.panel.Table", "Ext.window.Window", "Ext.window.MessageBox", "Ext.form.Basic", "Ext.form.Panel", "Ext.tip.Tip", "Ext.slider.Tip", "Ext.slider.Multi", "Ext.slider.Single", "Ext.LoadMask", "Ext.data.StoreManager", "Ext.selection.Model", "Ext.selection.DataViewModel", "Ext.view.AbstractView", "Ext.view.View", "Ext.view.Table", "Ext.grid.View", "Ext.grid.Panel", "Ext.DomHelper", "Ext.util.Point", "Ext.Layer", "Ext.util.CSS", "Ext.PluginManager", "Ext.resizer.Resizer", "Ext.layout.component.FieldSet", "Ext.Img", "Ext.grid.plugin.HeaderResizer", "Ext.resizer.SplitterTracker", "Ext.resizer.BorderSplitterTracker", "Ext.data.Batch", "Ext.data.Operation", "Ext.data.Request", "Ext.selection.RowModel", "Ext.grid.PagingScroller", "Ext.view.TableChunker", "Ext.ElementLoader", "Ext.form.CheckboxManager", "Ext.layout.component.Draw", "Ext.util.Queue", "Ext.data.IdGenerator", "Ext.data.validations", "Ext.grid.LockingView", "Ext.tip.ToolTip", "Ext.dd.DragZone", "Ext.data.association.Association", "Ext.data.SortTypes", "Ext.Ajax", "Ext.draw.CompositeSprite", "Ext.util.Grouper", "Ext.layout.ClassList", "Ext.data.AbstractStore", "Ext.dd.Registry", "Ext.tip.QuickTip", "Ext.tip.QuickTipManager", "Ext.ComponentLoader", "Ext.form.field.Checkbox", "Ext.panel.Tool", "Ext.grid.Lockable", "Ext.grid.header.DragZone", "Ext.ModelManager", "Ext.data.proxy.Ajax", "Ext.draw.Surface", "Ext.draw.Component", "Ext.layout.ContextItem", "Ext.layout.Context", "Ext.dd.DropZone", "Ext.grid.header.DropZone", "Ext.grid.plugin.HeaderReorderer", "Ext.data.Types", "Ext.data.Field", "Ext.data.Model", "Ext.data.Store.ImplicitModel-ext-empty-store", "Ext.data.Store", "Ext.data.ArrayStore", "Ext.resizer.ResizeTracker", "Ext.draw.engine.SvgExporter", "Ext.draw.engine.ImageExporter", "Ext.data.reader.Array", "Ext.ShadowPool", "Ext.draw.Matrix", "Ext.draw.SpriteDD", "Ext.Shadow", "Ext.draw.Sprite", "Ext.draw.engine.Svg", "Ext.draw.engine.Vml", "Oskari.mapframework.ui.module.common.mapmodule.GeoAction", "MapPanel", "MapLayer", "Wiki", "Train"]
	);

	if( !args.exclude || args.exclude == 'on')
	Oskari.excludeClasses(
			["*"]
			/*
			 * ["Ext.data.Request", "Ext.data.UuidGenerator",
			 * "Ext.data.association.BelongsTo", "Ext.data.association.HasOne",
			 * "Ext.data.reader.Xml", "Ext.data.writer.Xml",
			 * "Ext.draw.engine.ImageExporter", "Ext.draw.engine.SvgExporter",
			 * "Ext.Action", "Ext.Layer", "Ext.grid.PagingScroller",
			 * "Ext.grid.feature.RowBody", "Ext.grid.feature.RowWrap",
			 * "Ext.grid.plugin.DragDrop", "Ext.grid.plugin.HeaderResizer",
			 * "Ext.resizer.Resizer", "Ext.resizer.ResizeTracker",
			 * "Ext.tree.plugin.TreeViewDragDrop", "Ext.util.Cookies",
			 * "Ext.util.CSS", "Ext.util.History", "Ext.ComponentLoader",
			 * "Ext.chart.theme.Base", "Ext.data.Batch",
			 * "Ext.data.association.HasMany", "Ext.data.reader.Array",
			 * "Ext.data.proxy.JsonP", "Ext.data.proxy.LocalStorage",
			 * "Ext.data.proxy.SessionStorage", "Ext.direct.PollingProvider",
			 * "Ext.state.CookieProvider", "Ext.state.LocalStorageProvider",
			 * "Ext.PluginManager", "Ext.util.Point",
			 * "Ext.data.Store.ImplicitModel-ext-empty-store",
			 * "Ext.data.ArrayStore", "Ext.data.BufferStore",
			 * "Ext.data.JsonPStore", "Ext.data.XmlStore",
			 * "Ext.data.proxy.Rest", "Ext.data.DirectStore",
			 * "Ext.direct.ExceptionEvent", "Ext.direct.RemotingProvider",
			 * "Ext.layout.Context", "Ext.chart.axis.Category",
			 * "Ext.chart.axis.Gauge", "Ext.chart.axis.Radial",
			 * "Ext.chart.axis.Time", "Ext.draw.Text", "Ext.Img", "Ext.Shadow",
			 * "Ext.draw.engine.Svg", "Ext.draw.engine.Vml",
			 * "Ext.flash.Component", "Ext.form.Label",
			 * "Ext.form.action.DirectSubmit", "Ext.form.action.DirectLoad",
			 * "Ext.form.action.StandardSubmit", "Ext.grid.Lockable",
			 * "Ext.grid.feature.Chunking", "Ext.grid.feature.GroupingSummary",
			 * "Ext.grid.feature.Summary", "Ext.grid.plugin.HeaderReorderer",
			 * "Ext.grid.property.Property", "Ext.grid.property.Store",
			 * "Ext.layout.component.FieldSet", "Ext.form.field.Display",
			 * "Ext.form.field.Hidden", "Ext.form.field.Radio",
			 * "Ext.form.field.File", "Ext.container.Viewport",
			 * "Ext.form.FieldSet", "Ext.grid.property.HeaderContainer",
			 * "Ext.layout.container.Absolute", "Ext.layout.container.Column",
			 * "Ext.layout.container.Form", "Ext.layout.container.Table",
			 * "Ext.button.Cycle", "Ext.resizer.BorderSplitterTracker",
			 * "Ext.resizer.Handle", "Ext.layout.container.Border",
			 * "Ext.selection.CellModel", "Ext.selection.CheckboxModel",
			 * "Ext.grid.RowNumberer", "Ext.grid.column.Action",
			 * "Ext.grid.column.Boolean", "Ext.grid.column.Date",
			 * "Ext.grid.column.Number", "Ext.grid.column.Template",
			 * "Ext.grid.plugin.CellEditing", "Ext.form.RadioGroup",
			 * "Ext.layout.container.Accordion", "Ext.toolbar.Spacer",
			 * "Ext.container.ButtonGroup", "Ext.menu.ColorPicker",
			 * "Ext.menu.DatePicker", "Ext.tab.Panel", "Ext.slider.Single",
			 * "Ext.chart.series.Area", "Ext.chart.series.Column",
			 * "Ext.chart.series.Gauge", "Ext.chart.series.Line",
			 * "Ext.chart.series.Pie", "Ext.chart.series.Radar",
			 * "Ext.chart.series.Scatter", "Ext.app.Application",
			 * "Ext.form.field.HtmlEditor", "Ext.panel.Tool",
			 * "Ext.tree.ViewDragZone", "Ext.grid.ViewDropZone",
			 * "Ext.tree.ViewDropZone", "Ext.view.TableChunker",
			 * "Ext.form.field.ComboBox", "Ext.form.field.Time",
			 * "Ext.grid.property.Grid", "Ext.tree.Panel",
			 * "Ext.grid.plugin.RowEditing"]
			 */
	);
	
	var extpack = 'extportal';
	if( args.extpack )
		extpack = args.extpack;


	
	Oskari.clazz.create('Oskari.framework.oskari.QuickStartGuide').start({
		extpack : extpack
	});
});