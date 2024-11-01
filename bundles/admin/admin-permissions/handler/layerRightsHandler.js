import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { validateSystemRoles } from '../../rolesHelper';
import { getZoomLevelHelper } from '../../../mapping/mapmodule/util/scale';

const DEFAULT_PERMISSIONS = ['VIEW_LAYER', 'VIEW_PUBLISHED', 'PUBLISH', 'DOWNLOAD'];

class UIHandler extends StateHandler {
    constructor (instance, consumer) {
        super();
        this.instance = instance;
        this.setState({
            roles: [],
            permissions: [],
            resources: [],
            layerDetails: [],
            dataProviders: [],
            filtered: null,
            selectedRole: null,
            loading: false,
            unSavedChanges: {}, // {[id]: [permissions] }
            pagination: {
                pageSize: 20,
                page: 1
            }
        });
        this.addStateListener(consumer);
        this.fetchRoles();
    };

    getName () {
        return 'LayerRightsHandler';
    }

    async setSelectedRole (selectedRole) {
        // unsaved changes are role related, clear on select
        this.updateState({ selectedRole, unSavedChanges: {} });
        if (!this.getState().resources.length) {
            await this.fetchPermissions();
        }
        if (selectedRole === 'layer') {
            this.initLayerDetails();
        }
    }

    setLoading (loading) {
        this.updateState({ loading });
    }

    editLayer (layerId) {
        this.instance.getSandbox().postRequestByName('ShowLayerEditorRequest', [layerId]);
    }

    addLayer (layerId) {
        this.instance.getSandbox().postRequestByName('AddMapLayerRequest', [layerId]);
    }

    reset (full) {
        const { pagination } = this.getState();
        const newState = {
            unSavedChanges: {},
            filtered: null,
            pagination: {
                ...pagination,
                page: 1
            }
        };
        if (full) {
            newState.selectedRole = null;
            newState.resources = [];
        }
        this.updateState(newState);
    }

    cancel () {
        this.instance.closeFlyout();
    }

    setCheckAllForPermission (idList, type, enabled) {
        const updated = {};
        idList.forEach(id => {
            updated[id] = this.getUpdatedPermissions(id, type, enabled);
        });
        this.updateState({ unSavedChanges: { ...this.getState().unSavedChanges, ...updated } });
    }

    getUpdatedPermissions (id, type, enabled) {
        const { resources, selectedRole, unSavedChanges } = this.getState();
        const current = unSavedChanges[id] || resources.find(p => p.id === id)?.permissions?.[selectedRole] || [];
        if (enabled) {
            // also used for check all -> don't add duplicates
            return current.includes(type) ? current : [...current, type];
        }
        return current.filter(p => p !== type);
    }

    togglePermission (id, type, enabled) {
        const permissions = this.getUpdatedPermissions(id, type, enabled);
        this.updateState({ unSavedChanges: { ...this.getState().unSavedChanges, [id]: permissions } });
    }

    setPagination (pagination) {
        this.updateState({ pagination });
    }

    search (searchText) {
        this.reset();
        if (!searchText) {
            return;
        }
        const lower = searchText.toLowerCase();
        const filtered = this.getState().resources
            .filter(r => r.name.toLowerCase().includes(lower));
        this.updateState({ filtered });
    }

