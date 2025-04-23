import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';

import { LAYER_ID, BUNDLE_KEY } from '../constants';
const defaultPlugin = 'Oskari.statistics.statsgrid.TogglePlugin';

export class AbstractStatsPluginTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.group = 'statsgrid';
        this.displayFromInitData = false;
    }

    getTool () {
        const id = this._getToolId();
        return {
            id: this.pluginId || (defaultPlugin + '.' + id),
            title: this.getTitle(),
            config: {
                [id]: true
            },
            hasNoPlugin: true
        };
    }

    getTitle () {
        return Oskari.getMsg(BUNDLE_KEY, 'publisher.' + this.id);
    }

    getComponent () {
        return {};
    }

    init (data) {
        const id = this.id;
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf[id] === true);
    }

    getStatsgridBundle () {
        return Oskari.getSandbox().findRegisteredModuleInstance('StatsGrid');
    }

    getViewHandler () {
        const instance = this.getStatsgridBundle();
        if (!instance) {
            return;
        }
        return instance.getViewHandler();
    }

    _getToolId () {
        return this.id || 'AbstractStatsPluginTool';
    }

    getPlugin () {
        return this.getViewHandler()?.togglePlugin;
    }

    getStateHandler () {
        const instance = this.getStatsgridBundle();
        if (!instance) {
            return;
        }
        return instance.getStateHandler();
    }

    /**
    * @method @private _isStatsActive
    * @return true when stats layer is on the map, false if removed
    */
    _isStatsActive () {
        return Oskari.getSandbox().isLayerAlreadySelected(LAYER_ID);
    }

    /**
     * @method isDisplayed Is displayed.
     * @returns {Boolean} true, if stats layer is on the map or data contains statsdrid conf
     */
    isDisplayed () {
        if (this._isStatsActive()) {
            return true;
        }
        // there might be timing issue when editing published stats map
        return this.displayFromInitData;
    }

    getStatsgridConf (initialData) {
        const { conf = {}, state } = initialData?.configuration?.statsgrid || {};
        this.displayFromInitData = !!state;
        // Setup the plugin location whenever any of the stats tools parse initial config.
        // There will be "too many calls" to this but it's not too bad and
        // we want the location always set or reset no matter which tool sets it
        this.getPlugin()?.setLocation(conf.location?.classes);
        return conf;
    }

    // override since we want to use the instance we currently have, not create a new one
    setEnabled (enabled) {
        const changed = super.setEnabled(enabled);
        if (!changed) {
            return;
        }
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        if (enabled) {
            handler.getController().addMapButton(this.id);
        } else {
            handler.getController().removeMapButton(this.id);
        }
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        const id = this._getToolId();
        return this.getConfiguration({ [id]: this.isEnabled() });
    }

    getConfiguration (conf = {}) {
        // just to make sure if user removes the statslayer while in publisher
        // if there is no statslayer on map -> don't setup tools configuration
        // otherwise the embedded map will get statsgrid config which means that editing the embedded
        // map will show the thematic map tools panel even if the thematic maps is not used on the embedded map
        if (!this._isStatsActive()) {
            return null;
        }
        return {
            configuration: {
                statsgrid: {
                    conf
                }
            }
        };
    }

    stop () {
        const handler = this.getViewHandler();
        if (!handler) {
            return;
        }
        handler.getController().removeMapButton(this.id);
    }
};

/*
// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.mapframework.publisher.tool.AbstractStatsPluginTool',
    AbstractStatsPluginTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
*/
