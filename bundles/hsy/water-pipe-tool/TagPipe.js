/**
 * @class Oskari.hsy.bundle.waterPipeTool.TagPipe
 *
 * Renders the "waterPipeTool" flyout.
 *
 */
Oskari.clazz.define(
    'Oskari.hsy.bundle.waterPipeTool.TagPipe',
    function (localization, parent) {
        this.instance = parent;
        this.sandbox = parent.getSandbox();
        this._localization = localization;
        this.templates = {};
        this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        this.setTitle(localization.title);
        this.setContent(this.createUi());
        this.highlightVectorLayer = null;
        this.mustacheVectorLayer = null;
        this.state = {
            tagPipeClickLonLat: null,
            tagPipeActive: false,
            mustacheActive: false,
            mustacheType: null,
            calculateTagTypes: ['jatevesi','hulevesi','sekaviemari'],
            allTagTypes: ['vesi_putki','maapaloposti','seinapaloposti','sprinkleri','jatevesi_putki','jatevesi_kaivo','hulevesi_putki','hulevesi_kaivo','sekaviemari_putki','sekaviemari_kaivo','muu_liitynta'],
            vesi_putki: ['tagtype','tag-address','tag-pipe-size','tag-low-pressure-level','tag-max-pressure-level'],
            maapaloposti: ['tagtype','tag-address','tag-pipe-size','tag-low-pressure-level','tag-max-pressure-level'],
            seinapaloposti: ['tagtype','tag-address','tag-pipe-size','tag-low-pressure-level','tag-max-pressure-level'],
            sprinkleri: ['tagtype','tag-address','tag-pipe-size','tag-max-water-take','tag-min-pressure-level'],
            jatevesi_putki: ['tagtype','tag-address','tag-pipe-size','tag-bottom-height','tag-low-tag-height','tag-barrage-height'],
            jatevesi_kaivo: ['tagtype','tag-address','tag-pipe-size','tag-bottom-height','tag-low-tag-height','tag-barrage-height'],
            hulevesi_putki: ['tagtype','tag-address','tag-pipe-size','tag-ground-height','tag-bottom-height','tag-low-tag-height','tag-barrage-height'],
            hulevesi_kaivo: ['tagtype','tag-address','tag-pipe-size','tag-ground-height','tag-bottom-height','tag-low-tag-height','tag-barrage-height'],
            sekaviemari_putki: ['tagtype','tag-address','tag-pipe-size','tag-ground-height','tag-bottom-height','tag-low-tag-height','tag-barrage-height'],
            sekaviemari_kaivo: ['tagtype','tag-address','tag-pipe-size','tag-ground-height','tag-bottom-height','tag-low-tag-height','tag-barrage-height'],
            muu_liitynta: ['tagtype','tag-address','tag-other-issue'],
            doNotUseInLabel: ['tag-address','tag-pipe-size','tag-ground-height'],
            onlyNumberInputs: ['tag-pipe-size','tag-bottom-height','tag-low-tag-height','tag-barrage-height','tag-ground-height','tag-low-tag-height','tag-barrage-height']
        };
    },{

        /**
         * @private @method _initTemplates
         *
         *
         */
        _initTemplates: function () {
            var me = this,
                btn,
                i;

            //main wrapper
            me.templates.main = jQuery('<div class="tag-pipe-wrapper"></div>');

            me.templates.formRedirect = jQuery(
                '<div class="tag-pipe-redirect-to-form">' +
                '   <select></select>' +
                '</div>'
            );

            //form body
            me.templates.form = jQuery(
                '<form class="tag-pipe-form" method="" action="">' +
                '<fieldset>' +
                '    <input type="hidden" name="id" />' +
                '       <h4></h4>' +
                '    <div class="tag-pipe-form-inner-wrapper">' +
                '    </div>' +
                '    <fieldset></fieldset>' +
                '</fieldset>' +
                '<fieldset></fieldset>' +
                '</form>'
            );

            //help body
            me.templates.help = jQuery(
                '<div class="tag-pipe-help">' +
                    '<p></p>' +
                '</div>'
            );

            //pipe list body
            me.templates.pipeList = jQuery(
                '<ul class="tag-pipe-list">' +
                '</ul>'
            );

            //pipe list item
            me.templates.pipeListElement = jQuery(
                '<li class="tag-pipe-list-element">' +
                    '<span></span>' +
                    '<a class="tag-pipe-show-onmap" href="#"></a>' +
                    '<a class="tag-pipe-select" href="#"></a>' +
                '</li>'
            );
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
                btn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                );

            me._initTemplates();
            me.container = me.templates.main.clone(true);

            //add tag button
            btn.addClass('add-tag-btn primary');
            btn.setHandler(function (event) {
                me.container.find(".add-tag-btn").hide();
                me.container.find(".cancel-tag-btn").show();
                me.state.tagPipeActive = true;
                me._activateNormalGFI(false);
                me._activateNormalWFSReq(false);
                me._activateTagPipeLayers();

                if(me.highlightVectorLayer === null){
                    me._createHighlightVectorLayer();
                }

                me._manageHelp(true, me._getLocalization('help_start'));
            });

            btn.setTitle(me._getLocalization('add-tag'));
            btn.insertTo(me.container);

            //cancel tag button
            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );

            btn.addClass('cancel-tag-btn primary');
            btn.setHandler(function (event) {
                me.container.find(".cancel-tag-btn").hide();
                me.state.tagPipeActive = false;
                me.container.find(".add-tag-btn").show();
                me.container.find(".tag-pipe-list").remove();
                me._activateNormalGFI(true);
                me._activateNormalWFSReq(true);
                me._clearHighlightVectorLayer();

                me._manageHelp(false);
            });

            btn.setTitle(me._getLocalization('cancel-tag'));
            btn.insertTo(me.container);
            me.container.find(".cancel-tag-btn").hide();

            //add help div
            var help = me.templates.help.clone();
            help.hide();
            me.container.append(help);

            return me.container;
        },

        /**
         * [getStateTagPipe get tools state value]
         * @return {[type]} [description]
         */
        getStateTagPipe: function(){
            var me = this;
            return me.state.tagPipeActive;
        },
        /**
         * [getStateMustache get tools state value]
         * @return {[type]} [description]
         */
        getStateMustache: function(){
            var me = this;
            return me.state.mustacheActive;
        },

        /**
         * [_manageHelp show/hide help dialog and add text]
         * @param  {[boolena]} show [show or hide]
         * @param  {[String]} text [text you want to show]
         */
        _manageHelp: function(show, text){
            var me = this,
            help = jQuery("."+me.templates.help.attr("class").split(' ')[0]);

            if(show){
                help.show();
                help.find("p").text(text);
            }else{
                help.hide();
                help.find("p").text("");
            }
        },

        /**
         * @method _getLocalization
         */
        _getLocalization: function (key) {
            return this._localization[key];
        },
        /**
         * [_getErrorText description]
         * @param  {[type]} jqXHR       [jqXHR]
         * @param  {[type]} textStatus  [textStatus]
         * @param  {[type]} errorThrown [errorThrown]
         * @return {[error]}
         */
        _getErrorText: function (jqXHR, textStatus, errorThrown) {
            var error = errorThrown.message || errorThrown;
            try {
                var err = JSON.parse(jqXHR.responseText).error;
                if (err !== null && err !== undefined) {
                    error = err;
                }
            } catch (e) {

            }
            return error;
        },

        /**
         * @method _deleteTagPipe
         * Gets channel id based on event target and deletes it
         */
