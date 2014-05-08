/**
 * @class Oskari.mapframework.bundle.admin-users.Flyout
 *
 * Renders the "admin users" flyout.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.admin-users.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param
     * {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance}
     * instance
     *      reference to component that created the tile
     */

    function (instance) {
        this.instance = instance;
        // FIXME we need a real config
        this.config = instance.conf;
        this.config = {
            restUrl: 'restUrl'
        };
        this.container = null;
        this.state = {};
        this.templates = {};
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.admin-users.Flyout';
        },
        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = jQuery(el[0]);
            if (!this.container.hasClass('admin-users')) {
                this.container.addClass('admin-users');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this._initTemplates();
        },

        _initTemplates: function () {
            var me = this,
                btn;
            // FIXME make this a form as well
            me.templates.search = jQuery(
                '<div><input type="search"></input></div>'
            );
            me.templates.search.find('input').keypress(
                function (event) {
                    if (event.keyCode == 10 || event.keyCode == 13) {
                        me._filterList(event, me);
                    }
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
                    '        <input type="text" name="firstname" required="required" />' +
                    '    </label>' +
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="text" name="lastname" required="required" />' +
                    '    </label>' +
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="text" name="username" required="required" />' +
                    '    </label>' +
                    // Make these two required if we're creating a new user
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="password" name="password" autocomplete="off" />' +
                    '    </label>' +
                    '    <label>' +
                    '        <span></span>' +
                    '        <input type="password" name="password_retype" autocomplete="off" />' +
                    '    </label>' +
                    '</fieldset>' +
                    '<fieldset></fieldset>' +
                    '</form>'
            );
            me.templates.form.attr('action', me.config.restUrl);
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

            me.templates.list = jQuery('<ul></ul>');

            me.templates.item = jQuery(
                '<li class="accordion">' +
                    '<div class="header accordion-header">' +
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
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this._getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this._getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {Object} state
         *     state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;

        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
                btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.AddButton');

            me.container.append(me.templates.search.clone(true));

            btn.setHandler(function (event) {
                me._openForm(event, me);
            });
            btn.insertTo(me.container);
        },

        /**
         * @method _getLocalization
         */
        _getLocalization: function (key) {
            return this.instance.getLocalization(key);
        },

        /**
         * @method _createList
         */
        _createList: function (users, filter) {
            var me = this,
                list = me.templates.list.clone(),
                i,
                user,
                hasFilter = filter !== null && filter !== undefined && filter.length > 0,
                matches;
            me.users = users;
            for (i = 0; i < users.length; i++) {
                user = users[i];
                matches = !hasFilter || user.firstname.contains(filter) || user.lastname.contains(filter) || user.username.contains(filter);
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
            me.fetchUsers(me);
        },

        /**
         * @method fetchUsers
         */
        fetchUsers: function (me) {
            // Remove old list from container
            me.container.find('ul').remove();
            // get users with ajax
            jQuery.ajax({
                type: 'GET',
                url: me.config.restUrl,
                success: me._createList,
                error: function (jqXHR, textStatus, errorThrown) {
                    me._openPopup(
                        me._getLocalization('fetch_failed'),
                        errorThrown.message
                    );
                }
            });
            /*var userList = [];
            for (var i = 1; i <= 1000; i++) {
                userList.push({
                    id: i,
                    firstname: 'first' + i,
                    lastname: 'last' + i,
                    username: 'user' + i
                });
            }
            me._createList(userList, me.state.filter);*/
        },

        /**
         * @method _deleteUser
         * Gets user id based on event target and deletes it
         */
        _deleteUser: function (event, me) {
            var item = jQuery(event.target).parents('li');
            // It's more than likely that the delete will succeed...
            item.hide();
            jQuery.ajax({
                type: 'DELETE',
                url: me.config.restUrl,
                data: {
                    id: item.attr('data-id')
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    me._openPopup(
                        me._getLocalization('delete_failed'),
                        errorThrown.message
                    );
                    item.show();
                },
                success: function (data) {
                    item.remove();
                    me.fetchUsers(me);
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
                user.username +
                    " (" + user.firstname + " " + user.lastname + ")"
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
            var errors = [];
            // check that required fields have values
            form.find('input[required]').each(function (index) {
                if (!this.value.length) {
                    errors.push(me._getLocalization("field_required").replace('{fieldName}', this.name));
                }
            });
            // check that password and password_retype have matching values
            if (form.find('input[name=password]').val() !== form.find('input[name=password_retype]').val()) {
                errors.push(me._getLocalization("password_mismatch"));
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
                jQuery.ajax({
                    type: frm.attr('method'),
                    url: frm.attr('action'),
                    data: frm.serialize(),
                    success: function (data) {
                        me._closeForm(frm);
                        me.fetchUsers(me.state.filter);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        me._openPopup(me._getLocalization('save_failed'), errorThrown.message);
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
                    if (elName === 'password' || elName === 'password_retype') {
                        el.attr('required', 'required');
                    }
                }
            });
            fragment.attr('method', user ? 'POST' : 'PUT');
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
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
