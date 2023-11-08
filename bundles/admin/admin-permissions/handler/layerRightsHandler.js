import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.sandbox = Oskari.getSandbox();
        this.layerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.setState({
            roles: [],
            permissions: [],
            resources: [],
            selectedRole: 0,
            loading: false,
            changedIds: new Set(),
            pagination: {
                pageSize: 50,
                page: 1,
                filter: ''
            }
        });
        this.addStateListener(consumer);
        this.fetchRoles();
    };

    getName () {
        return 'LayerRightsHandler';
    }

    setSelectedRole (roleId) {
        this.updateState({
            selectedRole: roleId
        });
        if (roleId !== 0) {
            this.fetchPermissions();
        } else {
            this.updateState({
                permissions: [],
                resources: [],
                changedIds: new Set()
            });
        }
    }

    setLoading (status) {
        this.updateState({
            loading: status
        });
    }

    resetTable () {
        this.updateState({
            resources: structuredClone(this.state.permissions?.layers) || [],
            changedIds: new Set(),
            selectedRole: 0,
            pagination: {
                ...this.state.pagination,
                filter: '',
                page: 1
            }
        });
    }

    cancel () {
        this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'admin-permissions']);
    }

    setCheckAllForPermission (permissionType, enabled) {
        let layers = [...this.state.resources];
        const startIndex = (this.state.pagination.page - 1) * this.state.pagination.pageSize;
        const endIndex = this.state.pagination.pageSize * this.state.pagination.page;
        const changedIds = new Set(this.state.changedIds);
        for (let i = startIndex; i < endIndex && i < layers.length; i++) {
            let permissions = layers[i]?.permissions[this.state.selectedRole] || [];
            if (enabled) {
                if (permissions.findIndex(p => p === permissionType) < 0) {
                    permissions.push(permissionType);
                }
            } else {
                const permIndex = permissions.findIndex(p => p === permissionType);
                if (permIndex > -1) permissions.splice(permIndex, 1);
            }
            layers[i].permissions[this.state.selectedRole] = permissions;
            changedIds.add(layers[i].id);
        }

        this.updateState({
            resources: layers,
            changedIds: new Set(changedIds)
        });
    }

    setPage (page) {
        this.updateState({
            pagination: {
                ...this.state.pagination,
                page: page
            }
        });
    }

    search (searchText) {
        const permissions = structuredClone(this.state.permissions?.layers?.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase())));
        this.updateState({
            resources: permissions,
            changedIds: new Set(),
            pagination: {
                ...this.state.pagination,
                filter: searchText,
                page: 1
            }
        });
    }

    clearSearch () {
        this.updateState({
            resources: structuredClone(this.state.permissions?.layers) || [],
            changedIds: new Set(),
            pagination: {
                ...this.state.pagination,
                filter: '',
                page: 1
            }
        });
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
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const result = await response.json();
            this.updateState({
                roles: [
                    { id: 0, name: `-- ${Oskari.getMsg('admin-permissions', 'rights.selectValue')} --` },
                    ...result.rolelist
                ]
            });
        } catch (e) {
            Messaging.error(Oskari.getMsg('admin-permissions', 'rights.error.title'));
            this.updateState({
                roles: []
            });
        }
    }

    async fetchPermissions () {
        try {
            this.setLoading(true);
            const response = await fetch(Oskari.urls.getRoute('LayerPermission', {
                lang: Oskari.getLang()
            }), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const result = await response.json();
            this.updateState({
                permissions: result,
                resources: structuredClone(result?.layers) || [],
                changedIds: new Set(),
                pagination: {
                    ...this.state.pagination,
                    page: 1,
                    filter: ''
                }
            });
            this.setLoading(false);
        } catch (e) {
            Messaging.error(Oskari.getMsg('admin-permissions', 'rights.error.title'));
            this.updateState({
                permissions: [],
                resources: [],
                changedIds: new Set()
            });
            this.setLoading(false);
        }
    }

    async savePermissions () {
        try {
            this.setLoading(true);
            const changedPermissions = [];
            for (const changed of this.state.changedIds) {
                changedPermissions.push({
                    ...this.state.resources?.find(p => p.id === changed),
                    roleId: this.state.selectedRole
                });
            }
            for (let perm of changedPermissions) {
                perm.permissions = perm.permissions[this.state.selectedRole];
            }
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
            Messaging.success(Oskari.getMsg('admin-permissions', 'rights.success.message'));
            this.fetchPermissions();
        } catch (e) {
            Messaging.error(Oskari.getMsg('admin-permissions', 'rights.error.message'));
            this.updateState({
                changedIds: new Set()
            });
            this.setLoading(false);
        }
    }

    togglePermission (id, permissionId, enabled) {
        let layers = [...this.state.resources];
        const index = layers.findIndex(p => p.id === id);

        let permissions = layers[index]?.permissions[this.state.selectedRole] || [];
        if (enabled) {
            if (permissions.findIndex(p => p === permissionId) < 0) {
                permissions.push(permissionId);
            }
        } else {
            const permIndex = permissions.findIndex(p => p === permissionId);
            if (permIndex > -1) permissions.splice(permIndex, 1);
        }

        layers[index].permissions[this.state.selectedRole] = permissions;

        this.updateState({
            resources: layers,
            changedIds: new Set(this.state.changedIds).add(id)
        });
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
    'setPage',
    'search',
    'clearSearch',
    'resetTable',
    'cancel'
]);

export { wrapped as LayerRightsHandler };
