/**
 * @class Oskari.userinterface.component.buttons.DeleteButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.DeleteButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this.setTitle(Oskari.getMsg('DivManazer', 'buttons.delete', null, 'Delete'));
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);
