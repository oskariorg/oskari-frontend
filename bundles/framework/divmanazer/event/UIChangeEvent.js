/**
 * @class Oskari.userinterface.event.UIChangeEvent
 *
 * Used to notify about major UI changes where some functionalities should clean up/shutdown their own UI.
 * An example would be that statsgrid should be closed when publisher is opened -> Publisher sends this event, statsgrid reacts by closing itself.
 * @param {String} functionality some id for functionality that triggered the UI change
 */
Oskari.clazz.define('Oskari.userinterface.event.UIChangeEvent', function (functionality) {
    this.functionality = functionality;
}, {
    __name: "UIChangeEvent",
    getName: function () {
        return this.__name;
    },

    /**
     * @method returns functionality id which triggered the change
     */
    getFunctionality: function () {
        return this.functionality;
    }
}, {
    'protocol': ['Oskari.mapframework.event.Event']
});