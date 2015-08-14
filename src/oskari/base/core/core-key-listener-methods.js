/**
 * @class Oskari.mapframework.core.Core.keyListenerMethods
 *
 * This category class adds key listener methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'feature-key-listener-methods', {
    
    /**
     * @method handleCtrlKeyDownRequest
     * Sets flag to show that CTRL key is pressed down
     * @private
     */
    _handleCtrlKeyDownRequest : function() {
        this._ctrlKeyDown = true;
    },
    /**
     * @method handleCtrlKeyUpRequest
     * Sets flag to show that CTRL key is released
     * @private
     */
    _handleCtrlKeyUpRequest : function() {
        this._ctrlKeyDown = false;
    },
    /**
     * @method isCtrlKeyDown
     * Returns true if CTRL key is down
     * @return {Boolean} true if CTRL key is down
     */
    isCtrlKeyDown : function() {
        return this._ctrlKeyDown;
    }
});
