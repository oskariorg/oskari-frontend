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
                                    ' - ' + '<a id="registerLink">' + this.loc.register + '</a></div>');
        this.loggedInTemplate = jQuery('<div class="loggedIn">' + Oskari.user().getName() + '</br>' +
            '<form action="/logout" method="POST"><input type="hidden" name="_csrf" value=""/></form>' +
            '<a href="/logout">' + this.loc.logout + '</a></div>');
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
            me.registerUrl = conf.registerUrl || 'https://omatili.maanmittauslaitos.fi/user/new/paikkatietoikkuna?lang=' + Oskari.getLang();
            me.loginUrl = conf.loginUrl || '/auth';

            me.loginbar = me.loginbarTemplate.clone();
            me.loginContainer = jQuery(me.loginContainerId);
            if (Oskari.user().isLoggedIn()) {
                var logoutForm = me.loggedInTemplate.find('form');
                logoutForm.find('input').val(Oskari.app.getXSRFToken());
                me.loggedInTemplate.find('a').click(function (e) {
                    e.stopPropagation();
                    logoutForm.submit();
                    return false;
                });
                me.loginbar.append(me.loggedInTemplate);
            } else {
                me.loginbar.append(me.loginTemplate);
                me.loginbar.find('#loginLink').attr('href', me.loginUrl);
                me.loginbar.find('#registerLink').click(function () {
                    me.showRegisterPopup();
                });
            }

            me.loginContainer.append(me.loginbar);
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
            var termsOfUseTemplate = jQuery('<a target="_blank" href=' + me.loc.popup.termsOfUseLink + '>' + me.loc.popup.termsOfUseLinkText + '</a>');
            var dataProtectionTemplate = jQuery('<a target="_blank" href=' + me.loc.popup.dataProtectionLink + '>' + me.loc.popup.dataProtectionLinkText + '</a>');
            linkInfo.append(termsOfUseTemplate);
            linkInfo.append('</br>');
            linkInfo.append(dataProtectionTemplate);
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
                window.open(me.registerUrl, '_blank');
                popup.close(true);
            });
            buttons.push(continueBtn);

            popup.addClass('oskari_paikkatietoikkuna_register_popup');
            popup.show(me.loc.popup.title, me.popupContent, buttons);
            popup.makeModal();
        }
    },
    {
        /**
         * @property {String[]} extend
         * @static
         */
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    });
