import { Messaging } from 'oskari-ui/util';

export class PublisherService {
    constructor (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.loc = instance.loc;
        this.log = Oskari.log(this.getName());
        this.isActive = false;
        this.storedLayers = [];
        this.storedPlugins = [];
    }

    getName () {
        return 'PublisherService';
    }

    getQName () {
        return 'Oskari.mapframework.bundle.publisher2.PublisherService';
    }

    /**
     * @method getDeniedSelectedLayers
     * Checks currently selected layers and returns a subset of the list
     * that has the layers that can't be published. If all selected
     * layers can be published, returns an empty list.
     * @return {Oskari.mapframework.domain.AbstractLayer[]} list of layers that can't be published.
     */
    getDeniedSelectedLayers () {
        const selectedLayers = this.sandbox.findAllSelectedMapLayers();
        return selectedLayers.filter(layer => !this.hasPublishRight(layer) || layer.getVisibilityInfo().unsuported);
    }

    /**
     * @method createToolGroupings
     * Finds classes annotated as 'Oskari.mapframework.publisher.Tool'.
     * Determines tool groups from tools and creates tool panels for each group. Returns an object containing a list of panels and their tools as well as a list of
     * all tools, even those that aren't displayed in the tools' panels.
     *
     * @return {Object} Containing {Oskari.mapframework.bundle.publisher2.view.PanelMapTools[]} list of panels
     * and {Oskari.mapframework.publisher.tool.Tool[]} tools not displayed in panel
     */
    createToolGroupings () {
        const sandbox = this.sandbox;
        const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        const { toolsConfig } = this.instance.conf || {};
        const definedTools = [...Oskari.clazz.protocol('Oskari.mapframework.publisher.Tool'),
            ...Oskari.clazz.protocol('Oskari.mapframework.publisher.LayerTool')
        ];
        // deprecated getTitle requires loc object
        const locObj = this.instance.getLocalization('BasicView');

        const grouping = {};
        // group tools per tool-group
        definedTools.forEach(toolClazz => {
            const tool = Oskari.clazz.create(toolClazz, sandbox, mapmodule, locObj);
            const group = tool.getGroup();
            if (!grouping[group]) {
                grouping[group] = [];
            }
            if (toolsConfig && tool.bundleName) {
                tool.toolConfig = toolsConfig[tool.bundleName];
            }
            grouping[group].push(tool);
        });
        return grouping;
    }

    /**
     * @method hasPublishRight
     * Checks if the layer can be published.
     * @param
     * {Oskari.mapframework.domain.AbstractLayer} layer layer to check
     * @return {Boolean} true if the layer can be published
     */
    hasPublishRight (layer) {
        // permission might be "no_publication_permission"
        // or nothing at all
        return layer.hasPermission('publish');
    }

    /**
     * @method setPublishModeImpl
     * Sets publisher into active mode
     * @param {Boolean} isActive
     * @param {Object} data
     */
    setPublishModeImpl (isActive, data) {
        this.isActive = isActive;
        if (isActive) {
            this.removeLayers();
            this.removePlugins();
        } else {
            this.addStoredLayers();
            this.addStoredPlugins();
        }
    }

    /**
     * @method getIsActive
     * Get publisher active state
     * @return {Boolean}
     */
    getIsActive () {
        return this.isActive;
    }

    /**
     * @method removePlugins
     * Modifies the main map to show what the published map would look like
     */
    removePlugins () {
        const mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        const removed = [];
        Object.values(mapModule.getPluginInstances())
            .filter(plugin => plugin.isShouldStopForPublisher && plugin.isShouldStopForPublisher())
            .forEach(plugin => {
                try {
                    plugin.stopPlugin(this.sandbox);
                    mapModule.unregisterPlugin(plugin);
                    removed.push(plugin);
                } catch (err) {
                    this.log.error('Enable preview', err);
                    Messaging.error(this.loc('BasicView.error.enablePreview'));
                }
            });
        this.storedPlugins = removed;
    }

    /**
     * @private @method _disablePreview
     * Returns the main map from preview to normal state
     *
     */
    addStoredPlugins () {
        const mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        // resume normal plugins
        this.storedPlugins.forEach(plugin => {
            try {
                mapModule.registerPlugin(plugin);
                plugin.startPlugin(this.sandbox);
                if (plugin.refresh) {
                    plugin.refresh();
                }
            } catch (err) {
                this.log.error('Disable preview', err);
                Messaging.error(this.loc('BasicView.error.disablePreview'));
            }
        });
        // reset listing
        this.storedPlugins = [];
    }

    /**
     * @method addStoredLayers
     * Adds temporarily removed layers to map
     */
    addStoredLayers () {
        this.storedLayers.forEach(layer => {
            this.sandbox.postRequestByName('AddMapLayerRequest', [layer.getId()]);
        });
        // reset listing
        this.storedLayers = [];
    }

    /**
     * @method removeLayers
     * Removes temporarily layers from map that the user can't publish
     */
    removeLayers () {
        const toRemove = this.getDeniedSelectedLayers();
        toRemove.forEach(layer => {
            this.sandbox.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
        });
        this.storedLayers = toRemove;
    }

    checkTouAccepted (callback) {
        fetch(Oskari.urls.getRoute('HasAcceptedPublishedTermsOfUse'), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            callback(json);
        }).catch(error => {
            Oskari.log(this.getName()).warn('Failed to check publish terms of use acceptance', error);
            // respone with boolean value to accept tou & continue to publisher
            const tou = false;
            callback(tou);
        });
    }

    markTouAccepted (cb) {
        fetch(Oskari.urls.getRoute('AcceptPublishedTermsOfUse'), {
            method: 'POST'
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            cb(json);
        // use null to try again at next time
        }).catch(() => cb(null));
    }

    getTouArticle (cb) {
        const tags = 'termsofuse, mappublication, ' + Oskari.getLang();
        fetch(Oskari.urls.getRoute('GetArticlesByTag', { tags }), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            const { content } = json.articles?.[0] || {};
            cb(content);
        }).catch(() => cb(null));
    }

    fetchAppSetup (uuid, cb) {
        if (!uuid || !cb) {
            Messaging.error(this.loc('BasicView.error.enablePreview'));
            return;
        }
        fetch(Oskari.urls.getRoute('AppSetup', { uuid }), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            const view = { ...json, uuid };
            cb(view);
        }).catch(() => {
            cb();
            Messaging.error(this.loc('BasicView.error.enablePreview'));
        });
    }
};
