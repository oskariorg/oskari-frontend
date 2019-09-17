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
        this.conf = instance.conf || {};
        this.instance = instance;
        this.template = jQuery('<div class="account"><table class="info oskari-grid"></table><div class="bottomlinks"></div></div>');
        this.fieldTemplate = jQuery('<tr class="dataField"><th class="label"></th><td class="value"></td></tr>');
        this.linkTemplate = jQuery('<span><a href=""></a>&nbsp; </span>');
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
            var me = this;
            var user = Oskari.user();
            var accountData = [{
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
            }];

            // main content
            var infoContainer = container.find('.info');
            accountData.forEach(function (data) {
                var fieldContainer = me.fieldTemplate.clone();
                fieldContainer.find('.label').html(data.label);
                fieldContainer.find('.value').html(data.value);
                infoContainer.append(fieldContainer);
            });

            // bottom links
            var bottomLinksContainer = container.find('div.bottomlinks');
            var changeInfoUrl = Oskari.getLocalized(me.conf.changeInfoUrl) || Oskari.urls.getLocation('profile');
            var bottomLinks = [];
            if (changeInfoUrl) {
                bottomLinks.push({
                    label: me.loc('tabs.account.changeInfo'),
                    href: changeInfoUrl
                });
            }
            bottomLinks.forEach(function (data) {
                var linkSpan = me.linkTemplate.clone();
                var link = linkSpan.find('a');
                link.attr('href', data.href);
                link.html(data.label);
                bottomLinksContainer.append(linkSpan);
            });

            // attach handler to possible external element if found on the page
            jQuery('#oskari-profile-link').on('click', function () {
                me.instance.openProfileTab();
                return false;
            });
        }
    });
