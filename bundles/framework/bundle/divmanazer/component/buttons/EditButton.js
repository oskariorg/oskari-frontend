/**
 * @class Oskari.userinterface.component.buttons.EditButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.EditButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.edit : 'Edit');
        this.setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);