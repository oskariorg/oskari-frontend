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
                logoutButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                extendButtonTitle = loc.expiring.extend,
                logoutButtonMessage = loc.expiring.logout,
                expiresInMessage = loc.expiring.expires,
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
            logoutButton.setTitle(logoutButtonMessage);
            logoutButton.setHandler(function () {
                jQuery('#loginbar').find("form[action='/logout']").submit();
            });

            return {
                show: function () {
                    const expireIn = 60; // Expire time in seconds
                    popup.show(notifyTitle, notifyMessage + '<br />' + expiresInMessage.replace('{expires}', (expireIn)), [logoutButton, extendButton]);
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
                            popup.setContent(notifyMessage + '<br />' + expiresInMessage.replace('{expires}', seconds));
                        }
                    }
                    let interval = setInterval(timer, 1000);
                }
            };
        }
    });
