import React from 'react';
import { openNotification } from 'oskari-ui';
import { stringify } from 'query-string';
import { getLayerHelper } from '../LayerHelper';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { handlePermissionForAllRoles, handlePermissionForSingleRole, roleAll } from './PermissionUtil';

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.mapLayerService.on('availableLayerTypesUpdated', () => this.updateLayerTypeVersions());
        this.log = Oskari.log('AdminLayerFormHandler');
        this.loadingCount = 0;
        this.layerHelper = getLayerHelper(Oskari.getSupportedLanguages());
        this.setState({
            layer: {},
            layerTypes: this.mapLayerService.getLayerTypes(),
            versions: [],
            propertyFields: [],
            capabilities: {},
            messages: [],
            loading: false,
            credentialsCollapseOpen: false
        });
        this.addStateListener(consumer);
        this.fetchRolesAndPermissionTypes();
    }

    updateLayerTypeVersions () {
        const { layer } = this.getState();
        this.updateState({
            layerTypes: this.mapLayerService.getLayerTypes(),
            versions: this.mapLayerService.getVersionsForType(layer.type)
        });
    }
    setType (type) {
        this.updateState({
            layer: { ...this.getState().layer, type },
            versions: this.mapLayerService.getVersionsForType(type)
        });
    }
    setLayerUrl (url) {
        this.updateState({
            layer: { ...this.getState().layer, url }
        });
    }
    setVersion (version) {
        if (!version) {
            // for moving back to previous step
            this.updateState({
                capabilities: {},
                layer: { ...this.getState().layer, version: undefined }
            });
            return;
        }
        this.fetchCapabilities(version);
    }
    layerSelected (name) {
        const { capabilities, layer } = this.getState();
        if (!capabilities || !capabilities.layers) {
            this.log.error('Capabilities not available. Tried to select layer: ' + name);
            return;
        }
        const found = capabilities.layers[name];
        if (found) {
            const updateLayer = this.layerHelper.fromServer({ ...layer, ...found });
            const { type, version } = updateLayer;
            const composingModel = this.mapLayerService.getComposingModelForType(type);
            this.updateState({
                layer: updateLayer,
                propertyFields: composingModel ? composingModel.getPropertyFields(version) : []
            });
        } else {
            this.log.error('Layer not in capabilities: ' + name);
        }
    }
    setUsername (username) {
        this.updateState({
            layer: { ...this.getState().layer, username }
        });
    }
    setPassword (password) {
        this.updateState({
            layer: { ...this.getState().layer, password }
        });
    }
    setLayerName (name) {
        this.updateState({
            layer: { ...this.getState().layer, name }
        });
    }
    setSelectedTime (selectedTime) {
        const layer = { ...this.getState().layer };
        if (!layer.params) {
            layer.params = {};
        }
        layer.params.selectedTime = selectedTime;
        this.updateState({ layer });
    }
    setRealtime (realtime) {
        this.updateState({
            layer: { ...this.getState().layer, realtime }
        });
    }
    setRefreshRate (refreshRate) {
        this.updateState({
            layer: { ...this.getState().layer, refreshRate }
        });
    }
    setCapabilitiesUpdateRate (capabilitiesUpdateRate) {
        this.updateState({
            layer: { ...this.getState().layer, capabilitiesUpdateRate }
        });
    }
    setForcedSRS (forcedSRS) {
        const layer = { ...this.getState().layer };
        let attributes;
        try {
            attributes = layer.attributes ? JSON.parse(layer.attributes) : {};
            if (!Array.isArray(forcedSRS) || forcedSRS.length === 0) {
                delete attributes.forcedSRS;
            } else {
                attributes = { ...attributes, forcedSRS };
            }
        } catch (err) {
            attributes = { forcedSRS };
        }
        layer.attributes = this.layerHelper.toJson(attributes);
        this.updateState({ layer });
    }
    setLocalizedNames (values) {
        const updateValues = {};
        Object.keys(values).forEach(language => {
            const { name, description } = values[language];
            updateValues[`name_${language}`] = name;
            updateValues[`title_${language}`] = description;
        });
        this.updateState({
            layer: {
                ...this.getState().layer,
                ...updateValues
            }
        });
    }
    setDataProvider (dataProvider) {
        this.updateState({
            layer: {
                ...this.getState().layer,
                groupId: dataProvider
            }
        });
    }
    setMapLayerGroup (checked, group) {
        const layer = { ...this.getState().layer };
        if (checked) {
            layer.maplayerGroups = [...layer.maplayerGroups, group.id];
        } else {
            const found = layer.maplayerGroups.find(cur => cur === group.id);
            if (found) {
                layer.maplayerGroups = [...layer.maplayerGroups];
                layer.maplayerGroups.splice(layer.maplayerGroups.indexOf(found), 1);
            }
        }
        this.updateState({ layer });
    }
    setOpacity (opacity) {
        this.updateState({
            layer: { ...this.getState().layer, opacity }
        });
    }
    setClusteringDistance (clusteringDistance) {
        const layer = { ...this.getState().layer };
        layer.options = layer.options || {};
        layer.options.clusteringDistance = clusteringDistance;
        this.updateState({ layer });
    }
    setRenderMode (renderMode) {
        const layer = { ...this.getState().layer };
        layer.options = layer.options || {};
        layer.options.renderMode = renderMode;
        this.updateState({ layer });
    }
    setMinAndMaxScale (values) {
        this.updateState({
            layer: {
                ...this.getState().layer,
                maxscale: values[0],
                minscale: values[1]
            }
        });
    }
    setStyle (style) {
        this.updateState({
            layer: { ...this.getState().layer, style }
        });
    }
    setStyleJSON (styleJSON) {
        this.updateState({
            layer: { ...this.getState().layer, styleJSON }
        });
    }
    setHoverJSON (hoverJSON) {
        this.updateState({
            layer: { ...this.getState().layer, hoverJSON }
        });
    }
    setMetadataIdentifier (metadataid) {
        this.updateState({
            layer: { ...this.getState().layer, metadataid }
        });
    }
    setLegendImage (legendImage) {
        this.updateState({
            layer: { ...this.getState().layer, legendImage }
        });
    }
    setGfiContent (gfiContent) {
        this.updateState({
            layer: { ...this.getState().layer, gfiContent }
        });
    }
    setGfiType (gfiType) {
        this.updateState({
            layer: { ...this.getState().layer, gfiType }
        });
    }
    setGfiXslt (gfiXslt) {
        this.updateState({
            layer: { ...this.getState().layer, gfiXslt }
        });
    }
    setQueryFormat (value) {
        const layer = { ...this.getState().layer };
        if (!layer.format) {
            layer.format = {};
        }
        layer.format.value = value;
        this.updateState({ layer });
    }
    setAttributes (attributes) {
        this.updateState({
            layer: { ...this.getState().layer, attributes }
        });
    }
    setMessage (key, type) {
        this.updateState({
            messages: [{ key, type }]
        });
    }
    setMessages (messages) {
        this.updateState({ messages });
    }
    resetLayer () {
        this.updateState({
            layer: this.layerHelper.createEmpty(),
            capabilities: {},
            versions: [],
            propertyFields: []
        });
    }
    ajaxStarted () {
        this.updateLoadingState(true);
    }
    ajaxFinished () {
        this.updateLoadingState(false);
    }
    updateLoadingState (loadingStarted) {
        if (loadingStarted) {
            this.loadingCount++;
        } else {
            this.loadingCount--;
        }
        this.updateState({
            loading: this.isLoading()
        });
    }

    // http://localhost:8080/action?action_route=LayerAdmin&id=889
    fetchLayer (id) {
        this.clearMessages();
        if (!id) {
            this.resetLayer();
            return;
        }
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('LayerAdmin', { id }), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            this.ajaxFinished();
            if (!response.ok) {
                this.setMessage('TODO', 'error');
            }
            return response.json();
        }).then(json => {
            const layer = this.layerHelper.fromServer(json.layer, {
                preserve: ['capabilities']
            });
            const { capabilities, type, version } = layer;
            delete layer.capabilities;
            // Add 'role' all to permissions for UI state handling purposes
            layer.role_permissions.all = [];
            const composingModel = this.mapLayerService.getComposingModelForType(type);
            this.updateState({
                layer,
                capabilities,
                propertyFields: composingModel ? composingModel.getPropertyFields(version) : []
            });
        });
    }

    /**
     * TODO REMOVE UNUSED FUNCTION, FIX STORIES
     *
     * Initializes layer model used in UI
     * @param {Oskari.mapframework.domain.AbstractLayer} layer
     */
    initLayerState (layer) {
        this.clearMessages();
        if (!layer) {
            this.resetLayer();
            return;
        }
        this.updateState({
            layer: this.layerHelper.fromAbstractLayer(layer)
        });
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

        // Modify layer for backend
        const layer = { ...this.getState().layer };
        const layerGroups = layer.maplayerGroups;
        layer.maplayerGroups = layer.maplayerGroups.map(cur => cur.id).join(',');
        // Remove role 'all' from permissions as this was only used for UI state handling purposes
        delete layer.role_permissions.all;
        const validationErrorMessages = this.validateUserInputValues(layer);

        if (validationErrorMessages.length > 0) {
            this.setMessages(validationErrorMessages);
            return;
        }
        this.setLayerOptions(layer);
        // TODO Reconsider using fetch directly here.
        // Maybe create common ajax request handling for Oskari?

        // FIXME: This should use LayerAdmin route and map the layer for payload properly before we can use it
        if (notImplementedYet) {
            const jsonOut = JSON.stringify(layer, null, 2);
            console.log(jsonOut);
            openNotification('info', {
                message: 'Save not implemented yet',
                key: 'admin-layer-save',
                description: (
                    <div style={{ maxHeight: 700, overflow: 'auto' }}>
                        <pre>{jsonOut}</pre>
                    </div>
                ),
                duration: null,
                placement: 'topRight',
                top: 30,
                style: {
                    width: 500,
                    marginLeft: -400
                }
            });
            return;
        }

        fetch(Oskari.urls.getRoute('SaveLayer'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stringify(layer)
        }).then(response => {
            if (response.ok) {
                this.setMessage('messages.saveSuccess', 'success');
                return response.json();
            } else {
                this.setMessage('messages.saveFailed', 'error');
                return Promise.reject(Error('Save failed'));
            }
        }).then(data => {
            if (layer.id) {
                data.groups = layerGroups;
                this.updateLayer(layer.id, data);
            } else {
                this.createlayer(data);
            }
        }).catch(error => this.log.error(error));
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
                this.setMessage('messages.errorInsertAllreadyExists', 'error');
                // should we update if layer already exists??? mapLayerService.updateLayer(e.layerData.id, e.layerData);
            }
        }
    }

    validateUserInputValues (layer) {
        const validationErrors = [];
        this.validateJsonValue(layer.styleJSON, 'messages.invalidStyleJson', validationErrors);
        this.validateJsonValue(layer.hoverJSON, 'messages.invalidHoverJson', validationErrors);
        this.validateJsonValue(layer.attributes, 'messages.invalidAttributeJson', validationErrors);
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
        const { layer } = this.getState();
        fetch(Oskari.urls.getRoute('DeleteLayer'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stringify(layer)
        }).then(response => {
            if (response.ok) {
                // TODO handle this, just close the flyout?
            } else {
                this.setMessage('messages.errorRemoveLayer', 'error');
            }
            return response;
        });
    }

    /*
        Calls action route like:
        http://localhost:8080/action?action_route=LayerAdmin&url=https://my.domain/geoserver/ows&type=wfslayer&version=1.1.0
    */
    fetchCapabilities (version) {
        this.ajaxStarted();
        const { layer } = this.getState();
        var params = {
            type: layer.type,
            version: version,
            url: layer.url,
            user: layer.username,
            pw: layer.password
        };

        // Remove undefined params
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

        fetch(Oskari.urls.getRoute('LayerAdmin', params), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            this.ajaxFinished();
            if (response.ok) {
                const composingModel = this.mapLayerService.getComposingModelForType(layer.type);
                this.updateState({
                    layer: { ...this.getState().layer, version },
                    propertyFields: composingModel ? composingModel.getPropertyFields(version) : []
                });
                return response.json();
            } else {
                if (response.status === 401) {
                    this.setMessage('messages.unauthorizedErrorFetchCapabilities', 'warning');
                    this.updateState({ credentialsCollapseOpen: true });
                } else {
                    this.setMessage('messages.errorFetchCapabilities', 'error');
                }
                return Promise.reject(new Error('Capabilities fetching failed with status code ' + response.status + ' and text ' + response.statusText));
            }
        }).then(json => {
            this.updateState({
                capabilities: json || {}
            });
        }).catch(error => {
            this.log.error(error);
        });
    }

    fetchRolesAndPermissionTypes () {
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('GetAllRolesAndPermissionTypes'))
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(new Error('Fetching user roles and permission types failed'));
                }
            }).then(data => {
                this.loadingCount--;
                this.updateState({
                    loading: this.isLoading(),
                    rolesAndPermissionTypes: data
                });
            }).catch(error => {
                this.log.error(error);
                this.setMessage('messages.errorFetchUserRolesAndPermissionTypes', 'error');
            });
    }

    getRolesAndPermissionTypes () {
        return this.getState().rolesAndPermissionTypes;
    };

    isLoading () {
        return this.loadingCount > 0;
    }
    clearMessages () {
        this.updateState({
            messages: []
        });
    }

    clearCredentialsCollapse () {
        this.updateState({ credentialsCollapseOpen: false });
    }

    handlePermission (checked, role, permission) {
        const layer = this.getState().layer;
        role === roleAll
            ? handlePermissionForAllRoles(checked, layer.role_permissions, permission)
            : handlePermissionForSingleRole(layer.role_permissions[role], permission);

        this.updateState({
            layer: layer
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'handlePermission',
    'layerSelected',
    'setAttributes',
    'setCapabilitiesUpdateRate',
    'setClusteringDistance',
    'setDataProvider',
    'setForcedSRS',
    'setGfiContent',
    'setGfiType',
    'setGfiXslt',
    'setHoverJSON',
    'setLayerName',
    'setLayerUrl',
    'setLegendImage',
    'setLocalizedNames',
    'setMapLayerGroup',
    'setMessage',
    'setMessages',
    'setMetadataIdentifier',
    'setMinAndMaxScale',
    'setOpacity',
    'setPassword',
    'setRealtime',
    'setRefreshRate',
    'setRenderMode',
    'setSelectedTime',
    'setStyleJSON',
    'setType',
    'setUsername',
    'setVersion'
]);
export { wrapped as AdminLayerFormHandler };
