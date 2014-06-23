/**
 * @class Oskari.mapframework.bundle.printout.event.PrintCanceledEvent
 *
 * Used to notify components that the basic printout is canceled
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintCanceledEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function(state) {
    this._state = state;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "Printout.PrintCanceledEvent";
    },

    getState: function() {
        return this._state;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
