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
        //there is finnish words in state variables cause in future there will be direct reading from WMS or WFS interfaces, it's easier to read direct params with right name
        this.state = {
            tagPipeClickLonLat: null,
            tagPipeActive: false,
            mustacheActive: false,
            mustacheType: null,
            mustacheIsOnMap: false,
            mustacheGeoJSON: null,
            mustachePrintJSONarray: [],
            calculateTagTypes: ['jatevesi','hulevesi','sekaviemari'],
            allTagTypes: ['vesi_putki','maapaloposti','seinapaloposti','sprinkleri','jatevesi_putki','jatevesi_kaivo','hulevesi_putki','hulevesi_kaivo','sekaviemari_putki','sekaviemari_kaivo','muu_liitynta'],
            vesi_putki: ['tag-type','tag-address','tag-pipe-size','tag-low-pressure-level','tag-max-pressure-level'],
            maapaloposti: ['tag-type','tag-address','tag-pipe-size','tag-low-pressure-level','tag-max-pressure-level'],
            seinapaloposti: ['tag-type','tag-address','tag-pipe-size','tag-low-pressure-level','tag-max-pressure-level'],
            sprinkleri: ['tag-type','tag-address','tag-pipe-size','tag-max-water-take','tag-min-pressure-level'],
            jatevesi_putki: ['tag-type','tag-address','tag-pipe-size','tag-bottom-height','tag-calculate-btn','tag-low-tag-height','tag-barrage-height'],
            jatevesi_kaivo: ['tag-type','tag-address','tag-pipe-size','tag-bottom-height','tag-calculate-btn','tag-low-tag-height','tag-barrage-height'],
            hulevesi_putki: ['tag-type','tag-address','tag-pipe-size','tag-ground-height','tag-bottom-height','tag-calculate-btn','tag-low-tag-height','tag-barrage-height'],
            hulevesi_kaivo: ['tag-type','tag-address','tag-pipe-size','tag-ground-height','tag-bottom-height','tag-calculate-btn','tag-low-tag-height','tag-barrage-height'],
            sekaviemari_putki: ['tag-type','tag-address','tag-pipe-size','tag-ground-height','tag-bottom-height','tag-calculate-btn','tag-low-tag-height','tag-barrage-height'],
            sekaviemari_kaivo: ['tag-type','tag-address','tag-pipe-size','tag-ground-height','tag-bottom-height','tag-calculate-btn','tag-low-tag-height','tag-barrage-height'],
            muu_liitynta: ['tag-type','tag-address','tag-other-issue'],
            doNotUseInLabel: ['tag-address','tag-pipe-size','tag-ground-height','tag-calculate-btn'],
            onlyNumberInputs: ['tag-pipe-size','tag-bottom-height','tag-low-tag-height','tag-barrage-height','tag-ground-height','tag-low-tag-height','tag-barrage-height','tag-max-water-take','tag-min-pressure-level','tag-low-pressure-level','tag-max-pressure-level']
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

            me.templates.tagpipeSection = jQuery('<div class="tag-pipe-section"></div>');

            me.templates.formRedirect = jQuery(
                '<div class="tag-pipe-redirect-to-form">' +
                '   <select></select>' +
                '</div>'
            );

            //form body
            me.templates.form = jQuery(
                '<form class="tag-pipe-form" method="" action="">' +
                '<fieldset>' +
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

            me.templates.search = jQuery(
                '<div class="tag-search-wrapper">' +
                '  <input type="search"></input>' +
                '  <div class="icon-close"></div>' +
                '</div>'
            );
            me.templates.search.find('input').keypress(
                function (event) {
                    if (event.keyCode === 10 || event.keyCode === 13) {
                        me._filterList(event, me);
                    }
                }
            );
            me.templates.search.find('div.icon-close').click(
                function (event) {
                    jQuery(event.target)
                        .parent()
                        .find('input[type=search]')
                        .val('');
                    me._filterList(event, me);
                }
            );
            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SearchButton'
            );
            // jQuery doesn't clone handlers that aren't created with jQuery,
            // so we have to do this with jQuery...
            jQuery(btn.getElement()).click(
                function (event) {
                    me._filterList(event, me);
                }
            );
            btn.insertTo(me.templates.search);

            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            btn.setTitle(me._getLocalization('clear-marks-from-map'));
            jQuery(btn.getElement()).click(
                function (event) {
                    me._removeFeaturesFromMap(); //'MUSTACHE-ONPRINT', null, null
                    me.state.mustachePrintJSONarray = [];
                    me._printGeoJSON();
                }
            );
            btn.insertTo(me.templates.search);

            //pipe list item
            me.templates.pipeListElement = jQuery(
                '<li class="tag-pipe-list-element">' +
                    '<span></span>' +
                    '<a class="tag-pipe-show-onmap" href="#"></a>' +
                    '<a class="tag-pipe-select" href="#"></a>' +
                '</li>'
            );

            me.templates.list = jQuery('<ul class="tag-pipes-accordion"></ul>');

            me.templates.item = jQuery(
                '<li class="accordion">' +
                '<div class="header accordion-header clearfix">' +
                ' <div class="accordion-header-text">' +
                '   <span></span>' +
                '   <h4></h4>' +
                ' </div>' +
                '</div>' +
                '</li>'
            );

            btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            btn.addClass('show-tag-on-map primary');
            btn.setTitle(me._getLocalization('show-tagpipe-onmap'));
            jQuery(btn.getElement()).click(
                function (event) {
                    var target = jQuery(event.target),
                    item = target.parents('li'),
                    uid = item.attr('data-id'),
                    tagpipe = me._getTagPipe(parseInt(uid, 10));
                    me.state.mustacheType = tagpipe.tag_type;

                    me.state.mustachePrintJSONarray.push(tagpipe.tag_geojson);
                    var labelPosition = tagpipe.tag_geojson.features[1].properties.labelposition;
                    me._addFeaturesToMap(tagpipe.tag_geojson, 'MUSTACHE-ONPRINT', false, 'label', false, labelPosition);
                    me._printGeoJSON(me.state.mustachePrintJSONarray);
                }
            );
            btn.insertTo(me.templates.item.find('div.header'));

            btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.EditButton');
            btn.setName('edit');
            jQuery(btn.getElement()).click(
                function (event) {
                    me._openForm(event, me);
                }
            );
            btn.insertTo(me.templates.item.find('div.header'));
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
                me.container.find(".tag-pipes-accordion").hide();
                me.container.find(".tag-search-wrapper").hide();
                me.state.tagPipeActive = true;
                me._activateNormalGFI(false);
                me._activateNormalWFSReq(false);
                me._activateTagPipeLayers();
                //me._removeFeaturesFromMap();
                //me.state.mustachePrintJSONarray = [];
                //me._printGeoJSON();

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
                me.container.find(".tag-pipes-accordion").show();
                me.container.find(".tag-search-wrapper").show();
                me.container.find(".tag-pipe-list").remove();
                me._activateNormalGFI(true);
                me._activateNormalWFSReq(true);
                me._removeFeaturesFromMap();

                me._manageHelp(false);
            });

            btn.setTitle(me._getLocalization('cancel-tag'));
            btn.insertTo(me.container);
            me.container.find(".cancel-tag-btn").hide();

            //add help div
            var help = me.templates.help.clone();
            help.hide();
            me.container.append(help);

            me.container.append(me.templates.tagpipeSection);

            me._fetchTagPipes(me.container);

            me.container.append(me.templates.search);

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
         * Gets tagpipe id based on event target and deletes it
         */
        _deleteTagPipe: function (event, me) {
            var item = jQuery(event.target).parents('li'),
                uid = parseInt(item.attr('data-id')),
                tagpipe = me._getTagPipe(uid);

            if (!window.confirm(me._getLocalization('confirm_delete').replace('{tagpipe}', tagpipe.tag_address+ ", "+me._getLocalization("tag-type-"+tagpipe.tag_type)))) {
                return;
            }

            item.hide();
            jQuery.ajax({
                type: 'DELETE',
                url: me.sandbox.getAjaxUrl() + 'action_route=SearchTagPipe&tag_id='+ uid,
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
                    me._fetchTagPipes(me.container);
                    me._removeFeaturesFromMap();
                }
            });
        },

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
                listElaSelect = listEl.find("a.tag-pipe-select"),
                geojsonObject = me._populateGeoJSON([data[i]]);

                listElspan.text(data[i].id);
                listElaOnMap.text(me._getLocalization("show_on_map"));
                listElaOnMap.bind("click", {feature: geojsonObject}, function(e){
                    e.preventDefault();
                    me._addFeaturesToMap(e.data.feature, 'HIGHLIGHT-TAG', true, null, true);
                });
                listElaSelect.text(me._getLocalization("select_tag_pipe"));
                listElaSelect.bind("click", {feature: geojsonObject}, function(e){
                    e.preventDefault();
                    me._openForm(e, me, e.data.feature);
                    me._addFeaturesToMap(e.data.feature, 'HIGHLIGHT-TAG', true, null, true);
                });

                list.append(listEl);
            }

            me.container.find(".tag-pipe-section").append(list);
        },

        /**
         * [_populateGeoJSON creates certain geojson with params]
         * @param  {[object]} data [geometry]
         * @return {[object]}      [final geojson]
         */
        _populateGeoJSON: function(data){

            var geojsonObject = {
                  'type': 'FeatureCollection',
                  'crs': {
                    'type': 'name',
                    'properties': {
                      'name': 'EPSG:3879'
                    }
                  },
                  'features': data
                };

            return geojsonObject;
        },

        /**
         * [_getFeatureStyle features style]
         * @param  {[String]} labelProperty [label name found in geojson]
         * @return {[object]}               [style]
         */
        _getFeatureStyle: function(labelProperty, labelPosition){
            if(labelPosition == ""){
                labelPosition = "lb";
            }

            return {
                    fill: {
                        color: '#ff0000'
                    },
                    stroke : {
                        color: '#ff0000',
                        width: 1
                    },
                    image: {
                        radius: 0.01
                    },
                    text : {
                        scale : 1.3,
                        fill : {
                            color : 'rgba(0,0,0,1)'
                        },
                        stroke : {
                            color : 'rgba(255,255,255,1)',
                            width : 6
                        },
                        labelProperty: labelProperty,
                        labelAlign: labelPosition,
                        offsetX: 0,
                        offsetY: -30
                    },
                    labelAlign: labelPosition
                };
        },

        /**
         * [_addFeaturesToMap adds vectorlayer and features on map]
         * @param {[object]} geojsonObject [geojson]
         * @param {[String]} layerId       [layerId]
         * @param {[boolean]} clearPrevious [clear other features]
         * @param {[String]} labelProperty [label name found in geojson]
         * @param {[boolean]} centerTo      [centers map]
         */
        _addFeaturesToMap: function(geojsonObject, layerId, clearPrevious, labelProperty, centerTo, labelPosition){
            var me = this;

            var params = [geojsonObject, {
                layerId: layerId,
                clearPrevious: clearPrevious,
                centerTo: centerTo,
                featureStyle: me._getFeatureStyle(labelProperty, labelPosition),
                prio: 1
            }];

            me.sandbox.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', params);

        },

        /**
         * [_removeFeaturesFromMap removes features with given parameters]
         * @param  {[String]} layerId   [layerId]
         * @param  {[String]} propKey   [propKey]
         * @param  {[String]} propValue [propValue]
         */
        _removeFeaturesFromMap: function(layerId, propKey, propValue){
            var me = this;
            me.sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest',[propKey, propValue, layerId]);
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
                output.push('<option value="'+ value +'">'+ me._getLocalization("tag-type-"+value) +'</option>');
            });

            return output.join('');
        },

        /**
         * @method _openForm opens redirect select and from change event form
         * Opens edit/create form depending on event target location
         */
        _openForm: function (event, instance, data) {
            var me = instance,
                direct = me.templates.formRedirect,
                target = jQuery(event.target),
                tagPipeSection = me.container.find(".tag-pipe-section"),
                item = target.parents('li'),
                uid = item.attr('data-id');

                if (uid && uid.length) {
                    me._activateNormalGFI(false);
                    me._activateNormalWFSReq(false);
                    me.state.mustacheActive = false;
                    var tagpipe = me._getTagPipe(parseInt(uid, 10));
                    target.hide();
                    item.append(me._initForm(tagpipe.tag_type, tagpipe));

                }else{

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

                        if(value === ""){
                            me._manageHelp(true, me._getLocalization('help_redirect'));
                            form.remove();
                        }else{
                            me._manageHelp(true, me._getLocalization('help_insert'));
                            form.remove();
                            tagPipeSection.append(me._initForm(value, null));
                        }
                    });
                    tagPipeSection.append(direct);

                }
        },

        /**
         * [_getTagPipe gets certain tagpipe attributes]
         * @param  {[integer]} uid [tag_id]
         * @return {[array]}     [tagpipe array]
         */
        _getTagPipe: function (uid) {
            var i,
            me = this;

            for (i = 0; i < me.tagpipes.length; i += 1) {
                if (me.tagpipes[i].tag_id === uid) {
                    return me.tagpipes[i];
                }
            }
            return null;
        },

        /**
         * [_initForm creates form with state params]
         * @param  {[array]} data [feature]
         * @return {[jquery object]}      [html]
         */
        _initForm: function(type, tagpipe){
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
                    if(item === "tag-other-issue"){
                        me.templates.form.detailinputs = jQuery(
                        '    <label>' +
                        '        <span></span>' +
                        '        <textarea rows="4" cols="20" maxlength="100" tagtype="'+me.state.mustacheType+'" name="'+item+'" class="tag-pipe-details '+elclass+'" language="'+item+'" required="required" />' +
                        '    </label>'
                        );
                    }else if(item === 'tag-calculate-btn'){
                        me.templates.form.detailinputs = jQuery(
                        '    <label>' +
                        '        <span></span>' +
                        '        <button tagtype="'+me.state.mustacheType+'" class="tag-pipe-details tag-pipe-calculate-btn">'+me._getLocalization('tag-pipe-calculate-btn')+'</button>' +
                        '    </label>'
                        );
                    }else{
                        me.templates.form.detailinputs = jQuery(
                        '    <label>' +
                        '        <span></span>' +
                        '        <input type="text" tagtype="'+me.state.mustacheType+'" name="'+item+'" class="tag-pipe-details '+elclass+'" language="'+item+'" required="required" />' +
                        '    </label>'
                        );
                    }

                    form.find('.tag-pipe-form-inner-wrapper').append(me.templates.form.detailinputs);
            });

            //calculate certain values into inputs
            if(me.state.calculateTagTypes.indexOf(tagType[0]) > -1){
                form.find('.tag-pipe-calculate-btn').click(function(e) {
                    e.preventDefault();
                    form.find("[name=tag-low-tag-height]").val(me._calculateTagHeight(form, tagType));
                    form.find("[name=tag-barrage-height]").val(me._calculateBarrageHeight(form, tagType));
                });
            }

            //add localization to inputs
            form.find('input,select,textarea').each(function (index) {
                var el = jQuery(this);
                el.prev('span').html(me._getLocalization(el.attr('name')));
                if(el.attr("language") != null){
                   el.attr("placeholder", me._getLocalization(el.attr("language")));
                   if(el.attr("name") == "tag-type"){
                        el.val(me._getLocalization("tag-type-"+el.attr("tagtype")));
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
            btn.addClass("add-mustache-to-map start-mode");
            jQuery(btn.getElement()).click(function (e) {
                    var el = jQuery(this);
                    e.preventDefault();

                    if(el.hasClass('start-mode')){
                        if (me._formIsValid(el.parents('form'), me)) {
                            el.removeClass('start-mode').addClass('draw-mustache primary');
                            el.val(me._getLocalization("add_label_to_map"));
                            me.state.mustacheActive = true;
                        }
                    }else if(el.hasClass('draw-mustache')){
                            el.removeClass('draw-mustache').addClass('draw-label');
                            el.val(me._getLocalization("cancel_mustache_to_map"));
                            me.state.mustacheActive = true;
                    }else if(el.hasClass('draw-label')){
                            el.removeClass('draw-label primary').addClass("start-mode");
                            el.val(me._getLocalization('add_mustache_to_map'));
                            me.state.mustacheActive = false;
                    }

/*                    if(el.hasClass('draw-mustache')){
                        el.removeClass("draw-mustache primary");
                        el.val(me._getLocalization("add_mustache_to_map"));
                        me.state.mustacheActive = false;
                    }else{
                        if (me._formIsValid(el.parents('form'), me)) {
                            el.addClass("draw-mustache primary");
                            el.val(me._getLocalization("cancel_mustache_to_map"));
                            me.state.mustacheActive = true;
                        }
                    }*/
                }
            );
            btn.insertTo(innerFieldset);

            var buttonFieldset = form.find('fieldset:nth-of-type(2)');
            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SaveButton'
            );
            btn.insertTo(buttonFieldset);
            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.DeleteButton'
            );
            btn.addClass('delete-tagpipe hidden');
            jQuery(btn.getElement()).click(
                function (event) {
                    me._deleteTagPipe(event, me);
                }
            );
            btn.insertTo(buttonFieldset);
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
                jQuery(this).val(jQuery(this).val().replace(/[^0-9\.\-\+]/g,''));
                if(event.key == "Backspace" || event.key == "Tab") {return;}
                    if ((event.which != 46 || jQuery(this).val().indexOf('.') != -1)  && (event.which < 48 || event.which > 57) && (event.which != 45 || jQuery(this).val().indexOf('-') != -1) && (event.which != 43 || jQuery(this).val().indexOf('+') != -1)) {
                        event.preventDefault();
                    }
            });

            if(tagpipe){
                me._populateForm(form, tagpipe);
                form.find('.delete-tagpipe').removeClass('hidden');
            }else{
                me._populateForm(form, null);
            }

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
            bottomHeight = parseFloat(form.find("[name=tag-bottom-height]").val()),
            output = null;

            if(isNaN(pipeSizemm) || isNaN(bottomHeight)){
                return;
            }

            switch (type) {
                case "kaivo":
                    if(pipeSizemm > 0 && pipeSizemm <= 250){
                        //Pohjan korkeus + 150mm
                        output = bottomHeight + (150/1000);
                    }else if(pipeSizemm >= 251 && pipeSizemm <= 350){
                        //Pohjan korkeus + 200 mm
                        output = bottomHeight + (200/1000);
                    }else if(pipeSizemm > 350){
                        //Pohjan korkeus + 0,75 * katuviemärin halkaisija
                        output = (0.75*pipeSize) + bottomHeight;
                    }
                break;

                case "putki":
                    if(pipeSizemm > 0 && pipeSizemm <= 500){
                        //Pohjan korkeus + 0,5 * katuviemärin halkaisija
                        output = (0.5*pipeSize) + bottomHeight;
                    }else if(pipeSizemm > 500){
                        //Pohjan korkeus + 0,75 * katuviemärin halkaisija
                        output = (0.75*pipeSize) + bottomHeight;
                    }
                break;
            }

            return (output > 0) ? "+" + parseFloat(output).toFixed(1) : parseFloat(output).toFixed(1);
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
            groundHeight = parseFloat(form.find("[name=tag-ground-height]").val()),
            minBarrageHeight = parseFloat(1.8),
            output = null;

            switch (type) {
                case "jatevesi":
                    if(isNaN(pipeSizemm) || isNaN(bottomHeight)){
                        return;
                    }else{
                        output = bottomHeight + pipeSize + (1000/1000);
                    }
                break;
                case "hulevesi":
                case "sekaviemari":
                    if(isNaN(pipeSizemm) || isNaN(bottomHeight) || isNaN(groundHeight)){
                        return;
                    }else{
                        output = groundHeight + (100/1000);
                    }
                break;
            }

            if(output > minBarrageHeight){
                return "+"+parseFloat(output).toFixed(1);
            }else{
                return "+"+minBarrageHeight;
            }
        },

        /**
         * @method _closeForm
         * Closes given form and shows the button that opens it
         */
        _closeForm: function (form, mustachelayer) {
            var me = this,
            tagPipeWrapper = form.parents(".tag-pipe-wrapper");

            if (form.parent().is('li')) {
                // show edit button
                form.parent().find('.header input').show();
            } else {
                form.prev('div.tag-pipe-redirect-to-form').remove();
            }

            tagPipeWrapper.find('.add-tag-btn').show();
            tagPipeWrapper.find(".tag-pipes-accordion").show();
            tagPipeWrapper.find(".tag-search-wrapper").show();
            me._activateNormalGFI(true);
            me._activateNormalWFSReq(true);
            if(mustachelayer){
                me._removeFeaturesFromMap('MUSTACHE-TAG', null, null);
                me._removeFeaturesFromMap('MUSTACHE-TAG-LABEL', null, null);
            }else{
                me._removeFeaturesFromMap();
                me.state.mustachePrintJSONarray = [];
            }
            me.state.mustacheIsOnMap = false;
            me.state.mustacheGeoJSON = null;
            me.state.mustacheType = null;
            me.state.mustacheActive = false;
            me._manageHelp(false);
            me._printGeoJSON();

            // destroy form
            form.remove();
        },

        /**
         * [_mustacheLayerIsValid check that mustachelayer is not empty]
         * @return {[output]} [true/false]
         */
        _mustacheLayerIsValid: function(){
            var me = this,
            output = false;

            if(me.state.mustacheIsOnMap){
                output = true;
            }else{
                 me._openPopup(me._getLocalization('mustache_invalid'), me._getLocalization('mustache_invalid_help'));
            }

            return output;
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
            form.find('input[required], textarea[required]').each(function (index) {
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
            var form = jQuery(event.target),
            parentLi = form.parents('li');

            if (me._formIsValid(form, me) && me._mustacheLayerIsValid()) {

                var data = {};

                //get data from form
                form.find('input[type=text],textarea').each(function(index, value) {
                    var input = jQuery(this);
                    data[input.attr("name").replace(/-/g , "_")] = input.val();
                });

                data.tag_type = me.container.find(".tag-pipe-redirect-to-form select :selected").val();

                //get geojson
                data.tag_geojson = me.state.mustacheGeoJSON;

                if(parentLi){
                    data.tag_id = parseInt(parentLi.attr('data-id'));
                }

                jQuery.ajax({
                    type: form.attr('method'),
                    url: me.sandbox.getAjaxUrl() + 'action_route=SearchTagPipe',
                    data: data,
                    success: function (data) {
                        me._closeForm(form, true);
                        me._fetchTagPipes(me.container, true);
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
                me._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
                me._progressSpinner.insertTo(jQuery(".tag-pipe-wrapper"));
                me._progressSpinner.start();

                me.state.mustacheType = tagpipe.tag_type;

                form.find('input[type=text], textarea').each(function(index, value) {
                    var input = jQuery(this);
                    var tagValue = tagpipe[input.attr("name").replace(/-/g , "_")];

                    if(input.attr("name") === "tag-type"){
                        input.val(me._getLocalization("tag-type-"+tagValue));
                    }else{
                        input.val(tagValue);
                    }
                });

                //FIXME Dynamic option adding needs it
                setTimeout(function(){
                  me.mustachePointOnMap(null, tagpipe.tag_geojson);
                },300);

                me._progressSpinner.stop();

                form.attr('method', 'PUT');
            } else {
                form.attr('method', 'POST');
            }

            form.submit(function (event) {
                return me._submitForm(event, me);
            });
            return form;
        },

        /**
         * [[fetchTagPipes fetchTagPipes]]
         * @param  {[object]} container [html el container]
         */
         _fetchTagPipes: function (container, addLastOnMap) {
            // Remove old list from container
            container.find('ul').remove();
            // get channels with ajax
            var me = this;

            jQuery.ajax({
                type: 'GET',
                url: me.sandbox.getAjaxUrl() + 'action_route=SearchTagPipe',
                success: function (data) {
                    me._createList(me, data.tagpipes, me.state.filter, addLastOnMap);
                 },
                error: function (jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);

                     me._openPopup(
                         me._getLocalization('fetch_failed'),
                         error
                     );
                 }
            });
        },

        /**
         * [_createList create tagpipe list from database]
         * @param  {[object]} me       [this]
         * @param  {[array]} tagpipes [tagpipes from db]
         * @param  {[string]} filter   [search string]
         */
        _createList: function (me, tagpipes, filter, addLastOnMap) {
            var list = me.templates.list.clone(),
                i,
                tagpipe,
                hasFilter = filter !== null && filter !== undefined && filter.length > 0,
                matches,
                topic;

            me.tagpipes = tagpipes;
            if(tagpipes) {
                for (i = 0; i < tagpipes.length; i += 1) {
                    tagpipe = tagpipes[i];
                    topic = tagpipe.tag_address+ ", "+me._getLocalization("tag-type-"+tagpipe.tag_type);
                    matches = !hasFilter || topic.toLowerCase().indexOf(filter.toLowerCase()) > -1;
                    if (matches) {
                        list.append(
                            me._populateItem(
                                me.templates.item.clone(true, true),
                                tagpipe
                            )
                        );
                    }
                }
            }
            // Add list to container
            if(list.children().length > 0){
                me.container.append(list);
                if(addLastOnMap){
                    me._showLastTagPipeOnMap(list);
                }
            }else{
                 me._openPopup(
                     me._getLocalization('tag-pipes'),
                     me._getLocalization('noMatch')
                 );
            }
        },

        /**
         * [_showLastTagPipeOnMap shows lastly added tagpipe on map and on print]
         * @param  {[jquery object]} list [li]
         */
        _showLastTagPipeOnMap: function(list){
            var me = this;
            var last_li = list.find('li').last();
            last_li.find('.show-tag-on-map').trigger('click');
        },

        /**
         * @method _filterList
         */
        _filterList: function (event, me) {
            var filter = jQuery(event.target).parent().find('input[type=search]').val();
            me.state.filter = filter;
            me._fetchTagPipes(me.container);
        },

        /**
         * @method _populateItem
         * Populates an item fragment
         */
        _populateItem: function (item, tagpipe) {
            var me = this;
            //topic = tagpipe.tag_address+ ", "+me._getLocalization("tag-type-"+tagpipe.tag_type);

            item.attr('data-id', tagpipe.tag_id);
            item.find('span').text(me._getLocalization("tag-type-"+tagpipe.tag_type));
            item.find('h4').text(tagpipe.tag_address);
            return item;
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
            //me._clearHighlightVectorLayer();

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
        mustachePointOnMap: function(lonlat, geojson){
            var me = this,
            mustacheInfo = me._populateMustacheInfo(),
            geojson_format = new OpenLayers.Format.GeoJSON(),
            mustacheBtn = jQuery('.add-mustache-to-map');

            if(geojson){
                var geojson2point = geojson_format.parseCoords.point(geojson.features[0].geometry.coordinates[1]);
                me.state.tagPipeClickLonLat = new OpenLayers.LonLat(geojson2point.x, geojson2point.y);
                var labelPosition = geojson.features[1].properties.labelposition;
                me._addFeaturesToMap(geojson, 'MUSTACHE-TAG', true, 'label', true, labelPosition);

            }else{

                if(mustacheBtn.hasClass('draw-mustache')){

                    var points = [
                        new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat),
                        new OpenLayers.Geometry.Point(me.state.tagPipeClickLonLat.lon, me.state.tagPipeClickLonLat.lat)
                    ];
                    var lineFeature = new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.LineString(points)
                    );
                    lineFeature.attributes = {label : ""};

                    var lineFeatures = geojson_format.write(lineFeature);
                    var geojsonObjectLine = me._populateGeoJSON([JSON.parse(lineFeatures)]);
                    mustacheBtn.attr("data-mustache-line", JSON.stringify(lineFeatures));
                    me._addFeaturesToMap(geojsonObjectLine, 'MUSTACHE-TAG', true, 'label', false, mustacheInfo.labelposition);

                }else if(mustacheBtn.hasClass('draw-label')){

                    var pointFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
                    pointFeature.attributes = mustacheInfo;

                    var pointFeatures = geojson_format.write(pointFeature);
                    var geojsonObjectPoint = me._populateGeoJSON([JSON.parse(pointFeatures)]);
                    me._addFeaturesToMap(geojsonObjectPoint, 'MUSTACHE-TAG-LABEL', true, 'label', false, mustacheInfo.labelposition);

                    var lineFeaturesFinal = JSON.parse(mustacheBtn.attr("data-mustache-line"));
                    var array = [JSON.parse(lineFeaturesFinal),JSON.parse(pointFeatures)];
                    var geojsonObject = me._populateGeoJSON(array);

                    me.state.mustacheIsOnMap = true;
                    me.state.mustacheGeoJSON = JSON.stringify(geojsonObject);
                }

            }

        },

        /**
         * [_populateMustacheInfo gets certain values from form]
         * @return {[object]} [output data]
         */
        _populateMustacheInfo: function(){
            var me = this,
            output = {},
            form = me.container.find("form");
            var label = "";
            output.label = "";
            output.labelposition = "";

            jQuery.each(me.state[me.state.mustacheType], function(index, item) {
                output.labelposition = "lb";
                if(me.state.doNotUseInLabel.indexOf(item) == -1){
                    if(index !== 0){
                        label += me._getLocalization(item)+":";
                    }
                    label += form.find("input[name='"+item+"'],textarea[name='"+item+"']").val()+"\n";
                }
            });

            output.label = label;

            return output;
        },

        /**
         * [activateTagPipeLayers: Puts tagpipe layers on]
         */
        _activateTagPipeLayers: function(){
            var me = this;
            var layers = me._getTagPipeLayers();

            for (var i in layers) {
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
         * [_printGeoJSON sends print request with geojson in it]
         * @param  {[array]} mustachePrintJSONarray [all geojsons]
         */
        _printGeoJSON: function(mustachePrintJSONarray){
            var me = this,
            printoutEvent = me.sandbox.getEventBuilder('Printout.PrintableContentEvent'),
            printOutArray = [],
            evt;

            if(mustachePrintJSONarray){
                for(var i in mustachePrintJSONarray){
                    for(var j in mustachePrintJSONarray[i].features){

                        var printObj = {
                        "type": "geojson",
                        "name": printOutArray.length + 1,
                        "id": printOutArray.length + 1,
                        "data": me._populateGeoJSON([mustachePrintJSONarray[i].features[j]]),
                        "styles": [
                            {
                           "name": "MustacheStyle",
                           "styleMap": {"default": {
                                 "fontColor": "rgba(0,0,0,1)",
                                 "fontFamily": "Arial",
                                 "fontSize": "12px",
                                 "fillOpacity": 1,
                                 "labelOutlineColor": "white",
                                 "labelOutlineWidth": 6,
                                 "labelOutlineOpacity": 1,
                                 "label": mustachePrintJSONarray[i].features[j].properties.label,
                                 "strokeColor": "#ff0000",
                                 "strokeOpacity": 1,
                                 "strokeWidth": 1,
                                 "labelAlign": mustachePrintJSONarray[i].features[j].properties.labelposition
                             }
                             }
                            }
                        ]
                        };

                        printOutArray.push(printObj);
                    }
                }
            }

            if (printoutEvent) {
                evt = printoutEvent(
                    'MainMapModule',
                    null,
                    null,
                    printOutArray
                );
                me.sandbox.notifyAll(evt);
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
        }

    }, {
        extend: ['Oskari.userinterface.component.TabPanel']
    }
);
