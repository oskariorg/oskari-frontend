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
        this.state = {};
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

            //form body
            me.templates.form = jQuery(
                '<form method="" action="">' +
                '<fieldset>' +
                '    <input type="hidden" name="id" />' +
                '       <h4></h4>' +
                '    <label>' +
                '        <span></span>' +
                '        <input type="text" name="details-topic-1" class="details-topic" language="details-name-1" required="required" />' +
                '    </label>' +
                '    <label>' +
                '        <span></span>' +
                '        <input type="text" name="details-topic-2" class="details-topic" language="details-name-2" required="required" />' +
                '    </label>' +
                '    <label>' +
                '        <span></span>' +
                '        <input type="text" name="details-topic-3" class="details-topic" language="details-name-3" required="required" />' +
                '    </label>' +
                '    <label>' +
                '        <span></span>' +
                '        <input type="text" name="details-topic-4" class="details-topic" language="details-name-4" required="required" />' +
                '    </label>' +
                //'               <div class="details--wrapper"></div>' +
                '</fieldset>' +
                '<fieldset></fieldset>' +
                '</form>'
            );

/*            jQuery.each(Oskari.getSupportedLanguages(), function(index, item) {
                me.templates.form.detailinputs = jQuery(
                '    <label>' +
                '        <span></span>' +
                '        <input type="text" name="details-topic-1" class="details-topic" language="details-name-1" required="required" />' +
                '    </label>' +
                '    <label>' +
                '        <input type="text" name="details-desc-'+item+'" class="no-span-text details-desc" language="details-desc-'+item+'" required="required" />' +
                '    </label>'
                );
                me.templates.form.find('.details--wrapper').append(me.templates.form.detailinputs);
            });*/

            //add localization to inputs
            me.templates.form.find('input,select').each(function (index) {
                var el = jQuery(this);
                el.prev('span').html(me._getLocalization(el.attr('name')));
                if(el.attr("language") != null){
                   el.attr("placeholder", me._getLocalization(el.attr("language")));
                }
            });

            me.templates.form.find('h4').text(me._getLocalization('tag-pipe-details-header'));

/*            var firstFieldset = me.templates.form.find(
                'fieldset:nth-of-type(1)'
            );*/

            //add buttons to fieldset of form
            var buttonFieldset = me.templates.form.find(
                'fieldset:nth-of-type(2)'
            );
            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SaveButton'
            );
            btn.insertTo(buttonFieldset);
            btn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.DeleteButton'
            );
            btn.addClass('delete--tagpipe');
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
                }
            );
            btn.insertTo(buttonFieldset);
        },
        /**
         * [fetchChannels fetchChannels]
         * @param  {[type]}
         * @return {[type]}
         */
