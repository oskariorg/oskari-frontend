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
        this.setTitle(Oskari.getMsg('DivManazer', 'buttons.cancel', null, 'Cancel'));
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);
