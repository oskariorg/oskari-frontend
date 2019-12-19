import { stringify } from 'query-string';
import { getLayerHelper } from './LayerHelper';

export class AdminLayerFormService {
    constructor (consumer) {
        this.layer = {};
        this.capabilities = {};
        this.messages = [];
        this.listeners = [consumer];
        this.mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.log = Oskari.log('AdminLayerFormService');
        this.loadingCount = 0;
        this.layerHelper = getLayerHelper(Oskari.getSupportedLanguages());
        this.fetchRolesAndPermissionTypes();
    }

    getController () {
        const me = this;
        return {
            setType (type) {
                me.layer = { ...me.layer, type };
                me.notify();
            },
            setLayerUrl (url) {
                me.layer = { ...me.layer, url };
                me.notify();
            },
            setVersion (version) {
                if (!version) {
                    me.capabilities = {};
                    // for moving back to previous step
                    me.layer.version = undefined;
                    me.notify();
                    return;
                }
                me.fetchCapabilities(version);
            },
            layerSelected (name) {
                if (!me.capabilities || !me.capabilities.layers) {
                    me.log.error('Capabilities not available. Tried to select layer: ' + name);
                    return;
                }
                const found = me.capabilities.layers[name];
                if (found) {
                    me.layer = me.layerHelper.fromServer({
                        ...me.layer,
                        ...found
                    });
                } else {
                    Oskari.log('AdminLayerFormService').error('Layer not in capabilities: ' + name);
                }
                me.notify();
            },
            setUsername (username) {
                me.layer = { ...me.layer, username };
                me.notify();
            },
            setPassword (password) {
                me.layer = { ...me.layer, password };
                me.notify();
            },
            setLayerName (name) {
                me.layer = { ...me.layer, name };
                me.notify();
            },
            setLocalizedLayerName (lang, name) {
                const localized = `name_${lang}`;
                me.layer = { ...me.layer, [localized]: name };
                me.notify();
            },
            setLocalizedLayerDescription (lang, description) {
                const localized = `title_${lang}`;
                me.layer = { ...me.layer, [localized]: description };
                me.notify();
            },
            setDataProvider (dataProvider) {
                me.layer = { ...me.layer, groupId: dataProvider };
                me.notify();
            },
            setMapLayerGroup (checked, group) {
                const layer = { ...me.layer };
                if (checked) {
                    layer.maplayerGroups = [...layer.maplayerGroups, group];
                } else {
                    const found = layer.maplayerGroups.find(cur => cur.id === group.id);
                    if (found) {
                        layer.maplayerGroups = [...layer.maplayerGroups];
                        layer.maplayerGroups.splice(layer.maplayerGroups.indexOf(found), 1);
                    }
                }
                me.layer = layer;
                me.notify();
            },
            setOpacity (opacity) {
                me.layer = { ...me.layer, opacity };
                me.notify();
            },
            setMinAndMaxScale (values) {
                me.layer = {
                    ...me.layer,
                    maxscale: values[0],
                    minscale: values[1]
                };
                me.notify();
            },
            setStyle (style) {
                me.layer = { ...me.layer, style };
                me.notify();
            },
            setStyleJSON (styleJSON) {
                me.layer = { ...me.layer, styleJSON };
                me.notify();
            },
            setHoverJSON (hoverJSON) {
                me.layer = { ...me.layer, hoverJSON };
                me.notify();
            },
            setMetadataIdentifier (metadataid) {
                me.layer = { ...me.layer, metadataid };
                me.notify();
            },
            setGfiContent (gfiContent) {
                me.layer = { ...me.layer, gfiContent };
                me.notify();
            },
            setAttributes (attributes) {
                me.layer = { ...me.layer, attributes: JSON.parse(attributes) };
                me.notify();
            },
            setMessage (key, type) {
                me.messages = [{ key: key, type: type }];
                me.notify();
            },
            setMessages (messages) {
                me.messages = messages;
                me.notify();
            }
        };
    }
    resetLayer () {
        this.layer = this.layerHelper.createEmpty();
        this.notify();
    }

