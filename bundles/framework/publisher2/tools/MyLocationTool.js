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
                for(var key in me.selected) {
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

            for (fkey in me.fields) {
                if (me.fields.hasOwnProperty(fkey)) {
                    data = me.fields[fkey];
                    field = Oskari.clazz.create(data.clazz);
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

            var toolCheckbox = toolContainer.find('input').first();
            if (me.pluginSelected === true) {
                toolCheckbox.prop('checked', true);
            }
            if (toolCheckbox.is(':checked')) {
                template.show();
            } else {
                template.hide();
            }

            toolCheckbox.on('change', function () {
                var checkbox = jQuery(this);
                if (toolCheckbox.is(':checked')) {
                    template.show();
                } else {
                    template.hide();
                }
            });

            return template;
        },
        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         * @param {Object} modeChangedCB mode changed callback
         */
        init: function (pData, modeChangedCB) {
            var me = this;
            var loc = Oskari.getLocalization('Publisher2').BasicView.maptools;

            var getPlugin = function () {
                if(!pData && !pData.configuration && !pData.configuration.mapfull && !pData.configuration.mapfull.conf && !pData.configuration.mapfull.conf.plugins) {
                    return null;
                }
                var plugin = pData.configuration.mapfull.conf.plugins.filter(function(obj) { return obj.id === 'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin'});

                if (plugin.length > 0) {
                    me.pluginSelected = true;
                    return plugin[0];
                }
                return null;
            };

            var getPluginConfig = function () {
                var plugin = getPlugin();
                if(plugin !== null){
                    return plugin.config || me.defaultExtraOptions;
                }
                return me.defaultExtraOptions;
            };

            var initialConf = getPluginConfig();

            // initial mode selection if modify.
            if (initialConf && initialConf.mode) {
                var selectedOptions = me.options.mode.filter(function (option) {
                    return (option.id === initialConf.mode);
                });
                if (selectedOptions && selectedOptions.length) {
                    me.selected.mode = selectedOptions[0].id;
                }
            }
            // initial mode selection if modify.
            if (initialConf && initialConf.mobileOnly) {
                var selectedOptions = me.options.mobileOnly.filter(function (option) {
                    return (option.id === initialConf.mobileOnly);
                });
                if (selectedOptions && selectedOptions.length) {
                    me.selected.mobileOnly = selectedOptions[0].id;
                }
            }
            // initial centerMapAutomatically selection if modify.
            if (initialConf && initialConf.centerMapAutomatically) {
                me.selected.centerMapAutomatically = initialConf.centerMapAutomatically;
            }

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
