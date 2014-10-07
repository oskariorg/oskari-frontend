define([
        "text!_bundle/templates/layerRowTemplate.html",
        "_bundle/views/adminLayerSettingsView",
        "text!_bundle/templates/group/subLayerTemplate.html",
        'text!_bundle/templates/adminGroupSettingsTemplate.html'
    ],
    function (ViewTemplate, AdminLayerSettingsView, SubLayerTemplate, AdminGroupSettingsTemplate) {
        return Backbone.View.extend({
            tagName: 'div',
            className: 'layer',

            /**
             * This object contains backbone event-handling.
             * It binds methods to certain events fired by different elements.
             *
             * @property events
             * @type {Object}
             */
            events: {
                "click .admin-add-layer-cancel": "hideLayerSettings",
                "click": "toggleLayerSettings",
                "click .show-edit-layer": "clickLayerSettings",
                "click .sublayer-name": "toggleSubLayerSettings",
                "click .admin-add-sublayer-cancel": "toggleSubLayerSettings",
                "click .admin-add-sublayer": "toggleSubLayerSettings"
            },

            /**
             * At initialization we add model for this layerView, add templates
             * and do other initialization steps.
             *
             * @method initialize
             */
            initialize: function () {
                var me = this;
                me.instance = me.options.instance;
                me.model = me.options.model;
                me.classNames = me.options.classes;
                me.template = _.template(ViewTemplate);
                me.subLayerTemplate = _.template(SubLayerTemplate);
                // listenTo will remove dead listeners, use it instead of on()
                this.listenTo(this.model, 'add', function() {
                    //console.log('layerView add', arguments);
                    me.render();
                });
                this.listenTo(this.model, 'change', function() {
                    //console.log('layerView change', arguments);
                    me.render();
                });
                this.listenTo(this.model, 'remove', function() {
                    //console.log('layerView remove', arguments);
                    me.render();
                });
                //this.model.on('change', this.render, this);
                this.supportedTypes = this.options.supportedTypes;
                me.render();
            },
            /**
             * Renders layerRowTemplate and calls _renderLayertools
             *
             * @method render
             */
            render: function () {
                this.$el.html(this.template({
                    model: this.model
                }));
                this._renderLayerTools();

            },

            /**
             * Renders tooltip related classes etc.
             *
             * @method _renderLayerTools
             */
            _renderLayerTools: function () {
                var me = this,
                    sandbox = me.instance.sandbox,
                    layer = me.model,
                    tooltips = me.instance.getLocalization('tooltip'),
                    tools = me.$el.find('div.layer-tools'),
                    icon = me.$el.find('div.layer-icon');

                icon.addClass(layer.getIconClassname());
                if (layer.isBaseLayer()) {
                    icon.attr('title', tooltips['type-base']);
                } else if (layer.isLayerOfType('WMS')) {
                    icon.attr('title', tooltips['type-wms']);
                } else if (layer.isLayerOfType('WMTS')) {
                    // FIXME: WMTS is an addition done by an outside bundle
                    // so this shouldn't
                    // be here
                    // but since it would require some refactoring to make
                    // this general
                    // I'll just leave this like it was on old implementation
                    icon.attr('title', tooltips['type-wms']);
                } else if (layer.isLayerOfType('WFS')) {
                    icon.attr('title', tooltips['type-wfs']);
                } else if (layer.isLayerOfType('VECTOR')) {
                    icon.attr('title', tooltips['type-wms']);
                }
                if (layer.getMetadataIdentifier()) {
                    tools.find('div.layer-info').addClass('icon-info');
                    tools.find('div.layer-info').click(function () {
                        var rn = 'catalogue.ShowMetadataRequest',
                            uuid = layer.getMetadataIdentifier(),
                            additionalUuids = [],
                            additionalUuidsCheck = {};
                        additionalUuidsCheck[uuid] = true;
                        var subLayers = layer.getSubLayers(),
                            s,
                            subUuid;
                        if (subLayers && subLayers.length > 0) {
                            for (s = 0; s < subLayers.length; s++) {
                                subUuid = subLayers[s].getMetadataIdentifier();
                                if (subUuid && subUuid !== "" && !additionalUuidsCheck[subUuid]) {
                                    additionalUuidsCheck[subUuid] = true;
                                    additionalUuids.push({
                                        uuid: subUuid
                                    });

                                }
                            }
                        }

                        sandbox.postRequestByName(rn, [{
                                uuid: uuid
                            },
                            additionalUuids
                        ]);
                    });
                }
            },
            /**
             * Show and hide settings related to this layer
             *
             * @method toggleLayerSettings
             */
            toggleLayerSettings: function (e) {
                var me = this,
                    element = jQuery(e.currentTarget);
                //show layer settings
                if (element.parents('.admin-add-layer').length === 0 && !element.find('.admin-add-layer').hasClass('show-edit-layer')) {
                    e.stopPropagation();
                    // create AdminLayerSettingsView
                    var settings = new AdminLayerSettingsView({
                        model: me.model,
                        supportedTypes : me.supportedTypes,
                        instance: me.options.instance,
                        classes: me.classNames,
                        layerTabModel: me.options.layerTabModel
                    });
                    element.append(settings.$el);

                    // TODO when backend works and we have new jQuery UI
                    //this.$el.find("#add-layer-inspire-theme").tagit({availableTags: ["Hallinnolliset yksiköt", "Hydrografia", "Kiinteistöt", "Kohteet", "Koordinaattijärjestelmät", "Korkeus", "Liikenneverkot", "Maankäyttö", "Maanpeite","Maaperä","Merialueet", "Metatieto"]});


                    element.find('.admin-add-layer').addClass('show-edit-layer');
                } else {
                    //hide layer settings
                    element.find('.admin-add-layer').removeClass('show-edit-layer');
                    element.find('.admin-add-layer').remove();

                }
            },

            toggleSubLayerSettings: function (e) {
                var me = this,
                    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    element = jQuery(e.currentTarget).parents('.add-sublayer-wrapper');

                e.stopPropagation();

                var subLayerId = element.attr('sublayer-id'),
                    subLayer = this._getSubLayerById(subLayerId),
                    parentId = this.model.getId(),
                    isEdit = subLayerId !== null && subLayerId !== undefined;

                // create AdminLayerSettingsView
                var settings = new AdminLayerSettingsView({
                    model: subLayer,
                    supportedTypes : me.supportedTypes,
                    instance: this.options.instance,
                    layerTabModel: this.options.layerTabModel,
                    baseLayerId: parentId,
                    groupId: element.parents('.accordion').attr('lcid')
                });
                // Create buttons for the popup and hide the form buttons...
                var container = jQuery('<div class="admin-layerselector"><div class="layer"></div></div>'),
                    buttons = [],
                    saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                    exitPopup = function () {
                        settings.undelegateEvents();
                        settings.$el.removeData().unbind();
                        settings.remove();
                        Backbone.View.prototype.remove.call(settings);
                        dialog.close();
                        // TODO refresh parent layer view
                        // call trigger on parent element's dom...
                        // see adminAction
                    };
                if(subLayer && subLayer.getId && subLayer.getId()) {
                    saveButton.setTitle(this.instance.getLocalization('save'));
                }
                else {
                    saveButton.setTitle(this.instance.getLocalization('add'));
                }
                saveButton.addClass('primary');
                saveButton.setHandler(function () {
                    var el = {
                        currentTarget: settings.$el.find('.admin-add-sublayer-ok')
                    };
                    settings.addLayer(el, exitPopup);
                    // update the UI on parent level
                    me.model.trigger('change', me.model);
                });
                cancelButton.setHandler(function () {
                    exitPopup();
                });
                cancelButton.setTitle(this.instance.getLocalization('cancel'));
                buttons.push(saveButton);
                if (isEdit) {
                    var deleteButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    deleteButton.setTitle(this.instance.getLocalization('delete'));
                    deleteButton.setHandler(function () {
                        var el = {
                            currentTarget: settings.$el.find('.admin-remove-sublayer')
                        };
                        settings.removeLayer(el, function() {
                            // we need to trigger this manually for sublayers to work...
                            me.$el.trigger({
                                type: 'adminAction',
                                command: 'removeLayer',
                                modelId: subLayerId,
                                baseLayerId: parentId
                            });
                            exitPopup(); 
                        });
                        //exitPopup();
                    });
                    buttons.push(deleteButton);
                }
                buttons.push(cancelButton);
                container.find('.layer').append(settings.$el);
                // show the dialog
                var titleKey = isEdit ? 'editSubLayer' : 'addSubLayer';
                dialog.show(this.instance.getLocalization('admin')[titleKey], container, buttons);
                // Move layer next to whatever opened it
                dialog.moveTo(e.currentTarget, 'right');
                dialog.makeModal();
            },

            /**
             * Hide settings related to this layer
             *
             * @method hideLayerSettings
             */
            hideLayerSettings: function (e) {
                e.stopPropagation();
                var element = jQuery(e.currentTarget);
                if (element.parents('.admin-add-layer').hasClass('show-edit-layer')) {
                    element.parents('.admin-add-layer').removeClass('show-edit-layer');
                    element.parents('.admin-add-layer').remove();

                }
            },

            /**
             * Stops propagation if admin clicks settings view
             *
             * @method removeLayer
             */
            clickLayerSettings: function (e) {
                if (!jQuery(e.target).hasClass('admin-add-layer-ok')) {
                    e.stopPropagation();
                } else {
                    this.trigger(e);
                }
            },

            _getSubLayerById: function (subLayerId) {
                var mapLayerService = this.instance.sandbox.getService('Oskari.mapframework.service.MapLayerService');
                return mapLayerService.findMapLayer(subLayerId, this.model.getSubLayers());
            }
        });
    });
