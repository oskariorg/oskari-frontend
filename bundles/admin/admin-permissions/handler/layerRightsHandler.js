import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.sandbox = Oskari.getSandbox();
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
                changedIds: new Set()
            });
        }
    }

    setLoading (status) {
        this.updateState({
            loading: status
        });
    }

    setCheckAllForPermission (permissionType, enabled) {
        let permissions = [...this.state.resources];
        const startIndex = (this.state.pagination.page - 1) * this.state.pagination.pageSize;
        const endIndex = this.state.pagination.pageSize * this.state.pagination.page;
        const changedIds = new Set(this.state.changedIds);
        for (let i = startIndex; i < endIndex && i < permissions.length; i++) {
            const permIndex = permissions[i].permissions.findIndex(p => p.id === permissionType);
            permissions[i].permissions[permIndex].allow = enabled;
            changedIds.add(permissions[i].id);
        }

        this.updateState({
            resources: permissions,
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
        const permissions = structuredClone(this.state.permissions?.resource?.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase())));
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
            resources: structuredClone(this.state.permissions?.resource) || [],
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
            const response = await fetch(Oskari.urls.getRoute('GetAllRoles', {
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
                    ...result.external
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
            const response = await fetch(Oskari.urls.getRoute('GetPermissionsLayerHandlers', {
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                externalType: 'ROLE',
                externalId: this.state.selectedRole
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
                resources: structuredClone(result?.resource) || [],
                changedIds: new Set(),
                pagination: {
                    ...this.state.pagination,
                    page: 1
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
                perm.permissions = perm.permissions.map(p => ({ key: p.id, value: p.allow }));
            }
            const chunks = this.createChunks(changedPermissions, 100);
            for (const chunk of chunks) {
                const payload = new URLSearchParams();
                payload.append('resource', JSON.stringify(chunk));
                const response = await fetch(Oskari.urls.getRoute('SaveLayerPermission'), {
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

    togglePermission (id, permissionId) {
        let permissions = [...this.state.resources];
        const index = permissions.findIndex(p => p.id === id);
        const permIndex = permissions[index].permissions.findIndex(p => p.id === permissionId);
        permissions[index].permissions[permIndex].allow = !permissions[index].permissions[permIndex].allow;
        this.updateState({
            resources: permissions,
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
    'clearSearch'
]);

export { wrapped as LayerRightsHandler };
