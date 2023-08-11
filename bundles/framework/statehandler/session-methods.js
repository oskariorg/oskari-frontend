import { showSessionExpiredModal, showSessionExpiringPopup } from './SessionExpiringPopup';

Oskari.clazz.category(
    'Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance',
    'state-methods', {
    /**
     * @method setSessionExpiring
     * @param {Number} minutes session length in minutes
     */
        setSessionExpiring: function (minutes) {
            if (!minutes) return;
            const me = this;
            const sandbox = this.getSandbox();

            sandbox.setSessionExpiring((minutes - 1), function () {
                const popupController = showSessionExpiringPopup(minutes, () => {
                    document.querySelector("form[action='/logout']").submit();
                    popupController.close();
                }, () => {
                    // continue session
                    sandbox.extendSession(() => {
                        showSessionExpiredModal();
                    });
                    me.setSessionExpiring(minutes);
                    popupController.close();
                }, () => {
                    // just close without reloading (use when switching to modal)
                    popupController.close();
                });
            });
        },
        /**
         * @method resetSessionTimer
         * @param {Number} minutes session length in minutes
         */
        resetSessionTimer: function (minutes) {
            if (!minutes) return;

            // Clear old timer and set new one
            this.getSandbox().clearSessionTimer();
            this.setSessionExpiring(minutes);
        }
    });
