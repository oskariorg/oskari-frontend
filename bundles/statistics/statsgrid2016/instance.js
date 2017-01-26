/**
 * @class Oskari.statistics.statsgrid.StatsGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define(
	'Oskari.statistics.statsgrid.StatsGridBundleInstance',
	/**
	 * @static constructor function
	 */

	function () {
		// these will be used for this.conf if nothing else is specified (handled by DefaultExtension)
		this.defaultConf = {
			name: 'StatsGrid',
			sandbox: 'sandbox',
			stateful: true,
			tileClazz: 'Oskari.userinterface.extension.DefaultTile',
			flyoutClazz: 'Oskari.statistics.statsgrid.Flyout'
		};
		this.visible = false;

		this._templates= {
			publishedToggleButtons: jQuery('<div class="statsgrid-published-toggle-buttons"><div class="map"></div><div class="table active"></div>')
		};

		this.log = Oskari.log('Oskari.statistics.statsgrid.StatsGridBundleInstance');

		this._publishedComponents = {
			panelClassification: null
		};

		this._lastRenderMode = null;
	}, {
		afterStart: function (sandbox) {
			var me = this;

			// create the StatisticsService for handling ajax calls and common functionality.
			var statsService = Oskari.clazz.create('Oskari.statistics.statsgrid.StatisticsService', sandbox);
			sandbox.registerService(statsService);
			me.statsService = statsService;

			var conf = this.getConfiguration() || {};
			statsService.addDatasource(conf.sources);

			this.getTile().setEnabled(this.hasData());
			if(this.state) {
				this.setState(this.state);
			}

			var tile = this.getTile();
			var cel = tile.container;

			if (!cel.hasClass('statsgrid')) {
				cel.addClass('statsgrid');
			}

			if(typeof conf.showLegend === 'boolean' && conf.showLegend && me.hasPublished()) {
				me.renderPublishedLegend(conf);
			}

			if(me.hasPublished() && conf.grid) {
				me.renderToggleButtons();
				me.getFlyout().move(0,0);
			}
			this.__setupLayerTools();
		},
		renderToggleButtons: function(remove){
			var me = this;
			if(remove){
				jQuery('.statsgrid-published-toggle-buttons').remove();
				return;
			}
			var toggleButtons = me._templates.publishedToggleButtons.clone();
			var map = toggleButtons.find('.map');
			var table = toggleButtons.find('.table');
			table.addClass('active');

			map.attr('title', me.getLocalization().published.showMap);
			table.attr('title', me.getLocalization().published.showTable);

			map.bind('click', function(){
				if(!map.hasClass('active')) {
					table.removeClass('active');
					map.addClass('active');
					me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest',[me, 'close', 'StatsGrid']);
				}
			});

			table.bind('click', function(){
				if(!table.hasClass('active')) {
					map.removeClass('active');
					table.addClass('active');
					me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest',[me, 'detach', 'StatsGrid']);
				}
			});

			map.trigger('click');

			jQuery('body').append(toggleButtons);
		},
		hasPublished: function() {
			return 'geoportal' !== this._getRenderMode();
		},
		eventHandlers: {
			'StatsGrid.IndicatorEvent' : function(evt) {
				if(!this.statsService) {
					return;
				}

				this.statsService.notifyOskariEvent(evt);

				var state = this.statsService.getStateService();
				var activeIndicator = state.getActiveIndicator();
				var hash = state.getHash(evt.getDatasource(), evt.getIndicator(), evt.getSelections());
				if((!this.state || (this.state && !this.state.active)) && !evt.isRemoved() && !activeIndicator) {
					state.setActiveIndicator(hash);
				} else if((!this.state || (this.state && !this.state.active)) && !evt.isRemoved() && activeIndicator) {
					state.setActiveIndicator(activeIndicator);
				} else if(evt.isRemoved() && this.state && this.state.active === hash) {
					delete this.state.active;
				}

			},
			'StatsGrid.RegionsetChangedEvent' : function(evt) {
				this.statsService.notifyOskariEvent(evt);
			},
			'StatsGrid.RegionSelectedEvent' : function(evt) {
				this.statsService.notifyOskariEvent(evt);
			},
			'StatsGrid.ActiveIndicatorChangedEvent' : function(evt) {
				this.statsService.notifyOskariEvent(evt);
			},
			'StatsGrid.ClassificationChangedEvent': function(evt) {
				this.statsService.notifyOskariEvent(evt);
			},
			'StatsGrid.DatasourceEvent': function(evt) {
				this.statsService.notifyOskariEvent(evt);
			},
			'UIChangeEvent' : function() {
				// close/tear down tge ui when receiving the event
				this.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
			},
			/**
			 * @method userinterface.ExtensionUpdatedEvent
			 */
			'userinterface.ExtensionUpdatedEvent': function (event) {
				if (event.getExtension().getName() !== this.getName() || !this.hasData()) {
					// not me/no data -> do nothing
					return;
				}
				var me = this;
				var wasClosed = event.getViewState() === 'close';
				this.visible = !wasClosed;
				var renderMode = this._getRenderMode();
				var conf = this.__determineConfig(renderMode);
				if(wasClosed){
					this.getFlyout().handleClose();
				}
				else if(conf.grid !== false && this._lastRenderMode !== renderMode) {
					this.getFlyout().render(conf);
					this._lastRenderMode = renderMode;
				}

				if(conf.showLegend === true && 'geoportal' !== renderMode) {
					me.renderPublishedLegend(conf);
				}
			},
			/**
			 * @method MapLayerEvent
			 * @param {Oskari.mapframework.event.common.MapLayerEvent} event
			 *
			 */
			MapLayerEvent: function (event) {
				// Enable tile when stats layer is available
				this.getTile().setEnabled(this.hasData());
				// setup tools for new layers
				if(event.getOperation() !== 'add')  {
					// only handle add layer
					return;
				}
				if(event.getLayerId()) {
					this.__addTool(event.getLayerId());
				}
				else {
					// ajax call for all layers
					this.__setupLayerTools();
				}

			}
		},
		__determineConfig : function(renderMode) {
			var conf = this.getConfiguration();

			var defaultConf = {
				search: true,
				extraFeatures: true,
				areaSelection: true,
				mouseEarLegend: true,
				showLegend: true,
				allowClassification: true
			};
			if('publisher' === renderMode) {
				conf.search = false;
				conf.extraFeatures = false;
				conf.areaSelection = false;
				conf.mouseEarLegend = false;
				conf.showLegend = true;
				conf.allowClassification = true;
			} else if('geoportal' === renderMode) {
				conf.search = true;
				conf.extraFeatures = true;
				conf.areaSelection = true;
				conf.mouseEarLegend = true;
				conf.showLegend = false;
				conf.allowClassification = true;
			}
			return jQuery.extend({}, defaultConf, conf);
		},
		_getRenderMode : function() {
			var map = jQuery('#contentMap');
			if(map.hasClass('mapPublishMode')) {
				return 'publisher';
			} else if(!map.hasClass('published')) {
				return 'geoportal';
			}
			return 'embedded';
		},

		hasData: function () {
			return this.statsService.getDatasource().length && this.statsService.getRegionsets().length;
		},

		/**
		 * Fetches reference to the map layer service
		 * @return {Oskari.mapframework.service.MapLayerService}
		 */
		getLayerService : function() {
			return this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
		},
		/**
		 * Adds the Feature data tool for layer
		 * @param  {String| Number} layerId layer to process
		 * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
		 */
		__addTool : function(layerModel, suppressEvent) {
			var me = this;
			var service = this.getLayerService();
			if(typeof layerModel !== 'object') {
				// detect layerId and replace with the corresponding layerModel
				layerModel = service.findMapLayer(layerModel);
			}
			if(!layerModel || !layerModel.isLayerOfType('STATS')) {
				return;
			}

			// add feature data tool for layer
			var layerLoc = this.getLocalization('layertools') || {},
				label = layerLoc.title || 'Thematic maps',
				tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
			tool.setName("table_icon");
			tool.setTitle(label);
			tool.setTooltip(layerLoc.tooltip || label);
			tool.setCallback(function () {
				me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me, 'attach']);
			});

			service.addToolForLayer(layerModel, tool, suppressEvent);
		},
		/**
		 * Adds tools for all layers
		 */
		__setupLayerTools : function() {
			var me = this;
			// add tools for feature data layers
			var service = this.getLayerService();
			var layers = service.getAllLayers();
			_.each(layers, function(layer) {
				me.__addTool(layer, true);
			});
			// update all layers at once since we suppressed individual events
			var event = me.sandbox.getEventBuilder('MapLayerEvent')(null, 'tool');
			me.sandbox.notifyAll(event);
		},
		/**
		 * @method  @public updatePublishedFlyoutTitle update published map legend
		 * @param  {Object} ind indicator
		 * @param {Object} config config
		 */
		updatePublishedFlyoutTitle: function (ind, config){
			var me = this;
			var sb = me.getSandbox();
			var service = sb.getService('Oskari.statistics.statsgrid.StatisticsService');
			if(!service) {
				// not available yet
				return;
			}
			var state = service.getStateService();

			service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {

				var getSourceLink = function(currentHash){
					var indicators = state.getIndicators();
					var currentIndex = state.getIndicatorIndex(currentHash);
					var nextIndicatorIndex = 1;
					if(currentIndex === indicators.length) {
						nextIndicatorIndex = 1;
					} else {
						nextIndicatorIndex=currentIndex + 1;
					}

					return {
						index: nextIndicatorIndex,
						handler: function(){
							var curIndex = nextIndicatorIndex-1;
							var i = indicators[curIndex];
							state.setActiveIndicator(i.hash);
						}
					};
				};

				var link = getSourceLink(ind.hash);
				var selectionsText = '';

				if(config.grid !== true || config.showLegend !== false) {
					var linkButton = '';
					if(state.indicators.length>1) {
						linkButton = '<div class="link">' + me.getLocalization().statsgrid.source + ' ' + link.index + ' >></div>';
					}
					selectionsText = service.getSelectionsText(ind, me.getLocalization().panels.newSearch, function(text){
						me.__sideTools.legend.flyout.setTitle('<div class="header">' + me.getLocalization().statsgrid.source + ' ' + state.getIndicatorIndex(ind.hash) + '</div>' +
							linkButton +
							'<div class="sourcename">' + Oskari.getLocalized(indicator.name) + text + '</div>');
					});
				}

				me.__sideTools.legend.flyout.getTitle().find('.link').unbind('click');
				me.__sideTools.legend.flyout.getTitle().find('.link').bind('click', function(){
					link.handler();
				});

			});

		},

		/**
		 * Sets the map state to one specified in the parameter. State is bundle specific, check the
		 * bundle documentation for details.
		 *
		 * @method setState
		 * @param {Object} state bundle state as JSON
		 */
		setState: function (state) {
			state = state || {};
			var service = this.statsService.getStateService();
			service.reset();
			if(state.regionset) {
				service.setRegionset(state.regionset);
			}

			if(state.indicators) {
				state.indicators.forEach(function(ind) {
					service.addIndicator(ind.ds, ind.id, ind.selections, ind.classification);
				});
			}

			if(state.active) {
				service.setActiveIndicator(state.active);
			}

			// if state says view was visible fire up the UI, otherwise close it
			var sandbox = this.getSandbox();
			var uimode = state.view ? 'attach' : 'close';
			sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, uimode]);
		},
		/**
		 * addChosenHacks Add chosen hacks to element
		 * FIXME: remove this when Oskari components have own working selection
		 * @param {Jquery.element} element
		 */
		addChosenHacks: function(element, makeOverEl){
			// Fixes chosen selection to visible when rendering chosen small height elements
			element.on('chosen:showing_dropdown', function () {

				jQuery(this).parents('div').each(function() {
					var el = jQuery(this);
					if(!el.hasClass('oskari-flyoutcontentcontainer')) {
						el.css('overflow', 'visible');
					}
				});
			});

			// Fixes chosen selection go upper when chosen element is near by window bottom
			element.on('chosen:showing_dropdown', function(event) {
				var chosen_container = jQuery(event.target).next('.chosen-container');
				var dropdown = chosen_container.find('.chosen-drop');
				var dropdown_top = dropdown.offset().top - $(window).scrollTop();
				var dropdown_height = dropdown.height();
				var viewport_height = jQuery(window).height();

				if ( dropdown_top + dropdown_height > viewport_height ) {
					chosen_container.addClass('chosen-drop-up');
				}
			});
			element.on('chosen:hiding_dropdown', function(event) {
				jQuery(event.target).next('.chosen-container').removeClass('chosen-drop-up');
			});


			if(makeOverEl) {
				element.on('chosen:showing_dropdown', function(event) {
					var chosen_container = jQuery(event.target).next('.chosen-container');
					var offset = chosen_container.offset();
					var dropdown = chosen_container.find('.chosen-drop');
					dropdown.css('position', 'fixed');
					dropdown.css('width', '300px');
					dropdown.css('top', (offset.top + chosen_container.height()) + 'px');
					dropdown.css('left', offset.left + 'px');
				});

				element.on('chosen:hiding_dropdown', function(event) {
					var chosen_container = jQuery(event.target).next('.chosen-container');

					var dropdown = chosen_container.find('.chosen-drop');
					dropdown.css('position', '');
					dropdown.css('width', '');
					dropdown.css('top', '');
					dropdown.css('left', '');
				});
			}

		},

		getState: function () {
			var me = this;
			var service = this.statsService.getStateService();
			var state = {
				indicators : [],
				regionset : service.getRegionset(),
				view :me.visible
			};
			service.getIndicators().forEach(function(ind) {
				state.indicators.push({
					ds: ind.datasource,
					id: ind.indicator,
					selections: ind.selections,
					classification: service.getClassification(ind.hash)
				});
			});
			var active = service.getActiveIndicator();
			if(active) {
				state.active = active.hash;
			}
			return state;
		},
		/**
		 * @method  @public renderPublishedLegend Render published  legend
		 */
		renderPublishedLegend: function(config){
			var me = this;

			config = config || me.getConfiguration();
			var sandbox = me.getSandbox();
			var locale = this.getLocalization();
			var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');

			if(config.showLegend) {
				config.publishedClassification = true;
				if(me.plugin) {
				   return;
				}
				var plugin = Oskari.clazz.create('Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin', me, config, locale, mapModule, sandbox);
				mapModule.registerPlugin(plugin);
				mapModule.startPlugin(plugin);
				me.plugin = plugin;
				//get the plugin order straight in mobile toolbar even for the tools coming in late
				if (Oskari.util.isMobile() && this.plugin.hasUI()) {
					mapModule.redrawPluginUIs(true);
				}
			} else if(this.plugin) {
				config.publishedClassification = false;
				mapModule.stopPlugin(me.plugin);
				me.plugin = null;
			}


			return;
		},

		/**
		 * @method  @public classificationVisible change published map classification visibility. Only call this in publisher!
		 * @param  {Boolean} visible visible or not
		 */
		classificationVisible: function(visible) {
			if(!this.plugin) {
				return;
			}
			this.plugin.setEnabled(visible);
		}

	}, {
		extend: ['Oskari.userinterface.extension.DefaultExtension']
	}
);
