/**
 * @class Oskari.userinterface.component.buttons.CancelButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.CancelButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.setTitle(Oskari.getLocalization('DivManazer').buttons.cancel);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);