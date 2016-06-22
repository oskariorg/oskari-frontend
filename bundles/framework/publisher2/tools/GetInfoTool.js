Oskari.clazz.define('Oskari.mapframework.publisher.tool.GetInfoTool',
function() {
}, {
    index : 8,
    allowedLocations : [],
    allowedSiblings : [],

    groupedSiblings : true,

    templates: {
        colours: jQuery('<div id="publisher-layout-colours" class="tool-options">' + '<label for="publisher-colours"></label>' + '<div id="publisher-layout-coloursSelector">' + '<input type="text" name="publisher-colour" disabled />' + '<button id="publisher-colours"></button>' + '</div>' + '</div>'),
        coloursPopup: jQuery('<div id="publisher-colour-popup">' + '<div id="publisher-colour-inputs"></div>' + '<div id="publisher-colour-preview"></div>' + '</div>'),
        customClrs: jQuery('<div id="publisher-custom-colours">' + '<div id="publisher-custom-colours-bg"></div>' + '<div id="publisher-custom-colours-title"></div>' + '<div id="publisher-custom-colours-header"></div>' + '<div id="publisher-custom-colours-iconcls"></div>' + '</div>'),
        rgbInput: jQuery('<div class="rgbInput">' + '<label for="red">R</label><input type="text" name="red" maxlength="3" />' + '<label for="green">G</label><input type="text" name="green" maxlength="3" />' + '<label for="blue">B</label><input type="text" name="blue" maxlength="3" />' + '</div>'),
        iconClsInput: jQuery('<div class="iconClsInput">' + '<input type="radio" name="custom-icon-class" value="icon-close" /><label for="icon-close"></label>' + '<input type="radio" name="custom-icon-class" value="icon-close-white" /><label for="icon-close-white"></label>' + '</div>'),
        inputRadio: jQuery('<div><input type="radio" /><label></label></div>')
    },

    values: {
        colourScheme: null
    },

    initialValues: {
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
        }]
    },

    // Save the custom colour values here to prepopulate the popup.
    customColourValues: {
        bg: null,
        title: null,
        header: null,
        iconCsl: null
    },

    maxColourValue: 255,
    minColourValue: 0,
    eventHandlers: {
        'Publisher2.ToolEnabledChangedEvent': function (event) {
            var me = this;
            var tool = event.getTool();
            if (tool.getTool().id === me.getTool().id && tool.isStarted() && me.values.colourScheme) {
                me._sendColourSchemeChangedEvent(me.values.colourScheme);
            }
        }
    },
    init: function(data) {
        var me = this;
        var isConf = (data && data.configuration && data.configuration.mapfull) ? true : false;
        if (isConf && data.configuration.mapfull.conf && data.configuration.mapfull.conf.plugins) {
            var tool = this.getTool();
            _.each(data.configuration.mapfull.conf.plugins, function(plugin) {
                if (tool.id === plugin.id) {
                    if(plugin.config && plugin.config.colourScheme) {
                        me.values.colourScheme = plugin.config.colourScheme;
                        me._sendColourSchemeChangedEvent(me.values.colourScheme);
                    }
                    me.setEnabled(true);
                }
            });
        }
        for (var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.__sandbox.registerForEventByName(me, p);
            }
        }
    },
    getName: function() {
        return "Oskari.mapframework.publisher.tool.GetInfoTool";
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent: function (event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function(){
        return {
            id: 'Oskari.mapframework.mapmodule.GetInfoPlugin',
            title: 'GetInfoPlugin',
            config: {
                ignoredLayerTypes: ['WFS'],
                infoBox: false
            }
        };
    },
    /**
    * Is the tool toggled on by default.
    * @method isDefaultTool
    * @public
    *
    * @returns {Boolean} is the tool toggled on by default.
    */
    isDefaultTool: function() {
        return true;
    },

    isColourDialogOpen: false,

    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */
    setEnabled : function(enabled) {
        var me = this,
            tool = me.getTool(),
            sandbox = me.__sandbox;

        //state actually hasn't changed -> do nothing
        if (me.state.enabled !== undefined && me.state.enabled !== null && enabled === me.state.enabled) {
            return;
        }

        me.state.enabled = enabled;
        if(!me.__plugin && enabled) {
            me.__plugin = Oskari.clazz.create(tool.id, tool.config);
            me.__mapmodule.registerPlugin(me.__plugin);
        }

        if(enabled === true) {
            me.__plugin.startPlugin(me.__sandbox);
            me.__started = true;
        } else {
            if(me.__started === true) {
                me.__plugin.stopPlugin(me.__sandbox);
            }
        }

        if(enabled === true && me.state.mode !== null && me.__plugin && typeof me.__plugin.setMode === 'function'){
            me.__plugin.setMode(me.state.mode);
        }
        var event = sandbox.getEventBuilder('Publisher2.ToolEnabledChangedEvent')(me);
        sandbox.notifyAll(event);
    },

    isEnabled: function () {
        return this.state.enabled;
    },
    /**
    * Get extra options.
    * @method getExtraOptions
    * @public
    *
    * @returns {Object} jQuery element
    */
    getExtraOptions: function() {
        var me = this,
            template = me.templates.colours.clone(),
            selectedColour = me.values.colourScheme || {},
            colourName = me.__instance._localization.BasicView.layout.fields.colours[selectedColour.val],
            colourLabel = me.__instance._localization.BasicView.layout.fields.colours.label,
            colourPlaceholder = me.__instance._localization.BasicView.layout.fields.colours.placeholder,
            buttonLabel = me.__instance._localization.BasicView.layout.fields.colours.buttonLabel;

        // Set the localizations.
        template.find('label').html(colourLabel);

        // Set the button handler
        template.find('button').html(buttonLabel).on('click', function () {
            if(me.isColourDialogOpen === false) {
                me._openColourDialog(jQuery(this));
            }
        });

        // Prepopulate data
        template.find('input[name=publisher-colour]').attr('placeholder', colourPlaceholder).val(colourName);

        return template;
    },

    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        var me = this;

        if(me.state.enabled) {
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{
                                id: this.getTool().id,
                                config: {
                                    colourScheme: me.values.colourScheme || {}
                                }
                            }]
                        }
                    }
                }
            };
        } else {
            return null;
        }
    },


    /**
     * Creates and opens the dialog from which to choose the colour scheme.
     * Also handles the creation of the sample gfi popup.
     *
     * @method _openColourDialog
     */
    _openColourDialog: function () {
        var me = this,
            popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            title = me.__instance._localization.BasicView.layout.popup.title,
            content = me.templates.coloursPopup.clone(),
            colours = me.initialValues.colours,
            cLen = colours.length,
            colourInput,
            colourName,
            i,
            prevColour = me.values.colourScheme,
            selectedColour,
            customColourButton;
        closeButton.setTitle(me.__instance._localization.BasicView.layout.popup.close);
        closeButton.setHandler(function () {
            popup.close(true);
            me._colourSchemePopup = null;
            me.isColourDialogOpen = false;
        });

        // Create the preview GFI dialog.
        content.find('div#publisher-colour-preview').append(me._createGfiPreview());

        // Append the colour scheme inputs to the dialog.
        for (i = 0; i < cLen; ++i) {
            colourInput = me.templates.inputRadio.clone();
            colourName = me.__instance._localization.BasicView.layout.fields.colours[colours[i].val];

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
                me._changeGfiColours(colours[i], content);
            }

            content.find('div#publisher-colour-inputs').append(colourInput);

            // Create the inputs for custom colour
            if ('custom' === colours[i].val) {
                customColourButton = jQuery('<button>' + me.__instance._localization.BasicView.layout.fields.colours.buttonLabel + '</button>');

                customColourButton.click(function () {
                    colourInput.find('input[type=radio]').attr('checked', 'checked');
                    me._createCustomColoursPopup();
                });
                content.find('div#publisher-colour-inputs').append(customColourButton);
            }
        }

        // Things to do when the user changes the colour scheme:
        content.find('input[name=colour]').change(function () {
            selectedColour = me._getItemByCode(jQuery(this).val(), me.initialValues.colours);
            // change the preview gfi
            me._changeGfiColours(selectedColour, content);
            // change the value of the colour scheme input in the layout panel
            colourName = me.__instance._localization.BasicView.layout.fields.colours[selectedColour.val];
            jQuery('div.basic_publisher').find('input[name=publisher-colour]').val(colourName).attr('data-colour-code', selectedColour.val);
            me.values.colourScheme = selectedColour;
            // notify others of the changed colour scheme
            me._sendColourSchemeChangedEvent(selectedColour);
        });

        popup.show(title, content, [closeButton]);
        this._colourSchemePopup = popup;
        me.isColourDialogOpen = true;
    },

    /**
     * Creates the sample gfi where the user can see the effects of the chosen colour scheme.
     *
     * @method _createGfiPreview
     * @return {jQuery} returns the sample gfi
     */
    _createGfiPreview: function () {
        // Example data
        var me = this,
            title = me.__instance._localization.BasicView.layout.popup.gfiDialog.title,
            featureName = me.__instance._localization.BasicView.layout.popup.gfiDialog.featureName,
            featureDesc = me.__instance._localization.BasicView.layout.popup.gfiDialog.featureDesc,
            linkUrl = window.location;
        // Templates
        var dialogContent = jQuery('<div></div>'),
            header = jQuery('<div class="popupTitle"></div>'),
            headerWrapper = jQuery('<div class="popupHeader"></div>'),
            headerCloseButton = jQuery('<div class="olPopupCloseBox icon-close-white" style="position: absolute; top: 12px;"></div>'),
            contentDiv = jQuery('<div class="popupContent"></div>'),
            contentWrapper = jQuery('<div class="contentWrapper"></div>'),
            popupDataContent = jQuery('<div class="myplaces_wrapper"><div class="myplaces_place">' +
                '<h3 class="myplaces_header"></h3>' +
                '<p class="myplaces_desc"></p>' +
                '<img class="myplaces_img"></img>' +
                '<a class="myplaces_link" target="_blank"></a>' +
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
     * Creates a popup from which custom colour scheme can be defined.
     *
     * @method _createCustomColoursPopup
     * @return {undefined}
     */
    _createCustomColoursPopup: function () {
        var me = this,
            popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            title = me.__instance._localization.BasicView.layout.fields.colours.custom,
            content = me._createCustomColoursInputs(),
            customColours;

        closeButton.setTitle(me.__instance._localization.BasicView.layout.popup.close);
        closeButton.setHandler(function () {
            me._collectCustomColourValues(content);
            // Change the preview gfi and send event only if currently checked
            if (jQuery('div#publisher-colour-inputs input#custom').attr('checked')) {
                customColours = me._getItemByCode('custom', me.initialValues.colours);
                // Change the colours of the preview popup
                me._changeGfiColours(customColours);
                // Send an event notifying the changed colours
                me._sendColourSchemeChangedEvent(customColours);
            }
            popup.close(true);
            me._customColoursPopup = null;
        });

        popup.show(title, content, [closeButton]);
        me._customColoursPopup = popup;
    },

    /**
     * Creates the inputs for putting in your favourite colours.
     *
     * @method _createCustomColoursInputs
     * @return {jQuery} return the template to select custom colours
     */
    _createCustomColoursInputs: function () {
        var me = this,
            template = me.templates.customClrs.clone(),
            bgInputs = me.templates.rgbInput.clone(),
            layoutLoc = me.__instance._localization.BasicView.layout,
            bgLoc = layoutLoc.fields.colours.customLabels.bgLabel,
            titleInputs = me.templates.rgbInput.clone(),
            titleLoc = layoutLoc.fields.colours.customLabels.titleLabel,
            headerInputs = me.templates.rgbInput.clone(),
            headerLoc = layoutLoc.fields.colours.customLabels.headerLabel,
            iconClsInputs = me.templates.iconClsInput.clone(),
            iconClsLoc = layoutLoc.fields.colours.customLabels.iconLabel,
            iconCloseLoc = layoutLoc.fields.colours.customLabels.iconCloseLabel,
            iconCloseWhiteLoc = layoutLoc.fields.colours.customLabels.iconCloseWhiteLabel,
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
            if (isNaN(rgbValue) || (rgbValue < me.minColourValue)) {
                jQuery(this).val(me.minColourValue);
            } else if (rgbValue > me.maxColourValue) {
                jQuery(this).val(me.maxColourValue);
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
        var me = this,
            bgInputs = template.find('div#publisher-custom-colours-bg'),
            titleInputs = template.find('div#publisher-custom-colours-title'),
            headerInputs = template.find('div#publisher-custom-colours-header'),
            iconClsInputs = template.find('div#publisher-custom-colours-iconcls'),
            customColours = me.customColourValues;

        this._prepopulateRgbDiv(bgInputs, customColours.bg);
        this._prepopulateRgbDiv(titleInputs, customColours.title);
        this._prepopulateRgbDiv(headerInputs, customColours.header);
        iconClsInputs.find('input[type=radio]').removeAttr('checked');
        var iconCls = customColours.iconCls || 'icon-close-white';
        iconClsInputs.find('input[value=' + iconCls + ']').attr('checked', 'checked');
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
     * Collects the custom colours values from the content div.
     *
     * @method _collectCustomColourValues
     * @param  {jQuery} content
     * @return {undefined}
     */
    _collectCustomColourValues: function (content) {
        var me = this,
            bgColours = me._getColourFromRgbDiv(content.find('div#publisher-custom-colours-bg')),
            titleColours = me._getColourFromRgbDiv(content.find('div#publisher-custom-colours-title')),
            headerColours = me._getColourFromRgbDiv(content.find('div#publisher-custom-colours-header')),
            iconCls = content.find('div#publisher-custom-colours-iconcls input[name=custom-icon-class]:checked').val(),
            customColours = this._getItemByCode('custom', me.initialValues.colours);

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
     * Sends an event to notify interested parties that the colour scheme has changed.
     *
     * @method _sendColourSchemeChangedEvent
     * @param {Object} colourScheme the changed colour scheme
     */
    _sendColourSchemeChangedEvent: function (colourScheme) {
        this._sendEvent('Publisher.ColourSchemeChangedEvent', colourScheme);
        this._sendEvent('Publisher2.ColourSchemeChangedEvent', colourScheme);
    },

    /**
     * "Sends" an event, that is, notifies other components of something.
     *
     * @method _sendEvent
     * @param {String} eventName the name of the event
     * @param {Whatever} eventData the data we want to send with the event
     */
    _sendEvent: function (eventName, eventData) {
        var eventBuilder = this.__sandbox.getEventBuilder(eventName),
            evt;

        if (eventBuilder) {
            evt = eventBuilder(eventData);
            this.__sandbox.notifyAll(evt);
        }
    },
    /**
    * Stop tool.
    * @method stop
    * @public
    */
    stop: function(){
        var me = this;
        if(me.__plugin) {
            if (me.__sandbox && me.__plugin.getSandbox()) {
                me.__plugin.stopPlugin(me.__sandbox);
            }
            me.__mapmodule.unregisterPlugin(me.__plugin);
        }
        for (var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me.__sandbox.unregisterFromEventByName(me, p);
            }
        }
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});