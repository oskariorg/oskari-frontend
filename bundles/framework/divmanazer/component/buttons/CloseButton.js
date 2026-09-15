/**
 * @class Oskari.userinterface.component.buttons.CloseButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.CloseButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this.setTitle(Oskari.getMsg('DivManazer', 'buttons.close', null, 'Close'));
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);
