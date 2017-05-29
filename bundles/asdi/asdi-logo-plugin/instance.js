/**
 * @class Oskari.asdi.login.BundleInstance
 */
Oskari.clazz.define("Oskari.asdi.logo.BundleInstance",
    function() {
      this.dialog = null;
      this.data = null;
    }, {
        __name : 'asdi-logo-plugin',
        getName : function () {
            return this.__name;
        },

        start: function() {
          this.getAboutLinkContent();
          this.createLogoPlugin();
        },

        getAboutLinkContent: function() {
          var me = this;
          jQuery.ajax({
            url:Oskari.getSandbox().getAjaxUrl('GetArticlesByTag'),
            data: {
              tags: 'asdi-about'
            },
            success: function (response) {
              me.data = response;
            },
            error: function (jqXHR, textStatus) {
                if(typeof errorCb === 'function' && jqXHR.status !== 0) {
                    errorCb(jqXHR, textStatus);
                }
            }
          });
        },

        createLogoPlugin(response) {
          var me = this;
          var logoService = Oskari.getSandbox().getService('Oskari.map.LogoPluginService');
          var options = {
            id:'About',
            callback: function(event) {
              me.createAboutDialog(event);
            }
          }
          logoService.addLabel('About', options);
          logoService.trigger("change");
        },

        createAboutDialog(event) {
          var me = this;
          if(this.dialog) {
            this.dialog.close(true);
            this.dialog = null;
            return;
          }
          var content = jQuery('<div></div>');
          this.data.articles.forEach( function (article) {
            content.append(article.content.body);
          });
          var me = this;
          var popupTitle = 'About';
          var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

          var closeButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
          closeButton.setHandler(function () {
            me.dialog.close(true);
            me.dialog = null;
          });
          this.dialog = dialog;
          dialog.show(popupTitle, content, [closeButton]);
          dialog.moveTo(event.target, 'top');
        }

    }, {
        "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
    }
);
