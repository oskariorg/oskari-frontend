Oskari.clazz.category(
    'Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance',
    'state-methods', {
    /**
     * @method setSessionExpiring
     * @param {Number} minutes session lenght in minutes
     */
    setSessionExpiring: function (minutes) {
        if (!minutes) return;

        var sandbox = this.getSandbox(),
            dialog = this._createNotificationDialog(minutes);

        sandbox.setSessionExpiring((minutes - 1), function () {
            dialog.show();
        });
    },
    /**
     * @method _createNotificationDialog
     * @private
     * @param  {Number} minutes
     * @return {Object}
     */
    _createNotificationDialog: function (minutes) {
        var me = this,
            loc = this.getLocalization('session'),
            sandbox = this.getSandbox(),
            popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            extendButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            extendButtonTitle = loc.expiring.extend,
            notifyTitle = loc.expiring.title,
            notifyMessage = loc.expiring.message,
            expiredTitle = loc.expired.title,
            expiredMessage = loc.expired.message,
            expireTimeout;

        notifyMessage = notifyMessage.replace('{extend}', ('"' + extendButtonTitle + '"'));

        extendButton.addClass('primary');
        extendButton.setTitle(extendButtonTitle);
        extendButton.setHandler(function () {
            sandbox.extendSession(function () {
                popup.show(expiredTitle, expiredMessage);
                popup.makeModal();
            });
            clearTimeout(expireTimeout);
            me.setSessionExpiring(minutes);
            popup.close(true);
        });

        return {
            show: function () {
                popup.show(notifyTitle, notifyMessage, [extendButton]);

                expireTimeout = setTimeout(function () {
                    popup.show(expiredTitle, expiredMessage);
                    popup.makeModal();
                }, 60 * 1000);
            }
        };
    }
});