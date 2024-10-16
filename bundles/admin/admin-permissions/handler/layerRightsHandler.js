import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

const DEFAULT_PERMISSIONS = ['VIEW_LAYER', 'VIEW_PUBLISHED', 'PUBLISH', 'DOWNLOAD'];

class UIHandler extends StateHandler {
    constructor (instance, consumer) {
        super();
        this.instance = instance;
        this.setState({
            roles: [],
            permissions: [],
            resources: [],
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

    setSelectedRole (selectedRole) {
        // unsaved changes are role related, clear on select
        this.updateState({ selectedRole, unSavedChanges: {} });
        if (!this.getState().resources.length) {
            this.fetchPermissions();
        }
    }

    setLoading (loading) {
        this.updateState({ loading });
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
            const systemRoleNames = Object.values(systemRoles);
            const roles = rolelist
                .map(({ name, id }) => ({ value: id, label: name, isSystem: systemRoleNames.includes(name) }))
                .sort((a, b) => Oskari.util.naturalSort(a.label, b.label));
            this.updateState({ roles });
        } catch (e) {
            Messaging.error(this.instance.loc('roles.error.fetch'));
            this.updateState({ roles: [] });
        }
    }

    _mapLayerToResource (json) {
        const { id, layerType, ...rest } = json;
        const layer = this.instance.getSandbox().findMapLayerFromAllAvailable(id);
        return {
            ...rest,
            id,
            key: id,
            type: layer?.getLayerType() || layerType.replace('layer', ''),
            hasTimeseries: layer?.hasTimeseries() || false,
            isAvailable: !!layer
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
            this.updateState({
                permissions: this._mapPerimssions(names),
                resources: layers.map(l => this._mapLayerToResource(l))
            });
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
    'cancel'
]);

export { wrapped as LayerRightsHandler };
