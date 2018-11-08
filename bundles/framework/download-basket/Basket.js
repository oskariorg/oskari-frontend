import jstsGeoJsonReader from 'jsts/org/locationtech/jts/io/GeoJsonReader';
const geoJsonReader = new jstsGeoJsonReader();

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
            basketWrapper: jQuery('<div class="oskari__download-basket-wrapper"><p class="empty-basket"></p></div>'),
            basketButtons: jQuery('<div class="oskari__download-basket-buttons"></div>'),
            basketUserInfo: jQuery('<div class="oskari__download-basket-user-info"><p class="email-info"></p><div class="basket-form"></div><p><a target="_blank"></a></p></div>'),
            basketForm: jQuery(
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
    }, {
        /**
         * Creates ui for basket tab
         * @method createUi
         * @public
         */
        createUi: function () {
            var me = this;

            var main = me._templates.main.clone();
            var container = me.getContainer();

            // Wrapper
            var wrapper = me._templates.basketWrapper.clone();
            wrapper.find('.empty-basket').text(me._getLocalization('basket-is-empty'));
            main.append(wrapper);

            // Basket user info
            var basketUserInfo = me._templates.basketUserInfo.clone();
            var basketForm = me._templates.basketForm.clone();
            basketUserInfo.find('div.basket-form').append(basketForm);
            basketUserInfo.find('p.email-info').text(me._getLocalization('insert-email-for-download'));

            // check privacy policy url
            var privacyPolicyUrl = me._sandbox.getLocalizedProperty(me.instance.conf.privacyPolicyUrl) || me.instance.conf.privacyPolicyUrl;
            if (privacyPolicyUrl) {
                basketUserInfo.find('a').text(me._getLocalization('privacy-policy')).attr('href', privacyPolicyUrl);
            } else {
                basketUserInfo.find('a').remove();
            }

            main.append(basketUserInfo);
            basketUserInfo.hide();

            basketUserInfo.find('input,select').each(function () {
                var curEl = jQuery(this);
                curEl.prev('span').html(me._getLocalization(curEl.attr('name')));
            });

            // Basket wizard buttons
            var basketButtons = me._templates.basketButtons.clone();

            me.emptyBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me.prevBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me.nextBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me.sendBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            me.emptyBtn.addClass('approve empty');
            me.emptyBtn.setTitle(me._getLocalization('basket-empty'));
            me.emptyBtn.setHandler(function () {
                container.find('.download-basket__component').remove();
                container.find('.empty-basket').show();
                me._selected = [];
                me.instance.addBasketNotify();

                me._buttonsVisible({
                    empty: false,
                    next: false,
                    prev: false,
                    send: false
                });
            });
            me.emptyBtn.insertTo(basketButtons);

            me.prevBtn.addClass('approve prev');
            me.prevBtn.setTitle(me._getLocalization('basket-prev'));
            me.prevBtn.setHandler(function () {
                container.find('.oskari__download-basket-wrapper').show();
                container.find('.oskari__download-basket-user-info').hide();

                me._buttonsVisible({
                    empty: true,
                    next: true,
                    prev: false,
                    send: false
                });
                me.removePopup();
            });
            me.prevBtn.insertTo(basketButtons);

            me.nextBtn.addClass('primary next');
            me.nextBtn.setTitle(me._getLocalization('basket-next'));

            me.nextBtn.setHandler(function () {
                container.find('.oskari__download-basket-wrapper').hide();
                container.find('.oskari__download-basket-user-info').show();

                me._buttonsVisible({
                    empty: false,
                    next: false,
                    prev: true,
                    send: true
                });
            });
            me.nextBtn.insertTo(basketButtons);

            me.sendBtn.addClass('primary send');
            me.sendBtn.setTitle(me._getLocalization('basket-send'));
            me.sendBtn.setHandler(function () {
                if (!me.validateUserInputs(container.find('.oskari__download-basket-user-info').find('form'))) {
                    me.loadBasketItem();
                }
            });
            me.sendBtn.insertTo(basketButtons);

            main.append(basketButtons);

            me._buttonsVisible({
                empty: false,
                next: false,
                prev: false,
                send: false
            });

            me.container = main;
            this.setContent(me.container);
        },

        /**
         * Toggle buttons visibilities
         * @method  _buttonsVisible
         * @param   {Object}       visibilities buttons visibilities
         * @private
         */
        _buttonsVisible: function (visibilities) {
            var me = this;

            if (visibilities.empty) {
                me.emptyBtn.setVisible(true);
            } else {
                me.emptyBtn.setVisible(false);
            }

            if (visibilities.next) {
                me.nextBtn.setVisible(true);
            } else {
                me.nextBtn.setVisible(false);
            }

            if (visibilities.prev) {
                me.prevBtn.setVisible(true);
            } else {
                me.prevBtn.setVisible(false);
            }

            if (visibilities.send) {
                me.sendBtn.setVisible(true);
            } else {
                me.sendBtn.setVisible(false);
            }
        },

        /**
         * Gather download details
         * @method gatherDownloadDetails
         * @return {Object}              download details
         */
        gatherDownloadDetails: function () {
            var details = [];

            var container = this.getContainer();

            container.find('.download-basket__component').each(function () {
                var basketComponent = jQuery(this);
                var detail = {
                    croppingMode: basketComponent.attr('data-cropping-mode'),
                    layer: basketComponent.attr('data-layer-name'),
                    bbox: {
                        left: basketComponent.attr('data-bbox-left'),
                        bottom: basketComponent.attr('data-bbox-bottom'),
                        right: basketComponent.attr('data-bbox-right'),
                        top: basketComponent.attr('data-bbox-top')
                    },
                    croppingLayer: basketComponent.attr('data-cropping-layer'),
                    id: basketComponent.attr('data-layer-id'),
                    identifiers: basketComponent.attr('data-identifiers')
                };
                details.push(detail);
            });
            return JSON.stringify(details);
        },

        /**
         * Send ajax download message to server
         * @method loadBasketItem
         * @public
         */
        loadBasketItem: function () {
            var me = this;
            var downloadDetails = me.gatherDownloadDetails();

            var userDetails = {
                email: this.getContainer().find('.oskari__download-basket-user-info').find('input.email').val()
            };
            var strUserDetails = JSON.stringify(userDetails);
            me.sendBtn.setEnabled(false);

            jQuery.ajax({
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/json;charset=UTF-8');
                    }
                },
                success: function (resp) {
                    if (resp.success) {
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        var btn = dialog.createCloseButton('OK');
                        var container = me.getContainer();
                        btn.setHandler(function () {
                            container.find('.oskari__download-basket-wrapper').show();
                            container.find('.oskari__download-basket-user-info').hide();

                            container.find('.download-basket__component').remove();
                            container.find('.empty-basket').show();
                            me._selected = [];
                            me.instance.addBasketNotify();

                            me._buttonsVisible({
                                empty: false,
                                next: false,
                                prev: false,
                                send: false
                            });
                            container.find('.oskari__download-basket').parents('.oskari-flyoutcontentcontainer').find('.tabsItem>li>a').eq(0).trigger('click');
                            container.find('.cropping-btn.selected').trigger('click');
                            dialog.close();
                            me.sendBtn.setEnabled(true);
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
                error: function (jqXHR, textStatus, errorThrown) {
                    var error = me._getErrorText(jqXHR, textStatus, errorThrown);

                    me._openPopup(
                        me._getLocalization('error-in-downloading'),
                        error
                    );
                },
                data: {
                    downloadDetails: downloadDetails,
                    lang: Oskari.getLang(),
                    userDetails: strUserDetails
                },
                type: 'POST',
                dataType: 'json',
                url: Oskari.urls.getRoute('DownloadInfo')
            });
        },

        /**
         * Open popup
         * @method  _openPopup
         * @param   {String}   title   title
         * @param   {String}   message message
         * @private
         */
        _openPopup: function (title, message) {
            var me = this;
            if (me._popup) {
                me._popup.close(true);
            } else {
                me._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            }
            me._popup.show(title, message);
            me._popup.fadeout();
        },

        /**
         * Gets localization
         * @method  _getLocalization
         * @param   {String}         key loacalization key
         * @return  {String}         localized text
         * @private
         */
        _getLocalization: function (key) {
            return this._localization[key];
        },

        /**
         * Gets error text
         * @method  _getErrorText
         * @param   {Object}      jqXHR       jqxhr
         * @param   {String}      textStatus  status text
         * @param   {Object}      errorThrown error
         * @return  {String}                  error text
         * @private
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
         * Validates user input
         * @method validateUserInputs
         * @public
         * @param  {Object}           form jQuery form object
         * @return {Boolean}                has error
         */
        validateUserInputs: function (form) {
            var me = this;
            if (!me._errorPopup) {
                me._errorPopup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            } else {
                me._errorPopup.close(true);
            }
            var errorText = me._getLocalization('check-form-error');
            var error = false;

            form.find('input').each(function () {
                var el = jQuery(this);
                if (el.hasClass('email')) {
                    if (!me.validateEmail(el.val())) {
                        error = true;
                        return false;
                    }
                }
                if (el.hasClass('email-re')) {
                    var first = form.find('.email').val();
                    if (el.val() !== first) {
                        error = true;
                        return false;
                    }
                }
            });

            if (error) {
                me._errorPopup.show(null, errorText);
                me._errorPopup.moveTo(me.sendBtn.getElement(), 'bottom');
                form.find('input').addClass('error');
            } else {
                form.find('input').removeClass('error');
            }

            return error;
        },

        /**
         * Removes error popup
         * @method removePopup
         * @public
         */
        removePopup: function () {
            if (this._errorPopup) {
                this._errorPopup.close(true);
            }
        },

        /**
         * Valitades email address
         * @method validateEmail
         * @public
         * @param  {String}      email valitaded email address
         * @return {Boolean}     is email valid
         */
        validateEmail: function (email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        },

        /**
         * Creates basket
         * @method createBasket
         * @public
         */
        createBasket: function () {
            var me = this;
            var template = jQuery(
                '<div class="download-basket__component">' +
                    '<div class="download-basket__component-title">' +
                        '<div class="download-basket__component-layer-name"></div>' +
                        '<div class="icon-close-dark download-basket__component-title-close"></div>' +
                        '<div class="download-basket__component-title-clear"></div>' +
                    '</div>' +
                        '<div class="download-basket__component-content">' +
                            '<p class="basket__content-cropping"><strong></strong><span></span></p>' +
                            '<p class="basket__content-license"><strong></strong><a target="_blank"></a></p>' +
                        '</div>' +
                '</div>');

            if (me._selected.length > 0) {
                var el = jQuery(me.container);

                // Change basket to visible
                el.find('.oskari__download-basket-wrapper').find('.empty-basket').hide();

                me._buttonsVisible({
                    empty: true,
                    next: true,
                    prev: false,
                    send: false
                });

                el.find('.oskari__download-basket-help').show();
                el.find('.download-basket__component').remove();

                el.find('.oskari__download-basket-user-info').hide();
                el.find('.oskari__download-basket-wrapper').show();

                me._selected.forEach(function (basketItem, index) {
                    var feature = basketItem.feature;

                    var basketEl = template.clone();
                    basketEl.attr('data-layer-name', basketItem.layerName);
                    basketEl.attr('data-layer-id', basketItem.layerId);
                    var parsed = geoJsonReader.read(feature);
                    var bbox = parsed.geometry.getEnvelope().getCoordinates();

                    basketEl.attr('data-bbox-left', bbox[0].x);
                    basketEl.attr('data-bbox-bottom', bbox[0].y);
                    basketEl.attr('data-bbox-right', bbox[2].x);
                    basketEl.attr('data-bbox-top', bbox[2].y);

                    basketEl.attr('data-cropping-layer', feature.properties.layerName);
                    basketEl.attr('data-cropping-layer-id', feature.properties.layerId);
                    basketEl.attr('data-cropping-mode', feature.properties.croppingMode);
                    basketEl.attr('data-index', index);
                    var identifiers = [];
                    var identifier = {
                        layerName: feature.properties.layerName,
                        uniqueColumn: feature.properties.uniqueKey,
                        geometryColumn: feature.properties.geometryColumn,
                        geometryName: feature.properties.geometryName,
                        uniqueValue: feature.properties[feature.properties.uniqueKey]

                    };
                    identifiers.push(identifier);
                    basketEl.attr('data-identifiers', JSON.stringify(identifiers));

                    basketEl.find('.download-basket__component-layer-name').text(basketItem.layerNameLang);
                    basketEl.find('.basket__content-cropping>strong').text(me._getLocalization('basket-cropping-layer-title'));
                    basketEl.find('.basket__content-cropping>span').text(feature.properties.layerNameLang);

                    // License link handling
                    var licenseTitle = basketEl.find('.basket__content-license>strong');
                    var licenseLink = basketEl.find('.basket__content-license>a');

                    var layerId = basketItem.layerId;

                    if (me.instance.conf.licenseByLayers && me.instance.conf.licenseByLayers[layerId]) {
                        licenseTitle.text(me._getLocalization('basket-license-title'));
                        licenseLink.text(me._sandbox.getLocalizedProperty(me.instance.conf.licenseByLayers[layerId].licenseName) ||
                            me.instance.conf.licenseName ||
                            me._getLocalization('basket-license-name'));
                        licenseLink.attr('href', me._sandbox.getLocalizedProperty(me.instance.conf.licenseByLayers[layerId].licenseUrl) ||
                            me.instance.conf.licenseUrl);
                    } else if (me.instance.conf.licenseUrl) {
                        licenseTitle.text(me._getLocalization('basket-license-title'));
                        licenseLink.text(me._sandbox.getLocalizedProperty(me.instance.conf.licenseName) ||
                            me.instance.conf.licenseName ||
                            me._getLocalization('basket-license-name'));
                        licenseLink.attr('href', me._sandbox.getLocalizedProperty(me.instance.conf.licenseUrl) ||
                        me.instance.conf.licenseUrl);
                    } else {
                        licenseTitle.remove();
                        licenseLink.remove();
                    }

                    basketEl.find('.icon-close-dark').on('click', function (event) {
                        var basketEl = jQuery(this).parents('.download-basket__component');
                        basketEl.remove();

                        if (el.find('.download-basket__component').length === 0) {
                            el.find('.oskari__download-basket-wrapper').find('.empty-basket').show();
                            el.find('.oskari__download-basket-buttons').find('input.next').hide();
                            el.find('.oskari__download-basket-buttons').find('input.empty').hide();
                            me._selected = [];
                        }
                        var index = basketEl.attr('data-index');
                        me._selected.splice(index, 1);
                        event.preventDefault();
                        me.instance.addBasketNotify();
                    });

                    el.find('.oskari__download-basket-wrapper').append(basketEl);

                    el.find('.oskari__download-basket').parents('.oskariTabs').find('li').not('.active').css({opacity: 0.2});
                    el.find('.oskari__download-basket').parents('.oskariTabs').find('li').not('.active').animate({opacity: 1}, 700);
                });
            }
        },
        /**
         * Add to basket
         * @method addToBasket
         * @param  {Object}    item download detail onject:
         * {
         *     layerNameLang: 'localized layer name',
         *     layerName: 'layer name',
         *     layerId:  'layer id',
         *     feature: 'geojson feature object'
         * }
         */
        addToBasket: function (item) {
            var me = this;
            me._selected.push(item);
        }

    }, {
        extend: ['Oskari.userinterface.component.TabPanel']
    }
);
