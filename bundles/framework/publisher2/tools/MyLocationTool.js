Oskari.clazz.define('Oskari.mapframework.publisher.tool.MyLocationTool',
    function () {
    }, {
        index: 4,
        allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
        lefthanded: 'top left',
        righthanded: 'top right',
        allowedSiblings: [
            'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar'
        ],

        groupedSiblings: true,
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
                config: {}
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
            var me = this;

            if (me.state.enabled) {
                var pluginConfig = this.getPlugin().getConfig();

                // add selected extraoptions to conf
                for (var key in me.selected) {
                    if (me.selected.hasOwnProperty(key)) {
                        pluginConfig[key] = me.selected[key];
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
            } else {
                return null;
            }
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
        init: function (pdata) {
            var me = this;
            var loc = Oskari.getLocalization('Publisher2').BasicView.maptools;
            var data = pdata;

            var config = {};

            if (Oskari.util.keyExists(data, 'configuration.mapfull.conf.plugins')) {
                data.configuration.mapfull.conf.plugins.forEach(function (plugin) {
                    if (me.getTool().id === plugin.id) {
                        me.setEnabled(true);
                        config = plugin.config || me.defaultExtraOptions;
                    }
                });
            }

            // initial selections if modify.
            var mode = config.mode || me.defaultExtraOptions.mode;
            var selectedOptions = me.options.mode.filter(function (option) {
                return (option.id === mode);
            });
            if (selectedOptions && selectedOptions.length) {
                me.selected.mode = selectedOptions[0].id;
            }
            me.selected.mobileOnly = config.mobileOnly || me.defaultExtraOptions.mobileOnly;
            me.selected.centerMapAutomatically = config.centerMapAutomatically || me.defaultExtraOptions.centerMapAutomatically;

            // initialise fields only after it's certain which option is selected (new / modify)
            me.fields = {
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
