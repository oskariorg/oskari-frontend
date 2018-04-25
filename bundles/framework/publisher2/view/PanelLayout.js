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
        me.mapModule = mapmodule;
        me._originalToolStyle = null;
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
        eventHandlers: {
            'Publisher2.ToolEnabledChangedEvent': function (event) {
                if (event.getTool().state.enabled) {
                    this._changeMapModuleToolstyle();
                }
            }
        },
        /**
         * @method getName
         * @return {String} the name of the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelLayout';
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
         * Creates the DOM elements for layout change components and
         * prepopulates the fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data (optional)
         */
        init: function (pData) {
            var me = this;
            me.data = pData || null;

            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }

            // Set the initial values

            me.values = {
                metadata: {
                    style: {
                        font: me.data && me.data.metadata && me.data.metadata.style && me.data.metadata.style.font ? me.data.metadata.style.font : me.initialValues.fonts[0],
                        toolStyle: me.data && me.data.metadata && me.data.metadata.style ? me.data.metadata.style.toolStyle : me.initialValues.toolStyles[0]
                    }
                }
            };

            // "Precompile" the templates
            for (var f in me.fields) {
                if (me.fields.hasOwnProperty(f)) {
                    var field = me.fields[f];
                    var template = field.getContent.apply(me, arguments);
                    field.content = template;
                }
            }
            me._originalToolStyle = me.mapModule.getToolStyle();
            if (me.data.metadata) {
                me._changeMapModuleToolstyle(me.data.metadata.style);
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

            //metadata currently saved to two places. The publisher uses the values from metadata to restore a published map's state whereas a published map itself uses
            //the values stored under mapfull's conf.
            me.values = {
                metadata: {
                    style: {
                        font: jQuery('select[name=publisher-fonts]').val() ? jQuery('select[name=publisher-fonts]').val() : null,
                        toolStyle: jQuery('select[name=publisher-toolStyles]').val() ? jQuery('select[name=publisher-toolStyles]').val() : null
                    }
                }
            };
            return me.values;
        },
        _changeMapModuleToolstyle: function (style) {
            var me = this;

            if (!style) {
                style = me.getValues().metadata.style;
            }
            me.mapModule.changeToolStyle(style);
        },
        _populateLayoutPanel: function () {
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            var contentPanel = panel.getContainer();
            var field;

            panel.setTitle(this.loc.layout.label);
            for (var f in this.fields) {
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
            var me = this,
                template = this.template.fonts.clone(),
                fontLabel = this.loc.layout.fields.fonts.label,
                fonts = this.initialValues.fonts,
                fLen = fonts.length,
                fontOption,
                i;
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
                me._changeMapModuleToolstyle();
            });

            // Prepopulate data
            jQuery(template.find('select option')).filter(function () {
                return (jQuery(this).val() === me.values.metadata.style.font);
            }).prop('selected', 'selected');

            return template;
        },

        /**
         * @method _getToolStylesTemplate
         * @return {jQuery} the tool styles template
         */
        _getToolStylesTemplate: function () {
            var me = this;
            var template = this.template.toolStyles.clone();
            var toolStylesLabel = this.loc.layout.fields.toolStyles.label;

            // Set the localizations.
            template.find('label').html(toolStylesLabel).after('<br />');
            var styleSelect = template.find('select');
            // add options
            this.initialValues.toolStyles.forEach(function (toolStyle) {
                var toolStyleOption = me.template.option.clone();
                var toolStyleName = me.loc.layout.fields.toolStyles[toolStyle.val];
                toolStyleOption.attr({
                    value: toolStyle.val
                }).html(toolStyleName);
                // add as option
                styleSelect.append(toolStyleOption);
            });
            // Set the select change handler.
            styleSelect.on('change', function (e) {
                me._changeMapModuleToolstyle();
            });

            // Prepopulate data
            jQuery(template.find('select option')).filter(function () {
                return (me.values.metadata.style.toolStyle && jQuery(this).val() === me.values.metadata.style.toolStyle);
            }).prop('selected', 'selected');

            return template;
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
            return list.find(function (item) {
                return item.val === code;
            });
        },
        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function () {
            var me = this;
            Object.keys(me.eventHandlers).forEach(function (eventName) {
                me.sandbox.unregisterFromEventByName(me, eventName);
            });
            // change the mapmodule toolstyle back to normal
            me.mapModule.changeToolStyle({ toolStyle: me._originalToolStyle });
        }
    }
);
