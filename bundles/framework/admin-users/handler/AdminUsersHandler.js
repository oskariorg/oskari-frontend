import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (conf = {}, consumer) {
        super();
        if (conf.restUrl) {
            this.restUrl = Oskari.urls.getRoute() + conf.restUrl;
        } else {
            this.restUrl = Oskari.urls.getRoute('Users');
        }
        this.isExternal = conf.isExternal;
        this.passwordRequirements = conf.requirements || {};
        this.sandbox = Oskari.getSandbox();
        this.setState({
            activeTab: 'admin-users-tab',
            userFormState: null,
            users: [],
            roles: [],
            editingRole: null,
            userPagination: {
                limit: 10,
                page: 1,
                search: '',
                totalCount: 0
            }
        });
        this.eventHandlers = this.createEventHandlers();
        this.addStateListener(consumer);
    };

    getName () {
        return 'AdminUsersHandler';
    }

    setActiveTab (activeTab) {
        this.updateState({ activeTab });
    }

    setUserPage (page) {
        this.updateState({
            userPagination: {
                ...this.state.userPagination,
                page
            }
        });
        this.fetchUsers();
    }

    search (searchText) {
        this.updateState({
            userPagination: {
                ...this.state.userPagination,
                search: searchText,
                page: 1
            }
        });
        this.fetchUsers();
    }

    resetSearch () {
        this.updateState({
            userPagination: {
                ...this.state.userPagination,
                search: '',
                page: 1
            }
        });
        this.fetchUsers();
    }

    async fetchUsers () {
        const { search, page, limit } = this.state.userPagination;
        try {
            const trimmed = search.trim().length ? search.trim() : null;
            const offset = (page - 1) * limit;
            const response = await fetch(Oskari.urls.buildUrl(this.restUrl, {
                limit,
                offset,
                search: trimmed
            }), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const { users, total_count } = await response.json();
            this.updateState({
                users,
                userPagination: {
                    ...this.state.userPagination,
                    totalCount: total_count
                }
            });
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.fetch_failed'));
            this.updateState({
                users: []
            });
        }
    }

    async fetchRoles () {
        try {
            const response = await fetch(Oskari.urls.getRoute('ManageRoles'), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const result = await response.json();
            let guestRole = result.systemRoles['anonymous'];
            let roles = result.rolelist.map(role => ({
                ...role,
                systemRole: Object.values(result.systemRoles).includes(role.name)
            }));
            if (guestRole) {
                roles = roles.filter(r => r.name !== guestRole);
            }
            this.updateState({ roles });
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'failed_to_get_roles_title'));
            this.updateState({
                roles: []
            });
        }
    }

    setAddingUser () {
        this.updateState({
            userFormState: this.initUserForm()
        });
    }

    setEditingUser (id) {
        const user = this.state.users.find(u => u.id === id) || {};
        this.updateState({
            userFormState: {
                ...user,
                password: '',
                rePassword: ''
            }
        });
        // mark invalid fields
        this.validateUserForm();
    }

    setEditingRole (editingRole) {
        this.updateState({editingRole});
    }

    updateEditingRole (key, value) {
        this.updateState({
            editingRole: {
                ...this.state.editingRole,
                status: '',
                [key]: value
            }
        });
    }

    closeUserForm () {
        this.updateState({
            userFormState: null
        });
    }

    updateUserFormState (key, value) {
        this.updateState({
            userFormState: {
                ...this.state.userFormState,
                [key]: value
            }
        });
    }

    initUserForm () {
        return {
            firstName: '',
            lastName: '',
            user: '',
            email: '',
            password: '',
            rePassword: '',
            roles: []
        };
    }

    validateUserForm () {
        if (this.isExternal) {
            this.updateUserFormState('errors', errors);
        }

        const { id, roles, errors: ignore, password, rePassword, ...fields } = this.state.userFormState;
        const errors = [];

        Object.keys(fields).forEach(key => {
            if (!fields[key]) {
                errors.push(key);
            }
        });

        const passwordRequired = !id || password.length > 0;
        if (passwordRequired) {
            const { length } = this.passwordRequirements;
            if (password.length < length) {
                errors.push('password');
            }
            if (password !== rePassword) {
                errors.push('rePassword');
                Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.password_mismatch'));
            }
        }

        if (errors.length > 0) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.form_invalid'));
        }
        this.updateUserFormState('errors', errors);
    }

    async saveUser () {
        this.validateUserForm();
        const { errors, roles, ...userParams } = this.state.userFormState;
        if (errors.length > 0) {
            return;
        }
        try {
            const data = new URLSearchParams(userParams);
            roles.forEach(role => {
                data.append('roles', role);
            });

            const response = await fetch(this.restUrl, {
                method: userParams.id ? 'POST' : 'PUT',
                body: data.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.error);
            }
            this.closeUserForm();
            this.fetchUsers();
        } catch (e) {
            if (e.message === 'Password too weak') {
                let error = `${Oskari.getMsg('AdminUsers', 'flyout.adminusers.passwordRequirements.title')}`;
                Object.keys(this.passwordRequirements).forEach((key, index) => {
                    if (key === 'length') {
                        error += `${Oskari.getMsg('AdminUsers', 'flyout.adminusers.passwordRequirements.length', { length: this.passwordRequirements[key] })}`;
                    } else {
                        error += `${Oskari.getMsg('AdminUsers', `flyout.adminusers.passwordRequirements.${key}`)}`;
                    }
                    if ((index + 1) < Object.keys(this.passwordRequirements).length) {
                        error += ', ';
                    }
                });
                Messaging.error(error);
                this.updateUserFormState('errors', ['password']);
            } else {
                Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.save_failed'));
            }
        }
    }

    async deleteUser (uid) {
        try {
            const response = await fetch(this.restUrl + '&id=' + uid, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            this.fetchUsers();
            this.closeUserForm();
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.delete_failed'));
        }
    }

    async addRole (name) {
        if (!name) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.form_invalid'));
            return;
        }
        try {
            const response = await fetch(Oskari.urls.getRoute('ManageRoles'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ name })
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            this.fetchRoles();
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminroles.doSave_failed'));
        }
    }

    async updateRole () {
        const { id, name } = this.state.editingRole || {};
        if (!id || !name) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.form_invalid'));
            this.updateEditingRole('status', 'error');
            return;
        }
        try {
            const response = await fetch(Oskari.urls.getRoute('ManageRoles'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ id, name })
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            this.fetchRoles();
            this.setEditingRole(null);
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminroles.doSave_failed'));
        }
    }

    async deleteRole (id) {
        try {
            const response = await fetch(Oskari.urls.getRoute('ManageRoles') + '&id=' + id, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            this.fetchRoles();
            this.setEditingRole(null);
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminroles.delete_failed'));
        }
    }

    createEventHandlers () {
        const handlers = {
            'userinterface.ExtensionUpdatedEvent': (event) => {
                if (event.getExtension().getName() !== 'AdminUsers') {
                    return;
                }
                if (event.getViewState() !== 'close') {
                    this.fetchUsers();
                    this.fetchRoles();
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setActiveTab',
    'setAddingUser',
    'setEditingUser',
    'updateUserFormState',
    'closeUserForm',
    'saveUser',
    'deleteUser',
    'deleteRole',
    'addRole',
    'setUserPage',
    'search',
    'resetSearch',
    'setEditingRole',
    'updateRole',
    'updateEditingRole'
]);

export { wrapped as AdminUsersHandler };
