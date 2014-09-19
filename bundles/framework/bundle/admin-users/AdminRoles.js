/**
 * @class Oskari.mapframework.bundle.admin-users.AdminRoles
 *
 * Renders the "admin users" flyouts tab Admin roles.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.admin-users.AdminRoles', function (localization, parent) {
    this.instance = parent;
    this._localization = localization;
    this.sandbox = parent.getSandbox();
    this.ajaxUrl = this.sandbox.getAjaxUrl();
    this.setTitle(localization.title);
    this.setContent(this.createUi());
}, {
    /**
     * @method _initTemplates
     *
     * Interface method implementation, assigns the HTML templates
     * that will be used to create the UI
     */
    _initTemplates: function () {
        var me = this,
            form;
        me.templates = {};
        me.templates.main = jQuery(
            '<div class="admin-users">\n' +
                '   <div class="admin-role-list">' +
                '   </div>' +
                '   <div class="add-role">' +
                '   </div>' +
                '   <div class="controls"></div>' +
                '</div>\n'
        );
        me.templates.item = jQuery(
            '<li class="accordion">' +
                '<div class="header accordion-header clearfix">' +
                '   <h3></h3>' +
                '</div>' +
                '</li>'
        );
        form = me.templates.main.find('div.add-role');
        //create new role
        me.templates.form = jQuery(
            '<form method="" action="">' +
                '   <span>' + me._getLocalization('newrole') + '</span>' +
                '       <input type="text" name="newrole"></input>' +
                '</form>'
        );

        me.templates.form.find('input').each(function (index) {
            var el = jQuery(this);
            el.prev('span').html(me._getLocalization(el.attr('name')));
        });
        form.append(me.templates.form);
    },

    /**
     * @method createList
     * creates the role list
     */

    createList: function (roles) {
        var me = this,
            list = jQuery('<ul></ul>'),
            i,
            role;
        for (i = 0; i < roles.length; i += 1) {
            role = roles[i];
            list.append(me._populateItem(role));
        }
        return list;
    },

    /**
     * @method _populateItem
     * Populates an item fragment
     */
    _populateItem: function (role) {
        var me = this,
            item = this.templates.item.clone(),
            btn;
        item.attr('data-id', role.id);
        btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.DeleteButton');
        btn.setHandler(
            function (event) {
                me._deleteRole(role);
            }
        );
        item.find('h3').html(role.name);
        btn.insertTo(item.find('div.header'));
        return item;
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
     * @method doSave
     * Method is called by createUi to save the new role when button is clicked
     */
    doSave: function (roleName) {
        var me = this,
            saveData = {
                'name': roleName
            };
        jQuery.ajax({
            type: 'PUT',
            url: me.ajaxUrl + 'action_route=ManageRoles',
            lang: Oskari.getLang(),
            timestamp: new Date().getTime(),

            data: saveData,
            success: function (role) {
                me.addRoleToList(role);
                var evt = me.sandbox.getEventBuilder('RoleChangedEvent')(role, 'add');
                me.sandbox.notifyAll(evt);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var error = me._getErrorText(jqXHR, textStatus, errorThrown);
                me._openPopup(
                    me._getLocalization('doSave_failed'),
                    error
                );
            }
        });
    },
    /**
     * @method addRoleToList
     * Method is called by doSave to add the role to list when save is done successfully
     */
    addRoleToList: function (role) {
        var me = this;
        jQuery(me.container).find('.admin-role-list ul').append(this._populateItem(role));
    },

    /**
     * @method renderRoles
     * Renders the role list
     */
    renderRoles: function () {
        var me = this,
            list = me.createList(me.instance.storedRoles);
        jQuery(me.container).find('.admin-role-list').empty().append(list);
    },
    /**
     * @method _deleteRole
     * Gets role based on event target and deletes it
     */
    _deleteRole: function (role) {
        var me = this,
            item = jQuery(me.container).find('.admin-role-list ul').find('li[data-id=' + role.id + ']');
        if (!window.confirm(me._getLocalization('confirm_delete').replace('{role}', role.name))) {
            return;
        }
        // It's more than likely that the delete will succeed...
        item.hide();
        jQuery.ajax({
            type: 'DELETE',
            url: me.ajaxUrl + 'action_route=ManageRoles' + '&id=' + role.id,
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
                var evt = me.sandbox.getEventBuilder('RoleChangedEvent')(role, 'remove');
                me.sandbox.notifyAll(evt);
            }
        });

    },
    /**
     * @method createUi
     * Creates the UI for a fresh start
     */
    createUi: function () {
        var me = this,
            button,
            controls;
        me._initTemplates();
        me.container = this.templates.main.clone();
        me.renderRoles();
        button = Oskari.clazz.create('Oskari.userinterface.component.Button');
        controls = me.container.find('div.controls');
        button.setTitle(me.instance.getLocalization('save'));
        button.setPrimary(true);

        button.setHandler(
            function () {
                var roleName = me.container.find('input[name=newrole]').val();
                me.doSave(roleName);
            }
        );
        // Not sure if we want save on enter
        //field.bindEnterKey(doSave);

        controls.append(button.getElement());
        return me.container;
    },

    /**
     * @method createLayerRightGrid
     * Creates the permissions table as a String
     * @param {Array} columnHeaders
     * @param {Object} layerRightsJSON
     * @return {String} Permissions table
     */
    createLayerRightGrid: function (columnHeaders, layerRightsJSON) {
        'use strict';
        var table = '<table class="layer-rights-table">',
            i = 0,
            tr = 0,
            layerRight = null,
            header = null,
            value = null,
            service,
            layer,
            tooltip;

        table += '<thead><tr>';
        for (i = 0; i < columnHeaders.length; i += 1) {
            table += '<th>' + columnHeaders[i].name + '</th>';
        }
        table += '</tr></thead>';
        service = this.instance.getSandbox().getService('Oskari.mapframework.service.MapLayerService');

        table += '<tbody>';
        for (i = 0; tr < layerRightsJSON.length; tr += 1) {
            layerRight = layerRightsJSON[tr];
            layer = service.findMapLayer(layerRight.id);

            table += '<tr>';

            // lets loop through header
            for (i = 0; i < columnHeaders.length; i += 1) {
                header = columnHeaders[i];
                //select input value based on arrangement of header columns
                value = layerRight[header.id];
                tooltip = header.name;

                if (header.id === 'name') {
                    if (layer) {
                        tooltip = layer.getLayerType() + '/' + layer.getInspireName() + '/' + layer.getOrganizationName();
                        //value = '<div class="layer-icon ' + layer.getIconClassname() + '"></div> ' + value;
                    }
                    table += '<td><span class="layer-name" data-resource="' + layerRight.resourceName +
                        '" data-namespace="' + layerRight.namespace +
                        '" title="' + tooltip +
                        '">' + value + '</span></td>';
                } else if (value) {
                    table += '<td><input type="checkbox" checked="checked" data-right="' + header.id + '" title="' + tooltip + '" /></td>';
                } else {
                    table += '<td><input type="checkbox" data-right="' + header.id + '" title="' + tooltip + '" /></td>';
                }
            }

            table += '</tr>';
        }
        table += '</tbody>';
        return table;
    },

    /**
     * @method _getLocalization
     */
    _getLocalization: function (key) {
        return this._localization[key];
    },

    _getErrorText: function (jqXHR, textStatus, errorThrown) {
        var error = errorThrown.message || errorThrown,
            err;
        try {
            err = JSON.parse(jqXHR.responseText).error;
            if (err !== null && err !== undefined) {
                error = err;
            }
        } catch (ignore) {

        }
        return error;
    }

}, {
    extend: ['Oskari.userinterface.component.TabPanel']
});
