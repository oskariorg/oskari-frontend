/**
 * @class Oskari.mapframework.bundle.publisher.view.BasicPublisher
 * Renders the "publisher" view for basic use case
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.BasicPublisher',

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
    this.template = jQuery('<div class="basic_publisher">' + 
    	'<div class="header"><div class="icon-close"></div><h3></h3></div>' +
    	'<div class="content">' +   
    	'</div>' +
    '</div>');

    this.templateButtonsDiv = jQuery('<div class="buttons"></div>');
    this.templateHelp = jQuery('<div class="help icon-info"></div>');
    this.templateTool = jQuery('<div class="tool ">' + '<input type="checkbox"/>' + '<span></span></div>');
    this.templateSizeOptionTool = jQuery('<div class="tool ">' + '<input type="radio" name="size" />' + '<span></span></div>');
    this.templateCustomSize = jQuery('<div class="customsize">' + '<input type="text" disabled="true" name="width" ' + 'placeholder="' + localization.sizes.width + '"/> x ' + '<input type="text" disabled="true" ' + 'name="height" placeholder="' + localization.sizes.height + '"/></div>');

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
    this.accordion = null;

    this.maplayerPanel = null;
    this.mainPanel = null;
    this.normalMapPlugins = [];
    this.logoPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin');
    this.latestGFI = null;
}, {
    /**
     * @method render
     * @param {jQuery} container reference to DOM element this component will be
     * rendered to
     * Renders component to given DOM element
     */
    render : function(container) {
        var me = this;
        var content = this.template.clone();

        this.mainPanel = content;
        content.find('div.header h3').append(this.loc.title);

        container.append(content);
        var contentDiv = content.find('div.content');

        var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        this.accordion = accordion;
        
        var form = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.PublisherLocationForm',this.loc);
        this.locationForm = form;
        form.init();
        var panel = form.getPanel();
        panel.open();
        accordion.addPanel(panel);
        
        accordion.addPanel(this._createSizePanel());
        accordion.addPanel(this._createToolsPanel());

        this.maplayerPanel = Oskari.clazz.create('Oskari.mapframework.bundle.publisher.view.PublisherLayerForm', this.loc, this.instance);
        this.maplayerPanel.init();

        accordion.addPanel(this.maplayerPanel.getPanel());
        accordion.insertTo(contentDiv);

        // buttons
        // close
        container.find('div.header div.icon-close').bind('click', function() {
        	me.instance.setPublishMode(false);
        });
        contentDiv.append(this._getButtons());
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
        for (var i = 0; i < me.sizeOptions.length; ++i) {
            var option = me.sizeOptions[i];
            if (option.selected) {
            	// reference to openlayers map.div
                var mapElement = jQuery(mapModule.getMap().div);
                if (option.id == "custom") {
                    var width = widthInput.val();
                    if (this._validateNumberRange(width, option.minWidth, option.maxWidth)) {
                        mapElement.width(width);
                    } else {
                        widthInput.addClass('error');
                    }
                    var height = heightInput.val();
                    if (this._validateNumberRange(height, option.minHeight, option.maxHeight)) {
                        mapElement.height(height);
                    } else {
                        heightInput.addClass('error');
                    }
                    break;
                } else {
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
                if (size == 'custom') {
                    customInputs.removeAttr("disabled");
                } else {
                    customInputs.attr("disabled", true);
                }
                // reset previous setting
                for (var i = 0; i < me.sizeOptions.length; ++i) {
                    me.sizeOptions[i].selected = false;
                }
                tool.selected = true;
                me._setSelectedSize();
            };
        };
        for (var i = 0; i < this.sizeOptions.length; ++i) {
            var option = this.sizeOptions[i];
            var toolContainer = this.templateSizeOptionTool.clone();
            var label = this.loc.sizes[option.id];
            label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            toolContainer.find('span').append(label);
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
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
        for (var i = 0; i < this.tools.length; ++i) {
            var toolContainer = this.templateTool.clone();
            var toolname = this.loc.tools[this.tools[i].id];
            toolContainer.find('span').append(toolname);
            if (this.tools[i].selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            contentPanel.append(toolContainer);
            toolContainer.find('input').change(closureMagic(this.tools[i]));
        }

        return panel;
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
        //this.mainPanel.find('div.locationdata').html('N: ' + lat + ' E: ' + lon + ' ' + this.loc.zoomlevel + ': ' + zoom);
    },
    /**
     * @method _activatePreviewPlugin
     * @private
     * @param {Object} tool tool definition as in #tools property
     * @param {Boolean} enabled, true to enable plugin, false to disable
     * Enables or disables a plugin on map
     */
    _activatePreviewPlugin : function(tool, enabled) {
        if (!tool.plugin && enabled) {
            var mapModule = this.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
            tool.plugin = Oskari.clazz.create(tool.id, tool.config);
            mapModule.registerPlugin(tool.plugin);
        }
        if (!tool.plugin) {
            // plugin not created -> nothing to do
            return;
        }
        if (enabled) {
            tool.plugin.startPlugin(this.instance.sandbox);
        } else {
            tool.plugin.stopPlugin(this.instance.sandbox);
        }
    },
    /**
     * @method _getButtons
     * @private
     * Renders publisher buttons to DOM snippet and returns it.
     * @return {jQuery} container with buttons
     */
    _getButtons : function() {
        var me = this;
                
        var buttonCont = this.templateButtonsDiv.clone();
        
        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(this.loc.buttons.cancel);
        cancelBtn.setHandler(function() {
        	me.instance.setPublishMode(false);
        });
		cancelBtn.insertTo(buttonCont);
		
        var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        saveBtn.setTitle(this.loc.buttons.save);
        saveBtn.addClass('primary');
        saveBtn.setHandler(function() {
            var selections = me._gatherSelections();
            if(selections) {
            	me._publishMap(selections);
            }
        });
		saveBtn.insertTo(buttonCont);
		
        return buttonCont;
    },
    
    _showValidationErrorMessage : function(errors) {
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = dialog.createCloseButton(this.loc.buttons.ok);
    	var content = jQuery('<ul></ul>');
    	for(var i = 0 ; i < errors.length; ++i) {
    		var row = jQuery('<li></li>');
    		row.append(errors[i]['error'])
    		content.append(row);
    	}
    	dialog.show(this.loc['error'].title, content, [okBtn]);
    },
    /**
     * @method _gatherSelections
     * @private
     * Gathers publisher selections and returns them as JSON object
     * @return {Object}
     */
    _gatherSelections : function() {
        var container = this.mainPanel;
        var sandbox = this.instance.getSandbox();
        
        var errors = this.locationForm.validate();
        var values = this.locationForm.getValues();
        var size = container.find('input[name=size]:checked').val();
        var selections = {
            domain : values.domain,
            name : values.name,
            language : values.language,
            plugins : []
        };
        for (var i = 0; i < this.tools.length; ++i) {
            if (this.tools[i].selected) {
            	var tmpTool = {
                    id : this.tools[i].id
                };
                if(this.tools[i].config) {
                	tmpTool.config = this.tools[i].config; 
                } 
            	
                selections.plugins.push(tmpTool);
            }
        }
        if (size == 'custom') {

            var width = container.find('div.customsize input[name=width]').val();
            var height = container.find('div.customsize input[name=height]').val();
            if (this._validateSize(width, height)) {
                selections.size = {
                    width : width,
                    height : height
                };
            } else {
            	errors.push({
            		field : 'size',
            		error : this.loc['error'].size
            	});
            }
        } else {

            for (var i = 0; i < this.sizeOptions.length; ++i) {
                var option = this.sizeOptions[i];
                if (option.id == size) {
                    selections.size = {
                        width : option.width,
                        height : option.height
                    };
                    break;
                }
            }
        }
        
        // if maplayer plugin is enabled
        var layerValues = this.maplayerPanel.getValues();
        if (layerValues.layerSelection) {
            selections.plugins.push(layerValues.layerSelection);
			selections.defaultBase = layerValues.defaultBase;
			selections.baseLayers = layerValues.baseLayers;
        }
        
        var mapFullState = sandbox.getStatefulComponents()['mapfull'].getState();
        selections.mapstate = mapFullState;
        
        // saves possible open gfi popups
        if (sandbox.getStatefulComponents()['infobox']) {
            selections["infobox"] = sandbox.getStatefulComponents()['infobox'].getState();
        }
        
        if(errors.length > 0) {
        	// TODO: messages
        	this._showValidationErrorMessage(errors);
        	return;
        }
        return selections;

    },
    _publishMap : function(selections) {
    	var me = this;
        var sandbox = this.instance.getSandbox();
        var url = sandbox.getAjaxUrl();
		var errorHandler = function() {
	    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
	    	var okBtn = dialog.createCloseButton(me.loc.buttons.ok);
	    	dialog.show(me.loc['error'].title, me.loc['error'].saveFailed, [okBtn]);
        };
        
        // make the ajax call
        jQuery.ajax({
            url : url + '&action_route=Publish',
            type : 'POST',
            data : {
            	pubdata : JSON.stringify(selections)
            },
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son; charset=UTF-8");
                }
            },
            success : function(response) {
            	if(response.id > 0) {
			        var event = sandbox.getEventBuilder('Publisher.MapPublishedEvent')(response.id);
			        sandbox.notifyAll(event);
            	}
            	else {
            		errorHandler();
            	}
            },
            error : errorHandler
        });
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
        if (isNaN(parseInt(value))) {
            return false;
        }
        if (!isFinite(value)) {
            return false;
        }
        if (value < min || value > max) {
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
        for (var i = 0; i < this.sizeOptions.length; ++i) {
            var option = this.sizeOptions[i];
            if (option.id == 'custom') {
                custom = option;
                break;
            }
        }
        var isOk = this._validateNumberRange(width, custom.minWidth, custom.maxWidth) && this._validateNumberRange(height, custom.minHeight, custom.maxHeight);
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

        for (var p in plugins) {
            var plugin = plugins[p];
            if (plugin.hasUI && plugin.hasUI()) {
                plugin.stopPlugin(me.instance.sandbox);
                mapModule.unregisterPlugin(plugin);
                this.normalMapPlugins.push(plugin);
            }
        }
        this.maplayerPanel.start();

        this._setSelectedSize();

        for (var i = 0; i < this.tools.length; ++i) {
            if (this.tools[i].selected) {
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
        for (var i = 0; i < this.tools.length; ++i) {
            if (this.tools[i].plugin) {
                this._activatePreviewPlugin(this.tools[i], false);
                mapModule.unregisterPlugin(this.tools[i].plugin);
                this.tools[i].plugin = undefined;
                delete this.tools[i].plugin;
            }
        }
        this.maplayerPanel.stop();

        // return map size to normal
        var mapElement = jQuery(mapModule.getMap().div);
        // remove width definition to resume size correctly
        mapElement.width('');
        mapElement.height(jQuery(window).height());
        // notify openlayers that size has changed
        mapModule.getMap().updateSize();

        // resume normal plugins
        for (var i = 0; i < this.normalMapPlugins.length; ++i) {
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
     * @param {Boolean} isEnabled true to enable preview, false to disable
     * preview
     * "Activates" the published map preview when enabled
     * and returns to normal mode on disable
     */
    setEnabled : function(isEnabled) {
        if (isEnabled) {
            this._enablePreview();
        } else {
            this._disablePreview();
        }
    },
    destroy : function() {
    	this.mainPanel.remove();
    }
});