    async fetchRoles () {
        try {
            const response = await fetch(Oskari.urls.getRoute('ManageRoles', {
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                getExternalIds: 'ROLE'
            }), {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const { rolelist, systemRoles } = await response.json();
            validateSystemRoles(systemRoles);
            const getType = value => Object.keys(systemRoles).find(key => systemRoles[key] === value) || 'other';
            const roles = rolelist
                .map(role => ({ ...role, type: getType(role.name) }))
                .sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
            this.updateState({ roles });
        } catch (e) {
            Messaging.error(this.instance.loc('roles.error.fetch'));
            this.updateState({ roles: [] });
        }
    }

    _mapLayerToResource (json) {
        const { id, layerType, ...rest } = json;
        const layer = this.instance.getSandbox().findMapLayerFromAllAvailable(id);
        // TODO: hasTimeseries from backend
        return {
            ...rest,
            id,
            key: id,
            type: layer?.getLayerType() || layerType.replace('layer', ''),
            hasTimeseries: layer?.hasTimeseries() || false,
            isAvailable: !!layer
        };
    }

    initLayerDetails () {
        const sb = this.instance.getSandbox();
        // TODO: Should fetch details from backend to get url, locale, opacity...
        // override or from capa for metadata and legend
        // TODO: listen layer update event => details selected => fetch
        const { resources } = this.getState();
        const scales = sb.findRegisteredModuleInstance('MainMapModule')?.getScaleArray();
        const zoomLevelHelper = getZoomLevelHelper(scales);
        const layerDetails = resources
            .map(r => this._mapResourceToLayerDetails(r, zoomLevelHelper))
            .filter(nonNull => nonNull);

        const dataProviders = sb.getService('Oskari.mapframework.service.MapLayerService')
            ?.getDataProviders().filter(dp => dp.id > 0) || [];

        this.updateState({ layerDetails, dataProviders });
    }

    _mapResourceToLayerDetails (resource, zoomLevelHelper) {
        const lang = Oskari.getLang();
        const layer = this.instance.getSandbox().findMapLayerFromAllAvailable(resource.id);
        if (!layer) {
            return null;
        }
        return {
            ...resource,
            name: layer.getLayerName(),
            [lang]: layer.getName(),
            version: layer.getVersion(),
            providerId: layer.getDataProviderId(),
            groups: layer.getGroups(),
            url: layer.getLayerUrls().join(),
            min: zoomLevelHelper.getMinZoom(layer.getMinScale()),
            max: zoomLevelHelper.getMaxZoom(layer.getMaxScale()),
            opacity: layer.getOpacity(),
            legend: layer.getLegendImage(),
            metadata: layer.getMetadataIdentifier()
        };
    }

    _mapPerimssions (permissions) {
        // move the recognized permissionTypes to the front with additional styles in random order
        const orderedTypes = DEFAULT_PERMISSIONS.filter(type => permissions[type]);
        const additionalTypes = Object.keys(permissions).filter(type => !orderedTypes.includes(type));
        const localized = this.instance.loc('permissions.type');
        return [...orderedTypes, ...additionalTypes].map(type => {
            const value = permissions[type];
            return {
                type,
                name: localized[value] || value,
                isDefaultType: orderedTypes.includes(type)
            };
        });
    }

    async fetchPermissions () {
        try {
            this.setLoading(true);
            const response = await fetch(Oskari.urls.getRoute('LayerPermission', {
                lang: Oskari.getLang()
            }), {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const { names = {}, layers = [] } = await response.json();

            const permissions = this._mapPerimssions(names);
            const resources = layers.map(l => this._mapLayerToResource(l));

            this.updateState({ permissions, resources });
            this.setLoading(false);
        } catch (e) {
            Messaging.error(this.instance.loc('permissions.error.fetch'));
            this.updateState({
                permissions: [],
                resources: []
            });
            this.setLoading(false);
        }
    }

    async savePermissions () {
        try {
            this.setLoading(true);
            const { unSavedChanges, selectedRole: roleId } = this.getState();

            const changedPermissions = Object.keys(unSavedChanges)
                .map(id => ({ id, roleId, permissions: unSavedChanges[id] }));

            const chunks = this.createChunks(changedPermissions, 100);
            for (const chunk of chunks) {
                const payload = new URLSearchParams();
                payload.append('layers', JSON.stringify(chunk));
                const response = await fetch(Oskari.urls.getRoute('LayerPermission'), {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    lang: Oskari.getLang(),
                    timestamp: new Date().getTime(),
                    body: payload
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            }
            Messaging.success(this.instance.loc('permissions.success.save'));
            this.reset();
            this.fetchPermissions();
        } catch (e) {
            Messaging.error(this.instance.loc('permissions.error.save'));
            this.setLoading(false);
        }
    }

    /**
     * Split list into chunks of given size
     * @param  {Array} list
     * @param  {Number} size
     * @return {Array} array containing list as chunks
     */
    createChunks (list, size) {
        const result = [];
        const chunksCount = Math.ceil(list.length / size);
        for (let i = 0; i < chunksCount; ++i) {
            let end = i + size;
            if (end >= list.length) {
                end = list.length;
            }
            const chunk = list.slice(i, end);
            result.push(chunk);
        }
        return result;
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setSelectedRole',
    'togglePermission',
    'savePermissions',
    'setCheckAllForPermission',
    'setPagination',
    'search',
    'clearSearch',
    'cancel',
    'addLayer',
    'editLayer'
]);

export { wrapped as LayerRightsHandler };
