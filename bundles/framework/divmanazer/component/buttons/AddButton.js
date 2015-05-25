/**
 * @class Oskari.userinterface.component.buttons.AddButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.AddButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.add : 'Add');
        this.setPrimary(true);
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);