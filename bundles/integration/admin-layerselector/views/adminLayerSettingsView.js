define([
        'text!_bundle/templates/adminTypeSelectTemplate.html',
        'text!_bundle/templates/adminLayerSettingsTemplate.html',
        'text!_bundle/templates/adminGroupSettingsTemplate.html',
        'text!_bundle/templates/group/subLayerTemplate.html',
        'text!_bundle/templates/capabilitiesTemplate.html',
        'text!_bundle/templates/layersWithErrorsPopupTemplate.html',
        '_bundle/collections/userRoleCollection',
        '_bundle/models/layerModel'
    ],
    function (
        TypeSelectTemplate,
        LayerSettingsTemplate,
        GroupSettingsTemplate,
        SubLayerTemplate,
        CapabilitiesTemplate,
        LayersWithErrorsPopupTemplate,
        userRoleCollection,
        layerModel
    ) {
        return Backbone.View.extend({
            tagName: 'div',
            className: 'admin-add-layer',

            /**
             * This object contains backbone event-handling.
             * It binds methods to certain events fired by different elements.
             *
             * @property events
             * @type {Object}
             */
            events: {
                'click .admin-add-layer-ok': 'addLayer',
                'click .admin-add-sublayer-ok': 'addLayer',
                'click .admin-add-layer-cancel': 'hideLayerSettings',
                'click .admin-remove-layer': 'removeLayer',
                'click .admin-remove-sublayer': 'removeLayer',
                'click .show-edit-layer': 'clickLayerSettings',
                'click .fetch-ws-button': 'fetchCapabilities',
                //'click .edit-wfs-button': 'editWfsLayerConfiguration',
                'click .icon-close': 'clearInput',
                'change .admin-layer-type': 'createLayerSelect',
                'click .admin-add-group-ok': 'saveCollectionLayer',
                'click .admin-add-group-cancel': 'hideLayerSettings',
                'click .admin-remove-group': 'removeLayerCollection',
                'click .add-layer-record.capabilities li': 'handleCapabilitiesSelection',
                'change .admin-interface-version': 'handleInterfaceVersionChange',
                'change .admin-layer-style': 'handleLayerStyleChange'
            },

            /**
             * At initialization we add model for this tabPanelView, add templates
             * and do other initialization steps.
             *
             * @method initialize
             */
            initialize: function () {
                var me = this;
                this.instance = this.options.instance;
                // for new layers/sublayers, model is always null at this point
                // if we get baseLayerId -> this is a sublayer
                if (this.options.baseLayerId && this.options.model) {
                    // wrap existing sublayers with model
                    this.model = new layerModel(this.options.model);
                } else {
                    this.model = this.options.model;
                }
                // model to use when creating a new layer
                this.modelObj = layerModel;
                this.typeSelectTemplate = _.template(TypeSelectTemplate);
                this.layerTemplate = _.template(LayerSettingsTemplate);

                this.groupTemplate = _.template(GroupSettingsTemplate);
                this.subLayerTemplate = _.template(SubLayerTemplate);
                this.capabilitiesTemplate = _.template(CapabilitiesTemplate);
                _.bindAll(this);

                // Progress spinner
                this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');

                this._rolesUpdateHandler();
                if (this.model) {
                    // listenTo will remove dead listeners, use it instead of on()
                    this.listenTo(this.model, 'change', function() {
                        me.render();
                    });
                }

                this.supportedTypes = this.options.supportedTypes;
                this.render();
            },

            /**
             * Renders layer settings
             *
             * @method render
             */
            render: function () {
                var me = this;
                var spinnerContainer;

                // set id for this layer
                if (me.model && me.model.getId()) {
                    me.$el.attr('data-id', me.model.getId());
                }

                // When creating a new sublayer, its type is 'wmslayer'
                // so no need to show the type select form.
                if (me.options.baseLayerId) {
                    me.$el.empty();
                    me.createLayerForm();
                    return;
                }
                // if editing an existing layer
                if (me.model) {
                    if (me.model.isBaseLayer()) {
                        me.createGroupForm('baseName');
                    } else if (me.model.isGroupLayer()) {
                        me.createGroupForm('groupName');
                    } else {
                        me.$el.empty();
                        me.createLayerForm();
                    }
                } else {
                    // otherwise create a new layer
                    // add html template
                    me.$el.html(me.typeSelectTemplate({
                        model: me.model,
                        supportedTypes : me.supportedTypes,
                        localization: me.options.instance.getLocalization('admin')
                    }));
                }

                // Append a progress spinner
                spinnerContainer = me.instance.view.container.parent().parent();
            },
            /**
             * @method _rolesUpdateHandler
             * @private
             * Updates user roles.
             */
            _rolesUpdateHandler: function () {
                var sandbox = Oskari.getSandbox(),
                    roles = sandbox.getUser().getRoles();

                this.roles = new userRoleCollection(roles).getRoles();
            },

            /**
             * Creates the selection to create either base, group or normal layer.
             *
             * @method createLayerSelect
             */
            createLayerSelect: function (e) {
                jQuery('.add-layer-wrapper').remove();
                jQuery('.admin-add-group').remove();
                jQuery('.layer-type-wrapper').remove();

                var layerType = e.currentTarget.value;
                if (layerType === 'base' || layerType === 'groupMap') {
                    // Create a base or a group layer
                    var groupTitle = (layerType === 'base' ? 'baseName' : 'groupName');
                    this.createGroupForm(groupTitle, e);
                }
                else {
                    // Create a normal layer
                    this.createLayerForm(layerType);
                }
            },
            __isSupportedLayerType : function(layerType) {
                var types = _.map(this.supportedTypes, function(type){
                    return type.id;
                });
                return _.contains(types, layerType);
            },
            __getLayerTypeData : function(layerType) {
                return _.find(this.supportedTypes, function(type) {
                    return type.id === layerType;
                }) ;
            },

            createLayerForm: function (layerType) {
                var me = this,
                    lcId,
                    layerGroups,
                    urlInput,
                    url,
                    urlSource = [],
                    i,
                    j;

                if (!me.model) {
                    me.model = this._createNewModel(layerType);
                    this.listenTo(this.model, 'change', this.render);
                }
                // make sure we have correct layer type (from model)
                layerType = me.model.getLayerType() + 'layer';
                if(!this.__isSupportedLayerType(layerType)) {
                    me.$el.append(me.instance.getLocalization('errors').layerTypeNotSupported + me.model.getLayerType());
                    return;
                }

                // This propably isn't the best way to get reference to inspire themes
                var inspireGroups = this.instance.models.inspire.getGroupTitles(),
                   layerTypeData = me.__getLayerTypeData(layerType);

                me.$el.append(me.layerTemplate({
                    model: me.model,
                    header : layerTypeData.headerTemplate,
                    footer : layerTypeData.footerTemplate,
                    instance: me.options.instance,
                    inspireThemes: inspireGroups,
                    isSubLayer: me.options.baseLayerId,
                    // capabilities template related
                    capabilities: me.model.get('capabilities'),
                    capabilitiesTemplate: me.capabilitiesTemplate,
                    // ^ /capabilities related
                    roles: me.roles
                }));
                // if settings are hidden, we need to populate template and
                // add it to the DOM
                if (!me.$el.hasClass('show-edit-layer')) {
                    me.$el.find('.layout-slider').slider({
                        min: 0,
                        max: 100,
                        value: me.model.getOpacity(),
                        slide: function (event, ui) {
                            var input = jQuery(ui.handle).parents('.left-tools').find('input.opacity-slider.opacity');
                            input.val(ui.value);
                        }
                    });
                    me.$el.find('input.opacity-slider.opacity').on('change paste keyup', function () {
                        var sldr = me.$el.find('.layout-slider');
                        sldr.slider('value', jQuery(this).val());
                    });
                    if(layerType === 'wfslayer') {
                        // Unique name field to readonly
                        me.$el.find('#add-layer-layerName').prop('disabled',true);
                    }
                }
                // Layer interface autocomplete
                lcId = me.$el.parents('.accordion').attr('lcid');
                if (typeof lcId !== 'undefined') {
                    urlInput = me.$el.find('input[type=text]#add-layer-interface');
                    if (urlInput.length > 0 ) {
                        layerGroups = me.options.instance.models.organization.layerGroups;
                        for (i=0; i<layerGroups.length; i++) {
                            if (layerGroups[i].id.toString() === lcId) {
                                for (j=0; j<layerGroups[i].models.length; j++) {
                                    url = layerGroups[i].models[j].getAdmin().url;
                                    if ((typeof url !== 'undefined')&&(jQuery.inArray(url,urlSource) === -1)) {
                                        urlSource.push(url);
                                    }
                                }
                                break;
                            }
                        }
                        if (urlSource.length > 0) {
                            urlSource.sort();
                            urlInput.autocomplete({
                                delay: 300,
                                minLength: 0,
                                source: urlSource
                            });
                        }
                    }
                }
            },
            _createNewModel: function (type) {
                var sandbox = this.instance.sandbox,
                    mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService'),
                    layer = null;
                if (type === 'base' || type === 'groupMap') {
                    layer = mapLayerService.createMapLayer({
                        'type': type
                    });
                } else {
                    if(!type) {
                        // if type is not defined, default to wms
                        type = 'wmslayer';
                    }
                    layer = mapLayerService.createLayerTypeInstance(type);
                }
                return new this.modelObj(layer);
            },

            createGroupForm: function (groupTitle) {
                var me = this;
                if (!me.model) {
                    if (groupTitle === 'baseName') {
                        me.model = this._createNewModel('base');
                    } else {
                        me.model = this._createNewModel('groupMap');
                    }
                }

                // This propably isn't the best way to get reference to inspire themes
                var inspireGroups = this.instance.models.inspire.getGroupTitles();
                me.$el.append(me.groupTemplate({
                    model: me.model,
                    instance: me.options.instance,
                    groupTitle: groupTitle,
                    inspireThemes: inspireGroups,
                    subLayers: me.model.getSubLayers(),
                    subLayerTemplate: me.subLayerTemplate,
                    roles: me.roles
                }));
            },

            /**
             * Hide layer settings
             *
             * @method hideLayerSettings
             */
            hideLayerSettings: function (e) {
                e.stopPropagation();
                var element = jQuery(e.currentTarget);
                if (element.parents('.admin-add-layer').hasClass('show-edit-layer') ||
                    element.parents('.admin-add-layer').hasClass('show-add-layer')) {

                    element.parents('.create-layer').children('.admin-add-layer-btn').html(this.options.instance.getLocalization('admin').addLayer);
                    element.parents('.create-layer').children('.admin-add-layer-btn').attr('title', this.options.instance.getLocalization('admin').addLayerDesc);
                    element.parents('.admin-add-layer').removeClass('show-edit-layer');
                    element.parents('.admin-add-layer').remove();
                }
            },
            /**
             * Handle interface version change
             *
             * @method handleInterfaceVersionChange
             */
            handleInterfaceVersionChange: function (e) {
                e.stopPropagation();
                var element = jQuery(e.currentTarget),
                    form = element.parents('.admin-add-layer'),
                    interfaceVersion = form.find('#add-layer-interface-version').val();

                if(interfaceVersion === '2.0.0') {
                    form.find("input[type='radio'][name='jobtype'][id='layer-jobtype-fe']").prop('checked', true);
                } else {
                    form.find("input[type='radio'][name='jobtype'][id='layer-jobtype-default']").prop('checked', true);
                }

            },
            /**
             * Handle layer style change
             *
             * @method handleLayerStyleChange
             */
            handleLayerStyleChange: function (e) {
                e.stopPropagation();
                var
                    me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.admin-add-layer'),
                    cur_style_name = form.find('#add-layer-style').val();

                me.model.selectStyle(cur_style_name);
                form.find('#add-layer-legendImage').val(me.model.getLegendUrl());
            },

            /**
             * Remove layer
             *
             * @method removeLayer
             */
            removeLayer: function (e, callback) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }

                var me = this,
                    element = jQuery(e.currentTarget),
                    addLayerDiv = element.parents('.admin-add-layer'),
                    confirmMsg = me.instance.getLocalization('admin').confirmDeleteLayer,
                    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    btn = dialog.createCloseButton(me.instance.getLocalization().ok),
                    cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    sandbox = me.options.instance.getSandbox();

                if (callback) {
                    addLayerDiv = jQuery('.admin-layerselector .admin-add-layer.show-edit-layer[data-id=' + me.options.baseLayerId + ']');
                }

                btn.addClass('primary');
                cancelBtn.setTitle(me.instance.getLocalization().cancel);
                btn.setHandler(function() {
                    dialog.close();

                    jQuery.ajax({
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            layer_id: me.model.getId()
                        },
                        url: sandbox.getAjaxUrl() + 'action_route=DeleteLayer',
                        success: function (resp) {
                            if (!resp) {
                                if (addLayerDiv.hasClass('show-edit-layer')) {
                                    addLayerDiv.removeClass('show-edit-layer');
                                    // FIXME this re-renders the layer view but doesn't update the model...
                                    // bubble this action to the View
                                    // = outside of backbone implementation
                                    element.trigger({
                                        type: 'adminAction',
                                        command: 'removeLayer',
                                        modelId: me.model.getId(),
                                        baseLayerId: me.options.baseLayerId
                                    });
                                    addLayerDiv.remove();
                                }
                                if (callback) {
                                    callback();
                                }
                            }
                        },
                        error: function (jqXHR) {
                            if (jqXHR.status !== 0) {
                                me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin')['errorRemoveLayer']);
                            }
                        }
                    });

                });
                cancelBtn.setHandler(function() {
                    dialog.close();
                });

                dialog.show(me.instance.getLocalization('admin')['warningTitle'], confirmMsg, [btn, cancelBtn]);
                dialog.makeModal();

            },
            /**
            * @method _showDialog
            * @private
            * @param title the dialog title
            * @param message the dialog message
            */
            _showDialog: function(title, message){
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                dialog.show(title, message);
                dialog.fadeout(5000);
            },
            /**
            * @method _addLayerAjax
            * @private
            * @param {Object} data saved data
            * @param {jQuery} element jQuery element
            */
            _addLayerAjax: function(data, element){
                var me = this,
                    form = element.parents('.admin-add-layer'),
                    accordion = element.parents('.accordion'),
                    createLayer,
                    sandbox = me.instance.getSandbox();
                // Progress spinner
                me.progressSpinner.start();

                jQuery.ajax({
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    url: sandbox.getAjaxUrl() + 'action_route=SaveLayer',
                    success: function (resp) {
                        var success = true;
                        me.progressSpinner.stop();
                        // response should be a complete JSON for the new layer
                        if (!resp) {
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin').update_or_insert_failed);
                            success = false;
                        } else if (resp.error) {
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin')[resp.error] || resp.error);
                            success = false;
                        }
                        // happy case - we got id
                        if (resp.id) {
                            // close this
                            form.removeClass('show-add-layer');
                            createLayer = form.parents('.create-layer');
                            if (createLayer) {
                                createLayer.find('.admin-add-layer-btn').html(me.instance.getLocalization('admin').addLayer);
                                createLayer.find('.admin-add-layer-btn').attr('title', me.instance.getLocalization('admin').addLayerDesc);
                            }
                            form.remove();

                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: 'adminAction',
                                command: me.model.getId() !== null && me.model.getId() !== undefined ? 'editLayer' : 'addLayer',
                                layerData: resp,
                                baseLayerId: me.options.baseLayerId
                            });
                        }
                        if (resp.warn) {
                            me._showDialog(me.instance.getLocalization('admin')['warningTitle'], me.instance.getLocalization('admin')[resp.warn] || resp.warn);
                            success = false;
                        }
                        if (success) {
                            me._showDialog(me.instance.getLocalization('admin')['successTitle'], me.instance.getLocalization('admin')['success']);
                        }
                    },
                    error: function (jqXHR) {
                        me.progressSpinner.stop();
                        if (jqXHR.status !== 0) {
                            var loc = me.instance.getLocalization('admin'),
                                err = loc.update_or_insert_failed;
                            if (jqXHR.responseText) {
                                var jsonResponse = jQuery.parseJSON(jqXHR.responseText);
                                if (jsonResponse && jsonResponse.error) {
                                    err = jsonResponse.error;
                                    // see if we recognize the error
                                    var errVar = null;
                                    if (err.indexOf('mandatory_field_missing:') === 0) {
                                        errVar = err.substring('mandatory_field_missing:'.length);
                                        err = 'mandatory_field_missing';
                                    } else if (err.indexOf('invalid_field_value:') === 0) {
                                        errVar = err.substring('invalid_field_value:'.length);
                                        err = 'invalid_field_value';
                                    } else if (err.indexOf('operation_not_permitted_for_layer_id:') === 0) {
                                        errVar = err.substring('operation_not_permitted_for_layer_id:'.length);
                                        err = 'operation_not_permitted_for_layer_id';
                                    } else if (err.indexOf('no_layer_with_id') === 0) {
                                        errVar = err.substring('no_layer_with_id:'.length);
                                        err = 'no_layer_with_id';
                                    }

                                    err = loc[err] || err;
                                    if (errVar && loc[errVar]) {
                                        err += loc[errVar];
                                    } else if (errVar) {
                                        err += errVar;
                                    }
                                }
                            }
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], err);
                        }
                    }
                });
            },
            /**
             * Add layer
             *
             * @method addLayer
             */
            addLayer: function (e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }

                var me = this,
                    element = jQuery(e.currentTarget),
                    accordion = element.parents('.accordion'),
                    lcId = accordion.attr('lcid'),
                    form = element.parents('.admin-add-layer'),
                    data = {},
                    interfaceVersion = form.find('#add-layer-interface-version').val(),
                    sandbox = me.instance.getSandbox(),
                    admin;

                if (lcId === null || lcId === undefined || !lcId.length) {
                    lcId = me.options.groupId;
                    accordion = jQuery('.admin-layerselector .accordion[lcid=' + lcId + ']');
                }

                // If this is a sublayer -> setup parent layers id
                if (me.options.baseLayerId) {
                    data.parentId = me.options.baseLayerId;
                }

                // add layer type and version
                data.version = (interfaceVersion !== '') ? interfaceVersion : form.find('#add-layer-interface-version > option').first().val();

                // base and group are always of type wmslayer
                data.layerType = me.model.getLayerType() + 'layer';
                if (me.model.getId() !== null && me.model.getId() !== undefined) {
                    data.layer_id = me.model.getId();
                }

                form.find('[id$=-name]').filter('[id^=add-layer-]').each(function () {
                    var lang = this.id.substring(10, this.id.indexOf('-name'));
                    data['name_' + lang] = this.value;
                });

                form.find('[id$=-title]').filter('[id^=add-layer-]').each(function () {
                    var lang = this.id.substring(10, this.id.indexOf('-title'));
                    data['title_' + lang] = this.value;
                });

                data.layerUrl = form.find('#add-layer-url').val();
                if (typeof data.layerUrl === "undefined") {
                    data.layerUrl = form.find('#add-layer-interface').val();
                }

                data.opacity = form.find('#opacity-slider').val();

                data.style = form.find('#add-layer-style').val();
                data.minScale = form.find('#add-layer-minscale').val();
                data.maxScale = form.find('#add-layer-maxscale').val();
                data.legendImage = form.find('#add-layer-legendImage').val();
                data.inspireTheme = form.find('#add-layer-inspire-theme').val();
                data.metadataId = form.find('#add-layer-datauuid').val();
                data.attributes = form.find('#add-layer-attributes').val();

                // layer type specific
                // TODO: maybe something more elegant?
                if(data.layerType === 'wmslayer') {
                    data.xslt = form.find('#add-layer-xslt').val();
                    data.gfiType = form.find('#add-layer-responsetype').val();
                    data.params = form.find('#add-layer-selectedtime').val();
                }
                else if(data.layerType === 'wmtslayer') {
                    data.matrixSetId = form.find('#add-layer-matrixSetId').val();
                }
                else if(data.layerType === 'wfslayer') {
                    admin = me.model.getAdmin();
                    // in insert all wfs properties are behind passthrough
                    if ((admin)&&(admin.passthrough)) {
                        _.forEach(admin.passthrough, function (value, key) {
                            data[key] = typeof value === 'object' ? JSON.stringify(value) : value;
                        });
                    }
                }
                data.layerName = form.find('#add-layer-layerName').val();
                data.gfiContent = form.find('#add-layer-gfi-content').val();

                data.realtime = form.find('#add-layer-realtime').is(':checked');
                data.refreshRate = form.find('#add-layer-refreshrate').val();

                data.srs_name = form.find('#add-layer-srs_name').val();
                if((data.srs_name === null || data.srs_name === undefined) && sandbox.getMap()) {
                    data.srs_name = sandbox.getMap().getSrsName();
                }
                data.jobType =  form.find("input[type='radio'][name='jobtype']:checked").val();

                data.manualRefresh =  form.find("input[type='checkbox'][name='manualRefresh']:checked").val();

                data.username = form.find('#add-layer-username').val();
                data.password = form.find('#add-layer-password').val();

                if (!data.gfiType) {
                    // if there isn't a selection, don't send anything so backend will keep the existing value
                    delete data.gfiType;
                }

                data.viewPermissions = '';
                data.downloadPermissions = '';
                data.enbeddedPermissions = '';
                data.publishPermissions = '';
                for (var i = 0; i < me.roles.length; i += 1) {
                    if (form.find('#layer-view-roles-' + me.roles[i].id).is(':checked')) {
                        data.viewPermissions += me.roles[i].id + ',';
                    }
                    if (form.find('#layer-download-roles-' + me.roles[i].id).is(':checked')) {
                        data.downloadPermissions += me.roles[i].id + ',';
                    }
                    if (form.find('#layer-enbedded-roles-' + me.roles[i].id).is(':checked')) {
                        data.enbeddedPermissions += me.roles[i].id + ',';
                    }
                    if (form.find('#layer-publish-roles-' + me.roles[i].id).is(':checked')) {
                        data.publishPermissions += me.roles[i].id + ',';
                    }
                }

                // Layer class id aka. orgName id aka groupId
                data.groupId = lcId;

                if ((data.layerUrl !== me.model.getInterfaceUrl() && me.model.getInterfaceUrl() )||
                    (data.layerName !== me.model.getLayerName() && me.model.getLayerName()) ) {
                    var confirmMsg = me.instance.getLocalization('admin').confirmResourceKeyChange,
                        dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        btn = dialog.createCloseButton(me.instance.getLocalization().ok),
                        cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

                    btn.addClass('primary');
                    cancelBtn.setTitle(me.instance.getLocalization().cancel);

                    btn.setHandler(function() {
                        dialog.close();
                        me._addLayerAjax(data, element);
                    });

                    cancelBtn.setHandler(function() {
                        dialog.close();
                    });

                    dialog.show(me.instance.getLocalization('admin')['warningTitle'], confirmMsg, [btn, cancelBtn]);
                    dialog.makeModal();
                } else {
                    me._addLayerAjax(data, element);
                }
            },
            /**
             * Save group or base layers
             *
             * @method saveCollectionLayer
             */
            saveCollectionLayer: function (e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    groupElement = element.parents('.admin-add-group'),
                    accordion = element.parents('.accordion');

                var sandbox = me.options.instance.getSandbox();
                var data = {
                    groupId: accordion.attr('lcid'),
                    layerType: 'collection',
                    isBase: me.model.isBaseLayer(),
                    inspireTheme: groupElement.find('#add-layer-inspire-theme').val()
                };

                if (me.model.getId() !== null && me.model.getId() !== undefined) {
                    data.layer_id = me.model.getId();
                }

                groupElement.find('[id$=-name]').filter('[id^=add-group-]').each(function () {
                    var lang = this.id.substring(10, this.id.indexOf('-name'));
                    data['name_' + lang] = this.value;
                });

                // permissions
                if (!me.model.getId()) {
                    var checkedPermissions = [];
                    groupElement.find('.layer-view-role').filter(':checked').each(function () {
                        checkedPermissions.push(jQuery(this).data('role-id'));
                    });

                    data.viewPermissions = checkedPermissions.join();
                }

                // make AJAX call
                jQuery.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: data,
                    beforeSend: function () {
                        jQuery('body').css({
                            cursor: 'wait'
                        });
                    },
                    url: sandbox.getAjaxUrl() + 'action_route=SaveLayer',
                    success: function () {
                        jQuery('body').css('cursor', '');
                        if (!me.model.getId()) {
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: 'adminAction',
                                command: 'addLayer',
                                layerData: resp
                            });
                        } else {
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: 'adminAction',
                                command: 'editLayer',
                                layerData: resp
                            });
                        }
                    },
                    error: function () {
                        jQuery('body').css('cursor', '');
                        me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin')['errorSaveGroupLayer']);
                    }
                });
            },
            removeLayerCollection: function (e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    //                    editForm = element.parents('.admin-add-layer').attr('data-id'),
                    accordion = element.parents('.accordion');
                var sandbox = me.options.instance.getSandbox();
                // make AJAX call
                jQuery.ajax({
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        layer_id: me.model.getId()
                    },
                    url: sandbox.getAjaxUrl() + 'action_route=DeleteLayer',
                    success: function (resp) {
                        accordion.trigger({
                            type: 'adminAction',
                            command: 'removeLayer',
                            modelId: me.model.getId()
                        });
                    },
                    error: function () {
                        me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin')['errorRemoveGroupLayer']);
                    }
                });
            },
            /**
             * Fetch capabilities. AJAX call to get capabilities for given capability url
             *
             * @method fetchCapabilities
             */
            fetchCapabilities: function (e) {
                var me = this,
                    element = jQuery(e.currentTarget),
                    form = element.parents('.add-layer-wrapper'),
                    baseUrl = me.options.instance.getSandbox().getAjaxUrl();

                e.stopPropagation();

                // Progress spinner
                me.progressSpinner.start();

                var serviceURL = form.find('#add-layer-interface').val(),
                    layerType = form.find('#add-layer-layertype').val(),
                    user = form.find('#add-layer-username').val(),
                    pw =  form.find('#add-layer-password').val(),
                    version =  form.find('#add-layer-interface-version').val();

                me.model.set({
                    '_layerUrls': [serviceURL]
                }, {
                    silent: true
                });
                me.model.set({_admin:{
                    username: user,
                    password: pw,
                    version: version
                }}, {
                    silent: true
                });

                jQuery.ajax({
                    type: 'POST',
                    data: {
                        url: serviceURL,
                        type : layerType,
                        user: user,
                        pw: pw,
                        version: version
                    },
                    url: baseUrl + 'action_route=GetWSCapabilities',
                    success: function (resp) {
                        me.progressSpinner.stop();
                        me.__capabilitiesResponseHandler(layerType, resp);
                    },
                    error: function (jqXHR) {
                        me.progressSpinner.stop();
                        if (jqXHR.status !== 0) {
                            me._showDialog(me.instance.getLocalization('admin')['errorTitle'], me.instance.getLocalization('admin').metadataReadFailure);
                        }
                    }
                });
            },
            /**
             * Acts on capabilities response based on layer type
             * @param  {String} layerType 'wmslayer'/'wmtslayer'/'wfslayer'
             * @param  {String} response  GetWSCapabilities response
             */
            __capabilitiesResponseHandler : function(layerType, response) {
                var me = this,
                    warningDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    warningDialogOkBtn = warningDialog.createCloseButton(me.instance.getLocalization().ok),
                    warningMessage;
                me.model.setCapabilitiesResponse(response);
                if(layerType === 'wfslayer') {
                    //check layers with error and act accordingly.
                    var capabilities = me.model.get("capabilities");
                    if (capabilities && capabilities.layersWithErrors && capabilities.layersWithErrors.length > 0) {
                        warningMessage = _.template(LayersWithErrorsPopupTemplate, {"capabilities": capabilities, title: me.instance.getLocalization('admin')['warning_some_of_the_layers_could_not_be_parsed']});
                        warningDialog.show(me.instance.getLocalization('admin')['warningTitle'], warningMessage, [warningDialogOkBtn]);
                        warningDialog.makeModal();
                    }
                }
            },
            handleCapabilitiesSelection: function (e) {
                var me = this,
                    current = jQuery(e.currentTarget);
                // stop propagation so handler on outer tags won't be triggered as well
                e.stopPropagation();
                var layerName = current.attr('data-layername'),
                    additionalId = current.attr('data-additionalId');
                if (layerName) {
                    // actual layer node -> populate model
                    me.model.setupCapabilities(layerName, null, additionalId);
                } else {
                    // toggle class to hide submenu
                    current.toggleClass('closed');
                    // toggle open/closed icon
                    current.children('div.inline-icon').toggleClass('icon-arrow-right icon-arrow-down');
                }
            },

            /**
             * Helper function. This returns inner value
             * first one or the one which matches with given key
             *
             * @method getValue
             */
            getValue: function (object, key) {
                var k,
                    ret;
                if (key && object[key]) {
                    ret = object[key];
                }
                if (!ret) {
                    for (k in object) {
                        if (object.hasOwnProperty(k)) {
                            ret = object[k];
                            break;
                        }
                    }
                }
                return ret;
            },
            clearInput: function (e) {
                var element = jQuery(e.currentTarget),
                    input = element.parent().children(':input');
                if (input.length === 1) {
                    input.val('');
                }
            },

            /**
             * Stops propagation if admin clicks layer settings section.
             *
             * @method addLayer
             */
            clickLayerSettings: function (e) {
                e.stopPropagation();
            }
        });
    });
