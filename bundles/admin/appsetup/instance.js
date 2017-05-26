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
        this._locale = null;
        this._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    }, {
        getName : function() {
            return "AdminAppSetup";
        },
        getLocale: function () {
            return this._locale;
        },
        start : function() {
            var me = this;
            var sandbox = Oskari.getSandbox();
            sandbox.register(this);
            me.sandbox = sandbox;

            /* locale */
            me._locale = Oskari.getLocalization(me.getName());

            var content = jQuery('<div><div class="appsetup__textarea"></div><div class="appsetup__button"></div></div>');
            me._jsonInput = Oskari.clazz.create('Oskari.userinterface.component.TextAreaInput');
            me._jsonInput.setName('json');
            me._jsonInput.setPlaceholder(me._locale.textAreaPlaceholder);
            me._jsonInput.setValue('');
            me._jsonInput.insertTo(content.find('.appsetup__textarea'));

            me._importBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            // make visually "primary" button (blue)
            me._importBtn.addClass('primary');
            me._importBtn.setTitle(me._locale.importButtonText);
            me._importBtn.setHandler(function() {
                me.importJSON();
            });
            me._importBtn.insertTo(content.find('.appsetup__button'));

            var reqBuilder = sandbox.getRequestBuilder('Admin.AddTabRequest');
            if(reqBuilder) {
                var request = reqBuilder(me._locale.title, content, 3, 'appsetup');
                sandbox.request(this, request);
            }
        },
        importJSON: function() {
            var me = this;
            me._popup.close(true);

            var value =  me._jsonInput.getValue();
            if(value==='') {
                me._popup.show(me._locale.error.title, me._locale.error.checkValue);
                me._popup.fadeout(5000);
                return;
            }

            var parsed = null;

            // test parse json
            try{
                parsed = JSON.parse(value);
            } catch(e) {
                me._popup.show(me._locale.error.title, me._locale.error.checkValue);
                me._popup.fadeout(5000);
                return;
            }

            me._importBtn.setEnabled(false);

            jQuery.ajax({
                dataType : "json",
                type : "POST",
                url : me.sandbox.getAjaxUrl('Views'),
                data : {
                    data: JSON.stringify(parsed)
                },
                beforeSend: function(x) {
                    if(x && x.overrideMimeType) {
                        x.overrideMimeType('application/json');
                    }
                },
                error : function() {
                    me._popup.show(me._locale.error.title, me._locale.error.importError);
                    me._popup.fadeout(5000);
                    me._importBtn.setEnabled(true);
                },
                success : function(response) {
                    var btn = me._popup.createCloseButton(me._locale.ok);
                    btn.addClass('primary');
                    var message = jQuery('<div class="appsetup__message">'+
                        '   <div>'+me._locale.success.description+'</div>'+
                        '   <div class="response_data">'+
                        '       <ul>'+
                        '           <li><b>'+me._locale.success.viewId+'</b>: '+response.id+'</li>'+
                        '           <li><b>'+me._locale.success.viewUuid+'</b>: '+response.uuid+'</li>'+
                        '           <li><b>'+me._locale.success.viewUrl+'</b>: <a href="'+response.url+'" target="_blank">'+response.url+'</a></li>'+
                        '       </ul>'+
                        '   </div>'+
                        '</div>');
                    me._popup.show(me._locale.success.title, message, [btn]);
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