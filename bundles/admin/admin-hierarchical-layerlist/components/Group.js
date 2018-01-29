Oskari.clazz.define('Oskari.admin.hierarchical-layerlist.Group', function(sandbox, locale) {
    this.sandbox = sandbox;
    this.locale = locale;
    this.service = this.sandbox.getService('Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService');
    this.layerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
}, {
    /**
     * Gets popup configuration obhject
     * @method getGroupAddingPopupConf
     * @param  {Object}                tool     jQuery object
     * @param  {String}                id       group id, if defined then also show delete button
     * @param  {Integer}               parentId parent group id
     * @param  {Object}                opts     options:
     *                                          {
     *                                              selectable: true,
     *                                              locale: {
     *                                                  fi: '',
     *                                                  en: '',
     *                                                  sv: ''
     *                                              }
     *                                          }
     * @return {Object}                         popup configuration:
     *                                          {
     *                                              popup: null,
     *                                              buttons: null,
     *                                              messages: null
     *                                          }
     */
    getGroupAddingPopupConf: function(tool, id, parentId, opts) {
        var me = this;
        var returnObject = {
            popup: null,
            buttons: [],
            message: null
        };
        var popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        errorDialog.setId('admin-hierarchical-layerlist-group-error-popup');
        returnObject.popup = popup;

        // check at if editing group (id defined)
        // then also add delete button
        if (id) {
            var btnDelete = Oskari.clazz.create('Oskari.userinterface.component.Button');
            btnDelete.setTitle(me.locale('buttons.delete'));
            btnDelete.addClass('delete');
            btnDelete.setHandler(function() {
                // check at group has no layers or subgroups
                var group = me.layerService.getAllLayerGroups(id);
                var isLayersOrGroups = (group && (group.layers.length > 0 || group.groups.length > 0)) ? true : false;
                if (isLayersOrGroups) {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    dialog.show(me.locale('errors.groupnameDeleteCheckLayers.title'), me.locale('errors.groupnameDeleteCheckLayers.message'));
                    dialog.fadeout(5000);
                } else {
                    var data = {
                        id: id
                    };

                    // ned be confirm deleteing ?
                    //
                    // Confirm dialog
                    var confirmDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    var confirmBtnOk = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    var confirmBtnCancel = Oskari.clazz.create('Oskari.userinterface.component.Button');

                    confirmBtnOk.addClass('primary');
                    confirmBtnOk.setTitle(me.locale('buttons.ok'));
                    confirmBtnOk.setHandler(function() {
                        confirmDialog.close();
                        me._deleteGroup(data, popup, opts.type, tool);
                    });

                    confirmBtnCancel.setTitle(me.locale('buttons.cancel'));
                    confirmBtnCancel.setHandler(function() {
                        confirmDialog.close();
                    });

                    var groupName = me.sandbox.getLocalizedProperty(group.name);

                    confirmDialog.show(me.locale('confirms.groupDelete.title'), me.locale('confirms.groupDelete.message', {
                        groupname: groupName
                    }), [confirmBtnCancel, confirmBtnOk]);
                    confirmDialog.makeModal();


                }
            });
            returnObject.buttons.push(btnDelete);
        }

        var btnCancel = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btnCancel.setTitle(me.locale('buttons.cancel'));
        btnCancel.addClass('cancel');
        btnCancel.setHandler(function() {
            popup.close();
            tool.removeClass('active');
        });
        returnObject.buttons.push(btnCancel);
        var btnOk = Oskari.clazz.create('Oskari.userinterface.component.Button');
        returnObject.buttons.push(btnOk);
        popup.addClass('admin-hierarchical-layerlist-group');

        var loc = (Oskari.getMsg('DivManazer', 'LanguageSelect').languages) ? Oskari.getMsg('DivManazer', 'LanguageSelect').languages : {};

        var selectableGroup = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
        selectableGroup.addClass('selectable-group');
        selectableGroup.setTitle(me.locale('selectableGroup'));
        selectableGroup.setChecked(!!opts.selectable);

        btnOk.addClass('add');
        var btnOkLocale = (id) ? me.locale('buttons.update') : me.locale('buttons.add');
        btnOk.setTitle(btnOkLocale);
        btnOk.setHandler(function() {
            var data = {
                locales: {},
                selectable: selectableGroup.isChecked(),
                parentId: parentId,
                id: id
            };
            var hasValidLocales = true;
            popup.getJqueryContent().find('.oskari-textinput.group-name').each(function() {
                var el = jQuery(this);

                var value = el.find('input').val().trim();
                data.locales[el.attr('data-locale')] = value;
                if (value.length < 4) {
                    hasValidLocales = false;
                    el.find('input').addClass('error');
                } else {
                    el.find('input').removeClass('error');
                }
            });

            if (Object.keys(data.locales).length === Oskari.getSupportedLanguages().length && hasValidLocales) {
                me._saveGroup(data, popup, opts.type, tool);
            } else {
                errorDialog.show(me.locale('errors.groupname.title'), me.locale('errors.groupname.message'));
                errorDialog.fadeout();
            }

        });

        var message = jQuery('<div class="group-names"></div>');
        returnObject.message = message;

        // locale inputs
        var supportedLocales = Oskari.getSupportedLanguages();
        supportedLocales.forEach(function(locale) {
            var input = Oskari.clazz.create('Oskari.userinterface.component.TextInput');
            input.setTitle(me.locale('groupTitles.localePrefix') + ' ' + (loc[locale] || locale));
            var value = (opts.locale && opts.locale[locale]) ? opts.locale[locale] : null;
            if (value) {
                input.setValue(value);
            }
            input.addClass('group-name');
            var el = jQuery(input.getElement());
            el.find('input').bind('keyup', function() {
                var inputEl = jQuery(this);
                var value = inputEl.val().trim();
                if (value.length < 4) {
                    inputEl.addClass('error');
                } else {
                    inputEl.removeClass('error');
                }
            });
            el.attr('data-locale', locale);
            message.append(el);
        });

        // checkbox
        message.append(jQuery(selectableGroup.getElement()));

        return returnObject;
    },
    /**
     * Save group
     * @method  _saveGroup
     * @param   {Object}   data  data fo saving
     * @param   {Oskari.userinterface.component.Popup}   popup group adding/editing popup
     * @param   {String}   type  jstree type
     * @param {Object} tool tool
     * @private
     */
    _saveGroup: function(data, popup, type, tool) {
        var me = this;
        var method = 'PUT';
        var params = '';
        if (data.id) {
            method = 'POST';
            params = '&id=' + data.id;
        }
        jQuery.ajax({
            type: method,
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            url: me.sandbox.getAjaxUrl('MapLayerGroups') + params,
            data: JSON.stringify(data),
            error: function() {
                var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                errorDialog.show(me.locale('errors.groupnameSave.title'), me.locale('errors.groupnameSave.message'));
                errorDialog.fadeout();
            },
            success: function(response) {
                popup.close();
                var successDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                successDialog.show(me.locale('succeeses.groupnameSave.title'), me.locale('succeeses.groupnameSave.message'));
                successDialog.fadeout();

                response.type = type;
                response.method = 'add';
                if (data.id) {
                    response.method = 'update';
                }
                tool.removeClass('active');
                me.service.trigger('group-added', response);
            }
        });
    },
    /**
     * Delete group
     * @method  _deleteGroup
     * @param   {Object}   data  data for deleting
     * @param   {Oskari.userinterface.component.Popup}   popup group adding/editing popup
     * @param   {String}   type  jstree type
     * @param {Object} tool tool
     * @private
     */
    _deleteGroup: function(data, popup, type, tool) {
        var me = this;
        var method = 'DELETE';
        var params = '&id=' + data.id;
        jQuery.ajax({
            type: method,
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            url: me.sandbox.getAjaxUrl('MapLayerGroups') + params,
            data: JSON.stringify(data),
            error: function() {
                var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                errorDialog.show(me.locale('errors.groupnameDelete.title'), me.locale('errors.groupnameDelete.message'));
                errorDialog.fadeout();
            },
            success: function(response) {
                popup.close();
                var successDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                successDialog.show(me.locale('succeeses.groupnameDelete.title'), me.locale('succeeses.groupnameDelete.message'));
                successDialog.fadeout();

                response.type = type;
                tool.removeClass('active');
                me.service.trigger('group-deleted', response);
            }
        });
    },
});