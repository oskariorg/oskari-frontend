/**
 * @class Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin
 *
 * This is a plugin to classify thematic column data.
 * This provides UI of classification params, geostats classifying and html output of classification
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModuleManageClassificationPlugin
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin',
/**
 * @method create called automatically on construction
 * @params config   reserved for future
 * @params locale   localization strings
 *
 *
 * @static
 */
function(config, locale) {
	this.mapModule = null;
	this.pluginName = null;
	this._sandbox = null;
	this._map = null;
	this.element = undefined;
	this.conf = config;
	this._locale = locale;
	this.initialSetup = true;
	this.colorsets = null;
	this.colorsetIndex = 5;
	this.currentColor = "#bcbcbc";
	this.curCol = null;
	this._layer = null;
	this._params = null;

}, {
	/** @static @property __name module name */
	__name : 'ManageClassificationPlugin',

	/**
	 * @method getName
	 * @return {String} module name
	 */
	getName : function() {
		return this.pluginName;
	},
	/**
	 * @method getMapModule
	 * Returns reference to map module this plugin is registered to
	 * @return {Oskari.mapframework.ui.module.common.MapModule}
	 */
	getMapModule : function() {
		return this.mapModule;
	},
	/**
	 * @method setMapModule
	 * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
	 * module
	 */
	setMapModule : function(mapModule) {
		this.mapModule = mapModule;
		if (mapModule) {
			this.pluginName = mapModule.getName() + this.__name;
		}
	},
	/**
	 * @method hasUI
	 * This plugin has an UI so always returns true
	 * @return {Boolean}
	 */
	hasUI : function() {
		return true;
	},
	/**
	 * @method getMap
	 * @return {OpenLayers.Map} reference to map implementation
	 */
	getMap : function() {
		return this._map;
	},
	/**
	 * @method register
	 * Interface method for the module protocol
	 */
	register : function() {
	},
	/**
	 * @method unregister
	 * Interface method for the module protocol
	 */
	unregister : function() {
	},
	/**
	 * @method init
	 * Interface method for the module protocol. Initializes the request
	 * handlers/templates.
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * 			reference to application sandbox
	 */
	init : function(sandbox) {
		// Classify html template
		this.classify_temp = jQuery("<div class='manageClassificationPlugin'>" + '<div class="classheader"><div class="header-icon icon-arrow-white-right"></div></div>' + '<div class="content"></div>' + "</div>");
		// Setup Colors
		this.setColors();
	},
	/**
	 * @method startPlugin
	 *
	 * Interface method for the plugin protocol. Registers requesthandlers and
	 * eventlisteners. Creates the plugin UI.
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * 			reference to application sandbox
	 */
	startPlugin : function(sandbox) {
		this._sandbox = sandbox;
		this._map = this.getMapModule().getMap();
		sandbox.register(this);
		for (p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}

		this._createUI();
	},
	/**
	 * @method stopPlugin
	 *
	 * Interface method for the plugin protocol. Unregisters requesthandlers and
	 * eventlisteners. Removes the plugin UI.
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * 			reference to application sandbox
	 */
	stopPlugin : function(sandbox) {

		for (p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		sandbox.unregister(this);

		// remove ui
		if (this.element) {
			this.element.remove();
			this.element = undefined;
			delete this.element;
		}
	},
	/**
	 * @method start
	 * Interface method for the module protocol
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * 			reference to application sandbox
	 */
	start : function(sandbox) {
	},
	/**
	 * @method stop
	 * Interface method for the module protocol
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * 			reference to application sandbox
	 */
	stop : function(sandbox) {
	},
	/**
	 * @property {Object} eventHandlers
	 * @static
	 */
	eventHandlers : {
		/**
		 * @method MapLayerEvent
		 * @param {Oskari.mapframework.event.common.MapLayerEvent} event
		 *
		 * Adds the layer to selection
		 */
		'MapLayerEvent' : function(event) {
			// Is stats map layer selected
			var layers = this._sandbox.findAllSelectedMapLayers();

			for (var n = layers.length - 1; n >= 0; --n) {
				var layer = layers[n];
				if (layer._layerType === "STATS" && !layer.isBaseLayer()) {
					if (layer.isVisible()) {
						this._visibilityOn();
					} else {
						this._visibilityOff();
					}
					break;
				}
			}

		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
		 *
		 * Removes the layer from selection
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			// Hide Classify dialog
			if (event.getMapLayer()._layerType === "STATS")
				this._visibilityOff();
		},
		/**
		 * @method AfterMapLayerAddEvent
		 * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
		 *
		 * Adds the layer to selection
		 */
		'AfterMapLayerAddEvent' : function(event) {

			// Show Classify dialog
			if (event.getMapLayer()._layerType === "STATS")
				this._visibilityOn();
		},

		/**
		 * @method MapModulePlugin_MapLayerVisibilityRequest
		 * refreshes checkbox state based on visibility
		 */
		'MapLayerVisibilityChangedEvent' : function(event) {
			// Hide Classify dialog
			if (event.getMapLayer()._layerType === "STATS") {

				var blnVisible = event.getMapLayer().isVisible();
				if (blnVisible) {
					this._visibilityOn();
				} else {
					this._visibilityOff();
				}
			}

		},

		/**
		 * @method AfterMapMoveEvent
		 * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
		 *
		 * Adds the layer to selection
		 */
		'AfterMapMoveEvent' : function(event) {
			// setup initial state here since we are using selected layers to create ui
			// and plugin is started before any layers have been added
		
		},
		/**
		 * @method SotkadataChangedEvent
		 * @param {MapStats.SotkadataChangedEvent} event
		 *
		 * Creates classification of stats column data and shows it on geostats legend html
		 */
		'MapStats.SotkadataChangedEvent' : function(event) {
			// Create a new classification for thematic data, if selected
			// thematic data column is changed in (ManageStatsOut)-grid
			// stats Oskari layer, which send the event
			this._layer = event.getLayer();
			//params eg. CUL_COL:"indicator..." , VIS_NAME: "ows:kunnat2013", VIS_ATTR: "kuntakoodi", VIS_CODES: munArray, COL_VALUES: statArray
			this._params = event.getParams();
			// Classify data
			this.classifyData();

		}
	},

	/**
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded
	 * if not.
	 */
	onEvent : function(event) {
		return this.eventHandlers[event.getName()].apply(this, [event]);
	},
	/**
	 * Classify Sotka indicator column data
	 *
	 * @param event  Data sent by 'MapStats.SotkadataChangedEvent' (eg. in  ManageStatsOut.js)
	 */
	classifyData : function() {
		// return, if no old data
		if (!this._layer)
			return;
		// Current Oskari layer
		var layer = this._layer;
		//params eg. CUL_COL:"indicator..." , VIS_NAME: "ows:kunnat2013", VIS_ATTR: "kuntakoodi", VIS_CODES: munArray, COL_VALUES: statArray
		var params = this._params;
		// Current selected stats grid column
		var sortcol = params.CUR_COL;
		var strings = [];
		var check = false;
		var limits = [];
		var i, k;
		//Check selected column - only data columns are handled
		if (sortcol.field == 'municipality' || sortcol.field == 'code')
			return;

		// Get classification method
		var method = this.element.find('.classificationMethod').find('.method').val();
		// Get class count
		var classes = Number(this.element.find('.classificationMethod').find('.classCount').find('#amount').val());

		var gcol_data = params.COL_VALUES;
		gcol_data = gcol_data.slice(0);
		var codes = params.VIS_CODES;
		// Limits
		var gstats = new geostats(gcol_data);
		
		var col_data = params.COL_VALUES;

		if (method == 1)
			limits = gstats.getJenks(classes);
		if (method == 2)
			limits = gstats.getQuantile(classes);
		if (method == 3)
			limits = gstats.getEqInterval(classes);

		// Put municipality codes  in range limits
		for ( i = 0; i < classes; i++)
			strings[i] = [];
		for ( k = 0; k < col_data.length; k++) {

			for ( i = 0; i < strings.length; i++) {
				if (parseFloat(col_data[k]) >= limits[i] && parseFloat(col_data[k]) <= limits[i + 1]) {
					strings[i].push(codes[k]);
					check = true;
					break;
				}
				// a special case for when there's only one child in the last class (the low limit and up limit are the same)
				if (parseFloat(col_data[k]) == limits[i] && parseFloat(col_data[k]) == limits[i + 1]) {
					strings[i].push(codes[k]);
					check = true;
					break;
				}

			}
			if (check) {
				check = false;
				continue;
			}
			strings[strings.length - 1].push(codes[k]);
		}

		var tmpArr = [];

		for ( i = 0; i < strings.length; i++)
			tmpArr.push(strings[i].join(","));
		var classString = tmpArr.join("|");

		var colors = this.colorsets[this.colorsetIndex][classes - 3];

		var colorArr = colors.split(",");

		this.currentColor = '#' + colorArr[0];
		/*document.getElementById("mover").style.backgroundColor = currentColor;*/

		for ( i = 0; i < colorArr.length; i++)
			colorArr[i] = '#' + colorArr[i];
		gstats.setColors(colorArr);

		var colors = colors.replace(/,/g, '|');
		var sandbox = this._sandbox;
		var eventBuilder = sandbox.getEventBuilder('MapStats.StatsVisualizationChangeEvent');
		if (eventBuilder) {
			var event = eventBuilder(layer, {
				VIS_ID : -1,
				VIS_NAME : params.VIS_NAME,
				VIS_ATTR : params.VIS_ATTR,
				VIS_CLASSES : classString,
				VIS_COLORS : "choro:" + colors
			});
			sandbox.notifyAll(event);
		}

		var legendRounder = function(i) {
			if (i % 1 === 0)
				return i;
			else
				return (Math.round(i * 10) / 10);
		};

		var colortab = gstats.getHtmlLegend(null, sortcol.name, true, legendRounder);
		var classify = this.element.find('.classificationMethod');
		classify.find('.block').remove();
		var block = jQuery('<div class="block"></div>');
		block.append(colortab);
		classify.append(block);

		// Show legend in content
		this.element.find('div.content').show();

	},

	/**
	 * @method  _createUI
	 * Creates classification UI (method select, class count, colors)

	 * @private
	 */
	_createUI : function() {
		var me = this;
		if (!this.element) {
			this.element = this.classify_temp.clone();
		}
		// Classify html header
		var header = this.element.find('div.classheader');
		header.append(this._locale.classify.classify);

		// Content HTML / Method select HTML
		var content = me.element.find('div.content');
		var classify = jQuery('<div class="classificationMethod"><br>' + this._locale.classify.classifymethod + '<br><select class="method"></select><br></div>');
		var sel = classify.find('select');

		var opt = jQuery('<option value="' + "1" + '">' + this._locale.classify.jenks + '</option>');
		sel.append(opt);
		var opt = jQuery('<option value="' + "2" + '">' + this._locale.classify.eqinterval + '</option>');
		sel.append(opt);
		var opt = jQuery('<option value="' + "3" + '">' + this._locale.classify.quantile + '</option>');
		sel.append(opt);
		sel.change(function(e) {
			// Classify current columns, if any
			me.classifyData();
		});
		// Content HTML / class count input HTML
		//var classcnt = jQuery('<div class="classCount">' + this._locale.classify.classes + ' <input type="text" id="spinner" value="6" /></div>');
		var classcnt = jQuery('<div class="classCount">' + this._locale.classify.classes + ' <input type="text" id="amount" readonly="readonly" value="5" /><div id="slider-range-max"></div>');
		var slider = classcnt.find('#slider-range-max').slider({
			range : "min",
			min : 3,
			max : 9,
			value : 5,
			slide : function(event, ui) {
				jQuery('#amount').val(ui.value);
				// Classify again
				me.classifyData();
			}
		});

		classify.append(classcnt);
		content.append(classify);
		// Toggle content HTML
		header.click(function() {
			jQuery('div.content').animate({
				height : 'toggle'
			}, 500);

		});

		// get div where the map is rendered from openlayers
		var parentContainer = jQuery(this._map.div);

		// add always as first plugin
		var existingPlugins = parentContainer.find('div');
		if (!existingPlugins || existingPlugins.length == 0) {
			// no existing plugins -> just put it there
			parentContainer.append(this.element);
		} else {
			// put in front of existing plugins
			existingPlugins.first().before(this.element);
		}

		// Hide content
		this.element.find('div.content').hide();
		// Hide Classify dialog
		this._visibilityOff();

	},
	setColors : function() {
		var colorsjson = [["ffeda0,feb24c,f03b20", "ffffb2,fecc5c,fd8d3c,e31a1c", "ffffb2,fecc5c,fd8d3c,f03b20,bd0026", "ffffb2,fed976,feb24c,fd8d3c,f03b20,bd0026", "ffffb2,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,b10026", "ffffcc,ffeda0,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,b10026", "ffffcc,ffeda0,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,bd0026,800026"], ["deebf7,9ecae1,3182bd", "eff3ff,bdd7e7,6baed6,2171b5", "eff3ff,bdd7e7,6baed6,3182bd,08519c", "eff3ff,c6dbef,9ecae1,6baed6,3182bd,08519c", "eff3ff,c6dbef,9ecae1,6baed6,4292c6,2171b5,084594", "f7fbff,deebf7,c6dbef,9ecae1,6baed6,4292c6,2171b5,084594", "f7fbff,deebf7,c6dbef,9ecae1,6baed6,4292c6,2171b5,08519c,08306b"], ["e5f5f9,99d8c9,2ca25f", "edf8fb,b2e2e2,66c2a4,238b45", "edf8fb,b2e2e2,66c2a4,2ca25f,006d2c", "edf8fb,ccece6,99d8c9,66c2a4,2ca25f,006d2c", "edf8fb,ccece6,99d8c9,66c2a4,41ae76,238b45,005824", "f7fcfd,e5f5f9,ccece6,99d8c9,66c2a4,41ae76,238b45,005824", "f7fcfd,e5f5f9,ccece6,99d8c9,66c2a4,41ae76,238b45,006d2c,00441b"], ["e0ecf4,9ebcda,8856a7", "edf8fb,b3cde3,8c96c6,88419d", "edf8fb,b3cde3,8c96c6,8856a7,810f7c", "edf8fb,bfd3e6,9ebcda,8c96c6,8856a7,810f7c", "edf8fb,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,6e016b", "f7fcfd,e0ecf4,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,6e016b", "f7fcfd,e0ecf4,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,810f7c,4d004b"], ["e0f3db,a8ddb5,43a2ca", "f0f9e8,bae4bc,7bccc4,2b8cbe", "f0f9e8,bae4bc,7bccc4,43a2ca,0868ac", "f0f9e8,ccebc5,a8ddb5,7bccc4,43a2ca,0868ac", "f0f9e8,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,08589e", "f7fcf0,e0f3db,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,08589e", "f7fcf0,e0f3db,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,0868ac,084081"], ["e5f5e0,a1d99b,31a354", "edf8e9,bae4b3,74c476,238b45", "edf8e9,bae4b3,74c476,31a354,006d2c", "edf8e9,c7e9c0,a1d99b,74c476,31a354,006d2c", "edf8e9,c7e9c0,a1d99b,74c476,41ab5d,238b45,005a32", "f7fcf5,e5f5e0,c7e9c0,a1d99b,74c476,41ab5d,238b45,005a32", "f7fcf5,e5f5e0,c7e9c0,a1d99b,74c476,41ab5d,238b45,006d2c,00441b"], ["f0f0f0,bdbdbd,636363", "f7f7f7,cccccc,969696,525252", "f7f7f7,cccccc,969696,636363,252525", "f7f7f7,d9d9d9,bdbdbd,969696,636363,252525", "f7f7f7,d9d9d9,bdbdbd,969696,737373,525252,252525", "ffffff,f0f0f0,d9d9d9,bdbdbd,969696,737373,525252,252525", "ffffff,f0f0f0,d9d9d9,bdbdbd,969696,737373,525252,252525,000000"], ["fee6ce,fdae6b,e6550d", "feedde,fdbe85,fd8d3c,d94701", "feedde,fdbe85,fd8d3c,e6550d,a63603", "feedde,fdd0a2,fdae6b,fd8d3c,e6550d,a63603", "feedde,fdd0a2,fdae6b,fd8d3c,f16913,d94801,8c2d04", "fff5eb,fee6ce,fdd0a2,fdae6b,fd8d3c,f16913,d94801,8c2d04", "fff5eb,fee6ce,fdd0a2,fdae6b,fd8d3c,f16913,d94801,a63603,7f2704"], ["fee8c8,fdbb84,e34a33", "fef0d9,fdcc8a,fc8d59,d7301f", "fef0d9,fdcc8a,fc8d59,e34a33,b30000", "fef0d9,fdd49e,fdbb84,fc8d59,e34a33,b30000", "fef0d9,fdd49e,fdbb84,fc8d59,ef6548,d7301f,990000", "fff7ec,fee8c8,fdd49e,fdbb84,fc8d59,ef6548,d7301f,990000", "fff7ec,fee8c8,fdd49e,fdbb84,fc8d59,ef6548,d7301f,b30000,7f0000"], ["ece7f2,a6bddb,2b8cbe", "f1eef6,bdc9e1,74a9cf,0570b0", "f1eef6,bdc9e1,74a9cf,2b8cbe,045a8d", "f1eef6,d0d1e6,a6bddb,74a9cf,2b8cbe,045a8d", "f1eef6,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,034e7b", "fff7fb,ece7f2,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,034e7b", "fff7fb,ece7f2,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,045a8d,023858"], ["ece2f0,a6bddb,1c9099", "f6eff7,bdc9e1,67a9cf,02818a", "f6eff7,bdc9e1,67a9cf,1c9099,016c59", "f6eff7,d0d1e6,a6bddb,67a9cf,1c9099,016c59", "f6eff7,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016450", "fff7fb,ece2f0,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016450", "fff7fb,ece2f0,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016c59,014636"], ["e7e1ef,c994c7,dd1c77", "f1eef6,d7b5d8,df65b0,ce1256", "f1eef6,d7b5d8,df65b0,dd1c77,980043", "f1eef6,d4b9da,c994c7,df65b0,dd1c77,980043", "f1eef6,d4b9da,c994c7,df65b0,e7298a,ce1256,91003f", "f7f4f9,e7e1ef,d4b9da,c994c7,df65b0,e7298a,ce1256,91003f", "f7f4f9,e7e1ef,d4b9da,c994c7,df65b0,e7298a,ce1256,980043,67001f"], ["efedf5,bcbddc,756bb1", "f2f0f7,cbc9e2,9e9ac8,6a51a3", "f2f0f7,cbc9e2,9e9ac8,756bb1,54278f", "f2f0f7,dadaeb,bcbddc,9e9ac8,756bb1,54278f", "f2f0f7,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,4a1486", "fcfbfd,efedf5,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,4a1486", "fcfbfd,efedf5,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,54278f,3f007d"], ["fde0dd,fa9fb5,c51b8a", "feebe2,fbb4b9,f768a1,ae017e", "feebe2,fbb4b9,f768a1,c51b8a,7a0177", "feebe2,fcc5c0,fa9fb5,f768a1,c51b8a,7a0177", "feebe2,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177", "fff7f3,fde0dd,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177", "fff7f3,fde0dd,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177,49006a"], ["fee0d2,fc9272,de2d26", "fee5d9,fcae91,fb6a4a,cb181d", "fee5d9,fcae91,fb6a4a,de2d26,a50f15", "fee5d9,fcbba1,fc9272,fb6a4a,de2d26,a50f15", "fee5d9,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,99000d", "fff5f0,fee0d2,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,99000d", "fff5f0,fee0d2,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,a50f15,67000d"], ["f7fcb9,addd8e,31a354", "ffffcc,c2e699,78c679,238443", "ffffcc,c2e699,78c679,31a354,006837", "ffffcc,d9f0a3,addd8e,78c679,31a354,006837", "ffffcc,d9f0a3,addd8e,78c679,41ab5d,238443,005a32", "ffffe5,f7fcb9,d9f0a3,addd8e,78c679,41ab5d,238443,005a32", "ffffe5,f7fcb9,d9f0a3,addd8e,78c679,41ab5d,238443,006837,004529"], ["edf8b1,7fcdbb,2c7fb8", "ffffcc,a1dab4,41b6c4,225ea8", "ffffcc,a1dab4,41b6c4,2c7fb8,253494", "ffffcc,c7e9b4,7fcdbb,41b6c4,2c7fb8,253494", "ffffcc,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,0c2c84", "ffffd9,edf8b1,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,0c2c84", "ffffd9,edf8b1,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,253494,081d58"], ["fff7bc,fec44f,d95f0e", "ffffd4,fed98e,fe9929,cc4c02", "ffffd4,fed98e,fe9929,d95f0e,993404", "ffffd4,fee391,fec44f,fe9929,d95f0e,993404", "ffffd4,fee391,fec44f,fe9929,ec7014,cc4c02,8c2d04", "ffffe5,fff7bc,fee391,fec44f,fe9929,ec7014,cc4c02,8c2d04", "ffffe5,fff7bc,fee391,fec44f,fe9929,ec7014,cc4c02,993404,662506"]];
		this.colorsets = colorsjson;
		//JSON.parse(colorsjson);
		this.updateColormenu();
	},
	updateColormenu : function() {

	},
	/**
	 * @method  visibilyOn
	 * Classify dialog visibility on

	 * @private
	 */
	_visibilityOn : function() {
		this.element.show();
	}, /**
	 * @method  visibilyOff
	 * Classify dialog off

	 * @private
	 */
	_visibilityOff : function() {
		this.element.hide();
	}
}, {
	/**
	 * @property {String[]} protocol array of superclasses as {String}
	 * @static
	 */
	'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