/*        _deleteTagPipe: function (event, me) {
            var item = jQuery(event.target).parents('li'),
                uid = parseInt(item.attr('data-id')),
                channel = me._getChannel(uid);

            if (!window.confirm(me._getLocalization('confirm_delete').replace('{channel}', channel.topic[Oskari.getLang()]))) {
                return;
            }

            item.hide();
            jQuery.ajax({
                type: 'DELETE',
                url: me.sandbox.getAjaxUrl() + 'action_route=SearchWFSChannel&id='+ uid,
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
                    //me.fetchChannels(me.container);
                }
            });
        },*/

        /**
         * [_createTagPipeList creates list based on user click to pipes]
         * @param  {[array]} data [features]
         */
        _createTagPipeList: function(data){
            var me = this, 
            list = me.templates.pipeList.clone();

            me.container.find("."+me.templates.pipeList.attr("class")).remove();

            for(var i in data){
                var listEl = me.templates.pipeListElement.clone(),
                listElspan = listEl.find("span"),
                listElaOnMap = listEl.find("a.tag-pipe-show-onmap"),
                listElaSelect = listEl.find("a.tag-pipe-select");

                listElspan.text(data[i].id);
                listElaOnMap.text(me._getLocalization("show_on_map"));
                listElaOnMap.bind("click", {feature: data[i]}, function(e){
                    e.preventDefault();
                    me._showHighlightedPipe(e.data.feature);
                });
                listElaSelect.text(me._getLocalization("select_tag_pipe"));
                listElaSelect.bind("click", {feature: data[i]}, function(e){
                    e.preventDefault();
                    me._openForm(e, me, e.data.feature);
                    me._showHighlightedPipe(e.data.feature);
                });

                list.append(listEl);
            }

            me.container.append(list);
        },

        /**
         * [_showHighlightedPipe highlights certain geometry]
         * @param  {[object]} feature [feature]
         */
        _showHighlightedPipe: function(feature){
            var me = this, 
            _map = me.mapModule.getMap();

            me._clearHighlightVectorLayer();
            var geojson_format = new OpenLayers.Format.GeoJSON();
            var features = geojson_format.read(feature);

            me.highlightVectorLayer.addFeatures(features);
            _map.setLayerIndex(me.highlightVectorLayer, 1000000);
        },

        /**
         * [_initFormRedirectSelect create select options from arrays]
         * @return {[array]} [different tag types]
         */
        _initFormRedirectSelect: function(){
            var me = this,
            output = [];
            output.push('<option value=""></option>');

            jQuery.each(me.state.allTagTypes, function(key, value) {
                output.push('<option value="'+ value +'">'+ me._getLocalization("tagtype-"+value) +'</option>');
            });

            return output.join('');
        },
        /**
         * @method _openForm opens redirect select and from change event form
         * Opens edit/create form depending on event target location
         */
        _openForm: function (event, instance, data) {
            // Semi deep clone
            var me = instance,
                direct = me.templates.formRedirect,
                target = jQuery(event.target);
               
                //update help text
                me._manageHelp(true, me._getLocalization('help_redirect'));

                //remove listing and change mapclick event state
                me.container.find(".tag-pipe-list").remove();
                me.container.find(".cancel-tag-btn").hide();
                me.state.tagPipeActive = false;

                //add redirect select with options to container
                direct.find('select').html(me._initFormRedirectSelect());
                direct.change(function(e){
                    var el = jQuery(this),
                    value = el.find(":selected").val(),
                    form = me.container.find('form');
                    me.state.mustacheActive = false;
                    me._clearMustacheVectorLayer();

                    if(value === ""){
                        me._manageHelp(true, me._getLocalization('help_redirect'));
                        form.remove();
                    }else{
                        me._manageHelp(true, me._getLocalization('help_insert'));
                        form.remove();
                        me.container.append(me._initForm(value));
                    }
                });
                me.container.append(direct);
        },

               /**
         * [_initForm creates form with state params]
         * @param  {[array]} data [feature]
         * @return {[jquery object]}      [html]
         */
        _initForm: function(type){
            var me = this,
            form = me.templates.form.clone(true),
            tagType = type.split("_");
            me.state.mustacheType = type;
            form.attr("type", me.state.mustacheType);

            //add topic for form
            form.find('h4').text(me._getLocalization('tag-pipe-details-header'));

            //loop states and find right form input names
            jQuery.each(me.state[me.state.mustacheType], function(index, item) {

                var elclass = "";
                if(me.state.onlyNumberInputs.indexOf(item) > -1){ elclass = 'allownumericwithdecimal'; }

                me.templates.form.detailinputs = jQuery(
                '    <label>' +
                '        <span></span>' +
                '        <input type="text" tagtype="'+me.state.mustacheType+'" name="'+item+'" class="tag-pipe-details '+elclass+'" language="'+item+'" required="required" />' +
                '    </label>'
                );
                form.find('.tag-pipe-form-inner-wrapper').append(me.templates.form.detailinputs);
            });
            
            //calculate certain values into inputs
            if(me.state.calculateTagTypes.indexOf(tagType[0]) > -1){
                form.find("[name=tag-bottom-height]").blur(function(e){
                    form.find("[name=tag-low-tag-height]").val(me._calculateTagHeight(form, tagType));
                    form.find("[name=tag-barrage-height]").val(me._calculateBarrageHeight(form, tagType));
                });
            }

            //add localization to inputs
            form.find('input,select').each(function (index) {
                var el = jQuery(this);
                el.prev('span').html(me._getLocalization(el.attr('name')));
                if(el.attr("language") != null){
                   el.attr("placeholder", me._getLocalization(el.attr("language")));
                   if(el.attr("name") == "tagtype"){
                        el.val(me._getLocalization("tagtype-"+el.attr("tagtype")));
                   }
                }
            });

            //add buttons to fieldset of form
            var firstFieldset = form.find('fieldset:nth-of-type(1)');
            var innerFieldset = firstFieldset.find('fieldset:nth-of-type(1)');

            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );

            btn.setTitle(me._getLocalization('add_mustache_to_map'));
            btn.addClass("add-mustache-to-map");
            jQuery(btn.getElement()).click(function (e) {
                    var el = jQuery(this);
                    e.preventDefault();

                    if(el.hasClass('active')){
                        el.removeClass("active primary");
                        el.val(me._getLocalization("add_mustache_to_map"));
                        me.state.mustacheActive = false; 
                    }else{
                        if (me._formIsValid(el.parents('form'), me)) {
                            el.addClass("active primary");
                            el.val(me._getLocalization("cancel_mustache_to_map"));
                            me.state.mustacheActive = true;
                        }
                    }
                }
            );
            btn.insertTo(innerFieldset);

            var buttonFieldset = form.find('fieldset:nth-of-type(2)');
            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SaveButton'
            );
            btn.insertTo(buttonFieldset);
