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

    function (instance, localization) {
        this.conf = instance.conf;
        this.instance = instance;
        this.template = jQuery('<div class="account"><div class="info"></div><div class="bottomlinks"></div></div>');
        this.loc = localization;
    }, {
        getTitle: function () {
            return this.loc.title;
        },
        addTabContent: function (container) {
            var content = this.template.clone();
            container.append(content);
            this._createAccountTab(container);
        },

        _createAccountTab: function (container) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                fieldTemplate = jQuery('<div class="dataField"><div class="label"></div><div class="value"></div><br clear="all" /></div>'),
                user = sandbox.getUser(),
                localization = this.loc,
                accountData = [{
                    label: localization.firstName,
                    value: user.getFirstName()
                }, {
                    label: localization.lastName,
                    value: user.getLastName()
                }, {
                    label: localization.nickName,
                    value: user.getNickName()
                }, {
                    label: localization.email,
                    value: user.getLoginName()
                }],
                infoContainer = container.find('div.info'),
                i,
                data,
                fieldContainer,
                bottomLinks,
                bottomLinksContainer,
                link,
                changeInfoUrl = null;
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
                label: localization.changeInfo,
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