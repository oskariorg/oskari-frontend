/**
 * @class Oskari.mapframework.bundle.publisher.view.PanelToolLayout
 *
 * Represents a tool layout panel (lefthanded / righthanded / custom) for the publisher as an Oskari.userinterface.component.AccordionPanel.
 * Allows the user to change the positioning of the tools on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelLayout',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} mapmodule
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.instance} instance the instance
     */
    function (sandbox, mapmodule, localization, instance) {
        var me = this;
        me.loc = localization;
        me.instance = instance;
        me.sandbox = sandbox;
        // The values to be sent to plugins to actually change the style.
        me.initialValues = {
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
        me.fields = {
            'fonts': {
                'label': me.loc.layout.fields.fonts.label,
                'getContent': me._getFontsTemplate
            },
            'toolStyles': {
                'label': me.loc.layout.fields.toolStyles.label,
                'getContent': me._getToolStylesTemplate
            }
        };

        me.__templates = {
            fonts: '<div id="publisher-layout-fonts">' + '<label for="publisher-fonts"></label>' + '<select name="publisher-fonts"></select>' + '</div>',
            toolStyles: '<div id="publisher-layout-toolStyles">' + '<label for="publisher-toolStyles"></label>' + '<select name="publisher-toolStyles"></select>' + '</div>',
            option: '<option></option>',
            inputRadio: '<div><input type="radio" /><label></label></div>',
            iconClsInput: '<div class="iconClsInput">' + '<input type="radio" name="custom-icon-class" value="icon-close" /><label for="icon-close"></label>' + '<input type="radio" name="custom-icon-class" value="icon-close-white" /><label for="icon-close-white"></label>' + '</div>'
        };

        this.template = {};
        var t;
        for (t in this.__templates) {
            if (this.__templates.hasOwnProperty(t)) {
                this.template[t] = jQuery(this.__templates[t]);
            }
        }



    }, {
        /**
         * Creates the DOM elements for layout change components and
         * prepopulates the fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data (optional)
         */
        init: function (pData) {
            var me = this,
                iData = pData || null;

            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }

            // Set the initial values
            me.values = {
                style: {
                    font: iData ? iData.font : me.initialValues.fonts[0],
                    toolStyle: iData ? iData.toolStyle : me.initialValues.toolStyles[0]
                }
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
                me._sendFontChangedEvent(me.values.style.font);
                me._sendToolStyleChangedEvent(me._getItemByCode(me.values.style.toolStyle, me.initialValues.toolStyles));
            }

            if (!me.panel) {
            	me.panel = me._populateLayoutPanel();
            }
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            if (!this.panel) {
	            this._populateLayoutPanel();
            }
            return this.panel;
        },
        /**
         * Returns the selections the user has done with the form inputs.
         * {
         *     font : <selected font (string)>,
         *     toolStyle : <selected toolStyle (string)>
         * }
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var me = this;
            var toolStyleCode = jQuery('select[name=publisher-toolStyles]').val();
            me.values = {
                style: {
                    font: jQuery('select[name=publisher-fonts]').val(),
                    toolStyle: this._getItemByCode(toolStyleCode, this.initialValues.toolStyles)
                }
            };

            return me.values;
        },
        _populateLayoutPanel: function() {
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                f,
                field;

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
         * Sends an event to notify interested parties that the font has changed.
         *
         * @method _sendFontChangedEvent
         * @param {String} font the changed font value
         */
        _sendFontChangedEvent: function (font) {
            this._sendEvent('Publisher2.FontChangedEvent', font);
        },

        /**
         * Sends an event to notify interested parties that the tool style has changed.
         *
         * @method _sendToolStyleChangedEvent
         * @param {Object} the changed tool style
         */
        _sendToolStyleChangedEvent: function (selectedToolStyle) {
            this._sendEvent('Publisher2.ToolStyleChangedEvent', selectedToolStyle || {val: 'default', zoombar: {}, search: {}});
        },
        /**
         * "Sends" an event, that is, notifies other components of something.
         *
         * @method _sendEvent
         * @param {String} eventName the name of the event
         * @param {Whatever} eventData the data we want to send with the event
         */
        _sendEvent: function (eventName, eventData) {
            var me = this,
            	eventBuilder = me.sandbox.getEventBuilder(eventName),
                evt;

            if (eventBuilder) {
                evt = eventBuilder(eventData);
                me.sandbox.notifyAll(evt);
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
	}
);