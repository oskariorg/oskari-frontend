import { AbstractStatsPluginTool } from './AbstractStatsPluginTool';

class ClassificationTool extends AbstractStatsPluginTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'data';
        this.id = 'allowClassification';
        this.title = 'allowClassification';
    }

    init (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf[this.id] !== false);
    }

    setEnabled (enabled) {
        if (enabled === this.isEnabled()) {
            return;
        }

        // Stop checks if we are already disabled so toggle the value after
        this.state.enabled = enabled;
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.updateClassificationState('editEnabled', enabled);
    }

    stop () {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.updateClassificationState('editEnabled', true);
    }

    // Classification is always present with thematic maps: either as a button toggle OR always on screen
    // That is why _this tool_ writes the "main config/state" for embedded map
    // Other statsgrid tools assume that the state (selected indicators etc) is written by something else and
    // their getValues() only return a mergeable change that controls their setting
    getValues () {
        if (!this._isStatsActive()) {
            return null;
        }
        const { location } = this.getPlugin()?.getConfig() || {};
        return {
            configuration: {
                statsgrid: {
                    conf: {
                        allowClassification: this.isEnabled(),
                        location: location || {
                            classes: 'bottom right'
                        }
                    },
                    state: this.getSandbox().getStatefulComponents().statsgrid.getState()
                }
            }
        };
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.ClassificationTool',
    ClassificationTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
