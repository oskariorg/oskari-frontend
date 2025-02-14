import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { getRolesByTypeFromResponse } from '../../../admin/util/rolesHelper';

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
            roles: {}, // {system, additional}
            editingRole: null,
            usersByRole: {},
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
            const { users = [], total_count } = await response.json();
            this.updateState({
                users,
                userPagination: {
                    ...this.state.userPagination,
                    totalCount: total_count
                }
            });
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'users.errors.fetch'));
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
            const jsonResponse = await response.json();
            const roles = getRolesByTypeFromResponse(jsonResponse);
            this.updateState({ roles });
        } catch (e) {
            this.updateState({ roles: {} });
            Messaging.error(Oskari.getMsg('AdminUsers', 'roles.errors.fetch'));
        }
    }

    async showUsersByRole (roleId) {
        const tab = 'admin-users-by-role-tab';
        if (this.state.activeTab !== tab) {
            this.setActiveTab(tab);
        }
        this.updateState({ usersByRole: { roleId } });
        const users = await this.fetchUsersByRole(roleId);
        this.updateState({ usersByRole: { users, roleId } });
    }

    async fetchUsersByRole (roleId) {
        try {
            const response = await fetch(Oskari.urls.buildUrl(this.restUrl, {
                roleId
            }), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const { users } = await response.json();
            return users;
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'usersByRole.errors.fetch'));
            return [];
        }
    }

    setAddingUser () {
        this.setEditingUser(this.initUser());
    }

    editUserById (id) {
        const user = this.getState().users.find(u => u.id === id);
        this.setEditingUser(user);
    }

    editUserFromRoles (id, userName) {
        this.setActiveTab('admin-users-tab');
        // fetchUsersByRole doesn't return roles so usersByRole.users doesn't have roles
        // search user by name if not found in paginated results
        const user = this.getState().users.find(u => u.id === id);
        if (user) {
            this.setEditingUser(user);
        } else {
            this.search(userName);
        }
    }

    setEditingUser (user) {
        if (!user) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'users.noMatch'));
        }
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
        this.updateState({ editingRole });
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
        if (key === 'password' || key === 'rePassword') {
            this.validatePassword();
        }
    }

    initUser () {
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
        const errors = [];
        if (this.isExternal) {
            this.updateUserFormState('errors', errors);
            return;
        }
        // eslint-disable-next-line no-unused-vars
        const { errors: ignore, passwordErrors, password, rePassword, ...fields } = this.state.userFormState;

        Object.keys(fields).forEach(key => {
            const field = fields[key];
            // String or Array (roles)
            if (!field || field.length === 0) {
                errors.push(key);
            }
        });

        if (errors.length > 0) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'users.errors.form'));
        }
        this.updateUserFormState('errors', errors);
        this.validatePassword(true);
    }

    validatePassword (notifyUser) {
        const { id, password, rePassword } = this.state.userFormState;
        const passwordRequired = !id || password.length > 0;
        const errors = {};
        if (!passwordRequired) {
            this.updateUserFormState('passwordErrors', errors);
            return;
        }

        const notify = (key, values) => notifyUser && Messaging.error(Oskari.getMsg('AdminUsers', `users.passwordRequirements.${key}`, values));
        const add = (key, value) => {
            if (!errors[key]) {
                errors[key] = [];
            }
            errors[key].push(value);
        };

        const { length, case: caps } = this.passwordRequirements;
        if (password.length < length) {
            add('password', 'length');
            notify('length', { length });
        }
        if (caps && password === password.toLowerCase()) {
            add('password', 'case');
            notify('case');
        }
        // only to mark error on submit
        if (rePassword.length < length) {
            add('rePassword', 'length');
        }
        if (password !== rePassword) {
            add('rePassword', 'mismatch');
            notify('mismatch');
        }
        this.updateUserFormState('passwordErrors', errors);
    }

    async saveUser () {
        this.validateUserForm();
        const { errors, passwordErrors = {}, roles, ...userParams } = this.state.userFormState;
        if (errors.length > 0 || Object.keys(passwordErrors).length > 0) {
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
                let error = `${Oskari.getMsg('AdminUsers', 'users.passwordRequirements.title')}`;
                Object.keys(this.passwordRequirements).forEach((key, index) => {
                    if (key === 'length') {
                        error += `${Oskari.getMsg('AdminUsers', 'users.passwordRequirements.length', { length: this.passwordRequirements[key] })}`;
                    } else {
                        error += `${Oskari.getMsg('AdminUsers', `users.passwordRequirements.${key}`)}`;
                    }
                    if ((index + 1) < Object.keys(this.passwordRequirements).length) {
                        error += ', ';
                    }
                });
                Messaging.error(error);
                this.updateUserFormState('errors', ['password']);
            } else {
                Messaging.error(Oskari.getMsg('AdminUsers', 'users.errors.save'));
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
            Messaging.error(Oskari.getMsg('AdminUsers', 'users.errors.delete'));
        }
    }

    async addRole (name) {
        if (!name) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'roles.errors.form'));
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
            Messaging.error(Oskari.getMsg('AdminUsers', 'roles.errors.save'));
        }
    }

    async updateRole () {
        const { id, name } = this.state.editingRole || {};
        if (!id || !name) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'roles.errors.form'));
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
            Messaging.error(Oskari.getMsg('AdminUsers', 'roles.errors.save'));
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
            Messaging.error(Oskari.getMsg('AdminUsers', 'roles.errors.delete'));
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
    'editUserById',
    'editUserFromRoles',
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
    'updateEditingRole',
    'showUsersByRole'
]);

export { wrapped as AdminUsersHandler };
