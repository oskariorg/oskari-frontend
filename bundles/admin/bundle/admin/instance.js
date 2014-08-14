/**
 * @class Oskari.admin.bundle.admin.GenericAdminBundleInstance
 *
 * Generic bundle for admins
 *
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
         * @method afterstart
         * implements BundleInstance protocol start methdod
         */
        "afterStart": function (sandbox) {

        },
        showMessage: function(title, content, buttons, location) {
            if(this._dialog) {
                this._dialog.close(true);
                this._dialog = null;
            }
            this._dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this._dialog.show(title, content, buttons);
            if(location) {
                this._dialog.moveTo(location.target, location.align);
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
