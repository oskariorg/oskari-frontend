import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (conf, consumer) {
        super();
        this.restUrl = conf.restUrl;
        this.isExternal = conf.isExternal;
        this.passwordRequirements = conf.passwordRequirements || {};
        this.sandbox = Oskari.getSandbox();
        this.setState({
            activeTab: 'admin-users-tab',
            addingUser: false,
            editingUserId: null,
            userFormState: this.initUserForm(),
            roleFormState: this.initRoleForm(),
            users: [],
            roles: [],
            userFormErrors: [],
            roleFormErrors: false,
            editingRoleError: false,
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

    setActiveTab (tab) {
        this.updateState({
            activeTab: tab
        });
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
        try {
            const search = this.state.userPagination.search && this.state.userPagination.search.trim() !== '' ? this.state.userPagination.search : null;
            const offset = this.state.userPagination.page > 1 ? (this.state.userPagination.page - 1) * this.state.userPagination.limit : 0;
            const response = await fetch(Oskari.urls.buildUrl(Oskari.urls.getRoute() + this.restUrl, {
                limit: this.state.userPagination.limit,
                offset,
                search
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
                users: result.users,
                userPagination: {
                    ...this.state.userPagination,
                    totalCount: result.total_count
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
            addingUser: !this.state.addingUser,
            editingUserId: null,
            userFormState: this.initUserForm(),
            userFormErrors: []
        });
    }

    setEditingUserId (userId) {
        const user = this.state.users.find(u => u.id === userId);
        this.updateState({
            addingUser: false,
            editingUserId: userId,
            userFormState: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.user,
                email: user.email,
                password: '',
                rePassword: '',
                roles: user.roles
            },
            userFormErrors: []
        });
    }

    setEditingRole (role) {
        this.updateState({
            editingRole: role
        });
    }

    updateEditingRole (name) {
        this.updateState({
            editingRole: {
                ...this.state.editingRole,
                name: name
            }
        });
    }

    closeUserForm () {
        this.updateState({
            editingUserId: null,
            addingUser: false,
            userFormState: this.initUserForm(),
            userFormErrors: []
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
            username: '',
            email: '',
            password: '',
            rePassword: '',
            roles: []
        };
    }

    initRoleForm () {
        return {
            name: ''
        };
    }

    updateRoleFormState (value) {
        this.updateState({
            roleFormState: {
                name: value
            }
        });
    }

    validateUserForm () {
        this.updateState({
            userFormErrors: []
        });
        const errors = [];
        if (this.isExternal) {
            return errors;
        }
        Object.keys(this.state.userFormState).forEach(key => {
            if (key !== 'password' && key !== 'rePassword') {
                if (!this.state.userFormState[key] || !this.state.userFormState[key].length > 0) {
                    errors.push(key);
                }
            }
        });

        let passwordRequired = false;
        if (!this.state.editingUserId || this.state.userFormState.password?.length > 0 || this.state.userFormState.rePassword?.length > 0) {
            passwordRequired = true;
        }

        if (passwordRequired) {
            if (
                !this.state.userFormState.password || !this.state.userFormState.rePassword ||
                !this.state.userFormState.password.length > 0 || !this.state.userFormState.rePassword.length > 0
            ) {
                errors.push('password');
            } else if (this.state.userFormState.password !== this.state.userFormState.rePassword) {
                errors.push('password');
                Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.password_mismatch'));
            }
        }

        if (errors.length > 0) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.form_invalid'));
        }

        return errors;
    }

    async saveUser () {
        const errors = this.validateUserForm();
        if (errors.length > 0) {
            this.updateState({
                userFormErrors: errors
            });
            return;
        }
        try {
            const data = new URLSearchParams({
                id: this.state.editingUserId,
                user: this.state.userFormState.username,
                firstName: this.state.userFormState.firstName,
                lastName: this.state.userFormState.lastName,
                email: this.state.userFormState.email,
                pass: this.state.userFormState.password,
                pass_retype: this.state.userFormState.rePassword
            });
            this.state.userFormState.roles.forEach(role => {
                data.append('roles', role);
            });

            const response = await fetch(Oskari.urls.getRoute() + this.restUrl, {
                method: this.state.editingUserId ? 'POST' : 'PUT',
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
                this.updateState({
                    userFormErrors: [
                        ...this.state.userFormErrors,
                        'password'
                    ]
                });
            } else {
                Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.save_failed'));
            }
        }
    }

    async deleteUser (uid) {
        try {
            const response = await fetch(Oskari.urls.getRoute() + this.restUrl + '&id=' + uid, {
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

    async addRole () {
        this.updateState({
            roleFormError: false
        });
        if (!this.state.roleFormState.name || !this.state.roleFormState.name.length > 0) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.form_invalid'));
            this.updateState({
                roleFormErrors: true
            });
            return;
        }
        try {
            const response = await fetch(Oskari.urls.getRoute('ManageRoles'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    name: this.state.roleFormState.name
                })
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            this.fetchRoles();
            this.updateState({
                roleFormState: this.initRoleForm()
            });
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminroles.doSave_failed'));
        }
    }

    async updateRole (role) {
        this.updateState({
            editingRoleError: false
        });
        if (!this.state.editingRole || !this.state.editingRole.id || !this.state.editingRole.name) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.form_invalid'));
            this.updateState({
                editingRoleError: true
            });
            return;
        }
        try {
            const response = await fetch(Oskari.urls.getRoute('ManageRoles'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    id: role.id,
                    name: role.name
                })
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            this.fetchRoles();
            this.updateState({
                editingRole: null
            });
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
            this.updateState({
                editingRole: null
            });
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
    'setEditingUserId',
    'updateUserFormState',
    'updateRoleFormState',
    'closeUserForm',
    'saveUser',
    'deleteUser',
    'deleteRole',
    'addRole',
    'fetchUsers',
    'fetchRoles',
    'setUserPage',
    'search',
    'resetSearch',
    'setEditingRole',
    'updateRole',
    'updateEditingRole'
]);

export { wrapped as AdminUsersHandler };
