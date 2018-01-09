/**
 * @class Oskari.admin.bundle.appsetup.AppSetupAdminBundleInstance
 *
 * Appsetup bundle for admins. Allows import appsetup jsons.
 */
Oskari.clazz.define("Oskari.admin.bundle.appsetup.AppSetupAdminBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this._localization = this.getLocalization();
        this._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        this._templates = {
            tabContent: jQuery('<div><div class="appsetup__description"></div><div class="appsetup__textarea"></div><div class="appsetup__button"></div></div>'),
            successMessage: jQuery('<div class="appsetup__message">'+
                        '   <div>'+this._localization.success.description+'</div>'+
                        '   <div class="response_data">'+
                        '       <ul>'+
                        '           <li><b>'+this._localization.success.viewId+'</b>: <span class="view-id"></span></li>'+
                        '           <li><b>'+this._localization.success.viewUuid+'</b>: <span class="view-uuid"></span></li>'+
                        '           <li><b>'+this._localization.success.viewUrl+'</b>: <a target="_blank"></a></li>'+
                        '       </ul>'+
                        '   </div>'+
                        '</div>')
        };
    }, {
        getName : function() {
            return "AdminAppSetup";
        },
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        start : function() {
            var me = this;
            var sandbox = Oskari.getSandbox();
            sandbox.register(this);
            me.sandbox = sandbox;

            var content = me._templates.tabContent.clone();
            var description = content.find('.appsetup__description');
            var currentViewUrl = me.sandbox.getAjaxUrl('Views') + '&uuid=' + Oskari.app.getUuid();
            description.html('<div>' + me._localization.description.fillJSON + ' ' +
                '(<a href="' + currentViewUrl + '" target="_blank">' + me._localization.description.current + '</a>).</div>' +
                '<div>' + this._localization.description.differentUuid + '</div>'
                );
            me._jsonInput = Oskari.clazz.create('Oskari.userinterface.component.TextAreaInput');
            me._jsonInput.setName('json');
            me._jsonInput.setPlaceholder(me._localization.textAreaPlaceholder);
            me._jsonInput.setValue('');
            me._jsonInput.insertTo(content.find('.appsetup__textarea'));

            me._importBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me._importBtn.addClass('primary');
            me._importBtn.setTitle(me._localization.importButtonText);
            me._importBtn.setHandler(function() {
                me.importJSON();
            });
            me._importBtn.insertTo(content.find('.appsetup__button'));

            var reqBuilder = sandbox.getRequestBuilder('Admin.AddTabRequest');
            if(reqBuilder) {
                var request = reqBuilder(me._localization.title, content, 3, 'appsetup');
                sandbox.request(this, request);
            }
        },
        importJSON: function() {
            var me = this;
            me._popup.close(true);

            var value =  me._jsonInput.getValue();
            if(value==='') {
                me._popup.show(me._localization.error.title, me._localization.error.checkValue);
                me._popup.fadeout(5000);
                return;
            }

            var parsed = null;

            // test parse json
            try{
                parsed = JSON.parse(value);
            } catch(e) {
                me._popup.show(me._localization.error.title, me._localization.error.checkValue);
                me._popup.fadeout(5000);
                return;
            }

            me._importBtn.setEnabled(false);

            jQuery.ajax({
                type : 'POST',
                dataType   : 'json',
                contentType: 'application/json; charset=UTF-8',
                url : me.sandbox.getAjaxUrl('Views'),
                data : JSON.stringify(parsed),
                error : function() {
                    me._popup.show(me._localization.error.title, me._localization.error.importError);
                    me._popup.fadeout(5000);
                    me._importBtn.setEnabled(true);
                },
                success : function(response) {
                    var btn = me._popup.createCloseButton(me._localization.ok);
                    btn.addClass('primary');
                    var message = me._templates.successMessage.clone();
                    message.find('span.view-id').html(response.id);
                    message.find('span.view-uuid').html(response.uuid);
                    message.find('a').html(response.url);
                    message.find('a').attr('href',response.url);
                    me._popup.show(me._localization.success.title, message, [btn]);
                    me._importBtn.setEnabled(true);
                    me._jsonInput.setValue('');
                }
            });
        },
        // module boilerplate methods
        init: function() {

        },
        stop : function() {

        },
        update : function() {

        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    });