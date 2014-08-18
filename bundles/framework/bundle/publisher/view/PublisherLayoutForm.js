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
    function (localization, publisher) {
        this.loc = localization;
        this._publisher = publisher;
        this._sandbox = publisher.instance.sandbox;
        this._colourSchemePopup = null;
        this._customColoursPopup = null;

        this.template = {};
        var t;
        for (t in this.__templates) {
            if (this.__templates.hasOwnProperty(t)) {
                this.template[t] = jQuery(this.__templates[t]);
            }
        }

        this.values = null;

        // The values to be sent to plugins to actually change the style.
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
            }, {
                // Custom colour scheme, so fields default to null
                val: 'custom',
                bgColour: null,
                titleColour: null,
                headerColour: null,
                iconCls: 'icon-close-white'
            }],
            fonts: [{
                name: 'Arial (sans-serif)',
                val: 'arial'
            }, {
                name: 'Georgia (serif)',
                val: 'georgia'
            }],
            toolStyles: [{
                val: 'default',
                zoombar: {},
                search: {}
            }, {
                val: 'rounded-dark',
                zoombar: {
                    widthPlus: '22px',
                    widthMinus: '22px',
                    widthCenter: '22px',
                    heightPlus: '38px',
                    heightMinus: '39px',
                    heightCenter: 12,
                    heightCursor: '18px',
                    widthCursor: '17px'
                },
                search: {
                    widthLeft: 17,
                    widthRight: 32
                }
            }, {
                val: 'rounded-light',
                zoombar: {
                    widthPlus: '22px',
                    widthMinus: '22px',
                    widthCenter: '22px',
                    heightPlus: '38px',
                    heightMinus: '39px',
                    heightCenter: 12,
                    heightCursor: '18px',
                    widthCursor: '17px'
                },
                search: {
                    widthLeft: 17,
                    widthRight: 32
                }
            }, {
                val: 'sharp-dark',
                zoombar: {
                    widthPlus: '23px',
                    widthMinus: '23px',
                    widthCenter: '23px',
                    heightPlus: '17px',
                    heightMinus: '18px',
                    heightCenter: 16,
                    heightCursor: '16px',
                    widthCursor: '23px'
                },
                search: {
                    widthLeft: 5,
                    widthRight: 30
                }
            }, {
                val: 'sharp-light',
                zoombar: {
                    widthPlus: '23px',
                    widthMinus: '23px',
                    widthCenter: '23px',
                    heightPlus: '17px',
                    heightMinus: '18px',
                    heightCenter: 16,
                    heightCursor: '16px',
                    widthCursor: '23px'
                },
                search: {
                    widthLeft: 5,
                    widthRight: 30
                }
            }, {
                val: '3d-dark',
                zoombar: {
                    widthPlus: '23px',
                    widthMinus: '23px',
                    widthCenter: '23px',
                    heightPlus: '35px',
                    heightMinus: '36px',
                    heightCenter: 13,
                    heightCursor: '13px',
                    widthCursor: '23px'
                },
                search: {
                    widthLeft: 5,
                    widthRight: 44
                }
            }, {
                val: '3d-light',
                zoombar: {
                    widthPlus: '23px',
                    widthMinus: '23px',
                    widthCenter: '23px',
                    heightPlus: '35px',
                    heightMinus: '36px',
                    heightCenter: 13,
                    heightCursor: '13px',
                    widthCursor: '23px'
                },
                search: {
                    widthLeft: 5,
                    widthRight: 44
                }
            }]
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

        // Save the custom colour values here to prepopulate the popup.
        this.customColourValues = {
            bg: null,
            title: null,
            header: null,
            iconCsl: null
        };

        this.maxColourValue = 255;
        this.minColourValue = 0;
    }, {
        __templates: {
            colours: '<div id="publisher-layout-colours">' + '<label for="publisher-colours"></label>' + '<div id="publisher-layout-coloursSelector">' + '<input type="text" name="publisher-colour" disabled />' + '<button id="publisher-colours"></button>' + '</div>' + '</div>',
            fonts: '<div id="publisher-layout-fonts">' + '<label for="publisher-fonts"></label>' + '<select name="publisher-fonts"></select>' + '</div>',
            toolStyles: '<div id="publisher-layout-toolStyles">' + '<label for="publisher-toolStyles"></label>' + '<select name="publisher-toolStyles"></select>' + '</div>',
            option: '<option></option>',
            inputRadio: '<div><input type="radio" /><label></label></div>',
            coloursPopup: '<div id="publisher-colour-popup">' + '<div id="publisher-colour-inputs"></div>' + '<div id="publisher-colour-preview"></div>' + '</div>',
            customClrs: '<div id="publisher-custom-colours">' + '<div id="publisher-custom-colours-bg"></div>' + '<div id="publisher-custom-colours-title"></div>' + '<div id="publisher-custom-colours-header"></div>' + '<div id="publisher-custom-colours-iconcls"></div>' + '</div>',
            rgbInput: '<div class="rgbInput">' + '<label for="red">R</label><input type="text" name="red" maxlength="3" />' + '<label for="green">G</label><input type="text" name="green" maxlength="3" />' + '<label for="blue">B</label><input type="text" name="blue" maxlength="3" />' + '</div>',
            iconClsInput: '<div class="iconClsInput">' + '<input type="radio" name="custom-icon-class" value="icon-close" /><label for="icon-close"></label>' + '<input type="radio" name="custom-icon-class" value="icon-close-white" /><label for="icon-close-white"></label>' + '</div>'
        },

        /**
         * Creates the DOM elements for layout change components and
         * prepopulates the fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data (optional)
         */
        init: function (pData) {
            var me = this,
                iData = pData || {},
                f,
                field,
                template;

            // Set the initial values
            me.values = {
                colourScheme: iData.colourScheme,
                font: iData.font,
                toolStyle: iData.toolStyle
            };

            // "Precompile" the templates
            for (f in me.fields) {
                if (me.fields.hasOwnProperty(f)) {
                    field = me.fields[f];
                    template = field.getContent.apply(me, arguments);
                    field.content = template;
                }
            }

            if (pData !== null && pData !== undefined) {
                me._prepopulateCustomColours(pData.colourScheme);
                me._sendFontChangedEvent(me.values.font);
                me._sendColourSchemeChangedEvent(me.values.colourScheme);
                me._sendToolStyleChangedEvent(me._getItemByCode(me.values.toolStyle, me.initialValues.toolStyles));
            }
        },

        /**
         * For now, only closes popups if they're visible.
         *
         * @method stop
         * @return {undefined}
         */
        stop: function () {
            this._closePopups();
        },

        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                f,
                field,
                template;

            panel.setTitle(this.loc.layout.label);

            for (f in this.fields) {
                if (this.fields.hasOwnProperty(f)) {
                    field = this.fields[f];
                    contentPanel.append(field.content);
                }
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
        getValues: function () {
            var colourCode = jQuery('input[name=publisher-colour]').attr('data-colour-code');
            this.values.colourScheme = this._getItemByCode(colourCode, this.initialValues.colours);
            this.values.font = jQuery('select[name=publisher-fonts]').val();
            var toolStyleCode = jQuery('select[name=publisher-toolStyles]').val();
            this.values.toolStyle = this._getItemByCode(toolStyleCode, this.initialValues.toolStyles);
            return this.values;
        },

        /**
         * Closes the popups if they are open on the screen.
         *
         * @method _closePopups
         * @return {undefined}
         */
        _closePopups: function () {
            if (this._colourSchemePopup) {
                this._colourSchemePopup.close(true);
            }
            if (this._customColoursPopup) {
                this._customColoursPopup.close(true);
            }

            this._colourSchemePopup = null;
            this._customColoursPopup = null;
        },

        /**
         * @method _getColoursTemplate
         * @return {jQuery} the colours template
         */
        _getColoursTemplate: function () {
            var self = this,
                template = this.template.colours.clone(),
                selectedColour = this.values.colourScheme || {},
                colourName = this.loc.layout.fields.colours[selectedColour.val],
                colourLabel = this.loc.layout.fields.colours.label,
                colourPlaceholder = this.loc.layout.fields.colours.placeholder,
                buttonLabel = this.loc.layout.fields.colours.buttonLabel;

            // Set the localizations.
            template.find('label').html(colourLabel);

            // Set the button handler
            template.find('button').html(buttonLabel).on('click', function (e) {
                self._openColourDialog(jQuery(this));
            });

            // Prepopulate data
            template.find('input[name=publisher-colour]').attr('placeholder', colourPlaceholder).val(colourName);

            return template;
        },

        /**
         * @method _getFontsTemplate
         * @return {jQuery} the fonts template
         */
        _getFontsTemplate: function () {
            var self = this,
                template = this.template.fonts.clone(),
                fontLabel = this.loc.layout.fields.fonts.label,
                fonts = this.initialValues.fonts,
                fLen = fonts.length,
                fontOption,
                i,
                selectedFont;

            // Set the localization.
            template.find('label').html(fontLabel).after('<br />');

            for (i = 0; i < fLen; ++i) {
                fontOption = this.template.option.clone();
                fontOption.attr({
                    value: fonts[i].val
                }).html(fonts[i].name);
                template.find('select').append(fontOption);
            }

            // Set the select change handler.
            template.find('select').on('change', function (e) {
                // Send an event notifying the plugins that the font has changed.
                selectedFont = jQuery(this).val();
                self._sendFontChangedEvent(selectedFont);
            });

            // Prepopulate data
            jQuery(template.find('select option')).filter(function () {
                return (jQuery(this).val() === self.values.font);
            }).prop('selected', 'selected');

            return template;
        },

        /**
         * @method _getToolStylesTemplate
         * @return {jQuery} the tool styles template
         */
        _getToolStylesTemplate: function () {
            var self = this,
                template = this.template.toolStyles.clone(),
                toolStylesLabel = this.loc.layout.fields.toolStyles.label,
                toolStyles = this.initialValues.toolStyles,
                tsLen = toolStyles.length,
                toolStyleOption,
                toolStyleName,
                i,
                selectedToolStyleCode,
                selectedToolStyle;

            // Set the localizations.
            template.find('label').html(toolStylesLabel).after('<br />');

            for (i = 0; i < tsLen; ++i) {
                toolStyleOption = this.template.option.clone();
                toolStyleName = this.loc.layout.fields.toolStyles[toolStyles[i].val];
                toolStyleOption.attr({
                    value: toolStyles[i].val
                }).html(toolStyleName);
                template.find('select').append(toolStyleOption);
            }

            // Set the select change handler.
            template.find('select').on('change', function (e) {
                // Send an event notifying the plugins that the style has changed.
                selectedToolStyleCode = jQuery(this).val();
                selectedToolStyle = self._getItemByCode(selectedToolStyleCode, self.initialValues.toolStyles);
                self._sendToolStyleChangedEvent(selectedToolStyle);
            });

            // Prepopulate data
            jQuery(template.find('select option')).filter(function () {
                return (self.values.toolStyle && jQuery(this).val() === self.values.toolStyle);
            }).prop('selected', 'selected');

            return template;
        },

        /**
         * Creates and opens the dialog from which to choose the colour scheme.
         * Also handles the creation of the sample gfi popup.
         *
         * @method _openColourDialog
         */
        _openColourDialog: function (target) {
            var self = this,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                title = this.loc.layout.popup.title,
                content = this.template.coloursPopup.clone(),
                colours = this.initialValues.colours,
                cLen = colours.length,
                colourInput,
                colourName,
                i,
                prevColour = self.values.colourScheme,
                selectedColour,
                customColourButton;

            closeButton.setTitle(this.loc.layout.popup.close);
            closeButton.setHandler(function () {
                popup.close(true);
                self._colourSchemePopup = null;
            });

            // Create the preview GFI dialog.
            content.find('div#publisher-colour-preview').append(self._createGfiPreview());

            // Append the colour scheme inputs to the dialog.
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
                if (prevColour && prevColour.val === colours[i].val || (!prevColour && colours[i].val === 'dark_grey')) {
                    colourInput.find('input[type=radio]').attr('checked', 'checked');
                    self._changeGfiColours(colours[i], content);
                }

                content.find('div#publisher-colour-inputs').append(colourInput);

                // Create the inputs for custom colour
                if ('custom' === colours[i].val) {
                    customColourButton = jQuery('<button>' + this.loc.layout.fields.colours.buttonLabel + '</button>');
                    // FIXME don't create functions inside a loop
                    customColourButton.click(function () {
                        colourInput.find('input[type=radio]').attr('checked', 'checked');
                        self._createCustomColoursPopup();
                    });
                    content.find('div#publisher-colour-inputs').append(customColourButton);
                }
            }

            // Things to do when the user changes the colour scheme:
            content.find('input[name=colour]').change(function (e) {
                selectedColour = self._getItemByCode(jQuery(this).val(), self.initialValues.colours);
                // * change the preview gfi
                self._changeGfiColours(selectedColour, content);
                // * change the value of the colour scheme input in the layout panel
                colourName = self.loc.layout.fields.colours[selectedColour.val];
                jQuery('div.basic_publisher').find('input[name=publisher-colour]').val(colourName).attr('data-colour-code', selectedColour.val);
                self.values.colourScheme = selectedColour;
                // * notify others of the changed colour scheme
                self._sendColourSchemeChangedEvent(selectedColour);
            });

            //popup.moveTo(target);
            popup.show(title, content, [closeButton]);
            this._colourSchemePopup = popup;
        },

        /**
         * Creates a popup from which custom colour scheme can be defined.
         *
         * @method _createCustomColoursPopup
         * @return {undefined}
         */
        _createCustomColoursPopup: function () {
            var self = this,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                title = this.loc.layout.fields.colours.custom,
                content = this._createCustomColoursInputs(),
                customColours;

            closeButton.setTitle(this.loc.layout.popup.close);
            closeButton.setHandler(function () {
                self._collectCustomColourValues(content);
                // Change the preview gfi and send event only if currently checked
                if (jQuery('div#publisher-colour-inputs input#custom').attr('checked')) {
                    customColours = self._getItemByCode('custom', self.initialValues.colours);
                    // Change the colours of the preview popup
                    self._changeGfiColours(customColours);
                    // Send an event notifying the changed colours
                    self._sendColourSchemeChangedEvent(customColours);
                }
                popup.close(true);
                self._customColoursPopup = null;
            });

            popup.show(title, content, [closeButton]);
            this._customColoursPopup = popup;
        },

        /**
         * Creates the inputs for putting in your favourite colours.
         *
         * @method _createCustomColoursInputs
         * @return {jQuery} return the template to select custom colours
         */
        _createCustomColoursInputs: function () {
            var self = this,
                template = this.template.customClrs.clone(),
                bgInputs = this.template.rgbInput.clone(),
                bgLoc = this.loc.layout.fields.colours.customLabels.bgLabel,
                titleInputs = this.template.rgbInput.clone(),
                titleLoc = this.loc.layout.fields.colours.customLabels.titleLabel,
                headerInputs = this.template.rgbInput.clone(),
                headerLoc = this.loc.layout.fields.colours.customLabels.headerLabel,
                iconClsInputs = this.template.iconClsInput.clone(),
                iconClsLoc = this.loc.layout.fields.colours.customLabels.iconLabel,
                iconCloseLoc = this.loc.layout.fields.colours.customLabels.iconCloseLabel,
                iconCloseWhiteLoc = this.loc.layout.fields.colours.customLabels.iconCloseWhiteLabel,
                rgbValue;

            iconClsInputs.find('label[for=icon-close]').html(iconCloseLoc);
            iconClsInputs.find('label[for=icon-close-white]').html(iconCloseWhiteLoc);

            template.find('div#publisher-custom-colours-bg').append(bgLoc).append(bgInputs);
            template.find('div#publisher-custom-colours-title').append(titleLoc).append(titleInputs);
            template.find('div#publisher-custom-colours-header').append(headerLoc).append(headerInputs);
            template.find('div#publisher-custom-colours-iconcls').append(iconClsLoc).append(iconClsInputs);

            this._prepopulateCustomColoursTemplate(template);

            template.find('input[type=text]').change(function () {
                // If the value is not a number or is out of range (0-255), set the value to proper value.
                rgbValue = jQuery(this).val();
                if (isNaN(rgbValue) || (rgbValue < self.minColourValue)) {
                    jQuery(this).val(self.minColourValue);
                } else if (rgbValue > self.maxColourValue) {
                    jQuery(this).val(self.maxColourValue);
                }
            });

            return template;
        },

        /**
         * Prepopulates the custom colours template with saved colour values.
         *
         * @method  _prepopulateCustomColoursTemplate
         * @param  {jQuery} template
         * @return {undefined}
         */
        _prepopulateCustomColoursTemplate: function (template) {
            var bgInputs = template.find('div#publisher-custom-colours-bg'),
                titleInputs = template.find('div#publisher-custom-colours-title'),
                headerInputs = template.find('div#publisher-custom-colours-header'),
                iconClsInputs = template.find('div#publisher-custom-colours-iconcls'),
                customColours = this.customColourValues;

            this._prepopulateRgbDiv(bgInputs, customColours.bg);
            this._prepopulateRgbDiv(titleInputs, customColours.title);
            this._prepopulateRgbDiv(headerInputs, customColours.header);
            iconClsInputs.find('input[type=radio]').removeAttr('checked');
            var iconCls = customColours.iconCls || 'icon-close-white';
            iconClsInputs.find('input[value=' + iconCls + ']').attr('checked', 'checked');
        },

        _prepopulateCustomColours: function (colourScheme) {
            var me = this,
                ccv = {},
                customColours = me._getItemByCode('custom', this.initialValues.colours);
            if (colourScheme) {
                ccv.bg = me._getColourFromRgbString(colourScheme.bgColour);
                ccv.title = me._getColourFromRgbString(colourScheme.titleColour);
                ccv.header = me._getColourFromRgbString(colourScheme.headerColour);
                ccv.iconCls = colourScheme.iconCls;
                me.customColourValues = ccv;
                // Set the values to initial values
                customColours.bgColour = this._getCssRgb(ccv.bg);
                customColours.titleColour = this._getCssRgb(ccv.title);
                customColours.headerColour = this._getCssRgb(ccv.header);
                customColours.iconCls = ccv.iconCls;
                // Change the colours of the preview popup
                me._changeGfiColours(customColours);
                // Send an event notifying the changed colours
                me._sendColourSchemeChangedEvent(customColours);
            }
        },

        /**
         * Collects the custom colours values from the content div.
         *
         * @method _collectCustomColourValues
         * @param  {jQuery} content
         * @return {undefined}
         */
        _collectCustomColourValues: function (content) {
            var bgColours = this._getColourFromRgbDiv(content.find('div#publisher-custom-colours-bg')),
                titleColours = this._getColourFromRgbDiv(content.find('div#publisher-custom-colours-title')),
                headerColours = this._getColourFromRgbDiv(content.find('div#publisher-custom-colours-header')),
                iconCls = content.find('div#publisher-custom-colours-iconcls input[name=custom-icon-class]:checked').val(),
                customColours = this._getItemByCode('custom', this.initialValues.colours);

            // Save the values.
            this.customColourValues.bg = bgColours;
            this.customColourValues.title = titleColours;
            this.customColourValues.header = headerColours;
            this.customColourValues.iconCls = iconCls;

            // Set the values to initial values
            customColours.bgColour = this._getCssRgb(bgColours);
            customColours.titleColour = this._getCssRgb(titleColours);
            customColours.headerColour = this._getCssRgb(headerColours);
            customColours.iconCls = iconCls || 'icon-close-white';
        },

        /**
         * Prepopulates an rgb div with given values
         *
         * @method _prepopulateRgbDiv
         * @param  {jQuery} rgbDiv
         * @param  {Object} colours
         *          {
         *              red: <0-255>,
         *              green: <0-255>,
         *              blue: <0-255>
         *          }
         * @return {undefined}
         */
        _prepopulateRgbDiv: function (rgbDiv, colours) {
            if (!colours) {
                return;
            }

            rgbDiv.find('input[name=red]').val(colours.red);
            rgbDiv.find('input[name=green]').val(colours.green);
            rgbDiv.find('input[name=blue]').val(colours.blue);
        },

        /**
         * Returns an rgb colour object parsed from the div.
         *
         * @method _getColourFromRgbDiv
         * @param {jQuery} rgbDiv
         * @return {Object} returns an rgb colour object
         *          {
         *              red: <0-255>,
         *              green: <0-255>,
         *              blue: <0-255>
         *          }
         */
        _getColourFromRgbDiv: function (rgbDiv) {
            var red = rgbDiv.find('input[name=red]').val(),
                green = rgbDiv.find('input[name=green]').val(),
                blue = rgbDiv.find('input[name=blue]').val();

            red = red.length ? parseInt(red, 10) : 0;
            green = green.length ? parseInt(green, 10) : 0;
            blue = blue.length ? parseInt(blue, 10) : 0;        

            return {
                red: red,
                green: green,
                blue: blue
            };
        },

        /**
         * Returns an rgb colour object in css formatted string.
         *
         * @method _getCssRgb
         * @param  {Object} rgb
         *          {
         *              red: <0-255>,
         *              green: <0-255>,
         *              blue: <0-255>
         *          }
         * @return {String}
         */
        _getCssRgb: function (rgb) {
            return 'rgb(' + rgb.red + ', ' + rgb.green + ', ' + rgb.blue + ')';
        },

        /**
         * Returns an rgb colour object parsed from the string.
         *
         * @method _getColourFromRgbString
         * @param {String} rgbString hex from premade scheme or css style rgb(r,g,b) as in custom scheme
         * @return {Object} returns an rgb colour object - defaults to 0,0,0 if parse fails
         *          {
         *              red: <0-255>,
         *              green: <0-255>,
         *              blue: <0-255>
         *          }
         */
        _getColourFromRgbString: function (rgbString) {
            var rgb = [0,0,0];
            if(rgbString && rgbString.length > 1) {
                if(rgbString.charAt(0) === '#' && rgbString.length === 7) {
                    // assume hexcolor as in premade schemes
                    var red = rgbString.substring(1,3);
                    var green = rgbString.substring(3,5);
                    var blue = rgbString.substring(5,7);
                    rgb[0] = parseInt(red, 16);
                    rgb[1] = parseInt(green, 16);
                    rgb[2] = parseInt(blue, 16);
                }
                else {
                    // assume rgb(x,y,z) as in custom schemes
                    var start = rgbString.indexOf('('),
                        end = rgbString.indexOf(')');
                    if (start > -1 && end > -1 && end > start) {
                        var parsed = rgbString.substring(start + 1, end).split(/\s*,\s*/);
                        if (rgb.length === 3) {
                            rgb = parsed;
                        }
                    }   
                }
            }
            return {
                'red' : rgb[0],
                'green' : rgb[1],
                'blue' : rgb[2]
            };
        },

        /**
         * Creates the sample gfi where the user can see the effects of the chosen colour scheme.
         *
         * @method _createGfiPreview
         * @return {jQuery} returns the sample gfi
         */
        _createGfiPreview: function () {
            // Example data
            var title = this.loc.layout.popup.gfiDialog.title,
                featureName = this.loc.layout.popup.gfiDialog.featureName,
                featureDesc = this.loc.layout.popup.gfiDialog.featureDesc,
                linkUrl = this._publisher.urlBase + Oskari.getLang();
            // Templates
            // FIXME get GFI template from GFI plugin
            var dialogContent = jQuery('<div></div>'),
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
                'width': '320px'
            });

            popupDataContent.find('h3.myplaces_header').html(featureName);
            popupDataContent.find('p.myplaces_desc').html(featureDesc);
            popupDataContent.find('a.myplaces_link').html(linkUrl).attr('href', linkUrl);
            contentDiv.append(popupDataContent);
            contentDiv.css({
                'margin-left': '0px',
                'height': '120px'
            });
            contentWrapper.append(contentDiv);
            contentWrapper.css({
                'width': '320px'
            });

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
        _changeGfiColours: function (selectedColour, container) {
            container = container || jQuery('div#publisher-colour-popup');

            var gfiHeader = container.find('div.popupHeader'),
                gfiTitle = container.find('div.popupTitle'),
                featureHeader = container.find('h3.myplaces_header'),
                closeButton = container.find('div.olPopupCloseBox');

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
        _sendColourSchemeChangedEvent: function (colourScheme) {
            this._sendEvent('Publisher.ColourSchemeChangedEvent', colourScheme);
        },

        /**
         * Sends an event to notify interested parties that the font has changed.
         *
         * @method _sendFontChangedEvent
         * @param {String} font the changed font value
         */
        _sendFontChangedEvent: function (font) {
            this._sendEvent('Publisher.FontChangedEvent', font);
        },

        /**
         * Sends an event to notify interested parties that the tool style has changed.
         *
         * @method _sendToolStyleChangedEvent
         * @param {Object} the changed tool style
         */
        _sendToolStyleChangedEvent: function (selectedToolStyle) {
            this._sendEvent('Publisher.ToolStyleChangedEvent', selectedToolStyle || {val: 'default', zoombar: {}, search: {}});
        },

        /**
         * "Sends" an event, that is, notifies other components of something.
         *
         * @method _sendEvent
         * @param {String} eventName the name of the event
         * @param {Whatever} eventData the data we want to send with the event
         */
        _sendEvent: function (eventName, eventData) {
            var eventBuilder = this._sandbox.getEventBuilder(eventName),
                evt;

            if (eventBuilder) {
                evt = eventBuilder(eventData);
                this._sandbox.notifyAll(evt);
            }
        },

        /**
         * Retrieves the item from the list which value matches the code given
         * or null if not found on the list.
         *
         * @method _getItemByCode
         * @param {String} code
         * @param {Array[Object]} list
         * @return {Object/null}
         */
        _getItemByCode: function (code, list) {
            var listLen = list.length,
                i;

            for (i = 0; i < listLen; ++i) {
                if (list[i].val === code) {
                    return list[i];
                }
            }
            return null;
        }
    });