    // http://localhost:8080/action?action_route=LayerAdmin&id=889
    fetchLayer (id) {
        this.clearMessages();
        if (!id) {
            this.resetLayer();
            return;
        }
        this.loadingCount++;
        this.notify();
        const me = this;
        fetch(Oskari.urls.getRoute('LayerAdmin', { id }), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(function (response) {
            me.loadingCount--;
            if (!response.ok) {
                me.getController().setMessage('TODO', 'error');
            }
            return response.json();
        }).then(function (json) {
            me.layer = me.layerHelper.fromServer(json.layer);
            me.notify();
        });
    }

    /**
     * Initializes layer model used in UI
     * @param {Oskari.mapframework.domain.AbstractLayer} layer
     */
    initLayerState (layer) {
        this.clearMessages();
        if (!layer) {
            this.resetLayer();
            return;
        }
        this.layer = this.layerHelper.fromAbstractLayer(layer);
    }

    /**
     * @method getMVTStylesWithSrcLayer
     * Styles in MVT layer options contain data source layer names as filtering keys.
     * This function set styles with the layer child.
     * @return {Object} styles object with layer name filters for easier JSON editing.
     */
    getMVTStylesWithSrcLayer (styles, layerName) {
        if (!styles) {
            return;
        }
        const styleJson = JSON.parse(styles);
        Object.keys(styleJson).forEach(function (styleKey) {
            var mvtSrcLayerStyleDef = {};
            mvtSrcLayerStyleDef[layerName] = styleJson[styleKey];
            styleJson[styleKey] = mvtSrcLayerStyleDef;
        });
        return styleJson;
    }

    saveLayer () {
        const notImplementedYet = true;
        // FIXME: This should use LayerAdmin route and map the layer for payload properly before we can use it
        if (notImplementedYet) {
            alert('Not implemented yet');
            return;
        }
        const me = this;

        // Modify layer for backend
        const layer = { ...this.getLayer() };
        const layerGroups = layer.maplayerGroups;
        layer.maplayerGroups = layer.maplayerGroups.map(cur => cur.id).join(',');

        const validationErrorMessages = this.validateUserInputValues(layer);

        if (validationErrorMessages.length > 0) {
            this.getController().setMessages(validationErrorMessages);
            return;
        }
        this.setLayerOptions(layer);
        // TODO Reconsider using fetch directly here.
        // Maybe create common ajax request handling for Oskari?
        fetch(Oskari.urls.getRoute('SaveLayer'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stringify(layer)
        }).then(response => {
            if (response.ok) {
                me.getController().setMessage('messages.saveSuccess', 'success');
                return response.json();
            } else {
                me.getController().setMessage('messages.saveFailed', 'error');
                return Promise.reject(Error('Save failed'));
            }
        }).then(data => {
            if (layer.id) {
                data.groups = layerGroups;
                me.updateLayer(layer.id, data);
            } else {
                me.createlayer(data);
            }
        }).catch(error => me.log.error(error));
    }

    updateLayer (layerId, layerData) {
        this.mapLayerService.updateLayer(layerId, layerData);
    }

    createlayer (layerData) {
        // TODO: Test this method when layer creation in tested with new wizard
        const mapLayer = this.mapLayerService.createMapLayer(layerData);

        if (layerData.baseLayerId) {
            // If this is a sublayer, add it to its parent's sublayer array
            this.mapLayerService.addSubLayer(layerData.baseLayerId, mapLayer);
        } else {
            // Otherwise just add it to the map layer service.
            if (this.mapLayerService._reservedLayerIds[mapLayer.getId()] !== true) {
                this.mapLayerService.addLayer(mapLayer);
            } else {
                this.getController().setMessage('messages.errorInsertAllreadyExists', 'error');
                // should we update if layer already exists??? mapLayerService.updateLayer(e.layerData.id, e.layerData);
            }
        }
    }

    validateUserInputValues (layer) {
        const validationErrors = [];
        this.validateJsonValue(layer.styleJSON, 'messages.invalidStyleJson', validationErrors);
        this.validateJsonValue(layer.hoverJSON, 'messages.invalidHoverJson', validationErrors);
        return validationErrors;
    }

    validateJsonValue (value, msgKey, validationErrors) {
        if (value === '' || typeof value === 'undefined') {
            return;
        }
        try {
            const result = JSON.parse(value);
            if (typeof result !== 'object') {
                validationErrors.push({ key: msgKey, type: 'error' });
            }
        } catch (error) {
            validationErrors.push({ key: msgKey, type: 'error' });
        }
    }
    setLayerOptions (layer) {
        const styles = layer.styleJSON !== '' ? this.getMVTStylesWithSrcLayer(layer.styleJSON, layer.name) : undefined;
        const hoverStyle = layer.hoverJSON !== '' ? JSON.parse(layer.hoverJSON) : undefined;
        layer.options = { ...layer.options, ...{ styles: styles, hover: hoverStyle } };
        layer.options = JSON.stringify(layer.options);
    }

    deleteLayer () {
        // FIXME: This should use LayerAdmin route instead but this probably works anyway
        const layer = this.getLayer();
        const me = this;
        fetch(Oskari.urls.getRoute('DeleteLayer'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stringify(layer)
        }).then(function (response) {
            if (response.ok) {
                // TODO handle this, just close the flyout?
            } else {
                me.getController().setMessage('messages.errorRemoveLayer', 'error');
            }
            return response;
        });
    }

    /*
        Calls action route like:
        http://localhost:8080/action?action_route=LayerAdmin&url=https://my.domain/geoserver/ows&type=wfslayer&version=1.1.0
    */
    fetchCapabilities (version) {
        this.loadingCount++;
        this.notify();
        const layer = this.getLayer();
        var params = {
            type: layer.type,
            version: version,
            url: layer.url
        };
        const me = this;
        fetch(Oskari.urls.getRoute('LayerAdmin', params), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(function (response) {
            if (response.ok) {
                me.layer.version = version;
            } else {
                me.getController().setMessage('TODO', 'error');
            }
            return response.json();
        }).then(function (json) {
            me.loadingCount--;
            me.capabilities = json || {};
            me.notify();
        });
    }

    fetchRolesAndPermissionTypes () {
        const me = this;
        this.loadingCount++;
        fetch(Oskari.urls.getRoute('GetAllRolesAndPermissionTypes')).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error('Fetching user roles and permission types failed'));
            }
        }).then(data => {
            me.rolesAndPermissionTypes = data;
            me.loadingCount--;
            me.notify();
        }).catch(error => {
            me.log.error(error);
            me.getController().setMessage('messages.errorFetchUserRolesAndPermissionTypes', 'error');
            me.notify();
        });
    }

    getRolesAndPermissionTypes () {
        return this.rolesAndPermissionTypes;
    };

    getLayer () {
        return this.layer;
    }

    isLoading () {
        return this.loadingCount > 0;
    }
    getCapabilities () {
        return this.capabilities || {};
    }
    getMessages () {
        return this.messages;
    }

    clearMessages () {
        this.messages = [];
    }

    notify () {
        this.listeners.forEach(consumer => consumer());
    }
}
