/**
 * TabPanel that show layer import.
 * @param  {Object} locale [description]
 * @param  {Oskari.admin.bundle.admin.GenericAdminBundleInstance} parent reference to instance to get sandbox etc
 */
Oskari.clazz.define('Oskari.admin.bundle.admin.LayersImport', function(locale, parent) {
    this.instance = parent;
    this.locale = locale;
    this.sandbox = parent.sandbox;
    this.setTitle(locale.title);
    this.setContent(this.createUI());
    this._popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
}, {
    templates: {
        tabContent: jQuery('<div><div class="description"></div><div class="text"></div><div class="import"></div></div>'),
        successMessage: jQuery('<div class="message">' +
/*                    '   <div>'+this._localization.success.description+'</div>'+
                    '   <div class="response_data">'+
                    '       <ul>'+
                    '           <li><b>'+this._localization.success.viewId+'</b>: <span class="view-id"></span></li>'+
                    '           <li><b>'+this._localization.success.viewUuid+'</b>: <span class="view-uuid"></span></li>'+
                    '           <li><b>'+this._localization.success.viewUrl+'</b>: <a target="_blank"></a></li>'+
                    '       </ul>'+
                    '   </div>'+*/
                    '</div>')
    },
    /**
     * Create the UI for this tab panel
     * @return {jQuery} returns the created DOM
     */
    createUI: function() {
        var me = this;
        var content = me.templates.tabContent.clone();
        var description = content.find('.description');
        description.text(me.locale.description);

        me._jsonInput = Oskari.clazz.create('Oskari.userinterface.component.TextAreaInput');
        me._jsonInput.setName('json');
        me._jsonInput.setPlaceholder(me.locale.textAreaPlaceholder);
        me._jsonInput.setValue('');
        me._jsonInput.insertTo(content.find('.text'));

        me._importBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        me._importBtn.addClass('primary');
        me._importBtn.setTitle(me.locale.importButtonText);
        me._importBtn.setHandler(function() {
            me.importJSON();
        });
        me._importBtn.insertTo(content.find('.import'));

        return content;
    },
    importJSON: function() {
        var me = this;
        me._popup.close(true);

        var value =  me._jsonInput.getValue();
        if(value==='') {
            me._popup.show(me.locale.error.title, me.locale.error.checkValue);
            me._popup.fadeout();
            return;
        }

        var parsed = null;

        // test parse json
        try{
            parsed = JSON.parse(value);
        } catch(e) {
            me._popup.show(me.locale.error.title, me.locale.error.checkValue);
            me._popup.fadeout();
            return;
        }

        me._importBtn.setEnabled(false);

        jQuery.ajax({
            type : 'POST',
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            url : me.sandbox.getAjaxUrl('Layers'),
            data : JSON.stringify(parsed),
            error : function() {
                me._popup.show(me.locale.error.title, me.locale.error.importError);
                me._popup.fadeout();
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
                me._popup.show(me.locale.success.title, message, [btn]);
                me._importBtn.setEnabled(true);
                me._jsonInput.setValue('');
            }
        });
    }

}, {
    extend: ['Oskari.userinterface.component.TabPanel']
});