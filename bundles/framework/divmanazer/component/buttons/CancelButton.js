/**
 * @class Oskari.userinterface.component.buttons.CancelButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.CancelButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.cancel : 'Cancel');
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);
