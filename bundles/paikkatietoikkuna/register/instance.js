/**
 * @class Oskari.mapframework.bundle.register.RegisterBundleInstance
 *
 * Links to registration, logging in and terms of use can be configured to oskari-ext.properties
 *
 * See Oskari.mapframework.bundle.register.RegisterBundleInstance for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.register.RegisterBundleInstance',
    function () {
        this.loc = this.getLocalization();
        this.loginContainerId = '#loginbar';
        this.wrapper = jQuery('<div></div>');
        this.registerInfo = jQuery('<div class="registerInfo"></div></br>');
        this.linkToTermsOfUse = jQuery('<div class="registerInfo2"></div>');
        this.loginbarTemplate = jQuery('<div class="registerLoginBar"></div>');
        this.loginTemplate = jQuery('<div class="registerLinks"><a id="loginLink">' + this.loc.login + '</a>' +
                                    " - " + '<a id="registerLink">' + this.loc.register + '</a></div>');
    },
    {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Register';
        },

        /**
         * @method startPlugin
         */
        afterStart: function () {
            var me = this;

            var conf = me.getConfiguration() || {};
            me.termsUrl = conf.termsUrl || '';
            me.registerUrl = conf.registerUrl || '';

            me.loginbar = me.loginbarTemplate.clone();
            me.loginbar.append(me.loginTemplate);

            me.loginContainer = jQuery(me.loginContainerId);
            me.loginContainer.append(me.loginbar);

            jQuery('#registerLink').click(function () {
                me.showRegisterPopup();
            });

            jQuery('#loginLink').click(function () {
                //TODO: go to login, and when user is logged in, change to loggedin mode
                me.changeLoggedInMode();
            });
        },

        /**
         * @method showSelectionTools
         * Handles tool button click -> opens selection tool dialog
         */
        showRegisterPopup: function () {
            var me = this,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                buttons = [];

            me.popupContent = me.wrapper.clone();

            registerInfo = me.registerInfo.clone();
            registerInfo.append(me.loc.popup.registerInfo);

            var linkInfo = me.linkToTermsOfUse.clone();
            var termsOfUseTemplate = jQuery('<a target="_blank" href=' + me.termsUrl + '>' + this.loc.popup.termsOfUseLink + '</a>');
            linkInfo.append(termsOfUseTemplate);
            linkInfo.prepend(me.loc.popup.registerInfo2);

            me.popupContent.append(registerInfo);
            me.popupContent.append(linkInfo);

            cancelBtn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.CancelButton'
            );

            cancelBtn.setId('oskari_paikkatietoikkuna_register_buttons_cancel');
            cancelBtn.setHandler(function () {
                popup.close(true);
            });
            buttons.push(cancelBtn);

            continueBtn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            continueBtn.addClass('primary');
            continueBtn.setId('oskari_paikkatietoikkuna_register_buttons_continue');
            continueBtn.setTitle(me.loc.popup.continueBtn);
            continueBtn.setHandler(function () {
                //TODO: open registration page
                window.open(me.registerUrl, '_blank');
                popup.close(true);
            });
            buttons.push(continueBtn);

            popup.addClass('oskari_paikkatietoikkuna_register_popup');
            popup.show(me.loc.popup.title, me.popupContent, buttons);
            popup.makeModal();
        },

        changeLoggedInMode: function () {
            var me = this,
                user = Oskari.user().getName();

            $('.registerLinks').detach();

            me.loggedInTemplate = jQuery('<div class="loggedIn">' + user + '</br><a id="logoutLink">' + this.loc.logout + '</a></div>');
            me.loginbar.append(me.loggedInTemplate);
            jQuery('#logoutLink').click(function () {
                $('.loggedIn').detach();
                me.loginbar.append(me.loginTemplate);
            });
        }
    },
    {
        /**
         * @property {String[]} extend
         * @static
         */
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    });