Oskari.clazz.define('Oskari.mapframework.publisher.tool.ToolbarTool',
    function () {
    }, {
        index: 3,
        allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
        allowedSiblings: ['Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
        ],


        groupedSiblings: false,
        //user's own layers (not id's)
        myplaces: [],

// defaultStateConfigs stores the default state values, which is used when reset configs
        defaultStateConfigs: {
            'toolbarConfig': {},
            'publishedmyplaces2Config': {
                'toolbarId': 'PublisherToolbar',
                'layer': null,
                'myplaces': {
                    'point': false,
                    'line': false,
                    'area': false
                }
            }
        },

// presetStateConfigs stores the preselected values which are different from the default values
        presetStateConfigs: {
            'toolbarConfig': {
                'toolbarId': 'PublisherToolbar',
                'defaultToolbarContainer': '.publishedToolbarContent',
                'hasContentContainer': true,
                'classes': {}
            },
            'publishedmyplaces2Config': {
                'toolbarId': 'PublisherToolbar',
                'layer': null, // cannot be selected in advance, so it is selected in _updateDrawLayerSelection
                'myplaces': {
                    'point': true,
                    'line': true,
                    'area': true
                }
            }
        },
// toolbarConfig stores the current state
        toolbarConfig: {},
// publishedmyplaces2Config stores the current state
        publishedmyplaces2Config: undefined,

        buttonGroups: [{
            'name': 'history',
            'buttons': {
                'history_back': {
                    iconCls: 'tool-history-back-dark',
                    prepend: true,
                    disabled: true,
                    callback: function () {
                    }
                },
                'history_forward': {
                    iconCls: 'tool-history-forward-dark',
                    disabled: true,
                    callback: function () {
                    }
                }
            }
        }, {
            'name': 'basictools',
            'buttons': {
                'measureline': {
                    iconCls: 'tool-measure-line-dark',
                    disabled: true,
                    sticky: true,
                    callback: function () {
                    }
                },
                'measurearea': {
                    iconCls: 'tool-measure-area-dark',
                    disabled: true,
                    sticky: true,
                    callback: function () {
                    }
                }
            }
        }, {
            'name': 'myplaces',
            'buttons': {
                'point': {
                    iconCls: 'myplaces-draw-point',
                    disabled: true,
                    sticky: true,
                    callback: function () {
                    }
                },
                'line': {
                    iconCls: 'myplaces-draw-line',
                    disabled: true,
                    sticky: true,
                    callback: function () {
                    }
                },
                'area': {
                    iconCls: 'myplaces-draw-area',
                    disabled: true,
                    sticky: true,
                    callback: function () {
                    }
                }

            }
        }],
        templates: {
            'toolOptions': '<div class="tool-options"></div>',
            'toolOption': '<div class="tool-option"><label><input type="checkbox" /></label></div>',
            'toolOptionSettings': '<div class="tool-option-settings"></div>',
            'toolOptionSetting': '<div class="tool-option-setting"></div>',
            'toolOptionSettingInput': '<label><input type="checkbox" /></label>',
            'layerSelect': '<select class="publisher-select-layer"></select>',
            'layerSelectOption': '<option></option>'
        },


        /**
         * Get tool object.
         * @method getTool
         *
         * @returns {Object} tool description
         */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
                name: 'PublisherToolbarPlugin',
                config: {}
            };
        },

        /**
         * Get extra options.
         * @method getExtraOptions
         * @public
         *
         * @returns {Object} jQuery element
         */
        getExtraOptions: function () {
            if (_.isEmpty(this.toolbarConfig)) {
                this._presetDataConfig('toolbarConfig');
            }
            options = jQuery(this.templates.toolOptions).clone();
            options = this._addToolGroup('history', options, this.toolbarConfig);
            options = this._addToolGroup('basictools', options, this.toolbarConfig);
        },
        _toggleToolOption: function (toolName, groupName, toolOption, configName, cbox) {
            return function () {
                var checkbox = cbox ? cbox : jQuery(this),
                    isChecked = checkbox.is(':checked'),
                    reqBuilder,
                    me = this;


                // toolbarplugin is selected when active tools or has selected draw tools
                if (me._hasActiveTools() || me._hasSelectedDrawTool()) {
                    tool.selected = true;
                } else {
                    tool.selected = false;
                }

                var requester = tool.plugin;
                if (isChecked) {
                    reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
                    sandbox.request(requester, reqBuilder(toolName, groupName, toolOption));
                    if (!me[configName][groupName]) {
                        me[configName][groupName] = {};
                    }
                    me[configName][groupName][toolName] = true;

                    if (me.toolbarConfig[groupName] === null || me.toolbarConfig[groupName] === undefined) {
                        me.toolbarConfig[groupName] = {};
                    }
                    me.toolbarConfig[groupName][toolName] = true;
                } else {
                    reqBuilder = sandbox.getRequestBuilder('Toolbar.RemoveToolButtonRequest');
                    sandbox.request(requester, reqBuilder(toolName, groupName, toolOption.toolbarid));
                    if (me[configName][groupName]) {
                        me[configName][groupName][toolName] = false;
                    }
                    if (me.toolbarConfig[groupName] === null || me.toolbarConfig[groupName] === undefined) {
                        me.toolbarConfig[groupName] = {};
                    }
                    me.toolbarConfig[groupName][toolName] = false;
                }
            };
        },
        /**
         * Preselects the local publishedmyplaces2Config to use the values from presetStateConfigs.
         * All known configs are preselected, unless specified as parameter.
         * Only the specified config is preselected.
         *
         * @method _presetDataConfig
         * @param {String} configToPreselect string identifying config to preselect
         */
        _presetDataConfig: function(configToPreselect) {
            var me = this,
                config;

            if (me.presetStateConfigs[configToPreselect]) {
                me[configToPreselect] = _.cloneDeep(me.presetStateConfigs[configToPreselect]);
            } else {
                for (config in me.presetStateConfigs) {
                    me[config] = _.cloneDeep(me.presetStateConfigs[config]);
                }
            }
        },

        _addToolGroup: function (groupName, options, toolOption) {
            var me = this,
                i,
                ilen,
                buttonGroup,
                toolName,
                toolButton,
                toolElement;

            // retrieve groupName button configs
            for (i = 0, ilen = me.buttonGroups.length; i < ilen; i++) {
                if (groupName === me.buttonGroups[i].name) {
                    buttonGroup = me.buttonGroups[i];
                    break;
                }
            }

            for (toolName in buttonGroup.buttons) {
                if (buttonGroup.buttons.hasOwnProperty(toolName)) {
                    toolButton = buttonGroup.buttons[toolName];
                    toolButton.toolbarid = toolOption.toolbarId;

                    // create checkbox
                    toolButton.selectTool = jQuery(me.templates.toolOption).clone();
                    toolButton.selectTool.find('label')
                        .attr('for', 'tool-opt-' + toolName).append(me.__loc.toolbarToolNames[toolName]);

                    if (me.toolbarConfig[buttonGroup.name] && me.toolbarConfig[buttonGroup.name][toolName]) {
                        toolButton.selectTool.find('input').attr('checked', 'checked');
                    }
                    //toggle toolbar tool. i.e. send requests
                    toolElement = toolButton.selectTool.find('input')
                        .attr('id', 'tool-opt-' + toolName)
                        .change(me._toggleToolOption(toolName, buttonGroup.name, toolButton, 'toolbarConfig'));
                    options.append(toolButton.selectTool);
                    // trigger click & change to send events
                    if (me.toolbarConfig[buttonGroup.name] && me.toolbarConfig[buttonGroup.name][toolName]) {
                        // FIXME use _toggleToolOption.apply or .call instead of passing the checkbox as an extra arg...
                        me._toggleToolOption(toolName, buttonGroup.name, toolButton, 'toolbarConfig', toolButton.selectTool.find('input'))();
                    }
                }
            }

            return options;
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });