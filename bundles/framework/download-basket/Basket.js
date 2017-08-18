/**
 * @class Oskari.mapframework.bundle.downloadBasket.Cropping
 *
 * Renders the "admin channels" flyout.
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
                var el = jQuery(this);
                el.prev('span').html(me._getLocalization(el.attr('name')));
            });

            //Basket wizard buttons
            var empty = Oskari.clazz.create('Oskari.userinterface.component.Button');
            empty.addClass('primary empty');
            empty.setTitle(me._getLocalization('basket-empty'));
            jQuery(empty.getElement()).click(function (event) {
                jQuery('.download-basket__component').remove();
                jQuery('.oskari__download-basket-wrapper').find('.empty-basket').show();
                jQuery('.oskari__download-basket-buttons').find('input.empty').hide();
                jQuery('.oskari__download-basket-buttons').find('input.next').hide();
                jQuery('.cropping-btn.selected').trigger('click');
                me.instance.addBasketNotify();
            });
            empty.insertTo(me._templates.basketButtons);

            var prev = Oskari.clazz.create('Oskari.userinterface.component.Button');
            prev.addClass('primary prev');
            prev.setTitle(me._getLocalization('basket-prev'));
            jQuery(prev.getElement()).click(function (event) {
                jQuery('.oskari__download-basket-buttons').find('input.empty').show();
                jQuery('.oskari__download-basket-buttons').find('input.next').show();
                jQuery('.oskari__download-basket-wrapper').show();
                jQuery('.oskari__download-basket-buttons').find('input.prev').hide();
                jQuery('.oskari__download-basket-buttons').find('input.send').hide();
                jQuery('.oskari__download-basket-user-info').hide();
            });
            prev.insertTo(me._templates.basketButtons);

            var next = Oskari.clazz.create('Oskari.userinterface.component.Button');
            next.addClass('primary next');
            next.setTitle(me._getLocalization('basket-next'));
            jQuery(next.getElement()).click(function (event) {
                jQuery('.oskari__download-basket-buttons').find('input.empty').hide();
                jQuery('.oskari__download-basket-buttons').find('input.next').hide();
                jQuery('.oskari__download-basket-wrapper').hide();
                jQuery('.oskari__download-basket-buttons').find('input.prev').show();
                jQuery('.oskari__download-basket-buttons').find('input.send').show();
                jQuery('.oskari__download-basket-user-info').show();
            });
            next.insertTo(me._templates.basketButtons);

            var send = Oskari.clazz.create('Oskari.userinterface.component.Button');
            send.addClass('approve send');
            send.setTitle(me._getLocalization('basket-send'));
            jQuery(send.getElement()).click(function (event) {
                if(!me.validateUserInputs(jQuery('.oskari__download-basket-user-info').find('form'))){
                    me.loadBasketItem();
                }
            });
            send.insertTo(me._templates.basketButtons);

            me._templates.main.append(me._templates.basketButtons);
            me._templates.basketButtons.find('input').hide();

        },

        /**
         * [loadBasketItem sends Ajax to download user selections]
         * @return {[none]}
         */
        loadBasketItem: function(){
            var me = this;
            var downloadDetails = [];
            jQuery('.oskari__download-basket-buttons').find('input.send').attr("disabled",true);

            jQuery('.download-basket__component').each(function(){
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
                    wmsUrl: parent.attr('data-layer-wmsurl'),
                    identifiers: parent.attr('data-identifiers')
                };

                downloadDetails.push(details);

            });
            var strDownloadDetails = JSON.stringify(downloadDetails);

            var userDetails = {
                    email: jQuery('.oskari__download-basket-user-info').find('input.email').val()
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
                            jQuery('.oskari__download-basket-buttons').find('input.send').attr("disabled",false);
                            jQuery('.oskari__download-basket-user-info').find('input').val('');
                            jQuery('.oskari__download-basket-buttons').find('input.prev').trigger('click');
                            jQuery('.oskari__download-basket-buttons').find('input.empty').trigger('click');
                            jQuery('.oskari__download-basket').parents('.oskari-flyoutcontentcontainer').find('.tabsItem>li>a').eq(0).trigger('click');
                            jQuery('.cropping-btn.selected').trigger('click');
                            dialog.close();
                        });
                        btn.addClass('primary');
                        dialog.show(me._getLocalization('basket-thank-you'), me._getLocalization('basket-email-will-be'), [btn]);
                    }else{
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
                url : ajaxUrl + 'action_route=DownloadAll'
            });

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
        }

    }, {
        extend: ['Oskari.userinterface.component.TabPanel']
    }
);
