
Oskari.clazz.define('Oskari.mapping.publisher.tool.MapRotator',
    function () {
        //this.geoportalLocation = this.getPlugin().getLocation();
    }, {
        index: 500,
        lefthanded: 'top left',
        righthanded: 'top right',
        templates: {
            'toolOptions': '<div class="tool-options"></div>'
        },
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
                config: this.state.pluginConfig || {},
            };
        },
        isDisplayed: function () {
            // shouldn't be shown if bundle is not started
            // otherwise results in js errors
            return !!this.getMapRotatorInstance();
        },
        getMapRotatorInstance: function () {
            return this.getSandbox().findRegisteredModuleInstance(this.bundleName);
        },
        // Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
        bundleName: 'maprotator',
        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            var bundleData = data && data.configuration[this.bundleName];
            if (!bundleData) {
                return;
            }
            var conf = bundleData.conf || {};
            this.storePluginConf(conf);
            this.storePluginState(bundleData.state);
            this.setEnabled(true);
        },
        storePluginState: function (state) {
            this.state.pluginState = state || {};
        },
        _setEnabledImpl: function (enabled) {
            if (enabled && this.state.pluginState?.degrees) {
                this.getPlugin().setRotation(this.state.pluginState?.degrees);
            } else {
                this.getMapmodule().getMap().getView().setRotation(0);
            }
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
            input.setHandler((checked) => {
                const plugin = this.getPlugin();
                if (!plugin) {
                    return;
                }
                plugin.setConfig({
                    ...plugin.getConfig(),
                    noUI: checked === 'on'
                })
                plugin.refresh();
            });
            input.setChecked(!!this.state.pluginConfig?.noUI);
            var inputEl = input.getElement();
            template.append(inputEl);
            return template;
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
