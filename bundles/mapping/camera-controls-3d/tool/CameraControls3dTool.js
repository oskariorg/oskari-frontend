Oskari.clazz.define('Oskari.mapping.cameracontrols3d.CameraControls3dTool',
    function () {
    }, {
        index: 3,
        allowedLocations: ['*'],
        lefthanded: 'top left',
        righthanded: 'top right',
        allowedSiblings: ['*'],

        groupedSiblings: true,

        /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
        getTool: function () {
            return {
                id: 'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin',
                title: 'CameraControls3d',
                config: {}
            };
        },
        // Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
        bundleName: 'camera-controls-3d',

        /**
      * Initialise tool
      * @method init
      */
        init: function (data) {
            if (data.configuration[this.bundleName]) {
                this.setEnabled(true);
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
            if (this.state.enabled) {
                var pluginConfig = this.getPlugin().getConfig();
                var json = {
                    configuration: {}
                };
                json.configuration[this.bundleName] = {
                    conf: pluginConfig,
                    state: {}
                };
                return json;
            } else {
                return null;
            }
        },
        /**
        * Stop tool.
        * @method stop
        * @public
        */
        stop: function () {
            this.__started = false;
            if (!this.__plugin) {
                return;
            }
            if (this.getSandbox()) {
                this.__plugin.stopPlugin(this.getSandbox());
            }
            this.__mapmodule.unregisterPlugin(this.__plugin);
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
