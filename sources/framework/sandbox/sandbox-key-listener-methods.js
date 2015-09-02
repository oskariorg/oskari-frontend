/**
 * @class Oskari.mapframework.sandbox.Sandbox.keyListenerMethods
 *
 * This category class adds key listener methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox', 'key-listener-methods', {

    /**
     * @method isCtrlKeyDown
     * Returns true if CTRL key is down
     * @return {Boolean} true if CTRL key is down
     */
    isCtrlKeyDown: function () {
    	this._core.printDebug("isCtrlKeyDown is deprecated");
        return this._core.isCtrlKeyDown();
    }
});