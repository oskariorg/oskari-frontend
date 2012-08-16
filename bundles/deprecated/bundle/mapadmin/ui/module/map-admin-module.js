/**
 * @class Oskari.mapframework.ui.module.mapfull.DefaultMapAdminModule
 * 
 * Class to enable saving map state. Replaces previous Liferay implementation.
 * 
 * 
 * WILL be modified to support bundle/plugin/settings.
 * 
 * @todo remove hack which prevents Ext Grid crash on some AfterMapMove events
 *       immediately after startup - fix after ExtJS 4.1...
 * 
 */
Oskari.clazz.define(
		'Oskari.mapframework.ui.module.mapfull.DefaultMapAdminModule',
		function(config) {

			this._multipleActionsRunningText;

			this._tooltip;

			this._sandbox = null;

			this._items = {};

			this._lang = null;

			this._locale = null;

			this._opts = {};

			this.url = config.ajaxUrl;//'storeAdminConfigOptions.json';
			
			this.portletId = config.portletId;

		}, {
			__name : "MapAdminModule",
			getName : function() {
				return this.__name;
			},

			/*
			 * @method init
			 * 
			 * called from framework to build UI
			 * 
			 */
			init : function(sandbox) {
				var me = this;
				me._sandbox = sandbox;

				me.setLocale(sandbox.getLanguage());

				sandbox.printDebug("Initializing map position module...");

				/**
				 * 
				 */

				me.createModels();

				/**
				 * 
				 */
				me.stores = {};

				/* temp */
				var conf = Oskari.$("startup").mapConfigurations;
				
				var configData = me.createMapOptionsStoreData(conf);

				me.updateMapOptionsFromStartup(this._opts, conf);

				me.updateMapOptionsFromState(this._opts);

				me.createStores(configData);

				var panel = this.createPanel();
				me.panel = panel;

				return panel;
			},

			/**
			 * @method setLocale
			 * 
			 * setup locale for ui
			 */
			setLocale : function(lang) {
				this._lang = lang;
				this._locale = this._locales['view'][this._lang];
			},

			/**
			 * @property _locales
			 * 
			 * some localized texts
			 * 
			 */
			_locales : {
				'view' : {
					'fi' : {
						'title' : 'Asetukset',
						'mapadmin' : 'Kartan asetukset',
						'save' : 'Tallenna',
						'revert' : 'Peru',
						'saveStateSuccess' : 'Tallennus onnistui',
						'saveStateFailure' : 'Tallennus ep\u00E4onnistui'
					},
					'sv' : {
						'title' : '???',
						'mapadmin' : '???',
						'save' : '???',
						'revert' : '???',
						'saveStateSuccess' : '???',
						'saveStateFailure' : '???'
					},
					'en' : {
						'title' : 'Settings',
						'mapadmin' : 'Map Settings',
						'save' : 'Save',
						'revert' : 'Revert',
						'saveStateSuccess' : 'Saved',
						'saveStateFailure' : 'Failed'

					}
				},
				'settings' : {
					'fi' : {
						'mapLayers' : 'Karttatasot',
						'index_map' : 'N\u00E4yt\u00E4 indeksikartta',
						'pan' : 'Salli kartan liikuttelu',
						'zoomBar' : 'N\u00E4yt\u00E4 kartan zoomauspalkki',
						'north' : 'N',
						'east' : 'E',
						'width' : 'Leveys',
                        'height' : 'Korkeus',
						'zoomLevel' : 'Zoom'
					},
					'sv' : {
						'mapLayers' : '???',
						'index_map' : '???',
						'pan' : '???',
						'zoomBar' : '???',
						'north' : 'N',
						'east' : 'E',
						'width' : 'Leveys',
                        'height' : 'Korkeus',
                        'zoomLevel' : 'Zoom'

					},

					'en' : {
						'mapLayers' : 'Layer Selector',
						'index_map' : 'Show Index Map',
						'pan' : 'Allow Map Pan',
						'zoomBar' : 'Zoom Bar',
						'north' : 'N',
						'east' : 'E',
						'width' : 'Leveys',
                        'height' : 'Korkeus',
                        'zoomLevel' : 'Zoom'

					}

				}

			},

			/**
			 * @method start
			 * 
			 * starts the modules listeners
			 */
			start : function(sandbox) {
				sandbox.printDebug("Starting " + this.getName());
				/*
				 * events
				 */
				for (p in this.eventHandlers) {
					sandbox.registerForEventByName(this, p);
				}
			},

			/**
			 * @method stop stops modules listeners
			 * 
			 */
			stop : function(sandbox) {
				for (p in this.eventHandlers) {
					sandbox.unregisterFromEventByName(this, p);
				}
			},

			/**
			 * @method getMapOptions
			 * 
			 * returns property with up to date information on map state
			 * 
			 */
			getMapOptions : function() {
				return this._opts;
			},

			/**
			 * @method createModels
			 * 
			 * creates Ext models used by this UI
			 */
			createModels : function() {
				var xt = Ext;
				if (!xt.get('AdminConfigOption'))
					xt.define('AdminConfigOption', {
						extend : 'Ext.data.Model',
						idProperty : 'option',
						fields : [ {

							name : 'optionGroup'
						}, {

							name : 'option'
						}, {
							name : 'fi'
						}, {
							name : 'sv'
						}, {
							name : 'en'
						}, {
							name : 'value'
						}, {
							name : 'checked',
							type : 'boolean'
						} ]
					});
			},

			/**
			 * @method getStore
			 */
			getStore : function(key) {
				return this.stores[key];
			},

			/*
			 * @method createStores
			 * 
			 * creates Ext stores used by this UI
			 */
			createStores : function(configData) {

				/*
				 * N\u00E4yt\u00E4 kartan mittakaavajana Salli kartan liikuttelu
				 * N\u00E4yt\u00E4 kartan zoomauspalkki N\u00E4yt\u00E4 kartan
				 * kontrollit N\u00E4yt\u00E4 indeksikartta N\u00E4yt\u00E4
				 * hiiren koordinaatit ja mittausty�kalujen tulokset
				 * N\u00E4yt\u00E4vasen ja oikea paneeli footer : true, scale :
				 * 3, index_map : true, height : 600, plane_list : true,
				 * map_function : true, width : 1000, zoom_bar : true, north :
				 * "6672492", east : "385789", scala_bar : true, pan : true
				 */
//				var me = this;
//				var loc = me._locale;
//				var locs = me._locales['settings'];

				var adminConfigStore = Ext.create('Ext.data.ArrayStore', {
					model : 'AdminConfigOption',
					data : configData
				});

				this.stores['AdminConfigOption'] = adminConfigStore;
			},

			/**
			 * @method createPanel
			 * 
			 * creates Ext UI
			 */
			createPanel : function() {
				var xt = Ext;
				var me = this;
				var loc = me._locale;
//				var locs = me._locales['settings'];

				var store = me.getStore('AdminConfigOption');

				var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				});
				
				var grid = Ext.create('Ext.grid.Panel', {
					store : store,
					height : 384,
					columns : [ {
						xtype : 'checkcolumn',
						header : '',
						dataIndex : 'checked',
						width : 55
					}, {
						text : "Fi",
						width : 200,
						dataIndex : 'fi',
						flex : 1,
						hidden : me._lang != 'fi'
					}, {
						text : "Sv",
						width : 200,
						dataIndex : 'sv',
						flex : 1,
						hidden : me._lang != 'sv'
					}, {
						text : "En",
						width : 200,
						dataIndex : 'en',
						flex : 1,
						hidden : me._lang != 'en'
					}, {
						text : "Option",
						width : 200,
						dataIndex : 'option',
						flex : 2,
						hidden : true
					}, {
						text : "Value",
						dataIndex : 'value',
						flex : 1,
						hidden : false,
						field: {
		                    type: 'textfield'
		                }
					} ],
					columnLines : true,
					selModel : {
						selType : 'cellmodel'
					},
					plugins : [ cellEditing ]
				});

				var form = new xt.create('Ext.panel.Panel', {
					title : loc['mapadmin'],
					labelWidth : 75,
					frame : false,
					border: false,
					bodyStyle : 'padding:5px 5px 0',

					layout : 'fit',
					/*defaults : {
						bodyPadding : 4
					},*/
					items : [ grid ],
					buttons : [ {
						text : me._locale['save'],
						handler : function() {
							me.saveState();
						}
					}, {
						text : me._locale['revert'],
						handler : function() {
							me.revertState();
						}
					} ]
				});

				me.form = form;
				me._items.form = form;
				me._items.grid = grid;

				return form;
			},

			/**
			 * @method saveState
			 * 
			 */
			saveState : function() {
				var me = this;
				var loc = me._locale;
//				var locs = me._locales['settings'];
				var xt = Ext;
//				var store = this.getStore('AdminConfigOption');

				var opts = this._opts;

				this.updateMapOptionsFromState(opts);
				this.updateMapOptionsFromUI(opts);
				this.updateOptionsToUserInterface(opts);

				opts['portletId'] = this.portletId;
				
				xt.MessageBox.show( {
					title : loc['title'],
					msg : '...',
					progressText : '...',
					width : 300,
					progress : true,
					closable : false,
					icon : 'logo',
					modal : true
				});

				xt.Ajax.request( {
					url : me.url,
					params : opts,
					//method :'GET',
					success : function(response) {
						xt.MessageBox.hide();
//						var text = response.responseText;
						// process server response here
					xt.Msg.alert(loc['title'], loc['saveStateSuccess']);
				},
				failure : function() {
					xt.MessageBox.hide();
					xt.Msg.alert(loc['title'], loc['saveStateFailure']);
				}
				});

			},

			revertState : function() {
				alert('NYI');
			},

			/**
			 * @method updateOptionsToUserInterface
			 * 
			 * moves state to UI control (grid)
			 */
			updateOptionsToUserInterface : function(opts) {

				var me = this;
				var sandbox = me._sandbox;
				var map = sandbox.getMap();
				var zoom = map.getZoom();
				var lat = map.getX();
				var lon = map.getY();

				var store = this.getStore('AdminConfigOption');

				var eastOpt = store.findRecord('option', 'east');
				var northOpt = store.findRecord('option', 'north');
				var zoomOpt = store.findRecord('option', 'zoomLevel');
				var layersOpt = store.findRecord('option', 'mapLayers');

				/*
				 * ADD to opts based on current selection model state
				 */

				eastOpt.set('value', lat);
				northOpt.set('value', lon);
				zoomOpt.set('value', zoom);
				layersOpt.set('value', opts.mapLayers);
			},

			/**
			 * @method buildOptionsFromStartup
			 * 
			 * config uses different terms compared to this implementation
			 * 
			 */
			updateMapOptionsFromStartup : function(opts, conf) {
//				var me = this;
//				var loc = me._locale;
//				var locs = me._locales['settings'];

				opts['zoomBar'] = conf.scala_bar;
				opts['indexMap'] = conf.index_map;
				opts['pan'] = conf.pan;
			},

			/**
			 * @method createMapOptionsStoreData
			 * 
			 */
			createMapOptionsStoreData : function(conf) {
				var me = this;
//				var loc = me._locale;
				var locs = me._locales['settings'];
				var optsArr = [
						[ 'map', 'mapLayers', locs['fi']['mapLayers'],
								locs['sv']['mapLayers'],
								locs['en']['mapLayers'], '', '' ],
						[ 'map', 'index_map', locs['fi']['index_map'],
								locs['sv']['index_map'],
								locs['en']['index_map'], '', conf.index_map ],
						[ 'map', 'zoomBar', locs['fi']['zoomBar'],
								locs['sv']['zoomBar'], locs['en']['zoomBar'],
								'', conf.scala_bar ],
						[ 'map', 'pan', locs['fi']['pan'], locs['sv']['pan'],
								locs['en']['pan'], '', conf.pan ],
						[ 'map', 'north', locs['fi']['north'],
								locs['sv']['north'], locs['en']['north'],
								conf.north, true ],
						[ 'map', 'east', locs['fi']['east'],
								locs['sv']['east'], locs['en']['east'],
								conf.east, true ],
						[ 'map', 'width', locs['fi']['width'],
                            locs['sv']['width'], locs['en']['width'],
                            conf.width, true ],
                        [ 'map', 'height', locs['fi']['height'],
                            locs['sv']['height'], locs['en']['height'],
                            conf.height, true ],
						[ 'map', 'zoomLevel', locs['fi']['zoomLevel'],
								locs['sv']['zoomLevel'],
								locs['en']['zoomLevel'], conf.scale, true ]

				];

				return optsArr;
			},

			/**
			 * @method buildOptions builds an option props object with info from
			 *         sandbox
			 * 
			 * copy-paste-modified from core
			 */
			updateMapOptionsFromState : function(opts) {
				var sandbox = this._sandbox;

				var map = sandbox.getMap();
				var selectedLayers = sandbox.findAllSelectedMapLayers();

				/* url encoded comma */
				var LAYER_SEPARATOR = ",";
				var ATTRIBUTE_SEPARATOR = "+";

				var zoom = map.getZoom();
				var lat = Math.round(parseInt(map.getX()));
				var lon = Math.round(parseInt(map.getY()));

				/* layers */
				var layerString = "";
				for ( var i = 0; i < selectedLayers.length; i++) {
					var layer = selectedLayers[i];

					if (layerString.length > 0) {
						layerString += LAYER_SEPARATOR;
					}

					var opacity = layer.getOpacity();
					var style;

					if (layer.isBaseLayer()
							|| typeof layer.getCurrentStyle != "function"
							|| layer.getCurrentStyle() == null
							|| layer.getCurrentStyle().getName() == null) {
						style = "!default!";
					} else {
						style = layer.getCurrentStyle().getName();
					}

					layerString += layer.getId() + ATTRIBUTE_SEPARATOR
							+ opacity + ATTRIBUTE_SEPARATOR + style;
				}

				/* marker visible or not? */
				var markerVisible = map.isMarkerVisible();

				/* follows naming from generated map link */
				opts['zoomLevel'] = zoom;
				opts['lat'] = lat;
				opts['lon'] = lon;
				opts['coord'] = lat + "_" + lon;
				opts['mapLayers'] = layerString;
				opts['showMarker'] = markerVisible;

				return opts;

			},

			/**
			 * @method updateMapOptionsFromUI
			 */

			updateMapOptionsFromUI : function(opts) {
				var me = this;
				var store = me.getStore('AdminConfigOption');

				var zoomBarOpt = store.findRecord('option', 'zoomBar');
				var indexMapOpt = store.findRecord('option', 'index_map');
				var panOpt = store.findRecord('option', 'pan');
				
				var widthOpt = store.findRecord('option', 'width');
				var heightOpt = store.findRecord('option', 'height');

				opts['zoomBar'] = zoomBarOpt.get('checked');
				opts['indexMap'] = indexMapOpt.get('checked');
				opts['pan'] = panOpt.get('checked');
				
				opts['width'] = widthOpt.get('value');
				opts['height'] = heightOpt.get('value');

			},

			counter : 0,

			eventHandlers : {
				/**
				 * @method AfterMapMoveEvent
				 * 
				 * called after user's stopped moving the map
				 */
				"AfterMapMoveEvent" : function(event) {
					this.counter++;
					if (this.counter < 3)
						return;

					var opts = this._opts;

					this.updateMapOptionsFromState(opts);
					this.updateMapOptionsFromUI(opts);
					this.updateOptionsToUserInterface(opts);

				},
				'AfterMapLayerAddEvent' : function(event) {
					var opts = this._opts;

					this.updateMapOptionsFromState(opts);
					this.updateMapOptionsFromUI(opts);
					this.updateOptionsToUserInterface(opts);
				},
				'AfterMapLayerRemoveEvent' : function(event) {
					var opts = this._opts;

					this.updateMapOptionsFromState(opts);
					this.updateMapOptionsFromUI(opts);
					this.updateOptionsToUserInterface(opts);
				},
				'AfterChangeMapLayerOpacityEvent' : function(event) {
					var opts = this._opts;

					this.updateMapOptionsFromState(opts);
					this.updateMapOptionsFromUI(opts);
					this.updateOptionsToUserInterface(opts);
				},
				'AfterChangeMapLayerStyleEvent' : function(event) {
					var opts = this._opts;

					this.updateMapOptionsFromState(opts);
					this.updateMapOptionsFromUI(opts);
					this.updateOptionsToUserInterface(opts);
				}
			},

			onEvent : function(event) {
				var handler = this.eventHandlers[event.getName()];

				if (!handler)
					return;

				return handler.apply(this, [ event ]);
			}

		}, {
			'protocol' : [ 'Oskari.mapframework.module.Module' ]
		});

/* Inheritance */
