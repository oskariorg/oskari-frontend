/**
 * @class Oskari.admin.bundle.admin.GenericAdminBundleInstance
 *
 * Generic bundle for admins
 */
Oskari.clazz.define("Oskari.admin.bundle.admin.GenericAdminBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._dialog = null;
    }, {
        /**
         * Shows message dialog. Closes any previous dialog.
         * @param  {String} title    [description]
         * @param  {String|jQuery} content  [description]
         * @param  {[Oskari.userinterface.component.Button]} buttons  [description]
         * @param  {Object} location where to show dialog - should have keys 'target' for selector and 'align' for alignment around target
         */
        showMessage: function(title, content, buttons, location) {
            this.closeDialog();
            this._dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this._dialog.show(title, content, buttons);
            if(location) {
                this._dialog.moveTo(location.target, location.align);
            }
        },
        afterStart : function() {

            // register request handler
            this.getSandbox().addRequestHandler('Admin.AddTabRequest', this.getFlyout());
        },
        /**
         * Closes the message dialog if one is open
         */
        closeDialog : function() {
            if(this._dialog) {
                this._dialog.close(true);
                this._dialog = null;
            }
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method userinterface.ExtensionUpdatedEvent
             * Init flyout when it's opened
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    doOpen = event.getViewState() !== "close";
                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }
                if (doOpen) {
                    this.getFlyout().createUI();
                }
            }
        }
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });
