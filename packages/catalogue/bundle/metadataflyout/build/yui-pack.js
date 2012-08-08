/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 09:56:06 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.catalogue.metadataflyout.bundle.LayerSelectionBundleInstance
 */
Oskari.clazz.define("Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.plugins = {};
	this._locale = null;
	this._requestHandlers = {};
	this.loader = null;

	this.layerPlugin = null;
	this.layer = null;
}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'catalogue.bundle.metadataflyout',
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	getLocale : function() {
		return this._locale;
	},
	getLoader : function() {
		return this.loader;
	},
	/**
	 * @property defaults
	 *
	 * some defaults for this bundle
	 */

	layerSpec : {
		"text" : "",
		"name" : "Metadata",
		"wmsName" : "1",
		"type" : "vectorlayer",
		"styles" : {
			"title" : "Trains",
			"legend" : "",
			"name" : "1"
		},
		"descriptionLink" : "http://www.paikkatietohakemisto.fi/",
		"orgName" : "Metadata",
		"inspire" : "Metadata",
		"legendImage" : "",
		"info" : "",
		"isQueryable" : true,
		"formats" : {
			"value" : "text/html"
		},
		"id" : 'catalogue_metadataflyout_layer',
		"minScale" : 36000000,
		"maxScale" : 1,
		"style" : "",
		"dataUrl" : "",
		"wmsUrl" : "x",
		"opacity" : 60,
		"checked" : "false",
		"styledLayerDescriptor" : '<StyledLayerDescriptor version="1.0.0" ' 
		+ 'xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" ' + 
		'    xmlns="http://www.opengis.net/sld" ' + 
		'    xmlns:ogc="http://www.opengis.net/ogc" ' +
		 '    xmlns:xlink="http://www.w3.org/1999/xlink" ' +
		  '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> ' + 
		  '  <NamedLayer> ' + '    <Name>Simple point with stroke</Name> ' +
		   '   <UserStyle><Title>GeoServer SLD Cook Book: Simple point with stroke</Title> ' +
		    '    <FeatureTypeStyle><Rule>' + '<PolygonSymbolizer>' +
		     ' <Graphic><Mark><WellKnownName>circle</WellKnownName>'+
		     '<Fill>' + '        <CssParameter name="fill">#000040</CssParameter>' + '       </Fill>'+
		     '<Stroke>' + '          <CssParameter name="stroke">#000040</CssParameter>' + 
		     '           <CssParameter name="stroke-width">2</CssParameter>' + '          </Stroke>'+
		     '</Mark><Size>12</Size></Graphic>' + '     </PolygonSymbolizer>' +
		      '<TextSymbolizer><Label><ogc:PropertyName>title</ogc:PropertyName></Label>' +
		       '<Fill><CssParameter name="fill">#000000</CssParameter></Fill></TextSymbolizer>' +
		        '</Rule></FeatureTypeStyle>' + '</UserStyle></NamedLayer></StyledLayerDescriptor>'
	},

	/**
	 * @method implements BundleInstance start methdod
	 *
	 */
	"start" : function() {
		if(this.started)
			return;

		this.started = true;

		/* locale */
		this._locale = Oskari.getLocalization(this.getName());

		/* sandbox */
		var sandbox = Oskari.$("sandbox");

		this.sandbox = sandbox;

		/* loader */
		this.loader = Oskari.clazz.create("Oskari.catalogue.metadataflyout.bundle.service.MetadataLoader", this.getLocale()['loader'], sandbox);

		sandbox.register(this);

		for(p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}

		/* request handler */
		this._requestHandlers['catalogue.ShowMetadataRequest'] = Oskari.clazz.create('Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler', sandbox, this);
		sandbox.addRequestHandler('catalogue.ShowMetadataRequest', this._requestHandlers['catalogue.ShowMetadataRequest']);
		;

		/* layer && layer plugin */
		var layerSpec = {};
		
		for( var p in this.layerSpec ) {
			layerSpec[p] = this.layerSpec[p];
		}
		
		var layerLocale = this.getLocale()['layer'];
		for( var p in layerLocale ) {
			layerSpec[p] = layerLocale[p];
		}
		
		var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
		var mapLayer = mapLayerService.createMapLayer(layerSpec);
		mapLayerService.addLayer(mapLayer, true);
		this.layer = mapLayer;

		var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
		var layerPlugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.MetadataLayerPlugin');
		layerPlugin.setMapLayer(mapLayer); /* must have this one before register */
		
		mapModule.registerPlugin(layerPlugin);
		mapModule.startPlugin(layerPlugin);
		this.layerPlugin = layerPlugin;
		
		
		/*layerPlugin.addMapLayerToMap(mapLayer, true, false);*/

		/* */

		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

		/* stateful */
		sandbox.registerAsStateful(this.mediator.bundleId, this);

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
	 * @method onEvent
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
	/**
	 * @property eventHandlers
	 * @static
	 *
	 */
	eventHandlers : {
		'AfterMapLayerAddEvent' : function(event) {
			/* this might react when layer added */
			/* this.scheduleShowMetadata(event.getMapLayer().getMetadataResourceUUID(); */
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			/* this might react when layer removed */
			/* this.scheduleShowMetadata(event.getMapLayer().getMetadataResourceUUID(); */
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapMoveEvent' : function(event) {
			/* this might react when map moved */

		}
	},

	/**
	 * @method stop
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {

		var sandbox = this.sandbox;

		/* request handler cleanup */
		sandbox.removeRequestHandler('catalogue.ShowMetadataRequest', this._requestHandlers['catalogue.ShowMetadataRequest']);

		/* sandbox cleanup */

		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		this.sandbox.unregisterStateful(this.mediator.bundleId);
		this.sandbox.unregister(this);
		this.started = false;
	},
	setSandbox : function(sandbox) {
		this.sandbox = null;
	},
	startExtension : function() {

		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.catalogue.bundle.metadataflyout.Flyout', this, this.getLocale()['flyout'], this.getLoader());
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.catalogue.bundle.metadataflyout.Tile', this, this.getLocale()['tile']);
	},
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	getTitle : function() {
		return this.getLocale()['title'];
	},
	getDescription : function() {
		return "Sample";
	},
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method scheduleShowMetadata
	 * schedules a refresh of the UI to load metadata asynchronously
	 */
	scheduleShowMetadata : function(uuid, RS_Identifier_Code, getRS_Identifier_CodeSpace) {

		/** update flyout content */
		this.plugins['Oskari.userinterface.Flyout'].scheduleShowMetadata(uuid, RS_Identifier_Code, getRS_Identifier_CodeSpace);

		this.getSandbox().requestByName(this, 'userinterface.UpdateExtensionRequest', [this, 'detach']);
	},
	/**
	 *  @method showExtentOnMap
	 */
	showExtentOnMap : function(uuid, env,atts) {

		var me = this;
		if(!env)
			return;

		var feats = [];

		for(var n = 0; n < env.length; n++) {
			var vals = env[n];
			var e = new OpenLayers.Bounds(vals.westBoundLongitude, vals.southBoundLatitude, vals.eastBoundLongitude, vals.northBoundLatitude);

			var ep = e.toGeometry();

			var ef = new OpenLayers.Feature.Vector(ep);
			ef.attributes = atts  || ef.attributes;
			feats.push(ef);
		}

		var event = me.getSandbox().getEventBuilder("FeaturesAvailableEvent")(this.layer, feats, "application/nlsfi-x-openlayers-feature", "EPSG:3067", "replace");

		me.sandbox.notifyAll(event);
	},
	/**
	 * @method setState
	 * @param {Object} state bundle state as JSON
	 */
	setState : function(state) {
		this.plugins['Oskari.userinterface.Flyout'].setContentState(state);
	},
	/**
	 * @method getState
	 * @return {Object} bundle state as JSON
	 */
	getState : function() {
		return this.plugins['Oskari.userinterface.Flyout'].getContentState();
		/*
		 var state = {

		 };

		 return state;
		 */
	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.catalogue.metadataflyout.bundle.service.MetadataLoader
 *
 * Class to load metadata content from backend
 *
 */
Oskari.clazz.define("Oskari.catalogue.metadataflyout.bundle.service.MetadataLoader", function(urls, sandbox) {
	this.urls = urls;
	this.sandbox = sandbox;
	this.dev = false;
}, {

	/**
	 * @method getURLForView
	 *
	 * builds backend URL URI or whatever it's called n
	 */
	getURLForView : function(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType) {
		var url = this.urls[subsetId];
		var uri = url + "uuid=" + uuid;

		/*dev only */
		if(this.dev) {
			var devuri = {
			'abstract': 'abstract',
			'jhs' : 'jhs158',
			'inspire' : 'inspire',
			'json' : 'json'		}[subsetId];

			if(devuri != null) {
				uri = devuri;
			}
				
		}

		return uri;
	},
	/**
	 * @method loadMetadata
	 *
	 * loads metadata from backend
	 *
	 */
	loadMetadata : function(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType) {

		var uri = this.getURLForView(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);

		this.sandbox.printDebug("loadMetadata " + uri);

		if(uri == null)
			return;

		jQuery.ajax({
			url : uri,
			dataType : dataType,
			success : function(data, textStatus) {

				cb(data);
			}
		});
	},
	/**
	 * @method openMetadata
	 *
	 * opens metadata from backend to new window
	 *
	 */
	openMetadata : function(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType, target) {
		var uri = this.getURLForView(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);
		
		this.sandbox.printDebug("openMetadata " + uri);

		var win = window.open(uri, target, "resizable=yes,scrollbars=yes,status=yes");

	}
});
/**
 * @class Oskari.catalogue.metadataflyout.layerselection.Flyout
 *
 *
 * This hosts metadata content loaded via ajax from
 * Geonetwork
 *
 * Embeds preformatted (unstyled) tables of metadata information.
 *
 * Style will be forced with CLASS manipulation ?
 *
 * TBD this does way too much logic - logic to be moved to instance
 *
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, locale, loader) {

	/* @property instance bundle instance */
	this.instance = instance;

	/* @property locale locale for this */
	this.locale = locale;

	/* @property container the DIV element */
	this.container = null;

	/* element references */
	this.views = {};
	this.titles = {};
	this.tabs = {};
	this.browseGraphic = null;
	
	/* @Alert for some notifications */
	this.compileTemplates() ;
	this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

	/**
	 * @property showQueue
	 * request queue to enable postponing ajax loads (TBD)
	 *
	 */
	this.showQueue = [];

	/**
	 * @property state
	 */
	this.state = null;

	/**
	 * @property contentState
	 * what is shown and how
	 */
	this.contentState = {
		metadata : {
			uuid : null,
			RS_Identifier_Code : null,
			RS_Identifier_CodeSpace : null
		},
		view : 'abstract'

	};

}, {
	compileTemplates: function() {
		
	},
	/**
	 * @property template HTML templates for the User Interface
	 * @static
	 */
	templates : {
		content : "<div class='metadataflyout_content'></div>",
		browseGraphic : "<div class='metadataflyout_content_browseGraphic'><img /></div>",
		viewTabs : "<div class='metadataflyout_content_tabs'></div>",
		viewTab : "<div class='metadataflyout_content_tab'></div>",
		titles : {
			"abstract" : "<div class='metadataflyout_content_abstract_title'></div>",
			"jhs" : "<div class='metadataflyout_content_jhs_title'></div>",
			"inspire" : "<div class='metadataflyout_content_inspire_title'></div>"

		},
		views : {
			"abstract" : "<div class='metadataflyout_content_abstract'></div>",
			"jhs" : "<div class='metadataflyout_content_jhs'></div>",
			"inspire" : "<div class='metadataflyout_content_inspire'></div>"
		}
	},
	getName : function() {
		return 'Oskari.catalogue.bundle.metadataflyout.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = jQuery(el);
	},
	startPlugin : function() {
		var locale = this.locale;
		var content = jQuery(this.templates.content);

		var me = this;

		/* let's create view selector tabs - and hide them all */

		var viewTabs = jQuery(this.templates.viewTabs);
		var viewTab = jQuery(this.templates.viewTab);

		for(var v in this.templates.views ) {
			var tabs = viewTabs.clone();
			var tabTexts = locale.tabs[v];

			for(var t in tabTexts ) {
				var tab = viewTab.clone();

				if( typeof tabTexts[t] === "string") {

					tab.append(tabTexts[t]);
					tabs.append(tab);
					if(t != v) {

						tab.click({
							viewId : t
						}, function(arg) {
							var data = arg.data;
							me.showMetadataView(data.viewId);
						});
					}
				} else {
					var text = tabTexts[t].text;
					var target = tabTexts[t].target;

					tab.append(text);
					tabs.append(tab);

					tab.click({
						viewId : t,
						target : target
					}, function(arg) {
						var data = arg.data;
						me.openMetadataView(data.viewId, data.target);
					});
				}
			}

			tabs.hide();

			this.tabs[v] = tabs;
			content.append(tabs);
		}

		/*placeholder for browseGrpahics */
		var browseGraphic = jQuery(this.templates.browseGraphic);
		this.browseGraphic = browseGraphic;
		content.append(browseGraphic);

		/*
		 * let's create views - and hide them also
		 */
		for(var v in this.templates.views ) {

			/*
			 * view tabs
			 */

			/*
			 * views
			 */
			this.titles[v] = jQuery(this.templates.titles[v]);
			this.titles[v].append(this.locale[v]);
			this.views[v] = jQuery(this.templates.views[v]);

			content.append(this.titles[v]);
			content.append(this.views[v]);

		}

		/* special handling */
		/* let's add placeholder for browseGraphics */
		content.append(viewTabs);

		this.alert.insertTo(this.container);


		this.container.append(content);
		

	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return "Metadata";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;

	},
	/**
	 * @method openMetadataView
	 *
	 * opens a view in new window. this will not change state.
	 */
	openMetadataView : function(viewId, target) {
		var me = this;
		var metadata = this.contentState.metadata;

		this.instance.getLoader().openMetadata(viewId, metadata.uuid, metadata.RS_Identifier_Code, metadata.RS_Identifier_CodeSpace, function(data) {
		}, null, target);
	},
	/**
	 * @method showMetadataView
	 *
	 * shows metadata subset view. this changes state.
	 */
	showMetadataView : function(viewId, target) {
		this.instance.getSandbox().printDebug("ShowMetadataView " + viewId);
		var tabs = this.tabs;
		var views = this.views;
		var titles = this.titles;

		for(var v in views ) {
			if(v != viewId) {
				tabs[v].hide();
				titles[v].hide();
				views[v].hide();
			} else {
				tabs[v].show();
				titles[v].show();
				views[v].hide();
			}

		}

		this.contentState.view = viewId;

		this.loadMetadataForState();

	},
	/**
	 * @method loadMetadataForState
	 */
	loadMetadataForState : function() {

		var me = this;
		var views = this.views;
		var viewId = this.contentState.view;

		var metadata = this.contentState.metadata;

		me.instance.getLoader().loadMetadata(viewId, metadata.uuid, metadata.RS_Identifier_Code, metadata.RS_Identifier_CodeSpace, function(data) {

			var context = views[viewId];
			context.empty();
			
			if( me.instance.getLoader().dev) {
				me.alert.setContent('Development Mode!','error');
			}
			
			var embeddables = jQuery(data);
			var rootEl = $(embeddables[0].documentElement);
			window.junkster = embeddables;

			/* HACK BEGIN */
			/* Let's fix HREFs to click events */
			var links = rootEl.find("a[href]");

			jQuery.each(links, function(index, ahref) {

				var el = jQuery(ahref);
				var href = el.attr('href');
				if(!href)
					return;
				if(!href[0] == '?')
					return;

				var splits = href.split("&");
				var argMap = {};
				jQuery.each(splits, function(index, part) {
					var keyVal = part.split("=");
					argMap[keyVal[0]] = keyVal[1];
				});

				el.attr('href', null);
				el.click({
					viewId : viewId,
					uuid : argMap['uuid']
				}, function(arg) {
					var data = arg.data;
					var uuid = data.uuid;

					me.showMetadata(uuid);
				});
			});

			context.append(rootEl);
			
			/* HACK END */
			context.fadeIn();

		});
	},
	/**
	 * @method loadMetadataJSONForState
	 */
	loadMetadataJSONForState : function() {

		var me = this;
		var metadata = this.contentState.metadata;

		this.instance.getLoader().loadMetadata('json', metadata.uuid, metadata.RS_Identifier_Code, metadata.RS_Identifier_CodeSpace, function(data) {
			var metadataJson = data.mdcs[0];
			me.processJSON(metadataJson);
		}, 'json');
	},
	/**
	 * @method processJSON
	 */
	processJSON : function(metadataJson) {
		var browseGraphicUrl = metadataJson.browseGraphic;
		var extentEnvelope = metadataJson.env;

		/*
		 * Let's display the browse graphic image
		 */
		if(browseGraphicUrl) {
			var img = this.browseGraphic.children('img');

			if(this.instance.getLoader().dev) {
				img.attr('src', 'espoo_johtokartta_s.png');
			} else {
				img.attr('src', browseGraphicUrl);
			}

		}

		/*
		 * Let's post Envelope to some layer
		 */
		if(extentEnvelope) {
			this.instance.showExtentOnMap(this.contentState.metadata.uuid, extentEnvelope,metadataJson);
		}

	},
	/**
	 * @method showMetadata
	 *
	 * Launches Ajax requestst to embed metadata descriptions
	 * for requested metadata
	 *
	 * Backend provides HTML setups that will be embedded and
	 * styled with bundled CSS.
	 */
	showMetadata : function(uuid, RS_Identifier_Code, RS_Identifier_CodeSpace) {

		this.contentState.metadata.uuid = uuid;
		this.contentState.metadata.RS_Identifier_Code = RS_Identifier_Code;
		this.contentState.metadata.RS_Identifier_CodeSpace = RS_Identifier_CodeSpace;

		this.instance.getSandbox().printDebug("showMetadata { uuid=" + uuid + ", view=" + this.contentState.view + "}");

		this.loadMetadataJSONForState();
		this.showMetadataView(this.contentState.view);

	},
	/**
	 * @method scheduleShowMetadata
	 *
	 * this 'schedules' asyncronous loading
	 * ( calls directly now )
	 * Used to buffer excess calls
	 *
	 */
	scheduleShowMetadata : function(uuid, RS_Identifier_Code, RS_Identifier_CodeSpace) {
		this.showMetadata(uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);
	},
	/**
	 * @method setContentState

	 * restore state from store
	 */
	setContentState : function(contentState) {
		this.contentState = contentState;
		this.loadMetadataJSONForState();
		this.showMetadataView(this.contentState.view);

	},
	/**
	 * @method getContentState
	 *
	 * get state for store
	 */
	getContentState : function() {
		return this.contentState;
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/**
 * @class Oskari.catalogue.metadataflyout.Tile
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.Tile',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance,locale) {
	
	this.instance = instance;
	this.locale = locale;
	this.container = null;
	this.template = null;
}, {
	getName : function() {
		return 'Oskari.catalogue.bundle.metadataflyout.Tile';
	},
	setEl : function(el, width, height) {
		this.container = $(el);
	},
	startPlugin : function() {
		this.refresh();
	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return this.locale['title'];
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;
	},
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		
		var status = cel.children('.oskari-tile-status');
		/*status.empty();*/

		/*status.append('(' + layers.length + ')');*/

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});

