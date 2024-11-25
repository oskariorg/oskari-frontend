import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';

class CameraControls3dTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 170;
        this.group = 'tools';
        this.lefthanded = 'top left';
        this.righthanded = 'top right';
        this.groupedSiblings = true;
        // Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
        this.bundleName = 'camera-controls-3d';
    }

    init (data) {
        if (data.configuration[this.bundleName]) {
            this.setEnabled(true);
            const location = data.configuration[this.bundleName]?.conf?.location?.classes;
            if (location) {
                this.getPlugin().setLocation(location);
            }
        }
    }

    getTool () {
        return {
            id: 'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin',
            title: Oskari.getMsg('CameraControls3d', 'publisher.toolLabel'),
            config: {}
        };
    }

    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues () {
        if (this.state.enabled) {
            const pluginConfig = this.getPlugin().getConfig();
            const json = {
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
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.CameraControls3dTool',
    CameraControls3dTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { CameraControls3dTool };
