Oskari.clazz.define('Oskari.mapframework.admin-publish-transfer.TransferTool',
    function () {
        this.publisherInstance = null;
        this.loc = Oskari.getMsg.bind(null, 'admin-publish-transfer');
    }, {
        getName: function () {
            return 'Oskari.mapframework.admin-publish-transfer.TransferTool';
        },
        group: 'transfer',
        /**
        * Get tool object.
        * @method getTool
        *
        * @returns {Object} tool description
        */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.admin-publish-transfer.TransferTool',
                title: 'PublishTransfer',
                config: {}
            };
        },
        /**
         * @method init
         * Called by publisher to init the tool
         */
        init: function (data, publisherInstance) {
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
        getExtraOptions: function () {
            var me = this;
            var element = jQuery('<div><a href="#">' + this.loc('openEditor') + '</a></div>');
            element.find('a').click(function () {
                var publishData = me.publisherInstance.publisher.gatherSelections();
                if (publishData) {
                    me._showExportImportDialog(publishData);
                }
                return false;
            });
            return element;
        },
        /**
         * @private @method _showExportImportDialog
         * Shows JSON editor dialog
         * @param {Object} publishData published map state data
         */
        _showExportImportDialog: function (publishData) {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var buttons = [];

            var closeButton = dialog.createCloseButton(this.loc('cancel'));
            buttons.push(closeButton);

            var content = jQuery('<div><h3>' + this.loc('beware') + '</h3><textarea style="width:600px;height:400px;"></textarea></div>');
            content.find('textarea').val(JSON.stringify(publishData, null, 2));

            var okButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
            okButton.setHandler(function () {
                var text = content.find('textarea').val();
                var input;
                try {
                    input = JSON.parse(text);
                } catch (error) {
                    me._showErrorDialog(me.loc('invalidJSON'));
                    return;
                }
                var delta = window.jsondiffpatch.diff(publishData, input);
                if (!delta) {
                    me._showErrorDialog(me.loc('noChange'));
                    return;
                }
                me._showConfirmationDialog(publishData, input, delta, function () { dialog.close(); });
            });
            okButton.setTitle(this.loc('review'));
            buttons.push(okButton);

            dialog.makeModal();
            dialog.show(this.loc('transfer'), content, buttons);
        },
        /**
         * @private @method _showConfirmationDialog
         * Shows dialog for reviewing changes in JSON
         * @param {Object} currentData current published map state
         * @param {Object} input user edited published map state
         * @param {Object} delta jsondiffpatch delta
         * @param {Function} closeParent function for closing parent dialog (JSON editor)
         */
        _showConfirmationDialog: function (currentData, input, delta, closeParent) {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var buttons = [];

            var closeButton = dialog.createCloseButton(this.loc('back'));
            buttons.push(closeButton);

            var okButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
            okButton.setHandler(function () {
                dialog.close();
                closeParent();
                var uuid = me.publisherInstance.publisher.data.uuid;
                if (uuid) {
                    input.uuid = uuid;
                }
                me.publisherInstance.publisher.cancel(); // closes publisher without saving
                setTimeout(function () { // give map time to return to normal mode
                    me.publisherInstance.setPublishMode(true, input);
                }, 500);
            });
            okButton.setTitle(this.loc('apply'));
            buttons.push(okButton);
            var heading = '<h3>' + this.loc('sure') + ' <span style="background-color:#ffbbbb;text-decoration:line-through;">' +
                this.loc('red') + '</span>, ' + this.loc('additions') + ' <span style="background-color:#bbffbb">' + this.loc('green') + '</span>.</h3>';
            var formatters = window.jsondiffpatch.formatters || window.jsondiffpatchformatters; // prod || dev
            var content = jQuery(heading + formatters.html.format(delta, currentData));

            dialog.makeModal();
            dialog.show(this.loc('review'), content, buttons);
        },
        /**
         * @private @method _showErrorDialog
         * Show error message to user
         * @param {String} message to show
         */
        _showErrorDialog: function (message) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var buttons = [dialog.createCloseButton()];

            var content = jQuery('<span>' + message + '</span>');

            dialog.show(this.loc('error'), content, buttons);
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
        setEnabled: function (enabled) {
            this.state.enabled = !!enabled;
        },
        stop: function () {
            this.setEnabled(false);
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
