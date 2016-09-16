/**
 * @class Oskari.mapframework.core.Core.keyListenerMethods
 *
 * This category class adds key listener methods to Oskari core as they were in
 * the class itself.
 */
(function(Oskari) {
    var log = Oskari.log('Core');

    Oskari.clazz.category('Oskari.mapframework.core.Core', 'feature-key-listener-methods', {

        /**
         * @method handleCtrlKeyDownRequest
         * Sets flag to show that CTRL key is pressed down
         * @private
         */
        _handleCtrlKeyDownRequest: function () {
            log.warn("isCtrlKeyDown is deprecated");
            this._ctrlKeyDown = true;
        },
        /**
         * @method handleCtrlKeyUpRequest
         * Sets flag to show that CTRL key is released
         * @private
         */
        _handleCtrlKeyUpRequest: function () {
            log.warn("isCtrlKeyDown is deprecated");
            this._ctrlKeyDown = false;
        },
        /**
         * @method isCtrlKeyDown
         * Returns true if CTRL key is down
         * @return {Boolean} true if CTRL key is down
         */
        isCtrlKeyDown: function () {
            log.warn("isCtrlKeyDown is deprecated");
            return this._ctrlKeyDown;
        }
    });
}(Oskari));