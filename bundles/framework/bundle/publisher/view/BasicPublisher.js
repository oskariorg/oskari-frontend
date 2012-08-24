/**
 * @class Oskari.mapframework.bundle.publisher.view.BasicPublisher
 * Renders the "publisher" view for basic use case
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.publisher.view.BasicPublisher',

	    /**
	     * @method create called automatically on construction
	     * @static
	     * @param {Oskari.mapframework.bundle.publisher.PublisherBundleInstance} instance
	     * 		reference to component that created this view
	     * @param {Object} localization
	     *      localization data in JSON format
	     */
	    function(instance, localization) {
		var me = this;
		this.instance = instance;
		this.template = 
		    jQuery('<div class="basic_publisher">' + 
    			   '<div class="form">' + 
    			   '<div class="field">' + 
    			   '<div class="help icon-info" ' + 
    			   'title="' + localization.domain.tooltip + '" ' +
			   'helptags="portti,help,publisher,domain" ' +
			   '></div>' + 
    			   '<label for="domain">' + 
			   localization.domain.label + 
			   '</label><br clear="all" />' +
    			   '<input name="domain" placeholder="' + 
			   localization.domain.placeholder + 
			   '"/>' +
    			   '</div>' +
    			   '<div class="field">' + 
    	    		   '<div class="help icon-info" ' + 
			   'title="' + localization.name.tooltip + '" ' +
			   'helptags="portti,help,publisher,name" ' +
			   '></div>' +
    	    		   '<label for="name">' + 
			   localization.name.label + 
			   '</label><br clear="all" />' +
    	    		   '<input name="name" placeholder="' + 
			   localization.name.placeholder + 
			   '"/>' +
    			   '</div>' + 
    			   '<div class="field">' + 
    	    		   '<div class="help icon-info" ' + 
			   'title="' + localization.language.tooltip + '" ' +
			   'helptags="portti,help,publisher,language" ' +
			   '></div>' + 
    	    		   '<label for="language">' + 
			   localization.language.label + 
			   '</label><br clear="all" />' +
    	    		   '<select name="language"></select>' + 
			   '</div>' +    	    		   
    	    		   '<div class="buttons">' + 
			   '</div>' +
    			   '</div>' +
    			   '<div class="map">' + 
			   localization.preview +
    	    		   // '<div class="preview">' + '</div>' + 
    	    		   '<div class="maplocation">' + 
			   localization.location + 
			   '<div class="locationdata"></div>' + 
			   '</div>' +
    	    		   '<div class="options">' + 
			   '</div>' +
    			   '</div>' +
			   '</div>');

		this.templateHelp = 
		    jQuery('<div class="help icon-info"></div>');
		this.templateTool = 
		    jQuery('<div class="tool ">' + 
			   '<input type="checkbox"/>' + 
			   '<span></span></div>');
		this.templateSizeOptionTool = 
		    jQuery('<div class="tool ">' + 
			   '<input type="radio" name="size" />' + 
			   '<span></span></div>');
		this.templateCustomSize = 
		    jQuery('<div class="customsize">' + 
			   '<input type="text" disabled="true" name="width" ' +
			   'placeholder="' + 
			   localization.sizes.width + 
			   '"/> x ' + 
			   '<input type="text" disabled="true" ' + 
			   'name="height" placeholder="' + 
			   localization.sizes.height + 
			   '"/></div>');

		this.templateLayerRow = 
		    jQuery('<tr data-id="">' + 
			   '<td><input type="checkbox" /></td>' + 
			   '<td></td>' + 
			   '</tr>');
		this.templateUseAsDefault = 
		    jQuery('<a href="JavaScript:void(0);">' + 
			   localization.layers.useAsDefaultLayer + 
			   '</a>');
		/**
		 * @property tools
		 */
		this.tools = [{
		    id : 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
		    selected : false
		}, {
		    id : 'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
		    selected : false
		}, {
		    id : 'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
		    selected : true,
		    config : {
			location : {
			    top : '10px',
			    left : '10px'
			}
		    }
		}, {
		    id : 'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
		    selected : false
		}, {
		    id : 'Oskari.mapframework.mapmodule.GetInfoPlugin',
		    selected : true
		}]; 

		this.showLayerSelection = false;

		this.sizeOptions = [{
		    id : 'small',
		    width : 375,
		    height : 300
		}, {
		    id : 'medium',
		    width : 500,
		    height : 400,
		    selected : true // default option
		}, {
		    id : 'large',
		    width : 640,
		    height : 512
		}, {
		    id : 'custom',
		    width : 'max 1000',
		    height : 1000,
		    minWidth : 50,
		    minHeight : 20,
		    maxWidth : 1000,
		    maxHeight : 1000
		}];

		this.loc = localization;
		this.config = {
		    layers : {
			promote : [{
			    text : this.loc.layerselection.promote,
			    id : [24] // , 203
			}],
			preselect : 'base_35'
		    }
		};
		this.accordion = null;

		this.setupLayersList();

		this.defaultBaseLayer = null;
		if(this.config.layers.preselect) {
		    this.defaultBaseLayer = this.config.layers.preselect;
		}
		this.maplayerPanel = null;
		this.mainPanel = null;
		this.normalMapPlugins = [];
		this.logoPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin');
		this.latestGFI = null;
	    }, {
		/**
		 * @method render
		 * @param {jQuery} container reference to DOM element this component will be rendered to
		 * Renders component to given DOM element
		 */
		render : function(container) {
		    var me = this;
		    var content = this.template.clone();

		    // TODO: move this to "UIUtil" or sth like that
		    // Help popups (PORTTISK-812)
		    content.find('[helptags]').each(function(i, e) {
			var btn = 
			    jQuery(e);
			var taglist = 
			    btn.attr("helptags");
			var reqname = 
			    'InfoBox.ShowInfoBoxRequest';
			var builder = 
			    me.instance.sandbox.getRequestBuilder(reqname);
			btn.bind('click', function(e) {
			    jQuery.ajax({
				url : me.instance.sandbox.getAjaxUrl() +
				    '&action_route=GetArticlesByTag' + 
				    '&tags="' + taglist + '"',
				type : 'GET',
				dataType : 'json',
				success : function(resp) {
				    var content = resp.articles[0].content;
				    var idx = content.indexOf("<![CDATA[");
				    if (idx >= 0) {
					content = content.substring(idx + 9);
				    }
				    idx = content.indexOf("]]>");
				    if (idx >= 0) {
					content = content.substring(0, idx);
				    }
				    var dialog = 
					Oskari.clazz
					.create('Oskari.userinterface' + 
						'.component.Popup');
				    var okBtn = 
					dialog.createCloseButton("OK");
				    okBtn.addClass('primary');
				    dialog.show(me.loc.help, 
						content, 
						[ okBtn ]);
				    dialog.moveTo(btn, 'bottom');
				},
				error : function() {
				    alert(me.loc.error.nohelp);
				}
			    });
			});
		    });
		    // End help popups.

		    this.mainPanel = content;

		    // language options are rendered based on localization
		    var languageSelection = 
			content.find('select[name=language]');
		    var langOpts = this.loc.language.options;
		    for(var opt in langOpts) {
			languageSelection.append('<option value="' + 
						 opt + '">' + 
						 langOpts[opt] + 
						 '</option>');
		    }

		    this.handleMapMoved();

		    container.append(content);

		    var accordion = 
			Oskari.clazz
			.create('Oskari.userinterface.component.Accordion');
		    this.accordion = accordion;
		    accordion.addPanel(this._createSizePanel());
		    accordion.addPanel(this._createToolsPanel());

		    this.maplayerPanel = 
			Oskari.clazz
			.create('Oskari.userinterface.component.AccordionPanel');
		    this.maplayerPanel.setTitle(this.loc.layers.label);
		    this._populateMapLayerPanel();

		    accordion.addPanel(this.maplayerPanel);
		    accordion.insertTo(content.find('div.options'));

		    // buttons
		    this._addButtons(content);

		},
		/**
		 * @method _setSelectedSize
		 * @private
		 * Adjusts the map size according to publisher selection
		 */
		_setSelectedSize : function() {
		    var me = this;
		    var widthInput = this.mainPanel.find('div.customsize input[name=width]');
		    widthInput.removeClass('error');
		    var heightInput = this.mainPanel.find('div.customsize input[name=height]');
		    heightInput.removeClass('error');
		    var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
		    for(var i = 0; i < me.sizeOptions.length; ++i) {
			var option = me.sizeOptions[i];
			if(option.selected) {
			    var mapElement = jQuery(mapModule.getMap().div);
			    if(option.id == "custom") {
				var width = widthInput.val();
				if(this._validateNumberRange(width, option.minWidth, option.maxWidth)) {
				    mapElement.width(width);
				}
				else {
				    widthInput.addClass('error');
				}
				var height = heightInput.val();
				if(this._validateNumberRange(height, option.minHeight, option.maxHeight)) {
				    mapElement.height(height);
				}
				else {
				    heightInput.addClass('error');
				}
				break;
			    }
			    else {
				mapElement.width(option.width);
				mapElement.height(option.height);
			    }
			    break;
			}
		    }        
		    // notify openlayers that size has changed
		    mapModule.getMap().updateSize();
		},
		/**
		 * @method _createSizePanel
		 * @private
		 * Creates the size selection panel for publisher
		 * @return {jQuery} Returns the created panel
		 */
		_createSizePanel : function() {
		    var me = this;
		    var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
		    panel.setTitle(this.loc.size.label);
		    var contentPanel = panel.getContainer();
		    // tooltip
		    var tooltipCont = this.templateHelp.clone();
		    tooltipCont.attr('title', this.loc.size.tooltip);
		    contentPanel.append(tooltipCont);
		    // content
		    var closureMagic = function(tool) {
			return function() {
			    var size = contentPanel.find('input[name=size]:checked').val();
			    var customInputs = contentPanel.find('div.customsize input');
			    if(size == 'custom') {
				customInputs.removeAttr("disabled");
			    } else {
				customInputs.attr("disabled", true);
			    }
			    // reset previous setting
			    for(var i = 0; i < me.sizeOptions.length; ++i) {
				me.sizeOptions[i].selected = false;
			    }
			    tool.selected = true; 
			    me._setSelectedSize();
			};
		    };
		    for(var i = 0; i < this.sizeOptions.length; ++i) {
			var option = this.sizeOptions[i];
			var toolContainer = this.templateSizeOptionTool.clone();
			var label = this.loc.sizes[option.id];
			label = label + ' (' + option.width + ' x ' + option.height + 'px)';
			toolContainer.find('span').append(label);
			if(option.selected) {
			    toolContainer.find('input').attr('checked','checked');
			}
			contentPanel.append(toolContainer);
			toolContainer.find('input').attr('value', option.id);
			toolContainer.find('input').change(closureMagic(option));
		    }
		    var customSizes = this.templateCustomSize.clone();
		    var inputs = customSizes.find('input');
		    inputs.bind('keyup', function() {
			me._setSelectedSize();
		    });
		    
		    contentPanel.append(customSizes);

		    return panel;
		},
		/**
		 * @method _createToolsPanel
		 * @private
		 * Creates the tool selection panel for publisher
		 * @return {jQuery} Returns the created panel
		 */
		_createToolsPanel : function() {
		    var me = this;
		    var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
		    panel.setTitle(this.loc.tools.label);
		    var contentPanel = panel.getContainer();
		    // tooltip
		    var tooltipCont = this.templateHelp.clone();
		    tooltipCont.attr('title', this.loc.tools.tooltip);
		    contentPanel.append(tooltipCont);

		    // content
		    var closureMagic = function(tool) {
			return function() {
			    var checkbox = jQuery(this);
			    var isChecked = checkbox.is(':checked');
			    tool.selected = isChecked;
			    me._activatePreviewPlugin(tool, isChecked);
			};
		    };
		    for(var i = 0; i < this.tools.length; ++i) {
			var toolContainer = this.templateTool.clone();
			var toolname = this.loc.tools[this.tools[i].id];
			toolContainer.find('span').append(toolname);
			if(this.tools[i].selected) {
			    toolContainer.find('input').attr('checked', 'checked');
			}
			contentPanel.append(toolContainer);
			toolContainer.find('input').change(closureMagic(this.tools[i]));
		    }

		    return panel;
		},
		/**
		 * @method _populateMapLayerPanel
		 * @private
		 * Populates the map layers panel in publisher
		 */
		_populateMapLayerPanel : function() {

		    var me = this;
		    var contentPanel = this.maplayerPanel.getContainer();

		    // tooltip
		    var tooltipCont = this.templateHelp.clone();
		    tooltipCont.attr('title', this.loc.layerselection.tooltip);
		    contentPanel.append(tooltipCont);

		    // tool selection
		    var toolContainer = this.templateTool.clone();
		    toolContainer.find('span').append(this.loc.layerselection.label);
		    if(this.showLayerSelection) {
			toolContainer.find('input').attr('checked', 'checked');
		    }
		    contentPanel.append(toolContainer);
		    contentPanel.append(this.loc.layerselection.info);
		    toolContainer.find('input').change(function() {
			var checkbox = jQuery(this);
			var isChecked = checkbox.is(':checked');
			me.showLayerSelection = isChecked;
			contentPanel.empty();
			me._populateMapLayerPanel();
		    });
		    if(!this.showLayerSelection) {
			return;
		    }
		    // if layer selection = ON -> show content
		    var layerTable = jQuery('<table></table>');
		    var closureMagic = function(row, layer) {
			return function() {
			    var checkbox = jQuery(this);
			    var isChecked = checkbox.is(':checked');
			    var cells = row.find('td');
			    layer.selected = isChecked;
			    if(isChecked) {
				me.defaultBaseLayer = layer.id;
			    } else if(me.defaultBaseLayer == layer.id) {
				me.defaultBaseLayer = null;
			    }
			};
		    };
		    for(var i = 0; i < this.layers.length; ++i) {
			var layer = this.layers[i];
			var row = this.templateLayerRow.clone();
			row.attr('data-id', layer.id);
			var cells = row.find('td');
			if(this.defaultBaseLayer && this.defaultBaseLayer == layer.id) {
			    jQuery(cells[0]).find('input').attr('checked', 'checked');
			    layer.selected = true;
			}
			jQuery(cells[0]).find('input').change(closureMagic(row, layer));
			jQuery(cells[1]).append(layer.name);
			layerTable.append(row);
		    }
		    contentPanel.append(layerTable);

		    if(this.config.layers.promote && this.config.layers.promote.length > 0) {
			this._populateLayerPromotion(contentPanel);
		    }
		},
		/**
		 * @method _populateLayerPromotion
		 * @private
		 * Populates the layer promotion part of the map layers panel in publisher
		 */
		_populateLayerPromotion : function(contentPanel) {
		    var me = this;
		    var sandbox = this.instance.getSandbox();
		    var addRequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
		    var closureMagic = function(layer) {
			return function() {
			    sandbox.request(me.instance.getName(), addRequestBuilder(layer.getId(), true));
			};
		    };
		    // TODO: check that layer isn't added yet
		    for(var i = 0; i < this.config.layers.promote.length; ++i) {
			var promotion = this.config.layers.promote[i];
			var promoLayerList = jQuery('<ul></ul>');
			var added = false;
			for(var j = 0; j < promotion.id.length; ++j) {

			    if(!sandbox.isLayerAlreadySelected(promotion.id[j])) {
				var item = jQuery('<li><a href="JavaScript:void(0);"></a></li>');
				var layer = sandbox.findMapLayerFromAllAvailable(promotion.id[j]);
				// promo layer found in system
				if(layer) {
				    var link = item.find('a');
				    link.append(layer.getName());
				    link.bind('click', closureMagic(layer));
				    promoLayerList.append(item);
				    added = true;
				}
			    }
			}
			if(added) {
			    contentPanel.append(promotion.text);
			    contentPanel.append(promoLayerList);
			}
		    }
		},
		/**
		 * @method handleLayerSelectionChanged
		 * Updates the maplayer panel with current maplayer selections
		 */
		handleLayerSelectionChanged : function() {
		    this.setupLayersList();
		    var contentPanel = this.maplayerPanel.getContainer();
		    contentPanel.empty();
		    this._populateMapLayerPanel();
		},
		/**
		 * @method handleMapMoved
		 * Updates the coordinate display to show current map center location
		 */
		handleMapMoved : function() {

		    var mapVO = this.instance.sandbox.getMap();
		    var lon = mapVO.getX();
		    var lat = mapVO.getY();
		    var zoom = mapVO.getZoom();
		    this.mainPanel.find('div.locationdata').html('N: ' + lat + ' E: ' + lon + ' ' + this.loc.zoomlevel + ': ' + zoom);
		},
		/**
		 * @method setupLayersList
		 * Handles the published map layer selection
		 * FIXME: this is completely under construction, rights aren't managed in any way etc
		 */
		setupLayersList : function() {
		    this.layers = [];
		    var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
		    for(var i = 0; i < selectedLayers.length; ++i) {
			// TODO: if rights then
			var layer = {
			    id : selectedLayers[i].getId(),
			    name : selectedLayers[i].getName(),
			    opacity : selectedLayers[i].getOpacity()
			};
			this.layers.push(layer);
		    }
		},
		/**
		 * @method _activatePreviewPlugin
		 * @private
		 * @param {Object} tool tool definition as in #tools property
		 * @param {Boolean} enabled, true to enable plugin, false to disable
		 * Enables or disables a plugin on map
		 */
		_activatePreviewPlugin : function(tool, enabled) {        
		    if(!tool.plugin && enabled) {
			var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
			tool.plugin = Oskari.clazz.create(tool.id, tool.config);
			mapModule.registerPlugin(tool.plugin);
		    }
		    if(!tool.plugin) {
			// plugin not created -> nothing to do
			return;
		    }
		    if(enabled) {
			tool.plugin.startPlugin(this.instance.sandbox);
		    } else {
			tool.plugin.stopPlugin(this.instance.sandbox);
		    }
		},
		/**
		 * @method _addButtons
		 * @private
		 * @param {jQuery} container reference to DOM element this component will be rendered to
		 * Renders publisher buttons to given DOM element
		 */
		_addButtons : function(container) {
		    var me = this;
		    var buttonCont = container.find('div.buttons');
		    var saveBtn = jQuery('<input type="button" name="save" />');
		    saveBtn.val(this.loc.buttons.save);
		    saveBtn.bind('click', function() {
			me._gatherSelections(container);
		    });
		    var cancelBtn = jQuery('<input type="button" name="cancel" />');
		    cancelBtn.val(this.loc.buttons.cancel);
		    cancelBtn.bind('click', function() {
			me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'close']);
		    });

		    buttonCont.append(cancelBtn);
		    buttonCont.append(saveBtn);
		},
		/**
		 * @method _gatherSelections
		 * @private
		 * Gathers publisher selections and sends them to server
		 */
		_gatherSelections : function() {
		    var container = this.mainPanel;
		    var domain = container.find('input[name=domain]').val();
		    var sandbox = this.instance.getSandbox();
		    if(!this._checkLength(domain, 1)) {
			alert(this.loc.error.domain);
			return;
		    }
		    if(domain.startsWith('http') || domain.startsWith('www')) {
			alert(this.loc.error.domainStart);
			return;
		    }
		    var name = container.find('input[name=name]').val();
		    if(!this._checkLength(name, 1)) {
			alert(this.loc.error.name);
			return;
		    }
		    var map = sandbox.getMap();
		    var language = container.find('select[name=language]').val();
		    var size = container.find('input[name=size]:checked').val();
		    var selections = {
			domain : domain,
			name : name,
			language : language,
			plugins : [],
			layers : [],
			north : Math.floor(map.getY()),
			east : Math.floor(map.getX()),
			zoom : map.getZoom()
		    };
		    for(var i = 0; i < this.tools.length; ++i) {
			if(this.tools[i].selected) {
			    selections.plugins.push({
				id : this.tools[i].id
			    });
			}
		    }
		    if(size == 'custom') {

			var width = container.find('div.customsize input[name=width]').val();
			var height = container.find('div.customsize input[name=height]').val();
			if(this._validateSize(width, height)) {
			    selections.size = {
				width : width,
				height : height
			    };
			} else {
			    alert(this.loc.error.size);
			    return;
			}
		    } else {

			for(var i = 0; i < this.sizeOptions.length; ++i) {
			    var option = this.sizeOptions[i];
			    if(option.id == size) {
				selections.size = {
				    width : option.width,
				    height : option.height
				};
				break;
			    }
			}
		    }
		    // jos karttatasot rastittu
		    if(this.showLayerSelection) {
			// TODO: layerselection plugin config
		    }
		    for(var i = 0; i < this.layers.length; ++i) {
			if(this.layers[i].selected || (this.layers[i].id == this.defaultBaseLayer)) {
			    selections.layers.push({
				id : this.layers[i].id,
				opacity : this.layers[i].opacity
			    });
			}
		    }
		    // saves possible open gfi popups
		    if(sandbox.getStatefulComponents()['infobox']) {
			selections["infobox"] = sandbox.getStatefulComponents()['infobox'].getState();
		    } 
		    
		    var url = sandbox.getAjaxUrl();
		    alert(JSON.stringify(selections, null, 4));
		    
		    jQuery.ajax({
			url :  url + '&action_route=Publish',
			type : 'POST',
			data : 'pubdata=' + JSON.stringify(selections),
			dataType : 'json',
			beforeSend : function(x) {
			    if(x && x.overrideMimeType) {
				x.overrideMimeType("application/j-son;" + "charset=UTF-8");
			    }
			},
			success : function(response) {
			    alert("Ok");
			},
			error : function() {
			    alert("Fail");
			}
		    });
		},
		/**
		 * @method _checkLength
		 * @private
		 * @param {String} pStr string to validate
		 * @param {Number} min min length (optional)
		 * @param {Number} max max length (optional)
		 * Validates string length
		 */
		_checkLength : function(pStr, min, max) {
		    if(pStr) {
			var str = jQuery.trim(pStr.toString());
			if(min && str.length < min) {
			    return false;
			}
			if(max && str.length > max) {
			    return false;
			}
			return true;
		    }
		    return false;
		},
		/**
		 * @method _validateNumberRange
		 * @private
		 * @param {Object} value number to validate
		 * @param {Number} min min value
		 * @param {Number} max max value
		 * Validates number range
		 */
		_validateNumberRange : function(value, min, max) {
		    if(isNaN(parseInt(value))) {
			return false;
		    }
		    if(!isFinite(value)) {
			return false;
		    }
		    if(value < min || value > max) {
			return false;
		    }
		    return true;
		},
		/**
		 * @method _validateSize
		 * @private
		 * @param {Number} width value from width field
		 * @param {Number} height value from height field
		 * Validates size for custom size option
		 */
		_validateSize : function(width, height) {
		    var custom = null;
		    for(var i = 0; i < this.sizeOptions.length; ++i) {
			var option = this.sizeOptions[i];
			if(option.id == 'custom') {
			    custom = option;
			    break;
			}
		    }
		    var isOk = this._validateNumberRange(width, custom.minWidth, custom.maxWidth) &&
			this._validateNumberRange(height, custom.minHeight, custom.maxHeight);
		    return isOk;
		},
		/**
		 * @method _enablePreview
		 * @private
		 * Modifies the main map to show what the published map would look like
		 */
		_enablePreview : function() {
		    var me = this;
		    var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
		    var plugins = mapModule.getPluginInstances();
		    
		    for(var p in plugins) {
			var plugin = plugins[p]; 
			if(plugin.hasUI && plugin.hasUI()) {
			    plugin.stopPlugin(me.instance.sandbox);
			    mapModule.unregisterPlugin(plugin);
			    this.normalMapPlugins.push(plugin);
			}
		    }
		    
		    this._setSelectedSize();
		    
		    for(var i = 0; i < this.tools.length; ++i) {
			if(this.tools[i].selected) {
			    this._activatePreviewPlugin(this.tools[i], true);
			}
		    }    
		    
		    mapModule.registerPlugin(this.logoPlugin);
		    this.logoPlugin.startPlugin(me.instance.sandbox);
		    
		},
		/**
		 * @method _disablePreview
		 * @private
		 * Returns the main map from preview to normal state
		 */
		_disablePreview : function() {
		    var me = this;
		    var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
		    var plugins = mapModule.getPluginInstances();
		    // teardown preview plugins
		    for(var i = 0; i < this.tools.length; ++i) {
			if(this.tools[i].plugin) {
			    this._activatePreviewPlugin(this.tools[i], false);
			    mapModule.unregisterPlugin(this.tools[i].plugin);
			    this.tools[i].plugin = undefined;
			    delete this.tools[i].plugin;
			}
		    }
		    
		    // return map size to normal
		    var mapElement = jQuery( mapModule.getMap().div );
		    // remove width definition to resume size correctly
		    mapElement.width('');
		    mapElement.height(jQuery(window).height());
		    // notify openlayers that size has changed
		    mapModule.getMap().updateSize();
		    
		    // resume normal plugins
		    for(var i = 0; i < this.normalMapPlugins.length; ++i) {
			var plugin = this.normalMapPlugins[i];
			mapModule.registerPlugin(plugin);
			plugin.startPlugin(me.instance.sandbox);
		    }
		    // reset listing
		    this.normalMapPlugins = [];
		    
		    mapModule.unregisterPlugin(this.logoPlugin);
		    this.logoPlugin.stopPlugin(me.instance.sandbox);
		},
		/**
		 * @method setEnabled
		 * @param {Boolean} isEnabled true to enable preview, false to disable preview
		 * "Activates" the published map preview when enabled 
		 * and returns to normal mode on disable
		 */
		setEnabled : function(isEnabled) {
		    if(isEnabled) {
			this._enablePreview();
		    }
		    else {
			this._disablePreview();
		    }
		}
	    });
