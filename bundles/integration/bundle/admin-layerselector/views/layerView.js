define([
    "text!_bundle/templates/layerRowTemplate.html",
    "_bundle/views/adminLayerSettingsView",
    "text!_bundle/templates/group/subLayerTemplate.html",
    'text!_bundle/templates/adminGroupSettingsTemplate.html',
    ], 
    function(ViewTemplate, AdminLayerSettingsView, SubLayerTemplate, AdminGroupSettingsTemplate) {
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
            "click .admin-add-layer-cancel" : "hideLayerSettings",
            "click"                         : "toggleLayerSettings",
            "click .show-edit-layer"        : "clickLayerSettings",
            "click .sublayer-name"          : "toggleSubLayerSettings",
            "click .admin-add-sublayer"     : "toggleSubLayerSettings"
        },

        /**
         * At initialization we add model for this layerView, add templates
         * and do other initialization steps.
         *
         * @method initialize
         */
        initialize : function() {
            this.instance           = this.options.instance;
            this.model              = this.options.model;
            this.classNames         = this.options.classes;
            this.template           = _.template(ViewTemplate);
            this.subLayerTemplate   = _.template(SubLayerTemplate);
            this.render();
        },

        /**
         * Renders layerRowTemplate and calls _renderLayertools
         *
         * @method render
         */
        render : function() {
            this.$el.html(this.template({model:this.model}));
            this._renderLayerTools();

        },

        /**
         * Renders tooltip related classes etc. 
         *
         * @method _renderLayerTools
         */
        _renderLayerTools: function() {
            var sandbox = this.instance.sandbox;
            var layer = this.model;
            var tooltips = this.instance.getLocalization('tooltip');
            var tools = this.$el.find('div.layer-tools');
            var icon = this.$el.find('div.layer-icon');

            icon.addClass(layer.getIconClassname());
            if (layer.isBaseLayer()) {
                icon.attr('title', tooltips['type-base']);
            } else if (layer.isLayerOfType('WMS')) {
                icon.attr('title', tooltips['type-wms']);
            }
            // FIXME: WMTS is an addition done by an outside bundle
            // so this shouldn't
            // be here
            // but since it would require some refactoring to make
            // this general
            // I'll just leave this like it was on old implementation
            else if (layer.isLayerOfType('WMTS')) {
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WFS')) {
                icon.attr('title', tooltips['type-wfs']);
            } else if (layer.isLayerOfType('VECTOR')) {
                icon.attr('title', tooltips['type-wms']);
            }

            if(layer.getMetadataIdentifier()) {
                tools.find('div.layer-info').addClass('icon-info');
                tools.find('div.layer-info').click(function() {
                      var rn = 'catalogue.ShowMetadataRequest';
                      var uuid = layer.getMetadataIdentifier();
                         var additionalUuids = [];
                    var additionalUuidsCheck = {};
                    additionalUuidsCheck[uuid] = true; 
                    var subLayers = layer.getSubLayers(); 
                    if( subLayers && subLayers.length > 0 ) {
                        for( var s = 0 ; s < subLayers.length;s++) {
                            var subUuid = subLayers[s].getMetadataIdentifier();
                            if( subUuid && subUuid != "" && !additionalUuidsCheck[subUuid] ) { 
                                additionalUuidsCheck[subUuid] = true;
                                additionalUuids.push({
                                    uuid: subUuid
                                });
                                 
                            }
                        }
                    }
                                    
                    sandbox.postRequestByName(rn, [
                        { uuid : uuid }, additionalUuids
                    ]);
                });
            }
        },
        /**
         * Show and hide settings related to this layer 
         *
         * @method toggleLayerSettings
         */
        toggleLayerSettings : function(e) {
            var element = jQuery(e.currentTarget);
            //show layer settings
            if(element.parents('.admin-add-layer').length == 0 && 
                !element.find('.admin-add-layer').hasClass('show-edit-layer')) {
                
                e.stopPropagation();
                // decode styles
                if(this.model.admin && this.model.admin.style_decoded == null && this.model.admin.style != null) {
                    var styles = [];
                    styles.push(this.options.layerTabModel.decode64(this.model.admin.style));
                    this.model.admin.style_decoded = styles;
                }
                // create AdminLayerSettingsView
                var settings = new AdminLayerSettingsView({
                    model: this.model,  
                    instance : this.options.instance, 
                    classes : this.classNames,
                    layerTabModel : this.options.layerTabModel
                });
                element.append(settings.$el);
                element.find('.layout-slider').slider({min:0, max: 100, value:100, slide: function( event, ui ) {
                    jQuery(ui.handle).parents('.left-tools').find( "#opacity-slider" ).val( ui.value );
                }});

                // TODO when backend works and we have new jQuery UI
                //this.$el.find("#add-layer-inspire-theme").tagit({availableTags: ["Hallinnolliset yksiköt", "Hydrografia", "Kiinteistöt", "Kohteet", "Koordinaattijärjestelmät", "Korkeus", "Liikenneverkot", "Maankäyttö", "Maanpeite","Maaperä","Merialueet", "Metatieto"]});


                setTimeout(function(){
                    element.find('.admin-add-layer').addClass('show-edit-layer');
                }, 30);
            }
            //hide layer settings
            else {
                element.find('.admin-add-layer').removeClass('show-edit-layer');
                setTimeout(function(){
                    element.find('.admin-add-layer').remove();
                },300);

            }
        },

        toggleSubLayerSettings: function(e) {
            var element = jQuery(e.currentTarget).parents('.add-sublayer-wrapper');
            //show layer settings
            if (!element.hasClass('show-edit-sublayer')) {
                e.stopPropagation();

                var subLayerId = element.attr('sublayer-id');
                var subLayer = this._getSubLayerById(subLayerId);
                // decode styles
                if(subLayer && subLayer.admin && subLayer.admin.style_decoded == null
                    && subLayer.admin.style != null) {
                    var styles = [];
                    styles.push(this.options.layerTabModel.decode64(subLayer.admin.style));
                    subLayer.admin.style_decoded = styles;
                }

                // Get the parent layer id
                if (this.model && (typeof this.model.getId() === 'string')) {
                    // eg. 'base_36' -> 36
                    var baseLayerId = Number(this.model.getId().replace('base_', ''));
                }

                // create AdminLayerSettingsView
                var settings = new AdminLayerSettingsView({
                    model: subLayer,  
                    instance : this.options.instance, 
                    classes : this.classNames,
                    layerTabModel : this.options.layerTabModel,
                    baseLayerId : baseLayerId
                });
                element.append(settings.$el);
                element.find('.layout-slider').slider({min:0, max: 100, value:100, slide: function( event, ui ) {
                    jQuery(ui.handle).parents('.left-tools').find( "#opacity-slider" ).val( ui.value );
                }});

                // TODO when backend works and we have new jQuery UI
                //this.$el.find("#add-layer-inspire-theme").tagit({availableTags: ["Hallinnolliset yksiköt", "Hydrografia", "Kiinteistöt", "Kohteet", "Koordinaattijärjestelmät", "Korkeus", "Liikenneverkot", "Maankäyttö", "Maanpeite","Maaperä","Merialueet", "Metatieto"]});


                setTimeout(function(){
                    element.addClass('show-edit-sublayer');
                }, 30);
            }
            //hide layer settings
            else {
                element.removeClass('show-edit-sublayer');
                setTimeout(function(){
                    element.find('.admin-add-layer').remove();
                },300);

            }
        },

        /**
         * Hide settings related to this layer 
         *
         * @method hideLayerSettings
         */
        hideLayerSettings : function(e) {
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            if(element.parents('.admin-add-layer').hasClass('show-edit-layer')) {
                element.parents('.admin-add-layer').removeClass('show-edit-layer');
                setTimeout(function(){
                    element.parents('.admin-add-layer').remove();
                },300);

            }
        },
        
        /**
         * Stops propagation if admin clicks settings view 
         *
         * @method removeLayer
         */
        clickLayerSettings: function(e) {
            if(!jQuery(e.target).hasClass('admin-add-layer-ok')) {
                e.stopPropagation();
            } else {
                this.trigger(e);
            }
        },

        _getSubLayerById: function(subLayerId) {
            var mapLayerService = this.instance.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            return mapLayerService.findMapLayer(Number(subLayerId));
        }
    });
});
