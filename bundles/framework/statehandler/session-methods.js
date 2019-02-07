Oskari.clazz.category(
    'Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance',
    'state-methods', {
    /**
     * @method setSessionExpiring
     * @param {Number} minutes session lenght in minutes
     */
        setSessionExpiring: function (minutes) {
            if (!minutes) return;

            var sandbox = this.getSandbox();
            var dialog = this._createNotificationDialog(minutes);

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
            var me = this;
            var locale = Oskari.getMsg.bind(null, 'StateHandler');
            var sandbox = this.getSandbox();
            var popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var extendButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            var logoutButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            var extendButtonTitle = locale('session.expiring.extend');
            var logoutButtonMessage = locale('session.expiring.logout');
            var notifyTitle = locale('session.expiring.title');
            var notifyMessage = locale('session.expiring.message', {extend: '"' + extendButtonTitle + '"'});
            var expiredTitle = locale('session.expired.title');
            var expiredMessage = locale('session.expired.message');
            var expireTimeout;

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
            logoutButton.setTitle(logoutButtonMessage);
            logoutButton.setHandler(function () {
                jQuery('#loginbar').find("form[action='/logout']").submit();
            });

            return {
                show: function () {
                    const expireIn = 60; // Expire time in seconds
                    popup.show(notifyTitle, notifyMessage + '<br />' + locale('session.expiring.expires', {expires: expireIn}), [logoutButton, extendButton]);
                    // Using Date for more accurate countdown (instead of just using setTimeout or setInterval)
                    const start = Date.now();
                    let diff;
                    let seconds;
                    function timer () {
                        diff = expireIn - (((Date.now() - start) / 1000) | 0);
                        seconds = (diff % 60) | 0;
                        seconds = seconds < 10 ? 0 + seconds : seconds;
                        if (seconds === 0) {
                            clearInterval(interval);
                            popup.show(expiredTitle, expiredMessage);
                            popup.makeModal();
                            if (Oskari.user().isLoggedIn()) {
                                jQuery('#loginbar').find("form[action='/logout']").submit();
                            } else {
                                location.reload();
                            }
                        } else {
                            popup.setContent(notifyMessage + '<br />' + locale('session.expiring.expires', {expires: seconds}));
                        }
                    }
                    let interval = setInterval(timer, 1000);
                }
            };
        }
    });
