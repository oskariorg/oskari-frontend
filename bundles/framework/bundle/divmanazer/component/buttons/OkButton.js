/**
 * @class Oskari.userinterface.component.buttons.OkButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.OkButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.setTitle(Oskari.getLocalization('DivManazer').buttons.ok);
        this.setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);