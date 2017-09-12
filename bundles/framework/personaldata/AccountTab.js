/**
 * @class Oskari.mapframework.bundle.personaldata.AccountTab
 * Renders the "personal data" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.AccountTab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
     *     reference to component that created the tile
     */

    function (instance) {
        this.conf = instance.conf;
        this.instance = instance;
        this.template = jQuery('<div class="account"><table class="info oskari-grid"></table><div class="bottomlinks"></div></div>');
        this.loc = Oskari.getMsg.bind(null, 'PersonalData');
    }, {
        getTitle: function () {
            return this.loc('tabs.account.title');
        },
        addTabContent: function (container) {
            var content = this.template.clone();
            container.append(content);
            this._createAccountTab(container);
        },

        _createAccountTab: function (container) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                fieldTemplate = jQuery('<tr class="dataField"><th class="label"></th><td class="value"></td></tr>'),
                user = Oskari.user(),
                profileLink = jQuery('#oskari-profile-link'),
                accountData = [{
                    label: me.loc('tabs.account.firstName'),
                    value: user.getFirstName()
                }, {
                    label: me.loc('tabs.account.lastName'),
                    value: user.getLastName()
                }, {
                    label: me.loc('tabs.account.nickName'),
                    value: user.getNickName()
                }, {
                    label: me.loc('tabs.account.email'),
                    value: user.getEmail()
                }],
                infoContainer = container.find('.info'),
                i,
                data,
                fieldContainer,
                bottomLinks,
                bottomLinksContainer,
                link,
                changeInfoUrl = null;

            profileLink.on('click', function() {
              me.instance.openProfileTab();
              return false;
            });

            for (i = 0; i < accountData.length; i += 1) {
                data = accountData[i];
                fieldContainer = fieldTemplate.clone();
                fieldContainer.find('.label').html(data.label);
                fieldContainer.find('.value').html(data.value);
                infoContainer.append(fieldContainer);
            }

            if (me.conf) {
                changeInfoUrl = sandbox.getLocalizedProperty(me.conf.changeInfoUrl);
            }

            bottomLinks = [{
                // FIXME get URL from bundle config
                label: me.loc('tabs.account.changeInfo'),
                href: changeInfoUrl
            }];
            bottomLinksContainer = container.find('div.bottomlinks');
            for (i = 0; i < bottomLinks.length; i += 1) {
                data = bottomLinks[i];
                if (data.href && data.label) {
                    link = jQuery('<a href="' + data.href + '">' + data.label + '</a>&nbsp; ');
                    bottomLinksContainer.append(link);
                }
            }

        }
});
