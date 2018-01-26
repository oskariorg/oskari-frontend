Oskari.clazz.define('Oskari.admin.hierarchical-layerlist.Group', function(sandbox, locale) {
    this.sandbox = sandbox;
    this.locale = locale;
    this.service = this.sandbox.getService('Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService');
}, {
    /**
     * Gets popup configuration obhject
     * @method getGroupAddingPopupConf
     * @param  {Object}                tool     jQuery object
     * @param  {String}                id       group id, if defined then also show delete button
     * @param  {Integer}               parentId parent group id
     * @param  {Object}                opts     options
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
            btnDelete.setTitle(me.locale.buttons.delete);
            btnDelete.addClass('delete');
            btnDelete.setHandler(function() {
                // TODO do remove
                tool.removeClass('active');
            });
            returnObject.buttons.push(btnDelete);
        }

        var btnCancel = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btnCancel.setTitle(me.locale.buttons.cancel);
        btnCancel.addClass('cancel');
        btnCancel.setHandler(function() {
            popup.close();
            tool.removeClass('active');
        });
        returnObject.buttons.push(btnCancel);
        var btnOk = Oskari.clazz.create('Oskari.userinterface.component.Button');
        returnObject.buttons.push(btnOk);
        popup.addClass('admin-hierarchical-layerlist-group');

        var loc = (Oskari.getLocalization('DivManazer').LanguageSelect && Oskari.getLocalization('DivManazer').LanguageSelect.languages) ? Oskari.getLocalization('DivManazer').LanguageSelect.languages : {};

        var selectableGroup = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
        selectableGroup.addClass('selectable-group');
        selectableGroup.setTitle(me.locale.selectableGroup);
        selectableGroup.setChecked(!!opts.selectable);

        btnOk.addClass('add');
        var btnOkLocale = (parentId) ? me.locale.buttons.update : me.locale.buttons.add;
        btnOk.setTitle(btnOkLocale);
        btnOk.setHandler(function() {
            // TODO do saving
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
            tool.removeClass('active');

            if (Object.keys(data.locales).length === Oskari.getSupportedLanguages().length && hasValidLocales) {
                me._saveGroup(data, popup, opts.type);
            } else {
                errorDialog.show(me.locale.errors.groupname.title, me.locale.errors.groupname.message);
                errorDialog.fadeout();
            }

        });

        var message = jQuery('<div class="group-names"></div>');
        returnObject.message = message;

        // locale inputs
        var supportedLocales = Oskari.getSupportedLanguages();
        supportedLocales.forEach(function(locale) {
            var input = Oskari.clazz.create('Oskari.userinterface.component.TextInput');
            input.setTitle(me.locale.groupTitles.localePrefix + ' ' + (loc[locale] || locale));
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
     * @private
     */
    _saveGroup: function(data, popup, type) {
        var me = this;
        var method = 'PUT';
        if (data.id) {
            method = 'POST';
        }
        jQuery.ajax({
            type: method,
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            url: me.sandbox.getAjaxUrl('MapLayerGroups'),
            data: JSON.stringify(data),
            error: function() {
                var errorDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                errorDialog.show(me.locale.errors.groupnameSave.title, me.locale.errors.groupnameSave.message);
                errorDialog.fadeout();
            },
            success: function(response) {
                popup.close();
                var successDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                successDialog.show(me.locale.succeeses.groupnameSave.title, me.locale.succeeses.groupnameSave.message);
                successDialog.fadeout();

                response.type = type;
                response.method = 'add';
                if (data.id) {
                    response.method = 'update';
                }

                me.service.trigger('group-added', response);
            }
        });
    },
});