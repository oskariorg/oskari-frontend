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
        this.setTitle(Oskari.getLocalization('DivManazer').buttons.close);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);