/**
 * @class Oskari.asdi.login.Flyout
 *
 * This shows a login flyout.
 *
 */
Oskari.clazz.define('Oskari.asdi.login.Flyout',
    /**
     * @static @method create called automatically on construction
     * Always extend this class, never use as is.
     *
     * @param {Object} instance
     * @param {Object} locale
     *
     */
    function (instance, locale) {
        this.instance = instance;
        this.locale = locale;
        this._templates = {
            backgroundShade: jQuery('<div class="asdiLoginFlyoutBackground"></div>'),
            content: jQuery(
                '<form action="/j_security_check" method="post" accept-charset="UTF-8">'+
                '<div style="margin:auto;">'+
                '   <div class="asdiLoginInputField">'+
                '       <input size="46" id="username" name="j_username" type="text" placeholder="" autofocus="" required="">'+
                '   </div>'+
                '   <div class="asdiLoginInputField">'+
                '       <input size="46" id="password" name="j_password" type="password" placeholder="" autofocus="" required="">'+
                '   </div>'+
                '   <div class="floatright">'+
                '       <input type="reset" id="cancel" value="" class="oskari-formcomponent oskari-button">'+
                '       <input type="submit" id="submit" value="" class="oskari-button oskari-formcomponent primary">'+
                '   </div>'+
                '   <div class="asdiLoginInputField">'+
                '      <a href="/user/reset">' + locale.passwdreset + '</a>'+
                '   </div>' +
                '</div>'+
                '</form>'
                )
        }
    }, {
        getName: function () {
            return 'Oskari.asdi.login.Flyout';
        },
        startPlugin: function () {
            var me = this,
                el = me.getEl(),
                template = this._templates.content.clone(),
                username = template.find('#username'),
                password = template.find('#password'),
                submit = template.find('#submit'),
                cancel = template.find('#cancel');

            username.attr("placeholder",this.locale.username);
            password.attr("placeholder",this.locale.password);
            submit.val(this.locale.login);

            cancel.val(this.locale.cancel);
            cancel.on('click', function() {
                me.close();
            });

            el.append(template);
        },
        onOpen: function() {
            var me = this,
                shade = me._templates.backgroundShade.clone(),
                flyoutContainer = me.getEl().parent().parent(),
                shadeZIndex = parseInt(flyoutContainer.css('z-index')) - 1;
            var containerWidth = jQuery(flyoutContainer).width(),
                containerHeight = jQuery(flyoutContainer).height(),
                windowWidth = jQuery(window).width(),
                windowHeight = jQuery(window).height();


            var left = ((parseInt(windowWidth) / 2) - (parseInt(containerWidth) / 2));
            var top = ((parseInt(windowHeight) / 2) - (parseInt(containerHeight) / 2));
            flyoutContainer.css('min-width','400px');
            flyoutContainer.css('left', left+'px');
            flyoutContainer.css('top', top+'px');

            //above everything else but just under the login flyout
            shade.css('z-index', shadeZIndex);
            jQuery('body').append(shade);
        },
        onClose: function() {
            jQuery('body').find('.asdiLoginFlyoutBackground').remove();
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    }
);
