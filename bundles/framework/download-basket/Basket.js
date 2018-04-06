/**
 * @class Oskari.mapframework.bundle.downloadBasket.Cropping
 *
 * Renders the "Download basket".
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.downloadBasket.Basket',
    function (localization, parent) {
        this.instance = parent;
        this._sandbox = parent.getSandbox();
        this._localization = localization;
        this.templates = {};
        this.setTitle(localization.title);
        this.state = {};
        this._selected = [];
        this._el = null;
        this._templates = {
            main: jQuery('<div class="oskari__download-basket"></div>'),
            basketWrapper : jQuery('<div class="oskari__download-basket-wrapper"><p class="empty-basket"></p></div>'),
            basketButtons : jQuery('<div class="oskari__download-basket-buttons"></div>'),
            basketUserInfo : jQuery('<div class="oskari__download-basket-user-info"><p></p></div>'),
            basketForm : jQuery(
                '<form method="" action="">' +
                '<fieldset>' +
                '    <label>' +
                '        <span></span>' +
                '        <input type="text" name="basket-user-email" class="email" required="required"></input>' +
                '    </label>' +
                '    <label>' +
                '        <span></span>' +
                '        <input type="text" name="basket-user-email-sure" class="email-re" required="required"></input>' +
                '    </label>' +
                '</fieldset>' +
                '<fieldset></fieldset>' +
                '</form>'
            )
        };

    },{
        startBasket: function(){
            this.setContent(this.createUi());
        },

        /**
         * @private @method _initTemplates, creates ui for cropping items
         *
         *
         */
        _initTemplates: function () {
            var me = this;

            //Wrapper
            me._templates.basketWrapper.find('.empty-basket').text(me._getLocalization('basket-is-empty'));
            me._templates.main.append(me._templates.basketWrapper);

            //Basket user info
            me._templates.basketUserInfo.append(me._templates.basketForm);
            me._templates.basketUserInfo.find('p').text(me._getLocalization('insert-email-for-download'));
            me._templates.main.append(me._templates.basketUserInfo);
            me._templates.basketUserInfo.hide();

            me._templates.basketUserInfo.find('input,select').each(function (index) {
                var curEl = jQuery(this);
                curEl.prev('span').html(me._getLocalization(curEl.attr('name')));
            });

            //Basket wizard buttons
            me.emptyBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me.prevBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me.nextBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me.sendBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            me.emptyBtn.addClass('primary empty');
            me.emptyBtn.setTitle(me._getLocalization('basket-empty'));
            jQuery(me.emptyBtn.getElement()).click(function () {
                var el = me.container;
                el.find('.download-basket__component').remove();
                el.find('.empty-basket').show();
                jQuery(el.find('input.empty')).hide();
                jQuery(el.find('input.next')).hide();
                me._selected = [];
                me.instance.addBasketNotify();
            });
            me.emptyBtn.insertTo(me._templates.basketButtons);

            me.prevBtn.addClass('primary prev');
            me.prevBtn.setTitle(me._getLocalization('basket-prev'));
            jQuery(me.prevBtn.getElement()).click(function () {
                var el = me.container;
                jQuery(el.find('input.empty')).show();
                jQuery(el.find('input.next')).show();
                el.find('.oskari__download-basket-wrapper').show();
                jQuery(el.find('input.prev')).hide();
                jQuery(el.find('input.send')).hide();
                el.find('.oskari__download-basket-user-info').hide();
            });
            me.prevBtn.insertTo(me._templates.basketButtons);

            me.nextBtn.addClass('primary next');
            me.nextBtn.setTitle(me._getLocalization('basket-next'));
            jQuery(me.nextBtn.getElement()).click(function() {
                var el = me.container;
                jQuery(el.find('input.empty')).hide();
                jQuery(el.find('input.next')).hide();
                el.find('.oskari__download-basket-wrapper').hide();
                jQuery(el.find('input.prev')).show();
                jQuery(el.find('input.send')).show();
                el.find('.oskari__download-basket-user-info').show();
            });
            me.nextBtn.insertTo(me._templates.basketButtons);

            me.sendBtn.addClass('approve send');
            me.sendBtn.setTitle(me._getLocalization('basket-send'));
            jQuery(me.sendBtn.getElement()).click(function () {
                if(!me.validateUserInputs(jQuery('.oskari__download-basket-user-info').find('form'))){
                    me.loadBasketItem();
                }
            });
            me.sendBtn.insertTo(me._templates.basketButtons);

            me._templates.main.append(me._templates.basketButtons);
            var el = me.container || me.getContainer();
            jQuery(el.find('input.empty')).show();
            jQuery(el.find('input.next')).show();
            jQuery(el.find('input.prev')).hide();
            jQuery(el.find('input.send')).hide();
        },

        /**
         * [loadBasketItem sends Ajax to download user selections]
         * @return {[none]}
         */
        loadBasketItem: function(){
            var me = this;
            var downloadDetails = [];
            var el = me.getContainer();
            el.find('.oskari__download-basket-buttons').find('input.send').attr("disabled",true);

            el.find('.download-basket__component').each(function(){
                var parent = jQuery(this);
                var details = {
                    croppingMode: parent.attr('data-cropping-mode'),
                    layer: parent.attr('data-layer-name'),
                    bbox: {
                        left: parent.attr('data-bbox-left'),
                        bottom: parent.attr('data-bbox-bottom'),
                        right: parent.attr('data-bbox-right'),
                        top: parent.attr('data-bbox-top')
                    },
                    croppingUrl: parent.attr('data-cropping-url'),
                    croppingLayer: parent.attr('data-cropping-layer'),
                    id: parent.attr('data-layer-id'),
                    identifiers: parent.attr('data-identifiers')
                };

                downloadDetails.push(details);

            });
            var strDownloadDetails = JSON.stringify(downloadDetails);

            var userDetails = {
                    email: el.find('.oskari__download-basket-user-info').find('input.email').val()
            };
            var strUserDetails = JSON.stringify(userDetails);

            var ajaxUrl = me._sandbox.getAjaxUrl();

            jQuery.ajax({
                beforeSend : function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/json;charset=UTF-8");
                    }
                },
                success : function(resp) {
                    if(resp.success){
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        btn = dialog.createCloseButton('OK');
                        btn.setHandler(function() {
                            var buttons = el.find('.oskari__download-basket-buttons');
                            buttons.find('input.send').attr("disabled",false);
                            el.find('.oskari__download-basket-user-info').find('input').val('');
                            buttons.find('input.prev').trigger('click');
                            buttons.find('input.empty').trigger('click');
                            el.find('.oskari__download-basket').parents('.oskari-flyoutcontentcontainer').find('.tabsItem>li>a').eq(0).trigger('click');
                            el.find('.cropping-btn.selected').trigger('click');
                            dialog.close();
                        });
                        btn.addClass('primary');
                        dialog.show(me._getLocalization('basket-thank-you'), me._getLocalization('basket-email-will-be'), [btn]);
                    } else {
                         me._openPopup(
                            me._getLocalization('title'),
                            me._getLocalization('error-in-downloading')
                        );
                    }

                },
                error : function(jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);

                    me._openPopup(
                        me._getLocalization('error-in-downloading'),
                        error
                    );
                },
                data : {
                    downloadDetails : strDownloadDetails,
                    lang: Oskari.getLang(),
                    userDetails: strUserDetails
                },
                type : 'POST',
                dataType : 'json',
                url : ajaxUrl + 'action_route=DownloadInfo'
            });

        },

        _openPopup: function(title, message) {
            var me = this;
            if(me._popup) {
                me._popup.close(true);
            } else {
                me._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            }
            me._popup.show(title,message);
            me._popup.fadeout();
        },

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
         * [validateUserInputs validate user inputs]
         * @param  {[form]} form [jQuery form element]
         * @return {[error]}      [true/false]
         */
        validateUserInputs: function(form){
            var me = this,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            errorText = me._getLocalization('check-form-error')+" ",
            error = false;

            form.find('input,select').each(function (index) {
                var el = jQuery(this);
                if(el.hasClass('email')){
                    if(!me.validateEmail(el.val())){
                        error = true;
                        errorText += el.prev('span').text().toLowerCase();
                        return false;
                    }
                }
                if(el.hasClass('email-re')){
                    var first = form.find('.email').val();
                    if(el.val() !== first){
                        error = true;
                        errorText += el.prev('span').text().toLowerCase();
                        return false;
                    }
                }
            });

            if(error){
                dialog.show(me._getLocalization('check-form-error-huom'), errorText);
                dialog.fadeout();
            }

            return error;
        },

        /**
         * [validateEmail email checker]
         * @param  {[string]} email [Users email]
         * @return {[none]}
         */
        validateEmail: function (email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this;

            me._initTemplates();
            me.container = me._templates.main.clone(true);

            return me.container;
        },
        createBasket: function(){
            var me = this;
            var template = jQuery(
                '<div class="download-basket__component">'+
                    '<div class="download-basket__component-title">'+
                        '<div class="download-basket__component-layer-name"></div>'+
                        '<div class="icon-close-dark download-basket__component-title-close"></div>'+
                        '<div class="download-basket__component-title-clear"></div>'+
                    '</div>'+
                        '<div class="download-basket__component-content">'+
                            '<p class="basket__content-cropping"><strong></strong><span></span></p>'+
                            '<p class="basket__content-license"><strong></strong><a target="_blank"></a></p>'+
                        '</div>'+
                '</div>');
            if(me._selected.length > 0) {
                var el = me.container;
                var buttons = el.find('.oskari__download-basket-buttons');
                // Change basket to visible
                el.find('.oskari__download-basket-wrapper').find('.empty-basket').hide();
                jQuery(el.find('input.empty')).show();
                jQuery(el.find('input.next')).show();
                jQuery(el.find('input.prev')).hide();
                jQuery(el.find('input.send')).hide();
                el.find('.oskari__download-basket-help').show();
                el.find('.download-basket__component').remove();

                el.find('.oskari__download-basket-user-info').hide();
                el.find('.oskari__download-basket-wrapper').show();

                me._selected.forEach(function(basketItem, index){
                    var basketEl = template.clone();
                    basketEl.attr('data-layer-name',basketItem.layerName);
                    basketEl.attr('data-layer-id',basketItem.layerUrl);
                    basketEl.attr('data-bbox-bottom',basketItem.bbox.bottom);
                    basketEl.attr('data-bbox-left',basketItem.bbox.left);
                    basketEl.attr('data-bbox-right',basketItem.bbox.right);
                    basketEl.attr('data-bbox-top',basketItem.bbox.top);
                    basketEl.attr('data-cropping-layer',basketItem.cropLayerName);
                    basketEl.attr('data-cropping-url',basketItem.cropLayerUrl);
                    basketEl.attr('data-cropping-mode',basketItem.cropMode);
                    basketEl.attr('data-index', index);
                    var identifiers = [];
                    var identifier = {
                        layerName: basketItem.cropLayerName,
                        uniqueColumn: basketItem.cropUniqueKey,
                        geometryColumn : basketItem.cropGeometryColumn,
                        geometryName : basketItem.cropGeometryName,
                        uniqueValue: basketItem.cropUniqueKeyValue
                    };
                    identifiers.push(identifier);

                    basketEl.attr("data-identifiers", JSON.stringify(identifiers));

                    basketEl.find('.download-basket__component-layer-name').text(basketItem.layerNameLang);
                    basketEl.find('.basket__content-cropping>strong').text(me._getLocalization('basket-cropping-layer-title'));
                    basketEl.find('.basket__content-cropping>span').text(basketItem.cropLayerNameLang);

                    // License link handling
                    var licenseTitle = basketEl.find('.basket__content-license>strong');
                    var licenseLink = basketEl.find('.basket__content-license>a');
                    if(me.instance.conf.licenseUrl) {
                        licenseTitle.text(me._getLocalization('basket-license-title'));
                        licenseLink.text(me._sandbox.getLocalizedProperty(me.instance.conf.licenseName) ||
                            me.instance.conf.licenseName ||
                            me._getLocalization('basket-license-name'));
                        licenseLink.attr('href',me._sandbox.getLocalizedProperty(me.instance.conf.licenseUrl) ||
                            me.instance.conf.licenseUrl);
                    } else {
                        licenseTitle.remove();
                        licenseLink.remove();
                    }

                    basketEl.find('.icon-close-dark').click(function(event){
                        var basketEl = jQuery(this).parents('.download-basket__component');
                        basketEl.remove();

                        if(el.find('.download-basket__component').length === 0){
                            el.find('.oskari__download-basket-wrapper').find('.empty-basket').show();
                            el.find('.oskari__download-basket-buttons').find('input.next').hide();
                            el.find('.oskari__download-basket-buttons').find('input.empty').hide();
                            me._selected = [];
                        }
                        var index = basketEl.attr('data-index');
                        me._selected.splice(index,1);
                        event.preventDefault();
                        me.instance.addBasketNotify();
                    });

                    el.find('.oskari__download-basket-wrapper').append(basketEl);

                    el.find('.oskari__download-basket').parents('.oskariTabs').find('li').not('.active').css({opacity: 0.2});
                    el.find('.oskari__download-basket').parents('.oskariTabs').find('li').not('.active').animate({opacity: 1}, 700 );
                });
            }
        },
        addToBasket: function(item){
            var me = this;
            me._selected.push(item);
        }

    }, {
        extend: ['Oskari.userinterface.component.TabPanel']
    }
);
