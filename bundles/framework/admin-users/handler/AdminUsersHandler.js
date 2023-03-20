import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (instance, consumer) {
        super();
        this.instance = instance;
        this.setState({
            activeTab: 'admin-users-tab',
            addingUser: false,
            editingUserId: null,
            userFormState: this.initUserForm(),
            roleFormState: this.initRoleForm(),
            userFilter: '',
            users: [],
            roles: [],
            userFormErrors: [],
            roleFormErrors: false
        });
        this.addStateListener(consumer);
        this.fetchUsers();
        this.fetchRoles();
    };

    getName () {
        return 'AdminUsersHandler';
    }

    setActiveTab (tab) {
        this.updateState({
            activeTab: tab
        });
    }

    async fetchUsers () {
        try {
            const result = await jQuery.ajax({
                type: 'GET',
                url: Oskari.urls.getRoute() + this.instance.conf.restUrl
            });
            this.updateState({
                users: result.users
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
            const result = await jQuery.ajax({
                type: 'GET',
                url: Oskari.urls.getRoute('ManageRoles'),
                lang: Oskari.getLang(),
                timestamp: new Date().getTime()
            });
            this.updateState({
                roles: result.rolelist || []
            });
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
            userFormState: this.initUserForm()
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

    setUserFilter (value) {
        this.updateState({
            userFilter: value
        });
    }

    validateUserForm () {
        this.updateState({
            userFormErrors: []
        });
        const errors = [];
        if (this.instance.conf.isExternal) {
            if (!this.state.userFormState.roles || !this.state.userFormState.roles.length > 0) {
                errors.push('roles');
                Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.form_invalid'));
                return errors;
            }
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
            } else if (this.state.userFormState.password.length < 8) {
                errors.push('password');
                Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.password_too_short'));
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

            await jQuery.ajax({
                type: this.state.editingUserId ? 'POST' : 'PUT',
                url: Oskari.urls.getRoute() + this.instance.conf.restUrl,
                dataType: 'json',
                data: data.toString()
            });
            this.fetchUsers();
            this.closeUserForm();
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminusers.save_failed'));
        }
    }

    async deleteUser (uid) {
        try {
            await jQuery.ajax({
                type: 'DELETE',
                url: Oskari.urls.getRoute() + this.instance.conf.restUrl + '&id=' + uid
            });
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
            await jQuery.ajax({
                type: 'PUT',
                url: Oskari.urls.getRoute('ManageRoles'),
                lang: Oskari.getLang(),
                timestamp: new Date().getTime(),
                data: { name: this.state.roleFormState.name }
            });
            this.fetchRoles();
            this.updateState({
                roleFormState: this.initRoleForm()
            });
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminroles.doSave_failed'));
        }
    }

    async deleteRole (id) {
        try {
            await jQuery.ajax({
                type: 'DELETE',
                url: Oskari.urls.getRoute('ManageRoles') + '&id=' + id
            });
            this.fetchRoles();
        } catch (e) {
            Messaging.error(Oskari.getMsg('AdminUsers', 'flyout.adminroles.delete_failed'));
        }
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
    'setUserFilter'
]);

export { wrapped as AdminUsersHandler };