/*         fetchChannels: function (container) {
            // Remove old list from container
            container.find('ul').remove();
            // get channels with ajax
            var me = this;
            
            jQuery.ajax({
                type: 'GET',
                url: me.sandbox.getAjaxUrl() + 'action_route=SearchWFSChannel',
                success: function (data) {
                    me._createList(me, data.channels, me.state.filter);
                 },
                error: function (jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);

                     me._openPopup(
                         me._getLocalization('fetch_failed'),
                         error
                     );
                 }
            });
        },*/

        /**
         * @method _getLocalization
         */
        _getLocalization: function (key) {
            return this._localization[key];
        },

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
         * @method _populateItem
         * Populates an item fragment
         */
        _populateItem: function (item, channel) {
            var me = this;

            item.attr('data-id', channel.id);
            item.find('h3').html(
                channel.topic[Oskari.getLang()]
            );
            return item;
        },

        /**
         * @method _getChannel
         * Gets channel by id
         */
        _getChannel: function (uid) {
            var i;
            for (i = 0; i < this.channels.length; i += 1) {
                if (this.channels[i].id === uid) {
                    return this.channels[i];
                }
            }
            return null;
        },

        /**
         * @method _openForm
         * Opens edit/create form depending on event target location
         */
        _openForm: function (event, instance) {
            // Semi deep clone
            var me = instance,
                form = me.templates.form.clone(true),
                target = jQuery(event.target),
                item = target.parents('li'),
                uid = item.attr('data-id');

            if (uid && uid.length) {
                target.hide();
                //me._populateForm(form, me._getChannel(parseInt(uid, 10)));
                item.append(form);
                form.find('.delete--tagpipe').removeClass('hidden');
            } else {
                target.hide();
                //me._populateForm(form, null);
                me.container.prepend(form);
            }
        },

        /**
         * @method _closeForm
         * Closes given form and shows the button that opens it
         */
        _closeForm: function (form) {
            if (form.parent().is('li')) {
                // show edit button
                form.parent().find('.header input').show();
            } else {
                form.parent().find('> input').show();
            }
            // destroy form
            form.remove();
        },

        /**
         * @method _formIsValid
         * Validates given form. Checks that required fields have values and
         * that password field values match.
         */
        _formIsValid: function (form, me) {
            console.info("UUUUU");
            var errors = [],
                pass;
            // check that required fields have values
            form.find('input[required]').each(function (index) {
                if (!this.value.length) {
                    errors.push(
                        me._getLocalization('field_required').replace(
                            '{fieldName}',
                            this.name
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
            var frm = jQuery(event.target);

            if (me._formIsValid(frm, me)) {

                //FIXME
                var url = "";

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
                url += "&isAddress="+dataObject["is-address"];

                jQuery.ajax({
                    type: frm.attr('method'),
                    url: me.sandbox.getAjaxUrl() + 'action_route=SearchWFSChannel',
                    data: url,
                    success: function (data) {
                        me._closeForm(frm);
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
/*        _populateForm: function (fragment, channel) {
            var me = this;

            if (channel) {
                this._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
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
               
                fragment.attr('method', 'POST');
            } else {
                fragment.attr('method', 'PUT');
            }

            fragment.submit(function (event) {
                return me._submitForm(event, me);
            });
            return fragment;
        },*/

        /**
         * [croppingLayersHighlight Highlights clicked cropping area/areas]
         * @param  {[string]} x      [Clicked on map X]
         * @param  {[string]} y      [Clicked on map Y]
         * @return {[none]}
         */
        findPipesRequest: function(x, y){
            console.info("TULEEE X - "+x)
            var me = this,
            mapVO = me.sandbox.getMap(),
            ajaxUrl = me.sandbox.getAjaxUrl(),
            map = me.mapModule.getMap(),
            layerUniqueKey = jQuery('.cropping-btn.selected').data('uniqueKey'),
            layerGeometryColumn = jQuery('.cropping-btn.selected').data('geometryColumn'),
            layerGeometry = jQuery('.cropping-btn.selected').data('geometry'),
            layerName = jQuery('.cropping-btn.selected').data('layerName'),
            layerUrl = jQuery('.cropping-btn.selected').data('layerUrl'),
            layerCroppingMode = jQuery('.cropping-btn.selected').data('croppingMode'),
            layerNameLang = jQuery('.cropping-btn.selected').val();

            jQuery.ajax({
                type: "POST",
                dataType: 'json',
                url: ajaxUrl + 'action_route=GetFeatureForCropping',
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
                    var geojson_format = new OpenLayers.Format.GeoJSON();
                    var features = geojson_format.read(data.features[0]);
                    var founded = me.croppingVectorLayer.getFeaturesByAttribute("cropid",data.features[0].id);

                        if(founded !== null && founded.length>0){
                            me.croppingVectorLayer.removeFeatures(founded);
                        }else{
                            features[0].attributes['cropid'] = data.features[0].id;
                            features[0].attributes['layerName'] = layerName;
                            features[0].attributes['layerUrl'] = layerUrl;
                            features[0].attributes['uniqueKey'] = layerUniqueKey;
                            features[0].attributes['geometryColumn'] = layerGeometryColumn;
                            features[0].attributes['geometryName'] = layerGeometry;
                            features[0].attributes['croppingMode'] = layerCroppingMode;
                            features[0].attributes['layerNameLang'] = layerNameLang;

                            me.croppingVectorLayer.addFeatures(features);
                            map.setLayerIndex(me.croppingVectorLayer, 1000000);
                        }
                        me.addToTempBasket(me.croppingVectorLayer.features.length);
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
            //me.fetchChannels(me.container);

            btn.setHandler(function (event) {
                me._openForm(event, me);
            });
            btn.setTitle(me._getLocalization('add_tag'));
            btn.insertTo(me.container);
            return me.container;
        }

    }, {
        extend: ['Oskari.userinterface.component.TabPanel']
    }
);
