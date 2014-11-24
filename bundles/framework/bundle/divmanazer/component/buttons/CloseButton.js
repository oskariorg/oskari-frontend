/**
 * @class Oskari.userinterface.component.buttons.CloseButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.CloseButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.close : 'Close');
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);