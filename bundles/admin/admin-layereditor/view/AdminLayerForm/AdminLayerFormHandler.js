import React from 'react';
import { getLayerHelper } from '../LayerHelper';
import { StateHandler, Messaging, controllerMixin } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { handlePermissionForAllRoles, handlePermissionForSingleRole } from './PermissionUtil';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');
const DEFAULT_TAB = 'general';

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='admin-layereditor' />;

const __VALIDATOR_CACHE = {};

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.sandbox = Oskari.getSandbox();
        this.mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        this.mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.mapLayerService.on('availableLayerTypesUpdated', () => this.updateLayerTypeVersions());
        this.log = Oskari.log('AdminLayerFormHandler');
        this.loadingCount = 0;
        this.layerHelper = getLayerHelper();
        this.setState({
            layer: {},
            layerTypes: this.mapLayerService.getLayerTypes(),
            versions: [],
            propertyFields: [],
            capabilities: {},
            messages: [],
            loading: false,
            tab: DEFAULT_TAB,
            credentialsCollapseOpen: false,
            scales: this.mapmodule.getScaleArray().map(value => typeof value === 'string' ? parseInt(value) : value)
        });
        this.addStateListener(consumer);
        this.fetchLayerAdminMetadata();
    }

    updateLayerTypeVersions () {
        const { layer } = this.getState();
        this.updateState({
            layerTypes: this.mapLayerService.getLayerTypes(),
            versions: this.mapLayerService.getVersionsForType(layer.type)
        });
    }

    setType (type) {
        const layer = { ...this.getState().layer, type };
        this.updateState({
            layer,
            versions: this.mapLayerService.getVersionsForType(type),
            propertyFields: this.getPropertyFields(layer)
        });
    }

    setLayerUrl (url) {
        this.updateState({
            layer: { ...this.getState().layer, url }
        });
    }

    versionSelected (version) {
        const layer = { ...this.getState().layer, version };
        if (typeof version === 'undefined') {
            // object spread doesn't work when removing value == returning from manually adding layer/skipping capabilities
            delete layer.version;
            // if we are returning we also need to clear name
            delete layer.name;
        }
        const propertyFields = this.getPropertyFields(layer);
        if (!version) {
            // for moving back to previous step
            this.updateState({ layer, capabilities: {}, propertyFields });
            return;
        }
        if (!propertyFields.includes(LayerComposingModel.CAPABILITIES)) {
            this.updateState({ layer, propertyFields });
            return;
        };
        this.fetchCapabilities(layer);
    }

    setVersion (version) {
        const layer = { ...this.getState().layer, version };
        const propertyFields = this.getPropertyFields(layer);
        this.updateState({ layer, propertyFields });
    }

    layerSelected (name) {
        const { capabilities, layer } = this.getState();
        if (!capabilities || !capabilities.layers) {
            this.log.error('Capabilities not available. Tried to select layer: ' + name);
            return;
        }
        const found = capabilities.layers[name];
        if (found) {
            const typesAndRoles = this.getAdminMetadata();
            // current layer values as template, override with values from capabilities
            const mergedLayerData = {
                ...layer,
                ...found
            };
            // keep dataProviderId if we have one (remove the -1 we might get from server)
            if (mergedLayerData.dataprovider_id === -1) {
                delete mergedLayerData.dataprovider_id;
                mergedLayerData.dataProviderId = layer.dataProviderId;
            }

            const updateLayer = this.layerHelper.fromServer(mergedLayerData, {
                preserve: ['capabilities'],
                roles: typesAndRoles.roles
            });
            this.updateState({
                layer: updateLayer,
                propertyFields: this.getPropertyFields(updateLayer)
            });
        } else {
            this.log.error('Layer not in capabilities: ' + name);
        }
    }

    skipCapabilities () {
        // force an OGC service to skip the capabilities phase of the wizard since some services are not standard compliant
        // This is a last ditch effort to support such services.
        const layer = {
            name: '',
            version: '',
            ...this.getState().layer
        };
        this.updateState({ layer });
    }

    addNewFromSameService () {
        // initialize state for adding a new layer from the same OGC service (service having capabilities)
        const state = this.getState();
        const layer = { ...state.layer };

        // add newly added layer to "existing layers" so it's shown as existing
        const capabilities = state.capabilities || {};
        capabilities.existingLayers = capabilities.existingLayers || {};
        capabilities.existingLayers[layer.name] = state.layer;

        // trigger capabilities fetching using layers type, url, version if we don't have them stored
        if (!capabilities.layers || !capabilities.layers.length) {
            this.fetchCapabilities(layer);
        } else {
            // update state with layer having no name and id so we don't overwrite an existing layer
            delete layer.name;
            delete layer.id;
            this.updateState({ layer, capabilities });
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

    setSingleTile (singleTile) {
        const layer = { ...this.getState().layer };
        if (singleTile) {
            layer.options.singleTile = singleTile;
        } else {
            delete layer.options.singleTile;
        }
        this.updateState({ layer });
    }

    setTimeSeriesUI (ui) {
        const layer = { ...this.getState().layer };
        const timeseries = { ...layer.options.timeseries, ui };
        layer.options.timeseries = timeseries;
        this.updateState({ layer });
    }

    setTimeSeriesMetadataLayer (layerId) {
        const layer = { ...this.getState().layer };
        const timeseries = { ...layer.options.timeseries };
        const metadata = { ...timeseries.metadata, layer: layerId };
        if (layerId === '') {
            delete metadata.attribute;
            delete metadata.layerAttributes;
            timeseries.metadata = metadata;
            layer.options.timeseries = timeseries;
            this.updateState({ layer });
        } else {
            this.fetchWFSLayerAttributes(layerId).then(layerAttributes => {
                delete metadata.attribute;
                metadata.layerAttributes = layerAttributes;
                timeseries.metadata = metadata;
                layer.options.timeseries = timeseries;
                this.updateState({ layer });
            });
        }
    }

    setTimeSeriesMetadataAttribute (attribute) {
        const layer = { ...this.getState().layer };
        const timeseries = { ...layer.options.timeseries };
        const metadata = { ...timeseries.metadata, attribute };
        timeseries.metadata = metadata;
        layer.options.timeseries = timeseries;
        this.updateState({ layer });
    }

    setTimeSeriesMetadataToggleLevel (toggleLevel) {
        const layer = { ...this.getState().layer };
        const timeseries = { ...layer.options.timeseries };
        const metadata = { ...timeseries.metadata, toggleLevel };
        timeseries.metadata = metadata;
        layer.options.timeseries = timeseries;
        this.updateState({ layer });
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
        let attributes = layer.attributes || {};
        if (!Array.isArray(forcedSRS) || forcedSRS.length === 0) {
            delete attributes.forcedSRS;
        } else {
            attributes = { ...attributes, forcedSRS };
        }
        this.updateLayerAttributes(attributes, layer);
    }

    setLocalizedNames (locale) {
        this.updateState({
            layer: { ...this.getState().layer, locale }
        });
    }

    setDataProviderId (dataProviderId) {
        this.updateState({
            layer: { ...this.getState().layer, dataProviderId }
        });
    }

    setGroup (checked, group) {
        const layer = { ...this.getState().layer };
        if (checked) {
            layer.groups = Array.from(new Set([...layer.groups, group.id]));
        } else {
            const found = layer.groups.find(cur => cur === group.id);
            if (found) {
                layer.groups = [...layer.groups];
                layer.groups.splice(layer.groups.indexOf(found), 1);
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
        layer.options.clusteringDistance = clusteringDistance;
        this.updateState({ layer });
    }

    setRenderMode (renderMode) {
        const layer = { ...this.getState().layer };
        layer.options.renderMode = renderMode;
        this.updateState({ layer });
    }

    getResolutionArray () {
        return [...this.mapmodule.getResolutionArray()];
    }

    setMinAndMaxScale ([minscale, maxscale]) {
        this.updateState({
            layer: {
                ...this.getState().layer,
                minscale,
                maxscale
            }
        });
    }

    setStyle (style) {
        this.updateState({
            layer: { ...this.getState().layer, style }
        });
    }

    setLegendUrl (styleName, url) {
        const options = { ...this.getState().layer.options };
        if (!options.legends) {
            options.legends = {};
        }
        if (url === '') {
            delete options.legends[styleName];
        } else {
            options.legends[styleName] = url;
        }
        this.setOptions(options);
    }

    setStyleJSON (json) {
        this.updateOptionsJsonProperty(json, 'tempStylesJSON', 'styles');
    }

    setExternalStyleJSON (json) {
        this.updateOptionsJsonProperty(json, 'tempExternalStylesJSON', 'externalStyles');
    }

    setHoverJSON (json) {
        this.updateOptionsJsonProperty(json, 'tempHoverJSON', 'hover');
    }

    setTileGridJSON (json) {
        this.updateOptionsJsonProperty(json, 'tempTileGridJSON', 'tileGrid');
    }

    setAttributionsJSON (json) {
        this.updateOptionsJsonProperty(json, 'tempAttributionsJSON', 'attributions');
    }

    updateOptionsJsonProperty (json, jsonPropKey, dataPropKey) {
        const layer = { ...this.getState().layer };
        layer[jsonPropKey] = json;
        if (json === '') {
            delete layer.options[dataPropKey];
            this.updateState({ layer });
            return;
        }
        try {
            layer.options[dataPropKey] = JSON.parse(json);
        } catch (err) {
            // Don't update the form data, just the temporary input.
        }
        this.updateState({ layer });
    }

    setOptions (options) {
        this.updateState({
            layer: { ...this.getState().layer, options }
        });
    }

    setMetadataIdentifier (metadataid) {
        this.updateState({
            layer: { ...this.getState().layer, metadataid }
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

    setAttributes (tempAttributesJSON) {
        const layer = { ...this.getState().layer, tempAttributesJSON };
        let tempAttributes = {};
        try {
            tempAttributes = JSON.parse(tempAttributesJSON);
        } catch (err) { }

        const isEmpty = Object.keys(tempAttributes).length === 0;
        if (isEmpty && !layer.attributes) {
            this.updateState({ layer });
            return;
        }
        if (!isEmpty) {
            // format text input
            layer.tempAttributesJSON = this.layerHelper.toJson(tempAttributes);
        }

        // Delete missing attibute keys but keep managed attributes
        const managedAttributes = ['forcedSRS'];
        Object.keys(layer.attributes)
            .filter(key => !managedAttributes.includes(key))
            .forEach(key => delete layer.attributes[key]);

        this.updateLayerAttributes({ ...layer.attributes, ...tempAttributes }, layer);
    }

    updateLayerAttributes (attributes, layer = { ...this.getState().layer }) {
        layer.attributes = attributes;
        // Update text input
        if (layer.tempAttributesJSON) {
            try {
                if (typeof JSON.parse(layer.tempAttributesJSON) === 'object') {
                    layer.tempAttributesJSON = this.layerHelper.toJson(layer.attributes);
                }
            } catch (err) {
                // Don't override the user input. The user might lose some data.
            }
        }
        this.updateState({ layer });
    }

    setMessage (key, type, args) {
        this.updateState({
            messages: [{ key, type, args }]
        });
    }

    setMessages (messages) {
        this.updateState({ messages });
    }

    setTab (tab) {
        this.updateState({ tab });
    }

    resetLayer () {
        const typesAndRoles = this.getAdminMetadata();
        this.updateState({
            layer: this.layerHelper.createEmpty(typesAndRoles.roles),
            capabilities: {},
            versions: [],
            propertyFields: [],
            tab: DEFAULT_TAB
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

    getPropertyFields (layer) {
        const { type, version } = layer;
        const composingModel = this.mapLayerService.getComposingModelForType(type);
        return composingModel ? composingModel.getPropertyFields(version) : [];
    }

    // http://localhost:8080/action?action_route=GetWFSLayerFields&layer_id=888
    fetchWFSLayerAttributes (layerId) {
        this.ajaxStarted();
        return fetch(Oskari.urls.getRoute('GetWFSLayerFields', { layer_id: layerId }), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            this.ajaxFinished();
            if (!response.ok) {
                Messaging.error(getMessage('messages.errorFetchWFSLayerAttributes'));
            }
            return response.json();
        }).then(json => {
            const { attributes, locale } = json;
            const attributeIdentifiers = Object.keys(attributes);
            const currentLocale = Oskari.getLang();
            const labelMapping = locale && locale[currentLocale] ? locale[currentLocale] : {};
            return attributeIdentifiers.reduce((choices, identifier) => {
                // use the attribute identifier as the label if no label is provided for current locale
                choices[identifier] = labelMapping[identifier] || identifier;
                return choices;
            }, {});
        });
    }

    // http://localhost:8080/action?action_route=LayerAdmin&id=889
    fetchLayer (id, keepCapabilities = false) {
        this.clearMessages();
        if (!id) {
            // adding new layer
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
                Messaging.error(getMessage('messages.errorFetchLayerFailed'));
            }
            return response.json();
        }).then(json => {
            const typesAndRoles = this.getAdminMetadata();
            const { ...layer } = this.layerHelper.fromServer(json, {
                preserve: ['capabilities'],
                roles: typesAndRoles.roles
            });
            // remove possible existing flag since we loaded the layer -> it is not new
            delete layer.isNew;
            if (layer.warn) {
                // currently only option for warning on this is "updateCapabilitiesFail"
                Messaging.warn(getMessage(`messages.${layer.warn}`));
                delete layer.warn;
            }
            const newState = {
                layer,
                propertyFields: this.getPropertyFields(layer),
                versions: this.mapLayerService.getVersionsForType(layer.type)
            };
            if (!keepCapabilities) {
                // for editing new layers we want to flush capabilities
                // when refreshing a saved layer from server we want to keep
                //  any existing capabilities to speed up the process of adding many layers
                newState.capabilities = {};
            }
            this.updateState(newState);
        });
    }

    saveLayer () {
        const validationErrorMessages = this.validateUserInputValues(this.getState().layer);
        if (validationErrorMessages.length > 0) {
            // TODO: formatting message and message duration
            Messaging.error(<div>
                {getMessage('validation.mandatoryMsg')}
                <ul>{ validationErrorMessages
                    .map(field => <li key={field}>{getMessage(`fields.${field}`)}</li>)}
                </ul>
            </div>);
            return;
        }
        // Take a copy
        const layer = { ...this.getState().layer };

        // Modify layer for backend
        const layerPayload = this.layerHelper.toServer(layer);

        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('LayerAdmin'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(layerPayload)
        }).then(response => {
            this.ajaxFinished();
            if (response.ok) {
                Messaging.success(getMessage('messages.saveSuccess'));
                return response.json();
            } else {
                Messaging.error(getMessage('messages.saveFailed'));
                return Promise.reject(Error('Save failed'));
            }
        }).then(data => {
            // layer data will be the same as for editing == admin data
            // refresh current layer data from server after saving just in case to prevent possible out-of-sync
            this.fetchLayer(data.id, true);
            // Update layer for end-user as that model is different than admin uses
            // end-user layer is AbstractLayer-based model -> make another request to get that JSON.
            this.fetchLayerForEndUser(data.id, layerPayload.group_ids);
        }).catch(error => this.log.error(error));
    }

    fetchLayerForEndUser (layerId, groups = []) {
        // send id as parameter so we don't get the whole layer listing
        var url = Oskari.urls.getRoute('GetHierarchicalMapLayerGroups', {
            srs: Oskari.getSandbox().getMap().getSrsName(),
            lang: Oskari.getLang(),
            id: layerId
        });
        this.ajaxStarted();
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            this.ajaxFinished();
            if (!response.ok) {
                Messaging.error(getMessage('messages.errorFetchLayerEnduserFailed'));
            }
            return response.json();
        }).then(json => {
            if (json.layers.length !== 1) {
                Messaging.error(getMessage('messages.errorFetchLayerEnduserFailed'));
                return;
            }
            const layer = json.layers[0];
            // this is needed because maplayer service expects groups to be found on layer when creating/updating
            // TODO: refactor maplayer service groups handling
            layer.groups = groups.map(id => {
                const item = {
                    id
                };
                const group = this.mapLayerGroups.find(g => g.id === id);
                if (!group) {
                    return item;
                }
                item.name = Oskari.getLocalized(group.name);
                return item;
            });
            this.refreshEndUserLayer(layerId, layer);
        });
    }

    /**
     *
     * @param {Number} layerId id for layer affected
     * @param {Object} layer affected layer as WFSlayer object
     * @param {Object} layerData new fetched layer data
     */
    refreshLayerOnMap (layerId, layer, layerData) {
        if (!layerId || !layer || !layerData) {
            return;
        }

        const originalLayerIndex = this.sandbox.getMap().getLayerIndex(layerId); // Save index for the new layer
        const modifiedLayer = this.mapLayerService.createMapLayer(layerData);

        this.mapLayerService.removeLayer(layerId, true); // remove existing layer and supress event
        this.sandbox.postRequestByName('RemoveMapLayerRequest', [modifiedLayer]);

        this.mapLayerService.addLayer(modifiedLayer); // add layer but dont supress event
        this.sandbox.postRequestByName('AddMapLayerRequest', [layerId]);
        this.sandbox.postRequestByName('RearrangeSelectedMapLayerRequest', [layerId, originalLayerIndex]);
    }

    refreshEndUserLayer (layerId, layerData = {}) {
        if (typeof layerId === 'undefined') {
            // can't refresh without id
            return;
        }
        const existingLayer = this.mapLayerService.findMapLayer(layerId);

        if (existingLayer) {
            this.refreshLayerOnMap(layerId, existingLayer, layerData);
        } else if (layerData.id) {
            this.createlayer(layerData);
        } else {
            Messaging.error(getMessage('messages.errorFetchLayerEnduserFailed'));
        }
    }

    createlayer (layerData) {
        const mapLayer = this.mapLayerService.createMapLayer(layerData);

        // Register layer to the map layer service.
        if (this.mapLayerService._reservedLayerIds[mapLayer.getId()] !== true) {
            this.mapLayerService.addLayer(mapLayer);
        } else {
            Messaging.error(getMessage('messages.errorInsertAllreadyExists'));
            // should we update if layer already exists??? mapLayerService.updateLayer(e.layerData.id, e.layerData);
        }
    }

    getValidatorFunctions (layerType) {
        if (__VALIDATOR_CACHE[layerType]) {
            return __VALIDATOR_CACHE[layerType];
        }
        const hasValue = (value) => {
            if (typeof value === 'string') {
                return value.trim().length > 0;
            }
            if (typeof value === 'number') {
                return value !== -1;
            }

            return !!value;
        };
        const validators = {
            dataProviderId: hasValue,
            role_permissions: (value = {}) => this.hasAnyPermissions(value)
        };
        const defaultLang = Oskari.getSupportedLanguages()[0];
        const localeKey = `locale.${defaultLang}.name`;
        validators[localeKey] = hasValue;

        // function to dig a value from json object structure.
        // Key is split from dots (.) and is used to get values like options.apiKey
        const getValue = (item, key) => {
            if (!item || !key) {
                return;
            }
            const keyParts = key.split('.');
            if (keyParts.length === 1) {
                // undefined or trimmed value when string
                const value = item[key] && item[key];
                if (typeof value === 'string') {
                    return value.trim();
                }
                // permissions is an object so don't trim but return value
                return value;
            }
            let newItem = item[keyParts.shift()];
            // recurse with new item and parts left on the key
            return getValue(newItem, keyParts.join('.'));
        };
        // wrap validators so they take layer as param so we can dig values from structures
        const wrappers = {};
        Object.keys(validators).forEach(field => {
            wrappers[field] = (layer) => validators[field](getValue(layer, field));
        });

        // Add checks for mandatory fields
        let mandatoryFields = this.getMandatoryFieldsForType(layerType);
        mandatoryFields.forEach(field => {
            wrappers[field] = (layer) => hasValue(getValue(layer, field));
        });
        __VALIDATOR_CACHE[layerType] = wrappers;
        return wrappers;
    }

    getValidatorFor (key) {
        if (!key) {
            return null;
        }
        const validators = this.getValidatorFunctions();
        return validators[key];
    }

    validateUserInputValues (layer) {
        const validators = this.getValidatorFunctions(layer.type);
        const validationErrors = [];
        Object.keys(validators).forEach(field => {
            const isValid = validators[field](layer);
            if (!isValid) {
                validationErrors.push(field);
            }
        });

        this.validateJsonValue(layer.tempStylesJSON, 'validation.styles', validationErrors);
        this.validateJsonValue(layer.tempExternalStylesJSON, 'validation.externalStyles', validationErrors);
        this.validateJsonValue(layer.tempHoverJSON, 'validation.hover', validationErrors);
        this.validateJsonValue(layer.tempAttributesJSON, 'validation.attributes', validationErrors);
        this.validateJsonValue(layer.tempAttributionsJSON, 'validation.attributions', validationErrors);
        this.validateJsonValue(layer.tempTileGridJSON, 'validation.tileGrid', validationErrors);
        return validationErrors;
    }

    hasAnyPermissions (permissions = {}) {
        return Object.keys(permissions).filter(role => {
            return (permissions[role] || []).length > 0;
        }).length > 0;
    }

    validateJsonValue (value, msgKey, validationErrors) {
        if (value === '' || typeof value === 'undefined') {
            return;
        }
        try {
            const result = JSON.parse(value);
            if (typeof result !== 'object') {
                Messaging.error(getMessage(msgKey));
                // TODO fix error checking logic, get rid of validationErrors array
                validationErrors.push(true);
            }
        } catch (error) {
            Messaging.error(getMessage(msgKey));
            validationErrors.push(true);
        }
    }

    deleteLayer () {
        const { layer } = this.getState();
        fetch(Oskari.urls.getRoute('LayerAdmin', { id: layer.id }), {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                // TODO: handle this somehow/close the flyout?
                this.resetLayer();
                this.mapLayerService.removeLayer(layer.id);
            } else {
                Messaging.error(getMessage('messages.errorRemoveLayer'));
            }
            return response;
        });
    }

    /*
        Calls action route like:
        http://localhost:8080/action?action_route=LayerAdmin&url=https://my.domain/geoserver/ows&type=wfslayer&version=1.1.0
    */
    fetchCapabilities (layer = this.getState().layer) {
        this.ajaxStarted();
        var params = {
            type: layer.type,
            version: layer.version,
            url: layer.url,
            user: layer.username,
            pw: layer.password
        };

        // create POST payload from params
        const payload = Object.keys(params)
            .filter(key => typeof params[key] !== 'undefined')
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');

        fetch(Oskari.urls.getRoute('ServiceCapabilities'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Accept': 'application/json'
            },
            body: payload
        }).then(response => {
            this.ajaxFinished();
            if (response.ok) {
                return response.json();
            } else {
                if (response.status === 401) {
                    Messaging.warn(getMessage('messages.unauthorizedErrorFetchCapabilities'));
                    this.updateState({ credentialsCollapseOpen: true });
                } else if (response.status === 408) {
                    // timeout when calling service
                    Messaging.warn(getMessage('messages.timeoutErrorFetchCapabilities'));
                } else if (response.status === 400) {
                    // other connection issues when calling service
                    Messaging.warn(getMessage('messages.connectionErrorFetchCapabilities'));
                } else if (response.status === 417) {
                    // response from the service was not what we expected/parsing problem
                    Messaging.warn(getMessage('messages.parsingErrorFetchCapabilities'));
                } else {
                    // generic error
                    Messaging.error(getMessage('messages.errorFetchCapabilities'));
                }
                return Promise.reject(new Error('Capabilities fetching failed with status code ' + response.status + ' and text ' + response.statusText));
            }
        }).then(json => {
            const updateLayer = { ...layer };
            // update state with layer having no name and id so we don't accidentally overwrite an existing layer
            // this is in case we clicked the "add new from same service" on an existing layer
            delete updateLayer.name;
            delete updateLayer.id;
            this.updateState({
                capabilities: json || {},
                layer: updateLayer,
                propertyFields: this.getPropertyFields(updateLayer)
            });
        }).catch(error => {
            this.log.error(error);
        });
    }

    updateCapabilities () {
        const { layer } = this.getState();
        const params = {
            id: layer.id,
            srs: Oskari.getSandbox().getMap().getSrsName()
        };
        const updateFailed = reason => {
            const errorMsgKey = reason ? 'capabilities.updateFailedWithReason' : 'capabilities.updateFailed';
            Messaging.error(getMessage(errorMsgKey, { reason }));
        };
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('UpdateCapabilities', params), {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            this.ajaxFinished();
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error('Updating capabilities failed'));
            }
        }).then(data => {
            const { success, error, layerData = {} } = data;
            if (success.includes(`${layer.id}`)) {
                this.updateState({
                    capabilities: layerData.capabilities,
                    messages: [{ key: 'capabilities.updatedSuccesfully', type: 'success' }]
                });
            } else {
                if (error) {
                    updateFailed(Object.values(error)[0]);
                    return;
                };
                updateFailed();
            }
        }).catch(error => {
            updateFailed();
            this.log.error(error);
        });
    }

    setMapLayerGroups (mapLayerGroups) {
        this.mapLayerGroups = mapLayerGroups;
    }

    fetchLayerAdminMetadata () {
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('LayerAdminMetadata'))
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(new Error('Fetching user roles and permission types failed'));
                }
            }).then(data => {
                this.loadingCount--;
                const currentLayer = this.getState().layer;
                this.layerHelper.initPermissionsForLayer(currentLayer, data.roles);
                this.updateState({
                    currentLayer,
                    loading: this.isLoading(),
                    metadata: data
                });
                // invalidate cache if it was populated
                Object.keys(__VALIDATOR_CACHE).forEach(key => delete __VALIDATOR_CACHE[key]);
            }).catch(error => {
                this.log.error(error);
                Messaging.error('messages.errorFetchUserRolesAndPermissionTypes');
            });
    }

    /**
     * Object with roles and permissionTypes objects that are needed to create the UI that
     * matches the configuration of the system
     */
    getAdminMetadata () {
        return this.getState().metadata || {};
    }

    getMandatoryFieldsForType (type) {
        const metadata = this.getAdminMetadata().layerTypes || {};
        const mandatoryFields = metadata[type] || [];
        // TODO: add dataproviderId, role_permissions, default locale?
        return mandatoryFields;
    }

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

    setPermissionForAll (permission, enabled) {
        const layer = this.getState().layer;
        handlePermissionForAllRoles(enabled, layer.role_permissions, permission);
        this.updateState({ layer });
    }

    togglePermission (role, permission) {
        const layer = this.getState().layer;
        handlePermissionForSingleRole(layer.role_permissions, permission, role);

        this.updateState({ layer });
    }

    saveStyleToLayer (style, styleLabel, styleId) {
        const layer = this.getState().layer;
        const currentStyles = layer.options.styles || null;
        const layerStyleId = styleId || 's_' + new Date().getTime();

        layer.options.styles = {
            ...currentStyles,
            [layerStyleId]: {
                title: styleLabel,
                featureStyle: style
            }
        };

        this.updateState({ layer: layer });
    }

    removeStyleFromLayer (styleId) {
        const layer = this.getState().layer;
        delete layer.options.styles[styleId];
        this.updateState({ layer: layer });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'addNewFromSameService',
    'layerSelected',
    'removeStyleFromLayer',
    'saveStyleToLayer',
    'setAttributes',
    'setAttributionsJSON',
    'setCapabilitiesUpdateRate',
    'setClusteringDistance',
    'setDataProviderId',
    'setExternalStyleJSON',
    'setForcedSRS',
    'setGfiContent',
    'setGfiType',
    'setGfiXslt',
    'setGroup',
    'setHoverJSON',
    'setLayerName',
    'setLayerUrl',
    'setLegendUrl',
    'setLocalizedNames',
    'setMessage',
    'setMessages',
    'setMetadataIdentifier',
    'setMinAndMaxScale',
    'setOpacity',
    'setOptions',
    'setPassword',
    'setPermissionForAll',
    'setSingleTile',
    'setTimeSeriesUI',
    'setTimeSeriesMetadataLayer',
    'setTimeSeriesMetadataAttribute',
    'setTimeSeriesMetadataToggleLevel',
    'setRealtime',
    'setRefreshRate',
    'setRenderMode',
    'setSelectedTime',
    'setStyle',
    'setStyleJSON',
    'setTileGridJSON',
    'setType',
    'setUsername',
    'setVersion',
    'setTab',
    'skipCapabilities',
    'togglePermission',
    'updateCapabilities',
    'versionSelected'
]);
export { wrapped as AdminLayerFormHandler };
