
Oskari.clazz.define('Oskari.mapping.publisher.tool.MapRotator',
    function () {
    }, {
        index: 500,
        lefthanded: 'top left',
        righthanded: 'top right',
        templates: {
            'toolOptions': '<div class="tool-options"></div>'
        },
        noUI: null,
        noUiIsCheckedInModifyMode: false,
        /**
         * Get tool object.
         * @method getTool
         *
         * @returns {Object} tool description
         */
        getTool: function () {
            return {
                id: 'Oskari.mapping.maprotator.MapRotatorPlugin',
                title: 'MapRotator',
                config: {}
            };
        },
        isDisplayed: function () {
            // shouldn't be shown if bundle is not started
            // otherwise results in js errors
            return !!this.getMapRotatorInstance();
        },
        getMapRotatorInstance: function () {
            return this.__sandbox.findRegisteredModuleInstance(this.bundleName);
        },
        getPlugin: function () {
            return this.getMapRotatorInstance().getPlugin();
        },
        // Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
        bundleName: 'maprotator',
        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            var me = this;
            var bundleData = data && data.configuration[me.bundleName];
            if (!bundleData) {
                return;
            }
            var conf = bundleData.conf || {};
            me.setEnabled(conf.enabled);
            me.noUiIsCheckedInModifyMode = !!conf.noUI;
            this.getMapRotatorInstance().setState(bundleData.state);
        },
        // override setEnabled() because we don't want publisher to create the plugin BUT
        // we want to use maprotator instance for handling the plugin and create it ourself
        setEnabled: function (enabled) {
            // state actually hasn't changed -> do nothing
            if (this.isEnabled() === enabled) {
                return;
            }
            const rotatorInstance = this.getMapRotatorInstance();
            let plugin = rotatorInstance.getPlugin();
            this.state.enabled = enabled;
            if (!plugin && enabled) {
                rotatorInstance.createPlugin();
                plugin = rotatorInstance.getPlugin();
                this.__plugin = plugin;
            }

            if (enabled) {
                this.getMapmodule().registerPlugin(plugin);
                plugin.startPlugin(this.getSandbox());
                this.__started = true;
            } else {
                this.stop();
            }
            var event = Oskari.eventBuilder('Publisher2.ToolEnabledChangedEvent')(this);
            this.getSandbox().notifyAll(event);
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
            var pluginConfig = this.getPlugin().getConfig();
            for (var configName in pluginConfig) {
                if (configName === 'noUI' && !this.noUI) {
                    pluginConfig[configName] = null;
                    delete pluginConfig[configName];
                }
            }
            if (this.noUI) {
                pluginConfig.noUI = this.noUI;
            }
            // TODO: is this enabled needed? it's always true if tool.isEnabled()
            pluginConfig.enabled = true;
            var json = {
                configuration: {}
            };
            json.configuration[this.bundleName] = {
                conf: pluginConfig,
                state: this.getMapRotatorInstance().getState()
            };
            return json;
        },
        /**
         * Get extra options.
         * @method @public getExtraOptions
         * @param {Object} jQuery element toolContainer
         * @return {Object} jQuery element template
         */
        getExtraOptions: function (toolContainer) {
            var me = this;
            var template = jQuery(me.templates.toolOptions).clone();
            var loc = Oskari.getLocalization('maprotator', Oskari.getLang());
            var labelNoUI = loc.display.publisher.noUI;
            var input = Oskari.clazz.create(
                'Oskari.userinterface.component.CheckboxInput'
            );

            input.setTitle(labelNoUI);
            input.setHandler(function (checked) {
                if (!me.getPlugin()) {
                    return;
                }
                if (checked === 'on') {
                    me.noUI = true;
                    me.getPlugin().teardownUI();
                } else {
                    me.noUI = false;
                    me.getPlugin().redrawUI();
                }
            });
            if (me.noUiIsCheckedInModifyMode) {
                input.setChecked(true);
                me.noUI = true;
            }
            var inputEl = input.getElement();
            template.append(inputEl);
            return template;
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
