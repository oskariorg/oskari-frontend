define([
    'text!_bundle/templates/adminTypeSelectTemplate.html',
    'text!_bundle/templates/adminLayerSettingsTemplate.html',
    'text!_bundle/templates/adminGroupSettingsTemplate.html',
    'text!_bundle/templates/group/subLayerTemplate.html'
    ], 
    function(
        TypeSelectTemplate,
        LayerSettingsTemplate,
        GroupSettingsTemplate,
        SubLayerTemplate
        ) {
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
            "click .admin-add-layer-ok"         : "addLayer",
            "click .admin-add-sublayer-ok"      : "addLayer",
            "click .admin-add-layer-cancel"     : "hideLayerSettings",
            "click .admin-add-sublayer-cancel"  : "hideSubLayerSettings",
            "click .admin-remove-layer"         : "removeLayer",
            "click .admin-remove-sublayer"      : "removeLayer",
            "click .show-edit-layer"            : "clickLayerSettings",
            "click #add-layer-wms-button"       : "fetchCapabilities",
            "click .icon-close"                 : "clearInput",
            "change #add-layer-type"            : "createLayerSelect",
            "click .admin-add-group-ok"         : "saveGroup",
            "click .admin-add-group-cancel"     : "hideLayerSettings",
            "click .admin-remove-group"         : "removeGroup"
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
            this.typeSelectTemplate = _.template(TypeSelectTemplate);
            this.layerTemplate      = _.template(LayerSettingsTemplate);
            this.groupTemplate      = _.template(GroupSettingsTemplate);
            this.subLayerTemplate   = _.template(SubLayerTemplate);
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
            if (this.model != null && this.model.getId()) { 
                this.$el.attr('data-id', this.model.getId());
            }

            // When creating a new sublayer, its type is 'wmslayer'
            // so no need to show the type select form.
            if (this.options.baseLayerId) {
                this.createLayerForm();
                return;
            }
            // if editing an existing layer
            if (this.model) {
                if (!this.model.admin) {
                    this.model.admin = {};
                }

                if (this.model.isBaseLayer()) {
                    this.createGroupForm('baseName');
                } else if (this.model.isGroupLayer()) {
                    this.createGroupForm('groupName');
                } else {
                    this.createLayerForm();
                }
            }
            // otherwise create a new layer
            else {
                // add html template
                this.$el.html(this.typeSelectTemplate({
                    model: this.model, 
                    instance : this.options.instance,
                    classNames : this.classes.getGroupTitles()
                }));
            }
        },

        /**
         * Creates the selection to create either base, group or normal layer.
         *
         * @method createLayerSelect
         */
        createLayerSelect: function(e) {
            jQuery('.add-layer-wrapper').remove();
            jQuery('.admin-add-group').remove();

            // Create a normal layer
            if (e.currentTarget.value === 'wmslayer') {
                this.createLayerForm(e);
            }
            // Create a base or a group layer
            else if (e.currentTarget.value === 'base' || e.currentTarget.value === 'groupMap') {
                var groupTitle = (e.currentTarget.value === 'base' ? 'baseName' : 'groupName');

                this.createGroupForm(groupTitle, e);
            }
        },

        createLayerForm: function(e) {
            this.$el.append(this.layerTemplate({
                model: this.model,
                instance : this.options.instance,
                classNames : this.classes.getGroupTitles(),
                isSubLayer : this.options.baseLayerId
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

        createGroupForm: function(groupTitle, e) {
            var subLayers = ( this.model ? this.model.getSubLayers() : [] );

            this.$el.append(this.groupTemplate({
                model: this.model, 
                instance : this.options.instance,
                groupTitle : groupTitle,
                subLayers : subLayers,
                subLayerTemplate : this.subLayerTemplate
            }));
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
                element.parents('.admin-add-layer').remove();

                var addLayerBtn = element.parents('.create-layer').children('.admin-add-layer-btn').html(this.options.instance.getLocalization('admin').addLayer);
            }
        },

        /**
         * Hide sublayer settings
         *
         * @method hideSubLayerSettings
         */
        hideSubLayerSettings : function(e) {
            e.stopPropagation();
            var element = jQuery(e.currentTarget);
            element.parents('.add-sublayer-wrapper').first().removeClass('show-edit-sublayer');
            element.parents('.add-sublayer-wrapper').first().find('.admin-add-layer').remove();
        },

        /**
         * Remove layer
         *
         * @method removeLayer
         */
        removeLayer: function(e) {
            e.stopPropagation();
            
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
                            // bubble this action to the View
                            // = outside of backbone implementation
                            element.trigger({
                                type: "adminAction",
                                command: 'removeLayer',
                                modelId: me.model.getId(),
                                baseLayerId: me.options.baseLayerId
                            });
                            addLayerDiv.remove();

                        }

                    } else {
                        //problem
                        //console.log('Removing layer did not work.')
                    }
                },
                error : function(jqXHR, textStatus) {
                    if(jqXHR.status != 0) {
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
            e.stopPropagation();

            var me = this;
            var element = jQuery(e.currentTarget),
                accordion = element.parents('.accordion'),
                lcId = accordion.attr('lcid'),
                form = element.parents('.admin-add-layer');

            // If this is a sublayer the layer class id should be of its base layer's
            if (this.options.baseLayerId) {
                lcId = this.options.baseLayerId;
            }

            var baseUrl =  me.instance.getSandbox().getAjaxUrl(),
                action_route = "action_route=SaveLayer",
                id = "&layer_id=";
            var idValue = (form.attr('data-id') != null) ? form.attr('data-id') : '';

            var data = {};

            // add layer type and version
            var wmsVersion = form.find('#add-layer-interface-version').val();
            wmsVersion = (wmsVersion != "") ? wmsVersion : form.find('#add-layer-interface-version > option').first().val();

            if(wmsVersion.indexOf('WMS') >= 0) {
                var parts = wmsVersion.split(' ');
                data.version    = parts[1];
            }

            // base and group are always of type wmslayer
            data.layerType = 'wmslayer';

            data.names = {};
            data.title = {};
            data.orderNumber    = 1,
            data.layer_id       = idValue;
            data.names.fi       = form.find('#add-layer-fi-name').val(),
            data.names.sv       = form.find('#add-layer-sv-name').val(),
            data.names.en       = form.find('#add-layer-en-name').val(),
            data.title.fi        = form.find('#add-layer-fi-title').val(),
            data.title.sv        = form.find('#add-layer-sv-title').val(),
            data.title.en        = form.find('#add-layer-en-title').val(),

            // type can be either wmslayer, base or groupMap
            data.type           = form.find('#add-layer-type').val() || 'wmslayer',
            data.wmsName        = form.find('#add-layer-wms-id').val(),
            data.wmsUrl         = form.find('#add-layer-wms-url').val(),

            data.opacity        = form.find('#opacity-slider').val(),

            data.style          = form.find('#add-layer-style').val(),
            data.style          = me.classes.encode64(data.style);//me.layerGroupingModel.encode64(data.style);

            data.minScale       = form.find('#add-layer-minscale').val() || 16000000,
            data.maxScale       = form.find('#add-layer-maxscale').val() || 1,
            data.epsg           = form.find('#add-layer-srsname').val(),
            data.epsg           = Number(data.epsg.replace('EPSG:', '')),

            //data.descriptionLink = form.find('#add-layer-').val(),
            data.legendImage    = form.find('#add-layer-legendImage').val(),
            data.inspireTheme   = form.find('#add-layer-inspire-theme').val(),
            data.dataUrl        = form.find('#add-layer-datauuid').val(),
            data.metadataUrl    = form.find('#add-layer-metadataid').val();
            data.xslt           = form.find('#add-layer-xslt').val(),
            data.xslt           = me.classes.encode64(data.xslt);//me.layerGroupingModel.encode64(data.xslt);
            data.gfiType        = form.find('#add-layer-responsetype').val();
            // Layer class id aka. orgName id
            data.lcId           = lcId;

            var url = baseUrl + action_route + id + idValue;
            if(lcId != null) {
                url += "&lcId=" + lcId;
            }
            url += "&nameFi=" + data.names.fi +
                "&nameSv=" + data.names.sv +
                "&nameEn=" + data.names.en +
                "&titleFi=" + data.title.fi +
                "&titleSv=" + data.title.sv +
                "&titleEn=" + data.title.en +
                "&type=" + data.type +
                "&wmsName=" + data.wmsName +
                "&wmsUrl=" + encodeURIComponent(data.wmsUrl) +
                "&opacity=" + data.opacity +
                "&style=" + data.style +
                "&minScale=" + data.minScale +
                "&maxScale=" + data.maxScale +
                "&epsg=" + data.epsg +
                "&orderNumber=" + data.orderNumber +
                "&layerType=" + data.layerType +
                "&version=" + data.version +
                "&legendImage=" + encodeURIComponent(data.legendImage) +
                "&inspireTheme=" + data.inspireTheme +
                "&dataUrl=" + encodeURIComponent(data.dataUrl) +
                "&xslt=" + data.xslt +
                "&gfiType=" + data.gfiType +
				"&metadataUrl=" + encodeURIComponent(data.metadataUrl);

            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                //data: {'layer': postData}, // New way
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
                        form.remove();
                        resp.admin.style = me.classes.encode64(resp.admin.style);
                        if(me.model == null) {
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: "adminAction",
                                command: 'addLayer',
                                layerData: resp,
                                baseLayerId: me.options.baseLayerId
                            });
                        } else {
                            //trigger event to View.js so that it can act accordingly
                            accordion.trigger({
                                type: "adminAction",
                                command: 'editLayer',
                                layerData: resp,
                                baseLayerId: me.options.baseLayerId
                            });
                        }

                    } else {
                        //problem
                        alert("Saving layer didn't work");
                    }
                },
                error : function(jqXHR, textStatus) {
                    if(jqXHR.status != 0) {
                        alert("Saving layer didn't work");
                    }
                }
            });
        },

        /**
         * Save group or base layers
         * 
         * @method saveGroup
         */
        saveGroup: function(e) {
            var me = this,
                element = jQuery(e.currentTarget),
                addClass = element.parents('.admin-add-group'),
                layerClass = element.parents('.admin-add-layer').attr('data-id'),
                accordion = element.parents('.accordion');

            // url for backend action_route
            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "&action_route=SaveOrganization",
                layerType = element.parents('.admin-add-layer').find('#add-layer-type').val(),
                parentId = element.parents('.accordion').attr('lcid');

            var params = "&parent_id=" + parentId +
                "&sub_name_fi=" + addClass.find("#add-group-fi-name").val() +
                "&sub_name_sv=" + addClass.find("#add-group-sv-name").val() +
                "&sub_name_en=" + addClass.find("#add-group-en-name").val();

            if (layerType === 'groupMap' || ( me.model && me.model.isGroupLayer() )) {
                params += "&group_map=" + true;
            }

            if (layerClass) {
                params += "&layerclass_id=" + layerClass.replace('base_', '');
            }

            var url = baseUrl + action_route + params;
            // make AJAX call
            jQuery.ajax({
                type : "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                    jQuery("body").css({cursor: "wait"});
                },
                url : url,
                success : function(resp) {
                    // Load the map layers again, since we want the newly created
                    // group/base layer to show as a map layer, not as a layer class.
                    if (me.model == null) {
                        accordion.trigger({
                            type: "adminAction",
                            command: 'addGroup'
                        });
                    } else {
                        accordion.trigger({
                            type: "adminAction",
                            command: 'editGroup',
                            id: me.model.getId()
                        });
                    }
                },
                error : function(jqXHR, textStatus) {
                    alert(' false ');
                }
            });
        },

        removeGroup: function(e) {
            var me = this,
                element = jQuery(e.currentTarget),
                editForm = element.parents('.admin-add-layer').attr('data-id'),
                accordion = element.parents('.accordion');

            // url for backend action_route
            var baseUrl = me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "&action_route=DeleteOrganization",
                layerClassId = editForm.replace('base_', ''),
                params = "&layercl_id=" + layerClassId;

            var url = baseUrl + action_route + params;
            // make AJAX call
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
                    accordion.trigger({
                        type: "adminAction",
                        command: 'deleteGroup',
                        id: me.model.getId()
                    });
                },
                error : function(jqXHR, textStatus) {
                    alert(' false ');
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
                    if(jqXHR.status != 0) {
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
            // if returned data does not contain capability section
            // there is nothing to be added
            if(me.capabilities == null || me.capabilities.Capability == null) {
                return;
            }

            // This might be more elegant as its own template
            var select = '<select id="admin-select-capability">';
            select += '<option value="" selected="selected">' + this.options.instance.getLocalization('admin').selectLayer + '</option>';
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
        readCapabilities: function(e) {
            var me = this;
            var selected = jQuery('#admin-select-capability').val();
            // If no value (eg. the placeholder option was selected) remove the
            // sublayer select and return.
            if (!selected) {
                jQuery('#admin-select-sublayer').remove();
                return;
            }
            var capability = this.getValue(this.capabilities, 'Capability');
            var selectedLayer = capability.Layer.Layer[selected];

            if (selectedLayer.Layer) {
                // If the selected layer has sub-layers create a dropdown to show them.

                // This might be more elegant as its own template
                var subLayerSelect = '<select id="admin-select-sublayer">';
                subLayerSelect += '<option value="" selected="selected">' + this.options.instance.getLocalization('admin').selectSubLayer + '</option>';
                var subLayers = selectedLayer.Layer;
                for (var i = subLayers.length - 1; i >= 0; i--) {
                    subLayerSelect += '<option value="'+i+'">' + subLayers[i].Title + '</option>';
                };
                subLayerSelect += '</select>';
                jQuery('#admin-select-sublayer').remove();
                jQuery(subLayerSelect).insertAfter('#admin-select-capability');
                jQuery('#admin-select-sublayer').on('change', function() {
                    var value = jQuery(this).val();
                    if (value) {
                        me.updateLayerValues(subLayers[value], capability);
                    }
                });
            }

            // update values for the parent layer.
            me.updateLayerValues(selectedLayer, capability);
        },

        /**
         * Updates the values of the create layer form
         *
         * @method updateLayerValues
         * @param {Object} selectedLayer
         * @param {Object} capability
         */
        updateLayerValues: function(selectedLayer, capability) {
            // Clear out the old values
            this.clearAllFields();
            //title
            jQuery('#add-layer-fi-name').val(selectedLayer.Title);

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

            // Scale denominators
            var minScale = selectedLayer.MaxScaleDenominator,
                maxScale = selectedLayer.MinScaleDenominator;
            if (maxScale && minScale) {
                jQuery('#add-layer-minscale').val(minScale);
                jQuery('#add-layer-maxscale').val(maxScale);
            }

            // SRS name
            var srsName = selectedLayer.CRS;
            if (srsName) {
                jQuery('#add-layer-srsname').val(srsName);
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

            // WMS url
            var getMapRequest = capability.Request.GetMap;
            if (getMapRequest) {
                var wmsUrl = getMapRequest.DCPType.HTTP.Get.OnlineResource['xlink:href'];
                jQuery('#add-layer-wms-url').val(wmsUrl);
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
         * Clears all the fields of the create layer form.
         *
         * @method clearAllFields
         */
        clearAllFields: function() {
            var form = jQuery('.create-layer');
            // Clear all the inputs and textareas.
            form.find('input').val('');
            form.find('textarea').val('');
            // Empty the GFI response type select
            jQuery('#add-layer-responsetype').empty();
            // Empty the layer style select
            jQuery('#add-layer-style').empty();

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
