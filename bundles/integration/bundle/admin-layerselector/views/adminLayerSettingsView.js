define([
    'text!_bundle/templates/adminLayerSettingsTemplate.html'
    ], 
    function(LayerSettingsTemplate) {
    return Backbone.View.extend({
//<div class="admin-add-layer" data-id="<% if(model != null && model.getId()) { %><%= model.getId() %><% } %>">

        tagName: 'div',
        className: 'admin-add-layer',

        events: {
            "click .admin-add-layer-ok"     : "addLayer",
            "click .admin-add-layer-cancel" : "hideLayerSettings",
            "click .admin-remove-layer"     : "removeLayer",
            "click .show-edit-layer"        : "clickLayerSettings"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
            this.instance           = this.options.instance;
            this.model              = this.options.model;
            this.classes            = this.options.classes;
            this.template           = _.template(LayerSettingsTemplate);
            this.render();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            if(this.model != null && this.model.getId()) { 
                this.$el.attr('data-id', this.model.getId());
            }
            this.$el.html(this.template({
                model: this.model, 
                instance : this.options.instance,
                classNames : this.classes.getGroupTitles()
            }));
            if(!this.$el.hasClass('show-edit-layer')) {
                if(this.model != null && 
                    this.model.admin.style_decoded == null && 
                    this.model.admin.style != null) {

                    var styles = [];
                    styles.push(this.options.layerTabModel.decode64(this.model.admin.style));
                    this.model.admin.style_decoded = styles;
                }
                var settings = this.template({
                    model: this.model, 
                    instance : this.options.instance,
                    classNames : this.classes.getGroupTitles()
                });
                this.$el.html(settings);

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

        removeLayer: function(e) {
            var me = this;
            var element = jQuery(e.currentTarget);
            var addLayerDiv = element.parents('.admin-add-layer');
            var id = element.parents('.admin-add-layer').attr('data-id');
            var baseUrl =  me.options.instance.getSandbox().getAjaxUrl(),
                action_route = "action_route=DeleteLayer",
                idKey = "&layer_id=";

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
                        console.log('Removing layer did not work.')
                    }
                },
                error : function(jqXHR, textStatus) {
                    if(callbackFailure && jqXHR.status != 0) {
                        alert(' false ');
                    }
                }
            });


        },
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

            var wmsVersion = form.find('#add-layer-type').val();
            wmsVersion = (wmsVersion != "") ? wmsVersion : form.find('#add-layer-type > option').first().val();
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
            data.wmsUrl         = form.find('#add-layer-interface').val(),

            data.opacity        = form.find('#opacity-slider').val(),

            //TODO encode base64 in case!!
            data.style          = form.find('#add-layer-style').val(),
            data.style           = me.classes.encode64(data.style);//me.layerGroupingModel.encode64(data.style);

            data.minScale       = form.find('#add-layer-minscale').val(),
            data.maxScale       = form.find('#add-layer-maxscale').val(),

            //data.descriptionLink = form.find('#add-layer-').val(),
            data.legendImage    = form.find('#add-layer-legendImage').val(),
            data.inspireTheme   = form.find('#add-layer-inspire-theme').val(),
            data.dataUrl        = form.find('#add-layer-datauuid').val(),
            //data.metadataUrl    = form.find('#add-layer-?').val(),
            data.xslt           = form.find('#add-layer-xslt').val(),
            data.xslt           = me.classes.encode64(data.xslt);//me.layerGroupingModel.encode64(data.xslt);
            data.gfiType       = form.find('#add-layer-responsetype').val();

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
//            "&=" + data.metadataUrl +
            "&xslt=" + data.xslt +
            "&gfiType=" + data.gfiType;

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
                    if((idValue != null && resp == null)  || (resp != null && resp.admin != null)) {
                        //close this
                        form.removeClass('show-add-layer');
                        var createLayer = form.parents('.create-layer');
                        if(createLayer != null) {
                            createLayer.find('.admin-add-layer-btn').html('Lisää taso');
                        }
                        setTimeout(function(){
                            form.remove();
                            if(me.model == null) {
                                accordion.trigger({
                                    type: "adminAction",
                                    command: 'addLayer',
                                    layerData: resp
                                });
                            } else {
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

/*
        ml.setLayerClassId(new Integer(request.getParameter("lcId")));
        ml.setNameFi(request.getParameter("nameFi"));
        ml.setNameSv(request.getParameter("nameSv"));
        ml.setNameEn(request.getParameter("nameEn"));

        ml.setTitleFi(request.getParameter("titleFi"));
        ml.setTitleSv(request.getParameter("titleSv"));
        ml.setTitleEn(request.getParameter("titleEn"));

        ml.setWmsName(request.getParameter("wmsName"));
        ml.setWmsUrl(request.getParameter("wmsUrl"));

        String opacity = "0";
        if (request.getParameter("opacity") != null
                && !"".equals(request.getParameter("opacity"))) {
            opacity = request.getParameter("opacity");
        }

        ml.setOpacity(new Integer(opacity));

        String style = "";
        if (request.getParameter("style") != null
                && !"".equals(request.getParameter("style"))) {
            style = request.getParameter("style");
            style = IOHelper.decode64(style);
        }
        ml.setStyle(style);
        ml.setMinScale(new Double(request.getParameter("minScale")));
        ml.setMaxScale(new Double(request.getParameter("maxScale")));

        ml.setDescriptionLink(request.getParameter("descriptionLink"));
        ml.setLegendImage(request.getParameter("legendImage"));

        String inspireThemeId = request.getParameter("inspireTheme");
        Integer inspireThemeInteger = Integer.valueOf(inspireThemeId);
        ml.setInspireThemeId(inspireThemeInteger);

        ml.setDataUrl(request.getParameter("dataUrl"));
        ml.setMetadataUrl(request.getParameter("metadataUrl"));
        ml.setOrdernumber(new Integer(request.getParameter("orderNumber")));

        ml.setType(request.getParameter("layerType"));
        ml.setTileMatrixSetId(request.getParameter("tileMatrixSetId"));

        ml.setTileMatrixSetData(request.getParameter("tileMatrixSetData"));

        ml.setWms_dcp_http(request.getParameter("wms_dcp_http"));
        ml
                .setWms_parameter_layers(request
                        .getParameter("wms_parameter_layers"));
        ml.setResource_url_scheme(request.getParameter("resource_url_scheme"));
        ml.setResource_url_scheme_pattern(request
                .getParameter("resource_url_scheme_pattern"));
        ml.setResource_url_scheme_pattern(request
                .getParameter("resource_url_client_pattern"));

        if (request.getParameter("resource_daily_max_per_ip") != null) {
            ml.setResource_daily_max_per_ip(ConversionHelper.getInt(request
                    .getParameter("resource_daily_max_per_ip"), 0));
        }
        String xslt = "";
        if (request.getParameter("xslt") != null
                && !"".equals(request.getParameter("xslt"))) {
            xslt = request.getParameter("xslt");
            xslt = IOHelper.decode64(xslt);
        }
        ml.setXslt(request.getParameter("xslt"));
        ml.setGfiType(request.getParameter("gfiType"));
        String sel_style = "";
        if (request.getParameter("selection_style") != null
                && !"".equals(request.getParameter("selection_style"))) {
            sel_style = request.getParameter("selection_style");
            sel_style = IOHelper.decode64(sel_style);
        }
        ml.setSelection_style(sel_style);
        ml.setVersion(request.getParameter("version"));
        if (request.getParameter("epsg") != null) {
            ml.setEpsg(ConversionHelper.getInt(request.getParameter("epsg"),3067));
        }


*/

        },

        clickLayerSettings: function(e) {
            e.stopPropagation();
        }
    });
});
