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
        this.setTitle(Oskari.getLocalization('DivManazer').buttons.exit);
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);