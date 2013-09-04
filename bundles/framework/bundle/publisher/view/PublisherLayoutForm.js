/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLayoutForm
 * 
 * Represents the layout (colours, fonts, tool style etc.) view for the publisher 
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLayoutForm',

/**
 * @method create called automatically on construction
 * @static
 * @param {Object} localization
 *       publisher localization data
 * @param {Oskari.mapframework.bundle.publisher.view.BasicPublisher} publisher
 *       publisher reference for language change
 */
function(localization, publisher) {
	this.loc = localization;
    this._publisher = publisher;
    this._sandbox = publisher.instance.sandbox;

    this.template = {};
    for (var t in this.__templates ) {
        this.template[t] = jQuery(this.__templates[t]);
    }

    this.values = null;

    // TODO: these should probably come from conf or smth...
    this.initialValues = {
        colours: [{
            val: 'light_grey',
            bgColour: '#CCC',
            titleColour: '#424343',
            headerColour: '#424343',
            iconCls: 'icon-close'
        }, {
            val: 'dark_grey',
            bgColour: '#424343',
            titleColour: '#FFFFFF',
            headerColour: '#424343',
            iconCls: 'icon-close-white'
        }, {
            val: 'blue',
            bgColour: '#0000FF',
            titleColour: '#FFFFFF',
            headerColour: '#0000FF',
            iconCls: 'icon-close-white'
        }, {
            val: 'red',
            bgColour: '#FF0000',
            titleColour: '#FFFFFF',
            headerColour: '#FF0000',
            iconCls: 'icon-close-white'
        }, {
            val: 'green',
            bgColour: '#00FF00',
            titleColour: '#FFFFFF',
            headerColour: '#00FF00',
            iconCls: 'icon-close-white'
        }, {
            val: 'yellow',
            bgColour: '#FFFF00',
            titleColour: '#424343',
            headerColour: '#424343',
            iconCls: 'icon-close'
        }],
        fonts: [
            {name: 'Arial', val: 'arial'},
            {name: 'Comic Sans', val: 'comic_sans'}
        ],
        toolStyles: [{
            val: 'rounded-dark',
            search: {
                widthLeft: '17px', widthRight: '32px'
            },
            zoombar: {
                widthPlus: '22px', widthMinus: '22px', widthCenter: '22px',
                heightPlus: '38px', heightMinus: '39px', heightCenter: '12px',
                heightCursor: 18, widthCursor: '17px'
            }
        }, {
            val: 'rounded-light',
            search: {
                widthLeft: '17px', widthRight: '32px'
            },
            zoombar: {
                widthPlus: '22px', widthMinus: '22px', widthCenter: '22px',
                heightPlus: '38px', heightMinus: '39px', heightCenter: '12px',
                heightCursor: 18, widthCursor: '17px'
            }
        }, {
            val: 'sharp-dark',
            search: {
                widthLeft: '5px', widthRight: '30px'
            },
            zoombar: {
                widthPlus: '23px', widthMinus: '23px', widthCenter: '23px',
                heightPlus: '17px', heightMinus: '18px', heightCenter: '16px',
                heightCursor: 16, widthCursor: '23px'
            }
        }, {
            val: 'sharp-light',
            search: {
                widthLeft: '5px', widthRight: '30px'
            },
            zoombar: {
                widthPlus: '23px', widthMinus: '23px', widthCenter: '23px',
                heightPlus: '17px', heightMinus: '18px', heightCenter: '16px',
                heightCursor: 16, widthCursor: '23px'
            }
        }, {
            val: '3d-dark',
            search: {
                widthLeft: '5px', widthRight: '44px'
            },
            zoombar: {
                widthPlus: '23px', widthMinus: '23px', widthCenter: '23px',
                heightPlus: '35px', heightMinus: '36px', heightCenter: '13px',
                heightCursor: 13, widthCursor: '23px'
            }
        }, {
            val: '3d-light',
            search: {
                widthLeft: '5px', widthRight: '44px'
            },
            zoombar: {
                widthPlus: '23px', widthMinus: '23px', widthCenter: '23px',
                heightPlus: '35px', heightMinus: '36px', heightCenter: '13px',
                heightCursor: 13, widthCursor: '23px'
            }
        }]
    };

	this.fields = {
        'colours': {
            'label': this.loc.layout.fields.colours.label,
            'getContent': this._getColoursTemplate
        },
        'fonts': {
            'label': this.loc.layout.fields.fonts.label,
            'getContent': this._getFontsTemplate
        },
        'toolStyles': {
            'label': this.loc.layout.fields.toolStyles.label,
            'getContent': this._getToolStylesTemplate
        }
	};
}, {
    __templates: {
        "colours":      '<div id="publisher-layout-colours">' +
                            '<label for="publisher-colours"></label>' +
                            '<div id="publisher-layout-coloursSelector">' +
                                '<p id="publisher-selected-colour"></p>' +
                                '<button id="publisher-colours"></button>' +
                            '</div>' +
                        '</div>',
        "fonts":        '<div id="publisher-layout-fonts">' +
                            '<label for="publisher-fonts"></label>' +
                            '<select name="publisher-fonts"></select>' +
                        '</div>',
        "toolStyles":   '<div id="publisher-layout-toolStyles">' +
                            '<label for="publisher-toolStyles"></label>' +
                            '<select name="publisher-toolStyles"></select>' +
                        '</div>',
        "option":       '<option></option>',
        "inputRadio":   '<div><input type="radio" /><label></label></div>',
        "coloursPopup": '<div id="publisher-colour-popup">' +
                            '<div id="publisher-colour-inputs"></div>' +
                            '<div id="publisher-colour-preview"></div>' +
                        '</div>'
    },

    /**
     * Creates the DOM elements for layout change components and
     * prepopulates the fields if pData parameter is given.
     * 
     * @method init
     * @param {Object} pData initial data 
     */
	init : function(pData) {
        var self = this,
            f, field, template;
        pData = pData || {};

        this.values = {
            colourScheme: pData.colourScheme || 'dark_grey',
            font: pData.font,
            toolStyle: pData.toolStyle
        };

        // "Precompile" the templates
        for (f in this.fields) {
            field = this.fields[f];
            template = field.getContent.apply(self, arguments);
            field.content = template;
        }
	},
    /**
     * Returns the UI panel and populates it with the data that we want to show the user.
     * 
     * @method getPanel
     * @return {Oskari.userinterface.component.AccordionPanel}
     */
	getPanel : function() {
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
            contentPanel = panel.getContainer(),
            f, field, template;

        panel.setTitle(this.loc.layout.label);

        for (f in this.fields) {
            field = this.fields[f];
            contentPanel.append(field.content);
        }
		
		return panel;
	},
    /**
     * Returns the selections the user has done with the form inputs (all strings).
     * {
     *     colourScheme : <selected colour scheme>,
     *     font : <selected font>,
     *     toolStyle : <selected toolStyle>
     * }
     * 
     * @method getValues
     * @return {Object}
     */
	getValues : function() {
        //this.values.colourScheme = jQuery('p#publisher-selected-colour').text() || null;
        this.values.font = jQuery('select[name=publisher-fonts]').val();
        this.values.toolStyle = jQuery('select[name=publisher-toolStyles]').val();

		return this.values;
    },

    /**
     * @method _getColoursTemplate
     */
    _getColoursTemplate: function() {
        var self = this,
            template = this.template.colours.clone(),
            selectedColour = this.values.colourScheme;

        // Set the localizations.
        template.find('label').html(this.loc.layout.fields.colours.label);

        // Set the button handler
        template.find('button').html(this.loc.layout.fields.colours.buttonLabel).on('click', function(e) {
            // TODO: create the popup to choose the colour scheme from.
            self._openColourDialog(jQuery(this));
        });

        // Prepopulate data
        template.find('p#publisher-selected-colour').html(this.loc.layout.fields.colours[selectedColour]);

        return template;
    },

    /**
     * @method _getFontsTemplate
     */
    _getFontsTemplate: function() {
        var self = this,
            template = this.template.fonts.clone(),
            fonts = this.initialValues.fonts,
            fLen = fonts.length,
            fontOption,
            i;

        // Set the localization.
        template.find('label').html(this.loc.layout.fields.fonts.label);

        for (i = 0; i < fLen; ++i) {
            fontOption = this.template.option.clone();
            fontOption.attr({
                value: fonts[i].val
            }).html(fonts[i].name);
            template.find('select').append(fontOption);
        }

        // Set the select change handler.
        template.find('select').on('change', function(e) {
        });

        // Prepopulate data
        jQuery(template.find('select option')).filter(function () {
            return (jQuery(this).val() == self.values.font); 
        }).prop('selected', 'selected');

        return template;
    },

    /**
     * @method _getToolStylesTemplate
     */
    _getToolStylesTemplate: function() {
        var self = this,
            template = this.template.toolStyles.clone(),
            toolStyles = this.initialValues.toolStyles,
            tsLen = toolStyles.length,
            toolStyleOption,
            toolStyleName,
            i;

        // Set the localizations.
        template.find('label').html(this.loc.layout.fields.toolStyles.label);

        for (i = 0; i < tsLen; ++i) {
            toolStyleOption = this.template.option.clone();
            toolStyleName = this.loc.layout.fields.toolStyles[toolStyles[i].val];
            toolStyleOption.attr({
                value: toolStyles[i].val
            }).html(toolStyleName);
            template.find('select').append(toolStyleOption);
        }

        // Set the select change handler.
        template.find('select').on('change', function(e) {
            var selectedToolStyleCode = jQuery(this).val(),
                selectedToolStyle = self._getToolStyleByCode(selectedToolStyleCode),
                eventBuilder = self._sandbox.getEventBuilder('Publisher.ToolStyleChangedEvent'),
                event;

            if (eventBuilder) {
                event = eventBuilder(selectedToolStyle);
                self._sandbox.notifyAll(event);
            }
        });

        // Prepopulate data
        jQuery(template.find('select option')).filter(function () {
            return (jQuery(this).val() == self.values.toolStyle); 
        }).prop('selected', 'selected');

        return template;
    },

    /**
     * @method _openColourDialog
     */
    _openColourDialog: function(target) {
        var self = this,
            popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            title = this.loc.layout.popup.title,
            content = this.template.coloursPopup.clone(),
            colours = this.initialValues.colours,
            cLen = colours.length,
            colourInput, colourName, i;

        closeButton.setTitle(this.loc.layout.popup.close);
        closeButton.setHandler(function() {
            var colour = content.find('input[name=colour]:checked');
            self.values.colourScheme = colour.val();
            jQuery('div.basic_publisher').find('p#publisher-selected-colour').html(colour.attr('colour-name'));
            popup.close(true);
        });

        content.find('div#publisher-colour-preview').append(self._createGfiPreview());

        for (i = 0; i < cLen; ++i) {
            colourInput = this.template.inputRadio.clone();
            colourName = this.loc.layout.fields.colours[colours[i].val];
            
            colourInput.find('input[type=radio]').attr({
                'id': colours[i].val,
                'name': 'colour',
                'value': colours[i].val,
                'colour-name': colourName
            });
            colourInput.find('label').html(colourName).attr({
                'for': colours[i].val
            });

            if (self.values.colourScheme === colours[i].val || (!self.values.colourScheme && colours[i].val === 'dark_grey')) {
                colourInput.find('input[type=radio]').attr('checked', 'checked');
                self._changeGfiColours(colours[i], content);
            }

            content.find('div#publisher-colour-inputs').append(colourInput);
        }


        content.find('input[name=colour]').change(function(e) {
            var selectedColour = jQuery(this).val();
            selectedColour = self._getColourByCode(selectedColour);
            self._changeGfiColours(selectedColour);
        });

        //popup.moveTo(target);
        popup.show(title, content, [closeButton]);
    },

    /**
     * @method _createGfiPreview
     */
    _createGfiPreview: function() {
        // Example data
        var title = this.loc.layout.popup.gfiDialog.title,
            featureName = this.loc.layout.popup.gfiDialog.featureName,
            featureDesc = this.loc.layout.popup.gfiDialog.featureDesc,
            linkUrl = 'http://www.paikkatietoikkuna.fi/';
        // Templates
        var dialogContent = jQuery('<div></div>');
            header = jQuery('<div class="popupTitle"></div>'),
            headerWrapper = jQuery('<div class="popupHeader"></div>'),
            headerCloseButton = jQuery('<div class="olPopupCloseBox icon-close-white" style="position: absolute; top: 12px;"></div>'),
            contentDiv = jQuery('<div class="popupContent"></div>'),
            contentWrapper = jQuery('<div class="contentWrapper"></div>'),
            actionLink = jQuery('<span class="infoboxActionLinks"><a href="#"></a></span>'),
            actionButton = jQuery('<span class="infoboxActionLinks"><input type="button" /></span>'),
            contentSeparator = jQuery('<div class="infoboxLine">separator</div>'),
            popupDataContent = jQuery('<div class="myplaces_wrapper"><div class="myplaces_place">' +
                                          '<h3 class="myplaces_header"></h3>' +
                                          '<p class="myplaces_desc"></p>' +
                                          '<img class="myplaces_img"></img>' +
                                          '<a class="myplaces_link"></a>' +
                                      '</div></div>');

        header.append(title);
        headerWrapper.append(header);
        headerWrapper.append(headerCloseButton);
        headerWrapper.css({
            'width': '320px',
        });

        popupDataContent.find('h3.myplaces_header').html(featureName);
        popupDataContent.find('p.myplaces_desc').html(featureDesc);
        popupDataContent.find('a.myplaces_link').html(linkUrl).attr('href', linkUrl);
        contentDiv.append(popupDataContent);
        contentDiv.css({
            'margin-left': '0px',
            'height': '120px'
        })
        contentWrapper.append(contentDiv);
        contentWrapper.css({
            'width': '320px'
        })

        dialogContent.append(headerWrapper).append(contentWrapper);

        return dialogContent;
    },

    /**
     * @method _changeGfiColours
     */
    _changeGfiColours: function(selectedColour, container) {
        container = container || jQuery('div#publisher-colour-preview');
        var gfiHeader = container.find('div.popupHeader');
        var gfiTitle = container.find('div.popupTitle');
        var featureHeader = container.find('h3.myplaces_header');
        var closeButton = container.find('div.olPopupCloseBox');

        gfiHeader.css({
            'background-color': selectedColour.bgColour
        });

        gfiTitle.css({
            'color': selectedColour.titleColour
        });

        featureHeader.css({
            'color': selectedColour.headerColour
        });

        closeButton.removeClass('icon-close-white');
        closeButton.removeClass('icon-close');
        closeButton.addClass(selectedColour.iconCls);
    },

    /**
     * @method _getColourByCode
     * @param {String} code
     * @param {Array[Object]} colours defaults to initial colours
     * @return {Object} colour object
     */
    _getColourByCode: function(code, colours) {
        var colours = colours || this.initialValues.colours,
            cLen = colours.length,
            i;

        for (i = 0; i < cLen; ++i) {
            if (colours[i].val === code) return colours[i];
        }
        return null;
    },

    /**
     * @method _getToolStyleByCode
     * @param {String} code
     * @param {Array[Object]} toolStyles defaults to initial tool styles
     * @return {Object} toolstyle object
     */
    _getToolStyleByCode: function(code, toolStyles) {
        var toolStyles = toolStyles || this.initialValues.toolStyles,
            tsLen = toolStyles.length,
            i;

        for (i = 0; i < tsLen; ++i) {
            if (toolStyles[i].val === code) return toolStyles[i];
        }
        return null;
    }
});

