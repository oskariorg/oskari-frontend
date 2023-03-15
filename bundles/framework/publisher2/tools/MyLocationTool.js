Oskari.clazz.define('Oskari.mapframework.publisher.tool.MyLocationTool',
    function () {
    }, {
        index: 4,
        lefthanded: 'top left',
        righthanded: 'top right',

        defaultExtraOptions: {
            mode: 'single',
            centerMapAutomatically: false,
            mobileOnly: false
        },
        templates: {
            toolOptions: '<div class="tool-options mylocationplugin"></div>',
            toolOptionTitle: '<div class="tool-option-title"></div>'
        },
        options: {
            mode: [
                {
                    id: 'single'
                },
                {
                    id: 'continuous'
                }
            ]
        },
        selected: {
            mode: null,
            mobileOnly: null,
            centerMapAutomatically: null
        },
        pluginSelected: false,

        /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
                title: 'MyLocationPlugin',
                config: this.state.pluginConfig || {}
            };
        },
        /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
        getValues: function () {
            if (!this.isEnabled()) {
                return null;
            }
            const pluginConfig = this.getPlugin().getConfig();

            // add selected extraoptions to conf
            for (var key in this.selected) {
                if (this.selected.hasOwnProperty(key)) {
                    pluginConfig[key] = this.selected[key];
                }
            }

            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: pluginConfig }]
                        }
                    }
                }
            };
        },
        /**
     * Get extra options.
     * @method getExtraOptions
     * @public
     *
     * @returns {Object} jQuery element
     */
        getExtraOptions: function (toolContainer) {
            var me = this;
            var template = jQuery(me.templates.toolOptions).clone();
            var titleTemplate = jQuery(me.templates.toolOptionTitle);

            for (var fkey in me.fields) {
                if (me.fields.hasOwnProperty(fkey)) {
                    var data = me.fields[fkey];
                    var field = Oskari.clazz.create(data.clazz);
                    field.setName(fkey);
                    if (data.options) {
                        field.setOptions(data.options);
                    }
                    if (data.handler) {
                        field.setHandler(data.handler);
                    }
                    if (data.placeholder && typeof field.setPlaceHolder === 'function') {
                        field.setPlaceHolder(data.placeholder);
                    }

                    if (data.clazz === 'Oskari.userinterface.component.RadioButtonGroup') {
                        if (data.title) {
                            var title = titleTemplate.clone();
                            title.append(data.title);
                            template.append(title);

                            if (data.value) {
                                field.setValue(data.value);
                            }
                        }
                    } else if (data.clazz === 'Oskari.userinterface.component.CheckboxInput') {
                        if (data.title) {
                            field.setTitle(data.title);
                        }
                        if (data.value) {
                            field.setChecked(data.value === true);
                        }
                    }

                    template.append(field.getElement());
                }
            }
            return template;
        },
        /**
        * Initialize tool
        * Override if tool is not mapfull plugin
        * @method init
        * @public
        */
        init: function (data) {
            var me = this;
            var loc = Oskari.getLocalization('Publisher2').BasicView.maptools;

            const plugin = this.findPluginFromInitData(data);
            if (plugin) {
                this.storePluginConf(plugin.config || this.defaultExtraOptions);
                this.setEnabled(true);
            }
            var config = this.state.pluginConfig || {};

            // initial selections if modify.
            var mode = config.mode || this.defaultExtraOptions.mode;
            var selectedOption = this.options.mode.find((option) => option.id === mode);
            if (selectedOption) {
                this.selected.mode = selectedOption.id;
            }
            this.selected.mobileOnly = config.mobileOnly || this.defaultExtraOptions.mobileOnly;
            this.selected.centerMapAutomatically = config.centerMapAutomatically || this.defaultExtraOptions.centerMapAutomatically;

            // initialise fields only after it's certain which option is selected (new / modify)
            this.fields = {
                mode: {
                    clazz: 'Oskari.userinterface.component.RadioButtonGroup',
                    handler: function (value) {
                        me.selected.mode = value;
                    },
                    options: me.options.mode.map(function (option) {
                        var title = loc.mylocation.modes[option.id];

                        return {
                            title: title,
                            value: option.id
                        };
                    }),
                    value: me.selected.mode,
                    title: loc.mylocation.titles.mode
                },
                centerMapAutomatically: {
                    clazz: 'Oskari.userinterface.component.CheckboxInput',
                    handler: function (checked) {
                        me.selected.centerMapAutomatically = (checked === 'on');
                    },
                    title: loc.mylocation.titles.centerMapAutomatically,
                    value: me.selected.centerMapAutomatically
                },
                mobileOnly: {
                    clazz: 'Oskari.userinterface.component.CheckboxInput',
                    handler: function (checked) {
                        me.selected.mobileOnly = (checked === 'on');
                        var plugin = me.getPlugin();
                        plugin.teardownUI();
                        var enabled = plugin.isEnabled(me.selected.mobileOnly);
                        if (enabled) {
                            plugin.redrawUI(Oskari.util.isMobile());
                        }
                    },
                    value: me.selected.mobileOnly,
                    title: loc.mylocation.titles.mobileOnly
                }
            };
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