/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequest
 * 
 * A Class that may be used as a request to show metadata for the given
 * metadata uuid or RS_Identifier Code / RS_Identifier CodeSpace
 *   
 */
Oskari.clazz
        .define(
                'Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequest',
                function(config) {
                    this._creator = null;
                    
					this._uuid = config.uuid;
					this._RS_Identifier_Code = config._RS_Identifier_Code;
					this._RS_Identifier_CodeSpace = config._RS_Identifier_CodeSpace;
                    
                    
                }, {
                    __name : "catalogue.ShowMetadataRequest",
                    getName : function() {
                        return this.__name;
                    },

                    getUuid : function() {
                        return this._uuid;
                    },
                    
                    getRS_Identifier_Code : function() {
                        return this._RS_Identifier_Code;
                    },
                    getRS_Identifier_CodeSpace : function() {
                        return this._RS_Identifier_CodeSpace;
                    }
                },
                
                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler', function(sandbox, instance) {

	this.sandbox = sandbox;
	
	/** @property instance */
	this.instance = instance;
}, {
	
	/** @method handleRequest dispatches processing to instance */
	handleRequest : function(core, request) {
		this.sandbox.printDebug("[Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler] Show Metadata: " + request.getUuid());
		this.instance.scheduleShowMetadata(request.getUuid(), request.getRS_Identifier_Code(), request.getRS_Identifier_CodeSpace());
	}
}, {
	protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.mapmodule.VectorLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.MetadataLayerPlugin', function() {
	this.mapModule = null;
	this.pluginName = null;
	this._sandbox = null;
	this._map = null;
	this._layer = null;
	this._supportedFormats = {};
	this._features = null;
	this._sldFormat = new OpenLayers.Format.SLD({
		multipleSymbolizers : false,
		namedLayersAsArray : true
	});
}, {
	__name : 'MetadataLayerPlugin',

	getName : function() {
		return this.pluginName;
	},
	getMapModule : function() {
		return this.mapModule;
	},
	setMapModule : function(mapModule) {
		this.mapModule = mapModule;
		this.pluginName = mapModule.getName() + this.__name;

	},
	register : function() {
		this.getMapModule().setLayerPlugin('metadatalayer', this);
	},
	unregister : function() {
		this.getMapModule().setLayerPlugin('metadatalayer', null);
	},
	init : function(sandbox) {
	},
	startPlugin : function(sandbox) {
		this._sandbox = sandbox;
		this._map = this.getMapModule().getMap();

		this.registerVectorFormats();

		sandbox.register(this);
		for(p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}
	},
	stopPlugin : function(sandbox) {

		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		sandbox.unregister(this);

		this._map = null;
		this._sandbox = null;
	},
	/* @method start
	 * called from sandbox
	 */
	start : function(sandbox) {
	},
	/**
	 * @method stop
	 * called from sandbox
	 *
	 */
	stop : function(sandbox) {
	},
	eventHandlers : {
		'AfterMapLayerAddEvent' : function(event) {
			this.afterMapLayerAddEvent(event);
		},
		'AfterMapLayerRemoveEvent' : function(event) {
			this.afterMapLayerRemoveEvent(event);
		},
		'FeaturesAvailableEvent' : function(event) {
			this.handleFeaturesAvailableEvent(event);
		},
		 'AfterChangeMapLayerOpacityEvent' : function(event) {
            this.afterChangeMapLayerOpacityEvent(event);
        },
	},

	onEvent : function(event) {
		return this.eventHandlers[event.getName()].apply(this, [event]);
	},
	/**
	 *
	 */
	preselectLayers : function(layers) {
		var ownedLayer = this.getMapLayer();

		var sandbox = this._sandbox;
		for(var i = 0; i < layers.length; i++) {
			var layer = layers[i];
			var layerId = layer.getId();

			if(!layer.isLayerOfType('VECTOR'))
				continue;
			if(ownedLayer.getId() != layer.getId())
				continue;

			sandbox.printDebug("preselecting " + layerId);
			this.addMapLayerToMap(layer, true, layer.isBaseLayer());
		}

	},
	setMapLayer : function(layer) {
		this._layer = layer;
	},
	getMapLayer : function() {
		return this._layer;
	},
	/**
	 * adds vector format to props of known formats
	 */
	registerVectorFormat : function(mimeType, formatImpl) {
		this._supportedFormats[mimeType] = formatImpl;
	},
	/**
	 * registers default vector formats
	 */
	registerVectorFormats : function() {
		this.registerVectorFormat("application/json", new OpenLayers.Format.GeoJSON({}));
		this.registerVectorFormat("application/nlsfi-x-openlayers-feature", new function() {
		this.read = function(data) {
		return data;
		};
		});
	},
	/***********************************************************
	 * Handle AfterMapLaeyrAddEvent
	 *
	 * @param {Object}
	 *            event
	 */
	afterMapLayerAddEvent : function(event) {
		this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
	},
	afterMapLayerRemoveEvent : function(event) {
		var layer = event.getMapLayer();

		this.removeMapLayerFromMap(layer);
	},
	
	 afterChangeMapLayerOpacityEvent : function(event) {
	   var layer = event.getMapLayer();
       var ownedLayer = this.getMapLayer();
		
		if(!layer.isLayerOfType('VECTOR'))
			return;
			
		if(layer.getId() != ownedLayer.getId()) 
			return;

    
        this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
        var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
        if(mapLayer[0] != null) {
              mapLayer[0].setOpacity(layer.getOpacity() / 100);
        }
    },
	
	/**
	 * primitive for adding layer to this map
	 */
	addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

		var ownedLayer = this.getMapLayer();
		
		if(!layer.isLayerOfType('VECTOR'))
			return;
			
		if(layer.getId() != ownedLayer.getId()) 
			return;

		var markerLayer = this._map.getLayersByName("Markers");
		this._map.removeLayer(markerLayer[0], false);

		//						var layerScales = this.getMapModule().calculateLayerScales(layer
		//								.getMaxScale(), layer.getMinScale());

		var styleMap = new OpenLayers.StyleMap();
		var layerOpts = {
			styleMap : styleMap
		};
		var sldSpec = layer.getStyledLayerDescriptor();

		if(sldSpec) {
			this._sandbox.printDebug(sldSpec);
			var styleInfo = this._sldFormat.read(sldSpec);

			window.styleInfo = styleInfo;
			var styles = styleInfo.namedLayers[0].userStyles;

			var style = styles[0];
			// if( style.isDefault) {
			styleMap.styles["default"] = style;
			// }
		} else {
			this._sandbox.printDebug("NO SLD FOUND");
		}

		var openLayer = new OpenLayers.Layer.Vector('layer_' + layer.getId(), layerOpts);

		openLayer.opacity = layer.getOpacity() / 100;

		this._map.addLayer(openLayer);
		
		if( this._features ) {
			openLayer.addFeatures(this._features);
		}


		this._sandbox.printDebug("#!#! CREATED VECTOR / OPENLAYER.LAYER.VECTOR for " + layer.getId());

		if(keepLayerOnTop) {
			this._map.setLayerIndex(openLayer, this._map.layers.length);
		} else {
			this._map.setLayerIndex(openLayer, 0);
		}

		this._map.addLayer(markerLayer[0]);
			

	},
	removeMapLayerFromMap : function(layer) {

		var ownedLayer = this.getMapLayer();
		
		if(!layer.isLayerOfType('VECTOR'))
			return;
			
		if(layer.getId() != ownedLayer.getId()) 
			return;

		var remLayer = this._map.getLayersByName('layer_' + layer.getId());
		/* This should free all memory */
		remLayer[0].destroy();

	},
	getOLMapLayers : function(layer) {

		if(!layer.isLayerOfType('VECTOR')) {
			return;
		}

		var ownedLayer = this.getMapLayer();
		if(layer.getId() != ownedLayer.getId()) {
			return;
		}

		return this._map.getLayersByName('layer_' + layer.getId());
	},
	/**
	 *
	 */
	handleFeaturesAvailableEvent : function(event) {
		var layer = event.getMapLayer();
		if(layer == null)
			return;

		var ownedLayer = this.getMapLayer();
		if(layer.getId() != ownedLayer.getId()) {
			return;
		}
		
		var mimeType = event.getMimeType();
		var features = event.getFeatures();
		
		
		
		var op = event.getOp();


		var format = this._supportedFormats[mimeType];

		if(!format) {
			return;
		}

		var fc = format.read(features);
		
		this._features = fc;

		var mapLayer = this._map
		.getLayersByName('layer_' + layer.getId())[0];
		if(!mapLayer) {
			return;
		}

		if(op && op == 'replace') {
			mapLayer.removeFeatures(mapLayer.features);
		}

		mapLayer.addFeatures(fc);
	}
}, {
	'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/*
 * Locale for fi
 */
Oskari.registerLocalization({
	"lang" : "fi",
	"key" : "catalogue.bundle.metadataflyout",
	"value" : {
		"title" : "Metatieto",
		"desc" : "",
		"loader" : {
			"json" : "/catalogue/portti-metadata-printout-service/MetadataServlet?",
			"abstract" : "/geonetwork/srv/fi/metadata.show.portti.abstract?",
			"inspire" : "/geonetwork/srv/fi/metadata.show.portti?",
			"jhs" : "/geonetwork/srv/fi/metadata.show.portti.jhs158?",
			"pdf" : "/catalogue/portti-metadata-printout-service/MetadataPrintoutServlet?lang=fi&title=METATIETOTULOSTE&metadataresource",
			"xml" : "/geonetwork/srv/fi/iso19139.xml?",
			"schemas" : "/geonetwork/srv/fi/metadata.show.portti.skeemat?",
			"abstract" : "/geonetwork/srv/fi/metadata.show.portti.abstract?",
		},
		"layer" : {
			"name" : "Metatieto",
			"description" : "",
			"orgName" : "Paikkatietohakemisto",
			"inspire" : "Metatieto"
		},
		"flyout" : {
			"title" : "Metatieto",
			"abstract" : "Perustiedot",
			"inspire" : "INSPIRE",
			"jhs" : "JHS",
			"xml" : "XML",
			"map" : "Kattavuus",
			"pdf" : "Tuloste",
			"select_metadata_prompt" : "Valitse metatieto kuvakkeista painamalla.",
			"metadata_printout_title" : "METATIETOTULOSTE",
			"linkto" : "Metatietolinkki",
			"tabs" : {
				"abstract" : {
					"abstract" : "",
					"jhs" : "Näytä JHS",
					"inspire" : "Näytä INSPIRE",
					"xml" : { 
						"text" : "Avaa ISO 19139 XML",
						"target" : "_blank"
					},
					"pdf" : {
						"text" : "Avaa PDF -tuloste",
						"target" : "_blank"
					}
				},
				"jhs" : {
					"abstract" : "Näytä perustiedot",
					"jhs" : "",
					"inspire" : "Näytä INSPIRE",
					"xml" : { 
						"text" : "Avaa ISO 19139 XML",
						"target" : "_blank"
					},
					"pdf" : {
						"text" : "Avaa PDF -tuloste",
						"target" : "_blank"
					}
				},
				"inspire" : {
					"abstract" : "Näytä perustiedot",
					"jhs" : "Näytä JHS",
					"inspire" : "",
					"xml" : { 
						"text" : "Avaa ISO 19139 XML",
						"target" : "_blank"
					},
					"pdf" : {
						"text" : "Avaa PDF -tuloste",
						"target" : "_blank"
					}
				}

			}
		},
		"tile" : {
			"title" : "Metatieto",
			"tooltip" : "?"
		}
	}
});
/*
 * Locale for fi
 */
Oskari.registerLocalization({
	"lang" : "en",
	"key" : "catalogue.bundle.metadataflyout",
	"value" : {
		"title" : "Metadata",
		"desc" : "",
		"loader" : {
			"json" : "/catalogue/portti-metadata-printout-service/MetadataServlet?",
			"abstract" : "/geonetwork/srv/en/metadata.show.portti.abstract?",
			"inspire" : "/geonetwork/srv/en/metadata.show.portti?",
			"jhs" : "/geonetwork/srv/en/metadata.show.portti.jhs158?",
			"xml" : "/geonetwork/srv/en/iso19139.xml?",
			"schemas" : "/geonetwork/srv/en/metadata.show.portti.skeemat?",
			"abstract" : "/geonetwork/srv/en/metadata.show.portti.abstract?",
		},
		"layer" : {
			"name" : "Metadata",
			"description" : "",
			"orgName" : "Metadata",
			"inspire" : "Metadata"
		},
		"flyout" : {
			"title" : "Metadata",
			"abstract" : "Abstract",
			"inspire" : "INSPIRE",
			"jhs" : "JHS",
			"xml" : "XML",
			"map" : "Geographic Extent",
			"pdf" : "Printout",
			"select_metadata_prompt" : "Select metadata by clicking one of the icons.",
			"metadata_printout_title" : "METADATA PRINTOUT",
			"linkto" : "Link to this Metadata",
			"tabs" : {
				"abstract" : {
					"abstract" : "",
					"jhs" : "Show JHS metadata",
					"inspire" : "Show INSPIRE metadata",
					"xml" : {
						"text" : "Näytä ISO 19139 XML",
						"target" : "_blank"
					}

				},
				"jhs" : {
					"abstract" : "Show Abstract",
					"jhs" : "",
					"inspire" : "Show INSPIRE metadata",
					"xml" : {
						"text" : "Show ISO 19139 XML",
						"target" : "_blank"
					}

				},
				"inspire" : {
					"abstract" : "Show Abstract",
					"jhs" : "Show JHS metadata",
					"inspire" : "",
					"xml" : {
						"text" : "Show ISO 19139 XML",
						"target" : "_blank"
					}
				}

			}
		},
		"tile" : {
			"title" : "Metadata",
			"tooltip" : "?"
		}

	}
});
/*
 * Locale for sv
 */
Oskari.registerLocalization({
	"lang" : "sv",
	"key" : "catalogue.bundle.metadataflyout",
	"value" : {
		"title" : "Metadata",
		"desc" : "",
		"loader" : {
			"json" : "/catalogue/portti-metadata-printout-service/MetadataServlet?",
			"abstract" : "/geonetwork/srv/sv/metadata.show.portti.abstract?",
			"inspire" : "/geonetwork/srv/sv/metadata.show.portti?",
			"jhs" : "/geonetwork/srv/sv/metadata.show.portti.jhs158?",
			"xml" : "/geonetwork/srv/sv/iso19139.xml?",
			"schemas" : "/geonetwork/srv/sv/metadata.show.portti.skeemat?",
			"abstract" : "/geonetwork/srv/sv/metadata.show.portti.abstract?",
		},
		"layer" : {
			"name" : "Metadata",
			"description" : "",
			"orgName" : "Metadata",
			"inspire" : "Metadata"
		},
		"flyout" : {
			"title" : "Metadata",
			"abstract" : "Abstrakt",
			"inspire" : "INSPIRE",
			"jhs" : "JHS",
			"xml" : "XML",
			"map" : "Omfattning",
			"pdf" : "Utskrift",
			"select_metadata_prompt" : "VÃ¤lj metadata...",
			"metadata_printout_title" : "METATIETOTULOSTE",
			"linkto" : "AnvÃ¤nd denna lÃ¤nk fÃ¶r att lÃ¤nka till den hÃ¤r metadatan",
			"tabs" : {
				"abstract" : {
					"abstract" : "",
					"jhs" : "Näytä JHS metatieto",
					"inspire" : "Näytä INSPIRE metatieto",
					"xml" : "Näytä ISO 19139 XML"
				},
				"jhs" : {
					"abstract" : "Näytä vain perustiedot",
					"jhs" : "",
					"inspire" : "Näytä INSPIRE metatieto",
					"xml" : "Näytä ISO 19139 XML"
				},
				"inspire" : {
					"abstract" : "Näytä vain perustiedot",
					"jhs" : "Näytä JHS metatieto",
					"inspire" : "",
					"xml" : "Näytä ISO 19139 XML"
				},
				"xml" : {
					"abstract" : "Näytä vain perustiedot",
					"jhs" : "Näytä JHS metatieto",
					"inspire" : "Näytä INSPIRE metatieto",
					"xml" : ""
				},
				"pdf" : {
					"abstract" : "Näytä vain perustiedot",
					"jhs" : "Näytä JHS metatieto",
					"inspire" : "Näytä INSPIRE metatieto",
					"xml" : "Näytä ISO 19139 XML"
				}

			}
		},
		"tile" : {
			"title" : "Metadata",
			"tooltip" : "?"
		}

	}
});
