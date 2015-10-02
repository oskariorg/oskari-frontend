/**
 * @class Oskari.hsy.bundle.downloadBasket.Cropping
 *
 * Renders the "admin channels" flyout.
 *
 */
Oskari.clazz.define(
    'Oskari.hsy.bundle.downloadBasket.Basket',
    function (localization, parent) {
        this.instance = parent;
        this._sandbox = parent.getSandbox();
        this._localization = localization;
        this.templates = {};
        this.setTitle(localization.title);
        this.state = {};
        this._templates = {
            main: jQuery('<div class="oskari__download-basket"></div>'),
            basketWrapper : jQuery('<div class="oskari__download-basket-wrapper"></div>'),
            basketButtons : jQuery('<div class="oskari__download-basket-buttons"></div>'),
            basketUserInfo : jQuery('<div class="oskari__download-basket-user-info"></div>')
        };
        this.setContent(this.createUi());
    },{

        /**
         * @private @method _initTemplates, creates ui for cropping items
         *
         *
         */
        _initTemplates: function () {
            var me = this;
            
            //Wrapper
            me._templates.main.append(me._templates.basketWrapper);

            //Basket user info
           /*  me.templates.form.find('input,select').each(function (index) {
                var el = jQuery(this);
                el.prev('span').html(me._getLocalization(el.attr('name')));
                if(el.attr("language") != null){
                   el.attr("placeholder", me._getLocalization(el.attr("language")));
                }
            });*/
            me._templates.main.append(me._templates.basketUserInfo);

            //Basket wizard buttons
            var prev = Oskari.clazz.create('Oskari.userinterface.component.Button');
            prev.addClass('primary prev');
            prev.setTitle(me._getLocalization('basket-prev'));
            prev.setHandler(function() {
                alert('Alert');
            });
            prev.insertTo(me._templates.basketButtons);

            var next = Oskari.clazz.create('Oskari.userinterface.component.Button');
            next.addClass('primary next');
            next.setTitle(me._getLocalization('basket-next'));
            next.setHandler(function() {
                alert('Alert');
            });
            next.insertTo(me._templates.basketButtons);

            var send = Oskari.clazz.create('Oskari.userinterface.component.Button');
            send.addClass('approve send');
            send.setTitle(me._getLocalization('basket-send'));
            send.setHandler(function() {
                alert('Alert');
            });
            send.insertTo(me._templates.basketButtons);

            me._templates.main.append(me._templates.basketButtons);

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