/*            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.DeleteButton'
            );
            btn.addClass('delete--tagpipe');
            jQuery(btn.getElement()).click(
                function (event) {
                    me._deleteTagPipe(event, me);
                }
            );
            btn.insertTo(buttonFieldset);*/
            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.CancelButton'
            );
            jQuery(btn.getElement()).click(
                function (event) {
                    me._closeForm(jQuery(event.target).parents('form'));
                    me.state.mustacheActive = false;
                }
            );
            btn.insertTo(buttonFieldset);

            form.find(".allownumericwithdecimal").on("keypress keyup blur",function (event) {
            //this.value = this.value.replace(/[^0-9\.]/g,'');
            jQuery(this).val(jQuery(this).val().replace(/[^0-9\.]/g,''));
                if ((event.which != 46 || jQuery(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });

            me._populateForm(form, null);

            return form;
        },

        /**
         * [_calculateTagHeight calculates tag height from form]
         * @param  {[jquery object]} form [jquery object]
         * @return {[float]}      [calculated value]
         */
        _calculateTagHeight: function(form, tagType){
            var me = this,
            type = tagType[1],
            pipeSizemm = parseInt(form.find("[name=tag-pipe-size]").val()),
            pipeSize = pipeSizemm/1000,
            bottomHeight = parseFloat(form.find("[name=tag-bottom-height]").val());

            if(isNaN(pipeSizemm) || isNaN(bottomHeight)){
                return;
            }

            switch (type) {
                case "kaivo":
                    if(pipeSizemm > 0 && pipeSizemm <= 250){
                        //Pohjan korkeus + 150mm
                        return bottomHeight + (150/1000);
                    }else if(pipeSizemm >= 251 && pipeSizemm <= 350){
                        //Pohjan korkeus + 200 mm
                        return bottomHeight + (200/1000);
                    }else if(pipeSizemm > 350){
                        //Pohjan korkeus + 0,75 * katuviemärin halkaisija
                        return (0.75*pipeSize) + bottomHeight;
                    }
                break;

                case "putki":
                    if(pipeSizemm > 0 && pipeSizemm <= 500){
                        //Pohjan korkeus + 0,5 * katuviemärin halkaisija
                        return (0.5*pipeSize) + bottomHeight;
                    }else if(pipeSizemm > 500){
                        //Pohjan korkeus + 0,75 * katuviemärin halkaisija
                        return (0.75*pipeSize) + bottomHeight;
                    }
                break;
            }
        },
        /**
         * [_calculateBarrageHeight calculates tag height from form]
         * @param  {[jquery object]} form [jquery object]
         * @return {[float]}      [calculated value]
         */
        _calculateBarrageHeight: function(form, tagType){
            var me = this,
            type = tagType[0],
            pipeSizemm = parseInt(form.find("[name=tag-pipe-size]").val()),
            pipeSize = pipeSizemm/1000,
            bottomHeight = parseFloat(form.find("[name=tag-bottom-height]").val()),
            groundHeight = parseFloat(form.find("[name=tag-ground-height]").val());

            switch (type) {
                case "jatevesi":
                    if(isNaN(pipeSizemm) || isNaN(bottomHeight)){
                        return;
                    }else{
                        return bottomHeight + pipeSize + (1000/1000);
                    }
                break;
                case "hulevesi":
                case "sekaviemari":
                    if(isNaN(pipeSizemm) || isNaN(bottomHeight) || isNaN(groundHeight)){
                        return;
                    }else{
                        return groundHeight + (100/1000);
                    }
                break;
            }
        },

        /**
         * @method _closeForm
         * Closes given form and shows the button that opens it
         */
        _closeForm: function (form) {
            var me = this;
            form.parent().find('.add-tag-btn').show();
            me._activateNormalGFI(true);
            me._activateNormalWFSReq(true);
            me._clearHighlightVectorLayer();
            me._manageHelp(false);
            me.state.mustacheType = null;
            if(me.mustacheVectorLayer !== null){
                me.mustacheVectorLayer.destroy();
                me.mustacheVectorLayer = null;
            }

            // destroy form and redirect component
            form.prev('div').remove();
            form.remove();
        },

        /**
         * @method _formIsValid
         * Validates given form. Checks that required fields have values and
         * that password field values match.
         */
        _formIsValid: function (form, me) {
            var errors = [],
                pass;
            // check that required fields have values
            form.find('input[required]').each(function (index) {
                if (!this.value.length) {
                    errors.push(
                        me._getLocalization('field_required').replace(
                            '{fieldName}',
                            me._getLocalization(this.name)
                        )
                    );
                }
            });

            if (errors.length) {
                me._openPopup(
                    me._getLocalization('form_invalid'),
                    jQuery(
                        '<ul>' +
                        errors.map(function (value) {
                            return '<li>' + value + '</li>';
                        }).join('') +
                        '</ul>'
                    )
                );
            }
            return !errors.length;
        },

        /**
         * @method _submitForm
         * Submits event.target's form, updates list if submission is a success.
         */
        _submitForm: function (event, me) {
            event.preventDefault(); // We don't want the form to submit
            var form = jQuery(event.target);

            if (me._formIsValid(form, me)) {

                //FIXME
/*                var url = "";

                var dataObject = {
                    'id': frm.find("[name=id]").val(),
                    'choose-wfs-layer': frm.find("[name=choose-wfs-layer]").val(),
                    'topic' : {},
                    'desc': {},
                    'params' : [],
                    'is-default' : frm.find("[name=details-default]").is(":checked"),
                    'is-address' : frm.find("[name=details-isaddress]").is(":checked")
                };

                jQuery.each(Oskari.getSupportedLanguages(), function(index, item) {
                    dataObject.topic[item] = frm.find("[name=details-topic-"+item+"]").val();
                    dataObject.desc[item] = frm.find("[name=details-desc-"+item+"]").val();
                });

                jQuery.each(frm.find("[name=choose-param-for-search]"), function(index, item) {
                    dataObject.params.push(jQuery(this).val());
                });

                url += "id="+dataObject["id"];
                url += "&wfsLayerId="+dataObject["choose-wfs-layer"];
                url += "&desc="+JSON.stringify(dataObject.desc);
                url += "&topic="+JSON.stringify(dataObject.topic);
                url += "&paramsForSearch="+JSON.stringify(dataObject.params);
                url += "&isDefault="+dataObject["is-default"],
                url += "&isAddress="+dataObject["is-address"];*/

                jQuery.ajax({
                    type: frm.attr('method'),
                    url: me.sandbox.getAjaxUrl() + 'action_route=SearchWFSChannel',
                    data: url,
                    success: function (data) {
                        me._closeForm(form);
                        //me.fetchChannels(me.container);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var error = me._getErrorText(
                            jqXHR,
                            textStatus,
                            errorThrown
                        );
                        me._openPopup(
                            me._getLocalization('save_failed'),
                            error
                        );
                    }
                });
           }
            return false;
        },

        /**
         * @method _populateForm
         * Populates given form with given channel's data.
         */
        _populateForm: function (form, tagpipe) {
            var me = this;

            if (tagpipe) {
                /*this._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
                me._progressSpinner.insertTo(jQuery(".tag-pipe-wrapper"));
                me._progressSpinner.start();
                fragment.find("[name=id]").val(channel.id);
                fragment.find("[name=choose-wfs-layer]").val(channel.wfsId).trigger("change");
                fragment.find("[name=details-default]").attr('checked', channel.is_default);
                fragment.find("[name=details-isaddress]").attr('checked', channel.is_address);
                $.each(channel.topic, function(lang, text) {
                    fragment.find("[name=details-topic-"+lang+"]").val(text);
                });
                $.each(channel.desc, function(lang, text) {
                    fragment.find("[name=details-desc-"+lang+"]").val(text);
                });
                var paramsSelect =  fragment.find("[name=choose-param-for-search]");
                $.each(channel.params_for_search, function(index, text) {
                    if(index > 0){
                        fragment.find(".new-params-btn").trigger("click");
                    }
                    //FIXME Dynamic option adding needs it
                    setTimeout(function(){
                        fragment.find("[name=choose-param-for-search]").eq(index).val(text);
                        me._progressSpinner.stop();
                    },600);
                });
               
                fragment.attr('method', 'PUT');*/
            } else {
                form.attr('method', 'POST');
            }

            form.submit(function (event) {
                return me._submitForm(event, me);
            });
            return form;
        },

        /**
         * [croppingLayersHighlight Highlights clicked cropping area/areas]
         * @param  {[string]} x      [Clicked on map X]
         * @param  {[string]} y      [Clicked on map Y]
         * @return {[none]}
         */
        findPipesRequest: function(x, y){

            var me = this,
            layers = me._getTagPipeLayers(),
            mapVO = me.sandbox.getMap(),
            ajaxUrl = me.sandbox.getAjaxUrl(),
            layerName = "",
            layerUrl = "",
            inactiveLayers = [];
            
            //collect layernames and url
            for (var i in layers) {
                layerName += layers[i].getLayerName();
                if(i < layers.length-1){
                    layerName += ",";
                }
                layerUrl = layers[i].getLayerUrl();
                var attributes = layers[i].getAttributes();
                if(typeof attributes.inactive_layers !== 'undefined'){
                    inactiveLayers = inactiveLayers.concat(attributes.inactive_layers);
                }
            }

            //clear all highlight vectors
            me._clearHighlightVectorLayer();

            jQuery.ajax({
                type: "POST",
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetPipesWithParams',
                data : {
                    layers: layerName,
                    url: layerUrl,
                    x : x,
                    y : y,
                    bbox : mapVO.getBboxAsString(),
                    width : mapVO.getWidth(),
                    height : mapVO.getHeight(),
                    srs : mapVO.getSrsName()
                },
                success: function (data) {
                    me._createTagPipeList(me._getActiveTagPipeLayers(data.features,inactiveLayers));
                    if(data.features.length == 0){
                        me._manageHelp(true, me._getLocalization('no_pipes_in_click'));
                        return false;
                    }
                    me._manageHelp(true, me._getLocalization('help_choose'));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);

                    me._openPopup(
                        me._getLocalization('error-in-getfeatureforcropping'),
                        error
                    );
                }
            });
        },
        /**
         * [mustachePointOnMap users click adds point to map and then creates line between this and first clicked point]
         * @param  {[object]} lonlat [openlayers lonlat]
         */
        mustachePointOnMap: function(lonlat){
            var me = this, 
            _map = me.mapModule.getMap(),
            mustacheInfo = me._populateMustacheInfo();

            if(me.mustacheVectorLayer !== null){
                me.mustacheVectorLayer.destroy();
                me.mustacheVectorLayer = null;
            }

            if(me.mustacheVectorLayer === null){
                me._createMustacheVectorLayer(mustacheInfo);
            }

            //me._clearMustacheVectorLayer();

            var points = [ 
                new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat),
                new OpenLayers.Geometry.Point(me.state.tagPipeClickLonLat.lon, me.state.tagPipeClickLonLat.lat)
            ];
            
            var feature = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.LineString(points)
            );

            feature.attributes = mustacheInfo;

             me.mustacheVectorLayer.addFeatures(feature);
            _map.setLayerIndex(me.mustacheVectorLayer, 1000000);

        },

        /**
         * [_populateMustacheInfo gets certain values from form]
         * @return {[object]} [output data]
         */
        _populateMustacheInfo: function(){
            var me = this,
            output = {},
            form = me.container.find("form");

            jQuery.each(me.state[me.state.mustacheType], function(index, item) {
                    output[item] = form.find("input[name='"+item+"']").val();
            });

            return output;
        },

        /**
         * [activateTagPipeLayers: Puts tagpipe layers on]
         */
        _activateTagPipeLayers: function(){
            var me = this;
            var layers = me._getTagPipeLayers();
        
            for (var i in layers) {
                /*console.info(layers[i].getLegendImage());*/
                me._addLayerToMapById(layers[i].getId());
            }
        },

        /**
         * [getTagPipeLayers: Gets layers that has attribute tagpipe: true]
         * @return {[array]} [Layers that has attribute tagpipe: true]
         */
        _getTagPipeLayers: function(){
            var me = this;

            var mapService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var allLayers = mapService.getAllLayers();
            var tagPipeLayers = jQuery.grep(allLayers, function(n) {
            var attributes = n.getAttributes();
              if(attributes.tagpipe){
                return n;
              }
            });

            return tagPipeLayers;
        },
        /**
         * [_getActiveTagPipeLayers gets layers that are wanted for the tag pipe tool]
         * @param  {[object]} features   [op features]
         * @param  {[array]} attributes [attributes of inactive layer]
         * @return {[object]}            [op features]
         */
        _getActiveTagPipeLayers: function(features, attributes){
            var me = this;

            var activeLayers = jQuery.grep(features, function(n) {
                var finalId = n.id.split(".");
                if (attributes.indexOf(finalId[0]) === -1) {
                    return n;
                }
            });

            return activeLayers;
        },

        /**
         * [addLayerToMapById add layer back to map by layer id]
         * @param {[Integer]} layerId [layerId]
         */
        _addLayerToMapById: function(layerId){
            var me = this,
            request = me.sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
            me.sandbox.request(me.instance, request);
        },

         /**
         * [disableNormalGFI disables normal GFI cause using mapclick in cropping]
         * @param  {[type]} state [true/false]
         * @return {[none]}
         */
        _activateNormalGFI: function(state){
            var me = this,
            reqBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');

            if (reqBuilder) {
                var request = reqBuilder(state); 
                me.sandbox.request(me.instance, request);
            }
        },

        /**
         * [activateNormalWFSReq disables normal WFS click cause using mapclick in cropping]
         * @param  {[type]} state [true/false]
         * @return {[none]}
         */
        _activateNormalWFSReq: function(state){
            var me = this,
            reqBuilder = me.sandbox.getRequestBuilder('WfsLayerPlugin.ActivateHighlightRequest');

            if (reqBuilder) {
                var request = reqBuilder(state); 
                me.sandbox.request(me.instance, request);
            }
        },

        /**
         * @method _openPopup
         * opens a modal popup, no buttons or anything.
         */
        _openPopup: function (title, content) {
            var dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.OkButton'
                );

            okBtn.setPrimary(true);
            okBtn.setHandler(function () {
                dialog.close(true);
            });
            dialog.show(title, content, [okBtn]);
            dialog.makeModal();
        },

        /**
         * [createHighlightVectorLayer creates highlight vector layer to map]
         * @return {[none]}
         */
        _createHighlightVectorLayer: function(){
            var me = this,
            _map = me.mapModule.getMap();

            me.highlightVectorLayer = new OpenLayers.Layer.Vector("highlight-vector-layer", {
                 style: {
                     strokeColor: "#00ff7f",
                     strokeWidth: 3,
                     fillOpacity: 1,
                     fillColor: "#00ff7f",
                     pointRadius: 2
                 }
            });

            _map.addLayers([me.highlightVectorLayer]);

        },
        /**
         * [_createLabelForMustacheVector creates certain label for vectorlayer]
         * @param  {[array]} mustacheInfo [data & values of inputs]
         * @return {[string]}              [label string]
         */
        _createLabelForMustacheVector: function(mustacheInfo){
            var me = this,
            label = "";

            jQuery.each(me.state[me.state.mustacheType], function(index, item) {
                if(me.state.doNotUseInLabel.indexOf(item) == -1){
                    if(index !== 0){
                        label += me._getLocalization(item)+":";
                    }
                    label += mustacheInfo[item]+"\n";
                }
            });

            return label;

        },

         /**
         * [createHighlightVectorLayer creates highlight vector layer to map]
         * @return {[none]}
         */
        _createMustacheVectorLayer: function(mustacheInfo){
            var me = this,
            _map = me.mapModule.getMap();

            me.mustacheVectorLayer = new OpenLayers.Layer.Vector("mustache-vector-layer", {
                styleMap: new OpenLayers.StyleMap({'default':{
                    strokeColor: "#00FF00",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    fillColor: "#FF5500",
                    fillOpacity: 0.5,
                    pointRadius: 6,
                    pointerEvents: "visiblePainted",
                    // label with \n linebreaks
                    label : me._createLabelForMustacheVector(mustacheInfo),
                    
                    fontColor: "black",
                    fontSize: "12px",
                    fontFamily: "Courier New, monospace",
                    fontWeight: "bold",
                    labelAlign: "lb",
                    labelXOffset: "${xOffset}",
                    labelYOffset: "${yOffset}",
                    labelOutlineColor: "white",
                    labelOutlineWidth: 3
                }})});

            _map.addLayers([me.mustacheVectorLayer]);

        },
        /**
         * [clearHighlightVectorLayer removes all features from highlight layer]
         */
        _clearHighlightVectorLayer: function(){
            var me = this;
            if(me.highlightVectorLayer !== null){
                me.highlightVectorLayer.removeAllFeatures();
            }
        },
         /**
         * [clearHighlightVectorLayer removes all features from highlight layer]
         */
        _clearMustacheVectorLayer: function(){
            var me = this;
            if(me.mustacheVectorLayer !== null){
                me.mustacheVectorLayer.removeAllFeatures();
            }
        }

    }, {
        extend: ['Oskari.userinterface.component.TabPanel']
    }
);
