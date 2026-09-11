/**
 * @class Oskari.userinterface.component.buttons.EditButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.EditButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this.setTitle(Oskari.getMsg('DivManazer', 'buttons.edit', null, 'Edit'));
        this.setPrimary(true);
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);
