define([
    'text!_bundle/templates/adminLayerSettingsTemplate.html'
    ], 
    function(LayerSettingsTemplate) {
    return Backbone.View.extend({
//<div class="admin-add-layer" data-id="<% if(model != null && model.getId()) { %><%= model.getId() %><% } %>">

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
            "click .admin-add-layer-ok"     : "addLayer",
            "click .admin-add-layer-cancel" : "hideLayerSettings",
            "click .admin-remove-layer"     : "removeLayer",
            "click .show-edit-layer"        : "clickLayerSettings",
            "click #add-layer-wms-button"   : "fetchCapabilities",
            "click .icon-close"             : "clearInput"
        },

        /**
         * At initialization we add model for this tabPanelView, add templates
         * and do other initialization steps.
         *
         * @method initialize
         */
        initialize : function() {
            this.instance           = this.options.instance;
            this.model              = this.options.model;
            this.classes            = this.options.classes;
            this.template           = _.template(LayerSettingsTemplate);
            _.bindAll(this);
            this.render();
        },

        /**
         * Renders layer settings
         *
         * @method render
         */
        render : function() {
            // set id for this layer
            if(this.model != null && this.model.getId()) { 
                this.$el.attr('data-id', this.model.getId());
            }
            // add html template
            this.$el.html(this.template({
                model: this.model, 
                instance : this.options.instance,
                classNames : this.classes.getGroupTitles()
            }));
            // if settings are hidden, we need to populate template and
            // add it to the DOM
            if(!this.$el.hasClass('show-edit-layer')) {
                // decode xslt
                if(this.model != null && this.model.admin.xslt && !this.model.admin.xslt_decoded) {
                    this.model.admin.xslt_decoded = this.classes.decode64(this.model.admin.xslt);
                }
                if(this.model != null && 
                    this.model.admin.style_decoded == null && 
                    this.model.admin.style != null) {

                    var styles = [];
                    styles.push(this.classes.decode64(this.model.admin.style));
                    this.model.admin.style_decoded = styles;
                }
                // add template
                var settings = this.template({
                    model: this.model, 
                    instance : this.options.instance,
                    classNames : this.classes.getGroupTitles()
                });
                this.$el.html(settings);

                // add opacity
                var opacity = 100;
                if(this.model != null && this.model.admin.opacity != null) {
                    opacity = this.model.admin.opacity;
                }
                this.$el.find('.layout-slider').slider({
                    min:0, 
                    max: 100, 
                    value:opacity, 
                    slide: function( event, ui ) {
                        jQuery(ui.handle).parents('.left-tools').find( "#opacity-slider" ).val( ui.value );
                    }
                });
            }
        },

        /**
         * Hide layer settings
         *
         * @method hideLayerSettings
         */
        hideLayerSettings : function(e) {
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            if(element.parents('.admin-add-layer').hasClass('show-edit-layer') || 
                element.parents('.admin-add-layer').hasClass('show-add-layer')) {
                
                element.parents('.admin-add-layer').removeClass('show-edit-layer');
                setTimeout(function(){
                    element.parents('.admin-add-layer').remove();
                },300);

                var addLayerBtn = element.parents('.create-layer').children('.admin-add-layer-btn').html(this.options.instance.getLocalization('admin').addLayer);
            }
        },

        /**
         * Remove layer
         *
         * @method removeLayer
         */
        removeLayer: function(e) {
            var me = this;
            var element = jQuery(e.currentTarget);
            var addLayerDiv = element.parents('.admin-add-layer');
            var id = element.parents('.admin-add-layer').attr('data-id');
            var baseUrl =  me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "action_route=DeleteLayer",
                idKey = "&layer_id=";

            // create url for action_route
            var url = baseUrl + action_route + idKey + id;
            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : url,
                success : function(resp) {
                    if(resp == null) {
                        //close this
                        if(addLayerDiv.hasClass('show-edit-layer')) {
                            addLayerDiv.removeClass('show-edit-layer');
                            setTimeout(function(){
                                // bubble this action to the View
                                // = outside of backbone implementation
                                element.trigger({
                                    type: "adminAction",
                                    command: 'removeLayer',
                                    modelId: me.model.getId()
                                });
                                addLayerDiv.remove();
                            },300);

                        }

                    } else {
                        //problem
                        //console.log('Removing layer did not work.')
                    }
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert(' Removing layer did not work. ');
                    }
                }
            });


        },
        /**
         * Add layer
         *
         * @method addLayer
         */
        addLayer: function(e) {
            var me = this;
            var element = jQuery(e.currentTarget),
                accordion = element.parents('.accordion'),
                lcId = accordion.attr('lcid'),
                form = element.parents('.admin-add-layer');

            var baseUrl =  me.instance.getSandbox().getAjaxUrl(),
                action_route = "action_route=SaveLayer",
                id = "&layer_id=";
            var idValue = (form.attr('data-id') != null) ? form.attr('data-id') : '';

            var data = {};

            // add layer type and version
            var wmsVersion = form.find('#add-layer-wms-type').val();
            wmsVersion = (wmsVersion != "") ? wmsVersion : form.find('#add-layer-wms-type > option').first().val();
            if(wmsVersion.indexOf('WMS') >= 0) {
                var parts = wmsVersion.split(' ');
                data.layerType  = 'wmslayer';
                data.version    = parts[1];
            }

            data.names = [];
            data.desc = [];
            data.orderNumber    = 1,
            data.names.fi       = form.find('#add-layer-fi-name').val(),
            data.names.sv       = form.find('#add-layer-sv-name').val(),
            data.names.en       = form.find('#add-layer-en-name').val(),
            data.desc.fi        = form.find('#add-layer-fi-title').val(),
            data.desc.sv        = form.find('#add-layer-sv-title').val(),
            data.desc.en        = form.find('#add-layer-en-title').val(),

            data.wmsName        = form.find('#add-layer-wms-id').val(),
            data.wmsUrl         = form.find('#add-layer-wms-url').val(),

            data.opacity        = form.find('#opacity-slider').val(),

            data.style          = form.find('#add-layer-style').val(),
            data.style          = me.classes.encode64(data.style);//me.layerGroupingModel.encode64(data.style);

            data.minScale       = form.find('#add-layer-minscale').val(),
            data.maxScale       = form.find('#add-layer-maxscale').val(),

            //data.descriptionLink = form.find('#add-layer-').val(),
            data.legendImage    = form.find('#add-layer-legendImage').val(),
            data.inspireTheme   = form.find('#add-layer-inspire-theme').val(),
            data.dataUrl        = form.find('#add-layer-datauuid').val(),
            data.metadataUrl    = form.find('#add-layer-metadataid').val();
            data.xslt           = form.find('#add-layer-xslt').val(),
            data.xslt           = me.classes.encode64(data.xslt);//me.layerGroupingModel.encode64(data.xslt);
            data.gfiType        = form.find('#add-layer-responsetype').val();
			
			

            // id of layer class
            var url = baseUrl + action_route + id + idValue;
            if(lcId != null) {
                url += "&lcId=" + lcId;
            }
            url += "&nameFi=" + data.names.fi +
                "&nameSv=" + data.names.sv +
                "&nameEn=" + data.names.en +
                "&titleFi=" + data.desc.fi +
                "&titleSv=" + data.desc.sv +
                "&titleEn=" + data.desc.en +
                "&wmsName=" + data.wmsName +
                "&wmsUrl=" + data.wmsUrl +
                "&opacity=" + data.opacity +
                "&style=" + data.style +
                "&minScale=" + data.minScale +
                "&maxScale=" + data.maxScale +
                "&orderNumber=" + data.orderNumber +
                "&layerType=" + data.layerType +
                "&version=" + data.version +
                "&legendImage=" + data.legendImage +
                "&inspireTheme=" + data.inspireTheme +
                "&dataUrl=" + data.dataUrl +
                "&xslt=" + data.xslt +
                "&gfiType=" + data.gfiType +
				"&metadataUrl=" + data.metadataUrl;

            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : url,
                success : function(resp) {
                    if((idValue != null && resp == null)  || 
                        (resp != null && resp.admin != null)) {
                        //close this
                        form.removeClass('show-add-layer');
                        var createLayer = form.parents('.create-layer');
                        if(createLayer != null) {
                            createLayer.find('.admin-add-layer-btn').html(me.instance.getLocalization('admin').addLayer);
                        }
                        setTimeout(function(){
                            form.remove();
                            resp.admin.style = me.classes.encode64(resp.admin.style);
                            if(me.model == null) {
                                //trigger event to View.js so that it can act accordingly
                                accordion.trigger({
                                    type: "adminAction",
                                    command: 'addLayer',
                                    layerData: resp
                                });
                            } else {
                                //trigger event to View.js so that it can act accordingly
                                accordion.trigger({
                                    type: "adminAction",
                                    command: 'editLayer',
                                    layerData: resp
                                });
                            }
                        },300);

                    } else {
                        //problem
                        alert("Saving layer didn't work");
                    }
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert("Saving layer didn't work");
                    }
                }
            });
        },
        /**
         * Fetch capabilities. AJAX call to get capabilities for given capability url
         * 
         * @method fetchCapabilities
         */
        fetchCapabilities: function(e){
            var me = this;
            var element = jQuery(e.currentTarget);
            var input = element.parents('.add-layer-wrapper').find('#add-layer-interface');
            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                route = "action_route=GetWSCapabilities",
                type = "&wmsurl=";
            //add-layer-wms-button

            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url : baseUrl + route + type + encodeURIComponent(input.val()),
                success : function(resp) {
                    me.addCapabilitySelect(resp, me, element);
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert(' false ');
                    }
                }
            });


        },
        /**
         * Add capabilities as a drop down list if AJAX call returned any
         * 
         * @method addCapabilitySelect
         */
        addCapabilitySelect: function(capability, me, element) {
            me.capabilities = this.getValue(capability);
            // if returned data does not contain capability section '
            // there is nothing to be added
            if(me.capabilities == null || me.capabilities.Capability == null) {
//                console.log("Could not find Capability from response");
                return;
            }

            // This might be more elegant as its own template
            var select = '<select id="admin-select-capability">';
            var layers = this.getValue(this.capabilities, 'Capability').Layer.Layer;
            for (var i = layers.length - 1; i >= 0; i--) {
                select += '<option value="'+i+'">' + layers[i].Title + '</option>';
            };
            select += '</select>';

            // if there was a drop down list already, remove it and add a new one
            element.parent().find('#admin-select-capability').remove();
            element.parent().append(select);
            element.parent().find('#admin-select-capability').on('change', me.readCapabilities);

        },
        /**
         * Read capabilities. When user has selected a capability from drop down list
         * we need to read the values to the fields
         * 
         * @method readCapabilities
         */
        readCapabilities: function(e){
            var selected = jQuery('#admin-select-capability').val();
            var capability = this.getValue(this.capabilities, 'Capability');
            var selectedLayer = capability.Layer.Layer[selected];

            // wmsname
            var wmsname = selectedLayer.Name;
            jQuery('#add-layer-wms-id').val(wmsname);


            var styles = selectedLayer.Style;
            if(styles != null) {

                //LegendURL
                if(styles.LegendURL) {
                    var legendURL = styles.LegendURL.OnlineResource['xlink:href'];
                    jQuery('#add-layer-legendImage').val(legendURL);                    
                }

                //Styles
                var styleSelect = jQuery('#add-layer-style');
                if(Object.prototype.toString.call(styles) === '[object Array]') {
                    var s = [];
                    for (var i = 0; i < styles.length; i++) {
                        styleSelect.append('<option>' +styles[i].Title + '</option>');
                    };
                } else {
                    styleSelect.append('<option>' +styles.Title + '</option>');
                }
            }

            // GFI Type
            var gfiType = capability.Request.GetFeatureInfo.Format;
            var gfiTypeSelect = jQuery('#add-layer-responsetype');
            for (var i = 0; i < gfiType.length; i++) {
                gfiTypeSelect.append('<option>' + gfiType[i] + '</option>');
            };

            // WMS Metadata Id
            if(capability['inspire_vs:ExtendedCapabilities'] && 
                capability['inspire_vs:ExtendedCapabilities']['inspire_common:MetadataUrl'] &&
                capability['inspire_vs:ExtendedCapabilities']['inspire_common:MetadataUrl']['inspire_common:URL'].indexOf != null
                ) {
                var wmsMetadataId = capability['inspire_vs:ExtendedCapabilities']['inspire_common:MetadataUrl']['inspire_common:URL'];
                wmsMetadataId = wmsMetadataId.substring(wmsMetadataId.indexOf('id=') + 3);
                if( wmsMetadataId.indexOf('&') >= 0) {
                    wmsMetadataId = wmsMetadataId.substring (0, wmsMetadataId.indexOf('&'));
                }
                jQuery('#add-layer-metadataid').val(wmsMetadataId.trim());
            }

            //metadata id == uuid
            //"http://www.paikkatietohakemisto.fi/geonetwork/srv/en/main.home?uuid=a22ec97f-d418-4957-9b9d-e8b4d2ec3eac"
            var uuid = this.capabilities.Service.OnlineResource['xlink:href'];
            if(uuid) {
                var idx = uuid.indexOf('uuid=');
                if(idx >= 0) {
                    uuid = uuid.substring(idx + 5);
                    if( uuid.indexOf('&') >= 0) {
                        uuid = uuid.substring(0, uuid.indexOf('&'));
                    }                    
                    jQuery('#add-layer-datauuid').val(uuid);
                }
            }

        },
        /**
         * Helper function. This returns inner value 
         * first one or the one which matches with given key
         * 
         * @method getValue
         */
        getValue: function(object, key) {
            for (var k in object){
                if(key != null) {
                    return object[key];
                } else {
                    return object[k];
                }
            }
        },
        clearInput: function(e) {
            var me = this;
            var element = jQuery(e.currentTarget);
            var input = element.parent().children(':input');
            if(input.length == 1) {
                input.val('');
            }
        },

        /**
         * Stops propagation if admin clicks layer settings section.
         *
         * @method addLayer
         */
        clickLayerSettings: function(e) {
            e.stopPropagation();
        }
    });
});
