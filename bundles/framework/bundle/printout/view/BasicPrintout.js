/**
 * @class Oskari.mapframework.bundle.printout.view.BasicPrintout
 * Renders the printouts "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.view.BasicPrintout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.printout.PrintoutBundleInstance} instance
 *      reference to component that created this view
 * @param {Object} localization
 *      localization data in JSON format
 */
function(instance, localization, backendConfiguration) {
	var me = this;
	this.isEnabled = false;
	this.instance = instance;
	this.template = jQuery('<div class="basic_printout">' + '<div class="header">' + '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">' + '</div>' + '</div>');

	this.templateButtonsDiv = jQuery('<div class="buttons"></div>');
	this.templateHelp = jQuery('<div class="help icon-info"></div>');
	this.templateTool = jQuery('<div class="tool ">' + '<input type="checkbox"/>' + '<label></label></div>');
	this.templates = {
		preview : jQuery('<div class="preview"><img /></div>'),
		location : jQuery('<div class="location"></div>')
	};
	this.templateSizeOptionTool = jQuery('<div class="tool ">' + '<input type="radio" name="size" />' + '<label></label></div>');

	//Settings panel:
	this.templateFormat = jQuery('<div class="printout_format_cont printout_settings_cont"><div class="printout_format_label"></div></div>');
	this.templateFormatOptionTool = jQuery('<div class="tool ">' + '<input type="radio" name="format" />' + '<label></label></div>');

	this.templateTitle = jQuery('<div class="printout_title_cont printout_settings_cont"><div class="printout_title_label"></div><input class="printout_title_field" type="text"></div>');
	this.templateLogo = jQuery('<div class="printout_title_cont printout_settings_cont">' + '<input type="checkbox" name="logo" />' + '<label></label></div>');
	this.templateScale = jQuery('<div class="printout_scale_cont printout_settings_cont">' + '<input type="checkbox" name="scale" />' + '<label></label></div>');
	this.templateDate = jQuery('<div class="printout_date_cont printout_settings_cont">' + '<input type="checkbox" name="date" />' + '<label></label></div>');

	this.backendConfiguration = backendConfiguration;

	this.sizeOptions = [{
		id : 'A4',
		classForPreview : 'preview-portrait',
		selected : true // default option
	}, {
		id : 'A4_Landscape',
		classForPreview : 'preview-landscape'
	}, {
		id : 'A3',
		classForPreview : 'preview-portrait'
	}, {
		id : 'A3_Landscape',
		classForPreview : 'preview-landscape'
	}];

	this.sizeOptionsMap = {};
	for (var s = 0; s < this.sizeOptions.length; s++) {
		this.sizeOptionsMap[this.sizeOptions[s].id] = this.sizeOptions[s];
	}

	//format Options
	this.formatOptions = [{
		id : 'png',
		format : 'image/png'
	}, {
		id : 'pdf',
		format : 'application/pdf',
		selected : true // default option
	}];
	this.formatOptionsMap = {};
	for (var f = 0; f < this.formatOptions.length; f++) {
		this.formatOptionsMap[this.formatOptions[f].id] = this.formatOptions[f];
	}

	this.loc = localization;
	this.accordion = null;

	this.mainPanel = null;
}, {
	/**
	 * @method render
	 * Renders view to given DOM element
	 * @param {jQuery} container reference to DOM element this component will be
	 * rendered to
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

		var sizePanel = this._createSizePanel();
		sizePanel.open();

		accordion.addPanel(sizePanel);

		var settingsPanel = this._createSettingsPanel();
		accordion.addPanel(settingsPanel);

		var previewPanel = this._createPreviewPanel();
		previewPanel.open();

		accordion.addPanel(previewPanel);

		/*var scalePanel = this._createLocationAndScalePanel();
		 scalePanel.open();

		 accordion.addPanel(scalePanel);*/

		accordion.insertTo(contentDiv);

		// buttons
		// close
		container.find('div.header div.icon-close').bind('click', function() {
			me.instance.setPublishMode(false);
		});
		contentDiv.append(this._getButtons());

		var inputs = this.mainPanel.find('input[type=text]');
		inputs.focus(function() {
			me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
		});
		inputs.blur(function() {
			me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
		});
		// bind help tags
		var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', this.instance.sandbox);
		helper.processHelpLinks(this.loc.help, content, this.loc.error.title, this.loc.error.nohelp);

		this.updateMapPreview();
	},
	/**
	 * @method _createSizePanel
	 * @private
	 * Creates the size selection panel for printout
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
				// reset previous setting
				for (var i = 0; i < me.sizeOptions.length; ++i) {
					me.sizeOptions[i].selected = false;
				}
				tool.selected = true;
				me.updateMapPreview();
			};
		};
		for (var i = 0; i < this.sizeOptions.length; ++i) {
			var option = this.sizeOptions[i];
			var toolContainer = this.templateSizeOptionTool.clone();
			var label = this.loc.sizes[option.id];
			if (option.width && option.height) {
				label = label + ' (' + option.width + ' x ' + option.height + 'px)';
			}
			toolContainer.find('label').append(label).attr({
				'for' : option.id,
				'class' : 'printout_radiolabel'
			});
			if (option.selected) {
				toolContainer.find('input').attr('checked', 'checked');
			}
			contentPanel.append(toolContainer);
			toolContainer.find('input').attr({
				'value' : option.id,
				'name' : 'size',
				'id' : option.id
			});
			toolContainer.find('input').change(closureMagic(option));
		}

		return panel;
	},

	/**
	 * @method _createSettingsPanel
	 * @private
	 * Creates a settings panel for printout
	 * @return {jQuery} Returns the created panel
	 */
	_createSettingsPanel : function() {
		var me = this;
		var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
		panel.setTitle(this.loc.settings.label);
		var contentPanel = panel.getContainer();
		// tooltip
		var tooltipCont = this.templateHelp.clone();
		tooltipCont.attr('title', this.loc.settings.tooltip);
		contentPanel.append(tooltipCont);
		// content
		var closureMagic = function(tool) {
			return function() {
				var format = contentPanel.find('input[name=format]:checked').val();
				// reset previous setting
				for (var i = 0; i < me.formatOptions.length; ++i) {
					me.formatOptions[i].selected = false;
				}
				tool.selected = true;
				me.updateMapPreview();
			};
		};

		var format = this.templateFormat.clone();
		format.find('.printout_format_label').html(this.loc.format.label);
		for (var i = 0; i < this.formatOptions.length; ++i) {
			var option = this.formatOptions[i];
			var toolContainer = this.templateFormatOptionTool.clone();
			var label = this.loc.formats[option.id];

			toolContainer.find('label').append(label).attr({
				'for' : option.id,
				'class' : 'printout_radiolabel'
			});
			if (option.selected) {
				toolContainer.find('input').attr('checked', 'checked');
			}
			format.append(toolContainer);
			toolContainer.find('input').attr({
				'value' : option.format,
				'name' : 'format',
				'id' : option.id
			});
			toolContainer.find('input').change(closureMagic(option));
		}

		var mapTitle = this.templateTitle.clone();
		mapTitle.find('.printout_title_label').html(this.loc.mapTitle.label);
		mapTitle.find('.printout_title_field').attr({
			'value' : '',
			'placeholder' : this.loc.mapTitle.label
		});

		var logo = this.templateLogo.clone();
		logo.find('.printout_logo_check').attr({});
		logo.find('input').attr({
			'id' : 'printout_logo',
			'checked' : 'checked'
		});
		logo.find('label').html(this.loc.mapLogo.label).attr({
			'for' : 'printout_logo',
			'class' : 'printout_checklabel'
		});

		var scale = this.templateScale.clone();
		scale.find('.printout_scale_check').attr({
			'id' : 'printout_scale'
		});
		scale.find('input').attr({
			'id' : 'printout_scale',
			'checked' : 'checked'
		});
		scale.find('label').html(this.loc.mapScale.label).attr({
			'for' : 'printout_scale',
			'class' : 'printout_checklabel'
		});

		var date = this.templateLogo.clone();
		date.find('.printout_date_check').attr({
			'id' : 'printout_date'
		});
		date.find('input').attr({
			'id' : 'printout_date',
			'checked' : 'checked'
		});
		date.find('label').html(this.loc.mapDate.label).attr({
			'for' : 'printout_date',
			'class' : 'printout_checklabel'
		});

		contentPanel.append(format, mapTitle, logo, scale, date);

		return panel;
	},

	/**
	 * @method _createSizePanel
	 * @private
	 * Creates the size selection panel for printout
	 * @return {jQuery} Returns the created panel
	 */
	_createPreviewPanel : function() {
		var me = this;
		var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
		panel.setTitle(this.loc.preview.label);
		var contentPanel = panel.getContainer();

		var tooltipCont = this.templateHelp.clone();
		tooltipCont.attr('title', this.loc.preview.tooltip);
		contentPanel.append(tooltipCont);

		var previewContent = this.templates.preview.clone();

		contentPanel.append(previewContent);

		/* side effect */
		var previewImgDiv = previewContent.find('img');
		previewImgDiv.click(function() {
			me.showFullScaleMapPreview();
		});
		this.previewContent = previewContent;
		return panel;
	},
	/**
	 * @method _createSizePanel
	 * @private
	 * Creates the size selection panel for printout
	 * @return {jQuery} Returns the created panel
	 */
	_createLocationAndScalePanel : function() {
		var me = this;
		var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
		panel.setTitle(this.loc.location.label);
		var contentPanel = panel.getContainer();

		var tooltipCont = this.templateHelp.clone();
		tooltipCont.attr('title', this.loc.location.tooltip);
		contentPanel.append(tooltipCont);

		var scaleContent = this.templates.location.clone();

		contentPanel.append(scaleContent);

		return panel;
	},
	updateMapPreview : function() {

		var selections = this._gatherSelections("image/png");
		var urlBase = this.backendConfiguration.formatProducers[selections.format];
		var maplinkArgs = selections.maplinkArgs;
		var pageSizeArgs = "&pageSize=" + selections.pageSize;
		var previewScaleArgs = "&scaledWidth=200"
		var url = urlBase + maplinkArgs + pageSizeArgs + previewScaleArgs;

		this.previewContent.removeClass('preview-portrait');
		this.previewContent.removeClass('preview-landscape');
		this.previewContent.addClass(this.sizeOptionsMap[selections.pageSize].classForPreview);

		var previewImgDiv = this.previewContent.find('img');
		var img = new Image();
		img.onload = function() {
			previewImgDiv.attr('src', url);
			img.onload = null;
		}
		img.src = url;
	},

	showFullScaleMapPreview : function() {
		var selections = this._gatherSelections("image/png");
		var urlBase = this.backendConfiguration.formatProducers[selections.format];
		var maplinkArgs = selections.maplinkArgs;
		var pageSizeArgs = "&pageSize=" + selections.pageSize;
		var url = urlBase + maplinkArgs + pageSizeArgs;

		this.openURLinWindow(url, selections);

	},
	/**
	 * @method _getButtons
	 * @private
	 * Renders printout buttons to DOM snippet and returns it.
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
			if (selections) {
				me._printMap(selections);
			}
		});
		saveBtn.insertTo(buttonCont);

		return buttonCont;
	},
	/**
	 * @method _showValidationErrorMessage
	 * @private
	 * Takes an error array as defined by Oskari.userinterface.component.FormInput validate() and
	 * shows the errors on a  Oskari.userinterface.component.Popup
	 * @param {Object[]} errors validation error objects to show
	 */
	_showValidationErrorMessage : function(errors) {
		var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
		var okBtn = dialog.createCloseButton(this.loc.buttons.ok);
		var content = jQuery('<ul></ul>');
		for (var i = 0; i < errors.length; ++i) {
			var row = jQuery('<li></li>');
			row.append(errors[i]['error'])
			content.append(row);
		}
		dialog.show(this.loc['error'].title, content, [okBtn]);
	},
	/**
	 * @method _gatherSelections
	 * @private
	 * Gathers printout selections and returns them as JSON object
	 * @return {Object}
	 */
	_gatherSelections : function(format) {
		var container = this.mainPanel;
		var sandbox = this.instance.getSandbox();
		var errors = [];

		var size = container.find('input[name=size]:checked').val();
		var selectedFormat = (format != null) ? format : container.find('input[name=format]:checked').val();
		var title = container.find('.printout_title_field').val();
		var showLogo = container.find('#printout_logo').prop('checked');
		var showScale = container.find('#printout_scale').prop('checked');
		var showDate = container.find('#printout_date').prop('checked');
		var maplinkArgs = sandbox.generateMapLinkParameters();
		var selections = {
			pageTitle : title,
			language : Oskari.getLang(),
			pageSize : size,
			pageLogo : showLogo,
			pageScale : showScale,
			pageDate : showDate,
			maplinkArgs : maplinkArgs,
			format : selectedFormat || "application/pdf"
		}

		if (errors.length > 0) {
			// TODO: messages
			this._showValidationErrorMessage(errors);
			return;
		}
		return selections;

	},
	openURLinWindow : function(infoUrl, selections) {
		var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
		if(this._isLandscape(selections) )wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=1200," + "height=850";
		var link = infoUrl;
		window.open(link, "BasicPrintout", wopParm);
	},
	/**
	 * @method _printMap
	 * @private
	 * Sends the gathered map data to the server to save them/publish the map.
	 * @param {Object} selections map data as returned by _gatherSelections()
	 */
	_printMap : function(selections) {
		var me = this;
		var sandbox = this.instance.getSandbox();
		var url = sandbox.getAjaxUrl();
		var errorHandler = function() {
			var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
			var okBtn = dialog.createCloseButton(me.loc.buttons.ok);
			dialog.show(me.loc['error'].title, me.loc['error'].saveFailed, [okBtn]);
		};
		/* Temp begin */
		var urlBase = this.backendConfiguration.formatProducers[selections.format];

		var maplinkArgs = selections.maplinkArgs;
		var pageSizeArgs = "&pageSize=" + selections.pageSize;
		var pageTitleArgs = "&pageTitle=" + selections.pageTitle;
		var pageLogoArgs = "&pageLogo=" + selections.pageLogo;
		var pageScaleArgs = "&pageScale=" + selections.pageScale;
		var pageDateArgs = "&pageDate=" + selections.pageDate;
		var format = "&format=" + selections.format;

		// var url = urlBase + maplinkArgs + pageSizeArgs + pageTitleArgs + pageLogoArgs + pageScaleArgs + pageDateArgs ;
		//this.openURLinWindow(url);
		/* Temp end */
		
		var parameters = maplinkArgs + '&action_route=GetPreview' + pageSizeArgs + pageTitleArgs + pageLogoArgs + pageScaleArgs + pageDateArgs + format;

		url = url + parameters;

		this.openURLinWindow(url,selections);

		
	},
	/**
	 * @method _isLandscape
	 * @private
	 * @param {Object} JSONobject (_gatherSelections)
	   @return true/false
	 * return true, if Landscape print orientation
	 */
	_isLandscape : function(selections) {
		
		if (this.sizeOptionsMap[selections.pageSize].id.indexOf('Land') > -1) {
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
	 * @method destroy
	 * Destroyes/removes this view from the screen.
	 */
	destroy : function() {
		this.mainPanel.remove();
	},
	setEnabled : function(e) {
		this.isEnabled = e;
	},
	getEnabled : function() {
		return this.isEnabled;
	},
	refresh : function() {
		this.updateMapPreview();
	}
});
