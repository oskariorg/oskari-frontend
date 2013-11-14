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

                        sandbox.postRequestByName(rn, [
                            {
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
                    // decode styles
                    if (me.model.admin && (me.model.admin.style_decoded === null || me.model.admin.style_decoded === undefined) && me.model.admin.style !== null && me.model.admin.style !== undefined) {
                        var styles = [];
                        styles.push(me.options.layerTabModel.decode64(me.model.admin.style));
                        me.model.admin.style_decoded = styles;
                    }
                    // create AdminLayerSettingsView
                    var settings = new AdminLayerSettingsView({
                        model: me.model,
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
                var element = jQuery(e.currentTarget).parents('.add-sublayer-wrapper');
                //show layer settings
                if (!element.hasClass('show-edit-sublayer')) {
                    e.stopPropagation();

                    var subLayerId = element.attr('sublayer-id'),
                        subLayer = this._getSubLayerById(subLayerId);
                    // decode styles
                    if (subLayer && subLayer.admin && (subLayer.admin.style_decoded === null || subLayer.admin.style_decoded === undefined) && subLayer.admin.style !== null && subLayer.admin.style !== undefined) {
                        var styles = [];
                        styles.push(this.options.layerTabModel.decode64(subLayer.admin.style));
                        subLayer.admin.style_decoded = styles;
                    }
                    var baseLayerId;
                    // Get the parent layer id
                    if (this.model && (typeof this.model.getId() === 'string')) {
                        // eg. 'base_36' -> 36
                        baseLayerId = Number(this.model.getId().replace('base_', ''));
                    }

                    // create AdminLayerSettingsView
                    var settings = new AdminLayerSettingsView({
                        model: subLayer,
                        instance: this.options.instance,
                        classes: this.classNames,
                        layerTabModel: this.options.layerTabModel,
                        baseLayerId: baseLayerId
                    });
                    element.append(settings.$el);

                    // TODO when backend works and we have new jQuery UI
                    //this.$el.find("#add-layer-inspire-theme").tagit({availableTags: ["Hallinnolliset yksiköt", "Hydrografia", "Kiinteistöt", "Kohteet", "Koordinaattijärjestelmät", "Korkeus", "Liikenneverkot", "Maankäyttö", "Maanpeite","Maaperä","Merialueet", "Metatieto"]});


                    element.addClass('show-edit-sublayer');
                } else {
                    //hide layer settings
                    element.removeClass('show-edit-sublayer');
                    element.find('.admin-add-layer').remove();

                }
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
                return mapLayerService.findMapLayer(Number(subLayerId));
            }
        });
    });