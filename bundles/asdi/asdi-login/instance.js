/**
 * @class Oskari.asdi.login.BundleInstance
 */
Oskari.clazz.define("Oskari.asdi.login.BundleInstance",
    function() {
        this.templates = {
            "loginButton": jQuery('<input id="loginbutton" type="submit" value="">')
        };
    }, {
        __name : 'asdi-login',
        getName : function () {
            return this.__name;
        },
        eventHandlers: {
        },
        /**
         * @method afterStart
         * implements BundleInstance protocol start methdod
         */
        afterStart: function() {
            var me = this;
            if (Oskari.user().isLoggedIn()) {
                // no need for login UI
                return;
            }
            // show login UI
            this.locale = Oskari.getLocalization(this.getName());
            this.flyout = this.getFlyout();

            var loginButton = this.templates.loginButton.clone();
            loginButton.val(this.locale.flyout.login)
            loginButton.on('click', function() {
                me.showLoginFlyout();
            });
            jQuery('#maptools').find('#login').append(loginButton);
        },
        showLoginFlyout: function() {
            Oskari.getSandbox().postRequestByName(
                'userinterface.UpdateExtensionRequest',[this, 'attach']
            );
        }
    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
    }
);
