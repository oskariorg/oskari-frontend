import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.sandbox = Oskari.getSandbox();
        this.setState({
            roles: [],
            permissions: [],
            selectedRole: 0,
            loading: false,
            changedIds: new Set()
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
                changedIds: new Set()
            });
            this.setLoading(false);
        } catch (e) {
            Messaging.error(Oskari.getMsg('admin-permissions', 'rights.error.title'));
            this.updateState({
                permissions: [],
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
                    ...this.state.permissions?.resource.find(p => p.id === changed),
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
        let permissions = [...this.state.permissions?.resource];
        const index = permissions.findIndex(p => p.id === id);
        const permIndex = permissions[index].permissions.findIndex(p => p.id === permissionId);
        permissions[index].permissions[permIndex].allow = !permissions[index].permissions[permIndex].allow;
        this.updateState({
            permissions: {
                ...this.state.permissions,
                resource: permissions,
                changedIds: new Set(this.state.changedIds).add(id)
            }
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
    'savePermissions'
]);

export { wrapped as LayerRightsHandler };
