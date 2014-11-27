/**
 * @class Oskari.userinterface.component.buttons.ExitButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.ExitButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.exit : 'Exit');
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);