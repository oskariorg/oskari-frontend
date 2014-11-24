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
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.ok : 'OK');
        this.setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);