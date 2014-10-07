/**
 * @class Oskari.mapframework.bundle.admin-users.AdminUsers
 *
 * Renders the "admin users" flyout.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.admin-users.AdminUsers', function(localization, parent) {
    this.instance = parent;
    this.sandbox = parent.getSandbox();
    this._localization = localization;
    this.templates = {};

    this.setTitle(localization.title);
    this.setContent(this.createUi());
    this.state = {};
}, {

        _initTemplates: function () {
            var me = this,
                btn,
                i;
            me.templates.main = jQuery('<div class="admin-users"></div>');
            me.templates.search = jQuery(
                '<div><input type="search"></input><div class="icon-close"></div></div>'
            );
            me.templates.search.find('input').keypress(
                function (event) {
                    if (event.keyCode == 10 || event.keyCode == 13) {
                        me._filterList(event, me);
                    }
                }
            );
            me.templates.search.find('div.icon-close').click(
                function (event) {
                    jQuery(event.target).parent().find("input[type=search]").val("");
                    me._filterList(event, me);
                }
            );
            btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SearchButton');
            btn.setHandler(
                function (event) {
                    me._filterList(event, me);
                }
            );
            btn.insertTo(me.templates.search);

            me.templates.form = jQuery(
                '<form method="" action="">' +
                    // This is only used when editing an existing user, but it can be left empty for new users
                    '<fieldset>' +
                    '    <input type="hidden" name="id" />' +
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="text" name="firstName" required="required" />' +
                    '    </label>' +
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="text" name="lastName" required="required" />' +
                    '    </label>' +
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="text" name="user" required="required" />' +
                    '    </label>' +
                    // Make these two required if we're creating a new user
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="password" name="pass" autocomplete="off" />' +
                    '    </label>' +
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="password" name="pass_retype" autocomplete="off" />' +
                    '    </label>' +
                    '    <label>' +
                    '        <div class="roleSelect"></div>' +
                    '    </label>' +
                    '</fieldset>' +
                    '<fieldset></fieldset>' +
                    '</form>'
            );
            //me.templates.form.attr('action', me.sandbox.getAjaxUrl() + me.instance.conf.restUrl);
            me.templates.form.find('input').each(function (index) {
                var el = jQuery(this);
                el.prev('span').html(me._getLocalization(el.attr('name')));
            });

            var buttonFieldset = me.templates.form.find('fieldset:nth-of-type(2)');
            btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
            btn.insertTo(buttonFieldset);
            btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.DeleteButton');
            btn.setHandler(
                function (event) {
                    me._deleteUser(event, me);
                }
            );
            btn.insertTo(buttonFieldset);
            btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
            btn.setHandler(
                function (event) {
                    me._closeForm(jQuery(event.target).parents('form'));
                }
            );
            btn.insertTo(buttonFieldset);

            me.template.roleOption = jQuery(
                '<option></option>'
            );

            me.templates.list = jQuery('<ul></ul>');

            me.templates.item = jQuery(
                '<li class="accordion">' +
                    '<div class="header accordion-header clearfix">' +
                    '   <h3></h3>' +
                    '</div>' +
                    '</li>'
            );
            btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.EditButton');
            btn.setHandler(
                function (event) {
                    me._openForm(event, me);
                }
            );
            btn.insertTo(me.templates.item.find('div.header'));
            me.templates.main.append(me.templates.search);
            me.createRolesSelect();

        },
        /**
         * Create roles drop down select
         *
         * @method createRolesSelect
         * @param container parent element
         * @param data contains all the roles
         */
        createRolesSelect: function () {
            var me = this;
            // Indicators' select container etc.
            me.templates.roleSelect = jQuery(
                '<div class="role-cont">' +
                '   <div class="role selector-cont">' +
                '       <span>' + me._getLocalization('selectRole') + '</span>' +
                '           <select name="roles" multiple class="roles"><option value=""></option></select>' +
                '</div></div>'
            );
            var sel = me.templates.roleSelect.find('select'),
                i,
                ilen,
                roleData,
                value,
                name,
                opt,
                roles = me.instance.storedRoles;
            for (i = 0, ilen = roles.length; i < ilen; i++) {
                roleData = roles[i];

                if (roleData.hasOwnProperty('id')) {
                    value = roleData.id;
                    name = roleData.name;
                    opt = jQuery('<option value="' + value + '">' + name + '</option>');
                    sel.append(opt);
                };
            }

            var selectorsContainer = me.templates.form.find('div.roleSelect');
            selectorsContainer.append(me.templates.roleSelect);
        },
        /**
        * @method fetchUsers
        */
       fetchUsers: function (container) {
            // Remove old list from container
            container.find('ul').remove();
            // get users with ajax
            var me = this;
            jQuery.ajax({
                type: 'GET',
                url: me.sandbox.getAjaxUrl() + me.instance.conf.restUrl,
                success: function (data) {
                    me._createList(me, data.users, me.state.filter);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);

                    me._openPopup(
                        me._getLocalization('fetch_failed'),
                        error
                    );
                }
            });
        },

        /**
         * @method _createList
         */
        _createList: function (me, users, filter) {
            var me = this,
                list = me.templates.list.clone(),
                i,
                user,
                hasFilter = filter !== null && filter !== undefined && filter.length > 0,
                matches;
            me.users = users;
            for (i = 0; i < users.length; i++) {
                user = users[i];
                matches = !hasFilter || user.firstName.contains(filter) || user.lastName.contains(filter) || user.user.contains(filter);
                if (matches) {
                    list.append(me._populateItem(me.templates.item.clone(true), user));
                }
            }
            // Add list to container
            me.container.append(list);
        },

        /**
         * @method _filterList
         */
        _filterList: function (event, me) {
            var filter = jQuery(event.target).parent().find('input[type=search]').val();
            me.state.filter = filter;
            me.fetchUsers(me.container);
        },

        /**
         * @method _getLocalization
         */
        _getLocalization: function (key) {
            return this._localization[key];     
        },

        _getErrorText: function (jqXHR, textStatus, errorThrown) {
            var error = errorThrown.message || errorThrown;
            try {
                var err = JSON.parse(jqXHR.responseText).error;
                if (err !== null && err !== undefined) {
                    error = err;
                }
            } catch (e) {

            }
            return error;
        },

        /**
         * @method _deleteUser
         * Gets user id based on event target and deletes it
         */
        _deleteUser: function (event, me) {
            var item = jQuery(event.target).parents('li'),
                uid = parseInt(item.attr('data-id')),
                user = me._getUser(uid);

            if (!window.confirm(me._getLocalization("confirm_delete").replace("{user}", user.user))) {
                return;
            }
            // It's more than likely that the delete will succeed...
            item.hide();
            jQuery.ajax({
                type: 'DELETE',
                url: me.sandbox.getAjaxUrl() + me.instance.conf.restUrl + "&id=" + uid,
                error: function (jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);
                    me._openPopup(
                        me._getLocalization('delete_failed'),
                        error
                    );
                    item.show();
                },
                success: function (data) {
                    item.remove();
                    me.fetchUsers(me.container);
                }
            });
        },

        /**
         * @method _populateItem
         * Populates an item fragment
         */
        _populateItem: function (item, user) {
            item.attr('data-id', user.id);
            item.find('h3').html(
                user.user +
                    " (" + user.firstName + " " + user.lastName + ")"
            );
            return item;
        },

        /**
         * @method _getUser
         * Gets user by id
         */
        _getUser: function (uid) {
            var i;
            for (i = 0; i < this.users.length; i++) {
                if (this.users[i].id === uid) {
                    return this.users[i];
                }
            }
            return null;
        },

        /**
         * @method _openForm
         * Opens edit/create form depending on event target location
         */
        _openForm: function (event, instance) {
            // Semi deep clone
            var me = instance,
                form = me.templates.form.clone(true),
                target = jQuery(event.target),
                item = target.parents('li'),
                uid = item.attr('data-id');
            if (uid && uid.length) {
                target.hide();
                me._populateForm(form, me._getUser(parseInt(uid, 10)));
                item.append(form);
            } else {
                target.hide();
                me._populateForm(form, null);
                me.container.prepend(form);
            }
        },

        /**
         * @method _closeForm
         * Closes given form and shows the button that opens it
         */
        _closeForm: function (form) {
            if (form.parent().is('li')) {
                // show edit button
                form.parent().find('.header input').show();
            } else {
                form.parent().find('> input').show();
            }
            // destroy form
            form.remove();
        },

        /**
         * @method _formIsValid
         * Validates given form. Checks that required fields have values and
         * that password field values match.
         */
        _formIsValid: function (form, me) {
            var errors = [],
                pass;
            // check that required fields have values
            form.find('input[required]').each(function (index) {
                if (!this.value.length) {
                    errors.push(me._getLocalization("field_required").replace('{fieldName}', this.name));
                }
            });
            // check that password and password_retype have matching values
            pass = form.find('input[name=pass]').val();
            if ( pass !== form.find('input[name=pass_retype]').val()) {
                errors.push(me._getLocalization("password_mismatch"));
            }
            if (pass.length > 0 && pass.length < 8) {
                errors.push(me._getLocalization("password_too_short"));
            }
            if (errors.length) {
                me._openPopup(
                    me._getLocalization("form_invalid"),
                    jQuery(
                        '<ul>' +
                            errors.map(function (value) {
                                return '<li>' + value + '</li>';
                            }).join('') +
                            '</ul>'
                    )
                );
            }
            return !errors.length;
        },

        /**
         * @method _submitForm
         * Submits event.target's form, updates list if submission is a success.
         */
        _submitForm: function (event, me) {
            event.preventDefault(); // We don't want the form to submit
            var frm = jQuery(event.target);
            if (me._formIsValid(frm, me)) {
                /**
                if (data.roles )
                    */
                jQuery.ajax({
                    type: frm.attr('method'),
                    url: me.sandbox.getAjaxUrl() + me.instance.conf.restUrl,
                    data: frm.serialize(),
                    success: function (data) {
                        me._closeForm(frm);
                        // FIXME fetch users
                        me.fetchUsers(me.container);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var error = me._getErrorText(jqXHR, textStatus, errorThrown);
                        me._openPopup(me._getLocalization('save_failed'), error);
                    }
                });
            }
            return false;
        },

        /**
         * @method _populateForm
         * Populates given form with given user's data.
         */
        _populateForm: function (fragment, user) {
            var me = this;
            fragment.find('fieldset:first-child input').each(function (index) {
                var el = jQuery(this),
                    elName = el.attr('name');
                if (user) {
                    el.val(user[elName]);
                } else {
                    // password is required when creating a new user
                    if (elName === 'pass' || elName === 'pass_retype') {
                        el.attr('required', 'required');
                    }
                }
            });
            if (user) {
                var select = fragment.find('select');
                for (i=0; i < user.roles.length; i++) {
                    var opt = select.find('option[value=' + user.roles[i] + ']');
                    opt.attr('selected', 'selected');
                }
                fragment.attr('method', 'POST');
            }
            else {
                fragment.attr('method', 'PUT');
            }
            
            fragment.submit(function (event) {
                return me._submitForm(event, me);
            });
            return fragment;
        },

        /**
         * @method _openPopup
         * opens a modal popup, no buttons or anything.
         */
        _openPopup: function (title, content) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
            okBtn.setPrimary(true);
            okBtn.setHandler(function () {
                dialog.close(true);
            });
            dialog.show(title, content, [okBtn]);
            dialog.makeModal();
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
                btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.AddButton');
            me._initTemplates();
            me.container = me.templates.main.clone();
            me.fetchUsers(me.container);

            btn.setHandler(function (event) {
                me._openForm(event, me);
            });
            btn.insertTo(me.container);
            return me.container;
        },
        handleRoleChange: function (role, operation) {
            var me = this,
                select = jQuery(me.container).find('select.roles'),
                option = select.find('option[value=' + role.id +']'),
                selecttemplate = jQuery(me.templates.form).find('select.roles'),
                optiontemplate = selecttemplate.find('option[value=' + role.id +']');
                
            if (operation == 'remove') {
                option.remove();
                optiontemplate.remove();
            } 
            if (operation == 'update') { 
                option.html(role.name); 
                optiontemplate.html(role.name);
            }
            if (operation == 'add') {
                select.append("<option value=" + role.id +">" + role.name + "</option>");
                selecttemplate.append("<option value=" + role.id +">" + role.name + "</option>");
            }
        },
        eventHandlers : {
            'RoleChangedEvent' : function(event) {
                this.handleRoleChange(event.getRole(), event.getOperation());
            }
        }

    }, {
        "extend": ["Oskari.userinterface.component.TabPanel"]
    });
