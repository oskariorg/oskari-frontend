/**
 * Represents the layout (colours, fonts, tool style etc.) view for the publisher 
 * as an Oskari.userinterface.component.AccordionPanel
 *
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLayoutForm
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLayoutForm',

/**
 * @method create called automatically on construction
 * @static
 * @param {Object} localization
 *       publisher localization data
 * @param {Oskari.mapframework.bundle.publisher.view.BasicPublisher} publisher
 *       publisher reference
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

    // The values with which to populate the field inputs.
    this.initialValues = {
        colours: [{
            val: 'light_grey',
            bgColour: '#EFF2F2',
            titleColour: '#333438',
            headerColour: '#333438',
            iconCls: 'icon-close'
        }, {
            val: 'dark_grey',
            bgColour: '#424343',
            titleColour: '#FFFFFF',
            headerColour: '#424343',
            iconCls: 'icon-close-white'
        }, {
            val: 'blue',
            bgColour: '#0091FF',
            titleColour: '#FFFFFF',
            headerColour: '#0091FF',
            iconCls: 'icon-close-white'
        }, {
            val: 'red',
            bgColour: '#FF3333',
            titleColour: '#FFFFFF',
            headerColour: '#FF3333',
            iconCls: 'icon-close-white'
        }, {
            val: 'green',
            bgColour: '#26BF4C',
            titleColour: '#FFFFFF',
            headerColour: '#48732E',
            iconCls: 'icon-close-white'
        }, {
            val: 'yellow',
            bgColour: '#FFDE00',
            titleColour: '#333438',
            headerColour: '#333438',
            iconCls: 'icon-close'
        }],
        fonts: [
            {name: 'Arial', val: 'arial'},
            {name: 'Comic Sans', val: 'comic_sans'},
            {name: 'Georgia', val: 'georgia'}
        ],
        toolStyles: [
            'rounded-dark',
            'rounded-light',
            'sharp-dark',
            'sharp-light',
            '3d-dark',
            '3d-light'
        ]
    };

    // Visible fields:
    // - colour input
    // - font input
    // - tool style input
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
                                '<input type="text" name="publisher-colour" disabled />' +
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
     * @param {Object} pData initial data (optional)
     */
	init : function(pData) {
        var self = this,
            f, field, template;
        pData = pData || {};

        // Set the initial values
        this.values = {
            colourScheme: pData.colourScheme,
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
     * Returns the selections the user has done with the form inputs.
     * {
     *     colourScheme : <selected colour scheme (object)>,
     *     font : <selected font (string)>,
     *     toolStyle : <selected toolStyle (string)>
     * }
     * 
     * @method getValues
     * @return {Object}
     */
	getValues : function() {
        var colourCode = jQuery('input[name=publisher-colour]').attr('colour-code');
        this.values.colourScheme = this._getColourByCode(colourCode);
        this.values.font = jQuery('select[name=publisher-fonts]').val();
        this.values.toolStyle = jQuery('select[name=publisher-toolStyles]').val();

		return this.values;
    },

    /**
     * @method _getColoursTemplate
     * @return {jQuery} the colours template
     */
    _getColoursTemplate: function() {
        var self = this,
            template = this.template.colours.clone(),
            selectedColour = this.getValues().colourScheme || {},
            colourName = this.loc.layout.fields.colours[selectedColour.val],
            colourLabel = this.loc.layout.fields.colours.label,
            colourPlaceholder = this.loc.layout.fields.colours.placeholder,
            buttonLabel = this.loc.layout.fields.colours.buttonLabel;

        // Set the localizations.
        template.find('label').html(colourLabel);

        // Set the button handler
        template.find('button').html(buttonLabel).on('click', function(e) {
            self._openColourDialog(jQuery(this));
        });

        // Prepopulate data
        template.find('input[name=publisher-colour]').
            attr('placeholder', colourPlaceholder).
            val(colourName);

        return template;
    },

    /**
     * @method _getFontsTemplate
     * @return {jQuery} the fonts template
     */
    _getFontsTemplate: function() {
        var self = this,
            template = this.template.fonts.clone(),
            fontLabel = this.loc.layout.fields.fonts.label,
            fonts = this.initialValues.fonts,
            fLen = fonts.length,
            fontOption,
            i, selectedFont;

        // Set the localization.
        template.find('label').html(fontLabel);

        for (i = 0; i < fLen; ++i) {
            fontOption = this.template.option.clone();
            fontOption.attr({
                value: fonts[i].val
            }).html(fonts[i].name);
            template.find('select').append(fontOption);
        }

        // Set the select change handler.
        template.find('select').on('change', function(e) {
            // Send an event notifying the plugins that the font has changed.
            selectedFont = jQuery(this).val();
            self._sendFontChangedEvent(selectedFont);
        });

        // Prepopulate data
        jQuery(template.find('select option')).filter(function () {
            return (jQuery(this).val() == self.getValues().font); 
        }).prop('selected', 'selected');

        return template;
    },

    /**
     * @method _getToolStylesTemplate
     * @return {jQuery} the tool styles template
     */
    _getToolStylesTemplate: function() {
        var self = this,
            template = this.template.toolStyles.clone(),
            toolStylesLabel = this.loc.layout.fields.toolStyles.label,
            toolStyles = this.initialValues.toolStyles,
            tsLen = toolStyles.length,
            toolStyleOption,
            toolStyleName,
            i, selectedToolStyleCode;

        // Set the localizations.
        template.find('label').html(toolStylesLabel);

        for (i = 0; i < tsLen; ++i) {
            toolStyleOption = this.template.option.clone();
            toolStyleName = this.loc.layout.fields.toolStyles[toolStyles[i]];
            toolStyleOption.attr({
                value: toolStyles[i]
            }).html(toolStyleName);
            template.find('select').append(toolStyleOption);
        }

        // Set the select change handler.
        template.find('select').on('change', function(e) {
            // Send an event notifying the plugins that the style has changed.
            selectedToolStyleCode = jQuery(this).val();
            self._sendToolStyleChangedEvent(selectedToolStyleCode);
        });

        // Prepopulate data
        jQuery(template.find('select option')).filter(function () {
            return (jQuery(this).val() == self.getValues().toolStyle); 
        }).prop('selected', 'selected');

        return template;
    },

    /**
     * Creates and opens the dialog from which to choose the colour scheme.
     * Also handles the creation of the sample gfi popup.
     *
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
            colourInput, colourName, i, prevColour, selectedColour;

        closeButton.setTitle(this.loc.layout.popup.close);
        closeButton.setHandler(function() {
            popup.close(true);
        });

        content.find('div#publisher-colour-preview').append(self._createGfiPreview());

        for (i = 0; i < cLen; ++i) {
            colourInput = this.template.inputRadio.clone();
            colourName = this.loc.layout.fields.colours[colours[i].val];
            
            colourInput.find('input[type=radio]').attr({
                'id': colours[i].val,
                'name': 'colour',
                'value': colours[i].val
            });
            colourInput.find('label').html(colourName).attr({
                'for': colours[i].val
            });

            // Set the selected colour or default to 'dark_grey' if non-existant.
            prevColour = self.getValues().colourScheme;
            if (prevColour && prevColour.val === colours[i].val || (!prevColour && colours[i].val === 'dark_grey')) {
                colourInput.find('input[type=radio]').attr('checked', 'checked');
                self._changeGfiColours(colours[i], content);
            }

            content.find('div#publisher-colour-inputs').append(colourInput);
        }

        // Things to do when the user changes the colour scheme:
        content.find('input[name=colour]').change(function(e) {
            selectedColour = jQuery(this).val();
            selectedColour = self._getColourByCode(selectedColour);
            // * change the preview gfi
            self._changeGfiColours(selectedColour, content);
            // * change the value of the colour scheme input in the layout panel
            colourName = self.loc.layout.fields.colours[selectedColour.val];
            jQuery('div.basic_publisher').find('input[name=publisher-colour]').
                val(colourName).
                attr('colour-code', selectedColour.val);
            // * notify others of the changed colour scheme
            self._sendColourSchemeChangedEvent(selectedColour);
        });

        //popup.moveTo(target);
        popup.show(title, content, [closeButton]);
    },

    /**
     * Creates the sample gfi where the user can see the effects of the chosen colour scheme.
     *
     * @method _createGfiPreview
     * @return {jQuery} returns the sample gfi
     */
    _createGfiPreview: function() {
        // Example data
        var title = this.loc.layout.popup.gfiDialog.title,
            featureName = this.loc.layout.popup.gfiDialog.featureName,
            featureDesc = this.loc.layout.popup.gfiDialog.featureDesc,
            linkUrl = 'http://www.paikkatietoikkuna.fi/web/' + Oskari.getLang();
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
     * Sets the styles of the sample gfi with the selected colour scheme.
     *
     * @method _changeGfiColours
     * @param {Object} selectedColour
     * @param {jQuery} container (optional, defaults to the colour preview element on page)
     */
    _changeGfiColours: function(selectedColour, container) {
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
     * Sends an event to notify interested parties that the colour scheme has changed.
     *
     * @method _sendColourSchemeChangedEvent
     * @param {Object} colourScheme the changed colour scheme
     */
    _sendColourSchemeChangedEvent: function(colourScheme) {
        this._sendEvent('Publisher.ColourSchemeChangedEvent', colourScheme);
    },

    /**
     * Sends an event to notify interested parties that the font has changed.
     *
     * @method _sendFontChangedEvent
     * @param {String} font the changed font value
     */
    _sendFontChangedEvent: function(font) {
        this._sendEvent('Publisher.FontChangedEvent', font);
    },

    /**
     * Sends an event to notify interested parties that the tool style has changed.
     *
     * @method _sendToolStyleChangedEvent
     * @param {String} the changed tool style code
     */
    _sendToolStyleChangedEvent: function(selectedToolStyleCode) {
        this._sendEvent('Publisher.ToolStyleChangedEvent', selectedToolStyleCode);
    },

    /**
     * "Sends" an event, that is, notifies other components of something.
     *
     * @method _sendEvent
     * @param {String} eventName the name of the event
     * @param {Whatever} eventData the data we want to send with the event
     */
    _sendEvent: function(eventName, eventData) {
        var eventBuilder = this._sandbox.getEventBuilder(eventName),
            event;

        if (eventBuilder) {
            event = eventBuilder(eventData);
            this._sandbox.notifyAll(event);
        }
    },

    /**
     * @method _getColourByCode
     * @param {String} code
     * @param {Array[Object]} colours (optional, defaults to initial colours)
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
     * @method _getFontByCode
     * @param {String} code
     * @param {Array[Object]} fonts (optional, defaults to initial fonts)
     * @return {Object} font object
     */
    _getFontByCode: function(code, fonts) {
        var fonts = fonts || this.initialValues.fonts,
            fLen = fonts.length,
            i;

        for (i = 0; i < fLen; ++i) {
            if (fonts[i].val === code) return fonts[i];
        }
        return null;
    }
});

