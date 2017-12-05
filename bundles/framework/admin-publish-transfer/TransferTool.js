Oskari.clazz.define('Oskari.mapframework.admin-publish-transfer.TransferTool',
function() {
    this.publisherInstance = null;
}, {
    getName: function() {
        return "Oskari.mapframework.admin-publish-transfer.TransferTool";
    },
    group: 'transfer',
    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool: function() {
        return {
            id: 'Oskari.mapframework.admin-publish-transfer.TransferTool',
            title: 'PublishTransfer',
            config: {}
        };
    },
    init: function(data, publisherInstance) {
        this.publisherInstance = publisherInstance;
        this.setEnabled(true);
    },
    /**
    * Get extra options.
    * @method getExtraOptions
    * @public
    *
    * @returns {Object} jQuery element
    */
    getExtraOptions: function() {
        var me = this;
        var element = jQuery('<div><a href="#">Open editor</a></div>');
        element.find('a').click(function(){
            var publishData = me.publisherInstance.publisher._gatherSelections();
            if(publishData) {
                me._showExportImportDialog(publishData);
            }
            return false;
        });
        return element;
    },
    _showExportImportDialog: function (publishData) {
        var me = this;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var buttons = [];

        var closeButton = dialog.createCloseButton();
        closeButton.setTitle('Cancel');
        buttons.push(closeButton);

        var content = jQuery('<div><h3>Copy/paste configuration below. Beware! Administrator feature,<br> do not edit the configuration text unless you are an expert.</h3><textarea style="width:600px;height:400px;"></textarea></div>');
        content.find('textarea').val(JSON.stringify(publishData, null, 2));

        var okButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
        okButton.setHandler(function () {
            var text = content.find('textarea').val();
            var input;
            try {
                input = JSON.parse(text);
            } catch (error) {
                me._showErrorDialog('Invalid JSON format!');
                return;
            }
            var delta = jsondiffpatch.diff(publishData, input);
            if(!delta) {
                me._showErrorDialog('No changes! Nothing to review.');
                return;
            }
            me._showConfirmationDialog(publishData, input, delta, dialog);
        });;
        okButton.setTitle('Review changes');
        buttons.push(okButton);
        
        dialog.makeModal();
        dialog.show('Transfer configuration', content, buttons);
    },
    _showConfirmationDialog: function (currentData, input, delta, editDialog) {
        var me = this;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var buttons = [];

        var closeButton = dialog.createCloseButton();
        closeButton.setTitle('Back');
        buttons.push(closeButton);

        var okButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
        okButton.setHandler(function () {
            dialog.close();
            editDialog.close();
            var uuid = me.publisherInstance.publisher.data.uuid;
            if(uuid) {
                input.uuid = uuid;
            }
            me.publisherInstance.publisher._editToolLayoutOff();
            me.publisherInstance.setPublishMode(false);
            me.publisherInstance.setPublishMode(true, me.publisherInstance.getLayersWithoutPublishRights(), input);
        });
        okButton.setTitle('Apply changes');
        buttons.push(okButton);
        var heading = '<h3>Are you sure? Removals in <span style="background-color:#ffbbbb;text-decoration:line-through;">red</span>, additions in <span style="background-color:#bbffbb">green</span>.</h3>';
        var content = jQuery(heading + jsondiffpatchformatters.html.format(delta, currentData));

        dialog.makeModal();
        dialog.show('Review changes', content, buttons);
    },
    _showErrorDialog: function (message) {
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var buttons = [dialog.createCloseButton()];
        
        var content = jQuery('<span>'+ message + '</span>');

        dialog.show('Error', content, buttons);
    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        return null;
    },
    setEnabled: function(enabled) {
    	this.state.enabled = (enabled === true) ? true : false;
    },
    stop: function() {
    	this.setEnabled(false);
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});